---
id: docker
slug: /installation/mysql/docker
title: Install Releem for MySQL on Docker
---

# Install Releem for MySQL on Docker

Run the Releem Agent in a Docker container for MySQL.

[Back to MySQL installation options](/installation/mysql).

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Choose a secret-management mechanism that does not put the API key or database password in a committed Compose file or visible container environment.

## Manual installation {#manual-installation}

Manual Docker installation is currently unavailable. Secret injection and Agent startup are unverified. This page provides no executable container-start command; contact Releem Support for the current MySQL Docker procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

Use these MySQL configuration fragments only with the container procedure supplied by Releem Support:

   ```yaml
   volumes:
     - /etc/mysql/releem.conf.d/:/etc/mysql/conf.d/
   ```

   ```
   !includedir /etc/mysql/conf.d
   ```

   ```ini
   performance_schema=ON
   performance-schema-consumer-events-statements-current=ON
   performance-schema-consumer-events-statements-history=ON
   slow_query_log=ON
   ```

When Support supplies the procedure, select the specified Agent image from the [Releem Agent tags on Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

## Installer parameters

Ask Support to identify the Agent image, database host and port, monitoring user, secret sources, memory limit, volumes, and optional query-collection setting.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.

## Next steps

Return to [MySQL installation options](/installation/mysql), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
