variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "Default region"
  type        = string
  default     = "us-central1"
}

variable "enable_apis" {
  description = "APIs to enable"
  type        = list(string)
  default = [
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com"
  ]
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "buckets" {
  description = "Storage bucket configurations"
  type        = any
  default     = {}
}

variable "cloud_build_triggers" {
  description = "Cloud Build trigger configurations"
  type        = any
  default     = {}
}

variable "cloud_run_services" {
  description = "Cloud Run service configurations"
  type        = any
  default     = {}
}

variable "database_name" {
  description = "Name of the Firestore database"
  type        = string
  default     = "articulate-db-dev"
}