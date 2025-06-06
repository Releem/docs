---
id: "migration"
title: "Migration to the new server"
---

# Releem License Migration Between Servers

This guide explains how to migrate your Releem license from one server to another. This process is useful when you need to move your Releem Agent to a different server or when replacing hardware.

## Prerequisites

Before starting the migration process, ensure you have:

1. Access to both the source and destination servers
2. Your Releem API key
3. Root or sudo privileges on both servers

## Migration Steps

1. Uninstall Releem Agent from Source Server using the following [guide](/docs/releem-agent/uninstallation.md)

2. Install Releem Agent on Destination Server

You have two options for installation:

**Option A: Preserve Historical Metrics**

If you want to maintain the historical metrics and continue from where you left off, install the agent with the same hostname as the old server. 
To do that just add the following variable to the installation command:

```bash
--hostname="OLD_SERVER_HOSTNAME"
```

Replace `OLD_SERVER_HOSTNAME` with your previous server's hostname (e.g., "db1.example.com").

**Option B: Fresh Start**

If you want to start with a clean slate and new metrics just install Releem agent to the new server using "+Add new server" link in the Dashboard.

## Important Notes

- Your license is tied to your Releem account, not to a specific server
- The migration process doesn't require any additional license activation
- Historical data from the previous server will remain in your Releem dashboard if you use *Option A*

## Support

If you need assistance with the migration process, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.