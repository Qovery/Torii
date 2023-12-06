use std::sync::Arc;

use axum::{debug_handler, Extension, Json};
use axum::extract::Path;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig, YamlConfig};

#[derive(Serialize, Deserialize)]
pub struct ResultsResponse<T> {
    results: Vec<T>,
}

#[derive(Serialize, Deserialize)]
pub struct SimpleResponse {
    message: Option<String>,
}

fn find_catalog_by_slug<'a>(catalogs: &'a Vec<CatalogYamlConfig>, catalog_slug: &str) -> Option<&'a CatalogYamlConfig> {
    catalogs.iter().find(|catalog| catalog.slug == catalog_slug)
}

fn find_catalog_service_by_slug<'a>(catalog: &'a CatalogYamlConfig, service_slug: &str) -> Option<&'a CatalogServiceYamlConfig> {
    catalog.services.as_ref().unwrap().iter().find(|service| service.slug == service_slug)
}

#[debug_handler]
pub async fn list_catalog_services(
    Path(catalog_slug): Path<String>,
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
) -> (StatusCode, Json<ResultsResponse<CatalogServiceYamlConfig>>) {
    let catalog = match find_catalog_by_slug(&yaml_config.catalogs, catalog_slug.as_str()) {
        Some(catalog) => catalog,
        None => return (StatusCode::NOT_FOUND, Json(ResultsResponse { results: vec![] }))
    };

    (StatusCode::OK, Json(ResultsResponse { results: catalog.services.clone().unwrap_or(vec![]) }))
}

#[debug_handler]
pub async fn exec_catalog_service_validate_scripts(
    Path((catalog_slug, service_slug)): Path<(String, String)>,
    Extension(yaml_config): Extension<Arc<YamlConfig>>,
) -> (StatusCode, Json<SimpleResponse>) {
    let catalog = match find_catalog_by_slug(&yaml_config.catalogs, catalog_slug.as_str()) {
        Some(catalog) => catalog,
        None => return (StatusCode::NOT_FOUND, Json(SimpleResponse { message: Some("Service not found".to_string()) }))
    };

    let service = match find_catalog_service_by_slug(catalog, service_slug.as_str()) {
        Some(service) => service,
        None => return (StatusCode::NOT_FOUND, Json(SimpleResponse { message: Some("Service not found".to_string()) }))
    };

    (StatusCode::OK, Json(SimpleResponse { message: None }))
}

#[cfg(test)]
mod tests {
    use crate::catalog::{find_catalog_by_slug, find_catalog_service_by_slug};
    use crate::yaml_config::{CatalogServiceYamlConfig, CatalogYamlConfig};

    #[test]
    fn test_find_catalog_by_slug() {
        let catalogs = vec![
            CatalogYamlConfig {
                name: "Catalog 1".to_string(),
                slug: "catalog-1".to_string(),
                description: None,
                services: None,
            },
            CatalogYamlConfig {
                name: "Catalog 2".to_string(),
                slug: "catalog-2".to_string(),
                description: None,
                services: None,
            },
        ];

        assert_eq!(find_catalog_by_slug(&catalogs, "catalog-1"), Some(&catalogs[0]));
        assert_eq!(find_catalog_by_slug(&catalogs, "catalog-2"), Some(&catalogs[1]));
        assert_eq!(find_catalog_by_slug(&catalogs, "catalog-3"), None);
    }

    #[test]
    fn test_find_catalog_service_by_slug() {
        let catalog = CatalogYamlConfig {
            name: "Catalog 1".to_string(),
            slug: "catalog-1".to_string(),
            description: None,
            services: Some(vec![
                CatalogServiceYamlConfig {
                    name: "Service 1".to_string(),
                    slug: "service-1".to_string(),
                    description: None,
                    fields: None,
                },
                CatalogServiceYamlConfig {
                    name: "Service 2".to_string(),
                    slug: "service-2".to_string(),
                    description: None,
                    fields: None,
                },
            ]),
        };

        assert_eq!(find_catalog_service_by_slug(&catalog, "service-1"), Some(&catalog.services.unwrap()[0]));
        assert_eq!(find_catalog_service_by_slug(&catalog, "service-2"), Some(&catalog.services.unwrap()[1]));
        assert_eq!(find_catalog_service_by_slug(&catalog, "service-3"), None);
    }
}
