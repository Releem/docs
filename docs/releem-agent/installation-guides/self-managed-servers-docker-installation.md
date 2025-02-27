---
id: "self-managed-servers-docker-installation"
title: "Docker"
---

# Installation in the Docker Container on Self-Managed Servers


Use this instruction to install Releem Agent manually on the database server. Releem Agent will automatically collect metrics and recommend configuration.

1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions).

2. Run the container using Docker or Docker Compose.

   **Docker**

   The basic pattern for starting a Releem Agent instance is:
   ```bash
   docker run -d -ti --name 'releem-agent' \
     -e RELEEM_HOSTNAME="[Hostname]" \
     -e DB_HOST="[DB_HOST]" \
     -e DB_PORT="[DB_PORT]" \
     -e DB_PASSWORD="[RELEEM_MYSQL_PASSWORD]" \
     -e DB_USER="releem" \
     -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
     -e MEMORY_LIMIT=[MEMORY_LIMIT] \
     releem/releem-agent:1.5.0.3
   ```
   Please use the latest version of Releem Agent. You can find the latest version of Releem Agent by clicking on the [link](https://hub.docker.com/r/releem/releem-agent/tags).

   **Docker Compose**

   ```yaml
   version: '3.7'
   services:
     releem-agent:
       image: releem/releem-agent
       container_name: releem-agent
       environment:
         MEMORY_LIMIT: "${MEMORY_LIMIT}"
         DB_USER: "releem"
         RELEEM_API_KEY: "${RELEEM_API_KEY}"
         DB_PASSWORD: "${RELEEM_MYSQL_PASSWORD}"
         DB_PORT: "${DB_PORT}"
         DB_HOST: "${DB_HOST}"
       restart: unless-stopped
       volumes:
         - /tmp/.mysqlconfigurer/:/tmp/.mysqlconfigurer/
         - /etc/mysql/releem.conf.d/:/etc/mysql/releem.conf.d/
   ```

   **Parameters:**
   - `RELEEM_HOSTNAME` - Server hostname, which should be displayed in the Releem Dashboard.
   - `RELEEM_API_KEY` - Releem API Key. To get your Releem API Key, please visit Profile page in the Releem Customer Portal.
   - `DB_USER` - MySQL user name for data collection.
   - `DB_PASSWORD` - MySQL user password for data collection.
   - `DB_HOST` - MySQL host for data collection.
   - `DB_PORT` - MySQL port for data collection.
   - `MEMORY_LIMIT` - RAM limit allocated for MySQL. Set to system RAM or limit for MySQL.

   **Volumes:**
   - `/tmp/.mysqlconfigurer/`
   - `/etc/mysql/releem.conf.d/`

3. To automate applying new settings and enable Performance Schema and Slowlog, please mount the following folder to the MySQL container:
   ```yaml
   volumes:
     - /etc/mysql/releem.conf.d/:/etc/mysql/conf.d/
   ```

4. Add the following line to the `my.cnf` file of the MySQL container:
   ```
   !includedir /etc/mysql/conf.d
   ```

   **Note:** If you don't configure automatic applying of configuration, then please add the following MySQL variables to the configuration:
   ```ini
   performance_schema = 1
   slow_query_log = 1
   ```















