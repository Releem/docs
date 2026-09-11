import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-03-committed-content-preservation.json',
);
const consolidationPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-03-linux-installation-consolidation.json',
);
const engineFirstManifestPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-10-engine-first-installation-manifest.json',
);
const engineFirstExcludedInstructionsPath = path.join(
  projectRoot,
  '.agent/analysis/2026-09-10-engine-first-excluded-instructions.md',
);
const baselineRevision = '9ad7ce3';
const expectedPageCount = 54;
const expectedAssetCount = 31;
const consolidation = JSON.parse(await readFile(consolidationPath, 'utf8'));
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
const engineFirstSourceRevision = 'ab7e49710584ad1ba2355e7a0cb230a309559f85';
const engineFirstSourceHashes = new Map([
  ['docs/installation/linux.md', '1c68450ef9e4054d9c80562aebe9e0ba7479e245f7f31737d292f98a50bae8d9'],
  ['docs/installation/installation-methods/windows.md', '8cf658fa7aae2b065e477eeca22656bd6eb59cecfb63d60ac47dba729ec951d4'],
  ['docs/installation/installation-methods/docker.md', 'b67c1fd5936e721872bfcffc4d72626449173e11363e383b7f45a275a977887f'],
  ['docs/installation/installation-methods/kubernetes.md', '2f41a1a0d228fb7ad3ab48c7bc1a4abd7e4bea81c5ec906ed10e5271c3c55301'],
  ['docs/installation/installation-methods/aws-rds.md', '3436cb8ec254d1c36bfdc7eea54fbf8ddac21473d3046797670393ac5f30ea7f'],
  ['docs/installation/installation-methods/gcp-cloud-sql.md', '91ade7bc6967459bdbaa20554b17dc4abf9784ae5231d33b70b500f4137e0996'],
  ['docs/installation/installation-methods/azure-database-for-mysql.md', '191ad5acf5ca429ab9c894685d478a72e82d2f9b59a1aa72a99dbbcfc14ebcff'],
  ['docs/installation/installation-methods/clusters.md', 'fc3d81f17c42ce6dd3cd6e06911683d9471a3a43332b377cd1ba885178f43359'],
  ['docs/installation/installation-methods/whm-cpanel.md', 'c4ac9b5ab7bf8f10e3f7c7c24518d060b23fd9043b8e8acefd05122566714882'],
]);
const expectedLifecycleSafetyExclusions = [
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/uninstall.md',
    fenceIndex: 0,
    baselineLineNumber: 19,
    baselineLanguage: 'bash',
    baselineContentSha256: 'fbff726cdc416fff663f6f4fb292372605db35028c24dd87f01597d57536ef5f',
  },
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/uninstall.md',
    fenceIndex: 3,
    baselineLineNumber: 43,
    baselineLanguage: 'powershell',
    baselineContentSha256: '5d1bc55c5faf02d4cf3201ba27024d6db9f5dea701164a61c73700c339fa5d35',
  },
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/update.md',
    fenceIndex: 0,
    baselineLineNumber: 21,
    baselineLanguage: 'bash',
    baselineContentSha256: 'd61ac3810bc8c1bf1a512fb1905794d0bcc03bd506f917d8273a25f0276f7dfc',
  },
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/update.md',
    fenceIndex: 1,
    baselineLineNumber: 44,
    baselineLanguage: 'bash',
    baselineContentSha256: 'f8b0a7a453c882a45703ed39e338ca2982624ef095f1531f1d866fd858521791',
  },
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/update.md',
    fenceIndex: 2,
    baselineLineNumber: 51,
    baselineLanguage: 'bash',
    baselineContentSha256: 'a60dadb0bcb9d4fb47671ccd5d432515c694c33c7acbb8f5e465efffeb25b692',
  },
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/update.md',
    fenceIndex: 3,
    baselineLineNumber: 56,
    baselineLanguage: 'bash',
    baselineContentSha256: 'c4b856a5e7c84b7ca7585b598778c8ca9abbd34e4572ba7659ca31ec118050bb',
  },
];
const expectedLifecycleSafetyRewrites = [
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/migrate.md',
    fenceIndex: 0,
    baselineLineNumber: 32,
    baselineLanguage: 'bash',
    baselineContentSha256: '2d3f7b021aa6a4d36dda516aae738aa210ef195592ac110d391680eeb907300d',
    currentContentSha256: 'ded3a05271babfba4903449c56691bb684f69687d24c2cd620621ed2af0c4bfa',
  },
  {
    pageSourcePath: 'docs/installation/manage-the-releem-agent/configuration.md',
    fenceIndex: 0,
    baselineLineNumber: 15,
    baselineLanguage: 'ini',
    baselineContentSha256: '636caa167d53b5277bd3f962426031c53f3df68ffe49cd4a8147011dc2ec9609',
    currentContentSha256: '3a87cec17ba71b5794f03f5f1ad41822f3a7e4d526b7ae2cd745deeff8933067',
  },
];
const lifecycleSourceOverlayHashes = new Map([
  [
    'docs/installation/manage-the-releem-agent/configuration.md',
    '965db46d90cbe9cdd3d56e02c5553efe1b2369a64da848409c5e212177f63579',
  ],
  [
    'docs/installation/manage-the-releem-agent/migrate.md',
    'f6f27112f2cc73c2c5c46523061352a1a70c335dce2763d5ca8bbc95241e0937',
  ],
  [
    'docs/installation/manage-the-releem-agent/uninstall.md',
    'edfa5f0aa38b41052bc59d0c787b45427e45fa8db97f2d29edb59d5ea103ec5e',
  ],
  [
    'docs/installation/manage-the-releem-agent/update.md',
    'e5584078175e4f0c9380b072c0620eea6544be95cc2175cf7d69e59b518852c2',
  ],
]);
const retiredSources = new Set([
  ...consolidation.retiredSources,
  ...engineFirstRetiredSources,
]);
const rewrittenSources = new Set(consolidation.rewrittenSources);

const engineFirstConnectLinkChanges = [
  {
    from: '- [MySQL on Linux: Automatic installation](/installation/mysql/linux#automatic-installation) – Create the database user during installation.',
    to: '- [MySQL on Linux Server: Automatic Agent Installation (Linux)](/installation/linux?database=mysql#mysql-automatic-installation) – Automatic installation for MySQL instances running on Linux-based servers.',
  },
  {
    from: '- [MySQL on Linux: Manual installation](/installation/mysql/linux#manual-installation) – Use an existing monitoring account.',
    to: "- [MySQL on Linux Server: Advanced Agent Installation](/installation/linux?database=mysql#mysql-manual-installation) – Manual installation for MySQL instances running on Linux-based servers. Use this guide if you don't have a MySQL root user, or if MySQL is installed on a different IP address, or if you want to create a Releem user manually.",
  },
  {
    from: '- [MariaDB on Linux: Automatic installation](/installation/mariadb/linux#automatic-installation) – Create the database user during installation.',
    to: '- [MariaDB on Linux Server: Automatic Agent Installation](/installation/linux?database=mariadb#mariadb-automatic-installation) – Automatic installation for MariaDB instances running on Linux-based servers.',
  },
  {
    from: '- [MariaDB on Linux: Manual installation](/installation/mariadb/linux#manual-installation) – Use an existing monitoring account.',
    to: '- [MariaDB on Linux Server: Manual Agent Installation](/installation/linux?database=mariadb#mariadb-manual-installation) – Manual installation for MariaDB instances when a DBA creates the monitoring account.',
  },
  {
    from: '- [PostgreSQL on Linux: Automatic installation](/installation/postgresql/linux#automatic-installation) – Create the database user during installation.',
    to: '- [PostgreSQL on Linux Server: Automatic Agent Installation](/installation/linux?database=postgresql#postgresql-automatic-installation) – Automatic database-user creation for PostgreSQL instances running on Linux-based servers.',
  },
  {
    from: '- [PostgreSQL on Linux: Manual installation](/installation/postgresql/linux#manual-installation) – Use an existing monitoring account.',
    to: '- [PostgreSQL on Linux Server: Manual Agent Installation](/installation/linux?database=postgresql#postgresql-manual-installation) – Manual installation for PostgreSQL instances running on Linux-based servers.',
  },
  {
    from: '- [MySQL on WHM/cPanel](/installation/mysql/whm-cpanel) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [WHM/cPanel](/installation/installation-methods/whm-cpanel) – Recommended installation path for database servers managed through WHM/cPanel.',
  },
  {
    from: '- [MySQL in Docker](/installation/mysql/docker) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [MySQL on Linux Server: Manual Installation in Docker](/installation/installation-methods/docker) – Manual installation for MySQL instances running in Docker containers.',
  },
  {
    from: '- [MariaDB in Docker](/installation/mariadb/docker) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: null,
  },
  {
    from: '- [MySQL on Windows](/installation/mysql/windows) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [Self-Managed Server (Windows)](/installation/installation-methods/windows) – For MySQL instances running on Windows.',
  },
  {
    from: '- [MariaDB on Windows](/installation/mariadb/windows) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: null,
  },
  {
    from: '- [MySQL on AWS RDS](/installation/mysql/aws-rds) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [MySQL on AWS RDS: CloudFormation installation](/installation/installation-methods/aws-rds) – For managed MySQL databases hosted on AWS.',
  },
  {
    from: '- [MySQL on GCP Cloud SQL](/installation/mysql/gcp-cloud-sql) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [MySQL on GCP Cloud SQL: Manual installation](/installation/installation-methods/gcp-cloud-sql) – For managed MySQL databases hosted on GCP.',
  },
  {
    from: '- [Azure Database for MySQL](/installation/mysql/azure-database-for-mysql) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [Azure Database for MySQL](/installation/installation-methods/azure-database-for-mysql) – For managed MySQL databases hosted on Azure.',
  },
  {
    from: '- [MariaDB in Kubernetes](/installation/mariadb/kubernetes) – **Procedure unavailable.** The page explains how to request the current procedure.',
    to: '- [MySQL in Kubernetes](/installation/installation-methods/kubernetes) – If your MySQL instance is deployed in a Kubernetes cluster.',
  },
  {
    from: '- [MySQL clusters](/installation/mysql/clusters) or [MariaDB clusters](/installation/mariadb/clusters) – Install one Agent for each database node.',
    to: null,
  },
];

const engineFirstExistingDocumentChanges = new Map([
  [
    'docs/get-started/connect-your-database-server.md',
    engineFirstConnectLinkChanges,
  ],
  [
    'docs/get-started/troubleshoot-releem-agent.md',
    [
      {
        from: 'The WHM/cPanel installation procedure is currently unavailable. Do not re-run or remove the module from an incomplete procedure. Contact Releem Support for the current installation or recovery steps, then use the [MySQL WHM/cPanel page](/installation/mysql/whm-cpanel) to verify the Agent status and current metrics.',
        to: 'If your server is managed through WHM/cPanel, use the [WHM/cPanel installation guide](/installation/installation-methods/whm-cpanel) for setup-specific troubleshooting, including how to verify that cPanel MySQL auto-adjust settings are disabled.',
      },
      {
        from: '[Troubleshoot MySQL on AWS RDS](/installation/mysql/aws-rds#troubleshooting)',
        to: '[Common issues for AWS RDS](/installation/installation-methods/aws-rds#common-issues-for-aws-rds)',
      },
    ],
  ],
  [
    'docs/installation/manage-the-releem-agent/migrate.md',
    [
      {
        from: '1. Review the [uninstall guide](/installation/manage-the-releem-agent/uninstall) and contact Releem Support for the current source-server removal procedure.',
        to: '1. Uninstall Releem Agent from Source Server using the following [guide](/installation/manage-the-releem-agent/uninstall)',
      },
      {
        from: '2. [Choose an installation guide](/installation) for the destination server and install the Releem Agent.',
        to: '2. Install Releem Agent on Destination Server',
      },
      {
        from: 'To preserve the Dashboard identity used by historical metrics, record the exact hostname shown for the old server. In the destination server\'s canonical one-step Linux command, add this environment-variable line immediately before the `curl` line:\n\n```bash\nexport RELEEM_HOSTNAME="[OLD_SERVER_HOSTNAME]"\n```\n\nReplace `[OLD_SERVER_HOSTNAME]` with the exact recorded Dashboard hostname. After installation, confirm that the expected server identity is shown and that current metrics arrive. If a duplicate server appears or history is not associated as expected, stop and contact Releem Support before removing either record.',
        to: 'If you want to maintain the historical metrics and continue from where you left off, install the agent with the same hostname as the old server. \nTo do that just add the following variable to the installation command:\n\n```bash\n--hostname="OLD_SERVER_HOSTNAME"\n```\n\nReplace `OLD_SERVER_HOSTNAME` with your previous server\'s hostname (e.g., "db1.example.com").',
        literal: true,
      },
      {
        from: 'If you need assistance with the migration process, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.\n',
        to: 'If you need assistance with the migration process, please contact our support team via the chat in the [Releem Dashboard](https://app.releem.com) or email us at hello@releem.com.',
        literal: true,
      },
    ],
  ],
  [
    'docs/supported-databases/mysql/required-permissions.md',
    [
      {
        from: '\n## Continue installation\n\nChoose a supported environment on the [MySQL installation page](/installation/mysql).\n',
        to: '',
        literal: true,
      },
    ],
  ],
  [
    'docs/supported-databases/mariadb/required-permissions.md',
    [
      {
        from: '\n## Continue installation\n\nChoose a supported environment on the [MariaDB installation page](/installation/mariadb).\n',
        to: '',
        literal: true,
      },
    ],
  ],
  [
    'docs/supported-databases/postgresql/required-permissions.md',
    [
      {
        from: 'Use this page with the [PostgreSQL Linux installation guide](/installation/postgresql/linux). Releem supports PostgreSQL 15–18. Install the `postgresql-contrib` package that matches the server version before enabling `pg_stat_statements`.',
        to: 'Use this page with the [PostgreSQL Linux installation tab](/installation/linux?database=postgresql#postgresql-installation). Releem supports PostgreSQL 15–18. Install the `postgresql-contrib` package that matches the server version before enabling `pg_stat_statements`.',
      },
      {
        from: 'Return to [Install Releem for PostgreSQL on Linux](/installation/postgresql/linux) and choose automatic or manual account creation.',
        to: 'Return to [Install Releem Agent on Linux](/installation/linux?database=postgresql#postgresql-installation) and choose automatic or manual account creation.',
      },
    ],
  ],
]);

function reverseEngineFirstLinks(text, sourcePath) {
  const lifecycleSourceHash = lifecycleSourceOverlayHashes.get(sourcePath);
  if (lifecycleSourceHash) {
    assert.equal(
      sha256(text),
      lifecycleSourceHash,
      `${sourcePath} changed beyond the exact lifecycle safety overlay`,
    );
    return execFileSync(
      'git',
      ['show', `${engineFirstSourceRevision}:${sourcePath}`],
      {cwd: projectRoot, encoding: 'utf8'},
    );
  }
  let restored = text;
  for (const change of engineFirstExistingDocumentChanges.get(sourcePath) ?? []) {
    const currentValue = change.literal ? change.from : `${change.from}\n`;
    const restoredValue = change.literal
      ? change.to
      : change.to
        ? `${change.to}\n`
        : '';
    assert.equal(
      restored.split(currentValue).length - 1,
      1,
      `${sourcePath} must contain the exact engine-first integration change once`,
    );
    restored = restored.replace(currentValue, restoredValue);
  }
  return restored;
}

function reverseConsolidationLinks(text, sourcePath) {
  let restored = reverseEngineFirstLinks(text, sourcePath);
  const additions = consolidation.internalLinkAdditions
    .filter((addition) => addition.sourcePath === sourcePath);
  for (const addition of additions) {
    const insertedLine = `${addition.content}\n`;
    assert.equal(restored.split(insertedLine).length - 1, 1);
    restored = restored.replace(insertedLine, '');
  }
  const replacements = consolidation.internalLinkReplacements
    .filter((replacement) => replacement.sourcePath === sourcePath)
    .sort((left, right) => right.to.length - left.to.length);
  for (const replacement of replacements) {
    assert.equal(restored.split(replacement.to).length - 1, replacement.occurrences);
    restored = restored.split(replacement.to).join(replacement.from);
  }
  return restored;
}

const sha256 = (value) =>
  createHash('sha256').update(value).digest('hex');
const normalizeLineEndings = (value) => value.replace(/\r\n?/gu, '\n');
const lineNumberAt = (text, offset) =>
  text.slice(0, offset).split('\n').length;

function unquoteYamlScalar(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  return quote && quote === trimmed.at(-1) && ['"', "'"].includes(quote)
    ? trimmed.slice(1, -1)
    : trimmed;
}

function frontMatterValue(frontMatter, key) {
  const match = frontMatter.match(
    new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'mu'),
  );
  return match ? unquoteYamlScalar(match[1]) : null;
}

function parseCodeFences(text) {
  const lines = text.split('\n');
  const codeFences = [];
  const fencedLineNumbers = new Set();
  const fencedContentLineNumbers = new Set();

  for (let index = 0; index < lines.length; index += 1) {
    const opening = lines[index].match(/^\s*(`{3,}|~{3,})(.*)$/u);
    if (!opening) continue;
    const markerCharacter = opening[1][0];
    const markerLength = opening[1].length;
    let closingIndex = index + 1;
    while (
      closingIndex < lines.length &&
      !new RegExp(`^\\s*${markerCharacter}{${markerLength},}\\s*$`, 'u').test(
        lines[closingIndex],
      )
    ) {
      closingIndex += 1;
    }
    assert.ok(
      closingIndex < lines.length,
      `Unclosed code fence at line ${index + 1}`,
    );
    for (let line = index + 1; line <= closingIndex + 1; line += 1) {
      fencedLineNumbers.add(line);
    }
    for (let line = index + 2; line <= closingIndex; line += 1) {
      fencedContentLineNumbers.add(line);
    }
    const info = opening[2].trim();
    const content = lines.slice(index + 1, closingIndex).join('\n');
    codeFences.push({
      index: codeFences.length,
      lineNumber: index + 1,
      openingLine: lines[index],
      closingLine: lines[closingIndex],
      language: info ? info.split(/\s+/u)[0] : null,
      info,
      contentSha256: sha256(content),
    });
    index = closingIndex;
  }

  return {codeFences, fencedLineNumbers, fencedContentLineNumbers};
}

function codeFenceBodies(text) {
  return [...text.matchAll(/^\s*(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\s*\1\s*$/gmu)]
    .map((match) => match[2]);
}

function h2Sections(text) {
  const headings = [...text.matchAll(/^## .+$/gmu)];
  return headings.map((heading, index) =>
    text.slice(heading.index, headings[index + 1]?.index ?? text.length).trim());
}

const frozenUnbracketedSensitivePlaceholders = [
  'your-name-space-mariadb-primary-0',
  'your-name-space-mariadb-secondary-0',
  'change to your API key',
  'change to your password',
  'your_root_password',
  'New-Password-Here',
  'your-name-space',
  'your-db-service',
  'your_api_key',
  'your-passw',
  'your-user',
  'your-key',
];

function normalizeRedactedHistoricalFence(text) {
  let normalized = text
    .replace(/\[[^\]\n]+\]/gu, '[REDACTED]')
    .replace(/\$\{[^}\n]+\}/gu, '[REDACTED]')
    .replaceAll('YOUR_API_KEY', '[REDACTED]');
  for (const literal of frozenUnbracketedSensitivePlaceholders) {
    normalized = normalized.replaceAll(literal, '[REDACTED]');
  }
  return normalized;
}

function withoutCodeFences(text) {
  const {fencedLineNumbers} = parseCodeFences(text);
  return text
    .split('\n')
    .filter((_, index) => !fencedLineNumbers.has(index + 1))
    .join('\n');
}

function withoutCodeFenceContents(text) {
  const {fencedContentLineNumbers} = parseCodeFences(text);
  return text
    .split('\n')
    .filter((_, index) => !fencedContentLineNumbers.has(index + 1))
    .join('\n');
}

function resolveAssetPath(sourcePath, reference) {
  const cleanReference = reference.split(/[?#]/u)[0];
  if (cleanReference.startsWith('/img/')) return `static${cleanReference}`;
  if (!cleanReference.includes('assets/images/')) return null;
  return path.posix.normalize(
    path.posix.join(path.posix.dirname(sourcePath), cleanReference),
  );
}

function parseImages(sourcePath, text, fencedLineNumbers) {
  const images = [];
  const markdownImage = /!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/gu;
  for (const match of text.matchAll(markdownImage)) {
    const lineNumber = lineNumberAt(text, match.index);
    if (fencedLineNumbers.has(lineNumber)) continue;
    images.push({
      syntax: 'markdown',
      reference: match[2],
      assetPath: resolveAssetPath(sourcePath, match[2]),
      altText: match[1],
      lineNumber,
    });
  }

  for (const match of text.matchAll(/<img\b[\s\S]*?>/giu)) {
    const lineNumber = lineNumberAt(text, match.index);
    if (fencedLineNumbers.has(lineNumber)) continue;
    const source =
      match[0].match(/\bsrc\s*=\s*\{\s*require\(['"]([^'"]+)['"]\)\.default\s*\}/iu)?.[1] ??
      match[0].match(/\bsrc\s*=\s*['"]([^'"]+)['"]/iu)?.[1] ??
      null;
    assert.ok(source, `Unsupported image source at ${sourcePath}:${lineNumber}`);
    const altText = match[0].match(/\balt\s*=\s*['"]([^'"]*)['"]/iu)?.[1] ?? null;
    images.push({
      syntax: 'jsx-img',
      reference: source,
      assetPath: resolveAssetPath(sourcePath, source),
      altText,
      lineNumber,
    });
  }

  return images.sort((left, right) => left.lineNumber - right.lineNumber);
}

function isInternalLink(target) {
  return (
    target.startsWith('/') &&
    !target.startsWith('//')
  ) || target.startsWith('./') || target.startsWith('../') ||
    /^https:\/\/docs\.releem\.com(?:\/|$)/u.test(target);
}

function parseInternalLinks(text, fencedLineNumbers) {
  const links = [];
  const markdownLink = /(?<!!)\[([^\]\n]+)\]\(\s*<?([^\s)>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/gu;
  for (const match of text.matchAll(markdownLink)) {
    const lineNumber = lineNumberAt(text, match.index);
    if (fencedLineNumbers.has(lineNumber) || !isInternalLink(match[2])) continue;
    links.push({label: match[1], target: match[2], lineNumber});
  }
  for (const match of text.matchAll(/<a\b[^>]*\bhref\s*=\s*['"]([^'"]+)['"][^>]*>/giu)) {
    const lineNumber = lineNumberAt(text, match.index);
    if (fencedLineNumbers.has(lineNumber) || !isInternalLink(match[1])) continue;
    links.push({label: null, target: match[1], lineNumber});
  }
  return links.sort((left, right) => left.lineNumber - right.lineNumber);
}

const procedurePattern = /\b(?:apply|automatic|backup|check|command|configur|connect|copy|create|disable|enable|install|manual|migrat|modify|procedure|reboot|recover|restart|restore|rollback|run|setup|step|troubleshoot|uninstall|update|verif)\w*\b/iu;
const recoveryPattern = /\b(?:backup|error|fail|issues?|no statement was applied|recover|restore|rollback|troubleshoot|uninstall)\w*\b/iu;

function parseDocument(sourcePath, input) {
  const text = normalizeLineEndings(input);
  const frontMatterMatch = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/u);
  assert.ok(frontMatterMatch, `${sourcePath} must begin with front matter`);
  const frontMatter = frontMatterMatch[0].replace(/\n$/u, '');
  const frontMatterBody = frontMatterMatch[1];
  const body = text.slice(frontMatterMatch[0].length);
  const explicitId = frontMatterValue(frontMatterBody, 'id');
  const explicitSlug = frontMatterValue(frontMatterBody, 'slug');
  const relativePath = sourcePath.slice('docs/'.length, -'.md'.length);
  const directory = path.posix.dirname(relativePath);
  const localId = explicitId ?? path.posix.basename(relativePath);
  const effectiveId = directory === '.' ? localId : path.posix.join(directory, localId);
  const publicRoute = explicitSlug?.startsWith('/')
    ? explicitSlug
    : `/${explicitSlug ? path.posix.join(directory, explicitSlug) : effectiveId}`;
  const {codeFences, fencedLineNumbers} = parseCodeFences(text);
  const headings = [];
  for (const [lineIndex, line] of text.split('\n').entries()) {
    if (fencedLineNumbers.has(lineIndex + 1)) continue;
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/u);
    if (!match) continue;
    headings.push({
      level: match[1].length,
      text: match[2],
      lineNumber: lineIndex + 1,
    });
  }

  return {
    sourcePath,
    sourceSha256: sha256(input),
    frontMatter,
    explicitId,
    effectiveId,
    slug: explicitSlug,
    publicRoute: publicRoute === '/' ? '/' : publicRoute.replace(/\/$/u, ''),
    h1: headings.find(({level}) => level === 1) ?? null,
    headings,
    bodySha256: sha256(body),
    bodyWithoutCodeFencesSha256: sha256(withoutCodeFences(body)),
    bodyWithoutCodeFenceContentsSha256: sha256(
      withoutCodeFenceContents(body),
    ),
    internalLinks: parseInternalLinks(text, fencedLineNumbers),
    codeFences,
    images: parseImages(sourcePath, text, fencedLineNumbers),
    procedureHeadings: headings.filter(({text: heading}) =>
      procedurePattern.test(heading),
    ),
    recoveryHeadings: headings.filter(({text: heading}) =>
      recoveryPattern.test(heading),
    ),
  };
}

function sectionInventory(sourcePath, input) {
  const text = normalizeLineEndings(input);
  const lines = text.split('\n');
  const document = parseDocument(sourcePath, text);
  const h1 = document.h1;
  assert.ok(h1, `${sourcePath} must have an H1 in frozen section evidence`);
  const headings = document.headings.filter(({level}) => level === 2 || level === 3);
  const sections = [{
    heading: null,
    content: lines.slice(h1.lineNumber, (headings[0]?.lineNumber ?? lines.length + 1) - 1).join('\n'),
  }];
  for (const [index, heading] of headings.entries()) {
    const next = headings.slice(index + 1).find(({level}) => level <= heading.level);
    sections.push({
      heading: `${'#'.repeat(heading.level)} ${heading.text}`,
      content: lines.slice(heading.lineNumber, (next?.lineNumber ?? lines.length + 1) - 1).join('\n'),
    });
  }
  return sections;
}

function collectSidebarOwnership(sidebars) {
  const ownership = new Map();
  const add = (id, sidebar, categories, placement) => {
    const entries = ownership.get(id) ?? [];
    entries.push({sidebar, categories, placement});
    ownership.set(id, entries);
  };
  const visit = (items, sidebar, categories = []) => {
    for (const item of items) {
      if (typeof item === 'string') {
        add(item, sidebar, categories, 'item');
      } else if (item.type === 'doc') {
        add(item.id, sidebar, categories, 'item');
      } else if (item.type === 'category') {
        const nextCategories = [...categories, item.label];
        if (item.link?.type === 'doc') {
          add(item.link.id, sidebar, nextCategories, 'category-link');
        }
        visit(item.items ?? [], sidebar, nextCategories);
      }
    }
  };
  for (const [sidebar, items] of Object.entries(sidebars)) visit(items, sidebar);
  return ownership;
}

const imagePlacementKey = (record) =>
  JSON.stringify([record.reference, record.altText, record.syntax]);

function countBy(records, keyFor) {
  const counts = new Map();
  for (const record of records) {
    const key = keyFor(record);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function frontMatterLine(frontMatter, field) {
  return frontMatter
    .split('\n')
    .find((line) => line.startsWith(`${field}:`));
}

function assertRouteFrontMatterChange(
  baselinePage,
  currentPage,
  routeException,
) {
  assert.equal(routeException.status, 'approved');
  assert.equal(routeException.baselineSourcePath, baselinePage.sourcePath);
  assert.equal(routeException.currentSourcePath, currentPage.sourcePath);
  assert.ok(routeException.reason.length > 0);
  assert.equal(routeException.reviewerDecision, 'approved');
  assert.ok(routeException.frontMatterChanges.length > 0);
  assert.equal(
    new Set(routeException.frontMatterChanges.map(({field}) => field)).size,
    routeException.frontMatterChanges.length,
    'Route exception fields must be unique',
  );

  let normalizedCurrentFrontMatter = currentPage.frontMatter;
  for (const change of routeException.frontMatterChanges) {
    assert.ok(
      ['id', 'slug'].includes(change.field),
      `Route exceptions cannot change front-matter field: ${change.field}`,
    );
    assert.equal(
      frontMatterValue(baselinePage.frontMatter, change.field),
      change.baselineValue,
    );
    assert.equal(
      frontMatterValue(currentPage.frontMatter, change.field),
      change.approvedValue,
    );
    const baselineLine = frontMatterLine(baselinePage.frontMatter, change.field);
    const currentLine = frontMatterLine(currentPage.frontMatter, change.field);
    assert.ok(baselineLine && currentLine);
    normalizedCurrentFrontMatter = normalizedCurrentFrontMatter.replace(
      currentLine,
      baselineLine,
    );
  }
  assert.equal(
    normalizedCurrentFrontMatter,
    baselinePage.frontMatter,
    `${baselinePage.sourcePath} has an undeclared route/front-matter change`,
  );
  assert.equal(currentPage.explicitId, routeException.currentExplicitId);
  assert.equal(currentPage.effectiveId, routeException.currentEffectiveId);
  assert.equal(currentPage.slug, routeException.currentSlug);
  assert.equal(currentPage.publicRoute, routeException.currentRoute);
}

const fenceSnapshot = ({openingLine, closingLine, language, contentSha256}) => ({
  openingLine,
  closingLine,
  language,
  contentSha256,
});

function assertCodeFenceIdentity(
  baselinePage,
  currentPage,
  safetyExceptions,
) {
  const pageExceptions = safetyExceptions.filter(
    ({pageSourcePath, status}) =>
      pageSourcePath === baselinePage.sourcePath && status === 'approved',
  );
  assert.equal(
    new Set(pageExceptions.map(({fenceIndex}) => fenceIndex)).size,
    pageExceptions.length,
    `Duplicate safety exception for ${baselinePage.sourcePath}`,
  );

  const expectedFences = [];
  for (const fence of baselinePage.codeFences) {
    const exception = pageExceptions.find(
      ({fenceIndex}) => fenceIndex === fence.index,
    );
    if (!exception) {
      expectedFences.push(fenceSnapshot(fence));
      continue;
    }
    assert.equal(exception.baselineLineNumber, fence.lineNumber);
    assert.equal(exception.baselineLanguage, fence.language);
    assert.equal(exception.baselineContentSha256, fence.contentSha256);
    assert.ok(exception.risk.length > 0);
    assert.ok(exception.replacementTreatment.length > 0);
    assert.equal(exception.reviewerDecision, 'approved');
    assert.ok(
      ['remove', 'replace'].includes(exception.approvedAction),
      `Unsupported safety-exception action: ${exception.approvedAction}`,
    );
    if (exception.approvedAction === 'replace') {
      assert.deepEqual(Object.keys(exception.approvedCurrent).sort(), [
        'contentSha256',
        'language',
      ]);
      expectedFences.push({
        ...fenceSnapshot(fence),
        ...exception.approvedCurrent,
      });
    } else {
      assert.deepEqual(Object.keys(exception.approvedCurrent).sort(), [
        'bodySha256',
      ]);
    }
  }

  assert.deepEqual(
    currentPage.codeFences.map(fenceSnapshot),
    expectedFences,
    `Code fences changed beyond approved snapshots: ${baselinePage.sourcePath}`,
  );
}

function assertLifecycleCodeFenceIdentity(
  baselinePage,
  currentPage,
  lifecycleSafetyExclusions,
  lifecycleSafetyRewrites,
) {
  const exclusions = lifecycleSafetyExclusions.filter(
    ({pageSourcePath}) => pageSourcePath === baselinePage.sourcePath,
  );
  const rewrites = lifecycleSafetyRewrites.filter(
    ({pageSourcePath}) => pageSourcePath === baselinePage.sourcePath,
  );
  const records = [...exclusions, ...rewrites];
  assert.equal(
    new Set(records.map(({fenceIndex}) => fenceIndex)).size,
    records.length,
    `Duplicate lifecycle fence record for ${baselinePage.sourcePath}`,
  );

  const expectedFences = baselinePage.codeFences.flatMap((fence) => {
    const exclusion = exclusions.find(({fenceIndex}) => fenceIndex === fence.index);
    const rewrite = rewrites.find(({fenceIndex}) => fenceIndex === fence.index);
    const record = exclusion ?? rewrite;
    if (!record) return [fenceSnapshot(fence)];
    assert.equal(record.baselineLineNumber, fence.lineNumber);
    assert.equal(record.baselineLanguage, fence.language);
    assert.equal(record.baselineContentSha256, fence.contentSha256);
    assert.match(record.reason, /\S.{15,}/u);
    assert.match(record.evidence, /\S.{15,}/u);
    if (exclusion) return [];
    assert.match(record.currentContentSha256, /^[a-f0-9]{64}$/u);
    return [{
      ...fenceSnapshot(fence),
      contentSha256: record.currentContentSha256,
    }];
  });
  assert.equal(
    records.every(({fenceIndex}) => baselinePage.codeFences[fenceIndex]),
    true,
    `Lifecycle record references a missing fence: ${baselinePage.sourcePath}`,
  );
  assert.deepEqual(
    currentPage.codeFences.map(fenceSnapshot),
    expectedFences,
    `Code fences changed beyond lifecycle safety records: ${baselinePage.sourcePath}`,
  );
}

function assertPageContentIdentity({
  baselinePage,
  currentPage,
  routeException,
  safetyExceptions,
}) {
  if (routeException) {
    assertRouteFrontMatterChange(baselinePage, currentPage, routeException);
  } else {
    assert.equal(
      currentPage.frontMatter,
      baselinePage.frontMatter,
      `${baselinePage.sourcePath} front matter changed`,
    );
  }

  assert.equal(
    currentPage.bodyWithoutCodeFencesSha256,
    baselinePage.bodyWithoutCodeFencesSha256,
    `${baselinePage.sourcePath} non-fence body changed`,
  );
  assertCodeFenceIdentity(baselinePage, currentPage, safetyExceptions);
  const pageSafetyExceptions = safetyExceptions.filter(
    ({pageSourcePath, status}) =>
      pageSourcePath === baselinePage.sourcePath && status === 'approved',
  );
  if (pageSafetyExceptions.length === 0) {
    assert.equal(
      currentPage.bodySha256,
      baselinePage.bodySha256,
      `${baselinePage.sourcePath} body changed`,
    );
  } else if (
    !pageSafetyExceptions.some(
      ({approvedAction}) => approvedAction === 'remove',
    )
  ) {
    assert.equal(
      currentPage.bodyWithoutCodeFenceContentsSha256,
      baselinePage.bodyWithoutCodeFenceContentsSha256,
      `${baselinePage.sourcePath} code-fence placement or wrapper changed`,
    );
  }
  for (const exception of pageSafetyExceptions.filter(
    ({approvedAction}) => approvedAction === 'remove',
  )) {
    assert.equal(
      currentPage.bodySha256,
      exception.approvedCurrent.bodySha256,
      `${baselinePage.sourcePath} differs from its approved fence-removal snapshot`,
    );
  }
  if (!routeException && pageSafetyExceptions.length === 0) {
    assert.equal(
      currentPage.sourceSha256,
      baselinePage.sourceSha256,
      `${baselinePage.sourcePath} source bytes changed`,
    );
  }
}

function assertAssetBytes(asset, currentBytes) {
  assert.equal(
    sha256(currentBytes),
    asset.sha256,
    `Asset bytes changed: ${asset.assetPath}`,
  );
}

function assertSidebarOwnership(
  page,
  currentOwnership,
  sidebarExceptions,
  currentEffectiveId = page.effectiveId,
) {
  const current = currentOwnership.get(currentEffectiveId) ?? [];
  const exception = sidebarExceptions.find(
    ({sourcePath, status}) =>
      sourcePath === page.sourcePath && status === 'approved',
  );
  if (!exception) {
    assert.deepEqual(
      current,
      page.sidebarOwnership,
      `Sidebar ownership changed without an approved exception: ${page.sourcePath}`,
    );
    return;
  }

  assert.deepEqual(exception.baselineOwnership, page.sidebarOwnership);
  assert.ok(exception.reason.length > 0);
  assert.equal(exception.reviewerDecision, 'approved');
  assert.deepEqual(
    current,
    exception.approvedOwnership,
    `Sidebar ownership does not match its approved exception: ${page.sourcePath}`,
  );
}

function validateOwnershipRecords(records, label) {
  assert.ok(Array.isArray(records) && records.length > 0, `${label} must be nonempty`);
  for (const record of records) {
    assert.deepEqual(
      Object.keys(record).sort(),
      ['categories', 'placement', 'sidebar'],
      `${label} has an invalid ownership record`,
    );
    assert.ok(typeof record.sidebar === 'string' && record.sidebar.length > 0, label);
    assert.ok(
      Array.isArray(record.categories) &&
        record.categories.every((category) => typeof category === 'string'),
      `${label} categories must be strings`,
    );
    assert.ok(['item', 'category-link'].includes(record.placement), label);
  }
}

function validatePreservationExceptions(candidateManifest) {
  const pagesBySource = new Map(
    candidateManifest.pages.map((page) => [page.sourcePath, page]),
  );
  for (const field of [
    'routeExceptions',
    'safetyExceptions',
    'sidebarExceptions',
  ]) {
    assert.ok(Array.isArray(candidateManifest[field]), `${field} must be an array`);
  }

  const routeKeys = new Set();
  const currentRoutePaths = new Set();
  for (const exception of candidateManifest.routeExceptions) {
    assert.ok(
      !routeKeys.has(exception.baselineSourcePath),
      `Duplicate route exception: ${exception.baselineSourcePath}`,
    );
    routeKeys.add(exception.baselineSourcePath);
    assert.ok(
      pagesBySource.has(exception.baselineSourcePath),
      `Route exception references unknown baseline page: ${exception.baselineSourcePath}`,
    );
    assert.ok(
      !currentRoutePaths.has(exception.currentSourcePath),
      `Duplicate route exception current path: ${exception.currentSourcePath}`,
    );
    currentRoutePaths.add(exception.currentSourcePath);
  }

  const safetyKeys = new Set();
  for (const exception of candidateManifest.safetyExceptions) {
    const key = `${exception.pageSourcePath}:${exception.fenceIndex}`;
    assert.ok(!safetyKeys.has(key), `Duplicate safety exception: ${key}`);
    safetyKeys.add(key);
    assert.ok(
      pagesBySource.has(exception.pageSourcePath),
      `Safety exception references unknown baseline page: ${exception.pageSourcePath}`,
    );
  }

  const sidebarKeys = new Set();
  for (const exception of candidateManifest.sidebarExceptions) {
    assert.ok(
      !sidebarKeys.has(exception.sourcePath),
      `Duplicate sidebar exception: ${exception.sourcePath}`,
    );
    sidebarKeys.add(exception.sourcePath);
    assert.ok(
      pagesBySource.has(exception.sourcePath),
      `Sidebar exception references unknown baseline page: ${exception.sourcePath}`,
    );
  }

  for (const exception of candidateManifest.routeExceptions) {
    assert.equal(exception.status, 'approved', 'Route exception must be approved');
    assert.equal(exception.reviewerDecision, 'approved');
    assert.ok(typeof exception.reason === 'string' && exception.reason.length > 0);
    assert.ok(
      typeof exception.currentSourcePath === 'string' &&
        exception.currentSourcePath.endsWith('.md'),
    );
    assert.ok(
      Array.isArray(exception.frontMatterChanges) &&
        exception.frontMatterChanges.length > 0,
    );
  }

  for (const exception of candidateManifest.safetyExceptions) {
    const page = pagesBySource.get(exception.pageSourcePath);
    const fence = page.codeFences.find(
      ({index}) => index === exception.fenceIndex,
    );
    assert.ok(fence, `Safety exception references unknown fence: ${exception.fenceIndex}`);
    assert.equal(exception.status, 'approved', 'Safety exception must be approved');
    assert.equal(exception.reviewerDecision, 'approved');
    assert.ok(typeof exception.risk === 'string' && exception.risk.length > 0);
    assert.ok(
      typeof exception.replacementTreatment === 'string' &&
        exception.replacementTreatment.length > 0,
    );
    assert.equal(exception.baselineLineNumber, fence.lineNumber);
    assert.equal(exception.baselineLanguage, fence.language);
    assert.equal(exception.baselineContentSha256, fence.contentSha256);
    assert.ok(['remove', 'replace'].includes(exception.approvedAction));
    if (exception.approvedAction === 'remove') {
      assert.deepEqual(Object.keys(exception.approvedCurrent).sort(), ['bodySha256']);
      assert.match(exception.approvedCurrent.bodySha256, /^[a-f0-9]{64}$/u);
    } else {
      assert.deepEqual(Object.keys(exception.approvedCurrent).sort(), [
        'contentSha256',
        'language',
      ]);
      assert.match(exception.approvedCurrent.contentSha256, /^[a-f0-9]{64}$/u);
    }
  }

  for (const exception of candidateManifest.sidebarExceptions) {
    const page = pagesBySource.get(exception.sourcePath);
    assert.equal(exception.status, 'approved', 'Sidebar exception must be approved');
    assert.equal(exception.reviewerDecision, 'approved');
    assert.ok(typeof exception.reason === 'string' && exception.reason.length > 0);
    assert.deepEqual(exception.baselineOwnership, page.sidebarOwnership);
    validateOwnershipRecords(
      exception.approvedOwnership,
      `Sidebar exception approvedOwnership: ${exception.sourcePath}`,
    );
  }
}

async function loadSidebars() {
  const source = await readFile(path.join(projectRoot, 'sidebars.js'), 'utf8');
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return (await import(moduleUrl)).default;
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

test('package directly composes every legacy and preservation test file', async () => {
  const packageJson = JSON.parse(
    await readFile(path.join(projectRoot, 'package.json'), 'utf8'),
  );
  assert.equal(
    packageJson.scripts['docs:check'],
    'node --test tests/docs-structure.test.mjs tests/docs-directory-mirror.test.mjs tests/docs-preservation.test.mjs tests/docs-linux-installation.test.mjs',
  );
  assert.equal(Object.hasOwn(packageJson.scripts, 'docs:legacy-compatible:check'), false);
  assert.doesNotMatch(packageJson.scripts['docs:check'], /--test-name-pattern/u);
  assert.doesNotMatch(
    packageJson.scripts['docs:check'],
    /--test-skip-pattern|'/u,
  );
});

test('route exceptions preserve body and undeclared front matter', () => {
  const baselineText = `---
id: old-id
slug: /old-route
title: Stable title
---
# Stable heading

Stable body.
`;
  const approvedRouteText = `---
id: new-id
slug: /new-route
title: Stable title
---
# Stable heading

Stable body.
`;
  const baselinePage = parseDocument('docs/guide.md', baselineText);
  const routeException = {
    baselineSourcePath: 'docs/guide.md',
    currentSourcePath: 'docs/new-guide.md',
    status: 'approved',
    frontMatterChanges: [
      {field: 'id', baselineValue: 'old-id', approvedValue: 'new-id'},
      {field: 'slug', baselineValue: '/old-route', approvedValue: '/new-route'},
    ],
    currentExplicitId: 'new-id',
    currentEffectiveId: 'new-id',
    currentSlug: '/new-route',
    currentRoute: '/new-route',
    reason: 'Approved route migration fixture.',
    reviewerDecision: 'approved',
  };

  assert.doesNotThrow(() =>
    assertPageContentIdentity({
      baselinePage,
      currentPage: parseDocument('docs/new-guide.md', approvedRouteText),
      routeException,
      safetyExceptions: [],
    }),
  );
  assert.throws(
    () =>
      assertPageContentIdentity({
        baselinePage,
        currentPage: parseDocument(
          'docs/new-guide.md',
          approvedRouteText.replace('Stable body.', 'Unapproved body drift.'),
        ),
        routeException,
        safetyExceptions: [],
      }),
    /non-fence body changed/u,
  );
  assert.throws(
    () =>
      assertPageContentIdentity({
        baselinePage,
        currentPage: parseDocument(
          'docs/new-guide.md',
          approvedRouteText.replace('Stable title', 'Unapproved title'),
        ),
        routeException,
        safetyExceptions: [],
      }),
    /undeclared route\/front-matter change/u,
  );
});

test('safety exceptions snapshot one fence and preserve unrelated body content', () => {
  const baselineText = `---
id: guide
slug: /guide
title: Guide
---
# Guide

Keep this explanation.

\`\`\`bash
unsafe --old
\`\`\`

Keep this recovery note.
`;
  const approvedSafetyText = baselineText.replace(
    'unsafe --old',
    'safe --replacement',
  );
  const baselinePage = parseDocument('docs/guide.md', baselineText);
  const approvedPage = parseDocument('docs/guide.md', approvedSafetyText);
  const safetyException = {
    pageSourcePath: 'docs/guide.md',
    status: 'approved',
    fenceIndex: 0,
    baselineLineNumber: baselinePage.codeFences[0].lineNumber,
    baselineLanguage: 'bash',
    baselineContentSha256: baselinePage.codeFences[0].contentSha256,
    approvedAction: 'replace',
    approvedCurrent: {
      language: 'bash',
      contentSha256: approvedPage.codeFences[0].contentSha256,
    },
    risk: 'Unsafe fixture command.',
    replacementTreatment: 'Replace only the approved fence.',
    reviewerDecision: 'approved',
  };

  assert.doesNotThrow(() =>
    assertPageContentIdentity({
      baselinePage,
      currentPage: approvedPage,
      routeException: null,
      safetyExceptions: [safetyException],
    }),
  );
  const unrelatedDrift = approvedSafetyText.replace(
    'Keep this recovery note.',
    'Changed recovery note.',
  );
  assert.throws(
    () =>
      assertPageContentIdentity({
        baselinePage,
        currentPage: parseDocument('docs/guide.md', unrelatedDrift),
        routeException: null,
        safetyExceptions: [safetyException],
      }),
    /non-fence body changed/u,
  );
  assert.throws(
    () =>
      assertPageContentIdentity({
        baselinePage,
        currentPage: parseDocument(
          'docs/guide.md',
          approvedSafetyText.replace('```bash', '```bash unapproved-metadata'),
        ),
        routeException: null,
        safetyExceptions: [safetyException],
      }),
    /Code fences changed beyond approved snapshots/u,
  );
});

test('safety remove exceptions remove one fence and preserve surrounding prose', () => {
  const baselineText = `---
id: guide
slug: /guide
title: Guide
---
# Guide

Keep before.

\`\`\`bash
unsafe --remove
\`\`\`

Keep after.
`;
  const approvedRemovalText = baselineText.replace(
    '\n```bash\nunsafe --remove\n```',
    '',
  );
  const baselinePage = parseDocument('docs/guide.md', baselineText);
  const approvedRemovalPage = parseDocument(
    'docs/guide.md',
    approvedRemovalText,
  );
  const safetyException = {
    pageSourcePath: 'docs/guide.md',
    status: 'approved',
    fenceIndex: 0,
    baselineLineNumber: baselinePage.codeFences[0].lineNumber,
    baselineLanguage: 'bash',
    baselineContentSha256: baselinePage.codeFences[0].contentSha256,
    approvedAction: 'remove',
    approvedCurrent: {bodySha256: approvedRemovalPage.bodySha256},
    risk: 'Unsafe fixture command.',
    replacementTreatment: 'Remove only the approved fence block.',
    reviewerDecision: 'approved',
  };

  assert.doesNotThrow(() =>
    assertPageContentIdentity({
      baselinePage,
      currentPage: approvedRemovalPage,
      routeException: null,
      safetyExceptions: [safetyException],
    }),
  );
  assert.throws(
    () =>
      assertPageContentIdentity({
        baselinePage,
        currentPage: parseDocument(
          'docs/guide.md',
          approvedRemovalText.replace('Keep after.', 'Drifted after.'),
        ),
        routeException: null,
        safetyExceptions: [safetyException],
      }),
    /non-fence body changed/u,
  );
});

test('asset byte validation rejects a changed current asset', () => {
  const baselineBytes = Buffer.from('baseline image bytes');
  const asset = {
    assetPath: 'assets/images/example.png',
    sha256: sha256(baselineBytes),
  };
  assert.doesNotThrow(() => assertAssetBytes(asset, baselineBytes));
  assert.throws(
    () => assertAssetBytes(asset, Buffer.from('changed image bytes')),
    /Asset bytes changed/u,
  );
});

test('sidebar ownership requires exact records or one exact approved exception', () => {
  const page = {
    sourcePath: 'docs/guide.md',
    effectiveId: 'guide',
    sidebarOwnership: [
      {sidebar: 'docs', categories: ['Installation'], placement: 'item'},
    ],
  };
  const approvedOwnership = [
    {
      sidebar: 'docs',
      categories: ['Installation', 'Advanced'],
      placement: 'item',
    },
  ];
  const exactOwnership = new Map([['guide', page.sidebarOwnership]]);
  const changedOwnership = new Map([['guide', approvedOwnership]]);

  assert.doesNotThrow(() =>
    assertSidebarOwnership(page, exactOwnership, []),
  );
  assert.throws(
    () => assertSidebarOwnership(page, changedOwnership, []),
    /Sidebar ownership changed without an approved exception/u,
  );

  const sidebarException = {
    sourcePath: page.sourcePath,
    status: 'approved',
    baselineOwnership: page.sidebarOwnership,
    approvedOwnership,
    reason: 'Approved sidebar fixture move.',
    reviewerDecision: 'approved',
  };
  assert.doesNotThrow(() =>
    assertSidebarOwnership(page, changedOwnership, [sidebarException]),
  );
  assert.throws(
    () =>
      assertSidebarOwnership(
        page,
        new Map([
          [
            'guide',
            [
              {
                sidebar: 'docs',
                categories: ['Recommendations'],
                placement: 'item',
              },
            ],
          ],
        ]),
        [sidebarException],
      ),
    /does not match its approved exception/u,
  );
});

test('structured exceptions reject duplicate, orphaned, and invalid records', () => {
  const page = {
    sourcePath: 'docs/guide.md',
    effectiveId: 'guide',
    sidebarOwnership: [
      {sidebar: 'docs', categories: ['Installation'], placement: 'item'},
    ],
    codeFences: [
      {index: 0, lineNumber: 10, language: 'bash', contentSha256: 'a'.repeat(64)},
    ],
  };
  const sidebarException = {
    sourcePath: page.sourcePath,
    status: 'approved',
    baselineOwnership: page.sidebarOwnership,
    approvedOwnership: [
      {sidebar: 'docs', categories: ['Advanced'], placement: 'item'},
    ],
    reason: 'Approved fixture move.',
    reviewerDecision: 'approved',
  };
  const base = {
    pages: [page],
    routeExceptions: [],
    safetyExceptions: [],
    sidebarExceptions: [sidebarException],
  };

  assert.doesNotThrow(() => validatePreservationExceptions(base));
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      sidebarExceptions: [sidebarException, sidebarException],
    }),
    /Duplicate sidebar exception/u,
  );
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      sidebarExceptions: [{...sidebarException, sourcePath: 'docs/orphan.md'}],
    }),
    /unknown baseline page/u,
  );
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      sidebarExceptions: [{...sidebarException, status: 'pending'}],
    }),
    /must be approved/u,
  );
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      sidebarExceptions: [{
        ...sidebarException,
        approvedOwnership: [{sidebar: 'docs', categories: 'Advanced'}],
      }],
    }),
    /approvedOwnership/u,
  );
  const routeException = {
    baselineSourcePath: page.sourcePath,
    currentSourcePath: 'docs/new-guide.md',
  };
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      routeExceptions: [routeException, routeException],
    }),
    /Duplicate route exception/u,
  );
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      routeExceptions: [{
        ...routeException,
        baselineSourcePath: 'docs/orphan.md',
      }],
    }),
    /unknown baseline page/u,
  );
  const safetyException = {pageSourcePath: page.sourcePath, fenceIndex: 0};
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      safetyExceptions: [safetyException, safetyException],
    }),
    /Duplicate safety exception/u,
  );
  assert.throws(
    () => validatePreservationExceptions({
      ...base,
      safetyExceptions: [{...safetyException, pageSourcePath: 'docs/orphan.md'}],
    }),
    /unknown baseline page/u,
  );
});

test('classifies issue and unsuccessful-outcome headings as recovery guidance', () => {
  for (const heading of [
    'Common Issues for AWS RDS',
    'No Statement Was Applied',
  ]) {
    assert.equal(
      recoveryPattern.test(heading),
      true,
      `Expected recovery heading: ${heading}`,
    );
  }

  const expectedManifestHeadings = [
    [
      'docs/installation/installation-methods/aws-rds.md',
      'Common Issues for AWS RDS',
    ],
    [
      'docs/recommendations/query-optimization/schema-change-troubleshooting.md',
      'No Statement Was Applied',
    ],
  ];
  for (const [sourcePath, heading] of expectedManifestHeadings) {
    const page = manifest.pages.find((candidate) => candidate.sourcePath === sourcePath);
    assert.ok(
      page.recoveryHeadings.some(({text}) => text === heading),
      `${sourcePath} must record recovery heading: ${heading}`,
    );
  }
});

test('supersedes legacy whole-file checks with exact content identity outside approved editorial pages', async () => {
  const expectedEditorialExceptionPaths = [
    'docs/get-started/releem-overview.md',
    'docs/get-started/register-for-an-account.md',
    'docs/get-started/connect-your-database-server.md',
    'docs/get-started/troubleshoot-releem-agent.md',
    'docs/dashboard/overview.md',
    'docs/recommendations/overview.md',
    'docs/account/overview.md',
    'docs/faq.md',
    'docs/account/access/users-and-roles.md',
    'docs/account/billing/cancel-subscription.md',
    'docs/dashboard/deadlocks.md',
    'docs/dashboard/health-checks.md',
    'docs/dashboard/process-list.md',
    'docs/dashboard/query-analytics.md',
    'docs/dashboard/reports.md',
    'docs/dashboard/schema-checks.md',
    'docs/dashboard/security-checks.md',
    'docs/installation/manage-the-releem-agent/logs.md',
    'docs/recommendations/configuration-tuning/apply-manually/aws-rds.md',
    'docs/recommendations/configuration-tuning/apply-manually/docker.md',
    'docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md',
    'docs/recommendations/configuration-tuning/apply-manually/windows.md',
    'docs/recommendations/configuration-tuning/apply-using-agent.md',
    'docs/recommendations/configuration-tuning/configuration-example.md',
    'docs/recommendations/configuration-tuning/limit-mysql-memory.md',
    'docs/recommendations/configuration-tuning/mysql-tuning-process.md',
    'docs/recommendations/configuration-tuning/rollback.md',
    'docs/recommendations/query-optimization/disable.md',
    'docs/recommendations/query-optimization/overview.md',
    'docs/recommendations/query-optimization/prepared-statements.md',
  ];
  assert.deepEqual(
    manifest.editorialExceptions.map(({sourcePath}) => sourcePath),
    expectedEditorialExceptionPaths,
  );
  const taskFourFrontMatterChanges = new Map([
    [
      'docs/recommendations/overview.md',
      [
        {
          field: 'title',
          baselineValue: 'Configuration Tuning',
          approvedValue: 'Recommendations',
        },
      ],
    ],
    [
      'docs/account/overview.md',
      [
        {
          field: 'title',
          baselineValue: 'Your server settings',
          approvedValue: 'Account',
        },
        {
          field: 'sidebar_label',
          baselineValue: 'Your server settings',
          approvedValue: 'Account',
        },
      ],
    ],
  ]);

  const exactOverlaySources = new Set([
    ...engineFirstExistingDocumentChanges.keys(),
    ...lifecycleSourceOverlayHashes.keys(),
  ]);
  for (const sourcePath of exactOverlaySources) {
    const currentText = await readFile(path.join(projectRoot, sourcePath), 'utf8');
    const restoredText = reverseEngineFirstLinks(currentText, sourcePath);
    const frozenText = execFileSync(
      'git',
      ['show', `${engineFirstSourceRevision}:${sourcePath}`],
      {cwd: projectRoot, encoding: 'utf8'},
    );
    assert.equal(
      restoredText,
      frozenText,
      `${sourcePath} changed beyond the exact engine-first integration overlay`,
    );
  }

  for (const baselinePage of manifest.pages) {
    if (
      retiredSources.has(baselinePage.sourcePath) ||
      rewrittenSources.has(baselinePage.sourcePath)
    ) continue;
    const routeException = manifest.routeExceptions.find(
      ({baselineSourcePath, status}) =>
        baselineSourcePath === baselinePage.sourcePath && status === 'approved',
    );
    const currentSourcePath =
      routeException?.currentSourcePath ?? baselinePage.sourcePath;
    const currentText = reverseConsolidationLinks(await readFile(
      path.join(projectRoot, currentSourcePath),
      'utf8',
    ), currentSourcePath);
    const currentPage = parseDocument(
      currentSourcePath,
      currentText,
    );
    const exception = manifest.editorialExceptions.find(
      ({sourcePath}) => sourcePath === baselinePage.sourcePath,
    );

    if (!exception) {
      assertPageContentIdentity({
        baselinePage,
        currentPage,
        routeException,
        safetyExceptions: manifest.safetyExceptions,
      });
      continue;
    }

    assert.equal(exception.status, 'approved');
    assert.equal(exception.approvedBy, 'user');
    const isOverviewPilot =
      exception.sourcePath === 'docs/get-started/releem-overview.md';
    const frontMatterChanges = isOverviewPilot
      ? [
          {
            field: 'sidebar_label',
            baselineValue: 'Welcome',
            approvedValue: 'Releem Overview',
          },
        ]
      : taskFourFrontMatterChanges.get(exception.sourcePath) ?? [];
    const expectedApprovedOn = isOverviewPilot
      ? '2026-09-03'
      : [
          'docs/account/billing/cancel-subscription.md',
          'docs/dashboard/deadlocks.md',
          'docs/dashboard/health-checks.md',
          'docs/dashboard/process-list.md',
          'docs/dashboard/query-analytics.md',
          'docs/dashboard/reports.md',
          'docs/dashboard/schema-checks.md',
          'docs/dashboard/security-checks.md',
          'docs/installation/manage-the-releem-agent/logs.md',
          'docs/recommendations/configuration-tuning/apply-manually/aws-rds.md',
          'docs/recommendations/configuration-tuning/apply-manually/docker.md',
          'docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md',
          'docs/recommendations/configuration-tuning/apply-manually/windows.md',
          'docs/recommendations/configuration-tuning/apply-using-agent.md',
          'docs/recommendations/configuration-tuning/configuration-example.md',
          'docs/recommendations/configuration-tuning/limit-mysql-memory.md',
          'docs/recommendations/configuration-tuning/mysql-tuning-process.md',
          'docs/recommendations/configuration-tuning/rollback.md',
          'docs/recommendations/query-optimization/disable.md',
          'docs/recommendations/query-optimization/overview.md',
          'docs/recommendations/query-optimization/prepared-statements.md',
        ].includes(exception.sourcePath)
        ? '2026-09-05'
        : '2026-09-04';
    assert.equal(exception.approvedOn, expectedApprovedOn);
    assert.deepEqual(
      exception.permittedFields,
      [
        ...frontMatterChanges.map(({field}) => `frontMatter.${field}`),
        'body',
      ],
    );
    assert.deepEqual(exception.bodyChangeScope, [
      'H1',
      'ordered headings',
      'prose',
      'internal links',
    ]);
    assert.deepEqual(exception.frontMatterChanges, frontMatterChanges);
    assert.deepEqual(
      exception.preservedFields,
      frontMatterChanges.length > 0
        ? [
            'sourcePath',
            'explicitId',
            'effectiveId',
            'slug',
            'publicRoute',
            'codeFences',
            'images',
            'sidebarOwnership',
          ]
        : [
            'sourcePath',
            'frontMatter',
            'explicitId',
            'effectiveId',
            'slug',
            'publicRoute',
            'codeFences',
            'images',
            'sidebarOwnership',
          ],
    );
    assert.ok(exception.reason.length > 0);
    assert.ok(exception.approvalEvidence.length > 0);
    if (frontMatterChanges.length > 0) {
      const changedFields = new Set(
        frontMatterChanges.map(({field}) => field),
      );
      assert.deepEqual(
        currentPage.frontMatter
          .split('\n')
          .filter((line) => !changedFields.has(line.split(':', 1)[0])),
        baselinePage.frontMatter
          .split('\n')
          .filter((line) => !changedFields.has(line.split(':', 1)[0])),
        `${exception.sourcePath} changed undeclared front matter`,
      );
    } else {
      assert.equal(
        currentPage.frontMatter,
        baselinePage.frontMatter,
        `${exception.sourcePath} front matter changed`,
      );
    }
    for (const field of [
      'frontMatter',
      'sourceSha256',
      'h1',
      'headings',
      'bodySha256',
      'internalLinks',
      'procedureHeadings',
      'recoveryHeadings',
    ]) {
      assert.deepEqual(
        currentPage[field],
        exception.approvedCurrent[field],
        `${exception.sourcePath} drifted beyond its approved editorial snapshot: ${field}`,
      );
    }
  }
});

test('approved orientation pages route customer tasks without unsupported state claims', async () => {
  const [
    overview,
    register,
    connect,
    dashboard,
    recommendations,
    account,
    faq,
  ] = await Promise.all([
    'docs/get-started/releem-overview.md',
    'docs/get-started/register-for-an-account.md',
    'docs/get-started/connect-your-database-server.md',
    'docs/dashboard/overview.md',
    'docs/recommendations/overview.md',
    'docs/account/overview.md',
    'docs/faq.md',
  ].map((sourcePath) => readFile(path.join(projectRoot, sourcePath), 'utf8')));

  const overviewException = manifest.editorialExceptions[0];
  assert.equal(overviewException.sourcePath, 'docs/get-started/releem-overview.md');
  assert.equal(overviewException.approvedOn, '2026-09-03');
  assert.match(overviewException.approvalEvidence, /one-page editorial pilot/iu);
  assert.match(overviewException.reason, /Overview pilot/iu);
  assert.equal(sha256(overview), overviewException.approvedCurrent.sourceSha256);

  assert.match(register, /\[\*\*Sign Up\*\*\]\(https:\/\/app\.releem\.com\)/u);
  assert.match(connect, /\/installation\/mysql\/azure-database-for-mysql/u);
  assert.match(connect, /\[Releem Dashboard\]\(https:\/\/app\.releem\.com\)/u);
  assert.doesNotMatch(
    connect,
    /completed Dashboard checks confirm|enough observations/iu,
  );
  for (const target of [
    '/installation/mysql/linux#automatic-installation',
    '/installation/mysql/linux#manual-installation',
    '/installation/mariadb/linux#automatic-installation',
    '/installation/mariadb/linux#manual-installation',
    '/installation/postgresql/linux#automatic-installation',
    '/installation/postgresql/linux#manual-installation',
  ]) {
    assert.equal(
      connect.split(target).length - 1,
      1,
      `Connect page must contain exactly one Linux destination: ${target}`,
    );
  }

  assert.match(dashboard, /\[Reports\]\(\/dashboard\/reports\)/u);
  assert.match(dashboard, /\[Schema Checks\]\(\/dashboard\/schema-checks\)/u);
  assert.doesNotMatch(dashboard, /Schema Optimization|retained Dashboard detail/iu);
  assert.match(recommendations, /^title: Recommendations$/mu);
  assert.doesNotMatch(recommendations, /Choose a recommendation task/u);
  assert.match(recommendations, /^## Query Optimization$/mu);
  assert.match(recommendations, /100 most frequent queries/u);
  assert.match(recommendations, /100 slowest queries/u);
  assert.match(recommendations, /it does not apply the change automatically/u);
  assert.match(recommendations, /execution time, frequency, and overall impact/u);
  assert.match(
    recommendations,
    /\[Query Optimization\]\(\/recommendations\/query-optimization\)/u,
  );

  assert.match(account, /^title: Account$/mu);
  assert.match(account, /^sidebar_label: Account$/mu);
  assert.doesNotMatch(
    faq,
    /canonical procedure|The first answer/iu,
  );

  const faqSection = (heading) => {
    const afterHeading = faq.split(`## ${heading}\n`)[1];
    assert.ok(afterHeading, `FAQ heading is missing: ${heading}`);
    return afterHeading.split('\n## ')[0];
  };
  for (const heading of [
    'I applied all recommendations, but Releem Score is not 100%. How can I improve it?',
    'I applied all recommendations, but not all Health Checks are checked. How can I improve it?',
  ]) {
    assert.match(faqSection(heading), /\/dashboard\/health-checks/u);
  }
  const approvalSection = faqSection(
    'Would Releem automatically change MySQL configuration without my approval?',
  );
  for (const target of [
    '/recommendations/configuration-tuning/apply-using-portal',
    '/recommendations/configuration-tuning/apply-using-agent',
    '/recommendations/configuration-tuning/apply-using-cron',
  ]) {
    assert.match(approvalSection, new RegExp(target.replaceAll('/', '\\/'), 'u'));
  }
  for (const heading of [
    'How do I add my business details and the VAT number?',
    'How do I get an invoice?',
  ]) {
    assert.match(faqSection(heading), /\/account\/billing\/payment-information/u);
  }
  assert.match(
    faqSection('Why does high latency occur after applying the recommended configuration?'),
    /\[Learn more\]\(https:\/\/releem\.com\/docs\/mysql-latency\)/u,
  );
});

test('users and roles keeps its contract while presenting explicit one-action sequences', async () => {
  const sourcePath = 'docs/account/access/users-and-roles.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Users and Roles baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'users-and-roles');
  assert.equal(page.effectiveId, 'account/access/users-and-roles');
  assert.equal(page.slug, '/account/access/users-and-roles');
  assert.equal(page.publicRoute, '/account/access/users-and-roles');

  assert.deepEqual(page.images, baselinePage.images);
  const firstImageOffset = source.indexOf('dashboard-settings-invitation.png');
  const secondImageOffset = source.indexOf('dashboard-settings-invitation-popup.png');
  assert.ok(source.indexOf('1. Open the settings for the database server.') < firstImageOffset);
  assert.ok(firstImageOffset < source.indexOf('2. Select **Email invitation**.'));
  assert.ok(source.indexOf('2. Select **Email invitation**.') < secondImageOffset);
  assert.ok(secondImageOffset < source.indexOf("3. Enter the person's email address."));

  const section = (heading, nextHeading) => {
    const start = source.indexOf(`## ${heading}\n`);
    assert.notEqual(start, -1, `Missing task heading: ${heading}`);
    const contentStart = start + `## ${heading}\n`.length;
    const end = nextHeading
      ? source.indexOf(`## ${nextHeading}\n`, contentStart)
      : source.length;
    assert.notEqual(end, -1, `Missing next task heading: ${nextHeading}`);
    return source.slice(contentStart, end);
  };
  const numberedActions = (content) => [
    ...content.matchAll(/^(\d+)\. (.+)$/gmu),
  ].map(([, number, action]) => ({number: Number(number), action}));

  const invite = section('Invite a user to a server', "Change a user's role");
  const changeRole = section("Change a user's role", 'Remove a user from a server');
  const remove = section('Remove a user from a server');
  assert.deepEqual(numberedActions(invite), [
    {number: 1, action: 'Open the settings for the database server.'},
    {number: 2, action: 'Select **Email invitation**.'},
    {number: 3, action: "Enter the person's email address."},
    {number: 4, action: 'Assign a role to the invited user:'},
    {number: 5, action: 'Select **Send**.'},
    {number: 6, action: 'Releem sends an email to the invited person.'},
    {number: 7, action: 'The invited person accepts the invitation.'},
    {number: 8, action: 'A new user sets a password.'},
  ]);
  assert.deepEqual(numberedActions(changeRole), [
    {number: 1, action: 'Open the settings for the server.'},
    {number: 2, action: 'Choose a new role for the user.'},
  ]);
  assert.match(
    changeRole,
    /2\. Choose a new role for the user\.\n\nThe user now has the new role\./u,
  );
  assert.doesNotMatch(changeRole, /confirm/iu);
  assert.deepEqual(numberedActions(remove), [
    {number: 1, action: 'Open the settings for the server.'},
    {number: 2, action: "Select the red cross next to the user's email address."},
  ]);

  assert.match(source, /Each invitation gives access to one specific server\./u);
  assert.match(source, /\*\*Viewer\*\* - Has read-only access to the Dashboard and insights\./u);
  assert.match(source, /\*\*Editor\*\* - Can change settings and apply recommendations\./u);
  assert.match(source, /Releem automatically creates an account\./u);
  assert.match(source, /Releem sends an email to the invited person\./u);
  assert.match(source, /The invited person accepts the invitation\./u);
  assert.match(source, /A new user sets a password\./u);
  assert.equal(page.codeFences.length, 0);

  assert.ok(exception, 'Users and Roles requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-04');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('cancellation keeps its contract while presenting five labeled customer actions', async () => {
  const sourcePath = 'docs/account/billing/cancel-subscription.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Cancellation baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'cancel-subscription');
  assert.equal(page.effectiveId, 'account/billing/cancel-subscription');
  assert.equal(page.slug, '/account/billing/cancel-subscription');
  assert.equal(page.publicRoute, '/account/billing/cancel-subscription');
  assert.equal(page.h1.text, 'Cancellation');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);
  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );

  assert.match(
    source,
    /Before you begin, make sure you can sign in to your Releem account; after cancellation, you should receive a confirmation email from Paddle to keep for your records\./u,
  );
  const numberedActions = [...source.matchAll(/^\d+\. \*\*(.+?)\.\*\*/gmu)]
    .map(([, label]) => label);
  assert.deepEqual(numberedActions, [
    'Sign in',
    'Open your profile',
    'Find the cancellation link',
    'Confirm the cancellation',
    'Keep the confirmation',
  ]);

  const retainedFacts = [
    /\[Releem Login\]\(https:\/\/app\.releem\.com\).*enter your credentials.*access your account/isu,
    /account icon or name.*top right corner of the Dashboard.*Profile page/isu,
    /Cancel Subscription.*integrated with Paddle.*subscription management partner.*handle cancellations/isu,
    /Cancel Subscription.*follow the prompts.*confirm your cancellation.*feedback or a reason for cancellation/isu,
    /confirmation email from Paddle.*Keep this email for your records/isu,
    /contact Releem support for assistance/iu,
  ];
  for (const fact of retainedFacts) assert.match(source, fact);
  assert.doesNotMatch(
    source,
    /refund|data retention|retain(?:ed|s)? data|effective date|billing (?:cycle|period)|remains active|lose access|access (?:continues|ends|remains)/iu,
  );

  assert.ok(exception, 'Cancellation requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('deadlock monitoring separates detected evidence from suggested action without guarantees', async () => {
  const sourcePath = 'docs/dashboard/deadlocks.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Deadlock Monitoring baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'deadlocks');
  assert.equal(page.effectiveId, 'dashboard/deadlocks');
  assert.equal(page.slug, '/dashboard/deadlocks');
  assert.equal(page.publicRoute, '/dashboard/deadlocks');
  assert.equal(page.h1.text, 'Deadlock Monitoring');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);

  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );
  assert.ok(
    source.indexOf('releem-deadlock-monitoring.png') <
      source.indexOf('releem-deadlock-monitoring-details.png'),
    'Deadlock screenshots must retain their order',
  );

  const section = (heading, nextHeading) => {
    const start = source.indexOf(`### ${heading}\n`);
    assert.notEqual(start, -1, `Missing section: ${heading}`);
    const contentStart = start + `### ${heading}\n`.length;
    const end = nextHeading
      ? source.indexOf(`### ${nextHeading}\n`, contentStart)
      : source.indexOf(
          '<img src={require(\'../../assets/images/releem-deadlock-monitoring-details.png\').default}',
          contentStart,
        );
    assert.notEqual(end, -1, `Missing section boundary after: ${heading}`);
    return source.slice(contentStart, end);
  };
  const evidence = section('Detected evidence', 'Suggested action');
  const action = section('Suggested action');
  assert.match(evidence, /MySQL's internal status reports/iu);
  assert.match(evidence, /deadlock type/iu);
  assert.match(evidence, /transaction details/iu);
  assert.match(evidence, /notification/iu);
  assert.match(evidence, /stored in your Releem dashboard/iu);
  assert.match(evidence, /histor(?:y|ical).*recurring issues and patterns/isu);
  assert.doesNotMatch(evidence, /suggest(?:ed|ion)|fix|resolve|solution/iu);
  assert.match(action, /suggest(?:ed|ion).*(?:fix|resolve)/isu);
  assert.match(action, /suggested fixes.*stored.*Releem dashboard/isu);
  assert.doesNotMatch(action, /identif(?:y|ies|ied).*deadlock type/iu);

  assert.match(source, /MySQL database/iu);
  assert.match(source, /Deadlocks can cause application errors and (?:degrade|affect) user experience/iu);
  assert.match(source, /database reliability/iu);
  assert.match(
    source,
    /\[MySQL Deadlock Detection\]\(https:\/\/releem\.com\/blog\/mysql-deadlock-detection\)/u,
  );
  assert.match(source, /deadlock type.*solutions.*best practices/isu);
  assert.doesNotMatch(
    source,
    /\b(?:continuously|instant(?:ly)?|real-time|immediately|ensures?|critical|complete historical records?|effective solutions?)\b/iu,
  );

  assert.ok(exception, 'Deadlock Monitoring requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('health checks tells readers what to review without promising diagnosis or outcomes', async () => {
  const sourcePath = 'docs/dashboard/health-checks.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Health Checks baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'health-checks');
  assert.equal(page.effectiveId, 'dashboard/health-checks');
  assert.equal(page.slug, '/dashboard/health-checks');
  assert.equal(page.publicRoute, '/dashboard/health-checks');
  assert.equal(page.h1.text, 'Health Checks');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);

  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );

  assert.match(
    source,
    /Use Health Checks to review the MySQL system, storage-engine, memory, query, and log metrics that Releem evaluates\./u,
  );
  assert.match(
    source,
    /Review a check together with its current value and recent workload before deciding whether further investigation or a configuration change is needed\./u,
  );
  assert.match(
    source,
    /A check is a diagnostic signal; it does not by itself identify the cause of a problem or guarantee a performance outcome\./u,
  );

  const expectedBlocks = [
    'System Block',
    'MyISAM/InnoDB Block',
    'Memory Block',
    'Queries/Logs Block',
  ];
  const blockOffsets = expectedBlocks.map((heading) => {
    const offset = source.indexOf(`## ${heading}`);
    assert.notEqual(offset, -1, `Missing Health Checks block: ${heading}`);
    return offset;
  });
  assert.deepEqual(blockOffsets, [...blockOffsets].sort((left, right) => left - right));

  const expectedMetrics = [
    'CPU Utilization',
    'Memory Utilization',
    'Disk Space Usage',
    'Database Connection Utilization',
    'MyISAM Cache Hit Rate',
    'MyISAM Key Write Ratio',
    'InnoDB Cache Hit Rate',
    'InnoDB Log File Size',
    'Thread Cache Hit Rate',
    'Thread Cache Ratio',
    'Table Cache Hit Rate',
    'Sort Merge Passes Ratio',
    'Temporary Disk Data',
    'QCache Fragmentation',
    'Flushing Logs',
  ];
  const metricOffsets = expectedMetrics.map((metric) => {
    const token = `- **${metric}**:`;
    assert.equal(source.split(token).length - 1, 1, `Metric must appear once: ${metric}`);
    return source.indexOf(token);
  });
  assert.deepEqual(metricOffsets, [...metricOffsets].sort((left, right) => left - right));
  assert.ok(
    source.indexOf('releem-dashboard-health-checks.png') < blockOffsets[0],
    'Health Checks screenshot must remain before the four blocks',
  );

  assert.doesNotMatch(
    source,
    /\b(?:regularly|always|critical role|optimal performance|peak performance|proactively address)\b/iu,
  );
  assert.doesNotMatch(
    source,
    /\b(?:Releem|Health Checks?|checks?) (?:ensures?|guarantees?)\b/iu,
  );
  assert.doesNotMatch(
    source,
    /(?:Health Checks|a check) (?:diagnos(?:e|es)|fix(?:es)?|resolve(?:s)?|prove(?:s)?)/iu,
  );

  assert.ok(exception, 'Health Checks requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('process list separates observed activity from operator actions without completeness claims', async () => {
  const sourcePath = 'docs/dashboard/process-list.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Process List baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'process-list');
  assert.equal(page.effectiveId, 'dashboard/process-list');
  assert.equal(page.slug, '/dashboard/process-list');
  assert.equal(page.publicRoute, '/dashboard/process-list');
  assert.equal(page.h1.text, 'Process List');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);

  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );
  assert.ok(
    source.indexOf('releem-process-list.png') <
      source.indexOf('The Process List can help you investigate:'),
    'Process List screenshot must remain before the four use cases',
  );

  assert.match(
    source,
    /Use Process List to inspect active MySQL connections and running queries reported for the selected server\./u,
  );
  assert.match(
    source,
    /The Process List shows activity to investigate; it does not by itself prove the cause of a database problem or determine whether a connection should be terminated\./u,
  );
  assert.match(
    source,
    /Confirm the workload context and application impact before you terminate a connection or change the database\./u,
  );

  const expectedUseCases = [
    'Identify long-running queries',
    'Detect stuck processes',
    'Troubleshoot bottlenecks',
    'Track connection activity',
  ];
  for (const useCase of expectedUseCases) {
    assert.equal(
      source.split(`- **${useCase}**`).length - 1,
      1,
      `Process List use case must appear once: ${useCase}`,
    );
  }
  assert.match(source, /queries that consume excessive time or resources/iu);
  assert.match(source, /connections that may be stuck/iu);
  assert.match(source, /table locks and query contention/iu);
  assert.match(source, /applications and users are connected/iu);
  assert.match(
    source,
    /\[Show MySQL Process List\]\(https:\/\/releem\.com\/blog\/show-mysql-process-list\)/u,
  );

  assert.doesNotMatch(
    source,
    /\b(?:real-time|all active|complete(?:ness| view| list)?|always|instant(?:ly)?|ensures?|guarantees?)\b/iu,
  );
  assert.doesNotMatch(
    source,
    /Process List (?:diagnos(?:es|ed)|fix(?:es|ed)|resolve(?:s|d)|proves?|identifies? the cause)/iu,
  );

  assert.ok(exception, 'Process List requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('query analytics presents observed evidence and three parallel analysis choices', async () => {
  const sourcePath = 'docs/dashboard/query-analytics.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Query Analytics baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'query-analytics');
  assert.equal(page.effectiveId, 'dashboard/query-analytics');
  assert.equal(page.slug, '/dashboard/query-analytics');
  assert.equal(page.publicRoute, '/dashboard/query-analytics');
  assert.equal(page.h1.text, 'Query Analytics');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);

  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );
  const imageOffsets = [
    'releem-dashboard-query-analytics.png',
    'releem-dashboard-query-analytics.gif',
    'releem-dashboard-query-analytics-inspection.png',
  ].map((image) => source.indexOf(image));
  assert.ok(imageOffsets.every((offset) => offset >= 0));
  assert.deepEqual(imageOffsets, [...imageOffsets].sort((left, right) => left - right));

  assert.match(
    source,
    /Use Query Analytics to review MySQL query activity reported in the Dashboard/iu,
  );
  assert.match(
    source,
    /Query Analytics shows observed activity, while \[Query Optimization\]\(\/recommendations\/query-optimization\) presents proposed changes/iu,
  );
  assert.match(
    source,
    /three tasks are alternatives; choose the one that matches what you need to investigate/iu,
  );

  const expectedColumns = [
    'Count',
    'Average Execution Time',
    'Load on Total Time',
    'Action',
  ];
  const columnOffsets = expectedColumns.map((column) => {
    const token = `- **${column}**`;
    assert.equal(source.split(token).length - 1, 1, `Column must appear once: ${column}`);
    return source.indexOf(token);
  });
  assert.deepEqual(columnOffsets, [...columnOffsets].sort((left, right) => left - right));

  const expectedTasks = [
    'Find slow queries',
    'Find queries with the highest total load time',
    'Inspect query details and request optimization suggestions',
  ];
  const taskOffsets = expectedTasks.map((heading) => {
    const offset = source.indexOf(`## ${heading}`);
    assert.notEqual(offset, -1, `Missing parallel task: ${heading}`);
    return offset;
  });
  assert.deepEqual(taskOffsets, [...taskOffsets].sort((left, right) => left - right));

  assert.match(source, /Click the \*\*Avg\. Execution Time\*\* column heading/iu);
  assert.match(source, /slowest-executing queries listed at the top/iu);
  assert.match(source, /Click the \*\*Load on Total Time\*\* column heading/iu);
  assert.match(source, /queries with the highest cumulative execution time listed at the top/iu);
  assert.match(source, /Click the query in the Query Analytics tab to view the full query statement/iu);
  assert.match(source, /Click \*\*Get Recommendations\*\* to get suggestions on query performance optimization and missed indexes/iu);

  assert.doesNotMatch(
    source,
    /\b(?:all queries|complete query (?:history|data)|real-time|always|guarantees?|causes?)\b/iu,
  );
  assert.doesNotMatch(source, /using the most resources overall/iu);
  assert.doesNotMatch(source, /will (?:improve|optimize|fix|resolve)/iu);

  assert.ok(exception, 'Query Analytics requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('weekly reports presents observed changes without promising performance outcomes', async () => {
  const sourcePath = 'docs/dashboard/reports.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Weekly Reports baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'reports');
  assert.equal(page.effectiveId, 'dashboard/reports');
  assert.equal(page.slug, '/dashboard/reports');
  assert.equal(page.publicRoute, '/dashboard/reports');
  assert.equal(page.h1.text, 'Weekly Reports');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(
    source,
    /The updated report includes data on all servers, unapplied recommendations, the status of the Releem Agent, and performance insights such as changes in Latency and QPS\./u,
  );
  assert.ok(
    source.indexOf('releem-weekly-report.png') <
      source.indexOf('## Overview of Weekly Report Contents'),
    'The report screenshot must remain before the report inventory',
  );

  const reportSections = [...source.matchAll(/^\d+\. \*\*(.+?)\*\*/gmu)]
    .map(([, label]) => label);
  assert.deepEqual(reportSections, [
    'All Servers',
    'Unapplied Recommendations',
    'Releem Agent Status',
    'Performance Insights',
  ]);
  const benefitBullets = [...source.matchAll(/^- \*\*(.+?)\*\*:/gmu)]
    .map(([, label]) => label);
  assert.deepEqual(benefitBullets, [
    'Time Savings',
    'Informed Decision Making',
    'Performance Tracking',
  ]);

  assert.match(source, /summary of all servers being monitored by Releem/iu);
  assert.match(source, /lists any unapplied recommendations generated by Releem/iu);
  assert.match(source, /status of the Releem Agent installed on your servers/iu);
  assert.match(
    source,
    /Releem Weekly Reports include performance insights, such as changes in Latency and QPS\. Compare these reported values with your operational baseline and workload context before using them to assess the effect of an applied recommendation or track server performance over time\./u,
  );
  assert.match(source, /operational baseline and workload context/iu);
  assert.match(source, /applied recommendation/iu);
  assert.match(source, /track server performance over time/iu);
  assert.match(source, /consolidates essential information/iu);
  assert.match(source, /make data-driven decisions/iu);
  assert.match(source, /monitor performance trends and identify areas for improvement/iu);
  assert.match(
    source,
    /Review the reported trends and potential issues against your operational requirements before deciding what to investigate or change\./u,
  );

  assert.equal(source.split('changes in Latency and QPS').length - 1, 2);
  assert.doesNotMatch(source, /Latency and QPS improvements/iu);
  assert.doesNotMatch(source, /gauge the effectiveness/iu);
  assert.doesNotMatch(
    source,
    /ensure your database operates optimally and meets your business requirements/iu,
  );

  assert.ok(exception, 'Weekly Reports requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('schema checks separates detected evidence from proposed SQL and preserves the review workflow', async () => {
  const sourcePath = 'docs/dashboard/schema-checks.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Schema Checks baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'schema-checks');
  assert.equal(page.effectiveId, 'dashboard/schema-checks');
  assert.equal(page.slug, '/dashboard/schema-checks');
  assert.equal(page.publicRoute, '/dashboard/schema-checks');
  assert.equal(page.h1.text, 'Schema Optimization');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);

  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );
  assert.ok(
    source.indexOf('releem-schema-optimization.png') <
      source.indexOf('## Review and apply a schema change'),
    'The Schema Optimization screenshot must remain before the workflow',
  );

  assert.match(
    source,
    /A detected issue describes the database structure that Releem observed\. The provided SQL is a proposed change, not an applied change\./u,
  );
  assert.match(
    source,
    /Review the affected objects and test the proposed SQL before you decide whether to execute it\./u,
  );

  const expectedIssueTypes = [
    'Missing Primary Keys',
    'Duplicate & Unused Indexes',
    'Deprecated Storage Engines',
    'Mixed Character Sets & Collations',
    'Table Fragmentation',
    'Auto Increment Overflow Risks',
  ];
  for (const issueType of expectedIssueTypes) {
    assert.equal(
      source.split(`- **${issueType}**`).length - 1,
      1,
      `Schema issue type must appear once: ${issueType}`,
    );
  }

  const expectedActions = [
    'Open Schema Optimization',
    'Review the detected issue',
    'Review the proposed SQL',
    'Test the proposed SQL',
    'Execute the approved SQL',
  ];
  const actions = [...source.matchAll(/^\d+\. \*\*(.+?)\.\*\*/gmu)]
    .map(([, action]) => action);
  assert.deepEqual(actions, expectedActions);
  assert.match(source, /Navigate to the \*\*Schema Optimization\*\* section in your Releem dashboard/iu);
  assert.match(source, /Review detected issues categorized by type and severity/iu);
  assert.match(source, /Copy the provided SQL statements \(e\.g\., `ALTER TABLE`\)/u);
  assert.match(source, /Test changes in a development environment first/iu);
  assert.match(source, /Execute the SQL on your production database during low-traffic periods/iu);

  for (const link of [
    '[Automatic Schema Changes](/recommendations/query-optimization/automatic-schema-changes)',
    '[Schema Change Troubleshooting](/recommendations/query-optimization/schema-change-troubleshooting)',
    '[MySQL Database Schema Checks](https://releem.com/blog/mysql-database-schema-checks)',
  ]) {
    assert.equal(source.split(link).length - 1, 1, `Follow-up link must appear once: ${link}`);
  }

  assert.doesNotMatch(
    source,
    /\b(?:automatically examines|watchdog|before they become serious|ready-to-use|essential|ensures?|guarantees?|will (?:fix|improve|prevent|resolve))\b/iu,
  );

  assert.ok(exception, 'Schema Checks requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('security checks replaces guarantees with qualified review guidance', async () => {
  const sourcePath = 'docs/dashboard/security-checks.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Security Checks baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'security-checks');
  assert.equal(page.effectiveId, 'dashboard/security-checks');
  assert.equal(page.slug, '/dashboard/security-checks');
  assert.equal(page.publicRoute, '/dashboard/security-checks');
  assert.equal(page.h1.text, 'Security Checks');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);

  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );
  assert.ok(
    source.indexOf('releem-security-checks.png') <
      source.indexOf('[MySQL Security Checks](https://releem.com/blog/mysql-security-checks)'),
    'The Security Checks screenshot must remain before the supplemental article',
  );

  const preservedFirstSentence =
    "Releem's Security Checks feature continuously monitors your MySQL database for security vulnerabilities and misconfigurations that could expose your data to risks.";
  assert.equal(source.split(preservedFirstSentence).length - 1, 1);
  assert.match(
    source,
    /The results help you review identified issues and decide what requires further investigation\./u,
  );
  assert.match(
    source,
    /For detailed information about each security check type, comprehensive remediation steps, and compliance considerations, see the \[MySQL Security Checks\]\(https:\/\/releem\.com\/blog\/mysql-security-checks\) article\./u,
  );
  assert.match(
    source,
    /Review Security Checks and use the linked guidance to assess each identified issue\./u,
  );

  assert.doesNotMatch(
    source,
    /maintain a secure database environment and comply with security best practices|ensures your MySQL database remains protected|maintains compliance with security best practices/iu,
  );
  assert.doesNotMatch(
    source,
    /\b(?:severity|passed|problem detected|not evaluated|data unavailable|certif(?:y|ies)|guarantees?)\b/iu,
  );

  assert.ok(exception, 'Security Checks requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('agent logs routes readers by environment and preserves every inspection command', async () => {
  const sourcePath = 'docs/installation/manage-the-releem-agent/logs.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Agent Logs baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'logs');
  assert.equal(page.effectiveId, 'installation/manage-the-releem-agent/logs');
  assert.equal(page.slug, '/installation/manage-the-releem-agent/logs');
  assert.equal(page.publicRoute, '/installation/manage-the-releem-agent/logs');
  assert.equal(page.h1.text, 'How to Check Releem Agent Logs?');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(
    source,
    /Choose the tab for the environment where the Releem Agent runs\. Use the command or log location in that tab to inspect its logs\./u,
  );
  assert.match(
    source,
    /Before you share log output, review it for sensitive values and customer data, and remove anything you should not disclose\./u,
  );

  const tabOrder = [...source.matchAll(
    /<TabItem value="([^"]+)" label="([^"]+)"(?: default)?>/gu,
  )].map(([, value, label]) => ({value, label}));
  assert.deepEqual(tabOrder, [
    {value: 'debian', label: 'Debian'},
    {value: 'centos', label: 'CentOS'},
    {value: 'aws-rds', label: 'AWS RDS'},
    {value: 'docker', label: 'Docker'},
  ]);

  for (const retainedFact of [
    /Debian-based systems/iu,
    /all log entries related to Releem Agent in the system log/iu,
    /CentOS-based systems/iu,
    /all log entries related to Releem Agent in the system messages log/iu,
    /stored in CloudWatch under the `releem-agent` log group/iu,
    /Open the AWS Console[\s\S]*Navigate to CloudWatch[\s\S]*Go to Log groups[\s\S]*Find and select the `releem-agent` log group/iu,
    /By default, the container name is `releem-agent`/iu,
    /replace `releem-agent` with your container name/iu,
  ]) assert.match(source, retainedFact);

  assert.doesNotMatch(
    source,
    /retention|automatically redact|automatic redaction|automatically upload|uploaded to Releem|support (?:can|will) access|will (?:diagnose|fix|resolve)/iu,
  );

  assert.ok(exception, 'Agent Logs requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('AWS RDS configuration application records current state and makes timing an operator decision', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/apply-manually/aws-rds.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'AWS RDS configuration baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'aws-rds');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/apply-manually/aws-rds',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/apply-manually/aws-rds',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/apply-manually/aws-rds',
  );
  assert.equal(
    page.h1.text,
    'How to apply the Recommended Configuration for AWS RDS',
  );
  assert.deepEqual(page.codeFences, baselinePage.codeFences);
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(
    source,
    /Before you begin, record the parameter group assigned to your RDS instance and its current parameter values\./u,
  );
  assert.match(
    source,
    /Use this record to compare the configuration after the change and to plan recovery if needed\. Recording it does not guarantee that a change can be reversed\./u,
  );
  assert.match(
    source,
    /Before you save, choose whether to apply the changes immediately or during the next maintenance window\./u,
  );
  assert.match(
    source,
    /Coordinate the reboot with the application timing you chose in Step 2\./u,
  );

  const retainedFactsInOrder = [
    'Log in to the AWS Management Console.',
    'Navigate to the RDS Dashboard.',
    'Select **Parameter Groups** from the left-hand menu under Databases.',
    'Identify the parameter group assigned to your RDS instance',
    'Select your parameter group and click **Edit Parameters**.',
    'Update the parameters based on the recommended configuration from **Releem Dashboard**.',
    'Save the changes.',
    'Go back to the RDS Dashboard and select your database instance.',
    'Click on the **Modify** button.',
    'In the Database options section, select the updated parameter group.',
    'Before you save, choose whether to apply the changes immediately or during the next maintenance window.',
    '5. Save the changes.',
    'Coordinate the reboot with the application timing you chose in Step 2.',
    'In the RDS Dashboard, select your instance.',
    'Click **Actions → Reboot**.',
    'This will apply the new parameter settings.',
    'You should see event **Applied recommended configuration** on the MySQL Metrics graph.',
    'For additional help, feel free to contact **Releem support**.',
  ];
  let previousOffset = -1;
  for (const retainedFact of retainedFactsInOrder) {
    const offset = source.indexOf(retainedFact);
    assert.ok(offset > previousOffset, `Missing or reordered AWS RDS fact: ${retainedFact}`);
    previousOffset = offset;
  }

  assert.doesNotMatch(
    source,
    /(?:guaranteed|without downtime|no downtime|safe to apply|automatically reversible|automatic rollback|improves? performance)/iu,
  );

  assert.ok(exception, 'AWS RDS configuration requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('Docker configuration application identifies the target file and container before restart', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/apply-manually/docker.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'Docker configuration baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'docker');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/apply-manually/docker',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/apply-manually/docker',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/apply-manually/docker',
  );
  assert.equal(
    page.h1.text,
    'How to apply the Recommended Configuration for MySQL in Docker',
  );
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(
    source,
    /Identify the `my\.cnf` file used by the target MySQL container\./u,
  );
  assert.match(
    source,
    /Paste the copied configuration at the end of that file\./u,
  );
  assert.match(
    source,
    /Before restarting, review the pasted settings and confirm that `<container_name_or_id>` identifies the MySQL container you intend to restart\./u,
  );

  const retainedFactsInOrder = [
    'Follow these steps to apply the recommended configuration for MySQL in Docker:',
    '## Step 1: Copy the Recommended Configuration',
    '1. Log in to the Releem dashboard.',
    '2. Open **Configuration** in the **Recommended Configuration** block.',
    '3. Click the **Copy** icon to copy the recommended configuration.',
    '## Step 2: Modify the my.cnf file',
    '## Step 3: Restart Docker container',
    'Restart your MySQL Docker container to apply the new configuration:',
    'docker restart <container_name_or_id>',
    '## Step 4: Verify the Applied Configuration',
    'You should see event **Applied recommended configuration** on the MySQL Metrics graph.',
    'For additional help, feel free to contact **Releem support**.',
  ];
  let previousOffset = -1;
  for (const retainedFact of retainedFactsInOrder) {
    const offset = source.indexOf(retainedFact);
    assert.ok(offset > previousOffset, `Missing or reordered Docker fact: ${retainedFact}`);
    previousOffset = offset;
  }

  assert.doesNotMatch(
    source,
    /(?:automatically discovers?|mounted at|persist(?:s|ed|ence)|without downtime|no downtime|safe to apply|automatically reversible|automatic rollback|improves? performance)/iu,
  );

  assert.ok(exception, 'Docker configuration requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('GCP Cloud SQL configuration separates provider confirmation from Releem verification', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    ({sourcePath: candidatePath}) => candidatePath === sourcePath,
  );

  assert.ok(baselinePage, 'GCP Cloud SQL configuration baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'gcp-cloud-sql');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/apply-manually/gcp-cloud-sql',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/apply-manually/gcp-cloud-sql',
  );
  assert.equal(
    page.h1.text,
    'How to apply the Recommended Configuration for GCP Cloud SQL',
  );
  assert.deepEqual(page.codeFences, baselinePage.codeFences);
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(
    source,
    /Before you change the instance, decide whether to apply the changes immediately or during the next maintenance window \(if this option is available for your instance\)\./u,
  );
  assert.ok(
    source.indexOf('Before you change the instance') < source.indexOf('Click **Save**'),
    'The application-timing decision must appear before the reader saves changes',
  );
  assert.match(
    source,
    /In the Google Cloud Console, before you click \*\*Save\*\*, choose one of the timing options available for your instance:[\s\S]*\*\*Apply immediately\*\*\.[\s\S]*\*\*Schedule during the next maintenance window\*\*, if this option is available for your instance\./u,
  );
  assert.match(
    source,
    /For either timing choice, Cloud SQL may automatically restart the instance if required, as described in Step 3\./u,
  );
  assert.match(source, /### Confirm the flags in Google Cloud/u);
  assert.match(source, /### Verify the application event in Releem/u);
  assert.ok(
    source.indexOf('### Confirm the flags in Google Cloud') <
      source.indexOf('### Verify the application event in Releem'),
    'Provider confirmation must precede Releem verification',
  );

  const retainedFactsInOrder = [
    'Use Database Flags to apply the recommended configuration.',
    '## Step 1: Get the Recommended Configuration',
    '1. Log in to the Releem dashboard.',
    '2. Open **Configuration** in the **Recommended Configuration** block.',
    '3. Review the recommended parameters that need to be applied as database flags.',
    '## Step 2: Configure Database Flags in GCP Cloud SQL',
    '1. Log in to the **Google Cloud Console**.',
    '2. Navigate to the **Cloud SQL Instances** page.',
    '3. Select the project that contains your Cloud SQL instance.',
    '4. Click on your MySQL instance name to open the **Instance Overview** page.',
    '5. Click the **Edit** button at the top of the page.',
    '6. Scroll down to the **Flags** section.',
    '7. Configure the database flags:',
    'To set a new flag: Click **Add item**, choose the flag from the drop-down menu, and set its value based on the Releem recommendations.',
    'To modify an existing flag: Update its value according to the Releem recommendations.',
    '8. In the Google Cloud Console, before you click **Save**, choose one of the timing options available for your instance:',
    '**Apply immediately**.',
    '**Schedule during the next maintenance window**, if this option is available for your instance.',
    'For either timing choice, Cloud SQL may automatically restart the instance if required, as described in Step 3.',
    '9. Click **Save** to apply your changes.',
    '## Step 3: Apply the Changes',
    'At the timing you selected, GCP Cloud SQL will automatically restart your instance if required to apply the configuration changes.',
    'Wait for the instance to complete the restart process.',
    '## Step 4: Verify the Applied Configuration',
    'On the **Instance Overview** page, check the **Database flags** section to confirm the flags have been applied.',
    '1. You should see event **Applied recommended configuration** on the MySQL Metrics graph in the Releem Dashboard.',
    'Database flags are persisted for the instance until you manually remove them. Some flags may require the instance to be restarted for changes to take effect.',
    'For additional help, feel free to contact **Releem support**.',
  ];
  let previousOffset = -1;
  for (const retainedFact of retainedFactsInOrder) {
    const offset = source.indexOf(retainedFact);
    assert.ok(offset > previousOffset, `Missing or reordered GCP Cloud SQL fact: ${retainedFact}`);
    previousOffset = offset;
  }

  assert.doesNotMatch(
    source,
    /(?:guaranteed|without downtime|no downtime|safe to apply|automatically reversible|automatic rollback|propagation time|improves? performance)/iu,
  );

  assert.ok(exception, 'GCP Cloud SQL configuration requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('Windows configuration application identifies the active file and reviews settings before saving', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/apply-manually/windows.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Windows configuration baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'windows');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/apply-manually/windows',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/apply-manually/windows',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/apply-manually/windows',
  );
  assert.equal(
    page.h1.text,
    'How to apply the Recommended Configuration for Windows',
  );
  assert.deepEqual(page.codeFences, baselinePage.codeFences);
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(source, /## Before you begin/u);
  assert.match(
    source,
    /Do not continue until you have confirmed which `my\.ini` file the selected MySQL service uses\./u,
  );
  assert.match(
    source,
    /Review the exact recommended settings in Releem before you copy them\. After you paste them into `my\.ini`, check them again before you save the file\./u,
  );
  assert.ok(
    source.indexOf('## Before you begin') <
      source.indexOf('## Step 1: Copy the Recommended Configuration'),
    'Windows prerequisites must precede the procedure',
  );
  assert.ok(
    source.indexOf('check them again before you save the file') <
      source.indexOf('4. Save the file using the **ANSI charset**:'),
    'The settings review must precede the save action',
  );

  const retainedFactsInOrder = [
    'Follow these steps to apply the recommended configuration for MySQL on Windows:',
    '## Step 1: Copy the Recommended Configuration',
    '1. Log in to the **Releem dashboard**.',
    '2. Open **Configuration** in the **Recommended Configuration** block.',
    '3. Click the **Copy** icon to copy the recommended configuration.',
    '## Step 2: Modify the my.ini File',
    '1. Locate the my.ini file on your system:',
    'Typically located in the MySQL installation directory (e.g., `C:\\Program Files\\MySQL\\MySQL Server X.X\\my.ini`) or under `C:\\ProgramData\\MySQL\\my.ini`.',
    '2. Open the my.ini file using a text editor like **Notepad**.',
    '3. Paste the copied configuration at the end of the file.',
    '4. Save the file using the **ANSI charset**:',
    'In Notepad, go to **File → Save As**.',
    'In the "Encoding" dropdown, select **ANSI**, then click **Save**.',
    '## Step 3: Restart the MySQL Database Service',
    '1. Open the **Services** application in Windows:',
    'Press `Win + R`, type `services.msc`, and press Enter.',
    '2. Find the MySQL service in the list (e.g., MySQL or MySQL80).',
    '3. Right-click on the service and select **Restart**.',
    '## Step 4: Verify the Applied Configuration',
    'You should see the event **Configuration was applied successfully** on the MySQL Metrics graph.',
    'For additional help, feel free to contact **Releem support**.',
  ];
  let previousOffset = -1;
  for (const retainedFact of retainedFactsInOrder) {
    const offset = source.indexOf(retainedFact);
    assert.ok(offset > previousOffset, `Missing or reordered Windows fact: ${retainedFact}`);
    previousOffset = offset;
  }

  assert.doesNotMatch(
    source,
    /(?:automatically (?:find|detect|back up)|guaranteed|without downtime|no downtime|safe to apply|automatically reversible|automatic rollback|improves? performance)/iu,
  );

  assert.ok(exception, 'Windows configuration requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('Agent configuration application defines preflight and a bounded expected result', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/apply-using-agent.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Agent configuration baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'apply-using-agent');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/apply-using-agent',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/apply-using-agent',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/apply-using-agent',
  );
  assert.equal(page.h1.text, 'How to Apply Configuration Using Agent');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(source, /## Before you begin/u);
  assert.match(
    source,
    /Confirm that the database server is self-managed, uses MySQL, MariaDB, or Percona, and has Releem Agent installed directly on the database host\./u,
  );
  assert.ok(
    source.indexOf('## Before you begin') < source.indexOf('## Apply the configuration'),
    'Agent preflight must precede the application commands',
  );
  assert.match(source, /## Expected result/u);
  assert.match(
    source,
    /When the command completes successfully, Releem Agent has applied the recommended configuration\./u,
  );
  assert.match(
    source,
    /If you need to return to the previous configuration, follow \[How to Rollback to Previous Configuration\]\(\/recommendations\/configuration-tuning\/rollback\)\./u,
  );

  const retainedFactsInOrder = [
    'Use this method for self-managed MySQL, MariaDB, or Percona servers where Releem Agent is installed directly on the database host.',
    'bash /opt/releem/mysqlconfigurer.sh -s auto',
    "& 'C:\\Program Files\\ReleemAgent\\mysqlconfigurer.ps1' -a",
    '## Expected result',
    '## Cloud-Managed Databases',
    'For AWS RDS, GCP Cloud SQL, and Azure Database for MySQL, apply recommended configuration from the Releem Portal.',
    'The agent receives the task from the portal and uses the cloud provider API to update database parameters.',
  ];
  let previousOffset = -1;
  for (const retainedFact of retainedFactsInOrder) {
    const offset = source.indexOf(retainedFact);
    assert.ok(offset > previousOffset, `Missing or reordered Agent fact: ${retainedFact}`);
    previousOffset = offset;
  }

  assert.doesNotMatch(
    source,
    /(?:issues arise|smartly revert|guaranteed|without downtime|no downtime|safe to apply|automatically reversible|automatic rollback|restart required|no restart|improves? performance)/iu,
  );

  assert.ok(exception, 'Agent configuration requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('configuration example is explicitly illustrative while preserving the sample', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/configuration-example.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Configuration example baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'configuration-example');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/configuration-example',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/configuration-example',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/configuration-example',
  );
  assert.equal(page.h1.text, 'Example of Recommended Configuration');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );

  assert.match(
    source,
    /This example is illustrative only\. Do not copy or apply it to a database server\./u,
  );
  assert.match(
    source,
    /Each line shows an example recommended value, followed by the `Previous value` paired with that setting in this example\./u,
  );
  assert.ok(
    source.indexOf('This example is illustrative only.') <
      source.indexOf('releem-dashboard-recommended-configuration.png'),
    'The non-runnable label must appear before the example screenshot',
  );
  assert.ok(
    source.indexOf('`Previous value`') < source.indexOf('```\n[mysqld]'),
    'The Previous value explanation must appear before the sample',
  );
  assert.doesNotMatch(
    source,
    /(?:collected from|captured from|applies to every|use this in production|run this configuration|copy this configuration|safe to apply|automatically reversible|guaranteed|improves? performance|optimizes? performance)/iu,
  );

  assert.ok(exception, 'Configuration example requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('MySQL memory limit is explained as a tuning target rather than an enforced cap', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/limit-mysql-memory.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'MySQL memory-limit baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'limit-mysql-memory');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/limit-mysql-memory',
  );
  assert.equal(
    page.slug,
    '/recommendations/configuration-tuning/limit-mysql-memory',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/configuration-tuning/limit-mysql-memory',
  );
  assert.equal(page.h1.text, 'Limit Memory for MySQL');
  assert.deepEqual(page.codeFences, baselinePage.codeFences);
  const imageContract = ({syntax, reference, assetPath, altText}) => ({
    syntax,
    reference,
    assetPath,
    altText,
  });
  assert.deepEqual(
    page.images.map(imageContract),
    baselinePage.images.map(imageContract),
  );

  assert.match(
    source,
    /The Memory Limit setting is a tuning target, not an enforced process or system memory cap\./u,
  );
  assert.ok(
    source.indexOf('The Memory Limit setting is a tuning target') <
      source.indexOf('To set the memory limit follow the steps below:'),
    'The target-versus-cap explanation must precede the steps',
  );

  const retainedFactsInOrder = [
    '1. Open the Dashboard->Recommended Configuration->Settings',
    '![Releem Dashboard Recommended Configuration Settings](/img/dashboard-settings.png)',
    '2. Set new Memory Limit in Megabytes',
    '3. Click Save Changes button',
    'It takes up to 12 hours to update limit in the dashboard and up to 4 days to get first recommendations.',
    '## FAQ',
    '### I’ve set the MySQL Memory Limit to 6144 MB, but MySQL is using about 11 GB of 16 GB RAM (≈67%). Shouldn’t it be capped at 40%?',
    'The Memory Limit isn’t a hard cap - it’s a target for tuning. Releem adjusts MySQL settings to keep memory usage near this value under normal load, but actual usage depends on active connections and per-query buffers. When many queries run, MySQL can use more memory.',
    'If usage stays high, try lowering the limit or reviewing connection counts.',
  ];
  let previousOffset = -1;
  for (const retainedFact of retainedFactsInOrder) {
    const offset = source.indexOf(retainedFact);
    assert.ok(offset > previousOffset, `Missing or reordered memory-limit fact: ${retainedFact}`);
    previousOffset = offset;
  }

  assert.doesNotMatch(
    source,
    /(?:enforced (?:process|system) cap|operating-system cap|guaranteed|ensures?|cannot exceed|will not exceed|always stays|restart required|no restart|improves? performance|optimizes? performance)/iu,
  );

  assert.ok(exception, 'MySQL memory limit requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('MySQL tuning process separates analysis from application and retains all five stages', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/mysql-tuning-process.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  const retainedStagesInOrder = [
    '### Stage 1: Collecting Baseline',
    '### Stage 2: Searching for Opportunities',
    '### Stage 3: Expert System Evaluation',
    '### Stage 4: Preparing New Configuration',
    '### Stage 5: Applying Recommended Configuration',
  ];
  let previousOffset = -1;
  for (const stage of retainedStagesInOrder) {
    const offset = source.indexOf(stage);
    assert.ok(offset > previousOffset, `Missing or reordered tuning stage: ${stage}`);
    previousOffset = offset;
  }

  for (const retainedFact of [
    'baseline data over several days',
    'different controlled workloads',
    'Free plan, Releem tunes only 10 MySQL variables',
    'Premium plan offers tuning of more variables',
    "platform's expert system",
    'Recommended Configuration block',
    'manually or using the Releem Agent',
    'server type and installation method',
    'up to 12 hours',
    'unapplied recommendations count',
  ]) assert.ok(source.includes(retainedFact), `Missing tuning-process fact: ${retainedFact}`);

  assert.match(source, /separates analysis from application/iu);
  assert.match(source, /identifies candidates; it does not apply them/iu);
  assert.match(source, /proposal for you to review/iu);
  assert.match(source, /Review the recommended configuration and decide how to apply it/iu);
  assert.doesNotMatch(
    source,
    /(?:ensures? that|verified the safety|optimized safely|maintain peak performance|zero risk|guaranteed)/iu,
  );

  assert.ok(exception, 'MySQL tuning process requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('configuration rollback defines its bounded scope and a failure path', async () => {
  const sourcePath = 'docs/recommendations/configuration-tuning/rollback.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Configuration rollback baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'rollback');
  assert.equal(
    page.effectiveId,
    'recommendations/configuration-tuning/rollback',
  );
  assert.equal(page.slug, '/recommendations/configuration-tuning/rollback');
  assert.equal(page.publicRoute, '/recommendations/configuration-tuning/rollback');
  assert.equal(page.h1.text, 'How to Rollback to Previous Configuration');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.deepEqual(page.images, baselinePage.images);

  assert.match(
    source,
    /Use this command to roll back to the previous configuration\. This page does not define the exact settings or values in that previous configuration\./u,
  );
  assert.match(source, /## Run the rollback command/u);
  assert.match(source, /## If the rollback fails/u);
  assert.match(
    source,
    /review the \[Releem Agent logs\]\(\/installation\/manage-the-releem-agent\/logs\) and contact Releem support with the relevant log details\./u,
  );

  const retainedCommand = '/bin/bash /opt/releem/mysqlconfigurer.sh -r';
  assert.equal(source.split(retainedCommand).length - 1, 1);
  assert.ok(
    source.indexOf('## Run the rollback command') < source.indexOf(retainedCommand),
    'The rollback command must remain in its action context',
  );
  assert.ok(
    source.indexOf(retainedCommand) < source.indexOf('## If the rollback fails'),
    'The failure path must follow the rollback command',
  );
  assert.doesNotMatch(
    source,
    /(?:all settings|exact state|fully restores?|complete rollback|automatically rolls? back|guaranteed|without downtime|no downtime|safe to apply|automatically reversible|improves? performance)/iu,
  );

  assert.ok(exception, 'Configuration rollback requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('disabling Query Optimization has an observable check and explicit unresolved boundaries', async () => {
  const sourcePath = 'docs/recommendations/query-optimization/disable.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Query Optimization disable baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'disable');
  assert.equal(page.effectiveId, 'recommendations/query-optimization/disable');
  assert.equal(page.slug, '/recommendations/query-optimization/disable');
  assert.equal(page.publicRoute, '/recommendations/query-optimization/disable');
  assert.equal(page.h1.text, 'Disable SQL Query Optimization');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.equal(page.codeFences.length, 7);
  assert.deepEqual(page.images, baselinePage.images);

  const expectedTabs = [
    ['linux', 'Linux'],
    ['docker', 'Docker'],
    ['aws-rds', 'AWS RDS'],
    ['gcp-cloudsql', 'GCP Cloud SQL'],
    ['azure-mysql', 'Azure MySQL'],
    ['windows', 'Windows'],
  ];
  let previousTabOffset = -1;
  for (const [value, label] of expectedTabs) {
    const tab = `<TabItem value="${value}" label="${label}"`;
    const offset = source.indexOf(tab);
    assert.ok(offset > previousTabOffset, `Missing or reordered deployment tab: ${label}`);
    previousTabOffset = offset;
  }

  for (const retainedFact of [
    'query_optimization=false',
    'systemctl restart releem-agent',
    'RELEEM_QUERY_OPTIMIZATION=false',
    'QueryOptimization` to `false',
    'C:\\ProgramData\\ReleemAgent\\releem.conf',
  ]) assert.ok(source.includes(retainedFact), `Missing disable workflow fact: ${retainedFact}`);

  assert.match(source, /## Verify the change/u);
  assert.match(
    source,
    /confirm that the Releem Agent service or container is running after the restart or recreation/iu,
  );
  assert.match(
    source,
    /verify that the active configuration uses `query_optimization=false`, `RELEEM_QUERY_OPTIMIZATION=false`, or `QueryOptimization` set to `false`/u,
  );
  assert.match(
    source,
    /procedure does not establish whether disabling Query Optimization deletes previously collected query data or revokes database permissions/iu,
  );
  assert.match(source, /Do not assume that either action occurs./u);
  assert.doesNotMatch(
    source,
    /(?:immediately|instant(?:ly)?|guaranteed|deletes? (?:all )?(?:retained|previously collected) data|automatically revokes?|restarts? without downtime|fully reversible|safe to disable)/iu,
  );

  assert.ok(exception, 'Query Optimization disable requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('Query Optimization separates observation, proposal, manual implementation, and validation', async () => {
  const sourcePath = 'docs/recommendations/query-optimization/overview.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Query Optimization overview baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'overview');
  assert.equal(page.effectiveId, 'recommendations/query-optimization/overview');
  assert.equal(page.slug, '/recommendations/query-optimization');
  assert.equal(page.publicRoute, '/recommendations/query-optimization');
  assert.equal(page.h1.text, 'SQL Query Optimization');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.deepEqual(
    page.images.map(({syntax, reference, assetPath, altText}) => ({
      syntax,
      reference,
      assetPath,
      altText,
    })),
    baselinePage.images.map(({syntax, reference, assetPath, altText}) => ({
      syntax,
      reference,
      assetPath,
      altText,
    })),
  );
  assert.deepEqual(baselinePage.internalLinks, []);
  assert.deepEqual(
    page.internalLinks.map(({label, target}) => ({label, target})),
    [
      {
        label: 'Automatic Schema Changes',
        target: '/recommendations/query-optimization/automatic-schema-changes',
      },
    ],
  );

  const phasesInOrder = [
    '### 1. Observe query data',
    '### 2. Review the proposed optimization',
    '### 3. Implement the change manually',
    '### 4. Validate the result',
  ];
  let previousPhaseOffset = -1;
  for (const phase of phasesInOrder) {
    const offset = source.indexOf(phase);
    assert.ok(offset > previousPhaseOffset, `Missing or reordered phase: ${phase}`);
    previousPhaseOffset = offset;
  }

  for (const retainedFact of [
    'top 100 queries',
    'top 100 slowest queries',
    '**"New"** status',
    '**email**',
    'Query Optimization tab',
    'Ready-to-use `CREATE INDEX` statements',
    'CREATE INDEX idx_user_email ON users(email);',
    'CREATE INDEX idx_order_date_status ON orders(order_date, status);',
    '**Optimized**',
    'follow-up reports',
    'Reduced query execution times',
    'Lower server load',
    '## Manual Query Optimization',
    '**Query Analytics tab**',
    '**Get Recommendations** button',
    'there are no recommendations yet',
    'actively developing new features or troubleshooting specific queries',
  ]) assert.ok(source.includes(retainedFact), `Missing Query Optimization fact: ${retainedFact}`);

  assert.match(
    source,
    /Query Analytics shows observed query activity; Query Optimization presents a proposed change for you to review/iu,
  );
  assert.match(
    source,
    /In the manual workflow described below, you execute the proposed SQL statement yourself\./u,
  );
  assert.match(
    source,
    /Releem documents Agent-applied schema recommendations separately in \[Automatic Schema Changes\]\(\/recommendations\/query-optimization\/automatic-schema-changes\)\./u,
  );
  assert.doesNotMatch(source, /Releem does not execute the SQL statement in this workflow/iu);
  assert.match(
    source,
    /Compare the reported execution time and server load with the values you observed before the change/iu,
  );
  assert.doesNotMatch(
    source,
    /(?:guaranteed|zero risk|risk[- ]free|automatically applies?|automatically executes?|automatic rollback|safe to apply|always improves?|ensures? (?:an )?improvement)/iu,
  );

  assert.ok(exception, 'Query Optimization overview requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('prepared-statement guidance separates the limitation from tested client workarounds', async () => {
  const sourcePath = 'docs/recommendations/query-optimization/prepared-statements.md';
  const source = await readFile(path.join(projectRoot, sourcePath), 'utf8');
  const page = parseDocument(sourcePath, source);
  const baselinePage = manifest.pages.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );
  const exception = manifest.editorialExceptions.find(
    (candidate) => candidate.sourcePath === sourcePath,
  );

  assert.ok(baselinePage, 'Prepared-statements baseline record is missing');
  assert.equal(page.frontMatter, baselinePage.frontMatter);
  assert.equal(page.explicitId, 'prepared-statements');
  assert.equal(
    page.effectiveId,
    'recommendations/query-optimization/prepared-statements',
  );
  assert.equal(
    page.slug,
    '/recommendations/query-optimization/prepared-statements',
  );
  assert.equal(
    page.publicRoute,
    '/recommendations/query-optimization/prepared-statements',
  );
  assert.equal(page.h1.text, 'Prepared Statements and Query Analytics');
  assert.deepEqual(
    page.codeFences.map(fenceSnapshot),
    baselinePage.codeFences.map(fenceSnapshot),
  );
  assert.equal(page.codeFences.length, 1);
  assert.deepEqual(page.images, baselinePage.images);

  for (const retainedFact of [
    'Prepared statements in MySQL',
    'MySQL/MariaDB',
    'Incomplete Query Analytics',
    'Missing Query Optimization Suggestions',
    'Inaccurate Latency Measurements',
    'MariaDB development team',
    'MariaDB developers mailing list',
    'client-side prepared statements',
    'PDO::ATTR_EMULATE_PREPARES',
    'php artisan config:cache',
    'MySQL JDBC',
    'cachePrepStmts',
    'useServerPrepStmts',
    'https://vladmihalcea.com/mysql-jdbc-statement-caching/',
  ]) assert.ok(source.includes(retainedFact), `Missing prepared-statement fact: ${retainedFact}`);

  assert.match(source, /## Documented limitation/u);
  assert.match(source, /## Client-side workarounds/u);
  assert.ok(
    source.indexOf('## Documented limitation') <
      source.indexOf('## Client-side workarounds'),
    'The documented limitation must precede the client-side workarounds',
  );
  assert.match(
    source,
    /Test any client-setting change in a non-production environment first\./u,
  );
  assert.match(
    source,
    /Record the previous setting so you can restore it if Query Analytics does not show the expected queries or application behavior changes\./u,
  );
  assert.doesNotMatch(
    source,
    /(?:guaranteed|zero risk|risk[- ]free|safe to change|always (?:works|improves)|ensur(?:e|es|ing) that all|improving overall database performance|automatically reverses?|supported by every driver)/iu,
  );

  assert.ok(exception, 'Prepared statements requires an exact editorial exception');
  assert.equal(exception.status, 'approved');
  assert.equal(exception.approvedBy, 'user');
  assert.equal(exception.approvedOn, '2026-09-05');
  assert.equal(page.sourceSha256, exception.approvedCurrent.sourceSha256);
});

test('manifest completely describes the committed preservation baseline', () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.baseline.commit, baselineRevision);
  assert.equal(manifest.baseline.pageCount, expectedPageCount);
  assert.equal(manifest.baseline.assetCount, expectedAssetCount);
  assert.equal(manifest.pages.length, expectedPageCount);
  assert.equal(manifest.assets.length, expectedAssetCount);
  assert.ok(Array.isArray(manifest.editorialExceptions));
  assert.ok(Array.isArray(manifest.routeExceptions));
  assert.ok(Array.isArray(manifest.safetyExceptions));
  assert.ok(Array.isArray(manifest.sidebarExceptions));
  validatePreservationExceptions(manifest);
  assert.equal(new Set(manifest.pages.map(({sourcePath}) => sourcePath)).size, expectedPageCount);
  assert.equal(new Set(manifest.assets.map(({assetPath}) => assetPath)).size, expectedAssetCount);
  for (const page of manifest.pages) {
    for (const field of [
      'sourcePath', 'frontMatter', 'effectiveId', 'publicRoute',
      'sourceSha256', 'bodySha256', 'bodyWithoutCodeFencesSha256',
      'bodyWithoutCodeFenceContentsSha256',
    ]) assert.ok(page[field], `${page.sourcePath} is missing ${field}`);
    assert.match(page.sourceSha256, /^[a-f0-9]{64}$/u);
    assert.match(page.bodyWithoutCodeFencesSha256, /^[a-f0-9]{64}$/u);
    assert.match(page.bodyWithoutCodeFenceContentsSha256, /^[a-f0-9]{64}$/u);
    for (const field of [
      'headings', 'internalLinks', 'codeFences', 'images',
      'procedureHeadings', 'recoveryHeadings', 'sidebarOwnership',
    ]) assert.ok(Array.isArray(page[field]), `${page.sourcePath} is missing ${field}`);
    for (const fence of page.codeFences) {
      assert.ok(Number.isInteger(fence.lineNumber));
      assert.ok(typeof fence.openingLine === 'string');
      assert.ok(typeof fence.closingLine === 'string');
      assert.match(fence.contentSha256, /^[a-f0-9]{64}$/u);
    }
    for (const image of page.images) {
      assert.ok(Number.isInteger(image.lineNumber));
      assert.ok(Object.hasOwn(image, 'altText'));
      assert.ok(
        manifest.assets.some(({assetPath}) => assetPath === image.assetPath),
        `${page.sourcePath} references an untracked asset: ${image.assetPath}`,
      );
    }
    assert.ok(page.h1, `${page.sourcePath} is missing its committed H1 record`);
    assert.ok(page.sidebarOwnership.length > 0, `${page.sourcePath} has no baseline sidebar owner`);
  }
  const pageImageCount = manifest.pages.reduce(
    (count, page) => count + page.images.length,
    0,
  );
  const assetReferenceCount = manifest.assets.reduce(
    (count, asset) => count + asset.references.length,
    0,
  );
  assert.equal(assetReferenceCount, pageImageCount);
  for (const asset of manifest.assets) {
    const expectedReferences = manifest.pages.flatMap((page) =>
      page.images
        .filter(({assetPath}) => assetPath === asset.assetPath)
        .map((image) => ({
          pageSourcePath: page.sourcePath,
          reference: image.reference,
          altText: image.altText,
          lineNumber: image.lineNumber,
        })),
    );
    assert.deepEqual(asset.references, expectedReferences);
    assert.deepEqual(
      asset.usedBy,
      [...new Set(expectedReferences.map(({pageSourcePath}) => pageSourcePath))],
    );
    assert.match(asset.sha256, /^[a-f0-9]{64}$/u);
  }
});

test('engine-first preservation mappings retain the exact evidence-bounded fence sequence per destination', async () => {
  assert.equal(
    existsSync(engineFirstManifestPath),
    true,
    'Create .agent/analysis/2026-09-10-engine-first-installation-manifest.json',
  );
  const overlay = JSON.parse(await readFile(engineFirstManifestPath, 'utf8'));
  assert.equal(manifest.baseline.pageCount, 54);
  assert.equal(manifest.pages.length, 54);
  assert.equal(overlay.historicalBaselinePageCount, 54);
  assert.equal(overlay.currentPageCount, 63);
  assert.deepEqual(overlay.retiredSources, engineFirstRetiredSources);

  const frozenSourceContents = new Map(
    engineFirstRetiredSources.map((sourcePath) => [
      sourcePath,
      execFileSync('git', ['show', `${engineFirstSourceRevision}:${sourcePath}`], {
        cwd: projectRoot,
        encoding: 'utf8',
      }),
    ]),
  );
  const frozenSourceSections = new Map();
  for (const [sourcePath, contents] of frozenSourceContents) {
    assert.equal(
      sha256(contents),
      engineFirstSourceHashes.get(sourcePath),
      `${sourcePath} no longer matches the frozen engine-first source evidence`,
    );
    const sections = sectionInventory(sourcePath, contents);
    frozenSourceSections.set(sourcePath, sections);
    assert.equal(sections[0].heading, null, `${sourcePath} must begin with a preamble section`);
  }

  assert.ok(Array.isArray(overlay.sectionMappings));
  const sectionKey = (sourcePath, heading) =>
    `${sourcePath}\0${heading ?? '<preamble>'}`;
  const expectedSectionKeys = [...frozenSourceSections]
    .flatMap(([sourcePath, sections]) =>
      sections.map(({heading}) => sectionKey(sourcePath, heading)),
    )
    .sort();
  const actualSectionKeys = [...new Set(overlay.sectionMappings.map(
    ({sourcePath, sourceHeading}) => sectionKey(sourcePath, sourceHeading),
  ))].sort();
  assert.deepEqual(
    actualSectionKeys,
    expectedSectionKeys,
    'Every retired-source preamble and H2/H3 needs a section disposition, with no invented source section',
  );
  const installationSources = new Set(
    overlay.installationDocuments.map(({sourcePath}) => sourcePath),
  );
  const destinationContents = new Map();
  const destinationSections = new Map();
  const mappingKeys = new Set();
  const mappingsBySection = new Map();
  for (const mapping of overlay.sectionMappings) {
    assert.deepEqual(Object.keys(mapping).sort(), [
      'destinationHeading',
      'destinationMarkers',
      'destinationSource',
      'disposition',
      'reason',
      'sourceHeading',
      'sourceMarkers',
      'sourcePath',
    ]);
    assert.ok(['preserve', 'rewrite', 'exclude'].includes(mapping.disposition));
    assert.equal(typeof mapping.reason, 'string');
    assert.ok(mapping.reason.trim().length >= 12, 'Each section disposition needs a useful reason');
    const sourceSection = frozenSourceSections.get(mapping.sourcePath)
      ?.find(({heading}) => heading === mapping.sourceHeading);
    assert.ok(sourceSection, `Unknown source section: ${mapping.sourcePath} ${mapping.sourceHeading}`);
    assert.ok(Array.isArray(mapping.sourceMarkers));
    assert.ok(Array.isArray(mapping.destinationMarkers));
    assert.equal(mapping.sourceMarkers.length, mapping.destinationMarkers.length);
    const sourceSectionKey = sectionKey(mapping.sourcePath, mapping.sourceHeading);
    const sectionMappings = mappingsBySection.get(sourceSectionKey) ?? [];
    sectionMappings.push(mapping);
    mappingsBySection.set(sourceSectionKey, sectionMappings);
    if (mapping.disposition === 'exclude') {
      assert.equal(mapping.destinationSource, null);
      assert.equal(mapping.destinationHeading, null);
      assert.deepEqual(mapping.sourceMarkers, []);
      assert.deepEqual(mapping.destinationMarkers, []);
      continue;
    }
    assert.equal(
      installationSources.has(mapping.destinationSource),
      true,
      `Unknown section destination: ${mapping.destinationSource}`,
    );
    assert.ok(
      mapping.destinationHeading === null || /^#{2,3}\s+\S/u.test(mapping.destinationHeading),
    );
    assert.ok(mapping.sourceMarkers.length > 0);
    if (mapping.disposition === 'preserve') {
      assert.deepEqual(mapping.destinationMarkers, mapping.sourceMarkers);
    }
    const mappingKey = `${sourceSectionKey}\0${mapping.destinationSource}`;
    assert.equal(mappingKeys.has(mappingKey), false, `Duplicate section mapping: ${mappingKey}`);
    mappingKeys.add(mappingKey);
    if (!destinationContents.has(mapping.destinationSource)) {
      const contents = await readFile(path.join(projectRoot, mapping.destinationSource), 'utf8');
      destinationContents.set(mapping.destinationSource, contents);
      destinationSections.set(
        mapping.destinationSource,
        sectionInventory(mapping.destinationSource, contents),
      );
    }
    const destinationSection = destinationSections.get(mapping.destinationSource)
      .find(({heading}) => heading === mapping.destinationHeading);
    assert.ok(
      destinationSection,
      `${mapping.destinationSource} is missing declared section ${mapping.destinationHeading ?? '<preamble>'}`,
    );
    for (const [index, sourceMarker] of mapping.sourceMarkers.entries()) {
      const destinationMarker = mapping.destinationMarkers[index];
      assert.equal(typeof sourceMarker, 'string');
      assert.equal(typeof destinationMarker, 'string');
      assert.ok(sourceMarker.trim().length >= 8);
      assert.ok(destinationMarker.trim().length >= 8);
      assert.doesNotMatch(sourceMarker, /^#{1,6}\s/u);
      assert.doesNotMatch(destinationMarker, /^#{1,6}\s/u);
      assert.equal(
        sourceSection.content.includes(sourceMarker),
        true,
        `${mapping.sourcePath} ${mapping.sourceHeading ?? '<preamble>'} is missing source marker ${JSON.stringify(sourceMarker)}`,
      );
      assert.equal(
        destinationSection.content.includes(destinationMarker),
        true,
        `${mapping.destinationSource} ${mapping.destinationHeading ?? '<preamble>'} is missing destination marker ${JSON.stringify(destinationMarker)}`,
      );
    }
  }
  for (const [sourceSectionKey, mappings] of mappingsBySection) {
    assert.equal(
      mappings.some(({disposition}) => disposition === 'exclude') && mappings.length > 1,
      false,
      `${sourceSectionKey} cannot be both excluded and mapped to a destination`,
    );
  }

  const expectedPreservationMappings = [
    {
      retiredSource: 'docs/installation/linux.md',
      destinationSource: 'docs/installation/mysql/linux.md',
      preservedFenceIndexes: [0, 1],
      excludedFenceIndexes: [],
    },
    {
      retiredSource: 'docs/installation/linux.md',
      destinationSource: 'docs/installation/mariadb/linux.md',
      preservedFenceIndexes: [2, 3],
      excludedFenceIndexes: [],
    },
    {
      retiredSource: 'docs/installation/linux.md',
      destinationSource: 'docs/installation/postgresql/linux.md',
      preservedFenceIndexes: [4, 5],
      excludedFenceIndexes: [],
    },
    {
      retiredSource: 'docs/installation/installation-methods/windows.md',
      destinationSource: 'docs/installation/mysql/windows.md',
      preservedFenceIndexes: [2, 3],
      excludedFenceIndexes: [0, 1],
    },
    {
      retiredSource: 'docs/installation/installation-methods/windows.md',
      destinationSource: 'docs/installation/mariadb/windows.md',
      preservedFenceIndexes: [3],
      excludedFenceIndexes: [0, 1],
    },
    {
      retiredSource: 'docs/installation/installation-methods/docker.md',
      destinationSource: 'docs/installation/mysql/docker.md',
      preservedFenceIndexes: [2, 3, 4],
      excludedFenceIndexes: [0, 1],
    },
    {
      retiredSource: 'docs/installation/installation-methods/docker.md',
      destinationSource: 'docs/installation/mariadb/docker.md',
      preservedFenceIndexes: [],
      excludedFenceIndexes: [0, 1],
    },
    {
      retiredSource: 'docs/installation/installation-methods/kubernetes.md',
      destinationSource: 'docs/installation/mariadb/kubernetes.md',
      preservedFenceIndexes: [],
      excludedFenceIndexes: [0],
    },
    {
      retiredSource: 'docs/installation/installation-methods/aws-rds.md',
      destinationSource: 'docs/installation/mysql/aws-rds.md',
      preservedFenceIndexes: [0],
      excludedFenceIndexes: [1, 2, 3, 4, 5, 6],
    },
    {
      retiredSource: 'docs/installation/installation-methods/gcp-cloud-sql.md',
      destinationSource: 'docs/installation/mysql/gcp-cloud-sql.md',
      preservedFenceIndexes: [0],
      excludedFenceIndexes: [1, 2, 3, 4],
    },
    {
      retiredSource: 'docs/installation/installation-methods/azure-database-for-mysql.md',
      destinationSource: 'docs/installation/mysql/azure-database-for-mysql.md',
      preservedFenceIndexes: [0, 1, 4],
      excludedFenceIndexes: [2, 3, 5],
    },
    {
      retiredSource: 'docs/installation/installation-methods/clusters.md',
      destinationSource: 'docs/installation/mysql/clusters.md',
      preservedFenceIndexes: [],
      excludedFenceIndexes: [],
    },
    {
      retiredSource: 'docs/installation/installation-methods/clusters.md',
      destinationSource: 'docs/installation/mariadb/clusters.md',
      preservedFenceIndexes: [],
      excludedFenceIndexes: [],
    },
    {
      retiredSource: 'docs/installation/installation-methods/whm-cpanel.md',
      destinationSource: 'docs/installation/mysql/whm-cpanel.md',
      preservedFenceIndexes: [1, 3, 4],
      excludedFenceIndexes: [0, 2],
    },
  ];
  assert.equal(
    overlay.preservationMappings.every(({excludedFences}) => Array.isArray(excludedFences)),
    true,
    'Every preservation mapping must explicitly list safety-excluded fences, including an empty list',
  );
  assert.deepEqual(
    overlay.preservationMappings.map((mapping) => ({
      retiredSource: mapping.retiredSource,
      destinationSource: mapping.destinationSource,
      preservedFenceIndexes: mapping.preservedFenceIndexes,
      excludedFenceIndexes: mapping.excludedFences.map(({index}) => index),
    })),
    expectedPreservationMappings,
  );
  assert.deepEqual(
    [...new Set(overlay.preservationMappings.map(({retiredSource}) => retiredSource))],
    engineFirstRetiredSources,
  );

  const baselinePages = new Map(manifest.pages.map((page) => [page.sourcePath, page]));
  const currentLinuxFenceHashes = [
      '533bf161b8b335649f39fec30cd8a3661887fa99c51bf58be00a8adb8ed36578',
      '1334b130eb3e20da8ce656c6e4c69cb1afa35e7efbea8cf97757663e764d916c',
      '533bf161b8b335649f39fec30cd8a3661887fa99c51bf58be00a8adb8ed36578',
      '1334b130eb3e20da8ce656c6e4c69cb1afa35e7efbea8cf97757663e764d916c',
      '8c4769cfb884551d7bbaab67de7267819b70dd8e32a0d07895e0d35428f67998',
      '0ef9e7dc859f23c5a6e3823726fc6f7e3e833e4f2f11d2a3884d7165a5c30966',
  ];
  for (const mapping of overlay.preservationMappings) {
    assert.deepEqual(
      Object.keys(mapping).sort(),
      ['destinationSource', 'excludedFences', 'preservedFenceIndexes', 'retiredSource'],
      `${mapping.retiredSource} -> ${mapping.destinationSource} preservation mapping shape changed`,
    );
    assert.ok(Array.isArray(mapping.preservedFenceIndexes));
    assert.ok(Array.isArray(mapping.excludedFences));
    assert.equal(
      installationSources.has(mapping.destinationSource),
      true,
      `Unknown preservation destination: ${mapping.destinationSource}`,
    );
    const destinationPage = parseDocument(
      mapping.destinationSource,
      await readFile(path.join(projectRoot, mapping.destinationSource), 'utf8'),
    );
    const evidencePage = mapping.retiredSource === 'docs/installation/linux.md'
      ? {codeFences: currentLinuxFenceHashes.map((contentSha256, index) => ({index, contentSha256})), images: []}
      : baselinePages.get(mapping.retiredSource);
    assert.ok(evidencePage, `Unknown preservation evidence source: ${mapping.retiredSource}`);
    const excludedIndexes = mapping.excludedFences.map((excludedFence) => {
      assert.deepEqual(
        Object.keys(excludedFence).sort(),
        ['contentSha256', 'evidence', 'index', 'reason'],
        `${mapping.retiredSource} excluded-fence evidence shape changed`,
      );
      assert.equal(Number.isInteger(excludedFence.index), true);
      assert.match(excludedFence.reason, /\S.{15,}/u);
      assert.match(excludedFence.evidence, /\S.{15,}/u);
      const sourceFence = evidencePage.codeFences[excludedFence.index];
      assert.ok(sourceFence, `${mapping.retiredSource} has no excluded code fence ${excludedFence.index}`);
      assert.equal(sourceFence.index, excludedFence.index);
      assert.equal(
        excludedFence.contentSha256,
        sourceFence.contentSha256,
        `${mapping.retiredSource} excluded fence ${excludedFence.index} must retain its private evidence hash`,
      );
      return excludedFence.index;
    });
    assert.equal(
      new Set([...mapping.preservedFenceIndexes, ...excludedIndexes]).size,
      mapping.preservedFenceIndexes.length + excludedIndexes.length,
      `${mapping.retiredSource} fence indexes must be unique and cannot be both public and excluded`,
    );
    const expectedFenceHashes = mapping.preservedFenceIndexes.map((index) => {
      const fence = evidencePage.codeFences[index];
      assert.ok(fence, `${mapping.retiredSource} has no code fence ${index}`);
      assert.equal(fence.index, index);
      return fence.contentSha256;
    });
    assert.deepEqual(
      destinationPage.codeFences.map(({contentSha256}) => contentSha256),
      expectedFenceHashes,
      `${mapping.destinationSource} must preserve exactly its assigned fence sequence`,
    );
    const destinationFenceHashes = new Set(
      destinationPage.codeFences.map(({contentSha256}) => contentSha256),
    );
    for (const excludedFence of mapping.excludedFences) {
      assert.equal(
        destinationFenceHashes.has(excludedFence.contentSha256),
        false,
        `${mapping.destinationSource} must not publish excluded source fence ${excludedFence.index}`,
      );
    }
    if (mapping.excludedFences.length > 0) {
      assert.equal(
        overlay.methodBlockers.some(({sourcePath}) => sourcePath === mapping.destinationSource),
        true,
        `${mapping.destinationSource} needs a public non-executable verification blocker for excluded commands`,
      );
    }
  }
});

test('private excluded-instructions ledger preserves every unsafe historical fence as placeholder-only DO NOT RUN evidence', async () => {
  assert.equal(
    existsSync(engineFirstExcludedInstructionsPath),
    true,
    'Create the private engine-first excluded-instructions ledger',
  );
  const [overlay, archive] = await Promise.all([
    readFile(engineFirstManifestPath, 'utf8').then(JSON.parse),
    readFile(engineFirstExcludedInstructionsPath, 'utf8'),
  ]);
  assert.match(
    archive,
    /^# DO NOT RUN\b.+$/mu,
    'The private archive must lead with a prominent DO NOT RUN heading',
  );

  const excludedFences = overlay.preservationMappings.flatMap((mapping) =>
    mapping.excludedFences.map((fence) => ({
      ...fence,
      sourcePath: mapping.retiredSource,
    })));
  const sections = h2Sections(archive);
  assert.equal(
    sections.length,
    excludedFences.length,
    'The private archive must have one H2 section per manifest excluded-fence entry',
  );

  const frozenBodies = new Map(engineFirstRetiredSources.map((sourcePath) => [
    sourcePath,
    codeFenceBodies(execFileSync(
      'git',
      ['show', `${engineFirstSourceRevision}:${sourcePath}`],
      {cwd: projectRoot, encoding: 'utf8'},
    )),
  ]));
  const archivedBodies = [];
  for (const [index, excludedFence] of excludedFences.entries()) {
    const section = sections[index];
    assert.equal(section.includes(`- Source: \`${excludedFence.sourcePath}\``), true);
    assert.equal(section.includes(`- Fence index: \`${excludedFence.index}\``), true);
    assert.equal(section.includes(`- SHA-256: \`${excludedFence.contentSha256}\``), true);
    assert.equal(section.includes(`- Reason: ${excludedFence.reason}`), true);
    const bodies = codeFenceBodies(section);
    assert.equal(bodies.length, 1, `${excludedFence.sourcePath} fence ${excludedFence.index} needs one historical code block`);
    const historicalBody = frozenBodies.get(excludedFence.sourcePath)?.[excludedFence.index];
    assert.ok(historicalBody, `${excludedFence.sourcePath} has no frozen fence ${excludedFence.index}`);
    assert.equal(
      normalizeRedactedHistoricalFence(bodies[0]),
      normalizeRedactedHistoricalFence(historicalBody),
      `${excludedFence.sourcePath} fence ${excludedFence.index} may redact values but must retain its historical structure`,
    );
    archivedBodies.push(bodies[0]);
  }

  const privateFenceText = archivedBodies.join('\n');
  assert.doesNotMatch(privateFenceText, /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/u);
  assert.doesNotMatch(privateFenceText, /\b\d{12}\b/u);
  assert.doesNotMatch(
    privateFenceText,
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/iu,
  );
  assert.doesNotMatch(privateFenceText, /-----BEGIN [A-Z ]*PRIVATE KEY-----/u);
  assert.doesNotMatch(privateFenceText, /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/u);
  assert.doesNotMatch(privateFenceText, /\b[\w.+-]+@[^\s]+\.gserviceaccount\.com\b/iu);
  for (const literal of frozenUnbracketedSensitivePlaceholders) {
    assert.equal(
      privateFenceText.includes(literal),
      false,
      `Private archive must replace ${JSON.stringify(literal)} with a bracketed field placeholder`,
    );
  }
  assert.doesNotMatch(privateFenceText, /--api-key=YOUR_API_KEY/u);

  const secretAssignments = [...privateFenceText.matchAll(
    /(?:api[-_]?key|password|secret|token)\s*(?:=|:)\s*["']?([^\s;"']+)/giu,
  )].map((match) => match[1]);
  for (const value of secretAssignments) {
    assert.match(
      value,
      /^\[[A-Z][A-Z0-9_]*\]$/u,
      `Private historical credential value must be a bracketed placeholder: ${value}`,
    );
  }
  for (const match of privateFenceText.matchAll(
    /-\s*name:\s*(?:RELEEM_API_KEY|DB_PASSWORD)\s*\n\s*value:\s*["']?([^\s"']+)/giu,
  )) {
    assert.match(match[1], /^\[[^\]]+\]$/u);
  }
});

test('lifecycle safety manifest records exact frozen exclusions and rewrites with private evidence', async () => {
  const [overlay, archive] = await Promise.all([
    readFile(engineFirstManifestPath, 'utf8').then(JSON.parse),
    readFile(engineFirstExcludedInstructionsPath, 'utf8'),
  ]);
  assert.ok(
    Array.isArray(overlay.lifecycleSafetyExclusions),
    'Manifest must declare lifecycleSafetyExclusions',
  );
  assert.ok(
    Array.isArray(overlay.lifecycleSafetyRewrites),
    'Manifest must declare lifecycleSafetyRewrites',
  );
  for (const [field, expected] of [
    ['lifecycleSafetyExclusions', expectedLifecycleSafetyExclusions],
    ['lifecycleSafetyRewrites', expectedLifecycleSafetyRewrites],
  ]) {
    assert.deepEqual(
      overlay[field].map((record) => ({
        pageSourcePath: record.pageSourcePath,
        fenceIndex: record.fenceIndex,
        baselineLineNumber: record.baselineLineNumber,
        baselineLanguage: record.baselineLanguage,
        baselineContentSha256: record.baselineContentSha256,
        ...(field === 'lifecycleSafetyRewrites'
          ? {currentContentSha256: record.currentContentSha256}
          : {}),
      })),
      expected,
      `${field} must identify only the reviewed frozen lifecycle fences`,
    );
    for (const record of overlay[field]) {
      const expectedKeys = [
        'baselineContentSha256',
        'baselineLanguage',
        'baselineLineNumber',
        'evidence',
        'fenceIndex',
        'pageSourcePath',
        'reason',
        ...(field === 'lifecycleSafetyRewrites' ? ['currentContentSha256'] : []),
      ].sort();
      assert.deepEqual(Object.keys(record).sort(), expectedKeys);
      assert.match(record.reason, /\S.{15,}/u);
      assert.match(record.evidence, /\S.{15,}/u);
      const baselinePage = manifest.pages.find(
        ({sourcePath}) => sourcePath === record.pageSourcePath,
      );
      const baselineFence = baselinePage?.codeFences[record.fenceIndex];
      assert.ok(baselineFence, `${record.pageSourcePath} has no fence ${record.fenceIndex}`);
      assert.equal(record.baselineLineNumber, baselineFence.lineNumber);
      assert.equal(record.baselineLanguage, baselineFence.language);
      assert.equal(record.baselineContentSha256, baselineFence.contentSha256);
      if (field === 'lifecycleSafetyRewrites') {
        assert.match(record.currentContentSha256, /^[a-f0-9]{64}$/u);
      }
      assert.match(archive, /^# DO NOT RUN\b.+$/mu);
      assert.equal(archive.includes(`- Source: \`${record.pageSourcePath}\``), true);
      assert.equal(archive.includes(`- Fence index: \`${record.fenceIndex}\``), true);
      assert.equal(archive.includes(`- SHA-256: \`${record.baselineContentSha256}\``), true);
    }
  }
  assert.doesNotMatch(
    archive,
    /(?:apikey|mysql_password|pg_password)\s*=\s*["'](?:<api_key>|releem)["']/iu,
    'Private lifecycle evidence must redact credential-like sample values',
  );
});

test('Agent uninstall and update pages remove unverified remote execution and explain update control', async () => {
  const [uninstall, update] = await Promise.all([
    readFile(path.join(projectRoot, 'docs/installation/manage-the-releem-agent/uninstall.md'), 'utf8'),
    readFile(path.join(projectRoot, 'docs/installation/manage-the-releem-agent/update.md'), 'utf8'),
  ]);
  const executableText = codeFenceBodies(`${uninstall}\n${update}`).join('\n');
  assert.doesNotMatch(executableText, /bash\s+-c\s+["']\$\(curl|\biwr\b[^\n]*\b(?:iex|Invoke-Expression)\b/iu);
  assert.doesNotMatch(executableText, /\/opt\/releem\/mysqlconfigurer\.sh\s+-u\b/iu);
  assert.doesNotMatch(executableText, /update_releem_docker\.sh|\bcrontab\b/iu);
  assert.match(uninstall, /(?:uninstall|removal)[^\n]*(?:currently unavailable|not documented)/iu);
  assert.match(uninstall, /contact Releem Support/iu);
  assert.match(update, /automatic updates?[^\n]*(?:only|when)[^\n]*explicitly enabled/iu);
  assert.match(update, /RELEEM_CRON_ENABLE=0/iu);
  const linuxUpdate = update.match(
    /<TabItem value="linux"[^>]*>([\s\S]*?)(?=<TabItem value=)/u,
  )?.[1] ?? '';
  assert.match(
    linuxUpdate,
    /manual[^\n]*(?:currently unavailable|not documented)|(?:currently unavailable|not documented)[^\n]*manual/iu,
  );
  assert.match(linuxUpdate, /contact Releem Support/iu);
  assert.match(update, /(?:Docker|container)[^\n]*(?:currently unavailable|not documented)/iu);
  assert.match(update, /contact Releem Support/iu);
});

test('Agent migration and configuration keep identity and secrets out of unsafe reusable examples', async () => {
  const [migrate, configuration] = await Promise.all([
    readFile(path.join(projectRoot, 'docs/installation/manage-the-releem-agent/migrate.md'), 'utf8'),
    readFile(path.join(projectRoot, 'docs/installation/manage-the-releem-agent/configuration.md'), 'utf8'),
  ]);
  const migrateFences = codeFenceBodies(migrate).join('\n');
  assert.doesNotMatch(migrateFences, /--hostname(?:=|\s)/u);
  assert.ok(
    /RELEEM_HOSTNAME/u.test(migrateFences) ||
      /preserv(?:e|ing) historical metrics[^\n]*(?:currently unavailable|not documented)/iu.test(migrate),
    'Migration must show verified RELEEM_HOSTNAME placement or mark history preservation unavailable',
  );
  const configurationFence = codeFenceBodies(configuration)[0];
  for (const key of ['apikey', 'mysql_password', 'pg_password']) {
    assert.match(
      configurationFence,
      new RegExp(`^${key}=["']\\[[A-Z][A-Z0-9_]*\\]["']$`, 'mu'),
      `${key} must use a bracketed secret placeholder`,
    );
  }
  assert.match(
    configuration,
    /protect[^\n]*`\/opt\/releem\/releem\.conf`|`\/opt\/releem\/releem\.conf`[^\n]*(?:restrictive|authorized users?)/iu,
  );
});

test('automatic MySQL-family installation discloses configuration-changing account authority', async () => {
  for (const [engine, privilege] of [
    ['mysql', 'SYSTEM_VARIABLES_ADMIN'],
    ['mariadb', 'SUPER'],
  ]) {
    const source = await readFile(
      path.join(projectRoot, `docs/installation/${engine}/linux.md`),
      'utf8',
    );
    const automatic = source.match(
      /^## Automatic installation[^\n]*\n([\s\S]*?)(?=^## Manual installation)/mu,
    )?.[1] ?? '';
    const authorityDisclosure =
      automatic.includes(privilege) &&
      /configuration-changing|change (?:database )?configuration/iu.test(automatic) &&
      /authoriz|approv/iu.test(automatic);
    const unavailable = /automatic installation[^\n]*(?:currently unavailable|not documented)/iu.test(automatic);
    assert.equal(
      authorityDisclosure || unavailable,
      true,
      `${engine} automatic installation must disclose ${privilege} authority and approval or be unavailable`,
    );
  }
});

test('WHM troubleshooting matches the unavailable installation procedure', async () => {
  const source = await readFile(
    path.join(projectRoot, 'docs/get-started/troubleshoot-releem-agent.md'),
    'utf8',
  );
  const whm = source.match(/^### cPanel\/WHM\n([\s\S]*?)(?=^### |^## )/mu)?.[1] ?? '';
  assert.match(whm, /(?:procedure|installation)[^\n]*(?:currently unavailable|not documented)/iu);
  assert.match(whm, /contact Releem Support/iu);
  assert.doesNotMatch(whm, /verify that cPanel MySQL auto-adjust settings are disabled/iu);
});

test('baseline pages and route identity remain unless explicitly excepted', async () => {
  for (const baselinePage of manifest.pages) {
    if (retiredSources.has(baselinePage.sourcePath)) continue;
    const exception = manifest.routeExceptions.find(
      ({baselineSourcePath, status}) =>
        baselineSourcePath === baselinePage.sourcePath && status === 'approved',
    );
    const currentSourcePath = exception?.currentSourcePath ?? baselinePage.sourcePath;
    const absolutePath = path.join(projectRoot, currentSourcePath);
    assert.ok(existsSync(absolutePath), `Baseline page disappeared: ${baselinePage.sourcePath}`);
    const currentPage = parseDocument(currentSourcePath, await readFile(absolutePath, 'utf8'));
    const expected = exception
      ? {
          explicitId: exception.currentExplicitId,
          slug: exception.currentSlug,
          publicRoute: exception.currentRoute,
        }
      : baselinePage;
    assert.equal(currentPage.explicitId, expected.explicitId, `${baselinePage.sourcePath} ID changed`);
    assert.equal(currentPage.effectiveId, exception?.currentEffectiveId ?? baselinePage.effectiveId, `${baselinePage.sourcePath} effective ID changed`);
    assert.equal(currentPage.slug, expected.slug, `${baselinePage.sourcePath} slug changed`);
    assert.equal(currentPage.publicRoute, expected.publicRoute, `${baselinePage.sourcePath} route changed`);
  }
});

test('baseline code fences remain byte-for-byte unless a safety exception is approved', async () => {
  const overlay = JSON.parse(await readFile(engineFirstManifestPath, 'utf8'));
  for (const baselinePage of manifest.pages) {
    if (
      retiredSources.has(baselinePage.sourcePath) ||
      rewrittenSources.has(baselinePage.sourcePath)
    ) continue;
    const routeException = manifest.routeExceptions.find(
      ({baselineSourcePath, status}) =>
        baselineSourcePath === baselinePage.sourcePath && status === 'approved',
    );
    const currentSourcePath = routeException?.currentSourcePath ?? baselinePage.sourcePath;
    const currentText = await readFile(
      path.join(projectRoot, currentSourcePath),
      'utf8',
    );
    const lifecycleExclusions = overlay.lifecycleSafetyExclusions.filter(
      ({pageSourcePath}) => pageSourcePath === baselinePage.sourcePath,
    );
    const lifecycleRewrites = overlay.lifecycleSafetyRewrites.filter(
      ({pageSourcePath}) => pageSourcePath === baselinePage.sourcePath,
    );
    const currentPage = parseDocument(
      currentSourcePath,
      lifecycleExclusions.length === 0 &&
        lifecycleRewrites.length === 0 &&
        engineFirstExistingDocumentChanges.has(currentSourcePath)
        ? reverseEngineFirstLinks(currentText, currentSourcePath)
        : currentText,
    );
    if (lifecycleExclusions.length > 0 || lifecycleRewrites.length > 0) {
      assert.equal(
        manifest.safetyExceptions.some(
          ({pageSourcePath, status}) =>
            pageSourcePath === baselinePage.sourcePath && status === 'approved',
        ),
        false,
        `${baselinePage.sourcePath} cannot use overlapping preservation exception systems`,
      );
      assertLifecycleCodeFenceIdentity(
        baselinePage,
        currentPage,
        lifecycleExclusions,
        lifecycleRewrites,
      );
      continue;
    }
    assertCodeFenceIdentity(
      baselinePage,
      currentPage,
      manifest.safetyExceptions,
    );
  }
});

test('baseline image placements and all committed assets remain', async () => {
  for (const asset of manifest.assets) {
    assert.equal(asset.retention, 'required');
    if (asset.assetPath === consolidation.removedSensitiveAsset.path) continue;
    const absolutePath = path.join(projectRoot, asset.assetPath);
    assert.ok(existsSync(absolutePath), `Asset removed: ${asset.assetPath}`);
    assertAssetBytes(asset, await readFile(absolutePath));
    if (!/(?:favicon|icon)/iu.test(path.posix.basename(asset.assetPath))) {
      assert.equal(asset.screenshotVisualFreshness, 'review-required');
    }
  }
  for (const baselinePage of manifest.pages) {
    if (retiredSources.has(baselinePage.sourcePath)) continue;
    const routeException = manifest.routeExceptions.find(
      ({baselineSourcePath, status}) =>
        baselineSourcePath === baselinePage.sourcePath && status === 'approved',
    );
    const currentSourcePath = routeException?.currentSourcePath ?? baselinePage.sourcePath;
    const currentPage = parseDocument(
      currentSourcePath,
      await readFile(path.join(projectRoot, currentSourcePath), 'utf8'),
    );
    const currentCounts = countBy(currentPage.images, imagePlacementKey);
    const baselineCounts = countBy(baselinePage.images, imagePlacementKey);
    for (const [key, requiredCount] of baselineCounts) {
      assert.ok(
        (currentCounts.get(key) ?? 0) >= requiredCount,
        `Image placement disappeared: ${baselinePage.sourcePath} ${key}`,
      );
    }
  }
});

test('specialist pages retain exact sidebar ownership unless explicitly excepted', async () => {
  const ownership = collectSidebarOwnership(await loadSidebars());
  for (const page of manifest.pages.filter(({specialistPage}) => specialistPage)) {
    if (retiredSources.has(page.sourcePath)) continue;
    const routeException = manifest.routeExceptions.find(
      ({baselineSourcePath, status}) =>
        baselineSourcePath === page.sourcePath && status === 'approved',
    );
    const expectedId = routeException?.currentEffectiveId ?? page.effectiveId;
    const consolidationOverride = consolidation.sidebarOwnershipOverrides.find(
      ({sourcePath}) => sourcePath === page.sourcePath,
    );
    if (consolidationOverride) {
      assert.deepEqual(
        ownership.get(expectedId),
        consolidationOverride.currentOwnership,
        `${page.sourcePath} drifted from the consolidation sidebar override`,
      );
      continue;
    }
    assertSidebarOwnership(
      page,
      ownership,
      manifest.sidebarExceptions,
      expectedId,
    );
  }
});
