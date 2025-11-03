variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "create_project" {
  description = "Whether to create a new project (requires org/folder permissions)"
  type        = bool
  default     = false
}

variable "project_name" {
  description = "The display name for the project (only used if create_project = true)"
  type        = string
  default     = ""
}

variable "billing_account" {
  description = "Billing account ID (only used if create_project = true)"
  type        = string
  default     = ""
}

variable "org_id" {
  description = "Organization ID (only used if create_project = true)"
  type        = string
  default     = ""
}

variable "folder_id" {
  description = "Folder ID (only used if create_project = true)"
  type        = string
  default     = ""
}

variable "enable_apis" {
  description = "List of APIs to enable"
  type        = list(string)
  default = [
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "storage.googleapis.com",
  ]
}