---
id: cloud-managed-aws-rds-automatic-installation
title: AWS RDS
---

# Cloud-Managed AWS RDS Automatic Installation


Use this instruction to install Releem Agent automatically via CloudFormation to AWS Fargate. Releem Agent will run in the container.

The requirements for RDS instance:
- Enhanced monitoring to collect system performance metrics.
- Performance Insights to collect MySQL performance metrics.

The CloudFormation will deploy Releem Agent container using AWS Fargate service to collect metrics from your AWS RDS instance and send them to Releem Cloud Platform. The template will create roles to run Releem Agent with the following permissions:
- logs:Get*
- rds:Describe*
- cloudwatch:Get*
- ecr:GetAuthorizationToken
- ecr:BatchCheckLayerAvailability
- ecr:GetDownloadUrlForLayer
- ecr:BatchGetImage
- rds:ModifyDBParameterGroup

To move forward just do the following steps:
1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions). To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

2. To configure automatic applying of recommended configuration please sign in to your AWS account and do the following steps:
   - In the Amazon RDS console, create a Parameter Group for the version of your database named “releem-agent".
   - Modify the database by specifying in “DB parameter group” the Parameter group created in the previous step.
   - Reboot the database if required to apply the changes.

3. Open CloudFormation link in the browser, check that right region is selected, and fill the following fields:
   - DBID: RDS DB Instance ID. If you're using a cluster, please set the instance name you would like to tune.
   - DBUser: User to collect metrics from the SQL server, that we added in the step 1.
   - DBPassword: Password for user
   - SecurityGroupIDs: Releem Agent SecurityGroups to connect to RDS. Please Allow All Outbound traffic for Releem Agent Security Group.
   - SubnetIDs: Releem Agent container should be able to connect to RDS.
   - QueryOptimization: set True if Releem Agent should collect additional information for Automatic SQL Query Optimization.
   - DBParameterGroup: Parameter Group name from the step 2 which Releem will use to set recommendations for RDS instance.

4. Next, click "Create Stack".

## Common Issues for AWS RDS

To check Releem Agent logs please open CloudWatch -> Log Groups and then select Releem Agent log group.

1. Failed to read log stream %s:%s: %s RDSOSMetrics
   - Enable Enhanced monitoring for your RDS instance.

2. No Latency graph on Releem Dashboard
   - Enable Performance Insights for your RDS instance.

3. Error 1045 (28000): Access denied for user 'releem'@'' (using password: YES)
   - Check password for Releem User that you created according to this [guide](/releem-agent/mysql-permissions). And reinstall Releem Agent.
   - To set new password please run in MySQL console the following command:
     ```
     ALTER USER 'releem'@'%' IDENTIFIED BY 'New-Password-Here';
     ```

4. Connect: connection timed out
   - Check that SecurityGroup of RDS instance has Inbound rule to accept connections from Releem Agent installed in ECS.

5. CloudFormation stack is not finished, still "in progress" for a long time
   - Enable Performance Insights and Enhanced monitoring for your RDS instance.
   - Check that SecurityGroup that you set for Releem Agent has a rule for All outbound traffic.

6. Error 1142 (42000): SELECT command denied to user 'releem'@'[serverIP]' for table 'events_statements_history'
   - Additional database permissions are required. Follow this guide to add them: [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required)