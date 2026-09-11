---
id: windows
slug: /installation/mariadb/windows
title: Install Releem for MariaDB on Windows
---

# Install Releem for MariaDB on Windows

Install the Releem Agent on a Windows server that runs MariaDB.

[Back to MariaDB installation options](/installation/mariadb).

## Prerequisites

Run PowerShell as Administrator. Review [MariaDB permissions](/supported-databases/mariadb/required-permissions). The Agent uses the `RELEEM_MYSQL_*` variable names for MariaDB compatibility; those names do not establish MySQL feature or privilege parity.

## Automatic installation {#automatic-installation}

Automatic MariaDB installation on Windows is currently unavailable. Credential handling and download integrity are unverified. This page provides no executable installer command; contact Releem Support for the current MariaDB Windows procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Installer parameters

Ask Releem Support how the current installer accepts the API key, MariaDB connection, memory limit, update setting, and optional query collection without exposing secrets in command arguments or history.

## Manual installation {#manual-installation}

Manual MariaDB installation on Windows is currently unavailable. The Agent package and credential setup are unverified. This page provides no executable download or credential setup; contact Releem Support for the current MariaDB Windows package and procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

After Releem Support provides the Agent package and credential configuration, use these service commands only for that supported package.

   ```powershell
   C:\'Program Files'\ReleemAgent\releem-agent.exe -f
   C:\'Program Files'\ReleemAgent\releem-agent.exe install
   C:\'Program Files'\ReleemAgent\releem-agent.exe start
   ```

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.

## Next steps

Return to [MariaDB installation options](/installation/mariadb), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
