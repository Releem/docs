import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {
  mkdir,
  lstat,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath, pathToFileURL} from 'node:url';
import GithubSlugger from 'github-slugger';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const baselineManifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-01-releem-docs-structure-baseline.json',
);
const migrationMapPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-02-releem-docs-directory-mirror-map.json',
);
const redirectsPath = path.join(projectRoot, 'redirects.mjs');

const approvedRenames = {
  'docs/getting-started/schema-optimization.md':
    'docs/getting-started/schema-checks.md',
  'docs/getting-started/step-2-add-server.md':
    'docs/getting-started/connect-your-database-server.md',
  'docs/getting-started/step-3-getting-and-applying-recommendations.md':
    'docs/getting-started/configuration-tuning.md',
  'docs/getting-started/step-4-dashboard.md':
    'docs/getting-started/dashboard-overview.md',
  'docs/getting-started/step-5-health-checks.md':
    'docs/getting-started/health-checks.md',
  'docs/getting-started/step-7-weekly-reports.md':
    'docs/getting-started/reports.md',
  'docs/welcome.md': 'docs/releem-overview.md',
};
const baselineSourceByFinalPath = new Map(
  Object.entries(approvedRenames).map(([sourcePath, finalPath]) => [
    finalPath,
    sourcePath,
  ]),
);
const baselineSourcePathFor = (sourcePath) =>
  baselineSourceByFinalPath.get(sourcePath) ?? sourcePath;

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
      link: {type: 'doc', id: 'supported-databases/mysql/required-permissions'},
      items: [
        'supported-databases/postgresql/install-on-linux',
      ],
    },
    {
      type: 'category',
      label: 'Installation',
      link: {
        type: 'doc',
        id: 'installation/linux-automatic',
      },
      items: [
        {
          type: 'category',
          label: 'Installation Methods',
          items: [
            'installation/installation-methods/linux-manual',
            'installation/installation-methods/windows',
            'installation/installation-methods/docker',
            'installation/installation-methods/kubernetes',
            'installation/installation-methods/aws-rds',
            'installation/installation-methods/gcp-cloud-sql',
            'installation/installation-methods/azure-database-for-mysql',
            'installation/installation-methods/clusters',
            'installation/installation-methods/whm-cpanel',
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
        {
          type: 'doc',
          id: 'dashboard/schema-checks',
          label: 'Schema Checks',
        },
        'dashboard/deadlocks',
        'dashboard/health-checks',
        'dashboard/security-checks',
        'dashboard/process-list',
        {
          type: 'doc',
          id: 'dashboard/reports',
          label: 'Reports',
        },
      ],
    },
    {
      type: 'category',
      label: 'Recommendations',
      link: {
        type: 'doc',
        id: 'recommendations/overview',
      },
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
          link: {
            type: 'doc',
            id: 'recommendations/query-optimization/overview',
          },
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
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
  ],
};

const sha256 = (contents) =>
  createHash('sha256').update(contents).digest('hex');
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

const toRepoPath = (absolutePath) =>
  path.relative(projectRoot, absolutePath).split(path.sep).join('/');

function failIfSymbolicLink(isSymbolicLink, absolutePath) {
  if (!isSymbolicLink) return;
  throw new Error(
    `Symbolic links are forbidden in baseline-protected inventories: ${toRepoPath(absolutePath)}`,
  );
}

async function listFiles(directory, predicate = () => true) {
  failIfSymbolicLink((await lstat(directory)).isSymbolicLink(), directory);
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    failIfSymbolicLink(entry.isSymbolicLink(), absolutePath);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, predicate)));
    } else if (entry.isFile() && predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }

  return files.sort((left, right) =>
    compare(toRepoPath(left), toRepoPath(right)),
  );
}

async function listDirectories(directory) {
  failIfSymbolicLink((await lstat(directory)).isSymbolicLink(), directory);
  const entries = await readdir(directory, {withFileTypes: true});
  const directories = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    failIfSymbolicLink(entry.isSymbolicLink(), absolutePath);
    if (!entry.isDirectory()) continue;
    directories.push(absolutePath, ...(await listDirectories(absolutePath)));
  }

  return directories;
}

function findGeneratedIndexCategoryPaths(sidebars) {
  const generatedIndexPaths = [];

  function visit(items, parentPath) {
    if (!Array.isArray(items)) return;
    items.forEach((item, index) => {
      if (!item || typeof item !== 'object' || item.type !== 'category') return;
      const categoryName = String(item.label ?? item.id ?? `category[${index}]`);
      const categoryPath = [...parentPath, categoryName];
      if (item.link?.type === 'generated-index') {
        generatedIndexPaths.push(categoryPath.join(' > '));
      }
      visit(item.items, categoryPath);
    });
  }

  for (const [sidebarName, items] of Object.entries(sidebars)) {
    visit(items, [sidebarName]);
  }

  return generatedIndexPaths;
}

function ownedDocumentIds(sidebars) {
  const ids = [];

  function visit(items) {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (typeof item === 'string') {
        ids.push(item);
        continue;
      }
      if (!item || typeof item !== 'object') continue;
      if (item.type === 'doc') ids.push(item.id);
      if (item.type === 'category') {
        if (item.link?.type === 'doc') ids.push(item.link.id);
        visit(item.items);
      }
    }
  }

  for (const items of Object.values(sidebars)) visit(items);
  return ids;
}

function topLevelDocumentOwnership(sidebars) {
  const ownership = new Map();

  function record(id, owner) {
    if (!ownership.has(id)) ownership.set(id, []);
    ownership.get(id).push(owner);
  }

  function visit(items, owner) {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (typeof item === 'string') {
        record(item, owner);
        continue;
      }
      if (!item || typeof item !== 'object') continue;
      if (item.type === 'doc') record(item.id, owner);
      if (item.type === 'category') {
        if (item.link?.type === 'doc') {
          record(item.link.id, `${owner} (category link)`);
        }
        visit(item.items, owner);
      }
    }
  }

  for (const [sidebarName, items] of Object.entries(sidebars)) {
    if (!Array.isArray(items)) continue;
    items.forEach((item, index) => {
      const sectionLabel =
        item && typeof item === 'object'
          ? String(item.label ?? item.id ?? `item[${index}]`)
          : String(item);
      const owner = `${sidebarName} > ${sectionLabel}`;
      if (typeof item === 'string') {
        record(item, owner);
      } else if (item?.type === 'doc') {
        record(item.id, owner);
      } else if (item?.type === 'category') {
        if (item.link?.type === 'doc') {
          record(item.link.id, `${owner} (category link)`);
        }
        visit(item.items, owner);
      }
    });
  }

  return ownership;
}

const maskExceptNewlines = (value) => value.replace(/[^\n]/g, ' ');

function markdownProse(contents, {maskInlineCode = true} = {}) {
  let prose = contents.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, (match) =>
    maskExceptNewlines(match),
  );
  prose = prose.replace(/<!--[\s\S]*?-->/g, (match) =>
    maskExceptNewlines(match),
  );
  prose = prose.replace(/\{\/\*[\s\S]*?\*\/\}/g, (match) =>
    maskExceptNewlines(match),
  );

  const lines = prose.split(/(?<=\n)/);
  let fence = null;
  prose = lines
    .map((line) => {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})/u)?.[1];
      if (!fence && marker) {
        fence = {character: marker[0], length: marker.length};
        return maskExceptNewlines(line);
      }
      if (fence) {
        const closes = new RegExp(
          `^ {0,3}${fence.character === '`' ? '`' : '~'}{${fence.length},}\\s*$`,
          'u',
        ).test(line.trimEnd());
        if (closes) fence = null;
        return maskExceptNewlines(line);
      }
      return line;
    })
    .join('');

  return maskInlineCode
    ? prose.replace(/(`+)(?!`)([\s\S]*?)\1/g, (match) =>
        maskExceptNewlines(match),
      )
    : prose;
}

const referenceLabel = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();
const lineNumberAt = (contents, index) =>
  contents.slice(0, index).split('\n').length;

function markdownLinkReferences(contents) {
  const prose = markdownProse(contents);
  const definitions = new Map();
  const references = [];
  const occupiedRanges = [];

  for (const match of prose.matchAll(
    /^ {0,3}\[([^\]\n]+)\]:\s*(?:<([^>\n]+)>|(\S+))/gmu,
  )) {
    definitions.set(referenceLabel(match[1]), match[2] ?? match[3]);
  }

  function add(match, target) {
    if (!target) return;
    const start = match.index;
    const end = start + match[0].length;
    occupiedRanges.push([start, end]);
    references.push({
      target: target.replace(/&amp;/g, '&'),
      line: lineNumberAt(prose, start),
      index: start,
    });
  }

  for (const match of prose.matchAll(
    /(?<!!)\[[^\]\n]+\]\(\s*(?:<([^>\n]+)>|((?:\\.|[^)\s])+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/gu,
  )) {
    add(match, match[1] ?? match[2]);
  }
  for (const match of prose.matchAll(
    /(?<!!)\[([^\]\n]+)\]\[([^\]\n]*)\]/gu,
  )) {
    add(match, definitions.get(referenceLabel(match[2] || match[1])));
  }
  for (const match of prose.matchAll(
    /<a\b[^>]*\bhref\s*=\s*(?:\{\s*)?(['"])([^'"]+)\1(?:\s*\})?[^>]*>/giu,
  )) {
    add(match, match[2]);
  }
  for (const match of prose.matchAll(
    /<(https?:\/\/[^ <>]+)>/giu,
  )) {
    add(match, match[1]);
  }
  for (const match of prose.matchAll(/(?<!!)\[([^\]\n]+)\](?![\[(:])/gu)) {
    const target = definitions.get(referenceLabel(match[1]));
    const overlaps = occupiedRanges.some(
      ([start, end]) => match.index >= start && match.index < end,
    );
    if (target && !overlaps) add(match, target);
  }

  return references
    .sort((left, right) => left.index - right.index)
    .map(({target, line}) => ({target, line}));
}

function documentAnchorIds(contents) {
  const anchors = new Set();
  const slugger = new GithubSlugger();
  const prose = markdownProse(contents, {maskInlineCode: false});

  for (const match of prose.matchAll(
    /<(?:a|h[1-6])\b[^>]*\bid\s*=\s*(['"])([^'"]+)\1/giu,
  )) {
    anchors.add(match[2]);
  }
  for (const match of prose.matchAll(/^\s*#{1,6}[\t ]+(.+?)\s*#*\s*$/gmu)) {
    const headingText = match[1]
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[`*_~]/g, '')
      .replace(/&amp;/g, '&');
    anchors.add(slugger.slug(headingText));
  }

  return anchors;
}

function documentLinkInventory(documents) {
  const bySourcePath = new Map();
  const byRoute = new Map();

  for (const document of documents) {
    assert.ok(
      !bySourcePath.has(document.sourcePath),
      `Duplicate document source path: ${document.sourcePath}`,
    );
    assert.ok(!byRoute.has(document.route), `Duplicate document route: ${document.route}`);
    const entry = {
      ...document,
      anchors: documentAnchorIds(document.contents),
    };
    bySourcePath.set(document.sourcePath, entry);
    byRoute.set(document.route, entry);
  }

  return {bySourcePath, byRoute};
}

function resolvedLinkResult(target, fragment, kind) {
  if (fragment && !target.anchors.has(fragment)) {
    throw new Error(
      `Fragment #${fragment} is not present on ${target.route} (${target.sourcePath})`,
    );
  }
  return {
    targetSourcePath: target.sourcePath,
    targetRoute: target.route,
    fragment,
    kind,
  };
}

function assertCanonicalAuthoredPath(rawReference) {
  const absoluteMatch = rawReference.match(
    /^https?:\/\/[^/?#]+([^?#]*)/iu,
  );
  const authoredPath = absoluteMatch
    ? absoluteMatch[1] || '/'
    : rawReference.split(/[?#]/u, 1)[0];
  if (
    authoredPath.includes('\\') ||
    authoredPath.split('/').some((segment) => segment === '.' || segment === '..')
  ) {
    throw new Error(
      `Internal link uses a non-canonical authored path: ${authoredPath}`,
    );
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(authoredPath);
  } catch (error) {
    throw new Error(
      `Invalid percent encoding in internal link ${rawReference}: ${error.message}`,
    );
  }
  const canonicalEncodedPath = encodeURI(decodedPath).replace(
    /[?#]/gu,
    (character) => `%${character.codePointAt(0).toString(16).toUpperCase()}`,
  );
  const authoredPathWithCanonicalHexCase = authoredPath.replace(
    /%[\da-f]{2}/giu,
    (escape) => escape.toUpperCase(),
  );
  if (
    authoredPath !== decodedPath &&
    authoredPathWithCanonicalHexCase !== canonicalEncodedPath
  ) {
    throw new Error(
      `Internal link uses a non-canonical authored path: ${authoredPath}`,
    );
  }
}

function resolveInternalDocumentLink(reference, sourceDocument, inventory) {
  const rawReference = reference.trim().replace(/&amp;/g, '&');
  if (!rawReference || rawReference.startsWith('?')) return null;
  if (rawReference.startsWith('#')) {
    if (rawReference === '#') return null;
    let fragment;
    try {
      fragment = decodeURIComponent(rawReference.slice(1));
    } catch (error) {
      throw new Error(
        `Invalid percent encoding in internal link ${rawReference}: ${error.message}`,
      );
    }
    const target =
      inventory.bySourcePath.get(sourceDocument.sourcePath) ??
      inventory.byRoute.get(sourceDocument.route);
    if (!target) {
      throw new Error(
        `Current document is absent from the internal-link inventory: ${sourceDocument.sourcePath}`,
      );
    }
    return resolvedLinkResult(target, fragment, 'fragment');
  }
  if (/^(?:mailto|tel|data|javascript):/iu.test(rawReference)) return null;

  let parsedUrl;
  let internalAbsoluteUrl = false;
  if (/^https?:\/\//iu.test(rawReference)) {
    parsedUrl = new URL(rawReference);
    if (parsedUrl.hostname !== 'docs.releem.com') return null;
    if (
      parsedUrl.protocol !== 'https:' ||
      parsedUrl.port ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      throw new Error(`Internal URL depends on a redirect or alias: ${rawReference}`);
    }
    internalAbsoluteUrl = true;
  } else if (rawReference.startsWith('//')) {
    const protocolRelative = new URL(`https:${rawReference}`);
    if (protocolRelative.hostname !== 'docs.releem.com') return null;
    throw new Error(`Internal URL depends on a protocol-relative alias: ${rawReference}`);
  } else if (/^[a-z][a-z\d+.-]*:/iu.test(rawReference)) {
    return null;
  }

  assertCanonicalAuthoredPath(rawReference);

  const referenceUrl = parsedUrl ?? new URL(rawReference, 'https://docs.releem.com/');
  let pathname;
  let fragment;
  try {
    pathname = decodeURIComponent(referenceUrl.pathname);
    fragment = decodeURIComponent(referenceUrl.hash.slice(1));
  } catch (error) {
    throw new Error(`Invalid percent encoding in internal link ${rawReference}: ${error.message}`);
  }

  if (/\.mdx?$/iu.test(pathname)) {
    let sourcePath;
    if (internalAbsoluteUrl || rawReference.startsWith('/')) {
      sourcePath = pathname.startsWith('/docs/')
        ? pathname.slice(1)
        : `docs${pathname}`;
    } else {
      let relativeSourcePath;
      try {
        relativeSourcePath = decodeURIComponent(rawReference.split(/[?#]/u, 1)[0]);
      } catch (error) {
        throw new Error(
          `Invalid percent encoding in internal link ${rawReference}: ${error.message}`,
        );
      }
      sourcePath = path.posix.join(
        path.posix.dirname(sourceDocument.sourcePath),
        relativeSourcePath,
      );
    }
    sourcePath = path.posix.normalize(sourcePath);
    if (!sourcePath.startsWith('docs/')) {
      throw new Error(`Source-file link escapes docs/: ${rawReference}`);
    }
    const target = inventory.bySourcePath.get(sourcePath);
    if (!target) {
      throw new Error(
        `Source-file link does not resolve to a current Markdown/MDX document: ${sourcePath}`,
      );
    }
    return resolvedLinkResult(target, fragment, 'source');
  }

  const routeUrl = parsedUrl
    ? parsedUrl
    : new URL(rawReference, `https://docs.releem.com${sourceDocument.route}`);
  let route;
  try {
    route = decodeURIComponent(routeUrl.pathname);
  } catch (error) {
    throw new Error(`Invalid percent encoding in internal link ${rawReference}: ${error.message}`);
  }
  const target = inventory.byRoute.get(route);
  if (!target) {
    const withoutTrailingSlash =
      route.length > 1 && route.endsWith('/') ? route.slice(0, -1) : route;
    if (inventory.byRoute.has(withoutTrailingSlash)) {
      throw new Error(`Internal link uses a non-canonical route alias: ${route}`);
    }
    throw new Error(`Internal route is absent from the immutable baseline: ${route}`);
  }
  return resolvedLinkResult(target, fragment, 'route');
}

async function loadSidebars() {
  const sidebarSource = await readFile(
    path.join(projectRoot, 'sidebars.js'),
    'utf8',
  );
  const sidebarModuleUrl = `data:text/javascript;base64,${Buffer.from(
    sidebarSource,
  ).toString('base64')}`;
  const {default: sidebars} = await import(sidebarModuleUrl);
  return sidebars;
}

async function loadDocusaurusConfig() {
  const configPath = path.join(projectRoot, 'docusaurus.config.js');
  const configSource = await readFile(configPath, 'utf8');
  const prismImportPattern = /(['"])prism-react-renderer\1/g;
  const prismImports = configSource.match(prismImportPattern) ?? [];
  assert.equal(
    prismImports.length,
    1,
    'docusaurus.config.js must contain exactly one prism-react-renderer import for deterministic evaluation',
  );
  const prismPackageDirectory = path.join(
    projectRoot,
    'node_modules/prism-react-renderer',
  );
  const prismPackage = JSON.parse(
    await readFile(path.join(prismPackageDirectory, 'package.json'), 'utf8'),
  );
  assert.equal(
    typeof prismPackage.module,
    'string',
    'prism-react-renderer must declare an ESM module for config evaluation',
  );
  const prismModuleUrl = pathToFileURL(
    path.join(prismPackageDirectory, prismPackage.module),
  ).href;
  const executableConfigSource = configSource.replace(
    prismImportPattern,
    JSON.stringify(prismModuleUrl),
  ).replace(
    /(['"])\.\/redirects\.mjs\1/g,
    JSON.stringify(pathToFileURL(redirectsPath).href),
  );
  const configModuleUrl = `data:text/javascript;base64,${Buffer.from(
    executableConfigSource,
  ).toString('base64')}`;
  const {default: docusaurusConfig} = await import(configModuleUrl);
  assert.ok(
    docusaurusConfig && typeof docusaurusConfig === 'object',
    'docusaurus.config.js must default-export a configuration object',
  );
  return docusaurusConfig;
}

function routingFromDocusaurusConfig(docusaurusConfig) {
  assert.equal(
    typeof docusaurusConfig.baseUrl,
    'string',
    'docusaurus.config.js baseUrl must be an explicit string',
  );
  assert.equal(
    typeof docusaurusConfig.trailingSlash,
    'boolean',
    'docusaurus.config.js trailingSlash must be an explicit boolean',
  );
  assert.ok(
    Array.isArray(docusaurusConfig.presets),
    'docusaurus.config.js presets must be an array',
  );
  const classicPresets = docusaurusConfig.presets.filter(
    (preset) => Array.isArray(preset) && preset[0] === 'classic',
  );
  assert.equal(
    classicPresets.length,
    1,
    'docusaurus.config.js must contain exactly one classic preset',
  );
  const routeBasePath = classicPresets[0][1]?.docs?.routeBasePath;
  assert.equal(
    typeof routeBasePath,
    'string',
    'docusaurus.config.js classic docs routeBasePath must be an explicit string',
  );

  return {
    baseUrl: docusaurusConfig.baseUrl,
    routeBasePath,
    trailingSlash: docusaurusConfig.trailingSlash,
  };
}

function assertRoutingMatchesManifest(routing, baselineRouting) {
  assert.equal(
    routing.baseUrl,
    baselineRouting?.baseUrl,
    'docusaurus.config.js baseUrl changed; every published URL prefix would drift',
  );
  assert.equal(
    routing.routeBasePath,
    baselineRouting?.routeBasePath,
    'docusaurus.config.js docs routeBasePath changed; every documentation route would drift',
  );
  assert.equal(
    routing.trailingSlash,
    baselineRouting?.trailingSlash,
    'docusaurus.config.js trailingSlash changed; canonical published URLs would drift',
  );
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
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, `${sourcePath} must start with a complete front-matter block`);

  const normalizedFrontMatter = match[1].replace(/\r\n?/g, '\n');
  const normalizedBody = text.slice(match[0].length).replace(/\r\n?/g, '\n');
  const relativeDocumentPath = sourcePath.slice('docs/'.length, -'.md'.length);
  const directory = path.posix.dirname(relativeDocumentPath);
  const idMatch = normalizedFrontMatter.match(/^id:\s*(.+?)\s*$/m);
  const slugMatch = normalizedFrontMatter.match(/^slug:\s*(.+?)\s*$/m);
  const localId = idMatch
    ? unquoteYamlScalar(idMatch[1])
    : path.posix.basename(relativeDocumentPath);
  const effectiveId =
    directory === '.' ? localId : path.posix.join(directory, localId);
  const explicitSlug = slugMatch ? unquoteYamlScalar(slugMatch[1]) : null;
  const route = explicitSlug?.startsWith('/')
    ? explicitSlug
    : `/${explicitSlug ? path.posix.join(directory, explicitSlug) : effectiveId}`;

  return {
    normalizedFrontMatter,
    normalizedBody,
    explicitId: idMatch ? unquoteYamlScalar(idMatch[1]) : null,
    explicitSlug,
    effectiveId,
    route: route === '/' ? route : route.replace(/\/$/, ''),
  };
}

function stripMigrationFrontMatter(frontMatter) {
  return frontMatter
    .split('\n')
    .filter((line) => !/^(?:id|slug):/u.test(line))
    .join('\n');
}

function reverseDeclaredBodyChanges(body, record) {
  const replacements = [
    ...record.allowedInternalLinkReplacements,
    ...record.allowedRelativeAssetReplacements,
  ].sort((left, right) => right.to.length - left.to.length);
  const placeholders = [];
  let reversed = body;

  replacements.forEach((replacement, index) => {
    const placeholder = `\u0000RELEEM_STRUCTURE_TOKEN_${index}\u0000`;
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

function reverseMigratedDocument(contents, record) {
  const text = contents.toString('utf8');
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u);
  assert.ok(match, `${record.finalSource} must have front matter`);
  const body = reverseDeclaredBodyChanges(text.slice(match[0].length), record);
  return `---\n${record.originalFrontMatter}\n---\n${body}`;
}

function referencedImagePaths(sourcePath, contents) {
  const text = markdownProse(contents.toString('utf8'));
  const references = [];
  const patterns = [
    /require\(\s*(['"])([^'"]+)\1\s*\)/g,
    /!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/g,
    /<img\b[^>]*\bsrc\s*=\s*(['"])([^'"]+)\1/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const reference = match[2] ?? match[1];
      if (!reference || /^(?:[a-z]+:|#|data:)/i.test(reference)) continue;
      let cleanReference;
      try {
        cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
      } catch (error) {
        throw new Error(
          `Invalid percent encoding in local image ${reference} (${sourcePath}): ${error.message}`,
        );
      }
      const resolvedPath = cleanReference.startsWith('/')
        ? path.posix.join('static', cleanReference)
        : path.posix.normalize(
            path.posix.join(path.posix.dirname(sourcePath), cleanReference),
          );
      if (!/^(?:assets\/images|static\/img)\//u.test(resolvedPath)) {
        throw new Error(
          `Local image path escapes approved asset roots: ${reference} -> ${resolvedPath} (${sourcePath})`,
        );
      }
      references.push(resolvedPath);
    }
  }

  return [...new Set(references)].sort(compare);
}

async function currentDocuments() {
  const migrationMap = await migrationMapPromise;
  const migrationByFinalSource = new Map(
    migrationMap.records.map((record) => [record.finalSource, record]),
  );
  const markdownFiles = await listFiles(
    path.join(projectRoot, 'docs'),
    (filePath) => /\.mdx?$/.test(filePath),
  );

  return Promise.all(
    markdownFiles.map(async (absolutePath) => {
      const sourcePath = toRepoPath(absolutePath);
      const migrationRecord = migrationByFinalSource.get(sourcePath);
      assert.ok(migrationRecord, `Migration map is missing ${sourcePath}`);
      const baselineSourcePath = baselineSourcePathFor(
        migrationRecord.currentSource,
      );
      const contents = await readFile(absolutePath);
      const parsed = parseDocument(sourcePath, contents);
      const images = await Promise.all(
        referencedImagePaths(sourcePath, contents).map(async (imagePath) => {
          const absoluteImagePath = path.join(projectRoot, imagePath);
          let imageContents;
          try {
            imageContents = await readFile(absoluteImagePath);
          } catch (error) {
            assert.fail(
              `Referenced local image is missing: ${imagePath} (${sourcePath})\n${error.message}`,
            );
          }
          return {path: imagePath, sha256: sha256(imageContents)};
        }),
      );

      return {
        sourcePath,
        baselineSourcePath,
        migrationRecord,
        sha256: sha256(contents),
        frontMatterSha256: sha256(parsed.normalizedFrontMatter),
        bodySha256: sha256(parsed.normalizedBody),
        nonMigrationFrontMatter: stripMigrationFrontMatter(
          parsed.normalizedFrontMatter,
        ),
        reversedBodySha256: sha256(
          reverseDeclaredBodyChanges(parsed.normalizedBody, migrationRecord),
        ),
        restoredWholeFileSha256: sha256(
          reverseMigratedDocument(contents, migrationRecord),
        ),
        explicitId: parsed.explicitId,
        explicitSlug: parsed.explicitSlug,
        effectiveId: parsed.effectiveId,
        route: parsed.route,
        images,
      };
    }),
  );
}

async function currentAssets() {
  const assetFiles = (
    await Promise.all(
      ['assets/images', 'static/img'].map((directory) =>
        listFiles(path.join(projectRoot, directory)),
      ),
    )
  ).flat();

  return Promise.all(
    assetFiles.map(async (absolutePath) => ({
      path: toRepoPath(absolutePath),
      sha256: sha256(await readFile(absolutePath)),
    })),
  );
}

const manifestPromise = readFile(baselineManifestPath, 'utf8').then(JSON.parse);
const migrationMapPromise = readFile(migrationMapPath, 'utf8').then(JSON.parse);

const packageJson = JSON.parse(
  await readFile(path.join(projectRoot, 'package.json'), 'utf8'),
);
const packageLock = JSON.parse(
  await readFile(path.join(projectRoot, 'package-lock.json'), 'utf8'),
);

test('package and lockfile pin the same Docusaurus 3.9.2 family', () => {
  const productionPackages = [
    '@docusaurus/core',
    '@docusaurus/plugin-client-redirects',
    '@docusaurus/preset-classic',
    '@docusaurus/theme-search-algolia',
  ];
  const developmentPackages = [
    '@docusaurus/module-type-aliases',
    '@docusaurus/types',
  ];
  const actual = Object.fromEntries(
    [...productionPackages, ...developmentPackages].map((packageName) => {
      const dependencyGroup = productionPackages.includes(packageName)
        ? 'dependencies'
        : 'devDependencies';

      return [
        packageName,
        {
          packageRoot: packageJson[dependencyGroup]?.[packageName],
          lockRoot: packageLock.packages[''][dependencyGroup]?.[packageName],
          resolvedLockEntry:
            packageLock.packages[`node_modules/${packageName}`]?.version,
        },
      ];
    }),
  );
  const expected = Object.fromEntries(
    [...productionPackages, ...developmentPackages].map((packageName) => [
      packageName,
      {
        packageRoot: '3.9.2',
        lockRoot: '3.9.2',
        resolvedLockEntry: '3.9.2',
      },
    ]),
  );

  assert.deepEqual(actual, expected);
  assert.equal(packageJson.engines?.node, '>=20.0');
  assert.equal(packageLock.packages[''].engines?.node, '>=20.0');
});

test('routing inspector extracts site and docs route configuration', () => {
  const fixture = {
    baseUrl: '/product/',
    trailingSlash: true,
    presets: [
      [
        'classic',
        {
          docs: {routeBasePath: 'reference'},
        },
      ],
    ],
  };

  assert.deepEqual(routingFromDocusaurusConfig(fixture), {
    baseUrl: '/product/',
    routeBasePath: 'reference',
    trailingSlash: true,
  });
});

test('Docusaurus routing configuration matches the immutable baseline', async () => {
  const [manifest, docusaurusConfig] = await Promise.all([
    manifestPromise,
    loadDocusaurusConfig(),
  ]);
  const routing = routingFromDocusaurusConfig(docusaurusConfig);
  assertRoutingMatchesManifest(routing, manifest.routing);
});

test('baseline manifest records exactly 54 unique documents, routes, IDs, and approved renames', async () => {
  const manifest = await manifestPromise;
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.expectedPageCount, 54);
  assert.deepEqual(manifest.routing, {
    baseUrl: '/',
    routeBasePath: '/',
    trailingSlash: false,
  });
  assert.equal(manifest.documents.length, 54);
  assert.deepEqual(manifest.approvedRenames, approvedRenames);
  assert.equal(new Set(manifest.documents.map(({sourcePath}) => sourcePath)).size, 54);
  assert.equal(new Set(manifest.documents.map(({effectiveId}) => effectiveId)).size, 54);
  assert.equal(new Set(manifest.documents.map(({route}) => route)).size, 54);
  assert.deepEqual(
    manifest.routes,
    manifest.documents.map(({route}) => route).sort(compare),
  );
  assert.deepEqual(
    Object.fromEntries(
      manifest.documents
        .filter(({renamedPath}) => renamedPath !== null)
        .map(({sourcePath, renamedPath}) => [sourcePath, renamedPath]),
    ),
    approvedRenames,
  );
  const assetByPath = new Map(
    manifest.assets.map((asset) => [asset.path, asset.sha256]),
  );
  for (const document of manifest.documents) {
    for (const image of document.images) {
      assert.equal(
        assetByPath.get(image.path),
        image.sha256,
        `${document.sourcePath} image ${image.path} must be present with the same hash in the asset inventory`,
      );
    }
  }
});

// Superseded by the exception-aware whole-content gate in docs-preservation.test.mjs.
test.skip('approved directory mirror preserves the corpus and establishes the seven-section sidebar', async () => {
  const [manifest, migrationMap, documents, sidebars] = await Promise.all([
    manifestPromise,
    migrationMapPromise,
    currentDocuments(),
    loadSidebars(),
  ]);
  const expectedFinalPaths = migrationMap.records
    .map(({finalSource}) => finalSource)
    .sort(compare);
  const finalByPath = new Map(
    documents.map((document) => [document.sourcePath, document]),
  );
  const baselineByPostRestructurePath = new Map(
    manifest.documents.map((document) => [
      document.renamedPath ?? document.sourcePath,
      document,
    ]),
  );

  assert.equal(migrationMap.records.length, 54);
  assert.deepEqual(
    documents.map(({sourcePath}) => sourcePath),
    expectedFinalPaths,
    'Every approved mirrored destination is required',
  );
  for (const record of migrationMap.records) {
    const document = finalByPath.get(record.finalSource);
    const baseline = baselineByPostRestructurePath.get(record.currentSource);
    assert.ok(document, `${record.finalSource} must exist in the final corpus`);
    assert.ok(baseline, `${record.currentSource} must exist in the baseline`);
    assert.equal(
      document.restoredWholeFileSha256,
      record.originalWholeFileSha256,
      `${record.finalSource} must reverse to the original complete-file hash`,
    );
    assert.equal(
      record.originalWholeFileSha256,
      baseline.sha256,
      `${record.currentSource} migration hash must match the immutable baseline`,
    );
    assert.equal(
      document.nonMigrationFrontMatter,
      stripMigrationFrontMatter(record.originalFrontMatter),
      `${record.finalSource} changed non-migration front matter`,
    );
    assert.equal(
      document.reversedBodySha256,
      record.originalBodySha256,
      `${record.finalSource} changed body content beyond declared tokens`,
    );
    assert.equal(document.explicitId, record.finalExplicitId);
    assert.equal(document.explicitSlug, record.finalSlug);
    assert.equal(document.effectiveId, record.finalId);
    assert.equal(
      document.route,
      record.finalRoute,
      `${record.finalSource} must use its approved canonical route`,
    );
  }

  const expectedFinalIds = migrationMap.records
    .map(({finalId}) => finalId)
    .sort(compare);
  const actualFinalIds = documents
    .map(({effectiveId}) => effectiveId)
    .sort(compare);
  assert.deepEqual(actualFinalIds, expectedFinalIds);
  assert.deepEqual(
    documents.map(({route}) => route).sort(compare),
    migrationMap.records.map(({finalRoute}) => finalRoute).sort(compare),
  );

  assert.deepEqual(sidebars, expectedFinalSidebar);
  assert.equal(sidebars.docs.length, 7);
  const ownedIds = ownedDocumentIds(sidebars);
  assert.equal(ownedIds.length, 54);
  assert.equal(new Set(ownedIds).size, 54);
  assert.deepEqual([...ownedIds].sort(compare), expectedFinalIds);
});

// Superseded by the exception-aware whole-content gate in docs-preservation.test.mjs.
test.skip('approved final source paths reverse to complete immutable byte hashes', async () => {
  const [migrationMap, documents] = await Promise.all([
    migrationMapPromise,
    currentDocuments(),
  ]);
  assert.equal(documents.length, 54);
  assert.deepEqual(
    documents.map(({sourcePath}) => sourcePath),
    migrationMap.records.map(({finalSource}) => finalSource).sort(compare),
    'Only the 54 approved mirrored Markdown destinations are allowed',
  );
  const recordByFinalPath = new Map(
    migrationMap.records.map((record) => [record.finalSource, record]),
  );
  for (const document of documents) {
    assert.equal(
      document.restoredWholeFileSha256,
      recordByFinalPath.get(document.sourcePath).originalWholeFileSha256,
      `${document.sourcePath} must reverse to its complete original byte hash`,
    );
  }
});

// Superseded by the exception-aware whole-content gate in docs-preservation.test.mjs.
test.skip('non-migration front matter and reversed bodies match immutable hashes', async () => {
  const [migrationMap, documents] = await Promise.all([
    migrationMapPromise,
    currentDocuments(),
  ]);
  const recordByFinalPath = new Map(
    migrationMap.records.map((record) => [record.finalSource, record]),
  );
  for (const document of documents) {
    const record = recordByFinalPath.get(document.sourcePath);
    assert.equal(
      document.nonMigrationFrontMatter,
      stripMigrationFrontMatter(record.originalFrontMatter),
      `${document.sourcePath} changed non-migration front matter`,
    );
    assert.equal(
      document.reversedBodySha256,
      record.originalBodySha256,
      `${document.sourcePath} body must match after reversing declared migration tokens`,
    );
  }
});

test('current effective IDs and complete 54-route set match the migration map', async () => {
  const [manifest, migrationMap, documents, docusaurusConfig] = await Promise.all([
    manifestPromise,
    migrationMapPromise,
    currentDocuments(),
    loadDocusaurusConfig(),
  ]);
  assertRoutingMatchesManifest(
    routingFromDocusaurusConfig(docusaurusConfig),
    manifest.routing,
  );
  assert.equal(new Set(documents.map(({effectiveId}) => effectiveId)).size, 54);
  assert.equal(new Set(documents.map(({route}) => route)).size, 54);
  for (const document of documents) {
    const record = document.migrationRecord;
    assert.equal(
      document.effectiveId,
      record.finalId,
      `${document.sourcePath} effective document ID must match the migration map`,
    );
    assert.equal(
      document.route,
      record.finalRoute,
      `${document.sourcePath} public route must match the migration map`,
    );
  }
  assert.deepEqual(
    [...new Set(documents.map(({route}) => route))].sort(compare),
    migrationMap.records.map(({finalRoute}) => finalRoute).sort(compare),
  );
});

test('every referenced local image exists and matches the page baseline', async () => {
  const [manifest, documents] = await Promise.all([
    manifestPromise,
    currentDocuments(),
  ]);
  const baselineByPath = new Map(
    manifest.documents.map((document) => [document.sourcePath, document]),
  );
  for (const document of documents) {
    assert.deepEqual(
      document.images,
      baselineByPath.get(document.baselineSourcePath).images,
      `${document.sourcePath} referenced local images must match ${document.baselineSourcePath}`,
    );
  }
});

test('all existing image and static paths and byte hashes exactly match the baseline', async () => {
  const [manifest, assets] = await Promise.all([
    manifestPromise,
    currentAssets(),
  ]);
  assert.deepEqual(
    assets.map(({path: assetPath}) => assetPath),
    manifest.assets.map(({path: assetPath}) => assetPath),
    'All assets/images and static/img paths must exactly match the baseline',
  );
  const baselineByPath = new Map(
    manifest.assets.map((asset) => [asset.path, asset]),
  );
  for (const asset of assets) {
    assert.equal(
      asset.sha256,
      baselineByPath.get(asset.path).sha256,
      `${asset.path} complete-file SHA-256 must match the baseline`,
    );
  }
});

test('individual Security Check and Schema Check directory trees do not exist', async () => {
  const directories = (await listDirectories(path.join(projectRoot, 'docs'))).map(
    toRepoPath,
  );
  const forbidden = directories.filter((directory) =>
    /^docs\/(?:.*\/)?checks\/(?:security|schema)(?:\/|$)/i.test(directory),
  );
  assert.deepEqual(forbidden, []);
});

test('generated-index traversal detects nested computed category links', () => {
  const computedLinkType = `generated-${'index'}`;
  const nestedSidebar = {
    docs: [
      {
        type: 'category',
        label: 'Outer',
        items: [
          {
            type: 'category',
            label: 'Inner',
            link: {type: computedLinkType},
            items: [],
          },
        ],
      },
    ],
  };

  assert.deepEqual(findGeneratedIndexCategoryPaths(nestedSidebar), [
    'docs > Outer > Inner',
  ]);
});

test('file inventory fails closed on symbolic-link files', async (t) => {
  const fixture = await mkdtemp(
    path.join(tmpdir(), 'releem-docs-file-symlink-'),
  );
  try {
    const inventoryRoot = path.join(fixture, 'inventory');
    await mkdir(inventoryRoot);
    await writeFile(path.join(fixture, 'target.md'), '# target\n');
    try {
      await symlink(
        '../target.md',
        path.join(inventoryRoot, 'linked.md'),
        'file',
      );
    } catch (error) {
      if (['EACCES', 'ENOSYS', 'EPERM'].includes(error.code)) {
        t.diagnostic(`Symlink creation unavailable: ${error.code}`);
        t.skip(`Symlink creation unavailable: ${error.code}`);
        return;
      }
      throw error;
    }

    await assert.rejects(
      listFiles(inventoryRoot),
      /Symbolic links are forbidden.*linked\.md/,
    );
  } finally {
    await rm(fixture, {recursive: true, force: true});
  }
});

test('directory inventory fails closed on symbolic-link directories', async (t) => {
  const fixture = await mkdtemp(
    path.join(tmpdir(), 'releem-docs-directory-symlink-'),
  );
  try {
    const inventoryRoot = path.join(fixture, 'inventory');
    await mkdir(inventoryRoot);
    await mkdir(path.join(fixture, 'target-directory'));
    try {
      await symlink(
        '../target-directory',
        path.join(inventoryRoot, 'linked-directory'),
        'dir',
      );
    } catch (error) {
      if (['EACCES', 'ENOSYS', 'EPERM'].includes(error.code)) {
        t.diagnostic(`Symlink creation unavailable: ${error.code}`);
        t.skip(`Symlink creation unavailable: ${error.code}`);
        return;
      }
      throw error;
    }

    await assert.rejects(
      listDirectories(inventoryRoot),
      /Symbolic links are forbidden.*linked-directory/,
    );
  } finally {
    await rm(fixture, {recursive: true, force: true});
  }
});

test('sidebars contain no generated-index category link', async () => {
  const sidebars = await loadSidebars();
  const generatedIndexPaths = findGeneratedIndexCategoryPaths(sidebars);
  assert.deepEqual(
    generatedIndexPaths,
    [],
    `Generated-index category links are forbidden: ${generatedIndexPaths.join(', ')}`,
  );
});

test('top-level ownership includes category links and reports cross-section duplicates', () => {
  const fixture = {
    docs: [
      {
        type: 'category',
        label: 'First',
        link: {type: 'doc', id: 'first-overview'},
        items: ['shared', {type: 'doc', id: 'first-item'}],
      },
      {
        type: 'category',
        label: 'Second',
        items: ['shared', 'second-item'],
      },
    ],
  };

  assert.deepEqual(
    [...topLevelDocumentOwnership(fixture).entries()],
    [
      ['first-overview', ['docs > First (category link)']],
      ['shared', ['docs > First', 'docs > Second']],
      ['first-item', ['docs > First']],
      ['second-item', ['docs > Second']],
    ],
  );
});

test('Markdown link extraction ignores code and images while covering inline, reference, HTML, and autolinks', () => {
  const markdown = [
    '[Inline](/inline)',
    '[Reference][guide]',
    '[Collapsed][]',
    '<a href="/html">HTML</a>',
    '<https://docs.releem.com/absolute>',
    '![Image](/img/example.png)',
    '`[Inline code](/ignored-inline)`',
    '```md',
    '[Fenced code](/ignored-fence)',
    '```',
    '[guide]: ../guide.md#section',
    '[collapsed]: /collapsed',
  ].join('\n');

  assert.deepEqual(
    markdownLinkReferences(markdown).map(({target}) => target),
    [
      '/inline',
      '../guide.md#section',
      '/collapsed',
      '/html',
      'https://docs.releem.com/absolute',
    ],
  );
});

test('internal link resolution accepts canonical routes and source files but rejects aliases and absent fragments', () => {
  const documents = [
    {
      sourcePath: 'docs/guide/start.md',
      route: '/guide/start',
      contents: '# Start\n',
    },
    {
      sourcePath: 'docs/guide/reference.md',
      route: '/reference',
      contents: '# Reference\n\n## Exact Section\n',
    },
  ];
  const inventory = documentLinkInventory(documents);

  assert.deepEqual(
    resolveInternalDocumentLink(
      'reference.md#exact-section',
      documents[0],
      inventory,
    ),
    {
      targetSourcePath: 'docs/guide/reference.md',
      targetRoute: '/reference',
      fragment: 'exact-section',
      kind: 'source',
    },
  );
  assert.deepEqual(
    resolveInternalDocumentLink('/reference', documents[0], inventory),
    {
      targetSourcePath: 'docs/guide/reference.md',
      targetRoute: '/reference',
      fragment: '',
      kind: 'route',
    },
  );
  assert.equal(
    resolveInternalDocumentLink('mailto:hello@releem.com', documents[0], inventory),
    null,
  );
  assert.throws(
    () => resolveInternalDocumentLink('/reference/', documents[0], inventory),
    /non-canonical route alias.*\/reference\//,
  );
  assert.throws(
    () =>
      resolveInternalDocumentLink(
        '/reference#missing-section',
        documents[0],
        inventory,
      ),
    /fragment.*missing-section.*not present/i,
  );
});

test('same-document hash links resolve against local anchors and reject missing fragments', () => {
  const document = {
    sourcePath: 'docs/guide/start.md',
    route: '/guide/start',
    contents: '# Start\n\n## Local Section\n',
  };
  const inventory = documentLinkInventory([document]);

  assert.deepEqual(
    resolveInternalDocumentLink('#local-section', document, inventory),
    {
      targetSourcePath: 'docs/guide/start.md',
      targetRoute: '/guide/start',
      fragment: 'local-section',
      kind: 'fragment',
    },
  );
  assert.throws(
    () =>
      resolveInternalDocumentLink(
        '#missing-local-section',
        document,
        inventory,
      ),
    /fragment.*missing-local-section.*not present/i,
  );
});

test('public route links reject normalization aliases but allow canonical percent encoding', () => {
  const documents = [
    {
      sourcePath: 'docs/guide/start.md',
      route: '/guide/start',
      contents: '# Start\n',
    },
    {
      sourcePath: 'docs/guide/reference.md',
      route: '/guide/reference',
      contents: '# Guide Reference\n',
    },
    {
      sourcePath: 'docs/reference.md',
      route: '/reference',
      contents: '# Reference\n',
    },
    {
      sourcePath: 'docs/cafe.md',
      route: '/café',
      contents: '# Café\n',
    },
  ];
  const inventory = documentLinkInventory(documents);

  assert.deepEqual(
    resolveInternalDocumentLink('/caf%C3%A9', documents[0], inventory),
    {
      targetSourcePath: 'docs/cafe.md',
      targetRoute: '/café',
      fragment: '',
      kind: 'route',
    },
  );
  assert.deepEqual(
    resolveInternalDocumentLink('/caf%c3%a9', documents[0], inventory),
    {
      targetSourcePath: 'docs/cafe.md',
      targetRoute: '/café',
      fragment: '',
      kind: 'route',
    },
  );
  for (const alias of [
    '/guide/../reference',
    './reference',
    '/%72eference',
    'https://docs.releem.com/guide/../reference',
  ]) {
    assert.throws(
      () => resolveInternalDocumentLink(alias, documents[0], inventory),
      /non-canonical authored path/i,
      alias,
    );
  }
});

test('local image resolution rejects paths that escape approved asset roots', () => {
  assert.throws(
    () =>
      referencedImagePaths(
        'docs/guide/page.md',
        Buffer.from('![escape](../../../outside.png)'),
      ),
    /Local image path escapes approved asset roots/,
  );
});

test('local image extraction ignores metadata, comments, and code but preserves prose MDX assets', () => {
  const markdown = [
    '---',
    'example: "![front matter](/img/front-matter.png)"',
    '---',
    '<!-- ![HTML comment](/img/html-comment.png) -->',
    '{/* <img src="/img/jsx-comment.png" /> */}',
    '`require("../../assets/images/inline-code.png")`',
    '```mdx',
    '![Fenced Markdown](/img/fenced-markdown.png)',
    '<img src={require("../../assets/images/fenced-require.png").default} />',
    '```',
    '![Prose Markdown](../../assets/images/real-markdown.png)',
    '<img src="/img/real-html.png" />',
    '<img src={require("../../assets/images/real-require.png").default} />',
  ].join('\n');

  assert.deepEqual(
    referencedImagePaths('docs/guide/page.md', Buffer.from(markdown)),
    [
      'assets/images/real-markdown.png',
      'assets/images/real-require.png',
      'static/img/real-html.png',
    ],
  );
});

test('all 54 final documents have one top-level owner and no cross-section ownership', async () => {
  const [migrationMap, documents, sidebars] = await Promise.all([
    migrationMapPromise,
    currentDocuments(),
    loadSidebars(),
  ]);
  const expectedFinalIds = migrationMap.records
    .map(({finalId}) => finalId)
    .sort(compare);
  const currentIds = documents.map(({effectiveId}) => effectiveId).sort(compare);
  const ownership = topLevelDocumentOwnership(sidebars);
  const duplicateOwnership = [...ownership]
    .filter(([, owners]) => owners.length !== 1)
    .map(([id, owners]) => `${id}: ${owners.join(' | ')}`);

  assert.deepEqual(currentIds, expectedFinalIds);
  assert.deepEqual(
    [...ownership.keys()].sort(compare),
    expectedFinalIds,
    'Every final document, including category-link documents, must be sidebar-owned',
  );
  assert.deepEqual(
    duplicateOwnership,
    [],
    `Documents cannot be owned by multiple top-level sections:\n${duplicateOwnership.join('\n')}`,
  );
  assert.equal(
    [...ownership.values()].flat().length,
    54,
    'Category-link and item documents together must provide exactly 54 ownership entries',
  );
});

test('every internal Markdown and MDX link resolves directly to a canonical route or current source file', async () => {
  const [migrationMap, documents] = await Promise.all([
    migrationMapPromise,
    currentDocuments(),
  ]);
  const documentsWithContents = await Promise.all(
    documents.map(async (document) => ({
      ...document,
      contents: await readFile(path.join(projectRoot, document.sourcePath), 'utf8'),
    })),
  );
  const inventory = documentLinkInventory(documentsWithContents);
  const failures = [];
  let internalLinkCount = 0;

  assert.deepEqual(
    [...inventory.byRoute.keys()].sort(compare),
    migrationMap.records.map(({finalRoute}) => finalRoute).sort(compare),
    'Internal public links must resolve against the canonical migration routes',
  );
  for (const document of documentsWithContents) {
    for (const reference of markdownLinkReferences(document.contents)) {
      try {
        const resolved = resolveInternalDocumentLink(
          reference.target,
          document,
          inventory,
        );
        if (resolved) internalLinkCount += 1;
      } catch (error) {
        failures.push(
          `${document.sourcePath}:${reference.line} ${reference.target} - ${error.message}`,
        );
      }
    }
  }

  assert.ok(internalLinkCount > 0, 'Expected at least one internal document link');
  assert.deepEqual(
    failures,
    [],
    `Broken, aliased, or fragment-invalid internal links:\n${failures.join('\n')}`,
  );
});

test('mirrored documents resolve every image from the final source location without path or hash drift', async () => {
  const [manifest, migrationMap, documents] = await Promise.all([
    manifestPromise,
    migrationMapPromise,
    currentDocuments(),
  ]);
  const baselineByPath = new Map(
    manifest.documents.map((document) => [document.sourcePath, document]),
  );
  const finalByPath = new Map(
    documents.map((document) => [document.sourcePath, document]),
  );

  for (const record of migrationMap.records) {
    const baselinePath = baselineSourcePathFor(record.currentSource);
    const finalPath = record.finalSource;
    assert.deepEqual(
      finalByPath.get(finalPath)?.images,
      baselineByPath.get(baselinePath)?.images,
      `${finalPath} must resolve its Markdown, HTML/MDX, and require(...) images exactly as ${baselinePath}`,
    );
  }
});
