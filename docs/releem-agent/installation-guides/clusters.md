---
id: clusters
title: Clusters
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation on MySQL Clusters

Releem supports MySQL/MariaDB/Percona clusters, but you should add "releem" user manually and use advanced installation for every node in the cluster.

## Installation Steps

### Step 1: Create MySQL User

Follow the [MySQL Permissions for Releem Agent](/releem-agent/mysql-permissions) guide to create the required user on each node of your cluster. Make sure to set the same password across all nodes for consistency.

For enabling Automatic SQL Query Optimization, add the [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required) as well.

### Step 2: Advanced Installation

For each node in your cluster, use the [advanced installation option](/releem-agent/installation-guides/self-managed-servers-manual-installation-linux) with the added "releem" user.

## Support

If you encounter any issues with your cluster setup, contact Releem support for assistance.

