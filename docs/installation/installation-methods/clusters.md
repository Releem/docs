---
id: clusters
slug: /installation/installation-methods/clusters
title: Clusters
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation for Database Clusters

Releem supports MySQL/MariaDB/Percona clusters, but you should add "releem" user manually and use advanced installation for every node in the cluster.

## Installation Steps

### Step 1: Create a database user

For MySQL or Percona, follow [MySQL Permissions for Releem Agent](/supported-databases/mysql/required-permissions). For MariaDB, follow [MariaDB Permissions for Releem Agent](/supported-databases/mariadb/required-permissions).

For Automatic SQL Query Optimization, review the [MySQL or Percona additional permissions](/supported-databases/mysql/required-permissions#additional-database-permissions-required) or the [MariaDB additional permissions](/supported-databases/mariadb/required-permissions#additional-database-permissions-required).

### Step 2: Releem Agent Installation

For each node, use the [MySQL manual installation](/installation/linux?database=mysql#mysql-manual-installation) for MySQL or Percona, or the [MariaDB manual installation](/installation/linux?database=mariadb#mariadb-manual-installation) for MariaDB.

## Support

If you encounter any issues with your cluster setup, contact Releem support for assistance.
