variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "triggers" {
  description = "Map of Cloud Build trigger configurations"
  type = map(object({
    name        = string
    description = optional(string)
    branch      = optional(string)
    filename    = optional(string)
    location    = optional(string)
  }))
  default = {}
}
