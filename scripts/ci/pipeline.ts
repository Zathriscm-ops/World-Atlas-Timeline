export const stages = [
  { name: 'install', args: ['install', '--frozen-lockfile'] },
  { name: 'lint', args: ['lint'] },
  { name: 'typecheck', args: ['typecheck'] },
  { name: 'unit-tests', args: ['test:unit'] },
  { name: 'build', args: ['build'] },
  { name: 'format', args: ['format:check'] },
  { name: 'planning', args: ['test:planning'] },
  { name: 'repository', args: ['test:repository'] },
  { name: 'toolchain', args: ['test:toolchain'] },
] as const;

export type Stage = { readonly name: string; readonly args: readonly string[] };
export type StageResult = { name: string; exitCode: number; status: 'PASS' | 'FAIL' };
export type PipelineResult = {
  status: 'PASS' | 'FAIL';
  exitCode: number;
  completed: StageResult[];
};

export async function runPipeline(
  plan: readonly Stage[],
  execute: (stage: Stage) => Promise<number | null>,
): Promise<PipelineResult> {
  if (plan.length === 0) throw new Error('An empty pipeline cannot pass');
  const completed: StageResult[] = [];
  for (const stage of plan) {
    let code: number | null;
    try {
      code = await execute(stage);
    } catch {
      code = 1;
    }
    const exitCode =
      code === 0 ? 0 : Number.isInteger(code) && code !== null && code > 0 ? code : 1;
    completed.push({ name: stage.name, exitCode, status: exitCode === 0 ? 'PASS' : 'FAIL' });
    if (exitCode !== 0) return { status: 'FAIL', exitCode, completed };
  }
  return { status: 'PASS', exitCode: 0, completed };
}
