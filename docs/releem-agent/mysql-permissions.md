---
id: "mysql-permissions"
title: "MySQL Permissions for Releem Agent"
---

# MySQL Permissions for Releem Agent

Create read-only database user "releem" which Releem Agent will use to collect database metrics. Select your database version, copy SQL statements and run in the MySQL console.

For MySQL >= 8.0
Change [Password] to your secret password
```
CREATE USER 'releem'@'%' identified by '[Password]';
GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO 'releem'@'%';
```

For MariaDB and MySQL < 8.0
Change [Password] to your secret password
```
CREATE USER 'releem'@'%' identified by '[Password]';
GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
GRANT SUPER ON *.* TO 'releem'@'%';
```
Important: To enable enable Automatic SQL Query Optimization please add [Additional Permissions](../../releem-agent/enable-sql-query-optimization#additional-database-permissions-required)
