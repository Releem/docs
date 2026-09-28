---
id: aws-rds
slug: /installation/mysql/aws-rds
title: Install Releem for MySQL on AWS RDS
---

# Install Releem for MySQL on AWS RDS

Connect the Releem Agent to Amazon RDS for MySQL.

## Prerequisites

Review [MySQL permissions](/supported-databases/mysql/required-permissions). Enhanced Monitoring supplies system metrics. Performance Schema and the slow query log supply database and query data when those features are enabled:

   ```ini
   performance_schema=ON
   slow_query_log=ON
   ```

### Separate monitoring from configuration authority

Monitoring can use read actions such as `logs:Get*`, `rds:Describe*`, and `cloudwatch:Get*`. Applying a database configuration requires separate state-changing authority and an approved parameter group. Do not add configuration-changing authority to a monitoring-only role.

## Automatic installation {#automatic-installation}

Use the Releem CloudFormation template to run the Agent in AWS Fargate:

1. Create the `releem` database account.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same AWS Region as the RDS instance.
4. Enter the RDS instance ID, database user, security groups, subnets, and a current `releem/releem-agent:[VERSION]` image.
5. Supply the API key and database password through AWS Secrets Manager ARNs when available.
6. Create the stack and wait for `CREATE_COMPLETE`.

The Agent security group needs outbound HTTPS and access to the RDS endpoint on its database port. The RDS security group must accept that database connection from the Agent security group.

## Manual installation {#manual-installation}

Install the Agent on an EC2 instance that can reach RDS. Attach an IAM role with the read actions required for RDS, CloudWatch, and logs. Add `rds:ModifyDBParameterGroup` only when you want Releem to apply approved configuration changes. You can install the Agent directly on EC2 or run it in Docker.

### Install directly on EC2

Open a private root shell and run this command. Replace the bracketed placeholders with your values.

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="releem-agent" RELEEM_MYSQL_PASSWORD='[MONITORING_PASSWORD]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=0 bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

### Installer parameters

- `RELEEM_AWS_REGION` is the RDS Region.
- `RELEEM_AWS_RDS_DB` is the RDS instance identifier.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the parameter group used for approved configuration changes.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the database connection.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection after you grant the required database permissions.

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
AWS_RDS_PARAMETER_GROUP=releem-agent
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

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

For a CloudFormation deployment, open **CloudWatch → Log groups** and select the Releem Agent log group. For an EC2 deployment, review the [Agent logs](/installation/manage-the-releem-agent/logs).

### `Failed to read log stream ... RDSOSMetrics`

Enable **Enhanced Monitoring** for the RDS instance. Confirm that the Agent identity has the documented CloudWatch Logs read access and that the instance is publishing the `RDSOSMetrics` stream. Restart only the Agent after correcting its AWS access.

### The Dashboard has no latency data

Enable **Performance Insights** and set `performance_schema=ON` in the DB parameter group assigned to the instance. Apply the parameter-group change, reboot when RDS marks it as pending reboot, and confirm that current metrics arrive after the instance returns to **Available**.

### `Error 1045 (28000): Access denied for user 'releem'`

Confirm the database endpoint, user name, password, and the exact host from which the Agent connects. Compare the account with [MySQL Required Permissions](/supported-databases/mysql/required-permissions) and verify its effective host-specific grants. Update the credential in the Agent configuration or secret, then restart the Agent. Do not create an unrestricted `'releem'@'%'` account as a shortcut.

### `Connect: connection timed out`

Confirm that the RDS security group accepts the database port from the Agent security group or exact Agent address. Check the Agent subnet route, network ACLs, DNS resolution, and the selected RDS endpoint. Do not open the database port to all sources.

### The CloudFormation stack remains `CREATE_IN_PROGRESS`

Open the stack's **Events** tab and resolve the first failed or waiting resource. Confirm the selected subnets and security groups, Secrets Manager references, Fargate task startup, outbound HTTPS access, RDS connectivity, Enhanced Monitoring, and Performance Insights. Review the ECS service and stopped-task reason before retrying or replacing the stack.

### `Error 1142 (42000): SELECT command denied ... events_statements_history`

The Agent account cannot read the Performance Schema statement history required for the selected feature. Compare its effective grants with [MySQL query permissions](/supported-databases/mysql/required-permissions#additional-database-permissions-required). Apply only the permissions required for the enabled feature and exact Agent source, then restart the Agent.

### `performance_schema_*` settings are not applied

Set `performance_schema=1` explicitly in the DB parameter group assigned to the instance. Save the parameter group and reboot the instance when RDS reports a pending reboot. After the instance returns to **Available**, confirm that the parameter group is **In sync** and verify the effective database setting.

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before retrying the installation.
