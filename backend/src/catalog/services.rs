use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};
use tokio::sync::mpsc::Receiver;
use tracing::error;

use crate::catalog::{execute_command, ExecValidateScriptRequest};
use crate::database::{Status, update_catalog_execution_status};
use crate::yaml_config::{CatalogServicePostValidateYamlConfig, CatalogServiceYamlConfig};

#[derive(Serialize, Deserialize)]
pub struct BackgroundWorkerTask {
    pub catalog_execution_status_id: String,
    pub catalog_service_yaml_config: CatalogServiceYamlConfig,
    pub req: ExecValidateScriptRequest,
}

impl BackgroundWorkerTask {
    pub fn new(
        catalog_execution_status_id: String,
        catalog_service_yaml_config: CatalogServiceYamlConfig,
        req: ExecValidateScriptRequest,
    ) -> Self {
        Self {
            catalog_execution_status_id,
            catalog_service_yaml_config,
            req,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TasksPayload {
    tasks: Vec<TaskPayload>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TaskPayload {
    status: Status,
    message: Option<String>,
    post_validate: CatalogServicePostValidateYamlConfig,
}

pub async fn background_worker(mut rx: Receiver<BackgroundWorkerTask>, pg_pool: Arc<Pool<Postgres>>) {
    while let Some(task) = rx.recv().await {
        let r = update_catalog_execution_status(
            &pg_pool,
            task.catalog_execution_status_id.as_str(),
            Status::Running,
            &serde_json::Value::Object(serde_json::Map::new()),
        ).await;

        if let Err(err) = r {
            error!("failed to update catalog execution status: {}", err);
            continue;
        }

        // TODO pass output from post_validate script to next post_validate script
        let mut tasks_payload = TasksPayload { tasks: vec![] };

        for cmd in task.catalog_service_yaml_config.post_validate.as_ref().unwrap_or(&vec![]) {
            let job_output_result = match execute_command(cmd, task.req.payload.to_string().as_str()).await {
                Ok(job_output_result) => job_output_result,
                Err(err) => {
                    let task_payload = TaskPayload {
                        status: Status::Failure,
                        message: Some(err.to_string()),
                        post_validate: cmd.clone(),
                    };

                    let _ = tasks_payload.tasks.push(task_payload);

                    let _ = update_catalog_execution_status(
                        &pg_pool,
                        task.catalog_execution_status_id.as_str(),
                        Status::Failure,
                        &serde_json::to_value(tasks_payload.clone()).unwrap(),
                    ).await;

                    break;
                }
            };

            let task_payload = TaskPayload {
                status: Status::Success,
                message: None,
                post_validate: cmd.clone(),
            };

            let _ = tasks_payload.tasks.push(task_payload);

            let _ = update_catalog_execution_status(
                &pg_pool,
                task.catalog_execution_status_id.as_str(),
                Status::Success,
                &serde_json::to_value(tasks_payload.clone()).unwrap(),
            ).await;
        }
    }
}
