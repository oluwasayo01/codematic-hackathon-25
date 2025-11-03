output "trigger_ids" {
  description = "Map of trigger keys to trigger IDs"
  value       = { for k, v in google_cloudbuild_trigger.triggers : k => v.id }
}

output "trigger_names" {
  description = "Map of trigger keys to trigger names"
  value       = { for k, v in google_cloudbuild_trigger.triggers : k => v.name }
}