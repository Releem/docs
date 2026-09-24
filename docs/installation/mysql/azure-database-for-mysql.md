---
id: azure-database-for-mysql
slug: /installation/mysql/azure-database-for-mysql
title: Install Releem for MySQL on Azure Database for MySQL
---

# Install Releem for MySQL on Azure Database for MySQL

Connect the Releem Agent to Azure Database for MySQL Flexible Server.

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Enable Performance Schema and the slow query log when those data sources are required:

```ini
performance_schema=ON
slow_query_log=ON
```

### Separate monitoring from configuration authority

A monitoring identity can use `Reader` at the MySQL server scope. Applying configuration or restarting the server needs `Contributor` or a custom role that permits the required configuration and restart actions.

Use this monitoring-only scope example only after you confirm the object ID, principal type, subscription, resource group, server name, and required capability:

```text
az role assignment create \
  --assignee-object-id "[OBJECT_ID]" \
  --assignee-principal-type ServicePrincipal \
  --role Reader \
  --scope "/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/[RESOURCE_GROUP]/providers/Microsoft.DBforMySQL/flexibleServers/[MYSQL_SERVER]"
```

## Install the Agent

Run the Agent on a Linux VM that can reach the Azure MySQL endpoint. Configure `DefaultAzureCredential` for that VM by using a managed identity or another Azure-supported identity source.

Run this command in a private administrative session and enter secrets at the masked prompts:

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
export RELEEM_INSTANCE_TYPE="azure/mysql"
export RELEEM_AZURE_SUBSCRIPTION_ID="[SUBSCRIPTION_ID]"
export RELEEM_AZURE_RESOURCE_GROUP="[RESOURCE_GROUP]"
export RELEEM_AZURE_MYSQL_SERVER="[MYSQL_SERVER]"
export RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

## Installer parameters

- `RELEEM_AZURE_SUBSCRIPTION_ID` identifies the Azure subscription.
- `RELEEM_AZURE_RESOURCE_GROUP` identifies the resource group.
- `RELEEM_AZURE_MYSQL_SERVER` is the Flexible Server resource name, not its full hostname.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the database connection.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection after you grant the required database permissions.

## Verify connectivity and current metrics

Use these local checks to diagnose the Agent service:

```bash
/opt/releem/releem-agent -f
systemctl status releem-agent
```

Then open the Dashboard and confirm **Agent Status: Connected** and current metrics or a current data timestamp.

## Expected result

After you complete a supported installation method, the Agent connects and current metrics appear in the Dashboard.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) and [Agent logs](/installation/manage-the-releem-agent/logs). Resolve Azure authorization, network, TLS, or MySQL permission errors before restarting the supported deployment.
