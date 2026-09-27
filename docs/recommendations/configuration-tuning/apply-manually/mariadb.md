---
id: mariadb
slug: /recommendations/configuration-tuning/apply-manually/mariadb
title: Apply configuration manually for MariaDB
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Apply configuration manually for MariaDB

Choose the environment that hosts MariaDB. Review the [MariaDB permissions](/supported-databases/mariadb/required-permissions) and the shared [pre-change, verification, and recovery checks](/recommendations/configuration-tuning/apply-configuration#before-you-apply) before you begin.

<Tabs groupId="configuration-platform" queryString="platform" defaultValue="linux">
  <TabItem value="linux" label="Linux">

Releem keeps the filename `z_aiops_mysql.cnf` for MariaDB too. Use the recommendation generated for your MariaDB server. See [MariaDB option files](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/configuring-mariadb/configuring-mariadb-with-option-files) for configuration search paths and include behavior.

## Before you begin {#linux-before-you-begin}

Confirm the active MariaDB configuration directory, record the current settings, and plan a maintenance window and recovery path. If the destination already contains `z_aiops_mysql.cnf`, make a backup copy outside the active include directory. If it does not, record that the Releem file is new. The Releem Agent stores the Recommended Configuration at `/opt/releem/conf/z_aiops_mysql.cnf`.

## Step 1: Copy Recommended Configuration to MariaDB configuration folder {#linux-copy-recommended-configuration}

Confirm that the active MariaDB option file includes `/etc/mysql/conf.d/` before using this example. Otherwise, copy the file to the include directory used by your installation:

```bash
cp /opt/releem/conf/z_aiops_mysql.cnf /etc/mysql/conf.d/
```

:::info
Your installation may use `/etc/mysql/mariadb.conf.d/` or `/etc/my.cnf.d/`. Confirm the active include directory and load order before copying the file.
:::

## Step 2: Restart MariaDB to apply configuration {#linux-restart-mariadb}

Review the copied settings, then restart the database during the planned maintenance window. Confirm the service name on your host; the example uses `mariadb`.

```bash
service mariadb restart
```

## Step 3: Verify the Applied Configuration {#linux-verify-applied-configuration}

1. Confirm each changed value with `SHOW GLOBAL VARIABLES LIKE '[VARIABLE_NAME]';` in an administrator session. Replace the placeholder with a variable from the recommendation.
2. Confirm the database service is running and review application connectivity and errors.
3. Confirm the **Applied recommended configuration** event in Releem, then review current metrics.

If the service does not return to its expected state, restore the backed-up `z_aiops_mysql.cnf` or remove the newly inserted file from the active include directory, then restart MariaDB. If that recovery fails, use [Rollback](/recommendations/configuration-tuning/rollback) when applicable and contact Releem support.

  </TabItem>
  <TabItem value="windows" label="Windows">

## Before you begin {#windows-before-you-begin}

- Do not continue until you have confirmed which `my.ini` file the selected MariaDB service uses.
- Make a backup copy of the active `my.ini`, record the current settings, and plan a maintenance window and recovery path.
- Review the exact recommended settings in Releem before you copy them. After you paste them into `my.ini`, check them again before you save the file.

## Step 1: Copy the Recommended Configuration {#windows-copy-recommended-configuration}

1. Log in to the **Releem dashboard**.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Click the **Copy** icon to copy the recommended configuration.

## Step 2: Modify the my.ini File {#windows-modify-my-ini}

1. Open the MariaDB service properties in **Services** and inspect its executable path and any `--defaults-file` argument to locate the active `my.ini` file.
2. Open the file in a text editor such as Notepad.
3. Paste the copied configuration at the end of the file.
4. Save the file using the **ANSI charset**. In Notepad, choose **File → Save As**. In **Encoding**, select **ANSI**, then select **Save**.

## Step 3: Restart the MariaDB Database Service {#windows-restart-mariadb-service}

1. Press `Win + R`, enter `services.msc`, and press Enter.
2. Find the service for the intended MariaDB instance and confirm its name.
3. Right-click the selected service and choose **Restart**.

## Step 4: Verify the Applied Configuration {#windows-verify-applied-configuration}

1. Confirm each changed value with `SHOW GLOBAL VARIABLES LIKE '[VARIABLE_NAME]';` in an administrator session. Replace the placeholder with a variable from the recommendation.
2. Confirm the database service is running and review application connectivity and errors.
3. Confirm the **Configuration was applied successfully** event in Releem, then review current metrics.

If the service does not return to its expected state, restore the backed-up `my.ini` and restart the selected MariaDB service. If that recovery fails, use [Rollback](/recommendations/configuration-tuning/rollback) when applicable and contact Releem support.

  </TabItem>
  <TabItem value="docker" label="Docker">

## Before you begin {#docker-before-you-begin}

Identify the persistent configuration file mounted into the target MariaDB container. Make a backup or snapshot of that persistent mounted configuration, record the current settings, confirm the container name or ID, and plan a maintenance window and recovery path.

## Step 1: Copy the Recommended Configuration {#docker-copy-recommended-configuration}

1. Log in to the Releem dashboard.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Click the **Copy** icon to copy the recommended configuration.

## Step 2: Modify the my.cnf file {#docker-modify-my-cnf}

Identify the active `my.cnf` file used by the target MariaDB container. Paste the copied configuration at the end of that file and confirm that the change is stored in persistent configuration.

## Step 3: Restart Docker container {#docker-restart-container}

Before restarting, review the pasted settings and confirm that `<container_name_or_id>` identifies the MariaDB container you intend to restart.

```bash
docker restart <container_name_or_id>
```

## Step 4: Verify the Applied Configuration {#docker-verify-applied-configuration}

1. Confirm each changed value with `SHOW GLOBAL VARIABLES LIKE '[VARIABLE_NAME]';` in an administrator session. Replace the placeholder with a variable from the recommendation.
2. Confirm the database container health and review application connectivity and errors.
3. Confirm the **Applied recommended configuration** event in Releem, then review current metrics.

If the container does not return to its expected state, restore the backup or snapshot of the persistent mounted configuration and restart the same container. If that recovery fails, use [Rollback](/recommendations/configuration-tuning/rollback) when applicable and contact Releem support.

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

## Before you begin {#aws-rds-before-you-begin}

Record the parameter group assigned to your RDS instance and its current parameter values. Confirm whether that group is shared by other instances. If it is shared, stop until the change is approved for every affected instance, or use a dedicated parameter group for the target instance. Plan the application timing and recovery path. Recording it does not guarantee that every change can be reversed.

Use an editable custom parameter group from the family matching your MariaDB engine version. See [Modify an RDS parameter group](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.Modifying.html) for dynamic and restart-required changes.

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

Check for **pending-reboot**. Static changes and newly assigned parameter groups require a reboot; dynamic changes to an already assigned group can take effect without one. When needed, select the intended instance and choose **Actions → Reboot** during the planned maintenance window.

## Step 4: Verify the Applied Configuration {#aws-rds-verify-applied-configuration}

1. Check the RDS instance for pending-reboot settings and confirm the effective database settings in MariaDB after any required reboot.
2. Confirm the database instance health and review application connectivity and errors.
3. Confirm the **Applied recommended configuration** event in Releem, then review current metrics.

If the instance does not return to its expected state, reassign the previous parameter group or restore the recorded parameter values. Reboot the instance if the restored settings require it, then repeat the health and effective-value checks. For additional help, contact Releem support.

  </TabItem>
</Tabs>
