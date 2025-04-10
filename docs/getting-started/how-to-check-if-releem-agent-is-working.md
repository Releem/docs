---
id: how-to-check-if-releem-agent-is-working
title: How to Check if Releem Agent is Working
---

# How to Check if Releem Agent is Working

After you've installed Releem Agent, it's time to check if Releem is working.

On the Releem Score block, you should see Agent Status - Connected / Monitoring, which indicates that Releem Platform receives metrics from Releem Agent.

![Releem Score block](/img/dashboard-releem-score.png)

## How to troubleshoot Releem Agent
If the Releem Agent is disconnected, please, take the following steps and check the most common issues.

To check Releem Agent status, please run:

```
systemctl status releem-agent
```

If Releem Agent is not running to start it please run:
```
systemctl start releem-agent
```
If Releem Agent is running but Dashboard informs you that it is disconnected please [check the logs](/releem-agent/how-to-check-logs)

## Releem Agent Common Issues

### CloudLinux 

In the MySQL log file: [Warning] Aborted connection 181 to db: 'mysql' user: 'releem' host: 'localhost' (Got timeout reading communication packets)

CloudLinux MySQLGovernor blocks MySQL "releem" user.
Please exclude "releem" user from MySQLGovernor.

### CPanel

If you're using CPanel, please ensure the options "Allow cPanel & WHM to determine the best value for your MySQL settings" are disabled in WHM >> Tweak Settings.

### AWS RDS
[Common issues for AWS RDS](/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation#common-issues-for-aws-rds)


## Releem Agent Installation Errors
### Failed to determine service to restart. The automatic applying configuration will not work.
**The root cause:** Agent couldn't determine the database service restart command.

**How to fix:** Set the following option in the /opt/releem/releem.conf: mysql_restart_service="command to restart MySQL” and restart the Releem Agent with the following command: systemctl restart releem-agent

### Failed to determine file my.cnf in default path. The automatic applying configuration is disabled.
**The root cause:** not a standard Mysql installation.

**How to fix:** Reinstall the agent by adding the RELEEM_MYSQL_MY_CNF_PATH variable with the correct path to the my.cnf file

### No parameter specified in AwsRDSParameterGroup agent settings. The automatic applying configuration is disabled.
**The root cause:** The CloudFormation stack for the agent has not been updated and/or the ParameterGroup has not been configured for automatic application.

**How to fix:** update the CloudFormation stack and set DBParameterGroup parameter to newly created Parameter group.
You can specify “dummy” in the DBParameterGroup parameter if you do not plan to use automatic configuration applying.

### Error creating agent catalog for configurations
**The root cause:** Incorrect installation

**How to fix:** Reinstall the Releem Agent

### Latency is not calculated
**The root cause:** The Performance Schema is not enabled for manual installation or restart is not performed for automatic installation.

**How to fix:** Run /opt/releem/mysqlconfigurer.sh -p command and agree to the database service restart
