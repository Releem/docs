---
id: "disable-sql-query-optimization"
title: "Disable SQL Query Optimization"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Disable SQL Query Optimization

To disable the SQL Query Optimization feature, please select your installation type and follow the instructions below.

<Tabs>
  <TabItem value="linux" label="Linux" default>

  1. Edit the configuration file:
     ```bash
     nano /opt/releem/releem.conf
     ```
  2. Change the `query_optimization` setting to `false`.
  3. Restart the Releem Agent:
     ```bash
     service releem-agent restart
     ```

  </TabItem>
  <TabItem value="aws" label="AWS RDS">

  To disable the SQL Query Optimization feature for AWS RDS, you need to reinstall the Releem Agent and disable the feature in the CloudFormation template.

  </TabItem>
</Tabs>