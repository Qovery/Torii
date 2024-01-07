use std::env;
use std::fs::File;
use std::sync::Arc;

use axum::{Extension, Router};
use axum::http::{Method, StatusCode, Uri};
use axum::routing::{get, post};
use clap::Parser;
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::{AllowHeaders, Any, CorsLayer};
use tracing::{error, info};
use tracing::log::warn;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use crate::catalog::controllers::{exec_catalog_service_post_validate_scripts, exec_catalog_service_validate_scripts, list_catalog_runs_by_catalog_and_service_slugs, list_catalog_runs_by_catalog_slug, list_catalog_services, list_catalogs};
use crate::catalog::services::BackgroundWorkerTask;
use crate::cli::CLI;
use crate::database::init_database;
use crate::yaml_config::YamlConfig;

mod yaml_config;
mod app_config;
mod errors;
mod cli;
mod constants;
mod catalog;
mod database;

pub async fn unknown_route(uri: Uri) -> (StatusCode, String) {
    let message = format!("unknown route for {uri}");
    warn!("{}", &message);
    (StatusCode::NOT_FOUND, message)
}

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    // initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            env::var("RUST_LOG").unwrap_or_else(|_| "global_404_handler=info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let args = CLI::parse();

    println!("{} {}", constants::PROGRAM_NAME, constants::PROGRAM_VERSION);
    println!("{}", constants::BANNER);

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

    match yaml_config.validate() {
        Ok(_) => {}
        Err(err) => {
            error!("failed to validate config file: {}", err);
            std::process::exit(1);
        }
    };

    let connection_string = env::var("DB_CONNECTION_URL")
        .unwrap_or("postgres://postgres:postgres@localhost:5432/torii".to_string());

    let pg_pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&connection_string).await {
        Ok(pool) => pool,
        Err(err) => {
            error!("failed to connect to database: {}", err);
            std::process::exit(1);
        }
    };

    init_database(&pg_pool).await.unwrap_or_else(|err| {
        error!("failed to initialize database: {:?}", err);
        std::process::exit(1);
    });

    info!("database initialized and up to date");

    let pg_pool = Arc::new(pg_pool);
    let bgw_client = pg_pool.clone();

    let (tx, rx) = tokio::sync::mpsc::channel::<BackgroundWorkerTask>(100);

    let _ = tokio::spawn(async move {
        catalog::services::background_worker(rx, bgw_client).await;
    });

    show_loaded_config(&yaml_config);

    let app = Router::new()
        .fallback(unknown_route)
        .route("/", get(|| async { "OK" }))
        .route("/healthz", get(|| async { "OK" }))
        .route("/catalogs", get(list_catalogs))
        .route("/catalogs/:slug/services", get(list_catalog_services))
        .route("/catalogs/:slug/runs", get(list_catalog_runs_by_catalog_slug))
        .route("/catalogs/:slug/services/:slug/validate", post(exec_catalog_service_validate_scripts))
        .route("/catalogs/:slug/services/:slug/execute", post(exec_catalog_service_post_validate_scripts))
        .route("/catalogs/:slug/services/:slug/runs", get(list_catalog_runs_by_catalog_and_service_slugs))
        .layer(Extension(yaml_config))
        .layer(Extension(tx))
        .layer(Extension(pg_pool))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
                .allow_headers(AllowHeaders::any())
        );
    //.route("/catalog/:id", get(catalog::get_catalog_by_id))
    //.route("/catalog", post(catalog::create_catalog));

    let addr = "0.0.0.0:9999";
    info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn show_loaded_config(yaml_config: &YamlConfig) {
    for catalog in &yaml_config.catalogs {
        info!("-> catalog '{}' loaded", catalog.slug);
        for service in catalog.services.as_ref().unwrap_or(&vec![]) {
            info!("\t|-> service '{}' loaded", service.slug);
        }
    }
}
