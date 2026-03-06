---
id: how-to-apply-configuration-using-agent
title: How to Apply Configuration Using Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to Apply Configuration Using Agent

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

Releem Agent is equipped with an automatic rollback function. This means if any issues arise while applying a new configuration, Releem will smartly revert to the previous configuration.
