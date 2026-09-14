# World Atlas — Project Plan Entry Point

The [End-to-End Gated Development Master Plan](GATED_DEVELOPMENT_MASTER_PLAN.md) is the governing 149-module roadmap, preserved unchanged from the user's source. Its future checkmarks are objectives, not implementation evidence.

## Current state

M001–M012 are PASS. [The module ledger](docs/progress/MODULE_LEDGER.md) records actual status; [the M002–M011 completion record](docs/progress/M002-M011_COMPLETION.md) links the earlier artifacts and verification scope. See [M012 evidence](docs/progress/M012_VERIFICATION.md). M013–M149 remain NOT_STARTED. The current requested batch is M012–M021.

[README](README.md) provides installation and pnpm verify instructions. The repository has real development checks but no production web application, API, database or cloud environment yet.

## Governing contracts

- [Product vision](PRODUCT_VISION.md) and [MVP scope](MVP_SCOPE.md).
- [Entity ontology](ENTITY_ONTOLOGY.md), [historical time](TEMPORAL_MODEL.md) and [uncertainty](UNCERTAINTY_MODEL.md).
- [Provenance](SOURCE_PROVENANCE.md), [data licensing](DATA_LICENSING.md) and [representative source audit](docs/research/MVP_DATA_FEASIBILITY.md).
- [Architecture](ARCHITECTURE.md), [quality budgets](QUALITY_BUDGETS.md), [dependency policy](DEPENDENCY_POLICY.md) and [toolchain](TOOLCHAIN.md).
- [Planning dependency register](docs/progress/PLANNING_DEPENDENCIES.md), [ADRs](docs/adr) and [agent instructions](AGENTS.md).

ADR 0001 establishes plan precedence. ADRs 0002–0011 define the completed planning decisions. ADR 0010 explicitly changes only the future M087 → M086 → M085 execution prerequisites after M084, preserving all gates; all other execution is sequential.

## Archived proposal

The [earlier architecture proposal](docs/archive/MASTER_PROJECT_PLAN_2026-09-14.md) is retained unchanged as background. Its static-only MVP, old entity cap, npm recommendation, separate JSON Schema validator and first-next-task instruction do not override the current roadmap or accepted ADRs.

Public MVP v1.0 follows M001–M116 and includes the API, basic location history and private RDS deployment. M117–M149 remain post-MVP. Researched candidate data is not automatically rights-cleared or historically verified.
