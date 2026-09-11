---
id: required-permissions
slug: /supported-databases/mysql/required-permissions
title: "MySQL Permissions for Releem Agent"
---

# MySQL Permissions for Releem Agent

Use this page to create and review the database account that the Releem Agent uses with MySQL 5.5–8.0. The examples separate the grant families used by the current installer according to what they allow; they are not a universal least-privilege policy. Have a DBA select and review only the enabled capabilities for the target MySQL version and hosting environment.

Replace `AGENT_SOURCE_HOST` with the exact host from which the Agent connects, such as `127.0.0.1` when the Agent uses a local TCP connection. Replace `<PASSWORD>` through your approved credential-management process. Do not use a wildcard host as the default.

Performance Schema coverage and administrative privileges vary by MySQL version and managed service. Validate every statement against the actual version and deployment before applying it.

For a remote MySQL connection, the current automatic installer creates a wildcard account host when `RELEEM_MYSQL_HOST` is not `127.0.0.1` or a local socket. If you require an exact-source account, use a DBA-created account and the manual installation configuration instead. That avoids wildcard account creation, but it does not remove the installer's separately documented child-process argument and log-upload risks.

## Monitoring and query visibility

Create the monitoring account with an exact Agent source host:

```sql
CREATE USER 'releem'@'AGENT_SOURCE_HOST' IDENTIFIED BY '<PASSWORD>';
GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'AGENT_SOURCE_HOST';
GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'AGENT_SOURCE_HOST';
GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'AGENT_SOURCE_HOST';
GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'AGENT_SOURCE_HOST';
GRANT SELECT ON mysql.* TO 'releem'@'AGENT_SOURCE_HOST';
```

These are the current installer's core monitoring grant families. The `mysql.*` grant exposes system-schema data, including account and privilege metadata, to the monitoring account. Confirm that each named Performance Schema table exists and is populated on the target MySQL version. Managed services can expose a different subset.

Query visibility can require broader read access than baseline metrics. The current installer can grant global `SELECT` when query optimization is enabled:

```sql
GRANT SELECT ON *.* TO 'releem'@'AGENT_SOURCE_HOST';
```

Global `SELECT` exposes data across every database. A DBA must decide whether that scope is acceptable or whether an engine- and feature-specific scope can be used before enabling query collection.

On AWS RDS for MySQL, Performance Schema consumers cannot always be enabled persistently through configuration. If runtime enablement is required, an administrator can create a narrowly owned definer procedure and grant only its execution to the exact Agent account:

```sql
CREATE SCHEMA IF NOT EXISTS releem;
DELIMITER $$
CREATE PROCEDURE releem.enable_events_statements_consumers()
    SQL SECURITY DEFINER
BEGIN
    UPDATE performance_schema.setup_consumers
    SET enabled = 'YES'
    WHERE name LIKE 'events_statements_%';
END $$
DELIMITER ;
GRANT EXECUTE ON PROCEDURE releem.enable_events_statements_consumers
  TO 'releem'@'AGENT_SOURCE_HOST';
```

Review the procedure owner, definition, and managed-service support before using this optional capability.

## Configuration application

Applying database configuration is state-changing and must not be bundled into a monitoring-only account by default.

For MySQL 8.0, `SYSTEM_VARIABLES_ADMIN` allows the account to change global system variables. This is a state-changing capability:

```sql
GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO 'releem'@'AGENT_SOURCE_HOST';
```

For MySQL 5.5–5.7, the current installer uses `SUPER`. `SUPER` is broader than `SYSTEM_VARIABLES_ADMIN` and grants state-changing administrative powers unrelated to metrics collection:

```sql
GRANT SUPER ON *.* TO 'releem'@'AGENT_SOURCE_HOST';
```

Grant the version-appropriate privilege only if the Agent is authorized to apply configuration. Some managed database services do not permit either grant and require provider-specific parameter-management workflows.

## Query and schema application {#additional-database-permissions-required}

Collecting query text and applying query or schema changes are different capabilities. The global `SELECT` grant above supports query visibility but does not authorize schema changes.

Automatic schema changes are state-changing and can require DDL, DML, trigger, and replication-related privileges. Do not infer or add those privileges from this monitoring template. If the feature is explicitly approved, review the documented workflow and its current grants in [Automatic Schema Changes](/recommendations/query-optimization/automatic-schema-changes#grant-permissions-for-pt-online-schema-change), then scope the account to the approved databases and exact Agent source.

## Verify the effective account

Confirm the host-specific account and inspect its complete effective grants before starting the Agent:

```sql
SELECT User, Host FROM mysql.user WHERE User = 'releem';
SHOW GRANTS FOR 'releem'@'AGENT_SOURCE_HOST';
```

Record the approved capabilities, verify that no unintended host variant exists, and retest the grants whenever the Agent features, database version, or hosting model changes.

## Continue installation

Choose a supported environment on the [MySQL installation page](/installation/mysql).
