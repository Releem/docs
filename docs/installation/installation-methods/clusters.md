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

### Step 1: Create MySQL User

Follow the [MySQL Permissions for Releem Agent](/supported-databases/mysql/required-permissions) guide to create the required user.

For enabling Automatic SQL Query Optimization, add the [Additional Permissions](/supported-databases/mysql/required-permissions#additional-database-permissions-required) as well.

### Step 2: Releem Agent Installation

For each node in your cluster, use the [advanced Releem Agent installation](/installation/installation-methods/linux-manual) with the added "releem" user.

## Support

If you encounter any issues with your cluster setup, contact Releem support for assistance.

