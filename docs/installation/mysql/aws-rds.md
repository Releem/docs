---
id: aws-rds
slug: /installation/mysql/aws-rds
title: Install Releem for MySQL on AWS RDS
---

# Install Releem for MySQL on AWS RDS

Connect the Releem Agent to Amazon RDS for MySQL.

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Enhanced Monitoring supplies system metrics. Confirm these settings are active on the running RDS instance so Releem can collect database and query data:

   ```ini
   performance_schema=ON
   slow_query_log=ON
   ```

Dashboard latency is required for a complete installation. Confirm that Performance Schema is active and the Agent can read `performance_schema.events_statements_summary_by_digest`. Review the [MySQL query permissions](/supported-databases/mysql/required-permissions#monitoring-and-query-visibility) before enabling Query Optimization. If [Database Insights manages Performance Schema](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.EnableMySQL.html), check its effective value on the instance.

### Prepare the DB parameter group

Use the name of the DB parameter group actually assigned to this RDS instance in the installation settings below. If you need to change Performance Schema settings or apply Releem configuration, create a custom group for the instance's engine family, set the required parameters, assign it to the instance, and reboot when RDS reports a pending reboot. A default group cannot be modified. Confirm that the group reports **In sync** before relying on its settings.

### Separate monitoring from configuration authority

Monitoring can use read actions such as `logs:Get*`, `rds:Describe*`, and `cloudwatch:Get*`. Applying a database configuration requires separate state-changing authority and an approved parameter group. Do not add configuration-changing authority to a monitoring-only role.

## Automatic installation {#automatic-installation}

Use the Releem CloudFormation template to run the Agent in AWS Fargate:

1. Create the `releem` database account.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same AWS Region as the RDS instance.
4. Enter the RDS instance ID, database user, security groups, subnets, the assigned **DBParameterGroup**, and a current `releem/releem-agent:[VERSION]` image. Set **QueryOptimization** to `true`.
5. Supply the API key and database password through AWS Secrets Manager ARNs when available.
6. Create the stack and wait for `CREATE_COMPLETE`.

The Agent security group needs outbound HTTPS and access to the RDS endpoint on its database port. The RDS security group must accept that database connection from the Agent security group.

The linked CloudFormation template's Agent task role includes `rds:ModifyDBParameterGroup` and `rds:ModifyDBClusterParameterGroup` with `Resource: *`. Review those change permissions before creating the stack. If the Agent must have monitoring-only AWS access, use the EC2 method with a read-only IAM role instead.

## Manual installation {#manual-installation}

Install the Agent on an EC2 instance that can reach RDS. Attach an IAM role with the read actions required for RDS, CloudWatch, and logs. Add `rds:ModifyDBParameterGroup` only when you want Releem to apply approved configuration changes. You can install the Agent directly on EC2 or run it in Docker.

### Install directly on EC2

Open a private root shell and run this command. Replace the bracketed placeholders with your values.

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_PARAMETER_GROUP]" RELEEM_MYSQL_PASSWORD='[MONITORING_PASSWORD]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

### Installer parameters

- `RELEEM_AWS_REGION` is the RDS Region.
- `RELEEM_AWS_RDS_DB` is the RDS instance identifier.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the parameter group assigned to the instance. Releem can modify a custom group only with separately approved IAM access.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the database connection.
- `RELEEM_CRON_ENABLE=1` enables daily Agent updates on EC2. Set it to `0` if you do not want scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection. Remove this flag for baseline monitoring only.

### Run on EC2 with Docker {#ec2-docker}

Create a private `.env` file on the EC2 instance. Replace every bracketed value:

```text
RELEEM_API_KEY=[RELEEM_API_KEY]
RELEEM_HOSTNAME=[SERVER_NAME]
DB_USER=releem
DB_PASSWORD=[MONITORING_PASSWORD]
INSTANCE_TYPE=aws/rds
AWS_REGION=[AWS_REGION]
AWS_RDS_DB=[RDS_INSTANCE_ID]
AWS_RDS_PARAMETER_GROUP=[ASSIGNED_PARAMETER_GROUP]
RELEEM_QUERY_OPTIMIZATION=true
```

Restrict the file, then choose Docker or Docker Compose.

```bash
chmod 600 .env
```

**Docker**

```bash
docker run -d --name releem-agent --env-file .env releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

**Docker Compose**

```yaml
services:
  releem-agent:
    image: releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
    container_name: releem-agent
    env_file: .env
    restart: unless-stopped
```

```bash
docker compose up -d
```

Use a version listed on [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). Keep `.env` out of version control. The container uses the EC2 instance profile for AWS access, so attach the required IAM role to the EC2 instance.

## Expected result

After installation, the Dashboard should show **Agent Status: Connected**, current metrics, and latency data.

## Verify the installation

Confirm the Agent connection, current metrics, and a populated **Latency** graph in the Dashboard. If any is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs) and the troubleshooting steps below.

## Troubleshooting

For a CloudFormation deployment, open **CloudWatch → Log groups** and select the Releem Agent log group. For an EC2 deployment, review the [Agent logs](/installation/manage-the-releem-agent/logs).

### `Failed to read log stream ... RDSOSMetrics`

Enable **Enhanced Monitoring** for the RDS instance. Confirm that the Agent identity has the documented CloudWatch Logs read access and that the instance is publishing the `RDSOSMetrics` stream. Restart only the Agent after correcting its AWS access.

### The Dashboard has no latency data

Check that Performance Schema is `ON` on the running instance and that the Agent can read `performance_schema.events_statements_summary_by_digest`. If Performance Schema is off, follow [AWS's enablement procedure](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.EnableMySQL.html) and reboot as required. After database queries run, confirm that the **Latency** graph receives data.

### `Error 1045 (28000): Access denied for user 'releem'`

Confirm the database endpoint, user name, password, and the exact host from which the Agent connects. Compare the account with [MySQL Required Permissions](/supported-databases/mysql/required-permissions) and verify its effective host-specific grants. Update the credential in the Agent configuration or secret, then restart the Agent. Do not create an unrestricted `'releem'@'%'` account as a shortcut.

### `Connect: connection timed out`

Confirm that the RDS security group accepts the database port from the Agent security group or exact Agent address. Check the Agent subnet route, network ACLs, DNS resolution, and the selected RDS endpoint. Do not open the database port to all sources.

### The CloudFormation stack remains `CREATE_IN_PROGRESS`

Open the stack's **Events** tab and resolve the first failed or waiting resource. Confirm the selected subnets and security groups, Secrets Manager references, Fargate task startup, outbound HTTPS access, RDS connectivity, Enhanced Monitoring, and Database Insights. Review the ECS service and stopped-task reason before retrying or replacing the stack.

### `Error 1142 (42000): SELECT command denied ... events_statements_history`

The Agent account cannot read the Performance Schema statement history required for the selected feature. Compare its effective grants with [MySQL query permissions](/supported-databases/mysql/required-permissions#additional-database-permissions-required). Apply only the permissions required for the enabled feature and exact Agent source, then restart the Agent.

### `performance_schema_*` settings are not applied

Check the effective Performance Schema value on the running instance and the status of its assigned parameter group. If the effective value is off, follow [AWS's enablement procedure](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.EnableMySQL.html) and reboot as required. When Database Insights manages Performance Schema, the parameter-group value alone may not show the effective value.

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before retrying the installation.
