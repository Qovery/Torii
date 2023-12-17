use std::fmt::Display;

use serde::{Deserialize, Serialize};

use crate::constants::DEFAULT_TIMEOUT_IN_SECONDS;

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
    pub icon: Option<String>,
    pub fields: Option<Vec<CatalogFieldYamlConfig>>,
    pub validate: Option<Vec<CatalogServiceValidateYamlConfig>>,
    pub post_validate: Option<Vec<CatalogServicePostValidateYamlConfig>>,
}

pub trait ExternalCommand {
    fn get_command(&self) -> &Vec<String>;
    fn get_timeout(&self) -> u64;
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogServiceValidateYamlConfig {
    pub command: Vec<String>,
    pub timeout: Option<u64>,
}

impl ExternalCommand for CatalogServiceValidateYamlConfig {
    fn get_command(&self) -> &Vec<String> {
        &self.command
    }

    fn get_timeout(&self) -> u64 {
        self.timeout.unwrap_or(DEFAULT_TIMEOUT_IN_SECONDS)
    }
}

impl Display for CatalogServiceValidateYamlConfig {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let command = self.command.join(" ");
        write!(f, "{}", command)
    }
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
pub struct CatalogServicePostValidateYamlConfig {
    pub command: Vec<String>,
    pub timeout: Option<u64>,
    pub output_model: Option<String>,
}

impl ExternalCommand for CatalogServicePostValidateYamlConfig {
    fn get_command(&self) -> &Vec<String> {
        &self.command
    }

    fn get_timeout(&self) -> u64 {
        self.timeout.unwrap_or(DEFAULT_TIMEOUT_IN_SECONDS)
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
    pub type_: CatalogFieldType,
    pub default: Option<String>,
    pub required: Option<bool>,
    pub autocomplete_fetcher: Option<String>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum CatalogFieldType {
    Text,
    Textarea,
    Number,
    Boolean,
    Date,
    Datetime,
    Time,
    List,
}
