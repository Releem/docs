---
id: update
slug: /installation/manage-the-releem-agent/update
title: Update Releem Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update Releem Agent

Choose how the Agent was installed. The documented Linux installation command uses `RELEEM_CRON_ENABLE=1`, which enables the automatic daily update.

<Tabs>
  <TabItem value="linux" label="Linux">

  The documented installation command enables automatic daily updates with `RELEEM_CRON_ENABLE=1`. Set the value to `0` during installation when you do not want scheduled updates.

  To update manually, run one command:

  ```bash
  /opt/releem/mysqlconfigurer.sh -u
  ```

  After the command completes, confirm that the Agent service is running, the Dashboard shows the intended Agent version, and current metrics continue to arrive. If any check fails, review [Agent logs](/installation/manage-the-releem-agent/logs) before another attempt. Keep the previous configuration and package details until you complete these checks.

  </TabItem>
  <TabItem value="aws" label="AWS" default>

  To update Releem Agent, please follow the step below:
  1. Go to the Releem Agent CloudFormation stack and click the **Update** button.
  2. Choose **Use current template**, click **Next**
  3. Edit **Image** field with the current agent version number. You can find the latest version of Releem Agent in the Update Notification message in the Dashboard or by clicking on the [link](https://hub.docker.com/r/releem/releem-agent/tags) (For example: releem/releem-agent:1.5.0.3)
  4. Then click **Next**.
  5. Click **Next**.
  6. Finally, click **Update stack** to finish the update.

  </TabItem>
  <TabItem value="docker" label="Docker">

  Set `AGENT_VERSION` in the protected `.env` file to the version you want to install. Keep the previous image tag until verification is complete, then update the container with one command:

  ```bash
  docker compose pull releem-agent && docker compose up -d releem-agent
  ```

  Confirm that the replacement container is running, the Dashboard shows the intended Agent version, and current metrics continue to arrive. Review `docker compose logs --tail=100 releem-agent` if the update fails. Keep the previous image reference and configuration until you complete those checks.
  </TabItem>
  <TabItem value="windows" label="Windows">

  Run PowerShell as Administrator, then update the installed Agent with one command:

  ```powershell
  & 'C:\Program Files\ReleemAgent\mysqlconfigurer.ps1' -Update
  ```

  After the command completes, confirm that the service is running, the intended version is shown, and current metrics continue to arrive.

  </TabItem>
</Tabs>
