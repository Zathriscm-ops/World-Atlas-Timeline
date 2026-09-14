# World Atlas — Product Vision

Module: **M001 — Product Charter**  
Authority: [Gated Development Master Plan](GATED_DEVELOPMENT_MASTER_PLAN.md)  
Scope decisions: [MVP_SCOPE.md](MVP_SCOPE.md)  
Precedence decision: [ADR 0001](docs/adr/0001-adopt-gated-roadmap.md)

## 1.01 Mission

Help people understand human history through place and time, with visible evidence, uncertainty and historical context. World Atlas is a temporal, spatial and historical-provenance system whose primary interface is an interactive map.

A visitor should be able to ask what is represented at a selected historical date, where it is represented, how that representation changes, and why the atlas makes that claim. A geographic location should also provide an entry point into its documented history.

The product must make unsupported coverage and disputed interpretations understandable. A blank map area must not imply that nobody lived there, and an attractive polygon must not imply that a precise ancient frontier is known.

## 1.02 Primary users

| User | Primary job | Evidence of a successful experience |
|---|---|---|
| Historically curious visitor | Explore changes across a region and time span | Can seek a date, identify an entity and explain a visible change |
| Student or independent learner | Connect geographic patterns with historical accounts | Can find a relevant event/place and inspect its supporting source |
| Teacher preparing an explanation | Demonstrate a sequence and share a view | Can use playback, layers and a reproducible link without specialist GIS training |
| Project curator / developer | Publish and correct a small trustworthy dataset | Can trace claims, validate input and recover a previous publication |

Specialist researchers, institutional curators, community contributors, API consumers and classroom administrators are future audiences. Their needs inform extensibility without making advanced research or collaboration tools first-release requirements.

## 1.03 Public MVP

The public MVP is **v1.0**, following successful completion of **M001–M116**. Its geographic scope is Europe and the Mediterranean, with adjoining Near Eastern coverage needed for the selected historical entities. Its chronological domain is approximately **500 BCE–500 CE**, displayed with conventional BCE/CE labels.

It includes selected political entities, major peoples/presence representations, settlements and events. Coverage is curated and explicitly bounded. This is not a complete annual atlas of all societies within the region.

The principal interaction is:

```text
Open the atlas -> choose a date or search
    -> view relevant geographic states
    -> select an entity and inspect its current-date information
    -> inspect sources and uncertainty
    -> play through change or ask for a location's history
    -> toggle layers and share a reproducible view
```

The release includes a working API, basic location-history API/interface, a reviewed data pipeline, dataset versioning/rollback, AWS hosting, private RDS/PostGIS, operational visibility, backup recovery, infrastructure as code and the gated security/quality checks. These are part of the new plan; a static-only website does not satisfy the complete public MVP.

Target 15–25 settlements and 20–40 selected events, beginning at the lower ends for workload control. The political/people roster and temporal-state count will be frozen in M065 using sourcing and licensing evidence. No total 24–36 entity cap from the earlier proposal remains in force.

## 1.04 Non-goals

The first release does not attempt all world regions, all periods, all annual borders or all possible historical facts. Full globe/terrain, compare mode, rich documentary stories, public contribution/editing, polygon drawing, migration/trade systems, production language/religion/population layers, historical-person databases, AI chat and classroom tools are deferred to the designated later modules.

The product does not require visitor accounts to explore public data. A required controlled curation/publication workflow does not imply a public web editor. It does not present synthetic engineering fixtures as historical evidence, interpolate unsourced borders, flatten uncertain peoples into modern-style countries, or treat AI output as scholarly authority.

The detailed REQUIRED/DEFERRED/REJECTED register in `MVP_SCOPE.md` is authoritative for feature classification.

## 1.05 Long-term vision

Extend the same evidence-aware engine to more regions, earlier and later periods, richer historical domains and additional interaction modes. New domains should primarily add data, vocabulary, representation policies and focused modules rather than require replacement of the temporal/GIS core.

The long-term roadmap includes independently timed compare views, curated stories, audited curator tools, migrations and trade networks, language and religion distributions, sourced population estimates, historical figures, changing physical geography, globe mode, structured/natural-language queries and carefully reviewed community contributions.

Global coverage does not mean uniform confidence or a single definitive account. The platform should preserve named interpretations and explain what is known, inferred, contested or not yet covered. A future AI interface can operate on atlas records and expose sources; it cannot silently become the historical database.

## 1.06 Success criteria

| ID | Product outcome | Acceptance evidence required for the public release |
|---|---|---|
| SC-01 | The primary atlas workflow is usable | M105 golden path passes in staging and M116 production smoke checks pass |
| SC-02 | Time and space remain correct together | Temporal/GIS fixtures pass; the map, information panel and URL agree on selected time and dataset |
| SC-03 | Historical assertions are inspectable | Every published entity and geographic state is sourced; applicable date/event/relationship/measurement claims expose provenance; M073/M111 audits pass |
| SC-04 | Uncertainty and coverage are honest | Uncertain presence differs visibly from political control; unknown dates and coverage gaps do not become invented facts |
| SC-05 | The dataset provides a coherent demonstration | Required content modules pass; the M115 sequence runs without manual correction; cities/events meet the final M065 charter |
| SC-06 | Essential interactions are accessible | Keyboard paths work; no serious/critical automated accessibility findings on primary screens; M110 also includes manual review |
| SC-07 | Performance is sufficient on declared targets | M008 defines reproducible budgets; M109 demonstrates them on representative desktop/mobile hardware rather than a blanket claim of speed |
| SC-08 | Publication is controlled and recoverable | Unreviewed data cannot publish; app/data versions are identifiable; data rollback and isolated recovery tests pass |
| SC-09 | The release is secure and operationally bounded | No unresolved P0/P1 release blockers; required security gates pass; private DB, least privilege, monitoring and tested budget alerts exist |
| SC-10 | The project can be maintained by another developer | Fresh setup, module evidence, architecture decisions and deployment/recovery instructions are reproducible and understandable |

These are release outcomes, not claims that a product exists today. Module M001 passes by delivering and verifying this charter and its complete scope classifications. Runtime, historical-data and cloud evidence must be supplied by their own modules.

## Product priorities and change control

Prioritize historical meaning, temporal correctness, GIS correctness, provenance and reproducible data before adding visual sophistication or cloud scale. The interface remains map-first, restrained, readable and educational.

The project owner is accountable for scope and release decisions. A coding agent may implement the current authorized module, but cannot broaden the MVP, change durable contracts, bypass gates or certify historical facts without evidence. Changes to this charter require an updated scope register, an ADR when architectural, and a recorded impact on the ledger. Later content detail is resolved in M065; it cannot contradict the agreed geography, chronology or provenance requirements without an explicit scope change.
