---
id: initial-mysql-configuration
title: Initial Configuration
---

# Initial Configuration

The Releem Agent includes a command that recommends a base MySQL configuration for servers with default configuration. The script creates a configuration file with recommended parameters based on your server's hardware resources.

## Use Case

This feature is for servers with default configuration. It provides a baseline configuration before workload-based recommendations become available.

Database server setup workflow:
1. Install a database server.
2. Install the Releem Agent.
3. Run the initial command to set up baseline configuration based on the server's hardware characteristics.
4. Deploy and start the application on the server.
5. Releem will analyze the server's workload and recommend configurations tailored to the current workload.

:::caution
For servers with non-default configuration, use the standard configuration tuning process instead.
:::

## Usage

### Generate and Apply Configuration

```bash
bash /opt/releem/mysqlconfigurer.sh -s initial
```

This command:
1. Analyzes server hardware resources
2. Generates `initial_config_mysql.cnf`
3. Saves it to `/opt/releem/conf/`
4. Applies the configuration

### Automatic MySQL Restart

Add `RELEEM_RESTART_SERVICE=1` to automatically restart MySQL after applying the configuration:

```bash
RELEEM_RESTART_SERVICE=1 bash /opt/releem/mysqlconfigurer.sh -s initial
```

### Configuration File Location

The initial configuration is saved as `initial_config_mysql.cnf` in the Releem agent's conf directory.

```
/opt/releem/conf/initial_config_mysql.cnf
```
