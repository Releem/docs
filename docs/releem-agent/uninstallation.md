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
    Run the following command as root user:
    ```bash
    bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)" uninstall
    ```
  </TabItem>
  <TabItem value="windows" label="Windows">
    Run the following command in Windows PowerShell as Administrator:
    ```powershell
    $env:RELEEM_UNINSTALL_CONFIRM=1; iex "& { $(iwr -useb https://releem.s3.amazonaws.com/v2/install.ps1) } -Uninstall"
    ```
  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">
    To uninstall Releem Agent from the AWS RDS, please delete CloudFormation stack.    
  </TabItem>
</Tabs>
