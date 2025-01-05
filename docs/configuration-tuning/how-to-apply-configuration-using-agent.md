---
id: how-to-apply-configuration-using-agent
title: How to Apply Configuration Using Agent
---

# How to Apply Configuration Using Agent

To apply the recommended configuration, just run the following command:

```
bash /opt/releem/mysqlconfigurer.sh -s auto
```

Releem Agent is equipped with an automatic rollback function. This means if any issues arise while applying a new configuration, Releem will smartly revert to the previous configuration.