---
id: apply-using-cron
slug: /recommendations/configuration-tuning/apply-using-cron
title: Apply configuration on a schedule
---

# Apply configuration on a schedule

Use cron to ask the Releem Agent to apply the latest recommended configuration at a fixed time. A scheduled run can apply a future recommendation without you reviewing its exact values at execution time.

## Before you begin

1. Confirm that the Releem Agent is installed on the self-managed Linux server you intend to change.
2. Review the current recommendation and record the active configuration values.
3. Create a known-good configuration backup and confirm how you will restore it.
4. Run and verify the application command interactively before you schedule it.
5. Choose a maintenance window that accounts for restart-required settings.

## Run the application command once

Run:

```bash
bash /opt/releem/mysqlconfigurer.sh -s auto
```

A successful exit means the request was submitted. It does not prove that every recommended value was applied or became effective. Complete the verification steps below before you create the schedule.

## Set up a cron job

1. Open the current user's crontab:

   ```bash
   crontab -e
   ```

2. Add the schedule. This example runs the command every day at 3:00 AM:

   ```bash
   0 3 * * * bash /opt/releem/mysqlconfigurer.sh -s auto
   ```

3. Save the crontab.
4. Run `crontab -l` and confirm that the exact entry appears under the intended user.

## Verify a scheduled application

After the scheduled time:

1. Review the [Releem Agent logs](/installation/manage-the-releem-agent/logs) for the application attempt.
2. Check whether any setting is restart-pending.
3. Confirm the effective database settings after any required restart.
4. Confirm the database service and application are healthy.
5. Confirm the Releem event for the attempt, then review current metrics.

An Agent log entry or Releem event records the attempt. It does not prove that every setting is effective.

## Disable or remove the cron job

Open the current user's crontab:

```bash
crontab -e
```

Remove the exact Releem application entry, or comment it out if your change-control process requires retaining it for review. Save the file, then run `crontab -l` again and confirm that the active entry is absent or disabled.

Removing the cron job does not revert changes that an earlier run made. Review the effective database settings and use the documented [Rollback](/recommendations/configuration-tuning/rollback) path only where it applies. If a scheduled run fails, disable the schedule before you investigate or retry it.
