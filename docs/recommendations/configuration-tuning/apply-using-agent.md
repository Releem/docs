---
id: apply-using-agent
slug: /recommendations/configuration-tuning/apply-using-agent
title: Apply configuration using the Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Apply configuration using the Agent

Use this method for a self-managed database server where the Releem Agent is installed directly on the database host.

Confirm that the Agent's database account has separately approved configuration-changing access. Monitoring access alone is not sufficient.

## Before you begin

1. Confirm that the database host and server in Releem are the ones you intend to change.
2. Review the recommended settings and record the current values before you begin.
3. Create a known-good backup artifact of the active database configuration. Confirm that you know its location and how to restore it.
4. Plan a maintenance window and confirm the approved service restart procedure.

## Apply the configuration

Run the command for the operating system on the database host:

<Tabs>
  <TabItem value="linux" label="Linux" default>
    Confirm that the Agent is running and that your account can execute the script under `/opt/releem/`. The command submits an application request to the Agent:

    ```bash
    bash /opt/releem/mysqlconfigurer.sh -s auto
    ```

    A successful exit means the request was submitted. It does not mean that the database configuration has been applied or that its values are effective. Continue with the shared verification steps after the Agent processes the job.
  </TabItem>
  <TabItem value="windows" label="Windows">
    Open PowerShell as Administrator. This command applies the configuration locally and prompts for confirmation by default. Review the prompt before you approve the change:

    ```powershell
    & 'C:\Program Files\ReleemAgent\mysqlconfigurer.ps1' -a
    ```

    After the command finishes, continue with the shared verification steps. A successful exit does not establish that restart-required values are effective.
  </TabItem>
</Tabs>

## Verify the result

1. Check whether any setting is restart-pending or requires a restart.
2. Confirm the effective database settings after any required restart.
3. Confirm the database service health is normal and the service is running.
4. Check application connectivity and review application errors.
5. Confirm the Releem event for the application attempt, then review current metrics for the same server.

Command completion does not prove that every recommended value is effective. Do not consider the change complete until the database and application checks pass.

If the apply command or restart fails, use this recovery path: do not retry while the database is unhealthy. Restore the known-good configuration artifact to the active path, then restart the database through your approved service procedure. Review the [Releem Agent logs](/installation/manage-the-releem-agent/logs) and database error log. If you cannot restore service, contact Releem Support and your database owner.

## Managed databases

For a managed database, use the [Portal guide](/recommendations/configuration-tuning/apply-using-portal). Use **Apply** only after Releem Support confirms it for the exact deployment and the provider administrator separately approves narrowly scoped configuration-changing authority. Otherwise, do not apply. Do not run the host commands above against a managed database.
