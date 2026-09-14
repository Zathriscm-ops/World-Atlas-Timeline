import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { runPipeline, stages } from '../../scripts/ci/pipeline.ts';

describe('CI failure propagation', () => {
  it('runs every required stage in order on success', async () => {
    const visited: string[] = [];
    const result = await runPipeline(stages, async (stage) => {
      visited.push(stage.name);
      return 0;
    });
    expect(result.status).toBe('PASS');
    expect(visited).toEqual(stages.map((stage) => stage.name));
  });
  for (const [index, stage] of stages.entries()) {
    it('stops and fails when ' + stage.name + ' fails', async () => {
      const visited: string[] = [];
      const result = await runPipeline(stages, async (current) => {
        visited.push(current.name);
        return current.name === stage.name ? 17 : 0;
      });
      expect(result.status).toBe('FAIL');
      expect(result.exitCode).toBe(17);
      expect(visited).toEqual(stages.slice(0, index + 1).map((current) => current.name));
    });
  }
  it('treats interruption and process-launch failure as failure', async () => {
    expect((await runPipeline(stages, async () => null)).status).toBe('FAIL');
    expect(
      (
        await runPipeline(stages, async () => {
          throw new Error('launch failed');
        })
      ).status,
    ).toBe('FAIL');
  });
  it('rejects an empty pipeline', async () => {
    await expect(runPipeline([], async () => 0)).rejects.toThrow('empty');
  });
});

type Workflow = {
  on: Record<string, unknown>;
  permissions: { contents: string };
  jobs: {
    foundation: {
      strategy: { matrix: { os: string[] } };
      steps: { uses?: string; run?: string; 'continue-on-error'?: boolean }[];
    };
    required: { if: string; needs: string[]; steps: { run: string; env: { RESULT: string } }[] };
  };
};
describe('pull-request workflow wiring', () => {
  it('runs on PRs and requires every matrix result to succeed', () => {
    const workflow = parse(readFileSync('.github/workflows/ci.yml', 'utf8')) as Workflow;
    expect(workflow.on).toHaveProperty('pull_request');
    expect(workflow.permissions.contents).toBe('read');
    expect(workflow.jobs.foundation.strategy.matrix.os).toEqual([
      'ubuntu-latest',
      'windows-latest',
    ]);
    expect(workflow.jobs.foundation.steps.some((step) => step.run?.includes('pnpm ci:check'))).toBe(
      true,
    );
    for (const step of workflow.jobs.foundation.steps) {
      expect(step['continue-on-error']).not.toBe(true);
      if (step.uses) expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
    }
    expect(workflow.jobs.required.if).toContain('always()');
    expect(workflow.jobs.required.needs).toEqual(['foundation']);
    expect(workflow.jobs.required.steps[0]?.env.RESULT).toContain('needs.foundation.result');
    expect(workflow.jobs.required.steps[0]?.run).toContain("!== 'success'");
  });
});
