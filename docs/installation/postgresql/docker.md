---
id: docker
slug: /installation/postgresql/docker
title: Install Releem for PostgreSQL in Docker
---

# Install Releem for PostgreSQL in Docker

Run the Releem Agent in Docker against a self-managed PostgreSQL 15–18 server. The Agent collects database and query metrics and recommends configuration.

## Before you begin

Create the monitoring account and configure `pg_stat_statements` using [PostgreSQL Required Permissions](/supported-databases/postgresql/required-permissions). Keep the extension available in `postgres`, which the Agent uses for its statistics connection. For a remote connection, enable TLS on PostgreSQL and use the documented `hostssl` rule for the exact Agent source. Complete the preload and restart steps before expecting query data.

Choose an Agent image version from [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). Replace the bracketed placeholders in the examples. Create `/etc/postgresql/releem.conf.d/` on the Docker host for recommended configuration and `/tmp/.mysqlconfigurer/` for Agent state. Keep files containing credentials accessible only to authorized administrators and out of version control.

## Run the Agent

Choose Docker or Docker Compose. Both examples mount the same host directories into the Agent.

**Docker**

```bash
docker run -d --name releem-agent \
  -e RELEEM_HOSTNAME="[SERVER_NAME]" \
  -e PG_HOST="[POSTGRESQL_HOST]" \
  -e PG_PORT="5432" \
  -e PG_SSL="true" \
  -e PG_PASSWORD="[MONITORING_PASSWORD]" \
  -e PG_USER="releem" \
  -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
  -e MEMORY_LIMIT="[MEMORY_LIMIT_MB]" \
  -e RELEEM_QUERY_OPTIMIZATION="true" \
  -v /tmp/.mysqlconfigurer/:/tmp/.mysqlconfigurer/ \
  -v /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/ \
  releem/releem-agent:[VERSION_FROM_DOCKER_HUB]
```

**Docker Compose**

```yaml
services:
  releem-agent:
    image: "releem/releem-agent:[VERSION_FROM_DOCKER_HUB]"
    container_name: releem-agent
    environment:
      RELEEM_HOSTNAME: "[SERVER_NAME]"
      MEMORY_LIMIT: "[MEMORY_LIMIT_MB]"
      PG_USER: "releem"
      RELEEM_API_KEY: "[RELEEM_API_KEY]"
      PG_PASSWORD: "[MONITORING_PASSWORD]"
      PG_PORT: "5432"
      PG_SSL: "true"
      PG_HOST: "[POSTGRESQL_HOST]"
      RELEEM_QUERY_OPTIMIZATION: "true"
    restart: unless-stopped
    volumes:
      - /tmp/.mysqlconfigurer/:/tmp/.mysqlconfigurer/
      - /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/
```

```bash
docker compose up -d
```

### Connection parameters

- `RELEEM_HOSTNAME` is the server name displayed in the Dashboard.
- `RELEEM_API_KEY` is available on the Releem Portal Profile page.
- `PG_USER` / `RELEEM_PG_LOGIN` and `PG_PASSWORD` / `RELEEM_PG_PASSWORD` select the monitoring account.
- `PG_HOST` / `RELEEM_PG_HOST` select the PostgreSQL host.
- `PG_PORT` / `RELEEM_PG_PORT` select the PostgreSQL port, default `5432`.
- `PG_SSL` / `RELEEM_PG_SSL_MODE` are boolean: the standard remote examples use `true` for `sslmode=require`. They do not provide `verify-full` certificate and hostname verification. Set `false` only for an explicitly approved local connection without TLS; omission also disables SSL.
- `MEMORY_LIMIT` is the RAM allocated to PostgreSQL in MB. Use the database's memory allocation or container limit.
- `RELEEM_QUERY_OPTIMIZATION=true` enables additional query data collection.

PostgreSQL collection starts when `pg_user` and `pg_password` are configured. Do not set MySQL `DB_USER` and `DB_PASSWORD` in the same container when selecting the PostgreSQL collector. See [Agent configuration](/installation/manage-the-releem-agent/configuration) for installed settings.

## Share recommended configuration with PostgreSQL

For Agent application of configuration, the PostgreSQL container must read the same host configuration directory that the Agent writes. Mount `/etc/postgresql/releem.conf.d/` from this Docker host into the database container at `/etc/postgresql/releem.conf.d/`. For an existing Compose PostgreSQL service, add this volume to its existing volumes:

```yaml
volumes:
  - /etc/postgresql/releem.conf.d/:/etc/postgresql/releem.conf.d/:ro
```

In the active `postgresql.conf` for that database container, include the shared directory:

```ini
include_dir = '/etc/postgresql/releem.conf.d'
```

You can also use `include_dir = 'conf.d'` when you mount this same host directory at the `conf.d` directory relative to the active `postgresql.conf`. Confirm the actual path before changing the include. Preserve existing include entries and make sure PostgreSQL can read the directory and its files.

You choose when to apply a recommendation. Sharing configuration files does not give the Agent control of the database container's restart. Reload or restart the database container through your container management procedure; the Agent's default systemd restart command does not control that container. For restart-required settings, plan a maintenance window and restart the intended database container, then check its logs and application connectivity. Use the [PostgreSQL configuration-error and effective-value checks](/recommendations/configuration-tuning/apply-manually/postgresql#linux-reload-configuration) in a database administrator session. If you use manual application instead of the shared-directory integration, you still need the standard `pg_stat_statements` preload and extension setup for query collection.

## Verify the installation

Confirm **Agent Status: Connected**, current metrics, and query data in the Dashboard. Check the Agent logs with `docker logs releem-agent` if data is missing. For an included recommendation, verify the effective PostgreSQL values after the required reload or restart.

## Troubleshooting

Check the monitoring credentials, database host and port, container networking, HBA source rule, and `pg_stat_statements` setup. If recommended settings are absent, check both containers' mounts and the active include path. Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) and the [PostgreSQL recovery procedure](/recommendations/configuration-tuning/apply-manually/postgresql#linux-troubleshooting).
