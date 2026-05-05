---
id: cloud-managed-azure-mysql-automatic-installation
title: Azure Database for MySQL
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cloud-Managed Azure Database for MySQL Installation

Use this instruction to install Releem Agent for Azure Database for MySQL Flexible Server. The agent connects to MySQL to collect database metrics and uses Azure Resource Manager and Azure Monitor to collect system metrics and apply recommended configuration.

Recommended VM or container host configuration: 2 vCPU, 4 GB memory, and network access to the Azure MySQL endpoint.

## Requirements

1. Create the `releem` MySQL read-only  user using the [MySQL permissions guide](/releem-agent/mysql-permissions). Add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required) if SQL Query Optimization will be enabled.
2. Enable Performance Schema, slow query log on the Azure MySQL server if they are not enabled yet:

```ini
performance_schema=ON
slow_query_log=ON
```

After restart, check the values from MySQL:

```sql
SHOW VARIABLES
WHERE Variable_name IN (
  'performance_schema',
  'slow_query_log'
);
```

3. Configure Azure credentials for the environment where the agent runs. The agent uses `DefaultAzureCredential`, so it can use a managed identity, service principal environment variables, Azure CLI login, or another supported Azure identity source.
4. Grant Azure RBAC permissions to the identity used by the agent.

For metrics collection, grant at least `Reader` on the Azure MySQL server or its resource group:

```bash
az role assignment create \
  --assignee-object-id "[OBJECT_ID]" \
  --assignee-principal-type ServicePrincipal \
  --role Reader \
  --scope "/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/[RESOURCE_GROUP]/providers/Microsoft.DBforMySQL/flexibleServers/[MYSQL_SERVER]"
```

For applying configuration and restarting the server from Releem Portal, grant `Contributor` on the Azure MySQL server or use a custom role that allows configuration update and restart actions:

```bash
az role assignment create \
  --assignee-object-id "[OBJECT_ID]" \
  --assignee-principal-type ServicePrincipal \
  --role Contributor \
  --scope "/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/[RESOURCE_GROUP]/providers/Microsoft.DBforMySQL/flexibleServers/[MYSQL_SERVER]"
```

If access was just granted, restart the agent or refresh the credential source before testing again.

<Tabs>
  <TabItem value="linux" label="Linux" default>

Run the installation command as `root` on the VM where Releem Agent will run:

```bash
RELEEM_INSTANCE_TYPE="azure/mysql" \
RELEEM_AZURE_SUBSCRIPTION_ID="[SUBSCRIPTION_ID]" \
RELEEM_AZURE_RESOURCE_GROUP="[RESOURCE_GROUP]" \
RELEEM_AZURE_MYSQL_SERVER="[MYSQL_SERVER]" \
RELEEM_MYSQL_PASSWORD='[Password]' \
RELEEM_MYSQL_LOGIN='releem' \
RELEEM_MYSQL_MEMORY_LIMIT=0 \
RELEEM_API_KEY='[API_KEY]' \
RELEEM_CRON_ENABLE=1 \
RELEEM_QUERY_OPTIMIZATION=false \
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

Parameters:

- `RELEEM_AZURE_SUBSCRIPTION_ID` - Azure subscription ID that contains the MySQL Flexible Server.
- `RELEEM_AZURE_RESOURCE_GROUP` - Azure resource group name.
- `RELEEM_AZURE_MYSQL_SERVER` - Azure MySQL Flexible Server name, not the full hostname.
- `RELEEM_MYSQL_LOGIN` - MySQL user used by the agent.
- `RELEEM_MYSQL_PASSWORD` - MySQL user password.
- `RELEEM_API_KEY` - API key from the Releem Portal.
- `RELEEM_QUERY_OPTIMIZATION` - set to `true` to enable SQL Query Optimization data collection.

Verify the installation:

```bash
/opt/releem/releem-agent -f
systemctl status releem-agent
```

  </TabItem>
  <TabItem value="docker" label="Docker">

Run Releem Agent in Docker when you prefer not to install it directly on the VM:

```bash
docker run -d --name releem-agent \
  -e RELEEM_API_KEY="[API_KEY]" \
  -e DB_USER="releem" \
  -e DB_PASSWORD="[Password]" \
  -e INSTANCE_TYPE="azure/mysql" \
  -e RELEEM_AZURE_SUBSCRIPTION_ID="[SUBSCRIPTION_ID]" \
  -e RELEEM_AZURE_RESOURCE_GROUP="[RESOURCE_GROUP]" \
  -e RELEEM_AZURE_MYSQL_SERVER="[MYSQL_SERVER]" \
  -e RELEEM_QUERY_OPTIMIZATION=false \
  releem/releem-agent:[version]
```

When using a service principal in Docker, pass Azure credential environment variables supported by `DefaultAzureCredential`, for example `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET`.

  </TabItem>
</Tabs>

## Common Issues

### AuthorizationFailed

If the agent logs `AuthorizationFailed` for `Microsoft.DBforMySQL/flexibleServers/read`, the Azure identity used by the agent does not have RBAC access to the server. Grant `Reader` for metrics collection or `Contributor` for applying configuration, then restart the agent.

### Server name

Use the Azure MySQL server resource name in `RELEEM_AZURE_MYSQL_SERVER`, for example `my-mysql-server`. Do not use the full hostname `my-mysql-server.mysql.database.azure.com`.
