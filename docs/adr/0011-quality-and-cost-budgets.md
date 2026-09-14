# ADR 0011: Explicit measurement and spending boundaries
Status: Accepted, M008, 2026-09-14.

Adopt QUALITY_BUDGETS.md and budgets.json. Routine warm API latency preserves the roadmap's strict 300 ms p95 target; cold-start and browser profiles are separate. Coverage measures production branches/lines, not document fixtures. Published-data integrity tolerates zero invalid records.

The 150 USD total monthly envelope replaces the archived static-only assumption, but is an allocation pending the required M081 configured estimate. It is not a provider quote. Optimization modules must execute their concrete small proofs before a production adoption decision.

DEP-06, DEP-10, DEP-11 and DEP-12 have design contracts; runtime proofs remain in their owning modules. DEP-13 has an envelope and mandatory repricing gate; actual sizing/cost remains OPEN until M081.
