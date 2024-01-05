use serde::{Deserialize, Serialize};
use sqlx::{Executor, Pool, Postgres};
use sqlx::types::Uuid;

use crate::errors::QError;

#[derive(sqlx::FromRow)]
pub struct CatalogExecutionStatus {
    id: Uuid,
    created_at: chrono::NaiveDateTime,
    updated_at: chrono::NaiveDateTime,
    status: Status,
    input_payload: serde_json::Value,
}

#[derive(sqlx::Type, Clone, Serialize, Deserialize, Debug)]
#[sqlx(rename_all = "SCREAMING_SNAKE_CASE")]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Status {
    // update schema.sql when adding new status
    Queued,
    Running,
    Success,
    Failure,
}

impl CatalogExecutionStatus {
    pub fn to_json(&self) -> CatalogExecutionStatusJson {
        CatalogExecutionStatusJson {
            id: self.id.to_string(),
            created_at: self.created_at.to_string(),
            updated_at: self.updated_at.to_string(),
            status: self.status.clone(),
            input_payload: self.input_payload.clone(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CatalogExecutionStatusJson {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub status: Status,
    pub input_payload: serde_json::Value,
}

/// Initialize the database by creating the tables
pub async fn init_database(pg_pool: &Pool<Postgres>) -> Result<(), QError> {
    // read SQL schema from file
    let sql_schema = include_str!("../db/schema.sql");

    // execute SQL schema
    let _ = pg_pool.execute(sql_schema).await?;

    Ok(())
}

pub async fn list_catalog_execution_statuses(pg_pool: &Pool<Postgres>) -> Result<Vec<CatalogExecutionStatus>, QError> {
    Ok(sqlx::query_as::<_, CatalogExecutionStatus>(
        r#"
            SELECT *
            FROM catalog_execution_statuses
        "#
    ).fetch_all(pg_pool).await?)
}
