---
id: schema-change-troubleshooting
title: Schema Change Troubleshooting
---

# Schema Change Troubleshooting

Use this guide when an automatic schema change fails in Releem. The failed task usually shows a short message in the Releem Dashboard, and the Releem Agent logs can include more detail.

Before you retry the task:

1. Open the failed task in the Releem Dashboard.
2. Copy the exact error message.
3. Check the matching section below.
4. Fix the server-side issue first.
5. Retry the task from Releem.

If the dashboard message is not enough, check the agent logs. See [How to Check Releem Agent Logs](/releem-agent/how-to-check-logs).

For setup requirements, see [Automatic Schema Changes](/query-optimization/automatic-schema-changes).

## The Task Did Not Start

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `schema change execution is disabled` | The agent is not allowed to run DDL statements. | Set `enable_exec_ddl = true` in `/opt/releem/releem.conf`, restart the Releem Agent, and retry the task. |
| `syntax validation failed` | The SQL statement is not valid for the target server. | Do not retry the same task. Fix or recreate the schema recommendation in Releem. |
| `invalid task payload` or missing fields such as `schema_name` or `ddl_statement` | The task data sent to the agent is incomplete. | Contact Releem support with the task id. This cannot be fixed only on the server. |
| `empty schema change list` | The task did not include any statements to run. | Retry from Releem. If the task should contain a change, contact Releem support with the task id. |

## Releem Could Not Choose a Safe Method

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `no safe execution method` | Releem could not apply the change without blocking the affected table. | Run the change manually during a maintenance window, or contact Releem support to review the recommendation. |
| `pre-change backup required but PITR unavailable` | Releem requires a backup before the change, but point-in-time recovery is not available. | Enable binary logs and keep enough retention for recovery, then retry. For MySQL, check `log_bin` and binary log expiration settings. |

## Disk Space or Filesystem Checks Failed

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `insufficient datadir free space` or `projected usage ... exceeds 90% limit` | The MySQL data directory does not have enough free space for the schema change. | Free disk space, move data, archive old tables, or retry during a planned maintenance process after adding capacity. |
| `backup failed: insufficient disk space` | The backup directory does not have enough free space. | Free space on the filesystem used by `backup_dir`, move `backup_dir` to a larger volume, or increase available storage. |
| `failed to resolve datadir`, `datadir is empty`, `failed to get table size`, or `invalid datadir filesystem size` | The agent could not inspect the data directory or estimate the affected table size. | Check that the agent can connect to MySQL, read the target table metadata, and access the filesystem information. |
| `failed to check disk space` or `failed to create backup directory` | The agent cannot read or create the configured backup directory. | Create `backup_dir`, fix ownership and permissions, and make sure the filesystem is writable by the agent process. |

Do not disable space checks for normal production use. `disable_space_checks = true` should be used only temporarily and only when you have another capacity check in place.

## Backup Failed

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `mysqldump failed` | The logical backup failed before the schema change. | Install `mysqldump`, set `mysqldump_path` if needed, and confirm that the agent database user can read the target table. |
| `xtrabackup backup failed` or `xtrabackup prepare failed` | The physical backup failed before the schema change. | Install a compatible `xtrabackup` version for MySQL or use `mariabackup` for MariaDB. Set `xtrabackup_path` to the correct binary. |
| `failed to estimate backup size` | The agent could not estimate the table backup size. | Check that the database and table still exist and that the agent database user can read their metadata. |

After fixing the tool or permission issue, restart the agent if you changed `releem.conf`.

## Online DDL Failed

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `online DDL preflight failed on test table` | The agent tested the change in `online_ddl_test_schema`, and the test failed. | Check the SQL error in the task output. Confirm that the test schema exists and that the agent user has `CREATE`, `DROP`, `INDEX`, and `ALTER` permissions on it. |
| `test schema is required`, `failed to create test schema`, or `failed to create test table` | The agent could not create the temporary schema or table used for the preflight. | Create the schema from [Automatic Schema Changes](/query-optimization/automatic-schema-changes) and grant the required permissions. |
| `lock wait timeout`, `metadata lock`, or `failed to set session lock_wait_timeout` | Another transaction or session is blocking the schema change. | Clear the blocking transaction and retry, or apply the change during a quieter period. |
| `schema change execution failed` after the preflight passed | The test succeeded, but the production change failed. | Check the full task output and agent logs. If the cause is not clear, contact Releem support with the task id and logs. |

## pt-online-schema-change Failed

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `pt-online-schema-change dry-run failed` | The tool was available, but its dry run failed. | Install or update Percona Toolkit, set `ptosc_path`, and check the permissions required by `pt-online-schema-change`. |
| `pt-online-schema-change failed` | The dry run passed, but the actual execution failed. | Check the agent logs for the tool output. Common causes include missing privileges, trigger conflicts, replication lag, disk space limits, or table changes made after the recommendation was generated. |

`pt-online-schema-change` may require permissions such as `SELECT`, `INSERT`, `DROP`, `RELOAD`, `SUPER`, `SHOW VIEW`, and `TRIGGER`, depending on the server version and topology.

## The Task Finished Without Applying a Change

| Error in Releem | What it means | What to do |
| --- | --- | --- |
| `No schema changes were executed` | The task completed without applying any statement. | Review the full task output and agent logs. Retry from Releem, or contact support if the task should have applied a change. |
