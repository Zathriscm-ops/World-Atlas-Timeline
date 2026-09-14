import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const cli = process.env.npm_execpath;
assert.ok(cli && path.basename(cli) === 'pnpm.cjs', 'Run this test through the pinned pnpm CLI');
const args = process.argv.slice(2);
const moduleIndex = args.indexOf('--module');
const moduleId = moduleIndex >= 0 ? args[moduleIndex + 1] : 'M010';
assert.match(moduleId, /^M01[012]$/);
function run(command, argv, cwd, expectSuccess = true) {
  const result = spawnSync(command, argv, {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.ifError(result.error);
  if (expectSuccess) assert.equal(result.status, 0, result.stdout + result.stderr);
  return { code: result.status, output: result.stdout + result.stderr, stdout: result.stdout };
}
const hash = (content) => crypto.createHash('sha256').update(content).digest('hex');
const normalize = (value) => {
  if (Array.isArray(value))
    return value.map(normalize).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => k !== 'path')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, normalize(v)]),
    );
  return value;
};
const commit = run('git', ['rev-parse', 'HEAD'], root).stdout.trim();
const base = path.join(root, '.verification', 'install-' + Date.now());
fs.mkdirSync(base, { recursive: true });
const installs = [];
for (const label of ['a', 'b']) {
  const dir = path.join(base, label);
  run('git', ['clone', '--no-local', root, dir], root);
  const lockBefore = hash(fs.readFileSync(path.join(dir, 'pnpm-lock.yaml')));
  const install = run(process.execPath, [cli, 'install', '--frozen-lockfile'], dir);
  run(process.execPath, [cli, 'test:repository'], dir);
  if (['M011', 'M012'].includes(moduleId)) run(process.execPath, [cli, 'verify'], dir);
  const graph = normalize(
    JSON.parse(
      run(process.execPath, [cli, 'list', '--recursive', '--depth', 'Infinity', '--json'], dir)
        .stdout,
    ),
  );
  const lockAfter = hash(fs.readFileSync(path.join(dir, 'pnpm-lock.yaml')));
  assert.equal(lockBefore, lockAfter, 'Frozen install changed the lockfile');
  assert.equal(
    run('git', ['status', '--porcelain'], dir).stdout.trim(),
    '',
    'Install/smoke changed tracked source',
  );
  installs.push({
    label,
    dir,
    lock_sha256: lockAfter,
    graph_sha256: hash(JSON.stringify(graph)),
    graph,
    install_exit: install.code,
  });
  process.stdout.write('PASS independent frozen install ' + label + '\n');
}
assert.deepEqual(installs[0].graph, installs[1].graph);
assert.equal(installs[0].lock_sha256, installs[1].lock_sha256);
const dir = installs[1].dir;
const manifestPath = path.join(dir, 'package.json');
const original = fs.readFileSync(manifestPath, 'utf8');
const changed = JSON.parse(original);
changed.devDependencies.zod = '0.0.0';
fs.writeFileSync(manifestPath, JSON.stringify(changed, null, 2) + '\n');
const stale = run(process.execPath, [cli, 'install', '--frozen-lockfile'], dir, false);
assert.notEqual(stale.code, 0);
assert.match(stale.output, /ERR_PNPM_OUTDATED_LOCKFILE/);
fs.writeFileSync(manifestPath, original);
const incompatible = JSON.parse(original);
incompatible.engines.node = '0.0.0';
fs.writeFileSync(manifestPath, JSON.stringify(incompatible, null, 2) + '\n');
const engine = run(process.execPath, [cli, 'install', '--frozen-lockfile'], dir, false);
assert.notEqual(engine.code, 0);
assert.match(engine.output, /ERR_PNPM_UNSUPPORTED_ENGINE/);
fs.writeFileSync(manifestPath, original);
assert.equal(run('git', ['status', '--porcelain'], dir).stdout.trim(), '');
const report = {
  module: moduleId,
  result: 'PASS',
  tested_commit: commit,
  node: process.version,
  pnpm: run(process.execPath, [cli, '--version'], root).stdout.trim(),
  platform: process.platform + '-' + process.arch,
  method: 'Two fresh local Git clones and independent stores on the current host',
  installs: installs.map(({ dir, ...e }) => ({ ...e, directory: path.relative(root, dir) })),
  graph_equal: true,
  stale_lock_rejected: true,
  unsupported_node_rejected: true,
  checked_at_utc: new Date().toISOString(),
};
fs.writeFileSync(path.join(base, 'report.json'), JSON.stringify(report, null, 2) + '\n');
if (args.includes('--record'))
  fs.writeFileSync(
    path.join(root, 'docs/progress', moduleId + '_INSTALL.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
process.stdout.write(
  'PASS identical actual graphs, unchanged lock, stale-lock and Node-engine rejection\n',
);
