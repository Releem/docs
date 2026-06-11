---
id: schema-change-troubleshooting
title: Schema Change Troubleshooting
---

# Schema Change Troubleshooting

This guide helps you troubleshoot failed **automatic schema changes** executed by the Releem Agent. Use it when Releem cannot apply an index or table change automatically and the Releem Dashboard shows a failed task.

When a change fails, open the failed task in the Releem Dashboard and check:

- **Apply Index Error** - the detailed message, usually including `Statement N failed: ...`.
- **Agent logs** - useful when the dashboard message is not enough. See [How to Check Releem Agent Logs](/releem-agent/how-to-check-logs).

## Before you retry

1. Read the exact output in the Releem Dashboard.
2. Match the message to the table below.
3. Fix the server-side issue first. Retrying without changing anything usually fails again.
4. If the error says the payload is invalid or empty, contact Releem support with the task id.

Automatic schema changes are intended for environments where the Releem Agent is allowed to make DDL changes. The Agent must have enough MySQL privileges, access to the configured backup tools, and `enable_exec_ddl = true` in `/opt/releem/releem.conf` when automatic DDL execution is enabled. 
For configuration prerequisites, see [Automatic Schema Changes](query-optimization/automatic-schema-changes).

---

## Errors before execution starts

| Scenario                          | Troubleshooting steps                                                                                                                                                                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DDL failed syntax validation      | Fix the SQL in Releem (or cancel and recreate the change). The task output includes `syntax validation failed` and any `syntax_error` detail from analysis. Do not retry the same statement until the DDL is corrected.                                                                                     |
| Schema change execution disabled  | Set `enable_exec_ddl = true` in `/opt/releem/releem.conf` (or your config path), restart the agent, and retry the change from Releem.|
| Invalid or malformed task payload | This is not fixable on the server alone—the task JSON from Releem is invalid or missing required fields (`schema_name`, `ddl_statement`, `analysis_results.schema_name`, `analysis_results.table_name`). Contact Releem support with the task id; retry after the platform resends a valid payload. |
| Empty schema change list          | The task contained no statements to run. Retry from Releem or contact support if the change should have been scheduled.                                                                                                                                                                             |

---

## Errors during validation (per statement)

These stop the task before any DDL or backup runs on the server.

| Scenario                                        | Troubleshooting steps                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No safe execution method                        | Releem analysis marked the change as neither online DDL nor `pt-online-schema-change` safe. This means that the change cannot run without temporarily blocking the affected tables, and thus, will not be executed automatically. A maintenance window for manual execution is required. Contact Releem for more details about this scenario. |
| Pre-change backup required but PITR unavailable | A table backup before the schema change is executed was requested, but point-in-time recovery is not available on this instance (binary log is not enabled or the retention window is too small). Enable the binary log on the server by configuring `log_bin` and make sure `expire_log_days` is greater equal or greater than 2. Alternatively, disable the pre-change backup requirement for this change.                                   |


---

## Errors on Backup or Execution

### Disk space and filesystem capacity

| Scenario                               | Error message                                                                                                                              | Troubleshooting steps                                                                                                                                                                                                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Insufficient space on MySQL datadir    | `insufficient datadir free space: ... required >10%` or `insufficient datadir capacity for table change: projected usage ... exceeds 90% limit` | Free space must stay **above 10%** and projected use after the change must stay **at or below 90%**. Free space on the datadir filesystem, archive or drop unused data, or shrink large tables before retrying. This check can be disabled by setting `disable_space_checks = true` in `releem.conf` although **it is not recommended**. It should be done as a last resort and only temporarily. |
| Insufficient space in backup directory | `backup failed: insufficient disk space: required ... available ...`                                                                       | Free space on the volume that holds `backup_dir` (default `/tmp/backups`), point `backup_dir` to a larger filesystem, or lower `backup_space_buffer` only if you accept less safety margin.                                                                                          |
| Cannot read datadir or table size      | `failed to resolve datadir`, `datadir is empty`, `failed to get table size`, `failed to check datadir filesystem capacity`, or `invalid datadir filesystem size` | Verify that the agent database user has the necessary permissions on the target table. Check [Automatic Schema Changes](query-optimization/automatic-schema-changes) for more details.|
| Cannot check backup directory          | `failed to check disk space` or `failed to create backup directory`                                                                        | Ensure `backup_dir` exists and is accessible by the agent process   .                                                                                                                                                                             |


### Pre-change backup

| Scenario                            | Error message                                                                          | Troubleshooting steps                                                                                                                                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mysqldump backup failed             | `backup failed: mysqldump failed: ...`                                                | Make sure `mysqldump` is installed on the server and available at `mysqldump_path`. Confirm the agent database user has access to the target table. |
| XtraBackup `backup` or `prepare` failed | `backup failed: xtrabackup backup failed: ...` or `backup failed: xtrabackup prepare failed: ...` | Install a compatible version of **xtrabackup** (or **mariabackup** in case the target host is running MariaDB) and confirm the tool is available at `xtrabackup_path`. Verify the agent database user has all necessary privileges. |
| Backup size estimate failed         | `failed to estimate backup size: ...`                                                 | Check that the target table still exists. It is possible that the table was renamed or dropped after the recommended change was generated.   |


### Online DDL (including dry-run on test table)

| Scenario                                | Error message                                                                                                            | Troubleshooting steps                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Online DDL preflight (dry-run) failed   | `schema change execution failed: online DDL preflight failed on test table ...`                                          | The agent clones the table into `online_ddl_test_schema` (default `releem_online_ddl_test`) and runs the DDL there first. Make sure the agent database user has the necessary permissions. Check [Automatic Schema Changes](query-optimization/automatic-schema-changes) for more details.                       |
| Online DDL failed on production table   | `schema change execution failed: ...` (after preflight succeeded)                                                        | An unexpected situation caused the backup to fail. Check the agent log for additional errors and contact Releem support. |
| Test schema cannot be created           | `schema change execution failed: test schema is required for online DDL preflight`, `... failed to create test schema ...`, or `... failed to create test table ...` |Make sure the agent database user has the necessary permissions. Check [Automatic Schema Changes](query-optimization/automatic-schema-changes) for more details                                                                                                                                                                                                                                  |
| Lock wait timeout                       | `failed to set session lock_wait_timeout: ...`, or `schema change execution failed: ...` mentioning lock wait / metadata locks | Online DDL sets `lock_wait_timeout = 20`. If errors mention lock wait or metadata locks, clear blocking transactions and retry, or retry execution during a maintenance window.                                                                                                                                                             |


### pt-online-schema-change

| Scenario                     | Error message                                                                                                | Troubleshooting steps                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pt-online-schema-change` dry-run failed        | `pt-online-schema-change execution failed: pt-online-schema-change dry-run failed: ...`                      | Install [Percona Toolkit](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html), set `ptosc_path`, and grant the agent database user the required permissions for the target table. Depending on your MySQL version and topology, pt-online-schema-change may require privileges such as `SELECT`, `INSERT`, `DROP`, `RELOAD`, `SUPER`, `SHOW VIEW`, `TRIGGER`. |
| `pt-online-schema-change` execute failed        | `pt-online-schema-change execution failed: pt-online-schema-change failed: ...`                              | Dry-run passed but the execute step failed. Check pt-online-schema-change output in logs (triggers, replicas, disk, permissions, etc) and contact Releem support. |


## No statements executed


| Scenario                   | Troubleshooting steps                                                                                                                                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No schema changes executed | Task output includes `No schema changes were executed.` This is returned when the loop finishes without applying any statement (unusual if earlier validation passed). Review full task output and agent logs; retry from Releem or contact support with the task id. |
