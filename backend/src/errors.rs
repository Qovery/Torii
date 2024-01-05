use std::fmt::Display;

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

impl Display for QError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PostgresError(err) => write!(f, "{}", err),
        }
    }
}
