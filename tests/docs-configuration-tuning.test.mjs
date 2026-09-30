import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {
  configurationTuningRoute,
  expectedConfigurationTuningSidebar,
  expectedConfigurationTuningVisibleLabels,
} from './fixtures/configuration-tuning-contract.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const tuningRoot = path.join(
  projectRoot,
  'docs/recommendations/configuration-tuning',
);
const redirectsPath = path.join(projectRoot, 'redirects.mjs');
const migrationManifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-12-configuration-tuning-migration.json',
);

const mysqlPlatforms = [
  'linux',
  'windows',
  'docker',
  'aws-rds',
  'gcp-cloud-sql',
];
const mysqlPlatformLabels = [
  'Linux',
  'Windows',
  'Docker',
  'AWS RDS',
  'GCP Cloud SQL',
];
const mysqlProcedureInventory = {
  linux: {
    sourceSha256: '41ee6807eca2b59e2781d802671bfda5860970006493730b09a78fb2112e1df8',
    headings: {
      'copy-recommended-configuration': /## Step 1: Copy Recommended Configuration to MySQL configuration folder/iu,
      'restart-mysql': /## Step 2: Restart MySQL to apply configuration/iu,
      'verify-applied-configuration': /## Step 3: Verify the Applied Configuration/iu,
    },
    actions: {
      'agent-output-path': /Releem Agent[^\n]*\/opt\/releem\/conf\/z_aiops_mysql\.cnf/iu,
      'mysql-configuration-directory': /\/etc\/mysql\/conf\.d\//u,
      'centos-configuration-directory': /\/etc\/my\.cnf\.d\//u,
      'restart-database-service': /service mysqld restart/u,
      'contact-releem-support': /contact[^\n]*Releem support/iu,
    },
    warnings: {
      'centos-uses-alternate-directory': /CentOS[^\n]*\/etc\/my\.cnf\.d\//iu,
    },
    commands: {
      'copy-generated-configuration': /cp \/opt\/releem\/conf\/z_aiops_mysql\.cnf \/etc\/mysql\/conf\.d\//u,
      'restart-mysqld': /service mysqld restart/u,
    },
    expectedResults: {
      'releem-applied-event': /Applied recommended configuration[^\n]*MySQL Metrics graph/iu,
    },
    excludedItems: [
      {
        id: 'mysql-5-6-redo-log-relocation',
        reason: 'unsafe redo-log relocation procedure',
        sourceItems: [
          'MySQL 5.6.7 or earlier special case',
          'SET GLOBAL innodb_fast_shutdown = 1',
          'service mysql stop',
          'mv /var/lib/mysql/ib_logfile[01] /tmp',
          'service mysql start',
        ],
      },
    ],
  },
  windows: {
    sourceSha256: 'a32b4a3b2569de31cc5206b3455aed16ac8ef87c034f301ece7b44ff4f5ba9aa',
    headings: {
      'before-you-begin': /## Before you begin/iu,
      'copy-recommended-configuration': /## Step 1: Copy the Recommended Configuration/iu,
      'modify-my-ini': /## Step 2: Modify the my\.ini File/iu,
      'restart-mysql-service': /## Step 3: Restart the MySQL Database Service/iu,
      'verify-applied-configuration': /## Step 4: Verify the Applied Configuration/iu,
    },
    actions: {
      'open-releem-dashboard': /Log in to the \*\*Releem dashboard\*\*/iu,
      'open-recommended-configuration': /Open \*\*Configuration\*\*[^\n]*Recommended Configuration/iu,
      'copy-dashboard-configuration': /Click the \*\*Copy\*\* icon/iu,
      'locate-my-ini': /C:\\Program Files\\MySQL[^\n]*my\.ini/iu,
      'locate-programdata-my-ini': /C:\\ProgramData\\MySQL\\my\.ini/iu,
      'paste-at-file-end': /Paste[^\n]*at the end of the file/iu,
      'save-as-ansi': /Save[^\n]*ANSI charset/iu,
      'select-ansi-encoding': /Encoding[^\n]*select \*\*ANSI\*\*/iu,
      'open-services': /Win \+ R[^\n]*services\.msc/iu,
      'find-mysql-service': /Find the MySQL service/iu,
      'restart-selected-service': /Right-click[^\n]*Restart/iu,
      'contact-releem-support': /contact[^\n]*Releem support/iu,
    },
    warnings: {
      'confirm-active-my-ini': /Do not continue[^\n]*confirmed[^\n]*my\.ini/iu,
      'review-settings-before-save': /check them again before you save/iu,
    },
    commands: {
      'windows-services-console': /services\.msc/u,
    },
    expectedResults: {
      'releem-applied-event': /Configuration was applied successfully[^\n]*MySQL Metrics graph/iu,
    },
    excludedItems: [],
  },
  docker: {
    sourceSha256: '82fcee6da8675d5b7ffbae4e039ac165ee498f3d600b786b745a916bf6165cb2',
    headings: {
      'copy-recommended-configuration': /## Step 1: Copy the Recommended Configuration/iu,
      'modify-my-cnf': /## Step 2: Modify the my\.cnf file/iu,
      'restart-container': /## Step 3: Restart Docker container/iu,
      'verify-applied-configuration': /## Step 4: Verify the Applied Configuration/iu,
    },
    actions: {
      'open-releem-dashboard': /Log in to the Releem dashboard/iu,
      'open-recommended-configuration': /Open \*\*Configuration\*\*[^\n]*Recommended Configuration/iu,
      'copy-dashboard-configuration': /Click the \*\*Copy\*\* icon/iu,
      'identify-active-my-cnf': /Identify[^\n]*my\.cnf[^\n]*target MySQL container/iu,
      'paste-at-file-end': /Paste[^\n]*at the end of that file/iu,
      'restart-target-container': /docker restart <container_name_or_id>/u,
      'contact-releem-support': /contact[^\n]*Releem support/iu,
    },
    warnings: {
      'confirm-container-target': /confirm[^\n]*<container_name_or_id>[^\n]*MySQL container/iu,
    },
    commands: {
      'restart-container': /docker restart <container_name_or_id>/u,
    },
    expectedResults: {
      'releem-applied-event': /Applied recommended configuration[^\n]*MySQL Metrics graph/iu,
    },
    excludedItems: [],
  },
  'aws-rds': {
    sourceSha256: '12b6a7723ef8bc630b2bd3ce67f6134675f0dcca05516d3415b3a76191e6690f',
    headings: {
      'modify-parameter-group': /## Step 1: Modify the Parameter Group in AWS RDS/iu,
      'assign-parameter-group': /## Step 2: Apply the Parameter Group to Your RDS Instance/iu,
      'reboot-instance': /## Step 3: Reboot the RDS Instance/iu,
      'verify-applied-configuration': /## Step 4: Verify the Applied Configuration/iu,
    },
    actions: {
      'record-assigned-group-and-values': /record the parameter group[^\n]*current parameter values/iu,
      'open-aws-console': /Log in to the AWS Management Console/iu,
      'open-rds-dashboard': /Navigate to the RDS Dashboard/iu,
      'open-parameter-groups': /Select \*\*Parameter Groups\*\*/iu,
      'edit-parameter-group': /Select your parameter group[^\n]*Edit Parameters/iu,
      'update-recommended-parameters': /Update the parameters[^\n]*recommended configuration/iu,
      'save-parameter-changes': /Save the changes/iu,
      'select-database-instance': /select your database instance/iu,
      'modify-database-instance': /Click on the \*\*Modify\*\* button/iu,
      'choose-parameter-group': /select the updated parameter group/iu,
      'choose-application-timing': /apply the changes immediately[^\n]*next maintenance window/iu,
      'reboot-rds-instance': /Actions[^\n]*Reboot/iu,
      'contact-releem-support': /contact[^\n]*Releem support/iu,
    },
    warnings: {
      'record-is-not-reversal-guarantee': /Recording it does not guarantee[^\n]*reversed/iu,
      'coordinate-reboot-timing': /Coordinate the reboot[^\n]*application timing/iu,
    },
    commands: {},
    expectedResults: {
      'releem-applied-event': /Applied recommended configuration[^\n]*MySQL Metrics graph/iu,
    },
    excludedItems: [],
  },
  'gcp-cloud-sql': {
    sourceSha256: 'dd89dc8c16c6b45af5b98b5a0ab39ce65fedf38241fff674392b61fa6de6164f',
    headings: {
      'get-recommended-configuration': /## Step 1: Get the Recommended Configuration/iu,
      'configure-database-flags': /## Step 2: Configure Database Flags in GCP Cloud SQL/iu,
      'apply-changes': /## Step 3: Apply the Changes/iu,
      'verify-applied-configuration': /## Step 4: Verify the Applied Configuration/iu,
      'confirm-cloud-flags': /### Confirm the flags in Google Cloud/iu,
      'verify-releem-event': /### Verify the application event in Releem/iu,
    },
    actions: {
      'choose-application-timing': /decide whether to apply the changes immediately[^\n]*next maintenance window/iu,
      'open-releem-dashboard': /Log in to the Releem dashboard/iu,
      'open-recommended-configuration': /Open \*\*Configuration\*\*[^\n]*Recommended Configuration/iu,
      'review-dashboard-flags': /Review[^\n]*recommended parameters[^\n]*database flags/iu,
      'open-google-cloud-console': /Log in to the \*\*Google Cloud Console\*\*/iu,
      'open-cloud-sql-instances': /Navigate to the \*\*Cloud SQL Instances\*\* page/iu,
      'select-project': /Select the project[^\n]*Cloud SQL instance/iu,
      'select-mysql-instance': /Click on your MySQL instance name/iu,
      'edit-instance': /Click the \*\*Edit\*\* button/iu,
      'open-flags-section': /Scroll down to the \*\*Flags\*\* section/iu,
      'add-or-update-flags': /(?:Add item|modify an existing flag)/iu,
      'save-flag-changes': /Click \*\*Save\*\*/iu,
      'wait-for-restart': /Wait for the instance[^\n]*restart process/iu,
      'confirm-flags-applied': /Database flags[^\n]*confirm the flags have been applied/iu,
      'contact-releem-support': /contact[^\n]*Releem support/iu,
    },
    warnings: {
      'provider-may-restart': /Cloud SQL may automatically restart[^\n]*if required/iu,
      'flags-persist-until-removed': /flags are persisted[^\n]*until you manually remove them/iu,
      'some-flags-require-restart': /Some flags may require[^\n]*restarted/iu,
    },
    commands: {},
    expectedResults: {
      'cloud-flags-applied': /confirm the flags have been applied/iu,
      'releem-applied-event': /Applied recommended configuration[^\n]*MySQL Metrics graph/iu,
    },
    excludedItems: [],
  },
};
const retiredManualSources = mysqlPlatforms.map(
  (platform) =>
    `docs/recommendations/configuration-tuning/apply-manually/${platform}.md`,
);
const expectedRetiredProcedureManifest = mysqlPlatforms.map((platform) => {
  const contract = mysqlProcedureInventory[platform];
  return {
    sourcePath:
      `docs/recommendations/configuration-tuning/apply-manually/${platform}.md`,
    sourceSha256: contract.sourceSha256,
    destination: {
      route: `${configurationTuningRoute}/apply-manually/mysql`,
      tab: platform,
    },
    preservedItems: Object.fromEntries(
      ['headings', 'actions', 'warnings', 'commands', 'expectedResults'].map(
        (group) => [group, Object.keys(contract[group])],
      ),
    ),
    excludedItems: contract.excludedItems,
  };
});
const expectedDocuments = [
  ['mysql-tuning-process.md', 'mysql-tuning-process', `${configurationTuningRoute}/mysql-tuning-process`],
  ['initial-mysql-configuration.md', 'initial-mysql-configuration', `${configurationTuningRoute}/initial-mysql-configuration`],
  ['apply-configuration.md', 'apply-configuration', `${configurationTuningRoute}/apply-configuration`],
  ['apply-using-portal.md', 'apply-using-portal', `${configurationTuningRoute}/apply-using-portal`],
  ['apply-using-agent.md', 'apply-using-agent', `${configurationTuningRoute}/apply-using-agent`],
  ['apply-manually/index.md', 'index', `${configurationTuningRoute}/apply-manually`],
  ['apply-manually/mysql.md', 'mysql', `${configurationTuningRoute}/apply-manually/mysql`],
  ['apply-manually/mariadb.md', 'mariadb', `${configurationTuningRoute}/apply-manually/mariadb`],
  ['apply-manually/postgresql.md', 'postgresql', `${configurationTuningRoute}/apply-manually/postgresql`],
  ['apply-using-cron.md', 'apply-using-cron', `${configurationTuningRoute}/apply-using-cron`],
  ['rollback.md', 'rollback', `${configurationTuningRoute}/rollback`],
  ['limit-mysql-memory.md', 'limit-mysql-memory', `${configurationTuningRoute}/limit-mysql-memory`],
  ['configuration-example.md', 'configuration-example', `${configurationTuningRoute}/configuration-example`],
].map(([relativeSource, explicitId, route]) => ({
  sourcePath: `docs/recommendations/configuration-tuning/${relativeSource}`,
  explicitId,
  route,
}));

const expectedDirectRedirects = [
  ...mysqlPlatforms.map((platform) => ({
    from: `/configuration-tuning/how-to-apply-configuration-manually/${platform}`,
    to: `${configurationTuningRoute}/apply-manually/mysql?platform=${platform}`,
  })),
  ...mysqlPlatforms.map((platform) => ({
    from: `${configurationTuningRoute}/apply-manually/${platform}`,
    to: `${configurationTuningRoute}/apply-manually/mysql?platform=${platform}`,
  })),
];

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const toRepoPath = (absolutePath) =>
  path.relative(projectRoot, absolutePath).split(path.sep).join('/');

async function listMarkdown(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdown(absolutePath)));
    else if (entry.isFile() && /\.mdx?$/u.test(entry.name)) files.push(absolutePath);
  }
  return files.sort((left, right) => compare(toRepoPath(left), toRepoPath(right)));
}

function unquote(value) {
  const trimmed = value.trim();
  return ['"', "'"].includes(trimmed[0]) && trimmed.at(-1) === trimmed[0]
    ? trimmed.slice(1, -1)
    : trimmed;
}

function parseDocument(sourcePath, source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  assert.ok(match, `${sourcePath} must begin with complete front matter`);
  const field = (name) => {
    const value = match[1].match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'mu'))?.[1];
    return value ? unquote(value) : null;
  };
  const relativePath = sourcePath.slice('docs/'.length, -'.md'.length);
  const directory = path.posix.dirname(relativePath);
  const explicitId = field('id');
  const effectiveId = path.posix.join(
    directory,
    explicitId ?? path.posix.basename(relativePath),
  );
  const slug = field('slug');
  const route = slug?.startsWith('/')
    ? slug
    : `/${slug ? path.posix.join(directory, slug) : effectiveId}`;
  return {
    sourcePath,
    explicitId,
    effectiveId,
    route: route === '/' ? route : route.replace(/\/$/u, ''),
    title: field('title'),
    sidebarLabel: field('sidebar_label'),
    source,
  };
}

async function readRequired(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  assert.equal(existsSync(absolutePath), true, `Missing required file: ${relativePath}`);
  return readFile(absolutePath, 'utf8');
}

async function loadSidebars() {
  const source = await readFile(path.join(projectRoot, 'sidebars.js'), 'utf8');
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return (await import(moduleUrl)).default;
}

async function loadRedirects() {
  return import(`${pathToFileURL(redirectsPath).href}?test=${Date.now()}`);
}

function markdownRouteCount(source, route) {
  return source.split(`](${route})`).length - 1;
}

function codeFenceBodies(source) {
  return [...source.matchAll(/^\s*(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\s*\1\s*$/gmu)]
    .map((match) => match[2]);
}

function tabItems(source) {
  return [...source.matchAll(/<TabItem\b([^>]*)>([\s\S]*?)<\/TabItem>/gu)]
    .map((match) => ({
      attributes: match[1],
      body: match[2],
      value: match[1].match(/\bvalue=["']([^"']+)["']/u)?.[1],
      label: match[1].match(/\blabel=["']([^"']+)["']/u)?.[1],
    }));
}

test('Configuration Tuning has the exact task-first sidebar without duplicate document ownership', async () => {
  const sidebars = await loadSidebars();
  const recommendations = sidebars.docs.find(
    (item) => item?.type === 'category' && item.label === 'Recommendations',
  );
  assert.ok(recommendations, 'Recommendations sidebar category is missing');
  const tuning = recommendations.items.find(
    (item) => item?.type === 'category' && item.label === 'Configuration Tuning',
  );
  assert.deepEqual(tuning, expectedConfigurationTuningSidebar);

  const overviewId = 'recommendations/configuration-tuning/mysql-tuning-process';
  const serialized = JSON.stringify(tuning);
  assert.equal(serialized.split(`"id":"${overviewId}"`).length - 1, 1);
  assert.equal(
    tuning.items[0].href,
    `${configurationTuningRoute}/mysql-tuning-process`,
  );
});

test('Configuration Tuning resolves the exact visible labels, including front-matter fallbacks', async () => {
  const sidebars = await loadSidebars();
  const tuning = sidebars.docs
    .find((item) => item?.type === 'category' && item.label === 'Recommendations')
    ?.items.find(
      (item) => item?.type === 'category' && item.label === 'Configuration Tuning',
    );
  assert.ok(tuning, 'Configuration Tuning sidebar category is missing');
  const markdownFiles = await listMarkdown(tuningRoot);
  const documents = await Promise.all(
    markdownFiles.map(async (absolutePath) =>
      parseDocument(toRepoPath(absolutePath), await readFile(absolutePath, 'utf8')),
    ),
  );
  const byId = new Map(documents.map((document) => [document.effectiveId, document]));
  const byRoute = new Map(documents.map((document) => [document.route, document]));
  const visible = [];
  const visit = (item) => {
    if (typeof item === 'string') {
      const document = byId.get(item);
      assert.ok(document, `Unknown sidebar document: ${item}`);
      visible.push([item, document.sidebarLabel ?? document.title]);
      return;
    }
    if (item.type === 'doc') {
      const document = byId.get(item.id);
      assert.ok(document, `Unknown sidebar document: ${item.id}`);
      visible.push([item.id, item.label ?? document.sidebarLabel ?? document.title]);
      return;
    }
    if (item.type === 'link') {
      const document = byRoute.get(item.href);
      assert.ok(document, `Sidebar URL does not own a canonical document: ${item.href}`);
      visible.push([document.effectiveId, item.label]);
      return;
    }
    if (item.type === 'category') {
      if (item.link?.type === 'doc') visible.push([item.link.id, item.label]);
      for (const child of item.items) visit(child);
    }
  };
  visit(tuning);
  assert.deepEqual(visible, expectedConfigurationTuningVisibleLabels);
});

test('Configuration Tuning owns exactly 13 unique canonical documents and retires the five environment sources', async () => {
  const markdownFiles = await listMarkdown(tuningRoot);
  const actualPaths = markdownFiles.map(toRepoPath);
  assert.deepEqual(
    actualPaths,
    expectedDocuments.map(({sourcePath}) => sourcePath).sort(compare),
  );
  for (const retiredSource of retiredManualSources) {
    assert.equal(existsSync(path.join(projectRoot, retiredSource)), false);
  }

  const documents = await Promise.all(
    markdownFiles.map(async (absolutePath) => {
      const sourcePath = toRepoPath(absolutePath);
      return parseDocument(sourcePath, await readFile(absolutePath, 'utf8'));
    }),
  );
  assert.deepEqual(
    documents.map(({sourcePath, explicitId, route}) => ({sourcePath, explicitId, route})),
    expectedDocuments.slice().sort((left, right) => compare(left.sourcePath, right.sourcePath)),
  );
  assert.equal(new Set(documents.map(({effectiveId}) => effectiveId)).size, 13);
  assert.equal(new Set(documents.map(({route}) => route)).size, 13);
});

test('the migration manifest accounts for every replacement document and both generations of direct redirects', async () => {
  assert.equal(
    existsSync(migrationManifestPath),
    true,
    'Create .agent/analysis/2026-09-12-configuration-tuning-migration.json',
  );
  const migration = JSON.parse(await readFile(migrationManifestPath, 'utf8'));
  assert.equal(migration.schemaVersion, 1);
  assert.equal(migration.historicalPageCount, 63);
  assert.equal(migration.currentPageCount, 63);
  assert.deepEqual(migration.retiredSources, retiredManualSources);
  assert.deepEqual(
    migration.documents.map(({sourcePath, route}) => ({sourcePath, route})),
    expectedDocuments
      .filter(({sourcePath}) =>
        /\/(?:apply-configuration|apply-manually\/(?:index|mysql|mariadb|postgresql))\.md$/u.test(sourcePath),
      )
      .map(({sourcePath, route}) => ({sourcePath, route})),
  );
  assert.deepEqual(migration.directRedirects, expectedDirectRedirects);
  assert.deepEqual(migration.supportedManualPlatforms, {
    mysql: mysqlPlatforms,
    mariadb: [],
    postgresql: [],
  });
  assert.deepEqual(
    migration.retiredManualProcedures,
    expectedRetiredProcedureManifest,
    'Every retired source needs a fixed hash, destination tab, complete preserved inventory, and explicit exclusions',
  );
  assert.deepEqual(
    migration.retiredManualProcedures.flatMap(({sourcePath, excludedItems}) =>
      excludedItems.map((excludedItem) => ({sourcePath, excludedItem})),
    ),
    [
      {
        sourcePath:
          'docs/recommendations/configuration-tuning/apply-manually/linux.md',
        excludedItem: mysqlProcedureInventory.linux.excludedItems[0],
      },
    ],
    'Only the unsafe Linux redo-log relocation procedure may be excluded',
  );
});

test('Apply and Manual chooser pages link once to every direct canonical choice', async () => {
  const [apply, manual] = await Promise.all([
    readRequired('docs/recommendations/configuration-tuning/apply-configuration.md'),
    readRequired('docs/recommendations/configuration-tuning/apply-manually/index.md'),
  ]);
  for (const route of [
    `${configurationTuningRoute}/apply-using-portal`,
    `${configurationTuningRoute}/apply-using-agent`,
    `${configurationTuningRoute}/apply-manually`,
    `${configurationTuningRoute}/apply-using-cron`,
  ]) {
    assert.equal(markdownRouteCount(apply, route), 1, `Apply chooser must link once to ${route}`);
  }
  for (const database of ['mysql', 'mariadb', 'postgresql']) {
    const route = `${configurationTuningRoute}/apply-manually/${database}`;
    assert.equal(markdownRouteCount(manual, route), 1, `Manual chooser must link once to ${route}`);
  }
  assert.doesNotMatch(manual, /\?platform=/u);
});

test('all current and historical manual environment URLs redirect directly to the MySQL platform selector', async () => {
  const {redirects} = await loadRedirects();
  const actualBySource = new Map(redirects.map((redirect) => [redirect.from, redirect]));
  for (const expected of expectedDirectRedirects) {
    assert.deepEqual(actualBySource.get(expected.from), expected);
  }
  const redirectSources = new Set(redirects.map(({from}) => from));
  for (const {from, to} of expectedDirectRedirects) {
    assert.equal(from === to, false, `Redirect loop: ${from}`);
    assert.equal(
      redirectSources.has(new URL(to, 'https://docs.releem.com').pathname),
      false,
      `Redirect chain: ${from} -> ${to}`,
    );
  }
});

test('the MySQL manual page uses native query-aware tabs and preserves every evidenced platform procedure', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/apply-manually/mysql.md',
  );
  assert.match(source, /import Tabs from ['"]@theme\/Tabs['"];?/u);
  assert.match(source, /import TabItem from ['"]@theme\/TabItem['"];?/u);
  const tabsOpeningTag = source.match(/<Tabs\b[^>]*>/u)?.[0];
  assert.ok(tabsOpeningTag, 'MySQL manual page must render native Docusaurus Tabs');
  assert.match(tabsOpeningTag, /\bqueryString=["']platform["']/u);
  assert.match(tabsOpeningTag, /\bdefaultValue=["']linux["']/u);

  const tabs = tabItems(source);
  assert.deepEqual(tabs.map(({value}) => value), mysqlPlatforms);
  assert.deepEqual(tabs.map(({label}) => label), mysqlPlatformLabels);
  for (const tab of tabs) {
    const inventory = mysqlProcedureInventory[tab.value];
    for (const group of [
      'headings',
      'actions',
      'warnings',
      'commands',
      'expectedResults',
    ]) {
      for (const [item, pattern] of Object.entries(inventory[group])) {
        assert.match(
          tab.body,
          pattern,
          `The ${tab.value} tab must preserve ${group}.${item}`,
        );
      }
    }
  }
  assert.match(source, /\/supported-databases\/mysql\/required-permissions/u);
  assert.doesNotMatch(
    source,
    /\/supported-databases\/(?:mariadb|postgresql)\/required-permissions/u,
  );
  assert.doesNotMatch(
    source,
    /innodb_fast_shutdown|ib_logfile\[?01\]?|mv\s+\/var\/lib\/mysql\/ib_logfile/iu,
    'Do not republish the risky MySQL <=5.6 redo-log relocation sequence',
  );
});

for (const database of ['mariadb', 'postgresql']) {
  test(`${database} manual application fails closed without borrowing MySQL procedures`, async () => {
    const source = await readRequired(
      `docs/recommendations/configuration-tuning/apply-manually/${database}.md`,
    );
    assert.match(
      source,
      new RegExp(`/supported-databases/${database}/required-permissions`, 'u'),
    );
    assert.match(
      source,
      /manual application[^\n]*(?:(?:has|is) not|un)verified|(?:(?:has|is) not|un)verified[^\n]*manual application/iu,
      `${database} must explicitly say that manual application is unverified`,
    );
    assert.match(source, /contact Releem Support/iu);
    assert.deepEqual(codeFenceBodies(source), []);
    assert.doesNotMatch(source, /^\s*(?:```|~~~)/mu);
    assert.doesNotMatch(source, /\?platform=/u);
    assert.doesNotMatch(
      source,
      /mysqlconfigurer|\/opt\/|\/etc\/|[A-Z]:\\|\bmy\.(?:cnf|ini)\b|postgresql\.conf|ALTER SYSTEM|pg_ctl|pg_reload_conf|\bpsql\b|docker restart|(?:service|systemctl)[^\n]*(?:restart|reload)|Parameter Groups|Database Flags|apply immediately|maintenance window|GRANT (?:SUPER|SYSTEM_VARIABLES_ADMIN)|\/supported-databases\/mysql\/required-permissions/iu,
    );
    assert.doesNotMatch(source, /^##[^\n]*(?:command|configure|restart|apply (?:the )?changes)/imu);
    assert.doesNotMatch(
      source,
      /^(?:\d+\.\s+|-\s+)?(?:Run|Execute|Copy|Edit|Modify|Save|Restart|Reboot|Reload|Apply)\b/imu,
      `${database} must not expose an executable command, configuration, or restart path`,
    );
    if (database === 'postgresql') {
      assert.doesNotMatch(
        source,
        /PostgreSQL[^\n.]*(?:(?:is|remains)[^\n.]*(?:unsupported|not supported)|isn't[^\n.]*supported)|unsupported (?:database|engine)[^\n.]*PostgreSQL|(?:Releem|the (?:platform|product))[^\n.]*(?:does not|doesn't)[^\n.]*support[^\n.]*PostgreSQL/iu,
        'The unverified manual procedure must not be described as unsupported PostgreSQL',
      );
    }
  });
}

test('the Apply chooser distinguishes completion, restart-pending, effective state, health, metrics, and recovery', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/apply-configuration.md',
  );
  for (const requirement of [
    /command completion/iu,
    /restart[- ]pending/iu,
    /effective (?:database )?(?:setting|value)/iu,
    /database (?:service )?(?:health|available|running)/iu,
    /application (?:health|connectivity|errors?)/iu,
    /Releem event/iu,
    /current metrics/iu,
    /rollback (?:plan|path)/iu,
  ]) assert.match(source, requirement);
  assert.match(
    source,
    /(?:command completion|Releem event)[^\n]*(?:does not|is not)[^\n]*(?:prove|confirm)[^\n]*(?:effective|active)/iu,
  );
  for (const heading of [
    /^## Before you apply$/imu,
    /^## Restart-pending state and effective database values$/imu,
    /^## Verify database and application health$/imu,
    /^## Verify the Releem event and current metrics$/imu,
    /^## Recovery$/imu,
  ]) assert.match(source, heading);
});

test('Portal application uses canonical permissions and distinguishes no-restart from restart-required state', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/apply-using-portal.md',
  );
  assert.match(
    source,
    /self-managed[^\n]*(?:MySQL[^\n]*MariaDB|MariaDB[^\n]*MySQL)/iu,
    'Portal application must state its self-managed MySQL and MariaDB scope',
  );
  assert.match(
    source,
    /(?:MySQL[^\n]*)?AWS RDS[^\n]*GCP Cloud SQL[^\n]*Azure Database for MySQL/iu,
    'Portal application must identify its supported cloud-managed MySQL environments',
  );
  assert.match(
    source,
    /(?:does not (?:apply to|cover|support)|do not use[^\n]*for|not (?:available|documented|supported) for)[^\n]*PostgreSQL|PostgreSQL[^\n]*(?:is excluded|not covered|not supported by this method)/iu,
    'Portal application must explicitly exclude PostgreSQL',
  );
  assert.match(source, /\/supported-databases\/mysql\/required-permissions/u);
  assert.match(source, /\/supported-databases\/mariadb\/required-permissions/u);
  assert.match(source, /Apply Without Restart/u);
  assert.match(source, /Apply and Restart/u);
  assert.match(source, /(?:dynamic|without restart)[^\n]*(?:effective|active)/iu);
  assert.match(source, /(?:static|restart-required|restart required)/iu);
  assert.match(source, /verify[^\n]*(?:effective|active)[^\n]*(?:database|server)/iu);
  assert.doesNotMatch(
    source,
    /\bGRANT\b|az role assignment create|rds:ModifyDBParameterGroup|journalctl[^\n]+hello@releem\.com|approximately 12 hours/iu,
  );
});

test('each executable method owns every state check or links its exact owned chooser section', async () => {
  const methodSources = new Map(
    await Promise.all(
      [
        'docs/recommendations/configuration-tuning/apply-using-portal.md',
        'docs/recommendations/configuration-tuning/apply-using-agent.md',
        'docs/recommendations/configuration-tuning/initial-mysql-configuration.md',
        'docs/recommendations/configuration-tuning/apply-manually/mysql.md',
      ].map(async (sourcePath) => [sourcePath, await readRequired(sourcePath)]),
    ),
  );
  const chooserRoute = `${configurationTuningRoute}/apply-configuration`;
  const requirements = [
    {
      name: 'pre-change safety',
      local: /(?:review|record|back up|plan|confirm)[^\n]*(?:before you (?:begin|apply)|maintenance window|current (?:state|values?)|recommended (?:change|settings?))/iu,
      anchor: '#before-you-apply',
    },
    {
      name: 'restart-pending state',
      local: /(?:verify|confirm|check|distinguish|wait for)[^\n]*(?:restart[- ]pending|pending[^\n]*restart|restart (?:is|required)|requires?[^\n]*restart)/iu,
      anchor: '#restart-pending-state-and-effective-database-values',
    },
    {
      name: 'effective database values',
      local: /(?:verify|confirm|check)[^\n]*(?:effective|active)[^\n]*(?:database|server)[^\n]*(?:settings?|values?)|(?:verify|confirm|check)[^\n]*(?:database|server)[^\n]*(?:settings?|values?)[^\n]*(?:effective|active)/iu,
      anchor: '#restart-pending-state-and-effective-database-values',
    },
    {
      name: 'database service or instance health',
      local: /(?:verify|confirm|check)[^\n]*database (?:service|instance)[^\n]*(?:health|healthy|available|running|ready|status)/iu,
      anchor: '#verify-database-and-application-health',
    },
    {
      name: 'application connectivity or errors',
      local: /(?:verify|confirm|check|review)[^\n]*application[^\n]*(?:connectivity|connections?|errors?|health)/iu,
      anchor: '#verify-database-and-application-health',
    },
    {
      name: 'Releem event',
      local: /(?:verify|confirm|check|see)[^\n]*(?:Releem event|Applied recommended configuration|Configuration was applied successfully)/iu,
      anchor: '#verify-the-releem-event-and-current-metrics',
    },
    {
      name: 'current metrics',
      local: /(?:verify|confirm|check|review|compare)[^\n]*(?:current metrics|metrics[^\n]*(?:after|current)|MySQL Metrics graph)/iu,
      anchor: '#verify-the-releem-event-and-current-metrics',
    },
    {
      name: 'recovery',
      local: /(?:rollback|recovery) (?:plan|path)|if[^\n]*(?:apply|change|rollback)[^\n]*fails?[^\n]*(?:recover|rollback)/iu,
      anchor: '#recovery',
    },
  ];
  for (const [sourcePath, source] of methodSources) {
    for (const requirement of requirements) {
      const ownedChooserLink = `${chooserRoute}${requirement.anchor}`;
      assert.equal(
        requirement.local.test(source)
          || markdownRouteCount(source, ownedChooserLink) === 1,
        true,
        `${sourcePath} must own ${requirement.name} guidance or link once to ${ownedChooserLink}`,
      );
    }
  }
});

test('Agent application describes the shared workflow without limiting it by database engine', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/apply-using-agent.md',
  );
  const prose = source.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gmu, '');
  assert.match(prose, /self-managed database server/iu);
  assert.doesNotMatch(prose, /\b(?:MySQL|MariaDB|PostgreSQL|Percona)\b/u);
  assert.match(source, /<TabItem value=["']linux["']/u);
  assert.match(source, /<TabItem value=["']windows["']/u);
});

test('scheduled application restores setup, verification, and removal without engine-specific prose or guarantees', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/apply-using-cron.md',
  );
  const prose = source.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gmu, '');
  assert.match(source, /^## Set up a cron job$/imu);
  assert.match(source, /bash \/opt\/releem\/mysqlconfigurer\.sh -s auto/u);
  assert.match(source, /0 3 \* \* \* bash \/opt\/releem\/mysqlconfigurer\.sh -s auto/u);
  assert.match(source, /^## Verify a scheduled application$/imu);
  assert.match(source, /^## (?:Disable|Remove|Disable or remove) the (?:cron )?(?:job|schedule)/imu);
  assert.match(source, /crontab -e/u);
  assert.match(source, /crontab -l/u);
  assert.doesNotMatch(prose, /\bMySQL\b/u);
  assert.match(
    source,
    /remov(?:e|ing) (?:the )?(?:cron job|schedule)[^\n]*(?:does not|will not)[^\n]*(?:revert|roll back|undo)/iu,
  );
  assert.doesNotMatch(
    source,
    /automatic rollback|smartly revert|minimal risk|zero-touch|ensur(?:e|es|ing)[^\n]*(?:stable|operational|performance)|maintains? optimal performance|safe updates?/iu,
  );
});

test('Configuration Tuning overview describes one shared process without engine-specific prose', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/mysql-tuning-process.md',
  );
  assert.match(source, /^## How the tuning workflow works$/imu);
  assert.doesNotMatch(source, /\b(?:MySQL|MariaDB|PostgreSQL|Percona)\b/u);
});

test('context pages link directly to Configuration Tuning tasks without losing existing method links', async () => {
  const [dashboard, recommendations, faq, mysqlInstall, mariadbInstall] =
    await Promise.all([
      readRequired('docs/dashboard/overview.md'),
      readRequired('docs/recommendations/overview.md'),
      readRequired('docs/faq.md'),
      readRequired('docs/installation/mysql/linux.md'),
      readRequired('docs/installation/mariadb/linux.md'),
    ]);
  const overviewRoute = `${configurationTuningRoute}/mysql-tuning-process`;
  assert.equal(markdownRouteCount(dashboard, overviewRoute), 1);
  assert.equal(markdownRouteCount(recommendations, overviewRoute), 1);
  for (const method of ['apply-using-portal', 'apply-using-agent', 'apply-using-cron']) {
    const route = `${configurationTuningRoute}/${method}`;
    assert.equal(markdownRouteCount(faq, route), 1, `FAQ must preserve ${route}`);
  }
  const memoryRoute = `${configurationTuningRoute}/limit-mysql-memory`;
  assert.equal(markdownRouteCount(mysqlInstall, memoryRoute), 1);
  assert.equal(markdownRouteCount(mariadbInstall, memoryRoute), 0);
});

test('all 13 Configuration Tuning documents reject unsupported rollback, safety, and outcome guarantees', async () => {
  for (const document of expectedDocuments) {
    const source = await readRequired(document.sourcePath);
    assert.doesNotMatch(
      source,
      /automatic rollback|smartly revert|automatically reversible|fully restores?|exact previous state|guaranteed|zero risk|minimal risk|zero-touch|safe updates?|maintains? optimal performance|ensur(?:e|es|ing)[^\n]*(?:stable|operational|optimal performance)/iu,
      `${document.sourcePath} contains an unsupported guarantee`,
    );
  }
  const rollback = await readRequired(
    'docs/recommendations/configuration-tuning/rollback.md',
  );
  assert.match(rollback, /does not (?:guarantee|establish|define)[^\n]*(?:previous|exact|complete)/iu);
  assert.match(rollback, /If the rollback fails/u);
});

test('rollback qualifies command completion and verifies restored state with a failed-rollback recovery path', async () => {
  const source = await readRequired(
    'docs/recommendations/configuration-tuning/rollback.md',
  );
  assert.match(
    source,
    /(?:command (?:completion|success)|successful (?:command|exit)|command reports? success)[^\n]*(?:does not|is not)[^\n]*(?:prove|confirm|guarantee)[^\n]*(?:rollback|restored|effective)/iu,
  );
  assert.match(
    source,
    /(?:verify|confirm|check)[^\n]*(?:restart[- ]pending|pending[^\n]*restart|restart (?:is|required)|requires?[^\n]*restart)/iu,
  );
  assert.match(
    source,
    /(?:verify|confirm|check)[^\n]*(?:effective|active)[^\n]*(?:database|server)[^\n]*(?:settings?|values?)|(?:verify|confirm|check)[^\n]*(?:database|server)[^\n]*(?:settings?|values?)[^\n]*(?:effective|active)/iu,
  );
  assert.match(
    source,
    /(?:verify|confirm|check)[^\n]*database (?:service|instance)[^\n]*(?:health|healthy|available|running|ready|status)/iu,
  );
  assert.match(
    source,
    /(?:verify|confirm|check|review)[^\n]*application[^\n]*(?:connectivity|connections?|errors?|health)/iu,
  );
  assert.match(
    source,
    /(?:verify|confirm|check|review|compare)[^\n]*(?:current metrics|metrics[^\n]*(?:after|current))/iu,
  );
  assert.match(
    source,
    /if (?:the )?rollback fails[\s\S]{0,500}(?:Releem Agent logs|contact Releem support)[\s\S]{0,500}(?:recover|recovery|restore|manual)/iu,
  );
});

if (process.env.RELEEM_VERIFY_REDIRECT_BUILD === '1') {
  test('the production build renders new canonical pages and direct retired-route artifacts without collisions', async () => {
    const buildDirectory = path.join(projectRoot, 'build');
    assert.equal(existsSync(buildDirectory), true, 'Run the production build first');
    const canonicalArtifact = (route) =>
      path.join(buildDirectory, `${route.slice(1)}.html`);
    const redirectArtifact = (route) =>
      path.join(buildDirectory, route.slice(1), 'index.html');

    for (const document of expectedDocuments.filter(({sourcePath}) =>
      /\/(?:apply-configuration|apply-manually\/(?:index|mysql|mariadb|postgresql))\.md$/u.test(sourcePath),
    )) {
      const artifactPath = canonicalArtifact(document.route);
      assert.equal(existsSync(artifactPath), true, `Missing ${document.route} build artifact`);
      const html = await readFile(artifactPath, 'utf8');
      assert.equal(html.includes('<meta http-equiv="refresh"'), false);
      assert.ok(
        html.includes(
          `<link data-rh="true" rel="canonical" href="https://docs.releem.com${document.route}">`,
        ),
        `${document.route} must render its canonical URL`,
      );
    }

    for (const {from, to} of expectedDirectRedirects) {
      const artifactPath = redirectArtifact(from);
      assert.equal(existsSync(artifactPath), true, `Missing redirect artifact for ${from}`);
      const html = await readFile(artifactPath, 'utf8');
      assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${to}">`));
      assert.ok(html.includes(`<link rel="canonical" href="${to}" />`));
      assert.equal(
        existsSync(canonicalArtifact(from)),
        false,
        `${from} must no longer render canonical content`,
      );
    }
  });
}
