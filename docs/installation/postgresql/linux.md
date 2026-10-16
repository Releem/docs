---
id: linux
slug: /installation/postgresql/linux
title: Install Releem for PostgreSQL on Linux
---

# Install Releem for PostgreSQL on Linux

Run the applicable installation command as `root`. Replace bracketed placeholders with the values for this server.

Use this guide for a self-managed PostgreSQL server on Linux.

Install the Agent on the database host when possible. For a remote database, restrict the database listener and firewall to the exact Agent source address.

## Prerequisites

Use these task links for the complete flow: [requirements](#prerequisites), [permissions](/supported-databases/postgresql/required-permissions), [automatic installation](#automatic-installation), [manual installation](#manual-installation), [parameters](#installer-parameters), [expected result](#expected-result), [verification](#verify-installation), [troubleshooting](#troubleshooting), [update](/installation/manage-the-releem-agent/update), and [uninstall](/installation/manage-the-releem-agent/uninstall).

Make sure the `postgresql-contrib` package for your PostgreSQL version is installed before running either command. It supplies `pg_stat_statements`, which the standard installation uses for query data. The automatic installer can create the monitoring user and attempt to create the extension, but it cannot install a missing PostgreSQL package. See [PostgreSQL Required Permissions](/supported-databases/postgresql/required-permissions#query-metrics-with-pg_stat_statements) for the extension and restart requirements.

## PostgreSQL settings for query data {#postgresql-settings}

The Agent reads query data from `pg_stat_statements` and `pg_stat_activity`. The following PostgreSQL parameters control what reaches the Dashboard. Set these parameters in the active `postgresql.conf` or an included file. The Linux installer runs `releem.sh -p`, which writes `shared_preload_libraries` with `pg_stat_statements`, `pg_stat_statements.track = all`, and `pg_stat_statements.max = 10000` to `collect_metrics.conf` in the Releem PostgreSQL configuration directory and asks before restarting PostgreSQL. If you decline the restart, run `bash /opt/releem/releem.sh -p` during a maintenance window. The installer does not change `track_activity_query_size` or `pg_stat_statements.track_utility`.

| Parameter | PostgreSQL default | Recommended | What it controls | Apply |
|---|---|---|---|---|
| `shared_preload_libraries` | empty | includes `pg_stat_statements` | Required for Query Analytics, the **Latency** graph, and Query Optimization. Keep the existing entries in the list. | Restart PostgreSQL |
| `track_activity_query_size` | `1024` bytes | `1024`, or more for long queries | Maximum query text length kept in `pg_stat_activity` and shown in the **Activity** view. Each server process reserves this amount of shared memory. | Restart PostgreSQL |
| `pg_stat_statements.max` | `5000` | `10000` | Number of distinct normalized statements tracked. When the limit is reached, PostgreSQL discards the least-executed statements. | Restart PostgreSQL |
| `pg_stat_statements.track` | `top` | `all` | `top` tracks statements sent by clients. `all` also tracks statements run inside functions and procedures. `none` disables tracking. | Reload; superuser only |
| `pg_stat_statements.track_utility` | `on` | `on` | Tracks utility commands, meaning everything except `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `MERGE`. Set `off` to keep commands such as `SET`, `BEGIN`, and `VACUUM` out of Query Analytics. | Reload; superuser only |

Check the current values and whether a restart is pending:

```sql
SELECT name, setting, unit, pending_restart
FROM pg_settings
WHERE name IN ('shared_preload_libraries', 'track_activity_query_size', 'compute_query_id',
               'pg_stat_statements.max', 'pg_stat_statements.track', 'pg_stat_statements.track_utility');
```

The `pg_stat_statements.*` rows appear only after the library is loaded. On PostgreSQL 14 and later, `compute_query_id` must be `auto` (the default) or `on`.

### Activity view {#activity-query-text}

The **Activity** view displays active sessions from `pg_stat_activity` with the text of each running query. PostgreSQL keeps up to `track_activity_query_size` bytes of query text per session; the default is `1024`. To display longer queries in full, set `track_activity_query_size` to `4096` or more. The new value applies to queries that start after the restart.

### Query Analytics {#query-analytics-data}

Query Analytics displays statistics from `pg_stat_statements` for each tracked statement, grouped by database and query ID: call count, total execution time, and mean execution time. Statements are shown in normalized form, with constants replaced by placeholders such as `$1`.

- `pg_stat_statements.max`, `pg_stat_statements.track`, and `pg_stat_statements.track_utility` define which statements are tracked.
- Statistics are cumulative since the last `pg_stat_statements_reset()` or since the statement was first tracked.
- With Query Optimization enabled, Releem collects `EXPLAIN` plans for `SELECT` and `WITH` statements: the top 100 by total execution time and the top 100 by mean execution time. When `databases_query_optimization` lists databases, plans are collected for those databases.

## Automatic installation {#automatic-installation}

Use this path when the installer may create the `releem` monitoring user. The installer asks for the PostgreSQL administrative password if it needs one.

```bash
RELEEM_PG_TYPE=1 RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

`RELEEM_PG_TYPE=1` selects PostgreSQL. Do not add an administrative password to the command. Continue with the [expected result](#expected-result).

## Manual installation {#manual-installation}

Use this path after a DBA has created the monitoring user and reviewed `pg_hba.conf` according to the [PostgreSQL permissions guide](/supported-databases/postgresql/required-permissions).

```bash
RELEEM_PG_TYPE=1 RELEEM_PG_PASSWORD='[MONITORING_PASSWORD]' RELEEM_PG_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY='[RELEEM_API_KEY]' RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
```

Add `RELEEM_PG_HOST`, `RELEEM_PG_PORT`, or `RELEEM_PG_SSL_MODE=true` before `bash -c` only when the database does not use the local defaults. The SSL switch maps to `sslmode=require`; it does not provide certificate and hostname verification equivalent to `verify-full`.

The installer writes the Agent configuration to `/opt/releem/releem.conf`. Keep this file readable only by authorized administrators.

## Installer parameters {#installer-parameters}

- `RELEEM_API_KEY` identifies the server in Releem.
- `RELEEM_HOSTNAME` overrides the name displayed in the Dashboard.
- `RELEEM_CRON_ENABLE=1` enables the automatic daily update. Set it to `0` to disable scheduled updates. See [Update the Agent](/installation/manage-the-releem-agent/update).
- `RELEEM_DB_MEMORY_LIMIT` sets the database memory limit in MB; `0` uses all available memory. Set a limit when other software shares the server.
- `RELEEM_PG_TYPE=1` selects PostgreSQL. Setting `RELEEM_PG_HOST`, `RELEEM_PG_LOGIN`, `RELEEM_PG_PASSWORD`, `RELEEM_PG_ROOT_LOGIN`, or `RELEEM_PG_ROOT_PASSWORD` also selects the PostgreSQL installer path.
- `RELEEM_PG_HOST` defaults to `127.0.0.1`; set it when PostgreSQL listens on a different interface or only on a socket. `RELEEM_PG_PORT` defaults to `5432`, and `RELEEM_PG_LOGIN` and `RELEEM_PG_PASSWORD` configure the PostgreSQL monitoring connection. When you omit them in the automatic path, the installer creates `releem` and generates its password.
- `RELEEM_PG_DATABASE` sets the database used by the installer for account and extension setup and defaults to `postgres`. It does not change the Agent's statistics connection; keep `pg_stat_statements` available in `postgres`.
- `RELEEM_PG_CONF_DIR` selects the existing directory where the Agent writes recommended PostgreSQL configuration when it cannot detect `postgresql.conf`. Create the directory first and confirm the intended instance includes it; otherwise Agent configuration application is disabled.
- `RELEEM_PG_ROOT_LOGIN` sets the PostgreSQL administrative login and defaults to `postgres`. Do not put a root-password variable in a reusable example; use the installer's masked prompt.
- `RELEEM_PG_ROOT_PASSWORD` supplies the administrative password. When omitted, the installer first tries peer/passwordless access and then prompts for it. Use the prompt instead of storing the password in a command.
- `RELEEM_PG_SSL_MODE=true` maps to `sslmode=require`; `false` or omission maps to `sslmode=disable`. It is not a `verify-full` setting.
- `RELEEM_QUERY_OPTIMIZATION=true` enables PostgreSQL query data collection after you set up `pg_stat_statements` and grant the required access. Remove the flag only when you intend to disable that collection.

For the installed Agent's settings, see [Configure the Releem Agent](/installation/manage-the-releem-agent/configuration).

## Expected result {#expected-result}

The installer completes without an error, the Agent service starts, and the new server appears in the Releem Dashboard.

## Verify the installation {#verify-installation}

Open the Dashboard and confirm both that **Agent Status: Connected** is shown and that the Dashboard has a current data timestamp or updated metrics. If the service is connected but current data is absent, review the [Agent logs](/installation/manage-the-releem-agent/logs) and continue to troubleshooting.

## Troubleshooting {#troubleshooting}

If the server does not connect, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Recheck this installation guide, PostgreSQL permissions, network source restrictions, and installed configuration. For lifecycle tasks, use the dedicated [update](/installation/manage-the-releem-agent/update) and [uninstall](/installation/manage-the-releem-agent/uninstall) guides.

### Queries in the Activity view are truncated

PostgreSQL keeps only `track_activity_query_size` bytes of each running query; the default is `1024`. Check the limit:

```sql
SHOW track_activity_query_size;
```

Raise it, for example to `4096`, and restart PostgreSQL. See [PostgreSQL settings for query data](#postgresql-settings).

### Query Analytics has no data

Confirm that `pg_stat_statements` is loaded, that the extension exists in `postgres`, and that query IDs are computed:

```sql
SHOW shared_preload_libraries;
SELECT extversion FROM pg_extension WHERE extname = 'pg_stat_statements';
```

On PostgreSQL 14 and later, also check query ID computation. Skip this command on PostgreSQL 12 and 13, where the parameter does not exist:

```sql
SHOW compute_query_id;
```

Run the second query while connected to `postgres`. If the library is missing, add it to `shared_preload_libraries` and restart PostgreSQL. If the extension is missing, create it. On PostgreSQL 14 and later, set `compute_query_id` to `auto` or `on`. Data appears after new queries run.

### Some queries are missing from Query Analytics

- **The statement limit is reached.** On PostgreSQL 14 and later, a growing `dealloc` value means statements were discarded:

  ```sql
  SELECT dealloc, stats_reset FROM pg_stat_statements_info;
  ```

  Raise `pg_stat_statements.max` and restart PostgreSQL. PostgreSQL 12 and 13 do not have `pg_stat_statements_info`; compare `SELECT count(*) FROM pg_stat_statements;` with `pg_stat_statements.max`.
- **The query runs inside a function or procedure.** Set `pg_stat_statements.track` to `all`.
- **The query is a utility command.** Commands other than `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `MERGE` are tracked only when `pg_stat_statements.track_utility` is `on`.
- **Queries that differ only in constants are grouped.** `pg_stat_statements` normalizes them into one statement with placeholders. Queries with a different structure, such as `IN` lists of different lengths on PostgreSQL 17 and earlier, are tracked separately and use more of the limit.

### Query Analytics counters dropped or history restarted

`pg_stat_statements_reset()`, a PostgreSQL restart, or eviction of a statement resets its counters. On PostgreSQL 14 and later, `stats_reset` in `pg_stat_statements_info` shows the last full reset. Avoid scheduled resets while Releem is collecting data.

### A query has no EXPLAIN plan

Plans are collected only when Query Optimization is enabled, and only for `SELECT` and `WITH` statements in the top 100 by total or mean execution time. If `databases_query_optimization` lists databases, check that the query's database is included, and check that the monitoring role has query read access from [PostgreSQL permissions](/supported-databases/postgresql/required-permissions#query-and-schema-capabilities).

### `CREATE EXTENSION pg_stat_statements` fails with `could not open extension control file`

The `postgresql-contrib` package for the server's PostgreSQL version is not installed. Install it with your distribution's package manager, restart PostgreSQL if `shared_preload_libraries` changed, and create the extension again in `postgres`.
