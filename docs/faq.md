---
id: faq
slug: /faq
title: Frequently Asked Questions
---

import Head from '@docusaurus/Head';

<Head>
  <link rel="canonical" href="https://releem.com/faq" />
</Head>


# Frequently Asked Questions

Use these answers to complete common Releem tasks. Start with [Connect Your Database Server](/get-started/connect-your-database-server), the [Dashboard](/dashboard), or [Recommendations](/recommendations). To verify an Agent installation, follow [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent).

For account tasks, see [Users and Roles](/account/access/users-and-roles), [Payment Information](/account/billing/payment-information), and [Cancel Subscription](/account/billing/cancel-subscription).

## I've installed Releem Agent. How do I check if I've done it correctly?
Follow [Troubleshoot the Releem Agent](/get-started/troubleshoot-releem-agent) to check its Dashboard state, service status, and logs.

## Why does high latency occur after applying the recommended configuration?
Releem restarts MySQL to apply recommended configurations. Latency often spikes due to the database operating with cold caches. [Learn more](https://releem.com/docs/mysql-latency)

## I applied all recommendations, but Releem Score is not 100%. How can I improve it?
This indicates that certain [Health Checks](/dashboard/health-checks) differ from best practices. Avoid taking any action, Releem will consistently seek to enhance it.

## I applied all recommendations, but not all Health Checks are checked. How can I improve it?
Review [Health Checks](/dashboard/health-checks) to see which checks differ from best practices. Avoid taking any action, Releem will consistently seek to enhance it.

## Would Releem automatically change MySQL configuration without my approval?
Rest assured, Releem does not automatically implement any configurations without your explicit action. Configurations are applied only when you select [**Apply Now**](/recommendations/configuration-tuning/apply-using-portal) or follow the [Releem Agent application guide](/recommendations/configuration-tuning/apply-using-agent). Before making any changes, you have the opportunity to review and compare the proposed configurations with your current settings.

Additionally, for those who prefer, there's an option to [automate the application of configurations during the maintenance window](/recommendations/configuration-tuning/apply-using-cron) by setting up a dedicated cron job.

## How do I add my business details and the VAT number?
You have the option to include your business address and VAT identification on the payment page. Additionally, you can access any of your past invoices and select the Add Address & VAT Number link to accomplish this. See [Payment Information](/account/billing/payment-information) for the account task.

## How do I get an invoice?
Our payment service Paddle automatically emails you an invoice after each transaction. You can click on a link in this email to get your invoice. See [Payment Information](/account/billing/payment-information) for billing details.
