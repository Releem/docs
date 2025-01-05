---
id: "enable-sql-query-optimization"
title: "Enable SQL Query Optimization"
---

# Enable SQL Query Optimization

To enable SQL Query Optimization feature please select you installation and use the following instructions.

When the feature will be enabled you'll see the first automatic SQL Query Recommendation in a one week.  

## Instructions to enable feature for Releem Agent  
### For self-managed servers  
#### Automatic installation  
Note: If your server is already installed, you can use automatic installation, as it won't add a new server if it has the same hostname.  
1. Click "Add Server" link at Releem Customer Portal  
2. Select the installation type  
3. Modify the one-step installation command and the following environment variable:  
   RELEEM_QUERY_OPTIMIZATION=true  
4. Run the modified installation command on your server  

If the server is already added, you can copy the following command, change MySQL root password and run it  
RELEEM_MYSQL_ROOT_PASSWORD='password' /bin/bash -c "$(curl -L https://releem.s3.amazonaws.com/v2/install.sh)" enable_query_optimization  

#### Manual installation  
If your server is already installed please do the following steps:  
1. Grant additional permissions to releem user. See section below Additional Permission Required  
2. Add query_optimization=true setting to the /opt/releem/releem.conf  
3. Restart Releem Agent using the following command: 
```bash
systemctl restart releem-agent  
```

4. Run the following command: 
```bash
/opt/releem/mysqlconfigurer.sh -p  
```

### For AWS RDS  
1. Update already installed Releem Agent  
2. Select CloudFormation Stack - releem-agent, click button Update  
3. Select “Replace existing template”  
4. Paste in “Amazon S3 URL” url https://releem.s3.amazonaws.com/test/releem-agent-cloudformation.yml and click “Next”  
5. Change option “QueryOptimization” to true and click “Next”  
6. Click “Next” and “Submit”  

### For DOCKER  
1. Grant additional permissions to releem user. See section below Additional Permission Required  
2. Re-install Releem Agent with RELEEM_QUERY_OPTIMIZATION=true environment variable enabled.  
 
Be sure that the RELEEM_HOSTNAME variable should be the same as currently added server.  
If you don't configure automatic applying of configuration then please add the following MySQL variables to the configuration:  

```ini
performance-schema-consumer-events-statements-history = ON  
performance-schema-consumer-events-statements-current = ON  
performance_schema_events_statements_history_size = 500  
```

## Additional Database Permissions Required  
The SQL Query Optimization feature requires additional permissions for the Releem Agent user. These permissions will be granted during the automatic installation process. The following SQL command will be executed: 
```sql
GRANT SELECT ON *.* TO releem@'%'  
```

### FOR AWS RDS  
With AWS RDS, performance schema consumers can’t be enabled permanently in a configuration. Create the following procedure to give the Agent the ability to enable performance_schema.events_* consumers at runtime:
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

## Data Collection and Analysis  
Once the SQL Query Optimization feature is enabled, Releem will automatically collect and save the EXPLAIN outputs of the top 100 queries and the top 100 slowest queries. This data helps in analyzing the execution plan of queries and optimizing them further.  

An example of the EXPLAIN output collected by Releem is provided below:  
```json
{  
  "query_block": {  
    "select_id": 1,  
    "cost_info": {  
      "query_cost": "0.60"  
    },  
    "table": {  
      "table_name": "sale_internals_order_discount",  
      "access_type": "ref",  
      "possible_keys": [  
        "IX_SALE_ORDER_DSC_HASH"  
      ],  
      "key": "IX_SALE_ORDER_DSC_HASH",  
      "used_key_parts": [  
        "DISCOUNT_HASH"  
      ],  
      "key_length": "98",  
      "ref": [  
        "const"  
      ],  
      "rows_examined_per_scan": 1,  
      "rows_produced_per_join": 1,  
      "filtered": "100.00",  
      "cost_info": {  
        "read_cost": "0.50",  
        "eval_cost": "0.10",  
        "prefix_cost": "0.60",  
        "data_read_per_join": "1K"  
      },  
      "used_columns": [  
        "ID",  
        "MODULE_ID",  
        "DISCOUNT_ID",  
        "NAME",  
        "DISCOUNT_HASH",  
        "CONDITIONS",  
        "UNPACK",  
        "ACTIONS",  
        "APPLICATION",  
        "USE_COUPONS",  
        "SORT",  
        "PRIORITY",  
        "LAST_DISCOUNT",  
        "ACTIONS_DESCR"  
      ]  
    }  
  }  
}  
```