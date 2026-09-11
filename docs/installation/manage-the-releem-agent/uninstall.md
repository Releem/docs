---
id: uninstall
slug: /installation/manage-the-releem-agent/uninstall
title: Uninstallation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Uninstallation of Releem Agent

To remove Releem Agent from your server, choose your installation type and follow these steps:

<Tabs>
  <TabItem value="linux" label="Linux" default>

Linux removal is currently unavailable in this guide because the previous method downloaded and executed a mutable remote script. Do not run that method. Contact Releem Support for the current removal procedure.

Ask Support for a procedure that identifies and removes the `releem-agent` service, installed Agent files, and scheduled update entries. Confirm separately whether you must remove the database account, configuration backups, or cloud permissions; Agent removal does not establish that those resources were removed.

Removal succeeds when the Agent service and process are absent and the Dashboard receives no new metrics from this server. Keep the final configuration and log records until you confirm that you no longer need them for recovery or audit.

  </TabItem>
  <TabItem value="docker" label="Docker">

Before removal, confirm that `releem-agent` is the exact container you intend to delete and preserve any configuration or logs you still need. Then stop and remove the container:

```bash
docker rm -f releem-agent
```

If you used Docker Compose, remove the service from `docker-compose.yml` and run:

```bash
docker compose down
```

  </TabItem>
  <TabItem value="windows" label="Windows">
Windows removal is currently unavailable in this guide because the previous method downloaded and executed a mutable remote script. Do not run that method. Contact Releem Support for the current Windows removal procedure. Confirm success by checking that the Agent service and process are absent and that no new metrics arrive from this server.
  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

If the agent was installed by CloudFormation, delete the `releem-agent` CloudFormation stack.

If the Agent was installed manually on EC2, contact Releem Support for the current Linux removal procedure on that instance.

  </TabItem>
  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL">

If the Agent runs on a Compute Engine VM, contact Releem Support for the current Linux removal procedure on that VM.

If the agent runs in Docker, remove the container or Docker Compose service.

  </TabItem>
  <TabItem value="azure-mysql" label="Azure MySQL">

If the Agent runs on an Azure VM, contact Releem Support for the current Linux removal procedure on that VM.

If the agent runs in Docker, remove the container or Docker Compose service.

Remove Azure RBAC role assignments only if the identity is not used by other services.

  </TabItem>
</Tabs>
