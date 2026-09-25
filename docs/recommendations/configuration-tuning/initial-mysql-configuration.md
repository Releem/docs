---
id: initial-mysql-configuration
slug: /recommendations/configuration-tuning/initial-mysql-configuration
title: Create an initial MySQL configuration
---

# Create an initial MySQL configuration

Use the Releem Agent to create a base MySQL configuration for a Linux server that still uses its default database configuration. This procedure is documented for MySQL only; do not use these commands for MariaDB or PostgreSQL.

## Before you begin

1. Install MySQL and the Releem Agent on the database host.
2. Confirm that MySQL still uses its default configuration. For an already tuned server, use the standard [Configuration Tuning workflow](/recommendations/configuration-tuning/mysql-tuning-process).
3. Review the [MySQL permissions](/supported-databases/mysql/required-permissions).
4. Record the current values and create a known-good backup artifact of the active MySQL configuration. Confirm that you know its location and how to restore it before you begin.
5. Decide whether you will restart MySQL yourself or allow the command to restart it.

The command evaluates the server's hardware resources, generates `initial_config_mysql.cnf`, saves it under `/opt/releem/conf/`, and applies it to the MySQL configuration. Applying the file changes database settings; restart-required settings do not become effective until MySQL restarts.

## Generate and apply the configuration

Run the command on the database host:

```bash
bash /opt/releem/mysqlconfigurer.sh -s initial
```

The generated file is stored at:

```
/opt/releem/conf/initial_config_mysql.cnf
```

## Allow the command to restart MySQL

Only use the restart option during an approved maintenance window:

```bash
RELEEM_RESTART_SERVICE=1 bash /opt/releem/mysqlconfigurer.sh -s initial
```

If you omit `RELEEM_RESTART_SERVICE=1`, check whether a restart is required and complete it through your normal service-management procedure. Do not treat a successful command exit as confirmation that restart-pending settings are active.

## Verify the result

1. Check whether any setting is restart-pending.
2. Confirm the effective database settings in MySQL after any required restart.
3. Confirm the database service health is normal and the service is running.
4. Check application connectivity and review application errors.
5. Confirm the Releem event for the application attempt, then review current metrics for the same server.

If the command or restart fails, use this recovery path: do not retry while MySQL is unhealthy. Restore the known-good configuration artifact to the active configuration path, then restart MySQL through your approved service procedure. Review the [Releem Agent logs](/installation/manage-the-releem-agent/logs) and database error log. If you cannot restore service, stop and contact Releem Support and your database owner.
