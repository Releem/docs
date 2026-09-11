---
id: linux
slug: /installation/postgresql/linux
title: Install Releem for PostgreSQL on Linux
---

# Install Releem for PostgreSQL on Linux

[Back to PostgreSQL installation options](/installation/postgresql).

Run these commands only in a private administrative session. Each command opens a private root Bash session and uses masked prompts so secrets do not enter shell history or the initial command arguments. The installer still receives those secrets through its process environment while it runs.

Use this guide for a self-managed PostgreSQL server on Linux. The official download URL is mutable, and the one-step commands do not cryptographically verify it.

Supported versions are PostgreSQL 15–18. Install the Agent on the database host when possible. For a remote database, restrict the database listener and firewall to the exact Agent source address.

:::danger Current installer exposure risks
The current installer downloads components from mutable URLs without published signature or checksum verification. Secrets passed to every engine flow remain in the installer's process environment, and the installer attempts to upload `/var/log/releem-install.log` on exit. If your policy forbids mutable or unverified downloads, secrets in the process environment, or automatic log uploads, do not use any installer flow.
:::

## Prerequisites

Before you begin, confirm that the database version is PostgreSQL 15–18, install the matching `postgresql-contrib` package, confirm outbound HTTPS access, and ensure that you can open a private root shell. Review the [PostgreSQL permissions and connection rules](/supported-databases/postgresql/required-permissions) before choosing an account-creation path.

Use these task links for the complete flow: [requirements](#prerequisites), [permissions](/supported-databases/postgresql/required-permissions), [automatic installation](#automatic-installation), [manual installation](#manual-installation), [parameters](#installer-parameters), [expected result](#expected-result), [verification](#verify-installation), [troubleshooting](#troubleshooting), [update](/installation/manage-the-releem-agent/update), and [uninstall](/installation/manage-the-releem-agent/uninstall).

## Automatic installation {#automatic-installation}

Use this path when the installer may create the `releem` monitoring user. Run this one-step command and enter the API key at the masked prompt. The installer asks for the PostgreSQL administrative password if it needs one.

```bash
sudo bash -c '
set -euo pipefail
installer=$(mktemp)
trap "rm -f \"$installer\"" EXIT
read -r -s -p "Releem API key: " RELEEM_API_KEY
printf "\n"
export RELEEM_API_KEY RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
export RELEEM_PG_TYPE=1
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

`RELEEM_PG_TYPE=1` selects PostgreSQL. Do not add an administrative password to the command. Continue with the [expected result](#expected-result).

## Manual installation {#manual-installation}

Use this path after a DBA has created the monitoring user and reviewed `pg_hba.conf` according to the [PostgreSQL permissions guide](/supported-databases/postgresql/required-permissions). Run this one-step command and enter both secret values at the masked prompts:

```bash
sudo bash -c '
set -euo pipefail
installer=$(mktemp)
trap "rm -f \"$installer\"" EXIT
read -r -s -p "Releem API key: " RELEEM_API_KEY
printf "\n"
read -r -s -p "Monitoring database password: " RELEEM_PG_PASSWORD
printf "\n"
export RELEEM_API_KEY RELEEM_PG_PASSWORD
export RELEEM_DB_MEMORY_LIMIT=0 RELEEM_CRON_ENABLE=0
export RELEEM_PG_TYPE=1 RELEEM_PG_LOGIN="releem"
curl --fail --location --proto "=https" --tlsv1.2 \
  --output "$installer" https://releem.s3.amazonaws.com/v2/install.sh
bash "$installer"
'
```

Add `RELEEM_PG_HOST`, `RELEEM_PG_PORT`, or `RELEEM_PG_SSL_MODE=true` before the `curl` line only when the database does not use the local defaults. The SSL switch maps to `sslmode=require`; it does not provide certificate and hostname verification equivalent to `verify-full`.

The installer writes the Agent's ongoing configuration, including secret values, to `/opt/releem/releem.conf`. Verify that this file has restrictive ownership and permissions and is not readable or writable by unauthorized users. The installer attempts to upload `/var/log/releem-install.log` on exit; the warning above describes this behavior.

## Installer parameters {#installer-parameters}

- `RELEEM_API_KEY` identifies the server in Releem.
- `RELEEM_HOSTNAME` overrides the name displayed in the Dashboard.
- `RELEEM_CRON_ENABLE=0` disables scheduled Agent updates. `RELEEM_CRON_ENABLE=1` creates a daily auto-update at midnight; review the dedicated [Update guide](/installation/manage-the-releem-agent/update) before enabling it.
- `RELEEM_PG_TYPE=1` selects PostgreSQL.
- `RELEEM_PG_HOST` defaults to `127.0.0.1`, `RELEEM_PG_PORT` defaults to `5432`, and `RELEEM_PG_LOGIN` and `RELEEM_PG_PASSWORD` configure the PostgreSQL monitoring connection.
- `RELEEM_PG_ROOT_LOGIN` sets the PostgreSQL administrative login and defaults to `postgres`. Do not put a root-password variable in a reusable example; use the installer's masked prompt.
- `RELEEM_PG_SSL_MODE=true` maps to `sslmode=require`; `false` or omission maps to `sslmode=disable`. It is not a `verify-full` setting.
- Omit `RELEEM_QUERY_OPTIMIZATION` to disable query-optimization collection. Set it to exactly `RELEEM_QUERY_OPTIMIZATION=true` to enable collection after granting the engine-specific permissions.

For the installed Agent's settings, see [Configure the Releem Agent](/installation/manage-the-releem-agent/configuration).

## Expected result {#expected-result}

The installer completes without an error, the Agent service starts, and the new server appears in the Releem Dashboard.

## Verify the installation {#verify-installation}

Open the Dashboard and confirm both that **Agent Status: Connected** is shown and that the Dashboard has a current data timestamp or updated metrics. If the service is connected but current data is absent, review the [Agent logs](/installation/manage-the-releem-agent/logs) and continue to troubleshooting.

## Troubleshooting {#troubleshooting}

If the server does not connect, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Recheck this installation guide, PostgreSQL permissions, network source restrictions, and installed configuration. For lifecycle tasks, use the dedicated [update](/installation/manage-the-releem-agent/update) and [uninstall](/installation/manage-the-releem-agent/uninstall) guides.

## Next steps

Use [Agent configuration](/installation/manage-the-releem-agent/configuration), [Update the Agent](/installation/manage-the-releem-agent/update), or [Uninstall the Agent](/installation/manage-the-releem-agent/uninstall) for lifecycle tasks.
