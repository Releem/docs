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

test('Linux consolidation has the exact 54-page source and redaction overlay', async () => {
  assert.equal(existsSync(linuxPath), true, 'Create the canonical Linux guide');
  assert.equal(existsSync(mariadbPermissionsPath), true, 'Create MariaDB permissions guide');
  assert.equal(existsSync(postgresPermissionsPath), true, 'Create PostgreSQL permissions guide');
  for (const source of retiredSources) {
    assert.equal(existsSync(path.join(projectRoot, source)), false, `Retire ${source}`);
  }
  assert.equal(existsSync(path.join(projectRoot, sensitiveAsset)), false);
  assert.equal((await listMarkdown(path.join(projectRoot, 'docs'))).length, 54);

  const overlay = JSON.parse(await readFile(consolidationPath, 'utf8'));
  assert.equal(overlay.schemaVersion, 1);
  assert.equal(overlay.historicalBaselinePageCount, 54);
  assert.equal(overlay.currentPageCount, 54);
  assert.deepEqual(overlay.retiredSources, retiredSources);
  assert.deepEqual(overlay.addedSources, [
    'docs/installation/linux.md',
    'docs/supported-databases/mariadb/required-permissions.md',
    'docs/supported-databases/postgresql/required-permissions.md',
  ]);
  assert.deepEqual(overlay.rewrittenSources, [
    'docs/supported-databases/mysql/required-permissions.md',
  ]);
  assert.deepEqual(
    overlay.sidebarOwnershipOverrides.map(({sourcePath}) => sourcePath),
    [
      'docs/installation/installation-methods/windows.md',
      'docs/installation/installation-methods/docker.md',
      'docs/installation/installation-methods/kubernetes.md',
      'docs/installation/installation-methods/aws-rds.md',
      'docs/installation/installation-methods/gcp-cloud-sql.md',
      'docs/installation/installation-methods/azure-database-for-mysql.md',
      'docs/installation/installation-methods/clusters.md',
      'docs/installation/installation-methods/whm-cpanel.md',
    ],
  );
  assert.deepEqual(
    overlay.internalLinkAdditions.map(({sourcePath, content}) => ({sourcePath, content})),
    [
      {
        sourcePath: 'docs/get-started/connect-your-database-server.md',
        content: '- [MariaDB on Linux Server: Automatic Agent Installation](/installation/linux?database=mariadb#mariadb-automatic-installation) – Automatic installation for MariaDB instances running on Linux-based servers.',
      },
      {
        sourcePath: 'docs/get-started/connect-your-database-server.md',
        content: '- [MariaDB on Linux Server: Manual Agent Installation](/installation/linux?database=mariadb#mariadb-manual-installation) – Manual installation for MariaDB instances when a DBA creates the monitoring account.',
      },
      {
        sourcePath: 'docs/get-started/connect-your-database-server.md',
        content: '- [PostgreSQL on Linux Server: Automatic Agent Installation](/installation/linux?database=postgresql#postgresql-automatic-installation) – Automatic database-user creation for PostgreSQL instances running on Linux-based servers.',
      },
    ],
  );
  assert.equal(overlay.removedSensitiveAsset.path, sensitiveAsset);
  assert.match(overlay.removedSensitiveAsset.sha256, /^[a-f0-9]{64}$/u);
  assert.match(overlay.removedSensitiveAsset.reason, /credential|API key/iu);
  assert.equal(overlay.removedSensitiveAsset.rotationRequiredIfEverValid, true);
  assert.deepEqual(overlay.installerEvidence, {
    version: '1.25.2',
    branch: 'master',
    commit: '01e1f6e',
    observedOn: '2026-09-01',
    mutableDownloadDigestPublished: false,
    installerLogUploadAndRetention: 'UNCONFIRMED',
  });
});

test('canonical Linux guide has exact metadata, one engine Tabs group, and ordered anchors', async () => {
  assert.equal(existsSync(linuxPath), true, 'Create the canonical Linux guide');
  const source = await readFile(linuxPath, 'utf8');
  assert.deepEqual(frontMatter(source), {
    id: 'linux',
    slug: '/installation/linux',
    title: 'Install Releem Agent on Linux',
  });
  assert.equal((source.match(/<Tabs\b/gu) ?? []).length, 1);
  assert.equal((source.match(/<\/Tabs>/gu) ?? []).length, 1);
  assert.match(
    source,
    /<Tabs\s+groupId="database-engine"\s+queryString="database"\s+defaultValue="mysql">/u,
  );
  assert.deepEqual(
    [...source.matchAll(/<TabItem\s+value="([^"]+)"/gu)].map((match) => match[1]),
    ['mysql', 'mariadb', 'postgresql'],
  );

  const anchors = [
    'mysql-installation',
    'mysql-automatic-installation',
    'mysql-manual-installation',
    'mariadb-installation',
    'mariadb-automatic-installation',
    'mariadb-manual-installation',
    'postgresql-installation',
    'postgresql-automatic-installation',
    'postgresql-manual-installation',
  ];
  let previous = -1;
  for (const anchor of anchors) {
    const index = source.indexOf(`{#${anchor}}`);
    assert.ok(index > previous, `${anchor} must exist in the required order`);
    previous = index;
  }
  assert.match(source, /### Automatic installation \{#mysql-automatic-installation\}/u);
  assert.match(source, /### Automatic installation \{#mariadb-automatic-installation\}/u);
  assert.match(source, /### Automatic database-user creation \{#postgresql-automatic-installation\}/u);
  assert.match(source, /### Manual database-user creation \{#postgresql-manual-installation\}/u);
  assert.doesNotMatch(source, /Recommended/iu);
});

test('every engine tab hands off all installation tasks without duplicating shared operations', async () => {
  assert.equal(existsSync(linuxPath), true, 'Create the canonical Linux guide');
  const source = await readFile(linuxPath, 'utf8');
  const engineConfig = [
    ['mysql', 'mariadb', '/supported-databases/mysql/required-permissions'],
    ['mariadb', 'postgresql', '/supported-databases/mariadb/required-permissions'],
    ['postgresql', null, '/supported-databases/postgresql/required-permissions'],
  ];
  for (const [engine, nextEngine, permissions] of engineConfig) {
    const tab = tabBody(source, engine, nextEngine);
    for (const target of [
      `#${engine}-installation`,
      permissions,
      `#${engine}-automatic-installation`,
      `#${engine}-manual-installation`,
      '#installer-parameters',
      '#expected-result',
      '#verify-installation',
      '#troubleshooting',
      '/installation/manage-the-releem-agent/update',
      '/installation/manage-the-releem-agent/uninstall',
    ]) assert.match(tab, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'u'));
  }
  for (const anchor of [
    'installer-parameters',
    'expected-result',
    'verify-installation',
    'troubleshooting',
  ]) {
    const index = source.indexOf(`{#${anchor}}`);
    assert.ok(index > source.indexOf('</Tabs>'), `${anchor} must be shared after Tabs`);
  }
});

test('Linux guide states current installer exposure facts and uses masked data prompts', async () => {
  assert.equal(existsSync(linuxPath), true, 'Create the canonical Linux guide');
  const source = await readFile(linuxPath, 'utf8');
  assert.doesNotMatch(source, /1\.25\.2|01e1f6e|September 1, 2026/u);
  assert.match(source, /MySQL 5\.5[^\n]+8\.0/u);
  assert.match(source, /MariaDB 10\.1[^\n]+11\.0/u);
  assert.match(source, /PostgreSQL 15[^\n]+18/u);
  assert.match(source, /curl --fail --location --proto ["']=https["'] --tlsv1\.2/u);
  assert.match(source, /read -r -s/iu);
  assert.match(source, /private root Bash session/iu);
  assert.doesNotMatch(source, /\. \/root\/releem-install\.env|sudoedit|releem-install\.env/iu);
  assert.match(source, /\/opt\/releem\/releem\.conf/u);
  assert.match(source, /RELEEM_PG_TYPE=1/u);
  assert.match(source, /RELEEM_MYSQL_ROOT_LOGIN[^\n]+default[^\n]+root/iu);
  assert.match(source, /RELEEM_PG_ROOT_LOGIN[^\n]+default[^\n]+postgres/iu);
  assert.match(source, /RELEEM_MYSQL_HOST[^\n]+127\.0\.0\.1[^\n]+RELEEM_MYSQL_PORT[^\n]+3306/iu);
  assert.match(source, /RELEEM_PG_HOST[^\n]+127\.0\.0\.1[^\n]+RELEEM_PG_PORT[^\n]+5432/iu);
  assert.match(source, /RELEEM_QUERY_OPTIMIZATION=true/u);
  assert.match(source, /omit[^\n]+RELEEM_QUERY_OPTIMIZATION/iu);
  assert.match(source, /verify-full/iu);
  assert.match(source, /downloads components from mutable URLs/iu);
  assert.match(source, /without published signature or checksum verification/iu);
  assert.match(source, /attempts to upload `\/var\/log\/releem-install\.log` on exit/iu);
  assert.match(source, /admin(?:istrative)? and monitoring passwords in child-process arguments/iu);
  assert.match(source, /existing-user authentication failure[^\n]+monitoring password[^\n]+uploaded log/iu);
  assert.match(
    source,
    /If your policy forbids mutable or unverified downloads, secrets in the process environment, or automatic log uploads, do not use any installer flow\./u,
  );
  assert.match(
    source,
    /If child-process argument exposure or failure-log password exposure is unacceptable, do not use the MySQL or MariaDB installer flow\./u,
  );
  assert.doesNotMatch(source, /unresolved/iu);
  assert.match(source, /process environment/iu);
  assert.match(source, /private administrative session/iu);
  assert.match(source, /RELEEM_CRON_ENABLE=0/iu);
  assert.match(source, /RELEEM_CRON_ENABLE=1[^\n]+daily[^\n]+midnight[^\n]+\/installation\/manage-the-releem-agent\/update/iu);
  assert.doesNotMatch(source, /RELEEM_CRON_ENABLE=1\s*$/gmu);
  assert.match(source, /current[^\n]+(?:data timestamp|metrics)/iu);
  assert.doesNotMatch(source, /first metrics can take|short time/iu);
  assert.doesNotMatch(source, /curl[^\n]+\|\s*(?:sudo\s+)?bash/iu);
  assert.doesNotMatch(source, /0\.0\.0\.0\/0|\bmd5\b|RELEEM_(?:MYSQL|PG)_ROOT_PASSWORD\s*=|releem-dashboard-agent-automatic-installation|cryptographically verified/iu);
});

test('each Linux installation method is one copyable command', async () => {
  const source = await readFile(linuxPath, 'utf8');
  const methodAnchors = [
    'mysql-automatic-installation',
    'mysql-manual-installation',
    'mariadb-automatic-installation',
    'mariadb-manual-installation',
    'postgresql-automatic-installation',
    'postgresql-manual-installation',
  ];

  assert.equal((source.match(/sudo bash -c '/gu) ?? []).length, methodAnchors.length);
  assert.doesNotMatch(source, /^## Prepare the installer safely$/mu);
  assert.doesNotMatch(source, /^## Run the installer/u);
  assert.doesNotMatch(source, /\/root\/releem-install\.sh/u);
  assert.doesNotMatch(source, /review the downloaded script|inspect the complete file|\bless releem-install/iu);

  for (const [index, anchor] of methodAnchors.entries()) {
    const start = source.indexOf(`{#${anchor}}`);
    const nextAnchor = methodAnchors[index + 1];
    const end = nextAnchor ? source.indexOf(`{#${nextAnchor}}`, start) : source.indexOf('</Tabs>', start);
    const method = source.slice(start, end);

    assert.match(method, /Run this one-step command/u, `${anchor} must lead with one command`);
    assert.equal((method.match(/```bash/gu) ?? []).length, 1, `${anchor} must have one Bash block`);
    assert.match(method, /read -r -s/iu, `${anchor} must prompt without echo`);
    assert.match(method, /mktemp/iu, `${anchor} must use a protected temporary file`);
    assert.match(method, /trap[^\n]+rm -f/iu, `${anchor} must remove the downloaded installer`);
    assert.match(method, /curl --fail --location --proto "=https" --tlsv1\.2/iu);
    assert.match(method, /bash "\$installer"/u);
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

test('Linux page schedules a safe post-tab hash scroll after hydration', async () => {
  assert.equal(existsSync(hashScrollHelperPath), true, 'Create the hash-scroll helper');
  assert.equal(existsSync(hashScrollerComponentPath), true, 'Create the React hash scroller');
  const linuxSource = await readFile(linuxPath, 'utf8');
  const componentSource = await readFile(hashScrollerComponentPath, 'utf8');
  assert.match(linuxSource, /import HashTargetScroller from '\.\.\/\.\.\/src\/components\/HashTargetScroller';/u);
  assert.match(linuxSource, /<HashTargetScroller\s*\/>/u);
  assert.match(componentSource, /useLocation\(\)/u);
  assert.match(componentSource, /\[search, hash\]/u);

  const {decodeHashTarget, scheduleHashTargetScroll} = await import(
    `${pathToFileURL(hashScrollHelperPath).href}?test=${Date.now()}`
  );
  assert.equal(decodeHashTarget('#postgresql-installation'), 'postgresql-installation');
  assert.equal(decodeHashTarget('#bad%E0%A4%A'), null);

  const frames = [];
  const scrollCalls = [];
  const cleanup = scheduleHashTargetScroll({
    hash: '#postgresql-installation',
    documentObject: {
      getElementById: (id) => id === 'postgresql-installation'
        ? {scrollIntoView: (options) => scrollCalls.push(options)}
        : null,
    },
    requestFrame: (callback) => {
      frames.push(callback);
      return frames.length;
    },
    cancelFrame: () => {},
  });
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(scrollCalls.length, 0);
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.deepEqual(scrollCalls, [{block: 'start'}]);
  cleanup();
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
        new RegExp(`/installation/linux\\?database=${engine}#${engine}-${mode}-installation`, 'u'),
      );
    }
  }
});

test('mixed MySQL and MariaDB workflows link to both permission references', async () => {
  const clusters = await readFile(
    path.join(projectRoot, 'docs/installation/installation-methods/clusters.md'),
    'utf8',
  );
  const queryOptimization = await readFile(
    path.join(projectRoot, 'docs/recommendations/query-optimization/enable.md'),
    'utf8',
  );
  for (const source of [clusters, queryOptimization]) {
    assert.match(source, /\/supported-databases\/mysql\/required-permissions/u);
    assert.match(source, /\/supported-databases\/mariadb\/required-permissions/u);
  }
  assert.match(clusters, /\/installation\/linux\?database=mysql#mysql-manual-installation/u);
  assert.match(clusters, /\/installation\/linux\?database=mariadb#mariadb-manual-installation/u);
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
  assert.match(source, /\/installation\/linux\?database=postgresql#postgresql-installation/u);
  assert.doesNotMatch(source, /0\.0\.0\.0\/0|\bmd5\b|@'%'|minimal privileges/iu);
});

test('sidebar exposes the exact flat Installation child order and owns all 54 docs once', async () => {
  const source = await readFile(path.join(projectRoot, 'sidebars.js'), 'utf8');
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const sidebars = (await import(url)).default;
  assert.deepEqual(sidebars.docs.map(({label}) => label), [
    'Get Started',
    'Supported Databases',
    'Installation',
    'Dashboard',
    'Recommendations',
    'Account',
    'FAQ',
  ]);
  const installation = sidebars.docs.find(({label}) => label === 'Installation');
  assert.equal(Object.hasOwn(installation, 'link'), false);
  assert.deepEqual(installation.items, [
    {type: 'doc', id: 'installation/linux', label: 'Linux'},
    'installation/installation-methods/windows',
    'installation/installation-methods/docker',
    'installation/installation-methods/kubernetes',
    {
      type: 'category',
      label: 'Managed databases',
      items: [
        'installation/installation-methods/aws-rds',
        'installation/installation-methods/gcp-cloud-sql',
        'installation/installation-methods/azure-database-for-mysql',
      ],
    },
    'installation/installation-methods/clusters',
    'installation/installation-methods/whm-cpanel',
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
  ]);
  assert.equal(JSON.stringify(installation).includes('Installation Methods'), false);
  const ids = [];
  const visit = (items) => {
    for (const item of items) {
      if (typeof item === 'string') ids.push(item);
      else if (item.type === 'doc') ids.push(item.id);
      else if (item.type === 'category') {
        if (item.link?.type === 'doc') ids.push(item.link.id);
        visit(item.items ?? []);
      }
    }
  };
  visit(sidebars.docs);
  assert.equal(ids.length, 54);
  assert.equal(new Set(ids).size, 54);
  assert.deepEqual(ids.filter((id) => [
    'installation/linux',
    'installation/linux-automatic',
    'installation/installation-methods/linux-manual',
    'supported-databases/postgresql/install-on-linux',
  ].includes(id)), [
    'installation/linux',
  ]);
  for (const id of [
    'installation/installation-methods/aws-rds',
    'installation/installation-methods/gcp-cloud-sql',
    'installation/installation-methods/azure-database-for-mysql',
    'installation/installation-methods/clusters',
    'installation/installation-methods/whm-cpanel',
    'installation/manage-the-releem-agent/configuration',
    'installation/manage-the-releem-agent/update',
    'installation/manage-the-releem-agent/uninstall',
    'supported-databases/mariadb/required-permissions',
    'supported-databases/postgresql/required-permissions',
  ]) assert.equal(ids.filter((candidate) => candidate === id).length, 1, id);
});

test('redirects include the exact nine direct consolidation rules and total 60 unique sources', async () => {
  const module = await import(pathToFileURL(path.join(projectRoot, 'redirects.mjs')).href);
  assert.equal(module.redirects.length, 60);
  assert.equal(new Set(module.redirects.map(({from}) => from)).size, 60);
  for (const mapping of redirectChanges) {
    assert.deepEqual(module.redirects.find(({from}) => from === mapping.from), mapping);
  }
  const sources = new Set(module.redirects.map(({from}) => from));
  for (const {from, to} of module.redirects) {
    assert.notEqual(from, to);
    assert.equal(sources.has(new URL(to, 'https://docs.releem.com').pathname), false, `${from} creates a redirect chain`);
  }
});

test('public docs contain no links to retired Linux routes', async () => {
  const files = await listMarkdown(path.join(projectRoot, 'docs'));
  const retiredRoutes = [
    '/installation',
    '/installation/linux-automatic',
    '/installation/installation-methods/linux-manual',
    '/supported-databases/postgresql/install-on-linux',
  ];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const targets = [...source.matchAll(/(?<!!)\[[^\]\n]+\]\(([^\s)>]+)[^)]*\)/gu)]
      .map((match) => match[1]);
    for (const target of targets) {
      const url = new URL(target, 'https://docs.releem.com');
      assert.equal(retiredRoutes.includes(url.pathname), false, `${path.relative(projectRoot, file)}: ${target}`);
    }
  }
});
