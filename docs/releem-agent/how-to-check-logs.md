---
id: how-to-check-logs
title: How to Check Releem Agent Logs?
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to Check Releem Agent Logs?

This guide explains how to check Releem Agent logs for different environments and operating systems.

<Tabs>
  <TabItem value="debian" label="Debian" default>
    To check Releem Agent logs on Debian-based systems, use the following command:

    ```bash
    journalctl -u releem-agent
    ```

    This will show you all log entries related to Releem Agent in the system log.
  </TabItem>

  <TabItem value="centos" label="CentOS">
    To check Releem Agent logs on CentOS-based systems, use the following command:

    ```bash
    journalctl -u releem-agent
    ```

    This will display all log entries related to Releem Agent in the system messages log.
  </TabItem>

  <TabItem value="aws-rds" label="AWS RDS">
    For AWS RDS installations, all Releem Agent logs are stored in CloudWatch under the `releem-agent` log group.

    To view the logs:
    1. Open the AWS Console
    2. Navigate to CloudWatch
    3. Go to Log groups
    4. Find and select the `releem-agent` log group
  </TabItem>

  <TabItem value="docker" label="Docker">
    To check Releem Agent logs when running in Docker, use the following command:

    ```bash
    docker logs [container_name]
    ```

    Note: By default, the container name is `releem-agent`. If you used a different name during container creation, replace `releem-agent` with your container name.
  </TabItem>
</Tabs>