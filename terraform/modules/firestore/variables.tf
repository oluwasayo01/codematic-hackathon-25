variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "database_name" {
  description = "Name of the Firestore database"
  type        = string
  default     = "(default)"
}

variable "location_id" {
  description = "Location for Firestore database"
  type        = string
  default     = "nam5"
}

variable "database_type" {
  description = "Database type"
  type        = string
  default     = "FIRESTORE_NATIVE"
}

variable "delete_protection_state" {
  description = "Deletion protection"
  type        = string
  default     = "DELETE_PROTECTION_DISABLED"
}