# Linux installation migration checklist

Private implementation record for the user-approved consolidation and permission-reference split. The committed 54-page preservation manifest remains historical evidence; this overlay records the deliberate 54 − 3 + 3 = 54 current-page transition.

## Migration matrix

| Source element | Disposition | Exact destination or rationale |
| --- | --- | --- |
| `linux-automatic.md` front matter and H1 | Replaced | `docs/installation/linux.md`: exact canonical metadata and H1; MySQL automatic route resolves to `?database=mysql#mysql-automatic-installation`. |
| Automatic page purpose | Preserved and broadened | Linux introduction plus MySQL automatic subsection. |
| CloudLinux note | Preserved once | Linux page note links to `/get-started/troubleshoot-releem-agent#cloudlinux`. |
| Portal “Add Server” step | Preserved safely | “Prepare the installer safely” obtains only the API key; no database root password is entered into a generated command. |
| Automatic screenshot | Removed/redacted | Private overlay records only path/hash/reason. The image exposed an API credential. Rotation is required if that key was ever valid. |
| `linux-manual.md` front matter and H1 | Replaced | Linux page MySQL tab and `#mysql-manual-installation`. |
| Manual page purpose | Preserved | MySQL manual subsection uses a DBA-created monitoring user. |
| MySQL permission prerequisite | Canonical hand-off | `/supported-databases/mysql/required-permissions`; grants are not duplicated. |
| MariaDB permission prerequisite | Canonical hand-off | `/supported-databases/mariadb/required-permissions`; Linux no longer routes MariaDB users through the MySQL reference. |
| MySQL legacy one-line installer code block | Simplified without restoring inline secrets | Each automatic/manual method now has one copyable `sudo bash -c` command with masked prompts, a protected temporary download, and automatic cleanup; no secret appears in shell history or the command's initial arguments. Secrets remain in the installer environment, and the current installer can put MySQL-family passwords in child-process arguments. |
| MySQL common parameters | Consolidated | Shared `#installer-parameters`: `RELEEM_HOSTNAME`, `RELEEM_DB_MEMORY_LIMIT`, `RELEEM_API_KEY`, `RELEEM_CRON_ENABLE`, `RELEEM_QUERY_OPTIMIZATION`. |
| MySQL connection parameters | Consolidated | Shared parameter reference and MySQL manual env sample: `RELEEM_MYSQL_TYPE`, host, port, login, password. |
| MySQL administrative parameters | Password variables deliberately omitted from reusable examples | `RELEEM_MYSQL_ROOT_LOGIN` and its default are documented; automatic flow uses the installer's masked local password prompt when needed. |
| MySQL query optimization switch | Corrected | Omit to disable; set exactly `RELEEM_QUERY_OPTIMIZATION=true` to enable after permissions review. |
| Scheduled updates | Opt-in only | Examples use `RELEEM_CRON_ENABLE=0`; `1` is documented as a daily midnight update with a link to the dedicated Update guide. |
| Automatic headings | Safety deviation from requested “Recommended” labels | No installer path is labeled Recommended while mutable downloads, absent published integrity verification, log upload, child-process argument exposure, and failure-path credential logging remain. |
| Installer stop conditions | Split by affected scope | Mutable or unverified downloads, process-environment secrets, and automatic log upload block every engine flow when prohibited by policy; child-process argument and failure-log password exposure add separate MySQL/MariaDB stop conditions. |
| MySQL/MariaDB remote account host | Disclosed and constrained | Current automatic remote creation can use a wildcard account host; exact-source policy requires a DBA-created account and manual configuration, subject to the remaining installer exposure warning. |
| MySQL capability grants | Kept on the MySQL reference | `/supported-databases/mysql/required-permissions` separates monitoring/query visibility, configuration application, and query/schema application; includes current `mysql.*` access with system-schema warning, MySQL 8.0 `SYSTEM_VARIABLES_ADMIN`, MySQL 5.5–5.7 `SUPER`, and the MySQL-only AWS RDS procedure. |
| MariaDB capability grants | Split into a separate reference | `/supported-databases/mariadb/required-permissions` retains the current monitoring grant family with a target-version Performance Schema check, documents `SUPER` for explicitly authorized configuration application, and excludes MySQL-only `SYSTEM_VARIABLES_ADMIN` and AWS RDS procedure guidance. |
| MySQL expected result | Added explicitly | Shared `#expected-result`. |
| MySQL verification | Added explicitly | Shared `#verify-installation`, Dashboard Connected status and Agent logs. |
| MySQL troubleshooting | Canonical hand-off | Shared `#troubleshooting` → `/get-started/troubleshoot-releem-agent`. |
| MySQL update/uninstall | Canonical hand-offs | Dedicated Agent management pages, linked explicitly inside tab and after Tabs. |
| PostgreSQL old front matter and H1 | Replaced | Linux PostgreSQL tab and `#postgresql-installation`. |
| PostgreSQL `postgresql-contrib` prerequisite | Preserved | PostgreSQL tab prerequisite and PostgreSQL permissions introduction. |
| Old nested PostgreSQL Tabs | Flattened | One page-level database-engine Tabs group only; automatic precedes manual inside the PostgreSQL tab. |
| PostgreSQL automatic installer code block | Replaced for safety | Masked prompt workflow in a private root Bash session; `RELEEM_PG_TYPE=1`; no reusable admin-password variable example. |
| PostgreSQL manual installer code block | Replaced for safety | Masked prompt workflow with monitoring credentials; no pipe to shell or sourced secret file. |
| PostgreSQL common and connection parameters | Consolidated | Shared parameter reference plus PostgreSQL manual sample. |
| PostgreSQL SSL-mode parameter | Qualified | `true` → `require`, false/omitted → `disable`; explicitly not `verify-full`. |
| PostgreSQL baseline SQL grant block | Moved and qualified | `docs/supported-databases/postgresql/required-permissions.md#baseline-monitoring-role`; DBA review required. |
| Legacy `EXECUTE ON FUNCTION pg_hba_file_rules` grant | Rejected | `pg_hba_file_rules` is a view, not a function; the invalid grant is not published. |
| `shared_preload_libraries` block | Moved | PostgreSQL permissions, query metrics section. |
| `CREATE EXTENSION` block | Moved | PostgreSQL permissions, query metrics section; scoped to each inspected database. |
| Local HBA block | Replaced for safety | Same-host `127.0.0.1/32 scram-sha-256`. |
| Remote HBA block | Replaced for safety | `hostssl`, exact `AGENT_IP/32`, SCRAM, approved TLS; exact listener/firewall source and first-match ordering documented. |
| PostgreSQL SCRAM password prerequisite | Added before HBA rules | Operators inspect `password_encryption`, require a SCRAM verifier, use a session-local setting plus the protected interactive `\password` prompt when rotation is needed, and avoid automatic account creation when the server default is not SCRAM. |
| PostgreSQL optional schema/query privileges | Not invented | Separate optional-capabilities section requires DBA review. |
| PostgreSQL expected result, verification, troubleshooting | Consolidated | Shared sections after the only Tabs group. |
| PostgreSQL update/uninstall | Canonical hand-offs | Dedicated management pages linked from the tab and shared troubleshooting. |
| Legacy note claiming credential locality | Not carried forward | Current installer attempts to upload `/var/log/releem-install.log` on exit; MySQL-family child arguments and the existing-user authentication failure path can expose passwords. Destination/retention remains `UNCONFIRMED` in this private record only. |
| Mutable installer checksum | Not published | Version/commit/date are provenance only. The one-step workflow cannot verify a publisher-supplied digest, so the public stop condition remains for policies that prohibit mutable or unverified downloads. |
| Query-plus-hash navigation | Narrow client correction | Linux page alone renders `HashTargetScroller`, which waits two animation frames after search/hash changes before scrolling the safely decoded target into view. |

## Link migration

- `docs/get-started/connect-your-database-server.md`: three retired Linux links now target the most-specific engine/query/anchor destinations.
- `docs/get-started/connect-your-database-server.md`: explicit automatic and manual links expose all three supported engine tabs.
- `docs/installation/installation-methods/clusters.md`: MySQL/Percona and MariaDB users now receive separate permission and manual-installation links.
- `docs/recommendations/query-optimization/enable.md`: mixed MySQL/MariaDB guidance now links each engine to its own permission reference.
- `redirects.mjs`: three existing legacy sources were retargeted and six retired/convenience sources were added, for 60 unique redirect sources total.
- The redirect plugin emits client-side HTML/JavaScript artifacts, not origin-level HTTP 301 responses.

## Verification checklist

- [x] Historical preservation baseline remains 54 pages.
- [x] Current source inventory contract is 54 pages.
- [x] The three source pages are retired and three canonical pages added.
- [x] MySQL and MariaDB permissions are separate canonical references, and the Linux tabs link to the matching engine.
- [x] Sensitive screenshot removed; token value was never transcribed.
- [x] If the credential shown in the removed screenshot was ever valid, rotate it.
- [x] No executable example recommends wildcard access, `md5`, curl-to-shell, or a root-password variable; public prose documents the current installer's remote MySQL/MariaDB wildcard-account behavior as a risk.
- [x] Security Checks and Schema Checks remain aggregate pages.
- [x] Focused RED captured before correction implementation: 23 tests, 14 passed, 8 failed, 1 skipped.
- [x] Correction gates rerun: focused GREEN (22 passed, 1 skipped), full docs checks (58 passed, 4 skipped), typecheck, build, and generated redirect-artifact checks (11 passed, 1 skipped) all passed. Build emitted only the pre-existing Docusaurus configuration deprecation/update-check warnings.
- [x] Final security re-review TDD: focused RED passed 11 and failed the 3 intended safeguards; focused GREEN passed 14/14. Full docs checks passed 60 with 4 skipped, typecheck and build passed, and generated redirect-artifact checks passed 11 with 1 skipped.
- [x] Rendered browser QA passed at 1280 px and 375 px: direct engine/query/anchor links selected and scrolled to the intended tab content, redirect destinations resolved directly, keyboard tab switching worked, and no horizontal overflow appeared. Independent Docusaurus/spec and security/technical-accuracy/DBA reviews passed with no material findings.
- [x] User-requested simplification replaced the separate prepare/run workflow with one copyable command per engine and installation method. All six embedded command bodies pass `bash -n`; masked prompts, temporary-file cleanup, and the existing installer-risk stop conditions remain.
- [ ] Publication remains blocked until the upstream installer exposure issues are remediated or explicitly accepted by the responsible publisher.
