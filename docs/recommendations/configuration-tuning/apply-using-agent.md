---
id: apply-using-agent
slug: /recommendations/configuration-tuning/apply-using-agent
title: How to Apply Configuration Using Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to Apply Configuration Using Agent

Use this method for self-managed MySQL, MariaDB, or Percona servers where Releem Agent is installed directly on the database host.

## Before you begin

Confirm that the database server is self-managed, uses MySQL, MariaDB, or Percona, and has Releem Agent installed directly on the database host.

## Apply the configuration

To apply the recommended configuration, run the command for your operating system:


<Tabs>
  <TabItem value="linux" label="Linux" default>
    ```bash
    bash /opt/releem/mysqlconfigurer.sh -s auto
    ```
  </TabItem>
  <TabItem value="windows" label="Windows">
    ```powershell
    & 'C:\Program Files\ReleemAgent\mysqlconfigurer.ps1' -a
    ```
  </TabItem>
</Tabs>

## Expected result

When the command completes successfully, Releem Agent has applied the recommended configuration.

If you need to return to the previous configuration, follow [How to Rollback to Previous Configuration](/recommendations/configuration-tuning/rollback).

## Cloud-Managed Databases

For AWS RDS, GCP Cloud SQL, and Azure Database for MySQL, apply recommended configuration from the Releem Portal. The agent receives the task from the portal and uses the cloud provider API to update database parameters.
