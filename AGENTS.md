# World Atlas Agent Instructions

## Read order and authority

1. Read `MASTER_PROJECT_PLAN.md` for document precedence.
2. Read `docs/progress/MODULE_LEDGER.md` to identify the active/eligible module and evidence.
3. Read that module's exact definition in `GATED_DEVELOPMENT_MASTER_PLAN.md`.
4. Read `PRODUCT_VISION.md`, `MVP_SCOPE.md`, applicable accepted ADRs, and relevant entries in `docs/progress/PLANNING_DEPENDENCIES.md`.
5. Inspect the repository and existing implementation before proposing edits.

The gated roadmap is the user's governing sequence. The archived master plan is background, not an alternative scope or task list. An attached roadmap is not evidence that any module has passed.

## Execution boundary

- Work on the currently requested module. Eligibility of the next module does not authorize silently implementing it within the same assignment.
- Only `NOT_STARTED`, `IN_PROGRESS`, `BLOCKED` and `PASS` are module states.
- Previous module PASS and the current module's explicit dependencies must be satisfied before implementation. Parallel/order exceptions need an explicit ADR; ADR 0001 grants none.
- A future dependency concern is recorded as such. When it becomes an unsatisfied prerequisite, block the affected module instead of faking passing evidence.
- A module PASS requires its artifact, module tests, cumulative applicable regression checks, no P0/P1 blockers, updated documentation, relevant ADRs and ledger evidence.
- In documentation-only phases, verify the document gates and report absent executable suites as not run/not applicable. Never create a no-op `verify` script or report an unrun build as passed.
- Finish with changed files, decisions, checks/results, tests not run, defects/limitations, module status and the eligible next module. Do not claim a commit unless one exists.
- Creating module documents is not authorization to deploy infrastructure, publish unreviewed historical data or send messages to third parties.

## User-supplied operating rules

The following rules are copied from the governing roadmap:

# VIII. CLAUDE / CODEX OPERATING RULES

Future AI coding agents should receive these rules.

1. Read the current module definition before editing anything.
2. Inspect the repository before modifying it.
3. Read relevant architecture documents.
4. Identify affected files before writing code.
5. Do not expand module scope.
6. Do not silently implement future modules.
7. Do not rewrite working architecture without an ADR.
8. Preserve backwards compatibility unless the module explicitly changes a contract.
9. Never invent historical data and mark it verified.
10. Keep demo data separate from verified data.
11. Every historical geographic state must support provenance.
12. Preserve uncertainty.
13. Never convert an approximate cultural region into a hard political border merely for visual convenience.
14. Use the canonical historical time library.
15. Never manually implement BCE conversions elsewhere.
16. Validate geographic data.
17. Do not bypass publication workflow.
18. Do not bypass database migrations.
19. Do not introduce a new dependency without justification.
20. Do not introduce a new AWS service merely for portfolio complexity.
21. Prefer simple systems until performance data demonstrates a bottleneck.
22. Keep infrastructure reproducible.
23. Never put credentials in source control.
24. Write tests for all meaningful domain behavior.
25. Add regression tests for every confirmed bug.
26. Run module tests.
27. Run cumulative regression tests.
28. Run build verification.
29. Update documentation.
30. Update Module Ledger.
31. Explicitly report tests that were not run.
32. Explicitly report unresolved defects.
33. Never call a module complete while required tests fail.
34. Stop if an architectural assumption conflicts with an existing ADR.
35. Never delete data or migrations to make a failing test pass.
36. Prefer deterministic tests.
37. Preserve raw imported datasets.
38. Make normalization reproducible.
39. Preserve original sources.
40. Treat historical correctness as product correctness.

---
