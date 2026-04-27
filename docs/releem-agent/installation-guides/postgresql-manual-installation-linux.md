---
id: "postgresql-manual-linux"
title: "PostgreSQL (Manual)"
---

# Self-Managed PostgreSQL Servers Manual Installation

Use this guide to configure Releem Agent for PostgreSQL metrics collection on a self-managed Linux server.

Create the PostgreSQL monitoring user before running the Releem Agent installation command.

## Installation Steps

1. Create a PostgreSQL monitoring user:
   ```sql
   CREATE USER releem WITH PASSWORD '[Password]';
   GRANT pg_monitor TO releem;
   ```

   Enable `pg_stat_statements` for query performance metrics:

   Add the following line to `postgresql.conf`:
   ```ini
   shared_preload_libraries = 'pg_stat_statements'
   ```

   Add the following line to `pg_hba.conf`:
   ```ini
   host    all             releem          0.0.0.0/0               md5
   ```

   Restart PostgreSQL, then create the extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
   ```

2. After the PostgreSQL user is created, run the Releem Agent installation command as a root user on the server:
   ```bash
   RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
   ```

   Update `/opt/releem/releem.conf` with PostgreSQL connection settings:
   ```ini
   apikey="[Key]"
   hostname=""
   pg_user="releem"
   pg_password="[Password]"
   pg_host="127.0.0.1"
   pg_port="5432"
   pg_database="postgres"
   pg_ssl_mode="disable"
   interval_seconds=60
   interval_read_config_seconds=3600
   ```

   For a full list of configuration settings, please refer to the [Releem Agent Configuration](/releem-agent/configuration).

   **Parameters:**
   - `apikey` - API key. Get it from the Profile page in the Releem Dashboard.
   - `hostname` - Server hostname, which should display in the Releem Dashboard.
   - `pg_user` - PostgreSQL user name for collecting metrics.
   - `pg_password` - PostgreSQL user password for collecting metrics.
   - `pg_host` - PostgreSQL host for collecting metrics.
   - `pg_port` - PostgreSQL port for collecting metrics.
   - `pg_database` - PostgreSQL database name used for connection.
   - `pg_ssl_mode` - SSL mode for PostgreSQL connections.

   Restart Releem Agent:
   ```bash
   sudo systemctl restart releem-agent
   ```

3. Open the [Releem Dashboard](https://app.releem.com/). If the server does not appear immediately, refresh the page.

## Notes

- PostgreSQL support is enabled when `pg_user` and `pg_password` are set in the agent configuration.
- `pg_stat_statements` is recommended for query performance visibility.
- Use `pg_ssl_mode` that matches your PostgreSQL server configuration.
