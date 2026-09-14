import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const root = process.cwd();
function tool(pkg, executable, args, input) {
  const metadataPath = require.resolve(pkg + '/package.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const relative = typeof metadata.bin === 'string' ? metadata.bin : metadata.bin[executable];
  const command = path.resolve(path.dirname(metadataPath), relative);
  const result = spawnSync(process.execPath, [command, ...args], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true,
    input,
  });
  assert.ifError(result.error);
  return { code: result.status, output: result.stdout + result.stderr };
}
const clean = tool('typescript', 'tsc', ['--project', 'tsconfig.json']);
assert.equal(clean.code, 0, clean.output);
const parent = fs.realpathSync(path.join(root, 'tests', 'toolchain'));
const probe = fs.mkdtempSync(path.join(parent, 'probe-'));
const results = {};
try {
  const badType = path.join(probe, 'invalid.ts');
  fs.writeFileSync(
    badType,
    "export const invalid: number = 'text';\nexport function unsafe(value: string | null) { return value.toUpperCase(); }\n",
    { flag: 'wx' },
  );
  const types = tool('typescript', 'tsc', ['--project', 'tsconfig.json']);
  assert.notEqual(types.code, 0, 'Intentional type errors escaped the project compiler');
  assert.match(types.output, /TS2322/);
  assert.match(types.output, /TS18047/);
  results.type_errors = { exit: types.code, diagnostics: ['TS2322', 'TS18047'], detected: true };
  const badLint = path.join(probe, 'invalid.mjs');
  fs.writeFileSync(badLint, 'debugger;\nexport const value = missingIdentifier;\n', { flag: 'wx' });
  const lint = tool('eslint', 'eslint', [badLint, '--max-warnings', '0']);
  assert.notEqual(lint.code, 0, 'Intentional lint errors escaped ESLint');
  assert.match(lint.output, /no-debugger/);
  assert.match(lint.output, /no-undef/);
  results.lint_errors = {
    exit: lint.code,
    diagnostics: ['no-debugger', 'no-undef'],
    detected: true,
  };
  const format = tool(
    'prettier',
    'prettier',
    ['--check', '--stdin-filepath', 'quality-probe.mjs'],
    'export   const value=1\n',
  );
  assert.notEqual(format.code, 0, 'Intentional formatting error escaped Prettier');
  const validFormat = tool(
    'prettier',
    'prettier',
    ['--check', '--stdin-filepath', 'quality-probe.mjs'],
    'export const value = 1;\n',
  );
  assert.equal(validFormat.code, 0, validFormat.output);
  results.format_errors = {
    exit: format.code,
    detected: true,
    positive_control_exit: validFormat.code,
  };
} finally {
  const resolved = fs.realpathSync(probe);
  assert.equal(path.dirname(resolved), parent);
  assert.ok(path.basename(resolved).startsWith('probe-'));
  fs.rmSync(resolved, { recursive: true });
}
const restored = tool('typescript', 'tsc', ['--project', 'tsconfig.json']);
assert.equal(restored.code, 0, restored.output);
const report = {
  module: 'M011',
  result: 'PASS',
  node: process.version,
  baseline_typecheck: 'PASS',
  restored_typecheck: 'PASS',
  ...results,
  checked_at_utc: new Date().toISOString(),
};
fs.mkdirSync('.verification', { recursive: true });
fs.writeFileSync('.verification/toolchain-proof.json', JSON.stringify(report, null, 2) + '\n');
if (process.argv.includes('--record'))
  fs.writeFileSync('docs/progress/M011_TOOLCHAIN.json', JSON.stringify(report, null, 2) + '\n');
process.stdout.write(
  'PASS intentional type, strict-null, lint and formatting failures; clean controls restored\n',
);
