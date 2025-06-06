---
id: cloud-managed-aws-rds-automatic-installation
title: AWS RDS
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cloud-Managed AWS RDS Automatic Installation


Use this instruction to install Releem Agent automatically via CloudFormation to AWS Fargate, or manually on an EC2 instance. Releem Agent will run in a container on AWS Fargate or directly on the EC2 instance, depending on your choice.

The requirements for RDS instance:
- Enhanced monitoring to collect system performance metrics.
- Performance Insights to collect MySQL performance metrics.

To configure automatic applying of recommended configuration please sign in to your AWS account and do the following steps:
   - In the Amazon RDS console, create a Parameter Group for the version of your database named “releem-agent".
   - Modify the database by specifying in “DB parameter group” the Parameter group created in the previous step.
   - Reboot the database if required to apply the changes.

You have the following options to install Releem Agent:

<Tabs>
  <TabItem value="cloudformation" label="CloudFormation" default>

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

   2. Open CloudFormation link in the browser, check that right region is selected, and fill the following fields:
      - DBID: RDS DB Instance ID. If you're using a cluster, please set the instance name you would like to tune.
      - DBUser: User to collect metrics from the SQL server, that we added in the step 1.
      - DBPassword: Password for user
      - SecurityGroupIDs: Releem Agent SecurityGroups to connect to RDS. Please Allow All Outbound traffic for Releem Agent Security Group.
      - SubnetIDs: Releem Agent container should be able to connect to RDS.
      - QueryOptimization: set True if Releem Agent should collect additional information for Automatic SQL Query Optimization.
      - DBParameterGroup: Parameter Group name which Releem will use to set recommendations for RDS instance. Default name is "releem-agent".

   3. Next, click "Create Stack".

  </TabItem>
  <TabItem value="ec2" label="EC2">

   Use this instruction to install Releem Agent manually on the EC2 instance to tune AWS RDS. Releem Agent will automatically collect metrics and recommend configuration.
   To move forward just do the following steps:
   1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions). To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

   2. Add IAM role releem-agent-role and apply it to the EC2 instance:
   ```
   { 
   "Version": "2012-10-17", 
   "Statement": [ 
      { 
         "Action": [ 
         "rds:Describe*", 
         "cloudwatch:Get*", 
         "logs:Get*", 
         "ec2:Describe*"
         "rds:ModifyDBParameterGroup"
         ], 
         "Resource": "*", 
         "Effect": "Allow" 
      } 
   ] 
   }
   ```
   3. Follow the [Automatic Installation guide](/releem-agent/installation-guides/self-managed-servers-automatic-installation)

   4. Add following lines to the /opt/releem/releem.conf:
   Please change aws_region and aws_rds_db settings
   ```
   instance_type="aws/rds"
   aws_region="[AWS_REGION]"
   aws_rds_db="[RDS_INSTANCE_NAME]"
   aws_rds_parameter_group="releem-agent"
   ```
   5. Restart Releem Agent using the following command:
   ```
   systemctl restart releem-agent
   ```

  </TabItem>
  <TabItem value="docker" label="EC2 Docker">
   Use this instruction to install Releem Agent manually on the EC2 instance in Docker container to tune AWS RDS. Releem Agent will automatically collect metrics and recommend configuration.
   
   To move forward just do the following steps:
   1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions). To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

   2. Add IAM role releem-agent-role and apply it to the EC2 instance:
   ```
   { 
   "Version": "2012-10-17", 
   "Statement": [ 
      { 
         "Action": [ 
         "rds:Describe*", 
         "cloudwatch:Get*", 
         "logs:Get*", 
         "ec2:Describe*"
         "rds:ModifyDBParameterGroup"
         ], 
         "Resource": "*", 
         "Effect": "Allow" 
      } 
   ] 
   }
   ```

   3. Run Releem Agent container using the following command:
   ```bash
   docker run -d -ti --name 'releem-agent' \
   -e RELEEM_HOSTNAME="[Hostname]" \
   -e DB_HOST="[DB_HOST]" \
   -e DB_PORT="[DB_PORT]" \
   -e DB_PASSWORD="[RELEEM_MYSQL_PASSWORD]" \
   -e DB_USER="releem" \
   -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
   -e MEMORY_LIMIT=[MEMORY_LIMIT] \
   -e INSTANCE_TYPE="aws/rds" \
   -e AWS_RDS_DB="[RDS_INSTANCE_NAME]" \
   -e AWS_RDS_PARAMETER_GROUP="releem-agent" \
   -e RELEEM_QUERY_OPTIMIZATION=true \
   releem/releem-agent:[version]
   ```

   Parameters:
   - `DB_USER`: MySQL User name to collect MySQL metrics
   - `DB_PASSWORD`: MySQL User password to collect MySQL metrics
   - `RELEEM_API_KEY`: API Key. Get it from Profile page in Releem Customer Portal.
   - `RELEEM_MYSQL_HOST`: Use this variable in case MySQL listens on a different interface or connection is available only through a socket.
   - `AWS_RDS_DB`: RDS instance name.
   - `AWS_REGION`: AWS region name
   - `AWS_RDS_PARAMETER_GROUP`: Parameter Group name which Releem will use to set recommendations for RDS instance. Default name is "releem-agent".
   - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.

   Please use the latest version of Releem Agent. You can find the latest version of Releem Agent by clicking on the [link](https://hub.docker.com/r/releem/releem-agent/tags).

  </TabItem>
</Tabs>


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