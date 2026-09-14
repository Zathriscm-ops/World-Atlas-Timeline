# World Atlas

A gated historical atlas project. Start with [the governing plan](MASTER_PROJECT_PLAN.md) and [module ledger](docs/progress/MODULE_LEDGER.md).

## Local setup

Prerequisites: Git, Node **24.18.0** and its npm bootstrap client. The repository pins **pnpm 10.34.5**; no global pnpm install is required.

```powershell
npm exec --yes --package=pnpm@10.34.5 -- pnpm install --frozen-lockfile
npm exec --yes --package=pnpm@10.34.5 -- pnpm test:repository
npm exec --yes --package=pnpm@10.34.5 -- pnpm test:planning
```

If pnpm 10.34.5 is already available, use pnpm directly. Do not use npm install or generate a second lockfile in the repository. npm exec only bootstraps the pinned package manager. The package store is local under .cache and ignored.

This foundation has no running atlas application yet. Frontend, API and shared package directories reserve boundaries; their implementation begins in the roadmap's owning modules. There is no dev server, database or deployment to start at M009.

## Layout

- apps/web and apps/api: reserved frontend/API workspaces.
- packages/contracts: reserved public-contract workspace; packages/time begins at M024.
- database: future migrations and database verification.
- data: clearly labeled planning fixtures and research metadata; raw downloads are local quarantine.
- infra: future Terraform/bootstrap work; no AWS resources created.
- docs: architecture decisions, source research, module ledger and gate evidence.
- scripts: real planning/repository checks.
- tests: later toolchain/domain/integration/browser checks.

[Architecture](ARCHITECTURE.md), [quality budgets](QUALITY_BUDGETS.md), [source provenance](SOURCE_PROVENANCE.md) and [licensing policy](DATA_LICENSING.md) define the contracts. Documentation-only checks do not establish historical or GIS correctness.

Raw research data is excluded from Git and application assets. Check data/research/snapshot-manifest.json for pinned acquisition URLs and hashes. Do not publish it without the later rights and historical review gates.
