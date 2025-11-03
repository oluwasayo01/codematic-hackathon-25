# modules/bootstrap/main.tf
# Creates project, enables APIs, and sets up state bucket

resource "google_project" "project" {
  count           = var.create_project ? 1 : 0
  name            = var.project_name
  project_id      = var.project_id
  billing_account = var.billing_account
  org_id          = var.org_id
  folder_id       = var.folder_id
}


# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset(var.enable_apis)
  
  project = var.create_project ? google_project.project[0].project_id : var.project_id
  service = each.value

  disable_on_destroy = false
}
