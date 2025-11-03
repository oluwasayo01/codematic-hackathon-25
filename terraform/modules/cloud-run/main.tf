resource "google_cloud_run_v2_service" "services" {
  for_each = var.services

  project  = var.project_id
  name     = each.value.name
  location = each.value.location
  

  template {
    containers {
      image = each.value.image

      # Environment variables
      dynamic "env" {
        for_each = lookup(each.value, "env_vars", {})
        content {
          name  = env.key
          value = env.value
        }
      }
    }

    scaling {
      min_instance_count = lookup(each.value, "min_instances", 0)
      max_instance_count = lookup(each.value, "max_instances", 100)
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  labels = var.common_labels
}

# Allow public access if specified
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  for_each = {
    for k, v in var.services : k => v if lookup(v, "allow_unauthenticated", false)
  }

  project  = var.project_id
  location = google_cloud_run_v2_service.services[each.key].location
  name     = google_cloud_run_v2_service.services[each.key].name
  role     = "roles/run.invoker"
  member   = "allUsers"
}