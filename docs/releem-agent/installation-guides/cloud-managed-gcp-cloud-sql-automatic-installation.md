---
id: cloud-managed-gcp-cloud-sql-automatic-installation
title: GCP Cloud SQL
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cloud-Managed GCP Cloud SQL Installation

Use this instruction to install Releem Agent in Google Cloud to monitor and tune instance Cloud SQL for MySQL. You can deploy the agent automatically using a script with minimal setup, or run it manually inside Docker on a Compute Engine VM.

Recommended Compute Engine VM instance configuration: 2 vCPU + 4 GB memory + 10 GB balanced persistent disk

The requirements for Cloud SQL instance:
- Full access to the Cloud SQL API and the Stackdriver Monitoring API for the Compute Engine VM instance on which Releem Agent will be running.
- Shared network for Compute Engine VM instance and Cloud SQL instance.
- Performance Schema enabled to collect MySQL performance metrics. Please set the following variable in the database flags and restart the instance:
```ini
performance_schema=1
```

You have the following options to install Releem Agent:

<Tabs>
  <TabItem value="gce" label="Compute Engine">

   Use this instruction to install Releem Agent manually on a Compute Engine VM instance to tune GCP Cloud SQL. Releem Agent will automatically collect metrics and recommend configuration.
   To move forward just do the following steps:
   1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions). To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

   2. Enable Full Api Access to Cloud SQL and Stackdriver Monitoring API for the Compute Engine VM instance on which Releem Agent will be running.

   3. Run installation command as a root user on the server:
      ```ini
      RELEEM_INSTANCE_TYPE="gcp/cloudsql" RELEEM_GCP_PROJECT_ID="[RELEEM_GCP_PROJECT_ID]" RELEEM_GCP_REGION="[RELEEM_GCP_REGION]" RELEEM_GCP_CLOUDSQL_INSTANCE="[RELEEM_GCP_CLOUDSQL_INSTANCE]" RELEEM_MYSQL_PASSWORD='[Password]' RELEEM_MYSQL_LOGIN='releem' RELEEM_MYSQL_MEMORY_LIMIT=0 RELEEM_API_KEY=[Key] RELEEM_CRON_ENABLE=1 RELEEM_QUERY_OPTIMIZATION=true bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)"
      ```
      
      **Parameters:**
      - `RELEEM_GCP_PROJECT_ID` - Google Cloud project id
      - `RELEEM_GCP_REGION` - region of Cloud SQL instance
      - `RELEEM_GCP_CLOUDSQL_INSTANCE` - Cloud SQL instance id or connection name
      - `RELEEM_MYSQL_LOGIN` - MySQL user name to collect MySQL metrics
      - `RELEEM_MYSQL_PASSWORD` - MySQL user password to collect MySQL metrics
      - `RELEEM_MYSQL_MEMORY_LIMIT` - Change parameter in case there are other software installed on the server. Default value is 0 means use all memory.
      - `RELEEM_API_KEY` - API Key. Get it from Profile page in Releem Customer Portal.
      - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.


  </TabItem>
  <TabItem value="gce_docker" label="Compute Engine Docker">
   Use this instruction to install Releem Agent on a Compute Engine VM in a Docker container to tune GCP Cloud SQL. Releem Agent will automatically collect metrics and recommend configuration.
   
   To move forward just do the following steps:
   1. Create read-only user "releem" in MySQL using the [instruction](/releem-agent/mysql-permissions). To enable Automatic SQL Query Optimization please add [Additional Permissions](/releem-agent/mysql-permissions#additional-database-permissions-required).

   2. Enable Full Api Access to Cloud SQL and Stackdriver Monitoring API for the Compute Engine VM instance on which Releem Agent will be running.

   3. Run Releem Agent container using Docker or Docker Compose.

      **Docker**
   
      ```bash
      docker run -d -ti --name 'releem-agent' \
      -e RELEEM_API_KEY="[RELEEM_API_KEY]" \
      -e RELEEM_HOSTNAME="[RELEEM_HOSTNAME]" \
      -e DB_USER="releem" \
      -e DB_PASSWORD="[DB_PASSWORD]" \
      -e INSTANCE_TYPE="gcp/cloudsql" \
      -e RELEEM_GCP_PROJECT_ID="[GCP_PROJECT]" \
      -e RELEEM_GCP_REGION="[RELEEM_GCP_REGION]" \
      -e RELEEM_GCP_CLOUDSQL_INSTANCE="[RELEEM_GCP_CLOUDSQL_INSTANCE]" \
      -e RELEEM_QUERY_OPTIMIZATION=true \
      releem/releem-agent:[version]
      ```
   
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
            INSTANCE_TYPE: "gcp/cloudsql"
            RELEEM_GCP_PROJECT_ID: "[RELEEM_GCP_PROJECT_ID]"
            RELEEM_GCP_REGION: "[RELEEM_GCP_REGION]"
            RELEEM_GCP_CLOUDSQL_INSTANCE: "[RELEEM_GCP_CLOUDSQL_INSTANCE]"
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
            INSTANCE_TYPE: "gcp/cloudsql"
            RELEEM_GCP_PROJECT_ID: "[RELEEM_GCP_PROJECT_ID]"
            RELEEM_GCP_REGION: "[RELEEM_GCP_REGION]"
            RELEEM_GCP_CLOUDSQL_INSTANCE: "[RELEEM_GCP_CLOUDSQL_INSTANCE]"
            RELEEM_QUERY_OPTIMIZATION: true
      ```
   
      ***Parameters:***
      - `RELEEM_API_KEY`: API Key. Get it from Profile page in Releem Customer Portal.   
      - `RELEEM_HOSTNAME` - Server hostname, which should display in the Releem Dashboard.
      - `DB_USER`: MySQL User name to collect MySQL metrics
      - `DB_PASSWORD`: MySQL User password to collect MySQL metrics
      - `RELEEM_GCP_PROJECT_ID`: Google Cloud project id
      - `RELEEM_GCP_REGION`: region of Cloud SQL instance    
      - `RELEEM_GCP_CLOUDSQL_INSTANCE`: Cloud SQL instance id or connection name
      - `RELEEM_QUERY_OPTIMIZATION` - set 'true' if Releem Agent should collect additional information for Automatic SQL Query Optimization.
   
      Please use the latest version of Releem Agent. You can find the latest version of Releem Agent by clicking on the [link](https://hub.docker.com/r/releem/releem-agent/tags).

  </TabItem>
</Tabs>


## Common Issues for GCP Cloud SQL

To check Releem Agent logs please open Cloud Logging and view logs for the Cloud Run service or the VM where the Agent is running.

1. No Latency graph on Releem Dashboard
   - Enable Performance Schema for your Cloud SQL instance and ensure the Agent connects successfully.

2. Error 1045 (28000): Access denied for user 'releem'@'' (using password: YES)
   - Check password for Releem User that you created according to this [guide](/releem-agent/mysql-permissions). And reinstall Releem Agent.
   - To set new password please run in MySQL console the following command:
     ```
     ALTER USER 'releem'@'%' IDENTIFIED BY 'New-Password-Here';
     ```

3. Connect: connection timed out
   - If using private IP, ensure VPC/firewall rules allow egress from the Agent to the Cloud SQL private address. If using the Cloud SQL connector, ensure `roles/cloudsql.client` is granted and the connector is configured.


