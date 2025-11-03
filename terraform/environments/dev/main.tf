terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region


}

locals {
  cloud_run_services = {
    api = {
      name     = "api-dev"
      location = "us-central1"
      #   image                 = "gcr.io/${var.project_id}/api:latest"
      image                 = "gcr.io/cloudrun/hello"
      allow_unauthenticated = true
      env_vars = {
        ENV = "dev"
      }
    }

    # frontend = {
    #   name                  = "frontend-dev"
    #   location              = "us-central1"
    #   image                 = "gcr.io/${var.project_id}/frontend:latest"
    #   allow_unauthenticated = true
    #   env_vars = {
    #     ENV        = "dev"
    #     API_URL    = module.cloud_run.service_urls["api"]  # Reference other service!
    #   }
    # }
  }
}


# Storage
module "storage" {
  source = "../../modules/storage"

  project_id = var.project_id
  buckets    = var.buckets

  common_labels = {
    environment = "dev"
  }

}

# Firestore - uses all defaults
module "firestore" {
  source = "../../modules/firestore"

  project_id    = var.project_id
  database_name = var.database_name

}

# Identity Platform
module "identity_platform" {
  source = "../../modules/identity-platform"

  project_id = var.project_id

}

module "cloud_build" {
  source = "../../modules/cloud-build"

  project_id   = var.project_id
  github_owner = var.github_owner
  github_repo  = var.github_repo
  triggers     = var.cloud_build_triggers

}

# Cloud Run
module "cloud_run" {
  source = "../../modules/cloud-run"

  project_id = var.project_id
  services   = local.cloud_run_services

  common_labels = {
    environment = "dev"
  }

}
