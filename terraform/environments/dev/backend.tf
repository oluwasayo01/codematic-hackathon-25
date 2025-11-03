terraform {
  backend "gcs" {
    bucket = "akinkunmi-infra-state"
    prefix = "codematic/dev"
  }
}