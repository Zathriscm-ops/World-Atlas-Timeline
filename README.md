# World Atlas

Historical atlas built through a gated roadmap. **M001–M011 are PASS**; the next module is M012, Continuous Integration Foundation. See [the ledger](docs/progress/MODULE_LEDGER.md) and [ten-module completion evidence](docs/progress/M002-M011_COMPLETION.md).

## Local setup

Prerequisites: Git and Node **24.18.0** with npm. pnpm **10.34.5** is pinned; no global pnpm installation is required.

```powershell
npm exec --yes --package=pnpm@10.34.5 -- pnpm install --frozen-lockfile
npm exec --yes --package=pnpm@10.34.5 -- pnpm verify
```

With the pinned pnpm already available, use pnpm directly. Do not run npm install or generate a second lockfile. npm exec only bootstraps the pinned manager; the pnpm package store is local under ignored .cache.

pnpm verify runs real lint, strict type, format, repository, planning-contract and intentional-failure checks. pnpm test:install tests two fresh committed clones and compares dependency graphs. See [toolchain details](TOOLCHAIN.md) and [dependency policy](DEPENDENCY_POLICY.md).

The repository contains contracts and development infrastructure. The running atlas, API and database begin in later modules; no dev server or cloud deployment exists yet.

## Layout

- apps/web and apps/api: reserved frontend and API workspaces.
- packages/contracts: reserved public-contract workspace; canonical historical time code begins at M024.
- database: future reviewed migrations and PostGIS checks.
- data: planning fixtures, research metadata and isolated local raw downloads.
- infra: future Terraform/bootstrap boundary.
- docs: decisions, source audit, progress and gate evidence.
- scripts and tests: executable foundation checks and compiler integration fixture.

[Architecture](ARCHITECTURE.md), [quality budgets](QUALITY_BUDGETS.md), [ontology](ENTITY_ONTOLOGY.md), [time](TEMPORAL_MODEL.md), [uncertainty](UNCERTAINTY_MODEL.md), [provenance](SOURCE_PROVENANCE.md) and [licensing](DATA_LICENSING.md) define the accepted contracts.

Raw research files are excluded from Git and application assets. Acquisition URLs and hashes are in data/research/snapshot-manifest.json. None is approved historical production content.

Start future work at [MASTER_PROJECT_PLAN.md](MASTER_PROJECT_PLAN.md) and follow [AGENTS.md](AGENTS.md). The preserved roadmap is authoritative; completion claims come from the ledger and executed evidence.
