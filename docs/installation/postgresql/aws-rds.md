---
id: aws-rds
slug: /installation/postgresql/aws-rds
title: Install Releem for PostgreSQL on AWS RDS and Aurora
---

# Install Releem for PostgreSQL on AWS RDS and Aurora

Connect the Releem Agent to Amazon RDS PostgreSQL or Amazon Aurora PostgreSQL. Run it in AWS Fargate with CloudFormation, directly on EC2, or in Docker on EC2. Configure one Agent for each DB instance endpoint.

## Prerequisites

Use a PostgreSQL version within [Releem's supported range](/supported-databases). Enable **Enhanced Monitoring** for system metrics and **Performance Insights / CloudWatch Database Insights** for database performance and latency metrics.

Create the monitoring account with `pg_monitor` and `pg_read_all_data`, and configure `pg_stat_statements` using [PostgreSQL managed-service permissions](/supported-databases/postgresql/required-permissions#aws-rds-and-aurora-postgresql). Preserve existing `shared_preload_libraries` entries, reboot when required, and keep the extension available in `postgres` for the Agent's statistics connection. Do not run self-managed `pg_hba_file_rules` grants on RDS or Aurora; the internal `rdsadmin` role owns that view.

The Agent security group needs outbound HTTPS and access to the DB instance endpoint on the PostgreSQL port. Allow inbound PostgreSQL traffic from the Agent security group or exact source address in the database security group. Use subnets with connectivity to the database and required AWS services.

## Parameter groups {#parameter-groups}

Prepare custom parameter groups before installation. AWS-managed default groups cannot be modified.

For **Amazon RDS PostgreSQL**, create a custom DB parameter group for the database version and attach it as the instance's **DB parameter group**. Leave the cluster parameter group empty. Reboot when required and confirm the group is **In sync**.

For **Amazon Aurora PostgreSQL**, create and attach both a custom DB parameter group for the instance and a custom DB cluster parameter group for the cluster. The names configured in Releem must exactly match the attached groups. Recommendations can target either group. Only the Agent targeting the writer modifies cluster parameters; that Agent needs `rds:ModifyDBClusterParameterGroup`.

Check whether other instances or clusters share either group. A change affects every resource using that group, so approve its scope before applying a recommendation. Installation and permissions make **Apply** available; you still choose when to apply a recommendation.

## CloudFormation {#cloudformation}

CloudFormation runs the Agent container in AWS Fargate.

1. Complete the database account and parameter-group prerequisites above.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same Region as the DB instance.
4. Fill in the fields below.
5. Review the created IAM roles, then choose **Create Stack** and wait for `CREATE_COMPLETE`.

| Field | Value |
|---|---|
| **Image** | `releem/releem-agent:[VERSION_FROM_DOCKER_HUB]`; choose a version from [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). |
| **APIKey** | API key from the [Releem Profile page](https://app.releem.com/profile?menu=profile). Use the template's Secrets Manager ARN field when available. |
| **DBID** | RDS or Aurora **DB instance identifier**, not the cluster endpoint. Deploy one stack per instance. |
| **DatabaseType** | `postgresql` for **both RDS and Aurora PostgreSQL**. The default `mysql` selects the wrong collector. |
| **DBUser**, **DBPassword** | Monitoring account and password. Use the Secrets Manager password ARN field when available. |
| **DBSSLMode** | `true` when the instance requires SSL. It maps to `sslmode=require`. |
| **SecurityGroupIDs**, **SubnetIDs** | Agent security groups and subnets with database connectivity and outbound access to required AWS services. |
| **QueryOptimization** | `true` for query collection. |
| **DBParameterGroup** | Exact custom DB parameter group attached to the instance; required for RDS and Aurora. |
| **DBClusterParameterGroup** | Exact custom DB cluster parameter group attached to Aurora. Leave empty for non-Aurora RDS. |

The template creates roles with `logs:Get*`, `rds:Describe*`, `cloudwatch:Get*`, `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:GetDownloadUrlForLayer`, `ecr:BatchGetImage`, `rds:ModifyDBParameterGroup`, and `rds:ModifyDBClusterParameterGroup`. Its parameter-group mutation permissions use `Resource: *`; review that scope before stack creation. Use EC2 with a scoped role if you need to control those resources more narrowly.

## Install directly on EC2 {#ec2}

Attach an EC2 instance role with `rds:Describe*`, `cloudwatch:Get*`, `logs:Get*`, and `ec2:Describe*` for monitoring. Grant `rds:ModifyDBParameterGroup` on the assigned custom group ARN (`arn:aws:rds:[REGION]:[ACCOUNT_ID]:pg:[ASSIGNED_PARAMETER_GROUP]`). For the Aurora writer Agent, also grant `rds:ModifyDBClusterParameterGroup` on the assigned cluster group ARN (`arn:aws:rds:[REGION]:[ACCOUNT_ID]:cluster-pg:[ASSIGNED_CLUSTER_PARAMETER_GROUP]`).

Run the applicable one-command installer as `root`. Replace every bracketed value.

**Amazon RDS PostgreSQL**

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_PG_TYPE=1 RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_PARAMETER_GROUP]" RELEEM_PG_PASSWORD='[MONITORING_PASSWORD]' RELEEM_PG_LOGIN='releem' RELEEM_PG_SSL_MODE=true RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

**Amazon Aurora PostgreSQL**

```bash
RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_PG_TYPE=1 RELEEM_AWS_REGION="[AWS_REGION]" RELEEM_AWS_RDS_DB="[AURORA_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="[ASSIGNED_PARAMETER_GROUP]" RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP="[ASSIGNED_CLUSTER_PARAMETER_GROUP]" RELEEM_PG_PASSWORD='[MONITORING_PASSWORD]' RELEEM_PG_LOGIN='releem' RELEEM_PG_SSL_MODE=true RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

Repeat for every instance you want to monitor. Select its instance identifier, rather than a cluster endpoint. Only the writer Agent applies cluster parameter recommendations.

### Installer parameters

- `RELEEM_INSTANCE_TYPE="aws/rds"` selects managed AWS collection; `RELEEM_PG_TYPE=1` selects PostgreSQL.
- `RELEEM_AWS_REGION` selects the database Region.
- `RELEEM_AWS_RDS_DB` is the RDS or Aurora DB instance identifier.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the exact attached custom instance group.
- `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` is the exact attached custom Aurora cluster group. Omit it for non-Aurora RDS.
- `RELEEM_PG_LOGIN` and `RELEEM_PG_PASSWORD` configure the monitoring account.
- `RELEEM_PG_SSL_MODE=true` maps to `sslmode=require`; omission or `false` maps to `sslmode=disable`. It does not provide `verify-full` hostname and certificate verification.
- `RELEEM_DB_MEMORY_LIMIT` sets the database memory allocation in MB; the default `0` uses all available memory.
- `RELEEM_API_KEY` identifies the server in Releem; get it from the Portal Profile page.
- `RELEEM_HOSTNAME` overrides the server name displayed in the Dashboard.
- `RELEEM_CRON_ENABLE=1` configures daily Agent updates. Set `0` only when explicitly disabling scheduled updates.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection.

Keep `/opt/releem/releem.conf` accessible only to authorized administrators and the Agent service account. See [Agent configuration](/installation/manage-the-releem-agent/configuration).

## Run on EC2 with Docker {#docker}

Complete the same database prerequisites and attach the EC2 IAM role described above. Choose Docker or Compose and replace the placeholders.

**Docker (Amazon RDS PostgreSQL)**

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
  -e AWS_RDS_PARAMETER_GROUP="[ASSIGNED_PARAMETER_GROUP]" \
  -e RELEEM_QUERY_OPTIMIZATION="true" \
  releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

For Aurora, add `-e AWS_RDS_CLUSTER_PARAMETER_GROUP="[ASSIGNED_CLUSTER_PARAMETER_GROUP]"` (alias `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP`). Run one container per instance. Only the writer container modifies cluster parameters.

**Docker Compose (Amazon Aurora PostgreSQL)**

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
      AWS_RDS_DB: "[AURORA_INSTANCE_ID]"
      AWS_RDS_PARAMETER_GROUP: "[ASSIGNED_PARAMETER_GROUP]"
      AWS_RDS_CLUSTER_PARAMETER_GROUP: "[ASSIGNED_CLUSTER_PARAMETER_GROUP]"
      RELEEM_QUERY_OPTIMIZATION: "true"
    restart: unless-stopped
```

Omit `AWS_RDS_CLUSTER_PARAMETER_GROUP` for non-Aurora RDS. Keep a Compose file containing credentials out of version control. Use an image version from [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

```bash
docker compose up -d
```

`PG_USER` and `PG_PASSWORD` select the monitoring account; `PG_SSL` is the boolean SSL switch described above. `INSTANCE_TYPE`, `AWS_REGION`, `AWS_RDS_DB`, `AWS_RDS_PARAMETER_GROUP`, and `AWS_RDS_CLUSTER_PARAMETER_GROUP` are the Docker equivalents of the installer parameters. The container uses the EC2 instance profile for AWS access.

To monitor multiple instances from one EC2 VM, duplicate the Compose service with unique service and container names and each instance's own `RELEEM_HOSTNAME`, `AWS_RDS_DB`, attached groups, and credentials. Start all services with `docker compose up -d`.

## Verify the installation

Confirm **Agent Status: Connected**, current database metrics, a populated **Latency** graph, and query data in the Dashboard. Verify effective `shared_preload_libraries` and the `pg_stat_statements` extension in `postgres`. Before applying a configuration, confirm both attached group names and the relevant IAM access; for Aurora cluster changes, confirm the Agent targets the writer.

## Troubleshooting {#troubleshooting}

For CloudFormation, open **CloudWatch → Log groups** and select the Agent log group. For EC2, review the [Agent logs](/installation/manage-the-releem-agent/logs); for Docker, run `docker logs releem-agent`.

### `Failed to read log stream ... RDSOSMetrics`

Enable Enhanced Monitoring for the RDS or Aurora instance and verify that the Agent can read its CloudWatch Logs stream.

### No Latency graph in the Dashboard

Check Performance Insights / CloudWatch Database Insights for the instance. Verify effective `pg_stat_statements` preload, extension setup, and monitoring permissions, then confirm data appears after database activity.

### PostgreSQL connection failed / password authentication failed

Check the monitoring password, selected instance endpoint, database, and security-group access from the Agent. Update its configured credential through your protected credential process, then restart the Agent.

### `Connect: connection timed out`

Check the database security group's inbound PostgreSQL rule from the Agent, subnet routes, network ACLs, and DNS resolution. Restrict database access to the intended Agent source.

### CloudFormation remains `CREATE_IN_PROGRESS`

Inspect the first failed or waiting resource in the stack **Events** tab and the ECS stopped-task reason. Check Enhanced Monitoring, Performance Insights / Database Insights, outbound connectivity, database security-group access, `DatabaseType=postgresql`, and the exact attached `DBParameterGroup`.

### Aurora apply fails because the cluster parameter group is missing or does not match

Create and attach a custom DB cluster parameter group. Set `DBClusterParameterGroup`, `AWS_RDS_CLUSTER_PARAMETER_GROUP`, or `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` to that exact name. Default groups cannot be modified. Check the writer Agent's scoped `rds:ModifyDBClusterParameterGroup` access.

### Cluster parameters are not applied on a reader

Only the Agent targeting the writer modifies cluster parameters. Keep an Agent on the writer instance and verify its configured instance identifier and attached groups.

For other failures, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent).
