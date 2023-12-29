use std::time::Duration;

use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use tokio::process;
use tokio::time::timeout;
use tracing::debug;

use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig, ExternalCommand, YamlConfig};

pub mod controllers;

#[derive(Serialize, Deserialize)]
pub struct ResultsResponse<T> {
    message: Option<String>,
    results: Vec<T>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct JobResponse {
    message: Option<String>,
    results: Option<JobResults>,
}

#[derive(Serialize, Deserialize)]
pub struct ExecValidateScriptRequest {
    payload: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct JobResults {
    pub user_fields_input: serde_json::Value,
    pub results: Vec<JobOutputResult>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct JobOutputResult {
    pub one_liner_command: String,
    pub output: serde_json::Value,
}

fn find_catalog_by_slug<'a>(catalogs: &'a Vec<CatalogYamlConfig>, catalog_slug: &str) -> Option<&'a CatalogYamlConfig> {
    catalogs.iter().find(|catalog| catalog.slug == catalog_slug)
}

fn find_catalog_service_by_slug<'a>(catalog: &'a CatalogYamlConfig, service_slug: &str) -> Option<&'a CatalogServiceYamlConfig> {
    catalog.services.as_ref().unwrap().iter().find(|service| service.slug == service_slug)
}

/// Extract the job output from the environment variable TORII_JSON_OUTPUT and reset it to an empty JSON object
fn consume_job_output_result_from_json_output_env(service_slug: &str) -> JobOutputResult {
    let job_output_result = match std::env::var("TORII_JSON_OUTPUT") {
        Ok(json_output) => JobOutputResult {
            one_liner_command: service_slug.to_string(),
            output: serde_json::from_str(json_output.as_str()).unwrap_or(serde_json::json!({})),
        },
        Err(_) => JobOutputResult {
            one_liner_command: service_slug.to_string(),
            output: serde_json::json!({}),
        }
    };

    // reset the environment variable
    std::env::set_var("TORII_JSON_OUTPUT", "{}");

    job_output_result
}

fn check_json_payload_against_yaml_config_fields(
    catalog_slug: &str,
    service_slug: &str,
    json_payload: &serde_json::Value,
    yaml_config: &YamlConfig,
) -> Result<(), String> {
    let catalog = match find_catalog_by_slug(&yaml_config.catalogs, catalog_slug) {
        Some(catalog) => catalog,
        None => return Err(format!("Catalog '{}' not found", catalog_slug))
    };

    let service = match find_catalog_service_by_slug(catalog, service_slug) {
        Some(service) => service,
        None => return Err(format!("Service '{}' not found", service_slug))
    };

    let fields = match service.fields.as_ref() {
        Some(fields) => fields,
        None => return Err(format!("Service '{}' has no fields", service_slug))
    };

    for field in fields {
        let field_value = match json_payload.get(field.slug.as_str()) {
            Some(field_value) => field_value,
            None => return Err(format!("Field '{}' not found in payload", field.slug))
        };

        if field.required.unwrap_or(false) && field_value.is_null() {
            return Err(format!("Field '{}' is required", field.slug));
        }
    }

    Ok(())
}

async fn execute_command<T>(
    external_command: &T,
    json_payload: &str,
) -> Result<JobOutputResult, String> where T: ExternalCommand {
    let cmd_one_line = external_command.get_command().join(" ");

    debug!("executing validate script '{}' with payload '{}'", &cmd_one_line, json_payload);

    if external_command.get_command().len() == 1 {
        return Err(format!("Validate script '{}' is invalid. \
                Be explicit on the command to execute, e.g. 'python3 examples/validation_script.py'",
                           external_command.get_command()[0]));
    }

    let mut cmd = process::Command::new(&external_command.get_command()[0]);

    for arg in external_command.get_command()[1..].iter() {
        cmd.arg(arg);
    }

    cmd.arg(json_payload);

    let mut child = match cmd.spawn() {
        Ok(child) => child,
        Err(err) => return Err(format!("Validate script '{}' failed: {}", &cmd_one_line, err))
    };

    let exit_status = match timeout(Duration::from_secs(external_command.get_timeout()), child.wait()).await {
        Ok(exit_status) => exit_status,
        Err(_) => return Err(match child.kill().await {
            Ok(_) => format!(
                "Validate script '{}' timed out after {} seconds",
                &cmd_one_line,
                external_command.get_timeout()
            ),
            Err(err) => format!(
                "Validate script '{}' timed out after {} seconds, but failed to kill the process: {}",
                &cmd_one_line, external_command.get_timeout(), err
            )
        })
    }.unwrap();

    if !exit_status.success() {
        return Err(format!("Validate script '{}' failed: {:?}", &cmd_one_line, exit_status));
    }

    // TODO parse output.stdout and output.stderr and forward to the frontend

    Ok(consume_job_output_result_from_json_output_env(cmd_one_line.as_str()))
}

fn get_catalog_and_service<'a>(
    yaml_config: &'a YamlConfig,
    catalog_slug: &str,
    service_slug: &str,
) -> Result<(&'a CatalogYamlConfig, &'a CatalogServiceYamlConfig), (StatusCode, Json<JobResponse>)> {
    let catalog = match find_catalog_by_slug(&yaml_config.catalogs, catalog_slug) {
        Some(catalog) => catalog,
        None => return Err((StatusCode::NOT_FOUND, Json(JobResponse {
            message: Some(format!("Catalog '{}' not found", catalog_slug)),
            results: None,
        })))
    };

    let service = match find_catalog_service_by_slug(catalog, service_slug) {
        Some(service) => service,
        None => return Err((StatusCode::NOT_FOUND, Json(JobResponse {
            message: Some(format!("Service '{}' not found", service_slug)),
            results: None,
        })))
    };

    Ok((catalog, service))
}


#[cfg(test)]
mod tests {
    use crate::catalog::{find_catalog_by_slug, find_catalog_service_by_slug};
    use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig};

    #[test]
    fn test_find_catalog_by_slug() {
        let catalogs = vec![
            CatalogYamlConfig {
                slug: "catalog-1".to_string(),
                name: "Catalog 1".to_string(),
                description: None,
                services: None,
            },
            CatalogYamlConfig {
                slug: "catalog-2".to_string(),
                name: "Catalog 2".to_string(),
                description: None,
                services: None,
            },
        ];

        assert_eq!(find_catalog_by_slug(&catalogs, "catalog-1"), Some(&catalogs[0]));
        assert_eq!(find_catalog_by_slug(&catalogs, "catalog-2"), Some(&catalogs[1]));
        assert_eq!(find_catalog_by_slug(&catalogs, "catalog-3"), None);
    }

    #[test]
    fn test_find_catalog_service_by_slug() {
        let catalog = CatalogYamlConfig {
            slug: "catalog-1".to_string(),
            name: "Catalog 1".to_string(),
            description: None,
            services: Some(vec![
                CatalogServiceYamlConfig {
                    slug: "service-1".to_string(),
                    name: "Service 1".to_string(),
                    description: None,
                    icon: None,
                    fields: None,
                    validate: None,
                    post_validate: None,
                },
                CatalogServiceYamlConfig {
                    slug: "service-2".to_string(),
                    name: "Service 2".to_string(),
                    description: None,
                    icon: None,
                    fields: None,
                    validate: None,
                    post_validate: None,
                },
            ]),
        };

        assert_eq!(find_catalog_service_by_slug(&catalog, "service-1"), Some(&catalog.services.as_ref().unwrap()[0]));
        assert_eq!(find_catalog_service_by_slug(&catalog, "service-2"), Some(&catalog.services.as_ref().unwrap()[1]));
        assert_eq!(find_catalog_service_by_slug(&catalog, "service-3"), None);
    }
}
