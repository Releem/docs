---
id: uninstallation
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

The command stops and removes the `releem-agent` service, removes the installed agent files, and removes Releem cron entries.

  </TabItem>
  <TabItem value="docker" label="Docker">

Stop and remove the container:

```bash
docker rm -f releem-agent
```

If you used Docker Compose, remove the service from `docker-compose.yml` and run:

```bash
docker compose down
```

  </TabItem>
  <TabItem value="windows" label="Windows">
    Run the following command in Windows PowerShell as Administrator:
    ```powershell
    $env:RELEEM_UNINSTALL_CONFIRM=1; iex "& { $(iwr -useb https://releem.s3.amazonaws.com/v2/install.ps1) } -Uninstall"
    ```
  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

If the agent was installed by CloudFormation, delete the `releem-agent` CloudFormation stack.

If the agent was installed manually on EC2, use the Linux uninstall command on that EC2 instance.

  </TabItem>
  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL">

If the agent runs on a Compute Engine VM, use the Linux uninstall command on that VM.

If the agent runs in Docker, remove the container or Docker Compose service.

  </TabItem>
  <TabItem value="azure-mysql" label="Azure MySQL">

If the agent runs on an Azure VM, use the Linux uninstall command on that VM.

If the agent runs in Docker, remove the container or Docker Compose service.

Remove Azure RBAC role assignments only if the identity is not used by other services.

  </TabItem>
</Tabs>
