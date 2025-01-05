---
id: update-for-docker
title: Update for Docker
---

# Update for Docker

We automated update of Releem Agent installed in Docker container.

To setup automated Releem Agent update please follow the steps below:

1. Download script for update
   ```bash
   mkdir -p /opt/releem 
   curl -s -L -o /opt/releem/update_releem_docker.sh https://releem.s3.amazonaws.com/v2/update_releem_docker.sh
   chmod +x /opt/releem/update_releem_docker.sh
   ```

2. Set the container name (by default the name of container is "releem-agent") and run the command below for test
   ```bash
   PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash /opt/releem/update_releem_docker.sh <container_name>
   ```

3. Set container name and execute the following command to add script to cron for every Releem Agent container
   ```bash
   ( crontab -l 2>/dev/null | grep -v "/opt/releem/update_releem_docker.sh" || true; echo "0 0 * * * PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash /opt/releem/update_releem_docker.sh <container_name> >> /tmp/update_releem_docker.log 2>&1") | crontab -
   ```