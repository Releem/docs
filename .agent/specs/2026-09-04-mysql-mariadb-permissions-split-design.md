# MySQL and MariaDB Permissions Split Design

**Status:** Approved by the user on 2026-09-04

## Goal

Give MySQL and MariaDB users separate canonical permission references so each Linux installation tab links to instructions for the selected engine.

## Design

- Keep `docs/supported-databases/mysql/required-permissions.md` and `/supported-databases/mysql/required-permissions` as the MySQL-only canonical reference.
- Add `docs/supported-databases/mariadb/required-permissions.md` with `id: required-permissions`, `slug: /supported-databases/mariadb/required-permissions`, and the title `MariaDB Permissions for Releem Agent`.
- Retain the combined page's validated monitoring, query-visibility, configuration-application, schema-application, exact-source-host, and verification guidance, but express it separately for each engine.
- Keep MySQL-only material, including `SYSTEM_VARIABLES_ADMIN` and the AWS RDS definer-procedure example, on the MySQL page.
- Keep MariaDB's state-changing `SUPER` guidance on the MariaDB page. Do not imply that MySQL privileges, Performance Schema objects, or managed-service behavior apply unchanged to MariaDB.
- Keep database grants out of the Linux installation page. Point the MySQL and MariaDB tabs directly to their respective canonical permission references.
- Add both permission references to Supported Databases navigation. Preserve the existing MySQL route, so no redirect is required.

## Content boundaries

- Do not invent MariaDB privileges or feature support. Use only the current combined reference and repository Agent behavior, with version/provider validation warnings retained.
- Do not restore wildcard account examples, inline credentials, broad mutation privileges in monitoring-only sections, or the removed sensitive screenshot.
- Continue separating monitoring/query visibility from configuration and schema application.
- Preserve the one-command Linux installation blocks and their existing security warning.

## State and preservation updates

The historical baseline remains 54 pages. The current overlay changes from `54 - 3 + 2 = 53` to `54 - 3 + 3 = 54` because the MariaDB permission reference is an additional canonical page. Update the consolidation overlay, preservation tests, sidebar ownership, migration checklist, and remaining editorial plan accordingly.

## Verification

- A regression test must fail before implementation because the MariaDB page and route do not exist and the MariaDB Linux tab still links to MySQL permissions.
- Focused tests must assert unique MySQL and MariaDB routes, engine-specific H1s/content, direct Linux-tab links, sidebar ownership, and the 54-page current overlay.
- `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check` must pass.

## Out of scope

- Changing the Linux installation commands or installer-risk warning.
- Changing database privileges beyond separating the already documented engine-specific guidance.
- Adding redirects, publishing, deployment, search reindexing, commits, or remote writes.
