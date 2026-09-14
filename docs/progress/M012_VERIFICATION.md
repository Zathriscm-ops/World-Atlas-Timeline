# M012 verification

Module status: BLOCKED on hosted pull-request enforcement. Local implementation and verification are complete.

## Delivered

.github/workflows/ci.yml runs pinned official actions with Windows/Linux matrix jobs, read-only permissions and a Required result that rejects any nonsuccessful matrix result. pnpm ci:check executes frozen installation, lint, strict types, Vitest unit tests, a real TypeScript tooling build and cumulative foundation checks. pnpm verify includes all implemented local unit/build checks.

## Executed evidence

- M012_LOCAL.json: a fresh Windows clone passed every pipeline stage; five actual failing-tool probes (stale lockfile, lint error, type error, failed unit assertion and invalid build target) each failed CI at exactly the intended stage without running later stages.
- M012_LINUX.json: an empty-store Linux container ran the same committed pipeline successfully using Node 24.18.0 and the recorded official image digest.
- M012_INSTALL.json: two additional fresh Windows clones passed pnpm verify, produced identical actual dependency graphs, preserved the frozen lockfile and rejected stale-lock/runtime mismatches.
- Thirteen unit tests passed, including per-stage propagation, interrupted/failed launch behavior, empty-pipeline rejection and pull-request workflow wiring.
- All existing M001–M011 regression, formatting and toolchain probes passed. The emitted CI JavaScript was executed successfully.
- Final dependency audit reported zero advisories in every severity category.

The initial Vitest 5.0.0/Vite 8.3.0 pair failed upstream declaration checking. Compatible Vitest 4.1.11/Vite 7.3.6 passed without disabling strict or library checks. pnpm's reserved ci command was avoided by naming the script ci:check. Optional esbuild install scripts remain denied; the packaged platform binary successfully ran the test transform on both platforms.

## Outstanding required gate

No Git remote is configured. The connected GitHub account returned no accessible repositories, including an owner-filtered lookup; no public repository was returned by the owner lookup. No hosted workflow run, pull request, required-check rule or merge-blocking evidence exists.

The user has been asked for the destination repository URL or a new repository's owner/name and visibility. After access is available, publish this reviewable workflow to the intended repository, configure the required check, and verify healthy/failing pull requests. Record actual head SHAs, run URLs and blocking behavior before PASS.

No P0/P1 defect is known in the local implementation. The missing hosted evidence is a gate blocker, not an application defect or permission to skip M012. M013–M021 remain NOT_STARTED under AGENTS.md's prerequisite rule. Docker readiness was checked, but no database or map module was begun.
