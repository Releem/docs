---
id: rollback
slug: /recommendations/configuration-tuning/rollback
title: Roll back a configuration
---

# Roll back a configuration

Use this Agent command to request a rollback for a self-managed MySQL or MariaDB server on Linux. This page does not define which previous values are retained, or establish that every change made outside this Agent workflow can be recovered.

Do not use this procedure for PostgreSQL or a managed database. Use the manual or provider-specific recovery path recorded before those changes.

## Before you begin

1. Confirm that you are on the intended database host.
2. Record the current service status, effective database settings, and application symptoms.
3. Confirm that the known-good pre-application configuration backup is available and that you know its active destination path.
4. Plan for a database restart and confirm the approved service procedure.

## Run the rollback command

Run:

```bash
/bin/bash /opt/releem/mysqlconfigurer.sh -r
```

Command success does not confirm that the intended configuration was restored or that every restored value is effective.

## Verify the result

1. Check whether a restart is required or remains restart-pending.
2. Confirm the effective database settings after any required restart.
3. Confirm the database service health is normal and the service is running.
4. Check application connectivity and review application errors.
5. Review current metrics and compare them with the state recorded before rollback.

## If the rollback fails

If the rollback fails, do not keep rerunning the command. Review the [Releem Agent logs](/installation/manage-the-releem-agent/logs) and database error log, then restore the known-good pre-application backup to the active configuration path. Restart the database through your approved service procedure and repeat the verification checks. If this manual recovery does not restore service, contact Releem Support and your database owner with a redacted log excerpt.
