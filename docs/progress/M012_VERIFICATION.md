# M012 verification

Module status: PASS. Local and hosted pull-request enforcement are verified.

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

## Hosted pull-request gate

[Probe PR #1](https://github.com/Zathriscm-ops/World-Atlas-Timeline/pull/1) exercised the protected `main` branch. Commit `0539abc3bfd1726e9350dfc2712c6d0beefe391c` deliberately failed both platform jobs and the final Required job in [run 34906664209](https://github.com/Zathriscm-ops/World-Atlas-Timeline/actions/runs/34906664209). GitHub rejected an actual merge attempt with HTTP 405 and `Required status check "Required" is failing.`

Recovery commit `2fc23b1df01a7be170685acc8a76b0fe05e65f64` passed Windows, Ubuntu and Required in [run 34906776411](https://github.com/Zathriscm-ops/World-Atlas-Timeline/actions/runs/34906776411). Branch protection requires the unique Required context, strict/up-to-date status, applies to administrators, requires resolved conversations, and prohibits force pushes/deletion. The probe PR was closed unmerged after evidence collection.

No P0/P1 defect remains. The complete machine-readable record is M012_HOSTED.json. M013 is now eligible.
