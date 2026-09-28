---
id: required-permissions
slug: /supported-databases/postgresql/required-permissions
title: PostgreSQL Permissions for Releem Agent
---

# PostgreSQL Permissions for Releem Agent

Use this page with the [PostgreSQL Linux installation guide](/installation/postgresql/linux). Releem supports PostgreSQL 15–18. Install the `postgresql-contrib` package that matches the server version before enabling `pg_stat_statements`.

These grants are not universally least-privilege. Object ownership, managed-service restrictions, extensions, and Releem features vary. A DBA must validate every grant and connection rule for the target database and enabled features.

## Baseline monitoring role

Create the login through your approved credential-management process. Do not put its password in shell history. Grant the built-in monitoring role and read access needed for HBA-rule diagnostics:

```sql
CREATE USER releem;
GRANT pg_monitor TO releem;
GRANT SELECT ON pg_hba_file_rules TO releem;
GRANT EXECUTE ON FUNCTION pg_catalog.pg_hba_file_rules() TO releem;
```

PostgreSQL exposes HBA rules through a view backed by a function. The Agent needs access to both to read those rules.

Before creating or rotating the password, inspect the effective password-encryption setting:

```sql
SHOW password_encryption;
```

The monitoring role password must be stored with a SCRAM verifier before a `scram-sha-256` HBA rule can authenticate it. Automatic account creation is suitable only when the server default shown above is `scram-sha-256`; otherwise, use the manual protected password-creation or rotation procedure below unless an approved server configuration change first establishes a SCRAM default.

In a protected interactive `psql` session, if the current setting is not `scram-sha-256`, set it for that session and then use the masked password prompt:

```psql
SET password_encryption = 'scram-sha-256';
\password releem
```

This `SET` is session-local. Do not change the global password-encryption configuration without explicit approval through the server's configuration process. An authorized administrator can verify the stored format without displaying the verifier itself:

```sql
SELECT rolpassword LIKE 'SCRAM-SHA-256$%' AS uses_scram_verifier
FROM pg_authid
WHERE rolname = 'releem';
```

## Query metrics with pg_stat_statements

Query performance metrics require `pg_stat_statements`. First inspect the existing `shared_preload_libraries` setting:

```sql
SHOW shared_preload_libraries;
```

Through the server's managed configuration process, merge `pg_stat_statements` into the existing comma-separated list without removing existing entries. For example, if the current value is `pgaudit`, the resulting setting is:

```ini
shared_preload_libraries = 'pgaudit,pg_stat_statements'
```

Restart PostgreSQL through the approved operational procedure. After restart, run `SHOW shared_preload_libraries;` again and verify that `pg_stat_statements` and every previously configured library are present. Then connect to each database that Releem will inspect and create the extension as a database owner or other authorized administrator:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Confirm that the monitoring role can read the required statistics views without granting ownership or broad write access.

## Query and schema capabilities

The standard PostgreSQL Linux command enables query data collection with `RELEEM_QUERY_OPTIMIZATION=true`. Complete the `pg_stat_statements` setup above. If you create the monitoring role manually, verify its statistics access before installation. If the installer creates it, verify that access after installation. Collecting query data does not authorize Releem to apply query or schema changes.

Applying query or schema changes can require permissions beyond baseline monitoring. Those permissions depend on the selected databases, schemas, extensions, and operational policy. Do not grant broad schema, DDL, or write privileges from a generic template. Have a DBA review the exact change and required access before enabling an application workflow.

## PostgreSQL 12/13 query grants {#legacy-postgresql-query-grants}

Releem's documented PostgreSQL support is 15–18. These grants from the earlier guide are retained for reference; PostgreSQL 12 and 13 are [end-of-life](https://www.postgresql.org/support/versioning/) and this is not a supported Releem installation path.

For a legacy migration, have a database administrator approve read access to the named database and schema. Replace the placeholders and connect to that database before running the schema grants:

```sql
GRANT CONNECT ON DATABASE "[DATABASE_NAME]" TO releem;
GRANT USAGE ON SCHEMA "[SCHEMA_NAME]" TO releem;
GRANT SELECT ON ALL TABLES IN SCHEMA "[SCHEMA_NAME]" TO releem;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "[SCHEMA_NAME]" TO releem;
```

These grants cover existing objects in the selected schema, not objects created later. See the [PostgreSQL 13 GRANT reference](https://www.postgresql.org/docs/13/sql-grant.html) for their scope.

## Restrict pg_hba.conf

PostgreSQL uses the first matching `pg_hba.conf` record. Put a narrowly scoped rule in the correct order and verify the effective rules after reloading the configuration.

For an Agent on the same host, permit only loopback with SCRAM authentication:

```ini
host    all    releem    127.0.0.1/32    scram-sha-256
```

For an Agent on another host, use an approved TLS configuration and replace `AGENT_IP` with that host's single, fixed source address:

```ini
hostssl    all    releem    AGENT_IP/32    scram-sha-256
```

For a remote connection, also set `listen_addresses` to the exact approved database interface, restrict the host firewall or cloud firewall to the exact Agent source address and PostgreSQL port, and validate the server certificate policy. The Agent installer's `RELEEM_PG_SSL_MODE=true` maps only to `sslmode=require`; it does not provide `verify-full` hostname and CA verification.

After editing `pg_hba.conf`, reload PostgreSQL with your platform's approved procedure and verify that the intended rule—not a broader earlier rule—is the first matching rule.

## Continue installation

Continue with [Install Releem for PostgreSQL on Linux](/installation/postgresql/linux) and choose automatic or manual account creation.
