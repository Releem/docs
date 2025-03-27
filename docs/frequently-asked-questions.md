---
id: frequently-asked-questions
title: Frequently Asked Questions
---

import Head from '@docusaurus/Head';

<Head>
  <link rel="canonical" href="https://releem.com/faq" />
</Head>


# Frequently Asked Questions

## I've installed Releem Agent. How do I check if I've done it correctly?
We created a guide for you to make this process easier. [Learn more](/getting-started/how-to-check-if-releem-agent-is-working.md)

## Why does high latency occur after applying the recommended configuration?
Releem restarts MySQL to apply recommended configurations. Latency often spikes due to the database operating with cold caches. [Learn more](https://releem.com/docs/mysql-latency)

## I applied all recommendations, but Releem Score is not 100%. How can I improve it?
This indicates that certain health checks differ from best practices. Avoid taking any action, Releem will consistently seek to enhance it.

## I applied all recommendations, but not all Health Checks are checked. How can I improve it?
This indicates that certain health checks differ from best practices. Avoid taking any action, Releem will consistently seek to enhance it.

## Would Releem automatically change MySQL configuration without my approval?
Rest assured, Releem does not automatically implement any configurations without your explicit action. Configurations are applied only when you choose to hit the "Apply Now" button or execute a specific SSH command. Before making any changes, you have the opportunity to review and compare the proposed configurations with your current settings.

Additionally, for those who prefer, there's an option to automate the application of configurations during the maintenance window by setting up a dedicated cron job.

## How do I add my business details and the VAT number?
You have the option to include your business address and VAT identification on the payment page while upgrading. Additionally, you can access any of your past invoices and select the Add Address & VAT Number link to accomplish this.

## How do I get an invoice?
Our payment service Paddle automatically emails you an invoice after each transaction. You can click on a link in this email to get your invoice.