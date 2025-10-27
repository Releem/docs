---
title: How to apply the Recommended Configuration for MySQL in Docker
sidebar_label: Docker
---

# How to apply the Recommended Configuration for MySQL in Docker

Follow these steps to apply the recommended configuration for MySQL in Docker:

## Step 1: Copy the Recommended Configuration

1. Log in to the Releem dashboard.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Click the **Copy** icon to copy the recommended configuration.

## Step 2: Modify the my.cnf file
Paste the copied configuration into the end of file.

## Step 3: Restart Docker container

Restart your MySQL Docker container to apply the new configuration:

```bash
docker restart <container_name_or_id>
```

## Step 4: Verify the Applied Configuration

You should see event **Applied recommended configuration** on the MySQL Metrics graph.

For additional help, feel free to contact **Releem support**.
