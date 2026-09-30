# Releem Documentation Directory Mirror and Redirects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the same 54 Releem documentation pages into a source-directory hierarchy that mirrors the approved seven-section sidebar, establish matching canonical URLs, and preserve every retired public route with deterministic Docusaurus redirect pages.

**Architecture:** The migration treats customer prose, commands, headings, screenshots, and factual claims as immutable. It permits only exact file moves plus migration-only front-matter, internal-link, and relative-asset-path changes needed to produce the new IDs and routes. A private migration map is the source of truth for all 54 path/ID/route pairs; a small root redirect module feeds `@docusaurus/plugin-client-redirects`, and tests prove that the sidebar, filesystem, canonical routes, redirect sources, and preserved content remain in one-to-one agreement.

**Tech Stack:** Node.js 20+, npm, Docusaurus 3.9.2, `@docusaurus/plugin-client-redirects` 3.9.2, JavaScript/ES modules, Markdown/MDX, Node built-in tests.

---

## Design decision

The repository currently has no redirect plugin or redirect file. Use the official Docusaurus 3.9.2 client-redirect plugin because the user previously selected Docusaurus redirects. Pin it to `3.9.2`, matching the rest of the Docusaurus family.

The plugin creates production-build HTML pages that redirect with client-side JavaScript; it does **not** emit HTTP 301 responses and is inactive under the development server. Do not describe these as server redirects. Validate them with `npm run build` followed by `npm run serve`. If HTTP-status redirects are later required by the hosting platform, that is a separate hosting task and must consume the same route map rather than introduce a second hand-maintained mapping.

Rejected alternatives:

1. Keeping the current folders and changing only `sidebars.js` leaves the mismatch that prompted this plan.
2. Moving files while retaining all current slugs would mirror the filesystem but not the public information architecture and would make the requested redirect work unnecessary.
3. Creating new category landing pages would violate the existing no-new-public-pages decision. Existing pages remain the six category owners, and FAQ remains the seventh top-level document.

## Migration boundaries

1. Begin from the completed preservation-first worktree on `docs/restructure-navigation-preview`.
2. Preserve all 54 page bodies semantically and textually except exact internal URL and relative asset-import tokens listed by the migration map.
3. Preserve all fenced commands, prose, headings, titles, `sidebar_label` values, images, and image bytes.
4. Front matter may change only in `id` and `slug`. Add both explicitly to every moved page; do not change titles or other metadata.
5. Do not create or remove a public page. The final `docs/` corpus remains exactly 54 Markdown files.
6. Do not add individual Security Check or Schema Check pages. Their aggregate pages and existing images remain intact.
7. Every current public route gets exactly one direct redirect to its final canonical route. Redirect chains, loops, duplicate sources, target collisions, and missing targets are hard failures.
8. Change every repository-owned internal documentation link to its final canonical target so ordinary navigation never depends on a redirect.
9. Keep external links and fragment identifiers unchanged unless the fragment belongs to a moved internal route; in that case change only the route portion.
10. Update only relative asset paths whose source depth changes. Do not move, rename, add, delete, or modify anything under `assets/images/` or `static/img/`.
11. Keep the root navbar logo and footer documentation link on the new canonical `/get-started` route so the built site does not internally depend on the `/` redirect.
12. Use npm directly. Do not use Docker for this plan.
13. Preserve the pre-existing `yarn.lock` modification and the two pre-existing user deletions under `.agent/`. Do not stage or commit work under this plan.
14. Search reindexing and any external release action remain separate approval gates.

## Final mirrored source tree

```text
docs/
├── get-started/
│   ├── releem-overview.md
│   ├── register-for-an-account.md
│   ├── connect-your-database-server.md
│   └── troubleshoot-releem-agent.md
├── supported-databases/
│   ├── mysql/
│   │   └── required-permissions.md
│   └── postgresql/
│       └── install-on-linux.md
├── installation/
│   ├── linux-automatic.md
│   ├── installation-methods/
│   │   ├── linux-manual.md
│   │   ├── windows.md
│   │   ├── docker.md
│   │   ├── kubernetes.md
│   │   ├── aws-rds.md
│   │   ├── gcp-cloud-sql.md
│   │   ├── azure-database-for-mysql.md
│   │   ├── clusters.md
│   │   └── whm-cpanel.md
│   └── manage-the-releem-agent/
│       ├── configuration.md
│       ├── logs.md
│       ├── migrate.md
│       ├── update.md
│       └── uninstall.md
├── dashboard/
│   ├── overview.md
│   ├── query-analytics.md
│   ├── schema-checks.md
│   ├── deadlocks.md
│   ├── health-checks.md
│   ├── security-checks.md
│   ├── process-list.md
│   └── reports.md
├── recommendations/
│   ├── overview.md
│   ├── configuration-tuning/
│   │   ├── mysql-tuning-process.md
│   │   ├── initial-mysql-configuration.md
│   │   ├── apply-using-portal.md
│   │   ├── apply-using-agent.md
│   │   ├── apply-using-cron.md
│   │   ├── apply-manually/
│   │   │   ├── linux.md
│   │   │   ├── windows.md
│   │   │   ├── docker.md
│   │   │   ├── aws-rds.md
│   │   │   └── gcp-cloud-sql.md
│   │   ├── rollback.md
│   │   ├── limit-mysql-memory.md
│   │   └── configuration-example.md
│   └── query-optimization/
│       ├── overview.md
│       ├── enable.md
│       ├── disable.md
│       ├── prepared-statements.md
│       ├── automatic-schema-changes.md
│       └── schema-change-troubleshooting.md
├── account/
│   ├── overview.md
│   ├── access/
│   │   └── users-and-roles.md
│   └── billing/
│       ├── payment-information.md
│       └── cancel-subscription.md
└── faq.md
```

## Exact 54-page path and route map

This table is normative. `Current source` means the source path present after the completed preservation-first restructure.

For every final document, the explicit front-matter `id` is the final filename
without `.md`, and the effective Docusaurus ID is the final path relative to
`docs/` without `.md`. For example,
`docs/installation/manage-the-releem-agent/uninstall.md` has explicit
`id: uninstall` and effective ID
`installation/manage-the-releem-agent/uninstall`. The explicit `slug` is the
table's final route. This rule also applies to each `overview.md`; the slug, not
the filename, gives the section owner its short route such as `/dashboard`.

| # | Current source | Final source | Current route | Final route |
|---:|---|---|---|---|
| 1 | `docs/releem-overview.md` | `docs/get-started/releem-overview.md` | `/` | `/get-started` |
| 2 | `docs/getting-started/step-1-register-for-an-account.md` | `docs/get-started/register-for-an-account.md` | `/getting-started/step-1-register-for-an-account` | `/get-started/register-for-an-account` |
| 3 | `docs/getting-started/connect-your-database-server.md` | `docs/get-started/connect-your-database-server.md` | `/getting-started/step-2-add-server` | `/get-started/connect-your-database-server` |
| 4 | `docs/getting-started/how-to-check-if-releem-agent-is-working.md` | `docs/get-started/troubleshoot-releem-agent.md` | `/getting-started/how-to-check-if-releem-agent-is-working` | `/get-started/troubleshoot-releem-agent` |
| 5 | `docs/releem-agent/mysql-permissions.md` | `docs/supported-databases/mysql/required-permissions.md` | `/releem-agent/mysql-permissions` | `/supported-databases/mysql/required-permissions` |
| 6 | `docs/releem-agent/installation-guides/postgresql-manual-installation-linux.md` | `docs/supported-databases/postgresql/install-on-linux.md` | `/releem-agent/installation-guides/postgresql-manual-linux` | `/supported-databases/postgresql/install-on-linux` |
| 7 | `docs/releem-agent/installation-guides/self-managed-servers-automatic-installation.md` | `docs/installation/linux-automatic.md` | `/releem-agent/installation-guides/self-managed-servers-automatic-installation` | `/installation` |
| 8 | `docs/releem-agent/installation-guides/self-managed-servers-manual-installation-linux.md` | `docs/installation/installation-methods/linux-manual.md` | `/releem-agent/installation-guides/self-managed-servers-manual-installation-linux` | `/installation/installation-methods/linux-manual` |
| 9 | `docs/releem-agent/installation-guides/self-managed-servers-manual-installation-windows.md` | `docs/installation/installation-methods/windows.md` | `/releem-agent/installation-guides/self-managed-servers-manual-installation-windows` | `/installation/installation-methods/windows` |
| 10 | `docs/releem-agent/installation-guides/self-managed-servers-docker-installation.md` | `docs/installation/installation-methods/docker.md` | `/releem-agent/installation-guides/self-managed-servers-docker-installation` | `/installation/installation-methods/docker` |
| 11 | `docs/releem-agent/installation-guides/installation-in-kubernetes.md` | `docs/installation/installation-methods/kubernetes.md` | `/releem-agent/installation-guides/installation-in-kubernetes` | `/installation/installation-methods/kubernetes` |
| 12 | `docs/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation.md` | `docs/installation/installation-methods/aws-rds.md` | `/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation` | `/installation/installation-methods/aws-rds` |
| 13 | `docs/releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation.md` | `docs/installation/installation-methods/gcp-cloud-sql.md` | `/releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation` | `/installation/installation-methods/gcp-cloud-sql` |
| 14 | `docs/releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation.md` | `docs/installation/installation-methods/azure-database-for-mysql.md` | `/releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation` | `/installation/installation-methods/azure-database-for-mysql` |
| 15 | `docs/releem-agent/installation-guides/clusters.md` | `docs/installation/installation-methods/clusters.md` | `/releem-agent/installation-guides/clusters` | `/installation/installation-methods/clusters` |
| 16 | `docs/releem-agent/installation-guides/whm-cpanel.md` | `docs/installation/installation-methods/whm-cpanel.md` | `/releem-agent/installation-guides/whm-cpanel` | `/installation/installation-methods/whm-cpanel` |
| 17 | `docs/releem-agent/configuration-settings.md` | `docs/installation/manage-the-releem-agent/configuration.md` | `/releem-agent/configuration` | `/installation/manage-the-releem-agent/configuration` |
| 18 | `docs/releem-agent/how-to-check-logs.md` | `docs/installation/manage-the-releem-agent/logs.md` | `/releem-agent/how-to-check-logs` | `/installation/manage-the-releem-agent/logs` |
| 19 | `docs/releem-agent/migration.md` | `docs/installation/manage-the-releem-agent/migrate.md` | `/releem-agent/migration` | `/installation/manage-the-releem-agent/migrate` |
| 20 | `docs/releem-agent/update.md` | `docs/installation/manage-the-releem-agent/update.md` | `/releem-agent/update` | `/installation/manage-the-releem-agent/update` |
| 21 | `docs/releem-agent/uninstallation.md` | `docs/installation/manage-the-releem-agent/uninstall.md` | `/releem-agent/uninstallation` | `/installation/manage-the-releem-agent/uninstall` |
| 22 | `docs/getting-started/dashboard-overview.md` | `docs/dashboard/overview.md` | `/getting-started/step-4-dashboard` | `/dashboard` |
| 23 | `docs/getting-started/query-analytics.md` | `docs/dashboard/query-analytics.md` | `/getting-started/query-analytics` | `/dashboard/query-analytics` |
| 24 | `docs/getting-started/schema-checks.md` | `docs/dashboard/schema-checks.md` | `/getting-started/schema-optimization` | `/dashboard/schema-checks` |
| 25 | `docs/getting-started/deadlock-monitoring.md` | `docs/dashboard/deadlocks.md` | `/getting-started/deadlock-monitoring` | `/dashboard/deadlocks` |
| 26 | `docs/getting-started/health-checks.md` | `docs/dashboard/health-checks.md` | `/getting-started/step-5-health-checks` | `/dashboard/health-checks` |
| 27 | `docs/getting-started/security-checks.md` | `docs/dashboard/security-checks.md` | `/getting-started/security-checks` | `/dashboard/security-checks` |
| 28 | `docs/getting-started/process-list.md` | `docs/dashboard/process-list.md` | `/getting-started/process-list` | `/dashboard/process-list` |
| 29 | `docs/getting-started/reports.md` | `docs/dashboard/reports.md` | `/getting-started/step-7-weekly-reports` | `/dashboard/reports` |
| 30 | `docs/getting-started/configuration-tuning.md` | `docs/recommendations/overview.md` | `/getting-started/step-3-getting-and-applying-recommendations` | `/recommendations` |
| 31 | `docs/configuration-tuning/mysql-tuning-process.md` | `docs/recommendations/configuration-tuning/mysql-tuning-process.md` | `/configuration-tuning/mysql-tuning-process` | `/recommendations/configuration-tuning/mysql-tuning-process` |
| 32 | `docs/configuration-tuning/initial-mysql-configuration.md` | `docs/recommendations/configuration-tuning/initial-mysql-configuration.md` | `/configuration-tuning/initial-mysql-configuration` | `/recommendations/configuration-tuning/initial-mysql-configuration` |
| 33 | `docs/configuration-tuning/how-to-apply-configuration-using-portal.md` | `docs/recommendations/configuration-tuning/apply-using-portal.md` | `/configuration-tuning/how-to-apply-configuration-using-portal` | `/recommendations/configuration-tuning/apply-using-portal` |
| 34 | `docs/configuration-tuning/how-to-apply-configuration-using-agent.md` | `docs/recommendations/configuration-tuning/apply-using-agent.md` | `/configuration-tuning/how-to-apply-configuration-using-agent` | `/recommendations/configuration-tuning/apply-using-agent` |
| 35 | `docs/configuration-tuning/how-to-apply-configuration-using-cron.md` | `docs/recommendations/configuration-tuning/apply-using-cron.md` | `/configuration-tuning/how-to-apply-configuration-using-cron` | `/recommendations/configuration-tuning/apply-using-cron` |
| 36 | `docs/configuration-tuning/how-to-apply-configuration-manually/linux.md` | `docs/recommendations/configuration-tuning/apply-manually/linux.md` | `/configuration-tuning/how-to-apply-configuration-manually/linux` | `/recommendations/configuration-tuning/apply-manually/linux` |
| 37 | `docs/configuration-tuning/how-to-apply-configuration-manually/windows.md` | `docs/recommendations/configuration-tuning/apply-manually/windows.md` | `/configuration-tuning/how-to-apply-configuration-manually/windows` | `/recommendations/configuration-tuning/apply-manually/windows` |
| 38 | `docs/configuration-tuning/how-to-apply-configuration-manually/docker.md` | `docs/recommendations/configuration-tuning/apply-manually/docker.md` | `/configuration-tuning/how-to-apply-configuration-manually/docker` | `/recommendations/configuration-tuning/apply-manually/docker` |
| 39 | `docs/configuration-tuning/how-to-apply-configuration-manually/aws-rds.md` | `docs/recommendations/configuration-tuning/apply-manually/aws-rds.md` | `/configuration-tuning/how-to-apply-configuration-manually/aws-rds` | `/recommendations/configuration-tuning/apply-manually/aws-rds` |
| 40 | `docs/configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql.md` | `docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md` | `/configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql` | `/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql` |
| 41 | `docs/configuration-tuning/how-to-rollback-to-previous-configuration.md` | `docs/recommendations/configuration-tuning/rollback.md` | `/configuration-tuning/how-to-rollback-to-previous-configuration` | `/recommendations/configuration-tuning/rollback` |
| 42 | `docs/configuration-tuning/limit-memory-for-mysql.md` | `docs/recommendations/configuration-tuning/limit-mysql-memory.md` | `/configuration-tuning/limit-memory-for-mysql` | `/recommendations/configuration-tuning/limit-mysql-memory` |
| 43 | `docs/configuration-tuning/example-of-configuration.md` | `docs/recommendations/configuration-tuning/configuration-example.md` | `/configuration-tuning/example-of-configuration` | `/recommendations/configuration-tuning/configuration-example` |
| 44 | `docs/getting-started/query-optimization.md` | `docs/recommendations/query-optimization/overview.md` | `/getting-started/query-optimization` | `/recommendations/query-optimization` |
| 45 | `docs/query-optimization/enable-sql-query-optimization.md` | `docs/recommendations/query-optimization/enable.md` | `/query-optimization/enable-sql-query-optimization` | `/recommendations/query-optimization/enable` |
| 46 | `docs/query-optimization/disable-sql-query-optimization.md` | `docs/recommendations/query-optimization/disable.md` | `/query-optimization/disable-sql-query-optimization` | `/recommendations/query-optimization/disable` |
| 47 | `docs/query-optimization/prepared-statements.md` | `docs/recommendations/query-optimization/prepared-statements.md` | `/query-optimization/prepared-statements-issue` | `/recommendations/query-optimization/prepared-statements` |
| 48 | `docs/query-optimization/automatic-schema-changes.md` | `docs/recommendations/query-optimization/automatic-schema-changes.md` | `/query-optimization/automatic-schema-changes` | `/recommendations/query-optimization/automatic-schema-changes` |
| 49 | `docs/query-optimization/schema-change-troubleshooting.md` | `docs/recommendations/query-optimization/schema-change-troubleshooting.md` | `/query-optimization/schema-change-troubleshooting` | `/recommendations/query-optimization/schema-change-troubleshooting` |
| 50 | `docs/server-settings/your-server-settings.md` | `docs/account/overview.md` | `/server-settings/your-server-settings` | `/account` |
| 51 | `docs/server-settings/invite-users-and-assign-roles.md` | `docs/account/access/users-and-roles.md` | `/server-settings/invite-users-and-assign-roles` | `/account/access/users-and-roles` |
| 52 | `docs/billing/update-payment-information.md` | `docs/account/billing/payment-information.md` | `/billing/update-payment-information` | `/account/billing/payment-information` |
| 53 | `docs/billing/cancellation.md` | `docs/account/billing/cancel-subscription.md` | `/billing/cancellation` | `/account/billing/cancel-subscription` |
| 54 | `docs/frequently-asked-questions.md` | `docs/faq.md` | `/frequently-asked-questions` | `/faq` |

## Exact Docusaurus redirect module

Create `redirects.mjs` with this complete route set. Keep rules one-to-one so tests and review can identify each retired route directly.

```js
export const redirects = [
  {from: '/', to: '/get-started'},
  {from: '/getting-started/step-1-register-for-an-account', to: '/get-started/register-for-an-account'},
  {from: '/getting-started/step-2-add-server', to: '/get-started/connect-your-database-server'},
  {from: '/getting-started/how-to-check-if-releem-agent-is-working', to: '/get-started/troubleshoot-releem-agent'},
  {from: '/releem-agent/mysql-permissions', to: '/supported-databases/mysql/required-permissions'},
  {from: '/releem-agent/installation-guides/postgresql-manual-linux', to: '/supported-databases/postgresql/install-on-linux'},
  {from: '/releem-agent/installation-guides/self-managed-servers-automatic-installation', to: '/installation'},
  {from: '/releem-agent/installation-guides/self-managed-servers-manual-installation-linux', to: '/installation/installation-methods/linux-manual'},
  {from: '/releem-agent/installation-guides/self-managed-servers-manual-installation-windows', to: '/installation/installation-methods/windows'},
  {from: '/releem-agent/installation-guides/self-managed-servers-docker-installation', to: '/installation/installation-methods/docker'},
  {from: '/releem-agent/installation-guides/installation-in-kubernetes', to: '/installation/installation-methods/kubernetes'},
  {from: '/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation', to: '/installation/installation-methods/aws-rds'},
  {from: '/releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation', to: '/installation/installation-methods/gcp-cloud-sql'},
  {from: '/releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation', to: '/installation/installation-methods/azure-database-for-mysql'},
  {from: '/releem-agent/installation-guides/clusters', to: '/installation/installation-methods/clusters'},
  {from: '/releem-agent/installation-guides/whm-cpanel', to: '/installation/installation-methods/whm-cpanel'},
  {from: '/releem-agent/configuration', to: '/installation/manage-the-releem-agent/configuration'},
  {from: '/releem-agent/how-to-check-logs', to: '/installation/manage-the-releem-agent/logs'},
  {from: '/releem-agent/migration', to: '/installation/manage-the-releem-agent/migrate'},
  {from: '/releem-agent/update', to: '/installation/manage-the-releem-agent/update'},
  {from: '/releem-agent/uninstallation', to: '/installation/manage-the-releem-agent/uninstall'},
  {from: '/getting-started/step-4-dashboard', to: '/dashboard'},
  {from: '/getting-started/query-analytics', to: '/dashboard/query-analytics'},
  {from: '/getting-started/schema-optimization', to: '/dashboard/schema-checks'},
  {from: '/getting-started/deadlock-monitoring', to: '/dashboard/deadlocks'},
  {from: '/getting-started/step-5-health-checks', to: '/dashboard/health-checks'},
  {from: '/getting-started/security-checks', to: '/dashboard/security-checks'},
  {from: '/getting-started/process-list', to: '/dashboard/process-list'},
  {from: '/getting-started/step-7-weekly-reports', to: '/dashboard/reports'},
  {from: '/getting-started/step-3-getting-and-applying-recommendations', to: '/recommendations'},
  {from: '/configuration-tuning/mysql-tuning-process', to: '/recommendations/configuration-tuning/mysql-tuning-process'},
  {from: '/configuration-tuning/initial-mysql-configuration', to: '/recommendations/configuration-tuning/initial-mysql-configuration'},
  {from: '/configuration-tuning/how-to-apply-configuration-using-portal', to: '/recommendations/configuration-tuning/apply-using-portal'},
  {from: '/configuration-tuning/how-to-apply-configuration-using-agent', to: '/recommendations/configuration-tuning/apply-using-agent'},
  {from: '/configuration-tuning/how-to-apply-configuration-using-cron', to: '/recommendations/configuration-tuning/apply-using-cron'},
  {from: '/configuration-tuning/how-to-apply-configuration-manually/linux', to: '/recommendations/configuration-tuning/apply-manually/linux'},
  {from: '/configuration-tuning/how-to-apply-configuration-manually/windows', to: '/recommendations/configuration-tuning/apply-manually/windows'},
  {from: '/configuration-tuning/how-to-apply-configuration-manually/docker', to: '/recommendations/configuration-tuning/apply-manually/docker'},
  {from: '/configuration-tuning/how-to-apply-configuration-manually/aws-rds', to: '/recommendations/configuration-tuning/apply-manually/aws-rds'},
  {from: '/configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql', to: '/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql'},
  {from: '/configuration-tuning/how-to-rollback-to-previous-configuration', to: '/recommendations/configuration-tuning/rollback'},
  {from: '/configuration-tuning/limit-memory-for-mysql', to: '/recommendations/configuration-tuning/limit-mysql-memory'},
  {from: '/configuration-tuning/example-of-configuration', to: '/recommendations/configuration-tuning/configuration-example'},
  {from: '/getting-started/query-optimization', to: '/recommendations/query-optimization'},
  {from: '/query-optimization/enable-sql-query-optimization', to: '/recommendations/query-optimization/enable'},
  {from: '/query-optimization/disable-sql-query-optimization', to: '/recommendations/query-optimization/disable'},
  {from: '/query-optimization/prepared-statements-issue', to: '/recommendations/query-optimization/prepared-statements'},
  {from: '/query-optimization/automatic-schema-changes', to: '/recommendations/query-optimization/automatic-schema-changes'},
  {from: '/query-optimization/schema-change-troubleshooting', to: '/recommendations/query-optimization/schema-change-troubleshooting'},
  {from: '/server-settings/your-server-settings', to: '/account'},
  {from: '/server-settings/invite-users-and-assign-roles', to: '/account/access/users-and-roles'},
  {from: '/billing/update-payment-information', to: '/account/billing/payment-information'},
  {from: '/billing/cancellation', to: '/account/billing/cancel-subscription'},
  {from: '/frequently-asked-questions', to: '/faq'},
];
```

## Task 1: Freeze the complete migration contract with failing tests

**Files:**
- Create: `.agent/analysis/2026-09-02-releem-docs-directory-mirror-map.json`
- Create: `tests/docs-directory-mirror.test.mjs`
- Modify: `package.json`
- Read: `.agent/analysis/2026-09-01-releem-docs-structure-baseline.json`
- Read: `.agent/analysis/2026-09-01-releem-docs-post-restructure-review.md`
- Read: `sidebars.js`
- Read: `docusaurus.config.js`

**Reviewers:**
- developer
- technical-writer

- [x] Record `git status --short` and verify that none of the 54 current sources overlaps an unrelated user change. Preserve the existing `yarn.lock` modification and the two existing `.agent/` deletions.
- [x] Create the migration-map JSON from the normative table with exactly 54 records containing `currentSource`, `finalSource`, `currentId`, `finalId`, `currentRoute`, `finalRoute`, original whole-file/front-matter/body hashes, allowed front-matter keys, allowed internal-link replacements, and allowed relative-asset replacements.
- [x] Reject duplicate current or final sources, IDs, or routes; reject a route that appears as both a final target and a retired source; reject paths outside `docs/`; and require exactly the seven approved top-level final directories plus `docs/faq.md`.
- [x] Add `tests/docs-directory-mirror.test.mjs` using `node:test` and `node:assert/strict`. Make it assert the 54-row map, exact final tree, exact seven-section ownership, explicit final `id` and `slug` values, no new page, no individual Security/Schema hierarchy, unchanged asset hashes, and body equivalence after reversing only the declared URL/import replacements.
- [x] Add redirect-contract tests that require exactly 54 direct one-to-one rules, require `/` to map to `/get-started`, forbid chains/loops/duplicates, require every target in the final route set, and require no repository-owned link to use a retired route in the final state.
- [x] Change `docs:check` to run both `tests/docs-structure.test.mjs` and `tests/docs-directory-mirror.test.mjs`; preserve every agent-loop npm script.
- [x] Run `node --test tests/docs-directory-mirror.test.mjs`; expect failure because the mirrored tree and redirect module do not yet exist.
- [x] Run `npm run agent:check`; expect the existing 34 coordinator tests to pass.

## Task 2: Move all 54 pages and update only migration tokens

**Files:**
- Delete: `docs/releem-overview.md`
- Delete: `docs/getting-started/step-1-register-for-an-account.md`
- Delete: `docs/getting-started/connect-your-database-server.md`
- Delete: `docs/getting-started/how-to-check-if-releem-agent-is-working.md`
- Delete: `docs/releem-agent/mysql-permissions.md`
- Delete: `docs/releem-agent/installation-guides/postgresql-manual-installation-linux.md`
- Delete: `docs/releem-agent/installation-guides/self-managed-servers-automatic-installation.md`
- Delete: `docs/releem-agent/installation-guides/self-managed-servers-manual-installation-linux.md`
- Delete: `docs/releem-agent/installation-guides/self-managed-servers-manual-installation-windows.md`
- Delete: `docs/releem-agent/installation-guides/self-managed-servers-docker-installation.md`
- Delete: `docs/releem-agent/installation-guides/installation-in-kubernetes.md`
- Delete: `docs/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation.md`
- Delete: `docs/releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation.md`
- Delete: `docs/releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation.md`
- Delete: `docs/releem-agent/installation-guides/clusters.md`
- Delete: `docs/releem-agent/installation-guides/whm-cpanel.md`
- Delete: `docs/releem-agent/configuration-settings.md`
- Delete: `docs/releem-agent/how-to-check-logs.md`
- Delete: `docs/releem-agent/migration.md`
- Delete: `docs/releem-agent/update.md`
- Delete: `docs/releem-agent/uninstallation.md`
- Delete: `docs/getting-started/dashboard-overview.md`
- Delete: `docs/getting-started/query-analytics.md`
- Delete: `docs/getting-started/schema-checks.md`
- Delete: `docs/getting-started/deadlock-monitoring.md`
- Delete: `docs/getting-started/health-checks.md`
- Delete: `docs/getting-started/security-checks.md`
- Delete: `docs/getting-started/process-list.md`
- Delete: `docs/getting-started/reports.md`
- Delete: `docs/getting-started/configuration-tuning.md`
- Delete: `docs/configuration-tuning/mysql-tuning-process.md`
- Delete: `docs/configuration-tuning/initial-mysql-configuration.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-using-portal.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-using-agent.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-using-cron.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-manually/linux.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-manually/windows.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-manually/docker.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-manually/aws-rds.md`
- Delete: `docs/configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql.md`
- Delete: `docs/configuration-tuning/how-to-rollback-to-previous-configuration.md`
- Delete: `docs/configuration-tuning/limit-memory-for-mysql.md`
- Delete: `docs/configuration-tuning/example-of-configuration.md`
- Delete: `docs/getting-started/query-optimization.md`
- Delete: `docs/query-optimization/enable-sql-query-optimization.md`
- Delete: `docs/query-optimization/disable-sql-query-optimization.md`
- Delete: `docs/query-optimization/prepared-statements.md`
- Delete: `docs/query-optimization/automatic-schema-changes.md`
- Delete: `docs/query-optimization/schema-change-troubleshooting.md`
- Delete: `docs/server-settings/your-server-settings.md`
- Delete: `docs/server-settings/invite-users-and-assign-roles.md`
- Delete: `docs/billing/update-payment-information.md`
- Delete: `docs/billing/cancellation.md`
- Delete: `docs/frequently-asked-questions.md`
- Create: `docs/get-started/releem-overview.md`
- Create: `docs/get-started/register-for-an-account.md`
- Create: `docs/get-started/connect-your-database-server.md`
- Create: `docs/get-started/troubleshoot-releem-agent.md`
- Create: `docs/supported-databases/mysql/required-permissions.md`
- Create: `docs/supported-databases/postgresql/install-on-linux.md`
- Create: `docs/installation/linux-automatic.md`
- Create: `docs/installation/installation-methods/linux-manual.md`
- Create: `docs/installation/installation-methods/windows.md`
- Create: `docs/installation/installation-methods/docker.md`
- Create: `docs/installation/installation-methods/kubernetes.md`
- Create: `docs/installation/installation-methods/aws-rds.md`
- Create: `docs/installation/installation-methods/gcp-cloud-sql.md`
- Create: `docs/installation/installation-methods/azure-database-for-mysql.md`
- Create: `docs/installation/installation-methods/clusters.md`
- Create: `docs/installation/installation-methods/whm-cpanel.md`
- Create: `docs/installation/manage-the-releem-agent/configuration.md`
- Create: `docs/installation/manage-the-releem-agent/logs.md`
- Create: `docs/installation/manage-the-releem-agent/migrate.md`
- Create: `docs/installation/manage-the-releem-agent/update.md`
- Create: `docs/installation/manage-the-releem-agent/uninstall.md`
- Create: `docs/dashboard/overview.md`
- Create: `docs/dashboard/query-analytics.md`
- Create: `docs/dashboard/schema-checks.md`
- Create: `docs/dashboard/deadlocks.md`
- Create: `docs/dashboard/health-checks.md`
- Create: `docs/dashboard/security-checks.md`
- Create: `docs/dashboard/process-list.md`
- Create: `docs/dashboard/reports.md`
- Create: `docs/recommendations/overview.md`
- Create: `docs/recommendations/configuration-tuning/mysql-tuning-process.md`
- Create: `docs/recommendations/configuration-tuning/initial-mysql-configuration.md`
- Create: `docs/recommendations/configuration-tuning/apply-using-portal.md`
- Create: `docs/recommendations/configuration-tuning/apply-using-agent.md`
- Create: `docs/recommendations/configuration-tuning/apply-using-cron.md`
- Create: `docs/recommendations/configuration-tuning/apply-manually/linux.md`
- Create: `docs/recommendations/configuration-tuning/apply-manually/windows.md`
- Create: `docs/recommendations/configuration-tuning/apply-manually/docker.md`
- Create: `docs/recommendations/configuration-tuning/apply-manually/aws-rds.md`
- Create: `docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md`
- Create: `docs/recommendations/configuration-tuning/rollback.md`
- Create: `docs/recommendations/configuration-tuning/limit-mysql-memory.md`
- Create: `docs/recommendations/configuration-tuning/configuration-example.md`
- Create: `docs/recommendations/query-optimization/overview.md`
- Create: `docs/recommendations/query-optimization/enable.md`
- Create: `docs/recommendations/query-optimization/disable.md`
- Create: `docs/recommendations/query-optimization/prepared-statements.md`
- Create: `docs/recommendations/query-optimization/automatic-schema-changes.md`
- Create: `docs/recommendations/query-optimization/schema-change-troubleshooting.md`
- Create: `docs/account/overview.md`
- Create: `docs/account/access/users-and-roles.md`
- Create: `docs/account/billing/payment-information.md`
- Create: `docs/account/billing/cancel-subscription.md`
- Create: `docs/faq.md`
- Modify: `sidebars.js`
- Modify: `docusaurus.config.js`
- Modify: `tests/docs-structure.test.mjs`
- Modify: `tests/docs-directory-mirror.test.mjs`
- Modify: `.agent/analysis/2026-09-02-releem-docs-directory-mirror-map.json`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [x] Verify every current-source whole-file hash against the migration map immediately before moving it. Stop on a mismatch or unclear dirty-file ownership.
- [x] Move exactly the 54 source/target pairs in the normative table. Do not use a directory-wide wildcard or delete a directory recursively.
- [x] Set explicit final `id` and absolute `slug` values from the migration map. Preserve `title`, `sidebar_label`, and every other front-matter field exactly.
- [x] Replace every repository-owned link route with the corresponding final route while retaining its anchor. Do not alter link text, surrounding prose, external URLs, or code blocks.
- [x] Adjust only these known depth-changing asset tokens: Releem Overview `../assets/` to `../../assets/`; Configuration Example, Apply Using Portal, and Query Optimization Overview `../../assets/` to `../../../assets/`; Users and Roles `../../assets/` to `../../../assets/`. Let the asset test reject any missed or extra change.
- [x] Rewrite `sidebars.js` so its seven top-level sections, nested category labels, item ordering, and document links resolve only to final mirrored IDs. Count category-link documents and item documents together and require all 54 IDs exactly once.
- [x] Change the navbar logo `href` and footer documentation `to` to `/get-started`. Do not change external navbar/footer destinations or unrelated Docusaurus configuration.
- [x] Adapt the existing preservation tests to use the new migration map: require 54 target pages, preserved non-migration front matter, reversible body-token equivalence, unchanged asset hashes, and no remaining source path.
- [x] Run `node --test --test-name-pattern='mirrored source tree|preserved content|sidebar ownership|internal links|assets' tests/docs-directory-mirror.test.mjs tests/docs-structure.test.mjs`; require all selected tests to pass.
- [x] Run `npm run docs:check`, `npm run typecheck`, and `git diff --check`; require exit 0. Do not run the Docusaurus build until the retired routes no longer collide with the redirect pages added in Task 3.

## Task 3: Install and validate the Docusaurus redirect layer

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `docusaurus.config.js`
- Create: `redirects.mjs`
- Modify: `tests/docs-directory-mirror.test.mjs`
- Modify: `tests/docs-structure.test.mjs`

**Reviewers:**
- developer
- technical-writer

- [x] Add exact `3.9.2` for `@docusaurus/plugin-client-redirects` to `dependencies`; extend the package/lockfile test to require it alongside the existing five direct Docusaurus packages.
- [x] Run `npm install --package-lock-only --ignore-scripts`; require the root lock entry and resolved plugin entry to be exactly 3.9.2 without changing unrelated direct dependency ranges.
- [x] Create `redirects.mjs` with the exact 54-rule module shown above. Do not use `createRedirects`, extension rewriting, pattern matching, or an inferred fallback.
- [x] Import `redirects` in `docusaurus.config.js` and configure `['@docusaurus/plugin-client-redirects', {redirects}]` in `plugins`. Do not call the redirects HTTP 301s in code comments or operator documentation.
- [x] Extend tests to require exact equality among the migration-map route pairs, `redirects.mjs`, and the built canonical route set. Reject a redirect whose source is still a canonical page or whose target is another redirect source.
- [x] Run `npm ci`; require a clean dependency installation and `npm ls @docusaurus/plugin-client-redirects --depth=0` to report 3.9.2.
- [x] Run `npm run agent:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`; require exit 0 and no new Docusaurus broken-link, duplicate-route, missing-asset, MDX, or routing warning.
- [x] Inspect every generated redirect artifact in `build/`. Require one artifact per retired route, a reference to its exact final target, and no generated redirect artifact at a final canonical route.

## Task 4: Run canonical-route, redirect, and rendered-user QA

**Files:**
- Create: `.agent/analysis/2026-09-02-releem-docs-directory-mirror-review.md`
- Modify: `.agent/CONTINUITY.md`
- Read: `.agent/analysis/2026-09-02-releem-docs-directory-mirror-map.json`
- Read: `.agent/analysis/2026-09-01-releem-docs-post-restructure-review.md`
- Read: `redirects.mjs`
- Read: `sidebars.js`
- Read: `docusaurus.config.js`
- Read: `build/`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [x] Start the already-built production output with `npm run serve -- --host 127.0.0.1 --port 3000`. Confirm the redirect plugin is active in this production preview rather than relying on `npm run start`.
- [x] Request every one of the 54 canonical routes and require a rendered documentation page with the expected H1 and no redirect.
- [x] Open every one of the 54 retired routes in a browser context that executes JavaScript; require exactly one transition to the mapped canonical route, with fragments retained where applicable and no loop or intermediate route.
- [x] Repeat the ten target-user journeys: supported database guidance, installation choice, database permissions, agent status/logs, Security Checks, Schema Checks, Configuration Tuning, Query Analytics, Query Optimization, and configuration reversal.
- [x] Inspect 1280, 1024, 768, and 375 pixel widths. Verify seven-section order, nested folder-equivalent labels, category links, pointer and keyboard navigation, breadcrumbs, previous/next links, current images, and absence of horizontal overflow or browser errors.
- [x] Confirm old source-folder names are absent from the final sidebar and repository-owned links. Confirm the only Security/Schema pages remain the two aggregate pages.
- [x] Write the private review with the final path/route count, redirect count, exact verification results, warning baseline, browser evidence, and any content recommendations whose paths changed. Keep the earlier content review as historical evidence rather than silently rewriting it.
- [x] Obtain independent read-only `developer`, `technical-writer`, and `releem-user` verdicts. Correct every material finding within scope, rerun affected checks, and repeat the reviewer that raised it.
- [x] Stop the local server and confirm no listener remains on port 3000.
- [x] Run a final `npm run agent:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, `git diff --check`, `git status --short`, `git diff --name-status`, and `git diff --name-only --cached`. Require all checks to pass, nothing staged, and unrelated user changes untouched.
- [x] Record `DIRECTORY MIRROR: PASS`, `REDIRECTS: PASS`, and `CONTENT: MOVED, NOT REWRITTEN` only after all automated, rendered, and reviewer gates pass.

## Acceptance criteria

- The physical `docs/` tree matches the seven-section sidebar and its nested groups.
- Exactly 54 Markdown pages remain; no public page is added or removed.
- Every final page has an explicit ID and canonical slug matching the migration map.
- The sidebar contains exactly seven top-level entries in the approved order and owns all 54 final IDs exactly once.
- All customer prose, headings, commands, titles, screenshots, and factual claims remain unchanged.
- Only declared front-matter ID/slug, internal-link destination, and relative-asset-path tokens differ from the preservation baseline.
- All image/static files retain their paths and hashes.
- Security Checks and Schema Checks remain aggregate pages with their existing images; no individual check hierarchy exists.
- All 54 retired routes have direct Docusaurus client redirect pages to final canonical routes.
- Redirects have no chain, loop, duplicate source, final-route collision, or missing target.
- All repository-owned links point directly to canonical routes and never rely on a redirect.
- `/` redirects to `/get-started`; the navbar logo and footer documentation link point directly to `/get-started`.
- Clean npm installation, loop tests, directory/route/link/asset tests, typecheck, build, redirect artifact inspection, rendered route QA, responsive/keyboard QA, and three independent reviewer verdicts pass.
- The private final report clearly distinguishes Docusaurus client redirects from server HTTP redirects.
- Nothing is staged or committed, and no search-index or external release write occurs.

## Sources used for the redirect design

- Docusaurus 3.9.2 `@docusaurus/plugin-client-redirects` documentation: <https://docusaurus.io/docs/3.9.2/api/plugins/@docusaurus/plugin-client-redirects>. The plugin creates additional production-build HTML pages using client-side JavaScript, is inactive in development, accepts explicit `{from, to}` rules, and recommends server-side redirects when the host provides them.
- Repository evidence: `docusaurus.config.js` currently declares no plugins; `package.json` and `package-lock.json` contain no client-redirect package; no `_redirects`, `netlify.toml`, or redirect configuration exists in the current worktree.
