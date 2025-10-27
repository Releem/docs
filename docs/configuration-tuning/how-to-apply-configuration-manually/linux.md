---
title: How to apply the Recommended Configuration for Linux
sidebar_label: Linux
---

# How to apply the Recommended Configuration for Linux

Releem Agent automatically stores Recommended Configuration at `/opt/releem/conf/z_aiops_mysql.cnf`

To apply Recommended Configuration perform the following steps:

## Step 1: Copy Recommended Configuration to MySQL configuration folder

```bash
cp /opt/releem/conf/z_aiops_mysql.cnf /etc/mysql/conf.d/
```

:::info
In CentOS instead `/etc/mysql/conf.d` you should use `/etc/my.cnf.d/` folder.
:::

## Step 2: Restart MySQL to apply configuration

```bash
service mysqld restart
```

### Special case: MySQL 5.6.7 or earlier with innodb_log_file_size change

In case of change `innodb_log_file_size` only in MySQL 5.6.7 or earlier perform the following commands:

```bash
mysql -e"SET GLOBAL innodb_fast_shutdown = 1"
service mysql stop
mv /var/lib/mysql/ib_logfile[01] /tmp
service mysql start
```

## Step 3: Verify the Applied Configuration

You should see event **Applied recommended configuration** on the MySQL Metrics graph.

For additional help, feel free to contact **Releem support**.
