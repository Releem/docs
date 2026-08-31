# Releem Documentation Agentic Loop Bootstrap Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a self-contained prompt that tells Codex to install a safe, documentation-first, risk-reviewed agentic loop in this Releem Docusaurus repository.

**Architecture:** Store the copy-paste prompt under `.agent/prompts/` so it remains internal. The prompt will require a deterministic one-task coordinator, durable state, explicit writable scopes, risk-routed read-only reviewers, container-first verification, and safe disabled defaults modeled on `../releem_api` but tailored to this repository.

**Tech Stack:** Markdown, Node.js 20+, npm, Docusaurus 3, Docker, Git, and Codex reviewer agents.

---

## Files

- Create: `.agent/prompts/bootstrap-releem-docs-agentic-loop.md`
- Create: `.agent/plans/2026-08-31-releem-docs-agentic-loop-bootstrap-prompt.md`
- Modify: `.agent/CONTINUITY.md`
- Read: `.agent/specs/2026-08-31-releem-docs-agentic-loop-prompt-design.md`
- Read: `../releem_api/.agent/LOOP.md`
- Read: `../releem_api/scripts/agent-loop.mjs`
- Read: `../releem_api/docs/agent-loop.md`
- Read: `AGENTS.md`
- Read: `package.json`

## Task 1: Write the Bootstrap Prompt

**Files:**
- Create: `.agent/prompts/bootstrap-releem-docs-agentic-loop.md`
- Read: `.agent/specs/2026-08-31-releem-docs-agentic-loop-prompt-design.md`
- Read: `../releem_api/.agent/LOOP.md`
- Read: `../releem_api/scripts/agent-loop.mjs`
- Read: `../releem_api/docs/agent-loop.md`
- Read: `AGENTS.md`
- Read: `package.json`

**Reviewers:**
- documentation
- technical-accuracy
- docusaurus-qa

- [ ] **Step 1: Write the role, repository scope, and acceptance criteria**

Create `.agent/prompts/bootstrap-releem-docs-agentic-loop.md` with this heading sequence:

```markdown
# Bootstrap a Bounded Agentic Documentation Loop for Codex

## Role and Objective
## Acceptance Criteria
## Phase 1: Inspect Before Editing
## Phase 2: Install the Durable Loop
## Configuration Contract
## Plan and Writable-Scope Contract
## Reviewer Routing Contract
## Coordinator Behavior
## Codex Execution Protocol
## Verification and Container Workflow
## Hard Stops and Approval Gates
## Installation Tests
## Final Report
```

State that Codex must inspect and modify the current Releem documentation repository, not merely describe a loop. Define success as installing a disabled-by-default loop that emits one scoped task at a time, uses read-only risk-routed reviewers, validates itself, and does not execute a documentation plan during bootstrap without separate authorization.

- [ ] **Step 2: Write discovery and generated-artifact requirements**

Require Codex to read all applicable `AGENTS.md` files and `.agent/CONTINUITY.md`, inspect Git status and recent commits, compare any existing loop before changing it, and confirm the Docusaurus source of truth. Require it to preserve unrelated changes, use `rg` first, avoid generated directories, and merge with existing `.agent/` files.

Require these artifacts and responsibilities exactly:

```text
.agent/LOOP.md              safe policy and active-plan state
.agent/CONTINUITY.md        bounded cross-turn briefing
.agent/README.md            private operator guide
.agent/reviewers.md         reviewer roles and verdict format
.agent/plans/active.md      active/example plan
scripts/agent-loop.mjs      deterministic coordinator
tests/agent-loop.test.mjs   Node built-in tests
package.json                agent:check/status/next/loop commands
AGENTS.md                   concise loop operating section
Dockerfile/Compose files    minimal Node 20 container workflow
```

- [ ] **Step 3: Write the exact policy and task contracts**

Include this configuration verbatim:

```yaml
status: disabled
mode: continuous-one-by-one
plan: .agent/plans/active.md
max_tasks: 1
continue_until_complete: true
allow_subagents: true
allow_commits: false
allow_push: false
allow_deploy: false
allow_remote_writes: false
allow_secret_changes: false
```

Explain atomic `max_tasks: 1`, plan-wide continuation, disabled installation state, and read-only subagent authority. Define the plan task schema with `**Files:**`, supported file modes, `**Reviewers:**`, unchecked steps, exact verification, and expected results. Allow dependency reads outside scope but restrict writes to declared writable files plus plan and continuity bookkeeping.

- [ ] **Step 4: Write deterministic reviewer routing**

Define reviewer identifiers `documentation`, `technical-accuracy`, `dba`, `security-operations`, `docusaurus-qa`, and `accessibility-seo`. Require documentation review for content work, technical-accuracy review for substantive claims, a DBA lens for MySQL/PostgreSQL operational content, and at most one routed specialist agent. Limit each task to three reviewer agents, prioritize security over presentation when risks overlap, and keep automated Docusaurus checks outside the reviewer limit.

Require each reviewer to be read-only and return:

```markdown
Lens: <reviewer identifier>
Verdict: pass | findings
Material findings:
- `<file>:<line>` — evidence-backed problem and required correction
Non-blocking suggestions:
- optional improvement
```

Missing output or unresolved material findings must stop the task.

- [ ] **Step 5: Write coordinator, execution, and safety behavior**

Require deterministic status, next/manual, and loop/automatic entry points. The coordinator must validate safe configuration, select only the first task with unchecked steps, derive writable scope and reviewer routing, warn about dirty worktrees, detect baseline commands without executing arbitrary Markdown text, reject unscoped/read-only/unsafe tasks, and distinguish plan completion from invalid state.

Define the Codex iteration: restore context, get one packet, inspect scope and conflicts, implement the smallest diff, run focused and baseline checks, dispatch reviewers, fix findings, rerun affected gates, check off only verified work, update continuity, commit only if enabled, and immediately fetch the next task when continuation is true.

Explicitly forbid the coordinator from acting as a daemon, editing product content, launching releases, calling remote write APIs, or bypassing user approvals.

- [ ] **Step 6: Write verification, stop conditions, and completion reporting**

Require a minimal Node 20 container workflow because the repository has none. Require containerized `npm run typecheck` and `npm run build`, plus `git diff --check` and browser/render QA for visible changes. State that newly introduced Docusaurus warnings fail validation even when existing configuration emits warnings rather than errors.

List hard stops for invalid/disabled automatic configuration, missing or ambiguous scope, conflicting dirty work, unverified product claims, unsafe database instructions, failed checks, missing reviews, unresolved findings, credentials, external coordination, product decisions, destructive actions, publication, push, deploy, remote writes, production writes, analytics writes, and secret changes.

Require the final report to list created/modified files, exact commands and results, loop status and active plan, reviewer routing behavior, disabled capabilities, remaining risks, and deviations from the prompt.

## Task 2: Verify and Finalize the Prompt

**Files:**
- Modify: `.agent/prompts/bootstrap-releem-docs-agentic-loop.md`
- Modify: `.agent/CONTINUITY.md`
- Read: `.agent/specs/2026-08-31-releem-docs-agentic-loop-prompt-design.md`

**Reviewers:**
- documentation
- technical-accuracy

- [ ] **Step 1: Validate required headings and safe defaults**

Run:

```bash
rg -n '^## ' .agent/prompts/bootstrap-releem-docs-agentic-loop.md
rg -n 'max_tasks: 1|continue_until_complete: true|allow_subagents: true|allow_commits: false|allow_push: false|allow_deploy: false|allow_remote_writes: false|allow_secret_changes: false' .agent/prompts/bootstrap-releem-docs-agentic-loop.md
```

Expected: every heading from Task 1 Step 1 and all eight policy lines appear.

- [ ] **Step 2: Scan for placeholders and public-doc leakage**

Run:

```bash
if rg -n '\b(TBD|TODO|FIXME|XXX)\b|docs/superpowers|docs/agent-loop\.md|path/to' .agent/prompts/bootstrap-releem-docs-agentic-loop.md; then exit 1; fi
```

Expected: exit 0 with no output.

- [ ] **Step 3: Re-read the complete source and prompt**

Read the design specification and generated prompt from start to finish. Confirm coverage of repository discovery, private artifact paths, exact safe configuration, plan schema, writable scope, reviewer routing, three-agent limit, container workflow, automatic continuation, hard stops, installation tests, and final reporting. Fix any omission, contradiction, or ambiguous permission.

- [ ] **Step 4: Update continuity**

Add one ISO-timestamped `[OUTCOMES]` entry with `[CODE]` provenance recording the prompt path, documentation-first scope, one-task continuation contract, reviewer routing, safe defaults, and validation results. Keep existing entries intact and do not paste raw command logs.

- [ ] **Step 5: Run final repository checks**

Run:

```bash
git diff --check -- .agent/prompts/bootstrap-releem-docs-agentic-loop.md .agent/plans/2026-08-31-releem-docs-agentic-loop-bootstrap-prompt.md .agent/CONTINUITY.md
git status --short
```

Expected: diff check exits 0; status contains the new prompt and plan plus the pre-existing untracked continuity file, with no unrelated modifications introduced by this work.

- [ ] **Step 6: Commit the implementation artifacts**

Run:

```bash
git add .agent/prompts/bootstrap-releem-docs-agentic-loop.md .agent/plans/2026-08-31-releem-docs-agentic-loop-bootstrap-prompt.md
git commit -m "docs: add documentation agentic loop prompt"
```

Expected: one focused local commit containing the prompt and implementation plan. Leave `.agent/CONTINUITY.md` untracked because it predated this task and contains unrelated user-owned continuity history.
