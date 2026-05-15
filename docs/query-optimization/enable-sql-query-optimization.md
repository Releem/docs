---
id: "enable-sql-query-optimization"
title: "Enable SQL Query Optimization"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Enable SQL Query Optimization

To enable the SQL Query Optimization feature, please select your installation type and follow the instructions below. SQL Query Optimization lets Releem collect query execution plans and generate query-level recommendations. After enabling it, the first recommendations can take up to one week because Releem needs enough workload data.

<Tabs>
  <TabItem value="linux" label="Linux" default>

## Existing Linux Installation

  ### Automatic Installation


  Note: If your server is already installed, you can use automatic installation, as it won't add a new server if it has the same hostname.

Run the helper mode from the installer:

```bash
RELEEM_MYSQL_ROOT_PASSWORD='[MySQL root password]' \
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)" enable_query_optimization
```

This command updates `/opt/releem/releem.conf`, enables query optimization, and prepares the required MySQL settings.

  ### Manual Installation


If you prefer to update the agent manually:

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

## New Linux Installation

Add this environment variable to the installation command:

```bash
RELEEM_QUERY_OPTIMIZATION=true
```

  1. Click "Add Server" link at Releem Customer Portal.
  2. Select the installation type.
  3. Modify the one-step installation command and the following environment variable:
     ```bash
     RELEEM_QUERY_OPTIMIZATION=true
     ```
  4. Run the modified installation command on your server.

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Enable Performance Schema in the RDS Parameter Group to allow Releem to collect more queries for :

  ```ini
  performance_schema = 1
  ```

  3. Reboot the RDS instance if AWS marks the change as pending reboot.
  4. Enable query optimization in the agent:

  If the agent is managed by CloudFormation, update the `releem-agent` stack and set `QueryOptimization` to `true`.
     1. Select CloudFormation Stack - releem-agent, click the **Update** button.
     2. Select "Replace existing template".
     3. Paste in "Amazon S3 URL" the URL `https://releem.s3.amazonaws.com/test/releem-agent-cloudformation.yml` and click **Next**.
     4. Change the option "QueryOptimization" to true and click **Next**.
     5. Click **Next** and **Submit**.

  If the agent runs in Docker, recreate the Docker container with `RELEEM_QUERY_OPTIMIZATION=true` environment variable enabled.
  Ensure that the `RELEEM_HOSTNAME` variable should be the same as the currently added server.

  If the agent runs on EC2, set `query_optimization=true` in `/opt/releem/releem.conf` and restart the service:

  ```bash
  systemctl restart releem-agent
  ```

  </TabItem>
  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Enable Performance Schema in Cloud SQL database flags:

  ```ini
  performance_schema = 1
  ```

  3. Restart the Cloud SQL instance if required.
  4. Enable query optimization in the agent:

  If the agent runs in Docker, recreate the Docker container with `RELEEM_QUERY_OPTIMIZATION=true` environment variable enabled.
  Ensure that the `RELEEM_HOSTNAME` variable should be the same as the currently added server.

     
  If the agent runs on VM, set `query_optimization=true` in `/opt/releem/releem.conf` and restart the service:

  ```bash
  systemctl restart releem-agent
  ```

  </TabItem>
  <TabItem value="azure-mysql" label="Azure MySQL">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Enable Performance Schema on Azure Database for MySQL Flexible Server if it is disabled.
  3. Enable query optimization in the agent:

  If the agent runs in Docker, recreate the Docker container with `RELEEM_QUERY_OPTIMIZATION=true` environment variable enabled.
  Ensure that the `RELEEM_HOSTNAME` variable should be the same as the currently added server.

     
  If the agent runs on VM, set `query_optimization=true` in `/opt/releem/releem.conf` and restart the service:

  ```bash
  systemctl restart releem-agent
  ```

  </TabItem>  
  <TabItem value="docker" label="Docker">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.

  2. Recreate the agent container with query optimization enabled:

```bash
docker rm -f releem-agent
docker run -d --name releem-agent \
  -e RELEEM_QUERY_OPTIMIZATION=true \
  ... \
  releem/releem-agent:[version]
```

For Docker Compose, set:

```yaml
environment:
  RELEEM_QUERY_OPTIMIZATION: true
```

Ensure that the `RELEEM_HOSTNAME` variable should be the same as the currently added server.
If the agent cannot automatically apply MySQL settings, add these settings to MySQL configuration and restart MySQL:

```ini
performance-schema-consumer-events-statements-history = ON
performance-schema-consumer-events-statements-current = ON
```

  </TabItem>
  <TabItem value="windows" label="Windows">

  1. Grant additional permissions to the releem user. The SQL Query Optimization feature requires [Additional Permissions](/releem-agent/mysql-permissions) for the Releem Agent user.
  2. Set `query_optimization=true` in `C:\ProgramData\ReleemAgent\releem.conf`.
  3. Add these settings to MySQL configuration and restart MySQL:

  ```ini
  performance-schema-consumer-events-statements-history = ON
  performance-schema-consumer-events-statements-current = ON
  ```

  4. Restart the Releem Agent Windows service.

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
