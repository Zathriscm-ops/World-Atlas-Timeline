import assert from 'node:assert/strict';
import { runPipeline, stages } from '../../dist/ci/pipeline.js';
assert.deepEqual(
  stages.slice(0, 5).map((s) => s.name),
  ['install', 'lint', 'typecheck', 'unit-tests', 'build'],
);
const result = await runPipeline(stages, async (stage) => (stage.name === 'build' ? 23 : 0));
assert.equal(result.status, 'FAIL');
assert.equal(result.exitCode, 23);
assert.equal(result.completed.at(-1).name, 'build');
process.stdout.write('PASS compiled CI artifact executes and propagates a build failure\n');
