---
id: index
slug: /supported-databases
title: Supported Databases
---

# Supported Databases

Check your database version before you install the Releem Agent. Releem supports the following database families and versions.

| Database | Supported versions | Installation | Required permissions |
|---|---|---|---|
| MySQL | MySQL 5.5, 5.6, 5.7, and 8.0 | [Choose a MySQL environment](/installation/mysql) | [MySQL permissions](/supported-databases/mysql/required-permissions) |
| MariaDB | MariaDB 10.1–10.11 and 11.0 | [Choose a MariaDB environment](/installation/mariadb) | [MariaDB permissions](/supported-databases/mariadb/required-permissions) |
| PostgreSQL | PostgreSQL 15, 16, 17, and 18 | [Install on Linux](/installation/postgresql/linux) | [PostgreSQL permissions](/supported-databases/postgresql/required-permissions) |
| Percona Server for MySQL | Percona Server 5.5, 5.6, 5.7, and 8.0 | Use the matching [MySQL installation path](/installation/mysql) | [MySQL permissions](/supported-databases/mysql/required-permissions) |

These ranges describe Releem compatibility. Continue to apply your database vendor's maintenance and security-lifecycle requirements.

Version coverage was reviewed on September 24, 2026 against the [Releem Agent compatibility list](https://github.com/Releem/releem-agent#compatibility), last updated on June 9, 2026.

## Choose your next step

1. Open the permissions page for your database.
2. Create or review the Agent account.
3. Choose the matching environment from [Install Releem](/installation).
4. After installation, confirm **Agent Status: Connected** and current metrics in the Dashboard.
