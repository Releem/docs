---
id: "self-managed-servers-manual-installation-windows"
title: "Windows"
---

# Manual Installation for Self-Managed MySQL Servers (Windows)


1. Create read-only MySQL user "releem" using this [guide](/releem-agent/mysql-permissions).
   To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

2. Create the following folders on the server:
   - `C:\ProgramData\ReleemAgent\`
   - `C:\ProgramData\ReleemAgent\conf.d`
   - `C:\Program Files\ReleemAgent`

3. Download the [Releem Agent](https://releem.s3.us-east-1.amazonaws.com/v2/releem-agent.exe) file to the folder `C:\Program Files\ReleemAgent`

4. Create a file `C:\ProgramData\ReleemAgent\releem.conf` with the following contents:
   ```ini
   apikey="change to your API key"
   releem_cnf_dir="C:\\ProgramData\\ReleemAgent\\conf.d"
   mysql_user="releem"
   mysql_password="change to your password"
   mysql_restart_service=""
   mysql_cnf_dir=""
   interval_seconds=60
   interval_read_config_seconds=3600
   query_optimization=true
   ```
   **Important:** Please set `mysql_password` as previously generated password on step 1, and `api_key` for your account which you could find on the Profile page in the Releem Dashboard.

5. Please add the following variables to the MySQL configuration file and restart MySQL:
   ```ini
   performance_schema=1
   slow_query_log=1
   performance-schema-consumer-events-statements-history=ON
   performance-schema-consumer-events-statements-current=ON
   performance_schema_events_statements_history_size=500
   ```

6. Run the following commands manually in Windows PowerShell as Administrator:
   ```powershell
   C:\'Program Files'\ReleemAgent\releem-agent.exe -f
   C:\'Program Files'\ReleemAgent\releem-agent.exe install
   C:\'Program Files'\ReleemAgent\releem-agent.exe start
   ```

7. Visit the [Releem Dashboard](https://app.releem.com/), if there is no server please refresh the page.

