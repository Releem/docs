# MySQL and MariaDB Permissions Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give MySQL and MariaDB separate canonical Required Permissions pages and route each Linux installation tab to the correct engine-specific reference without changing the one-command installer workflow.

**Architecture:** Keep the existing MySQL route and split the combined page by engine. Add one MariaDB document with its own route, add it once to Supported Databases navigation, update only MariaDB-specific links, and extend the current Linux-consolidation preservation overlay from 53 to 54 pages. Do not add redirects because no public route is retired.

**Tech Stack:** Docusaurus 3 Markdown, JavaScript sidebar configuration, Node.js `node:test`, npm.

---

### Task 1: Lock the engine split into regression tests

**Files:**
- Modify: `tests/docs-linux-installation.test.mjs`
- Modify: `tests/docs-structure.test.mjs`
- Modify: `tests/docs-directory-mirror.test.mjs`

- [x] **Step 1: Add the new route, content, and link assertions**

Require `docs/supported-databases/mariadb/required-permissions.md` with ID `required-permissions`, route `/supported-databases/mariadb/required-permissions`, title and H1 `MariaDB Permissions for Releem Agent`, MariaDB 10.1–11.0 scope, exact-source host examples, monitoring/query/configuration/schema capability sections, `SUPER`, and no MySQL-only `SYSTEM_VARIABLES_ADMIN` or AWS RDS procedure. Require the MySQL page to use the MySQL-only H1, retain MySQL 5.5–8.0, `SYSTEM_VARIABLES_ADMIN`, MySQL 5.5–5.7 `SUPER`, and the AWS RDS procedure, and contain no MariaDB claims.

- [x] **Step 2: Require engine-correct Linux links and sidebar ownership**

Assert that the MySQL tab links only to `/supported-databases/mysql/required-permissions`, the MariaDB tab links only to `/supported-databases/mariadb/required-permissions`, and the PostgreSQL tab retains its PostgreSQL reference. Add the MariaDB document once under Supported Databases and require 54 unique sidebar-owned documents.

- [x] **Step 3: Update the preservation-overlay expectations**

Require `currentPageCount: 54`, add the MariaDB permissions page to `addedSources`, retain the MySQL page in `rewrittenSources`, and add the MariaDB route to the allowed current-route map.

- [x] **Step 4: Run the focused tests and confirm RED**

Run: `node --test tests/docs-linux-installation.test.mjs tests/docs-directory-mirror.test.mjs tests/docs-structure.test.mjs`

Expected: FAIL because the MariaDB page and route do not yet exist, the Linux MariaDB tab still links to the MySQL page, and current metadata still says 53 pages.

### Task 2: Create separate canonical permission references

**Files:**
- Modify: `docs/supported-databases/mysql/required-permissions.md`
- Create: `docs/supported-databases/mariadb/required-permissions.md`

- [x] **Step 1: Make the existing MySQL page MySQL-only**

Use the existing front matter and route. Change the H1 to `MySQL Permissions for Releem Agent`; state MySQL 5.5–8.0 scope; retain exact-source-host monitoring grants, the optional global `SELECT` warning, the AWS RDS procedure, MySQL 8.0 `SYSTEM_VARIABLES_ADMIN`, MySQL 5.5–5.7 `SUPER`, schema-change boundaries, and effective-grant verification. Remove MariaDB-specific claims.

- [x] **Step 2: Add the MariaDB page**

Create the approved metadata and H1. State MariaDB 10.1–11.0 scope; preserve the exact-source-host rule and the current monitoring grant family; require verification that referenced Performance Schema tables exist on the target version; warn about optional global `SELECT`; document `SUPER` only for explicitly authorized configuration application; keep DDL/schema privileges outside the monitoring template; and provide effective-grant verification. Do not copy the MySQL-only AWS RDS procedure or `SYSTEM_VARIABLES_ADMIN` guidance.

- [x] **Step 3: Run the focused content test**

Run: `node --test tests/docs-linux-installation.test.mjs`

Expected: the content-specific split assertions pass; routing/count assertions can remain red until Task 3.

### Task 3: Route MariaDB users and update preservation records

**Files:**
- Modify: `docs/installation/linux.md`
- Modify: `docs/installation/installation-methods/clusters.md`
- Modify: `docs/recommendations/query-optimization/enable.md`
- Modify: `sidebars.js`
- Modify: `.agent/analysis/2026-09-03-linux-installation-consolidation.json`
- Modify: `.agent/analysis/2026-09-03-linux-installation-migration-checklist.md`
- Modify: `.agent/plans/2026-09-03-releem-preservation-first-editorial-restructure.md`

- [x] **Step 1: Replace MariaDB permission links**

In the MariaDB tab, replace all MySQL permission destinations and labels with `/supported-databases/mariadb/required-permissions` and `MariaDB permissions`. In the mixed-engine Clusters and Enable SQL Query Optimization workflows, present separate MySQL/Percona and MariaDB permission destinations; give cluster users the matching MySQL or MariaDB manual-installation link. Leave MySQL-only environment links, PostgreSQL links, and all six Linux installer command blocks unchanged.

- [x] **Step 2: Add one sidebar owner**

Add `supported-databases/mariadb/required-permissions` with label `MariaDB Permissions` under Supported Databases. Preserve the existing MySQL category-link owner and PostgreSQL entry so every page remains owned exactly once.

- [x] **Step 3: Record the 54-page current contract**

Update the consolidation overlay and checklist from `54 - 3 + 2 = 53` to `54 - 3 + 3 = 54`, list the MariaDB file as an added source, record the engine-specific split, and update the active preservation plan to the 54-page post-split baseline.

- [x] **Step 4: Run focused tests and confirm GREEN**

Run: `node --test tests/docs-linux-installation.test.mjs tests/docs-directory-mirror.test.mjs tests/docs-structure.test.mjs`

Expected: all active tests pass; only explicitly historical skipped tests remain skipped.

### Task 4: Verify the complete documentation change

**Files:**
- Modify: `.agent/CONTINUITY.md`

- [x] **Step 1: Check for incorrect cross-engine routing**

Run: `rg -n "MySQL/MariaDB permissions|database=mariadb[^\n]*supported-databases/mysql|required-permissions" docs sidebars.js tests`

Expected: MariaDB-specific contexts use the MariaDB route; MySQL-only contexts retain the MySQL route.

- [x] **Step 2: Run the repository checks**

Run: `npm run docs:check`

Expected: PASS with only pre-existing explicit skips.

Run: `npm run typecheck`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0 with no new broken-link, duplicate-ID, missing-asset, MDX, or routing warning.

Run: `git diff --check`

Expected: exit 0.

- [x] **Step 3: Record the outcome**

Add concise ISO-timestamped `[USER]`, `[CODE]`, and `[TOOL]` facts to `.agent/CONTINUITY.md`, including the separate routes, unchanged installer commands, verification results, and any remaining publication blocker.

- [x] **Step 4: Do not commit or publish**

Leave all changes unstaged and uncommitted. Do not push, deploy, publish, or perform remote writes.
