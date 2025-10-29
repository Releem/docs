---
id: query-optimization
title: SQL Query Optimization
---

# SQL Query Optimization

Releem's Query Optimization feature automatically identifies resource-intensive queries and provides actionable recommendations to improve their performance. Whether queries run slowly or execute frequently, Releem analyzes them and suggests specific enhancements to reduce execution time and server load.

<img src={require('../../assets/images/releem-query-optimization.png').default} alt="Releem Query Optimization" className="shadow-img" />

## How Automatic Query Optimization Works

Releem continuosly analyzes your database queries to automatically identify optimization opportunities. The system examines your **top 100 queries** and **top 100 slowest queries** detecting those that would benefit from performance improvements.

When inefficient queries are detected, Releem:
- Automatically flags them with a **"New"** status in the Query Optimization tab
- Sends you an **email** summarizing the inefficient queries
- Provides **actionable recommendations** ready to implement
- Continues monitoring even when you're not actively logged into the dashboard

This automatic detection ensures you stay informed about query performance issues without constant manual monitoring.

### Review Recommendations
Navigate to the **Query Optimization tab** to examine tailored recommendations for each flagged query. Each recommendation includes:
- The specific query causing performance issues
- Detailed explanation of why it's inefficient
- Ready-to-use `CREATE INDEX` statements and other recommendations

<img src={require('../../assets/images/releem-query-optimization-details.png').default} alt="Releem Query Optimization Details" className="shadow-img" />

### Implementation
Copy the provided `CREATE INDEX` statements and execute them on your database server. All recommendations are provided in copy-and-paste format for easy implementation.

Example:
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_date_status ON orders(order_date, status);
```

### Monitoring Results
After implementing recommendations, Releem tracks the performance improvements and changes query status to **Optimized**, and sends follow-up reports detailing the results. You can verify:
- Reduced query execution times
- Lower server load

## Manual Query Optimization

Beyond automatic weekly analysis, you can manually request optimization suggestions at any time:

1. Navigate to the **Query Analytics tab** on your dashboard
2. Find the query you want to optimize
3. Click the **Get Recommendations** button. Disabled **Get Recommendations** button means there are no recommendations yet. 
4. Review the optimization suggestions provided

This is useful when you're actively developing new features or troubleshooting specific queries.