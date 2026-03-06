---
id: "self-managed-servers-manual-installation-windows"
title: "Windows"
---

# Installation for Self-Managed MySQL Servers (Windows)

## Automatic Installation

Run the following command in Windows PowerShell as Administrator:

```powershell
$env:RELEEM_MYSQL_MEMORY_LIMIT=0; $env:RELEEM_API_KEY="your_api_key"; $env:RELEEM_MYSQL_ROOT_PASSWORD="your_root_password"; $env:RELEEM_CRON_ENABLE=1; $env:RELEEM_QUERY_OPTIMIZATION="true"; iwr -useb https://releem.s3.amazonaws.com/v2/install.ps1 | iex
```

**Parameters:**

- `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard
- `RELEEM_API_KEY` - API Key. Get it from the Profile page in the Releem Dashboard
- `RELEEM_MYSQL_HOST` - use this variable in case MySQL listens on a different interface. Default value is `127.0.0.1`
- `RELEEM_MYSQL_PORT` - use this variable in case MySQL listens on a different port. Default value is `3306`
- `RELEEM_MYSQL_LOGIN` - MySQL user name to collect MySQL metrics
- `RELEEM_MYSQL_PASSWORD` - MySQL user password to collect MySQL metrics
- `RELEEM_MYSQL_ROOT_PASSWORD` - MySQL `root` user password used during installation if the installer should create the `releem` user automatically
- `RELEEM_MYSQL_MEMORY_LIMIT` - change this parameter in case there is other software installed on the server. Default value `0` means use all memory. [Learn more](/configuration-tuning/limit-memory-for-mysql)
- `RELEEM_CRON_ENABLE` - set `1` to enable daily automatic updates or `0` to disable them
- `RELEEM_QUERY_OPTIMIZATION` - set `true` if Releem Agent should collect additional information for Automatic SQL Query Optimization

After installation, open the [Releem Dashboard](https://app.releem.com/). If the server does not appear immediately, refresh the page.

## Manual Installation

Use this method if you prefer to install and configure Releem Agent step by step.

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
   mysql_host="127.0.0.1"
   mysql_port="3306"
   mysql_user="releem"
   mysql_password="change to your password"
   mysql_restart_service=""
   mysql_cnf_dir=""
   interval_seconds=60
   interval_read_config_seconds=3600
   query_optimization=true
   ```

   For a full list of configuration settings, please refer to the [Releem Agent Configuration Settings](/releem-agent/configuration).

   **Important:** Please set `mysql_password` as previously generated password on step 1, and `api_key` for your account which you could find on the Profile page in the Releem Dashboard.

5. Please add the following variables to the MySQL configuration file and restart MySQL:
   ```ini
   performance_schema=1
   slow_query_log=1
   performance-schema-consumer-events-statements-history=ON
   performance-schema-consumer-events-statements-current=ON
   ```

6. Run the following commands manually in Windows PowerShell as Administrator:
   ```powershell
   C:\'Program Files'\ReleemAgent\releem-agent.exe -f
   C:\'Program Files'\ReleemAgent\releem-agent.exe install
   C:\'Program Files'\ReleemAgent\releem-agent.exe start
   ```

7. Visit the [Releem Dashboard](https://app.releem.com/), if there is no server please refresh the page.
