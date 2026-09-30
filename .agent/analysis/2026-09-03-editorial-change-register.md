# Private editorial change register

**Audit date:** 2026-09-03
**Status:** all `Clarity edit with preserved procedure` records approved for sequential bounded implementation by the user's 2026-09-05 instruction; no safety-exception or publication approval
**Baseline:** commit `9ad7ce3`, as frozen by `.agent/analysis/2026-09-03-committed-content-preservation.json`

This register applies the copy-editing clarity, evidence, specificity, and risk sweeps to the current 54-page documentation corpus. Current documentation is the only factual product source used. No product behavior, version support, permission requirement, interface state, or recovery guarantee is inferred from outside the repository.

## Approved Task 5 execution queue

- [x] `docs/account/access/users-and-roles.md` — approved by the user's 2026-09-04 instruction to implement the next plan task with subagents. Limit the edit to sentence-level grammar and explicit numbering of the retained invite, role-change, and removal sequences. Preserve both screenshots and every existing role-capability, invitation, account-creation, acceptance, and password fact.
- [x] `docs/account/billing/cancel-subscription.md` — add a concise outcome/prerequisite lead and consistently label the retained five steps; add no effective-date, refund, or retention claim.
- [x] `docs/dashboard/deadlocks.md` — separate detected evidence from suggested action and qualify absolute timing/outcome language; retain both screenshots and the external detail link.
- [x] `docs/dashboard/health-checks.md` — add a plain-language review lead and qualify outcome claims; retain every block, metric, and screenshot.
- [x] `docs/dashboard/process-list.md` — distinguish observation from action implications and qualify real-time/all claims; retain all four use cases, screenshot, and article link.
- [x] `docs/dashboard/query-analytics.md` — distinguish observed analytics from proposed optimization and make the three existing tasks parallel; retain every column, step, and image.
- [x] `docs/dashboard/reports.md` — report Latency/QPS changes without presuming improvement and qualify the conclusion; retain the report inventory, four sections, three benefit bullets, and screenshot. A reviewer-driven scope correction also permits neutralizing the detailed Performance Insights sentence while retaining its baseline, applied-recommendation, workload-context, and over-time review detail.
- [x] `docs/dashboard/schema-checks.md` — distinguish detected issues from proposed DDL and label the retained review/test/execute sequence; retain every issue type, screenshot, and follow-up link.
- [x] `docs/dashboard/security-checks.md` — replace only the two compliance/protection guarantees with qualified review guidance; retain the first sentence, screenshot, and supplemental article link.
- [x] `docs/get-started/troubleshoot-releem-agent.md` — completed by Task 4: observable Dashboard/service checks were front-loaded while all three fences, the screenshot, diagnostics, and recovery instructions were preserved.
- [x] `docs/installation/manage-the-releem-agent/logs.md` — add an environment-selection lead and a reminder to review logs before sharing; retain every tab, location, and command.
- [x] `docs/recommendations/configuration-tuning/apply-manually/aws-rds.md` — add the recorded-state prerequisite and make immediate versus maintenance timing an explicit decision; retain all steps.
- [x] `docs/recommendations/configuration-tuning/apply-manually/docker.md` — clarify the target file/container and add a pre-restart review checkpoint; retain the restart fence and all steps.
- [x] `docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md` — separate provider confirmation from Releem verification and label timing choices; retain all steps.
- [x] `docs/recommendations/configuration-tuning/apply-manually/windows.md` — add prerequisites to identify the active `my.ini` and review settings; retain location, encoding, restart, and verification details.
- [x] `docs/recommendations/configuration-tuning/apply-using-agent.md` — add a preflight/expected-result frame and existing Rollback link; retain both commands and cloud-managed note.
- [x] `docs/recommendations/configuration-tuning/configuration-example.md` — label the example illustrative/non-runnable and explain Previous value only from current context; retain the sample and screenshot.
- [x] `docs/recommendations/configuration-tuning/limit-mysql-memory.md` — explain that the setting is a tuning target rather than an enforced cap; retain three steps, timing statement, FAQ, and screenshot.
- [x] `docs/recommendations/configuration-tuning/mysql-tuning-process.md` — clarify collection, proposal, review, and application boundaries; retain all five stages and the controlled-workload/AI explanation.
- [x] `docs/recommendations/configuration-tuning/rollback.md` — add a concise scope/result lead and existing logs/support failure path; retain the rollback command exactly and do not define unverified restored state.
- [x] `docs/recommendations/query-optimization/disable.md` — add outcome/verification guidance and identify retained-data/permission revocation as unresolved; retain every tab and all seven fences.
- [x] `docs/recommendations/query-optimization/overview.md` — distinguish observation, proposal, manual implementation, and validation; retain both workflows, both screenshots, and the SQL example.
- [x] `docs/recommendations/query-optimization/prepared-statements.md` — distinguish the documented limitation from client-side workarounds and add test/reversal caution; retain the existing PHP command and Java/PHP guidance.

The classification `Safety exception` means **candidate pending release review**, not an approved exception. The active manifest `safetyExceptions` array remains empty. Only the Task 5 queue rows above authorize sequential one-page clarity edits. No safety-exception, navigation-only, or no-change record authorizes a public-page edit. Proposed archive paths do not yet exist and must contain placeholder-only historical material headed `DO NOT RUN` if a later review approves an exception.

## Validation summary

- Pages classified: **54**
- `No change`: **3**
- `Navigation/link improvement`: **8**
- `Clarity edit with preserved procedure`: **23**
- `Safety exception` candidates: **20**
- Active safety exceptions authorized in the manifest: **0**
- Unresolved-question groups: **4** (`Product`, `UI`, `Database support and permissions`, `Screenshots`)

## Authoritative one-to-one page classification

Each manifest source path appears exactly once in this table. The evidence records later in this file explain these classifications; they do not create additional classifications.

| # | Source page | Classification |
|---:|---|---|
| 1 | `docs/account/access/users-and-roles.md` | `Clarity edit with preserved procedure` |
| 2 | `docs/account/billing/cancel-subscription.md` | `Clarity edit with preserved procedure` |
| 3 | `docs/account/billing/payment-information.md` | `Navigation/link improvement` |
| 4 | `docs/account/overview.md` | `Navigation/link improvement` |
| 5 | `docs/dashboard/deadlocks.md` | `Clarity edit with preserved procedure` |
| 6 | `docs/dashboard/health-checks.md` | `Clarity edit with preserved procedure` |
| 7 | `docs/dashboard/overview.md` | `Navigation/link improvement` |
| 8 | `docs/dashboard/process-list.md` | `Clarity edit with preserved procedure` |
| 9 | `docs/dashboard/query-analytics.md` | `Clarity edit with preserved procedure` |
| 10 | `docs/dashboard/reports.md` | `Clarity edit with preserved procedure` |
| 11 | `docs/dashboard/schema-checks.md` | `Clarity edit with preserved procedure` |
| 12 | `docs/dashboard/security-checks.md` | `Clarity edit with preserved procedure` |
| 13 | `docs/faq.md` | `Navigation/link improvement` |
| 14 | `docs/get-started/connect-your-database-server.md` | `Navigation/link improvement` |
| 15 | `docs/get-started/register-for-an-account.md` | `Navigation/link improvement` |
| 16 | `docs/get-started/releem-overview.md` | `No change` |
| 17 | `docs/get-started/troubleshoot-releem-agent.md` | `Clarity edit with preserved procedure` |
| 18 | `docs/installation/installation-methods/aws-rds.md` | `Safety exception` |
| 19 | `docs/installation/installation-methods/azure-database-for-mysql.md` | `Safety exception` |
| 20 | `docs/installation/installation-methods/clusters.md` | `Navigation/link improvement` |
| 21 | `docs/installation/installation-methods/docker.md` | `Safety exception` |
| 22 | `docs/installation/installation-methods/gcp-cloud-sql.md` | `Safety exception` |
| 23 | `docs/installation/installation-methods/kubernetes.md` | `Safety exception` |
| 24 | `docs/installation/installation-methods/linux-manual.md` | `Safety exception` |
| 25 | `docs/installation/installation-methods/whm-cpanel.md` | `Safety exception` |
| 26 | `docs/installation/installation-methods/windows.md` | `Safety exception` |
| 27 | `docs/installation/linux-automatic.md` | `Safety exception` |
| 28 | `docs/installation/manage-the-releem-agent/configuration.md` | `Safety exception` |
| 29 | `docs/installation/manage-the-releem-agent/logs.md` | `Clarity edit with preserved procedure` |
| 30 | `docs/installation/manage-the-releem-agent/migrate.md` | `Safety exception` |
| 31 | `docs/installation/manage-the-releem-agent/uninstall.md` | `Safety exception` |
| 32 | `docs/installation/manage-the-releem-agent/update.md` | `Safety exception` |
| 33 | `docs/recommendations/configuration-tuning/apply-manually/aws-rds.md` | `Clarity edit with preserved procedure` |
| 34 | `docs/recommendations/configuration-tuning/apply-manually/docker.md` | `Clarity edit with preserved procedure` |
| 35 | `docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md` | `Clarity edit with preserved procedure` |
| 36 | `docs/recommendations/configuration-tuning/apply-manually/linux.md` | `Safety exception` |
| 37 | `docs/recommendations/configuration-tuning/apply-manually/windows.md` | `Clarity edit with preserved procedure` |
| 38 | `docs/recommendations/configuration-tuning/apply-using-agent.md` | `Clarity edit with preserved procedure` |
| 39 | `docs/recommendations/configuration-tuning/apply-using-cron.md` | `Safety exception` |
| 40 | `docs/recommendations/configuration-tuning/apply-using-portal.md` | `Safety exception` |
| 41 | `docs/recommendations/configuration-tuning/configuration-example.md` | `Clarity edit with preserved procedure` |
| 42 | `docs/recommendations/configuration-tuning/initial-mysql-configuration.md` | `Safety exception` |
| 43 | `docs/recommendations/configuration-tuning/limit-mysql-memory.md` | `Clarity edit with preserved procedure` |
| 44 | `docs/recommendations/configuration-tuning/mysql-tuning-process.md` | `Clarity edit with preserved procedure` |
| 45 | `docs/recommendations/configuration-tuning/rollback.md` | `Clarity edit with preserved procedure` |
| 46 | `docs/recommendations/overview.md` | `Navigation/link improvement` |
| 47 | `docs/recommendations/query-optimization/automatic-schema-changes.md` | `No change` |
| 48 | `docs/recommendations/query-optimization/disable.md` | `Clarity edit with preserved procedure` |
| 49 | `docs/recommendations/query-optimization/enable.md` | `Safety exception` |
| 50 | `docs/recommendations/query-optimization/overview.md` | `Clarity edit with preserved procedure` |
| 51 | `docs/recommendations/query-optimization/prepared-statements.md` | `Clarity edit with preserved procedure` |
| 52 | `docs/recommendations/query-optimization/schema-change-troubleshooting.md` | `No change` |
| 53 | `docs/supported-databases/mysql/required-permissions.md` | `Safety exception` |
| 54 | `docs/supported-databases/postgresql/install-on-linux.md` | `Safety exception` |

## No-change records

- `docs/get-started/releem-overview.md`: The user-approved Overview pilot already supplies a purpose-first introduction and direct next links while preserving its image and route. No further change is inventoried.
- `docs/recommendations/query-optimization/automatic-schema-changes.md`: The 34 code fences and the complete setup, preflight, permissions, capacity, approval, and tool-reference sequence are specialist material. Generic shortening would destroy useful operational detail, so no editorial change is inventoried.
- `docs/recommendations/query-optimization/schema-change-troubleshooting.md`: The page is already organized by failure stage. Preserve the manifest's **6 procedure headings** exactly: `Schema Change Troubleshooting` (H1, line 7); `Releem Did Not Find a Safe Automatic Method` (H2, line 32); `Backup or Execution Failed` (H2, line 41); `Disk Space and Filesystem Checks` (H3, line 47); `Backup Directory Checks` (H3, line 58); and `Pre-change Backup Tools` (H3, line 67). Separately preserve the manifest's **7 recovery headings** exactly: `Schema Change Troubleshooting` (H1, line 7); `Errors Before Execution Starts` (H2, line 21); `Backup or Execution Failed` (H2, line 41); `Backup Directory Checks` (H3, line 58); `Pre-change Backup Tools` (H3, line 67); `Other Execution Errors` (H3, line 104); and `No Statement Was Applied` (H2, line 112). No editorial change is inventoried until product/agent error-contract questions are answered.

## Navigation/link improvement records

These treatments are findability proposals only. They do not authorize route, source-path, front-matter, or article-body changes.

| Source page | Precise findability issue | Smallest proposed treatment |
|---|---|---|
| `docs/account/billing/payment-information.md` | The only path is a receipt-email link; a user without that email reaches an unlinked “contact us” dead end. | Add one approved account/billing recovery link adjacent to the receipt-email instruction; keep the route and existing payment-update statement. |
| `docs/account/overview.md` | The Account category owner only points to server Settings and does not route to Access, Billing, or cancellation tasks. | Add three direct links to the existing Access, Payment Information, and Cancellation pages; do not change their order, routes, or content. |
| `docs/dashboard/overview.md` | The block tour mixes observations and proposed actions, and its visible labels differ from specialist-page/sidebar labels. | Add direct task labels/links that distinguish observed Dashboard data from Recommendations; preserve the block order, route, image, and detailed feature prose. |
| `docs/faq.md` | Five answers lack links to their existing local task owners; one answer already has the correct local link, and the latency answer has only an external destination. | Use only these current question-heading → existing canonical-route mappings: `I've installed Releem Agent. How do I check if I've done it correctly?` → `/get-started/troubleshoot-releem-agent` (already linked; no change); `I applied all recommendations, but Releem Score is not 100%. How can I improve it?` → `/dashboard/health-checks`; `I applied all recommendations, but not all Health Checks are checked. How can I improve it?` → `/dashboard/health-checks`; `Would Releem automatically change MySQL configuration without my approval?` → `/recommendations/configuration-tuning/apply-using-portal`, `/recommendations/configuration-tuning/apply-using-agent`, and `/recommendations/configuration-tuning/apply-using-cron`, adjacent to the corresponding Portal, SSH-command, and cron statements; `How do I add my business details and the VAT number?` → `/account/billing/payment-information`; `How do I get an invoice?` → `/account/billing/payment-information`. For `Why does high latency occur after applying the recommended configuration?`, preserve the current question and external link and propose no local link until a canonical local owner is identified. Preserve `/faq`, question order, routes, and the external-canonical decision. |
| `docs/get-started/connect-your-database-server.md` | The chooser omits the existing Azure guide and does not explicitly expose MariaDB routing; “sign up here” and support are unlinked. | Add the existing Azure destination and approved registration/support links, and label the existing MySQL/MariaDB path without changing any route or installation procedure. |
| `docs/get-started/register-for-an-account.md` | The steps provide neither a registration destination nor a direct next step to connect a server. | Add the approved registration URL and one link to `Connect Your Database Server`; preserve the three-step sequence and all trial/identity facts pending product review. |
| `docs/installation/installation-methods/clusters.md` | The page delegates to permissions and Linux manual setup but does not help the reader identify which node/topology guidance applies. | Add a compact “before you continue” link group to the existing permissions, Linux manual, Agent verification, and support destinations; do not change the cluster-support claim or route. |
| `docs/recommendations/overview.md` | The category owner links only Portal Apply and Rollback even though the sidebar contains distinct manual, Agent, Cron, memory, process, and query-optimization owners. | Add a short task router to those existing pages and label review versus apply versus rollback; preserve all current state descriptions, image placement, and route. |

## Clarity edits with preserved procedures

Every proposal below is additive or sentence-level. Code fences remain byte-for-byte intact, images stay at their current placements, and named procedures remain present. “None” means the manifest records a zero count, not permission to replace the page.

| Source page | User task improved | Retained manifest evidence | Smallest intended change |
|---|---|---|---|
| `docs/account/access/users-and-roles.md` | Invite a collaborator, select a role, change a role, or remove access. | **0** code fences; **2** images: `dashboard-settings-invitation.png`, `dashboard-settings-invitation-popup.png`; **0** procedure and **0** recovery headings recorded. | Correct sentence-level grammar and make the existing invite/change/remove sequences explicitly numbered; do not alter role capability claims or screenshots. |
| `docs/account/billing/cancel-subscription.md` | Cancel a subscription and retain confirmation evidence. | **0** code fences; **0** images; **0** procedure and **0** recovery headings recorded. | Add a one-sentence outcome/prerequisite lead and label the existing five steps consistently; do not add unverified effective-date, refund, or data-retention behavior. |
| `docs/dashboard/deadlocks.md` | Understand what deadlock evidence is available and where to inspect it. | **0** code fences; **2** images: `releem-deadlock-monitoring.png`, `releem-deadlock-monitoring-details.png`; **0** procedure and **0** recovery headings recorded. | Separate detected evidence from suggested action and soften absolute timing/outcome wording without changing the two-image explanation or external detail link. |
| `docs/dashboard/health-checks.md` | Interpret the four health-check blocks and their metrics. | **0** code fences; **1** image: `releem-dashboard-health-checks.png`; **1** procedure heading: `Health Checks`; **0** recovery headings. | Add a plain-language “what to review” lead and scope outcome claims; keep every block and metric entry. |
| `docs/dashboard/process-list.md` | Use Process List to investigate active connections and query contention. | **0** code fences; **1** image: `releem-process-list.png`; **0** procedure and **0** recovery headings recorded. | Distinguish observation from termination/action implications and scope “real-time/all” claims; retain the four use cases and article link. |
| `docs/dashboard/query-analytics.md` | Sort query evidence and inspect one query before requesting recommendations. | **0** code fences; **3** images: `releem-dashboard-query-analytics.png`, `releem-dashboard-query-analytics.gif`, `releem-dashboard-query-analytics-inspection.png`; **0** procedure and **0** recovery headings recorded. | Add one sentence separating observed analytics from proposed optimization and make the three existing tasks parallel; retain every column, step, and image. |
| `docs/dashboard/reports.md` | Understand the contents and purpose of a weekly report. | **0** code fences; **1** image: `releem-weekly-report.png`; **0** procedure and **0** recovery headings recorded. | At source line 9, replace only `performance insights such as Latency and QPS improvements` with wording that reports Latency and QPS changes without presuming improvement. At source line 35, replace only the sentence `By staying informed and proactively addressing potential issues, you can ensure your database operates optimally and meets your business requirements.` with a qualified instruction to review reported trends and potential issues against the reader's operational requirements. Reviewer-driven scope correction: also replace line 25's `Latency and QPS improvements` and attributed-effectiveness wording with neutral observed changes and require comparison with the reader's operational baseline and workload context; retain the applied-recommendation and over-time review detail without asserting causation. This correction supersedes the earlier instruction to preserve that sentence verbatim. Preserve line 9's four-item report inventory, all four numbered content sections, all three benefit bullets, the other line 35 sentence, and the image at line 11. |
| `docs/dashboard/schema-checks.md` | Review a detected schema issue, test the proposed SQL, and choose manual or automatic execution. | **0** code fences; **1** image: `releem-schema-optimization.png`; **0** procedure and **0** recovery headings recorded. | Clarify detected issue versus proposed DDL and label the five existing steps as review/test/execute; retain all issue types and both follow-up links. |
| `docs/dashboard/security-checks.md` | Understand the aggregate Security Checks result and where to read remediation background. | **0** code fences; **1** image: `releem-security-checks.png`; **1** procedure heading: `Security Checks`; **0** recovery headings. | At source line 9, replace only `By proactively identifying security issues, Releem helps you maintain a secure database environment and comply with security best practices.` with a qualified statement that the results help the reader review identified issues. At source line 15, replace only `Regular monitoring with Releem's Security Checks ensures your MySQL database remains protected against evolving threats and maintains compliance with security best practices.` with an instruction to review Security Checks and use the linked guidance to assess identified issues. Preserve line 9's first sentence, the image at line 11, and the complete line 13 supplemental article link; do not add severities, states, or compliance guarantees. |
| `docs/get-started/troubleshoot-releem-agent.md` | Confirm Agent state, inspect local service health, and follow environment/error-specific recovery. | **3** fences: #0 plain at line 20, #1 plain at line 25, #2 `bash` at line 36; **1** image: `dashboard-releem-score.png`; **8** procedure headings: `How to Check if Releem Agent is Working`; `How to troubleshoot Releem Agent`; `In the MySQL log file: [Warning] Aborted connection 181 to db: 'mysql' user: 'releem' host: 'localhost' (Got timeout reading communication packets)`; `Releem Agent Installation Errors`; `Failed to determine service to restart. The automatic applying configuration will not work.`; `Failed to determine file my.cnf in default path. The automatic applying configuration is disabled.`; `No parameter specified in AwsRDSParameterGroup agent settings. The automatic applying configuration is disabled.`; `Error creating agent catalog for configurations`. **6** recovery headings: `How to troubleshoot Releem Agent`; `Releem Agent Common Issues`; `Releem Agent Installation Errors`; `Failed to determine service to restart. The automatic applying configuration will not work.`; `Failed to determine file my.cnf in default path. The automatic applying configuration is disabled.`; `Error creating agent catalog for configurations`. | Front-load the observable local-versus-Dashboard checks and label each existing fix with its environment and consequence; preserve all three fences, the image, diagnostics, and recovery instructions. |
| `docs/installation/manage-the-releem-agent/logs.md` | Find Agent logs for Debian, CentOS, AWS, or Docker. | **3** fences: #0 `bash` at line 18, #1 `bash` at line 28, #2 `bash` at line 48; **0** images; **1** procedure heading: `How to Check Releem Agent Logs?`; **0** recovery headings. | Add a concise “choose your environment” lead and a non-factual reminder to review before sharing; retain all tabs, locations, and commands. |
| `docs/recommendations/configuration-tuning/apply-manually/aws-rds.md` | Apply a recommended configuration through an RDS parameter group and verify it. | **0** code fences; **0** images; **5** procedure headings: `How to apply the Recommended Configuration for AWS RDS`; `Step 1: Modify the Parameter Group in AWS RDS`; `Step 2: Apply the Parameter Group to Your RDS Instance`; `Step 3: Reboot the RDS Instance`; `Step 4: Verify the Applied Configuration`; **0** recovery headings. | Add a prerequisite to record the assigned group/current values and make immediate-versus-maintenance-window impact explicit as a decision; retain every step. |
| `docs/recommendations/configuration-tuning/apply-manually/docker.md` | Copy configuration, update MySQL container configuration, restart, and verify. | **1** fence: #0 `bash` at line 25; **0** images; **5** procedure headings: `How to apply the Recommended Configuration for MySQL in Docker`; `Step 1: Copy the Recommended Configuration`; `Step 2: Modify the my.cnf file`; `Step 3: Restart Docker container`; `Step 4: Verify the Applied Configuration`; **0** recovery headings. | Clarify which file/container the current text refers to and add a pre-restart review checkpoint; keep the restart fence and all four steps unchanged. |
| `docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md` | Apply flags in Cloud SQL and verify provider/Releem state. | **0** code fences; **0** images; **5** procedure headings: `How to apply the Recommended Configuration for GCP Cloud SQL`; `Step 1: Get the Recommended Configuration`; `Step 2: Configure Database Flags in GCP Cloud SQL`; `Step 3: Apply the Changes`; `Step 4: Verify the Applied Configuration`; **0** recovery headings. | Separate provider confirmation from the Releem event check and clearly label immediate versus maintenance timing as user choices where available; retain all steps. |
| `docs/recommendations/configuration-tuning/apply-manually/windows.md` | Copy configuration into `my.ini`, restart the service, and verify. | **0** code fences; **0** images; **5** procedure headings: `How to apply the Recommended Configuration for Windows`; `Step 1: Copy the Recommended Configuration`; `Step 2: Modify the my.ini File`; `Step 3: Restart the MySQL Database Service`; `Step 4: Verify the Applied Configuration`; **0** recovery headings. | Add a prerequisite to identify the active `my.ini` and review the pasted settings; preserve the location, encoding, restart, and verification details pending version evidence. |
| `docs/recommendations/configuration-tuning/apply-using-agent.md` | Select the OS-specific Agent command and understand cloud-managed routing. | **2** fences: #0 `bash` at line 19 and #1 `powershell` at line 24; **0** images; **1** procedure heading: `How to Apply Configuration Using Agent`; **0** recovery headings. | Add a brief preflight/expected-result frame and link the existing Rollback owner; retain both commands and the cloud-managed note while leaving rollback guarantees as an open product question. |
| `docs/recommendations/configuration-tuning/configuration-example.md` | Read an example recommendation without treating it as a universal configuration. | **1** fence: #0 plain at line 14; **1** image: `releem-dashboard-recommended-configuration.png`; **1** procedure heading: `Example of Recommended Configuration`; **0** recovery headings. | Add an explicit illustrative/non-runnable label and explain “Previous value” using only the page's existing context; retain the complete sample and image byte-for-byte. |
| `docs/recommendations/configuration-tuning/limit-mysql-memory.md` | Set and interpret Releem's MySQL memory target. | **0** code fences; **1** image: `dashboard-settings.png`; **0** procedure and **0** recovery headings recorded. | State before the steps that this is a tuning target, not an enforced cap, and make the existing FAQ explanation the interpretation anchor; retain the three steps, timing statement pending review, and image. |
| `docs/recommendations/configuration-tuning/mysql-tuning-process.md` | Understand the five-stage recommendation process before applying. | **0** code fences; **0** images; **2** procedure headings: `Stage 4: Preparing New Configuration`, `Stage 5: Applying Recommended Configuration`; **0** recovery headings. | Make collection, proposal, review, and application boundaries explicit with sentence-level edits; retain all five stages and the controlled-workload/AI explanation unless separately fact-reviewed. |
| `docs/recommendations/configuration-tuning/rollback.md` | Run the existing rollback command. | **1** fence: #0 plain at line 10; **0** images; **1** procedure and **1** recovery heading: `How to Rollback to Previous Configuration`. | Add a concise scope/expected-result lead and a link to logs/support for failure; retain the rollback fence exactly and do not invent what state is restored. |
| `docs/recommendations/query-optimization/disable.md` | Disable collection per deployment type and restart/recreate the Agent. | **7** fences: #0 `bash` line 19, #1 `ini` line 25, #2 `bash` line 31, #3 `bash` line 40, #4 `yaml` line 50, #5 `bash` line 57, #6 `bash` line 68; **0** images; **1** procedure heading: `Disable SQL Query Optimization`; **0** recovery headings. | Add one outcome/verification paragraph and label retained-data/permission revocation as unresolved; preserve every tab and all seven fences. |
| `docs/recommendations/query-optimization/overview.md` | Review a query recommendation and distinguish it from observed Query Analytics. | **1** fence: #0 `sql` at line 37; **2** images: `releem-query-optimization.png`, `releem-query-optimization-details.png`; **2** procedure headings: `How Automatic Query Optimization Works`, `Manual Query Optimization`; **0** recovery headings. | Clarify observation, proposal, implementation, and result-validation phases; retain the SQL example, both images, and both automatic/manual workflows. |
| `docs/recommendations/query-optimization/prepared-statements.md` | Understand missing prepared-statement visibility and locate application-specific mitigations. | **1** fence: #0 plain at line 41; **0** images; **0** procedure and **0** recovery headings recorded. | Separate the documented limitation from the proposed client-side workaround and add a test/reversal caution without changing the PHP command or Java/PHP guidance. |

No clarity entry permits generic shortening, removal of a detailed specialist page, movement of commands into an overview, or replacement of working instructions with “contact support.”

## Safety-exception candidates pending decision

Each record identifies the smallest risky or sensitive scope. The proposed public treatment is deliberately non-executable. None of these records is copied into the active manifest `safetyExceptions` array by this task.

### S01 — AWS RDS installation

- **Page and identity:** `docs/installation/installation-methods/aws-rds.md`; fences #1/#3 at lines 67/110, SHA-256 `89731c0433d72605b4edf70e52483834d4cc99ae7099fa00b211d33891fcc6ca` (wildcard-resource IAM policy); fence #2, line 87, SHA-256 `85bd9bd0021f1b9c1bc9bd7d7aaad885d5af5b6ccf78827f33e09b752d23c27d` (credentials/API key in a privileged remote-script invocation); fences #4/#5 at lines 133/149, SHA-256 `51c62034ea7f521c8e364225ef450844789e85462d98288259d01680b7599650` and `1d509a3babde76539c39d233ea74951fb0cb4c2d308bebbc1b398b61fd8ce584` (container-environment secrets); prose line 52 (“Allow All Outbound”).
- **Why clearly unsafe or sensitive:** The runnable example combines wildcard cloud resources, broad outbound access, database/API secrets in process invocation, and privileged execution of fetched code.
- **Candidate public treatment:** Replace only those scoped executable examples with a non-executable permissions/secret/provenance checklist and direct the reader to a separately reviewed, versioned installer path. For prose line 52 specifically, replace “Allow All Outbound” with a non-executable bounded-egress prerequisite: Security must approve the exact destinations, ports, and protocol before access is configured; the audit does not supply or authorize an allow-all rule. Retain the remaining RDS requirements and troubleshooting detail.
- **Private preservation path:** `.agent/archive/2026-09-03/aws-rds-installation-DO-NOT-RUN.md`.
- **Release-review question:** Can Engineering/Security provide a versioned template, bounded IAM/resource/egress policy, and secret-delivery mechanism that preserves both monitoring and optional apply capabilities?

### S02 — Azure Database for MySQL installation

- **Page and identity:** `docs/installation/installation-methods/azure-database-for-mysql.md`; fence #3, line 56, SHA-256 `a62e495799904e3cfc6f73b9e8313ab91e5017c77415722ccb0c98b109abe77c` (database/API secrets plus fetched script as root); fence #5, line 92, SHA-256 `377e4d8c60365f996139801b5d3c3bc1fb792bf4a86e477e865ee308e768bc8c` (secrets in container environment); prose line 107 (service-principal secret in environment).
- **Why clearly unsafe or sensitive:** The public instructions place reusable credentials in command/container environments and execute unpinned remote content with root privileges.
- **Candidate public treatment:** Show only identity prerequisites, required fields, and a non-executable choice between managed identity and an approved secret source until a reviewed installer/container pattern exists.
- **Private preservation path:** `.agent/archive/2026-09-03/azure-mysql-installation-DO-NOT-RUN.md`.
- **Release-review question:** Is managed identity the required default, and what exact custom role, artifact verification, and secret source are approved for Linux and Docker?

### S03 — Docker installation

- **Page and identity:** `docs/installation/installation-methods/docker.md`; fence #0, line 19, SHA-256 `7a1365ff007ad0885d61601a4219327dd6b77c41f297d0d2e8a16457db540477`; fence #1, line 35, SHA-256 `e48ea63c07fb3feed97dcb10e93464380104153d8f8d62c13b06e953ec76c83c`.
- **Why clearly unsafe or sensitive:** Both runnable variants pass the Releem API key and database password as ordinary container environment values; the Compose example also uses an unversioned image.
- **Candidate public treatment:** Retain the parameter and volume explanation but replace the runnable secret-bearing examples with a non-executable deployment checklist pending an approved secret-store and immutable-image pattern.
- **Private preservation path:** `.agent/archive/2026-09-03/docker-installation-DO-NOT-RUN.md`.
- **Release-review question:** Which image digest/tag, Docker secret mechanism, filesystem ownership, health check, and network boundary are supported?

### S04 — GCP Cloud SQL installation

- **Page and identity:** `docs/installation/installation-methods/gcp-cloud-sql.md`; prose lines 16 and 33 (“Full access/Full Api Access”); fence #1, line 36, SHA-256 `d70d4627b063190fd9feed8a8c18eb47eac70e8c977828989d84f2e03a6375ac`; fences #2/#3 at lines 64/80, SHA-256 `bd590173cdd203cfc5a62c948ad2d34af667f7ef0d59ad4e59f4e045019c5df6` and `702dfab8bfec6a5324ff310ad72a70d3a4efe9cf37a48a262aac67d33f12fddf`.
- **Why clearly unsafe or sensitive:** The guide requests broad cloud access, exposes database/API secrets in runnable process/container environments, and executes fetched code as root.
- **Candidate public treatment:** Publish a non-executable capability-to-role and secret/provenance checklist while preserving the provider requirements and diagnostics.
- **Private preservation path:** `.agent/archive/2026-09-03/gcp-cloud-sql-installation-DO-NOT-RUN.md`.
- **Release-review question:** What least-privilege roles, workload identity, egress, verified artifact, and secret-delivery paths are approved for observation versus configuration apply?

### S05 — Kubernetes installation

- **Page and identity:** `docs/installation/installation-methods/kubernetes.md`; fence #0, line 12, SHA-256 `29daec2870d74102ad1a2d1cd54e4907aeca4aea5efbc68af31b8f18b2191542`, especially manifest lines 105–117 and 176–188.
- **Why clearly unsafe or sensitive:** The runnable workload manifest embeds API and database credential values directly in Pod environment entries and duplicates them across primary/secondary Deployments.
- **Candidate public treatment:** Preserve the topology explanation but replace the manifest with a non-executable resource/secret/RBAC/network checklist until a reviewed Secret or workload-identity example is available.
- **Private preservation path:** `.agent/archive/2026-09-03/kubernetes-installation-DO-NOT-RUN.md`.
- **Release-review question:** What supported image, Secret/workload-identity model, service-account/RBAC, network policy, persistence, and health contract should the example implement?

### S06 — Manual Linux installation

- **Page and identity:** `docs/installation/installation-methods/linux-manual.md`; fence #0, line 19, SHA-256 `bdb7655c152a9eef87494c6df1249510bafa917787ab6a34ddd73404310902be`.
- **Why clearly unsafe or sensitive:** The runnable command places database/API credentials in the process invocation and executes remotely fetched code as root without a version or integrity check.
- **Candidate public treatment:** Keep the parameter definitions and CloudLinux link, but show a non-executable installation-input and verification checklist until a pinned installer and secret-input flow are approved.
- **Private preservation path:** `.agent/archive/2026-09-03/linux-manual-installation-DO-NOT-RUN.md`.
- **Release-review question:** What installer version/hash/signature and interactive or file-based secret flow should replace the current command?

### S07 — WHM/cPanel installation

- **Page and identity:** `docs/installation/installation-methods/whm-cpanel.md`; fence #0, line 24, SHA-256 `45170afa3c9f4d94b7607ff1d6e015497c673b0b689c9ed8faad14cf3f806964`; fence #2, line 68, SHA-256 `e72f136ba7cadc1f29dd9820952f0ab5c54e56c7ce74a99813c98b8087e40844`.
- **Why clearly unsafe or sensitive:** The installation path places an API key in command arguments and executes a mutable remote script as root; the same remote entry point performs uninstall while the page says it changes cPanel settings but supplies no restoration inventory.
- **Candidate public treatment:** Retain prerequisites, described side effects, UI verification, logs, and troubleshooting; replace install/uninstall commands with a non-executable reviewed-installation notice and required backup/restoration checklist.
- **Private preservation path:** `.agent/archive/2026-09-03/whm-cpanel-installation-DO-NOT-RUN.md`.
- **Release-review question:** Can Engineering document a pinned package/script, protected API-key input, exact cPanel before/after settings, and verified uninstall restoration?

### S08 — Windows installation

- **Page and identity:** `docs/installation/installation-methods/windows.md`; fence #0, line 13, SHA-256 `e59d11d6573ed318354c2f2084d26d7f819bcaf35efc3070ce7c116c12a3d21c`; fence #1, line 48, SHA-256 `06a7b79a103ce5aa2b21d19b30a0f170a5e886f164227a53b3467eaf43f6dfb2`.
- **Why clearly unsafe or sensitive:** The automatic command exposes API/root credentials in environment variables and pipes downloaded PowerShell into execution as Administrator; the manual example stores API/database secrets in plaintext configuration without ACL guidance.
- **Candidate public treatment:** Preserve folder/service/configuration-field detail, but replace executable secret-bearing setup with non-executable signature/checksum, protected-config, and verification requirements.
- **Private preservation path:** `.agent/archive/2026-09-03/windows-installation-DO-NOT-RUN.md`.
- **Release-review question:** What signed binary/script verification, Windows credential source, file ACL, and rollback/removal process are supported?

### S09 — Automatic Linux installation screenshot

- **Page and identity:** `docs/installation/linux-automatic.md`; prose lines 17–19 and image placement line 21, `static/img/releem-dashboard-agent-automatic-installation.png`, alt `Releem Agent Installation Command`.
- **Why clearly unsafe or sensitive:** The workflow asks for a MySQL root password to build a root-executed command, and direct visual inspection confirms that the screenshot displays a UUID-format API-key value in the generated command (the value is intentionally not reproduced here).
- **Candidate public treatment:** Keep the placement reserved but show only a non-executable explanation of required inputs and a security-reviewed redacted capture or neutral placeholder after approval.
- **Private preservation path:** `.agent/archive/2026-09-03/linux-automatic-screenshot-DO-NOT-RUN.md`.
- **Release-review question:** Does the stored image expose credential-like command content, and can Product/Security supply a current fully redacted capture plus an approved generated-command handling model?

### S10 — Agent configuration example

- **Page and identity:** `docs/installation/manage-the-releem-agent/configuration.md`; fence #0, line 15, SHA-256 `636caa167d53b5277bd3f962426031c53f3df68ffe49cd4a8147011dc2ec9609`, especially credential fields at lines 16–17, 55–71.
- **Why clearly unsafe or sensitive:** The copyable configuration contains API/database credential fields and default-looking database password values without file-permission, secret-source, or redaction guidance.
- **Candidate public treatment:** Retain every setting name and description in a non-executable reference, but replace credential values with unmistakable placeholders and add a reviewed protected-file/secret-source notice.
- **Private preservation path:** `.agent/archive/2026-09-03/agent-configuration-example-DO-NOT-RUN.md`.
- **Release-review question:** Which secret sources, filesystem permissions, TLS modes, and redaction rules are supported for each deployment?

### S11 — Agent migration order

- **Page and identity:** `docs/installation/manage-the-releem-agent/migrate.md`; prose line 21 (uninstall source first), lines 23–34 (install destination and reuse old hostname), and fence #0, line 32, SHA-256 `2d3f7b021aa6a4d36dda516aae738aa210ef195592ac110d391680eeb907300d`.
- **Why clearly unsafe or sensitive:** The procedure removes the working source before destination validation and reuses identity to preserve history without defining overlap, rollback, or data-association behavior.
- **Candidate public treatment:** Replace the ordered action list with a non-executable migration decision/validation checklist until source/destination overlap and rollback semantics are verified; retain prerequisites and both intended outcomes.
- **Private preservation path:** `.agent/archive/2026-09-03/agent-migration-DO-NOT-RUN.md`.
- **Release-review question:** Must the source be stopped or uninstalled before destination activation, how is identity/history bound, and what restores service if destination validation fails?

### S12 — Agent uninstallation

- **Page and identity:** `docs/installation/manage-the-releem-agent/uninstall.md`; fences #0–#3 at lines 19, 30, 36, and 43 with SHA-256 values `fbff726cdc416fff663f6f4fb292372605db35028c24dd87f01597d57536ef5f`, `3b46aabb9f110f43c9a9bac6a1d1ea015f0196ea4ddd3b65cf5e631702889e95`, `4b5962624777bb215d337876acd34995efdd0ab9711e7b6fbf93e879fac3c9ea`, and `5d1bc55c5faf02d4cf3201ba27024d6db9f5dea701164a61c73700c339fa5d35`; prose line 49 exactly: “If the agent was installed by CloudFormation, delete the `releem-agent` CloudFormation stack.”
- **Why clearly unsafe or sensitive:** These executable paths fetch privileged removal code or force-remove containers/stacks without a preserved/deleted-state inventory, preview, recovery, credential cleanup, or post-removal validation.
- **Candidate public treatment:** Publish only a non-executable removal checklist describing what must be inventoried and verified for each environment until reviewed, bounded uninstall procedures exist. For prose line 49 specifically, replace the direct stack-deletion instruction with a non-executable CloudFormation resource/dependency inventory, retained-state and recovery review, and explicit confirmation gate; do not instruct deletion until that review is approved.
- **Private preservation path:** `.agent/archive/2026-09-03/agent-uninstall-DO-NOT-RUN.md`.
- **Release-review question:** Exactly which files, services, database users, credentials, volumes, cloud resources, and product records are removed or retained, and how can an accidental removal be recovered?

### S13 — Agent update automation

- **Page and identity:** `docs/installation/manage-the-releem-agent/update.md`; fence #1, line 44, SHA-256 `f8b0a7a453c882a45703ed39e338ca2982624ef095f1531f1d866fd858521791`; fence #3, line 56, SHA-256 `c4b856a5e7c84b7ca7585b598778c8ca9abbd34e4572ba7659ca31ec118050bb`; prose line 63 (direct binary overwrite).
- **Why clearly unsafe or sensitive:** The guide downloads executable update code without integrity verification, makes it executable, schedules it unattended as cron, and overwrites the Windows binary without a rollback/version check.
- **Candidate public treatment:** Retain platform selection and update intent, but replace automatic commands with a non-executable version/verification/health/rollback checklist.
- **Private preservation path:** `.agent/archive/2026-09-03/agent-update-DO-NOT-RUN.md`.
- **Release-review question:** What signed/versioned artifacts, supported update cadence, health gate, and prior-version rollback are approved for Linux, containers, AWS, and Windows?

### S14 — Manual Linux configuration apply special case

- **Page and identity:** `docs/recommendations/configuration-tuning/apply-manually/linux.md`; fence #2, line 34, SHA-256 `da6188bafa0dc22d4787f0b5713a11df8ba5a1606e8a1d374dc2c3eaff58208a`.
- **Why clearly unsafe or sensitive:** The runnable special case stops MySQL and moves InnoDB log files without a backup, validated version guard, expected state, or recovery path; misuse can prevent restart or lose recoverability.
- **Candidate public treatment:** Preserve the general copy/restart/verify procedure, but replace only the special-case fence with a non-executable stop-and-escalate notice pending DBA-approved recovery steps.
- **Private preservation path:** `.agent/archive/2026-09-03/manual-linux-logfile-special-case-DO-NOT-RUN.md`.
- **Release-review question:** Is this special case still supported for any version, and what backup, shutdown mode, file validation, restart check, and recovery sequence are required?

### S15 — Cron-based configuration apply

- **Page and identity:** `docs/recommendations/configuration-tuning/apply-using-cron.md`; fence #0, line 15, SHA-256 `52025b12b635ad4279419633f09a71d45f8edbbb0c36b6517b7b73d66a64d77e`; fence #2, line 33, SHA-256 `f8816c671b66e82ca0e2513f195a665a8181a924fb1a995a9dd400b3390e261a`.
- **Why clearly unsafe or sensitive:** The page schedules unattended production configuration mutation while asserting minimal risk/automatic rollback without approval freshness, locking, maintenance guard, validation, alerting, or failed-rollback handling.
- **Candidate public treatment:** Replace the runnable scheduling example with a non-executable automation prerequisites checklist; retain the concept and maintenance-window caution.
- **Private preservation path:** `.agent/archive/2026-09-03/cron-configuration-apply-DO-NOT-RUN.md`.
- **Release-review question:** What approval lifetime, lock, maintenance condition, alert, validation, rollback trigger, and failed-run recovery make unattended apply supportable?

### S16 — Portal apply troubleshooting and log sharing

- **Page and identity:** `docs/recommendations/configuration-tuning/apply-using-portal.md`; prose lines 94 and 100 directing raw `journalctl` output to `hello@releem.com`; prose line 157 exactly: `**User Action**: send us please the [Releem Agent logs](https://docs.releem.com/installation/manage-the-releem-agent/logs) to hello@releem.com`; fences #0 and #1 at lines 39 and 44, SHA-256 `ab7f1801c712cc2fe640e75e46667b234b8efb06ebae07dc27832a3915c92cfa` and `f20ec60f9dd99c59cedaf46e4fa2a0b69f555ab3206516a7a8c59cf043adf478`, which generate global administrative grants.
- **Why clearly unsafe or sensitive:** Raw Agent logs can contain operational/query/credential context and are requested without redaction or approved transfer guidance; the troubleshooting path also generates broad global privileges as a quick fix.
- **Candidate public treatment:** Keep the error catalog and image, but replace all three raw-log email instructions at lines 94, 100, and 157 with a non-executable pre-sharing review/redaction checklist and an approved-transfer-channel placeholder; replace generated-grant instructions with non-executable capability-specific permission checks.
- **Private preservation path:** `.agent/archive/2026-09-03/portal-apply-troubleshooting-DO-NOT-RUN.md`.
- **Release-review question:** Which log fields must be redacted, what transfer channel is approved, and what exact privileges are required for each no-restart apply operation?

### S17 — Initial MySQL configuration apply

- **Page and identity:** `docs/recommendations/configuration-tuning/initial-mysql-configuration.md`; fence #0, line 30, SHA-256 `11015306a907bb8db23c36499982af177274660e4c026b6cd8143e700c8e23bd`; fence #1, line 44, SHA-256 `cf068099b49af9ec500e0b09268d7b9f69bfaea1c7ce1031dffd42caf8b39bcf`.
- **Why clearly unsafe or sensitive:** The commands generate and immediately apply a hardware-derived configuration, optionally restarting MySQL, without backup, diff/syntax/version validation, workload check, rollback, or failed-start recovery.
- **Candidate public treatment:** Preserve the use case and generated-file location, but replace runnable apply/restart fences with a non-executable review-and-validation checklist until a DBA-approved procedure exists.
- **Private preservation path:** `.agent/archive/2026-09-03/initial-mysql-configuration-DO-NOT-RUN.md`.
- **Release-review question:** Which MySQL/MariaDB versions and server states are eligible, and what backup, validation, restart, rollback, and recovery checks are mandatory?

### S18 — Enable SQL Query Optimization

- **Page and identity:** `docs/recommendations/query-optimization/enable.md`; fence #0, line 27, SHA-256 `00e8267aa00edfbbe7d0478a40298f2ba402420ac745ad1d1e59e07053515bbb`; fence #1, line 32, SHA-256 `1fdea3428eb95c6f7027e0e8f015b971e329ab46f2d43223775dcf88fc4d4964`; prose line 36 permits root passwords in installer variables; PostgreSQL read grants in fences #4/#18 at lines 60/219, SHA-256 `3b0d834b855db2c93d6467f5e004e5a4eb1c7cf623ecc5a96e3fb40a3cffa6ca` and `ef07192ee65e4951b54dee40bee10027d2740ad45cfd581dde660eafe34956e7`.
- **Why clearly unsafe or sensitive:** The enablement helpers execute mutable remote code and can receive administrative database credentials; the broader page changes database permissions/configuration across several environments without a common preflight or recovery boundary.
- **Candidate public treatment:** Preserve engine/deployment distinctions and the data-collection explanation. For remote-helper fences #0/#1 and the root-password instruction at line 36, use a non-executable verified-artifact and approved secret-input checklist pending reviewed installers. Separately, for PostgreSQL grant fences #4/#18, use a non-executable least-privilege review that requires a supported-version capability-to-role mapping, explicit database/schema/object scope, verification of effective grants, and a revoke sequence before any SQL is offered; this grant treatment is distinct from the remote-helper treatment.
- **Private preservation path:** `.agent/archive/2026-09-03/query-optimization-enable-DO-NOT-RUN.md`.
- **Release-review question:** What supported engine/version matrix, least-privilege grants, verified helper artifact, collected-data scope, enablement success state, and reversal process apply to each tab?

### S19 — MySQL permissions

- **Page and identity:** `docs/supported-databases/mysql/required-permissions.md`; fences #0/#1 at lines 19/30 (SHA-256 `fe104f05187a8f693d7ca56451eb04fa4ffc41e4749df40a9f08fa86ad0e6dc2` and `2b18e3757aa338ae88e7b282b0c08f0c8e2b1df07d1e3118e898d0ae83d7f498`), repeated at #11/#12 on lines 146/157 and #15/#16 on lines 188/199; global-SELECT examples #2/#3 at lines 48/52, fences #6/#10 at lines 87/136 (both SHA-256 `ef0bc0ba0fa6ed0ab15e27269f00692e363fd193bdb9b7f3cd40482f855726b3`), and repeated examples #13/#14 on lines 175/179 and #17/#18 on lines 217/221. The remaining wildcard-host account examples are fences #4/#5/#8/#9 at lines 61/71/110/120, and the definer procedure is fence #7 at line 92.
- **Why clearly unsafe or sensitive:** A user described as read-only is created for wildcard hosts and receives global administrative (`SYSTEM_VARIABLES_ADMIN`/`SUPER`) or global data-read permissions. Copying these statements can unnecessarily expose every database and remote account surface.
- **Candidate public treatment:** Replace broad runnable defaults with a non-executable capability-to-permission matrix and host/scope selection checklist until DBA/Security approve exact versioned grants; preserve environment/version distinctions.
- **Private preservation path:** `.agent/archive/2026-09-03/mysql-permissions-DO-NOT-RUN.md`.
- **Release-review question:** For each engine/version/deployment and feature, what is the minimum account host, object scope, privilege set, verification query, rotation process, and revoke sequence?

### S20 — PostgreSQL Linux installation

- **Page and identity:** `docs/supported-databases/postgresql/install-on-linux.md`; fence #0, line 28, SHA-256 `e96dc6cde3787310f24823c2d66fde9825409b6390c07f8b75d5ba2bbe1ca5ee`; fence #4, line 79, SHA-256 `14af1918fbbd8a6fee6f66f38f81c68267e83732002fe4dc2cac97551be3c9fd`; fence #6, line 90, SHA-256 `11c0637d96f59302769162a051fe937d6392207d5b92489c3db8621d83391780`.
- **Why clearly unsafe or sensitive:** The procedure executes fetched code as root, passes database/API secrets in process invocation, and supplies an all-address `0.0.0.0/0` password-authentication rule for the monitoring account.
- **Candidate public treatment:** Retain PostgreSQL prerequisites, configuration fields, local HBA example, and extension setup, but replace remote installer/all-address examples with a non-executable network/TLS/secret/provenance checklist.
- **Private preservation path:** `.agent/archive/2026-09-03/postgresql-linux-installation-DO-NOT-RUN.md`.
- **Release-review question:** Which PostgreSQL versions/features, CIDR/TLS/authentication rule, least-privilege roles, verified installer, and secret-input method are supported for local and remote Agents?

## Unresolved questions

These questions do not authorize removing, replacing, or shortening existing useful content. Until answered, screenshot placements, code fences, procedures, and specialist pages remain preserved except for a separately approved safety exception.

### Product

- What observable state and freshness timestamp prove that an Agent is connected and that the Platform is receiving current metrics?
- Which recommendation states, first-result timings, update cadences, report contents, notification behavior, and automatic-rollback triggers are current and contractually supported?
- Which existing local page, if any, should own the FAQ's cold-cache/latency explanation? Until Product identifies one, should the current external link and FAQ answer remain unchanged?
- Which Account roles can invite, edit, apply, bill, cancel, transfer ownership, or revoke access, and what audit/expiry behavior applies?
- Is Paddle still the payment/cancellation owner, what happens at cancellation, and what recovery route works without a receipt email?
- Which hostname/license/history semantics govern Agent migration, overlap, removal, and retained product data?

### UI

- What are the current visible labels and state meanings for `Connected`, `Monitoring`, `Recommended Configuration`, `Configuration Tuning`, `Query Analytics`, `Query Optimization`, `Schema Checks/Optimization/Recommendations`, and `Security Checks/Status`?
- Which controls currently exist for Apply, Apply Without Restart, Apply and Restart, Get Recommendations, memory limits, invitations, billing, and cancellation?
- Which existing page should own the canonical first-data verification and first-recommendation review journeys without duplicating specialist procedures?
- Should `/faq` remain locally canonical, or should the current external canonical declaration continue?

### Database support and permissions

- Which exact MySQL, MariaDB, Percona, and PostgreSQL versions, editions, managed services, cluster topologies, and operating environments are supported?
- For each supported engine/deployment, which features cover metrics, Health/Security Checks, configuration recommendations/apply, Query Analytics/Optimization, schema checks/automatic DDL, and reports?
- What least-privilege database/cloud permissions, account hosts, object scopes, TLS/network rules, egress destinations, and credential-rotation/revocation steps are required per capability?
- Which configuration variables, prepared-statement behavior, package versions, DDL tools, backup methods, restart semantics, and recovery procedures are version-specific?

### Screenshots

- For each of the **24 preserved placements** across the current screenshot-bearing pages, what capture date, product version, engine/deployment context, and redaction approval should accompany the existing image?
- Is the Dashboard/Query Analytics capture that visibly says `Last updated: 2024.04.06 11:00` still current, and can Product Design supply current redacted replacements at the same placements for Dashboard, Settings, Query Analytics, Reports, Schema, Security, Recommended Configuration, Apply, and Query Optimization?
- Does `static/img/releem-dashboard-agent-automatic-installation.png` at `docs/installation/linux-automatic.md:21` expose credential-like/root-password or reusable generated-command material, and should Security approve a redacted replacement before release?
- Do the visibly rendered host/IP, SQL text, example names, and timestamp in `releem_dashboard.png` and the Query Analytics captures represent approved synthetic data, and do any other images or the GIF contain identifiers, emails, keys, passwords, or tokens that require redaction while preserving their placements?

## Audit boundary

This register does not approve publication, implementation, route changes, content deletion, navigation changes, asset replacement, or archive creation. A later bounded task must resolve the applicable questions, approve any safety exception explicitly, preserve the historical material privately as `DO NOT RUN`, update the active manifest authorization array, and re-run the preservation/release gates before changing public content.
