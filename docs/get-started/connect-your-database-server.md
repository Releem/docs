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
- [MySQL on Linux Server: Automatic Agent Installation (Linux)](/installation/linux?database=mysql#mysql-automatic-installation) – Automatic installation for MySQL instances running on Linux-based servers.
- [MySQL on Linux Server: Advanced Agent Installation](/installation/linux?database=mysql#mysql-manual-installation) – Manual installation for MySQL instances running on Linux-based servers. Use this guide if you don't have a MySQL root user, or if MySQL is installed on a different IP address, or if you want to create a Releem user manually.
- [MariaDB on Linux Server: Automatic Agent Installation](/installation/linux?database=mariadb#mariadb-automatic-installation) – Automatic installation for MariaDB instances running on Linux-based servers.
- [MariaDB on Linux Server: Manual Agent Installation](/installation/linux?database=mariadb#mariadb-manual-installation) – Manual installation for MariaDB instances when a DBA creates the monitoring account.
- [PostgreSQL on Linux Server: Automatic Agent Installation](/installation/linux?database=postgresql#postgresql-automatic-installation) – Automatic database-user creation for PostgreSQL instances running on Linux-based servers.
- [PostgreSQL on Linux Server: Manual Agent Installation](/installation/linux?database=postgresql#postgresql-manual-installation) – Manual installation for PostgreSQL instances running on Linux-based servers.
- [WHM/cPanel](/installation/installation-methods/whm-cpanel) – Recommended installation path for database servers managed through WHM/cPanel.
- [MySQL on Linux Server: Manual Installation in Docker](/installation/installation-methods/docker) – Manual installation for MySQL instances running in Docker containers.
- [Self-Managed Server (Windows)](/installation/installation-methods/windows) – For MySQL instances running on Windows.
- [MySQL on AWS RDS: CloudFormation installation](/installation/installation-methods/aws-rds) – For managed MySQL databases hosted on AWS.
- [MySQL on GCP Cloud SQL: Manual installation](/installation/installation-methods/gcp-cloud-sql) – For managed MySQL databases hosted on GCP.
- [Azure Database for MySQL](/installation/installation-methods/azure-database-for-mysql) – For managed MySQL databases hosted on Azure.
- [MySQL in Kubernetes](/installation/installation-methods/kubernetes) – If your MySQL instance is deployed in a Kubernetes cluster.


Select the option that matches your setup to get the correct installation instructions.

## Verify the connection and current data

After installation, verify each stage separately:

- **Agent Status: Connected** confirms that the Releem Agent has connected to the platform.
- A current data timestamp or recently updated metrics confirms that current database data has arrived.

If the Agent is disconnected or current data does not appear, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). If you still need help, open chat in the [Releem Dashboard](https://app.releem.com). After verification, open the [Dashboard](/dashboard) to review observed state and [Recommendations](/recommendations) to review proposed actions.
