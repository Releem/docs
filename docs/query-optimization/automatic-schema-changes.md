---
id: automatic-schema-changes
title: Automatic Schema Changes
---

# Automatic schema changes in the Releem Agent

If the **Releem Agent** is already installed and running, you can allow it to execute approved schema changes on the server. Automatic schema changes also include the option of running a pre-change backup, in case a rollback is required.

Both automatic schema changes and backups were implemented with availability in mind, so they will only run if:
* There is enough disk space to perform both, the backup and the schema change
* The backup won't block the affected tables
* Point-in-time restore is possible on the server
* The schema change won't block the affected tables

The following steps explain how to configure the agent and the database user to handle this new functionality.

---

## 1. Locate the configuration file

To enable automatic schema changes, we need to include a few new parameters in the agent configuration file. Below is the default location for Linux servers. Open the file with your favorite editor to add the new parameters.

| Platform | Default path |
|----------|----------------|
| Linux | `/opt/releem/releem.conf` |

---
## 2. Enable automatic schema (DDL) execution

By default the agent **does not** run schema changes from Releem, even when you approve them in the product. For schema changes to be executed on your database server, activate this feature explicitly by setting `enable_exec_ddl` to `true`.

Before running the schema change against the real table, the agent will perform a dry-run of the change against an empty table with the same structure. This is to guarantee that the operation can run successfully with the intenteded strategy.

There are some schema changes that the database server can't execute on its own, without blocking the table. An alternative it to use an external tool called [pt-online-schema-change](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html). This tool creates a copy of the table with the intended changes, copies all data to this new table, and swaps it with the existing one, with minimum impact.

[pt-online-schema-change](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html) needs to be available on the server and the location of the tool can be specified in the configuration.

| Setting | Values | What it does |
|---------|--------|----------------|
| `enable_exec_ddl` | `false` (default) or `true` | When `true`, the agent may execute **schema changes** that Releem sends after analysis. When `false`, those changes are not run; the agent reports that execution is disabled. |
| `ptosc_path` | `pt-online-schema-change` | Percona Toolkit is not on `PATH` or you use a non-standard binary location. |
| `online_ddl_test_schema` | `releem_online_ddl_test` (default) or any valid database/schema name | **Optional:** Database/schema name where the agent will test the schema change before executing it against the real table|


---
## 3. Configure your backup settings

When a pre-change backup is requested, the agent needs tools and extra disk space available on the **same host that runs the agent**. As mentioned before, the Releem agent will look for the best alternative to backup the affected tables before the schema change is executed.

* If the server and the table supports it, the agent will create a physical backup of the table using `xtrabackup` or `mariabackup` 
* If online physical backup is not an option, the agent will use mysqldump to create a logical backup of the data (a `.sql` file with necessary statements to re-create the table and the data)

Releem only proceeds with the backup when **point-in-time recovery** is available for the instance as Releem detects it. If not, the change that required the backup will not run.


| Setting | Values | What it does |
|---------|--------|----------------|
| `backup_dir` | `/tmp/backups` (default) | Directory for backup output. Must exist or be creatable and have enough free space. |
| `mysqldump_path` | `mysqldump` (default) | Full path or name on `PATH` for `mysqldump` (logical backup). |
| `xtrabackup_path` | `xtrabackup` (default) | Full path or name on `PATH` for `xtrabackup` (physical backup when Releem selects that method). |
| `backup_space_buffer` | `20.0` (default) | Extra free space (as a percentage) the agent requires above its estimated backup size before starting a backup. |


---
## 4. Extend database user permissions

The same **MySQL user** the agent already uses for monitoring must have permission to run the approved ALTER statements. Connect to the target database server and run the he GRANT statements below:

```sql
-- To allow table ALTERs and New indexes on **any** database
GRANT CREATE, REFERENCES, INDEX, ALTER ON *.* TO `releem`@`127.0.0.1`
```

```sql
-- Alternative: grant ALTER permissions *only* on a specific database
GRANT CREATE, REFERENCES, INDEX, ALTER ON `airportdb`.* TO `releem`@`127.0.0.1`
```

```sql
-- Needed for schema changes dry-runs (note this only affects the test database)
GRANT CREATE, DROP, INDEX, ALTER ON `releem_online_ddl_test`.* TO `releem`@`127.0.0.1`
```

#### Optional - To use pt-online-schema-change as an alternative method when the operation can't be executed online by the server
```sql
GRANT SELECT, INSERT, DROP, RELOAD, SUPER, SHOW VIEW, TRIGGER ON *.* TO `releem`@`127.0.0.1`
```

---



## 5. Restart the agent


After editing, **restart the Releem Agent** so changes take effect.

---

## External tools

Install **mysqldump**, **XtraBackup**, **mariabackup** and **pt-online-schema-change**as appropriate for your Database server and OS flavor. For more information about how to install these tools, please refer to:

* [pt-online-schema-change](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html)
* [xtrabackup](https://docs.percona.com/percona-xtrabackup/2.4/index.html)
* [mariabackup](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview#installing-mariadb-backup)
* [mysqldump](https://dev.mysql.com/doc/refman/9.7/en/mysqldump.html)
