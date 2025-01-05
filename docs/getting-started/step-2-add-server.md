---
id: step-2-add-server
title: Add Server
---

# Add Server


To monitor and tune Self-Managed MySQL servers, the Releem Agent should be installed on the same server as the MySQL server.

To add a server to the Releem Dashboard, you need to install the Releem Agent.

The installation process varies depending on whether your server is self-managed or cloud-managed. Releem supports the following types of installations:

## [Self-Managed Servers Automatic Installation](/releem-agent/self-managed-servers-automatic-installation)

This is the simplest and fully automatic way to install the Releem Agent for Linux. Just click on the "Add server" link at the Releem Customer Portal and follow the instructions. Use this guide if the MySQL server is installed on the localhost and you have the MySQL root password.

## Self-Managed Servers Manual Installation

This is the universal way to install the Releem Agent. It isn't as simple as Automatic Installation. 

### For Linux
Use this [guide](/releem-agent/self-managed-servers-manual-installation-linux) if you don't have a MySQL root user, or if MySQL is installed on a different IP address, or if you want to create a Releem user manually.

### For Windows
Use this [guide](/releem-agent/self-managed-servers-manual-installation-windows) to install the Releem Agent on Windows.

## [Self-Managed Servers Docker Installation](/releem-agent/self-managed-servers-docker-installation)

This guide helps to install the Releem Agent in a Docker container. Use it only if you're using MySQL in Docker and don't want to install additional software on the host instance.

## [Cloud-Managed AWS RDS Automatic Installation](/releem-agent/cloud-managed-aws-rds-automatic-installation)

This is the simplest and fully automatic way to install the Releem Agent in AWS Cloud to monitor and tune AWS RDS.

## How to verify if the Releem Agent is installed on your server

After you've installed the Releem Agent, you should see the server on the Releem Dashboard and can verify that the integration is working.

On the Releem Score block, you should see Agent Status **Connected**, which indicates that the Releem Platform receives metrics from the Releem Agent.


