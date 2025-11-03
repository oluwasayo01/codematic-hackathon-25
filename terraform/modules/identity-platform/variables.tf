variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "services" {
  description = "Map of Cloud Run service configurations"
  type = map(object({
    name                  = string
    location              = string
    image                 = string
    min_instances         = optional(number)
    max_instances         = optional(number)
    env_vars              = optional(map(string))
    allow_unauthenticated = optional(bool)
  }))
  default = {}
}

variable "common_labels" {
  description = "Common labels to apply to all services"
  type        = map(string)
  default     = {}
}