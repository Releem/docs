---
title: How to apply the Recommended Configuration for Windows
sidebar_label: Windows
---

# How to apply the Recommended Configuration for Windows

Follow these steps to apply the recommended configuration for MySQL on Windows:

## Step 1: Copy the Recommended Configuration

1. Log in to the **Releem dashboard**.
2. Open **Configuration** in the **Recommended Configuration** block.
3. Click the **Copy** icon to copy the recommended configuration.

## Step 2: Modify the my.ini File

1. Locate the my.ini file on your system:
   - Typically located in the MySQL installation directory (e.g., `C:\Program Files\MySQL\MySQL Server X.X\my.ini`) or under `C:\ProgramData\MySQL\my.ini`.
2. Open the my.ini file using a text editor like **Notepad**.
3. Paste the copied configuration into the end of file.
4. Save the file using the **ANSI charset**:
   - In Notepad, go to **File → Save As**.
   - In the "Encoding" dropdown, select **ANSI**, then click **Save**.

## Step 3: Restart the MySQL Database Service

1. Open the **Services** application in Windows:
   - Press `Win + R`, type `services.msc`, and press Enter.
2. Find the MySQL service in the list (e.g., MySQL or MySQL80).
3. Right-click on the service and select **Restart**.

## Step 4: Verify the Applied Configuration

You should see event **Configuration was applied successfully** on the MySQL Metrics graph.

For additional help, feel free to contact **Releem support**.
