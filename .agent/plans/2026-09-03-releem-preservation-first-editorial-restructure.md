# Releem Preservation-First Editorial Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` one bounded task at a time. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the seven-section Releem documentation experience without losing detailed procedures, code blocks, screenshots, recovery guidance, routes, or specialist pages from the committed documentation.

**Architecture:** Commit `9ad7ce3` is the content baseline. Existing Markdown is the factual source and remains intact by default; a change may add concise orientation, links, headings, or clearly separated safety context, but may not replace detailed instructions with generic support text. A preservation manifest and tests make every code fence, image placement, route, and specialist page reviewable. Material that is clearly unsafe or contains sensitive information is an explicit exception, retained privately and called out for review rather than silently erased.

**Tech Stack:** Node.js 20+, npm, Docusaurus 3.9.2, Markdown/MDX, Node built-in tests, existing Docusaurus client redirects.

---

## Non-negotiable content rules

1. Treat all 54 committed documentation pages, their headings, code fences, images, procedures, diagnostics, recovery guidance, and internal links as preserved source material.
2. Do not replace a procedural page with generic language such as “contact support,” “availability is not documented,” or an internal evidence disclaimer when the committed page already contains usable instructions.
3. Preserve each code fence byte-for-byte unless it is an approved safety exception. Every exception must identify the exact page, fence, risk, replacement treatment, and reviewer decision in a private register.
4. Preserve existing screenshot placements and alt text during the restructure. The automatic-install screenshot requires a separate security/visual decision because it appears to contain credential-like/root-password context; retain it in the baseline and flag it for release review rather than deleting it during a general editorial pass.
5. Keep existing specialist pages. Do not create individual Security Check or Schema Check article trees, merge pages only to reduce count, or add top-level Help, Contact, Agent, Security, or Troubleshooting sections.
6. Keep exactly seven top-level sidebar sections: Get Started, Supported Databases, Installation, Dashboard, Recommendations, Account, and FAQ.
7. Preserve current public URLs and direct historical redirect behavior. A route change requires an explicit one-to-one redirect and a preservation-test update.
8. The Technical Writer may clarify prose and navigation, but may not invent product behavior, database coverage, versions, permissions, UI controls, automation, performance outcomes, or rollback guarantees.
9. Keep internal implementation, owner, approval, evidence, and release-process wording in `.agent/`; never add it to a public documentation page.
10. Do not publish, deploy, commit, push, reindex Algolia, or change product/production data as part of this plan.

## Task 1: Freeze the detailed-content baseline before editing

**Files:**
- Create: `.agent/analysis/2026-09-03-committed-content-preservation.json`
- Create: `tests/docs-preservation.test.mjs`
- Modify: `package.json`

**Reviewers:**
- technical-writer

- [ ] Enumerate the committed `docs/**/*.md` corpus and record one row per page with its source path, front matter, ID, slug, public route, H1, ordered headings, body SHA-256, internal links, code-fence language/content SHA-256/line number, image reference/alt text/line number, and procedure/recovery headings.
- [ ] Record the current 31 tracked assets, including every image reference and every page that uses it. Mark screenshot visual freshness as `review-required`, not as a reason to remove it.
- [ ] Add a preservation test that fails when a baseline page disappears, route/ID/slug changes without an explicit route exception, a code fence is removed or changed without a matching safety-exception record, an image placement disappears, or a specialist page loses sidebar ownership.
- [ ] Add `docs:preservation:check` to `package.json` and include the new test in `docs:check`.
- [ ] Run `npm run docs:preservation:check` and `npm run docs:check`; both must pass against the committed baseline before any content edit begins.

## Task 2: Inventory only the permitted editorial changes

**Files:**
- Create: `.agent/analysis/2026-09-03-editorial-change-register.md`
- Modify: `.agent/analysis/2026-09-03-committed-content-preservation.json`

**Reviewers:**
- technical-writer

- [ ] For each page, classify the next change as `No change`, `Navigation/link improvement`, `Clarity edit with preserved procedure`, or `Safety exception`.
- [ ] For every clarity edit, record the exact source page, retained code blocks/images/procedures, the user task improved, and the smallest intended change. Reject any entry whose intended result is a shorter generic substitute for detailed content.
- [ ] For every safety exception, record the exact line or fence, why it is unsafe or sensitive, the public non-executable treatment, the private `DO NOT RUN` historical preservation location, and the release-review question. Do not make a safety exception merely because a command is old or difficult to verify.
- [ ] Record unresolved product/UI/screenshot questions separately at the end. Questions must not cause existing useful content to be erased during implementation.

## Task 3: Repair the seven-section routing without rewriting procedures

**Files:**
- Modify: `sidebars.js`
- Modify: `redirects.mjs` only if a public route changes
- Modify: `tests/docs-directory-mirror.test.mjs`

**Reviewers:**
- technical-writer

- [ ] Confirm the committed sidebar has exactly the seven required top-level sections and that every existing page appears once.
- [ ] Change only category labels, ordering, category links, and page labels needed to make the journey understandable. Preserve document bodies, front matter, source paths, code fences, and images in this task.
- [ ] Keep existing Installation, Agent-management, Configuration Tuning, Query Optimization, Billing, and Access pages as distinct specialist destinations.
- [ ] Keep Security Checks and Schema Checks as aggregate existing pages with their existing screenshots. Do not add individual check-page trees.
- [ ] Add or update a direct redirect only when a route actually changes. Test every legacy source points directly to one canonical destination with no chain or collision.
- [ ] Run `npm run docs:check`, `npm run typecheck`, and `git diff --check`.

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

**Reviewers:**
- technical-writer

- [ ] Add a short purpose-first introduction and direct next links to each existing hub. Keep every existing procedure, code block, screenshot, diagnostic, and recovery section in place.
- [ ] Make the Get Started journey explicit: register, identify the appropriate existing installation guide, connect the server, verify the Agent/data, and continue to Dashboard/Recommendations. Link; do not duplicate the environment-specific commands.
- [ ] Make Dashboard explain observed state and Recommendations explain proposed actions, while retaining detailed feature content on existing specialist pages.
- [ ] State the visible user task and links for Account and FAQ without replacing current account/billing/access details.
- [ ] Use direct customer language. Remove public internal-process wording only; do not delete technical explanation to make the page shorter.
- [ ] Run `npm run docs:preservation:check`, `npm run docs:check`, and `git diff --check`.

## Task 5: Make surgical clarity edits to existing procedures

**Files:**
- Modify: exact existing page paths approved in `.agent/analysis/2026-09-03-editorial-change-register.md`, one page per active task packet
- Modify: `.agent/analysis/2026-09-03-committed-content-preservation.json` only for a documented safety exception

**Reviewers:**
- technical-writer

- [ ] Work one existing specialist page at a time. Start with the reader outcome and prerequisites, retain all existing technical detail, then add small labels or links for expected result, verification, recovery, and next step where the source already supports them.
- [ ] Do not delete or paraphrase an executable code fence. Preserve it exactly unless the corresponding safety-exception record authorizes a specific replacement and private historical copy.
- [ ] Keep code blocks near their documented context. Do not move commands into generic overview pages or duplicate them across install pages.
- [ ] Keep screenshots where they explain navigation or interpretation. For a visibly stale or potentially sensitive image, retain the placement during this task and add a release-review question; do not fabricate a replacement.
- [ ] Run focused route/link checks, `npm run docs:preservation:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check` after each bounded page packet.

## Task 6: Review the preserved, detailed documentation experience

**Files:**
- Create: `.agent/analysis/2026-09-03-preservation-first-editorial-review.md`
- Modify: `tests/docs-preservation.test.mjs` only to correct a test defect discovered during review

**Reviewers:**
- technical-writer

- [ ] Review every changed page against the baseline. Confirm that each retained code block, image placement, procedure, diagnostic path, and recovery instruction remains present and reachable unless the change register records a safety exception.
- [ ] Perform the non-DBA findability journey using existing content: supported-database information, installation-path selection, permissions, connection, verification, Dashboard checks, Recommendations, and recovery.
- [ ] Inspect desktop and 375 px mobile rendering, keyboard navigation, links, images, redirects, and code-block readability. Report screenshot freshness or credential concerns as release questions, without deleting evidence during review.
- [ ] Run `npm run docs:preservation:check`, `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`.
- [ ] Report only genuine remaining gaps: current UI screenshots, unsupported/missing engine facts, unsafe command decisions, legal destinations, Algolia reindex, and publication approval. Do not treat the existence of detailed legacy content as a gap.

## Completion criteria

- The seven-section sidebar and direct historical redirects remain intact.
- Every committed page, code block, screenshot placement, procedure, diagnostic, and recovery path is preserved unless explicitly recorded as a safety exception.
- No detailed page is replaced by generic support or internal-process wording.
- Existing Security/Schema aggregate pages and screenshots remain the documentation model; no individual-check hierarchy is introduced.
- Clarity improvements make existing material easier to navigate without reducing technical depth.
- The preservation suite, link/route checks, typecheck, build, mobile/keyboard review, and Technical Writer review pass.
- Screenshots with possible stale UI or sensitive content are clearly identified for release review; publication remains separately approval-gated.
