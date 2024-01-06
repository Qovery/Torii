use std::str::FromStr;

use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};
use sqlx::types::Uuid;

use crate::errors::QError;

#[derive(sqlx::FromRow)]
pub struct CatalogExecutionStatus {
    id: Uuid,
    created_at: chrono::NaiveDateTime,
    updated_at: chrono::NaiveDateTime,
    catalog_slug: String,
    service_slug: String,
    status: Status,
    input_payload: serde_json::Value,
    tasks: serde_json::Value,
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
            catalog_slug: self.catalog_slug.clone(),
            service_slug: self.service_slug.clone(),
            status: self.status.clone(),
            input_payload: self.input_payload.clone(),
            tasks: self.tasks.clone(),
        }
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CatalogExecutionStatusJson {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub catalog_slug: String,
    pub service_slug: String,
    pub status: Status,
    pub input_payload: serde_json::Value,
    pub tasks: serde_json::Value,
}

pub async fn list_catalog_execution_statuses(
    pg_pool: &Pool<Postgres>,
    catalog_slug: &str,
    service_slug: &str,
) -> Result<Vec<CatalogExecutionStatus>, QError> {
    Ok(
        sqlx::query_as::<_, CatalogExecutionStatus>(
            r#"
            SELECT *
            FROM catalog_execution_statuses
            WHERE catalog_slug = $1 AND service_slug = $2
        "#
        )
            .bind(catalog_slug)
            .bind(service_slug)
            .fetch_all(pg_pool)
            .await?
    )
}

pub async fn insert_catalog_execution_status(
    pg_pool: &Pool<Postgres>,
    catalog_slug: &str,
    service_slug: &str,
    status: Status,
    input_payload: &serde_json::Value,
    tasks: &serde_json::Value,
) -> Result<CatalogExecutionStatus, QError> {
    Ok(
        sqlx::query_as::<_, CatalogExecutionStatus>(
            r#"
            INSERT INTO catalog_execution_statuses (catalog_slug, service_slug, status, input_payload, tasks)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        "#
        )
            .bind(catalog_slug)
            .bind(service_slug)
            .bind(status)
            .bind(input_payload)
            .bind(tasks)
            .fetch_one(pg_pool)
            .await?
    )
}

pub async fn update_catalog_execution_status(
    pg_pool: &Pool<Postgres>,
    id: &str,
    status: Status,
    tasks: &serde_json::Value,
) -> Result<CatalogExecutionStatus, QError> {
    Ok(
        sqlx::query_as::<_, CatalogExecutionStatus>(
            r#"
            UPDATE catalog_execution_statuses
            SET status = $1, tasks = $2
            WHERE id = $3
            RETURNING *
        "#
        )
            .bind(status)
            .bind(tasks)
            .bind(Uuid::from_str(id).unwrap())
            .fetch_one(pg_pool)
            .await?
    )
}
