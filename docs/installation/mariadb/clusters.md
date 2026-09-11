---
id: clusters
slug: /installation/mariadb/clusters
title: Install Releem for MariaDB on Clusters
---

# Install Releem for MariaDB on Clusters

Install one Agent for every MariaDB cluster node.

[Back to MariaDB installation options](/installation/mariadb).

## Prerequisites

Create the monitoring account with [MariaDB permissions](/supported-databases/mariadb/required-permissions). Review the additional permissions only when you enable the corresponding query or schema feature.

## Manual installation {#manual-installation}

Install the Agent on every node using the [MariaDB manual Linux installation](/installation/mariadb/linux#manual-installation). The Agent uses `RELEEM_MYSQL_*` connection variable names for MariaDB compatibility; those names do not establish MySQL feature or privilege parity.

## Expected result

The Agent starts and the server appears in the Releem Dashboard.

## Verify the installation

Open the Dashboard and confirm **Agent Status: Connected** and a current data timestamp or current metrics. If the Agent is connected but current metrics are absent, check the Agent logs before continuing.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Check the database permissions, connection values, network access, and [Agent logs](/installation/manage-the-releem-agent/logs). Correct the reported problem before you re-run or restart the installation.

## Next steps

Return to [MariaDB installation options](/installation/mariadb), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).

