---
id: docker
slug: /installation/postgresql/docker
title: Install Releem for PostgreSQL on Docker
---

# Install Releem for PostgreSQL on Docker

Run the Releem Agent in a Docker container for PostgreSQL.

## Prerequisites

Create the monitoring account and configure `pg_stat_statements` from [PostgreSQL permissions](/supported-databases/postgresql/required-permissions), including query read access if you use the example below. Keep the extension available in `postgres`, which the Agent uses for its statistics connection. Install Docker, and make sure the Agent container can reach PostgreSQL. With Docker's default bridge network, `127.0.0.1` inside the Agent container does not identify a separate PostgreSQL container or the Docker host. For a remote connection, enable TLS on PostgreSQL and use the documented `hostssl` rule for the exact Agent source. Install Docker Compose only if you want to use the Compose method below. Choose a memory limit in MB for PostgreSQL; use `0` only when PostgreSQL can use the host's full memory budget.

## PostgreSQL settings for query data {#postgresql-settings}

The Agent reads query data from `pg_stat_statements` and `pg_stat_activity`. The following PostgreSQL parameters control what reaches the Dashboard. Set these parameters in the configuration of the PostgreSQL container, such as its persistent `postgresql.conf` or an included file, or pass them as `-c name=value` arguments to the `postgres` command. The Agent container does not change them. Restart the PostgreSQL container for parameters that require a restart.

| Parameter | PostgreSQL default | Recommended | What it controls | Apply |
|---|---|---|---|---|
| `shared_preload_libraries` | empty | includes `pg_stat_statements` | Required for Query Analytics, the **Latency** graph, and Query Optimization. Keep the existing entries in the list. | Restart the container |
| `track_activity_query_size` | `1024` bytes | `1024`, or more for long queries | Maximum query text length kept in `pg_stat_activity` and shown in the **Activity** view. Each server process reserves this amount of shared memory. | Restart the container |
| `pg_stat_statements.max` | `5000` | `10000` | Number of distinct normalized statements tracked. When the limit is reached, PostgreSQL discards the least-executed statements. | Restart the container |
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

## Manual installation {#manual-installation}

Choose Docker or Docker Compose. Replace every bracketed value before starting the Agent.

### Docker

Run the container with persistent configuration directories:

```bash
docker run -d --name releem-agent \
  -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
  -e RELEEM_HOSTNAME="[SERVER_NAME]" \
  -e PG_HOST="[POSTGRESQL_HOST]" \
  -e PG_PORT="5432" \
  -e PG_SSL="true" \
  -e PG_USER="releem" \
  -e PG_PASSWORD="[MONITORING_PASSWORD]" \
  -e MEMORY_LIMIT="[MEMORY_LIMIT]" \
  -e RELEEM_QUERY_OPTIMIZATION="true" \
  --restart unless-stopped \
  -v /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/ \
  releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

Check the startup log:

```bash
docker logs --tail=100 releem-agent
```

### Docker Compose

Create `compose.yaml`:

```yaml
services:
  releem-agent:
    image: "releem/releem-agent:[VERSION_FROM_DOCKER_HUB]"
    container_name: releem-agent
    environment:
      RELEEM_API_KEY: "[RELEEM_API_KEY]"
      RELEEM_HOSTNAME: "[SERVER_NAME]"
      PG_HOST: "[POSTGRESQL_HOST]"
      PG_PORT: "5432"
      PG_SSL: "true"
      PG_USER: "releem"
      PG_PASSWORD: "[MONITORING_PASSWORD]"
      MEMORY_LIMIT: "[MEMORY_LIMIT]"
      RELEEM_QUERY_OPTIMIZATION: "true"
    restart: unless-stopped
    volumes:
      - /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/
```

Start the Agent:

```bash
docker compose up -d
docker compose logs --tail=100 releem-agent
```

Use a version shown on [Releem Agent tags on Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). Keep a Compose file containing credentials out of version control.

## Connect the generated configuration to PostgreSQL {#connect-the-generated-configuration-to-postgresql}

Complete this section if you want the PostgreSQL container to load configuration files generated by the Releem Agent. The Agent and PostgreSQL containers must use the same host directory.

1. Mount the host directory in the PostgreSQL service or container:

```yaml
services:
  postgres:
    volumes:
      - /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/:ro
```

2. Add this line to the active `postgresql.conf` inside the database container. Preserve existing include entries and make sure PostgreSQL can read the directory and its files:

```ini
include_dir = '/etc/postgresql/releem.conf.d'
```

You can also use `include_dir = 'conf.d'` when you mount the same host directory at the `conf.d` directory relative to the active `postgresql.conf`.

3. Review the generated configuration, then reload or restart the PostgreSQL container during your approved maintenance window. The Agent does not control the database container's restart. Use the [PostgreSQL configuration-error and effective-value checks](/recommendations/configuration-tuning/apply-manually/postgresql?platform=docker#docker-reload-configuration) in a database administrator session.

The shared directory receives a recommendation only when the Agent applies it, so it can be empty or hold a previous configuration. To apply a recommendation manually, extract the current file from the Agent container as described in [manual application](/recommendations/configuration-tuning/apply-manually/postgresql?platform=docker#docker-extract-recommended-configuration).

If you do not connect the generated configuration directory, add `pg_stat_statements` to `shared_preload_libraries` in the active PostgreSQL configuration and create the extension in `postgres`, as described in [PostgreSQL permissions](/supported-databases/postgresql/required-permissions#query-metrics-with-pg_stat_statements), so Releem can collect query data.

Restart the PostgreSQL container after changing `shared_preload_libraries`. Confirm that the settings are effective before relying on the related metrics or Query Optimization data.

## Installer parameters

- `PG_HOST`, `PG_PORT`, `PG_USER`, and `PG_PASSWORD` configure the PostgreSQL connection. The `RELEEM_PG_HOST`, `RELEEM_PG_PORT`, `RELEEM_PG_LOGIN`, and `RELEEM_PG_PASSWORD` names are also accepted. PostgreSQL collection starts when the user and password are set; do not also set MySQL `DB_USER` and `DB_PASSWORD` for this Agent.
- `PG_SSL` / `RELEEM_PG_SSL_MODE` set to `true` use `sslmode=require`. They do not provide `verify-full` certificate and hostname verification. Set `false` only for an explicitly approved local connection without TLS; omission also disables SSL.
- `RELEEM_API_KEY` connects the Agent to your Releem account.
- `RELEEM_HOSTNAME` sets the server name displayed in the Dashboard.
- `MEMORY_LIMIT` limits the memory considered for PostgreSQL recommendations; `0` uses the host total.
- `RELEEM_QUERY_OPTIMIZATION=true` enables query collection. Remove the line for baseline monitoring only; review the [query permissions](/supported-databases/postgresql/required-permissions#query-and-schema-capabilities) before enabling it.

## Expected result

After you start the Agent, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs). For an included recommendation, verify the effective PostgreSQL values after the required reload or restart.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Check the monitoring credentials, database host and port, container networking, HBA source rule, and `pg_stat_statements` setup. If recommended settings are absent, check both containers' mounts and the active include path, then use the [PostgreSQL recovery procedure](/recommendations/configuration-tuning/apply-manually/postgresql?platform=docker#docker-troubleshooting). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.

### Queries in the Activity view are truncated

PostgreSQL keeps only `track_activity_query_size` bytes of each running query; the default is `1024`. Check the limit:

```sql
SHOW track_activity_query_size;
```

Raise it, for example to `4096`, and restart the PostgreSQL container. See [PostgreSQL settings for query data](#postgresql-settings).

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

Run the second query while connected to `postgres`. If the library is missing, add it to `shared_preload_libraries` and restart the PostgreSQL container. If the extension is missing, create it. On PostgreSQL 14 and later, set `compute_query_id` to `auto` or `on`. Data appears after new queries run.

### Some queries are missing from Query Analytics

- **The statement limit is reached.** On PostgreSQL 14 and later, a growing `dealloc` value means statements were discarded:

  ```sql
  SELECT dealloc, stats_reset FROM pg_stat_statements_info;
  ```

  Raise `pg_stat_statements.max` and restart the PostgreSQL container. PostgreSQL 12 and 13 do not have `pg_stat_statements_info`; compare `SELECT count(*) FROM pg_stat_statements;` with `pg_stat_statements.max`.
- **The query runs inside a function or procedure.** Set `pg_stat_statements.track` to `all`.
- **The query is a utility command.** Commands other than `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `MERGE` are tracked only when `pg_stat_statements.track_utility` is `on`.
- **Queries that differ only in constants are grouped.** `pg_stat_statements` normalizes them into one statement with placeholders. Queries with a different structure, such as `IN` lists of different lengths on PostgreSQL 17 and earlier, are tracked separately and use more of the limit.

### Query Analytics counters dropped or history restarted

`pg_stat_statements_reset()`, a PostgreSQL restart, or eviction of a statement resets its counters. On PostgreSQL 14 and later, `stats_reset` in `pg_stat_statements_info` shows the last full reset. Avoid scheduled resets while Releem is collecting data.

### A query has no EXPLAIN plan

Plans are collected only when Query Optimization is enabled, and only for `SELECT` and `WITH` statements in the top 100 by total or mean execution time. If `databases_query_optimization` lists databases, check that the query's database is included, and check that the monitoring role has query read access from [PostgreSQL permissions](/supported-databases/postgresql/required-permissions#query-and-schema-capabilities).

### `CREATE EXTENSION pg_stat_statements` fails with `could not open extension control file`

The `postgresql-contrib` package for the server's PostgreSQL version is not installed. Install it with your distribution's package manager, restart PostgreSQL if `shared_preload_libraries` changed, and create the extension again in `postgres`.
