---
id: aws-rds
slug: /installation/mariadb/aws-rds
title: Install Releem for MariaDB on AWS RDS
---

# Install Releem for MariaDB on AWS RDS

Connect the Releem Agent to Amazon RDS for MariaDB.

## Prerequisites

Use an RDS for MariaDB version within Releem's supported MariaDB range. Review [MariaDB permissions](/supported-databases/mariadb/required-permissions). Enhanced Monitoring supplies system metrics. Confirm these settings are active on the running RDS instance so Releem can collect database and query data:

```ini
performance_schema=ON
slow_query_log=ON
```

Confirm that Performance Schema is active and the Agent can read `performance_schema.events_statements_summary_by_digest`. Review the [MariaDB query permissions](/supported-databases/mariadb/required-permissions#monitoring-and-query-visibility) before enabling Query Optimization.

### Prepare the DB parameter group

For CloudFormation installation, create a custom DB parameter group for the instance's engine family and assign it to the RDS instance. The template requires that group's name. Set the required Performance Schema values, reboot if RDS reports a pending reboot, and confirm the group is **In sync**. A default group cannot be modified.

For a monitoring-only EC2 installation, you can use the group already assigned to the instance if the required settings are active. Applying Releem configuration later requires an assigned custom group and separate state-changing IAM access.

Monitoring can use read actions such as `logs:Get*`, `rds:Describe*`, and `cloudwatch:Get*`. Add `rds:ModifyDBParameterGroup` only when you want Releem to apply approved configuration changes through the selected parameter group.

## Automatic installation {#automatic-installation}

Use the Releem CloudFormation template to run the Agent in AWS Fargate:

1. Create the `releem` database account for the Agent.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same AWS Region as the RDS instance.
4. Keep **DatabaseType** set to `mysql`. The Agent uses its MySQL-compatible collector for MariaDB.
5. Enter the RDS instance ID, database user, security groups, subnets, the assigned **DBParameterGroup**, and a current `releem/releem-agent:[VERSION]` image. Set **QueryOptimization** to `true`.
6. Supply the API key and database password through AWS Secrets Manager ARNs when available.
7. Create the stack and wait for `CREATE_COMPLETE`.

The Agent security group needs outbound HTTPS and access to the RDS endpoint on its database port. The RDS security group must accept that database connection from the Agent security group.

The linked CloudFormation template's Agent task role includes `rds:ModifyDBParameterGroup` and `rds:ModifyDBClusterParameterGroup` with `Resource: *`. Review those change permissions before creating the stack. If the Agent must have monitoring-only AWS access, use the EC2 method with a read-only IAM role instead.

## Manual installation {#manual-installation}

Install the Agent on an EC2 instance that can reach RDS. Attach an IAM role with the read actions required for RDS, CloudWatch, and logs. You can install the Agent directly on EC2 or run it in Docker.

### Install directly on EC2

Open a private root shell and run this command. Replace the bracketed placeholders with your values. The shared installer uses `RELEEM_MYSQL_*` variable names for MariaDB connections:

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_PARAMETER_GROUP]" RELEEM_MYSQL_PASSWORD='[MONITORING_PASSWORD]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

### Installer parameters

- `RELEEM_AWS_REGION` is the RDS Region.
- `RELEEM_AWS_RDS_DB` is the RDS instance identifier.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the parameter group assigned to the instance. Releem can modify a custom group only with separately approved IAM access.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the MariaDB connection.
- `RELEEM_CRON_ENABLE=1` enables daily Agent updates on EC2. Set it to `0` if you do not want scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection. Remove this flag for baseline monitoring only.

### Run on EC2 with Docker {#ec2-docker}

Choose Docker or Docker Compose on the EC2 instance. Replace every bracketed value.

**Docker**

```bash
docker run -d --name releem-agent \
  -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
  -e RELEEM_HOSTNAME="[SERVER_NAME]" \
  -e DB_USER="releem" \
  -e DB_PASSWORD="[MONITORING_PASSWORD]" \
  -e INSTANCE_TYPE="aws/rds" \
  -e AWS_REGION="[AWS_REGION]" \
  -e AWS_RDS_DB="[RDS_INSTANCE_ID]" \
  -e AWS_RDS_PARAMETER_GROUP="[ASSIGNED_PARAMETER_GROUP]" \
  -e RELEEM_QUERY_OPTIMIZATION="true" \
  releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

**Docker Compose**

```yaml
services:
  releem-agent:
    image: "releem/releem-agent:[VERSION_FROM_DOCKER_HUB]"
    container_name: releem-agent
    environment:
      RELEEM_API_KEY: "[RELEEM_API_KEY]"
      RELEEM_HOSTNAME: "[SERVER_NAME]"
      DB_USER: "releem"
      DB_PASSWORD: "[MONITORING_PASSWORD]"
      INSTANCE_TYPE: "aws/rds"
      AWS_REGION: "[AWS_REGION]"
      AWS_RDS_DB: "[RDS_INSTANCE_ID]"
      AWS_RDS_PARAMETER_GROUP: "[ASSIGNED_PARAMETER_GROUP]"
      RELEEM_QUERY_OPTIMIZATION: "true"
    restart: unless-stopped
```

```bash
docker compose up -d
```

Use a version listed on [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). Keep a Compose file containing credentials out of version control. The container uses the EC2 instance profile for AWS access, so attach the required IAM role to the EC2 instance.

To monitor another RDS instance from the same EC2 VM, duplicate the Compose service. Give the second service and container unique names, then set its own `RELEEM_HOSTNAME`, `AWS_RDS_DB`, assigned parameter group, and database credentials. Start both services with `docker compose up -d`; each Agent should appear as a separate server in the Dashboard.

## Expected result

After installation, the Dashboard should show **Agent Status: Connected**, current metrics, and latency data.

## Verify the installation

Confirm the Agent connection, current metrics, and a populated **Latency** graph in the Dashboard. If you intend to apply a recommended configuration, also confirm that the assigned DB parameter group is custom and **In sync** and that the Agent has the approved parameter-group permissions. If any check fails, review the [Agent logs](/installation/manage-the-releem-agent/logs) and the troubleshooting steps below.

## Troubleshooting

For a CloudFormation deployment, open **CloudWatch → Log groups** and select the Releem Agent log group. For an EC2 deployment, review the [Agent logs](/installation/manage-the-releem-agent/logs).

### `Failed to read log stream ... RDSOSMetrics`

Enable **Enhanced Monitoring** for the RDS instance. Confirm that the Agent identity has the documented CloudWatch Logs read access and that the instance is publishing the `RDSOSMetrics` stream. Restart only the Agent after correcting its AWS access.

### The Dashboard has no latency data

Check that Performance Schema is `ON` on the running instance and that the Agent can read `performance_schema.events_statements_summary_by_digest`. If Performance Schema is off, follow [AWS's enablement procedure](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.EnableMySQL.html) and reboot as required. After database queries run, confirm that the **Latency** graph receives data.

### `Error 1045 (28000): Access denied for user 'releem'`

Confirm the database endpoint, user name, password, and the exact host from which the Agent connects. Compare the account with [MariaDB Required Permissions](/supported-databases/mariadb/required-permissions) and verify its effective host-specific grants. Update the credential in the Agent configuration or secret, then restart the Agent. Do not create an unrestricted `'releem'@'%'` account as a shortcut.

### `Connect: connection timed out`

Confirm that the RDS security group accepts the database port from the Agent security group or exact Agent address. Check the Agent subnet route, network ACLs, DNS resolution, and the selected RDS endpoint. Do not open the database port to all sources.

### The CloudFormation stack remains `CREATE_IN_PROGRESS`

Open the stack's **Events** tab and resolve the first failed or waiting resource. Confirm the selected subnets and security groups, Secrets Manager references, Fargate task startup, outbound HTTPS access, RDS connectivity, Enhanced Monitoring, and Database Insights. Review the ECS service and stopped-task reason before retrying or replacing the stack.

### `Error 1142 (42000): SELECT command denied ... events_statements_history`

The Agent account cannot read the Performance Schema statement history required for the selected feature. Compare its effective grants with [MariaDB query permissions](/supported-databases/mariadb/required-permissions#additional-database-permissions-required). Apply only the permissions required for the enabled feature and exact Agent source, then restart the Agent.

### `performance_schema_*` settings are not applied

Check the effective Performance Schema value on the running instance and the status of its assigned parameter group. If the effective value is off, follow [AWS's enablement procedure](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.EnableMySQL.html) and reboot as required. When Database Insights manages Performance Schema, the parameter-group value alone may not show the effective value.

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before retrying the installation.
