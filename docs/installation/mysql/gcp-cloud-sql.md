---
id: gcp-cloud-sql
slug: /installation/mysql/gcp-cloud-sql
title: Install Releem for MySQL on GCP Cloud SQL
---

# Install Releem for MySQL on GCP Cloud SQL

Connect the Releem Agent to Cloud SQL for MySQL.

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions), including query visibility for the examples below. Place the Agent where it can reach the Cloud SQL instance through the approved private network or connector. Enable Performance Schema and the slow query log for the related database and query data:

```ini
performance_schema=ON
slow_query_log=ON
```

### Separate monitoring from configuration authority

Attach a service account to the Compute Engine VM. Grant it [Cloud SQL Viewer (`roles/cloudsql.viewer`)](https://docs.cloud.google.com/iam/docs/roles-permissions/cloudsql) on the project containing the Cloud SQL instance. This role includes `cloudsql.instances.get` for instance discovery and `monitoring.timeSeries.list` for system metrics—the read operations used by the Agent. Enable the [Cloud SQL Admin API](https://docs.cloud.google.com/sql/docs/mysql/admin-api) and [Cloud Monitoring API](https://docs.cloud.google.com/monitoring/api/enable-api) in that project.

Give the VM the [`cloud-platform` access scope](https://docs.cloud.google.com/compute/docs/access/service-accounts), then use the service account's IAM role to limit access. Applying database configuration requires separate state-changing authority; the Viewer role does not provide it.

## Automatic installation {#automatic-installation}

Install the Agent on a Compute Engine VM that can reach Cloud SQL. A starting VM size is 2 vCPUs, 4 GB of memory, and a 10 GB balanced persistent disk; adjust it for your workload. Open a private root shell and run this command. Replace the bracketed placeholders with your values.

```bash
RELEEM_INSTANCE_TYPE="gcp/cloudsql" RELEEM_GCP_PROJECT_ID="[PROJECT_ID]" RELEEM_GCP_REGION="[REGION]" RELEEM_GCP_CLOUDSQL_INSTANCE="[INSTANCE_ID]" RELEEM_MYSQL_PASSWORD='[MONITORING_PASSWORD]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

## Manual installation {#manual-installation}

To run the Agent in a container on the Compute Engine VM, choose Docker or Docker Compose. Replace every bracketed value.

### Docker

```bash
docker run -d --name releem-agent \
  -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
  -e RELEEM_HOSTNAME="[SERVER_NAME]" \
  -e DB_USER="releem" \
  -e DB_PASSWORD="[MONITORING_PASSWORD]" \
  -e INSTANCE_TYPE="gcp/cloudsql" \
  -e RELEEM_GCP_PROJECT_ID="[PROJECT_ID]" \
  -e RELEEM_GCP_REGION="[REGION]" \
  -e RELEEM_GCP_CLOUDSQL_INSTANCE="[INSTANCE_ID]" \
  -e RELEEM_QUERY_OPTIMIZATION="true" \
  --restart unless-stopped \
  releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

Check the container log with `docker logs --tail=100 releem-agent`.

### Docker Compose

Create `compose.yaml`:

```yaml
services:
  releem-agent:
    image: "releem/releem-agent:[VERSION_FROM_DOCKER_HUB]"
    environment:
      RELEEM_API_KEY: "[RELEEM_API_KEY]"
      RELEEM_HOSTNAME: "[SERVER_NAME]"
      DB_USER: "releem"
      DB_PASSWORD: "[MONITORING_PASSWORD]"
      INSTANCE_TYPE: "gcp/cloudsql"
      RELEEM_GCP_PROJECT_ID: "[PROJECT_ID]"
      RELEEM_GCP_REGION: "[REGION]"
      RELEEM_GCP_CLOUDSQL_INSTANCE: "[INSTANCE_ID]"
      RELEEM_QUERY_OPTIMIZATION: "true"
    restart: unless-stopped
```

```bash
docker compose up -d
docker compose logs --tail=100 releem-agent
```

Keep a Compose file containing credentials out of version control.

To monitor another Cloud SQL instance from the same VM, duplicate the Compose service. Give the second service and container unique names, then set its own `RELEEM_HOSTNAME`, project, Region, instance ID, and database credentials. Start both services with `docker compose up -d`; each Agent should appear as a separate server in the Dashboard.

## Installer parameters

- `RELEEM_GCP_PROJECT_ID` is the Google Cloud project ID.
- `RELEEM_GCP_REGION` is the Cloud SQL Region.
- `RELEEM_GCP_CLOUDSQL_INSTANCE` is the instance ID or connection name.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the database connection.
- `RELEEM_CRON_ENABLE=1` enables daily Agent updates on the VM. Set it to `0` if you do not want scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection after you grant the [query permissions](/supported-databases/mysql/required-permissions#monitoring-and-query-visibility). Remove it from the chosen installation example for baseline monitoring only.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

### Cloud API access denied

If the Agent logs `Failed to get Cloud SQL instance details`, check its VM service account, project ID, Cloud SQL Admin API, and `cloudsql.instances.get` permission. If it logs `Failed to collect GCP metrics`, check the Cloud Monitoring API and `monitoring.timeSeries.list` permission. Also confirm that the VM access scope allows the APIs. Restart the Agent after correcting its access.

### The Dashboard has no latency data

Check that Performance Schema is active on the running Cloud SQL instance and that the Agent can read the statement-digest data. Run database queries, then check the **Latency** graph again.

### `Error 1045 (28000): Access denied`

Confirm the database user, password, and host from which the Agent connects. Compare the account's effective grants with [MySQL Required Permissions](/supported-databases/mysql/required-permissions). Update the Agent's protected credentials if needed, then restart the Agent.

### `Connect: connection timed out`

For a private-IP connection, check that the VM has access to the Cloud SQL VPC and that firewall rules allow the database connection. If you use the Cloud SQL Auth Proxy, confirm that the proxy is running, points to the correct instance and IP path, and that its identity has the [Cloud SQL Client role](https://docs.cloud.google.com/sql/docs/mysql/connect-auth-proxy).

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) and review the [Agent logs](/installation/manage-the-releem-agent/logs).
