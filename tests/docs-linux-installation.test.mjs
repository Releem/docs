import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath, pathToFileURL} from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const linuxPath = path.join(projectRoot, 'docs/installation/linux.md');
const postgresPermissionsPath = path.join(
  projectRoot,
  'docs/supported-databases/postgresql/required-permissions.md',
);
const retiredSources = [
  'docs/installation/linux-automatic.md',
  'docs/installation/installation-methods/linux-manual.md',
  'docs/supported-databases/postgresql/install-on-linux.md',
];
const sensitiveAsset =
  'static/img/releem-dashboard-agent-automatic-installation.png';
const consolidationPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-03-linux-installation-consolidation.json',
);
const migrationChecklistPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-03-linux-installation-migration-checklist.md',
);
const mysqlPermissionsPath = path.join(
  projectRoot,
  'docs/supported-databases/mysql/required-permissions.md',
);
const mariadbPermissionsPath = path.join(
  projectRoot,
  'docs/supported-databases/mariadb/required-permissions.md',
);
const hashScrollHelperPath = path.join(
  projectRoot,
  'src/components/hashTargetScroll.mjs',
);
const hashScrollerComponentPath = path.join(
  projectRoot,
  'src/components/HashTargetScroller.js',
);
const engineFirstManifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-10-engine-first-installation-manifest.json',
);
const legacyLinuxRedirectPath = path.join(
  projectRoot,
  'src/components/legacyLinuxRedirect.mjs',
);
const legacyLinuxRoutePath = path.join(
  projectRoot,
  'src/pages/installation/linux.js',
);

const engineFirstInstallationDocuments = [
  ['docs/installation/index.md', '/installation', null, null, 'Install Releem', []],
  ['docs/installation/mysql/index.md', '/installation/mysql', 'mysql', null, 'Install Releem for MySQL', []],
  ['docs/installation/mysql/linux.md', '/installation/mysql/linux', 'mysql', 'linux', 'Install Releem for MySQL on Linux', ['automatic', 'manual']],
  ['docs/installation/mysql/windows.md', '/installation/mysql/windows', 'mysql', 'windows', 'Install Releem for MySQL on Windows', ['automatic', 'manual']],
  ['docs/installation/mysql/docker.md', '/installation/mysql/docker', 'mysql', 'docker', 'Install Releem for MySQL on Docker', ['manual']],
  ['docs/installation/mysql/aws-rds.md', '/installation/mysql/aws-rds', 'mysql', 'aws-rds', 'Install Releem for MySQL on AWS RDS', ['automatic', 'manual']],
  ['docs/installation/mysql/gcp-cloud-sql.md', '/installation/mysql/gcp-cloud-sql', 'mysql', 'gcp-cloud-sql', 'Install Releem for MySQL on GCP Cloud SQL', ['automatic', 'manual']],
  ['docs/installation/mysql/azure-database-for-mysql.md', '/installation/mysql/azure-database-for-mysql', 'mysql', 'azure-database-for-mysql', 'Install Releem for MySQL on Azure Database for MySQL', []],
  ['docs/installation/mysql/clusters.md', '/installation/mysql/clusters', 'mysql', 'clusters', 'Install Releem for MySQL on Clusters', ['manual']],
  ['docs/installation/mysql/whm-cpanel.md', '/installation/mysql/whm-cpanel', 'mysql', 'whm-cpanel', 'Install Releem for MySQL on WHM/cPanel', ['automatic']],
  ['docs/installation/mariadb/index.md', '/installation/mariadb', 'mariadb', null, 'Install Releem for MariaDB', []],
  ['docs/installation/mariadb/linux.md', '/installation/mariadb/linux', 'mariadb', 'linux', 'Install Releem for MariaDB on Linux', ['automatic', 'manual']],
  ['docs/installation/mariadb/windows.md', '/installation/mariadb/windows', 'mariadb', 'windows', 'Install Releem for MariaDB on Windows', ['automatic', 'manual']],
  ['docs/installation/mariadb/docker.md', '/installation/mariadb/docker', 'mariadb', 'docker', 'Install Releem for MariaDB on Docker', ['manual']],
  ['docs/installation/mariadb/kubernetes.md', '/installation/mariadb/kubernetes', 'mariadb', 'kubernetes', 'Install Releem for MariaDB on Kubernetes', []],
  ['docs/installation/mariadb/clusters.md', '/installation/mariadb/clusters', 'mariadb', 'clusters', 'Install Releem for MariaDB on Clusters', ['manual']],
  ['docs/installation/postgresql/index.md', '/installation/postgresql', 'postgresql', null, 'Install Releem for PostgreSQL', []],
  ['docs/installation/postgresql/linux.md', '/installation/postgresql/linux', 'postgresql', 'linux', 'Install Releem for PostgreSQL on Linux', ['automatic', 'manual']],
].map(([sourcePath, route, database, environment, title, methods]) => ({
  sourcePath,
  id: sourcePath.slice('docs/'.length, -'.md'.length),
  route,
  database,
  environment,
  title,
  methods,
}));

const engineFirstRetiredSources = [
  'docs/installation/linux.md',
  'docs/installation/installation-methods/windows.md',
  'docs/installation/installation-methods/docker.md',
  'docs/installation/installation-methods/kubernetes.md',
  'docs/installation/installation-methods/aws-rds.md',
  'docs/installation/installation-methods/gcp-cloud-sql.md',
  'docs/installation/installation-methods/azure-database-for-mysql.md',
  'docs/installation/installation-methods/clusters.md',
  'docs/installation/installation-methods/whm-cpanel.md',
];

const blockedEngineFirstRoutes = [
  '/installation/mysql/kubernetes',
  '/installation/mariadb/whm-cpanel',
  '/installation/mariadb/aws-rds',
  '/installation/mariadb/gcp-cloud-sql',
  '/installation/mariadb/azure-database-for-mysql',
];

const unavailableEnvironmentRoutes = [
  '/installation/mysql/windows',
  '/installation/mysql/docker',
  '/installation/mysql/aws-rds',
  '/installation/mysql/gcp-cloud-sql',
  '/installation/mysql/azure-database-for-mysql',
  '/installation/mysql/whm-cpanel',
  '/installation/mariadb/windows',
  '/installation/mariadb/docker',
  '/installation/mariadb/kubernetes',
];

const redirectChanges = [
  {from: '/installation', to: '/installation/linux?database=mysql#mysql-automatic-installation'},
  {from: '/installation/linux-automatic', to: '/installation/linux?database=mysql#mysql-automatic-installation'},
  {from: '/installation/installation-methods/linux-manual', to: '/installation/linux?database=mysql#mysql-manual-installation'},
  {from: '/supported-databases/postgresql/install-on-linux', to: '/installation/linux?database=postgresql#postgresql-installation'},
  {from: '/installation/postgresql-on-linux', to: '/installation/linux?database=postgresql#postgresql-installation'},
  {from: '/installation/installation-methods/postgresql-on-linux', to: '/installation/linux?database=postgresql#postgresql-installation'},
  {from: '/releem-agent/installation-guides/self-managed-servers-automatic-installation', to: '/installation/linux?database=mysql#mysql-automatic-installation'},
  {from: '/releem-agent/installation-guides/self-managed-servers-manual-installation-linux', to: '/installation/linux?database=mysql#mysql-manual-installation'},
  {from: '/releem-agent/installation-guides/postgresql-manual-linux', to: '/installation/linux?database=postgresql#postgresql-installation'},
];

async function listMarkdown(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdown(absolutePath)));
    else if (entry.isFile() && /\.mdx?$/u.test(entry.name)) files.push(absolutePath);
  }
  return files;
}

function frontMatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/u);
  assert.ok(match, 'Linux guide must begin with front matter');
  return Object.fromEntries(
    match[1].split('\n').map((line) => {
      const separator = line.indexOf(':');
      return [line.slice(0, separator), line.slice(separator + 1).trim().replace(/^['"]|['"]$/gu, '')];
    }),
  );
}

function tabBody(source, value, nextValue) {
  const start = source.indexOf(`<TabItem value="${value}"`);
  assert.notEqual(start, -1, `Missing ${value} tab`);
  const end = nextValue
    ? source.indexOf(`<TabItem value="${nextValue}"`, start)
    : source.indexOf('</Tabs>', start);
  assert.notEqual(end, -1, `Missing end of ${value} tab`);
  return source.slice(start, end);
}

function codeFenceBodies(source) {
  return [...source.matchAll(/^\s*(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\s*\1\s*$/gmu)]
    .map((match) => match[2]);
}

function hasUnavailableRouteLabel(source, route) {
  const unavailable = /(?:procedure|installation|workflow)\s+(?:currently\s+)?unavailable|no (?:verified|executable) (?:procedure|installation|workflow)/iu;
  const linkToken = `](${route})`;
  return source.split('\n').some((line) => {
    const linkEnd = line.indexOf(linkToken);
    if (linkEnd === -1) return false;
    const linkStart = line.lastIndexOf('[', linkEnd);
    const tailStart = linkEnd + linkToken.length;
    const nextDot = line.indexOf(' · ', tailStart);
    const nextLink = line.indexOf(' [', tailStart);
    const boundaries = [nextDot, nextLink].filter((index) => index !== -1);
    const tailEnd = boundaries.length > 0 ? Math.min(...boundaries) : line.length;
    return unavailable.test(`${line.slice(linkStart, linkEnd)} ${line.slice(tailStart, tailEnd)}`);
  });
}

test('engine-first installation pages, links, permissions, anchors, and Linux compatibility match the manifest', async () => {
  assert.equal(
    existsSync(engineFirstManifestPath),
    true,
    'Create .agent/analysis/2026-09-10-engine-first-installation-manifest.json',
  );
  const overlay = JSON.parse(await readFile(engineFirstManifestPath, 'utf8'));
  assert.equal(overlay.schemaVersion, 1);
  assert.equal(overlay.historicalBaselinePageCount, 54);
  assert.equal(overlay.currentPageCount, 63);
  assert.deepEqual(overlay.retiredSources, engineFirstRetiredSources);
  assert.deepEqual(overlay.installationDocuments, engineFirstInstallationDocuments);
  assert.deepEqual(overlay.blockedRoutes, blockedEngineFirstRoutes);
  assert.ok(
    Array.isArray(overlay.conditionalEvidence),
    'Manifest must provide structured conditionalEvidence for MariaDB Windows, Docker, and Kubernetes',
  );
  assert.deepEqual(
    overlay.conditionalEvidence.map(({sourcePath}) => sourcePath),
    [
      'docs/installation/mariadb/windows.md',
      'docs/installation/mariadb/docker.md',
      'docs/installation/mariadb/kubernetes.md',
    ],
  );
  for (const evidence of overlay.conditionalEvidence) {
    assert.deepEqual(Object.keys(evidence).sort(), [
      'evidence',
      'limitations',
      'publicNotice',
      'sourcePath',
      'status',
    ]);
    assert.equal(evidence.status, 'conditional');
    assert.ok(Array.isArray(evidence.evidence) && evidence.evidence.length > 0);
    assert.ok(Array.isArray(evidence.limitations) && evidence.limitations.length > 0);
    assert.ok(evidence.publicNotice.length >= 24);
    for (const item of evidence.evidence) {
      assert.deepEqual(Object.keys(item).sort(), ['finding', 'source']);
      assert.ok(item.source.length > 0);
      assert.ok(item.finding.length >= 12);
    }
  }
  assert.ok(Array.isArray(overlay.methodBlockers));
  assert.deepEqual(
    overlay.methodBlockers.map(({sourcePath, method}) => [sourcePath, method]),
    [
      ['docs/installation/mysql/windows.md', 'automatic'],
      ['docs/installation/mysql/windows.md', 'manual'],
      ['docs/installation/mysql/docker.md', 'manual'],
      ['docs/installation/mysql/aws-rds.md', 'automatic'],
      ['docs/installation/mysql/aws-rds.md', 'manual'],
      ['docs/installation/mysql/gcp-cloud-sql.md', 'automatic'],
      ['docs/installation/mysql/gcp-cloud-sql.md', 'manual'],
      ['docs/installation/mysql/azure-database-for-mysql.md', 'procedure'],
      ['docs/installation/mysql/whm-cpanel.md', 'automatic'],
      ['docs/installation/mariadb/windows.md', 'automatic'],
      ['docs/installation/mariadb/windows.md', 'manual'],
      ['docs/installation/mariadb/docker.md', 'manual'],
      ['docs/installation/mariadb/kubernetes.md', 'procedure'],
    ],
    'methodBlockers must cover every disabled installation method exactly once',
  );
  const blockerBySource = new Map();
  for (const blocker of overlay.methodBlockers) {
    assert.deepEqual(Object.keys(blocker).sort(), [
      'evidence',
      'method',
      'publicNotice',
      'reason',
      'sourcePath',
    ]);
    assert.ok(['automatic', 'manual', 'procedure'].includes(blocker.method));
    assert.ok(blocker.reason.length >= 12);
    assert.ok(blocker.evidence.length >= 12);
    assert.ok(blocker.publicNotice.length >= 24);
    assert.match(
      blocker.publicNotice,
      /(?:not (?:independently )?verified|unverified|verification (?:is )?(?:blocked|unavailable))/iu,
      `${blocker.sourcePath} blocker must state the verification limit`,
    );
    assert.match(
      blocker.publicNotice,
      /(?:no executable|does not provide executable|do not (?:run|execute)|contact (?:Releem )?Support)/iu,
      `${blocker.sourcePath} blocker must give a non-executable next step`,
    );
    const blockers = blockerBySource.get(blocker.sourcePath) ?? [];
    blockers.push(blocker);
    blockerBySource.set(blocker.sourcePath, blockers);
  }
  for (const document of engineFirstInstallationDocuments.filter(
    ({environment, methods}) => environment && methods.length === 0,
  )) {
    assert.ok(blockerBySource.has(document.sourcePath), `${document.sourcePath} needs a method blocker`);
  }
  assert.equal((await listMarkdown(path.join(projectRoot, 'docs'))).length, 63);

  for (const sourcePath of engineFirstRetiredSources) {
    assert.equal(existsSync(path.join(projectRoot, sourcePath)), false, `Retire ${sourcePath}`);
  }
  for (const document of engineFirstInstallationDocuments) {
    assert.equal(existsSync(path.join(projectRoot, document.sourcePath)), true, `Create ${document.sourcePath}`);
    const source = await readFile(path.join(projectRoot, document.sourcePath), 'utf8');
    const metadata = frontMatter(source);
    assert.equal(metadata.id, path.posix.basename(document.id), `${document.sourcePath} ID drifted`);
    assert.equal(metadata.slug, document.route, `${document.sourcePath} route drifted`);
    assert.equal(metadata.title, document.title, `${document.sourcePath} title drifted`);
    assert.deepEqual(
      source.match(/^# .+$/gmu),
      [`# ${document.title}`],
      `${document.sourcePath} must have the exact single H1`,
    );
    assert.doesNotMatch(source, /['"]releem['"]@['"]%['"]/iu);
    assert.doesNotMatch(
      source,
      /\b(?:engine-first|retired source|migration manifest|preservation mapping|evidence boundary|implementation task)\b/iu,
      `${document.sourcePath} exposes internal migration wording`,
    );
    assert.doesNotMatch(
      source,
      /\b(?:not independently verified|existing commands?|retained|historical|future (?:verified|verification)|verification checklist|governance|validated for publication|pending verification|reviewed for publication)\b/iu,
      `${document.sourcePath} exposes internal evidence or future-governance wording`,
    );
    const fencedText = codeFenceBodies(source).join('\n');
    assert.doesNotMatch(
      fencedText,
      /(?:RELEEM_QUERY_OPTIMIZATION|query_optimization|QueryOptimization)\s*(?:=|:)\s*["']?(?:true|True)["']?/u,
      `${document.sourcePath} must not enable Query Optimization by default in examples`,
    );
    assert.doesNotMatch(
      fencedText,
      /rds:ModifyDBParameterGroup|--role\s+["']?Contributor\b|["']role["']\s*:\s*["']Contributor["']/iu,
      `${document.sourcePath} must not publish executable state-changing IAM grants`,
    );
    if (document.environment && document.environment !== 'linux') {
      assert.doesNotMatch(fencedText, /\biwr\b[^\n]*\|\s*iex\b/iu);
      assert.doesNotMatch(fencedText, /bash\s+-c\s+["']\$\(curl/iu);
      assert.doesNotMatch(fencedText, /--api-key=/iu);
      assert.doesNotMatch(
        fencedText,
        /(?:-e\s+|^\s*)(?:RELEEM_API_KEY|DB_PASSWORD)\s*(?:=|:)\s*\S+/imu,
      );
      assert.doesNotMatch(
        fencedText,
        /-\s*name:\s*(?:RELEEM_API_KEY|DB_PASSWORD)\s*\n\s*value:\s*\S+/imu,
      );
    }
    for (const blocker of blockerBySource.get(document.sourcePath) ?? []) {
      assert.equal(source.includes(blocker.publicNotice), true);
      assert.equal(fencedText.includes(blocker.publicNotice), false);
    }
    const conditional = overlay.conditionalEvidence.find(
      ({sourcePath}) => sourcePath === document.sourcePath,
    );
    if (conditional) assert.equal(source.includes(conditional.publicNotice), true);
  }

  const chooser = await readFile(path.join(projectRoot, 'docs/installation/index.md'), 'utf8');
  for (const [database, route] of [
    ['MySQL', '/installation/mysql'],
    ['MariaDB', '/installation/mariadb'],
    ['PostgreSQL', '/installation/postgresql'],
  ]) {
    assert.match(chooser, new RegExp(`^## \\[${database}\\]\\(${route}\\)$`, 'mu'));
    assert.match(
      chooser,
      new RegExp(`\\[View ${database} installation options\\]\\(${route}\\)`, 'u'),
    );
    assert.equal(
      chooser.split(`](${route})`).length - 1,
      2,
      `Chooser must link its ${database} heading and CTA to ${route}`,
    );
  }
  for (const {route, environment} of engineFirstInstallationDocuments) {
    if (!environment) continue;
    assert.equal(
      chooser.split(`](${route})`).length - 1,
      1,
      `Chooser must expose the supported environment route ${route}`,
    );
  }
  for (const database of ['mysql', 'mariadb', 'postgresql']) {
    const hub = await readFile(path.join(projectRoot, `docs/installation/${database}/index.md`), 'utf8');
    const expectedRoutes = engineFirstInstallationDocuments
      .filter((document) => document.database === database && document.environment)
      .map(({route}) => route);
    const actualRoutes = [...hub.matchAll(/\]\((\/installation\/[a-z-]+\/[a-z-]+)\)/gu)]
      .map((match) => match[1])
      .filter((route) => route.startsWith(`/installation/${database}/`));
    assert.deepEqual(actualRoutes, expectedRoutes, `${database} hub route order drifted`);
    assert.match(hub, new RegExp(`/supported-databases/${database}/required-permissions`, 'u'));
    assert.match(hub, /\/get-started\/connect-your-database-server/u);
  }
  const hubSources = new Map(await Promise.all(
    ['mysql', 'mariadb', 'postgresql'].map(async (database) => [
      database,
      await readFile(path.join(projectRoot, `docs/installation/${database}/index.md`), 'utf8'),
    ]),
  ));
  for (const sourcePath of new Set(overlay.methodBlockers.map(({sourcePath}) => sourcePath))) {
    const document = engineFirstInstallationDocuments.find((item) => item.sourcePath === sourcePath);
    assert.ok(document, `Unknown blocked-method page: ${sourcePath}`);
    assert.equal(
      hasUnavailableRouteLabel(chooser, document.route),
      true,
      `Chooser must visibly label ${document.route} as procedure unavailable`,
    );
    assert.equal(
      hasUnavailableRouteLabel(hubSources.get(document.database), document.route),
      true,
      `${document.database} hub must visibly label ${document.route} as procedure unavailable`,
    );
  }

  const permissionRoutes = {
    mysql: '/supported-databases/mysql/required-permissions',
    mariadb: '/supported-databases/mariadb/required-permissions',
    postgresql: '/supported-databases/postgresql/required-permissions',
  };
  for (const document of engineFirstInstallationDocuments.filter(({environment}) => environment)) {
    const source = await readFile(path.join(projectRoot, document.sourcePath), 'utf8');
    assert.equal(source.includes(`](/installation/${document.database})`), true);
    assert.match(source, new RegExp(permissionRoutes[document.database].replaceAll('/', '\\/'), 'u'));
    assert.match(source, /^## Expected result(?:\s+\{#[^}]+\})?$/imu);
    assert.match(source, /Agent Status:\s*Connected/iu);
    assert.match(source, /current (?:data timestamp|metrics)/iu);
    assert.match(source, /^## Troubleshooting(?:\s+\{#[^}]+\})?$/imu);
    assert.match(source, /^## Next steps(?:\s+\{#[^}]+\})?$/imu);
    const methodHeadings = [...source.matchAll(
      /^## (Automatic|Manual) installation\b.*$/gimu,
    )].map(([heading, label]) => ({heading, method: label.toLowerCase()}));
    assert.deepEqual(
      methodHeadings.map(({method}) => method),
      document.methods,
      `${document.sourcePath} must expose only supported method H2s in canonical order`,
    );
    assert.deepEqual(
      methodHeadings.map(({heading}) => heading),
      document.methods.map((method) =>
        `## ${method[0].toUpperCase()}${method.slice(1)} installation {#${method}-installation}`,
      ),
      `${document.sourcePath} method H2s must use exact canonical labels and anchors`,
    );
    assert.match(source, /^## Prerequisites(?:\s+\{#[^}]+\})?$/imu);
    if (document.database === 'mariadb') {
      assert.doesNotMatch(source, /\/supported-databases\/mysql\/required-permissions/u);
      if (/RELEEM_MYSQL_/u.test(source)) {
        assert.match(
          source,
          /(?:RELEEM_MYSQL_\*[^\n]*MariaDB|MariaDB[^\n]*RELEEM_MYSQL_\*)/iu,
          `${document.sourcePath} must explain the retained RELEEM_MYSQL_* compatibility names`,
        );
      }
    }
    if (document.database === 'mysql') {
      assert.doesNotMatch(
        source,
        /RELEEM_MYSQL_TYPE\s*=\s*2|\/installation\/mariadb\/kubernetes|your-name-space-mariadb|statefulset\.kubernetes\.io\/pod-name/iu,
      );
    }
  }
  const parameterEnvironments = new Set([
    'linux',
    'windows',
    'docker',
    'aws-rds',
    'gcp-cloud-sql',
    'azure-database-for-mysql',
  ]);
  for (const document of engineFirstInstallationDocuments.filter(({environment}) => environment)) {
    const source = await readFile(path.join(projectRoot, document.sourcePath), 'utf8');
    if (parameterEnvironments.has(document.environment)) {
      assert.match(source, /^## (?:Installer )?parameters(?:\s+\{#[^}]+\})?$/imu);
    }
    assert.match(source, /^## Verify (?:the )?(?:installation|connectivity)(?: and current metrics)?(?:\s+\{#[^}]+\})?$/imu);
    assert.match(source, /Agent Status:\s*Connected/iu);
    assert.match(source, /current (?:data timestamp|metrics)/iu);
    assert.match(source, /^## Troubleshooting(?: and recovery)?(?:\s+\{#[^}]+\})?$/imu);
    assert.match(source, /\/get-started\/troubleshoot-releem-agent/u);
    assert.match(source, /recover|re-run|restart|logs?/iu);
    for (const route of [
      '/installation/manage-the-releem-agent/configuration',
      '/installation/manage-the-releem-agent/update',
      '/installation/manage-the-releem-agent/uninstall',
    ]) {
      assert.match(source, new RegExp(route.replaceAll('/', '\\/'), 'u'));
    }
    if (document.environment === 'linux' && document.database !== 'postgresql') {
      assert.match(source, /CloudLinux/iu);
      assert.match(source, /\/get-started\/troubleshoot-releem-agent#cloudlinux/u);
      assert.match(source, /MySQLGovernor/iu);
    } else if (document.database === 'postgresql') {
      assert.doesNotMatch(source, /CloudLinux|MySQLGovernor/iu);
    }
  }
  for (const database of ['mysql', 'mariadb', 'postgresql']) {
    const linux = await readFile(path.join(projectRoot, `docs/installation/${database}/linux.md`), 'utf8');
    assert.doesNotMatch(linux, /1\.25\.2|01e1f6e|September 1, 2026/u);
    assert.match(
      linux,
      database === 'mysql'
        ? /MySQL 5\.5[^\n]+8\.0/u
        : database === 'mariadb'
          ? /MariaDB 10\.1[^\n]+11\.0/u
          : /PostgreSQL 15[^\n]+18/u,
    );
    assert.match(linux, /\{#automatic-installation\}/u);
    assert.match(linux, /\{#manual-installation\}/u);
    assert.equal((linux.match(/sudo bash -c '/gu) ?? []).length, 2);
    assert.match(linux, /read -r -s/iu);
    assert.match(linux, /mktemp/iu);
    assert.match(linux, /trap[^\n]+rm -f/iu);
    assert.match(linux, /curl --fail --location --proto ["']=https["'] --tlsv1\.2/iu);
    assert.match(linux, /private root Bash session/iu);
    assert.doesNotMatch(linux, /\. \/root\/releem-install\.env|sudoedit|releem-install\.env/iu);
    assert.match(linux, /\/opt\/releem\/releem\.conf/u);
    if (database === 'postgresql') {
      assert.match(linux, /RELEEM_PG_TYPE=1/u);
      assert.match(linux, /RELEEM_PG_ROOT_LOGIN[^\n]+default[^\n]+postgres/iu);
      assert.match(linux, /RELEEM_PG_HOST[^\n]+127\.0\.0\.1[^\n]+RELEEM_PG_PORT[^\n]+5432/iu);
    } else {
      assert.match(linux, /RELEEM_MYSQL_ROOT_LOGIN[^\n]+default[^\n]+root/iu);
      assert.match(linux, /RELEEM_MYSQL_HOST[^\n]+127\.0\.0\.1[^\n]+RELEEM_MYSQL_PORT[^\n]+3306/iu);
    }
    assert.match(linux, /RELEEM_QUERY_OPTIMIZATION=true/u);
    assert.match(linux, /omit[^\n]+RELEEM_QUERY_OPTIMIZATION/iu);
    if (database === 'postgresql') assert.match(linux, /verify-full/iu);
    else assert.doesNotMatch(linux, /verify-full/iu);
    assert.match(linux, /downloads components from mutable URLs/iu);
    assert.match(linux, /without published signature or checksum verification/iu);
    assert.match(linux, /attempts to upload `\/var\/log\/releem-install\.log` on exit/iu);
    assert.match(
      linux,
      /If your policy forbids mutable or unverified downloads, secrets in the process environment, or automatic log uploads, do not use any installer flow\./u,
    );
    assert.match(linux, /process environment/iu);
    assert.match(linux, /private administrative session/iu);
    assert.match(linux, /RELEEM_CRON_ENABLE=0/iu);
    assert.match(
      linux,
      /RELEEM_CRON_ENABLE=1[^\n]+daily[^\n]+midnight[^\n]+\/installation\/manage-the-releem-agent\/update/iu,
    );
    assert.doesNotMatch(linux, /RELEEM_CRON_ENABLE=1\s*$/gmu);
    assert.match(linux, /current[^\n]+(?:data timestamp|metrics)/iu);
    assert.doesNotMatch(linux, /first metrics can take|short time/iu);
    assert.doesNotMatch(linux, /unresolved/iu);
    if (database !== 'postgresql') {
      assert.match(linux, /admin(?:istrative)? and monitoring passwords in child-process arguments/iu);
      assert.match(linux, /existing-user authentication failure[^\n]+monitoring password[^\n]+uploaded log/iu);
      assert.match(
        linux,
        /If child-process argument exposure or failure-log password exposure is unacceptable, do not use the MySQL or MariaDB installer flow\./u,
      );
    }
    assert.doesNotMatch(linux, /curl[^\n]+\|\s*(?:sudo\s+)?bash/iu);
    assert.doesNotMatch(
      linux,
      /0\.0\.0\.0\/0|\bmd5\b|RELEEM_(?:MYSQL|PG)_ROOT_PASSWORD\s*=|releem-dashboard-agent-automatic-installation|cryptographically verified/iu,
    );
  }

  const mariaHub = await readFile(path.join(projectRoot, 'docs/installation/mariadb/index.md'), 'utf8');
  assert.doesNotMatch(mariaHub, /\/supported-databases\/mysql\/required-permissions/u);

  const publicSources = await Promise.all(
    (await listMarkdown(path.join(projectRoot, 'docs'))).map((file) => readFile(file, 'utf8')),
  );
  const publicText = publicSources.join('\n');
  assert.doesNotMatch(publicText, /\/installation\/linux\?database=/u);
  for (const route of blockedEngineFirstRoutes) {
    assert.equal(publicText.includes(route), false, `Blocked route is advertised: ${route}`);
    assert.equal(existsSync(path.join(projectRoot, `docs${route}.md`)), false);
    assert.equal(existsSync(path.join(projectRoot, `docs${route}/index.md`)), false);
  }

  assert.equal(existsSync(legacyLinuxRedirectPath), true, 'Create the pure legacy Linux helper');
  assert.equal(existsSync(legacyLinuxRoutePath), true, 'Create the /installation/linux compatibility page');
  const [helperSource, routeSource] = await Promise.all([
    readFile(legacyLinuxRedirectPath, 'utf8'),
    readFile(legacyLinuxRoutePath, 'utf8'),
  ]);
  assert.doesNotMatch(helperSource, /\b(?:window|document|globalThis)\s*\./u);
  assert.match(routeSource, /search:\s*window\.location\.search/u);
  assert.match(routeSource, /hash:\s*window\.location\.hash/u);
  const directResolverToReplace = /(?:window\.)?location\.replace\(\s*resolveLegacyLinuxRedirect\(/u
    .test(routeSource);
  const resolvedVariable = routeSource.match(
    /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*resolveLegacyLinuxRedirect\(/u,
  )?.[1];
  const assignedResolverToReplace = resolvedVariable
    ? new RegExp(`(?:window\\.)?location\\.replace\\(\\s*${resolvedVariable}\\s*\\)`, 'u')
      .test(routeSource)
    : false;
  assert.equal(
    directResolverToReplace || assignedResolverToReplace,
    true,
    'The compatibility page must pass the pure resolver result to location.replace',
  );
  const {resolveLegacyLinuxRedirect} = await import(
    `${pathToFileURL(legacyLinuxRedirectPath).href}?test=${Date.now()}`
  );
  assert.equal(resolveLegacyLinuxRedirect({search: '', hash: ''}), '/installation');
  for (const database of ['mysql', 'mariadb', 'postgresql']) {
    const route = `/installation/${database}/linux`;
    assert.equal(
      resolveLegacyLinuxRedirect({search: `?database=${database}`, hash: `#${database}-installation`}),
      route,
    );
    assert.equal(
      resolveLegacyLinuxRedirect({search: `?database=${database}`, hash: `#${database}-automatic-installation`}),
      `${route}#automatic-installation`,
    );
    assert.equal(
      resolveLegacyLinuxRedirect({search: `?database=${database}`, hash: `#${database}-manual-installation`}),
      `${route}#manual-installation`,
    );
  }
  assert.equal(resolveLegacyLinuxRedirect({search: '?database=oracle', hash: ''}), '/installation');
  assert.equal(
    resolveLegacyLinuxRedirect({search: '?database=oracle', hash: '#mysql-manual-installation'}),
    '/installation',
  );
  assert.equal(
    resolveLegacyLinuxRedirect({search: '?database=mysql', hash: '#postgresql-manual-installation'}),
    '/installation/mysql/linux',
  );
  assert.doesNotThrow(() =>
    resolveLegacyLinuxRedirect({search: '?database=%E0%A4%A', hash: '#mysql-installation'}),
  );
  assert.equal(
    resolveLegacyLinuxRedirect({search: '?database=%E0%A4%A', hash: '#mysql-installation'}),
    '/installation',
  );
  assert.equal(
    resolveLegacyLinuxRedirect({search: '?database=mysql&utm=%E0%A4%A', hash: '#custom%E0%A4%A'}),
    '/installation/mysql/linux?utm=%EF%BF%BD%25A#custom%E0%A4%A',
  );
  assert.equal(
    resolveLegacyLinuxRedirect({
      search: '?utm_source=legacy&database=mariadb&mode=advanced',
      hash: '#custom-section',
    }),
    '/installation/mariadb/linux?utm_source=legacy&mode=advanced#custom-section',
  );
  assert.equal(
    resolveLegacyLinuxRedirect({search: '?utm_source=legacy', hash: '#custom-section'}),
    '/installation?utm_source=legacy#custom-section',
  );
  assert.equal(
    resolveLegacyLinuxRedirect({search: '?database=oracle&utm_source=legacy', hash: '#custom-section'}),
    '/installation?utm_source=legacy#custom-section',
  );
});

test('public engine-first pages use availability language without internal evidence terms or executable mutation grants', async () => {
  for (const document of engineFirstInstallationDocuments) {
    const source = await readFile(path.join(projectRoot, document.sourcePath), 'utf8');
    assert.doesNotMatch(
      source,
      /\b(?:not independently verified|existing commands?|retained|historical|future (?:verified|verification)|verification checklist|governance|validated for publication|pending verification|reviewed for publication)\b/iu,
      `${document.sourcePath} exposes internal evidence or future-governance wording`,
    );
    assert.doesNotMatch(
      codeFenceBodies(source).join('\n'),
      /rds:ModifyDBParameterGroup|--role\s+["']?Contributor\b|["']role["']\s*:\s*["']Contributor["']/iu,
      `${document.sourcePath} publishes an executable state-changing IAM grant`,
    );
  }
});

test('PostgreSQL preload instructions merge and verify pg_stat_statements', async () => {
  const source = await readFile(postgresPermissionsPath, 'utf8');
  assert.match(source, /inspect[^\n]+existing[^\n]+shared_preload_libraries/iu);
  assert.match(source, /comma-separated list/iu);
  assert.match(source, /without removing[^\n]+existing/iu);
  assert.match(source, /restart[^\n]+approved/iu);
  assert.match(source, /SHOW shared_preload_libraries;/u);
});

test('PostgreSQL SCRAM rules require a SCRAM verifier and protected rotation session', async () => {
  const source = await readFile(postgresPermissionsPath, 'utf8');
  assert.match(source, /SHOW password_encryption;/u);
  assert.match(source, /monitoring role password[^\n]+SCRAM verifier/iu);
  assert.match(source, /automatic account creation[^\n]+server default[^\n]+scram-sha-256/iu);
  assert.match(source, /protected[^\n]+session/iu);
  assert.match(source, /SET password_encryption = 'scram-sha-256';/u);
  assert.match(source, /\\password releem/u);
  assert.match(source, /session-local/iu);
  assert.match(source, /do not change[^\n]+global[^\n]+without[^\n]+approval/iu);
  assert.doesNotMatch(source, /review baseline/iu);
  assert.match(source, /not universally least-privilege/iu);
  assert.match(source, /validate[^\n]+target database[^\n]+enabled features/iu);
});

test('private checklist distinguishes executable examples from documented wildcard behavior', async () => {
  const source = await readFile(migrationChecklistPath, 'utf8');
  assert.match(source, /No executable example recommends wildcard access/iu);
  assert.doesNotMatch(source, /No wildcard database\/network access/iu);
});

test('MySQL permissions are canonical, exact-source, and MySQL-only', async () => {
  const source = await readFile(mysqlPermissionsPath, 'utf8');
  assert.deepEqual(frontMatter(source), {
    id: 'required-permissions',
    slug: '/supported-databases/mysql/required-permissions',
    title: 'MySQL Permissions for Releem Agent',
  });
  assert.match(source, /^# MySQL Permissions for Releem Agent$/mu);
  assert.match(source, /MySQL 5\.5[^\n]+8\.0/u);
  assert.doesNotMatch(source, /read-only/iu);
  assert.doesNotMatch(source, /MariaDB/iu);
  assert.doesNotMatch(source, /@\s*['"`]%(?:['"`]|\b)/u);
  assert.match(source, /['"`]AGENT_SOURCE_HOST['"`]/u);
  for (const heading of [
    '## Monitoring and query visibility',
    '## Configuration application',
  ]) assert.match(source, new RegExp(`^${heading}$`, 'mu'));
  assert.match(
    source,
    /^## Query and schema application \{#additional-database-permissions-required\}$/mu,
  );
  assert.match(source, /SYSTEM_VARIABLES_ADMIN[\s\S]+state-changing/iu);
  assert.match(source, /SUPER[\s\S]+state-changing/iu);
  assert.match(source, /AWS RDS for MySQL/iu);
  assert.match(source, /only[^\n]+enabled capabilities/iu);
  assert.match(source, /current installer/iu);
  assert.match(source, /GRANT SELECT ON mysql\.\* TO 'releem'@'AGENT_SOURCE_HOST';/u);
  assert.match(source, /system-schema data/iu);
  assert.match(source, /remote[\s\S]+wildcard account host[\s\S]+DBA-created[\s\S]+manual/iu);
});

test('MariaDB permissions are canonical, exact-source, and exclude MySQL-only grants', async () => {
  assert.equal(existsSync(mariadbPermissionsPath), true, 'Create MariaDB permissions guide');
  const source = await readFile(mariadbPermissionsPath, 'utf8');
  assert.deepEqual(frontMatter(source), {
    id: 'required-permissions',
    slug: '/supported-databases/mariadb/required-permissions',
    title: 'MariaDB Permissions for Releem Agent',
  });
  assert.match(source, /^# MariaDB Permissions for Releem Agent$/mu);
  assert.match(source, /MariaDB 10\.1[^\n]+11\.0/u);
  assert.doesNotMatch(source, /read-only/iu);
  assert.doesNotMatch(source, /@\s*['"`]%(?:['"`]|\b)/u);
  assert.match(source, /['"`]AGENT_SOURCE_HOST['"`]/u);
  for (const heading of [
    '## Monitoring and query visibility',
    '## Configuration application',
  ]) assert.match(source, new RegExp(`^${heading}$`, 'mu'));
  assert.match(
    source,
    /^## Query and schema application \{#additional-database-permissions-required\}$/mu,
  );
  assert.match(source, /SUPER[\s\S]+state-changing/iu);
  assert.doesNotMatch(source, /SYSTEM_VARIABLES_ADMIN|AWS RDS/iu);
  assert.match(source, /Performance Schema[^\n]+target MariaDB version/iu);
  assert.match(source, /GRANT SELECT ON mysql\.\* TO 'releem'@'AGENT_SOURCE_HOST';/u);
  assert.match(source, /system-schema data/iu);
  assert.match(source, /remote[\s\S]+wildcard account host[\s\S]+DBA-created[\s\S]+manual/iu);
});

test('Add Server exposes automatic and manual Linux paths for all three engines', async () => {
  const source = await readFile(
    path.join(projectRoot, 'docs/get-started/connect-your-database-server.md'),
    'utf8',
  );
  for (const engine of ['mysql', 'mariadb', 'postgresql']) {
    for (const mode of ['automatic', 'manual']) {
      assert.match(
        source,
        new RegExp(`/installation/${engine}/linux#${mode}-installation`, 'u'),
      );
    }
  }
  for (const {route, environment} of engineFirstInstallationDocuments) {
    if (!environment || environment === 'linux') continue;
    assert.equal(source.includes(`](${route})`), true);
  }
  for (const route of unavailableEnvironmentRoutes) {
    const line = source
      .split('\n')
      .find((candidate) => candidate.includes(`](${route})`));
    assert.ok(line, `Add Server must link to ${route}`);
    assert.match(
      line,
      /\*\*Procedure unavailable\.\*\*/u,
      `Add Server must mark ${route} as unavailable`,
    );
  }
  for (const route of blockedEngineFirstRoutes) {
    assert.equal(source.includes(route), false, `Add Server advertises blocked route ${route}`);
  }
});

test('split cluster and mixed-engine workflows use contextual permission references', async () => {
  const [mysqlClusters, mariadbClusters] = await Promise.all([
    readFile(path.join(projectRoot, 'docs/installation/mysql/clusters.md'), 'utf8'),
    readFile(path.join(projectRoot, 'docs/installation/mariadb/clusters.md'), 'utf8'),
  ]);
  const queryOptimization = await readFile(
    path.join(projectRoot, 'docs/recommendations/query-optimization/enable.md'),
    'utf8',
  );
  assert.match(mysqlClusters, /\/supported-databases\/mysql\/required-permissions/u);
  assert.doesNotMatch(mysqlClusters, /\/supported-databases\/mariadb\/required-permissions/u);
  assert.match(mysqlClusters, /\/installation\/mysql\/linux#manual-installation/u);
  assert.match(mariadbClusters, /\/supported-databases\/mariadb\/required-permissions/u);
  assert.doesNotMatch(mariadbClusters, /\/supported-databases\/mysql\/required-permissions/u);
  assert.match(mariadbClusters, /\/installation\/mariadb\/linux#manual-installation/u);
  assert.match(queryOptimization, /\/supported-databases\/mysql\/required-permissions/u);
  assert.match(queryOptimization, /\/supported-databases\/mariadb\/required-permissions/u);
  assert.doesNotMatch(
    queryOptimization,
    /For MySQL\/MariaDB\/Percona[^\n]+\/supported-databases\/mysql\/required-permissions/iu,
  );
});

test('PostgreSQL permissions separate baseline, extension, and optional DBA-reviewed capabilities', async () => {
  assert.equal(existsSync(postgresPermissionsPath), true, 'Create PostgreSQL permissions guide');
  const source = await readFile(postgresPermissionsPath, 'utf8');
  assert.match(source, /PostgreSQL 15[^\n]+18/u);
  assert.match(source, /GRANT pg_monitor TO releem;/u);
  assert.doesNotMatch(source, /GRANT EXECUTE ON FUNCTION pg_hba_file_rules|function grant/iu);
  assert.match(source, /pg_stat_statements/u);
  assert.match(source, /optional[\s\S]+DBA review/iu);
  assert.match(source, /127\.0\.0\.1\/32\s+scram-sha-256/u);
  assert.match(source, /hostssl[^\n]+AGENT_IP\/32[^\n]+scram-sha-256/u);
  assert.match(source, /first matching/iu);
  assert.match(source, /listen_addresses/iu);
  assert.match(source, /firewall/iu);
  assert.match(source, /\/installation\/postgresql\/linux/u);
  assert.doesNotMatch(source, /\/installation\/linux\?database=/u);
  assert.doesNotMatch(source, /0\.0\.0\.0\/0|\bmd5\b|@'%'|minimal privileges/iu);
});
