# Operating the Releem Documentation Loop

This private loop turns an explicit Markdown plan into one deterministic,
bounded task packet at a time. It is designed for a primary Codex worker plus
three possible read-only perspectives: developer, technical writer, and Releem
user. Nothing under `.agent/` is part of the public Docusaurus documentation.

## Commands

Run the repository's npm commands directly with Node.js 20 or newer:

```bash
npm run agent:check
npm run agent:status
npm run agent:next
npm run agent:loop
```

- `agent:check` syntax-checks the coordinator and runs its Node built-in tests.
- `agent:status` reports policy, configuration problems, plan state, worktree
  paths, detected checks, the next task, and reviewer routing. It works while
  the loop is disabled.
- `agent:next` validates and prints exactly one manual packet for the first task
  with an unchecked step. It works while disabled and performs no task action.
- `agent:loop` is the automatic entry point. It refuses while `status` is
  `disabled`. When enabled, it still only emits one packet; Codex performs the
  task under repository approval and sandbox rules.

The coordinator may inspect files and `git status --short`. It does not execute
Markdown command text, edit files, run npm checks, launch reviewer agents, or
advance checkboxes.

## Plan contract

The configured plan must contain a goal, architecture summary, technology
summary, and numbered task sections. The first task containing an unchecked
step is the only eligible task.

```markdown
# Documentation plan

**Goal:** State the user outcome.

**Architecture:** State canonical content and routing boundaries.

**Tech Stack:** Node.js 20, Docusaurus 3, Markdown/MDX.

## Task 1: Improve one installation guide

**Files:**
- Modify: `docs/releem-agent/installation-guides/example.md`
- Test: `tests/example.test.mjs`
- Read: `sidebars.js`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [ ] Update only the declared guide using verified product evidence.
- [ ] Run `npm run typecheck` and expect exit 0.
- [ ] Run `npm run build` and expect exit 0 with no new warnings.
```

Every unchecked task requires its own `**Files:**` block and at least one exact
writable file. Supported modes are `Read`, `Create`, `Modify`, `Test`, `Test
fixture`, and `Delete`. `Read` never grants write access. Globs, variables,
command substitutions, placeholders, repository-external paths, directories,
symlinked path components, and writable generated paths (including case
variants) such as `build/`, `.docusaurus/`, `.astro/`, and `node_modules/` are
rejected. Generated output may be declared `Read` for rendered QA. `Modify` and
`Delete` targets must exist; `Create` targets must not.

Codex may read undeclared dependencies required for understanding. Writes are
limited to the current task's writable files, checkbox bookkeeping in the
active plan, and concise facts in `.agent/CONTINUITY.md`.

## One-task lifecycle

1. Re-read all applicable `AGENTS.md` files and `.agent/CONTINUITY.md`.
2. Run `npm run agent:status`; resolve every configuration problem.
3. Request one packet with `npm run agent:next`, or with `npm run agent:loop`
   only after the user explicitly enables the reviewed plan.
4. Read declared files and necessary read-only dependencies.
5. Compare `git status --short` paths with writable scope. Stop on overlap with
   unrelated changes or ambiguous ownership.
6. Implement the smallest safe diff while preserving front matter, doc IDs,
   routes, links, assets, and nearby writing style.
7. Run focused checks, then detected baseline checks such as documentation
   tests, `npm run typecheck`, `npm run build`, and `git diff --check`.
8. Give the task packet, relevant diff, and applicable instructions to only the
   effective read-only reviewer roles.
9. Fix all material findings within scope, then rerun affected checks and
   reviews.
10. Mark a step complete only with fresh passing evidence. Never check off a
    failed, skipped, or blocked step.
11. Add only concise ISO-timestamped facts to `.agent/CONTINUITY.md` using
    `[USER]`, `[CODE]`, `[TOOL]`, or `[ASSUMPTION]`.
12. If every gate passes and `continue_until_complete` is true, immediately
    request the next one-task packet. Finish only when the plan reports
    `PLAN COMPLETE`.

## Evidence and safety gates

Releem product behavior, supported engines and versions, UI terminology,
database privileges, and production procedures require supplied evidence,
repository evidence, or a current authoritative read-only source. A database
change must explain prerequisites, affected scope, privilege boundary, risk,
validation, and reversal where applicable. A verified unsafe public command may
be removed or disabled without waiting for a replacement, but history belongs
privately under `.agent/` and must be marked `DO NOT RUN` with secrets removed.

Stop without checking off the task when scope, ownership, evidence, authority,
automated verification, or reviewer verdicts are insufficient. Also stop for
credentials, product-owner decisions, external coordination, publication,
push, deployment, remote API writes, production or analytics writes, secret
changes, external messaging, or destructive action beyond an exact approved
`Delete` file.

On a stop, preserve verified work, record only the precise high-signal blocker
when allowed, and report the failed gate, command, and shortest safe next
action. Do not weaken a check, suppress a warning, broaden scope, or invent a
product fact to force progress.

## Enabling and completion

The installed policy is intentionally `status: disabled`. Enabling requires the
user to review the active plan and explicitly authorize changing only `status`
to `enabled`. All other safety flags remain unchanged. Completion means there
is no unchecked task and every completed step has fresh verification and the
required reviewer verdicts. Publication remains separately approval-gated.
