---
id: troubleshoot-releem-agent
slug: /get-started/troubleshoot-releem-agent
title: How to Check if Releem Agent is Working
---

# Troubleshoot the Releem Agent

Use this guide when the Releem Agent is disconnected or the Dashboard does not show current data. First confirm the Dashboard state, then check the service and its logs.

On the Releem Score block, **Agent Status: Connected / Monitoring** indicates that the Releem platform receives metrics from the Releem Agent. Also confirm that the Dashboard shows a current data timestamp or recently updated metrics.

<img src="/img/dashboard-releem-score.png" alt="Releem Score block" className="shadow-img" />

## How to troubleshoot Releem Agent

If the Releem Agent is disconnected, check the service status first.

To check Releem Agent status, please run:

```
systemctl status releem-agent
```

If the Releem Agent is not running, start it:
```
systemctl start releem-agent
```
If the Releem Agent is running but the Dashboard reports it as disconnected, [check the Agent logs](/installation/manage-the-releem-agent/logs).

## Releem Agent Common Issues

### CloudLinux 

If CageFS is enabled, add the Releem MySQL configuration directory to CageFS and force an update:

```bash
echo '[releem-directory]' > /etc/cagefs/conf.d/releem.cfg
echo 'comment=Releem MySQL Directory' >> /etc/cagefs/conf.d/releem.cfg
echo 'paths=/etc/mysql/releem.conf.d' >> /etc/cagefs/conf.d/releem.cfg
cagefsctl --force-update
```

#### In the MySQL log file: [Warning] Aborted connection 181 to db: 'mysql' user: 'releem' host: 'localhost' (Got timeout reading communication packets)

CloudLinux MySQLGovernor blocks MySQL "releem" user.
Please exclude "releem" user from MySQLGovernor.

### cPanel/WHM

If your server is managed through WHM/cPanel, use the [WHM/cPanel installation guide](/installation/installation-methods/whm-cpanel) for setup-specific troubleshooting, including how to verify that cPanel MySQL auto-adjust settings are disabled.

### AWS RDS
[Common issues for AWS RDS](/installation/installation-methods/aws-rds#common-issues-for-aws-rds)


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

**How to fix:** Run /opt/releem/mysqlconfigurer.sh -p command and agree to the database service restart.

**How to fix for AWS RDS:** Enable Performance Insights and Performance Schema for your RDS instance.

**How to fix for GCP Cloud SQL:** Enable Performance Schema for your Cloud SQL instance.

## What to do next

After the Agent reconnects, return to [Connect Your Database Server](/get-started/connect-your-database-server#verify-the-connection-and-current-data) and confirm that current data has arrived. Then use the [Dashboard](/dashboard) to review checks and metrics.
