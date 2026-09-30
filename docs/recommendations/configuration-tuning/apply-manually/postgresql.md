---
id: postgresql
slug: /recommendations/configuration-tuning/apply-manually/postgresql
title: Apply configuration manually for PostgreSQL
---

# Apply configuration manually for PostgreSQL

Apply Releem's recommended settings to a self-managed PostgreSQL 15–18 server on Linux or to [AWS RDS and Aurora PostgreSQL](#aws-rds-and-aurora). For Linux, the Agent saves the recommendation to `/opt/releem/conf/z_aiops_postgresql.conf`.

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

## AWS RDS and Aurora PostgreSQL {#aws-rds-and-aurora}

Use AWS parameter groups instead of copying a Linux configuration file. Review the [shared application checks](/recommendations/configuration-tuning/apply-configuration#before-you-apply) and [managed PostgreSQL setup](/installation/postgresql/aws-rds#parameter-groups).

### Before you begin

Record the exact attached custom DB parameter group, current values, and every instance sharing the group. For Aurora, also record the custom DB cluster parameter group and every cluster sharing it. Approve the change for all affected resources or use dedicated groups. Default groups cannot be modified. Plan the application timing, restart window, and restoration of previous values or groups.

If you choose Agent application instead, only the Agent targeting the Aurora writer changes cluster parameters. It requires `rds:ModifyDBClusterParameterGroup` access on the attached cluster group.

### Apply the settings

1. Open the recommended configuration in the Releem Dashboard and review each setting.
2. In the AWS RDS console, open **Parameter groups**.
3. Select the attached custom instance group, or the cluster group for an Aurora cluster parameter.
4. Choose **Edit parameters** and enter the recommended values for that group.
5. Save the changes and record any pending-reboot status.
6. Confirm the intended custom groups are attached to the instance and, for Aurora, the cluster. If attachment changes are needed, modify the database and choose the approved application timing.
7. Reboot affected instances through the AWS procedure during the planned maintenance window when required. Coordinate cluster changes across affected Aurora members; a restart interrupts connections.

### Verify and recover

Check the assigned group status and pending-reboot state in AWS. In a fresh PostgreSQL administrator session, inspect the effective values, units, and restart state:

```sql
SELECT name, setting, unit, context, source, pending_restart
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'max_connections')
ORDER BY name;
```

Replace the example parameter list with the recommendation's settings. Verify every affected Aurora writer or reader after cluster changes. Confirm database health, application connectivity, and current metrics in Releem; an application event alone does not establish effective values.

If a value differs, check the assigned group, pending restart, and session, role, or database overrides. If database health degrades, restore recorded parameter values or reattach the previous custom groups. Reboot if the restored settings require it, then repeat effective-value and health checks. Contact Releem support if recovery does not restore the expected state.
