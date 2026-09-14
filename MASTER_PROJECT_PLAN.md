# World Atlas — Project Plan Entry Point

The [End-to-End Gated Development Master Plan](GATED_DEVELOPMENT_MASTER_PLAN.md) is the governing roadmap. It preserves the user's supplied 149-module plan unchanged. Module order, release landmarks, gates and operating rules come from that document.

The [module ledger](docs/progress/MODULE_LEDGER.md) records actual progress. The roadmap's future gates and checkmarks are objectives, not evidence of implementation.

## Current artifacts

- [Product vision](PRODUCT_VISION.md) and [MVP scope](MVP_SCOPE.md): Module M001 — Product Charter.
- [ADR 0001](docs/adr/0001-adopt-gated-roadmap.md): plan precedence and reconciliation of the changed MVP.
- [Planning dependency register](docs/progress/PLANNING_DEPENDENCIES.md): later sequencing decisions that must be resolved before affected modules start.
- [M001 verification record](docs/progress/M001_VERIFICATION.md): evidence and limits for the document gate.
- [Agent instructions](AGENTS.md): module execution and reporting rules.

## Earlier architecture proposal

The [14 September architecture proposal](docs/archive/MASTER_PROJECT_PLAN_2026-09-14.md) is retained as a reference. It is not the active module sequence or release scope. Its static-only MVP, 24–36 entity target, npm recommendation, JSON Schema recommendation and first-next-task instructions do not override the newer plan. Technology choices are finalized in M007; package governance in M010; detailed historical content selection in M065.

The new public MVP is v1.0 after M001–M116. It includes the API, basic location history and private RDS deployment. M117–M149 remain post-MVP. No application code or infrastructure is implied to exist because these modules are listed.
