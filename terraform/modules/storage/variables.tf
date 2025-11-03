variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "buckets" {
  description = "Map of bucket configurations"
  type = map(object({
    name          = string
    location      = string
    force_destroy = optional(bool)
  }))
  default = {}
}

variable "common_labels" {
  description = "Common labels to apply to all buckets"
  type        = map(string)
  default     = {}
}