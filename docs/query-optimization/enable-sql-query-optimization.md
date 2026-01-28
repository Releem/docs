---
id: "enable-sql-query-optimization"
title: "Enable SQL Query Optimization"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Enable SQL Query Optimization

To enable the SQL Query Optimization feature, please select your installation type and follow the instructions below. Once enabled, you'll see the first automatic SQL Query Recommendation in one week.

<Tabs>
  <TabItem value="linux" label="Linux" default>

  ### Automatic Installation

  Note: If your server is already installed, you can use automatic installation, as it won't add a new server if it has the same hostname.

  1. Click "Add Server" link at Releem Customer Portal.
  2. Select the installation type.
  3. Modify the one-step installation command and the following environment variable:
     ```bash
     RELEEM_QUERY_OPTIMIZATION=true
     ```
  4. Run the modified installation command on your server.

  If the server is already added, you can copy the following command, change the MySQL root password, and run it:
  ```bash
  RELEEM_MYSQL_ROOT_PASSWORD='password' /bin/bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)" enable_query_optimization
  ```

  ### Manual Installation

  If your server is already installed, please do the following steps:

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Add `query_optimization=true` setting to the `/opt/releem/releem.conf`.
  3. Restart Releem Agent using the following command:
     ```bash
     systemctl restart releem-agent
     ```
  4. Run the following command:
     ```bash
     /opt/releem/mysqlconfigurer.sh -p
     ```

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Set the following MySQL variables in the Parameter Group to allow Releem to collect more queries for optimization:
     ```ini
     performance_schema = 1
     ```
  3. Update the already installed Releem Agent:
     1. Select CloudFormation Stack - releem-agent, click the **Update** button.
     2. Select "Replace existing template".
     3. Paste in "Amazon S3 URL" the URL `https://releem.s3.amazonaws.com/test/releem-agent-cloudformation.yml` and click **Next**.
     4. Change the option "QueryOptimization" to true and click **Next**.
     5. Click **Next** and **Submit**.

  </TabItem>
  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL" default>

  ### Docker Installation

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Re-install Releem Agent with `RELEEM_QUERY_OPTIMIZATION=true` environment variable enabled.

  Ensure that the `RELEEM_HOSTNAME` variable should be the same as the currently added server.


  ### Manual Installation

  If your server is already installed, please do the following steps:

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Add `query_optimization=true` setting to the `/opt/releem/releem.conf`.
  3. Restart Releem Agent using the following command:
     ```bash
     systemctl restart releem-agent
     ```
  4. Run the following command:
     ```bash
     /opt/releem/mysqlconfigurer.sh -p
     ```

  </TabItem>
  <TabItem value="docker" label="Docker">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Re-install Releem Agent with `RELEEM_QUERY_OPTIMIZATION=true` environment variable enabled.

  Ensure that the `RELEEM_HOSTNAME` variable should be the same as the currently added server. If you don't configure automatic applying of configuration, then please add the following MySQL variables to the configuration:

  ```ini
  performance-schema-consumer-events-statements-history = ON
  performance-schema-consumer-events-statements-current = ON
  ```

  </TabItem>
  <TabItem value="windows" label="Windows" default>

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Add `query_optimization=true` setting to the `C:\ProgramData\ReleemAgent\releem.conf`.
  3. Add the following MySQL variables to the configuration and restart DB service:

  ```ini
  performance-schema-consumer-events-statements-history = ON
  performance-schema-consumer-events-statements-current = ON
  ```
  4. Restart Releem Agent using the following command:
     
   ```bash
   systemctl restart releem-agent
   ```

  </TabItem>
</Tabs>

## Additional Database Permissions Required

The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.

## Data Collection and Analysis

Once the SQL Query Optimization feature is enabled, Releem will automatically collect and save the EXPLAIN outputs of the top 100 queries and the top 100 slowest queries. This data helps in analyzing the execution plan of queries and optimizing them further.

An example of the EXPLAIN output collected by Releem is provided below:
```json
{
  "query_block": {
    "select_id": 1,
    "cost_info": {
      "query_cost": "0.60"
    },
    "table": {
      "table_name": "sale_internals_order_discount",
      "access_type": "ref",
      "possible_keys": [
        "IX_SALE_ORDER_DSC_HASH"
      ],
      "key": "IX_SALE_ORDER_DSC_HASH",
      "used_key_parts": [
        "DISCOUNT_HASH"
      ],
      "key_length": "98",
      "ref": [
        "const"
      ],
      "rows_examined_per_scan": 1,
      "rows_produced_per_join": 1,
      "filtered": "100.00",
      "cost_info": {
        "read_cost": "0.50",
        "eval_cost": "0.10",
        "prefix_cost": "0.60",
        "data_read_per_join": "1K"
      },
      "used_columns": [
        "ID",
        "MODULE_ID",
        "DISCOUNT_ID",
        "NAME",
        "DISCOUNT_HASH",
        "CONDITIONS",
        "UNPACK",
        "ACTIONS",
        "APPLICATION",
        "USE_COUPONS",
        "SORT",
        "PRIORITY",
        "LAST_DISCOUNT",
        "ACTIONS_DESCR"
      ]
    }
  }
}
```
