---
id: azure-database-for-mysql
slug: /installation/mysql/azure-database-for-mysql
title: Install Releem for MySQL on Azure Database for MySQL
---

# Install Releem for MySQL on Azure Database for MySQL

Connect the Releem Agent to Azure Database for MySQL Flexible Server.

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions), including query visibility for the examples below. Enable Performance Schema and the slow query log for the related database and query data:

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

If you intend to apply a recommended configuration through the Portal, grant the Agent identity approved change access on that server. `Contributor` permits more than configuration changes, so review that authority before using this server-scoped assignment:

```text
az role assignment create \
  --assignee-object-id "[OBJECT_ID]" \
  --assignee-principal-type ServicePrincipal \
  --role Contributor \
  --scope "/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/[RESOURCE_GROUP]/providers/Microsoft.DBforMySQL/flexibleServers/[MYSQL_SERVER]"
```

## Install the Agent

Run the Agent on a Linux VM that can reach the Azure MySQL endpoint. A starting VM or container-host size is 2 vCPUs and 4 GB of memory; adjust it for your workload. Configure `DefaultAzureCredential` for that VM by using a managed identity or another Azure-supported identity source.

Open a private root shell and run this command. Replace the bracketed placeholders with your values.

```bash
RELEEM_INSTANCE_TYPE="azure/mysql" RELEEM_AZURE_SUBSCRIPTION_ID="[SUBSCRIPTION_ID]" RELEEM_AZURE_RESOURCE_GROUP="[RESOURCE_GROUP]" RELEEM_AZURE_MYSQL_SERVER="[MYSQL_SERVER]" RELEEM_MYSQL_PASSWORD='[MONITORING_PASSWORD]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

## Installer parameters

- `RELEEM_AZURE_SUBSCRIPTION_ID` identifies the Azure subscription.
- `RELEEM_AZURE_RESOURCE_GROUP` identifies the resource group.
- `RELEEM_AZURE_MYSQL_SERVER` is the Flexible Server resource name, not its full hostname.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the database connection.
- `RELEEM_CRON_ENABLE=1` enables daily Agent updates on the VM. Set it to `0` if you do not want scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection after you grant the [query permissions](/supported-databases/mysql/required-permissions#monitoring-and-query-visibility). Remove it from the VM command or Docker example for baseline monitoring only.

## Run the Agent in Docker {#docker}

Run the container on a host that can reach the Azure MySQL endpoint:

```bash
docker run -d --name releem-agent \
  -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
  -e DB_USER="releem" \
  -e DB_PASSWORD="[MONITORING_PASSWORD]" \
  -e INSTANCE_TYPE="azure/mysql" \
  -e RELEEM_AZURE_SUBSCRIPTION_ID="[SUBSCRIPTION_ID]" \
  -e RELEEM_AZURE_RESOURCE_GROUP="[RESOURCE_GROUP]" \
  -e RELEEM_AZURE_MYSQL_SERVER="[MYSQL_SERVER]" \
  -e RELEEM_QUERY_OPTIMIZATION=true \
  --restart unless-stopped \
  releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

Use a version listed on [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). A managed identity available to the container can supply Azure credentials. If you use a service principal, inject the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` environment variables through your approved secret-management method.

## Verify connectivity and current metrics

For a VM installation, use these local checks to diagnose the Agent service:

```bash
/opt/releem/releem-agent -f
systemctl status releem-agent
```

For a Docker installation, inspect the container instead:

```bash
docker logs --tail=100 releem-agent
```

Then open the Dashboard and confirm **Agent Status: Connected** and current metrics or a current data timestamp.

## Expected result

After you complete a supported installation method, the Agent connects and current metrics appear in the Dashboard.

## Troubleshooting

### `AuthorizationFailed`

If the Agent reports `AuthorizationFailed` for `Microsoft.DBforMySQL/flexibleServers/read`, its Azure identity cannot read the server. Confirm the identity selected by `DefaultAzureCredential` and grant it `Reader` on the intended MySQL server or resource group. Configuration application or server restart requires separately approved `Contributor` or a custom role with the required actions. Restart the Agent after the identity or role changes.

### Server not found

Use the Flexible Server resource name in `RELEEM_AZURE_MYSQL_SERVER`, not its full `.mysql.database.azure.com` hostname. Confirm the subscription and resource group in the Agent settings.

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) and [Agent logs](/installation/manage-the-releem-agent/logs). Resolve network, TLS, or MySQL permission errors before restarting the deployment.
