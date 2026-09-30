---
id: kubernetes
slug: /installation/mariadb/kubernetes
title: Install Releem for MariaDB on Kubernetes
---

# Install Releem for MariaDB on Kubernetes

Deploy the Releem Agent for a MariaDB cluster in Kubernetes.

## Prerequisites

Create the monitoring account from [MariaDB permissions](/supported-databases/mariadb/required-permissions). Identify the namespace, primary and secondary MariaDB pod names, per-node service names, database-node label, storage class, and a current version from [Releem Agent tags on Docker Hub](https://hub.docker.com/r/releem/releem-agent/tags). Deploy one Agent for each database node you want Releem to monitor.

The manifest below models a primary and secondary MariaDB topology. Each Agent has separate storage for Agent data and generated database configuration. Required pod affinity keeps each Agent on the same Kubernetes node as its corresponding MariaDB pod.

## Deploy the Agent

1. Create a Kubernetes Secret named `releem-agent`. Use your cluster's secret-management workflow; do not commit secret values to the repository.
2. Confirm that each MariaDB pod has the `statefulset.kubernetes.io/pod-name` label. Confirm that its Kubernetes node has the label used by `nodeAffinity`. The example uses `use=database`; replace that key and value if your cluster uses a different label.
3. Replace every bracketed value in this manifest. Remove `storageClassName` if the namespace should use its default storage class.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-data-primary
  namespace: "[NAMESPACE]"
spec:
  storageClassName: "[STORAGE_CLASS]"
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-config-primary
  namespace: "[NAMESPACE]"
spec:
  storageClassName: "[STORAGE_CLASS]"
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-data-secondary
  namespace: "[NAMESPACE]"
spec:
  storageClassName: "[STORAGE_CLASS]"
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-config-secondary
  namespace: "[NAMESPACE]"
spec:
  storageClassName: "[STORAGE_CLASS]"
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: releem-agent-primary
  namespace: "[NAMESPACE]"
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: releem-agent-primary
  template:
    metadata:
      labels:
        app: releem-agent-primary
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: use
                    operator: In
                    values:
                      - database
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: statefulset.kubernetes.io/pod-name
                    operator: In
                    values:
                      - "[MARIADB_PRIMARY_POD]"
              topologyKey: kubernetes.io/hostname
      containers:
        - name: releem-agent-primary
          image: "releem/releem-agent:[AGENT_VERSION]"
          imagePullPolicy: IfNotPresent
          env:
            - name: RELEEM_HOSTNAME
              value: "[PRIMARY_SERVER_NAME]"
            - name: DB_HOST
              value: "[MARIADB_PRIMARY_SERVICE]"
            - name: DB_PORT
              value: "3306"
            - name: DB_USER
              value: "releem"
            - name: MEMORY_LIMIT
              value: "[PRIMARY_MEMORY_LIMIT_MB]"
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
              mountPath: /opt/releem/conf/
            - name: generated-config
              mountPath: /etc/mysql/releem.conf.d/
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: releem-agent-data-primary
        - name: generated-config
          persistentVolumeClaim:
            claimName: releem-agent-config-primary
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: releem-agent-secondary
  namespace: "[NAMESPACE]"
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: releem-agent-secondary
  template:
    metadata:
      labels:
        app: releem-agent-secondary
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: use
                    operator: In
                    values:
                      - database
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: statefulset.kubernetes.io/pod-name
                    operator: In
                    values:
                      - "[MARIADB_SECONDARY_POD]"
              topologyKey: kubernetes.io/hostname
      containers:
        - name: releem-agent-secondary
          image: "releem/releem-agent:[AGENT_VERSION]"
          imagePullPolicy: IfNotPresent
          env:
            - name: RELEEM_HOSTNAME
              value: "[SECONDARY_SERVER_NAME]"
            - name: DB_HOST
              value: "[MARIADB_SECONDARY_SERVICE]"
            - name: DB_PORT
              value: "3306"
            - name: DB_USER
              value: "releem"
            - name: MEMORY_LIMIT
              value: "[SECONDARY_MEMORY_LIMIT_MB]"
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
              mountPath: /opt/releem/conf/
            - name: generated-config
              mountPath: /etc/mysql/releem.conf.d/
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: releem-agent-data-secondary
        - name: generated-config
          persistentVolumeClaim:
            claimName: releem-agent-config-secondary
```

4. Apply the manifest and inspect both rollouts:

```bash
kubectl apply -f releem-agent.yaml
kubectl rollout status deployment/releem-agent-primary -n [NAMESPACE]
kubectl rollout status deployment/releem-agent-secondary -n [NAMESPACE]
kubectl logs deployment/releem-agent-primary -n [NAMESPACE] --tail=100
kubectl logs deployment/releem-agent-secondary -n [NAMESPACE] --tail=100
```

For a cluster with more than two database nodes, create a distinct Deployment, hostname, database service, data claim, configuration claim, and pod-affinity target for each additional node.

## Connect generated configuration to the MariaDB pods

Complete this section only when the MariaDB pods should load configuration generated by their corresponding Agents.

1. Mount `releem-agent-config-primary` in the primary MariaDB workload and `releem-agent-config-secondary` in the secondary workload. Use `/etc/mysql/releem.conf.d/` as the read-only mount path:

```yaml
volumeMounts:
  - name: releem-generated-config
    mountPath: /etc/mysql/releem.conf.d/
    readOnly: true
volumes:
  - name: releem-generated-config
    persistentVolumeClaim:
      claimName: releem-agent-config-primary
```

2. Add the include directory to the active MariaDB configuration:

```ini
!includedir /etc/mysql/releem.conf.d
```

3. Review the generated configuration before restarting or rolling the database pods. Apply the change through the cluster's normal failover and maintenance procedure.

Do not mount the primary claim into a secondary pod or reuse one Agent data claim across nodes. If a database pod cannot mount its claim, restore its previous workload manifest before retrying.

## Expected result

Both Agent pods should start. The Dashboard should show a distinct server for the primary and secondary nodes, each with **Agent Status: Connected** and current metrics or a current data timestamp.

## Verify the installation

Check both rollouts and Agent logs. Confirm that each Agent is scheduled on the same Kubernetes node as its corresponding MariaDB pod. Then verify **Agent Status: Connected** and current metrics for both servers in the Dashboard.

## Troubleshooting

If an Agent pod remains `Pending`, describe the pod and confirm that the database-node label and MariaDB pod-name selector match the cluster. Check the persistent-volume events when a claim cannot mount. For Secret, database permission, or connection errors, use [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) before you re-run the deployment.
