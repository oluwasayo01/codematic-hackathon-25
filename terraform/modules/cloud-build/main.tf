data "google_service_account" "codematic_sa" {
  account_id = "codematic-project-sa"
}

resource "google_cloudbuild_trigger" "triggers" {
  for_each = var.triggers
    
  project     = var.project_id
  name        = each.value.name
  location    = each.value.location
  description = lookup(each.value, "description", null)

  service_account = data.google_service_account.codematic_sa.id

  github {
    owner = var.github_owner
    name  = var.github_repo
    
    push {
      branch = lookup(each.value, "branch", "^main$")
    }
  }
  
  filename = "cloudbuild.yml"

}