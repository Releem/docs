# Directory mirror and redirect QA

Date: 2026-09-02

Status: PASS

- DIRECTORY MIRROR: PASS
- REDIRECTS: PASS
- CONTENT: MOVED, NOT REWRITTEN

## Production route evidence

- The production Docusaurus output was served locally with `npm run serve -- --no-open --host 127.0.0.1 --port 3000`.
- HTTP verification returned 200 for all 54 canonical routes and all 54 retired-route redirect pages.
- Headless-browser verification covered all 54 canonical routes in two 27-route batches: every page retained its canonical URL and its rendered H1 exactly matched the first H1 in its migrated Markdown source.
- The same browser verification covered all 54 retired routes in two 27-route batches: every route transitioned once to its exact mapped canonical route, with no mismatch.
- A second two-batch redirect pass appended `?qa=1#qa-fragment` to every retired route. All 54 resulting URLs preserved the exact query string and fragment at the mapped canonical route.
- Browser image inspection visited all 54 canonical routes and found 78 rendered images, each complete with a non-zero natural width.
- The post-build Node test independently verified 54 redirect artifacts, exact canonical/meta-refresh/JavaScript targets, 54 canonical artifacts, and no retired/canonical artifact overlap.

## Navigation and responsive evidence

- The mirrored sidebar exposes the seven approved sections in order: Get Started, Supported Databases, Installation, Dashboard, Recommendations, Account, FAQ.
- Browser checks at 1280x720, 1024x768, 768x1024, and 375x812 found `documentElement.scrollWidth` equal to viewport width and the Get Started H1 present.
- At 375x812, the first Tab key focused the `Skip to main content` link. The mobile navigation exposed labelled controls for navigation, search, color mode, and the seven sidebar categories.
- Direct final-route checks covered these target-user journeys with the expected route and source-matched H1: supported database and required permissions (`/supported-databases/mysql/required-permissions`), installation choice (`/installation`), agent logs (`/installation/manage-the-releem-agent/logs`), Security Checks (`/dashboard/security-checks`), Schema Checks (`/dashboard/schema-checks`), Recommendations (`/recommendations`), Query Analytics (`/dashboard/query-analytics`), Query Optimization (`/recommendations/query-optimization`), and configuration rollback (`/recommendations/configuration-tuning/rollback`).
- Desktop pointer interaction on the Recommendations sidebar category navigated to `/recommendations` and exposed Configuration Tuning and Query Optimization. That page rendered working Previous and Next links to `/dashboard/reports` and `/recommendations/configuration-tuning/mysql-tuning-process`.
- The current layout does not render a breadcrumb component on the inspected page. Link-resolution tests confirm all existing previous/next and internal documentation links target direct canonical paths.

## Automated evidence

- `npm ci` completed successfully; `npm ls @docusaurus/plugin-client-redirects --depth=0` reported 3.9.2.
- `npm run agent:check` passed 34/34.
- `npm run docs:check` passed 36/36.
- `npm run typecheck`, `npm run build`, `git diff --check`, and `RELEEM_VERIFY_REDIRECT_BUILD=1 node --test tests/docs-directory-mirror.test.mjs` passed; the post-build suite passed 12/12.
- The migration contract confirms 54 final pages, 54 removed source paths, 74 direct internal-link substitutions, seven relative-asset substitutions, unchanged 31 assets, and aggregate-only Security Checks and Schema Checks.

## Warning baseline

- Docusaurus emitted the established `onBrokenMarkdownLinks` deprecation warning and an update-check permission notice during build. No broken-link, duplicate-route, missing-asset, MDX, or routing warning was introduced.
- Browser console output was limited to the expected Plausible localhost `Ignoring Event` warning.

## Redirect behavior

These are Docusaurus production client redirect pages generated from explicit rules. They are not represented as HTTP 301 redirects and do not require a search-index or hosting write for this local validation.

## Scope and release boundary

- The QA did not stage, commit, push, deploy, publish, or write to an external system.
- The existing content-gap review remains historical evidence. This work moved content and changed only approved migration metadata, canonical link destinations, relative asset paths, navigation, and redirect infrastructure.
