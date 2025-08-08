---
id: "configuration"
title: "Configuration"
---

# Releem Agent Configuration

This document describes all available configuration settings for the Releem Agent. These settings are defined in the `/opt/releem/releem.conf` file.

## Configuration File

All Releem Agent settings are stored in `/opt/releem/releem.conf`. Here's the complete configuration with all available settings:

```ini
# API key for Releem Platform
apikey="<api_key>"

# Hostname for the instance. This hostname will be displayed in the Releem Dashboard
hostname=""

# Type of instance "local" or "aws/rds'. Default:local
instance_type="aws/rds"

# AWS region for the RDS instance
aws_region="[AWS_REGION]"

# AWS RDS instance name
aws_rds_db="[RDS_INSTANCE_NAME]"

# AWS RDS parameter group name
aws_rds_parameter_group="releem-agent"


# MySQL memory usage limit in MB (0 = use all available memory)
memory_limit=0

# MySQL user name for collecting metrics
mysql_user="releem"

# MySQL user password for collecting metrics
mysql_password="releem"

# MySQL host for collecting metrics
mysql_host="127.0.0.1"

# MySQL port for collecting metrics
mysql_port="3306"

# Command to restart MySQL service
mysql_restart_service="/bin/systemctl restart mysql"

# Path to copy the recommended config
mysql_cnf_dir="/etc/mysql/releem.conf.d"

# Releem Agent configuration path
releem_cnf_dir="/opt/releem/conf"

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

## Restarting the Agent

After making changes to the configuration file, restart the Releem Agent:

```bash
sudo systemctl restart releem-agent
```

## Support

If you need assistance with configuration or have questions about specific settings, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com. 