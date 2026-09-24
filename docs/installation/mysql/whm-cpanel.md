---
id: whm-cpanel
slug: /installation/mysql/whm-cpanel
title: Install Releem for MySQL on WHM/cPanel
---

# Install Releem for MySQL on WHM/cPanel

Use the Releem WHM/cPanel module on a MySQL server managed through WHM.

## Prerequisites

- cPanel/WHM installed and running
- Root SSH access
- A supported server operating system
- [MySQL permissions](/supported-databases/mysql/required-permissions)
- A Releem API key

## Automatic installation {#automatic-installation}

Run the installer as `root`. If you omit `--api-key`, the installer asks for the key interactively.

```bash
installer=$(mktemp)
curl --fail --location --proto '=https' --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/whm/whm-install.sh
bash "$installer"
rm -f "$installer"
```

The installer detects local database credentials, installs or starts the Agent, registers **WHM > Plugins > Releem Database Advisor**, and disables cPanel database auto-adjust settings that can conflict with Releem-managed values.

## Logs

Check this path for installation activity:

```bash
/var/log/releem/whm-install.log
```

Use [Agent logs](/installation/manage-the-releem-agent/logs) for runtime diagnostics.

## Uninstall and recovery

Record the cPanel database auto-adjust settings before removal. Then run:

```bash
installer=$(mktemp)
curl --fail --location --proto '=https' --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/whm/whm-install.sh
bash "$installer" --uninstall
rm -f "$installer"
```

After removal, restore any cPanel settings that your hosting policy requires.

## Re-run behavior

You can re-run the installer. It keeps the existing Agent binary, starts the service when needed, reapplies the cPanel settings, and registers the module files again.

## Troubleshooting

Use these commands to inspect or start the Agent service:

```bash
systemctl status releem-agent
```

```bash
systemctl start releem-agent
```

If the Agent is absent or disconnected, review `/var/log/releem/whm-install.log` and use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent).

## Expected result

**WHM > Plugins > Releem Database Advisor** should show the Agent service, and the Dashboard should show **Agent Status: Connected** with current metrics or a current data timestamp.

## Verify the installation

Confirm the service status in WHM and verify both Agent connectivity and current metrics in the Dashboard.
