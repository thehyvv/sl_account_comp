#!/bin/bash
# One-time GCP project bootstrap script
# Run this ONCE before running Terraform
# Prerequisites: gcloud CLI installed and authenticated (gcloud auth login)

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────────
PROJECT_ID="${1:-}"
REGION="asia-southeast1"
TF_STATE_BUCKET="sl-account-compare-tf-state"

if [ -z "$PROJECT_ID" ]; then
  echo "Usage: ./scripts/setup-gcp.sh YOUR_GCP_PROJECT_ID"
  exit 1
fi

echo "Setting up GCP project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# ── Set active project ─────────────────────────────────────────────────────────
gcloud config set project "$PROJECT_ID"

# ── Create Terraform state bucket ─────────────────────────────────────────────
echo "Creating Terraform state bucket: $TF_STATE_BUCKET"
if ! gcloud storage buckets describe "gs://$TF_STATE_BUCKET" &>/dev/null; then
  gcloud storage buckets create "gs://$TF_STATE_BUCKET" \
    --project="$PROJECT_ID" \
    --location="$REGION" \
    --uniform-bucket-level-access

  # Enable versioning so state history is preserved
  gcloud storage buckets update "gs://$TF_STATE_BUCKET" --versioning
  echo "✓ State bucket created"
else
  echo "✓ State bucket already exists"
fi

# ── Enable billing (must be done in console, just remind) ─────────────────────
echo ""
echo "⚠️  Ensure billing is enabled for project $PROJECT_ID"
echo "   Console: https://console.cloud.google.com/billing/projects"
echo ""

# ── Update terraform backend bucket name ──────────────────────────────────────
echo "Updating terraform backend config..."
sed -i.bak "s/bank-compare-sl-tf-state/${TF_STATE_BUCKET}/g" terraform/main.tf
rm -f terraform/main.tf.bak
echo "✓ Terraform backend updated to use: $TF_STATE_BUCKET"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Bootstrap complete. Next steps:"
echo ""
echo "1. Copy terraform/terraform.tfvars.example → terraform/terraform.tfvars"
echo "   Fill in: project_id, db_password, github_repo"
echo ""
echo "2. cd terraform && terraform init"
echo ""
echo "3. terraform plan"
echo ""
echo "4. terraform apply"
echo ""
echo "5. After apply, copy the outputs to GitHub Secrets:"
echo "   GCP_PROJECT_ID           = $PROJECT_ID"
echo "   GCP_WORKLOAD_IDENTITY_PROVIDER = (from terraform output)"
echo "   GCP_SERVICE_ACCOUNT      = (from terraform output)"
echo "   CLOUD_SQL_CONNECTION_NAME = (from terraform output)"
echo "   NEXT_PUBLIC_APP_URL      = (from terraform output cloud_run_url)"
echo ""
echo "6. Add your Anthropic API key to Secret Manager:"
echo "   echo -n 'sk-ant-...' | gcloud secrets versions add ANTHROPIC_API_KEY --data-file=-"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
