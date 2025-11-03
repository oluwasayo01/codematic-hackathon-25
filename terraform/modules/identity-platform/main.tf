resource "google_identity_platform_config" "config" {
  project = var.project_id
  


  sign_in {
    email {
      enabled           = true
      password_required = true
    }
  }
}