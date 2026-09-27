---
id: postgresql
slug: /recommendations/configuration-tuning/apply-manually/postgresql
title: Apply configuration manually for PostgreSQL
---

# Apply configuration manually for PostgreSQL

Apply Releem's recommended settings to a self-managed PostgreSQL 15–18 server on Linux. The Agent saves the recommendation to `/opt/releem/conf/z_aiops_postgresql.conf`.

## Before you begin {#linux-before-you-begin}

- Review the [PostgreSQL permissions](/supported-databases/postgresql/required-permissions) and [application checks](/recommendations/configuration-tuning/apply-configuration#before-you-apply).
- Use an administrator account to inspect settings and reload configuration. You also need access to configuration files and the service for the intended PostgreSQL instance.
- Record the current values and back up the active configuration and any existing Releem file outside the include directory.
- Plan a maintenance window for restart-required settings. A restart interrupts connections to that instance.

## Step 1: Locate the active configuration {#linux-locate-configuration}

Connect to the intended instance with `psql` as an administrator, using your normal connection method. Do not put a password in the command. Run:

```sql
SHOW config_file;
SHOW data_directory;
```

Open the returned `postgresql.conf` and find its `include_dir` or `include` entries. Use the include directory for this instance. For example, a Debian or Ubuntu installation may use `/etc/postgresql/15/main/conf.d/`; another installation may use `conf.d/` under its data directory.

## Step 2: Copy the recommended configuration {#linux-copy-recommended-configuration}

Review `/opt/releem/conf/z_aiops_postgresql.conf` and confirm it contains the recommendation for this server. Replace the placeholder with the existing include directory you identified:

```bash
cp /opt/releem/conf/z_aiops_postgresql.conf [POSTGRESQL_INCLUDE_DIRECTORY]/
```

Ensure the PostgreSQL service account can read the file. If no include directory is configured, place the file beside the active `postgresql.conf` and add this line to that file:

```ini
include 'z_aiops_postgresql.conf'
```

Do not add a second include when the file is already loaded. Later settings and `postgresql.auto.conf` can override it. See [PostgreSQL configuration files](https://www.postgresql.org/docs/15/config-setting.html).

## Step 3: Check and load the settings {#linux-reload-configuration}

Check for configuration errors in the administrator session before reloading:

```sql
SELECT sourcefile, sourceline, name, error
FROM pg_file_settings
WHERE error IS NOT NULL;
```

Correct reported errors, then reload:

```sql
SELECT pg_reload_conf();
```

A `true` result means the reload signal was sent, not that every value is active. Inspect the database log and [effective settings](#linux-verify-applied-configuration).

## Step 4: Restart when required {#linux-restart-postgresql}

Settings with context `postmaster` require a restart. After reload, check `pending_restart` in the query below. When needed, restart the intended instance during your maintenance window. On a systemd installation, replace the placeholder with that instance's service unit:

```bash
systemctl restart [POSTGRESQL_SERVICE]
```

Confirm the unit, especially on a host with multiple PostgreSQL instances. It must control the intended instance.

## Step 5: Verify the applied configuration {#linux-verify-applied-configuration}

In a fresh administrator session, inspect the changed parameters. Replace this example list with names from the recommendation:

```sql
SELECT name, setting, unit, context, source, sourcefile, pending_restart
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'max_connections')
ORDER BY name;
```

Compare values and units. `pending_restart = true` identifies a change awaiting restart. Inspect the source when a value differs; session, role, database, or command-line settings can override file values. See [pg_settings](https://www.postgresql.org/docs/15/view-pg-settings.html).

Confirm database health, application connectivity, and current metrics in Releem. An application event alone does not establish that the settings are effective.

## Troubleshooting and recovery {#linux-troubleshooting}

- **Settings are unchanged:** Check the include path, file permissions, configuration errors, and overrides. Recheck from a new application connection as well as the administrator session.
- **A setting is pending:** Restart the intended instance during the maintenance window, then repeat verification.
- **PostgreSQL does not start:** Inspect its error log. Restore the previous configuration file, or remove the new include entry and move the newly added Releem file outside the include directory. Restart the same instance and verify its previous values and application connectivity.

To reverse an applied change, restore the configuration backup. Reload for reloadable settings and restart for startup-only settings. Repeat the effective-value and health checks after recovery.
