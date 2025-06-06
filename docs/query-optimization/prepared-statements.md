---
id: "prepared-statements-issue"
title: "How to Fix Prepared Statements Issue"
---

# Prepared Statements and Query Analytics

Prepared statements in MySQL are a feature that allows you to execute the same SQL statement repeatedly. They work by preparing the SQL statement once on the server, and then executing it multiple times with different parameters.

## The Problem

When using prepared statements in MySQL/MariaDB, you might notice that not all queries appear in your query analytics. This happens because MySQL/MariaDB doesn't add prepared statemetns in query analytics, which leads to several issues:

1. **Incomplete Query Analytics**: You can't see the actual queries were executed on the server and query examples
3. **Missing Query Optimization Suggestions**: Without seeing the actual queries, optimization tools can't provide accurate recommendations
4. **Inaccurate Latency Measurements**: Query performance metrics might not reflect the real-world usage patterns


This limitation affects your ability to:
- Identify slow queries
- Understand query patterns
- Get accurate optimization suggestions
- Monitor query performance effectively

## Current Status

We are in contact with the MariaDB development team regarding this limitation. You can follow the discussion in the [MariaDB developers mailing list](https://lists.mariadb.org/hyperkitty/list/developers@lists.mariadb.org/thread/3OP65GIDEOKZHQYN55ZGCNIPZDKOXU3V/).

## Solutions

Another solution to address the issue of incomplete query analytics is to use client-side prepared statements. This approach involves preparing the SQL statements on the client side rather than on the server. By doing so, you can ensure that the actual SQL queries are logged and analyzed effectively.

This allows you to see all SQL queries executed by your application, providing better insights for analysis and optimization, and improve overall database performance.

### For PHP Applications

If you're using PHP, you can enable emulated Prepared Statements using PDO::ATTR_EMULATE_PREPARES during database connection.

### For Java Applications

For Java applications using MySQL JDBC, you can enable client-side prepared statements by configuring the JDBC URL with the `cachePrepStmts` and `useServerPrepStmts` parameters. This approach allows you to cache prepared statements on the client side, ensuring that the actual SQL queries are logged and analyzed effectively.

Related links: 
- https://vladmihalcea.com/mysql-jdbc-statement-caching/