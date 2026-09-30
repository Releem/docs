# Disabled Loop Schema Example

**Goal:** Demonstrate one bounded private task packet without authorizing a
customer-facing documentation change.

**Architecture:** The example can create one private inspection note under
`.agent/`; the coordinator remains side-effect-free and the public Docusaurus
sources remain unchanged.

**Tech Stack:** Node.js 20, Markdown, and the repository's Docusaurus 3 npm
workflow.

## Task 1: Inspect the disabled loop packet

**Files:**
- Create: `.agent/loop-smoke-check.md`
- Read: `.agent/LOOP.md`
- Read: `.agent/README.md`
- Read: `.agent/reviewers.md`

**Reviewers:**
- developer
- technical-writer
- releem-user

- [ ] Confirm the packet is bounded to the private example file; do not create it or change public documentation without separate user authorization.
- [ ] Confirm the automatic entry point refuses while `status` is `disabled`.
