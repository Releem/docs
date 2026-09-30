---
id: linux
slug: /installation/postgresql/linux
title: Install Releem for PostgreSQL on Linux
---

# Install Releem for PostgreSQL on Linux

Run the applicable installation command as `root`. Replace bracketed placeholders with the values for this server.

Use this guide for a self-managed PostgreSQL server on Linux.

Supported versions are PostgreSQL 15–18. Install the Agent on the database host when possible. For a remote database, restrict the database listener and firewall to the exact Agent source address.

## Prerequisites

Make sure the `postgresql-contrib` package for your PostgreSQL version is installed before running either command. It supplies `pg_stat_statements`, which the standard installation uses for query data. The automatic installer can create the monitoring user and attempt to create the extension, but it cannot install a missing PostgreSQL package. See [PostgreSQL Required Permissions](/supported-databases/postgresql/required-permissions#query-metrics-with-pg_stat_statements) for the extension and restart requirements.

## Automatic installation {#automatic-installation}

Use this path when the installer may create the `releem` monitoring user. The installer asks for the PostgreSQL administrative password if it needs one.

```bash
RELEEM_PG_TYPE=1 RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

`RELEEM_PG_TYPE=1` selects PostgreSQL. Do not add an administrative password to the command. Continue with the [expected result](#expected-result).

## Manual installation {#manual-installation}

Use this path after a DBA has created the monitoring user and reviewed `pg_hba.conf` according to the [PostgreSQL permissions guide](/supported-databases/postgresql/required-permissions):

```bash
RELEEM_PG_TYPE=1 RELEEM_PG_PASSWORD='[MONITORING_PASSWORD]' RELEEM_PG_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

Add `RELEEM_PG_HOST`, `RELEEM_PG_PORT`, or `RELEEM_PG_SSL_MODE=true` before `bash -c` only when the database does not use the local defaults. The SSL switch maps to `sslmode=require`; it does not provide certificate and hostname verification equivalent to `verify-full`.

The installer writes the Agent configuration to `/opt/releem/releem.conf`. Keep this file readable only by authorized administrators.

## Installer parameters {#installer-parameters}

- `RELEEM_API_KEY` identifies the server in Releem.
- `RELEEM_HOSTNAME` overrides the name displayed in the Dashboard.
- `RELEEM_CRON_ENABLE=1` enables the automatic daily update. Set it to `0` to disable scheduled updates. See [Update the Agent](/installation/manage-the-releem-agent/update).
- `RELEEM_PG_TYPE=1` selects PostgreSQL.
- `RELEEM_PG_HOST` defaults to `127.0.0.1`, `RELEEM_PG_PORT` defaults to `5432`, and `RELEEM_PG_LOGIN` and `RELEEM_PG_PASSWORD` configure the PostgreSQL monitoring connection.
- `RELEEM_PG_DATABASE` sets the database used by the installer for account and extension setup and defaults to `postgres`. It does not change the Agent's statistics connection; keep `pg_stat_statements` available in `postgres`.
- `RELEEM_PG_CONF_DIR` selects the existing directory where the Agent writes recommended PostgreSQL configuration when it cannot detect `postgresql.conf`. Create the directory first and confirm the intended instance includes it; otherwise Agent configuration application is disabled.
- `RELEEM_DB_MEMORY_LIMIT` sets the database memory limit in MB; `0` uses all available memory. Set a limit when other software shares the server.
- `RELEEM_PG_ROOT_LOGIN` sets the PostgreSQL administrative login and defaults to `postgres`. Do not put a root-password variable in a reusable example; use the installer's masked prompt.
- `RELEEM_PG_ROOT_PASSWORD` supplies the administrative password. When omitted, the installer first tries peer/passwordless access and then prompts for it. Use the prompt instead of storing the password in a command.
- `RELEEM_PG_SSL_MODE=true` maps to `sslmode=require`; `false` or omission maps to `sslmode=disable`. It is not a `verify-full` setting.
- `RELEEM_QUERY_OPTIMIZATION=true` enables PostgreSQL query data collection after you set up `pg_stat_statements` and grant the required access. Remove the flag only when you intend to disable that collection.

For the installed Agent's settings, see [Configure the Releem Agent](/installation/manage-the-releem-agent/configuration).

Setting `RELEEM_PG_TYPE`, `RELEEM_PG_HOST`, `RELEEM_PG_LOGIN`, `RELEEM_PG_PASSWORD`, `RELEEM_PG_ROOT_LOGIN`, or `RELEEM_PG_ROOT_PASSWORD` selects the PostgreSQL installer path. When you omit the monitoring login and password in the automatic path, the installer creates `releem` and generates its password.

## Expected result {#expected-result}

The installer completes without an error, the Agent service starts, and the new server appears in the Releem Dashboard.

## Verify the installation {#verify-installation}

Open the Dashboard and confirm both that **Agent Status: Connected** is shown and that the Dashboard has a current data timestamp or updated metrics. If the service is connected but current data is absent, review the [Agent logs](/installation/manage-the-releem-agent/logs) and continue to troubleshooting.

## Troubleshooting {#troubleshooting}

If the server does not connect, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Recheck this installation guide, PostgreSQL permissions, network source restrictions, and installed configuration. For lifecycle tasks, use the dedicated [update](/installation/manage-the-releem-agent/update) and [uninstall](/installation/manage-the-releem-agent/uninstall) guides.
