---
id: how-to-apply-configuration-using-agent
title: How to Apply Configuration Using Agent
---

# How to Apply Configuration Using Agent

Use this method for self-managed MySQL, MariaDB, or Percona servers where Releem Agent is installed directly on the database host.

To apply the latest recommended configuration and allow MySQL restart when required, run:

```
bash /opt/releem/mysqlconfigurer.sh -s auto
```

Releem Agent is equipped with an automatic rollback function. This means if any issues arise while applying a new configuration, Releem will smartly revert to the previous configuration.


## Cloud-Managed Databases

For AWS RDS, GCP Cloud SQL, and Azure Database for MySQL, apply recommended configuration from the Releem Portal. The agent receives the task from the portal and uses the cloud provider API to update database parameters.
