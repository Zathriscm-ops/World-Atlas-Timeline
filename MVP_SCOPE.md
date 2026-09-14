# World Atlas — MVP Scope

Module: **M001 — Product Charter**  
Public-release boundary: **v1.0, M001–M116**  
Governing roadmap: [Gated Development Master Plan](GATED_DEVELOPMENT_MASTER_PLAN.md)  
Related charter: [PRODUCT_VISION.md](PRODUCT_VISION.md)

## Classification contract

- **REQUIRED:** must be delivered and evidenced by the corresponding public-MVP module gate. This includes required evaluations/proofs where implementation is explicitly conditional on measurement.
- **DEFERRED:** retained in the roadmap or backlog, but outside the public-MVP implementation boundary.
- **REJECTED:** incompatible with the product's correctness, sourcing or scope rules; not a promised future feature.

A required evaluation is not permission to declare a build-specific gate passed without building it. Conditional modules must resolve their precise accepted artifact/gate in an ADR before execution if the original gate cannot apply. M001 does not authorize a skipped module or change any module's PASS requirement.

## Geographic, temporal and content boundary

| Dimension | Contract |
|---|---|
| Region | Europe and Mediterranean; adjoining Near Eastern extents for selected interacting entities; partial coverage disclosed |
| Period | Approximately 500 BCE–500 CE; core selected-year domain includes both endpoint years |
| Categories | Political entities, major peoples/presence, settlements and selected events |
| Settlements | 15–25; start editorial planning at 15 |
| Events | 20–40; start editorial planning at 20 |
| Political/people counts | Selected cases from M066–M070; exact roster frozen in M065 after source/license evaluation |
| Geographic states | Evidence-driven snapshots/reviewed validity, with gaps and disagreement retained; no invented annual completeness |
| Release identity | App v1.0 is the first public MVP; data versions are separately identified under M063/M094 |
| Access | Public read experience without mandatory visitor accounts; authenticated operational publication/admin actions |

The prior 24–36 total-entity target and static-only public MVP are superseded. Module M065 refines the dataset within this charter; it does not defer deciding whether basic location history, sources, API or cloud deployment belong to v1.0—they do.

## Required features and enabling work

| ID | Feature or capability | Classification | Module ownership / scope limit |
|---|---|---|---|
| R01 | Product, ontology, time, uncertainty, provenance and licensing contracts | REQUIRED | M001–M006; distinct entity types and sourced claims |
| R02 | Explained technology choices and measurable quality/cost budgets | REQUIRED | M007–M008; no portfolio-only dependencies |
| R03 | Reproducible repository, lockfile, strict code checks and CI | REQUIRED | M009–M012; cumulative verification grows with implemented work |
| R04 | Local PostGIS, controlled migrations and validated configuration | REQUIRED | M013–M015; no embedded credentials |
| R05 | Map container, physical base style, navigation, pan and zoom | REQUIRED | M016; map dominates layout |
| R06 | CRS contract and coordinate alignment | REQUIRED | M017; source transformation distinct from CRS labeling |
| R07 | Validated Point, LineString, Polygon and MultiPolygon loading | REQUIRED | M018; line support is a kernel capability, not a full trade/migration product |
| R08 | Independently controlled political, city, event and people/culture layers | REQUIRED | M019/M047; complete archaeological-culture content not required |
| R09 | Type, confidence, hover and selected-feature styles | REQUIRED | M020; styles do not alter evidence |
| R10 | Hover/click/highlight/deselect and overlap disambiguation | REQUIRED | M021; account for points above polygons and simultaneous claims |
| R11 | Geometry publication validation | REQUIRED | M022; invalid geometry cannot become PUBLISHED |
| R12 | Point, viewport and territory spatial query proofs | REQUIRED | M023; use declared fixtures, not geographic containment as proof of political control |
| R13 | Shared historical date primitives and formatting | REQUIRED | M024–M025; preserve BCE/CE and uncertain precision |
| R14 | Multiple temporal geographic states per entity | REQUIRED | M026; identity independent of geometry |
| R15 | Half-open intervals, gaps and explicitly permitted overlaps | REQUIRED | M027; no blanket prohibition on legitimate contested/nested representations |
| R16 | Correct active-state selection | REQUIRED | M028; controlled fixture oracle and boundary cases |
| R17 | Shared selected historical time | REQUIRED | M029; all time-sensitive views agree |
| R18 | Slider, year entry, BCE/CE display and step controls | REQUIRED | M030; manual entry and keyboard operation |
| R19 | Play, pause, speed, seek and restart | REQUIRED | M031; units and deterministic clock behavior formalized in that module |
| R20 | Incremental map transitions when time changes | REQUIRED | M032; do not reload the atlas every frame or invent intervening geometry |
| R21 | Entities, aliases, historical names and relationships | REQUIRED | M033–M035; names are not automatic identity splits |
| R22 | Source database and field/geometry/date/event/relationship citations | REQUIRED | M036–M037; source locators and rights survive export |
| R23 | Settlement lifecycle and optional sourced measurements | REQUIRED | M038; model supports population estimates without requiring invented values or a population layer |
| R24 | Events linked to chronology, location, entities and sources | REQUIRED | M039; advanced moving-route visualization remains deferred |
| R25 | Versioned API, structured errors, request IDs, validation and logging | REQUIRED | M040; predictable bounded contracts |
| R26 | Entity, relationship, alias and source API reads | REQUIRED | M041; real database integration tests |
| R27 | Temporal and combined spatial/temporal map-state APIs | REQUIRED | M042–M043; viewport/layer/date filtering |
| R28 | Canonical, alias, historical-name and partial search API | REQUIRED | M044; benchmarked relevant results |
| R29 | Basic location-history API | REQUIRED | M045; represent multiple simultaneous claims and gaps, not a fabricated single-owner sequence |
| R30 | Map-first application layout | REQUIRED | M046; navigation, timeline, layer controls and panel |
| R31 | Date-aware entity panel with sources and relationships | REQUIRED | M048; unknown fields remain unknown |
| R32 | Search-to-date/camera/highlight/panel workflow | REQUIRED | M049; atomic navigation outcome |
| R33 | Reproducible deep links | REQUIRED | M050; selected time/entity/camera/zoom/layers and dataset consistency |
| R34 | Temporally appropriate city and event visualization | REQUIRED | M051–M052; selected event exposes its evidence |
| R35 | Basic location-history interface | REQUIRED | M053; agrees with API fixtures |
| R36 | Desktop, tablet, basic mobile and accessible primary controls | REQUIRED | M054; no serious/critical automated findings and usable keyboard paths |
| R37 | RAW through PUBLISHED/RETIRED lifecycle and source registry | REQUIRED | M055–M056; no bypass of review/rights |
| R38 | Immutable raw imports and repeatable normalization | REQUIRED | M057–M058; hashes and source versions retained |
| R39 | Chronology and geographic import validation | REQUIRED | M059–M060; GeoJSON and coordinate CSV; other formats via controlled preprocessing |
| R40 | Duplicate review suggestions and human review decisions | REQUIRED | M061–M062; no destructive automatic identity merging |
| R41 | Identifiable dataset releases and rollback | REQUIRED | M063–M064; bad-fixture drills occur in isolated test environments |
| R42 | Frozen regional dataset charter and selected Greek/Persian/Hellenistic/Roman/Carthaginian/Near Eastern coverage | REQUIRED | M065–M069; candidate lists are research inputs, not assertions that data already exists |
| R43 | Selected European peoples, 15–25 settlements and 20–40 events | REQUIRED | M070–M072; uncertainty and evidence requirements retained |
| R44 | Complete MVP historical quality audit | REQUIRED | M073; zero blocking citation/date/geometry/rights/identity errors |
| R45 | Performance baseline and evidence-led database indexes | REQUIRED | M074–M076; benchmark changes, do not defer essential integrity indexes |
| R46 | Geometry LOD and vector-tile/PMTiles evaluation and required proofs | REQUIRED | M077–M079; production adoption follows measured need; original gate evidence still required |
| R47 | Client caching with correct historical/release identity | REQUIRED | M080; measurable reuse without stale state |
| R48 | Environment matrix, budgets and Terraform foundation | REQUIRED | M081–M083; resolve bootstrap/order prerequisites before provisioning |
| R49 | S3/CloudFront frontend and staged API Gateway/Lambda/private RDS | REQUIRED | M084–M087; runtime/database dependencies must be resolved explicitly |
| R50 | Least-privilege IAM, secret rotation, domain and valid HTTPS | REQUIRED | M088–M090; minimum safe controls required when each resource first exists |
| R51 | Infrastructure CI, staging promotion, migration and independent data deployment | REQUIRED | M091–M094; failures stop promotion; production approval follows the roadmap |
| R52 | Traceable logs, CloudWatch alarms and safe user-facing errors | REQUIRED | M095–M097; finite logging and no raw database details |
| R53 | Backup plan and actual isolated disaster-recovery test | REQUIRED | M098–M099; restoration evidence, not documentation alone |
| R54 | Threat model, input/browser/dependency security and abuse controls | REQUIRED | M100–M104; no unmitigated release blockers |
| R55 | Golden path, historical/GIS regression, search/performance/accessibility/data/security release audits | REQUIRED | M105–M112; actual tests and editorial evidence |
| R56 | Release candidate, portfolio documentation, reliable demo and public launch | REQUIRED | M113–M116; staging then production evidence and correct versions |

## Deferred features

| ID | Feature or capability | Classification | Later ownership / boundary |
|---|---|---|---|
| D01 | Independent two-date compare mode | DEFERRED | M117 |
| D02 | Richer global/location-history exploration | DEFERRED | M118; basic MVP location history remains required |
| D03 | General curated story/documentary engine | DEFERRED | M119; a tested MVP demonstration sequence does not require this engine |
| D04 | Web curator administration and map polygon editor | DEFERRED | M120–M121; controlled review/publication workflow remains required |
| D05 | Temporal migration and trade-network visualization systems | DEFERRED | M122–M123 |
| D06 | Production religion and language layers | DEFERRED | M124–M125 |
| D07 | Population visualization and historical-person/ruler databases | DEFERRED | M126–M127; no obligation to fill unsupported panel estimates |
| D08 | Historical coastlines and full globe experience | DEFERRED | M128–M129 |
| D09 | Additional regional datasets and reusable expansion framework | DEFERRED | M130 |
| D10 | Prehistoric, medieval, early-modern and modern coverage | DEFERRED | M131–M134 |
| D11 | Historical query language and natural-language atlas assistant | DEFERRED | M135–M137; AI publication safeguards already apply to any earlier AI-assisted input |
| D12 | 10k/100k/1M feature scale architecture and tile-generation service | DEFERRED | M138–M139; small representative MVP benchmarks remain required |
| D13 | Horizontal API scaling and separate search infrastructure | DEFERRED | M140–M141; only after benchmark justification |
| D14 | Global CDN dataset distribution | DEFERRED | M142; regional CloudFront delivery remains required |
| D15 | Community contributions, expert role system and expanded audit tooling | DEFERRED | M143–M145; basic provenance/revisions are already required |
| D16 | External public API product with long-term consumer guarantees | DEFERRED | M146; application-facing read API remains required |
| D17 | Embeddable maps and education/classroom workflows | DEFERRED | M147–M148 |
| D18 | Full platform maturity certification | DEFERRED | M149; its checkmarks are future objectives |
| D19 | Visitor accounts, saved/custom maps, quizzes, dedicated mobile app and AR/VR | DEFERRED | Earlier long-term ideas; no assigned v1.0 module |
| D20 | Terrain, climate/ice/sea-level history, genetic-ancestry layers, army animation and detailed trade-volume simulation | DEFERRED | Separate future evidence/product decisions; not implied by basic map/event types |

## Rejected approaches

| ID | Approach | Classification | Reason |
|---|---|---|---|
| X01 | Treat every historical entity as a country | REJECTED | Erases type, identity and representation distinctions |
| X02 | Publish invented or unsourced history as verified | REJECTED | Violates the provenance and review contract |
| X03 | Draw precise political-style borders for approximate cultural presence merely for appearance | REJECTED | Creates false certainty |
| X04 | Automatically morph political borders into unsourced intermediate states | REJECTED | Invents territorial history; interface-only transitions remain possible |
| X05 | Present missing coverage as absence of people or activity | REJECTED | Unsupported historical inference |
| X06 | Make an AI response the authoritative historical record without review | REJECTED | AI is a processing/interface tool, not independent evidence |
| X07 | Publish unknown-license or restricted input without an applicable authorization | REJECTED | Production rights gate must pass |
| X08 | Delete original evidence, data or migrations to hide a failing gate | REJECTED | Destroys reproducibility and auditability |
| X09 | Automatic destructive entity merging based on name similarity | REJECTED | Distinct people, places and polities can share names |
| X10 | Add services, microservices or dependencies solely for portfolio appearance | REJECTED | Cost/complexity need a demonstrated architectural role |
| X11 | Declare runtime tests passed when only planning documents exist | REJECTED | Gate evidence must describe work actually performed |
| X12 | Silently substitute the older static-only release or start downstream modules | REJECTED | Conflicts with the governing sequence and public-MVP definition |

## Module boundary and quality baseline

Every M001–M116 module is part of the public-MVP gate sequence. Every M117–M149 module is deferred until v1.0 is stable. No module is completed by appearing in these tables. M001 delivers product documents only; M002 ontology, M003 chronology and all later implementations remain separate assignments.

The project-wide baseline is the supplied plan: zero TypeScript/lint errors; temporal engine branch-coverage target at least 90%; meaningful project-wide coverage target at least 80%; no skipped critical-path tests; valid published geometry and references; sourced published entities/geography; explicit appropriate uncertainty; no unresolved P0/P1; accessible critical screens; private production database; and least-privilege, authenticated administrative operations. M008 turns performance, coverage measurement scope and cost targets into reproducible pass/fail criteria. Coverage percentages do not replace semantic test cases or human historical review.

Performance targets are to be measured on a declared workload, including the roadmap's initial routine API p95 target below 300 ms where practical. M001 does not invent a hardware profile or certify performance. The expanded API/RDS release needs a new budget; the archived static-demo estimate is not its spending approval.

## Critical scope contradictions resolved

| Prior ambiguity | Resolution | Evidence |
|---|---|---|
| Old public MVP called v0.1; new one v1.0 | New release landmarks govern | ADR 0001; R56 |
| Static-only MVP versus API/RDS requirements | API and private RDS are required by v1.0 | R25–R29, R49 |
| Location history previously post-MVP | Basic query/interface required; richer form deferred | R29/R35, D02 |
| 24–36 total entities versus 15–25 cities plus 20–40 events | Retire prior total cap; adopt new category counts; roster frozen in M065 | Content boundary; R43 |
| Admin workflow versus future web editor | Required controlled operations; web editing UI deferred | R40/R50, D04 |
| Tile work conditional versus sequential gates | Required evaluation/proof; no undocumented production rollout or automatic waiver | Classification contract; R46 |
| Earlier stack suggestions versus new Zod/pnpm direction | New direction prevails; exact architecture/governance owned by M007/M010 | ADR 0001 |

There are no unresolved critical **product-scope** contradictions in this charter. Future technical sequencing decisions remain in [the dependency register](docs/progress/PLANNING_DEPENDENCIES.md) and must be resolved before the affected modules begin. They are not resolved implementation decisions or exemptions from gates.
