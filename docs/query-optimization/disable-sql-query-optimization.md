---
id: "disable-sql-query-optimization"
title: "Disable SQL Query Optimization"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Disable SQL Query Optimization

To disable the SQL Query Optimization feature, please select your installation type and follow the instructions below.

<Tabs>
  <TabItem value="linux" label="Linux" default>

1. Edit the agent configuration file:

```bash
nano /opt/releem/releem.conf
```

2. Set:

```ini
query_optimization=false
```

3. Restart the agent:

```bash
systemctl restart releem-agent
```

  </TabItem>
  <TabItem value="docker" label="Docker">

Recreate the container with query optimization disabled:

```bash
docker rm -f releem-agent
docker run -d --name releem-agent \
  -e RELEEM_QUERY_OPTIMIZATION=false \
  ... \
  releem/releem-agent:[version]
```

For Docker Compose, set:

```yaml
environment:
  RELEEM_QUERY_OPTIMIZATION: false
```

Then recreate the service:

```bash
docker compose up -d
```

  </TabItem>
  <TabItem value="aws-rds" label="AWS RDS">

If the agent is managed by CloudFormation, update the `releem-agent` stack and set `QueryOptimization` to `false`.

If the agent runs on EC2, set `query_optimization=false` in `/opt/releem/releem.conf` and restart the agent:

```bash
systemctl restart releem-agent
```

  </TabItem>
  <TabItem value="gcp-cloudsql" label="GCP Cloud SQL">

Set `query_optimization=false` in the agent configuration or recreate the Docker container with `RELEEM_QUERY_OPTIMIZATION=false`, then restart the agent.

  </TabItem>
  <TabItem value="azure-mysql" label="Azure MySQL">

Set `query_optimization=false` in the agent configuration or recreate the Docker container with `RELEEM_QUERY_OPTIMIZATION=false`, then restart the agent.

  </TabItem>
  <TabItem value="windows" label="Windows">

Set `query_optimization=false` in `C:\ProgramData\ReleemAgent\releem.conf`, then restart the Releem Agent Windows service.

  </TabItem>
</Tabs>
