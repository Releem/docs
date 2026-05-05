---
id: "whm-cpanel"
title: "WHM/cPanel"
---

# WHM/cPanel Installation

Use this guide if your database server is managed through WHM/cPanel. The Releem WHM/cPanel module installs Releem Agent automatically, adds a status page in WHM, and disables cPanel database auto-adjust settings that can conflict with Releem.

Use this method instead of the generic Linux installation guides when you administer the server through WHM/cPanel.

## Prerequisites

- cPanel/WHM installed and running
- Root SSH access
- AlmaLinux 8/9, Rocky Linux 8/9, CentOS 7/8, Ubuntu 20.04/22.04/24.04, or Debian 10/11/12
- A Releem API key from the [Releem Dashboard](https://app.releem.com/)

## Install the WHM/cPanel Module

Run the following command as `root`:

```bash
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/whm/whm-install.sh)" --api-key=YOUR_API_KEY
```

If you omit the API key, the installer prompts for it interactively.

## What the Installer Does

The installer performs the following actions automatically:

1. Verifies that you are running the command as `root` and that cPanel/WHM is installed.
2. Installs Releem Agent or starts the existing `releem-agent` service if it is already installed.
3. Configures the agent using available local MySQL credentials and sets the memory limit automatically.
4. Disables cPanel MySQL auto-adjust settings that can override Releem-managed values such as `innodb_buffer_pool_size`, `max_allowed_packet`, and `open_files_limit`.
5. Installs the WHM plugin and registers the Releem status page in WHM.

## Verify the Installation

After installation, open:

**WHM > Plugins > Releem Database Advisor**

The WHM page shows:

- Releem Agent service status
- cPanel MySQL auto-adjust status
- A link to the Releem Dashboard

You should also see the server in the [Releem Dashboard](https://app.releem.com/). If the server does not appear immediately, refresh the page and wait a few minutes for the first metrics to arrive.

## Logs

The WHM installer writes installation activity to:

```bash
/var/log/releem/whm-install.log
```

For runtime agent troubleshooting after installation, see [How to Check Logs](/releem-agent/how-to-check-logs).

## Uninstall

To remove the WHM module and uninstall Releem Agent, run:

```bash
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/whm/whm-install.sh)" --uninstall
```

## Re-run the Installer

The installer is idempotent and safe to re-run. When you run it again, it:

- skips agent installation if the binary already exists
- ensures the `releem-agent` service is running
- reapplies cPanel tweak settings
- overwrites and re-registers the WHM module files

## Common Issues

### cPanel MySQL auto-adjust is still enabled

Open **WHM > Plugins > Releem Database Advisor** and check the cPanel MySQL auto-adjust status. If it is still enabled, rerun the installer as `root` or disable the settings manually in WHM to prevent conflicts with Releem.

### Releem Agent is installed but not running

Check the installer log at `/var/log/releem/whm-install.log`, then verify the service status:

```bash
systemctl status releem-agent
```

If needed, start the service manually:

```bash
systemctl start releem-agent
```

### The server does not appear in the Releem Dashboard

Confirm that the install command used the correct API key, then review `/var/log/releem/whm-install.log` and the agent logs. For more troubleshooting steps, see [How to Check if Releem Agent is Working](/getting-started/how-to-check-if-releem-agent-is-working).
