# Releem Documentation Existing-Content Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the 54 existing Releem documentation pages into the approved seven-section navigation without changing page content or adding a public page, then review the result and recommend separately authorized content improvements.

**Architecture:** Treat each existing Markdown page and referenced image as immutable content whose bytes and public route must survive the restructure. Use targeted same-directory file renames only where the existing front matter preserves the route, and use `sidebars.js` to assign every existing page to exactly one of the seven user-facing sections. Do not create category index pages; each category links to the most suitable existing page. After rendered validation, write a private gap analysis that recommends what should later be added or changed without applying those recommendations.

**Tech Stack:** Node.js 20, npm, Docusaurus 3.9.2, JavaScript sidebar configuration, Node built-in tests, Markdown for private analysis.

---

## User-approved boundaries

1. Existing Markdown page content is immutable. Do not edit front matter, headings, paragraphs, commands, links, imports, or image references.
2. Existing page files may be renamed or moved only when their complete bytes remain identical and their current public route remains unchanged. A move that would require a link, import, ID, slug, or body edit is out of scope.
3. Do not create a `.md` or `.mdx` file under `docs/`. The final corpus must contain the same 54 pages—no more and no fewer.
4. Do not create generated-index category pages. Top-level and nested categories must link to existing documents.
5. Keep Security Checks and Schema Checks as the existing aggregate pages with their existing images. Do not create individual Security Check or Schema Check articles.
6. Keep all existing files under `assets/images/` and `static/img/` byte-for-byte unchanged. Do not add, remove, rename, or replace an image.
7. Preserve all 54 existing public routes. Because this plan changes no route, it adds no redirect. Any detected route change is a hard stop, not permission to add an unreviewed redirect.
8. Sidebar labels may use the approved user-facing terminology even when the immutable page title still differs. Record every title/label mismatch in the final private review.
9. Use direct npm commands. Do not add or use Docker for this plan.
10. Do not modify Algolia records, release the site, call a remote write API, alter production or analytics data, or change secrets.
11. Do not stage or commit changes under this plan. Preserve the two pre-existing user deletions under `.agent/` and all unrelated worktree changes.
12. The post-implementation review may recommend new pages or changes to existing pages, but it must not implement them.

## Why most files remain in their current directories

The current pages contain route-absolute links such as `/getting-started/...`,
`/releem-agent/...`, `/configuration-tuning/...`, and `/query-optimization/...`.
Moving those pages across directories changes Docusaurus document IDs and routes,
while editing their links or front matter would violate the immutable-content
boundary. The implementation therefore separates user-facing information
architecture from source-folder layout: sidebar ownership changes now; broader
physical migration can be reconsidered only with later content-edit authority.

## Exact permitted page renames

These seven renames preserve directory depth and page bytes. Six pages already
have explicit front-matter IDs, so their routes remain unchanged. The root page
retains `slug: /`; its source-derived ID changes from `welcome` to
`releem-overview`, while its public route remains `/`.

The originally considered rename of
`docs/getting-started/how-to-check-if-releem-agent-is-working.md` is not
performed. The immutable FAQ links to that exact Markdown source path; a clean
Docusaurus build proved that renaming it introduces a broken-Markdown-link
warning. Retaining the source path preserves both content and build integrity.

| Current source | Renamed source | Existing route retained |
| --- | --- | --- |
| `docs/welcome.md` | `docs/releem-overview.md` | `/` |
| `docs/getting-started/step-2-add-server.md` | `docs/getting-started/connect-your-database-server.md` | `/getting-started/step-2-add-server` |
| `docs/getting-started/step-4-dashboard.md` | `docs/getting-started/dashboard-overview.md` | `/getting-started/step-4-dashboard` |
| `docs/getting-started/step-5-health-checks.md` | `docs/getting-started/health-checks.md` | `/getting-started/step-5-health-checks` |
| `docs/getting-started/step-7-weekly-reports.md` | `docs/getting-started/reports.md` | `/getting-started/step-7-weekly-reports` |
| `docs/getting-started/schema-optimization.md` | `docs/getting-started/schema-checks.md` | `/getting-started/schema-optimization` |
| `docs/getting-started/step-3-getting-and-applying-recommendations.md` | `docs/getting-started/configuration-tuning.md` | `/getting-started/step-3-getting-and-applying-recommendations` |

No other page rename or move is authorized by this plan.

## Final seven-section ownership

Every existing page must be reachable exactly once, either as a top-level
category link or as one sidebar item.

1. **Get Started** links to the existing root overview and contains Register,
   Connect Your Database Server, and Troubleshoot the Releem Agent.
2. **Supported Databases** links to the existing MySQL permissions page and
   contains the existing PostgreSQL installation page. The final review must
   flag that this is not a complete compatibility section.
3. **Installation** links to the existing automatic Linux guide and contains
   the other nine installation methods except PostgreSQL, plus Configuration,
   Logs, Migration, Update, and Uninstallation.
4. **Dashboard** links to the existing Dashboard page and contains Query
   Analytics, Schema Checks, Deadlocks, Health Checks, Security Checks, Process
   List, and Reports.
5. **Recommendations** links to the existing Configuration Tuning overview and
   contains the existing configuration-tuning and query-optimization corpora.
6. **Account** links to the existing server-settings page and contains the
   remaining Access and Billing pages.
7. **FAQ** is the existing FAQ page.

## Task 1: Make the existing dependency set reproducible

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/docs-structure.test.mjs`
- Read: `AGENTS.md`

**Reviewers:**
- developer

- [x] Add a Node built-in test named `package and lockfile pin the same Docusaurus 3.9.2 family`. It must assert exact `3.9.2` for `@docusaurus/core`, `@docusaurus/preset-classic`, `@docusaurus/theme-search-algolia`, `@docusaurus/module-type-aliases`, and `@docusaurus/types` in both package roots and resolved lock entries, plus Node `>=20.0` in both package roots.
- [x] Add `"docs:check": "node --test tests/docs-structure.test.mjs"` without removing or changing the installed agent-loop scripts.
- [x] Run `node --test --test-name-pattern='package and lockfile pin' tests/docs-structure.test.mjs` and confirm it fails against the current 3.6.3 lock entries.
- [x] Pin only the five direct Docusaurus packages to exact `3.9.2`, regenerate the lock with `npm install --package-lock-only --ignore-scripts`, and run `npm ci` without upgrading unrelated packages or applying automated audit fixes.
- [x] Run `npm ls @docusaurus/core @docusaurus/preset-classic @docusaurus/theme-search-algolia @docusaurus/module-type-aliases @docusaurus/types --depth=0`; expect all five packages at 3.9.2.
- [x] Run `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`; expect exit 0 with no new Docusaurus warning class.

## Task 2: Record immutable content, route, and rename baselines

**Files:**
- Create: `.agent/analysis/2026-09-01-releem-docs-structure-baseline.json`
- Modify: `tests/docs-structure.test.mjs`
- Read: `sidebars.js`
- Read: `docusaurus.config.js`

**Reviewers:**
- developer
- technical-writer

- [x] Generate a private manifest for all 54 existing Markdown files. For each page record its current source path, approved renamed path or `null`, complete-file SHA-256, normalized front-matter SHA-256, normalized body SHA-256, effective document ID, public route, and every referenced local image with its SHA-256.
- [x] Record the complete current route set and all files under `assets/images/` and `static/img/`; reject duplicate IDs, duplicate routes, missing images, or a baseline count other than 54.
- [x] Add a pre-migration test that requires every current source path and byte hash to match the manifest before any rename or sidebar edit begins.
- [x] Add baseline tests that require the current 54-route set and every existing image path/hash to equal the manifest exactly.
- [x] Add baseline tests that reject any new Markdown page, any missing page, body/front-matter drift, new directories matching `docs/**/checks/security/` or `docs/**/checks/schema/`, and any generated-index category link in `sidebars.js`.
- [x] Run `npm run docs:check`; require all pre-migration baseline checks to exit 0 before Task 2 is marked complete.

## Task 3: Apply the approved byte-preserving renames and seven-section sidebar

**Files:**
- Delete: `docs/welcome.md`
- Create: `docs/releem-overview.md`
- Delete: `docs/getting-started/step-2-add-server.md`
- Create: `docs/getting-started/connect-your-database-server.md`
- Delete: `docs/getting-started/step-4-dashboard.md`
- Create: `docs/getting-started/dashboard-overview.md`
- Delete: `docs/getting-started/step-5-health-checks.md`
- Create: `docs/getting-started/health-checks.md`
- Delete: `docs/getting-started/step-7-weekly-reports.md`
- Create: `docs/getting-started/reports.md`
- Delete: `docs/getting-started/schema-optimization.md`
- Create: `docs/getting-started/schema-checks.md`
- Delete: `docs/getting-started/step-3-getting-and-applying-recommendations.md`
- Create: `docs/getting-started/configuration-tuning.md`
- Modify: `sidebars.js`
- Modify: `tests/docs-structure.test.mjs`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [x] Before each rename, calculate the source SHA-256 and compare it with the manifest. Stop if any source differs or either path overlaps an unrelated dirty change.
- [x] Add a final-state test that requires exactly the seven approved destination paths, forbids their old source paths, accepts no other source-path change, verifies each source/destination pair has the same complete-file hash, and requires the final route set to equal the baseline route set.
- [x] Run `node --test --test-name-pattern='approved renames and final routes' tests/docs-structure.test.mjs`; expect failure because the seven source paths and old sidebar are still present.
- [x] Use `git mv` for only the seven approved source/destination pairs. Do not open or rewrite the Markdown files; after each rename, require the destination SHA-256 to equal the recorded source SHA-256.
- [x] Replace `sidebars.js` with exactly seven top-level entries in this order: `Get Started`, `Supported Databases`, `Installation`, `Dashboard`, `Recommendations`, `Account`, and `FAQ`.
- [x] Configure each of the first six categories with a Docusaurus document link rather than `generated-index`. Use `link: {type: 'doc', id: 'releem-overview'}` for Get Started, then use the exact IDs `releem-agent/mysql-permissions`, `releem-agent/installation-guides/self-managed-servers-automatic-installation`, `getting-started/step-4-dashboard`, `getting-started/step-3-getting-and-applying-recommendations`, and `server-settings/your-server-settings` for the other five category links.
- [x] Under Get Started, include only `getting-started/step-1-register-for-an-account`, an explicit `getting-started/step-2-add-server` item labeled `Connect Your Database Server`, and an explicit `getting-started/how-to-check-if-releem-agent-is-working` item labeled `Troubleshoot the Releem Agent`.
- [x] Under Supported Databases, include `releem-agent/installation-guides/postgresql-manual-linux`; the category link owns `releem-agent/mysql-permissions` and must not duplicate it as an item.
- [x] Under Installation, use nested `Installation Methods` and `Manage the Releem Agent` categories without generated index links. The category link owns the automatic Linux guide. Put exactly these nine remaining method IDs under `Installation Methods`:

  ```text
  releem-agent/installation-guides/self-managed-servers-manual-installation-linux
  releem-agent/installation-guides/self-managed-servers-manual-installation-windows
  releem-agent/installation-guides/self-managed-servers-docker-installation
  releem-agent/installation-guides/installation-in-kubernetes
  releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation
  releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation
  releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation
  releem-agent/installation-guides/clusters
  releem-agent/installation-guides/whm-cpanel
  ```

  Put exactly `releem-agent/configuration`, `releem-agent/how-to-check-logs`, `releem-agent/migration`, `releem-agent/update`, and `releem-agent/uninstallation` under `Manage the Releem Agent`.
- [x] Under Dashboard, include `getting-started/query-analytics`, an explicit `getting-started/schema-optimization` item labeled `Schema Checks`, `getting-started/deadlock-monitoring`, `getting-started/step-5-health-checks`, `getting-started/security-checks`, `getting-started/process-list`, and `getting-started/step-7-weekly-reports` labeled `Reports`. The category link owns `getting-started/step-4-dashboard`.
- [x] Under Recommendations, create nested `Configuration Tuning` and `Query Optimization` categories. The top-level category link owns `getting-started/step-3-getting-and-applying-recommendations`; the Query Optimization category links to `getting-started/query-optimization`. Put exactly these IDs under `Configuration Tuning`:

  ```text
  configuration-tuning/mysql-tuning-process
  configuration-tuning/initial-mysql-configuration
  configuration-tuning/how-to-apply-configuration-using-portal
  configuration-tuning/how-to-apply-configuration-using-agent
  configuration-tuning/how-to-apply-configuration-using-cron
  configuration-tuning/how-to-apply-configuration-manually/linux
  configuration-tuning/how-to-apply-configuration-manually/windows
  configuration-tuning/how-to-apply-configuration-manually/docker
  configuration-tuning/how-to-apply-configuration-manually/aws-rds
  configuration-tuning/how-to-apply-configuration-manually/gcp-cloud-sql
  configuration-tuning/how-to-rollback-to-previous-configuration
  configuration-tuning/limit-memory-for-mysql
  configuration-tuning/example-of-configuration
  ```

  Put exactly these IDs under `Query Optimization` after its linked overview:

  ```text
  query-optimization/enable-sql-query-optimization
  query-optimization/disable-sql-query-optimization
  query-optimization/prepared-statements-issue
  query-optimization/automatic-schema-changes
  query-optimization/schema-change-troubleshooting
  ```
- [x] Under Account, create `Access` and `Billing` groups containing the remaining `server-settings/invite-users-and-assign-roles`, `billing/update-payment-information`, and `billing/cancellation` pages. The category link owns `server-settings/your-server-settings`.
- [x] Use the existing `frequently-asked-questions` document as the seventh top-level entry, labeled `FAQ`.
- [x] Run `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`; expect seven sections, 54 uniquely reachable documents, 54 unchanged routes, seven byte-identical renames, and no new or missing page.

## Task 4: Validate routes, links, images, and rendered navigation

**Files:**
- Modify: `tests/docs-structure.test.mjs`
- Read: `sidebars.js`
- Read: `docusaurus.config.js`
- Read: `.agent/analysis/2026-09-01-releem-docs-structure-baseline.json`

**Reviewers:**
- developer
- releem-user

- [x] Add a sidebar traversal test that counts category-link documents and item documents together, requires all 54 effective IDs exactly once, and rejects a document owned by two sections.
- [x] Add a route/link test that resolves every internal Markdown link against the unchanged baseline route set and rejects any new broken link, redirect dependency, route alias, or orphan page.
- [x] Add an asset test that resolves every Markdown image and MDX `require(...)` reference from each renamed source location and verifies the existing asset path and hash.
- [x] Run a fresh `npm ci`, followed by `npm run agent:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`; record exact exit status, test count, and warning baseline.
- [x] Start the production build with `npm run serve -- --host 127.0.0.1 --port 3000`, then inspect 1280, 1024, 768, and 375 pixel widths.
- [x] Verify the seven top-level labels and order, every category link, all 54 pages, current images, pointer and keyboard navigation, breadcrumbs, previous/next links, absence of horizontal overflow, and absence of JavaScript, route, MDX, link, or asset failures.
- [x] Verify these ten findability tasks using only the restructured navigation: supported database guidance, installation choice, database permissions, agent status/logs, Security Checks, Schema Checks, Configuration Tuning, Query Analytics, Query Optimization, and configuration reversal guidance.
- [x] Stop the local server and confirm no listener remains on the preview port.

## Task 5: Review the implemented corpus and recommend later content work

**Files:**
- Create: `.agent/analysis/2026-09-01-releem-docs-post-restructure-review.md`
- Read: `.agent/analysis/2026-09-01-releem-docs-structure-baseline.json`
- Read: `sidebars.js`
- Read: `docusaurus.config.js`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [x] Inventory every final sidebar destination and classify its existing content as `aligned`, `partially aligned`, `misplaced`, `duplicated`, `unsafe or stale`, or `missing prerequisite content`. Cite exact page paths and line numbers without editing them.
- [x] Review the complete onboarding journey from registration through installation, local agent verification, product-side data confirmation, first Dashboard interpretation, and first recommendation. Record every dead end, duplicated procedure, missing prerequisite, unverifiable claim, or terminology mismatch.
- [x] Review Supported Databases for engine versions, deployment types, connection parameters, least-privilege permissions, monitoring/check/recommendation capability boundaries, and installation routing. Treat absent evidence as a gap, not an inferred product fact.
- [x] Review every installation and production-change instruction for secret handling, download integrity, network scope, database privileges, affected scope, expected output, validation, update, removal, recovery, and rollback. Quote no secret and copy no runnable unsafe command into the report.
- [x] Review Dashboard and Recommendations for visible UI terminology, observed-state versus proposed-action boundaries, Configuration Tuning versus Recommended Configuration synonyms, Query Analytics versus Query Optimization, and distinct aggregate Security/Schema check experiences. Keep the existing aggregate Security and Schema pages/images as the recommended local model; do not propose individual check-page trees.
- [x] Review Account, Billing, FAQ, footer/legal destinations, screenshots, search terms, inbound links, and orphan/findability behavior. Note where a general first-party Releem Health or Security article could supplement—not replace—the versioned product documentation.
- [x] Produce a prioritized recommendation table with columns `Priority`, `Action (add/change/merge/link/verify)`, `Canonical owner`, `Affected existing pages`, `Evidence required`, `User impact`, and `Release gate`. Separate factual/product-owner inputs from editorial work.
- [x] Include a proposed future page list only for genuinely missing user tasks. Mark every proposed new page `NOT AUTHORIZED BY THIS PLAN`; do not create it.
- [x] Include a proposed existing-page change list with exact page/section ownership and rationale. Mark every proposed content edit `NOT AUTHORIZED BY THIS PLAN`; do not apply it.
- [x] End with a recommended next implementation sequence that starts with safety-critical corrections, then onboarding completeness, terminology/UI alignment, screenshots/search, and lower-risk editorial cleanup.

## Task 6: Run final preservation and reviewer gates

**Files:**
- Modify: `.agent/analysis/2026-09-01-releem-docs-post-restructure-review.md`
- Modify: `.agent/CONTINUITY.md`
- Read: `.agent/analysis/2026-09-01-releem-docs-structure-baseline.json`
- Read: `sidebars.js`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [x] Run `npm run agent:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`; require every command to exit 0 and record the exact test count and warning baseline.
- [x] Run a final manifest audit requiring 54 Markdown pages, the exact approved source-path set, byte-identical content/front matter, the unchanged route set, unchanged existing images, no generated-index pages, and exactly seven top-level sidebar entries.
- [x] Have the three independent read-only reviewers inspect the task packet, complete diff, rendered evidence, and post-restructure review. A missing verdict or unresolved material finding blocks completion.
- [x] Record `STRUCTURE: PASS` only if navigation, routes, preserved content, assets, build, rendered QA, and all reviewer verdicts pass. Record `CONTENT: REVIEWED, NOT CHANGED` and link the private recommendations report.
- [x] Run `git status --short`, `git diff --name-status`, `git diff --name-only --cached`, and `git diff --check`. Confirm nothing is staged, unrelated user changes remain untouched, and no external release or remote-write action occurred.

## Acceptance criteria

- Exactly seven top-level entries appear in the approved order.
- The corpus still contains exactly the same 54 public pages and no new `.md` or `.mdx` page.
- Only the seven approved same-directory source renames occur; every renamed file is byte-identical to its source.
- Every page body and front-matter block is byte-for-byte unchanged.
- All 54 pre-restructure public routes remain unchanged, so no redirect is required or added.
- Every existing page is reachable exactly once through a category link or sidebar item; no page is orphaned or duplicated.
- No category uses a generated-index page.
- Existing Security Checks and Schema Checks aggregate pages and images are reused; no individual check hierarchy is created.
- Existing images remain at the same paths with the same hashes.
- Desktop and mobile navigation, links, images, MDX, breadcrumbs, and keyboard interaction pass rendered QA.
- The final private review identifies content that does not align, content that is missing, and a prioritized set of suggested additions/changes without implementing any suggestion.
- The implementation changes structure only. Customer-facing content remains unchanged and release activity remains separately approval-gated.
