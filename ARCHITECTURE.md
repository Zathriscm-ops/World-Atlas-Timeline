# Initial architecture

M007 locks the technology families and boundaries. Installing a tool does not implement the module that uses it. No running website, API, database or cloud environment exists at this gate.

The browser hosts React/TypeScript built by Vite, with MapLibre managing map rendering. It requests versioned public read models from a single TypeScript/Fastify API and static immutable assets. API services query PostgreSQL/PostGIS through a data-access boundary. Source acquisition and curation are separate from public request handling. Zod defines shared input/output validation; JSON Schema is derived when integrations require it.

## Boundaries

| Directory | Responsibility and allowed dependency direction |
|---|---|
| apps/web | UI, accessible controls, map adapter; imports public contracts and canonical time package later. Never database credentials or server imports. |
| apps/api | HTTP adapter, services, SQL/data access; imports contracts/time. Never imports web UI. |
| packages/contracts | Public validation and types; no app imports, database calls or cloud SDK. |
| packages/time | Canonical historical time behavior beginning M024; planning oracles are test-only. |
| database | Reviewed migrations, fixtures and query checks; no alternate source of domain semantics. |
| data | Raw quarantine, fixtures, manifests, reviewed datasets and later transformation inputs separated by lifecycle. |
| infra | Terraform/bootstrap, environment state contract, deployment configuration. |
| scripts / tests | Development automation and gate evidence; never bundled as historical product content. |

No microservices, Kubernetes, service mesh, GraphQL, event broker, search cluster, mandatory SSR, Redis or tile service at startup. PostgreSQL queries, GeoJSON and one API remain the defaults until M008 budgets demonstrate a need. Trade routes/identity uncertainty do not force extra infrastructure.

## Decisions

[Web/API](docs/adr/0007-web-and-api-stack.md), [data/validation](docs/adr/0008-data-and-validation-stack.md), [testing/workspace](docs/adr/0009-testing-and-workspace.md), and [infrastructure/dependencies](docs/adr/0010-infrastructure-and-gate-dependencies.md) explain every selected major component and rejected alternative. Machine-readable decisions are in data/fixtures/planning/architecture.json.

Production language is TypeScript. Small dependency-free Node scripts already validate planning contracts. They are not a duplicate production chronology library. Test fixtures migrate to canonical-library tests at M024, and production BCE conversion outside that package is prohibited.

M009 establishes an installable workspace and minimal pinned Zod dependency. M010 hardens dependency governance and proves two isolated installs agree. M011 adds and validates development tools. Other packages are installed only when their module begins, with compatible exact versions checked then.
