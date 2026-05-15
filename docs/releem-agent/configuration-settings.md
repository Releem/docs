---
id: "configuration"
title: "Configuration"
---

# Releem Agent Configuration

This document describes the available configuration settings for the Releem Agent. These settings are defined in the `/opt/releem/releem.conf` file.

## Configuration File

All Releem Agent settings are stored in `/opt/releem/releem.conf`. The following example shows the common settings for MySQL and PostgreSQL monitoring:

```ini
# API key for Releem Platform
apikey="<api_key>"

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
gcp_project_id="my-project-123"

#GCP region for Cloud SQL instance
gcp_region="us-central1"

#Name of Cloud SQL instance
gcp_cloudsql_instance="my-mysql-instance"

# Azure subscription ID for Azure Database for MySQL Flexible Server
azure_subscription_id="00000000-0000-0000-0000-000000000000"

# Azure resource group for Azure Database for MySQL Flexible Server
azure_resource_group="my-resource-group"

# Azure Database for MySQL Flexible Server resource name
azure_mysql_server="my-mysql-server"

# Database memory usage limit in MB (0 = use all available memory)
memory_limit=0

# MySQL user name for collecting metrics
mysql_user="releem"

# MySQL user password for collecting metrics
mysql_password="releem"

# MySQL host for collecting metrics
mysql_host="127.0.0.1"

# MySQL port for collecting metrics
mysql_port="3306"

# PostgreSQL user name for collecting metrics
pg_user="releem"

# PostgreSQL user password for collecting metrics
pg_password="releem"

# PostgreSQL host for collecting metrics
pg_host="127.0.0.1"

# PostgreSQL port for collecting metrics
pg_port="5432"

# PostgreSQL database name for collecting metrics
pg_database="postgres"

# PostgreSQL SSL mode: disable, require, verify-ca, verify-full
pg_ssl_mode="disable"

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

# Server data storage region - EU or empty
releem_region=""
```

## Important Notes

- After modifying the configuration file, restart the Releem Agent service to apply changes
- The `apikey` field must be set to your actual Releem API key
- The `mysql_password` field should contain the password for the MySQL user specified in `mysql_user`
- Set `query_optimization=true` to enable SQL query optimization features
- Use `databases_query_optimization` to specify which databases to monitor for query optimization (leave empty for all databases)
- The `releem_region` field can be set to "EU" for European data storage or left empty for default storage
- For Azure Database for MySQL, set `instance_type="azure/mysql"` and use the Azure server resource name in `azure_mysql_server`, not the full hostname.


## Restarting the Agent

After making changes to the configuration file, restart the Releem Agent:

```bash
sudo systemctl restart releem-agent
```

## Support

If you need assistance with configuration or have questions about specific settings, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.
