import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { runPipeline, stages } from './pipeline.ts';

const cli = process.env.npm_execpath;
assert.ok(cli && path.basename(cli) === 'pnpm.cjs', 'Run this command through pinned pnpm');
const result = await runPipeline(
  stages,
  (stage) =>
    new Promise((resolve) => {
      process.stdout.write('\nCI stage: ' + stage.name + '\n');
      const child = spawn(process.execPath, [cli, ...stage.args], {
        stdio: 'inherit',
        windowsHide: true,
      });
      child.once('error', () => resolve(1));
      child.once('exit', (code) => resolve(code));
    }),
);
fs.mkdirSync('.verification', { recursive: true });
fs.writeFileSync('.verification/ci-result.json', JSON.stringify(result, null, 2) + '\n');
process.exitCode = result.exitCode;
