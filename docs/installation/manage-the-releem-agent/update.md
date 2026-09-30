---
id: update
slug: /installation/manage-the-releem-agent/update
title: Update Releem Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update Releem Agent

Choose how the Agent was installed. The Linux shell-installer commands in these guides use `RELEEM_CRON_ENABLE=1` for daily updates. CloudFormation and containers have separate update procedures below.

<Tabs>
  <TabItem value="linux" label="Linux">

  The Linux shell-installer commands enable automatic daily updates with `RELEEM_CRON_ENABLE=1`. Set the value to `0` during installation when you do not want scheduled updates.

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

  Docker installations do not use the Linux scheduled update. Update the image using the method you used to install the Agent.

  **Docker Compose:** Change the `image` tag in `compose.yaml` to the version you want to install. Keep the previous tag, then update with one command:

  ```bash
  docker compose pull releem-agent && docker compose up -d releem-agent
  ```

  **Docker run:** Keep the original `docker run` command, environment options, mounts, restart options, and previous image tag. Pull the new image with `docker pull releem/releem-agent:[NEW_VERSION]`. Stop the existing `releem-agent` container and rename it `releem-agent-previous`; do not remove it or its host directories. Rerun the original installation command with the new tag and the same options. If the replacement fails, remove only the new container, rename `releem-agent-previous` back to `releem-agent`, and start it. Remove the previous container only after the new one passes verification.

  Confirm that the replacement container is running, the Dashboard shows the intended Agent version, and current metrics continue to arrive. For Compose, review `docker compose logs --tail=100 releem-agent` if the update fails; for Docker run, review `docker logs --tail=100 releem-agent`.

  **Scheduled Compose updates:** If you want unattended Docker updates, keep the Agent's environment and mounts in `compose.yaml` and change its image to `releem/releem-agent:latest`. [Docker Hub lists the `latest` tag](https://hub.docker.com/r/releem/releem-agent/tags). Keep the previous versioned tag so you can restore it.

  First run the update command yourself from the host. Replace the Compose-file path with its actual absolute path:

  ```bash
  docker compose -f /path/to/compose.yaml pull releem-agent && docker compose -f /path/to/compose.yaml up -d --no-deps releem-agent
  ```

  Confirm the Agent version and current metrics. Then add this line to the crontab of an account authorized to run Docker, replacing the Docker executable and Compose-file paths with their actual absolute paths:

  ```cron
  0 0 * * * /usr/bin/docker compose -f /path/to/compose.yaml pull releem-agent && /usr/bin/docker compose -f /path/to/compose.yaml up -d --no-deps releem-agent
  ```

  This checks for an updated image daily; [Compose recreates the named service when its image changes](https://docs.docker.com/reference/cli/docker/compose/up/). For multiple Agents in one Compose file, schedule each Agent service by name. To stop scheduled updates, remove the cron entry. If an update fails verification, pin the previous versioned tag in `compose.yaml` and run the same pull-and-up command. Docker-run installations remain on the manual update path above.
  </TabItem>
  <TabItem value="windows" label="Windows">

  Run PowerShell as Administrator, then update the installed Agent with one command:

  ```powershell
  & 'C:\Program Files\ReleemAgent\mysqlconfigurer.ps1' -Update
  ```

  After the command completes, confirm that the service is running, the intended version is shown, and current metrics continue to arrive.

  </TabItem>
</Tabs>
