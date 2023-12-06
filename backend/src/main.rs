use std::env;
use std::fs::File;
use std::sync::Arc;

use axum::{Extension, middleware, Router};
use axum::http::{Extensions, StatusCode, Uri};
use axum::routing::get;
use clap::Parser;
use serde::{Deserialize, Serialize};
use tracing::error;
use tracing::log::warn;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use crate::cli::CLI;
use crate::yaml_config::YamlConfig;

mod yaml_config;
mod app_config;
mod catalog;
mod errors;
mod cli;
mod constants;

pub async fn unknown_route(uri: Uri) -> (StatusCode, String) {
    let message = format!("unknown route for {uri}");
    warn!("{}", &message);
    (StatusCode::NOT_FOUND, message)
}

#[tokio::main]
async fn main() {
    println!("{} {}", constants::PROGRAM_NAME, constants::PROGRAM_VERSION);
    println!("{}", constants::BANNER);

    // initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            env::var("RUST_LOG").unwrap_or_else(|_| "global_404_handler=info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let args = CLI::parse();

    let file = File::open(args.config).unwrap_or_else(|err| {
        error!("failed to open config file: {}", err);
        std::process::exit(1);
    });

    let yaml_config: Arc<YamlConfig> = match serde_yaml::from_reader(file) {
        Ok(config) => Arc::new(config),
        Err(err) => {
            error!("failed to parse config file: {}", err);
            std::process::exit(1);
        }
    };

    let app = Router::new()
        .fallback(unknown_route)
        .route("/", get(|| async { "OK" }))
        .route("/healthz", get(|| async { "OK" }))
        .route("/catalogs/:slug/services", get(catalog::list_catalog_services))
        .route("/catalogs/:slug/services/:slug/validate", get(catalog::exec_catalog_service_validate_scripts))
        .layer(Extension(yaml_config));
    //.route("/catalog/:id", get(catalog::get_catalog_by_id))
    //.route("/catalog", post(catalog::create_catalog));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:9999").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
