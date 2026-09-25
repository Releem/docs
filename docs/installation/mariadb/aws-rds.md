---
id: aws-rds
slug: /installation/mariadb/aws-rds
title: Install Releem for MariaDB on AWS RDS
---

# Install Releem for MariaDB on AWS RDS

Connect the Releem Agent to Amazon RDS for MariaDB.

## Prerequisites

Use an RDS for MariaDB version within Releem's supported MariaDB range. Review [MariaDB permissions](/supported-databases/mariadb/required-permissions). Enhanced Monitoring supplies system metrics. Performance Schema and the slow query log supply database and query data when those features are enabled in the RDS parameter group:

```ini
performance_schema=ON
slow_query_log=ON
```

Monitoring can use read actions such as `logs:Get*`, `rds:Describe*`, and `cloudwatch:Get*`. Add `rds:ModifyDBParameterGroup` only when you want Releem to apply approved configuration changes through the selected parameter group.

## Automatic installation {#automatic-installation}

Use the Releem CloudFormation template to run the Agent in AWS Fargate:

1. Create the `releem` database account for the Agent.
2. Open the [Releem CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent).
3. Select the same AWS Region as the RDS instance.
4. Keep **DatabaseType** set to `mysql`. The Agent uses its MySQL-compatible collector for MariaDB.
5. Enter the RDS instance ID, database user, security groups, subnets, parameter group, and a current `releem/releem-agent:[VERSION]` image.
6. Supply the API key and database password through AWS Secrets Manager ARNs when available.
7. Create the stack and wait for `CREATE_COMPLETE`.

The Agent security group needs outbound HTTPS and access to the RDS endpoint on its database port. The RDS security group must accept that database connection from the Agent security group.

## Manual installation {#manual-installation}

Install the Agent on an EC2 instance that can reach RDS. Attach an IAM role with the read actions required for RDS, CloudWatch, and logs. You can install the Agent directly on EC2 or run it in Docker.

### Install directly on EC2

Run the command in a private administrative session and enter secrets at the masked prompts. The shared installer uses `RELEEM_MYSQL_*` variable names for MariaDB connections:

```bash
sudo bash -c '
set -euo pipefail
installer=$(mktemp)
trap "rm -f \"$installer\"" EXIT
read -r -s -p "Releem API key: " RELEEM_API_KEY
printf "\n"
read -r -s -p "Monitoring database password: " RELEEM_MYSQL_PASSWORD
printf "\n"
export RELEEM_API_KEY RELEEM_MYSQL_PASSWORD RELEEM_MYSQL_LOGIN="releem"
export RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AWS_REGION]"
export RELEEM_AWS_RDS_DB="[RDS_INSTANCE_ID]" RELEEM_AWS_RDS_PARAMETER_GROUP="releem-agent"
export RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

### Installer parameters

- `RELEEM_AWS_REGION` is the RDS Region.
- `RELEEM_AWS_RDS_DB` is the RDS instance identifier.
- `RELEEM_AWS_RDS_PARAMETER_GROUP` is the parameter group used for approved configuration changes.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the MariaDB connection.
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

After installation, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the procedure.
