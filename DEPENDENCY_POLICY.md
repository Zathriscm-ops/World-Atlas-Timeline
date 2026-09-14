# Package and dependency governance

M010. Node 24.18.0 and pnpm 10.34.5 are exact repository pins. .node-version, engines.node and packageManager must agree with the documented setup. engine-strict and strict package-manager/version checks reject mismatches. Use the pinned runtime, not an ignore-engine flag.

## Reproducible installation

Use pnpm install --frozen-lockfile in fresh clones and CI. Commit pnpm-lock.yaml and all workspace manifests together. Do not commit npm/yarn lockfiles. Direct external dependencies use exact versions; internal dependencies later use workspace:*. A single workspace lockfile includes every importer and transitive integrity record.

The workspace contains root plus web, API and contracts placeholders. pnpm's isolated dependency resolution discourages undeclared imports; no blanket hoisting. Root Zod is a development dependency for the repository validation smoke test; production packages declare their own dependencies when introduced.

New stores and no existing node_modules are used in install verification. Compare the normalized **actual pnpm dependency graph**, lockfile hash and command results from two independent clones. Absolute disk paths are excluded from graph identity; names, versions and dependency edges are retained. Platform-specific optional packages can legitimately differ across OS, so compare identical platform profiles and later maintain a separate Linux CI baseline.

## Changes and updates

- Each new direct dependency needs purpose, owning module, license, compatible engines/peers and alternatives considered.
- Review monthly patch/minor updates; major upgrades require compatibility evidence and an ADR when architecture changes. Do not select latest merely because it exists.
- Review high/critical advisories within 24 hours; fix reachable issues before release and normally within 72 hours. Record unresolved noncritical issues with owner/date.
- Update exact manifest pins and lockfile with the pinned pnpm version; run install comparison, lint/type/tests and all affected domain/integration/build gates.
- Inspect lockfile changes for unexpected registries, Git URLs, install scripts and transitive additions. No automatic merge of dependency updates.
- Third-party dependency build scripts are denied unless an explicit reviewed allowlist entry is needed. No application package is publicly publishable (private: true).
- Never use --no-frozen-lockfile, --ignore-engines, --force or broad overrides to make CI green. A deliberate local dependency update may regenerate the lockfile; verification then uses frozen mode.

The pinned pnpm 10 JavaScript release avoids adopting an unnecessary native major. Node 24.18.0 is the installed supported toolchain target. TypeScript-linter compatibility is described in ADR 0009 and tested in M011.

## Verification

pnpm test:install clones the committed source twice into ignored .verification directories with separate stores, installs frozen dependencies, runs repository smoke tests and compares graphs. It then intentionally changes a clone's dependency manifest and runtime requirement to prove both are rejected. No source checkout or historical data is deleted.

Gate snapshots can be recorded with pnpm test:install --module M010 --record. Routine runs save disposable evidence only. Exact commands, source commit, graph hash, lock hash, platform and outcomes are retained in docs/progress/M010_INSTALL.json. This simulates clean dependency state on the current Windows host; it does not claim a new VM or Linux run. M012 adds CI's independent operating-system evidence.
