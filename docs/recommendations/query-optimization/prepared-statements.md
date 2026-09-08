---
id: prepared-statements
slug: /recommendations/query-optimization/prepared-statements
title: "How to Fix Prepared Statements Issue"
---

# Prepared Statements and Query Analytics

Prepared statements in MySQL are a feature that allows you to execute the same SQL statement repeatedly. They work by preparing the SQL statement once on the server and then executing it multiple times with different parameters.

## Documented limitation

When your application uses prepared statements with MySQL/MariaDB, you might notice that not all queries appear in Query Analytics. This occurs because MySQL/MariaDB doesn't include prepared statements in query analytics, leading to several issues:

1. **Incomplete Query Analytics**: You can't see the actual queries executed on the server and query examples.
2. **Missing Query Optimization Suggestions**: Without seeing the actual queries, optimization tools can't provide accurate recommendations.
3. **Inaccurate Latency Measurements**: Query performance metrics might not reflect real-world usage patterns.

This limitation affects your ability to:
- Identify slow queries
- Understand query patterns
- Get accurate optimization suggestions
- Monitor query performance effectively

## Current Status

We are in contact with the MariaDB development team regarding this limitation. You can follow the discussion in the [MariaDB developers mailing list](https://lists.mariadb.org/hyperkitty/list/developers@lists.mariadb.org/thread/3OP65GIDEOKZHQYN55ZGCNIPZDKOXU3V/).

## Client-side workarounds

The following workarounds use client-side prepared statements to address incomplete query analytics. This approach prepares SQL statements on the client side rather than on the server so the actual SQL queries can be logged and analyzed.

Test any client-setting change in a non-production environment first. Record the previous setting so you can restore it if Query Analytics does not show the expected queries or application behavior changes.

### For PHP applications

If you're using PHP, you can enable emulated prepared statements using PDO::ATTR_EMULATE_PREPARES during the database connection.

#### For Laravel
After making changes to the files in the **config/** directory, you need to run the following command in the application directory to update the configuration cache:
```
php artisan config:cache
```
### For Java applications

For Java applications using MySQL JDBC, you can enable client-side prepared statements by configuring the JDBC URL with the `cachePrepStmts` and `useServerPrepStmts` parameters. This approach allows you to cache prepared statements on the client side so the actual SQL queries can be logged and analyzed.

Related links: 
- https://vladmihalcea.com/mysql-jdbc-statement-caching/
