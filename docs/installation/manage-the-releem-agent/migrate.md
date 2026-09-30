---
id: migrate
slug: /installation/manage-the-releem-agent/migrate
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

1. Review the [uninstall guide](/installation/manage-the-releem-agent/uninstall) for the source server. Keep the source Agent available until you have checked the destination.

2. [Choose an installation guide](/installation) for the destination server and install the Releem Agent.

You have two options for installation:

**Option A: Preserve Historical Metrics**

To preserve the Dashboard identity used by historical metrics, record the exact hostname shown for the old server. Prefix the destination server's one-line Linux installation command with `RELEEM_HOSTNAME="[OLD_SERVER_HOSTNAME]"`, before the other `RELEEM_` settings. Keep it in the same command; do not run the assignment separately.

Replace `[OLD_SERVER_HOSTNAME]` with the exact recorded Dashboard hostname. After installation, confirm that the expected server identity is shown and that current metrics arrive. If a duplicate server appears or history is not associated as expected, stop and contact Releem Support before removing either record.

**Option B: Fresh Start**

If you want to start with a clean slate and new metrics just install Releem agent to the new server using "+Add new server" link in the Dashboard.

When the destination shows the intended server identity and current metrics, remove the source Agent with the [uninstall guide](/installation/manage-the-releem-agent/uninstall). If the identity or historical data is wrong, resolve that before removing the source.

## Important Notes

- Your license is tied to your Releem account, not to a specific server
- The migration process doesn't require any additional license activation
- Historical data from the previous server will remain in your Releem dashboard if you use *Option A*

## Support

If you need assistance with the migration process, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.
