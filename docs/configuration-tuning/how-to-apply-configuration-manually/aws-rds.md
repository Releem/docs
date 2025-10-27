---
title: How to apply the Recommended Configuration for AWS RDS
sidebar_label: AWS RDS
---

# How to apply the Recommended Configuration for AWS RDS

Use Parameter Groups to apply the recommended configuration. Follow the steps below:

## Step 1: Modify the Parameter Group in AWS RDS

1. Log in to the AWS Management Console.
2. Navigate to the RDS Dashboard.
3. Select **Parameter Groups** from the left-hand menu under Databases.
4. Identify the parameter group assigned to your RDS instance and Edit the parameter group:
   - Select your parameter group and click **Edit Parameters**.
   - Update the parameters based on the recommended configuration from **Releem Dashboard**.
   - Save the changes.

## Step 2: Apply the Parameter Group to Your RDS Instance

1. Go back to the RDS Dashboard and select your database instance.
2. Click on the **Modify** button.
3. In the Database options section, select the updated parameter group.
4. Save the changes.
   - Choose whether to apply the changes immediately or during the next maintenance window.

## Step 3: Reboot the RDS Instance

1. After applying the parameter group, reboot your RDS instance:
   - In the RDS Dashboard, select your instance.
   - Click **Actions → Reboot**.
2. This will apply the new parameter settings.

## Step 4: Verify the Applied Configuration

You should see event **Applied recommended configuration** on the MySQL Metrics graph.

For additional help, feel free to contact **Releem support**.
