---
id: aws-rds
slug: /installation/mariadb/aws-rds
title: Install Releem for MariaDB on AWS RDS
---

# Install Releem for MariaDB on AWS RDS

Connect the Releem Agent to Amazon RDS for MariaDB. Configure one Agent for each DB instance endpoint you want to monitor.

## Prerequisites

Review [MariaDB permissions](/supported-databases/mariadb/required-permissions). Enable **Enhanced Monitoring** on the instance; it supplies system metrics. Confirm these settings are active on the running RDS instance so Releem can collect database and query data:

```ini
performance_schema=ON
slow_query_log=ON
```

Dashboard latency is required for a complete installation. Confirm that Performance Schema is active and the Agent can read `performance_schema.events_statements_summary_by_digest`. Review the [MariaDB query permissions](/supported-databases/mariadb/required-permissions#monitoring-and-query-visibility) before enabling Query Optimization. If [Database Insights manages Performance Schema](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.EnableMySQL.html), check its effective value on the instance.

The Agent needs outbound HTTPS and access to the RDS endpoint on its database port. The RDS security group must accept that database connection from the Agent security group or exact Agent address. This applies to both the CloudFormation and EC2 installations.

### Prepare the DB parameter group

Create a custom DB parameter group for the instance's engine family and assign it to the RDS instance. Both CloudFormation and EC2 installations need this group to apply recommended configuration; the CloudFormation template requires its name. Set the required Performance Schema values, reboot if RDS reports a pending reboot, and confirm the group is **In sync**. A default group cannot be modified. Check whether other instances or clusters share the group; a change affects every resource using it.

If you intentionally use EC2 for monitoring only, the assigned group can remain unchanged when the required settings are active. Releem can show recommendations, but it cannot apply them through that installation until a custom group and the access below are in place. To apply a recommendation yourself, follow [manual application for MariaDB on AWS RDS](/recommendations/configuration-tuning/apply-manually/mariadb?platform=aws-rds).

### Give the EC2 Agent access to the parameter group

Attach an EC2 IAM role with `logs:Get*`, `rds:Describe*`, `ec2:Describe*`, and `cloudwatch:Get*` for monitoring. To make Releem's **Apply** action available, grant [`rds:ModifyDBParameterGroup`](https://docs.aws.amazon.com/service-authorization/latest/reference/list_rds.html) on the assigned custom group ARN (`arn:aws:rds:[REGION]:[ACCOUNT_ID]:pg:[ASSIGNED_INSTANCE_PARAMETER_GROUP]`). Granting these permissions does not apply a recommendation; you still choose and approve the change in Releem. Omit the write actions only when you intend to use a monitoring-only Agent and apply changes manually.

## Automatic installation {#automatic-installation}

Use the Releem CloudFormation template to run the Agent in AWS Fargate:

1. Create the `releem` database account.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same AWS Region as the RDS instance.
4. Enter the RDS instance ID, database user, security groups, subnets, the assigned **DBParameterGroup**, and a current `releem/releem-agent:[VERSION]` image. Set **QueryOptimization** to `true`.
5. Supply the API key and database password through AWS Secrets Manager ARNs when available.
6. Create the stack and wait for `CREATE_COMPLETE`.

Use these exact CloudFormation field values:

- **DatabaseType**: `mysql`. The Agent uses its MySQL-compatible collector for MariaDB.
- **DBID**: the RDS DB instance identifier. Deploy one stack per instance.
- **DBUser** and **DBPassword**: the monitoring account. **APIKey** identifies the server in Releem.
- **DBSSLMode**: `true` when the instance requires SSL.
- **DBParameterGroup**: the exact attached custom instance group.
- **DBClusterParameterGroup**: leave empty; this guide uses non-Aurora RDS for MariaDB.
- **Image**, **SecurityGroupIDs**, **SubnetIDs**, and **QueryOptimization**: the image, network settings, and query collection choice described above.

The CloudFormation template will create roles to run Releem Agent with the following permissions:
- logs:Get*
- rds:Describe*
- cloudwatch:Get*
- ecr:GetAuthorizationToken
- ecr:BatchCheckLayerAvailability
- ecr:GetDownloadUrlForLayer
- ecr:BatchGetImage
- secretsmanager:GetSecretValue
- logs:CreateLogStream
- logs:PutLogEvents
- rds:ModifyDBParameterGroup
- rds:ModifyDBClusterParameterGroup

The cluster-group permission is part of the shared template and is not used for RDS MariaDB. Review those change permissions before creating the stack. If the Agent must have monitoring-only AWS access, use the EC2 method with a read-only IAM role instead.

## Manual installation {#manual-installation}

Install the Agent on an EC2 instance that can reach RDS. Attach the [IAM role described above](#give-the-ec2-agent-access-to-the-parameter-group) so the Agent can collect metrics and apply a configuration when you approve it. You can install the Agent directly on EC2 or run it in Docker.

### Install directly on EC2

Open a private root shell and run this command. Replace the bracketed placeholders with your values. The shared installer uses `RELEEM_MYSQL_*` variable names for MariaDB connections.

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_INSTANCE_PARAMETER_GROUP]" RELEEM_MYSQL_PASSWORD='[MONITORING_PASSWORD]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

### Installer parameters

- `RELEEM_API_KEY` is the API key for the Releem account, available on the Releem Portal Profile page.
- `RELEEM_AWS_REGION` is the RDS Region.
- `RELEEM_AWS_RDS_DB` is the RDS DB instance identifier.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the parameter group assigned to the instance. Releem can modify a custom group only with separately approved IAM access.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the MariaDB connection.
- `RELEEM_DB_MEMORY_LIMIT` sets the database memory allocation in MB. The default `0` uses all available memory; set a limit when other software shares the server.
- `RELEEM_HOSTNAME` overrides the Dashboard server name.
- `RELEEM_CRON_ENABLE=1` enables daily Agent updates on EC2. Set it to `0` if you do not want scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection. Remove this flag for baseline monitoring only.

The EC2 installer writes the Agent configuration, including the monitoring password, to `/opt/releem/releem.conf`. Keep this file readable only by authorized administrators and the Agent service account.

### Run on EC2 with Docker {#ec2-docker}

Choose Docker or Docker Compose on the EC2 instance. The container uses the EC2 instance profile for AWS access. If the instance requires IMDSv2, set its metadata response hop limit to `2` or run the container with host networking before starting it; see [AWS credentials for Docker on EC2](/get-started/troubleshoot-releem-agent#docker-on-ec2-aws-credentials).

Replace every bracketed value.

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
  -e AWS_RDS_PARAMETER_GROUP="[ASSIGNED_INSTANCE_PARAMETER_GROUP]" \
  -e RELEEM_QUERY_OPTIMIZATION="true" \
  --restart unless-stopped \
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
      AWS_RDS_PARAMETER_GROUP: "[ASSIGNED_INSTANCE_PARAMETER_GROUP]"
      RELEEM_QUERY_OPTIMIZATION: "true"
    restart: unless-stopped
```

```bash
docker compose up -d
```

Use a version listed on [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). Keep a Compose file containing credentials out of version control. The container uses the EC2 instance profile for AWS access, so attach the required IAM role to the EC2 instance.

`DB_USER` and `DB_PASSWORD` select the monitoring account. `AWS_REGION`, `AWS_RDS_DB`, `AWS_RDS_PARAMETER_GROUP` are the Docker equivalents of the installer parameters. `RELEEM_API_KEY` identifies the server in Releem and `RELEEM_HOSTNAME` supplies its Dashboard name.

To monitor another RDS instance from the same EC2 VM, duplicate the Compose service. Give the second service and container unique names, then set its own `RELEEM_HOSTNAME`, `AWS_RDS_DB`, assigned parameter group, and database credentials. Start both services with `docker compose up -d`; each Agent should appear as a separate server in the Dashboard.

## Expected result

After installation, the Dashboard should show **Agent Status: Connected**, current metrics, and latency data.

## Verify the installation

Confirm the Agent connection, current metrics, and a populated **Latency** graph in the Dashboard. If you intend to apply a recommended configuration, also confirm that the assigned DB parameter group is custom and **In sync** and that the Agent has the approved parameter-group permissions. If any check fails, review the [Agent logs](/installation/manage-the-releem-agent/logs) and the troubleshooting steps below.

## Troubleshooting {#troubleshooting}

For a CloudFormation deployment, open **CloudWatch → Log groups** and select the Releem Agent log group. For an EC2 deployment, review the [Agent logs](/installation/manage-the-releem-agent/logs); for Docker, run `docker logs releem-agent`.

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

### EC2 Docker cannot obtain AWS credentials

Check the EC2 instance metadata options and the container's network mode as described in [AWS credentials for Docker on EC2](/get-started/troubleshoot-releem-agent#docker-on-ec2-aws-credentials).

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before retrying the installation.
