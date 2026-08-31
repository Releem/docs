---
id: cloud-managed-aws-rds-automatic-installation
title: RDS
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cloud-Managed AWS RDS and Aurora MySQL Automatic Installation

Use this instruction to install Releem Agent automatically via CloudFormation to AWS Fargate, or manually on an EC2 instance. Releem Agent will run in a container on AWS Fargate or directly on the EC2 instance, depending on your choice.

Releem supports Amazon RDS MySQL, Amazon RDS MariaDB, and Amazon Aurora MySQL. Configure one Agent for each DB instance endpoint.

## Parameter groups

To apply recommended configuration automatically, sign in to your AWS account and prepare custom parameter groups. AWS-managed default groups cannot be modified and are not valid onboarding targets.

**Amazon RDS MySQL or MariaDB (non-Aurora):**
- Create a custom DB parameter group for your database version, for example `releem-agent`.
- Attach it to the instance as **DB parameter group**.
- Leave the cluster parameter group empty.
- Reboot the instance if AWS requires it.

**Amazon Aurora MySQL:**
- Create a custom DB parameter group for the instance and a custom DB cluster parameter group for the cluster.
- Attach both groups in AWS. The names you configure for Releem must match the groups attached in AWS.
- Both groups must be ready before the Agent applies recommendations. A recommendation can target either group.
- Only the Agent that targets the writer modifies cluster parameters. That Agent needs `rds:ModifyDBClusterParameterGroup` permission.

The requirements for the RDS or Aurora instance:
- Enhanced Monitoring to collect system performance metrics.
- Performance Insights to collect MySQL performance metrics.
- Performance Schema to collect MySQL performance metrics. Change the following variables in the custom parameter group and reboot the database instance if required:

   ```ini
   performance_schema=ON
   slow_query_log=ON
   ```

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
   - rds:ModifyDBClusterParameterGroup

   To move forward just do the following steps:
   1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions). To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

   2. Open the [CloudFormation Quick Create page](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateUrl=https://releem.s3.amazonaws.com/v2/releem-agent-cloudformation.yml&stackName=releem-agent) in your browser, check that the correct region is selected, and fill in the following fields:
      - Image: Releem Agent Docker image in the `releem/releem-agent:[version]` format. Use the latest version available on [Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags).
      - APIKey: Releem API Key from the [Profile page](https://app.releem.com/profile?menu=profile) in the Releem Customer Portal.
      - DBID: RDS DB Instance ID. For Aurora, set the instance name you want to monitor, not the cluster endpoint. Deploy one stack per instance.
      - DatabaseType: leave `mysql` (default) for RDS MySQL, MariaDB, and Aurora MySQL.
      - DBUser: User to collect metrics from the SQL server, that we added in the step 1.
      - DBPassword: Password for user
      - DBSSLMode: set `true` when the instance requires SSL.
      - SecurityGroupIDs: Releem Agent SecurityGroups to connect to RDS. Please Allow All Outbound traffic for Releem Agent Security Group.
      - SubnetIDs: Releem Agent container should be able to connect to RDS.
      - QueryOptimization: set True if Releem Agent should collect additional information for Automatic SQL Query Optimization.
      - DBParameterGroup: Custom DB parameter group attached to the instance. Required for RDS and Aurora instance parameters.
      - DBClusterParameterGroup: Custom DB cluster parameter group attached to Aurora. Required for Aurora. Leave empty only for non-Aurora RDS.

   `DatabaseType` defaults to `mysql` and exposes MySQL (`DB_*`) credentials to the container. Select `postgresql` only for Aurora PostgreSQL; see [PostgreSQL RDS](/releem-agent/installation-guides/postgresql-aws-rds).

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
            "ec2:Describe*",
            "rds:ModifyDBParameterGroup",
            "rds:ModifyDBClusterParameterGroup"
            ], 
            "Resource": "*", 
            "Effect": "Allow" 
         } 
      ] 
      }
      ```

   3. Run Installation command as a root user on the server.

      **Amazon RDS MySQL or MariaDB:**

      ```bash
      RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AwsRegion]" RELEEM_AWS_RDS_DB="[AwsRdsDBidentifier]" RELEEM_AWS_RDS_PARAMETER_GROUP="releem-agent" RELEEM_MYSQL_PASSWORD='[Password]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
      ```

      **Amazon Aurora MySQL:** add `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` with the custom cluster parameter group name. Set `RELEEM_AWS_RDS_DB` to the instance identifier, not the cluster endpoint. Repeat the installation for each instance you want to monitor. Only the writer Agent applies cluster parameter recommendations.

      ```bash
      RELEEM_INSTANCE_TYPE="aws/rds" RELEEM_AWS_REGION="[AwsRegion]" RELEEM_AWS_RDS_DB="[AwsRdsDBidentifier]" RELEEM_AWS_RDS_PARAMETER_GROUP="releem-agent" RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP="releem-agent-cluster" RELEEM_MYSQL_PASSWORD='[Password]' RELEEM_MYSQL_LOGIN='releem' RELEEM_DB_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
      ```
      
      **Parameters:**
      - `RELEEM_AWS_REGION` - AWS region name
      - `RELEEM_AWS_RDS_DB` - RDS or Aurora instance identifier.
      - `RELEEM_AWS_RDS_PARAMETER_GROUP` - Custom DB parameter group name. Required.
      - `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP` - Custom DB cluster parameter group name. Required for Aurora. Omit for non-Aurora RDS.
      - `RELEEM_MYSQL_LOGIN` - MySQL User name to collect MySQL metrics
      - `RELEEM_MYSQL_PASSWORD` - MySQL User password to collect MySQL metrics
      - `RELEEM_DB_MEMORY_LIMIT` - Change parameter in case there are other software installed on the server. Default value is 0 means use all memory.
      - `RELEEM_API_KEY` - API Key. Get it from Profile page in Releem Customer Portal.
      - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.


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
            "ec2:Describe*",
            "rds:ModifyDBParameterGroup",
            "rds:ModifyDBClusterParameterGroup"
            ], 
            "Resource": "*", 
            "Effect": "Allow" 
         } 
      ] 
      }
      ```

   3. Run Releem Agent container using Docker or Docker Compose.

      **Docker**
   
      ```bash
      docker run -d -ti --name 'releem-agent' \
      -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
      -e RELEEM_HOSTNAME="[RELEEM_HOSTNAME]" \
      -e DB_USER="releem" \
      -e DB_PASSWORD="[DB_PASSWORD]" \
      -e INSTANCE_TYPE="aws/rds" \
      -e AWS_REGION="[AWS_REGION]" \
      -e AWS_RDS_DB="[AWS_RDS_DB]" \
      -e AWS_RDS_PARAMETER_GROUP="releem-agent" \
      -e RELEEM_QUERY_OPTIMIZATION=true \
      releem/releem-agent:[version]
      ```

      For Aurora MySQL, add `-e AWS_RDS_CLUSTER_PARAMETER_GROUP="releem-agent-cluster"` (or `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP`). Run one container per instance. Only the writer container applies cluster parameter recommendations.
   
      **Docker Compose**
   
      ```yaml
      version: '3.7'
   
      x-common-service: &common-service
        image: releem/releem-agent:[version]
        restart: unless-stopped
   
      services:
        releem-agent-1:
          <<: *common-service
          container_name: releem-agent-1
          environment:
            RELEEM_API_KEY: "[RELEEM_API_KEY]"
            RELEEM_HOSTNAME: "[RELEEM_HOSTNAME]"
            DB_USER: "releem"
            DB_PASSWORD: "[DB_PASSWORD]"
            INSTANCE_TYPE: "aws/rds"
            AWS_REGION: "[AWS_REGION]"
            AWS_RDS_DB: "[AWS_RDS_DB]"
            AWS_RDS_PARAMETER_GROUP: "releem-agent"
            AWS_RDS_CLUSTER_PARAMETER_GROUP: "releem-agent-cluster"
            RELEEM_QUERY_OPTIMIZATION: true
   
        # You can duplicate docker compose services to launch multiple agents by changing the name, container_name, and environment.
        releem-agent-2:
          <<: *common-service
          container_name: releem-agent-2
          environment:
            RELEEM_API_KEY: "[RELEEM_API_KEY]"
            RELEEM_HOSTNAME: "[RELEEM_HOSTNAME]"
            DB_USER: "releem"
            DB_PASSWORD: "[DB_PASSWORD]"
            INSTANCE_TYPE: "aws/rds"
            AWS_REGION: "[AWS_REGION]"
            AWS_RDS_DB: "[AWS_RDS_DB_READER]"
            AWS_RDS_PARAMETER_GROUP: "releem-agent"
            AWS_RDS_CLUSTER_PARAMETER_GROUP: "releem-agent-cluster"
            RELEEM_QUERY_OPTIMIZATION: true
      ```

      Leave `AWS_RDS_CLUSTER_PARAMETER_GROUP` empty or omit it for non-Aurora RDS.
   
      ***Parameters:***
      - `RELEEM_API_KEY`: API Key. Get it from Profile page in Releem Customer Portal.   
      - `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
      - `DB_USER`: MySQL User name to collect MySQL metrics
      - `DB_PASSWORD`: MySQL User password to collect MySQL metrics
      - `AWS_REGION`: AWS region name
      - `AWS_RDS_DB`: RDS or Aurora instance identifier.
      - `AWS_RDS_PARAMETER_GROUP`: Custom DB parameter group name. Required.
      - `AWS_RDS_CLUSTER_PARAMETER_GROUP` / `RELEEM_AWS_RDS_CLUSTER_PARAMETER_GROUP`: Custom DB cluster parameter group name. Required for Aurora.
      - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.
   
      Please use the latest version of Releem Agent. You can find the latest version of Releem Agent by clicking on the [link](https://hub.docker.com/r/releem/releem-agent/tags).

  </TabItem>
</Tabs>


## Common Issues for AWS RDS {#common-issues-for-aws-rds}

To check Releem Agent logs please open CloudWatch -> Log Groups and then select Releem Agent log group.

1. Failed to read log stream %s:%s: %s RDSOSMetrics
   - Enable Enhanced monitoring for your RDS instance.

2. No Latency graph on Releem Dashboard
   - Enable Performance Insights and Performance Schema for your RDS instance.

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

7. Performance_schema_ variables aren't being applied on AWS RDS
   - Amazon RDS only applies performance_schema_* variables when performance_schema is explicitly set to 1 in the Parameter Group. By default, it's set to 0, even though Performance Insights enables it automatically at the database level.
   - Solution: Set performance_schema from 0 to 1 in your Parameter Group, save the changes, and reboot your RDS instance.

8. Aurora apply fails because the cluster parameter group is missing or does not match
   - Create a custom DB cluster parameter group, attach it to the cluster, and set `DBClusterParameterGroup` / `AWS_RDS_CLUSTER_PARAMETER_GROUP` to that exact name.
   - AWS-managed default groups cannot be modified.

9. Cluster parameters are not applied on a reader
   - Only the Agent targeting the writer modifies cluster parameters. Keep an Agent on the writer instance.
