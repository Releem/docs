# Schema change troubleshooting guide

This guide covers failure scenarios for **automatic schema changes** executed by the Releem Agent. When a change fails, check the task output in the Releem portal and match the **exit code** and message to the table below.

Exit codes are reported as `task_exit_code` on the task status sent back to Releem. A task with **status 4** failed; **status 1** with exit code **0** succeeded.

For configuration prerequisites, see [user-guide-task-automation.md](./user-guide-task-automation.md).

---

## Exit codes set before execution starts


| Scenario                          | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                                               |
| --------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema change execution disabled  | **10**    | Set `enable_exec_ddl = true` in `/opt/releem/releem.conf` (or your config path), restart the agent, and retry the change from Releem.                                                                                                                                                               |
| Invalid or malformed task payload | **2**     | This is not fixable on the server alone—the task JSON from Releem is invalid or missing required fields (`schema_name`, `ddl_statement`, `analysis_results.schema_name`, `analysis_results.table_name`). Contact Releem support with the task id; retry after the platform resends a valid payload. |
| Empty schema change list          | **3**     | The task contained no statements to run. Retry from Releem or contact support if the change should have been scheduled.                                                                                                                                                                             |


---

## Exit codes set during validation (per statement)

These stop the task before any DDL or backup runs on the server.


| Scenario                                        | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DDL failed syntax validation                    | **4**     | Fix the SQL in Releem (or cancel and recreate the change). The task output includes `syntax validation failed` and any `syntax_error` detail from analysis. Do not retry the same statement until the DDL is corrected.                                                                                     |
| No safe execution method                        | **5**     | Releem analysis marked the change as neither online DDL nor `pt-online-schema-change` safe (`ok_online_ddl` and `ok_pt_osc` both false). Revise the change (smaller scope, different operation), use a maintenance window with manual DDL, or ask Releem why the statement was classified as blocking-only. |
| Pre-change backup required but PITR unavailable | **6**     | The change requested a backup before DDL, but point-in-time recovery is not available on this instance (binlog/archiving, managed-service PITR, etc.). Enable PITR on the server or disable the pre-change backup requirement for this change in Releem if policy allows.                                   |


---

## Exit code 7 — execution or backup failed

All rows below use exit code **7**. The task output includes `Statement N failed:` followed by the underlying error. Enable `debug = true` in `releem.conf` and restart the agent for detailed command logs (passwords are masked).

### Disk space and filesystem capacity


| Scenario                               | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Insufficient space on MySQL datadir    | **7**     | Message contains `insufficient datadir free space` (must stay **above 10%** free) or `insufficient datadir capacity` (projected use after change must stay **at or below 90%**). Free space on the datadir filesystem, archive or drop unused data, or shrink large tables before retrying. Only for emergencies: set `disable_space_checks = true` in `releem.conf` if your team accepts skipping these checks. |
| Insufficient space in backup directory | **7**     | Message contains `insufficient disk space: required` under `backup_dir`. Free space on the volume that holds `backup_dir` (default `/tmp/backups`), point `backup_dir` to a larger filesystem, or lower `backup_space_buffer` only if you accept less safety margin.                                                                                                                                             |
| Cannot read datadir or table size      | **7**     | Messages such as `failed to resolve datadir`, `datadir is empty`, `failed to get table size`, or `failed to check datadir filesystem capacity`. Verify the agent MySQL user can run `SHOW VARIABLES LIKE 'datadir'` and query `information_schema.TABLES` for the target schema and table.                                                                                                                       |
| Cannot check backup directory          | **7**     | `failed to check disk space` or `failed to create backup directory`. Ensure `backup_dir` exists, is writable by the agent process, and is on a filesystem the host can stat.                                                                                                                                                                                                                                     |


### Pre-change backup


| Scenario                            | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                                                  |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mysqldump backup failed             | **7**     | Message contains `backup failed` and `mysqldump failed`. Install `mysqldump`, set `mysqldump_path` if needed, confirm `mysql_host` / `mysql_user` / `mysql_password` in `releem.conf`, and ensure the user can dump the target table. Run the same mysqldump manually as the agent user to reproduce.  |
| XtraBackup backup or prepare failed | **7**     | Message contains `xtrabackup backup failed` or `xtrabackup prepare failed`. Install a compatible **xtrabackup** (or **mariabackup** if your deployment maps it via `xtrabackup_path`), fix `xtrabackup_path`, and verify backup user privileges. Review tool output in agent logs with `debug = true`. |
| Backup configuration missing        | **7**     | `mysql_host is required for backup` or `config is required for backup`. Set MySQL connection settings in `releem.conf` the same way as for normal agent monitoring.                                                                                                                                    |
| Backup size estimate failed         | **7**     | `failed to estimate backup size`. Check that the target table exists and the agent user can read `information_schema.TABLES`.                                                                                                                                                                          |


### Online DDL (including dry-run on test table)


| Scenario                                | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Online DDL preflight (dry-run) failed   | **7**     | Message contains `online DDL preflight failed on test table`. The agent clones the table into `online_ddl_test_schema` (default `releem_online_ddl_test`) and runs the DDL there first. Grant `CREATE`, `DROP`, `INDEX`, `ALTER` on that schema; confirm the DDL is valid for an empty copy (same engine/structure). Fix incompatible DDL or use a change Releem routes to `pt-online-schema-change`. |
| Online DDL failed on production table   | **7**     | Message contains `schema change execution failed` after preflight succeeded. Often metadata locks, unsupported `ALGORITHM`/`LOCK`, or replication restrictions. Check MySQL error in agent logs; retry in a low-traffic window; resolve blocking sessions. The agent does **not** fall back to pt-osc after online DDL fails.                                                                         |
| Test schema cannot be created           | **7**     | `test schema is required`, `failed to create test schema`, or `failed to create test table`. Set `online_ddl_test_schema` if the default name conflicts; grant DDL on that schema; ensure disk space for the empty clone.                                                                                                                                                                             |
| DDL shape not supported for online path | **7**     | `unsupported DDL for online clauses` or `could not locate target table in DDL statement`. Use `ALTER TABLE` or supported `CREATE INDEX` forms; ensure the statement references the analyzed `schema.table`.                                                                                                                                                                                           |
| Lock wait timeout                       | **7**     | Online DDL sets `lock_wait_timeout = 20`. If errors mention lock wait or metadata locks, clear blocking transactions and retry, or use a maintenance window / pt-osc path if Releem allows it.                                                                                                                                                                                                        |


### pt-online-schema-change


| Scenario                     | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pt-osc dry-run failed        | **7**     | Message contains `pt-online-schema-change dry-run failed`. Install [Percona Toolkit](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html), set `ptosc_path`, grant privileges in the user guide (`SELECT`, `INSERT`, `DROP`, `RELOAD`, `SUPER`, `SHOW VIEW`, `TRIGGER` on `*.`* when required). Run `pt-online-schema-change --dry-run` manually with the same connection settings. |
| pt-osc execute failed        | **7**     | Dry-run passed but `pt-online-schema-change failed` on execute. Check pt-osc output in logs (triggers, replicas, disk, permissions). Resolve replica lag or tool errors before retrying.                                                                                                                                                                                                              |
| pt-osc configuration missing | **7**     | `mysql_host is required for pt-online-schema-change` or `config is required for pt-online-schema-change`. Complete MySQL settings in `releem.conf`.                                                                                                                                                                                                                                                   |


### Other execution errors (exit code 7)


| Scenario                   | Exit code | Troubleshooting steps                                                                                                                                            |
| -------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing table name         | **7**     | `table name is required for schema change execution`. Internal/task payload issue—contact Releem support with the task id.                                       |
| Failed to parse table name | **7**     | `failed to parse table name`. Ensure `analysis_results.schema_name` and `analysis_results.table_name` match the real object and use a valid `schema.table` form. |


---

## Exit code 8 — no statements executed


| Scenario                   | Exit code | Troubleshooting steps                                                                                                                                                                                                                                                 |
| -------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No schema changes executed | **8**     | Task output includes `No schema changes were executed.` This is returned when the loop finishes without applying any statement (unusual if earlier validation passed). Review full task output and agent logs; retry from Releem or contact support with the task id. |


---

## Success and non-failure notes


| Scenario                  | Exit code               | Troubleshooting steps                                                                                                                                                              |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Success                   | **0**                   | Task status **1**. Output lists `Statement N successful:` for each applied DDL. No action required.                                                                                |
| Non-InnoDB storage engine | *(none — warning only)* | Output may include `warning: storage engine is ...` without failing the task. Prefer InnoDB for online DDL and backups; plan manual change if you rely on MyISAM or other engines. |


---

## Quick reference: exit code summary


| Exit code | Meaning                                               |
| --------- | ----------------------------------------------------- |
| **0**     | Success                                               |
| **2**     | Invalid task payload                                  |
| **3**     | Empty change list                                     |
| **4**     | Syntax validation failed                              |
| **5**     | No online DDL or pt-osc path                          |
| **6**     | Pre-change backup blocked (no PITR)                   |
| **7**     | Backup or DDL execution failed (see sub-tables above) |
| **8**     | No statements executed                                |
| **10**    | `enable_exec_ddl` is false                            |


---

## Where to look next

1. Task output in the Releem portal for the exact `Statement N failed:` line.
2. Agent logs with `debug = true` (commands, preflight SQL, tool stderr).
3. MySQL server error log for the time of the failure.
4. [task-type-6-schema-changes.md](./task-type-6-schema-changes.md) for technical behavior and safety limits.

