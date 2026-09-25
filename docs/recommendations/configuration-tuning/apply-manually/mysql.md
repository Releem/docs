---
id: mysql
slug: /recommendations/configuration-tuning/apply-manually/mysql
title: Apply configuration manually for MySQL
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Apply configuration manually for MySQL

Choose the environment that hosts MySQL. Review the [MySQL permissions](/supported-databases/mysql/required-permissions) and the shared [pre-change, verification, and recovery checks](/recommendations/configuration-tuning/apply-configuration#before-you-apply) before you begin.

<Tabs groupId="configuration-platform" queryString="platform" defaultValue="linux">
  <TabItem value="linux" label="Linux">

## Before you begin {#linux-before-you-begin}

Confirm the active MySQL configuration directory, record the current settings, and plan a maintenance window and recovery path. If the destination already contains `z_aiops_mysql.cnf`, make a backup copy outside the active include directory. If it does not, record that the Releem file is new. The Releem Agent stores the Recommended Configuration at `/opt/releem/conf/z_aiops_mysql.cnf`.

## Step 1: Copy Recommended Configuration to MySQL configuration folder {#linux-copy-recommended-configuration}

On Debian and Ubuntu systems, copy the generated file to `/etc/mysql/conf.d/`:

```bash
cp /opt/releem/conf/z_aiops_mysql.cnf /etc/mysql/conf.d/
```

:::info
CentOS uses the alternate directory `/etc/my.cnf.d/`. Confirm the active include directory before copying the file.
:::

## Step 2: Restart MySQL to apply configuration {#linux-restart-mysql}

Review the copied settings, then restart the database during the planned maintenance window:

```bash
service mysqld restart
```

If a recommendation changes the redo-log size on MySQL 5.6.7 or earlier, stop. Do not move redo-log files with a generic procedure. Contact Releem support and your database owner for a version-specific recovery plan.

## Step 3: Verify the Applied Configuration {#linux-verify-applied-configuration}

1. Check whether any settings remain restart-pending and confirm the effective database settings in MySQL.
2. Confirm the database service is running and review application connectivity and errors.
3. Confirm the **Applied recommended configuration** event on the **MySQL Metrics graph**, then review current metrics.

If the service does not return to its expected state, restore the backed-up `z_aiops_mysql.cnf` or remove the newly inserted file from the active include directory, then restart MySQL. If that recovery fails, use [Rollback](/recommendations/configuration-tuning/rollback) when applicable and contact Releem support.

  </TabItem>
  <TabItem value="windows" label="Windows">

## Before you begin {#windows-before-you-begin}

- Do not continue until you have confirmed which `my.ini` file the selected MySQL service uses.
- Make a backup copy of the active `my.ini`, record the current settings, and plan a maintenance window and recovery path.
- Review the exact recommended settings in Releem before you copy them. After you paste them into `my.ini`, check them again before you save the file.

## Step 1: Copy the Recommended Configuration {#windows-copy-recommended-configuration}

1. Log in to the **Releem dashboard**.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Click the **Copy** icon to copy the recommended configuration.

## Step 2: Modify the my.ini File {#windows-modify-my-ini}

1. Locate the active `my.ini` file. It is typically under `C:\Program Files\MySQL\MySQL Server X.X\my.ini` or `C:\ProgramData\MySQL\my.ini`.
2. Open the file in a text editor such as Notepad.
3. Paste the copied configuration at the end of the file.
4. Save the file using the **ANSI charset**. In Notepad, choose **File → Save As**. In **Encoding**, select **ANSI**, then select **Save**.

## Step 3: Restart the MySQL Database Service {#windows-restart-mysql-service}

1. Press `Win + R`, enter `services.msc`, and press Enter.
2. Find the MySQL service, such as MySQL or MySQL80.
3. Right-click the selected service and choose **Restart**.

## Step 4: Verify the Applied Configuration {#windows-verify-applied-configuration}

1. Check whether any settings remain restart-pending and confirm the effective database settings in MySQL.
2. Confirm the database service is running and review application connectivity and errors.
3. Confirm the **Configuration was applied successfully** event on the **MySQL Metrics graph**, then review current metrics.

If the service does not return to its expected state, restore the backed-up `my.ini` and restart the selected MySQL service. If that recovery fails, use [Rollback](/recommendations/configuration-tuning/rollback) when applicable and contact Releem support.

  </TabItem>
  <TabItem value="docker" label="Docker">

## Before you begin {#docker-before-you-begin}

Identify the persistent configuration file mounted into the target MySQL container. Make a backup or snapshot of that persistent mounted configuration, record the current settings, confirm the container name or ID, and plan a maintenance window and recovery path.

## Step 1: Copy the Recommended Configuration {#docker-copy-recommended-configuration}

1. Log in to the Releem dashboard.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Click the **Copy** icon to copy the recommended configuration.

## Step 2: Modify the my.cnf file {#docker-modify-my-cnf}

Identify the active `my.cnf` file used by the target MySQL container. Paste the copied configuration at the end of that file and confirm that the change is stored in persistent configuration.

## Step 3: Restart Docker container {#docker-restart-container}

Before restarting, review the pasted settings and confirm that `<container_name_or_id>` identifies the MySQL container you intend to restart.

```bash
docker restart <container_name_or_id>
```

## Step 4: Verify the Applied Configuration {#docker-verify-applied-configuration}

1. Check whether any settings remain restart-pending and confirm the effective database settings in MySQL.
2. Confirm the database container health and review application connectivity and errors.
3. Confirm the **Applied recommended configuration** event on the **MySQL Metrics graph**, then review current metrics.

If the container does not return to its expected state, restore the backup or snapshot of the persistent mounted configuration and restart the same container. If that recovery fails, use [Rollback](/recommendations/configuration-tuning/rollback) when applicable and contact Releem support.

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

## Before you begin {#aws-rds-before-you-begin}

Record the parameter group assigned to your RDS instance and its current parameter values. Confirm whether that group is shared by other instances. If it is shared, stop until the change is approved for every affected instance, or use a dedicated parameter group for the target instance. Plan the application timing and recovery path. Recording it does not guarantee that every change can be reversed.

## Step 1: Modify the Parameter Group in AWS RDS {#aws-rds-modify-parameter-group}

1. Log in to the AWS Management Console.
2. Navigate to the RDS Dashboard.
3. Select **Parameter Groups** from the left-hand menu under Databases.
4. Select your parameter group and choose **Edit Parameters**.
5. Update the parameters based on the recommended configuration from the Releem Dashboard.
6. Save the changes.

## Step 2: Apply the Parameter Group to Your RDS Instance {#aws-rds-assign-parameter-group}

1. Return to the RDS Dashboard and select your database instance.
2. Click on the **Modify** button.
3. In **Database options**, select the updated parameter group.
4. Choose whether to apply the changes immediately or during the next maintenance window.
5. Save the changes.

## Step 3: Reboot the RDS Instance {#aws-rds-reboot-instance}

Coordinate the reboot with the application timing you chose in Step 2. At the planned time, select the instance and choose **Actions → Reboot**.

## Step 4: Verify the Applied Configuration {#aws-rds-verify-applied-configuration}

1. Check the RDS instance for pending-reboot settings and confirm the effective database settings in MySQL after any required reboot.
2. Confirm the database instance health and review application connectivity and errors.
3. Confirm the **Applied recommended configuration** event on the **MySQL Metrics graph**, then review current metrics.

If the instance does not return to its expected state, reassign the previous parameter group or restore the recorded parameter values. Reboot the instance if the restored settings require it, then repeat the health and effective-value checks. For additional help, contact Releem support.

  </TabItem>
  <TabItem value="gcp-cloud-sql" label="GCP Cloud SQL">

## Before you begin {#gcp-cloud-sql-before-you-begin}

Record each current database flag and whether each recommended flag is new. Before you change the instance, decide whether to apply the changes immediately or during the next maintenance window, if that option is available. Plan how you will restore the previous flags.

## Step 1: Get the Recommended Configuration {#gcp-cloud-sql-get-recommended-configuration}

1. Log in to the Releem dashboard.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Review the recommended parameters that need to be applied as database flags.

## Step 2: Configure Database Flags in GCP Cloud SQL {#gcp-cloud-sql-configure-database-flags}

1. Log in to the **Google Cloud Console**.
2. Navigate to the **Cloud SQL Instances** page.
3. Select the project that contains your Cloud SQL instance.
4. Click on your MySQL instance name.
5. Click the **Edit** button.
6. Scroll down to the **Flags** section.
7. Select **Add item** for a new flag, or modify an existing flag. Set the value shown in the recommendation.
8. Choose the application timing available for your instance.
9. Click **Save**.

## Step 3: Apply the Changes {#gcp-cloud-sql-apply-changes}

Cloud SQL may automatically restart the instance if required. Wait for the instance to complete the restart process before checking the result.

## Step 4: Verify the Applied Configuration {#gcp-cloud-sql-verify-applied-configuration}

### Confirm the flags in Google Cloud {#gcp-cloud-sql-confirm-cloud-flags}

Open **Database flags** and confirm the flags have been applied. Check for pending restart requirements, then confirm the effective database settings in MySQL.

### Verify the application event in Releem {#gcp-cloud-sql-verify-releem-event}

Confirm the **Applied recommended configuration** event on the **MySQL Metrics graph**, then review current metrics. Also confirm the database instance health and review application connectivity and errors.

:::info
Database flags are persisted until you manually remove them. Some flags may require the instance to be restarted before they become effective.
:::

If the instance does not return to its expected state, restore each previous flag value and remove any newly added flag, then select **Save**. Restart the instance if the restored flags require it, and repeat the health and effective-value checks. For additional help, contact Releem support.

  </TabItem>
</Tabs>
