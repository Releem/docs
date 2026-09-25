---
id: clusters
slug: /installation/mysql/clusters
title: Install Releem for MySQL on Clusters
---

# Install Releem for MySQL on Clusters

Install one Agent for every MySQL or Percona cluster node.

## Prerequisites

Create the monitoring account with [MySQL permissions](/supported-databases/mysql/required-permissions). Review the additional permissions only when you enable the corresponding query or schema feature.

## Manual installation {#manual-installation}

Install the Agent on every node using the [MySQL manual Linux installation](/installation/mysql/linux#manual-installation). Keep each node's connection and Dashboard identity distinct.

## Expected result

The Agent starts and the server appears in the Releem Dashboard.

## Verify the installation

Open the Dashboard and confirm **Agent Status: Connected** and a current data timestamp or current metrics. If the Agent is connected but current metrics are absent, check the Agent logs before continuing.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Check the database permissions, connection values, network access, and [Agent logs](/installation/manage-the-releem-agent/logs). Correct the reported problem before you re-run or restart the installation.
