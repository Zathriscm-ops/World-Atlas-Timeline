# Code quality toolchain

M011. Run pnpm verify for all currently implemented foundation checks. It runs ESLint, strict TypeScript, Prettier, repository smoke, cumulative planning contracts and deliberate failure detection. Every command performs real work and any failure exits nonzero.

## Configuration and scope

TypeScript 6.0.3 uses strict mode plus checked indexed access, exact optional properties, unused-code checks and no implicit returns. It checks first-party TypeScript in apps, packages and tests; current executable fixture proves Zod inference/module resolution. There is no production app compilation yet. Node planning/repository/quality scripts are linted as JavaScript; they are not falsely reported as TypeScript-checked.

ESLint 10.10.0 with typescript-eslint 8.70.0 uses recommended JavaScript/TypeScript rules, explicit debugger/equality checks and zero tolerated warnings. globals 17.12.0 supplies Node globals for the current scripts; add scoped browser globals when web code begins. Prettier 3.9.6 owns formatting with two spaces, semicolons, single-quoted JavaScript and LF endings. @eslint/js 10.0.1 provides ESLint's matching recommended configuration.

These packages are development-only: TypeScript compiles/checks, ESLint plus its config/parser checks code, globals defines runtime names, Prettier formats. No UI/API/test framework is installed merely to fill a list.

Format commands cover first-party code, fixtures and configuration. Preserved user roadmap/archive and machine gate evidence are excluded; their exact originals and report structure must not be rewritten by a formatter. No production source is excluded. Planning hashes are still checked.

## Gate proof

pnpm test:toolchain creates temporary files inside the compiler/linter's actual input tree, requires type mismatch and strict-null diagnostics, and requires debugger/undefined-name lint diagnostics. It also checks that malformed formatting fails and properly formatted input passes. The original compiler check must pass before and after; temporary files are removed only from the verified generated directory.

Record a reviewed snapshot with pnpm test:toolchain --record. Routine verification writes only ignored disposable evidence. pnpm test:install --module M011 --record also rechecks two clean dependency graphs after adding the toolchain.

Git hooks are optional here: no hook manager or automatic local Git configuration is imposed. The explicit command is portable and M012 will supply the authoritative CI merge gate. Developers may wire pnpm verify to a local pre-commit hook; hooks do not replace CI. This satisfies the roadmap's “where appropriate” qualification without an install-time script or extra dependency.

## Not yet implemented

No production build, domain coverage number, browser suite, PostGIS integration, release security scan or CI pipeline is claimed at M011. Their modules add checks to the common command as real components appear. There is deliberately no no-op build or verify:release command. The current 80/90% coverage targets remain N/A until production code exists.

References: [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict.html), [typescript-eslint setup](https://typescript-eslint.io/getting-started/), [Prettier configuration](https://prettier.io/docs/configuration). See DEPENDENCY_POLICY.md for exact-version updates.

## M012 extension

The current pnpm verify command also runs Vitest unit tests and the compiled CI tooling build. pnpm ci:check runs the full frozen-install pipeline. The GitHub workflow is implemented and locally tested on Windows/Linux; hosted pull-request enforcement remains BLOCKED as recorded in docs/progress/M012_VERIFICATION.md. Earlier M011 statements describe that completed baseline.
