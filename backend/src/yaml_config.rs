use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct YamlConfig {
    pub catalogs: Vec<CatalogYamlConfig>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogYamlConfig {
    pub slug: String,
    pub name: String,
    pub description: Option<String>,
    pub services: Option<Vec<CatalogServiceYamlConfig>>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogServiceYamlConfig {
    pub slug: String,
    pub name: String,
    pub description: Option<String>,
    pub fields: Option<Vec<CatalogFieldYamlConfig>>,
    pub validate: Option<Vec<CatalogServiceValidateYamlConfig>>,
    pub post_validate: Option<Vec<CatalogServicePostValidateYamlConfig>>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogServiceValidateYamlConfig {
    pub command: Vec<String>,
    pub timeout: Option<u64>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogServicePostValidateYamlConfig {
    pub command: Vec<String>,
    pub timeout: Option<u64>,
    pub output_model: Option<String>,
}

impl Display for CatalogServiceValidateYamlConfig {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let command = self.command.join(" ");
        write!(f, "{}", command)
    }
}

impl Display for CatalogServicePostValidateYamlConfig {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let command = self.command.join(" ");
        write!(f, "{}", command)
    }
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogFieldYamlConfig {
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub placeholder: Option<String>,
    #[serde(rename = "type")]
    pub type_: String,
    pub default: Option<String>,
    pub required: Option<bool>,
    pub autocomplete_fetcher: Option<String>,
}

pub enum CatalogFieldType {
    String,
    Number,
    Boolean,
    Date,
    DateTime,
    Time,
    Enum,
    Array,
    Object,
}

impl CatalogFieldYamlConfig {
    pub fn get_type(&self) -> CatalogFieldType {
        match self.type_.as_str() {
            "string" => CatalogFieldType::String,
            "number" => CatalogFieldType::Number,
            "boolean" => CatalogFieldType::Boolean,
            "date" => CatalogFieldType::Date,
            "datetime" => CatalogFieldType::DateTime,
            "time" => CatalogFieldType::Time,
            "enum" => CatalogFieldType::Enum,
            "array" => CatalogFieldType::Array,
            "object" => CatalogFieldType::Object,
            _ => panic!("Unknown field type: {}", self.type_),
        }
    }

    pub fn is_required(&self) -> bool {
        self.required.unwrap_or(false)
    }
}
