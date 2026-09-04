---
id: overview
slug: /dashboard
title: Dashboard
---

# Dashboard

Use the Dashboard to review what Releem currently observes about your database server. Dashboard metrics and checks describe observed state; they do not apply a change. Open Recommendations separately to review actions proposed from those observations.

<img src={require('../../assets/images/releem_dashboard.png').default} alt="Releem Dashboard" className="shadow-img" />

Start with the Releem Score and data freshness. Then open the block that matches your task: Query Analytics, Schema Checks, Deadlocks, Health Checks, Security Checks, Process List, or [Reports](/dashboard/reports). The sections below explain each Dashboard area.

## 1. [Releem Score](https://releem.com/docs/releem-score)
The Releem Score block displays the server's status and Releem Score, representing the best practices (health checks) for maintaining servers. The score provides a quick overview of your server's health, allowing you to assess its performance at a glance.

## 2. [Configuration Tuning](/recommendations)
The **Recommended Configuration** block summarizes proposed configuration changes. Follow its link to review the proposal and the applicable procedure before you make a change. The Releem MySQL tuning process uses a systematic approach to prepare configuration recommendations.

## 3. Performance Monitoring
The Performance Metrics block displays key instance metrics, such as CPU usage, Memory Usage, Swap usage, and IOPS. Monitoring these metrics helps you keep a close eye on your server's performance. Clicking on a metric displays a daily graph, offering a visual representation of the metric's performance over time. 

The MySQL Metrics consists of several charts, including:
- Latency: This graph shows the P95 MySQL Latency, indicating the query execution time.
- QPS (Queries Per Second): A measure of the number of queries processed per second.
- Slow Log Queries: This graph displays the number of slow queries, helping you identify performance bottlenecks.

## 4. Query Optimization and Schema Checks
- [Query Analytics](/dashboard/query-analytics) tab provides insights into your database's performance by analyzing top and slow queries, including execution statistics, to help identify and resolve bottlenecks.
- [Query Optimization](/recommendations/query-optimization) tab offers automatic recommendations, such as index suggestions and query enhancements, to improve efficiency and reduce resource usage.
- [Schema Checks](/dashboard/schema-checks) tab ensures your database structure remains optimized through automated reviews that detect inefficiencies and suggest actionable improvements.

## 5. Processes & Locks
- [Deadlock Monitoring](/dashboard/deadlocks) continuously monitors your MySQL database for deadlocks, providing instant notifications with complete transaction details to help you quickly identify and resolve locking conflicts.
- [Process List](/dashboard/process-list) offers real-time visibility into all active MySQL connections and running queries, allowing you to identify long-running queries, detect stuck processes, and troubleshoot bottlenecks directly from your dashboard.

## 6. [Health Checks](/dashboard/health-checks)
MySQL Health Checks are diagnostic tests that evaluate a server's health, performance, and stability. Regular MySQL Health Checks are essential for ensuring optimal server operation and meeting business requirements. Releem performs health checks twice a day, providing users with up-to-date insights into their database's current state.

## 7. [Security Checks](/dashboard/security-checks)
Releem's Security Checks continuously monitor your MySQL database for security vulnerabilities and misconfigurations. This feature detects critical issues such as weak authentication, excessive privileges, anonymous users, remote root access, and insecure configurations, helping you maintain a secure database environment and comply with security best practices.
