---
id: connect-your-database-server
slug: /get-started/connect-your-database-server
title: Add Server
---

# Connect Your Database Server

Install the Releem Agent to connect your database server. Choose the exact database and deployment path below instead of copying installation commands from this overview.

1. [Register for an account](/get-started/register-for-an-account) if you do not already have one.
2. Sign in to the Releem Dashboard.
3. Select **Add Server**.
4. Choose the database and deployment that match your server.
5. Follow the linked installation guide.

The **Add Server** workflow provides the settings required by the selected installation method.

<img src={require('../../assets/images/dashboard-add-server.png').default} alt="Releem Add Server popup" className="shadow-img" />

Choose the type of database server you are adding:
- [MySQL on Linux: Automatic installation](/installation/mysql/linux#automatic-installation) – Create the database user during installation.
- [MySQL on Linux: Manual installation](/installation/mysql/linux#manual-installation) – Use an existing monitoring account.
- [MariaDB on Linux: Automatic installation](/installation/mariadb/linux#automatic-installation) – Create the database user during installation.
- [MariaDB on Linux: Manual installation](/installation/mariadb/linux#manual-installation) – Use an existing monitoring account.
- [PostgreSQL on Linux: Automatic installation](/installation/postgresql/linux#automatic-installation) – Create the database user during installation.
- [PostgreSQL on Linux: Manual installation](/installation/postgresql/linux#manual-installation) – Use an existing monitoring account.
- [MySQL on WHM/cPanel](/installation/mysql/whm-cpanel) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MySQL in Docker](/installation/mysql/docker) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MariaDB in Docker](/installation/mariadb/docker) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MySQL on Windows](/installation/mysql/windows) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MariaDB on Windows](/installation/mariadb/windows) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MySQL on AWS RDS](/installation/mysql/aws-rds) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MySQL on GCP Cloud SQL](/installation/mysql/gcp-cloud-sql) – **Procedure unavailable.** The page explains how to request the current procedure.
- [Azure Database for MySQL](/installation/mysql/azure-database-for-mysql) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MariaDB in Kubernetes](/installation/mariadb/kubernetes) – **Procedure unavailable.** The page explains how to request the current procedure.
- [MySQL clusters](/installation/mysql/clusters) or [MariaDB clusters](/installation/mariadb/clusters) – Install one Agent for each database node.


Select the option that matches your setup to get the correct installation instructions.

## Verify the connection and current data

After installation, verify each stage separately:

- **Agent Status: Connected** confirms that the Releem Agent has connected to the platform.
- A current data timestamp or recently updated metrics confirms that current database data has arrived.

If the Agent is disconnected or current data does not appear, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). If you still need help, open chat in the [Releem Dashboard](https://app.releem.com). After verification, open the [Dashboard](/dashboard) to review observed state and [Recommendations](/recommendations) to review proposed actions.
