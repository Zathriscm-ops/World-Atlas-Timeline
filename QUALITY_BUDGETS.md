# Quality, performance and cost budgets

M008 defines pass/fail targets before implementation. Values below are targets, not measured product results. A gate that owns the relevant behavior must collect its evidence. No empty suite, waived test or percentage of documentation counts as runtime success.

## Measurement contract

Pin browser version, OS, CPU/GPU, viewport, dataset hash, commit and network profile in each report. Desktop: 1440×900, 10 Mbps download, 80 ms RTT. Mobile: 390×844 with the same network and 4× CPU slowdown. Record physical hardware; compare baseline/candidate on the same runner. Browser emulation is not proof of performance on every phone.

Use nearest-rank p95 over every measured sample, with no outlier removal. Thirty cold page loads per profile, empty browser cache; start at navigation and end when map, initial data, timeline and selection are usable. API: 100 warmups then 1,000 measured requests **per routine endpoint**, concurrency 10, same-region client, valid representative payloads and cached connections. Separately record 30 verified cold starts; don't blend them into warm percentiles. Failed requests remain in error metrics and cannot disappear from latency reporting.

Performance fixture: at least 1,000 entities, 10,000 temporal states and 100,000 vertices, including uncertain/disputed states and BCE/CE transitions. Use a fixed seed and preserve a fixture hash. It is a synthetic load profile, not the historical content roster. API/page metrics are recorded separately from database timings.

## Limits

| Measure | Pass criterion |
|---|---|
| Cold usable atlas | p95 ≤5,000 ms on both defined profiles |
| Initial transfer | ≤3,000,000 gzip bytes including required first-view data, fonts, CSS and scripts |
| Initial JavaScript | ≤350,000 gzip bytes before lazy map code; map code chunk ≤1,500,000 gzip bytes, still counted in usable-atlas transfer/time |
| Routine public API | warm p95 <300 ms end to end from same-region load client; cold p95 ≤1,500 ms; errors ≤1% |
| Database | warm routine query p95 ≤100 ms; bbox/point spatial query p95 ≤150 ms, 1,000 executions per class with EXPLAIN ANALYZE/BUFFERS evidence |
| Seek/selection | input to correct visible state p95 ≤100/150 ms over 200 operations; stale results never overwrite newer selection |
| Map playback | 30 seconds at 1, 10 and 100 historical years/real second; frame p95 ≤33.4 ms, no UI main-thread task >200 ms |
| Types/lint/format | zero type errors, lint errors or warnings, formatting differences |
| Coverage | temporal production package ≥90% branch coverage; project production code ≥80% lines and ≥80% branches |
| Critical tests | zero skipped/quarantined critical time, provenance, geography, publication, security or primary workflow tests |
| Published data | zero invalid geometry, wrong CRS/axis order, broken relationships, unsourced historical entities/states/claims, missing rights or unreviewed AI assertions |
| Security | zero unresolved P0/P1 issues; no reachable high/critical dependency vulnerability without remediation; unknown scan result blocks release security gate |
| Accessibility | critical workflows keyboard-operable with visible focus and a non-canvas information path; no critical/serious automated accessibility findings in tested flows |

Budget boundaries are inclusive except API's strict <300 ms. Transfer uses decimal bytes and deterministic gzip settings, never raw source size. DB numbers exclude network; API numbers include it. Offline/error handling has its own correctness tests.

Coverage denominator includes all first-party production domain/API/UI source files, including unimported files. Exclude generated declarations, vendored files, migrations, fixtures, test code and configuration; maintain a reviewed exclusion list. No blanket exclusion of hard-to-test map adapters. Before production code exists coverage is N/A, not 100%. Runtime coverage cannot certify historical truth.

## Validation and defects

100% of release records must pass schema and referential checks. Published geometry must be nonempty and valid, use the agreed CRS/GeoJSON longitude-latitude order, and retain source/uncertainty. Quarantined input may fail validation but cannot enter public outputs. Unknown geometry may remain explicitly unmapped; it is not a fabricated valid polygon.

P0: loss/corruption of data, security breach, destructive deployment or unavailable production. P1: wrong time/spatial result, broken primary feature, missing provenance or major security weakness. Either blocks PASS. P2 normally closes by phase end; P3 may be tracked with owner and acceptance. Performance failures require a fix or an explicit reviewed budget ADR; “where practical” is not an unrecorded waiver.

Run dependency/security scans at dependency changes and release; record advisory database timestamp and inspect reachability. Release secrets scan covers tracked source, configuration and generated deploy artifacts. M011's installed tools do not pretend to implement the later full release scanner.

## Cost guardrails

Planning allocation: **USD 150/month for the project across AWS environments**, before tax, without free-tier credits. Production allocation 100, staging 25, development 0 (local by default), contingency 25. These are design ceilings, not an AWS quote or authorization to spend.

M081 must produce a saved region-specific calculator estimate with instance sizes, hours, storage/backups, API requests, Lambda duration/memory, secrets, endpoints/network transfer, logs, CloudFront/S3 and domain costs. Include an always-running private database, not just static hosting. Fit all active environments within the envelope or revise the architecture/budget explicitly before provisioning. Current project cloud resources and spend created in M002–M011: zero.

Configure actual-cost alerts at 50%, 80% and 100% (75, 120 and 150 USD), and forecast alert at 100%, plus per-environment allocations. Confirm the test notification in M082. Required tags: Project, Environment, Owner, ManagedBy, CostCenter. At 80%, review forecasts and stop new optional provisioning; at 100%, block optional deployments and apply a reviewed cost reduction. Alerts are delayed notifications, not hard spending caps or automatic permission to destroy a database.

Pricing structures were checked on 2026-09-14: [RDS](https://aws.amazon.com/rds/postgresql/pricing/), [VPC](https://aws.amazon.com/vpc/pricing/), [CloudFront](https://aws.amazon.com/cloudfront/pricing/), [Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/pricing/). Rates/configuration must be refreshed at M081. No reserved commitments or paid extras selected now.

Curation planning assumption: 15–25 settlements and 20–40 events plus M065's political/people roster. Reserve 2–4 reviewer hours per straightforward sourced item, more for disputed geography; this is an estimate to calibrate on the first five reviewed items, not a delivery promise. Contributor/review time is not included in the AWS allocation.

## Optimization gates

M077 simplification, M078 vector tiles and M079 ranged artifacts still require their listed concrete proofs using small synthetic or cleared datasets. Measure baseline and candidate on identical profiles; show topology/selection/time correctness and, for range requests, real partial-byte delivery. Adopt in production only for a demonstrated breached budget or ≥20% relevant p95/transfer improvement without regression. Retain GeoJSON if the proof provides no benefit; successful evaluation is not permission to skip the proof. Any genuinely inapplicable original gate needs an ADR amendment before execution.

Playback uses elapsed monotonic time, not frame count; pause freezes historical time, seek cancels stale work, and dropped frames catch up to the clock without replaying unbounded updates. M031 supplies deterministic clock tests.

Machine-readable targets: data/fixtures/planning/budgets.json. Threshold boundary and consistency checks run now; workload/performance/security/cloud measurements run when their modules exist.
