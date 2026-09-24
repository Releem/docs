---
id: linux
slug: /installation/mariadb/linux
title: Install Releem for MariaDB on Linux
---

# Install Releem for MariaDB on Linux

[Back to MariaDB installation options](/installation/mariadb).

Run these commands only in a private administrative session. Each command opens a private root Bash session and uses masked prompts so secrets do not enter shell history or the initial command arguments. The installer still receives those secrets through its process environment while it runs.

Use this guide for a self-managed MariaDB server on Linux. The official download URL is mutable, and the one-step commands do not cryptographically verify it.

Supported versions are MariaDB 10.1–11.0. Install the Agent on the database host when possible. For a remote database, restrict the database listener and firewall to the exact Agent source address.

:::note CloudLinux
After installation, complete the [CloudLinux-specific CageFS and MySQLGovernor steps](/get-started/troubleshoot-releem-agent#cloudlinux).
:::

:::danger Current installer exposure risks
The current installer downloads components from mutable URLs without published signature or checksum verification. Secrets passed to every engine flow remain in the installer's process environment, and the installer attempts to upload `/var/log/releem-install.log` on exit. If your policy forbids mutable or unverified downloads, secrets in the process environment, or automatic log uploads, do not use any installer flow.

In MySQL and MariaDB flows, the installer can put administrative and monitoring passwords in child-process arguments. An existing-user authentication failure can also write the monitoring password to that uploaded log. If child-process argument exposure or failure-log password exposure is unacceptable, do not use the MySQL or MariaDB installer flow.
:::

## Prerequisites

Before you begin, confirm that the database version is MariaDB 10.1–11.0, that the host has outbound HTTPS access, and that you can open a private root shell. The installer uses the `RELEEM_MYSQL_*` variable family for MariaDB. That naming does not imply full MySQL feature or privilege parity; have a DBA review the MariaDB-specific account and feature requirements in the [MariaDB permissions guide](/supported-databases/mariadb/required-permissions).

Use these task links for the complete flow: [requirements](#prerequisites), [permissions](/supported-databases/mariadb/required-permissions), [automatic installation](#automatic-installation), [manual installation](#manual-installation), [parameters](#installer-parameters), [expected result](#expected-result), [verification](#verify-installation), [troubleshooting](#troubleshooting), [update](/installation/manage-the-releem-agent/update), and [uninstall](/installation/manage-the-releem-agent/uninstall).

## Automatic installation {#automatic-installation}

Use this path when the installer may create the monitoring user. Run this one-step command and enter the API key at the masked prompt. The installer asks for the MariaDB administrative password if it needs one.

:::warning Configuration-changing account authority
The installer-created account receives `SUPER`, which can change database configuration and provides broader administrative authority than monitoring requires. Use automatic installation only when you authorize the installer to create an account with this configuration-changing authority. Otherwise, have a DBA create an approved account and use [manual installation](#manual-installation).
:::

```bash
sudo bash -c '
set -euo pipefail
installer=$(mktemp)
trap "rm -f \"$installer\"" EXIT
read -r -s -p "Releem API key: " RELEEM_API_KEY
printf "\n"
export RELEEM_API_KEY RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
export RELEEM_MYSQL_TYPE=1
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

Do not add an administrative password to the command. Continue with the [expected result](#expected-result).

## Manual installation {#manual-installation}

Use this path when a DBA has already created the monitoring user according to the [MariaDB permissions guide](/supported-databases/mariadb/required-permissions). Run this one-step command and enter both secret values at the masked prompts:

```bash
sudo bash -c '
set -euo pipefail
installer=$(mktemp)
trap "rm -f \"$installer\"" EXIT
read -r -s -p "Releem API key: " RELEEM_API_KEY
printf "\n"
read -r -s -p "Monitoring database password: " RELEEM_MYSQL_PASSWORD
printf "\n"
export RELEEM_API_KEY RELEEM_MYSQL_PASSWORD
export RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
export RELEEM_MYSQL_TYPE=1 RELEEM_MYSQL_LOGIN="releem"
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

Add `RELEEM_MYSQL_HOST` or `RELEEM_MYSQL_PORT` before the `curl` line only when the database does not use the local default connection.

The installer writes the Agent's ongoing configuration, including secret values, to `/opt/releem/releem.conf`. Verify that this file has restrictive ownership and permissions and is not readable or writable by unauthorized users. The installer attempts to upload `/var/log/releem-install.log` on exit; the warning above describes the credential risk in affected MySQL and MariaDB flows.

## Installer parameters {#installer-parameters}

- `RELEEM_API_KEY` identifies the server in Releem.
- `RELEEM_HOSTNAME` overrides the name displayed in the Dashboard.
- `RELEEM_DB_MEMORY_LIMIT` is accepted by the installer. This documentation does not establish how it affects MariaDB configuration tuning; the examples keep it at `0`.
- `RELEEM_CRON_ENABLE=0` disables scheduled Agent updates. `RELEEM_CRON_ENABLE=1` creates a daily auto-update at midnight; review the dedicated [Update guide](/installation/manage-the-releem-agent/update) before enabling it.
- `RELEEM_MYSQL_TYPE=1` explicitly selects the MySQL-family path. MySQL is already the default.
- `RELEEM_MYSQL_HOST` defaults to `127.0.0.1`, `RELEEM_MYSQL_PORT` defaults to `3306`, and `RELEEM_MYSQL_LOGIN` and `RELEEM_MYSQL_PASSWORD` configure the MySQL-family monitoring connection.
- `RELEEM_MYSQL_ROOT_LOGIN` sets the MySQL-family administrative login and defaults to `root`. Do not put a root-password variable in a reusable example; use the installer's masked prompt.
- Omit `RELEEM_QUERY_OPTIMIZATION` to disable query-optimization collection. Set it to exactly `RELEEM_QUERY_OPTIMIZATION=true` to enable collection after granting the engine-specific permissions.

For the installed Agent's settings, see [Configure the Releem Agent](/installation/manage-the-releem-agent/configuration).

## Expected result {#expected-result}

The installer completes without an error, the Agent service starts, and the new server appears in the Releem Dashboard.

## Verify the installation {#verify-installation}

Open the Dashboard and confirm both that **Agent Status: Connected** is shown and that the Dashboard has a current data timestamp or updated metrics. If the service is connected but current data is absent, review the [Agent logs](/installation/manage-the-releem-agent/logs) and continue to troubleshooting.

## Troubleshooting {#troubleshooting}

If the server does not connect, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Recheck this installation guide, database permissions, network source restrictions, and installed configuration. For lifecycle tasks, use the dedicated [update](/installation/manage-the-releem-agent/update) and [uninstall](/installation/manage-the-releem-agent/uninstall) guides.

## Next steps

Use [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), or [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall) for lifecycle tasks.
