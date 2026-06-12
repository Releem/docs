---
id: schema-change-troubleshooting
title: Schema Change Troubleshooting
---

# Schema Change Troubleshooting

Use this guide when an automatic schema change fails in Releem.

Open the failed task in the Releem Dashboard and check:

1. the exact **Apply Index Error** message;
2. the detailed error text shown after the main error title;
3. the Releem Agent logs when the dashboard message is not enough.

Some dashboard views show a generic title such as `Schema changes execution failed` and then append the detailed error sent by the agent. Match the detailed text against the tables below. For logs, see [How to Check Releem Agent Logs](/releem-agent/how-to-check-logs).

For setup requirements, see [Automatic Schema Changes](/query-optimization/automatic-schema-changes).

## Errors Before Execution Starts

These errors happen before the agent runs a backup or DDL statement.

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Automatic schema changes are disabled | `schema change execution is disabled by config` | Set `enable_exec_ddl=true` in `/opt/releem/releem.conf`, restart the Releem Agent, and retry the task from Releem. |
| Task data is invalid | `taskdetails JSON`, `schema_name is required`, `ddl_statement is required`, `analysis_results.schema_name is required`, or `analysis_results.table_name is required` | Contact Releem support with the task id. The task payload sent to the agent is incomplete or malformed and cannot be fixed only on the database server. |
| No schema change was sent | `Invalid task_details: empty schema change list` | Retry from Releem. If the recommendation should contain a change, contact Releem support with the task id. |
| SQL statement is invalid | `Statement N skipped: syntax validation failed` | Do not retry the same task. Fix or recreate the schema recommendation so the DDL is valid for the target MySQL or MariaDB version. |

## Releem Did Not Find a Safe Automatic Method

These errors happen during per-statement validation. The agent stops before running DDL.

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Releem cannot run this change online | `Statement N skipped: cannot be executed without blocking the table` | Apply the change manually during a maintenance window, or ask Releem support to review the recommendation. Releem did not allow native Online DDL or `pt-online-schema-change` for this statement. |
| Point-in-time recovery is not ready | `Point-in-time recovery is not possible` | Enable binary logging and keep at least 2 days of binary log retention, then let the agent collect a fresh snapshot and retry. If this is a managed database, enable the provider's equivalent PITR/binlog retention setting. |

## Backup or Execution Failed

These errors mean the agent started the operational phase and then the backup or DDL execution failed. The dashboard may show `Schema changes execution failed` with the detailed agent error.

Use the text after `Statement N failed:` or after the dashboard prefix to identify the exact issue.

### Disk Space and Filesystem Checks

| Error name | Error text contains | What to do |
| --- | --- | --- |
| MySQL data directory has too little free space | `insufficient datadir free space` | Free space on the filesystem that contains MySQL `datadir`, then retry. The agent requires more than 10% free space before it starts the change. |
| MySQL data directory would become too full | `insufficient datadir capacity for table change` | Add storage, archive data, drop unused data, or reduce the target table size before retrying. Projected datadir usage after the change must stay at or below 90%. |
| Agent cannot read the MySQL data directory | `failed to resolve datadir`, `datadir is empty`, `failed to check datadir filesystem capacity`, or `invalid datadir filesystem size` | Check that MySQL returns `SHOW VARIABLES LIKE 'datadir'`, that the path exists on the host where the agent runs, and that the agent can read filesystem capacity for that path. |
| Agent cannot estimate the target table size | `failed to get table size` | Check that the table still exists and that the agent MySQL user can read `information_schema.TABLES` for the target schema and table. |

Do not disable space checks for normal production use. Use `disable_space_checks=true` only temporarily and only when another capacity check is already in place.

### Backup Directory Checks

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Backup directory does not have enough free space | `backup failed: insufficient disk space` | Free space on the filesystem used by `backup_dir`, or move `backup_dir` to a larger volume. Keep `backup_space_buffer` high enough for your safety margin. |
| Backup directory cannot be checked | `backup failed: failed to check disk space` | Create `backup_dir` before retrying, confirm it is on a mounted filesystem, and make sure the agent process can access it. |
| Backup directory cannot be created | `backup failed: failed to create backup directory` | Create the directory manually, fix ownership and permissions, and retry. |
| Backup size cannot be estimated | `backup failed: failed to estimate backup size` | Check that the target table or database still exists and that the agent MySQL user can read metadata from `information_schema.TABLES`. |

### Pre-change Backup Tools

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Backup connection settings are incomplete | `backup failed: mysql_host is required for backup` or `backup failed: config is required for backup` | Check the MySQL connection settings in `releem.conf`: `mysql_host`, `mysql_port`, `mysql_user`, and `mysql_password`. Restart the agent after changing the file. |
| Logical backup with mysqldump failed | `backup failed: mysqldump failed` | Install `mysqldump`, set `mysqldump_path` if the binary is not on `PATH`, and confirm that the agent MySQL user can dump the target table. |
| Physical backup with xtrabackup failed | `backup failed: xtrabackup backup failed` | Install a compatible Percona XtraBackup for MySQL, or use `mariabackup` for MariaDB by setting `xtrabackup_path="mariabackup"`. Check the tool output in the agent logs. |
| Physical backup prepare step failed | `backup failed: xtrabackup prepare failed` | Check that the backup tool version matches the server type and version. Review the detailed tool output in the agent logs, fix the backup tool issue, and retry. |
| Unsupported backup method was selected | `backup failed: unsupported backup method` | Contact Releem support with the task id and agent logs. This indicates an internal task or agent mismatch. |

### Native Online DDL

These errors are usually shown as `Schema changes execution failed: schema change execution failed: ...`.

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Online DDL test schema is not configured | `test schema is required for online DDL preflight` | Set `online_ddl_test_schema="releem_online_ddl_test"` or another schema name in `releem.conf`, grant the agent user access to it, restart the agent, and retry. |
| Online DDL test schema cannot be created | `failed to create test schema` | Grant the agent MySQL user permission to create the configured test schema, or create the schema manually and grant access. |
| Online DDL test table cannot be created | `failed to create test table` | Grant the agent user permission to create tables in `online_ddl_test_schema`. Also check that the source table still exists. |
| Online DDL preflight failed | `online DDL preflight failed on test table` | The agent tested the DDL on an empty copy of the table and MySQL rejected it. Check the MySQL error after this message. Fix unsupported DDL, incompatible clauses, or missing privileges before retrying. |
| DDL format is not supported for online execution | `empty SQL statement`, `unsupported DDL for online clauses`, `failed to prepare test DDL SQL`, or `could not locate target table in DDL statement` | Use a supported `ALTER TABLE` or `CREATE INDEX` statement that clearly targets the analyzed table. Recreate the recommendation if the DDL text no longer matches the table. |
| Online DDL lock timeout cannot be set | `failed to set session lock_wait_timeout` | Grant the needed session-variable permission if required by your server, or check MySQL restrictions that prevent setting session variables. |
| Online DDL is blocked or rejected on the production table | `schema change execution failed` with a MySQL error about locks, metadata locks, `ALGORITHM=INPLACE`, `LOCK=NONE`, or another server error | Clear blocking transactions, retry during a quieter period, or apply the change manually during a maintenance window. If the error says `Try ALGORITHM=COPY`, Releem can fall back to `pt-online-schema-change` only when that method was allowed for the statement. |

### pt-online-schema-change

These errors are usually shown as `Schema changes execution failed: pt-online-schema-change execution failed: ...`.

| Error name | Error text contains | What to do |
| --- | --- | --- |
| pt-online-schema-change connection settings are incomplete | `mysql_host is required for pt-online-schema-change` or `config is required for pt-online-schema-change` | Check `mysql_host`, `mysql_port`, `mysql_user`, and `mysql_password` in `releem.conf`. Restart the agent after changing the file. |
| pt-online-schema-change cannot parse the table name | `pt-online-schema-change execution failed: failed to parse table name` | Confirm that `analysis_results.schema_name` and `analysis_results.table_name` match an existing table and use a valid `schema.table` form. |
| pt-online-schema-change dry run failed | `pt-online-schema-change dry-run failed` | Install or update `pt-online-schema-change`, set `ptosc_path` if needed, and grant the permissions required by `pt-online-schema-change`. Run a manual dry run with the same connection settings if you need the full tool output. |
| pt-online-schema-change execution failed | `pt-online-schema-change failed` | The dry run passed, but the actual execution failed. Check the tool output in agent logs. Common causes include missing privileges, replica lag, triggers, foreign key restrictions, disk limits, or table changes after the recommendation was generated. |

`pt-online-schema-change` may require privileges such as `SELECT`, `INSERT`, `DROP`, `RELOAD`, `SUPER`, `SHOW VIEW`, and `TRIGGER`, depending on the server version and topology.

### Other Execution Errors

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Target table is missing from the task | `table name is required for schema change execution` | Contact Releem support with the task id. The task reached the agent without the analyzed table name. |
| Target table name cannot be parsed | `failed to parse table name` | Check that the recommendation still points to an existing `schema.table`. If the table was renamed or dropped after the recommendation was generated, recreate the recommendation. |
| No execution method was available during execution | `schema change could not be executed` | Contact Releem support with the task id and agent logs. This should normally be caught earlier by validation. |

## No Statement Was Applied

| Error name | Error text contains | What to do |
| --- | --- | --- |
| Task finished without applying a change | `No schema changes were executed` | Review the full task output and agent logs. Retry from Releem if the recommendation is still valid, or contact support if the task should have applied a change. |
