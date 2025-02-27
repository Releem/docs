---
id: step-2-add-server
title: Add Server
---

# Add Server

To start monitoring and optimizing your MySQL server with Releem, you need to install Releem Agent. Follow these steps to add your server and begin receiving optimization recommendations.

Visit the Releem Dashboard and log in to your account. If you don’t have an account yet, you can sign up here.

Click the “Add Server” button to start the setup process.

![Releem Add Server popup](/img/dashboard-add-server.png)

Choose the type of MySQL server you are adding:
- [MySQL on Linux Server: Automatic Agent Installation (Linux)](/releem-agent/installation-guides/self-managed-servers-automatic-installation) – Automatic installation for MySQL instances running on Linux-based servers.
- [MySQL on Linux Server: Advanced Agent Installation](/releem-agent/installation-guides/self-managed-servers-manual-installation-linux) – Manual installation for MySQL instances running on Linux-based servers. Use this guide if you don't have a MySQL root user, or if MySQL is installed on a different IP address, or if you want to create a Releem user manually.
- [MySQL on Linux Server: Manual Installation in Docker](/releem-agent/installation-guides/self-managed-servers-docker-installation) – Manual installation for MySQL instances running in Docker containers.
- [Self-Managed Server (Windows)](/releem-agent/installation-guides/self-managed-servers-manual-installation-windows) – For MySQL instances running on Windows.
- [MySQL on AWS RDS: CloudFormation installation](/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation) – For managed MySQL databases hosted on AWS.
- [MySQL in Kubernetes](/releem-agent/installation-guides/installation-in-kubernetes) – If your MySQL instance is deployed in a Kubernetes cluster.


Select the option that matches your setup to get the correct installation instructions.

## How to verify if the Releem Agent is installed on your server

After you've installed the Releem Agent, you should see the server on the Releem Dashboard and can verify that the integration is working.

On the Releem Score block, you should see Agent Status **Connected**, which indicates that the Releem Platform receives metrics from the Releem Agent.

Have some issues with the integration? Take a look at [Troubleshooting Guide](/getting-started/how-to-check-if-releem-agent-is-working) or contact our support team.

