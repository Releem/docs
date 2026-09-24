---
id: docker
slug: /installation/mariadb/docker
title: Install Releem for MariaDB on Docker
---

# Install Releem for MariaDB on Docker

Run the Releem Agent in a Docker container for MariaDB.

## Prerequisites

Create the monitoring account from [MariaDB permissions](/supported-databases/mariadb/required-permissions). Install Docker Compose and make sure the Agent container can reach MariaDB. The Agent uses MySQL-compatible `DB_*` setting names for MariaDB connections.

## Manual installation {#manual-installation}

1. Create a private working directory and an `.env` file. Replace every bracketed value and keep the file out of version control.

```text
AGENT_VERSION=[VERSION_FROM_DOCKER_HUB]
RELEEM_API_KEY=[RELEEM_API_KEY]
RELEEM_HOSTNAME=[SERVER_NAME]
DB_HOST=[MARIADB_HOST]
DB_PORT=3306
DB_USER=releem
DB_PASSWORD=[MONITORING_PASSWORD]
MEMORY_LIMIT=0
```

2. Restrict the file before starting the container:

```bash
chmod 600 .env
```

3. Create `compose.yaml`:

```yaml
services:
  releem-agent:
    image: releem/releem-agent:${AGENT_VERSION}
    container_name: releem-agent
    env_file: .env
    restart: unless-stopped
    volumes:
      - /tmp/.mysqlconfigurer/:/tmp/.mysqlconfigurer/
      - /etc/mysql/releem.conf.d/:/etc/mysql/releem.conf.d/
```

4. Start the Agent:

```bash
docker compose up -d
docker compose logs --tail=100 releem-agent
```

Use a version shown on [Releem Agent tags on Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).

## Installer parameters

- `DB_HOST`, `DB_PORT`, `DB_USER`, and `DB_PASSWORD` configure the MariaDB connection.
- `RELEEM_API_KEY` connects the Agent to your Releem account.
- `MEMORY_LIMIT` limits the memory considered for recommendations; `0` uses the host total.
- Add `RELEEM_QUERY_OPTIMIZATION=true` only after granting the required query permissions.

## Expected result

After you complete a supported installation method, the Dashboard should show **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Confirm both the Agent connection and current metrics in the Dashboard. If either is missing, check the [Agent logs](/installation/manage-the-releem-agent/logs).

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Correct the reported permission, network, or configuration issue before you re-run or restart the supported procedure.
