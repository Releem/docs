---
id: how-to-apply-configuration-using-cron
title: How to Apply Configuration Using Cron
---

# How to Apply Configuration Using Cron

Automating the application of MySQL configuration changes can be beneficial for maintaining optimal database performance with minimal manual intervention. Releem provides a simple command that can be scheduled using cron to automatically apply recommended configurations.

## Command for Automatic Configuration

We've added a new command to apply configuration automatically:

```bash
bash /opt/releem/mysqlconfigurer.sh -s auto
```

## Automatic Rollback Feature

Releem Agent is now equipped with an automatic rollback function. This means if any issues arise while applying a new configuration, Releem will smartly revert to the previous configuration, ensuring your database remains stable and operational.

## Setting Up a Cron Job

To set up automatic configuration updates with cron, follow these steps:

1. Open your crontab file for editing:
   ```bash
   crontab -e
   ```

2. Add a new line to schedule the automatic configuration. For example, to run it daily at 3 AM:
   ```bash
   0 3 * * * bash /opt/releem/mysqlconfigurer.sh -s auto
   ```

3. Save and exit the editor.

This setup will automatically apply new recommended configurations from Releem at the specified time.

## Benefits of Automatic Configuration

- **Zero-Touch Optimization**: Your MySQL configuration stays optimized without manual intervention
- **Safe Updates**: With the automatic rollback feature, there's minimal risk of disruption
- **Consistent Performance**: Regular configuration updates ensure your database maintains optimal performance

For servers with critical workloads, consider testing this feature during a maintenance window before implementing it in production. 