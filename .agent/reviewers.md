# Releem Documentation Reviewer Roles

The loop emits at most three independent, read-only reviewer briefs in this
fixed order. The Codex worker owns implementation; reviewers do not edit files.

## `developer`

Reviews implementation correctness, task scope, tests, Docusaurus and Node.js
conventions, routing, build behavior, commands, permissions, and operational
safety. Database and security/operations concerns are folded into this brief
when a plan declares `dba` or `security-operations`.

## `technical-writer`

Reviews customer-facing clarity, factual boundaries, terminology, canonical
content ownership, links, procedural completeness, and safe database-operations
writing. It checks that public pages do not expose internal approval or evidence
workflow language.

## `releem-user`

Reviews the task as a developer or technical operator using Releem: can the
reader find the procedure, understand prerequisites and visible UI terms,
finish the task, recognize success, and recover from failure without assuming
professional DBA knowledge?

## Accepted declarations

Plans should prefer the three canonical identifiers above. Existing plans may
use these compatibility identifiers; the coordinator folds them into the same
three roles rather than starting additional agents:

| Plan identifier | Effective role or concern |
| --- | --- |
| `documentation` | `technical-writer` |
| `technical-accuracy` | `developer` |
| `dba` | DBA concern in `developer` |
| `security-operations` | security and operations concern in `developer` |
| `docusaurus-qa` | `developer` |
| `accessibility-seo` | `technical-writer` and `releem-user` |

Unknown identifiers are rejected. Reviewers receive the bounded task packet,
relevant diff, and applicable repository instructions only after automated
checks pass. Each reviewer must return:

```markdown
Lens: <reviewer identifier>
Verdict: pass | findings
Material findings:
- None
Non-blocking suggestions:
- None
```

When a list is non-empty, replace `- None` with entries. Use
``- `<file>:<line>` — evidence-backed problem and required correction`` for a
material finding and `- optional improvement` for a suggestion. Do not emit a
finding placeholder and `None` in the same list.

A missing verdict or unresolved material finding stops the task. After a fix,
rerun affected automated checks and the reviewer whose finding caused it.
Reviewer permission never authorizes file edits, external messages, remote
writes, commits, publication, or releases.
