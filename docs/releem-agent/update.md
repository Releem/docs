---
id: update
title: Update Releem Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update Releem Agent

To update Releem Agent, select your installation type and follow the step below:

<Tabs>
  <TabItem value="linux" label="Linux">

  Releem Agent updates automatically.

  To update Releem Agent manually please run the following command:

  ```bash
  /opt/releem/mysqlconfigurer.sh -u
  ```

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

  We automated update of Releem Agent installed in Docker container.

  To setup automated Releem Agent update please follow the steps below:

  1. Download script for update
     ```bash
     mkdir -p /opt/releem 
     curl -s -L -o /opt/releem/update_releem_docker.sh https://releem.s3.amazonaws.com/v2/update_releem_docker.sh
     chmod +x /opt/releem/update_releem_docker.sh
     ```

  2. Set the container name (by default the name of container is "releem-agent") and run the command below for test
     ```bash
     PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash /opt/releem/update_releem_docker.sh <container_name>
     ```

  3. Set container name and execute the following command to add script to cron for every Releem Agent container
     ```bash
     ( crontab -l 2>/dev/null | grep -v "/opt/releem/update_releem_docker.sh" || true; echo "0 0 * * * PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash /opt/releem/update_releem_docker.sh <container_name> >> /tmp/update_releem_docker.log 2>&1") | crontab -
     ```
  </TabItem>
  <TabItem value="windows" label="Windows">

  1. Stop Releem Agent service.
  2. Download the [Releem Agent](https://releem.s3.us-east-1.amazonaws.com/v2/releem-agent.exe) file to the folder `C:\Program Files\ReleemAgent`
  3. Start Releem Agent service.

  </TabItem>
</Tabs> 