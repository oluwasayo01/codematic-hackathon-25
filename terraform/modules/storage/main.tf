resource "google_storage_bucket" "buckets" {
  for_each = var.buckets

  name          = each.value.name
  project       = var.project_id
  location      = each.value.location
  force_destroy = lookup(each.value, "force_destroy", false)

  labels = var.common_labels
}