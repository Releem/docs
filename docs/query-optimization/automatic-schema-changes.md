---
id: automatic-schema-changes
title: Automatic Schema Changes
---

# Automatic Schema Changes

Releem can apply approved schema recommendations, such as creating indexes, directly from the Releem Dashboard. This is useful when you want Releem to complete the optimization workflow after you review and approve a change.

Automatic schema changes are disabled by default. Enable them only on servers where the Releem Agent is allowed to run DDL statements and where you have checked the backup and disk-space requirements.

Before applying a change, the Releem Agent checks that the operation can be completed safely. Depending on the recommendation and the server, the agent may:

- test the change on a temporary table before touching the production table;
- use native online DDL when MySQL or MariaDB can run the change without blocking the table;
- use `pt-online-schema-change` when the server cannot run the change online by itself;
- create a backup before the change when the recommendation requires it.

If these checks fail, Releem does not apply the change automatically. See [Schema Change Troubleshooting](/query-optimization/schema-change-troubleshooting) for the next steps.

## Before You Start

Automatic schema changes require:

- an installed and running Releem Agent;
- [SQL Query Optimization](/query-optimization/enable-sql-query-optimization) enabled for the server;
- a MySQL user used by the agent with permissions to apply the approved schema changes;
- enough free disk space in the MySQL data directory and in the backup directory;
- point-in-time recovery when Releem requires a pre-change backup;
- additional tools installed on the same host as the agent when they are needed.

For Linux servers, the default agent configuration file is:

```bash
/opt/releem/releem.conf
```

## Enable Automatic Schema Changes

### 1. Install the Tools Used by the Agent

Install the tools that match your database type and backup strategy.

Some packages may not be available in the default operating system repositories. If your package manager cannot find a package, add the vendor repository first and then run the installation command again:

- For Percona Toolkit and Percona XtraBackup, follow [Install percona-release](https://docs.percona.com/percona-software-repositories/installing.html).
- For MariaDB Backup, follow [MariaDB Package Repository Setup and Usage](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/installing-mariadb/binary-packages/mariadb-package-repository-setup-and-usage).
- For MySQL client packages, follow the MySQL repository guide for your platform: [MySQL APT Repository](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/) or [MySQL Yum Repository](https://dev.mysql.com/doc/mysql-yum-repo-quick-guide/en/).

For Debian or Ubuntu:

```bash
sudo apt-get update
sudo apt-get install default-mysql-client percona-toolkit
```

For RHEL, CentOS, Rocky Linux, or AlmaLinux:

```bash
sudo yum install mysql percona-toolkit
```

On newer releases such as Rocky Linux 8+ or AlmaLinux 8+, use `dnf` instead of `yum`.

For physical backups on MySQL, install Percona XtraBackup. The Percona repository is usually required first. Example:

Debian or Ubuntu:

```bash
sudo apt-get install percona-xtrabackup-80
```

RHEL, CentOS, Rocky Linux, or AlmaLinux:

```bash
sudo yum install percona-xtrabackup-80
```

For MariaDB servers, install MariaDB Backup and point `xtrabackup_path` to `mariabackup`:

Debian or Ubuntu:

```bash
sudo apt-get install mariadb-backup
```

RHEL, CentOS, Rocky Linux, or AlmaLinux:

```bash
sudo yum install MariaDB-backup
```

Package names can differ by operating system and repository. Use the official installation instructions linked at the end of this page for production servers.

### 2. Configure the Releem Agent

Open the agent configuration file:

```bash
sudo nano /opt/releem/releem.conf
```

Enable DDL execution and review the paths used by the agent:

```
enable_exec_ddl = true

backup_dir = "/tmp/backups"
ptosc_path = "pt-online-schema-change"
mysqldump_path = "mysqldump"
xtrabackup_path = "xtrabackup"
backup_space_buffer = 20.0
online_ddl_test_schema = "releem_online_ddl_test"
disable_space_checks = false
```

Use full paths when a tool is not available on the agent process `PATH`. For example:

```
ptosc_path = "/usr/bin/pt-online-schema-change"
mysqldump_path = "/usr/bin/mysqldump"
xtrabackup_path = "/usr/bin/xtrabackup"
```

For MariaDB Backup, set:

```
xtrabackup_path = "mariabackup"
```

### 3. Prepare the Backup Directory

Create the backup directory and make sure the Releem Agent process can write to it:

```bash
sudo mkdir -p /tmp/backups
```


### 4. Grant Database Permissions

Connect to MySQL or MariaDB as an administrator and grant the required permissions to the same database user that the Releem Agent already uses.

For schema changes on all databases:

```sql
GRANT CREATE, REFERENCES, INDEX, ALTER ON *.* TO `releem`@`127.0.0.1`;
```

Or grant permissions only for one database:

```sql
GRANT CREATE, REFERENCES, INDEX, ALTER ON `your_database`.* TO `releem`@`127.0.0.1`;
```

For the test schema used by the online DDL preflight:

```sql
CREATE DATABASE IF NOT EXISTS `releem_online_ddl_test`;
GRANT CREATE, DROP, INDEX, ALTER ON `releem_online_ddl_test`.* TO `releem`@`127.0.0.1`;
```

If Releem may use `pt-online-schema-change`, grant the extra permissions needed by that tool:

```sql
GRANT SELECT, INSERT, DROP, RELOAD, SUPER, SHOW VIEW, TRIGGER ON *.* TO `releem`@`127.0.0.1`;
```

On MySQL 8 and newer, use the equivalent dynamic privileges required by your security policy when `SUPER` is not allowed.

Replace `releem` and `127.0.0.1` with the user and host from your agent configuration if they are different.

### 5. Restart the Releem Agent

Restart the agent so it reads the new configuration:

```bash
sudo systemctl restart releem-agent
```

If your server uses the legacy service command:

```bash
sudo service releem-agent restart
```

### 6. Approve the Schema Change in Releem

Open the Releem Dashboard, review the query recommendation, and approve the change only when you are ready for the agent to apply it.

After the task starts, Releem shows the result in the dashboard. If the task fails, open the failed task and use [Schema Change Troubleshooting](/query-optimization/schema-change-troubleshooting).

## Agent Configuration Reference

| Setting | Default | Description |
| --- | --- | --- |
| `enable_exec_ddl` | `false` | Enables automatic execution of approved schema changes. Keep it `false` when you want Releem to recommend changes only. |
| `backup_dir` | `/tmp/backups` | Directory where the agent stores logical and physical backups before a schema change. |
| `ptosc_path` | `pt-online-schema-change` | Path to `pt-online-schema-change` from Percona Toolkit. Used when Releem selects that method. |
| `mysqldump_path` | `mysqldump` | Path to `mysqldump`. Used for logical table backups. |
| `xtrabackup_path` | `xtrabackup` | Path to `xtrabackup` or `mariabackup`. Used for physical backups when Releem selects that method. |
| `backup_space_buffer` | `20.0` | Extra free-space percentage required above the estimated backup size. |
| `online_ddl_test_schema` | `releem_online_ddl_test` | Schema where the agent creates temporary tables to test online DDL before applying it to the production table. |
| `disable_space_checks` | `false` | Disables disk-space checks when set to `true`. Use only temporarily and only when you have another capacity check in place. |

## Additional Tool Installation Notes

- `mysqldump` is usually included in MySQL client packages.
- `pt-online-schema-change` is included in Percona Toolkit.
- `xtrabackup` is installed from Percona XtraBackup packages.
- `mariabackup` is installed from MariaDB Backup packages and should be used for MariaDB servers.

After installing tools, check that the agent can find them:

```bash
which mysqldump
which pt-online-schema-change
which xtrabackup
which mariabackup
```

Use the returned paths in `releem.conf` if needed.

## Documentation Links

- [Percona Toolkit installation](https://docs.percona.com/percona-toolkit/installation.html)
- [Percona repository setup](https://docs.percona.com/percona-software-repositories/installing.html)
- [pt-online-schema-change documentation](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html)
- [Percona XtraBackup installation](https://docs.percona.com/percona-xtrabackup/8.0/installation.html)
- [MariaDB repository setup](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/installing-mariadb/binary-packages/mariadb-package-repository-setup-and-usage)
- [MariaDB Backup documentation](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview)
- [MySQL APT Repository guide](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/)
- [MySQL Yum Repository guide](https://dev.mysql.com/doc/mysql-yum-repo-quick-guide/en/)
- [mysqldump documentation](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html)
