# Releem Documentation Loop Policy

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

This policy is deliberately disabled. Status and manual packet inspection are
available while disabled; automatic packet generation is not. The coordinator
is a read-only policy and task-selection tool. It never executes commands from
a plan, edits documentation, checks boxes, starts a daemon, contacts remote
services, commits, publishes, or deploys.

`max_tasks: 1` bounds each iteration. `continue_until_complete: true` permits
Codex to request the next packet only after the current task passes its scope,
evidence, automated-verification, and reviewer gates. `allow_subagents: true`
permits only the independent read-only reviewer roles defined in
`.agent/reviewers.md`.

Enabling the loop requires an explicit user decision to change `status` to
`enabled` after the active plan and its exact writable scopes have been
reviewed. Enabling does not authorize commits, publication, deployment, remote
writes, production or analytics changes, destructive actions, or secret
changes.
