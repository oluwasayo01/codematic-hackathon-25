output "project_id" {
  description = "The project ID"
  value       = var.create_project ? google_project.project[0].project_id : var.project_id
}

output "project_number" {
  description = "The project number"
  value       = var.create_project ? google_project.project[0].number : null
}

output "enabled_apis" {
  description = "List of enabled APIs"
  value       = [for api in google_project_service.apis : api.service]
}