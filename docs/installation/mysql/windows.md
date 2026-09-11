---
id: windows
slug: /installation/mysql/windows
title: Install Releem for MySQL on Windows
---

# Install Releem for MySQL on Windows

Install the Releem Agent on a Windows server that runs MySQL.

[Back to MySQL installation options](/installation/mysql).

## Prerequisites

Run PowerShell as Administrator. Review [MySQL permissions](/supported-databases/mysql/required-permissions) before the Agent uses the monitoring account.

## Automatic installation {#automatic-installation}

Automatic installation is currently unavailable. Credential handling and download integrity are unverified. This page provides no executable installer command; contact Releem Support for the current Windows procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

## Installer parameters

Ask Releem Support how the current installer accepts the API key, database connection, memory limit, update setting, and optional query collection without exposing secrets in command arguments or history.

## Manual installation {#manual-installation}

Manual installation is currently unavailable. The Agent package and credential setup are unverified. This page provides no executable download or credential setup; contact Releem Support for the current Windows package and procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

After Releem Support provides the Agent package and credential configuration, review these MySQL settings and use the service commands only for that supported package.

   ```ini
   performance_schema=ON
   performance-schema-consumer-events-statements-current=ON
   performance-schema-consumer-events-statements-history=ON
   slow_query_log=ON
   ```

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

Return to [MySQL installation options](/installation/mysql), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
