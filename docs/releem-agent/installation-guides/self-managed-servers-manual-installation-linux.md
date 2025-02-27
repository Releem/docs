---
id: "self-managed-servers-manual-installation-linux"
title: "Linux (Manual)"
---

# Self-Managed Servers Manual Installation


Use this instruction to install Releem Agent manually on the database server. Releem Agent will automatically collect metrics and send them to the Releem Platform.
1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions).
   To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).
2. Run Installation command as a root user on the server:
   ```ini
   RELEEM_MYSQL_PASSWORD='[Password]' RELEEM_MYSQL_LOGIN='releem' RELEEM_MYSQL_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
   ```

   **Parameters:**
   - `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
   - `RELEEM_MYSQL_LOGIN` - MySQL User name to collect MySQL metrics
   - `RELEEM_MYSQL_PASSWORD` - MySQL User password to collect MySQL metrics
   - `RELEEM_MYSQL_MEMORY_LIMIT` - Change parameter in case there are other software installed on the server. Default value is 0 means use all memory.
   - `RELEEM_API_KEY` - API Key. Get it from Profile page in Releem Customer Portal.
   - `RELEEM_MYSQL_HOST` - use this variable in case MySQL listens different interface or connection available only through socket.
   - `RELEEM_MYSQL_PORT` - use this variable in case MySQL listens different port
   - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.

