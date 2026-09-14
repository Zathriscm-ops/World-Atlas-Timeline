# ADR 0012: One CI command and an enforced pull-request result
Status: Accepted implementation design, M012.

Use GitHub Actions with Windows and Linux jobs and a final required result. A small typed fail-fast orchestrator gives local execution and CI the same stage order; unit tests and compiled-artifact checks test real orchestration behavior. Pin official checkout/setup-node actions by commit.

M012's build compiles and executes this tooling; it does not prematurely implement the M016 web application. Vitest 4.1.11 provides meaningful orchestration tests, Vite 7.3.6 is its compatible required tool dependency, yaml 2.9.1 validates workflow wiring and @types/node 24.13.4 supplies matching runtime types. Version/peer metadata was checked in the npm registry.

Hosted PR/check enforcement remains required evidence. Local pipeline success is not a substitute, and this ADR grants no module-order exception.

Compatibility evidence: Vitest 5.0.0/Vite 8.3.0 failed strict declaration checking (TS2430, TS2307, TS2305). The pinned 4.x/7.x pair is used instead; strict checking remains enabled. Upstream fixes are tracked in https://github.com/vitest-dev/vitest/pull/11175 and https://github.com/vitest-dev/vitest/pull/11141.
