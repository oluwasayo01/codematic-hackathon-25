output "service_urls" {
  description = "Map of service keys to service URLs"
  value       = { for k, v in google_cloud_run_v2_service.services : k => v.uri }
}

output "service_names" {
  description = "Map of service keys to service names"
  value       = { for k, v in google_cloud_run_v2_service.services : k => v.name }
}