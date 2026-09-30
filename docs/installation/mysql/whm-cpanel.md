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
- AlmaLinux 8/9, Rocky Linux 8/9, CentOS 7/8, Ubuntu 20.04/22.04/24.04, or Debian 10/11/12, with cPanel/WHM already installed
- [MySQL permissions](/supported-databases/mysql/required-permissions)
- A Releem API key

## Automatic installation {#automatic-installation}

Run the installer as `root`. Replace the bracketed placeholder with your Releem API key. If you omit `--api-key`, the installer asks for the key interactively.

```bash
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/whm/whm-install.sh)" --api-key=[RELEEM_API_KEY]
```

The installer:

1. Checks root access and that cPanel/WHM is installed.
2. Reads the local database root credentials from `/root/.my.cnf` when that file contains a `root` account. If those credentials are unavailable, the Agent installer may ask for the database password.
3. Installs the Agent and sets its database memory limit to half of the server RAM. If the Agent already exists, it starts the service without reinstalling it.
4. Disables cPanel auto-adjust for `innodb_buffer_pool_size`, `max_allowed_packet`, and `open_files_limit` so cPanel does not overwrite Releem-managed values.
5. Registers **WHM > Plugins > Releem Database Advisor**.

Keep the database's configuration and service paths managed by cPanel. The WHM installer delegates database detection and Agent configuration to the Linux Agent installer; you do not need to rename the database service or move its configuration files.

## Logs

Check this path for installation activity:

```bash
/var/log/releem/whm-install.log
```

Use [Agent logs](/installation/manage-the-releem-agent/logs) for runtime diagnostics.

## Uninstall and recovery

Record the cPanel database auto-adjust settings before removal. Then run:

```bash
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/whm/whm-install.sh)" --uninstall
```

After removal, restore any cPanel settings that your hosting policy requires.

## Re-run behavior

You can re-run the installer. It keeps the existing Agent binary, starts the service when needed, reapplies the cPanel settings, and registers the module files again.

## Troubleshooting

### cPanel database auto-adjust is still enabled

Open **WHM > Plugins > Releem Database Advisor** and check each auto-adjust setting. Re-run the installer as `root` if a setting remains enabled, or disable the corresponding setting in WHM to prevent it from overriding Releem-managed values.

### Releem Agent is installed but not running

Use these commands to inspect or start the Agent service:

```bash
systemctl status releem-agent
```

```bash
systemctl start releem-agent
```

### The server does not appear in the Dashboard

Confirm that the installation used the API key for your Releem account. Review `/var/log/releem/whm-install.log` and the [Agent logs](/installation/manage-the-releem-agent/logs), then use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent).

## Expected result

**WHM > Plugins > Releem Database Advisor** should show the Agent service, and the Dashboard should show **Agent Status: Connected** with current metrics or a current data timestamp.

## Verify the installation

Open **WHM > Plugins > Releem Database Advisor**. Confirm the Agent service is running and inspect the enabled or disabled state of each cPanel auto-adjust setting. The page also provides a link to the Releem Dashboard. In the Dashboard, verify both **Agent Status: Connected** and current database metrics or a current data timestamp.
