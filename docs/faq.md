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
Some recommended settings require a database restart before they become effective; other settings do not. If a restart occurred, temporarily cold caches can be one cause of higher latency. Confirm the restart state, effective settings, database health, and current metrics before attributing the change to a single cause. [Learn more](https://releem.com/docs/mysql-latency)

## I applied all recommendations, but Releem Score is not 100%. How can I improve it?
This indicates that certain [Health Checks](/dashboard/health-checks) differ from best practices. Avoid taking any action, Releem will consistently seek to enhance it.

## I applied all recommendations, but not all Health Checks are checked. How can I improve it?
Review [Health Checks](/dashboard/health-checks) to see which checks differ from best practices. Avoid taking any action, Releem will consistently seek to enhance it.

## Would Releem automatically change MySQL configuration without my approval?
The documented Portal and Agent workflows require you to start the application. Review the proposed settings and choose an available method: [apply using the Portal](/recommendations/configuration-tuning/apply-using-portal) or [apply using the Agent](/recommendations/configuration-tuning/apply-using-agent). Availability depends on the database and environment.

A verified procedure for scheduled configuration application is not currently published. See [On a Schedule](/recommendations/configuration-tuning/apply-using-cron) for the current limitation; do not create a configuration-application cron job from older instructions.

## How do I add my business details and the VAT number?
You have the option to include your business address and VAT identification on the payment page. Additionally, you can access any of your past invoices and select the Add Address & VAT Number link to accomplish this. See [Payment Information](/account/billing/payment-information) for the account task.

## How do I get an invoice?
Our payment service Paddle automatically emails you an invoice after each transaction. You can click on a link in this email to get your invoice. See [Payment Information](/account/billing/payment-information) for billing details.
