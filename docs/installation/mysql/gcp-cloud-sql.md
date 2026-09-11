---
id: gcp-cloud-sql
slug: /installation/mysql/gcp-cloud-sql
title: Install Releem for MySQL on GCP Cloud SQL
---

# Install Releem for MySQL on GCP Cloud SQL

Connect the Releem Agent to Cloud SQL for MySQL.

[Back to MySQL installation options](/installation/mysql).

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Place the Agent where it can reach the Cloud SQL instance through the approved private network or connector. Enable Performance Schema and the slow query log when those data sources are required:

```ini
performance_schema=ON
slow_query_log=ON
```

### Separate monitoring from configuration authority

Monitoring requires read access to the Cloud SQL and monitoring data used by the Agent. Applying database configuration requires separate state-changing authority. The least-privilege IAM roles for these capabilities are unverified. Do not enable configuration application; ask Releem Support for separate monitoring and configuration roles scoped to your instance.

## Automatic installation {#automatic-installation}

Automatic GCP Cloud SQL installation is currently unavailable. Credential handling, identity, and networking are unverified. This page provides no executable automatic installation command; contact Releem Support for the current Cloud SQL procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Manual installation {#manual-installation}

Manual GCP Cloud SQL installation is currently unavailable. Agent startup, secret injection, identity, and networking are unverified. This page provides no executable manual installation command; contact Releem Support for the current Cloud SQL procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

When Support supplies the procedure, select the specified Agent image from the [Releem Agent tags on Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

## Installer parameters

Ask Support to identify the project, region, Cloud SQL instance, Agent host, network path, monitoring identity, database account, secret source, and whether configuration-changing authority is enabled.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.

## Next steps

Return to [MySQL installation options](/installation/mysql), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
