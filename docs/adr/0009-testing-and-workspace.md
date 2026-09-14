# ADR 0009: Pinned workspace and layered verification
Status: Accepted, M007, 2026-09-14.

Use pnpm workspaces, a single committed lockfile and exact direct dependency pins. Select pnpm 10.34.5 (Node-compatible JavaScript release line) and existing Node 24.18.0. The newer native pnpm major provides no required feature for this workspace. The root remains private and unlicensed for publication until an explicit code-license decision; no package is accidentally published.

M009 includes manifest, workspace file and lockfile because its fresh-clone install gate requires them. M010 owns engine enforcement, update rules, graph comparisons and frozen-lock rejection tests. This resolves DEP-01 without waiving either gate.

Use Vitest for domain/unit and integration orchestration, React Testing Library for accessible component behavior, and Playwright for browser workflows. SQL/real PostGIS integration remains real-database testing, not a mock. Dependency-free planning checks continue until production components exist; don't fabricate an empty Vitest suite in M009.

M011 pins TypeScript 6.0.3 with typescript-eslint 8.70.0, ESLint 10.10.0 and Prettier 3.9.6. Registry metadata and [typescript-eslint's supported ranges](https://typescript-eslint.io/users/dependency-versions/) exclude TypeScript 7 at this date. Strict types and lint must detect intentional bad files. Formatting is separate from semantic lint. M012 adds CI; no no-op build or empty coverage percentage counts as passing production verification.

[Package installation guidance](https://pnpm.io/installation). Direct versions are proposals until actual installs and checks pass; any compatibility fix is documented with the gate evidence.
