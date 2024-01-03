use crate::errors::QError::PostgresError;

#[derive(Debug)]
pub enum QError {
    PostgresError(tokio_postgres::Error),
}

impl From<tokio_postgres::Error> for QError {
    fn from(pg_error: tokio_postgres::Error) -> Self {
        PostgresError(pg_error)
    }
}
