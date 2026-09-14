# ADR 0001 — Adopt the gated roadmap and reconcile the product charter

- Status: Accepted for project planning
- Date: 2026-09-14
- Module: M001 — Product Charter
- Scope: governing-document precedence, release/product scope and gate interpretation
- Source: user-supplied End-to-End Gated Development Master Plan

## Context

The earlier architecture proposal described a small static-first public MVP, with a live API, location history and RDS deferred. The user subsequently supplied a complete sequential plan of 149 modules, with a public v1.0 at M116, an API at M040–M045, basic location history at M045/M053 and cloud API/RDS at M085–M087. The new content modules specify 15–25 settlements and 20–40 events. Both documents cannot govern release scope simultaneously.

## Decision

1. Preserve the supplied gated plan verbatim as `GATED_DEVELOPMENT_MASTER_PLAN.md`. Preserve the prior plan under `docs/archive/`. Use the root `MASTER_PROJECT_PLAN.md` as a navigation and precedence page.
2. The newer user plan governs module order, required gates and release landmarks. Retain nonconflicting historical modeling ideas as background proposals, not preapproved implementation decisions.
3. The public MVP includes M001–M116. M117–M149 are deferred product expansion. Earlier v0.x labels now mean the new plan's intermediate engineering landmarks, not the former public-MVP definition.
4. Required public-MVP capabilities include the API, basic location-history query/interface, AWS API runtime, private RDS/PostGIS, review/publication workflow, recoverability and the listed quality/security gates. A static export may be a delivery technique or intermediate prototype; it cannot silently substitute for these required modules.
5. The new settlement/event counts supersede the earlier 24–36 total-entity envelope. Use the lower ends—15 settlements and 20 events—as the starting editorial planning baseline. M065 will freeze the full political/people roster and temporal-state coverage without fabricating data. No complete annual or worldwide coverage is implied.
6. Recommended Zod and the `pnpm verify` command family belong to the new direction. Exact dependency versions, runtime validation contracts and package-manager governance remain M007/M010 work. No package is installed under M001.
7. Documentation-only modules are verified against their actual artifact and gate requirements. Record executable suites as not run/not applicable when they do not exist, rather than claiming they passed. The absence of an application suite does not prevent a product-charter document gate.
8. Severity-0/Severity-1 in the development law refer to P0/P1 in the defect taxonomy. A module may not pass with a relevant unresolved P0/P1. A future dependency decision is not evidence that the future module has passed or begun.
9. Every module ledger entry records actual evidence. A commit field may explicitly say no commit/repository yet; this is not a fabricated SHA. Repository setup is owned by M009. No missing required gate may be disguised as not applicable.
10. This ADR grants no parallel execution, reordered module completion, infrastructure provisioning, production launch or skipped modules. Later sequencing exceptions require their own explicit ADR before the affected work begins.

## Consequences

The new v1.0 is larger and has a higher recurring-cost floor than the prior static-only proposal. Do not reuse the prior effort/cost estimates as the budget for this expanded release. M008 must define budgets for the new scope, and M081 must price the actual deployment architecture before resources are provisioned.

Historical uncertainty remains multidimensional: confidence, precision and scholarly disagreement are distinct, even if the supplied outline lists them together. M004 formalizes this. The astronomical convention remains unchanged. Detailed schema and technology choices are intentionally not resolved here.

Dependency hazards are recorded separately. In particular, an API Gateway integration cannot satisfy a real end-to-end database gate before its required runtime/database exists. Identifying that conflict now does not authorize future implementation or a fake passing test.

## Rejected alternatives

- Keeping both documents as equally authoritative: leaves conflicting MVP scope and next tasks.
- Replacing API/RDS with static hosting without disclosure: contradicts the newer explicit modules.
- Marking architecture modules complete because the older plan discusses them: supplies neither the new module's artifacts nor its verification evidence.
- Starting all modules or scaffolding the entire platform now: violates sequential gated execution and bounded-module scope.
