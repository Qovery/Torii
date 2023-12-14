use std::sync::Arc;
use std::time::Duration;

use axum::{debug_handler, Extension, Json};
use axum::extract::Path;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use tokio::process;
use tokio::time::timeout;
use tracing::debug;

use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig, ExternalCommand, YamlConfig};

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
    pub slug: String,
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
    let r = match std::env::var("TORII_JSON_OUTPUT") {
        Ok(json_output) => JobOutputResult {
            slug: service_slug.to_string(),
            output: serde_json::from_str(json_output.as_str()).unwrap_or(serde_json::json!({})),
        },
        Err(_) => JobOutputResult {
            slug: service_slug.to_string(),
            output: serde_json::json!({}),
        }
    };

    // reset the environment variable
    std::env::set_var("TORII_JSON_OUTPUT", "{}");

    r
}

#[debug_handler]
pub async fn list_catalogs(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
) -> (StatusCode, Json<ResultsResponse<CatalogYamlConfig>>) {
    (StatusCode::OK, Json(ResultsResponse { message: None, results: yaml_config.catalogs.clone() }))
}

#[debug_handler]
pub async fn list_catalog_services(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
    Path(catalog_slug): Path<String>,
) -> (StatusCode, Json<ResultsResponse<CatalogServiceYamlConfig>>) {
    let catalog = match find_catalog_by_slug(&yaml_config.catalogs, catalog_slug.as_str()) {
        Some(catalog) => catalog,
        None => return (StatusCode::NOT_FOUND, Json(ResultsResponse {
            message: Some(format!("Catalog '{}' not found", catalog_slug)),
            results: vec![],
        }))
    };

    (StatusCode::OK, Json(ResultsResponse { message: None, results: catalog.services.clone().unwrap_or(vec![]) }))
}

async fn execute_command<'a, T>(
    service_slug: &'a str,
    external_command: &T,
    json_payload: &'a str,
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

    Ok(consume_job_output_result_from_json_output_env(service_slug))
}

fn get_catalog_and_service<'a>(
    yaml_config: &'a YamlConfig,
    catalog_slug: &'a str,
    service_slug: &'a str,
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

#[debug_handler]
pub async fn exec_catalog_service_validate_scripts(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
    Path((catalog_slug, service_slug)): Path<(String, String)>,
    Json(req): Json<ExecValidateScriptRequest>,
) -> (StatusCode, Json<JobResponse>) {
    let (_, service) = match get_catalog_and_service(&yaml_config, catalog_slug.as_str(), service_slug.as_str()) {
        Ok((catalog, service)) => (catalog, service),
        Err(err) => return err
    };

    let mut job_results = JobResults {
        user_fields_input: req.payload.clone(),
        results: vec![],
    };

    for v in service.validate.as_ref().unwrap_or(&vec![]) {
        let job_output_result = match execute_command(service_slug.as_str(), v, req.payload.to_string().as_str()).await {
            Ok(job_output_result) => job_output_result,
            Err(err) => return (StatusCode::BAD_REQUEST, Json(JobResponse {
                message: Some(err),
                results: None,
            }))
        };

        let _ = job_results.results.push(job_output_result);
    }

    (StatusCode::OK, Json(JobResponse { message: None, results: Some(job_results) }))
}

#[debug_handler]
pub async fn exec_catalog_service_post_validate_scripts(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
    Path((catalog_slug, service_slug)): Path<(String, String)>,
    Json(req): Json<ExecValidateScriptRequest>,
) -> (StatusCode, Json<JobResponse>) {
    let (_, service) = match get_catalog_and_service(&yaml_config, catalog_slug.as_str(), service_slug.as_str()) {
        Ok((catalog, service)) => (catalog, service),
        Err(err) => return err
    };

    let mut job_results = JobResults {
        user_fields_input: req.payload.clone(),
        results: vec![],
    };

    for v in service.post_validate.as_ref().unwrap_or(&vec![]) {
        let job_output_result = match execute_command(service_slug.as_str(), v, req.payload.to_string().as_str()).await {
            Ok(job_output_result) => job_output_result,
            Err(err) => return (StatusCode::BAD_REQUEST, Json(JobResponse {
                message: Some(err),
                results: None,
            }))
        };

        let _ = job_results.results.push(job_output_result);
    }

    // TODO output_model

    (StatusCode::OK, Json(JobResponse { message: None, results: Some(job_results) }))
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use axum::{Extension, Json};
    use axum::extract::Path;
    use axum::http::StatusCode;

    use crate::catalog::{exec_catalog_service_validate_scripts, ExecValidateScriptRequest, find_catalog_by_slug, find_catalog_service_by_slug};
    use crate::yaml_config::{CatalogFieldYamlConfig, CatalogServicePostValidateYamlConfig, CatalogServiceValidateYamlConfig, CatalogServiceYamlConfig, CatalogYamlConfig, YamlConfig};

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
                    fields: None,
                    validate: None,
                    post_validate: None,
                },
                CatalogServiceYamlConfig {
                    slug: "service-2".to_string(),
                    name: "Service 2".to_string(),
                    description: None,
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

    fn get_yaml_config() -> YamlConfig {
        YamlConfig {
            catalogs: vec![
                CatalogYamlConfig {
                    slug: "catalog-1".to_string(),
                    name: "Catalog 1".to_string(),
                    description: None,
                    services: Some(vec![
                        CatalogServiceYamlConfig {
                            slug: "service-1".to_string(),
                            name: "Service 1".to_string(),
                            description: None,
                            fields: Some(vec![
                                CatalogFieldYamlConfig {
                                    slug: "field-1".to_string(),
                                    title: "Field 1".to_string(),
                                    description: None,
                                    placeholder: None,
                                    type_: "string".to_string(),
                                    default: None,
                                    required: Some(true),
                                    autocomplete_fetcher: None,
                                },
                                CatalogFieldYamlConfig {
                                    slug: "field-2".to_string(),
                                    title: "Field 2".to_string(),
                                    description: None,
                                    placeholder: None,
                                    type_: "string".to_string(),
                                    default: None,
                                    required: None,
                                    autocomplete_fetcher: None,
                                },
                            ]),
                            validate: Some(vec![
                                CatalogServiceValidateYamlConfig {
                                    timeout: None,
                                    command: vec![
                                        "python3".to_string(),
                                        "examples/validation_script_ok.py".to_string(),
                                    ],
                                },
                            ]),
                            post_validate: Some(vec![
                                CatalogServicePostValidateYamlConfig {
                                    timeout: None,
                                    command: vec![
                                        "python3".to_string(),
                                        "examples/validation_script_ok.py".to_string(),
                                    ],
                                    output_model: None,
                                },
                            ]),
                        },
                    ]),
                },
            ],
        }
    }

    #[tokio::test]
    async fn test_exec_catalog_service_validate_scripts_ok() {
        let yaml_config = Arc::from(get_yaml_config());

        let (status_code, job_response) = exec_catalog_service_validate_scripts(
            Extension(yaml_config),
            Path(("catalog-1".to_string(), "service-1".to_string())),
            Json(ExecValidateScriptRequest {
                payload: serde_json::json!({
                "field-1": "value-1",
                "field-2": "value-2",
            })
            }),
        ).await;

        assert_eq!(status_code, StatusCode::OK);
        assert_eq!(job_response.message, None);

        assert_eq!(job_response.results.as_ref().unwrap().results.len() > 0, true);
    }

    #[tokio::test]
    async fn test_exec_catalog_service_validate_scripts_ko() {
        let mut yaml_config = get_yaml_config();

        // add a failing validation script
        yaml_config.catalogs[0].services.as_mut().unwrap()[0].validate.as_mut().unwrap().push(CatalogServiceValidateYamlConfig {
            timeout: None,
            command: vec![
                "python3".to_string(),
                "examples/validation_script_ko.py".to_string(),
            ],
        });

        let (status_code, job_response) = exec_catalog_service_validate_scripts(
            Extension(Arc::from(yaml_config)),
            Path(("catalog-1".to_string(), "service-1".to_string())),
            Json(ExecValidateScriptRequest {
                payload: serde_json::json!({
                "field-1": "value-1",
                "field-2": "value-2",
            })
            }),
        ).await;

        assert_eq!(status_code, StatusCode::BAD_REQUEST);
        assert_eq!(job_response.message.as_ref().unwrap().is_empty(), false);
        assert_eq!(job_response.results.as_ref(), None);
    }

    #[tokio::test]
    async fn test_exec_catalog_service_validate_scripts_timeout() {
        // FIXME this test does not work because of tokio::test which is single threaded and does not allow to kill the child process
        // let mut yaml_config = get_yaml_config();
        //
        // // add a failing validation script
        // yaml_config.catalogs[0].services.as_mut().unwrap()[0].validate.as_mut().unwrap().push(CatalogServiceValidateYamlConfig {
        //     timeout: Some(1), // 1 second
        //     command: vec![
        //         "python3".to_string(),
        //         "examples/validation_script_ok.py".to_string(), // this is > 1 second
        //     ],
        // });
        //
        // let x = exec_catalog_service_validate_scripts(
        //     Extension(Arc::from(yaml_config)),
        //     Path(("catalog-1".to_string(), "service-1".to_string())),
        //     Json(ExecValidateScriptRequest {
        //         payload: serde_json::json!({
        //         "field-1": "value-1",
        //         "field-2": "value-2",
        //     })
        //     }),
        // ).await;
        //
        // assert_eq!(x.0, StatusCode::INTERNAL_SERVER_ERROR);
        // assert_eq!(x.1.message.as_ref().unwrap().is_empty(), false);
    }
}
