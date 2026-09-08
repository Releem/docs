---
id: docker
slug: /recommendations/configuration-tuning/apply-manually/docker
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

Identify the `my.cnf` file used by the target Docker container. Paste the copied configuration at the end of that file.

## Step 3: Restart Docker container

Before restarting, review the pasted settings and confirm that `<container_name_or_id>` identifies the MySQL container you intend to restart.

Restart your MySQL Docker container to apply the new configuration:

```bash
docker restart <container_name_or_id>
```

## Step 4: Verify the Applied Configuration

You should see event **Applied recommended configuration** on the Database Metrics graph.

For additional help, feel free to contact **Releem support**.
