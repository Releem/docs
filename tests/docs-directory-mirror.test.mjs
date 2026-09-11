import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {lstat, readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath, pathToFileURL} from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-02-releem-docs-directory-mirror-map.json',
);
const baselinePath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-01-releem-docs-structure-baseline.json',
);
const planPath = path.join(
  projectRoot,
  '.agent/plans/2026-09-02-releem-docs-directory-mirror-and-redirects.md',
);
const redirectsPath = path.join(projectRoot, 'redirects.mjs');
const consolidationPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-03-linux-installation-consolidation.json',
);
const engineFirstManifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-10-engine-first-installation-manifest.json',
);
const approvedTopLevelDirectories = [
  'get-started',
  'supported-databases',
  'installation',
  'dashboard',
  'recommendations',
  'account',
];
const expectedFinalSidebar = {
  docs: [
    {
      type: 'category',
      label: 'Get Started',
      link: {type: 'doc', id: 'get-started/releem-overview'},
      items: [
        'get-started/register-for-an-account',
        {
          type: 'doc',
          id: 'get-started/connect-your-database-server',
          label: 'Connect Your Database Server',
        },
        {
          type: 'doc',
          id: 'get-started/troubleshoot-releem-agent',
          label: 'Troubleshoot the Releem Agent',
        },
      ],
    },
    {
      type: 'category',
      label: 'Supported Databases',
      link: {
        type: 'doc',
        id: 'supported-databases/mysql/required-permissions',
      },
      items: [
        {
          type: 'doc',
          id: 'supported-databases/mariadb/required-permissions',
          label: 'MariaDB Permissions',
        },
        {
          type: 'doc',
          id: 'supported-databases/postgresql/required-permissions',
          label: 'PostgreSQL Permissions',
        },
      ],
    },
    {
      type: 'category',
      label: 'Installation',
      link: {type: 'doc', id: 'installation/index'},
      items: [
        {
          type: 'category',
          label: 'MySQL',
          link: {type: 'doc', id: 'installation/mysql/index'},
          items: [
            'installation/mysql/linux',
            'installation/mysql/windows',
            'installation/mysql/docker',
            'installation/mysql/aws-rds',
            'installation/mysql/gcp-cloud-sql',
            'installation/mysql/azure-database-for-mysql',
            'installation/mysql/clusters',
            'installation/mysql/whm-cpanel',
          ],
        },
        {
          type: 'category',
          label: 'MariaDB',
          link: {type: 'doc', id: 'installation/mariadb/index'},
          items: [
            'installation/mariadb/linux',
            'installation/mariadb/windows',
            'installation/mariadb/docker',
            'installation/mariadb/kubernetes',
            'installation/mariadb/clusters',
          ],
        },
        {
          type: 'category',
          label: 'PostgreSQL',
          link: {type: 'doc', id: 'installation/postgresql/index'},
          items: [
            'installation/postgresql/linux',
          ],
        },
        {
          type: 'category',
          label: 'Manage the Releem Agent',
          items: [
            'installation/manage-the-releem-agent/configuration',
            'installation/manage-the-releem-agent/logs',
            'installation/manage-the-releem-agent/migrate',
            'installation/manage-the-releem-agent/update',
            'installation/manage-the-releem-agent/uninstall',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Dashboard',
      link: {type: 'doc', id: 'dashboard/overview'},
      items: [
        'dashboard/query-analytics',
        {type: 'doc', id: 'dashboard/schema-checks', label: 'Schema Checks'},
        'dashboard/deadlocks',
        'dashboard/health-checks',
        'dashboard/security-checks',
        'dashboard/process-list',
        {type: 'doc', id: 'dashboard/reports', label: 'Reports'},
      ],
    },
    {
      type: 'category',
      label: 'Recommendations',
      link: {type: 'doc', id: 'recommendations/overview'},
      items: [
        {
          type: 'category',
          label: 'Configuration Tuning',
          items: [
            'recommendations/configuration-tuning/mysql-tuning-process',
            'recommendations/configuration-tuning/initial-mysql-configuration',
            'recommendations/configuration-tuning/apply-using-portal',
            'recommendations/configuration-tuning/apply-using-agent',
            'recommendations/configuration-tuning/apply-using-cron',
            'recommendations/configuration-tuning/apply-manually/linux',
            'recommendations/configuration-tuning/apply-manually/windows',
            'recommendations/configuration-tuning/apply-manually/docker',
            'recommendations/configuration-tuning/apply-manually/aws-rds',
            'recommendations/configuration-tuning/apply-manually/gcp-cloud-sql',
            'recommendations/configuration-tuning/rollback',
            'recommendations/configuration-tuning/limit-mysql-memory',
            'recommendations/configuration-tuning/configuration-example',
          ],
        },
        {
          type: 'category',
          label: 'Query Optimization',
          link: {type: 'doc', id: 'recommendations/query-optimization/overview'},
          items: [
            'recommendations/query-optimization/enable',
            'recommendations/query-optimization/disable',
            'recommendations/query-optimization/prepared-statements',
            'recommendations/query-optimization/automatic-schema-changes',
            'recommendations/query-optimization/schema-change-troubleshooting',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Account',
      link: {type: 'doc', id: 'account/overview'},
      items: [
        {
          type: 'category',
          label: 'Access',
          items: ['account/access/users-and-roles'],
        },
        {
          type: 'category',
          label: 'Billing',
          items: [
            'account/billing/payment-information',
            'account/billing/cancel-subscription',
          ],
        },
      ],
    },
    {type: 'doc', id: 'faq', label: 'FAQ'},
  ],
};

const sha256 = (contents) =>
  createHash('sha256').update(contents).digest('hex');
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const toRepoPath = (absolutePath) =>
  path.relative(projectRoot, absolutePath).split(path.sep).join('/');

async function listFiles(directory, predicate = () => true) {
  const directoryStat = await lstat(directory);
  assert.equal(
    directoryStat.isSymbolicLink(),
    false,
    `Symbolic-link directories are forbidden: ${toRepoPath(directory)}`,
  );
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    assert.equal(
      entry.isSymbolicLink(),
      false,
      `Symbolic-link entries are forbidden: ${toRepoPath(absolutePath)}`,
    );
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, predicate)));
    } else if (entry.isFile() && predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }

  return files.sort((left, right) => compare(toRepoPath(left), toRepoPath(right)));
}

async function listDirectories(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const directories = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    assert.equal(
      entry.isSymbolicLink(),
      false,
      `Symbolic-link entries are forbidden: ${toRepoPath(absolutePath)}`,
    );
    if (!entry.isDirectory()) continue;
    directories.push(absolutePath, ...(await listDirectories(absolutePath)));
  }
  return directories.sort((left, right) =>
    compare(toRepoPath(left), toRepoPath(right)),
  );
}

function parsePlanRows(plan) {
  return plan
    .split(/\r?\n/u)
    .filter((line) => /^\| \d+ \|/u.test(line))
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      const unquote = (value) => {
        assert.match(value, /^`[^`]+`$/u, `Invalid plan-table cell: ${value}`);
        return value.slice(1, -1);
      };
      return {
        number: Number(cells[0]),
        currentSource: unquote(cells[1]),
        finalSource: unquote(cells[2]),
        currentRoute: unquote(cells[3]),
        finalRoute: unquote(cells[4]),
      };
    });
}

function unquoteYamlScalar(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  return quote && quote === trimmed.at(-1) && ['"', "'"].includes(quote)
    ? trimmed.slice(1, -1)
    : trimmed;
}

function parseDocument(sourcePath, contents) {
  const text = contents.toString('utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  assert.ok(match, `${sourcePath} must start with complete front matter`);
  const frontMatter = match[1].replace(/\r\n?/gu, '\n');
  const body = text.slice(match[0].length).replace(/\r\n?/gu, '\n');
  const relativePath = sourcePath.slice('docs/'.length, -'.md'.length);
  const directory = path.posix.dirname(relativePath);
  const idMatch = frontMatter.match(/^id:\s*(.+?)\s*$/mu);
  const slugMatch = frontMatter.match(/^slug:\s*(.+?)\s*$/mu);
  const explicitId = idMatch ? unquoteYamlScalar(idMatch[1]) : null;
  const explicitSlug = slugMatch ? unquoteYamlScalar(slugMatch[1]) : null;
  const localId = explicitId ?? path.posix.basename(relativePath);
  const effectiveId = directory === '.' ? localId : path.posix.join(directory, localId);
  const route = explicitSlug?.startsWith('/')
    ? explicitSlug
    : `/${explicitSlug ? path.posix.join(directory, explicitSlug) : effectiveId}`;
  return {
    sourcePath,
    frontMatter,
    body,
    explicitId,
    explicitSlug,
    effectiveId,
    route: route === '/' ? route : route.replace(/\/$/u, ''),
  };
}

function stripMigrationFrontMatter(frontMatter) {
  return frontMatter
    .split('\n')
    .filter((line) => !/^(?:id|slug):/u.test(line))
    .join('\n');
}

function markdownLinkTargets(contents) {
  const targets = [];
  const prose = contents
    .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '')
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/gu, '')
    .replace(/`[^`]*`/gu, '');
  for (const match of prose.matchAll(
    /(?<!!)\[[^\]\n]+\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/gu,
  )) {
    targets.push(match[1]);
  }
  for (const match of prose.matchAll(
    /<a\b[^>]*\bhref\s*=\s*(?:\{\s*)?(['"])([^'"]+)\1(?:\s*\})?[^>]*>/giu,
  )) {
    targets.push(match[2]);
  }
  return targets;
}

function relativeImageTargets(contents) {
  const targets = [];
  for (const match of contents.matchAll(
    /(?:require\(['"]|\]\()([^'")\s]*assets\/images[^'")\s]*)/gu,
  )) {
    if (!match[1].startsWith('/')) targets.push(match[1]);
  }
  return targets;
}

function replacementForLink(target, rows) {
  let parsed;
  let absolute = false;
  if (/^https:\/\/docs\.releem\.com(?:\/|$)/u.test(target)) {
    parsed = new URL(target);
    absolute = true;
  } else if (target.startsWith('/')) {
    parsed = new URL(target, 'https://docs.releem.com');
  } else {
    return null;
  }

  const pathname = decodeURIComponent(parsed.pathname);
  const sourceCandidate = pathname.startsWith('/docs/')
    ? pathname.slice(1)
    : `docs${pathname}`;
  const row =
    rows.find(({currentRoute}) => currentRoute === pathname) ??
    rows.find(({currentRoute}) => `${currentRoute}.md` === pathname) ??
    rows.find(({currentSource}) => currentSource === sourceCandidate);
  if (!row) return null;
  return `${absolute ? 'https://docs.releem.com' : ''}${row.finalRoute}${parsed.search}${parsed.hash}`;
}

function countedReplacements(entries) {
  return [...entries.entries()]
    .map(([key, occurrences]) => {
      const [from, to] = JSON.parse(key);
      return {from, to, occurrences};
    })
    .sort((left, right) =>
      compare(left.from, right.from) || compare(left.to, right.to),
    );
}

function expectedLinkReplacements(contents, rows) {
  const counts = new Map();
  for (const from of markdownLinkTargets(contents)) {
    const to = replacementForLink(from, rows);
    if (!to || to === from) continue;
    const key = JSON.stringify([from, to]);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return countedReplacements(counts);
}

function expectedAssetReplacements(contents, currentSource, finalSource) {
  const counts = new Map();
  for (const from of relativeImageTargets(contents)) {
    const absoluteAsset = path.resolve(projectRoot, path.dirname(currentSource), from);
    let to = path
      .relative(path.resolve(projectRoot, path.dirname(finalSource)), absoluteAsset)
      .split(path.sep)
      .join('/');
    if (!to.startsWith('.')) to = `./${to}`;
    if (to === from) continue;
    const key = JSON.stringify([from, to]);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return countedReplacements(counts);
}

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

function topLevelOwnership(sidebarItems) {
  const sections = new Map();
  function collect(items, ids) {
    for (const item of items ?? []) {
      if (typeof item === 'string') {
        ids.push(item);
      } else if (item?.type === 'doc') {
        ids.push(item.id);
      } else if (item?.type === 'category') {
        if (item.link?.type === 'doc') ids.push(item.link.id);
        collect(item.items, ids);
      }
    }
  }
  for (const item of sidebarItems) {
    const ids = [];
    if (item?.type === 'doc') ids.push(item.id);
    if (item?.type === 'category') {
      if (item.link?.type === 'doc') ids.push(item.link.id);
      collect(item.items, ids);
    }
    sections.set(item.label, ids);
  }
  return sections;
}

async function loadDocusaurusConfig() {
  const configSource = await readFile(
    path.join(projectRoot, 'docusaurus.config.js'),
    'utf8',
  );
  const prismPackageDirectory = path.join(
    projectRoot,
    'node_modules/prism-react-renderer',
  );
  const prismPackage = JSON.parse(
    await readFile(path.join(prismPackageDirectory, 'package.json'), 'utf8'),
  );
  assert.equal(typeof prismPackage.module, 'string');
  const prismModuleUrl = pathToFileURL(
    path.join(prismPackageDirectory, prismPackage.module),
  ).href;
  const redirectsImportPattern = /(['"])\.\/redirects\.mjs\1/gu;
  const executableSource = configSource.replace(
    /(['"])prism-react-renderer\1/gu,
    JSON.stringify(prismModuleUrl),
  ).replace(
    redirectsImportPattern,
    JSON.stringify(pathToFileURL(redirectsPath).href),
  );
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(executableSource).toString('base64')}`;
  return (await import(moduleUrl)).default;
}

async function loadRedirectsModule() {
  assert.equal(
    existsSync(redirectsPath),
    true,
    'redirects.mjs must provide the runtime redirect rules',
  );
  return import(pathToFileURL(redirectsPath).href);
}

function reverseDeclaredBodyChanges(body, record) {
  const replacements = [
    ...record.allowedInternalLinkReplacements,
    ...record.allowedRelativeAssetReplacements,
  ].sort((left, right) => right.to.length - left.to.length);
  const placeholders = [];
  let reversed = body;

  replacements.forEach((replacement, index) => {
    const placeholder = `\u0000RELEEM_MIGRATION_TOKEN_${index}\u0000`;
    assert.equal(reversed.includes(placeholder), false);
    const occurrences = reversed.split(replacement.to).length - 1;
    assert.equal(
      occurrences,
      replacement.occurrences,
      `Unexpected occurrence count for migration token ${replacement.to}`,
    );
    reversed = reversed.split(replacement.to).join(placeholder);
    placeholders.push({placeholder, from: replacement.from});
  });

  for (const {placeholder, from} of placeholders) {
    reversed = reversed.split(placeholder).join(from);
  }
  return reversed;
}

function resolvedImagePath(sourcePath, reference) {
  const cleanReference = decodeURIComponent(reference.split(/[?#]/u, 1)[0]);
  return cleanReference.startsWith('/')
    ? path.posix.join('static', cleanReference)
    : path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), cleanReference));
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const planRows = parsePlanRows(await readFile(planPath, 'utf8'));
const consolidation = JSON.parse(await readFile(consolidationPath, 'utf8'));
const retiredSources = new Set(consolidation.retiredSources);
const currentSourcePaths = [
  ...manifest.records
    .map(({finalSource}) => finalSource)
    .filter((sourcePath) => !retiredSources.has(sourcePath)),
  ...consolidation.addedSources,
].sort(compare);
const currentIds = currentSourcePaths.map((sourcePath) =>
  sourcePath.slice('docs/'.length, -'.md'.length),
);
const redirectOverrides = new Map(
  consolidation.redirects.map((redirect) => [redirect.from, redirect]),
);
const expectedCurrentRedirects = [
  ...manifest.records.map(({currentRoute: from, finalRoute: to}) =>
    redirectOverrides.get(from) ?? {from, to},
  ),
  ...consolidation.redirects.filter(({from}) =>
    !manifest.records.some(({currentRoute}) => currentRoute === from),
  ),
];
const engineFirstRedirectChanges = [
  {from: '/releem-agent/installation-guides/self-managed-servers-automatic-installation', to: '/installation/mysql/linux#automatic-installation'},
  {from: '/releem-agent/installation-guides/self-managed-servers-manual-installation-linux', to: '/installation/mysql/linux#manual-installation'},
  {from: '/releem-agent/installation-guides/postgresql-manual-linux', to: '/installation/postgresql/linux#manual-installation'},
  {from: '/releem-agent/installation-guides/self-managed-servers-manual-installation-windows', to: '/installation/mysql/windows'},
  {from: '/releem-agent/installation-guides/self-managed-servers-docker-installation', to: '/installation/mysql/docker'},
  {from: '/releem-agent/installation-guides/installation-in-kubernetes', to: '/installation/mariadb/kubernetes'},
  {from: '/releem-agent/installation-guides/cloud-managed-aws-rds-automatic-installation', to: '/installation/mysql/aws-rds'},
  {from: '/releem-agent/installation-guides/cloud-managed-gcp-cloud-sql-automatic-installation', to: '/installation/mysql/gcp-cloud-sql'},
  {from: '/releem-agent/installation-guides/cloud-managed-azure-mysql-automatic-installation', to: '/installation/mysql/azure-database-for-mysql'},
  {from: '/releem-agent/installation-guides/clusters', to: '/installation'},
  {from: '/releem-agent/installation-guides/whm-cpanel', to: '/installation/mysql/whm-cpanel'},
  {from: '/installation/linux-automatic', to: '/installation/mysql/linux#automatic-installation'},
  {from: '/installation/installation-methods/linux-manual', to: '/installation/mysql/linux#manual-installation'},
  {from: '/supported-databases/postgresql/install-on-linux', to: '/installation/postgresql/linux#manual-installation'},
  {from: '/installation/postgresql-on-linux', to: '/installation/postgresql/linux#manual-installation'},
  {from: '/installation/installation-methods/postgresql-on-linux', to: '/installation/postgresql/linux#manual-installation'},
  {from: '/installation/installation-methods/windows', to: '/installation/mysql/windows'},
  {from: '/installation/installation-methods/docker', to: '/installation/mysql/docker'},
  {from: '/installation/installation-methods/kubernetes', to: '/installation/mariadb/kubernetes'},
  {from: '/installation/installation-methods/aws-rds', to: '/installation/mysql/aws-rds'},
  {from: '/installation/installation-methods/gcp-cloud-sql', to: '/installation/mysql/gcp-cloud-sql'},
  {from: '/installation/installation-methods/azure-database-for-mysql', to: '/installation/mysql/azure-database-for-mysql'},
  {from: '/installation/installation-methods/clusters', to: '/installation'},
  {from: '/installation/installation-methods/whm-cpanel', to: '/installation/mysql/whm-cpanel'},
];
const engineFirstRedirectBySource = new Map(
  engineFirstRedirectChanges.map((redirect) => [redirect.from, redirect]),
);
const engineFirstRemovedRedirectSources = ['/installation'];
const priorRedirectSources = new Set(expectedCurrentRedirects.map(({from}) => from));
const expectedEngineFirstRedirects = [
  ...expectedCurrentRedirects
    .filter(({from}) => !engineFirstRemovedRedirectSources.includes(from))
    .map((redirect) => engineFirstRedirectBySource.get(redirect.from) ?? redirect),
  ...engineFirstRedirectChanges.filter(({from}) => !priorRedirectSources.has(from)),
];

test('migration map freezes the exact 54-row path, ID, route, hash, and token contract', async () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.expectedPageCount, 54);
  assert.equal(manifest.records.length, 54);
  assert.equal(planRows.length, 54);
  assert.deepEqual(manifest.approvedTopLevelDirectories, approvedTopLevelDirectories);
  assert.deepEqual(manifest.approvedRootDocuments, ['docs/faq.md']);
  assert.deepEqual(manifest.allowedFrontMatterKeys, ['id', 'slug']);
  assert.deepEqual(
    manifest.records.map(({number, currentSource, finalSource, currentRoute, finalRoute}) => ({
      number,
      currentSource,
      finalSource,
      currentRoute,
      finalRoute,
    })),
    planRows,
  );

  for (const key of [
    'currentSource',
    'finalSource',
    'currentId',
    'finalId',
    'currentRoute',
    'finalRoute',
  ]) {
    assertUnique(manifest.records.map((record) => record[key]), key);
  }
  const retiredRoutes = new Set(manifest.records.map(({currentRoute}) => currentRoute));
  const baselineByCurrentSource = new Map(
    baseline.documents.map((document) => [
      document.renamedPath ?? document.sourcePath,
      document,
    ]),
  );
  for (const record of manifest.records) {
    assert.match(record.currentSource, /^docs\/(?!\.\.\/).+\.md$/u);
    assert.match(record.finalSource, /^docs\/(?!\.\.\/).+\.md$/u);
    assert.equal(path.posix.normalize(record.currentSource), record.currentSource);
    assert.equal(path.posix.normalize(record.finalSource), record.finalSource);
    assert.equal(
      record.finalId,
      record.finalSource.slice('docs/'.length, -'.md'.length),
    );
    assert.equal(record.finalExplicitId, path.posix.basename(record.finalId));
    assert.equal(record.finalSlug, record.finalRoute);
    assert.deepEqual(record.allowedFrontMatterKeys, ['id', 'slug']);
    assert.match(record.originalWholeFileSha256, /^[a-f\d]{64}$/u);
    assert.match(record.originalFrontMatterSha256, /^[a-f\d]{64}$/u);
    assert.match(record.originalBodySha256, /^[a-f\d]{64}$/u);
    assert.equal(sha256(record.originalFrontMatter), record.originalFrontMatterSha256);
    assert.equal(retiredRoutes.has(record.finalRoute), false, `${record.finalRoute} is both canonical and retired`);

    const baselineDocument = baselineByCurrentSource.get(record.currentSource);
    assert.ok(baselineDocument, `Baseline is missing ${record.currentSource}`);
    assert.equal(record.originalWholeFileSha256, baselineDocument.sha256);
    assert.equal(record.originalFrontMatterSha256, baselineDocument.frontMatterSha256);
    assert.equal(record.originalBodySha256, baselineDocument.bodySha256);

    const currentPath = path.join(projectRoot, record.currentSource);
    if (existsSync(currentPath)) {
      const contents = await readFile(currentPath);
      const parsed = parseDocument(record.currentSource, contents);
      assert.equal(sha256(contents), record.originalWholeFileSha256);
      assert.equal(sha256(parsed.frontMatter), record.originalFrontMatterSha256);
      assert.equal(sha256(parsed.body), record.originalBodySha256);
      assert.equal(parsed.effectiveId, record.currentId);
      assert.deepEqual(
        record.allowedInternalLinkReplacements,
        expectedLinkReplacements(contents.toString('utf8'), planRows),
      );
      assert.deepEqual(
        record.allowedRelativeAssetReplacements,
        expectedAssetReplacements(
          contents.toString('utf8'),
          record.currentSource,
          record.finalSource,
        ),
      );
    }
  }

  const topLevel = new Set(
    manifest.records
      .filter(({finalSource}) => finalSource !== 'docs/faq.md')
      .map(({finalSource}) => finalSource.split('/')[1]),
  );
  assert.deepEqual([...topLevel].sort(compare), [...approvedTopLevelDirectories].sort(compare));
  assert.equal(
    manifest.records.filter(({finalSource}) => !finalSource.slice('docs/'.length).includes('/')).length,
    1,
  );
});

test('all image and static assets retain their paths and hashes', async () => {
  const files = (
    await Promise.all(
      ['assets/images', 'static/img'].map((directory) =>
        listFiles(path.join(projectRoot, directory)),
      ),
    )
  ).flat();
  const actual = await Promise.all(
    files.map(async (absolutePath) => ({
      path: toRepoPath(absolutePath),
      sha256: sha256(await readFile(absolutePath)),
    })),
  );
  assert.deepEqual(
    actual,
    manifest.assets.filter(({path: assetPath}) =>
      assetPath !== consolidation.removedSensitiveAsset.path,
    ),
  );
});

test('engine-first overlay owns the exact 63-page corpus, database-first sidebar, canonical links, and direct redirects', async () => {
  assert.equal(
    existsSync(engineFirstManifestPath),
    true,
    'Create .agent/analysis/2026-09-10-engine-first-installation-manifest.json',
  );
  const overlay = JSON.parse(await readFile(engineFirstManifestPath, 'utf8'));
  assert.equal(overlay.historicalBaselinePageCount, 54);
  assert.equal(overlay.currentPageCount, 63);
  assert.equal(overlay.installationDocuments.length, 18);

  const markdownFiles = await listFiles(
    path.join(projectRoot, 'docs'),
    (absolutePath) => /\.mdx?$/u.test(absolutePath),
  );
  const documents = await Promise.all(
    markdownFiles.map(async (absolutePath) => {
      const sourcePath = toRepoPath(absolutePath);
      return parseDocument(sourcePath, await readFile(absolutePath));
    }),
  );
  assert.equal(documents.length, 63);
  assertUnique(documents.map(({effectiveId}) => effectiveId), 'current document IDs');
  assertUnique(documents.map(({route}) => route), 'current document routes');
  assert.deepEqual(
    overlay.installationDocuments.map(({sourcePath}) => sourcePath).sort(compare),
    markdownFiles.map(toRepoPath).filter((sourcePath) =>
      overlay.installationDocuments.some((document) => document.sourcePath === sourcePath),
    ).sort(compare),
  );
  const documentsBySource = new Map(
    documents.map((document) => [document.sourcePath, document]),
  );
  for (const expected of overlay.installationDocuments) {
    const actual = documentsBySource.get(expected.sourcePath);
    assert.ok(actual, `Missing engine-first document: ${expected.sourcePath}`);
    assert.equal(actual.effectiveId, expected.id, `${expected.sourcePath} ID drifted`);
    assert.equal(actual.route, expected.route, `${expected.sourcePath} route drifted`);
  }

  const sidebarSource = await readFile(path.join(projectRoot, 'sidebars.js'), 'utf8');
  const sidebarUrl = `data:text/javascript;base64,${Buffer.from(sidebarSource).toString('base64')}`;
  const sidebars = (await import(sidebarUrl)).default;
  assert.deepEqual(sidebars, expectedFinalSidebar);
  const ownedIds = [...topLevelOwnership(sidebars.docs).values()].flat();
  assert.equal(ownedIds.length, 63);
  assertUnique(ownedIds, 'sidebar document IDs');
  assert.deepEqual(ownedIds.sort(compare), documents.map(({effectiveId}) => effectiveId).sort(compare));

  assert.deepEqual(
    overlay.directRedirects,
    expectedEngineFirstRedirects,
    'The engine-first overlay must retain every unrelated prior redirect and apply only explicit removals, overrides, and additions',
  );
  const redirectModule = await loadRedirectsModule();
  assert.deepEqual(redirectModule.redirects, expectedEngineFirstRedirects);
  const docusaurusConfig = await loadDocusaurusConfig();
  assert.deepEqual(docusaurusConfig.plugins, [
    ['@docusaurus/plugin-client-redirects', {redirects: expectedEngineFirstRedirects}],
  ]);
  assertUnique(redirectModule.redirects.map(({from}) => from), 'redirect sources');
  const redirectSources = new Set(redirectModule.redirects.map(({from}) => from));
  assert.equal(redirectSources.has('/installation'), false);
  assert.equal(redirectSources.has('/installation/linux'), false);
  for (const {from, to} of redirectModule.redirects) {
    assert.equal(from === to, false, `Redirect loop: ${from}`);
    assert.equal(to.includes('/installation/linux?database='), false, `${from} retains a stale Linux selector`);
    assert.equal(
      redirectSources.has(new URL(to, 'https://docs.releem.com').pathname),
      false,
      `Redirect chain: ${from} -> ${to}`,
    );
  }
  for (const redirect of engineFirstRedirectChanges) {
    assert.deepEqual(
      redirectModule.redirects.find(({from}) => from === redirect.from),
      redirect,
    );
  }
  for (const blockedRoute of overlay.blockedRoutes) {
    assert.equal(
      redirectModule.redirects.some(({from, to}) =>
        from === blockedRoute || new URL(to, 'https://docs.releem.com').pathname === blockedRoute,
      ),
      false,
      `Blocked route appears in redirects: ${blockedRoute}`,
    );
  }

  const currentRoutes = new Set(documents.map(({route}) => route));
  for (const absolutePath of markdownFiles) {
    const sourcePath = toRepoPath(absolutePath);
    const contents = await readFile(absolutePath, 'utf8');
    for (const target of markdownLinkTargets(contents)) {
      if (!target.startsWith('/')) continue;
      const url = new URL(target, 'https://docs.releem.com');
      assert.equal(
        url.pathname === '/installation/linux' && url.searchParams.has('database'),
        false,
        `${sourcePath} links to stale Linux selector ${target}`,
      );
      if (url.pathname.startsWith('/installation/')) {
        assert.equal(currentRoutes.has(url.pathname), true, `${sourcePath} links to noncanonical ${target}`);
      }
    }
  }
});

// Superseded by the exception-aware whole-content gate in docs-preservation.test.mjs.
test.skip('every mirrored page has explicit final metadata and preserved content', async () => {
  const assetHashes = new Map(manifest.assets.map((asset) => [asset.path, asset.sha256]));
  for (const record of manifest.records) {
    const absolutePath = path.join(projectRoot, record.finalSource);
    assert.equal(
      existsSync(absolutePath),
      true,
      `Mirrored page is absent: ${record.finalSource}`,
    );
    const contents = await readFile(absolutePath);
    const parsed = parseDocument(record.finalSource, contents);
    assert.equal(parsed.explicitId, record.finalExplicitId);
    assert.equal(parsed.explicitSlug, record.finalSlug);
    assert.equal(parsed.effectiveId, record.finalId);
    assert.equal(parsed.route, record.finalRoute);
    assert.equal(
      stripMigrationFrontMatter(parsed.frontMatter),
      stripMigrationFrontMatter(record.originalFrontMatter),
      `${record.finalSource} changed non-migration front matter`,
    );
    assert.equal(
      sha256(reverseDeclaredBodyChanges(parsed.body, record)),
      record.originalBodySha256,
      `${record.finalSource} changed content beyond declared link/import tokens`,
    );
    for (const reference of relativeImageTargets(contents.toString('utf8'))) {
      const imagePath = resolvedImagePath(record.finalSource, reference);
      assert.ok(assetHashes.has(imagePath), `${record.finalSource} references unknown asset ${imagePath}`);
      assert.equal(
        sha256(await readFile(path.join(projectRoot, imagePath))),
        assetHashes.get(imagePath),
      );
    }
  }
});

test('Docusaurus navbar logo links directly to the canonical Get Started route', async () => {
  const config = await loadDocusaurusConfig();
  assert.deepEqual(config.themeConfig.navbar.logo, {
    alt: 'Releem Logo',
    src: 'img/releem-icon-top.png',
    href: '/get-started',
  });
});

test('Docusaurus footer documentation link points directly to the canonical Get Started route', async () => {
  const config = await loadDocusaurusConfig();
  const documentationLinks = config.themeConfig.footer.links
    .flatMap(({items}) => items)
    .filter(({label}) => label === 'Study the documentation');
  assert.equal(documentationLinks.length, 1);
  assert.deepEqual(documentationLinks[0], {
    label: 'Study the documentation',
    to: '/get-started',
  });
});

test('Security Checks and Schema Checks remain aggregate pages only', () => {
  const security = manifest.records.filter(({finalId}) =>
    /(?:^|\/)security-checks(?:\/|$)/u.test(finalId),
  );
  const schema = manifest.records.filter(({finalId}) =>
    /(?:^|\/)schema-checks(?:\/|$)/u.test(finalId),
  );
  assert.deepEqual(security.map(({finalSource}) => finalSource), [
    'docs/dashboard/security-checks.md',
  ]);
  assert.deepEqual(schema.map(({finalSource}) => finalSource), [
    'docs/dashboard/schema-checks.md',
  ]);
  assert.equal(
    manifest.records.some(({finalSource}) => /\/checks\/(?:security|schema)\//u.test(finalSource)),
    false,
  );
});

if (process.env.RELEEM_VERIFY_REDIRECT_BUILD === '1') {
  test('engine-first built redirect artifacts and Linux compatibility page are distinct canonical outputs', async () => {
    const buildDirectory = path.join(projectRoot, 'build');
    assert.equal(
      existsSync(buildDirectory),
      true,
      'build/ must exist when RELEEM_VERIFY_REDIRECT_BUILD=1',
    );

    const redirectArtifactPath = (route) =>
      route === '/'
        ? path.join(buildDirectory, 'index.html')
        : path.join(buildDirectory, route.slice(1), 'index.html');
    const canonicalArtifactPath = (route) =>
      route === '/'
        ? path.join(buildDirectory, 'index.html')
        : path.join(buildDirectory, `${route.slice(1)}.html`);
    assert.equal(
      existsSync(engineFirstManifestPath),
      true,
      'Create .agent/analysis/2026-09-10-engine-first-installation-manifest.json',
    );
    const overlay = JSON.parse(await readFile(engineFirstManifestPath, 'utf8'));
    assert.deepEqual(overlay.directRedirects, expectedEngineFirstRedirects);
    const expectedRedirects = expectedEngineFirstRedirects;
    const expectedRedirectArtifacts = expectedRedirects.map(({from}) =>
      redirectArtifactPath(from),
    );
    const expectedCanonicalArtifacts = expectedRedirects.map(({to}) =>
      canonicalArtifactPath(new URL(to, 'https://docs.releem.com').pathname),
    );
    const htmlFiles = await listFiles(
      buildDirectory,
      (absolutePath) => absolutePath.endsWith('.html'),
    );
    const redirectArtifacts = [];

    for (const absolutePath of htmlFiles) {
      const html = await readFile(absolutePath, 'utf8');
      if (html.includes('<meta http-equiv="refresh"')) {
        redirectArtifacts.push(absolutePath);
      }
    }

    assert.deepEqual(
      redirectArtifacts,
      expectedRedirectArtifacts.sort((left, right) => compare(toRepoPath(left), toRepoPath(right))),
      'Built redirect HTML artifacts must exactly match the engine-first direct redirects',
    );
    assert.equal(
      new Set(expectedRedirectArtifacts).size,
      expectedRedirects.length,
      'Every retired route must produce one distinct redirect artifact',
    );
    assert.deepEqual(
      expectedRedirectArtifacts.filter((absolutePath) =>
        expectedCanonicalArtifacts.includes(absolutePath),
      ),
      [],
      'Retired and canonical route artifacts must not overlap',
    );

    for (const {from, to} of expectedRedirects) {
      const redirectArtifact = redirectArtifactPath(from);
      assert.equal(
        existsSync(redirectArtifact),
        true,
        `Missing redirect artifact for ${from}`,
      );
      const redirectHtml = await readFile(redirectArtifact, 'utf8');
      assert.ok(
        redirectHtml.includes(`<meta http-equiv="refresh" content="0; url=${to}">`),
        `${toRepoPath(redirectArtifact)} must reference ${to} in its refresh target`,
      );
      assert.ok(
        redirectHtml.includes(`<link rel="canonical" href="${to}" />`),
        `${toRepoPath(redirectArtifact)} must reference ${to} in its canonical target`,
      );
      assert.ok(
        redirectHtml.includes(
          /[?#]/u.test(to)
            ? `window.location.href = '${to}';`
            : `window.location.href = '${to}' + window.location.search + window.location.hash;`,
        ),
        `${toRepoPath(redirectArtifact)} must reference ${to} in its JavaScript target`,
      );

      const canonicalArtifact = canonicalArtifactPath(
        new URL(to, 'https://docs.releem.com').pathname,
      );
      assert.equal(
        existsSync(canonicalArtifact),
        true,
        `Missing canonical artifact for ${to}`,
      );
      const canonicalHtml = await readFile(canonicalArtifact, 'utf8');
      assert.equal(
        canonicalHtml.includes('<meta http-equiv="refresh"'),
        false,
        `${toRepoPath(canonicalArtifact)} must not be a redirect artifact`,
      );
    }

    for (const document of overlay.installationDocuments) {
      const canonicalArtifact = canonicalArtifactPath(document.route);
      assert.equal(
        existsSync(canonicalArtifact),
        true,
        `Missing canonical engine-first artifact for ${document.route}`,
      );
      const canonicalHtml = await readFile(canonicalArtifact, 'utf8');
      assert.equal(
        canonicalHtml.includes('<meta http-equiv="refresh"'),
        false,
        `${toRepoPath(canonicalArtifact)} must be canonical content, not a redirect`,
      );
      assert.ok(
        canonicalHtml.includes(`<title data-rh="true">${document.title} | Releem Documentation</title>`),
        `${toRepoPath(canonicalArtifact)} must render the exact engine-first title`,
      );
      assert.ok(
        canonicalHtml.includes(
          `<link data-rh="true" rel="canonical" href="https://docs.releem.com${document.route}">`,
        ),
        `${toRepoPath(canonicalArtifact)} must render its canonical URL`,
      );
    }

    const compatibilityArtifact = path.join(buildDirectory, 'installation/linux.html');
    assert.equal(
      existsSync(compatibilityArtifact),
      true,
      'The build must contain the query-aware /installation/linux compatibility page',
    );
    const compatibilityHtml = await readFile(compatibilityArtifact, 'utf8');
    assert.equal(
      compatibilityHtml.includes('<meta http-equiv="refresh"'),
      false,
      '/installation/linux must be a page, not a path-only redirect artifact',
    );
    assert.equal(
      expectedRedirectArtifacts.includes(compatibilityArtifact),
      false,
      '/installation/linux must not collide with client redirect output',
    );
  });
}
