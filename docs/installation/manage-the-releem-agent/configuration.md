---
id: configuration
slug: /installation/manage-the-releem-agent/configuration
title: "Configuration"
---

# Releem Agent Configuration

This document describes the available configuration settings for the Releem Agent. These settings are defined in the `/opt/releem/releem.conf` file.

## Configuration File

All Releem Agent settings are stored in `/opt/releem/releem.conf`. The following example shows the common settings for MySQL and PostgreSQL monitoring:

```ini
# API key for Releem Platform
apikey="[RELEEM_API_KEY]"

# Hostname for the instance. This hostname will be displayed in the Releem Dashboard
hostname=""

# Type of instance: "local", "aws/rds", "gcp/cloudsql", or "azure/mysql". Default: "local"
instance_type="local"

# AWS region for the RDS instance
aws_region="[AWS_REGION]"

# AWS RDS instance name
aws_rds_db="[RDS_INSTANCE_NAME]"

# AWS RDS parameter group name
aws_rds_parameter_group="releem-agent"

#GCP project ID for Cloud SQL instance
gcp_project_id="[GCP_PROJECT_ID]"

#GCP region for Cloud SQL instance
gcp_region="[GCP_REGION]"

#Name of Cloud SQL instance
gcp_cloudsql_instance="[GCP_CLOUDSQL_INSTANCE]"

# Azure subscription ID for Azure Database for MySQL Flexible Server
azure_subscription_id="[AZURE_SUBSCRIPTION_ID]"

# Azure resource group for Azure Database for MySQL Flexible Server
azure_resource_group="[AZURE_RESOURCE_GROUP]"

# Azure Database for MySQL Flexible Server resource name
azure_mysql_server="[AZURE_MYSQL_SERVER]"

# Database memory usage limit in MB (0 = use all available memory)
memory_limit=0

# MySQL user name for collecting metrics
mysql_user="releem"

# MySQL user password for collecting metrics
mysql_password="[MYSQL_PASSWORD]"

# MySQL host for collecting metrics
mysql_host="127.0.0.1"

# MySQL port for collecting metrics
mysql_port="3306"

# PostgreSQL user name for collecting metrics
pg_user="releem"

# PostgreSQL user password for collecting metrics
pg_password="[POSTGRESQL_PASSWORD]"

# PostgreSQL host for collecting metrics
pg_host="127.0.0.1"

# PostgreSQL port for collecting metrics
pg_port="5432"

# PostgreSQL SSL mode: false = disable, true = require
pg_ssl_mode=false

# Command to restart MySQL service
mysql_restart_service="/bin/systemctl restart mysql"

# Path to copy the recommended config
mysql_cnf_dir="/etc/mysql/releem.conf.d"

# Releem Agent configuration path
releem_cnf_dir="/opt/releem/conf"

# Metrics collection interval in seconds
interval_seconds=60

# How often to reload the configuration file in seconds
interval_read_config_seconds=3600

# Enable query optimization and collect explain for queries
query_optimization=false

# List of databases for query optimization (comma-separated)
databases_query_optimization=""

# Enable automatic execution of approved schema changes
enable_exec_ddl=false

# Directory for schema-change backups
backup_dir="/tmp/backups"

# Path to pt-online-schema-change binary
ptosc_path="pt-online-schema-change"

# Path to mysqldump binary
mysqldump_path="mysqldump"

# Path to xtrabackup or mariabackup binary
xtrabackup_path="xtrabackup"

# Extra free-space buffer percentage for backups
backup_space_buffer=20.0

# Scratch schema used for Online DDL preflight checks
online_ddl_test_schema="releem_online_ddl_test"

# Disable disk space checks for schema-change execution
disable_space_checks=false

# Server data storage region - EU or empty
releem_region=""
```

## Important Notes

- Protect `/opt/releem/releem.conf` because it contains credentials. Keep it owned by the service administrator and readable only by root and the Agent service account. Verify restrictive ownership and permissions after installation and every edit; do not make the file world-readable or broadly group-readable.
- After modifying the configuration file, restart the Releem Agent service to apply changes
- Replace `[RELEEM_API_KEY]` through your approved secret-management process.
- For MySQL, replace `[MYSQL_PASSWORD]` with the password for the user specified in `mysql_user`.
- For PostgreSQL, replace `[POSTGRESQL_PASSWORD]` with the password for the user specified in `pg_user`.
- PostgreSQL monitoring is enabled when `pg_user` and `pg_password` are configured.
- Set `query_optimization=true` to enable SQL query optimization features where supported.
- Use `databases_query_optimization` to specify which databases to monitor for query optimization (leave empty for all databases).
- The `releem_region` field can be set to `EU` for European data storage or left empty for default storage.
- Set `enable_exec_ddl=true` only when the Releem Agent is allowed to apply approved schema changes automatically.
- Keep `disable_space_checks=false` for production use unless you have a separate capacity check in place.

## Restarting the Agent

After making changes to the configuration file, restart the Releem Agent:

```bash
sudo systemctl restart releem-agent
```

## Support

If you need assistance with configuration or have questions about specific settings, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.
