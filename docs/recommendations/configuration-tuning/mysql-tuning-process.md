---
id: mysql-tuning-process
slug: /recommendations/configuration-tuning/mysql-tuning-process
title: Configuration Tuning
---

# Configuration Tuning

Use Configuration Tuning to review database settings proposed by Releem and decide whether and how to apply them. Releem separates analysis from application: showing a proposal in **Recommended Configuration** does not change your database server.

## How the tuning workflow works

### 1. Create a complete recommendation

Releem first creates a complete, rule-based recommendation from the server's current configuration and available metrics. This is the baseline recommendation. It does not depend on an AI adjustment.

### 2. Observe the result of an applied configuration

AI tuning becomes eligible only after a previous recommendation has been applied and Releem has collected fresh observations. Until then, the complete rule-based recommendation remains available without an AI change.

### 3. Compare similar workloads

When AI tuning is eligible, Releem compares the new observations with pre-collected history from similar controlled workloads. The models use that comparison to evaluate a limited adjustment rather than replace the complete recommendation.

### 4. Evaluate the adjustment

Releem evaluates candidate adjustments against the observed metrics and its acceptance checks. A candidate can be rejected or suppressed when the available evidence is insufficient. This evaluation supports your review; it does not predict the result for every workload.

### 5. Build the proposal

When an adjustment is accepted, Releem merges it with the complete baseline recommendation, any applicable manual overrides, and downstream checks. If the AI adjustment is suppressed or cannot be produced, the complete baseline recommendation remains without that adjustment.

### 6. Review, apply, and verify

Releem displays the resulting proposal in the **Recommended Configuration** block. Displaying it does not modify the active configuration. Review the changed variables and the affected server, then choose an application method documented for your environment.

Some variables can become effective without a restart. Others remain pending until the database service or managed instance restarts. After application, confirm the effective database values, database and application health, and current metrics. A completed command or Releem event records an application attempt; it does not prove that every value is active.

[Choose how to apply the recommended configuration](/recommendations/configuration-tuning/apply-configuration).
