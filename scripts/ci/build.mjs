import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
for (const argv of [
  [require.resolve('typescript/bin/tsc'), '--project', 'tsconfig.build.json'],
  ['scripts/ci/build-smoke.mjs'],
]) {
  const result = spawnSync(process.execPath, argv, { stdio: 'inherit', windowsHide: true });
  assert.ifError(result.error);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
