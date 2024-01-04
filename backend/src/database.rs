use sqlx::{Executor, Pool, Postgres};

use crate::errors::QError;

/// Initialize the database by creating the tables
pub async fn init_database(pg_pool: &Pool<Postgres>) -> Result<(), QError> {
    // read SQL schema from file
    let sql_schema = include_str!("../db/schema.sql");

    // execute SQL schema
    let _ = pg_pool.execute(sql_schema).await?;

    Ok(())
}
