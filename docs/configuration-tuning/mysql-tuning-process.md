---
id: mysql-tuning-process
title: MySQL Tuning Process
---

# MySQL Tuning Process

The Releem MySQL tuning process is designed to optimize MySQL performance using a systematic approach that involves several stages. Each stage plays a crucial role in ensuring that the resulting configuration improves your server's performance while maintaining stability and security.

### Stage 1: Collecting Baseline
After installing the Releem Agent, the platform will collect baseline data over several days. This data is used to train the AI, allowing it to recognize when a new configuration leads to improved performance.

### Stage 2: Searching for Opportunities
The Releem platform uses AI to continuously search for opportunities to enhance MySQL performance. On the Free plan, Releem tunes only 10 MySQL variables, while the Premium plan offers tuning of more variables.

### Stage 3: Expert System Evaluation
If Releem's AI identifies a viable hypothesis for performance improvement, the platform's expert system will assess whether it can be safely applied to your server. This step ensures that any proposed changes do not adversely affect the stability or security of your MySQL instance.

### Stage 4: Preparing New Configuration
Once the expert system has verified the safety of a proposed change, Releem will prepare a new configuration and display it to the user. At this stage, you will see the number of unapplied recommendations in the Recommended Configuration block.

### Stage 5: Applying Recommended Configuration
When the recommended configuration is ready, you should apply it to your server. You can do this manually or automatically using the Releem Agent, depending on your server type and installation method. After applying the configuration, it may take up to 12 hours for Releem to detect the changes and update the unapplied recommendations count.

By following these stages, the Releem tuning process ensures that your MySQL server's performance is optimized safely and effectively. Regularly reviewing and applying recommended configurations will help you maintain peak performance and meet your business requirements.
