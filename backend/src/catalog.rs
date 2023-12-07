use std::sync::Arc;

use axum::{debug_handler, Extension, Json};
use axum::extract::Path;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use tokio::process;
use tracing::debug;

use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig, YamlConfig};

#[derive(Serialize, Deserialize)]
pub struct ResultsResponse<T> {
    message: Option<String>,
    results: Vec<T>,
}

#[derive(Serialize, Deserialize)]
pub struct SimpleResponse {
    message: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ExecValidateScriptRequest {
    payload: serde_json::Value,
}

fn find_catalog_by_slug<'a>(catalogs: &'a Vec<CatalogYamlConfig>, catalog_slug: &str) -> Option<&'a CatalogYamlConfig> {
    catalogs.iter().find(|catalog| catalog.slug == catalog_slug)
}

fn find_catalog_service_by_slug<'a>(catalog: &'a CatalogYamlConfig, service_slug: &str) -> Option<&'a CatalogServiceYamlConfig> {
    catalog.services.as_ref().unwrap().iter().find(|service| service.slug == service_slug)
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

#[debug_handler]
pub async fn exec_catalog_service_validate_scripts(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
    Path((catalog_slug, service_slug)): Path<(String, String)>,
    Json(req): Json<ExecValidateScriptRequest>,
) -> (StatusCode, Json<SimpleResponse>) {
    let catalog = match find_catalog_by_slug(&yaml_config.catalogs, catalog_slug.as_str()) {
        Some(catalog) => catalog,
        None => return (StatusCode::NOT_FOUND, Json(SimpleResponse {
            message: Some(format!("Catalog '{}' not found", catalog_slug))
        }))
    };

    let service = match find_catalog_service_by_slug(catalog, service_slug.as_str()) {
        Some(service) => service,
        None => return (StatusCode::NOT_FOUND, Json(SimpleResponse {
            message: Some(format!("Service '{}' not found", service_slug))
        }))
    };

    for validate_script in service.validate_scripts.as_ref().unwrap() {
        let json_payload = serde_json::to_string(&req.payload).unwrap();

        debug!("executing validate script '{}' with payload '{}'", validate_script, json_payload);

        let output = process::Command::new("python3")
            .arg(validate_script)
            .arg(json_payload)
            .output()
            .await
            .unwrap();

        if !output.status.success() {
            return (StatusCode::BAD_REQUEST, Json(SimpleResponse {
                message: Some(format!("Validate script '{}' failed: {:?}", validate_script, String::from_utf8(output.stderr).unwrap_or("<no error output>".to_string())))
            }));
        }
    }

    (StatusCode::OK, Json(SimpleResponse { message: None }))
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use axum::{Extension, Json};
    use axum::extract::Path;
    use axum::http::StatusCode;

    use crate::catalog::{exec_catalog_service_validate_scripts, ExecValidateScriptRequest, find_catalog_by_slug, find_catalog_service_by_slug};
    use crate::yaml_config::{CatalogFieldYamlConfig, CatalogServiceYamlConfig, CatalogYamlConfig, YamlConfig};

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
                    validate_scripts: None,
                },
                CatalogServiceYamlConfig {
                    slug: "service-2".to_string(),
                    name: "Service 2".to_string(),
                    description: None,
                    fields: None,
                    validate_scripts: None,
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
                            validate_scripts: Some(vec![
                                "./examples/validation_script_ok.py".to_string(),
                            ]),
                        },
                    ]),
                },
            ],
        }
    }

    #[tokio::test]
    async fn test_exec_catalog_service_validate_scripts() {
        let yaml_config = Arc::from(get_yaml_config());

        let x = exec_catalog_service_validate_scripts(
            Extension(yaml_config),
            Path(("catalog-1".to_string(), "service-1".to_string())),
            Json(ExecValidateScriptRequest {
                payload: serde_json::json!({
                "field-1": "value-1",
                "field-2": "value-2",
            })
            }),
        ).await;

        assert_eq!(x.0, StatusCode::OK);
        assert_eq!(x.1.message, None);
    }
}
