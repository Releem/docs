---
id: "installation-in-kubernetes"
title: "Installation in Kubernetes"
---

# Installation of Releem Agent in Kubernetes

Guide to installing Releem Agent in a Kubernetes environment. 

The example of Releem agent deployment for MariaDB cluster in Kubernetes:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-claim0-primary
  namespace:  your-name-space
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-claim1-primary
  namespace: your-name-space
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-claim0-secondary
  namespace: your-name-space
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: releem-agent-claim1-secondary
  namespace: your-name-space
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi       
---
apiVersion: apps/v1    
kind: Deployment
metadata:
  name: releem-agent-primary
  namespace: your-name-space
  labels:
    tier: backend
    version: 1.0.1
spec:
  selector:
    matchLabels:
      app: releem-agent-primary
      tier: backend
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: releem-agent-primary
        tier: backend
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
                - your-name-space-mariadb-primary-0
            topologyKey: kubernetes.io/hostname
      containers:
      - name: releem-agent-primary
        image: releem/releem-agent:1.12.0
        imagePullPolicy: IfNotPresent
        env:
        - name: MEMORY_LIMIT
          value: "28672"
        - name: DB_USER
          value: "your-user"
        - name: RELEEM_API_KEY
          value: "your-key"
        - name: DB_PASSWORD
          value: "your-passw"
        - name: DB_PORT
          value: "3306"
        - name: DB_HOST
          value: "your-db-service"
        volumeMounts:
          - mountPath: /opt/releem/conf/
            name: releem-agent-claim0
          - mountPath: /etc/mysql/releem.conf.d/
            name: releem-agent-claim1
      restartPolicy: Always
      volumes:
        - name: releem-agent-claim0
          persistentVolumeClaim:
            claimName: releem-agent-claim0-primary
        - name: releem-agent-claim1
          persistentVolumeClaim:
            claimName: releem-agent-claim1-primary
---
apiVersion: apps/v1    
kind: Deployment
metadata:
  name: releem-agent-secondary
  namespace: your-name-space
  labels:
    tier: backend
    version: 1.0.1
spec:
  selector:
    matchLabels:
      app: releem-agent-secondary
      tier: backend
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: releem-agent-secondary
        tier: backend
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
                - your-name-space-mariadb-secondary-0
            topologyKey: kubernetes.io/hostname
      containers:
      - name: releem-agent-secondary
        image: releem/releem-agent:1.12.0
        imagePullPolicy: IfNotPresent
        env:
        - name: MEMORY_LIMIT
          value: "28672"
        - name: DB_USER
          value: "your-user"
        - name: RELEEM_API_KEY
          value: "your-key"
        - name: DB_PASSWORD
          value: "your-passw"
        - name: DB_PORT
          value: "3306"
        - name: DB_HOST
          value: "your-db-service"
        volumeMounts:
          - mountPath: /opt/releem/conf/
            name: releem-agent-claim0
          - mountPath: /etc/mysql/releem.conf.d/
            name: releem-agent-claim1
      restartPolicy: Always
      volumes:
        - name: releem-agent-claim0
          persistentVolumeClaim:
            claimName: releem-agent-claim0-secondary
        - name: releem-agent-claim1
          persistentVolumeClaim:
            claimName: releem-agent-claim1-secondary
```

Please use the latest version of Releem Agent. You can find the latest version of Releem Agent by clicking on the [link](https://hub.docker.com/r/releem/releem-agent/tags).