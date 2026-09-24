---
id: apply-configuration
slug: /recommendations/configuration-tuning/apply-configuration
title: Apply a recommended configuration
---

# Apply a recommended configuration

Choose how to apply the configuration recommended by Releem.

| Method | Description | Limitation |
|---|---|---|
| [Using the Portal](/recommendations/configuration-tuning/apply-using-portal) | Review and apply configuration from the Releem web interface. | Available options depend on the deployment and its approved configuration-changing access. |
| [Using the Agent](/recommendations/configuration-tuning/apply-using-agent) | Run the application command on your database server. | Use this method only when the Agent runs directly on the self-managed database host. Managed environments use the Portal. |
| [Manually](/recommendations/configuration-tuning/apply-manually) | Update configuration files or cloud settings yourself. | A procedure is currently documented only for MySQL. |
| [On a Schedule](/recommendations/configuration-tuning/apply-using-cron) | Configure recurring application using cron. | A scheduled run can apply a future recommendation without a person reviewing it at execution time. |

## Before you apply

Review the recommended changes and record the current values before you apply them. Confirm the affected server, required access, maintenance window, and rollback plan. Back up the active configuration through the method appropriate for your database and environment.

## Restart-pending state and effective database values

Some settings take effect immediately. Others remain restart-pending until the database service or managed instance restarts. After the selected method finishes, confirm the effective database settings rather than relying on the submitted configuration alone.

Command completion or a Releem event does not prove that every recommended value is effective.

## Verify database and application health

Confirm that the database service health is normal and the server is available. Check application connectivity and review application errors before you consider the change complete.

## Verify the Releem event and current metrics

Confirm the Releem event for the application attempt, then review current metrics from the same server. The event records the attempt; the effective values and health checks establish the result.

## Recovery

Use the rollback path you recorded before the change if the database or application does not return to its expected state. See [Rollback](/recommendations/configuration-tuning/rollback) for the recovery method currently documented by Releem.
