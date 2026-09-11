---
id: whm-cpanel
slug: /installation/mysql/whm-cpanel
title: Install Releem for MySQL on WHM/cPanel
---

# Install Releem for MySQL on WHM/cPanel

Use the Releem WHM/cPanel module on a MySQL server managed through WHM.

[Back to MySQL installation options](/installation/mysql).

## Prerequisites

- cPanel/WHM installed and running
- Root SSH access
- A supported server operating system
- [MySQL permissions](/supported-databases/mysql/required-permissions)
- A Releem API key

## Automatic installation {#automatic-installation}

WHM/cPanel automatic installation is currently unavailable. Download integrity, API-key handling, module changes, and recovery are unverified. This page provides no executable installer command; contact Releem Support for the current module procedure. Success means **Agent Status: Connected** and current metrics in the Dashboard.

Ask Support how the module obtains the API key and local database credentials, which service and configuration paths it uses, and which cPanel settings it changes.

## Logs

After Support installs the module, check this path for installation activity:

```bash
/var/log/releem/whm-install.log
```

Use [Agent logs](/installation/manage-the-releem-agent/logs) for runtime diagnostics.

## Uninstall and recovery

Module removal and restoration of cPanel auto-adjust settings are unverified. This page provides no executable uninstall command. Before removal, record those settings and ask Releem Support for the current restoration procedure.

## Re-run behavior

Do not re-run the installer. Ask Releem Support how it handles the Agent service, module files, credentials, and previously changed cPanel settings.

## Troubleshooting

These local service commands do not install or remove the module. Use them only after Support installs the Agent service:

```bash
systemctl status releem-agent
```

```bash
systemctl start releem-agent
```

If the Agent is absent or disconnected, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) and contact Releem Support for the current module procedure.

## Expected result

After Support completes the installation, **WHM > Plugins > Releem Database Advisor** should show the Agent service and the Dashboard should show **Agent Status: Connected** with current metrics or a current data timestamp.

## Verify the installation

Confirm the service status in WHM and verify both Agent connectivity and current metrics in the Dashboard.

## Next steps

Return to [MySQL installation options](/installation/mysql), or continue with [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), and [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall).
