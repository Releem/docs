---
id: windows
slug: /installation/mysql/windows
title: Install Releem for MySQL on Windows
---

# Install Releem for MySQL on Windows

Install the Releem Agent on a Windows server that runs MySQL.

## Prerequisites

Run PowerShell as Administrator. Make sure `mysql.exe` is available in `PATH`, and review [MySQL permissions](/supported-databases/mysql/required-permissions).

## Automatic installation {#automatic-installation}

Run the installer in PowerShell. Replace the bracketed placeholders with your Releem API key and MySQL administrator password.

```powershell
$env:RELEEM_DB_MEMORY_LIMIT=0; $env:RELEEM_API_KEY="[RELEEM_API_KEY]"; $env:RELEEM_MYSQL_ROOT_PASSWORD="[MYSQL_ROOT_PASSWORD]"; $env:RELEEM_CRON_ENABLE=1; $env:RELEEM_QUERY_OPTIMIZATION="true"; iwr -useb https://releem.s3.amazonaws.com/v2/install.ps1 | iex
```

Use the manual method when you already have a `releem` database account.

## Installer parameters

- `RELEEM_HOSTNAME` changes the server name shown in the Dashboard.
- `RELEEM_MYSQL_HOST` defaults to `127.0.0.1`.
- `RELEEM_MYSQL_PORT` defaults to `3306`.
- `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` select an existing monitoring account.
- `RELEEM_DB_MEMORY_LIMIT` reserves memory for other software. `0` lets Releem consider all memory.
- `RELEEM_CRON_ENABLE=1` enables the scheduled Agent update; `0` disables it.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query data collection after you grant the required permissions.

## Manual installation {#manual-installation}

1. Create the `releem` account using the [MySQL permissions guide](/supported-databases/mysql/required-permissions).
2. Create `C:\ProgramData\ReleemAgent\conf.d` and `C:\Program Files\ReleemAgent`.
3. Download `https://releem.s3.us-east-1.amazonaws.com/v2/releem-agent.exe` to `C:\Program Files\ReleemAgent\releem-agent.exe`.
4. Create `C:\ProgramData\ReleemAgent\releem.conf` and restrict access to administrators and the Agent service account:

```ini
apikey="[RELEEM_API_KEY]"
releem_cnf_dir="C:\\ProgramData\\ReleemAgent\\conf.d"
mysql_host="127.0.0.1"
mysql_port="3306"
mysql_user="releem"
mysql_password="[MONITORING_PASSWORD]"
interval_seconds=60
interval_read_config_seconds=3600
query_optimization=false
```

5. Install and start the service:

```powershell
& 'C:\Program Files\ReleemAgent\releem-agent.exe' -f
& 'C:\Program Files\ReleemAgent\releem-agent.exe' install
& 'C:\Program Files\ReleemAgent\releem-agent.exe' start
```

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.
