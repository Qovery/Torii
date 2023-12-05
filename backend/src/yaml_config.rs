use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct YamlConfig {
    pub catalog: Vec<CatalogYamlConfig>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogYamlConfig {
    pub name: String,
    pub description: Option<String>,
    pub fields: Option<Vec<CatalogFieldYamlConfig>>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogFieldYamlConfig {
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
}
