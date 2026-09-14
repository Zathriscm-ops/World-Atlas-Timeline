import { z } from 'zod';

// Compiler integration fixture, not a production historical contract.
export const WorkspaceInput = z.object({
  name: z.string(),
  private: z.literal(true),
});
export type WorkspaceInput = z.infer<typeof WorkspaceInput>;

export function workspaceLabel(input: WorkspaceInput): string {
  return input.name.toUpperCase();
}
