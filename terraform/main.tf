terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Store Terraform state in GCS (create this bucket manually first)
  backend "gcs" {
    bucket = "sl-account-compare-tf-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ─────────────────────────────────────────
# Enable required GCP APIs
# ─────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iamcredentials.googleapis.com",   # For Workload Identity Federation
    "sts.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# ─────────────────────────────────────────
# Artifact Registry — Docker image storage
# ─────────────────────────────────────────
resource "google_artifact_registry_repository" "app" {
  repository_id = "bank-compare-sl"
  format        = "DOCKER"
  location      = var.region
  description   = "Docker images for bank-compare-ui"

  cleanup_policies {
    id     = "keep-last-10"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10
    }
  }

  depends_on = [google_project_service.apis]
}

# ─────────────────────────────────────────
# Cloud SQL — PostgreSQL (micro, economical)
# ─────────────────────────────────────────
resource "google_sql_database_instance" "postgres" {
  name             = "bank-compare-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-f1-micro"  # ~$7/mo — cheapest always-on tier
    availability_type = "ZONAL"        # Single zone, no HA (saves ~$7/mo vs REGIONAL)
    disk_size         = 10             # GB — minimum
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      backup_retention_settings {
        retained_backups = 7
      }
    }

    maintenance_window {
      day          = 7  # Sunday
      hour         = 4  # 4 AM
      update_track = "stable"
    }

    ip_configuration {
      ipv4_enabled = true   # Required — Cloud Run connects via Cloud SQL Auth Proxy socket
      # No authorized_networks = no direct TCP access; all connections go through the proxy
    }

    database_flags {
      name  = "max_connections"
      value = "50"  # Conservative for micro instance
    }
  }

  deletion_protection = true
  depends_on          = [google_project_service.apis]
}

resource "google_sql_database" "app_db" {
  name     = "bankcompare"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "app_user" {
  name     = "bankcompare_app"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# ─────────────────────────────────────────
# Secret Manager — store sensitive config
# ─────────────────────────────────────────
resource "google_secret_manager_secret" "database_url" {
  secret_id = "DATABASE_URL"
  replication {
    auto {}
  }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = "postgresql://bankcompare_app:${var.db_password}@/bankcompare?host=/cloudsql/${var.project_id}:${var.region}:bank-compare-db"
}

resource "google_secret_manager_secret" "anthropic_api_key" {
  secret_id = "ANTHROPIC_API_KEY"
  replication {
    auto {}
  }
  depends_on = [google_project_service.apis]
}

# Note: Set the actual value manually or via CI:
# gcloud secrets versions add ANTHROPIC_API_KEY --data-file=-

# ─────────────────────────────────────────
# Service Account for Cloud Run
# ─────────────────────────────────────────
resource "google_service_account" "cloudrun_sa" {
  account_id   = "bank-compare-cloudrun"
  display_name = "Bank Compare Cloud Run Service Account"
}

resource "google_project_iam_member" "cloudrun_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "cloudrun_db_url" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "cloudrun_anthropic" {
  secret_id = google_secret_manager_secret.anthropic_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun_sa.email}"
}

# ─────────────────────────────────────────
# Cloud Run service
# ─────────────────────────────────────────
resource "google_cloud_run_v2_service" "app" {
  name     = "bank-compare-ui"
  location = var.region

  template {
    service_account = google_service_account.cloudrun_sa.email

    scaling {
      min_instance_count = 0   # Scale to zero when idle
      max_instance_count = 10
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/bank-compare-sl/bank-compare-ui:latest"

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
        cpu_idle = true  # Only allocate CPU during requests (cheaper)
      }

      ports {
        container_port = 8080
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "NEXT_PUBLIC_APP_URL"
        value = var.app_url
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "ANTHROPIC_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.anthropic_api_key.secret_id
            version = "latest"
          }
        }
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = ["${var.project_id}:${var.region}:bank-compare-db"]
      }
    }
  }

  depends_on = [
    google_project_service.apis,
    google_sql_database_instance.postgres,
  ]
}

# Allow public (unauthenticated) access to Cloud Run
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ─────────────────────────────────────────
# Workload Identity Federation for GitHub Actions
# (keyless auth — no long-lived JSON keys)
# ─────────────────────────────────────────
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "GitHub Actions Pool"
  depends_on                = [google_project_service.apis]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Actions Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "assertion.repository == '${var.github_repo}'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "github_actions_sa" {
  account_id   = "github-actions-deploy"
  display_name = "GitHub Actions Deployment Service Account"
}

# GitHub Actions SA needs to push images and deploy Cloud Run
resource "google_project_iam_member" "github_ar_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_project_iam_member" "github_cloudrun_developer" {
  project = var.project_id
  role    = "roles/run.developer"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_service_account_iam_member" "github_wif_binding" {
  service_account_id = google_service_account.github_actions_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}

# Allow GitHub Actions to act as Cloud Run SA (for passing service account to Cloud Run)
resource "google_service_account_iam_member" "github_sa_user" {
  service_account_id = google_service_account.cloudrun_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_actions_sa.email}"
}
