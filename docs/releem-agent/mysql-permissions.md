---
id: "mysql-permissions"
title: "MySQL Permissions for Releem Agent"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MySQL Permissions for Releem Agent

Create read-only database user "releem" which Releem Agent will use to collect database metrics. Select your environment and database version, copy SQL statements and run in the MySQL console.

<Tabs>
  <TabItem value="linux" label="Linux" default>
    <Tabs>
      <TabItem value="mysql-8" label="MySQL >= 8.0" default>
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO 'releem'@'%';
        ```
      </TabItem>
      <TabItem value="mariadb-mysql-5" label="MariaDB and MySQL < 8.0">
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        GRANT SUPER ON *.* TO 'releem'@'%';
        ```
      </TabItem>
    </Tabs>


    ## Additional Database Permissions Required

    To enable enable Automatic SQL Query Optimization please add Additional Permissions.

    The SQL Query Optimization feature requires additional permissions for the Releem Agent user. These permissions will be granted during the automatic installation process.
    To grant these privileges, run the following query in the MySQL console:
    ```sql
      SELECT Concat("GRANT SELECT ON *.* TO `",User,"`@`", Host,"`;") FROM mysql.user WHERE User='releem';
    ```
    Then execute the resulting GRANT statements in the MySQL console. For example:
    ```sql
      GRANT SELECT ON *.* TO `releem`@`%`;
    ```    

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">
    <Tabs>
      <TabItem value="mysql-8" label="MySQL >= 8.0" default>
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        ```
      </TabItem>
      <TabItem value="mariadb-mysql-5" label="MariaDB and MySQL < 8.0">
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        ```
      </TabItem>
    </Tabs>

    ## Additional Database Permissions Required

    To enable enable Automatic SQL Query Optimization please add Additional Permissions.

    The SQL Query Optimization feature requires additional permissions for the Releem Agent user.
    To grant these privileges, run the following query in the MySQL console:
    ```sql
    GRANT SELECT ON *.* TO releem@'%'
    ```

    With AWS RDS, performance schema consumers can't be enabled permanently in a configuration. Create the following procedure to give the Agent the ability to enable performance_schema.events_* consumers at runtime:
    ```sql
    CREATE SCHEMA IF NOT EXISTS releem;
    DELIMITER $$
    CREATE PROCEDURE releem.enable_events_statements_consumers()
        SQL SECURITY DEFINER
    BEGIN
        UPDATE performance_schema.setup_consumers SET enabled='YES' WHERE name LIKE 'events_statements_%';
    END $$
    DELIMITER ;
    GRANT EXECUTE ON PROCEDURE releem.enable_events_statements_consumers TO releem@'%';
    ```

  </TabItem>

  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL">
    <Tabs>
      <TabItem value="mysql-8" label="MySQL >= 8.0" default>
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        ```
      </TabItem>
      <TabItem value="mariadb-mysql-5" label="MariaDB and MySQL < 8.0">
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        ```
      </TabItem>
    </Tabs>

    ## Additional Database Permissions Required

    To enable enable Automatic SQL Query Optimization please add Additional Permissions.

    The SQL Query Optimization feature requires additional permissions for the Releem Agent user.
    To grant these privileges, run the following query in the MySQL console:
    ```sql
    GRANT SELECT ON *.* TO releem@'%'
    ```

  </TabItem>

  <TabItem value="docker" label="Docker">
    <Tabs>
      <TabItem value="mysql-8" label="MySQL >= 8.0" default>
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO 'releem'@'%';
        ```
      </TabItem>
      <TabItem value="mariadb-mysql-5" label="MariaDB and MySQL < 8.0">
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        GRANT SUPER ON *.* TO 'releem'@'%';
        ```
      </TabItem>
    </Tabs>


      ## Additional Database Permissions Required

      To enable enable Automatic SQL Query Optimization please add Additional Permissions.

      The SQL Query Optimization feature requires additional permissions for the Releem Agent user. 
      To grant these privileges, run the following query in the MySQL console:
      ```sql
      SELECT Concat("GRANT SELECT ON *.* TO `",User,"`@`", Host,"`;") FROM mysql.user WHERE User='releem';
      ```
      Then execute the resulting GRANT statements in the MySQL console. For example:
      ```sql
        GRANT SELECT ON *.* TO `releem`@`%`;
      ```         

  </TabItem>
  <TabItem value="windows" label="Windows" default>
    <Tabs>
      <TabItem value="mysql-8" label="MySQL >= 8.0" default>
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO 'releem'@'%';
        ```
      </TabItem>
      <TabItem value="mariadb-mysql-5" label="MariaDB and MySQL < 8.0">
        Change [Password] to your secret password
        ```SQL
        CREATE USER 'releem'@'%' identified by '[Password]';
        GRANT PROCESS, REPLICATION CLIENT, SHOW VIEW ON *.* TO 'releem'@'%';
        GRANT SELECT ON performance_schema.events_statements_summary_by_digest TO 'releem'@'%';
        GRANT SELECT ON performance_schema.table_io_waits_summary_by_index_usage TO 'releem'@'%';
        GRANT SELECT ON performance_schema.file_summary_by_instance TO 'releem'@'%';
        GRANT SUPER ON *.* TO 'releem'@'%';
        ```
      </TabItem>
    </Tabs>      


    ## Additional Database Permissions Required

    To enable enable Automatic SQL Query Optimization please add Additional Permissions.

    The SQL Query Optimization feature requires additional permissions for the Releem Agent user. 
    To grant these privileges, run the following query in the MySQL console:
    ```sql
    SELECT Concat("GRANT SELECT ON *.* TO `",User,"`@`", Host,"`;") FROM mysql.user WHERE User='releem';
    ```
    Then execute the resulting GRANT statements in the MySQL console. For example:
    ```sql
      GRANT SELECT ON *.* TO `releem`@`%`;
    ```    
  </TabItem>
</Tabs>
