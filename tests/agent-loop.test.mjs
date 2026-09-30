import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, rm, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const coordinator = path.join(projectRoot, 'scripts/agent-loop.mjs');

const safeConfig = `status: disabled
mode: continuous-one-by-one
plan: .agent/plans/active.md
max_tasks: 1
continue_until_complete: true
allow_subagents: true
allow_commits: false
allow_push: false
allow_deploy: false
allow_remote_writes: false
allow_secret_changes: false
`;

function task(number, title, {
  files = ['- Create: `.agent/analysis/result.md`'],
  reviewers = ['- developer', '- technical-writer', '- releem-user'],
  steps = ['- [ ] Produce the bounded result.'],
} = {}) {
  return `## Task ${number}: ${title}

**Files:**
${files.join('\n')}

**Reviewers:**
${reviewers.join('\n')}

${steps.join('\n')}
`;
}

function plan(tasks) {
  return `# Fixture Plan

**Goal:** Verify one bounded documentation task.

**Architecture:** The fixture uses exact task-local file scope and deterministic reviewers.

**Tech Stack:** Node.js 20, Markdown, Docusaurus.

${tasks.join('\n')}`;
}

async function fixture(t, {config = safeConfig, planText, packageJson} = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'releem-agent-loop-'));
  t.after(() => rm(root, {recursive: true, force: true}));
  await mkdir(path.join(root, '.agent/plans'), {recursive: true});
  await mkdir(path.join(root, '.agent/analysis'), {recursive: true});
  await mkdir(path.join(root, 'docs'), {recursive: true});
  await mkdir(path.join(root, 'scripts'), {recursive: true});
  await mkdir(path.join(root, 'tests'), {recursive: true});
  await writeFile(path.join(root, '.agent/LOOP.md'), config);
  if (planText !== undefined) await writeFile(path.join(root, '.agent/plans/active.md'), planText);
  await writeFile(path.join(root, 'package.json'), JSON.stringify(packageJson ?? {
    scripts: {
      'docs:check': 'node --test tests/docs-structure.test.mjs',
      typecheck: 'tsc',
      build: 'docusaurus build',
    },
  }, null, 2));
  await writeFile(path.join(root, 'sidebars.js'), 'export default {};\n');
  return root;
}

function run(root, ...args) {
  return spawnSync(process.execPath, [coordinator, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: {...process.env, NO_COLOR: '1'},
  });
}

function combined(result) {
  return `${result.stdout}\n${result.stderr}`;
}

test('status reports policy, plan, worktree, baseline, next task, and three-role routing', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Update navigation')])});
  const result = run(root, '--status');

  assert.equal(result.status, 0, combined(result));
  for (const heading of [
    'Configuration:',
    'Plan:',
    'Worktree:',
    'Baseline checks:',
    'Next task:',
    'Declared reviewers:',
    'Effective reviewer briefs:',
  ]) assert.match(result.stdout, new RegExp(heading));
  assert.match(result.stdout, /Task 1: Update navigation/);
  assert.match(result.stdout, /developer/);
  assert.match(result.stdout, /technical-writer/);
  assert.match(result.stdout, /releem-user/);
  assert.match(result.stdout, /npm run docs:check/);
  assert.match(result.stdout, /npm run typecheck/);
  assert.match(result.stdout, /npm run build/);
  assert.match(result.stdout, /git diff --check/);
});

test('manual mode selects only the first task with unchecked steps', async (t) => {
  const root = await fixture(t, {planText: plan([
    task(1, 'First task'),
    task(2, 'Second task'),
  ])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /TASK PACKET/);
  assert.match(result.stdout, /Task 1: First task/);
  assert.doesNotMatch(result.stdout, /Task 2: Second task/);
  assert.equal((result.stdout.match(/TASK PACKET/g) ?? []).length, 1);
});

test('checked first task advances selection to task two', async (t) => {
  const first = task(1, 'First task', {steps: ['- [x] Produce the bounded result.']});
  const root = await fixture(t, {planText: plan([first, task(2, 'Second task')])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Task 2: Second task/);
  assert.doesNotMatch(result.stdout, /Task 1: First task/);
});

test('completed plan succeeds in status, manual, and automatic modes', async (t) => {
  const completed = plan([task(1, 'Done', {steps: ['- [x] Produce the bounded result.']})]);
  const root = await fixture(t, {planText: completed});

  for (const args of [['--status'], ['--manual'], []]) {
    const result = run(root, ...args);
    assert.equal(result.status, 0, combined(result));
    assert.match(combined(result), /PLAN COMPLETE/);
    assert.doesNotMatch(combined(result), /invalid/i);
  }
});

test('automatic mode refuses an unchecked task while status is disabled', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Pending')])});
  const result = run(root);

  assert.equal(result.status, 2, combined(result));
  assert.match(result.stderr, /Refusing automatic loop execution/);
  assert.match(result.stderr, /agent:next/);
});

test('enabled automatic mode emits one packet without executing the task', async (t) => {
  const enabled = safeConfig.replace('status: disabled', 'status: enabled');
  const root = await fixture(t, {config: enabled, planText: plan([task(1, 'Pending')])});
  const result = run(root);

  assert.equal(result.status, 0, combined(result));
  assert.equal((result.stdout.match(/TASK PACKET/g) ?? []).length, 1);
  assert.match(result.stdout, /Task 1: Pending/);
});

test('rejects unsupported mode and max_tasks values other than one', async (t) => {
  const cases = [
    [safeConfig.replace('mode: continuous-one-by-one', 'mode: batch'), /mode must be one-task or continuous-one-by-one/],
    [safeConfig.replace('max_tasks: 1', 'max_tasks: 2'), /max_tasks must be exactly 1/],
  ];
  for (const [config, expected] of cases) {
    const root = await fixture(t, {config, planText: plan([task(1, 'Pending')])});
    const result = run(root, '--manual');
    assert.equal(result.status, 1, combined(result));
    assert.match(combined(result), expected);
  }
});

test('rejects unsafe permission values', async (t) => {
  for (const key of [
    'allow_commits',
    'allow_push',
    'allow_deploy',
    'allow_remote_writes',
    'allow_secret_changes',
  ]) {
    const config = safeConfig.replace(`${key}: false`, `${key}: true`);
    const root = await fixture(t, {config, planText: plan([task(1, 'Pending')])});
    const result = run(root, '--manual');
    assert.equal(result.status, 1, `${key}: ${combined(result)}`);
    assert.match(combined(result), new RegExp(`${key} must be false`));
  }
});

test('rejects unknown configuration fields and invalid status', async (t) => {
  const cases = [
    [`${safeConfig}allow_publication: true\n`, /unknown configuration field: allow_publication/],
    [safeConfig.replace('status: disabled', 'status: paused'), /status must be enabled or disabled/],
  ];
  for (const [config, expected] of cases) {
    const root = await fixture(t, {config, planText: plan([task(1, 'Pending')])});
    const result = run(root, '--manual');
    assert.equal(result.status, 1, combined(result));
    assert.match(combined(result), expected);
  }
});

test('rejects a missing configured plan', async (t) => {
  const root = await fixture(t);
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /configured plan is missing/);
});

test('rejects symlinked plans, including links to repository-external files', async (t) => {
  const root = await fixture(t);
  const external = path.join(tmpdir(), `releem-agent-loop-plan-${path.basename(root)}.md`);
  t.after(() => rm(external, {force: true}));
  await writeFile(external, plan([task(1, 'External plan')]));
  await symlink(external, path.join(root, '.agent/plans/active.md'));
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /configured plan.*symlink|symlink.*configured plan/i);
});

test('rejects a symlinked loop configuration', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Pending')])});
  const external = path.join(tmpdir(), `releem-agent-loop-config-${path.basename(root)}.md`);
  t.after(() => rm(external, {force: true}));
  await writeFile(external, safeConfig);
  await rm(path.join(root, '.agent/LOOP.md'));
  await symlink(external, path.join(root, '.agent/LOOP.md'));
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /configuration.*symlink|symlink.*configuration/i);
});

test('rejects a plan without goal, architecture, or technology summary', async (t) => {
  const root = await fixture(t, {planText: task(1, 'Pending')});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /Goal/);
  assert.match(combined(result), /Architecture/);
  assert.match(combined(result), /Tech Stack/);
});

test('rejects an unchecked task without a task-local Files block', async (t) => {
  const malformed = plan([`## Task 1: No scope

**Reviewers:**
- technical-writer

- [ ] Write content.
`]);
  const root = await fixture(t, {planText: malformed});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /task-local Files block is required/);
});

test('rejects a task containing only Read entries', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Read only', {
    files: ['- Read: `package.json`'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /at least one writable file/);
});

test('rejects unsupported file modes', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Bad mode', {
    files: ['- Execute: `scripts/release.sh`'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /unsupported file mode: Execute/);
});

test('rejects globs, generated paths, outside paths, variables, and placeholders', async (t) => {
  const cases = [
    ['docs/**/*.md', /exact path/],
    ['build/index.html', /generated path/],
    ['../outside.md', /outside the repository/],
    ['$DOC_PATH', /exact path/],
    ['docs/<engine>.md', /exact path/],
  ];
  for (const [filePath, expected] of cases) {
    const root = await fixture(t, {planText: plan([task(1, 'Bad path', {
      files: [`- Create: \`${filePath}\``],
    })])});
    const result = run(root, '--manual');
    assert.equal(result.status, 1, `${filePath}: ${combined(result)}`);
    assert.match(combined(result), expected);
  }
});

test('rejects case variants of generated writable directories', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Generated case variant', {
    files: ['- Create: `Build/output.html`'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /generated path/);
});

test('rejects a writable directory scope as ambiguous', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Directory write', {
    files: ['- Modify: `docs/`'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /writable scope must name an exact file/);
});

test('rejects missing Modify and Delete targets', async (t) => {
  for (const mode of ['Modify', 'Delete']) {
    const root = await fixture(t, {planText: plan([task(1, 'Missing target', {
      files: [`- ${mode}: \`docs/missing.md\``],
    })])});
    const result = run(root, '--manual');
    assert.equal(result.status, 1, combined(result));
    assert.match(combined(result), /does not exist/);
  }
});

test('rejects Create when the target already exists', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Existing create', {
    files: ['- Create: `docs/existing.md`'],
  })])});
  await writeFile(path.join(root, 'docs/existing.md'), '# Existing\n');
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /Create target already exists/);
});

test('rejects a writable symlink that points outside the repository', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Escaping symlink', {
    files: ['- Modify: `docs/external.md`'],
  })])});
  const external = path.join(tmpdir(), `releem-agent-loop-external-${path.basename(root)}.md`);
  t.after(() => rm(external, {force: true}));
  await writeFile(external, '# External\n');
  await symlink(external, path.join(root, 'docs/external.md'));
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /symlink/i);
});

test('rejects every symlinked writable path component, including broken terminal links', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Symlink scope', {
    files: ['- Create: `docs/link/new.md`'],
  })])});
  await mkdir(path.join(root, 'actual'), {recursive: true});
  await symlink(path.join(root, 'actual'), path.join(root, 'docs/link'));
  let result = run(root, '--manual');
  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /symlink/i);

  await rm(path.join(root, 'docs/link'));
  await symlink(path.join(root, 'missing-external.md'), path.join(root, 'docs/link'));
  const brokenPlan = plan([task(1, 'Broken symlink scope', {
    files: ['- Create: `docs/link`'],
  })]);
  await writeFile(path.join(root, '.agent/plans/active.md'), brokenPlan);
  result = run(root, '--manual');
  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /symlink/i);
});

test('prints writable and read-only scope separately', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Scoped', {
    files: [
      '- Create: `.agent/analysis/result.md`',
      '- Read: `package.json`',
    ],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Writable scope:[\s\S]*Create: \.agent\/analysis\/result\.md/);
  assert.match(result.stdout, /Read-only scope:[\s\S]*Read: package\.json/);
});

test('allows generated output as read-only QA context', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Rendered QA', {
    files: [
      '- Create: `.agent/analysis/result.md`',
      '- Read: `build/index.html`',
    ],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Read-only scope:[\s\S]*Read: build\/index\.html/);
});

test('routes a code task to the developer role', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Implement coordinator', {
    files: ['- Create: `scripts/tool.mjs`', '- Test: `tests/tool.test.mjs`'],
    reviewers: ['- developer'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Lens: developer/);
  assert.match(result.stdout, /correctness, tests, Docusaurus\/Node conventions/);
});

test('routes a documentation task to technical-writer and releem-user', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Draft onboarding', {
    files: ['- Create: `docs/onboarding.md`'],
    reviewers: ['- technical-writer', '- releem-user'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Lens: technical-writer/);
  assert.match(result.stdout, /Lens: releem-user/);
});

test('folds legacy specialist declarations into at most three requested roles', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Visible database guide', {
    files: ['- Create: `docs/database-guide.md`', '- Test: `tests/database-guide.test.mjs`'],
    reviewers: [
      '- documentation',
      '- technical-accuracy',
      '- dba',
      '- security-operations',
      '- docusaurus-qa',
      '- accessibility-seo',
    ],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Declared reviewers:[\s\S]*documentation[\s\S]*accessibility-seo/);
  assert.equal((result.stdout.match(/^Lens: /gm) ?? []).length, 3);
  for (const role of ['developer', 'technical-writer', 'releem-user']) {
    assert.match(result.stdout, new RegExp(`Lens: ${role}`));
  }
  assert.match(result.stdout, /DBA and security\/operations concerns folded into this brief/);
});

test('folds either DBA or security operations into the developer brief independently', async (t) => {
  const cases = [
    ['dba', /DBA concern folded into this brief/],
    ['security-operations', /security\/operations concern folded into this brief/],
  ];
  for (const [reviewer, expected] of cases) {
    const root = await fixture(t, {planText: plan([task(1, `${reviewer} review`, {
      reviewers: [`- ${reviewer}`],
    })])});
    const result = run(root, '--manual');
    assert.equal(result.status, 0, combined(result));
    assert.match(result.stdout, expected);
  }
});

test('rejects an unknown reviewer identifier', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Unknown review', {
    reviewers: ['- marketing'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 1, combined(result));
  assert.match(combined(result), /unknown reviewer identifier: marketing/);
});

test('reviewer briefs include the required read-only verdict contract', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Review contract')])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Reviewer restrictions: read-only/);
  assert.match(result.stdout, /Verdict: pass \| findings/);
  assert.match(result.stdout, /Material findings:/);
  assert.match(result.stdout, /Non-blocking suggestions:/);
  assert.match(result.stdout, /None/);
  assert.doesNotMatch(result.stdout, /Material findings:\n- `<file>:<line>`[\s\S]*\n- None/);
});

test('plan command text is printed as data and never executed', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Command data', {
    steps: ['- [ ] Run `touch coordinator-must-not-run` and record the expected output.'],
  })])});
  const result = run(root, '--manual');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /touch coordinator-must-not-run/);
  await assert.rejects(readFile(path.join(root, 'coordinator-must-not-run')), {code: 'ENOENT'});
});

test('rejects forbidden actions anywhere in task titles or unchecked instructions', async (t) => {
  const cases = [
    [task(1, 'Normal build', {steps: ['- [ ] Run npm run build && git push origin main.']}), /push/],
    [task(1, 'Multiline instruction', {steps: ['- [ ] Run npm run build.', '  Then git push origin main.']}), /push/],
    [task(1, 'Git with options', {steps: ['- [ ] Run git -C . push origin main.']}), /push/],
    [task(1, 'Deploy the documentation'), /deployment/],
    [task(1, 'Normal review', {steps: ['- [ ] Verify output, then send an external message.']}), /external message/],
  ];
  for (const [taskText, expected] of cases) {
    const root = await fixture(t, {planText: plan([taskText])});
    const result = run(root, '--manual');
    assert.equal(result.status, 1, combined(result));
    assert.match(combined(result), expected);
  }
});

test('status lists dirty paths as a warning without claiming conflict knowledge', async (t) => {
  const root = await fixture(t, {planText: plan([task(1, 'Dirty status')])});
  spawnSync('git', ['init'], {cwd: root, encoding: 'utf8'});
  await writeFile(path.join(root, 'unrelated.txt'), 'dirty\n');
  const result = run(root, '--status');

  assert.equal(result.status, 0, combined(result));
  assert.match(result.stdout, /Dirty worktree warning/);
  assert.match(result.stdout, /unrelated\.txt/);
  assert.match(result.stdout, /Codex must compare dirty paths with writable scope/);
});
