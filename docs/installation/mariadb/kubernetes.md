---
id: kubernetes
slug: /installation/mariadb/kubernetes
title: Install Releem for MariaDB on Kubernetes
---

# Install Releem for MariaDB on Kubernetes

Deploy the Releem Agent for a MariaDB cluster in Kubernetes.

## Prerequisites

Create the monitoring account from [MariaDB permissions](/supported-databases/mariadb/required-permissions). Identify the namespace, MariaDB service name, storage class, and current Agent version. Deploy one Agent for each database node you want Releem to monitor.

## Deploy the Agent

1. Create a Kubernetes Secret named `releem-agent`. Use your cluster's secret-management workflow; do not commit secret values to the repository.
2. Replace the bracketed values in this manifest. Set `DB_HOST` to the MariaDB service for the node that this Agent monitors.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-data
  namespace: [NAMESPACE]
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: releem-agent
  namespace: [NAMESPACE]
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: releem-agent
  template:
    metadata:
      labels:
        app: releem-agent
    spec:
      containers:
        - name: releem-agent
          image: releem/releem-agent:[AGENT_VERSION]
          env:
            - name: RELEEM_HOSTNAME
              value: "[DATABASE_NODE_NAME]"
            - name: DB_HOST
              value: "[MARIADB_SERVICE]"
            - name: DB_PORT
              value: "3306"
            - name: DB_USER
              value: "releem"
            - name: RELEEM_API_KEY
              valueFrom:
                secretKeyRef:
                  name: releem-agent
                  key: api-key
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: releem-agent
                  key: database-password
          volumeMounts:
            - name: data
              mountPath: /opt/releem/conf
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: releem-agent-data
```

3. Apply the manifest and inspect the rollout:

```bash
kubectl apply -f releem-agent.yaml
kubectl rollout status deployment/releem-agent -n [NAMESPACE]
kubectl logs deployment/releem-agent -n [NAMESPACE] --tail=100
```

For a cluster with multiple database nodes, create a distinct Deployment, hostname, and persistent volume for each node.

## Expected result

After you complete a supported deployment, the Agent pods should start and the Dashboard should show **Agent Status: Connected** with current metrics or a current data timestamp.

## Verify the installation

Check the rollout and Agent logs, then verify **Agent Status: Connected** and current metrics in the Dashboard.

## Troubleshooting

Use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent). Resolve scheduling, storage, Secret, database permission, or connection errors before you re-run the supported deployment.
