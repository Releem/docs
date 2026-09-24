---
id: gcp-cloud-sql
slug: /installation/mysql/gcp-cloud-sql
title: Install Releem for MySQL on GCP Cloud SQL
---

# Install Releem for MySQL on GCP Cloud SQL

Connect the Releem Agent to Cloud SQL for MySQL.

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Place the Agent where it can reach the Cloud SQL instance through the approved private network or connector. Enable Performance Schema and the slow query log when those data sources are required:

```ini
performance_schema=ON
slow_query_log=ON
```

### Separate monitoring from configuration authority

Use a Google Cloud identity with Cloud SQL and Cloud Monitoring read access. Applying database configuration requires separate state-changing authority; add it only when you want Releem to apply approved changes.

## Automatic installation {#automatic-installation}

Install the Agent on a Compute Engine VM that can reach Cloud SQL. Run the command in a private administrative session and enter secrets at the masked prompts:

```bash
sudo bash -c '
set -euo pipefail
installer=$(mktemp)
trap "rm -f \"$installer\"" EXIT
read -r -s -p "Releem API key: " RELEEM_API_KEY
printf "\n"
read -r -s -p "Monitoring database password: " RELEEM_MYSQL_PASSWORD
printf "\n"
export RELEEM_API_KEY RELEEM_MYSQL_PASSWORD RELEEM_MYSQL_LOGIN="releem"
export RELEEM_INSTANCE_TYPE="gcp/cloudsql"
export RELEEM_GCP_PROJECT_ID="[PROJECT_ID]" RELEEM_GCP_REGION="[REGION]"
export RELEEM_GCP_CLOUDSQL_INSTANCE="[INSTANCE_ID]"
export RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

## Manual installation {#manual-installation}

To run the Agent in Docker on the Compute Engine VM, create a protected `.env` file:

```text
AGENT_VERSION=[VERSION_FROM_DOCKER_HUB]
RELEEM_API_KEY=[RELEEM_API_KEY]
RELEEM_HOSTNAME=[SERVER_NAME]
DB_USER=releem
DB_PASSWORD=[MONITORING_PASSWORD]
INSTANCE_TYPE=gcp/cloudsql
RELEEM_GCP_PROJECT_ID=[PROJECT_ID]
RELEEM_GCP_REGION=[REGION]
RELEEM_GCP_CLOUDSQL_INSTANCE=[INSTANCE_ID]
```

Create `compose.yaml`, then start the Agent:

```yaml
services:
  releem-agent:
    image: releem/releem-agent:${AGENT_VERSION}
    env_file: .env
    restart: unless-stopped
```

```bash
chmod 600 .env
docker compose up -d
docker compose logs --tail=100 releem-agent
```

## Installer parameters

- `RELEEM_GCP_PROJECT_ID` is the Google Cloud project ID.
- `RELEEM_GCP_REGION` is the Cloud SQL Region.
- `RELEEM_GCP_CLOUDSQL_INSTANCE` is the instance ID or connection name.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the database connection.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection after you grant the required database permissions.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.
