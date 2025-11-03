# global/main.tf
# Global resources shared across all environments
# Use this for organization-level resources or shared services

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  backend "gcs" {
    bucket = "akinkunmi-infra-state"
    prefix = "codematic"
  }
}