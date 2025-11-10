---
title: How to apply the Recommended Configuration for GCP Cloud SQL
sidebar_label: GCP Cloud SQL
---

# How to apply the Recommended Configuration for GCP Cloud SQL

Use Database Flags to apply the recommended configuration. Follow the steps below:

## Step 1: Get the Recommended Configuration

1. Log in to the Releem dashboard.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Review the recommended parameters that need to be applied as database flags.

## Step 2: Configure Database Flags in GCP Cloud SQL

1. Log in to the **Google Cloud Console**.
2. Navigate to the **Cloud SQL Instances** page.
3. Select the project that contains your Cloud SQL instance.
4. Click on your MySQL instance name to open the **Instance Overview** page.
5. Click the **Edit** button at the top of the page.
6. Scroll down to the **Flags** section.
7. Configure the database flags:
   - To set a new flag: Click **Add item**, choose the flag from the drop-down menu, and set its value based on the Releem recommendations.
   - To modify an existing flag: Update its value according to the Releem recommendations.
8. Click **Save** to apply your changes.

## Step 3: Apply the Changes

1. After clicking Save, GCP Cloud SQL will automatically restart your instance if required to apply the configuration changes.
2. You can choose to apply changes immediately or schedule them during the next maintenance window (if this option is available for your instance).
3. Wait for the instance to complete the restart process.

## Step 4: Verify the Applied Configuration

1. On the **Instance Overview** page, check the **Database flags** section to confirm the flags have been applied.
2. You should see event **Applied recommended configuration** on the MySQL Metrics graph in the Releem Dashboard.

:::info
Database flags are persisted for the instance until you manually remove them. Some flags may require the instance to be restarted for changes to take effect.
:::

For additional help, feel free to contact **Releem support**.
