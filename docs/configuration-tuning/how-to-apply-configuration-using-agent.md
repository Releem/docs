---
id: how-to-apply-configuration-using-agent
title: How to Apply Configuration Using Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to Apply Configuration Using Agent

Use this method for self-managed MySQL, MariaDB, or Percona servers where Releem Agent is installed directly on the database host.

To apply the latest recommended configuration and allow MySQL restart when required, run:


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

Releem Agent is equipped with an automatic rollback function. This means if any issues arise while applying a new configuration, Releem will smartly revert to the previous configuration.


## Cloud-Managed Databases

For AWS RDS, GCP Cloud SQL, and Azure Database for MySQL, apply recommended configuration from the Releem Portal. The agent receives the task from the portal and uses the cloud provider API to update database parameters.
