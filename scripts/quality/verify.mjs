import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const cli = process.env.npm_execpath;
assert.ok(cli && path.basename(cli) === 'pnpm.cjs', 'Run pnpm verify with the pinned manager');
for (const task of [
  'lint',
  'typecheck',
  'format:check',
  'test:repository',
  'test:planning',
  'test:toolchain',
]) {
  const result = spawnSync(process.execPath, [cli, task], { stdio: 'inherit', windowsHide: true });
  assert.ifError(result.error);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
process.stdout.write('PASS all implemented M001–M011 foundation checks\n');
