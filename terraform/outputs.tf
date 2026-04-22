output "cloud_run_url" {
  description = "Public URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.app.uri
}

output "artifact_registry_url" {
  description = "Docker image repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/bank-compare-sl"
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name — use as CLOUD_SQL_CONNECTION_NAME GitHub secret"
  value       = google_sql_database_instance.postgres.connection_name
}

output "workload_identity_provider" {
  description = "Workload Identity Provider — use as GCP_WORKLOAD_IDENTITY_PROVIDER GitHub secret"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "github_actions_service_account" {
  description = "GitHub Actions SA email — use as GCP_SERVICE_ACCOUNT GitHub secret"
  value       = google_service_account.github_actions_sa.email
}
