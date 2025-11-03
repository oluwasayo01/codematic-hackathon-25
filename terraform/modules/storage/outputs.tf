output "bucket_names" {
  description = "Map of bucket keys to bucket names"
  value       = { for k, v in google_storage_bucket.buckets : k => v.name }
}

output "bucket_urls" {
  description = "Map of bucket keys to bucket URLs"
  value       = { for k, v in google_storage_bucket.buckets : k => v.url }
}