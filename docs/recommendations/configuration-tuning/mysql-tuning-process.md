---
id: mysql-tuning-process
slug: /recommendations/configuration-tuning/mysql-tuning-process
title: MySQL Tuning Process
---

# MySQL Tuning Process

Use this page to understand how Releem turns MySQL metrics into a recommended configuration and where you make the change. The process separates analysis from application: Releem collects data, searches for candidates, evaluates and presents a proposal, and you review and decide how to apply it.

### Stage 1: Collecting Baseline
Releem's AI is trained with data from different controlled workloads. After you install the Releem Agent, the platform collects baseline data over several days. This server-specific data helps the AI recognize when a new configuration leads to improved performance.

### Stage 2: Searching for Opportunities
The Releem platform uses AI to continuously search for opportunities to enhance MySQL performance. On the Free plan, Releem tunes only 10 MySQL variables, while the Premium plan offers tuning of more variables. This stage identifies candidates; it does not apply them.

### Stage 3: Expert System Evaluation
If Releem's AI identifies a viable hypothesis for performance improvement, the platform's expert system assesses whether the proposed change could adversely affect the stability or security of your MySQL instance. This assessment filters the proposal, but it does not guarantee the result for your workload.

### Stage 4: Preparing New Configuration
After the expert-system evaluation, Releem prepares a new configuration and displays it as a proposal for you to review. At this stage, you will see the number of unapplied recommendations in the Recommended Configuration block. Displaying a recommendation does not change your server configuration.

### Stage 5: Applying Recommended Configuration
Review the recommended configuration and decide how to apply it. You can apply it manually or using the Releem Agent, depending on your server type and installation method. After applying the configuration, it may take up to 12 hours for Releem to detect the changes and update the unapplied recommendations count.

After Releem updates the count, compare your server's behavior with its baseline and your operational requirements. The recommendation and expert-system assessment support your decision; they do not replace your review of the proposed values and affected server.
