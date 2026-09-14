# CI integration and required checks

M012. The workflow runs on pull requests and main pushes with read-only repository permissions, pinned official actions, exact Node/pnpm, no path filters and no continue-on-error. Each Windows/Linux matrix job executes the same local pnpm ci:check pipeline. The final Required job runs even after upstream failure and only succeeds if the complete matrix succeeded.

The pipeline runs frozen install → lint → typecheck → unit tests → build, followed by formatting and all existing foundation regressions. Any failed or interrupted process returns nonzero and stops later stages. Unit tests deliberately fail each stage's executor and test process-launch failures. Separate integration probes exercise actual failing install/lint/compiler/test/build tools.

M012 builds the real TypeScript CI orchestrator to dist/ci and executes its emitted JavaScript. This is a tooling build, not an atlas application build. M016 adds the actual web production build to the same build command. Node 24's native type stripping lets CI run its small typed orchestrator before dependencies/build exist; tsc still performs the actual type check.

## Required remote configuration

On the selected GitHub repository, configure main branch protection or a ruleset requiring the **Required** check from the Atlas CI workflow, strict/up-to-date checking and no administrative bypass. Do not claim merge enforcement merely because a YAML file exists. Verify a healthy PR run and deliberately failing stage runs; retain run URLs, head SHAs, conclusions and observed merge blocking.

The local project has no configured remote, and the connected account returned no accessible repositories on this task's initial check. The repository destination is pending user clarification. M012 cannot be marked PASS until the remote gate is actually verified; this document does not waive it.

Primary reference: [GitHub required status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches). Availability depends on the chosen repository and account plan; no paid plan has been selected.
