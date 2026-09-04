import assert from 'node:assert/strict';
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
const baselineRevision = '9ad7ce3';
const expectedPageCount = 54;
const expectedAssetCount = 31;
const consolidation = JSON.parse(await readFile(consolidationPath, 'utf8'));
const retiredSources = new Set(consolidation.retiredSources);
const rewrittenSources = new Set(consolidation.rewrittenSources);

function reverseConsolidationLinks(text, sourcePath) {
  let restored = text;
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
    assert.equal(exception.approvedOn, isOverviewPilot ? '2026-09-03' : '2026-09-04');
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
  assert.match(connect, /\/installation\/installation-methods\/azure-database-for-mysql/u);
  assert.match(connect, /\[Releem Dashboard\]\(https:\/\/app\.releem\.com\)/u);
  assert.doesNotMatch(
    connect,
    /completed Dashboard checks confirm|enough observations/iu,
  );
  for (const target of [
    '/installation/linux?database=mysql#mysql-automatic-installation',
    '/installation/linux?database=mysql#mysql-manual-installation',
    '/installation/linux?database=mariadb#mariadb-automatic-installation',
    '/installation/linux?database=mariadb#mariadb-manual-installation',
    '/installation/linux?database=postgresql#postgresql-automatic-installation',
    '/installation/linux?database=postgresql#postgresql-manual-installation',
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
    const currentPage = parseDocument(
      currentSourcePath,
      await readFile(path.join(projectRoot, currentSourcePath), 'utf8'),
    );
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
