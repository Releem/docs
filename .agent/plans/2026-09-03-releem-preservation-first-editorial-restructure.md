# Releem Preservation-First Editorial Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` one bounded task at a time. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the seven-section Releem documentation experience without losing validated procedures, code blocks, screenshots, recovery guidance, routes, or specialist pages, while treating the completed Linux consolidation as the current installation baseline.

**Architecture:** Commit `9ad7ce3` remains the historical 54-page content baseline. The user-approved Linux consolidation overlay is now part of the working baseline: three pages became one canonical Linux page, PostgreSQL and MariaDB permission pages were added, the MySQL permission page was made engine-specific, and the credential-bearing screenshot was removed, leaving 54 current pages. Existing Markdown outside documented exceptions remains the factual source; later changes may improve orientation and clarity but may not replace validated detail with generic support text. The preservation manifest, consolidation overlay, migration checklist, and tests make every code fence, image placement, route, and specialist page reviewable.

**Tech Stack:** Node.js 20+, npm, Docusaurus 3.9.2, Markdown/MDX, Node built-in tests, existing Docusaurus client redirects.

---

## Non-negotiable content rules

1. Treat the 54 committed pages as historical source material and the approved 54-page Linux-consolidation and permission-split overlay as the current source contract. Do not restore the three retired Linux/PostgreSQL installation pages.
2. Do not replace a procedural page with generic language such as “contact support,” “availability is not documented,” or an internal evidence disclaimer when the committed page already contains usable instructions.
3. Preserve each current code fence byte-for-byte unless it is an approved safety exception. In particular, preserve the six one-command Linux installation blocks with masked prompts, temporary-file cleanup, and no inline credentials. Every later exception must identify the exact page, fence, risk, replacement treatment, and reviewer decision in a private register.
4. Preserve existing screenshot placements and alt text except the removed automatic-install screenshot. Do not restore `static/img/releem-dashboard-agent-automatic-installation.png`; its hash, removal reason, and rotation requirement remain recorded privately.
5. Keep existing specialist pages. Do not create individual Security Check or Schema Check article trees, merge pages only to reduce count, or add top-level Help, Contact, Agent, Security, or Troubleshooting sections.
6. Keep exactly seven top-level sidebar sections: Get Started, Supported Databases, Installation, Dashboard, Recommendations, Account, and FAQ.
7. Preserve current public URLs and all 60 direct Docusaurus client redirects. The nine Linux-consolidation rules must continue to resolve directly to `/installation/linux` with the correct database query and section anchor, without a redirect chain.
8. The Technical Writer may clarify prose and navigation, but may not invent product behavior, database coverage, versions, permissions, UI controls, automation, performance outcomes, or rollback guarantees.
9. Keep internal implementation, owner, approval, evidence, and release-process wording in `.agent/`; never add it to a public documentation page.
10. Do not publish, deploy, commit, push, reindex Algolia, or change product/production data as part of this plan. Publication remains blocked by the recorded upstream installer exposure risks until they are remediated or explicitly accepted by the responsible publisher.

## Task 1: Freeze the detailed-content baseline before editing

**Files:**
- Create: `.agent/analysis/2026-09-03-committed-content-preservation.json`
- Create: `tests/docs-preservation.test.mjs`
- Modify: `package.json`

**Reviewers:**
- technical-writer

- [x] Enumerate the committed `docs/**/*.md` corpus and record one row per page with its source path, front matter, ID, slug, public route, H1, ordered headings, body SHA-256, internal links, code-fence language/content SHA-256/line number, image reference/alt text/line number, and procedure/recovery headings.
- [x] Record the current 31 tracked assets, including every image reference and every page that uses it. Mark screenshot visual freshness as `review-required`, not as a reason to remove it.
- [x] Add a preservation test that fails when a baseline page disappears, route/ID/slug changes without an explicit route exception, a code fence is removed or changed without a matching safety-exception record, an image placement disappears, or a specialist page loses sidebar ownership.
- [x] Add `docs:preservation:check` to `package.json` and include the new test in `docs:check`.
- [x] Run `npm run docs:preservation:check` and `npm run docs:check`; both must pass against the committed baseline before any content edit begins.

## Task 2: Inventory only the permitted editorial changes

**Files:**
- Create: `.agent/analysis/2026-09-03-editorial-change-register.md`
- Modify: `.agent/analysis/2026-09-03-committed-content-preservation.json`

**Reviewers:**
- technical-writer

- [x] For each page, classify the next change as `No change`, `Navigation/link improvement`, `Clarity edit with preserved procedure`, or `Safety exception`.
- [x] For every clarity edit, record the exact source page, retained code blocks/images/procedures, the user task improved, and the smallest intended change. Reject any entry whose intended result is a shorter generic substitute for detailed content.
- [x] For every safety exception, record the exact line or fence, why it is unsafe or sensitive, the public non-executable treatment, the private `DO NOT RUN` historical preservation location, and the release-review question. Do not make a safety exception merely because a command is old or difficult to verify.
- [x] Record unresolved product/UI/screenshot questions separately at the end. Questions must not cause existing useful content to be erased during implementation.

## Task 3: Repair the seven-section routing without rewriting procedures

**Files:**
- Modify: `sidebars.js`
- Modify: `redirects.mjs` only if a public route changes
- Modify: `tests/docs-directory-mirror.test.mjs`

**Reviewers:**
- technical-writer

- [x] Confirm the committed sidebar has exactly the seven required top-level sections and that every existing page appears once.
- [x] Change only category labels, ordering, category links, and page labels needed to make the journey understandable. Preserve document bodies, front matter, source paths, code fences, and images in this task.
- [x] Keep existing Installation, Agent-management, Configuration Tuning, Query Optimization, Billing, and Access pages as distinct specialist destinations.
- [x] Keep Security Checks and Schema Checks as aggregate existing pages with their existing screenshots. Do not add individual check-page trees.
- [x] Add or update a direct redirect only when a route actually changes. Test every legacy source points directly to one canonical destination with no chain or collision.
- [x] Run `npm run docs:check`, `npm run typecheck`, and `git diff --check`.

## Approved Linux consolidation baseline (completed after Task 3)

**Canonical records:**
- `.agent/analysis/2026-09-03-linux-installation-consolidation.json`
- `.agent/analysis/2026-09-03-linux-installation-migration-checklist.md`
- `tests/docs-linux-installation.test.mjs`

- [x] Consolidate MySQL, MariaDB, and PostgreSQL automatic/manual Linux installation into `docs/installation/linux.md` with one database Tabs group and stable query/anchor links.
- [x] Present each database/method path as one copyable command while retaining masked prompts, temporary-file cleanup, exact permissions links, expected result, verification, troubleshooting, update, and uninstall guidance.
- [x] Retire the three superseded source pages, add PostgreSQL permissions, split MySQL and MariaDB permissions into engine-specific references, remove the credential-bearing screenshot, and preserve every retired route through a direct client redirect.
- [x] Verify the 54-page source contract, 60 unique redirects, six embedded command bodies, desktop/mobile query-and-anchor behavior, keyboard navigation, typecheck, build, and independent technical reviews.

## Task 4: Add orientation only around retained detail

**Files:**
- Modify: `docs/get-started/releem-overview.md`
- Modify: `docs/get-started/register-for-an-account.md`
- Modify: `docs/get-started/connect-your-database-server.md`
- Modify: `docs/get-started/troubleshoot-releem-agent.md`
- Modify: `docs/dashboard/overview.md`
- Modify: `docs/recommendations/overview.md`
- Modify: `docs/account/overview.md`
- Modify: `docs/faq.md`
- Read: `docs/installation/linux.md`
- Read: `.agent/analysis/2026-09-03-linux-installation-migration-checklist.md`

**Reviewers:**
- technical-writer

- [ ] Add a short purpose-first introduction and direct next links to each existing hub. Keep every existing procedure, code block, screenshot, diagnostic, and recovery section in place.
- [x] Route MySQL, MariaDB, and PostgreSQL Linux users from Connect Your Database Server to the exact canonical automatic/manual query-and-anchor destinations.
- [ ] Make the Get Started journey explicit: register, choose the correct database and deployment path, connect the server, distinguish Agent connection from current-data arrival, and continue to Dashboard/Recommendations. Link to the canonical Linux method or other environment guide; do not duplicate installation commands.
- [ ] Make Dashboard explain observed state and Recommendations explain proposed actions, while retaining detailed feature content on existing specialist pages.
- [ ] State the visible user task and links for Account and FAQ without replacing current account/billing/access details.
- [ ] Use direct customer language. Remove public internal-process wording only; do not delete technical explanation to make the page shorter.
- [ ] Run `node --test tests/docs-linux-installation.test.mjs`, `npm run docs:preservation:check`, `npm run docs:check`, and `git diff --check`.

## Task 5: Make surgical clarity edits to existing procedures

**Files:**
- Modify: one exact existing page path selected from an approved unchecked row in `.agent/analysis/2026-09-03-editorial-change-register.md`, written into the active task packet before work begins
- Modify: `.agent/analysis/2026-09-03-committed-content-preservation.json` only for a documented safety exception
- Read: `.agent/analysis/2026-09-03-linux-installation-consolidation.json`
- Read: `.agent/analysis/2026-09-03-linux-installation-migration-checklist.md`

**Reviewers:**
- technical-writer

- [ ] Work one existing specialist page at a time. Start with the reader outcome and prerequisites, retain all existing technical detail, then add small labels or links for expected result, verification, recovery, and next step where the source already supports them.
- [ ] Do not delete or paraphrase an executable code fence. Preserve it exactly unless the corresponding safety-exception record authorizes a specific replacement and private historical copy. Treat the six one-command blocks in `docs/installation/linux.md` as the current protected versions, not the retired baseline commands.
- [ ] Keep code blocks near their documented context. Do not move commands into generic overview pages or duplicate them across install pages.
- [ ] Do not restore the retired Linux pages, the removed sensitive screenshot, inline secret examples, unrestricted network rules, or curl-to-shell examples. If upstream installer behavior changes, authorize and test that remediation as a separate bounded task before changing the Linux warning or publication gate.
- [ ] Keep screenshots where they explain navigation or interpretation. For any other stale or potentially sensitive image, add a release-review question and block its publication when necessary; do not fabricate a replacement.
- [ ] Run focused route/link checks, `node --test tests/docs-linux-installation.test.mjs`, `npm run docs:preservation:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check` after each bounded page packet.

## Task 6: Review the preserved, detailed documentation experience

**Files:**
- Create: `.agent/analysis/2026-09-03-preservation-first-editorial-review.md`
- Modify: `tests/docs-preservation.test.mjs` only to correct a test defect discovered during review

**Reviewers:**
- technical-writer

- [ ] Review every changed page against the baseline. Confirm that each retained code block, image placement, procedure, diagnostic path, and recovery instruction remains present and reachable unless the change register records a safety exception.
- [ ] Perform the non-DBA findability journey using current content: supported-database information, exact Linux engine/method selection, permissions, one-command installation, Agent connection, current-data verification, Dashboard checks, Recommendations, and recovery.
- [ ] Inspect desktop and 375 px mobile rendering, keyboard navigation, links, images, redirects, code-block readability, all `?database=` selections, and every query-plus-anchor destination. Confirm the six one-command blocks remain usable without horizontal page overflow.
- [ ] Confirm the removed credential-bearing screenshot is absent from source and build. Report freshness or credential concerns for remaining screenshots as release questions without restoring unsafe evidence or fabricating replacements.
- [ ] Run `node --test tests/docs-linux-installation.test.mjs`, `npm run docs:preservation:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, `RELEEM_VERIFY_REDIRECT_BUILD=1 node --test tests/docs-directory-mirror.test.mjs`, and `git diff --check`.
- [ ] Report only genuine remaining gaps: current UI screenshots, unsupported/missing engine facts, the unresolved upstream installer risks, legal destinations, Algolia reindex, and publication approval. Do not treat the retired Linux pages or the existence of detailed legacy content as gaps.

## Completion criteria

- The seven-section sidebar and direct historical redirects remain intact.
- The approved 54-page current source contract, the one canonical Linux page, the separate MySQL/MariaDB/PostgreSQL permission references, and all 60 direct client redirects remain intact.
- Every current page, code block, screenshot placement, procedure, diagnostic, and recovery path is preserved unless explicitly recorded as a safety exception; the three retired pages and removed sensitive screenshot remain private historical records only.
- No detailed page is replaced by generic support or internal-process wording.
- Existing Security/Schema aggregate pages and screenshots remain the documentation model; no individual-check hierarchy is introduced.
- Clarity improvements make existing material easier to navigate without reducing technical depth or duplicating the Linux installation commands.
- Each Linux engine and method remains directly addressable, renders as one copyable command, preserves masked secret entry and cleanup, and links to canonical permissions, verification, troubleshooting, update, and uninstall guidance.
- The preservation suite, Linux consolidation suite, link/route checks, built redirect checks, typecheck, build, desktop/mobile/keyboard review, and Technical Writer review pass.
- Remaining screenshot, installer-risk, search, legal, and product-fact questions are clearly identified for release review; publication remains separately approval-gated.
