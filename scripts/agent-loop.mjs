#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {
  existsSync,
  lstatSync,
  readFileSync,
  realpathSync,
} from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());
const configPath = path.join(repoRoot, '.agent', 'LOOP.md');
const requestedMode = process.argv.slice(2);
const allowedArguments = new Set(['--status', '--manual']);
const supportedModes = new Set(['one-task', 'continuous-one-by-one']);
const supportedFileModes = new Set([
  'Read',
  'Create',
  'Modify',
  'Test',
  'Test fixture',
  'Delete',
]);
const writableFileModes = new Set(['Create', 'Modify', 'Test', 'Test fixture', 'Delete']);
const allowedConfigKeys = new Set([
  'status',
  'mode',
  'plan',
  'max_tasks',
  'continue_until_complete',
  'allow_subagents',
  'allow_commits',
  'allow_push',
  'allow_deploy',
  'allow_remote_writes',
  'allow_secret_changes',
]);
const canonicalRoles = ['developer', 'technical-writer', 'releem-user'];
const reviewerAliases = new Map([
  ['developer', ['developer']],
  ['technical-writer', ['technical-writer']],
  ['releem-user', ['releem-user']],
  ['documentation', ['technical-writer']],
  ['technical-accuracy', ['developer']],
  ['dba', ['developer']],
  ['security-operations', ['developer']],
  ['docusaurus-qa', ['developer']],
  ['accessibility-seo', ['technical-writer', 'releem-user']],
]);
const generatedSegments = new Set(['build', '.docusaurus', '.astro', 'node_modules']);

function parseScalar(value) {
  const normalized = value.trim();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  if (/^-?\d+$/.test(normalized)) return Number(normalized);
  return normalized.replace(/^(['"])(.*)\1$/, '$2');
}

function configurationSource(markdown) {
  const fenced = markdown.match(/```ya?ml\s*\n([\s\S]*?)\n```/i);
  return fenced ? fenced[1] : markdown;
}

function firstSymlinkComponent(relativePath) {
  let cursor = repoRoot;
  const visited = [];
  for (const segment of relativePath.split('/').filter(Boolean)) {
    visited.push(segment);
    cursor = path.join(cursor, segment);
    try {
      if (lstatSync(cursor).isSymbolicLink()) return visited.join('/');
    } catch (error) {
      if (error?.code === 'ENOENT') return null;
      throw error;
    }
  }
  return null;
}

function readConfiguration() {
  if (!existsSync(configPath)) {
    return {values: {}, errors: ['loop configuration is missing: .agent/LOOP.md']};
  }

  const configSymlink = firstSymlinkComponent('.agent/LOOP.md');
  if (configSymlink) {
    return {values: {}, errors: [`loop configuration must not use a symlink: ${configSymlink}`]};
  }
  if (!lstatSync(configPath).isFile()) {
    return {values: {}, errors: ['loop configuration must be a regular repository file: .agent/LOOP.md']};
  }

  const values = {};
  const errors = [];
  for (const rawLine of configurationSource(readFileSync(configPath, 'utf8')).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([a-z][a-z0-9_]*):\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!allowedConfigKeys.has(key)) {
      errors.push(`unknown configuration field: ${key}`);
      continue;
    }
    if (Object.hasOwn(values, key)) {
      errors.push(`duplicate configuration field: ${key}`);
      continue;
    }
    values[key] = parseScalar(rawValue);
  }
  return {values, errors};
}

function validateConfiguration(parsed) {
  const errors = [...parsed.errors];
  const config = parsed.values;
  for (const key of allowedConfigKeys) {
    if (!Object.hasOwn(config, key)) errors.push(`missing configuration field: ${key}`);
  }
  if (!['enabled', 'disabled'].includes(config.status)) {
    errors.push('status must be enabled or disabled');
  }
  if (!supportedModes.has(config.mode)) {
    errors.push('mode must be one-task or continuous-one-by-one');
  }
  if (config.max_tasks !== 1) errors.push('max_tasks must be exactly 1');
  if (config.continue_until_complete !== true) {
    errors.push('continue_until_complete must be true');
  }
  if (config.allow_subagents !== true) errors.push('allow_subagents must be true');
  for (const key of [
    'allow_commits',
    'allow_push',
    'allow_deploy',
    'allow_remote_writes',
    'allow_secret_changes',
  ]) {
    if (config[key] !== false) errors.push(`${key} must be false`);
  }
  if (typeof config.plan !== 'string' || !config.plan.trim()) {
    errors.push('plan must name an exact repository-relative path');
  }
  return errors;
}

function resolveRepositoryPath(relativePath, label) {
  if (typeof relativePath !== 'string' || !relativePath.trim()) {
    return {error: `${label} must name an exact path`};
  }
  const candidate = relativePath.trim();
  if (path.isAbsolute(candidate)) return {error: `${label} is outside the repository`};
  if (/[*?[\]{}$]|\$\(|`|<[^>]*>|\\/.test(candidate)) {
    return {error: `${label} must use an exact path without globs, variables, substitutions, or placeholders`};
  }

  const absolute = path.resolve(repoRoot, candidate);
  const relative = path.relative(repoRoot, absolute);
  if (relative === '..' || relative.startsWith(`..${path.sep}`)) {
    return {error: `${label} is outside the repository`};
  }
  return {absolute, relative: relative.split(path.sep).join('/')};
}

function readPlan(config) {
  const resolved = resolveRepositoryPath(config.plan, 'configured plan');
  if (resolved.error) return {...resolved, errors: [resolved.error]};
  const planSymlink = firstSymlinkComponent(resolved.relative);
  if (planSymlink) {
    return {...resolved, errors: [`configured plan must not use a symlink: ${planSymlink}`]};
  }
  if (!existsSync(resolved.absolute)) {
    return {...resolved, errors: [`configured plan is missing: ${resolved.relative}`]};
  }
  if (!lstatSync(resolved.absolute).isFile()) {
    return {...resolved, errors: [`configured plan must be a regular repository file: ${resolved.relative}`]};
  }
  return {
    ...resolved,
    markdown: readFileSync(resolved.absolute, 'utf8'),
    errors: [],
  };
}

function parseTasks(markdown) {
  const matches = [...markdown.matchAll(/^## Task\s+([^:\n]+):\s*(.+?)\s*$/gm)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    const section = markdown.slice(start, end).trim();
    const uncheckedSteps = [];
    let currentStep = null;
    for (const line of section.split(/\r?\n/)) {
      const unchecked = line.match(/^\s*- \[ \]\s+(.+)$/);
      if (unchecked) {
        if (currentStep) uncheckedSteps.push(currentStep);
        currentStep = unchecked[1].trim();
        continue;
      }
      if (/^\s*- \[[xX ]\]\s+/.test(line)) {
        if (currentStep) uncheckedSteps.push(currentStep);
        currentStep = null;
        continue;
      }
      if (currentStep && /^\s{2,}\S/.test(line)) {
        currentStep = `${currentStep} ${line.trim()}`;
      } else if (currentStep && line.trim()) {
        uncheckedSteps.push(currentStep);
        currentStep = null;
      }
    }
    if (currentStep) uncheckedSteps.push(currentStep);
    return {
      number: match[1].trim(),
      title: match[2].trim(),
      section,
      uncheckedSteps,
    };
  });
}

function validatePlanSummary(markdown, tasks) {
  const errors = [];
  for (const field of ['Goal', 'Architecture', 'Tech Stack']) {
    const expression = new RegExp(`^\\*\\*${field}:\\*\\*\\s*\\S`, 'm');
    if (!expression.test(markdown)) errors.push(`plan summary is missing ${field}`);
  }
  if (tasks.length === 0) errors.push('plan must contain at least one numbered Task section');
  return errors;
}

function blockLines(section, label) {
  const lines = section.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `**${label}:**`);
  if (start === -1) return null;
  const result = [];
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (/^\*\*[^*]+:\*\*$/.test(trimmed) || /^##\s+/.test(trimmed) || /^- \[[ xX]\]/.test(trimmed)) break;
    if (trimmed) result.push(trimmed);
  }
  return result;
}

function parseFileEntries(task) {
  const lines = blockLines(task.section, 'Files');
  if (lines === null) return {entries: [], errors: ['task-local Files block is required']};
  const entries = [];
  const errors = [];
  for (const line of lines) {
    const match = line.match(/^- ([^:]+):\s*(.+?)\s*$/);
    if (!match) {
      errors.push(`invalid Files entry: ${line}`);
      continue;
    }
    const mode = match[1].trim();
    let filePath = match[2].trim();
    if (filePath.startsWith('`') && filePath.endsWith('`') && filePath.length >= 2) {
      filePath = filePath.slice(1, -1);
    }
    if (!supportedFileModes.has(mode)) {
      errors.push(`unsupported file mode: ${mode}`);
      continue;
    }
    entries.push({mode, path: filePath});
  }
  if (!entries.some((entry) => writableFileModes.has(entry.mode))) {
    errors.push('task must declare at least one writable file');
  }
  return {entries, errors};
}

function pathExistsAsDirectory(absolute) {
  try {
    return lstatSync(absolute).isDirectory();
  } catch {
    return false;
  }
}

function existingAncestor(absolute) {
  let cursor = absolute;
  while (!existsSync(cursor)) {
    const parent = path.dirname(cursor);
    if (parent === cursor) return cursor;
    cursor = parent;
  }
  return cursor;
}

function validateFileEntries(entries) {
  const errors = [];
  const validated = [];
  const repositoryRealPath = realpathSync(repoRoot);
  for (const entry of entries) {
    const resolved = resolveRepositoryPath(entry.path, `${entry.mode} path`);
    if (resolved.error) {
      errors.push(resolved.error);
      continue;
    }
    const symlink = firstSymlinkComponent(resolved.relative);
    if (symlink) {
      errors.push(`${entry.mode} path must not contain symlinks: ${symlink}`);
      continue;
    }
    const segments = resolved.relative.split('/');
    if (writableFileModes.has(entry.mode) && segments.some((segment) => generatedSegments.has(segment.toLowerCase()))) {
      errors.push(`${entry.mode} path is a generated path: ${resolved.relative}`);
      continue;
    }
    if (writableFileModes.has(entry.mode)) {
      if (entry.path.endsWith('/') || pathExistsAsDirectory(resolved.absolute)) {
        errors.push(`writable scope must name an exact file: ${resolved.relative}`);
        continue;
      }
      if (existsSync(resolved.absolute)) {
        const targetRealPath = realpathSync(resolved.absolute);
        const targetRelative = path.relative(repositoryRealPath, targetRealPath);
        if (targetRelative === '..' || targetRelative.startsWith(`..${path.sep}`)) {
          errors.push(`${entry.mode} path resolves outside the repository: ${resolved.relative}`);
          continue;
        }
        if (lstatSync(targetRealPath).isDirectory()) {
          errors.push(`writable scope must name an exact file: ${resolved.relative}`);
          continue;
        }
      }
      const ancestorRealPath = realpathSync(existingAncestor(path.dirname(resolved.absolute)));
      const ancestorRelative = path.relative(repositoryRealPath, ancestorRealPath);
      if (ancestorRelative === '..' || ancestorRelative.startsWith(`..${path.sep}`)) {
        errors.push(`${entry.mode} path resolves outside the repository: ${resolved.relative}`);
        continue;
      }
    }
    if (['Modify', 'Delete'].includes(entry.mode) && !existsSync(resolved.absolute)) {
      errors.push(`${entry.mode} target does not exist: ${resolved.relative}`);
      continue;
    }
    if (entry.mode === 'Create' && existsSync(resolved.absolute)) {
      errors.push(`Create target already exists: ${resolved.relative}`);
      continue;
    }
    validated.push({...entry, path: resolved.relative, absolute: resolved.absolute});
  }
  return {entries: validated, errors};
}

function parseReviewers(task, fileEntries) {
  const lines = blockLines(task.section, 'Reviewers');
  const declared = [];
  const errors = [];
  if (lines !== null) {
    for (const line of lines) {
      const match = line.match(/^-\s+([a-z][a-z0-9-]*)\s*$/);
      if (!match) {
        errors.push(`invalid reviewer declaration: ${line}`);
        continue;
      }
      const reviewer = match[1];
      if (!reviewerAliases.has(reviewer)) {
        errors.push(`unknown reviewer identifier: ${reviewer}`);
      } else if (!declared.includes(reviewer)) {
        declared.push(reviewer);
      }
    }
  }

  if (declared.length === 0 && errors.length === 0) {
    const paths = fileEntries.map((entry) => entry.path);
    if (paths.some((filePath) => /^(scripts|tests)\//.test(filePath) || /\.(?:js|mjs|cjs|ts|tsx|jsx|json|css)$/.test(filePath))) {
      declared.push('developer');
    }
    if (paths.some((filePath) => /^(docs|\.agent)\//.test(filePath) || /\.mdx?$/.test(filePath))) {
      declared.push('technical-writer', 'releem-user');
    }
  }

  const effectiveSet = new Set();
  for (const reviewer of declared) {
    for (const role of reviewerAliases.get(reviewer) ?? []) effectiveSet.add(role);
  }
  const effective = canonicalRoles.filter((role) => effectiveSet.has(role));
  if (effective.length === 0 && errors.length === 0) {
    errors.push('task must route at least one reviewer role');
  }
  if (effective.length > 3) errors.push('reviewer routing exceeds the three-agent limit');
  return {declared, effective, errors};
}

function validateForbiddenSteps(task) {
  const errors = [];
  const instructionText = `${task.title}\n${task.uncheckedSteps.join('\n')}`;
  const forbidden = [
    [/\bgit\b[^\n]*\bcommit\b|\bcommit\s+(?:the|these|changes|files|work)\b/i, 'commits'],
    [/\bgit\b[^\n]*\bpush\b|\bpush\s+(?:the|these|changes|branch|commit|to)\b/i, 'push'],
    [/\b(?:npm|yarn|pnpm|npx|docusaurus)\s+(?:run\s+)?deploy\b|\bdeploy\s+(?:the|this|site|docs|documentation|build|to)\b/i, 'deployment'],
    [/\b(?:publish|release)\s+(?:the|this|site|docs|documentation|build|to)\b/i, 'publication'],
    [/\b(?:write|modify|update|delete)\s+(?:the\s+)?(?:remote|production|analytics)\b/i, 'remote, production, or analytics writes'],
    [/\b(?:change|rotate|create|delete|update)\s+(?:(?:a|the|any)\s+)?(?:secret|credential|token|api key)\b/i, 'secret changes'],
    [/\bcurl\b[^\n]*(?:--request|-X)\s*(?:POST|PUT|PATCH|DELETE)\b|\bgh\s+(?:pr|issue)\s+create\b/i, 'remote writes'],
    [/\b(?:send|post)\s+(?:(?:an?|the)\s+)?(?:external\s+)?(?:message|email|notification)\b/i, 'external messages'],
  ];
  for (const [pattern, capability] of forbidden) {
    if (pattern.test(instructionText)) errors.push(`task requests forbidden capability: ${capability}`);
  }
  return errors;
}

function validateTask(task) {
  const parsedFiles = parseFileEntries(task);
  const validatedFiles = validateFileEntries(parsedFiles.entries);
  const reviewers = parseReviewers(task, validatedFiles.entries);
  return {
    ...task,
    files: validatedFiles.entries,
    reviewers,
    errors: [
      ...parsedFiles.errors,
      ...validatedFiles.errors,
      ...reviewers.errors,
      ...validateForbiddenSteps(task),
    ],
  };
}

function detectBaselineChecks() {
  const checks = [];
  const packagePath = path.join(repoRoot, 'package.json');
  if (existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
      for (const script of ['docs:check', 'typecheck', 'build']) {
        if (packageJson.scripts?.[script]) checks.push(`npm run ${script}`);
      }
    } catch {
      checks.push('package.json is invalid; stop before running npm checks');
    }
  }
  checks.push('git diff --check');
  return checks;
}

function inspectWorktree() {
  const result = spawnSync('git', ['status', '--short'], {
    cwd: repoRoot,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) return {kind: 'unavailable', paths: []};
  const lines = result.stdout.split(/\r?\n/).filter(Boolean);
  return {kind: lines.length ? 'dirty' : 'clean', paths: lines};
}

function roleDescription(role, declared) {
  if (role === 'developer') {
    let folded = '';
    if (declared.includes('dba') && declared.includes('security-operations')) {
      folded = ' DBA and security/operations concerns folded into this brief.';
    } else if (declared.includes('dba')) {
      folded = ' DBA concern folded into this brief.';
    } else if (declared.includes('security-operations')) {
      folded = ' security/operations concern folded into this brief.';
    }
    return `Review correctness, tests, Docusaurus/Node conventions, bounded scope, and operational safety.${folded}`;
  }
  if (role === 'technical-writer') {
    return 'Review customer-facing clarity, factual boundaries, canonical ownership, terminology, links, and safe procedural writing.';
  }
  return 'Review as a Releem user for findability, task completion, visible product terminology, prerequisites, expected results, and recovery paths.';
}

function reviewerBriefs(reviewers) {
  const lines = [];
  for (const role of reviewers.effective) {
    lines.push(`Lens: ${role}`);
    lines.push(`Brief: ${roleDescription(role, reviewers.declared)}`);
  }
  lines.push('Reviewer restrictions: read-only; no file edits, remote writes, messages, commits, releases, or deployments.');
  lines.push('Verdict: pass | findings');
  lines.push('Material findings:');
  lines.push('- None');
  lines.push('Non-blocking suggestions:');
  lines.push('- None');
  lines.push('Finding format when present: `- <file>:<line> — evidence-backed problem and required correction` (replace None).');
  lines.push('Suggestion format when present: `- optional improvement` (replace None).');
  return lines;
}

function printList(title, items, fallback = 'None') {
  console.log(title);
  if (items.length === 0) console.log(`- ${fallback}`);
  else for (const item of items) console.log(`- ${item}`);
}

function printConfiguration(config, errors) {
  console.log('Configuration:');
  for (const key of allowedConfigKeys) {
    console.log(`- ${key}: ${Object.hasOwn(config, key) ? String(config[key]) : 'MISSING'}`);
  }
  printList('Configuration problems:', errors);
}

function printWorktree(worktree) {
  console.log('Worktree:');
  if (worktree.kind === 'clean') {
    console.log('- clean');
  } else if (worktree.kind === 'unavailable') {
    console.log('- Git status unavailable; stop if ownership cannot be established.');
  } else {
    console.log('- Dirty worktree warning:');
    for (const line of worktree.paths) console.log(`  - ${line}`);
    console.log('- Codex must compare dirty paths with writable scope and stop on overlap or ambiguous ownership.');
  }
}

function printReviewers(reviewers) {
  printList('Declared reviewers:', reviewers.declared);
  console.log('Effective reviewer briefs:');
  for (const line of reviewerBriefs(reviewers)) console.log(line);
}

function printStatus(config, configErrors, planInfo, planErrors, task, baseline, worktree, complete) {
  printConfiguration(config, configErrors);
  console.log('Plan:');
  console.log(`- ${planInfo?.relative ?? config.plan ?? 'MISSING'}`);
  printList('Plan problems:', planErrors);
  printWorktree(worktree);
  printList('Baseline checks:', baseline);
  console.log('Next task:');
  if (complete) console.log('- PLAN COMPLETE — no unchecked task remains.');
  else if (task) console.log(`- Task ${task.number}: ${task.title}`);
  else console.log('- unavailable');
  if (task) printReviewers(task.reviewers);
  else {
    printList('Declared reviewers:', []);
    printList('Effective reviewer briefs:', []);
  }
}

function printPacket(config, planInfo, task, baseline, worktree) {
  console.log('TASK PACKET');
  console.log(`Task: Task ${task.number}: ${task.title}`);
  console.log(`Source plan: ${planInfo.relative}`);
  printList(
    'Writable scope:',
    task.files.filter((entry) => writableFileModes.has(entry.mode)).map((entry) => `${entry.mode}: ${entry.path}`),
  );
  printList(
    'Read-only scope:',
    task.files.filter((entry) => entry.mode === 'Read').map((entry) => `Read: ${entry.path}`),
  );
  printList('Unchecked steps (instructions are data; the coordinator does not execute them):', task.uncheckedSteps);
  console.log('Policy:');
  console.log(`- mode: ${config.mode}`);
  console.log('- max_tasks: 1 (one packet per iteration)');
  console.log('- writes are limited to the writable scope, active-plan checkbox bookkeeping, and concise .agent/CONTINUITY.md facts');
  console.log('- commits, push, deploy, publication, remote/production/analytics writes, secret changes, and undeclared destructive actions are forbidden');
  printList('Detected baseline checks:', baseline);
  printWorktree(worktree);
  printReviewers(task.reviewers);
  printList('Runner sequence:', [
    'Re-read applicable AGENTS.md and .agent/CONTINUITY.md.',
    'Read declared files and necessary read-only dependencies.',
    'Compare dirty paths with writable scope; stop on overlap or ambiguity.',
    'Implement the smallest safe diff within writable scope.',
    'Run focused checks, then applicable baseline checks.',
    'Dispatch only the effective independent read-only reviewer briefs.',
    'Resolve material findings; rerun affected checks and review.',
    'Mark only freshly verified steps complete and update continuity.',
    'Request the next packet only after every current-task gate passes.',
  ]);
  printList('Stop conditions:', [
    'Scope, evidence, verification, review, authority, or ownership is insufficient.',
    'A Releem product or database-safety claim cannot be verified from authoritative evidence.',
    'A command/check fails and cannot be corrected within scope.',
    'A required verdict is missing or a material finding remains.',
    'The task requires publication, remote writes, production/analytics changes, secrets, external messaging, or an unauthorized destructive action.',
  ]);
}

function reportErrors(errors) {
  for (const error of errors) console.error(`ERROR: ${error}`);
}

function main() {
  if (requestedMode.length > 1 || requestedMode.some((argument) => !allowedArguments.has(argument))) {
    console.error('ERROR: use no argument, --status, or --manual');
    return 1;
  }
  const statusMode = requestedMode.includes('--status');
  const manualMode = requestedMode.includes('--manual');
  const parsedConfig = readConfiguration();
  const config = parsedConfig.values;
  const configErrors = validateConfiguration(parsedConfig);
  const baseline = detectBaselineChecks();
  const worktree = inspectWorktree();

  let planInfo = null;
  let planErrors = [];
  let selectedTask = null;
  let complete = false;
  if (configErrors.length === 0) {
    planInfo = readPlan(config);
    planErrors.push(...planInfo.errors);
    if (planErrors.length === 0) {
      const tasks = parseTasks(planInfo.markdown);
      planErrors.push(...validatePlanSummary(planInfo.markdown, tasks));
      if (planErrors.length === 0) {
        const next = tasks.find((task) => task.uncheckedSteps.length > 0);
        if (!next) complete = true;
        else {
          selectedTask = validateTask(next);
          planErrors.push(...selectedTask.errors);
        }
      }
    }
  }

  if (statusMode) {
    printStatus(config, configErrors, planInfo, planErrors, selectedTask, baseline, worktree, complete);
    if (complete && configErrors.length === 0 && planErrors.length === 0) console.log('PLAN COMPLETE');
    if (configErrors.length || planErrors.length) {
      reportErrors([...configErrors, ...planErrors]);
      return 1;
    }
    return 0;
  }

  if (configErrors.length || planErrors.length) {
    reportErrors([...configErrors, ...planErrors]);
    return 1;
  }
  if (complete) {
    console.log(`PLAN COMPLETE: ${planInfo.relative} has no unchecked task.`);
    return 0;
  }
  if (!manualMode && config.status !== 'enabled') {
    console.error('Refusing automatic loop execution because status is disabled. Use npm run agent:next for one-packet inspection.');
    return 2;
  }
  printPacket(config, planInfo, selectedTask, baseline, worktree);
  return 0;
}

process.exitCode = main();
