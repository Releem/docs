---
id: kubernetes
slug: /installation/mariadb/kubernetes
title: Install Releem for MariaDB on Kubernetes
---

# Install Releem for MariaDB on Kubernetes

Deploy the Releem Agent for a MariaDB cluster in Kubernetes.

[Back to MariaDB installation options](/installation/mariadb).

## Prerequisites

Review [MariaDB permissions](/supported-databases/mariadb/required-permissions). Confirm the namespace, MariaDB service, scheduling labels, storage classes, Secret integration, and Agent image before deployment.

MariaDB installation on Kubernetes is currently unavailable. Secret handling, scheduling, storage, and Agent startup are unverified. This page provides no executable manifest; contact Releem Support for the current Secret-based deployment procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Expected result

After you complete a supported deployment, the Agent pods should start and the Dashboard should show **Agent Status: Connected** with current metrics or a current data timestamp.

## Verify the installation

Check pod status and Agent logs, then verify Agent connectivity and current metrics in the Dashboard.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Resolve scheduling, storage, Secret, database permission, or connection errors before you re-run the supported deployment.

## Next steps

Return to [MariaDB installation options](/installation/mariadb), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
