---
id: update
slug: /installation/manage-the-releem-agent/update
title: Update Releem Agent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update Releem Agent

Choose how the Agent was installed. Automatic updates run only when you explicitly enabled them during installation. The documented Linux installation default is `RELEEM_CRON_ENABLE=0`, which leaves scheduled updates disabled.

<Tabs>
  <TabItem value="linux" label="Linux">

  Automatic updates are disabled by the documented installation command. They run only when you explicitly install with `RELEEM_CRON_ENABLE=1`.

  Before changing the update setting, inspect `/opt/releem/releem.conf`, the `releem-agent` service definition, and the root user's scheduled jobs or cron entries for update-related settings. The exact stored key and job name are not documented here. Do not edit an entry you cannot identify; contact Releem Support.

  Manual Linux updates are currently unavailable in this guide because the installed updater's download and integrity-verification behavior is not documented. Contact Releem Support for the current Linux update procedure.

  An update succeeds when the Agent service is running, the Dashboard shows the intended Agent version, and current metrics continue to arrive. If any check fails, review [Agent logs](/installation/manage-the-releem-agent/logs) before another attempt. Keep the previous configuration and package details until you complete these checks.

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

  Docker update installation is currently unavailable in this guide because image selection, secret handling, and the previous remote update script are not documented as a complete current procedure. Do not download or schedule that script. Contact Releem Support for the current image tag and container replacement procedure.

  An update succeeds when the replacement container is running, the Dashboard shows the intended Agent version, and current metrics continue to arrive. Keep the previous image reference and configuration until you complete those checks.
  </TabItem>
  <TabItem value="windows" label="Windows">

  Windows update installation is currently unavailable in this guide because package selection and integrity verification are not documented. Contact Releem Support for the current Windows package and update procedure. An update succeeds when the service is running, the intended version is shown, and current metrics continue to arrive.

  </TabItem>
</Tabs>
