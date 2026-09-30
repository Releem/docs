---
id: aws-rds
slug: /installation/postgresql/aws-rds
title: Install Releem for PostgreSQL on AWS RDS and Aurora
---

# Install Releem for PostgreSQL on AWS RDS and Aurora

Connect the Releem Agent to Amazon RDS for PostgreSQL or Amazon Aurora PostgreSQL. Configure one Agent for each DB instance endpoint, including the writer and any readers you want to monitor.

## Prerequisites

Review [PostgreSQL managed-service permissions](/supported-databases/postgresql/required-permissions#aws-rds-and-aurora-postgresql): create the monitoring account with `pg_monitor` and `pg_read_all_data`. Do not run self-managed `pg_hba_file_rules` grants on RDS or Aurora; the internal `rdsadmin` role owns that view. Enable **Enhanced Monitoring** on the instance; it supplies system metrics. Confirm that the effective `shared_preload_libraries` list on the running instance contains `pg_stat_statements` so Releem can collect query data:

```sql
SHOW shared_preload_libraries;
```

If it is missing, add `pg_stat_statements` to the existing comma-separated list in the custom parameter group without removing other entries. For example, if the current value is `pgaudit`, set it to `pgaudit,pg_stat_statements`. Reboot when AWS reports a pending reboot.

Dashboard latency is required for a complete installation. Enable **Performance Insights / CloudWatch Database Insights** and create the `pg_stat_statements` extension in `postgres`, which the Agent uses for its statistics connection.

The Agent needs outbound HTTPS and access to the RDS endpoint on its database port. The RDS security group must accept that database connection from the Agent security group or exact Agent address. This applies to both the CloudFormation and EC2 installations.

<span id="parameter-groups"></span>

### Prepare the DB parameter group

Create a custom DB parameter group for the instance's engine family and assign it to the RDS instance. Both CloudFormation and EC2 installations need this group to apply recommended configuration; the CloudFormation template requires its name. Merge `pg_stat_statements` into `shared_preload_libraries` as described above (for Aurora, in the cluster group; see below), reboot if RDS reports a pending reboot, and confirm the group is **In sync**. A default group cannot be modified. Check whether other instances or clusters share the group; a change affects every resource using it.

If you intentionally use EC2 for monitoring only, the assigned group can remain unchanged when the required settings are active. Releem can show recommendations, but it cannot apply them through that installation until a custom group and the access below are in place. To apply a recommendation yourself, follow [manual application for PostgreSQL on AWS RDS](/recommendations/configuration-tuning/apply-manually/postgresql?platform=aws-rds).

### Aurora PostgreSQL parameter groups {#aurora-postgresql-parameter-groups}

For Aurora PostgreSQL, create both a custom **DB parameter group** for each instance and a custom **DB cluster parameter group** for the cluster. Attach both in AWS before applying recommendations. Enter the exact attached names in Releem; AWS-managed default groups cannot be modified. Leave the cluster group empty for non-Aurora RDS. Reboot an instance if AWS marks a change as pending reboot.

In Aurora PostgreSQL, `shared_preload_libraries` is a cluster-level parameter. Merge `pg_stat_statements` into it in the custom **DB cluster parameter group**, not the instance group, then reboot the writer and readers when AWS reports a pending reboot.

Use each Aurora **instance identifier** in `DBID` or `AWS_RDS_DB`, not the cluster endpoint, and run one Agent per instance. Recommendations can target either parameter group. Only the Agent targeting the writer changes cluster parameters; it needs `rds:ModifyDBClusterParameterGroup` in addition to `rds:ModifyDBParameterGroup`. Keep an Agent on the writer when you want to apply cluster recommendations.

### Give the EC2 Agent access to the parameter group

Attach an EC2 IAM role with `logs:Get*`, `rds:Describe*`, `ec2:Describe*`, and `cloudwatch:Get*` for monitoring. To make Releem's **Apply** action available, grant [`rds:ModifyDBParameterGroup`](https://docs.aws.amazon.com/service-authorization/latest/reference/list_rds.html) on the assigned custom group ARN (`arn:aws:rds:[REGION]:[ACCOUNT_ID]:pg:[ASSIGNED_INSTANCE_PARAMETER_GROUP]`). For the Aurora writer Agent, also grant `rds:ModifyDBClusterParameterGroup` on the assigned cluster group ARN (`arn:aws:rds:[REGION]:[ACCOUNT_ID]:cluster-pg:[ASSIGNED_CLUSTER_PARAMETER_GROUP]`). Granting these permissions does not apply a recommendation; you still choose and approve the change in Releem. Omit the write actions only when you intend to use a monitoring-only Agent and apply changes manually.

<span id="cloudformation"></span>

## Automatic installation {#automatic-installation}

Use the Releem CloudFormation template to run the Agent in AWS Fargate:

1. Create the `releem` database account.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same AWS Region as the RDS instance.
4. Enter the RDS instance ID, database user, security groups, subnets, the assigned **DBParameterGroup**, and a current `releem/releem-agent:[VERSION]` image. Set **QueryOptimization** to `true`.
5. Supply the API key and database password through AWS Secrets Manager ARNs when available.
6. Create the stack and wait for `CREATE_COMPLETE`.

Use these exact CloudFormation field values:

- **DatabaseType**: `postgresql` for RDS PostgreSQL and Aurora PostgreSQL. The default `mysql` selects the wrong collector.
- **DBID**: the DB instance identifier, including for Aurora. Deploy one stack per instance; do not select a cluster endpoint.
- **DBUser** and **DBPassword**: the monitoring account. **APIKey** identifies the server in Releem.
- **DBSSLMode**: `true`. The template default `false` maps to `sslmode=disable`, and RDS for PostgreSQL 15 and later rejects unencrypted connections by default (`rds.force_ssl=1`). `true` maps to `sslmode=require`.
- **DBParameterGroup**: the exact attached custom instance group.
- **DBClusterParameterGroup**: the exact attached custom Aurora cluster group. Leave empty for non-Aurora RDS.
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

Review those change permissions before creating the stack. If the Agent must have monitoring-only AWS access, use the EC2 method with a read-only IAM role instead.

## Manual installation {#manual-installation}

Install the Agent on an EC2 instance that can reach RDS. Attach the [IAM role described above](#give-the-ec2-agent-access-to-the-parameter-group) so the Agent can collect metrics and apply a configuration when you approve it. You can install the Agent directly on EC2 or run it in Docker.

<span id="ec2"></span>

### Install directly on EC2

Open a private root shell and run this command. Replace the bracketed placeholders with your values.

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_PG_TYPE=1 RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_INSTANCE_PARAMETER_GROUP]" RELEEM_PG_PASSWORD='[MONITORING_PASSWORD]' RELEEM_PG_LOGIN='releem' RELEEM_PG_SSL_MODE=true RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

For Aurora PostgreSQL, include the attached cluster group:

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_PG_TYPE=1 RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[AURORA_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_INSTANCE_PARAMETER_GROUP]" RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP="[ASSIGNED_CLUSTER_PARAMETER_GROUP]" RELEEM_PG_PASSWORD='[MONITORING_PASSWORD]' RELEEM_PG_LOGIN='releem' RELEEM_PG_SSL_MODE=true RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

Run one Agent per Aurora instance. Only the writer Agent applies cluster parameter recommendations.

### Installer parameters

- `RELEEM_API_KEY` is the API key for the Releem account, available on the Releem Portal Profile page.
- `RELEEM_AWS_REGION` is the RDS Region.
- `RELEEM_AWS_RDS_DB` is the RDS or Aurora DB instance identifier, not a cluster endpoint.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the parameter group assigned to the instance. Releem can modify a custom group only with separately approved IAM access.
- `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` is the custom cluster group attached to Aurora. Omit it for non-Aurora RDS.
- `RELEEM_PG_TYPE=1` selects PostgreSQL.
- `RELEEM_PG_LOGIN` and `RELEEM_PG_PASSWORD` configure the PostgreSQL connection.
- `RELEEM_PG_SSL_MODE=true` maps to `sslmode=require`; omission or `false` maps to `sslmode=disable`. It does not provide `verify-full` hostname and certificate verification.
- `RELEEM_DB_MEMORY_LIMIT` sets the database memory allocation in MB. The default `0` uses all available memory; set a limit when other software shares the server.
- `RELEEM_HOSTNAME` overrides the Dashboard server name.
- `RELEEM_CRON_ENABLE=1` enables daily Agent updates on EC2. Set it to `0` if you do not want scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection. Remove this flag for baseline monitoring only.

The EC2 installer writes the Agent configuration, including the monitoring password, to `/opt/releem/releem.conf`. Keep this file readable only by authorized administrators and the Agent service account.

<span id="docker"></span>

### Run on EC2 with Docker {#ec2-docker}

Choose Docker or Docker Compose on the EC2 instance. The container uses the EC2 instance profile for AWS access. If the instance requires IMDSv2, set its metadata response hop limit to `2` or run the container with host networking before starting it; see [AWS credentials for Docker on EC2](/get-started/troubleshoot-releem-agent#docker-on-ec2-aws-credentials).

Replace every bracketed value.

For Aurora PostgreSQL, set `AWS_RDS_DB` to the Aurora instance identifier and add `-e AWS_RDS_CLUSTER_PARAMETER_GROUP="[ASSIGNED_CLUSTER_PARAMETER_GROUP]"` to `docker run`, or `AWS_RDS_CLUSTER_PARAMETER_GROUP: "[ASSIGNED_CLUSTER_PARAMETER_GROUP]"` to Compose `environment:`. `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` is an alias. Run one container per instance. Only the writer container applies cluster parameters; omit the cluster group for non-Aurora RDS.

**Docker**

```bash
docker run -d --name releem-agent \
  -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
  -e RELEEM_HOSTNAME="[SERVER_NAME]" \
  -e PG_USER="releem" \
  -e PG_PASSWORD="[MONITORING_PASSWORD]" \
  -e PG_SSL="true" \
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
      PG_USER: "releem"
      PG_PASSWORD: "[MONITORING_PASSWORD]"
      PG_SSL: "true"
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

`PG_USER` and `PG_PASSWORD` select the monitoring account; `PG_SSL` is the boolean SSL switch. `AWS_REGION`, `AWS_RDS_DB`, `AWS_RDS_PARAMETER_GROUP`, and `AWS_RDS_CLUSTER_PARAMETER_GROUP` are the Docker equivalents of the installer parameters. `RELEEM_API_KEY` identifies the server in Releem and `RELEEM_HOSTNAME` supplies its Dashboard name.

To monitor another RDS instance from the same EC2 VM, duplicate the Compose service. Give the second service and container unique names, then set its own `RELEEM_HOSTNAME`, `AWS_RDS_DB`, assigned parameter group, and database credentials. Start both services with `docker compose up -d`; each Agent should appear as a separate server in the Dashboard.

## Expected result

After installation, the Dashboard should show **Agent Status: Connected**, current metrics, and latency data.

## Verify the installation

Confirm the Agent connection, current metrics, a populated **Latency** graph, and query data in the Dashboard. Verify the effective `shared_preload_libraries` value and the `pg_stat_statements` extension in `postgres`. If you intend to apply a recommended configuration, also confirm that the assigned DB parameter group is custom and **In sync** and that the Agent has the approved parameter-group permissions. If any check fails, review the [Agent logs](/installation/manage-the-releem-agent/logs) and the troubleshooting steps below.

For Aurora, also confirm the exact attached custom cluster group, its status, and the writer Agent's `rds:ModifyDBClusterParameterGroup` access. Verify that each Agent targets its own DB instance identifier.

## Troubleshooting {#troubleshooting}

For a CloudFormation deployment, open **CloudWatch → Log groups** and select the Releem Agent log group. For an EC2 deployment, review the [Agent logs](/installation/manage-the-releem-agent/logs); for Docker, run `docker logs releem-agent`.

### `Failed to read log stream ... RDSOSMetrics`

Enable **Enhanced Monitoring** for the RDS instance. Confirm that the Agent identity has the documented CloudWatch Logs read access and that the instance is publishing the `RDSOSMetrics` stream. Restart only the Agent after correcting its AWS access.

### The Dashboard has no latency data

Check Performance Insights / CloudWatch Database Insights for the instance. Verify the effective `pg_stat_statements` preload, extension setup, and monitoring permissions, then confirm that the **Latency** graph receives data after database activity.

### PostgreSQL connection failed / password authentication failed

Confirm the database endpoint, user name, password, database, and SSL setting used by the Agent, and the security-group access from the Agent. Compare the account with [PostgreSQL managed-service permissions](/supported-databases/postgresql/required-permissions#aws-rds-and-aurora-postgresql). Update the credential in the Agent configuration or secret, then restart the Agent.

### `Connect: connection timed out`

Confirm that the RDS security group accepts the database port from the Agent security group or exact Agent address. Check the Agent subnet route, network ACLs, DNS resolution, and the selected RDS endpoint. Do not open the database port to all sources.

### The CloudFormation stack remains `CREATE_IN_PROGRESS`

Open the stack's **Events** tab and resolve the first failed or waiting resource. Confirm the selected subnets and security groups, Secrets Manager references, Fargate task startup, outbound HTTPS access, RDS connectivity, Enhanced Monitoring, and Database Insights. Confirm that **DatabaseType** is `postgresql` and **DBSSLMode** is `true`. Review the ECS service and stopped-task reason before retrying or replacing the stack.

### EC2 Docker cannot obtain AWS credentials

Check the EC2 instance metadata options and the container's network mode as described in [AWS credentials for Docker on EC2](/get-started/troubleshoot-releem-agent#docker-on-ec2-aws-credentials).

### Aurora apply fails because the cluster parameter group is missing or does not match

Create and attach a custom DB cluster parameter group. Set `DBClusterParameterGroup`, `AWS_RDS_CLUSTER_PARAMETER_GROUP`, or `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` to that exact name. Default groups cannot be modified. Check the writer Agent's scoped `rds:ModifyDBClusterParameterGroup` access.

### Cluster parameters are not applied on a reader

Only the Agent targeting the writer modifies cluster parameters. Keep an Agent on the writer instance and verify its configured instance identifier and attached groups.

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before retrying the installation.
