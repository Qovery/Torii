use std::sync::Arc;

use axum::{debug_handler, Extension, Json};
use axum::extract::Path;
use axum::http::StatusCode;
use tokio::sync::mpsc::Sender;
use tracing::error;

use crate::catalog::{check_json_payload_against_yaml_config_fields, execute_command, ExecValidateScriptRequest, find_catalog_by_slug, get_catalog_and_service, JobResponse, ResultsResponse};
use crate::catalog::services::BackgroundWorkerTask;
use crate::database;
use crate::database::{CatalogRunJson, insert_catalog_run, Status};
use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig, YamlConfig};

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

#[debug_handler]
pub async fn list_catalog_runs_by_catalog_and_service_slugs(
    Extension(pg_pool): Extension<Arc<sqlx::PgPool>>,
    Path((catalog_slug, service_slug)): Path<(String, String)>,
) -> (StatusCode, Json<ResultsResponse<CatalogRunJson>>) {
    match database::list_catalog_runs_by_catalog_and_service_slugs(&pg_pool, &catalog_slug, &service_slug).await {
        Ok(catalog_execution_statuses) => {
            (StatusCode::OK, Json(ResultsResponse { message: None, results: catalog_execution_statuses.iter().map(|x| x.to_json()).collect() }))
        }
        Err(err) => {
            error!("failed to list catalog execution statuses: {:?}", err);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ResultsResponse { message: Some(err.to_string()), results: vec![] }))
        }
    }
}

#[debug_handler]
pub async fn list_catalog_runs_by_catalog_slug(
    Extension(pg_pool): Extension<Arc<sqlx::PgPool>>,
    Path(catalog_slug): Path<String>,
) -> (StatusCode, Json<ResultsResponse<CatalogRunJson>>) {
    match database::list_catalog_runs_by_catalog_slug(&pg_pool, &catalog_slug).await {
        Ok(catalog_execution_statuses) => {
            (StatusCode::OK, Json(ResultsResponse { message: None, results: catalog_execution_statuses.iter().map(|x| x.to_json()).collect() }))
        }
        Err(err) => {
            error!("failed to list catalog execution statuses: {:?}", err);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ResultsResponse { message: Some(err.to_string()), results: vec![] }))
        }
    }
}

#[debug_handler]
pub async fn exec_catalog_service_validate_scripts(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
    Path((catalog_slug, service_slug)): Path<(String, String)>,
    Json(req): Json<ExecValidateScriptRequest>,
) -> (StatusCode, Json<JobResponse>) {
    let _ = match check_json_payload_against_yaml_config_fields(
        catalog_slug.as_str(),
        service_slug.as_str(),
        &req.payload,
        &yaml_config,
    ) {
        Ok(x) => x,
        Err(err) => return (StatusCode::BAD_REQUEST, Json(JobResponse {
            message: Some(err),
        }))
    };

    let (_, service) = match get_catalog_and_service(&yaml_config, catalog_slug.as_str(), service_slug.as_str()) {
        Ok((catalog, service)) => (catalog, service),
        Err(err) => return err
    };

    for cmd in service.validate.as_ref().unwrap_or(&vec![]) {
        let _ = match execute_command(cmd, req.payload.to_string().as_str()).await {
            Ok(_) => (),
            Err(err) => return (StatusCode::BAD_REQUEST, Json(JobResponse {
                message: Some(err),
            }))
        };
    }

    (StatusCode::OK, Json(JobResponse { message: None }))
}

#[debug_handler]
pub async fn exec_catalog_service_post_validate_scripts(
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
    Extension(tx): Extension<Sender<BackgroundWorkerTask>>,
    Extension(pg_pool): Extension<Arc<sqlx::PgPool>>,
    Path((catalog_slug, service_slug)): Path<(String, String)>,
    Json(req): Json<ExecValidateScriptRequest>,
) -> (StatusCode, Json<JobResponse>) {
    let _ = match check_json_payload_against_yaml_config_fields(
        catalog_slug.as_str(),
        service_slug.as_str(),
        &req.payload,
        &yaml_config,
    ) {
        Ok(x) => x,
        Err(err) => return (StatusCode::BAD_REQUEST, Json(JobResponse {
            message: Some(err),
        }))
    };

    let service = match get_catalog_and_service(&yaml_config, catalog_slug.as_str(), service_slug.as_str()) {
        Ok((_, service)) => service,
        Err(err) => return err
    };

    // execute validate scripts
    for cmd in service.validate.as_ref().unwrap_or(&vec![]) {
        let _ = match execute_command(cmd, req.payload.to_string().as_str()).await {
            Ok(_) => (),
            Err(err) => return (StatusCode::BAD_REQUEST, Json(JobResponse {
                message: Some(err),
            }))
        };
    }

    let ces = match insert_catalog_run(
        &pg_pool,
        &catalog_slug,
        &service_slug,
        Status::Queued,
        &req.payload,
        &serde_json::Value::Object(serde_json::Map::new()),
    ).await {
        Ok(ces) => ces,
        Err(err) => return (StatusCode::INTERNAL_SERVER_ERROR, Json(JobResponse {
            message: Some(err.to_string()),
        }))
    };

    // execute post validate scripts
    let _ = tx.send(BackgroundWorkerTask::new(
        ces.id(),
        service.clone(),
        req,
    )).await.unwrap_or_else(|err| {
        error!("failed to send task to background worker: {}", err);
        // TODO change catalog execution status to Failure
    });

    (StatusCode::NO_CONTENT, Json(JobResponse { message: Some("workflow executed".to_string()) }))
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use axum::{Extension, Json};
    use axum::extract::Path;
    use axum::http::StatusCode;

    use crate::catalog::controllers::exec_catalog_service_validate_scripts;
    use crate::catalog::ExecValidateScriptRequest;
    use crate::yaml_config::{CatalogFieldYamlConfig, CatalogServicePostValidateYamlConfig, CatalogServiceValidateYamlConfig, CatalogServiceYamlConfig, CatalogYamlConfig, YamlConfig};
    use crate::yaml_config::CatalogFieldType::Text;

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
                            icon: None,
                            fields: Some(vec![
                                CatalogFieldYamlConfig {
                                    slug: "field-1".to_string(),
                                    title: "Field 1".to_string(),
                                    description: None,
                                    placeholder: None,
                                    type_: Text,
                                    default: None,
                                    required: Some(true),
                                    autocomplete_fetcher: None,
                                },
                                CatalogFieldYamlConfig {
                                    slug: "field-2".to_string(),
                                    title: "Field 2".to_string(),
                                    description: None,
                                    placeholder: None,
                                    type_: Text,
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
