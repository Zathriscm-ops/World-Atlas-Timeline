# Planning Dependency Register

This register records future design prerequisites discovered while reconciling the user-supplied roadmap. It does not begin those modules, change their status, approve parallel work, or weaken any gate. None is an observed runtime defect in the documentation-only M001 deliverable.

Owner: the project owner and the agent assigned to the resolving module. A future module is blocked if its prerequisite remains unresolved when work reaches it. An actual P0/P1 defect always blocks the current affected gate.

| ID | Finding | Resolve by | Required decision/evidence | Status |
|---|---|---|---|---|
| DEP-01 | M009 fresh-clone installation precedes M010 package/lockfile governance | M007, before M009 | Define the minimal runnable repository contract versus M010 hardening. Do not claim an install passed without a manifest and real install evidence. | RESOLVED DESIGN — ADR 0009; M009 manifest/lock then M010 governance |
| DEP-02 | M022/M023 publication guards and spatial queries precede the production entity/provenance/lifecycle schema | Before M022 | Define an honest isolated fixture/proof boundary and mandatory later integration, or explicitly adjust dependencies through an ADR. Do not fabricate production-publication evidence. | RESOLVED DESIGN — ADR 0008; fixture proof then required integration |
| DEP-03 | M026 temporal-state schema precedes M033 entity tables and M036/M037 source/claim schema | M007, before M026 | Choose a domain-schema fixture milestone with later relational integration, or an ADR-authorized order change. No dangling production foreign keys or prematurely completed M033/M037. | RESOLVED DESIGN — ADR 0008; domain contract before relational binding |
| DEP-04 | M028 asks for Roman snapshots before the full content pipeline/data modules | M005/M006, before M028 | Define a small sourced, rights-reviewed historical fixture acquisition path; separately label synthetic tests. Do not relabel invented Roman geometry as verified. | PATH DEFINED — ADRs 0005/0006; reviewed geometry still required before M028 |
| DEP-05 | The earlier next-step source audit now follows a sequential charter/ontology/time sequence | M005/M006 | Include representative data feasibility and rights evidence in those standards before M007 locks architecture. M001 does not claim an audit occurred. | RESOLVED — M005/M006 three-case source and rights audit |
| DEP-06 | M077–M079 are measurement-driven, but their listed gates require concrete geometry/tile/Range proofs | M008 and before M077 | Define the accepted small proof, decision criteria and production-adoption threshold. If a listed gate would be inapplicable, approve an explicit gate amendment ADR before execution, not an automatic PASS or unlisted status. | RESOLVED DESIGN — QUALITY_BUDGETS.md; concrete proof remains required |
| DEP-07 | M082 budget configuration precedes M083 Terraform foundation | M007/M081, before M082 | Define tracked bootstrap resources/imports or approve an explicit prerequisite order. Do not leave durable budgets/IAM unmanaged without explanation. | RESOLVED DESIGN — ADR 0010; tracked budget bootstrap then Terraform import |
| DEP-08 | M085 staged API integration gate precedes M086 Lambda and M087 RDS | M007/M081, before M085 | Approve an executable dependency order or explicit integration milestone through an ADR. A stub cannot satisfy the existing real-database API contract suite. M085 cannot PASS merely because an API Gateway resource exists. | RESOLVED ORDER — ADR 0010: M087 then M086 then M085 after M084 |
| DEP-09 | IAM/secrets/backup/threat-review modules appear after resources that already need basic safe controls | M007/M081, before first relevant resource | Define minimum controls at creation and later hardening/rotation/restore certification. No public database, administrator runtime role or committed secret is acceptable while waiting for a later module. | RESOLVED DESIGN — ADR 0010; safe controls at creation, later certification |
| DEP-10 | Playback speeds are described per playback interval rather than with an explicit physical clock unit | M003/M008, before M031 | Record whether controls are historical years per real second and how seek/pause/dropped frames behave. Use deterministic fixtures. | RESOLVED DESIGN — TEMPORAL_MODEL.md and QUALITY_BUDGETS.md |
| DEP-11 | Listed uncertainty labels mix confidence, approximate precision and dispute | M004 | Separate semantic dimensions while supporting the requested UI concepts; keep identity/date/geographic disagreement distinct. | RESOLVED — UNCERTAINTY_MODEL.md and ADR 0004 |
| DEP-12 | Coverage/latency/security targets need measurement definitions and exception boundaries | M008 | Define coverage denominator, exclusions, test profiles, p95 workload, dependency scan policy and P0/P1 rules; do not treat percentages as historical certification. | RESOLVED DESIGN — QUALITY_BUDGETS.md measurement and severity rules |
| DEP-13 | Expanded v1.0 invalidates the old static-only cost/effort envelope | M008 and M081 | Price the actual API/RDS/network/backup configuration and estimate the larger curation workload before deployment. | PARTIAL — 150 USD allocation; configured provider estimate required at M081 |

## Resolution procedure

1. Read the governing module definitions and the relevant standards already marked PASS.
2. Produce the resolving ADR or contract with concrete file, test and dependency changes.
3. Preserve user requirements. Explain any necessary order or gate amendment explicitly; do not silently recast unfinished work as complete.
4. Update this register and the relevant module definition/ledger references when the decision is accepted.
5. Run the appropriate cumulative regressions when implementation changes. The existence of an ADR does not itself constitute the affected module's test evidence.

M001's critical scope conflicts are resolved in ADR 0001 and `MVP_SCOPE.md`. This register is separate from that completed product-scope reconciliation.
