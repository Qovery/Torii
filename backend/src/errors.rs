use crate::errors::QError::PostgresError;

#[derive(Debug)]
pub enum QError {
    PostgresError(sqlx::Error),
}

impl From<sqlx::Error> for QError {
    fn from(err: sqlx::Error) -> Self {
        PostgresError(err)
    }
}
