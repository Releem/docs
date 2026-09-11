---
id: aws-rds
slug: /installation/mysql/aws-rds
title: Install Releem for MySQL on AWS RDS
---

# Install Releem for MySQL on AWS RDS

Connect the Releem Agent to Amazon RDS for MySQL.

[Back to MySQL installation options](/installation/mysql).

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Enhanced Monitoring supplies system metrics. Performance Schema and the slow query log supply database and query data when those features are enabled:

   ```ini
   performance_schema=ON
   slow_query_log=ON
   ```

### Separate monitoring from configuration authority

Monitoring can use read actions such as `logs:Get*`, `rds:Describe*`, and `cloudwatch:Get*`. Applying a database configuration requires separate state-changing authority and an approved parameter group. Do not add configuration-changing authority to a monitoring-only role.

The least-privilege policy for each deployment path is unverified. Do not enable configuration application. Ask Releem Support for separate monitoring and configuration policies scoped to your RDS instance.

## Automatic installation {#automatic-installation}

Automatic AWS RDS installation is currently unavailable. Credential handling, network scope, and monitoring permissions are unverified. This page provides no executable automatic installation command; contact Releem Support for the current AWS RDS procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Manual installation {#manual-installation}

Manual AWS RDS installation is currently unavailable. The Agent host, credential handling, network scope, and monitoring permissions are unverified. This page provides no executable manual installation command; contact Releem Support for the current AWS RDS procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Installer parameters

Ask Support to identify the RDS instance, region, Agent host, network path, monitoring account, secret source, optional parameter group, and whether configuration-changing authority is enabled.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.

## Next steps

Return to [MySQL installation options](/installation/mysql), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
