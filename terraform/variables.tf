variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region — asia-southeast1 (Singapore) closest to Sri Lanka"
  type        = string
  default     = "asia-southeast1"
}

variable "db_password" {
  description = "Cloud SQL app user password"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repo in owner/repo format (e.g. yourname/bank-compare-sl)"
  type        = string
}

variable "app_url" {
  description = "Public URL of the Cloud Run service (set after first deploy)"
  type        = string
  default     = ""
}
