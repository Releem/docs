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

Run the uninstall command as `root`:

```bash
bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)" uninstall
```

This removes the Agent service, installed Agent files, and its scheduled update entry. Remove the database account or cloud permissions separately when you no longer need them.

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
Run PowerShell as Administrator:

```powershell
$env:RELEEM_UNINSTALL_CONFIRM=1; iex "& { $(iwr -useb https://releem.s3.amazonaws.com/v2/install.ps1) } -Uninstall"
```

Removal succeeds when the service and process are absent and the Dashboard receives no new metrics from this server.
  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

If the agent was installed by CloudFormation, delete the `releem-agent` CloudFormation stack.

If the Agent was installed manually on EC2, use the Linux procedure on that instance.

  </TabItem>
  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL">

If the Agent runs on a Compute Engine VM, use the Linux procedure on that VM.

If the agent runs in Docker, remove the container or Docker Compose service.

  </TabItem>
  <TabItem value="azure-mysql" label="Azure MySQL">

If the Agent runs on an Azure VM, use the Linux procedure on that VM.

If the agent runs in Docker, remove the container or Docker Compose service.

Remove Azure RBAC role assignments only if the identity is not used by other services.

  </TabItem>
</Tabs>
