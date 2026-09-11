---
id: azure-database-for-mysql
slug: /installation/mysql/azure-database-for-mysql
title: Install Releem for MySQL on Azure Database for MySQL
---

# Install Releem for MySQL on Azure Database for MySQL

Connect the Releem Agent to Azure Database for MySQL Flexible Server.

[Back to MySQL installation options](/installation/mysql).

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Enable Performance Schema and the slow query log when those data sources are required:

```ini
performance_schema=ON
slow_query_log=ON
```

### Separate monitoring from configuration authority

A monitoring identity can use `Reader` at the narrowest approved MySQL server scope. Applying configuration or restarting the server needs separate state-changing authority. Do not grant mutation authority to a monitoring-only Agent.

Use this monitoring-only scope example only after you confirm the object ID, principal type, subscription, resource group, server name, and required capability:

```text
az role assignment create \
  --assignee-object-id "[OBJECT_ID]" \
  --assignee-principal-type ServicePrincipal \
  --role Reader \
  --scope "/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/[RESOURCE_GROUP]/providers/Microsoft.DBforMySQL/flexibleServers/[MYSQL_SERVER]"
```

The least-privilege role for configuration changes is unverified. Do not enable configuration application; ask your Azure administrator and Releem Support for a separate role scoped to the MySQL server.

Azure Database for MySQL installation is currently unavailable. Agent startup, credential handling, identity, networking, and TLS settings are unverified. This page provides no executable Agent installation command; contact Releem Support for the current Azure procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Installer parameters

Ask Support to identify the Azure subscription, resource group, MySQL server, Agent host, identity source, database account, secret source, TLS connection, and whether mutation authority is enabled.

## Verify connectivity and current metrics

After Support installs the Agent, use these local checks to diagnose the Agent service:

```bash
/opt/releem/releem-agent -f
systemctl status releem-agent
```

Then open the Dashboard and confirm **Agent Status: Connected** and current metrics or a current data timestamp.

## Expected result

After you complete a supported installation method, the Agent connects and current metrics appear in the Dashboard.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) and [Agent logs](/installation/manage-the-releem-agent/logs). Resolve Azure authorization, network, TLS, or MySQL permission errors before restarting the supported deployment.

## Next steps

Return to [MySQL installation options](/installation/mysql), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
