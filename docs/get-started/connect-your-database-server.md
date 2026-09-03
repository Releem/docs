---
id: connect-your-database-server
slug: /get-started/connect-your-database-server
title: Add Server
---

# Add Server

To start monitoring and optimizing your database server with Releem, you need to install Releem Agent. Follow these steps to add your server and begin receiving optimization recommendations.

Visit the Releem Dashboard and log in to your account. If you don’t have an account yet, you can sign up here.

Click the "Add Server" button to start the setup process.

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
- [MySQL in Kubernetes](/installation/installation-methods/kubernetes) – If your MySQL instance is deployed in a Kubernetes cluster.


Select the option that matches your setup to get the correct installation instructions.

## How to verify if the Releem Agent is installed on your server

After you've installed the Releem Agent, you should see the server on the Releem Dashboard and can verify that the integration is working.

On the Releem Score block, you should see Agent Status **Connected**, which indicates that the Releem Platform receives metrics from the Releem Agent.

Have some issues with the integration? Take a look at [Troubleshooting Guide](/get-started/troubleshoot-releem-agent) or contact our support team.
