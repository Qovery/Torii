use std::sync::Arc;

use axum::{debug_handler, Extension, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::yaml_config::{CatalogYamlConfig, YamlConfig};

#[derive(Serialize, Deserialize)]
pub struct Response<T> {
    results: Vec<T>,
}

#[debug_handler]
pub async fn list_catalogs(
    Extension(yaml_config): Extension<Arc<YamlConfig>>
) -> (StatusCode, Json<Response<CatalogYamlConfig>>) {
    (StatusCode::OK, Json(Response { results: yaml_config.catalog.clone() }))
}

