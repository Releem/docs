---
id: "postgresql-manual-linux"
title: "PostgreSQL"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Installation Steps

Choose the installation flow that matches your setup:

<Tabs>
  <TabItem value="automatic-user-creation" label="Automatic User Creation" default>

# Automatic Installation for Self-Managed PostgreSQL Servers

Use this instruction to install Releem Agent automatically on a self-managed PostgreSQL server. The installer creates the monitoring user, enables `pg_stat_statements` when possible, and starts metrics collection.

## Prerequisites

Install the `postgresql-contrib` package for your PostgreSQL version. This package provides extensions required by Releem Agent.

## Installation Steps

1. Click **Add Server** in the Releem Customer Portal and select PostgreSQL if that option is available.
2. Run the Releem Agent installation command as a **root** user on the server:

```bash
RELEEM_PG_TYPE=1 RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

Set `RELEEM_PG_ROOT_LOGIN` and `RELEEM_PG_ROOT_PASSWORD` when the PostgreSQL superuser is not available through peer/passwordless authentication. If the password is omitted, the installer first tries peer/passwordless access and then prompts for it in the console.

**Parameters:**
- `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
- `RELEEM_PG_LOGIN` - PostgreSQL user name for collecting metrics. The installer creates `releem` when this is omitted.
- `RELEEM_PG_PASSWORD` - PostgreSQL user password for collecting metrics. The installer generates a password when this is omitted.
- `RELEEM_DB_MEMORY_LIMIT` - Change this parameter when other software is installed on the server. Default value is `0`, which means use all memory.
- `RELEEM_API_KEY` - API Key. Get it from the Profile page in Releem Customer Portal.
- `RELEEM_PG_TYPE` - set to `1` to explicitly select the PostgreSQL installation path.
- `RELEEM_PG_HOST` - use this variable when PostgreSQL listens on a different interface or is available only through a socket.
- `RELEEM_PG_PORT` - use this variable when PostgreSQL listens on a different port.
- `RELEEM_PG_DATABASE` - database used for the monitoring connection. Default value is `postgres`.
- `RELEEM_PG_SSL_MODE` - PostgreSQL SSL mode for the collector: `true` for SSL (`sslmode=require`), `false` (or omitted) for `sslmode=disable`.
- `RELEEM_PG_ROOT_LOGIN` - PostgreSQL superuser used during automatic `releem` user creation. Default value is `postgres`.
- `RELEEM_PG_ROOT_PASSWORD` - password for the PostgreSQL superuser. If omitted, the installer first tries peer/passwordless access and then prompts for the password in the console.
- `RELEEM_PG_CONF_DIR` - directory where Releem writes recommended PostgreSQL configuration. Set this when the installer cannot detect `postgresql.conf`.
- `RELEEM_QUERY_OPTIMIZATION` - set `true` if Releem Agent should collect additional information for Automatic SQL Query Optimization.

Setting `RELEEM_PG_TYPE`, `RELEEM_PG_HOST`, `RELEEM_PG_LOGIN`, `RELEEM_PG_PASSWORD`, `RELEEM_PG_ROOT_LOGIN`, or `RELEEM_PG_ROOT_PASSWORD` makes the installer use the PostgreSQL installation path.

For a full list of configuration settings, see [Releem Agent Configuration](/releem-agent/configuration).

3. Open the [Releem Dashboard](https://app.releem.com/). If the server does not appear immediately, refresh the page.

## Notes

- PostgreSQL support is enabled when `pg_user` and `pg_password` are set in the agent configuration.
- `pg_ssl_mode` in `releem.conf` is a boolean: `true` means `sslmode=require`, omitted/false means `sslmode=disable`.
- If you prefer to create the monitoring user yourself, use the [Manual](/releem-agent/installation-guides/postgresql-manual-linux) installation.

  </TabItem>
  <TabItem value="manual-user-creation" label="Manual User Creation">

# Manual Installation for Self-Managed PostgreSQL Servers

Use this instruction to install Releem Agent after you create the PostgreSQL monitoring user yourself.

## Prerequisites

Install the `postgresql-contrib` package for your PostgreSQL version. This package provides extensions required by Releem Agent.

## Installation Steps

1. Create a PostgreSQL monitoring user:

```sql
CREATE USER releem WITH PASSWORD '[Password]';
GRANT pg_monitor TO releem;
GRANT SELECT ON pg_hba_file_rules TO releem;
GRANT EXECUTE ON FUNCTION pg_hba_file_rules TO releem;
```

Enable `pg_stat_statements` for query performance metrics.

Add the following line to `postgresql.conf`:

```ini
shared_preload_libraries = 'pg_stat_statements'
```

Add the following line to `pg_hba.conf` for local agent connections:

```ini
host    all             releem          127.0.0.1/32            md5
```

Add the following line to `pg_hba.conf` for remote agent connections:

```ini
host    all             releem          0.0.0.0/0               md5
```

Restart PostgreSQL, then create the extension in the database used by Releem Agent. The default database is `postgres`:

```sql
\c postgres
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

To enable Automatic SQL Query Optimization, grant additional permissions as a PostgreSQL superuser:

```sql
-- PostgreSQL 14+
GRANT pg_read_all_data TO releem;

-- PostgreSQL 12/13
GRANT CONNECT ON DATABASE "<database_name>" TO releem;
GRANT USAGE ON SCHEMA "<schema_name>" TO releem;
GRANT SELECT ON ALL TABLES IN SCHEMA "<schema_name>" TO releem;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "<schema_name>" TO releem;
```

Replace `<database_name>` and `<schema_name>` with all monitored databases and schemas. For most self-managed deployments, start with `postgres` and `public`.

2. After the PostgreSQL user is created, run the Releem Agent installation command as a root user on the server:

```bash
RELEEM_PG_PASSWORD='[Password]' RELEEM_PG_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

**Parameters:**
- `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
- `RELEEM_PG_LOGIN` - PostgreSQL user name for collecting metrics.
- `RELEEM_PG_PASSWORD` - PostgreSQL user password for collecting metrics.
- `RELEEM_DB_MEMORY_LIMIT` - Change this parameter when other software is installed on the server. Default value is `0`, which means use all memory.
- `RELEEM_API_KEY` - API Key. Get it from the Profile page in Releem Customer Portal.
- `RELEEM_PG_TYPE` - set to `1` to explicitly select the PostgreSQL installation path.
- `RELEEM_PG_HOST` - use this variable when PostgreSQL listens on a different interface or is available only through a socket.
- `RELEEM_PG_PORT` - use this variable when PostgreSQL listens on a different port.
- `RELEEM_PG_DATABASE` - database used for the monitoring connection. Default value is `postgres`.
- `RELEEM_PG_SSL_MODE` - PostgreSQL SSL mode for the collector: `true` for SSL (`sslmode=require`), `false` (or omitted) for `sslmode=disable`.
- `RELEEM_PG_CONF_DIR` - directory where Releem writes recommended PostgreSQL configuration. Set this when the installer cannot detect `postgresql.conf`.
- `RELEEM_QUERY_OPTIMIZATION` - set `true` if Releem Agent should collect additional information for Automatic SQL Query Optimization.

For a full list of configuration settings, see [Releem Agent Configuration](/releem-agent/configuration).

3. Open the [Releem Dashboard](https://app.releem.com/). If the server does not appear immediately, refresh the page.

  </TabItem>
  <TabItem value="docker" label="Docker">

# Installation in a Docker Container on Self-Managed PostgreSQL Servers

Use this instruction to run Releem Agent in a Docker container against a self-managed PostgreSQL server. Releem Agent collects metrics and recommends configuration.

1. Create a PostgreSQL monitoring user:

```sql
CREATE USER releem WITH PASSWORD '[Password]';
GRANT pg_monitor TO releem;
GRANT SELECT ON pg_hba_file_rules TO releem;
GRANT EXECUTE ON FUNCTION pg_hba_file_rules TO releem;
```

Enable `pg_stat_statements` and create the extension in the database used by Releem Agent. The default database is `postgres`:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

To enable Automatic SQL Query Optimization, grant additional permissions as described in [Enable SQL Query Optimization](/query-optimization/enable-sql-query-optimization).

2. Run the container using Docker or Docker Compose.

   **Docker**

   ```bash
   docker run -d -ti --name 'releem-agent' \
     -e RELEEM_HOSTNAME="[Hostname]" \
     -e PG_HOST="[PG_HOST]" \
     -e PG_PORT="[PG_PORT]" \
     -e PG_PASSWORD="[PG_PASSWORD]" \
     -e PG_USER="releem" \
     -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
     -e MEMORY_LIMIT=[MEMORY_LIMIT] \
     -e RELEEM_QUERY_OPTIMIZATION=true \
     releem/releem-agent:[version]
   ```

   Use the latest version of Releem Agent from [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

   **Docker Compose**

   ```yaml
   version: '3.7'
   services:
     releem-agent:
       image: releem/releem-agent:[version]
       container_name: releem-agent
       environment:
         MEMORY_LIMIT: "${MEMORY_LIMIT}"
         PG_USER: "releem"
         RELEEM_API_KEY: "${RELEEM_API_KEY}"
         PG_PASSWORD: "${PG_PASSWORD}"
         PG_PORT: "${PG_PORT}"
         PG_HOST: "${PG_HOST}"
         RELEEM_QUERY_OPTIMIZATION: true
       restart: unless-stopped
       volumes:
         - /tmp/.mysqlconfigurer/:/tmp/.mysqlconfigurer/
         - /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/
   ```

   **Parameters:**
   - `RELEEM_HOSTNAME` - Server hostname, which should be displayed in the Releem Dashboard.
   - `RELEEM_API_KEY` - Releem API Key. Get it from the Profile page in the Releem Customer Portal.
   - `PG_USER` / `RELEEM_PG_LOGIN` - PostgreSQL user name for data collection.
   - `PG_PASSWORD` / `RELEEM_PG_PASSWORD` - PostgreSQL user password for data collection.
   - `PG_HOST` / `RELEEM_PG_HOST` - PostgreSQL host for data collection.
   - `PG_PORT` / `RELEEM_PG_PORT` - PostgreSQL port for data collection. Default value is `5432`.
   - `PG_SSL` / `RELEEM_PG_SSL_MODE` - PostgreSQL SSL mode: `true` for `sslmode=require`, `false` (or omitted) for `sslmode=disable`.
   - `MEMORY_LIMIT` - RAM limit allocated for PostgreSQL in megabytes. Set to system RAM or the limit for PostgreSQL.
   - `RELEEM_QUERY_OPTIMIZATION` - set `true` if Releem Agent should collect additional information for Automatic SQL Query Optimization.

   PostgreSQL monitoring starts when `pg_user` and `pg_password` are set. Do not set MySQL `DB_USER` and `DB_PASSWORD` in the same container if you want the agent to use the PostgreSQL collector.

   **Volumes:**
   - `/tmp/.mysqlconfigurer/`
   - `/etc/postgresql/releem.conf.d/`

3. To apply recommended PostgreSQL settings automatically, mount the Releem configuration directory into the PostgreSQL container and include it from `postgresql.conf`:

```ini
include_dir = 'conf.d'
```

**Note:** If you do not configure automatic applying of configuration, add `pg_stat_statements` to `shared_preload_libraries` and create the extension in the monitored database.

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

# Cloud-Managed AWS RDS and Aurora PostgreSQL Installation

Use this instruction to install Releem Agent automatically via CloudFormation to AWS Fargate, or manually on an EC2 instance. Releem Agent runs in a container on AWS Fargate or directly on the EC2 instance, depending on your choice.

Releem supports Amazon RDS PostgreSQL and Amazon Aurora PostgreSQL. Configure one Agent for each DB instance endpoint.

## Parameter groups

To apply recommended configuration automatically, sign in to your AWS account and prepare custom parameter groups. AWS-managed default groups cannot be modified and are not valid onboarding targets.

**Amazon RDS PostgreSQL (non-Aurora):**
- Create a custom DB parameter group for your PostgreSQL version, for example `releem-agent`.
- Attach it to the instance as **DB parameter group**.
- Leave the cluster parameter group empty.
- Reboot the instance if AWS requires it.

**Amazon Aurora PostgreSQL:**
- Create a custom DB parameter group for the instance and a custom DB cluster parameter group for the cluster.
- Attach both groups in AWS. The names you configure for Releem must match the groups attached in AWS.
- Both groups must be ready before the Agent applies recommendations. A recommendation can target either group.
- Only the Agent that targets the writer modifies cluster parameters. That Agent needs `rds:ModifyDBClusterParameterGroup` permission.

The requirements for the RDS or Aurora instance:
- Enhanced Monitoring to collect system performance metrics.
- Performance Insights to collect PostgreSQL performance metrics.
- `pg_stat_statements` in the instance or cluster parameter group, then reboot if AWS marks the change as pending reboot:

```ini
shared_preload_libraries=pg_stat_statements
```

You have the following options to install Releem Agent:

<Tabs>
  <TabItem value="cloudformation" label="CloudFormation" default>

   CloudFormation deploys the Releem Agent container with AWS Fargate. The template creates roles with the following permissions:
   - logs:Get*
   - rds:Describe*
   - cloudwatch:Get*
   - ecr:GetAuthorizationToken
   - ecr:BatchCheckLayerAvailability
   - ecr:GetDownloadUrlForLayer
   - ecr:BatchGetImage
   - rds:ModifyDBParameterGroup
   - rds:ModifyDBClusterParameterGroup

   1. Create a monitoring user in PostgreSQL:

   ```sql
   CREATE USER releem WITH PASSWORD '[Password]';
   GRANT pg_monitor TO releem;
   ```

   Skip `GRANT` on `pg_hba_file_rules`: Aurora and RDS own that view with the internal `rdsadmin` role, and a customer monitoring role cannot read it.

   To enable Automatic SQL Query Optimization, grant additional permissions:

   ```sql
   -- PostgreSQL 14+
   GRANT pg_read_all_data TO releem;
   ```

   2. Open the [CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent) in your browser, check that the correct region is selected, and fill in the following fields:
      - Image: Releem Agent Docker image in the `releem/releem-agent:[version]` format. Use the latest version available on [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).
      - APIKey: Releem API Key from the [Profile page](https://app.releem.com/profile?menu=profile) in the Releem Customer Portal.
      - DBID: RDS DB Instance ID. For Aurora, set the instance name you want to monitor, not the cluster endpoint. Deploy one stack per instance.
      - DatabaseType: set to `postgresql`.
      - DBUser: User to collect metrics from PostgreSQL, created in step 1.
      - DBPassword: Password for that user.
      - DBSSLMode: set `true` when the instance requires SSL.
      - SecurityGroupIDs: Security groups for Releem Agent. Allow all outbound traffic.
      - SubnetIDs: Subnets from which the Releem Agent container can connect to RDS.
      - QueryOptimization: set True if Releem Agent should collect additional information for Automatic SQL Query Optimization.
      - DBParameterGroup: Custom DB parameter group attached to the instance. Required for RDS and Aurora instance parameters.
      - DBClusterParameterGroup: Custom DB cluster parameter group attached to Aurora. Required for Aurora. Leave empty only for non-Aurora RDS.

   `DatabaseType` defaults to `mysql`. Select `postgresql` so the container receives PostgreSQL (`PG_*`) credentials and starts the PostgreSQL collector.

   3. Click **Create Stack**.

  </TabItem>
  <TabItem value="ec2" label="EC2">

   Use this instruction to install Releem Agent on an EC2 instance to monitor AWS RDS or Aurora PostgreSQL.

   1. Create a monitoring user in PostgreSQL:

   ```sql
   CREATE USER releem WITH PASSWORD '[Password]';
   GRANT pg_monitor TO releem;
   ```

   To enable Automatic SQL Query Optimization, grant additional permissions as in the CloudFormation tab.

   2. Add IAM role `releem-agent-role` and apply it to the EC2 instance:

      ```
      {
      "Version": "2012-10-17",
      "Statement": [
         {
            "Action": [
            "rds:Describe*",
            "cloudwatch:Get*",
            "logs:Get*",
            "ec2:Describe*",
            "rds:ModifyDBParameterGroup",
            "rds:ModifyDBClusterParameterGroup"
            ],
            "Resource": "*",
            "Effect": "Allow"
         }
      ]
      }
      ```

   3. Run the installation command as a root user on the server.

      **Amazon RDS PostgreSQL:**

      ```bash
      RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_PG_TYPE=1 RELEEM_AWS_REGION="[AwsRegion]" RELEEM_AWS_RDS_DB="[AwsRdsDBidentifier]" RELEEM_AWS_RDS_PARAMETER_GROUP="releem-agent" RELEEM_PG_PASSWORD='[Password]' RELEEM_PG_LOGIN='releem' RELEEM_PG_SSL_MODE=true RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
      ```

      **Amazon Aurora PostgreSQL:** add `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` with the custom cluster parameter group name. Set `RELEEM_AWS_RDS_DB` to the instance identifier, not the cluster endpoint. Repeat the installation for each instance you want to monitor. Only the writer Agent applies cluster parameter recommendations.

      ```bash
      RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_PG_TYPE=1 RELEEM_AWS_REGION="[AwsRegion]" RELEEM_AWS_RDS_DB="[AwsRdsDBidentifier]" RELEEM_AWS_RDS_PARAMETER_GROUP="releem-agent" RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP="releem-agent-cluster" RELEEM_PG_PASSWORD='[Password]' RELEEM_PG_LOGIN='releem' RELEEM_PG_SSL_MODE=true RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
      ```

      **Parameters:**
      - `RELEEM_AWS_REGION` - AWS region name.
      - `RELEEM_AWS_RDS_DB` - RDS or Aurora instance identifier.
      - `RELEEM_AWS_RDS_PARAMETER_GROUP` - Custom DB parameter group name. Required.
      - `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` - Custom DB cluster parameter group name. Required for Aurora. Omit for non-Aurora RDS.
      - `RELEEM_PG_LOGIN` - PostgreSQL user name to collect metrics.
      - `RELEEM_PG_PASSWORD` - PostgreSQL user password to collect metrics.
      - `RELEEM_PG_SSL_MODE` - set `true` when the instance requires SSL.
      - `RELEEM_DB_MEMORY_LIMIT` - Change this parameter when other software is installed on the server. Default value is `0`.
      - `RELEEM_API_KEY` - API Key. Get it from the Profile page in Releem Customer Portal.
      - `RELEEM_QUERY_OPTIMIZATION` - set `true` if Releem Agent should collect additional information for Automatic SQL Query Optimization.

  </TabItem>
  <TabItem value="docker" label="EC2 Docker">

   Use this instruction to run Releem Agent in a Docker container on EC2 against AWS RDS or Aurora PostgreSQL.

   1. Create a monitoring user in PostgreSQL as in the EC2 tab.

   2. Add IAM role `releem-agent-role` and apply it to the EC2 instance, including `rds:ModifyDBParameterGroup` and `rds:ModifyDBClusterParameterGroup`.

   3. Run Releem Agent using Docker or Docker Compose.

      **Docker (Amazon RDS PostgreSQL)**

      ```bash
      docker run -d -ti --name 'releem-agent' \
      -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
      -e RELEEM_HOSTNAME="[RELEEM_HOSTNAME]" \
      -e PG_USER="releem" \
      -e PG_PASSWORD="[PG_PASSWORD]" \
      -e PG_SSL="true" \
      -e INSTANCE_TYPE="aws/rds" \
      -e AWS_REGION="[AWS_REGION]" \
      -e AWS_RDS_DB="[AWS_RDS_DB]" \
      -e AWS_RDS_PARAMETER_GROUP="releem-agent" \
      -e RELEEM_QUERY_OPTIMIZATION=true \
      releem/releem-agent:[version]
      ```

      For Aurora PostgreSQL, add `-e AWS_RDS_CLUSTER_PARAMETER_GROUP="releem-agent-cluster"` (or `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP`). Run one container per instance. Only the writer container applies cluster parameter recommendations.

      **Docker Compose**

      ```yaml
      version: '3.7'

      x-common-service: &common-service
        image: releem/releem-agent:[version]
        restart: unless-stopped

      services:
        releem-agent-1:
          <<: *common-service
          container_name: releem-agent-1
          environment:
            RELEEM_API_KEY: "[RELEEM_API_KEY]"
            RELEEM_HOSTNAME: "[RELEEM_HOSTNAME]"
            PG_USER: "releem"
            PG_PASSWORD: "[PG_PASSWORD]"
            PG_SSL: "true"
            INSTANCE_TYPE: "aws/rds"
            AWS_REGION: "[AWS_REGION]"
            AWS_RDS_DB: "[AWS_RDS_DB]"
            AWS_RDS_PARAMETER_GROUP: "releem-agent"
            AWS_RDS_CLUSTER_PARAMETER_GROUP: "releem-agent-cluster"
            RELEEM_QUERY_OPTIMIZATION: true
      ```

      Leave `AWS_RDS_CLUSTER_PARAMETER_GROUP` empty or omit it for non-Aurora RDS.

      ***Parameters:***
      - `RELEEM_API_KEY`: API Key. Get it from the Profile page in Releem Customer Portal.
      - `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
      - `PG_USER`: PostgreSQL user name to collect metrics.
      - `PG_PASSWORD`: PostgreSQL user password to collect metrics.
      - `PG_SSL`: set `true` when the instance requires SSL.
      - `AWS_REGION`: AWS region name.
      - `AWS_RDS_DB`: RDS or Aurora instance identifier.
      - `AWS_RDS_PARAMETER_GROUP`: Custom DB parameter group name. Required.
      - `AWS_RDS_CLUSTER_PARAMETER_GROUP` / `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP`: Custom DB cluster parameter group name. Required for Aurora.
      - `RELEEM_QUERY_OPTIMIZATION` - set `true` if Releem Agent should collect additional information for Automatic SQL Query Optimization.

      Use the latest version of Releem Agent from [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

  </TabItem>
</Tabs>

## Common Issues for AWS RDS and Aurora PostgreSQL

To check Releem Agent logs, open CloudWatch → Log Groups and select the Releem Agent log group.

1. Failed to read log stream `%s:%s: %s` RDSOSMetrics
   - Enable Enhanced Monitoring for your RDS or Aurora instance.

2. No Latency graph on Releem Dashboard
   - Enable Performance Insights for your instance.

3. PostgreSQL connection failed / password authentication failed
   - Check the password for the Releem user and that the security group allows inbound PostgreSQL traffic from the Agent.

4. Connect: connection timed out
   - Check that the RDS or Aurora security group has an inbound rule for connections from Releem Agent.

5. CloudFormation stack is not finished, still "in progress" for a long time
   - Enable Performance Insights and Enhanced Monitoring.
   - Check that the security group for Releem Agent allows all outbound traffic.
   - Confirm `DatabaseType` is `postgresql` and that `DBParameterGroup` matches the attached instance group.

6. Aurora apply fails because the cluster parameter group is missing or does not match
   - Create a custom DB cluster parameter group, attach it to the cluster, and set `DBClusterParameterGroup` / `AWS_RDS_CLUSTER_PARAMETER_GROUP` to that exact name.
   - AWS-managed default groups cannot be modified.

7. Cluster parameters are not applied on a reader
   - Only the Agent targeting the writer modifies cluster parameters. Keep an Agent on the writer instance.

  </TabItem>
</Tabs>

## Notes

- PostgreSQL support is enabled when `pg_user` and `pg_password` are set in the agent configuration.
- `pg_stat_statements` is recommended for query performance visibility.
- `pg_ssl_mode` in `releem.conf` is a boolean: `true` means `sslmode=require`, omitted/false means `sslmode=disable`.
- On Amazon RDS and Aurora PostgreSQL, `pg_hba_file_rules` is owned by `rdsadmin` and cannot be granted to a customer monitoring role. Skip those grants and use the [RDS](/releem-agent/installation-guides/postgresql-aws-rds) guide instead.
