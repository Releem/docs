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

1. Review the [uninstall guide](/installation/manage-the-releem-agent/uninstall) and contact Releem Support for the current source-server removal procedure.

2. [Choose an installation guide](/installation) for the destination server and install the Releem Agent.

You have two options for installation:

**Option A: Preserve Historical Metrics**

To preserve the Dashboard identity used by historical metrics, record the exact hostname shown for the old server. In the destination server's canonical one-step Linux command, add this environment-variable line immediately before the `curl` line:

```bash
export RELEEM_HOSTNAME="[OLD_SERVER_HOSTNAME]"
```

Replace `[OLD_SERVER_HOSTNAME]` with the exact recorded Dashboard hostname. After installation, confirm that the expected server identity is shown and that current metrics arrive. If a duplicate server appears or history is not associated as expected, stop and contact Releem Support before removing either record.

**Option B: Fresh Start**

If you want to start with a clean slate and new metrics just install Releem agent to the new server using "+Add new server" link in the Dashboard.

## Important Notes

- Your license is tied to your Releem account, not to a specific server
- The migration process doesn't require any additional license activation
- Historical data from the previous server will remain in your Releem dashboard if you use *Option A*

## Support

If you need assistance with the migration process, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.
