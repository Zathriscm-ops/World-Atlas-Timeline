import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const cli = process.env.npm_execpath;
assert.ok(cli && path.basename(cli) === 'pnpm.cjs', 'Run through pnpm');
function run(command, args, cwd = root) {
  const r = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
    timeout: 180000,
  });
  assert.ifError(r.error);
  return { code: r.status, output: r.stdout + r.stderr };
}
const dir = path.join(root, '.verification', 'ci-failure-' + Date.now());
const clone = run('git', ['clone', '--no-local', root, dir]);
assert.equal(clone.code, 0, clone.output);
const baseline = run(process.execPath, [cli, 'ci:check'], dir);
assert.equal(baseline.code, 0, baseline.output);
const positive = JSON.parse(
  fs.readFileSync(path.join(dir, '.verification/ci-result.json'), 'utf8'),
);
const cases = [
  {
    stage: 'install',
    file: 'package.json',
    change: (text) => {
      const p = JSON.parse(text);
      p.devDependencies.zod = '0.0.0';
      return JSON.stringify(p);
    },
    diagnostic: 'ERR_PNPM_OUTDATED_LOCKFILE',
  },
  {
    stage: 'lint',
    file: 'tests/unit/probe-invalid.mjs',
    content: 'debugger;\n',
    diagnostic: 'no-debugger',
  },
  {
    stage: 'typecheck',
    file: 'tests/toolchain/probe-invalid.ts',
    content: "export const invalid: number = 'text';\n",
    diagnostic: 'TS2322',
  },
  {
    stage: 'unit-tests',
    file: 'tests/unit/probe-invalid.test.ts',
    content:
      "import {test,expect} from 'vitest';\ntest('intentional CI failure',()=>{expect(1).toBe(2);});\n",
    diagnostic: 'intentional CI failure',
  },
  {
    stage: 'build',
    file: 'tsconfig.build.json',
    change: (text) => {
      const p = JSON.parse(text);
      p.compilerOptions.target = 'INVALID_TARGET';
      return JSON.stringify(p);
    },
    diagnostic: 'TS6046',
  },
];
const evidence = [];
for (const item of cases) {
  const target = path.join(dir, item.file);
  const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  assert.ok(target.startsWith(dir + path.sep));
  try {
    fs.writeFileSync(target, item.change ? item.change(existing) : item.content, {
      flag: existing === null ? 'wx' : 'w',
    });
    const result = run(process.execPath, [cli, 'ci:check'], dir);
    assert.notEqual(result.code, 0, item.stage + ' unexpectedly passed');
    assert.ok(result.output.includes(item.diagnostic), result.output);
    const pipeline = JSON.parse(
      fs.readFileSync(path.join(dir, '.verification/ci-result.json'), 'utf8'),
    );
    assert.equal(pipeline.status, 'FAIL');
    assert.equal(pipeline.completed.at(-1).name, item.stage);
    evidence.push({
      stage: item.stage,
      exit: result.code,
      diagnostic: item.diagnostic,
      completed: pipeline.completed.map((s) => s.name),
      later_stages_ran: false,
    });
    process.stdout.write('PASS actual ' + item.stage + ' failure stops CI\n');
  } finally {
    if (existing === null) fs.unlinkSync(target);
    else fs.writeFileSync(target, existing);
  }
}
assert.equal(run('git', ['status', '--porcelain'], dir).output.trim(), '');
const report = {
  module: 'M012',
  local_result: 'PASS',
  remote_result: 'NOT_VERIFIED',
  tested_commit: run('git', ['rev-parse', 'HEAD']).output.trim(),
  platform: process.platform + '-' + process.arch,
  node: process.version,
  positive_pipeline: positive,
  negative_cases: evidence,
  checked_at_utc: new Date().toISOString(),
};
fs.writeFileSync(path.join(dir, 'local-proof.json'), JSON.stringify(report, null, 2) + '\n');
if (process.argv.includes('--record'))
  fs.writeFileSync('docs/progress/M012_LOCAL.json', JSON.stringify(report, null, 2) + '\n');
process.stdout.write(
  'PASS clean baseline and all five real stage failures; hosted gate remains separate\n',
);
