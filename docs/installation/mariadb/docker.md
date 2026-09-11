---
id: docker
slug: /installation/mariadb/docker
title: Install Releem for MariaDB on Docker
---

# Install Releem for MariaDB on Docker

Run the Releem Agent in a Docker container for MariaDB.

[Back to MariaDB installation options](/installation/mariadb).

## Prerequisites

Review [MariaDB permissions](/supported-databases/mariadb/required-permissions). The Agent can use `RELEEM_MYSQL_*` compatibility names for MariaDB; those names do not establish MySQL feature or privilege parity.

## Manual installation {#manual-installation}

Manual Docker installation is currently unavailable. MariaDB secret injection and Agent startup are unverified. This page provides no executable container-start command; contact Releem Support for the current MariaDB Docker procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

When Support supplies the procedure, select the specified Agent image from the [Releem Agent tags on Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

## Installer parameters

Ask Support to identify the Agent image, MariaDB host and port, monitoring user, secret sources, memory limit, volumes, and optional query-collection setting.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.

## Next steps

Return to [MariaDB installation options](/installation/mariadb), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
