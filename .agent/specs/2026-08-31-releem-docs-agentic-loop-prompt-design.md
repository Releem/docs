# Releem Documentation Agentic Loop Prompt Design

Date: 2026-08-31
Status: Approved

## Goal

Create a self-contained, copy-paste prompt that tells Codex to install a safe,
documentation-first agentic development loop in this Releem Docusaurus
repository. The prompt must adapt the bounded task-packet loop in
`../releem_api` to the documentation site's source layout, container-first
policy, verification commands, and editorial risks.

The installed loop will execute one explicitly planned task at a time, run
automated checks and independent reviews, persist concise continuity state,
and continue until the plan is complete or a hard stop is reached.

## Scope

The loop is optimized for documentation changes and closely related site work:

- Markdown and MDX content under `docs/`
- navigation and routing in `sidebars.js` and `docusaurus.config.js`
- Docusaurus styling in `src/css/custom.css`
- documentation assets under `assets/images/` and `static/img/`
- repository-local tooling required to validate or operate the docs site

It is not a general autonomous release system. It must not push, deploy,
publish, change secrets, or write to remote or production systems without
separate, explicit user authorization.

## Selected Architecture

Use a hybrid loop with durable repository state and a deterministic local
coordinator. The coordinator does not implement documentation changes itself;
it validates policy and emits one bounded task packet for Codex to execute.

The installed loop consists of:

- `.agent/LOOP.md`: active-plan path, execution mode, and permission flags.
- `.agent/CONTINUITY.md`: compact cross-turn plans, decisions, progress,
  discoveries, and outcomes.
- `.agent/README.md`: operator documentation kept outside the public
  Docusaurus content tree.
- `.agent/reviewers.md`: reviewer responsibilities, routing rules, and output
  contract.
- `.agent/plans/active.md`: the active or example implementation plan.
- `scripts/agent-loop.mjs`: configuration validation, first-unchecked-task
  selection, writable-scope extraction, reviewer routing, and task-packet
  output.
- `tests/agent-loop.test.mjs`: coordinator tests using the Node built-in test
  runner.
- `package.json`: native commands for syntax/tests, status, next task, and the
  automatic entry point.
- `AGENTS.md`: a concise operating section that points agents at the canonical
  loop files without duplicating their full contents.
- a minimal Node 20 container workflow because this repository currently has
  no Dockerfile or Compose workflow and the repository policy is
  container-first.

Internal loop files belong under `.agent/`, not `docs/`, so they do not become
public Docusaurus pages.

## Configuration Contract

The bootstrap prompt must require these safe initial values:

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

`max_tasks: 1` bounds each iteration; it does not limit the whole plan because
`continue_until_complete: true` tells Codex to request the next packet after
the current task passes every gate. Installation remains disabled until the
user supplies or approves an actionable plan and explicitly enables the loop.

`allow_subagents: true` authorizes independent, read-only review agents. It
does not authorize those agents to edit files, send messages, call write APIs,
or perform release actions. Commits, pushes, deployments, remote writes, and
secret changes remain disabled by default.

## Plan and Task Contract

The active plan must be Markdown and contain a goal, architecture summary,
relevant technology, and numbered task sections. Every writable task must use
this structure:

```markdown
## Task N: Descriptive title

**Files:**
- Modify: `docs/example.md`
- Read: `sidebars.js`

**Reviewers:**
- documentation
- technical-accuracy
- dba

- [ ] Make the bounded change.
- [ ] Run the specified verification and record the expected result.
```

Supported file modes are `Read`, `Create`, `Modify`, `Test`, `Test fixture`,
and `Delete`. Codex may read dependencies outside the declared list when
needed to understand the task, but it may write only declared writable files
plus the active plan and `.agent/CONTINUITY.md` bookkeeping.

The coordinator must reject writable tasks when it cannot derive an explicit
scope. It must also reject unknown reviewer names, unsupported loop modes,
`max_tasks` values other than `1`, missing plans, and unsafe enabled
capabilities. It may parse verification descriptions, but it must never
execute arbitrary shell text extracted from Markdown.

## Reviewer Architecture

Use risk-routed review instead of copying all six fixed reviewers from
`releem_api` into every docs task.

### Core review

- **Documentation reviewer:** checks clarity, organization, terminology,
  audience fit, task completeness, duplication, front matter, and navigation
  placement. It runs for every content task and may be the only reviewer for a
  demonstrably mechanical typo-only task.
- **Technical-accuracy reviewer:** checks substantive Releem behavior,
  commands, compatibility claims, and evidence. It rejects invented product
  behavior and receives task-specific database or product-domain instructions
  when applicable.

### Specialist review

One specialist slot is selected by the highest task risk:

- **DBA lens:** MySQL or PostgreSQL configuration, privileges, tuning,
  backups, rollback, availability, or operational database instructions. This
  lens augments the technical-accuracy reviewer rather than consuming a fourth
  reviewer slot.
- **Security/operations reviewer:** installation commands, credentials,
  permissions, `sudo`, downloads, networking, cloud IAM, deletion, or
  production-facing procedures.
- **Docusaurus QA reviewer:** navigation, doc IDs, front matter, links, MDX,
  assets, theme configuration, CSS, or rendered behavior.
- **Accessibility/SEO reviewer:** new landing pages, major information-
  architecture changes, headings, metadata, link wording, or images.

No task may launch more than three reviewer agents. Automated checks do not
count toward this limit. When multiple specialist concerns apply, the router
must combine compatible instructions into the selected specialist's brief and
prioritize operational safety over presentation concerns. Docusaurus build,
typecheck, link, asset, and render checks still run even when the specialist
agent is security-focused.

Review agents are independent and read-only. Their output must identify the
review lens, verdict, material findings with file/line evidence, and optional
non-blocking suggestions. Missing required reviewer output is a hard stop.

## Execution Flow

For every task iteration, Codex must:

1. Re-read all applicable `AGENTS.md` files and `.agent/CONTINUITY.md`.
2. Validate `.agent/LOOP.md`, the active plan, and the Git worktree.
3. Select only the first task containing unchecked steps.
4. Derive its writable files and reviewer requirements.
5. Stop if scope is ambiguous or unrelated dirty changes conflict with the
   task.
6. Inspect the declared files and relevant dependencies, including
   `sidebars.js` and `docusaurus.config.js` for structural changes.
7. Make the smallest safe change while preserving existing documentation and
   asset conventions.
8. Run task-specific checks followed by proportionate baseline verification.
9. Launch the routed read-only reviewers after automated verification.
10. Fix material findings, rerun affected checks, and repeat the relevant
    reviews.
11. Check off plan steps only after fresh successful verification and review.
12. Update `.agent/CONTINUITY.md` with concise ISO-timestamped,
    provenance-tagged facts.
13. Commit only if `allow_commits: true` and every gate has passed.
14. Immediately request the next task when continuation is enabled.

The loop succeeds only when the active plan has no unchecked task.

## Verification Model

The bootstrap prompt must require repository-native, container-first checks.
For this repository, the baseline is:

- `npm run typecheck`
- `npm run build`
- `git diff --check`
- rendered-page or browser QA when navigation, styling, assets, or visible
  behavior changes

The implementation must use Node.js 20 or newer and npm, consistent with
`AGENTS.md`. It must add a minimal container workflow rather than install host
system packages. The loop may run narrower checks first, but source changes
are not complete until all applicable baseline checks pass. Newly introduced
Docusaurus warnings are failures even when the current configuration reports
broken links as warnings.

## Hard Stops

The loop must preserve verified work and stop without marking the task
complete when:

- configuration is disabled or invalid for automatic execution;
- the active plan is missing, ambiguous, read-only, or unscoped;
- unrelated dirty work overlaps the declared scope;
- product behavior cannot be verified from repository evidence, supplied
  product evidence, or an authoritative source;
- a database or operational instruction remains unsafe or ambiguous;
- a required check fails and cannot be repaired within the task scope;
- required reviewer output is missing or a material finding remains;
- credentials, external coordination, or a material product decision is
  required;
- the next step needs destructive behavior, publication, push, deployment,
  remote writes, production writes, analytics writes, or secret changes.

The plan and continuity file must record the exact blocker without raw logs or
secrets. The coordinator must distinguish successful plan completion from an
invalid or blocked state. An active plan with no unchecked task is successful
termination, not a hard stop.

## Installation Validation

Before declaring the installed loop ready, the implementing Codex must prove:

- coordinator syntax and Node built-in tests pass;
- the status command reports parsed policy, active plan, Git warning, detected
  baseline checks, reviewer route, and next-task state;
- automatic mode refuses to run while `status: disabled`;
- a two-task fixture yields only the first task;
- invalid `max_tasks`, permissions, plans, scopes, and reviewer names are
  rejected;
- completed plans produce a distinct successful result;
- reviewer routing covers database, installation/security, navigation, and
  typo-only tasks;
- containerized `npm run typecheck` and `npm run build` pass;
- documentation, package commands, and safe defaults agree;
- `git diff --check` passes and temporary fixtures are removed.

## Bootstrap Prompt Deliverable

The final deliverable is a tailored, self-contained Markdown prompt stored
under `.agent/prompts/`. It must tell Codex to inspect and modify this
repository, not merely describe a possible loop. It must include:

- role, objective, and acceptance criteria;
- required repository discovery and preservation of unrelated changes;
- exact generated artifacts and configuration defaults;
- plan, writable-scope, and reviewer-routing contracts;
- container-first execution and verification requirements;
- hard-stop and approval rules;
- installation tests and final report format.

The prompt must direct Codex to reuse a compatible existing loop if one appears
before implementation and to merge with existing `.agent/` state rather than
overwrite it. It must not execute a documentation plan during bootstrap unless
the user separately supplies and authorizes that plan.

## Non-Goals

- A background daemon.
- Autonomous task planning from an ambiguous product request.
- Mandatory review agents unrelated to the task risk.
- Publication, deployment, push, production changes, or remote writes.
- Editing generated `build/`, `.docusaurus/`, `.astro/`, or dependencies.
- Moving internal loop documentation into the public `docs/` tree.
