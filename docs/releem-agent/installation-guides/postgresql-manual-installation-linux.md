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
   GRANT SELECT ON pg_hba_file_rules TO  releem;
   GRANT EXECUTE ON FUNCTION pg_hba_file_rules TO  releem;
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
   RELEEM_PG_PASSWORD='[Password]' RELEEM_PG_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
   ```

   **Parameters:**
   - `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
   - `RELEEM_PG_LOGIN` - PostgreSQL user name for collecting metrics.
   - `RELEEM_PG_PASSWORD` - PostgreSQL user password for collecting metrics.
   - `RELEEM_DB_MEMORY_LIMIT` - Change parameter in case there are other software installed on the server. Default value is 0 means use all memory. 
   - `RELEEM_API_KEY` - API Key. Get it from Profile page in Releem Customer Portal.
   - `RELEEM_PG_HOST` - use this variable in case PostgreSQL listens different interface or connection available only through socket.
   - `RELEEM_PG_PORT` - use this variable in case PostgreSQL listens different port
   - `RELEEM_PG_SSL_MODE` - SSL mode for PostgreSQL connections.
   - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.

   For a full list of configuration settings, please refer to the [Releem Agent Configuration](/releem-agent/configuration).

3. Open the [Releem Dashboard](https://app.releem.com/). If the server does not appear immediately, refresh the page.

## Notes

- PostgreSQL support is enabled when `pg_user` and `pg_password` are set in the agent configuration.
- `pg_stat_statements` is recommended for query performance visibility.
- Use `pg_ssl_mode` that matches your PostgreSQL server configuration.
