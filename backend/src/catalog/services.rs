use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};
use tokio::sync::mpsc::Receiver;

use crate::catalog::{execute_command, ExecValidateScriptRequest, JobResults};
use crate::yaml_config::CatalogServiceYamlConfig;

#[derive(Serialize, Deserialize)]
pub struct BackgroundWorkerTask {
    pub catalog_slug: String,
    pub catalog_service_yaml_config: CatalogServiceYamlConfig,
    pub req: ExecValidateScriptRequest,
}

impl BackgroundWorkerTask {
    pub fn new(
        catalog_slug: String,
        catalog_service_yaml_config: CatalogServiceYamlConfig,
        req: ExecValidateScriptRequest,
    ) -> Self {
        Self {
            catalog_slug,
            catalog_service_yaml_config,
            req,
        }
    }
}

pub async fn background_worker(mut rx: Receiver<BackgroundWorkerTask>, pg_pool: Arc<Pool<Postgres>>) {
    while let Some(task) = rx.recv().await {
        let mut job_results = JobResults {
            user_fields_input: task.req.payload.clone(),
            results: vec![],
        };

        for cmd in task.catalog_service_yaml_config.post_validate.as_ref().unwrap_or(&vec![]) {
            let job_output_result = match execute_command(cmd, task.req.payload.to_string().as_str()).await {
                Ok(job_output_result) => job_output_result,
                Err(err) => todo!("{}", err) // TODO persist error in database
            };

            let _ = job_results.results.push(job_output_result);
        }

        println!("job_results: {:?}", job_results);

        // TODO persist results in database
    }
}
