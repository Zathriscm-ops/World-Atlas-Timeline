# World Atlas Timeline — Master Project Plan

Architecture proposal • 14 September 2026 • Planning only

**Recommendation:** build a small, curated atlas of Europe and the Mediterranean from 500 BCE to 500 CE. Use React, TypeScript, Vite, and MapLibre for the interface; PostgreSQL/PostGIS for authoring and spatial queries; and immutable, versioned exports for the first hosted experience. Deploy that experience with S3 and CloudFront. Introduce a live API and RDS when a feature actually needs them.

The defining architectural decision is to store **sourced claims about entities, places, and periods**, then publish a reviewed interpretation of those claims. A polygon represents a claim; it is neither the identity of an entity nor proof of a precise historical border.

The workspace was empty when inspected. This plan is the first project artifact. It does not implement the application or provision infrastructure. Technology and service references were checked on 14 September 2026. Recommendations, budgets, performance targets, and effort estimates below are proposals, not measured project results. Historical example records are illustrative until individually sourced and reviewed.

## Navigation

- Product: [A. Definition](#a-product-definition) · [B. Principles](#b-product-principles) · [C. Scope](#c-scope-architecture)
- Architecture: [D. Systems](#d-technical-architecture) · [E. Stack](#e-recommended-technology-stack) · [F. GIS](#f-mappinggis-architecture)
- Historical data: [G. Time](#g-historical-time-model) · [H. Schema](#h-core-data-model) · [I. Temporal geography](#i-temporal-geographic-model) · [J. Uncertainty](#j-uncertainty-model) · [K. Provenance](#k-source--provenance-model) · [L. Ingestion](#l-data-ingestion-pipeline)
- Experience: [M. API](#m-api-architecture) · [N. Frontend](#n-frontend-architecture) · [O. Playback](#o-timeline-playback-engine) · [P. Search](#p-search-architecture)
- Delivery: [Q. Dataset](#q-mvp-dataset) · [R. Stories](#r-mvp-user-stories) · [S. Repository](#s-repository-structure) · [T. Workflow](#t-development-workflow) · [U. Git](#u-git-strategy) · [V. Tests](#v-testing-strategy)
- Operations: [W. AWS and security](#w-aws-deployment-roadmap) · [X. Terraform](#x-terraform-roadmap) · [Y. Costs](#y-cost-estimate) · [Z. Risks](#z-project-risks)
- Execution: [Development roadmap](#development-roadmap) · [First 30 tasks](#first-30-development-tasks) · [Claude rules](#claude-development-rules) · [Immediate next step](#recommended-immediate-next-step)

## A. Product Definition

World Atlas Timeline is an interactive, source-aware historical atlas. It answers three connected questions: **What existed at this time? Where was it? What evidence supports that representation?** Later it also answers the inverse question: **What is known to have existed at this location over time?**

Conventional timelines obscure geography; conventional maps obscure change; encyclopedia articles fragment relationships between places, events, and periods. The product connects those views while making gaps and disagreements visible.

The initial audience is historically curious adults, students, and teachers exploring broad patterns. Researchers and specialist curators are a later audience requiring more detailed provenance, alternative interpretations, and exports. Content creators and museums may eventually use stories and embeds. Initially this is an educational exploration tool, not a comprehensive scholarly gazetteer or a replacement for specialist research.

The primary session is: open a regional map at 500 BCE; change the year; see supported territories and settlements change; click a feature; inspect information appropriate to that year; open its sources; search another entity; play through an interval. The map occupies most of the screen, with search at upper left, date/layers at upper right, a detail panel on selection, and a timeline along the bottom.

Success means users can understand a historical change, distinguish a polity from a people, and locate the evidence behind a displayed assertion. Raw polygon count is not the success metric. In an initial usability session, ask five people to find an entity, change its date, and explain an uncertainty label; aim for four to complete each task without coaching.

## B. Product Principles

1. **Temporal geography comes first.** Identity, geographic representation, historical time, and publication time are separate concepts.
2. **Claims require evidence.** A general bibliography does not substantiate every individual field.
3. **Uncertainty is data.** Preserve uncertain dating, approximate locations, contested identities, and competing interpretations.
4. **Missing coverage stays visible.** An empty map does not mean an uninhabited place, absent society, or political vacuum.
5. **Types carry meaning.** Peoples, language communities, religions, and archaeological cultures are not countries.
6. **Continuity requires judgment.** A new name, dynasty, or government does not automatically create a new entity.
7. **Animation must preserve the evidence.** Smooth controls must not invent intermediate borders or imply migration speeds.
8. **The map leads; detail follows.** Expose complexity through selection, legends, and source views.
9. **Small coverage, complete workflow.** A reviewed, reproducible dataset of a few dozen entities is the first objective.
10. **One core system, several publication formats.** Keep domain logic independent of rendering and AWS hosting.
11. **Releases are reproducible.** Every displayed claim traces to a data release and transformation history.
12. **AI assists; people remain accountable.** Machine output starts as a suggestion and cannot approve itself.
13. **Architecture follows demonstrated needs.** Add services and optimization against a measured bottleneck or accepted requirement.
14. **Accessibility and neutrality are product quality.** Support keyboard operation, reduced motion, readable contrast, and explanations that avoid projecting modern identities backward.

## C. Scope Architecture

Product phases here describe capability scope. Numbered engineering phases later describe implementation order.

| Product stage | Included | Boundary |
|---|---|---|
| MVP / v0.1 | Europe–Mediterranean, 500 BCE–500 CE; target 36 candidate entities, release floor 24 reviewed entities; political polygons, settlement points, one limited people/presence demonstration, a few events; yearly date control, play/pause/speed, layers, search, date-aware panels, citations, uncertainty legend, coverage gaps | No universal annual coverage, globe requirement, accounts, web editor, full population/ruler database, AI chat, smooth border morphing, or complete ethnic/cultural atlas |
| Product Phase 2 | More regional coverage; multiple interpretations in UI; location history; compare dates; stronger search; curator tools if justified; temporal tiles if benchmarks require them | Expansion follows source and performance gates |
| Product Phase 3 | Curated stories, migration/trade networks, selected language/religion layers, contributor review, richer measurements, live publication API | Each layer requires its own evidence and representation policy |
| Long-term vision | Broader chronology/geography, globe/terrain, historical environmental layers, education tools, public API, evidence-grounded natural-language controls, selected mobile experiences | Ancestry/genetics, AR/VR, detailed military animation, and universal reconstruction remain separate investment decisions |

A continuous timeline does not require fabricated annual evidence. Supported states appear over reviewed validity intervals; the interface shows gaps elsewhere. Choose a focused Roman/Carthaginian sequence as the demonstration spine, then exercise other geometry and identity cases.

For release, require at least 12 political entities, 8 settlements, 1 people/presence example, and 3 events, with all published claims sourced. Target 36 total only if research supports them. Plan roughly 60–100 geographic states, concentrated in the demonstration spine. These are editorial work limits, not requests to invent states.

Freeze scope in `REQUIREMENTS.md`. A new feature must replace an existing commitment or move to the backlog. A full alternate-interpretation browser is deferred, but the schema and at least one validation fixture must already support alternatives.

## D. Technical Architecture

Use a **modular monolith for authoring and queries**, with a separate publication output. Modules are code boundaries, not independently operated services.

### Local architecture

```text
Licensed source files + bibliographic records
                    |
            Ingestion commands
       Python / GDAL when necessary
                    |
        Staging + validation reports
                    |
        Human review and decisions
                    |
     PostgreSQL + PostGIS in Docker
   entities / claim revisions / geometries
                    |
      Deterministic publication command
                    |
      Versioned atlas release directory
      manifest + GeoJSON + catalog + citations
                    |
          Local static file server
                    |
        React + TypeScript + MapLibre

Later query experiments:
React -> Fastify read API -> the same PostGIS database
```

Use local files first for the map prototype, then make PostGIS the authoring store at the schema milestone. Reviewed import manifests remain reproducible inputs; the database is not the only surviving copy of the work. The exporter is the sole route from reviewed data to public assets.

### MVP AWS architecture

```text
Local review + release build
          |
GitHub Actions: validate -> build -> publish with short-lived AWS role
          |
Private S3 origin: web assets / atlas releases / basemap assets
          |
CloudFront: HTTPS, caching, origin access control
          |
Browser: timeline, search, panels and map use static release

Supporting resources: IAM + budgets + bounded logs/metrics
Optional custom domain: Route 53 + ACM certificate
```

There is no always-on production API or database in this deployment. The browser downloads the small regional release and selects historical states locally. “Static” describes delivery, not interaction: map, playback, search, and panels remain interactive.

A private S3 origin protects the origin, not viewer access. An invitation-only demo additionally requires CloudFront viewer authorization, such as expiring signed cookies issued through an operator-controlled process. A public MVP can serve reviewed content without accounts. Signed cookies/URLs and origin restrictions are separate controls in [CloudFront's private-content documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-overview.html).

### Future scalable architecture

```text
Browser -> CloudFront -> S3 immutable regional/temporal tile releases
       \-> HTTP API Gateway -> Lambda read API -> private RDS/PostGIS
                                             \-> published catalog

Curator interface -> authenticated write API -> draft revisions
Ingestion/publishing jobs -> reviewed database -> new immutable release

When justified:
API Gateway/Lambda -> ALB + ECS/Fargate running the same API modules
Long ingestion jobs -> scheduled/on-demand container jobs
Search -> PostgreSQL first; separate index only if required
```

Introduce the live API for location history across data too large to ship, authenticated curation, or publication frequency that static exports cannot reasonably support. Keep stable tiles and common catalog responses on the CDN. Move to Fargate when sustained traffic, GIS workloads, or connection behavior favor a process with predictable pooling. Keep CPU-heavy ingestion out of interactive handlers.

The durable boundaries are historical domain model, GIS transformation/query layer, publication contracts, and viewer. AWS integrations sit outside the domain. Compare panes later consume one release using independent view state; stories issue ordinary viewer commands.

## E. Recommended Technology Stack

| Decision | Recommendation | Alternatives and tradeoff | Revisit when |
|---|---|---|---|
| Web | React + TypeScript + Vite | Next.js helps server-rendered entity/editorial pages, but the map runs in the browser; SSR adds little to this MVP | Indexable long-form pages become central |
| Map | MapLibre GL JS behind a small map adapter | Mapbox offers hosted services; Cesium emphasizes 3D; Leaflet favors simpler maps | See GIS comparison |
| Styling | CSS variables and CSS modules; accessible native controls initially | Tailwind is acceptable if preferred; a large component system is unnecessary | Repeated complex interactions justify components |
| Client state | React reducer/context for serializable viewer state; map/playback controllers outside render state | Zustand can reduce subscription overhead; Redux is unnecessary initially | Measured coupling or rerender issues |
| Server | Node.js LTS + TypeScript + Fastify, when needed | FastAPI suits a Python-heavy team; NestJS adds structure beyond the initial need | Team composition or server complexity changes |
| Contracts | Versioned JSON Schema, generated TypeScript types, OpenAPI for HTTP routes | Avoid independently maintained validators and types | External API compatibility expands |
| Database | PostgreSQL 17 + compatible supported PostGIS 3.x; pin exact versions after compatibility spike | PostgreSQL 18 is an option after local/RDS checks; no graph/document database needed | Support lifecycle or feature need |
| DB access | `pg`, parameterized SQL, reviewed SQL migrations | Query builders optional; an ORM must not hide range/spatial operations | Ordinary relational code becomes cumbersome |
| GIS authoring | QGIS; GDAL/OGR; Python + Shapely where useful | TypeScript for simple transformations; no duplicated temporal engine | A source format needs special tooling |
| Search | Static alias catalog initially; PostgreSQL full-text + `pg_trgm` later | OpenSearch adds operations and cost | Measured ranking/faceting/throughput needs |
| Delivery | GeoJSON initially; MVT in PMTiles as coverage grows | Dynamic PostGIS tiles enable arbitrary filters but add runtime load | Transfer, parse, or memory budgets fail |
| Cloud | S3 + CloudFront first; HTTP API Gateway + Lambda + RDS later | ECS/Fargate for sustained API/jobs; avoid EKS | Specific requirements justify change |
| Infrastructure | Terraform before first durable deployment | CDK/OpenTofu viable; switching adds little initial benefit | Licensing, standards, provider support |
| Tests/CI | GitHub Actions, Vitest, React Testing Library, Playwright, real PostGIS integration tests | No elaborate orchestration platform initially | Build volume or team size |
| Workspace | npm workspaces once packages are shared; one lockfile | pnpm reasonable; Nx/Turborepo unnecessary initially | Build graph becomes expensive |

Fastify supports Lambda, although its guide notes that long-running container platforms make fuller use of its request model. Lambda is a cost-driven choice for light traffic, not a reason to restructure the domain into functions. [Fastify serverless guide](https://fastify.dev/docs/latest/Guides/Serverless/)

RDS supports PostGIS, but extension versions depend on the engine version. Record local container, engine, and extension versions before provisioning. [RDS extensions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Extensions.html), [RDS extension matrix](https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html)

Install tools only when needed. Pin dependencies and runtimes at their first implementation milestone.

## F. Mapping/GIS Architecture

### Renderer decision

| Technology | Strength for this product | Limitation/tradeoff | Decision |
|---|---|---|---|
| MapLibre GL JS | GPU vector maps, style-driven layers, temporal polygon filtering, self-hosted assets, available globe projection | You own basemap/style/hosting choices; globe needs application validation | Primary renderer |
| Mapbox GL JS | Integrated cartography, managed services, rich visuals | Metering, terms, and vendor dependence conflict with self-hosting preference | Viable if service convenience becomes worth the cost |
| CesiumJS | High-precision globe, terrain, 3D geospatial content, time-dynamic scenes | More 3D concepts and a different cartographic workflow | Reevaluate for a substantial 3D product |
| Leaflet | Approachable 2D maps and GeoJSON; mature plugins | Large animated vector workloads and globe need more machinery | Small embeds rather than primary viewer |
| deck.gl | GPU layers for paths, flows, points, aggregation and animation | Complements a basemap; adds another integration surface | Add for a proven migration/trade/density case |

Capabilities are documented by [MapLibre](https://maplibre.org/maplibre-gl-js/docs/), its [globe guide](https://github.com/maplibre/maplibre-gl-js/blob/main/developer-guides/globe.md), [Mapbox's billing guide](https://docs.mapbox.com/mapbox-gl-js/guides/pricing/), [CesiumJS](https://cesium.com/platform/cesiumjs), [Leaflet](https://leafletjs.com/), and [deck.gl's MapLibre guide](https://deck.gl/docs/developer-guide/base-maps/using-with-maplibre). Fit judgments are architectural assessments. CesiumJS is Apache 2.0 open source; paid hosting and terrain services are separate. An open-source renderer does not make third-party map data free.

Start in 2D Mercator with zoom appropriate to the evidence. Do not select Cesium solely for an eventual globe toggle: MapLibre already supports globe projection. Any later deck.gl/globe combination gets a compatibility test against pinned versions.

### Authoring and storage

Store canonical geometry in PostGIS using longitude/latitude WGS84, SRID 4326. Preserve source CRS and transformation parameters. `ST_SetSRID` identifies a CRS; it does not transform coordinates. Use MultiPolygon for territory, Point for settlements, and MultiLineString for routes. Reject unexpected geometry collections or explicitly normalize them into typed components.

An entity may have simultaneous islands, enclaves, uncertain zones, possessions, and sites. Political control, claimed sovereignty, tributary relationships, and cultural presence use separate representation roles. Do not force them into one polygon.

Preserve imported originals and generate derived display geometries. Generalize by zoom; use shared-edge-aware processing for truly shared boundaries. Independent simplification can create artificial gaps. Record method, tolerance, projection, clipping, and source geometry hash.

For area, use an appropriate equal-area projection or PostGIS geography, not square degrees or Web Mercator area. Display rounded estimates, representation role, and interpretation; avoid double-counting overlaps. Geography area is returned in square meters by [PostGIS `ST_Area`](https://postgis.net/docs/ST_Area.html). Precise computation from an uncertain outline remains an uncertain historical estimate.

### Format responsibilities

| Format/system | Responsibility | Do not use it as |
|---|---|---|
| PostGIS | Reviewed records, spatial operations, indexed queries | A browser-facing database connection |
| GeoJSON | Readable exchange, small imports/exports, initial viewer datasets | One worldwide file containing every historical state |
| TopoJSON | Optional exchange/compression and shared-arc processing | Temporal database or mandatory browser format |
| MVT | Compact zoom-dependent vector tile content | The only surviving geometry; clipping/generalization lose information |
| PMTiles | Immutable spatial tile archive served using byte ranges | Mutable database or native four-dimensional temporal index |

PMTiles is a read-only Z/X/Y archive accessed through HTTP Range requests; updating it requires a new archive. Each range request can create a storage GET charge. [PMTiles concepts](https://docs.protomaps.com/pmtiles/), [cloud storage](https://docs.protomaps.com/pmtiles/cloud-storage)

MVP uses a small regional GeoJSON bundle plus metadata. Growing coverage uses **region × layer × bounded time-window** archives. Tile features carry stable state/entity IDs and exact validity bounds; the browser filters within the window. States crossing windows appear in each relevant output with the same identity. Windows are delivery partitions, not historical periods: a change in 117 must not become a change in 100 because delivery uses century buckets.

The manifest maps years to archive URLs and change indexes. Avoid one global archive per year and avoid placing all history in every tile. Measure window size against feature/vertex density; use smaller windows in dense periods.

If arbitrary filters make static combinations excessive, generate bounded tiles from PostGIS and cache by release, time partition or state-set revision, interpretation, layer, and Z/X/Y. PostGIS provides [MVT generation](https://postgis.net/docs/ST_AsMVT.html). Publication-time compilation remains preferable for stable, frequently viewed layers.

### Queries, indexes, and basemap

Start with GiST indexes on geometry and temporal ranges, B-tree indexes on entity IDs/release membership, and suitable search indexes. Inspect real query plans; separate indexes do not guarantee fast combined queries. Filter by bounding box before exact intersection, avoid transforming every indexed row during filtering, and subdivide very large geometries only after profiling.

Location history asks which sourced representations cover a point across an interval. `ST_Covers` includes boundary points; retain multiple matches rather than arbitrarily assigning a border point to one entity. Distinguish nearby settlements from polygons covering the point. [PostGIS `ST_Covers`](https://www.postgis.net/docs/manual-3.5/en/ST_Covers.html)

Use a quiet physical basemap with land, water, selected rivers, and restrained labels. Start with Natural Earth physical data, which is public domain, at suitable regional zooms. Its features are a modern reference, not evidence of ancient coastlines; disclose that distinction. Hide modern political borders by default. [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/)

Before global expansion, test antimeridian splitting, wrapped world copies, polar limitations, winding, islands/holes, and label placement. Use reviewed representative points or point-on-surface logic rather than centroids that may fall outside polygons.

## G. Historical Time Model

### Convention

Use **astronomical year numbering internally** and BCE/CE publicly. Store historical years as integers, never JavaScript `Date` values.

For positive BCE label `n`, internal year = `1 - n`. For CE, internal year equals the label. Internal zero means 1 BCE. Public labels never contain “0 BCE” or “0 CE.”

| Public label | Internal year |
|---|---:|
| 10,000 BCE | -9999 |
| 500 BCE | -499 |
| 27 BCE | -26 |
| 2 BCE | -1 |
| 1 BCE | 0 |
| 1 CE | 1 |
| 117 CE | 117 |

This differs from `-500 = 500 BCE`. Mixing conventions causes systematic off-by-one errors. Each importer declares its source convention and passes through the same tested conversion contract.

### Precision, intervals, and uncertainty

Use half-open intervals `[start, end)` in compiled annual data: active when `start <= year < end`. A state for the whole year 117 uses `[117,118)`. The MVP domain, including both 500 BCE and 500 CE, is `[-499,501)`. An exact *year* does not claim an exact day.

PostgreSQL `int4range` fits annual intervals and supports GiST range indexing. Its canonical form is lower-inclusive/upper-exclusive. An unbounded database range does not automatically mean “unknown.” [PostgreSQL ranges](https://www.postgresql.org/docs/current/rangetypes.html)

Preserve authored expressions alongside normalized bounds:

| Field | Meaning |
|---|---|
| `original_text`, `calendar`, `source_convention` | Original wording and date system |
| `expression_kind` | Exact year, approximate, uncertain occurrence window, duration, before, after, named period, unknown |
| `precision` | Day, year, decade, century, millennium, unspecified |
| `earliest_year`, `latest_year` | Inclusive candidate years for an occurrence, where defensible |
| `start_min`, `start_max`, `end_min`, `end_max` | Bounds on start and exclusive end boundaries of a duration |
| `bound_status` | Known, unknown, deliberately open, ongoing-as-of-source |
| `normalization_policy_id` | Documented conversion/editorial interpretation |
| `date_claim_revision_id` | Citation-bearing assertion for the dating |

“1200–1100 BCE” as an event date means occurrence somewhere in candidate years -1199 through -1099, searchable envelope `[-1199,-1098)`. It does **not** mean the event lasted 101 years. A reign spanning those labels is a duration assertion.

“~3000 BCE” stays approximate even if no defensible numerical tolerance exists. Do not automatically invent ±50 years. “Late 5th century BCE” preserves its wording; the full century is 500–401 BCE, but “late” requires an explicit source or editorial policy.

For uncertain duration, possible occupancy is `[start_min,end_max)` and certain occupancy is `[start_max,end_min)`, if nonempty and supported. Example: start boundary in 100–110 CE and exclusive end boundary in 150–160 CE gives possible `[100,160)` and certain `[110,150)`. Empty certain occupancy means uncertainty throughout. These bounds constrain dating, not the accuracy of the shape.

Unknown dates are null with explicit status, not sentinel years or infinity. Such claims remain searchable but stay out of date-specific layers unless a curator supplies a defensible bounded display policy. “Ongoing as of source” is justified only through the observation horizon.

### Display and future precision

Format zero as “1 BCE,” negative `y` as `(1-y) BCE`, and positive years as CE. Accept `500 BCE`, `500 BC`, and `AD 117`; emit consistent BCE/CE. Reject era-qualified zero. URLs use an explicitly documented astronomical `year` parameter.

Named periods are scoped to geography and scholarly tradition: a “Bronze Age” interval is not globally uniform. Preserve source calendars, radiocarbon/BP reference epochs, and calibration methods; never guess conversion.

Defer day-level playback, but retain original calendar components. If needed, add tested integer day ordinals with a named conversion policy while preserving annual projections for existing clients. Never encode days as fractional years. Modern audit timestamps correctly use UTC timestamps and remain separate from historical time.

## H. Core Data Model

### Identity, assertions, and revisions

Use a relational schema with typed tables and a shared assertion envelope. Avoid both a single giant entity JSON document and a universal subject/predicate/value engine that hides all constraints.

```text
entity_types -> entities -> names / classifications / relationships
                    |                    |
                    +------ assertions --+
                               |
                      immutable revisions
                       /       |        \
                date claims  states   measurements/events
                               |
                       state components -> geometry assets
                               |
                      citation links -> sources
                               |
                   dataset + transformation lineage
                               |
                  reviewed release membership
```

The assertion envelope supplies common provenance, revision, interpretation, and review fields. Typed details supply constraints: a population measurement is numeric with units; a relationship has entity foreign keys; a geographic state references real geometry assets.

| Conceptual tables | Relationships and responsibility |
|---|---|
| `entity_types`, `entity_type_rules` | Extensible controlled vocabulary: polity, people, civilization, archaeological culture, settlement, religion, language, network, event, person. Define allowed representation roles. Add subtypes through vocabulary before inventing tables. |
| `entities` | Stable opaque ID, navigation label, broad type, editorial identity note. No mandatory polygon or modern-country parent. Navigation labels are editorial; historical naming is separately asserted. |
| `assertions`, `assertion_revisions` | Stable logical assertion ID plus immutable revision IDs; entity/subject, claim kind, interpretation, creator, recorded timestamp, supersedes link. Typed rows reference revision IDs. Review decisions are append-only records. |
| `historical_names` | Assertion-backed name, language, script, name kind, and validity. A historical name differs from a modern search alias. |
| `entity_aliases`, `external_identifiers` | Search forms and links to Pleiades/Wikidata/etc. Aliases do not establish historical equivalence. Store redirects from duplicate-resolution decisions. |
| `entity_classifications` | Time-scoped political form, settlement category, or other classification. “Kingdom” can change without identity automatically changing. |
| `date_assertions`, `temporal_extents` | Citable date expression plus normalized precision/bounds from Section G. Other claims reference these for validity. |
| `existence_assertions` | Sourced existence/attestation intervals; distinguish earliest evidence from founding and disappearance from destruction. |
| `temporal_states` | Geographic-state assertion for an entity, representation role, interpretation series, observation date, and reviewed validity. |
| `state_components`, `geometry_assets` | One state has multiple components; immutable geometry assets carry CRS, kind, hash, source scale, and processing lineage. Components carry core/probable/possible role and may reference more specific geometry assertions. |
| `entity_relationships` | Citable typed edges with subject/object, validity, interpretation, and evidence. Many-to-many, not a single parent column. |
| `events`, `event_participants` | Events are entities with typed extension records; participants have roles and sourced relationships. Dates and locations are assertions, not overloaded fields on a generic marker. |
| `locations`, `settlements` | A location is a referenced geographic site or candidate location; settlements are entities, optionally with settlement-specific metadata. A city can have multiple occupation episodes and uncertain/relocated sites. No duplicate “cities” identity table. |
| `measurements` | Subject, measure type, point/range estimate, units, methodology, geography basis, valid date, citations. Population and computed area remain distinguishable. |
| `interpretations`, `interpretation_series` | Named reconstruction/model and internally coherent sequence. Store rationale, author, scope, and relationship to alternatives. |
| `sources`, `citations` | Bibliographic/source artifact and assertion-specific locator/support relationship. See K. |
| `datasets`, `dataset_versions`, `source_records` | Provider, acquired version/hash, rights, original record IDs, and coverage. Keep source dataset version distinct from atlas release. |
| `processing_runs`, `derivations`, `review_decisions` | Transformation DAG, tools/AI/humans involved, checks and review outcomes. |
| `data_versions`, `release_members` | Immutable atlas release manifest selecting exact entity/claim/geometry revisions; app version and data version are independent. |
| `coverage_records` | Layer, region, time interval, coverage level, omissions, and review scope. Coverage is not inferred from a polygon union. |

Keep a current-view projection for convenient editing; reconstruct published views through release membership. Content is append-only after publication. Correcting a polygon creates a new geometry asset and claim revision; it does not mutate an old release.

### Worked structural records

These are **illustrative shapes of records**, not publishable historical data. Geometry IDs are placeholders; no coordinates, populations, or citations are being fabricated.

| Record | Example fields | Interpretation |
|---|---|---|
| Entity | `entity:roman-imperial-polity`, type `polity`, label `Roman Empire` | Stable identity; territorial extent lives elsewhere |
| Classification claim | entity above, form `empire`, date assertion reference | Classification applies during an asserted period |
| Geographic-state claim | `state:rome-117:r1`, entity above, observed year `117`, role `control`, series `editorial-a`, geometry reference `geom:rome-117`, evidence `pending` | 117 snapshot; cannot publish until evidence/review complete |
| Name claim | settlement `entity:bosporus-city`, text `Constantinople`, language/script, validity reference | Name and date require evidence; the modern alias Istanbul can find the same settlement without appearing on an ancient map |
| Measurement claim | subject `entity:roman-imperial-polity`, type `population`, value absent, status `unknown`, year `117` | Panel says unavailable; no invented estimate |
| Citation link | `claim_revision_id`, `source_id`, `locator`, `supports/contradicts/context` | A real source and locator must be supplied before publication |

A source cited for existence does not automatically support a population, ruler, language, or border. Those fields remain absent until backed by their own assertions.

### Relationships and geographic hierarchy

Support predecessor/successor, split/merge, conquest, vassalage, membership, capital, control, foundation, destruction, cultural relation, and linguistic relation as typed time-scoped edges. Use direction rules and expected endpoint types; store a single canonical edge direction where its inverse is derivable. Political hierarchy can have multiple simultaneous relationships and competing interpretations.

A rename is normally a new name claim on an existing entity, not a `renamed_to` link between two artificial entities. A polity and a people sharing a label remain separate IDs. Roman imperial continuity and eastern/western administrative divisions need an explicit identity policy; “Byzantine” must not automatically generate a duplicate state over the same territory.

Geographic containment is a query or a citable time-scoped relationship. Modern France/Île-de-France/Paris can be a present-day navigation hierarchy without controlling ancient classification. Named regions can have competing definitions. Do not derive political control solely from a city point falling inside a generalized polygon; store the historical control assertion separately.

## I. Temporal-Geographic Model

Use a combination of **observed snapshots, explicitly reviewed validity intervals, and event-linked changes**. The public viewer consumes complete states; it does not reconstruct all history by replaying conquest events or geometry patches.

A temporal state identifies an entity, representation role, interpretation series, source observation date, temporal validity, and one or more geometry components. Geometry assets are deduplicated by content hash. If only a name or ruler changes, reuse the geometry and revise the relevant assertion rather than copying all coordinates.

The representation has two timescales:

- **Historical validity:** when the claim purports to apply.
- **Recording/publication history:** when the project recorded or released that claim.

Initially immutable revisions plus release manifests supply this separation without implementing a general-purpose bitemporal database. Later “what did release X claim about year Y?” queries use release membership and historical validity together.

### Explicit display policy

| Policy | Meaning | Viewer behavior |
|---|---|---|
| `reviewed_span` | A curator has evidence supporting the state for an interval | Show over that interval, retaining uncertainty styling |
| `snapshot_only` | Evidence supports an observation date, with no justified persistence interval | Show at its dated annual resolution; otherwise report coverage gap |
| `held_reference` | Optional educational display carries a known snapshot beyond its observation | Clearly label “reference reconstruction from …”; visually distinguish it; never count it as current territorial evidence |
| `unknown` | No justified date-specific representation | Keep entity searchable; show unavailable geography |

The MVP defaults to reviewed spans and snapshot-only states. A held reference is an explicit later display option, not hidden “last known state” behavior. Do not infer that a 117 snapshot persisted unchanged until the next available map in 200.

For a **synthetic test polity**, state A valid `[100,120)` uses geometry A, state B `[120,150)` uses geometry B, and state C `[160,180)` uses geometry C. At 120 only B is active; at 155 no state is supported. The 150–160 gap must survive import, publication, and playback. This synthetic fixture can test the engine without claiming real history.

For an uncertain transition, the outgoing and incoming states may have overlapping *possible* intervals. Preserve both claims. The default interpretation may use a curator-selected display transition with an uncertainty marker, or show a possible-change window; it cannot silently convert the display choice into a confirmed date.

### Query sequence

1. Pin the atlas release and selected interpretation/layer policy.
2. Select state assertions whose possible or reviewed intervals include the requested year, according to the chosen certainty mode.
3. Filter geography by viewport and zoom-appropriate representation.
4. Apply publication decisions: selected alternative, administrative level, representation role, and coverage restrictions.
5. Return stable entity/state/component IDs, geometry references, uncertainty, citations, and the next relevant change boundary.
6. Use the identical release/year/interpretation for panel fields and search destination metadata.

Index possible ranges for discovery and exact/certain ranges where useful. Hard overlap constraints apply only to states that are declared mutually exclusive in the same entity, role, interpretation series, and representation scope. Do not globally prohibit overlaps: core/probable zones, rival claims, cultural presence, and administrative nesting can legitimately overlap. Validate the compiled default selection separately.

A split event links predecessor and successor entities; it does not determine their boundaries. For Roman east/west representations, the publication policy must suppress duplicate parent fill when child administrations are shown, while preserving umbrella identity in metadata. Store real simultaneous relationships; avoid forcing historical continuity into a simplistic modern nation-state succession chain.

### Interpolation policy

Do not interpolate political borders between snapshots in MVP. Polygons can change topology, and vertex interpolation can cross coastlines or invent control. Camera motion, highlights, and a brief optional crossfade may animate the interface. Crossfades must be labelled as display transitions, respect reduced motion, and never be exported as intermediate historical geometry.

Future migration paths can animate a marker along a **sourced approximate route**. Animation speed is illustrative unless travel timing is sourced. Population interpolation requires a documented statistical method and an explicit modeled-estimate label. Neither is a default consequence of adding Play.

## J. Uncertainty Model

Store separate uncertainty dimensions; do not compress them into a universal confidence percentage.

| Dimension | Example values | Meaning |
|---|---|---|
| Evidence assessment | strong, moderate, weak, unassessed | Curator assessment of support for this particular assertion |
| Temporal certainty | exact-at-stated-precision, approximate, bounded, unknown | What is known about dating |
| Spatial representation | core, probable, possible, approximate-boundary, located-point, unknown | How the geographic claim should be interpreted |
| Contestation | uncontested-in-reviewed-sources, disputed, competing-interpretations, not-assessed | Disagreement status, independent of geometric precision |
| Method | observed site, digitized atlas, scholarly reconstruction, inferred, modeled | How representation was produced |
| Review state | draft, reviewed, verified-under-policy, published | Workflow status, not probability of truth |

Include assessment rationale, assessor, rubric version, assessment date, and relevant source links. Prefer categorical labels initially. A numeric probability is allowed only for a model with defined semantics, calibration/method, and scope; “0.83” from an LLM is not a historical confidence estimate.

Geometry components can represent nested core/probable/possible regions where the evidence supports nesting. Validate that relation only when explicitly asserted. Unknown areas are not automatically the complement of known areas. Positional accuracy in meters is separate from the historical extent of influence; map scale or georeferencing residuals do not establish ancient border certainty.

UI treatment:

- Core/control: restrained solid fill and boundary, still labelled as a reconstruction where applicable.
- Approximate boundary: dashed line plus a text indicator.
- Probable/possible presence: patterns or reduced opacity with a legend; no hard national-style frontier.
- Disputed claims: distinguishable hatching/outline and an interpretation notice.
- Unknown/not covered: explicit coverage message; do not color it as “no society.”

Color alone cannot communicate uncertainty. A soft gradient can suggest a calibrated probability surface; use it only for a documented model, otherwise prefer patterns and labelled zones. Users can inspect alternative sources; the MVP shows the existence of disagreement and the selected interpretation's rationale even before an advanced comparison UI exists.

## K. Source / Provenance Model

Every significant historical statement is a citation-bearing assertion revision. A citation links to that revision through a real foreign key, avoiding fragile `target_type + arbitrary_id` links. A geometry component, date, historical name, population estimate, event date, or relationship can each have its own assertion and citations.

A source stores title, author/editor or institution, publication year, source kind, edition/version, DOI/ISBN/URL where available, language, access date, and rights metadata. A citation adds page/figure/table/record locator, support relation (`supports`, `contradicts`, `context`), relevant excerpt or curator note where permitted, and scope of support. Multiple citations can support one claim, and one source can support many claims.

Entity-panel summaries are either individually sourced sentences or derived summaries referencing the underlying assertion IDs. A heading-level bibliography must not masquerade as field-level evidence. A dead link is mitigated by stable identifiers, bibliographic locators, and lawful preserved metadata or copies—not unauthorized redistribution of books.

### Source assessment

| Source kind | Potential role | Assessment requirement |
|---|---|---|
| Primary source | Evidence for contemporary testimony, names, claims, events | Consider perspective, transmission, dating, genre, translation |
| Secondary academic work | Scholarly interpretation and synthesis | Evaluate relevance, method, scope, and subsequent debate |
| Historical atlas/reconstruction | Spatial interpretation at a stated scale/date | Trace basis, generalization, cartographic choices, and rights |
| Archaeological dataset | Site distributions, chronology, material evidence | Evaluate sampling, dating/calibration, preservation and inference limits |
| Community contribution | Candidate correction or new synthesis | Same evidence/review requirements as other claims |
| AI suggestion | Extraction, transformation, duplicate or relationship proposal | Processing provenance only; never historical authority by itself |

Do not rank “primary” automatically above “secondary.” Assess directness, specificity, methodological transparency, corroboration, and relevance to the claim. A field can be reviewed by the project curator without being independently verified by a specialist; label that distinction honestly.

### Source candidates and licensing gate

| Candidate | Appropriate initial use | Limit |
|---|---|---|
| Pleiades | Settlement identity, names, locations, links and underlying references | Gazetteer coverage is not a continuous territorial history; inspect each selected record and dates |
| AWMC geodata | Physical/cultural geographic reference, roads and related features where applicable | Do not assume a complete, dated political-boundary corpus or that every associated work shares identical rights |
| Natural Earth | Low-detail physical reference basemap | Modern reference geography, not ancient coastline evidence |
| Scholarly atlases/books/articles | Date/identity research and licensed reconstruction evidence | Citation alone does not grant tracing or redistribution rights |
| Wikidata/other aggregators | Candidate IDs and discovery | Follow claim references; do not use unreferenced fields as verification |

Pleiades offers archival releases and a comprehensive JSON export; abridged exports omit some attributes. Its download page states CC BY 3.0 terms. Record the actual release and applicable attribution before import. [Pleiades downloads](https://pleiades.stoa.org/downloads)

AWMC's geodata repository states ODbL terms for its GeoJSON and identifies upstream derivation. Assess attribution, share-alike, and combined-database implications for the planned output; do not blanket-label all imported data as MIT or CC0. [AWMC geodata and license statement](https://github.com/AWMC/geodata)

Maintain separate software, original-content, and third-party-data license records. Each dataset version needs a rights decision covering use, transformation, public display, redistribution, attribution, and any restrictions. Unresolved rights block publication of the affected material. Source discovery is not a completed licensing audit.

This research established useful **candidate sources**, not a ready-to-import set of licensed political polygons for every MVP date. That feasibility must be resolved before investing in a large viewer.

### Transformation lineage

Every processing run records input hashes, source record IDs, tool and version, parameters, output hashes, operator, timestamp, and warnings. For AI assistance also record model identifier when available, prompt/template version, output artifact, human corrections, and reviewer outcome. An AI-drafted summary inherits no authority merely because an academic book is listed nearby; verify that each claim actually follows from the cited passage.

## L. Data Ingestion Pipeline

```text
Acquire -> RAW -> NORMALIZED -> VALIDATED -> REVIEWED
                     ^                         |
                     |                  VERIFIED-UNDER-POLICY
                     |                         |
               correction loop          RELEASE CANDIDATE
                                               |
                                    PUBLISHED immutable version
```

1. **Acquire/RAW:** store authorized source artifact unchanged with checksum, acquisition record, upstream version, rights status, and source metadata. Large or restricted originals stay outside Git.
2. **NORMALIZED:** map source IDs to candidate entities; normalize dates, coordinate system, geometry kind, names, and units. Preserve original fields and mapping decisions.
3. **VALIDATED:** reject invalid schema, impossible date bounds, broken references, unsupported coordinates, invalid geometry, and missing required provenance. Quarantine failures; never silently discard records.
4. **REVIEWED:** a person assesses identity, dates, shape meaning, source relevance, competing interpretations, and rights. Automated validity is not historical review.
5. **VERIFIED-UNDER-POLICY:** all mandatory checks pass and the responsible curator attests to the documented standard. This is scoped verification, not proof of historical certainty. Do not claim expert review where none occurred.
6. **RELEASE CANDIDATE:** select immutable revisions, generate default interpretation, coverage, attribution, catalog, change index, and display assets. Produce a machine-readable and human-readable diff.
7. **PUBLISHED:** upload all immutable files, check hashes and required files, run smoke checks, then switch the small current-release manifest. Only a release that passes both technical and editorial gates can publish.

Use an idempotency key from dataset version, source record ID, and transform version. Re-running an unchanged import must not duplicate entities or claims. Duplicate matching produces review candidates; it never silently merges two identities on name similarity alone.

Validation includes temporal conventions, referential integrity, approved type/geometry combinations, coordinate order, ring validity, component nesting where asserted, unreasonable area changes, missing citations, and accidental modern dates/names. Repairs such as `ST_MakeValid` produce a new derived artifact and a visible diff; they do not overwrite original evidence. A valid polygon can still be historically wrong.

Publish app and data independently but declare compatible schema versions. A release manifest includes release ID, schema version, source versions, exact assertion/geometry revisions, file hashes/URLs, coverage, attribution, editorial policy, build/tool versions, and required viewer features. Pin all requests in a session to that release.

Rollback means repointing the manifest to a previous compatible release. Never edit a published archive in place. Keep a withdrawal record for serious errors or rights problems; retain audit metadata even when a public artifact must be removed. App rollback and data rollback are separate operations with a compatibility check.

### Curator system, later

Start with reviewed files and commands. Add a web editor when that workflow becomes the bottleneck. It should show entity identity, aliases, dates, sources, and relationships; then allow adding a geographic state with role, interpretation, precision, and geometry. Polygon drawing requires evidence/uncertainty fields and visual diff against prior versions. Use optimistic concurrency so one curator cannot silently overwrite another. Separate contributor, reviewer, and publisher privileges as collaboration grows. No public write endpoint is required for MVP.

## M. API Architecture

Define logical read contracts now; the MVP implements them through an `AtlasRepository` client reading static files. Do not build an HTTP service simply to return a 36-entity catalog.

| Contract / later HTTP route | Required inputs | Result |
|---|---|---|
| `GET /v1/releases/current` | None | Small pointer to a versioned manifest |
| `GET /v1/releases/{releaseId}` | Exact release | Coverage, files, hashes, policies, schema version |
| `GET /v1/entities/{id}` | `release`, `year`, `interpretation` | Identity, date-aware claims, geography availability, relationships, citations |
| `GET /v1/map-state` | `release`, `year`, `bbox`, `zoom`, `layers`, `interpretation` | Bounded features/references, coverage, next change, explicit truncation indicator |
| `GET /v1/timeline/changes` | `release`, `from`, `to`, optional region/layers | Relevant state changes and selected events, not a row for every year |
| `GET /v1/search` | `release`, `q`, optional `year`, `types`, `limit` | Ranked candidates, matched alias, supported destination date and camera bounds |
| `GET /v1/sources/{id}` | `release` | Bibliography, rights/attribution, relevant cited locators |
| `GET /v1/locations/history` | Later: `release`, lon/lat, `from`, `to`, layers | Parallel time tracks of covering claims and separately nearby places |

All historical numeric years in these contracts are astronomical. No endpoint implicitly uses the modern current year. Require or resolve an explicit release once per session; do not independently resolve `latest` on every request.

Example request: `/v1/entities/roman-imperial-polity?release=atlas-0.1.0&year=117&interpretation=editorial-a`. The identifiers illustrate the contract; opaque entity IDs will be used in implementation. The response echoes release, requested/rendered year, selected interpretation, active claim revision IDs, source links, and coverage status. A known entity without mapped coverage returns an entity with `geography_status=not_covered`, not a 404. Unknown entity IDs return 404.

Start with simple REST/JSON and OpenAPI. No GraphQL, WebSockets, microservices, or public query language. When needed, tile endpoints return MVT; they do not embed full citations per vertex. Feature IDs resolve to the catalog.

Validate bounding boxes, coordinate ranges, maximum interval, allowed layers, query length, and result counts. Split antimeridian bboxes explicitly. Use pagination for catalogs and history; map responses must never silently omit over-limit features—return a coarser representation or a clear limit response. Cancel stale requests. Cache immutable responses with release-aware keys and ETags; keep `current` short-lived. Errors follow one documented schema.

## N. Frontend Architecture

| System | Responsibility |
|---|---|
| Application shell | Layout, responsive panel, navigation, accessibility, recovery states |
| Viewer state | Serializable date, camera, layers, selection, interpretation and pinned release |
| Date control | Parse/format historical dates using the shared temporal module; no duplicated arithmetic |
| Timeline | Scaled ruler, keyboard stepping, direct entry, zooming the visible time range, coverage marks |
| Playback controller | Monotonic clock, speeds, pause/buffering behavior; independent of React rerenders |
| Temporal selector | Resolve active states and metadata with one policy for both map and panel |
| Map adapter | Own MapLibre instance, sources/layers, feature selection, style changes and camera commands |
| Layer controller | Declarative layer registry: types, role, renderer, z-order, legend, availability and conflict policy |
| Atlas data client | Static repository now, HTTP repository later, manifests, caching, cancellation, validation |
| Search | Normalize/query catalog; coordinate date/camera/selection changes atomically |
| Entity panel | Current-date facts, names, uncertainty, missing information, events and source disclosure |
| Source viewer | Bibliography, locators, derivations and selected interpretation rationale |

Keep map objects, WebGL handles, and animation timers out of serializable state. Retain one map instance; do not recreate it when React renders. A small command interface such as select entity, set date, set layers, and set camera later supports stories and natural-language control without embedding AI in the core engine.

Use subdued geography, restrained entity colors, readable typography, and minimal chrome. The selected feature gets a consistent highlight independent of confidence styling. Show full details progressively; the default panel need not show empty ruler/population fields. Date-sensitive fields each expose their own date and source; historical names do not get replaced by modern search aliases.

Support keyboard timeline controls, focus restoration when panels close, accessible names, a non-map list of visible entities, text uncertainty explanations, and reduced motion. On narrow screens use a bottom sheet while retaining usable date controls. Announce deliberate date changes to screen readers without narrating every playback frame.

Compare mode later uses two viewer-state instances with optional camera synchronization. Story mode stores a versioned list of ordinary commands, annotations, and referenced claims. Stories pin their data release so later corrections cannot silently change a published narrative.

## O. Timeline Playback Engine

Use `requestAnimationFrame` and a monotonic elapsed-time clock for smooth controls. Historical speed is years per second; the rendering frame rate does not define historical time.

```text
Elapsed clock time × selected years/second
                 |
Desired historical position (fractional only inside controller)
                 |
Resolve target annual year and crossed change boundaries
                 |
Check cache/data readiness for viewport + release + interpretation
          / ready                         \ missing
Resolve active state IDs                Buffer/prefetch; pause advance
          |
Diff previous and next IDs/geometry references
          |
Commit map + panel + rendered-year label together
          |
Render highlights/transitions; request next frame
```

For MVP, preload the bounded regional release and build a sorted change index. Annual integer selection occurs independently of the fractional animation clock. Use explicit floor semantics, tested across negative years and year zero. Scrubbing and search jumps resolve the destination directly using binary search/range selection; they do not replay every intervening year.

At each relevant change, compute added, removed, and changed states. Group features by layer and update changed sources once, not one source or React component per polygon. Stable IDs preserve selection. For the small bundle, replacing one changed layer's GeoJSON collection is acceptable. As data grows, use tile filters and smaller source groups so geometry is not reparsed on every frame.

At 500 years/second, intermediate events can be skipped visually. The engine must resolve the correct destination state and report the span crossed; it must not promise every event will be seen. Future story mode can deliberately dwell on curated events. Manual year stepping remains deterministic.

Maintain `desiredYear` separately from `renderedYear`. On network delay, keep the displayed map date and panel tied to the actual rendered state and show buffering. Use request generation tokens so an older response cannot overwrite a newer scrub or layer choice. Prefetch neighboring time windows in the direction of travel; cap cache memory with LRU eviction. Cache keys include release, interpretation, layers, spatial partition, zoom/LOD and temporal window.

Pause when the page becomes hidden; resume from the paused historical position rather than jumping forward by the background wall-clock time. Stop at the coverage domain endpoint. Reset timing on pause, speed change, manual seek and buffering completion. Respect reduced motion and provide explicit restart.

### Proposed performance budgets and escalation gates

| Stage | Initial target | Response if exceeded |
|---|---|---|
| MVP | Initial viewport + atlas data ≤5 MB compressed; map usable within 3 seconds on a defined 10 Mbps test connection after connection setup; cached date change p95 ≤100 ms; playback at least 30 fps on a documented midrange laptop | Profile network, parsing, vertices and rerenders; reduce detail or preload scope before adding services |
| Product Phase 2 | No unbounded full-history downloads; inspect roughly 250 KB compressed/tile and 250 MB decoded data-cache ceilings as starting budgets | Partition by region/time, generalize, limit properties; tune against real workloads |
| Large scale | Stable p95 latency, bounded memory and predictable request/session cost on recorded workloads | Dynamic tiles, precomputation, query tuning, workers, read capacity, and search infrastructure as justified |

Also test a 4 GB midrange phone and record its practical limits. These targets are hypotheses; the prototype establishes a baseline and may revise them explicitly. Features can have few objects but millions of vertices, so track bytes, vertices, layers and state density—not entity count alone.

## P. Search Architecture

MVP searches a compact release catalog locally. Normalize Unicode, case and accents for matching while preserving original spelling/script in display. Rank exact preferred name, exact alias, prefix match, then conservative fuzzy match. For a small catalog a documented edit-distance function is enough; do not install an external search cluster.

Historical names carry validity, language/script, and kind: contemporary, exonym, scholarly convention, or modern reference. Search aliases carry matching intent and provenance. “Roman Empire” must not make every related polity equivalent, and “Constantinople” must resolve the settlement separately from a political entity with a related label.

Prefer a supported state at the current date; otherwise offer the nearest relevant covered date or an editorial focal date, labelled with the reason. Do not force the mathematical midpoint of an existence interval, which may have no map evidence. When a user selects a result, set date, camera and entity selection as one transaction; then open its panel. If geography is unknown, open the panel without a fabricated camera destination.

The live API uses PostgreSQL full-text search for descriptions and trigram matching for names/aliases, with curated transliterations where needed. `pg_trgm` provides similarity operations and supporting index classes. [PostgreSQL trigram documentation](https://www.postgresql.org/docs/current/pgtrgm.html)

Time sensitivity influences ranking, not absolute exclusion, unless the user requests a strict temporal filter. Explain matched aliases and keep related-but-distinct results separate. Evaluate OpenSearch only after measuring PostgreSQL and identifying a concrete multilingual ranking, facet, or traffic limitation.

## Q. MVP Dataset

Keep Europe and the Mediterranean, with adjoining Near Eastern territory only where necessary for selected entities. The evidence and interconnected political history make this a useful test area. It must be described as a **selected regional atlas**, not a comprehensive map of everyone living there.

The following **36 research candidates** are an acquisition backlog, not verified seed data. Identity boundaries, dates, rights, and actual geometry availability must be checked individually. Adopt the 24-entity minimum from Section C if the full target is too expensive to curate; reduce coverage rather than standards.

| # | Category | Candidate | Technical/editorial reason |
|---:|---|---|---|
| 1 | Political | Roman Republic | Multiple territorial states and transition in government |
| 2 | Political | Roman Empire | Long changing sequence, reusable geometry, relationships |
| 3 | Political | Western Roman imperial administration | Administrative subdivision and continuity policy |
| 4 | Political | Eastern Roman imperial administration | Coexistence, naming and overlap suppression |
| 5 | Political | Carthaginian state | Maritime possessions and distinction from city |
| 6 | Political | Achaemenid Empire | Large eastern extent and partial regional coverage |
| 7 | Political | Kingdom of Macedon | Dynastic change versus identity; reviewed expansion sequence |
| 8 | Political | Ptolemaic kingdom | Successor relationship and changing control |
| 9 | Political | Seleucid Empire | Fragmentation, enclaves and complex extent |
| 10 | Political | Kingdom of Pergamon | Smaller regional polygon and succession |
| 11 | Political | Kingdom of Pontus | Regional expansion/contraction |
| 12 | Political | Numidian kingdom | Uncertain boundaries and changing political organization |
| 13 | Political | Parthian Empire | Large multipart frontier interpretation |
| 14 | Political | Sasanian Empire | Succession distinct from simple renaming |
| 15 | Political | Athenian polis | Distinguish city, polity, and alliance influence |
| 16 | Political | Spartan polity | Settlement versus territorial polity |
| 17 | Political | Syracusan polity | Government/name changes and island geography |
| 18 | Political | Ostrogothic kingdom in Italy | Late-period formation and related people |
| 19 | Settlement | Rome | Continuous identity with date-sensitive claims |
| 20 | Settlement | Carthage | Destruction/reoccupation episodes, separate polity ID |
| 21 | Settlement | Athens | Settlement and political entity separation |
| 22 | Settlement | Sparta | Location and linked polity |
| 23 | Settlement | Alexandria | Founding/attestation distinction |
| 24 | Settlement | Byzantium / Constantinople | One settlement identity policy and temporal names |
| 25 | Settlement | Antioch on the Orontes | Disambiguation from similarly named places |
| 26 | Settlement | Syracuse | Island location and polity relationship |
| 27 | Settlement | Massalia | Historical names and multilingual aliases |
| 28 | Settlement | Londinium | Later appearance within the MVP chronology |
| 29 | People/presence | Aedui | Bounded sourced presence rather than modern-style borders |
| 30 | People/presence | Helvetii | Presence and movement claims kept distinct |
| 31 | People/presence | Goths | Explicitly contested/broad identity; avoid one uniform ethnic polygon |
| 32 | Event | First Punic War | Duration and participants |
| 33 | Event | Second Punic War | Duration with multiple locations, no invented campaign animation |
| 34 | Event | Battle of Actium | Dated event with bounded location uncertainty |
| 35 | Event | Dedication of Constantinople | Event distinct from the settlement's first occupation |
| 36 | Event | Deposition of Romulus Augustulus | Event versus oversimplified universal “end of Rome” |

“Empire,” “administration,” “polis,” and “people” are candidate classifications needing editorial definition. Do not treat Roman items 2–4 as three unrelated sovereign states or render their full overlapping territories by default. Athenian alliance influence is a different role from direct control. Do not put all people labelled Goths into one time-invariant territory.

Archaeological cultures are supported by the type/uncertainty architecture but do not need a separate production layer in this first dataset. A synthetic culture fixture is enough to exercise that type before genuine source coverage exists.

Start acquisition with three contrasting cases: a changing political territory, a settlement with temporal names, and an uncertain presence claim. For the political case, obtain at least two defensible geometry states. This tests the hardest assumptions before researching all 36 entities.

## R. MVP User Stories

| ID | Story | Acceptance condition |
|---|---|---|
| US-01 | As a visitor, I can open the atlas at 500 BCE | Correct era label, regional camera, coverage notice, usable map |
| US-02 | I can enter a year or drag the timeline | Same temporal selector; invalid era-zero rejected; 1 BCE steps directly to 1 CE |
| US-03 | I can drag from 200 BCE to 100 CE to explore Roman change | Reviewed states change at correct boundaries; unsupported spans stay explicit |
| US-04 | I can step by a year, decade, or century | Deterministic integer arithmetic across BCE/CE, within domain limits |
| US-05 | I can distinguish polities, cities and peoples | Layer labels, geometries and legends reflect type and representation role |
| US-06 | I can see a settlement appear when evidence supports it | Attestation is not silently presented as exact founding |
| US-07 | I can select a territory or city | Stable selection, highlight, panel with current year and identity |
| US-08 | I can read facts appropriate to the selected date | Names/relationships/measurements use the same release/year as the map; missing values are explicit |
| US-09 | I can inspect evidence for a displayed fact or shape | Source title, locator, support scope, and attribution are accessible |
| US-10 | I can understand an approximate or disputed boundary | Non-color cue, plain-language label, and interpretation rationale |
| US-11 | I can search a historical or modern alias | Correct identity, matched alias explanation, supported date, camera and panel update together |
| US-12 | I can play, pause, change speed and restart | Deterministic states at 1/10/50/100/500 years per second; no background-time jump |
| US-13 | I can toggle layers while playing | Selection and map/panel dates stay consistent; stale responses cannot restore removed layers |
| US-14 | I can tell missing data from absence | Unsupported times/places show coverage state rather than an invented empty historical world |
| US-15 | I can see selected events without opening another application | Event date, participant and location information are sourced; uncertain occurrence windows are labelled |
| US-16 | I can use essential controls with a keyboard and reduced motion | Focus order, date entry/stepping, search and panel access work without map-only gestures |
| US-17 | I can reload a shared view | URL restores date/camera/layers/selection and compatible release; retired releases receive an explanation |
| US-18 | As curator, I can release a correction and recover the previous version | Rebuild is reproducible; diff, validation, publication and rollback are documented and exercised |

## S. Repository Structure

Create only the plan now. Grow toward this structure when the relevant phase starts:

```text
world-atlas-timeline/
  README.md
  MASTER_PROJECT_PLAN.md
  CHANGELOG.md
  CONTRIBUTING.md
  SECURITY.md
  LICENSE                       # software license, when selected
  apps/
    web/                        # React viewer
    api/                        # only when HTTP service is justified
  packages/
    temporal/                   # parser, formatting, ranges, selectors
    contracts/                  # JSON Schema + generated types
    atlas-client/               # static/HTTP data access when shared
  database/
    migrations/
    queries/
    fixtures/                   # synthetic SQL/test inputs
  data/
    manifests/                  # source versions, rights, acquisition metadata
    raw/                        # ignored large/restricted local acquisitions
    normalized/                 # ignored generated intermediate files
    reviewed/                   # small authorized import records and decisions
    fixtures/synthetic/         # conspicuously fictional engineering data
    releases/                   # ignored generated immutable publication output
  tools/
    ingest/
    validate/
    publish/
  infra/terraform/
    bootstrap/
    environments/demo/
    environments/production/    # create only when needed
  docs/
    adr/
    runbooks/
    research/
  tests/
    integration/
    e2e/
    data-quality/
  .github/workflows/
```

Feature-specific unit tests live with their code. Shared temporal logic gets a package early because both publishing and viewing need it. Do not create empty packages or a generic utilities dumping ground. Local acquisition paths and large generated geometry stay out of routine source commits; committed manifests point to authorized artifacts by version/hash. `.env.example` contains names and safe examples, not secrets.

Documentation timing:

| Stage | Documents to create or extract from this master plan |
|---|---|
| Now | `MASTER_PROJECT_PLAN.md` only |
| Feasibility/architecture | `docs/research/MVP_DATA_FEASIBILITY.md`, `PRODUCT_VISION.md`, `REQUIREMENTS.md`, initial ADRs, source register |
| Temporal/model implementation | `TEMPORAL_MODEL.md`, `DATA_MODEL.md`, `UNCERTAINTY_MODEL.md`, `GIS_ARCHITECTURE.md` |
| Data/viewer milestone | `DATA_SOURCES.md`, `DATA_INGESTION.md`, `ARCHITECTURE.md`, `README.md`; `API_SPEC.md` when contracts are stabilized |
| Before hosted release | `SECURITY.md`, `DEPLOYMENT.md`, recovery/publication runbooks, `CONTRIBUTING.md`, `CHANGELOG.md`, actionable `ROADMAP.md` |

Keep detailed technical documents under `docs/` and root-level entry documents at the root. As detailed documents become authoritative, link from this plan instead of maintaining conflicting duplicate specifications.

## T. Development Workflow

Use one bounded assignment per session:

1. Inspect repository state, applicable instructions, existing implementation, current milestone, and uncommitted changes.
2. Identify acceptance criteria and the smallest coherent change; state affected files and rationale.
3. Resolve architectural uncertainty with a short ADR or time-boxed experiment before changing durable contracts.
4. Implement a vertical slice with real inputs or clearly synthetic fixtures.
5. Run relevant tests, inspect actual output, and review the diff.
6. Update the documentation and record any limitations or follow-up work.
7. Make a focused commit; tag only an achieved milestone or release.

A coding assignment should name its objective, prerequisites, allowed scope, inputs, non-goals, acceptance criteria, tests, and expected report. For example: “Implement BCE/CE parsing in the temporal package; use the approved convention; change only the package and tests; include invalid year-zero and round-trip cases.”

Claude should not decide to modernize unrelated code during a feature task. Architectural proposals should include the concrete problem and migration impact. If a milestone fails, fix the cause or revise scope explicitly; do not silently weaken the test or fabricate data to complete the demo.

Use separate engineering and editorial checklists. A programmer can validate a polygon's topology without validating the historical claim. Human review effort is a planned workstream, not an unspecified last step.

## U. Git Strategy

Use trunk-based development: protected `main`, short-lived `feat/`, `fix/`, `docs/`, and `data/` branches. Use pull requests for review, even if the project initially has one person. Avoid long-running GitFlow branches.

Commit messages use a lightweight convention such as `feat(timeline): support BCE year input`, `fix(data): preserve uncertainty bounds`, and `docs(architecture): define release manifests`. Data changes explain evidence and impact, not just “update polygons.” Small coherent commits matter more than enforcing a ceremonial format.

Use separate application tags (`app-v0.1.0`) and data release identifiers (`atlas-0.1.0`), with schema versions recorded independently. Published tags and release files are immutable. A later compatible correction gets a new data version. Pre-1.0 breaking contracts still require explicit migration notes.

Suggested application milestones: `app-v0.0.1` map prototype; `app-v0.0.2` temporal core; `app-v0.0.3` sourced entity panel; `app-v0.1.0-rc.1` feature-complete reviewed release candidate; `app-v0.1.0` accepted MVP. Use human-readable subtitles in release notes, not a second ambiguous version system.

Require CI, no committed secrets, and reviewed publication changes. A data correction and UI fix may ship independently if contract compatibility allows it. Do not tag a partially working milestone simply because the session ended.

## V. Testing Strategy

| Test class | Concrete tests | When |
|---|---|---|
| Temporal unit/property tests | BCE/CE round trips; -1/0/1; interval adjacency; uncertain windows versus durations; null semantics; invalid era zero; exact-year precision | Temporal module changes and CI |
| Domain unit tests | Identity versus alias; type/role validation; deterministic interpretation choice; source-required gates | Affected domain changes |
| PostGIS integration | Real migrations; point-on-boundary; polygon holes/islands; uncertain interval overlap; rollback-compatible release queries | DB/query changes, CI service container |
| Geometry/data validation | CRS/axis order, validity, scale, empty output, lineage, citations, rights, geographic/temporal coverage, suspicious area changes | Every data import and release |
| Contract/API | Schema validation, limits, release pinning, missing geography versus unknown entity, bad bbox, pagination and stale requests | Contracts and later API changes |
| Frontend | Keyboard date/search/panel, layer changes, focus, unknown states, source disclosure | Affected UI changes |
| Playback | Fake monotonic clock, dropped frames, background pause, speed change, reverse seek, buffering, stale response rejection | Engine changes |
| End-to-end | Open -> seek -> select -> sources -> search -> play; BCE boundary; unsupported interval; reload URL; failure recovery | Release candidate and critical flow changes |
| Deployment | HTTPS, direct S3 denial, public/private viewer policy, cache headers, immutable assets, PMTiles 206 if introduced | Infrastructure/release changes |
| Recovery | Manifest rollback, compatible app/data pair, database backup restore once RDS exists | Before first relevant release, then periodically |

Synthetic fixtures should include a topology change, a gap, an uncertain transition, rival interpretations, a city with two names, and a boundary point belonging to multiple claims. They must be clearly fictional and excluded from production exports.

A small reviewed historical reference set checks meaningful expected results against cited evidence. Do not treat Wikipedia values or generated summaries as test oracles without review. Distinguish computational correctness from scholarly completeness.

Performance tests use a fixed device/browser/network profile and a recorded dataset hash. Measure cold loading, cached scrubbing, ten minutes of playback, layer toggling, and memory recovery after seeks. Do not rely only on screenshots or developer-laptop impressions. Accessibility checks combine automation with keyboard and screen-reader review. Run checks proportionate to the change; do not create tests that merely restate implementation details.

## W. AWS Deployment Roadmap

### Introduce resources in this order

| Stage | Resources and action | Reason |
|---|---|---|
| Local | Vite, local files, later Docker/PostGIS; no cloud credentials needed for viewer development | Prove data and interaction before recurring spend |
| First durable demo | Terraform bootstrap, private S3 origin, CloudFront, IAM deployment role, budgets, basic monitoring | All MVP public reads are immutable assets |
| Named release | Optional Route 53/ACM; GitHub Actions OIDC deployment; viewer access policy; recovery runbook | Reproducible, reviewable hosting |
| Live query need | API Gateway HTTP API + bounded-concurrency Lambda; private RDS/PostGIS; secrets and necessary network access | Location history, live queries or curation beyond static capability |
| Sustained workload | ECS/Fargate for API or jobs, ALB only if serving that API, backups and availability appropriate to usage | Better pooling, long-running work and predictable capacity |
| Proven larger demand | Read capacity, stronger availability, scheduled tile builds, queueing, separate search only if required | Address observed load and operational needs |

Terraform should enter **before**, not after, a durable AWS setup. The later Terraform phase hardens automation; it is not an excuse to create unmanaged infrastructure first. A disposable console exercise may be used to learn a concept, but remove it or import it before declaring the environment managed.

For static hosting, use the S3 REST origin with origin access control and public-access blocking. Version web assets and data URLs; cache those immutably. Keep the entry document and current-release pointer short-lived. Use a scoped SPA rewrite that does not transform missing JSON/tiles into HTML success responses. Host glyphs, sprites, styles, and licensed basemap assets deliberately; avoid accidental dependence on development demo servers.

If PMTiles is introduced, test through the real CDN: valid Range GET returns 206 and correct Content-Range; ETag remains consistent; CORS permits required reads; bytes match the source. Do not wrap the whole archive in transport compression that breaks byte offsets. CloudFront can cache ranges and may fetch a larger origin range than requested. [CloudFront Range GET behavior](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RangeGETs.html)

For the live API, put RDS in private subnets with no public database endpoint. Lambda can reach it inside the VPC. Do not add a NAT gateway just because a VPC exists. Enumerate actual outbound needs: an S3 gateway endpoint may cover S3, while runtime access to Secrets Manager may require a priced interface endpoint or another deliberately designed access path. Private networking is not cost-free.

Use small connection pools, reserved concurrency, query timeouts, and an explicit database connection budget. Load-test cold starts and overload behavior. Introduce RDS Proxy only when pooling/connection behavior justifies its additional cost. Prefer bounded requests and 429 responses over unbounded database connection growth.

Run migrations/imports through an approved VPC-connected job when RDS exists—for example, an on-demand CodeBuild job triggered by CI—rather than opening database ingress to hosted GitHub runners. This job is introduced only at the live-database stage and gets its own scoped role and cost estimate. For Fargate, the analogous path can be a one-off task.

### Security and operations

- **Visitors:** no account required for the public MVP. Protect an invitation-only demo at CloudFront, not through an obscure URL or private bucket alone.
- **IAM:** separate deploy, runtime read, ingest, and publisher roles. Constrain GitHub OIDC trust to the intended repository/ref/environment. Root MFA; no routine root use or long-lived AWS keys in GitHub.
- **Secrets:** keep out of repository, client bundles, fixtures and logs. Use runtime secret management only when server-side credentials exist. Public map styles must not contain privileged tokens.
- **Database/API:** least-privilege database roles; read-only published views for viewers; parameterized SQL; schema and bounding-box validation; query timeouts, page/size limits, rate limits and throttling. CORS is not authentication.
- **Browser:** sanitize imported rich text; prefer plain text by default; validate external URL schemes; use a CSP compatible with the chosen MapLibre worker setup; include HTTPS and appropriate security headers. Prevent untrusted source markup from becoming executable HTML.
- **Ingestion:** treat archives, XML, PDFs and source URLs as untrusted inputs. Limit file sizes and extraction paths; avoid arbitrary URL fetching from user-supplied API parameters. Separate quarantined input from publishable output.
- **Administration:** when introduced, use a managed OIDC identity provider and MFA, server-side authorization, CSRF protection where cookies authenticate, optimistic concurrency, and append-only audit records. Never ship database credentials to a drawing tool in the browser.
- **Availability:** logs with finite retention; metrics for failures, latency, release/build errors and CDN requests/bytes. Once RDS exists, monitor CPU, storage, connections, query time and backup health. Alerts should identify an actionable condition.
- **Recovery:** static artifacts can be republished and the manifest rolled back. For an initial live database, propose RPO ≤24 hours and restore RTO ≤4 hours, then demonstrate a restore. Tighten objectives with actual usage rather than claiming high availability from diagrams.

MVP logging can avoid user identifiers and raw search-query retention. Document what telemetry exists and why. Do not add broad analytics or account data merely for portfolio complexity.

## X. Terraform Roadmap

Start with one environment and clear resource names/tags. Manage S3 buckets/policies, CloudFront distributions and access policy, certificate/DNS where used, IAM/OIDC roles, budgets, log destinations and alarms. Application data objects are release artifacts deployed by CI, not thousands of Terraform resources.

Bootstrap the remote state bucket deliberately; enable encryption, versioning, restricted access, and locking. Current Terraform S3 backends support `use_lockfile`; DynamoDB-based locking is deprecated, so a new project should not add a DynamoDB table by copying an old tutorial. [Terraform S3 backend](https://developer.hashicorp.com/terraform/language/backend/s3)

State can contain sensitive values. Restrict it even when output variables are marked sensitive. Keep backend credentials out of configuration; use short-lived roles. Separate bootstrap and environment state so deleting a demo does not delete its recovery/state storage.

CI runs format/validate and a plan with pinned provider versions. Review the plan before the protected apply step; restrict apply to the correct environment. Record drift checks and rollback procedures. Do not promise Terraform rollback for a destructive database migration—data recovery needs its own process.

At the live-backend stage add network/subnets/security groups, RDS, secret resources, API Gateway/Lambda, and necessary endpoints. Add reusable modules only after a second real use case reveals a useful boundary. A `demo` and `production` directory with isolated state/credentials is clearer than premature multi-account orchestration. Prefer separate AWS accounts as the public product and team mature.

Before enabling a CloudFront flat-rate plan, verify the selected provider/API can manage the required configuration. If not, document the gap and choose a supported configuration; do not conceal unmanaged billing state.

## Y. Cost Estimate

These are **planning allowances**, not AWS quotes. Assumptions: US East deployment, mainly North American/European delivery, USD/month, approximately 730 instance-hours/month for always-on resources, modest logs, no paid map provider, no paid support, and no professional historical research labor. Taxes, domain registration, source purchases/licensing, local hardware/electricity, and AI subscriptions are separate. Reprice the selected configuration in the AWS calculator before provisioning.

| Stage | Example monthly workload | Architecture | Planning range |
|---|---|---|---:|
| Local | One developer | Local machine only | $0 cloud |
| Private demo | ≤1,000 sessions; ~10 GB delivery; ≤5 GB stored | S3/CloudFront with viewer access control | $0–20 |
| Small public | ~10,000 sessions × 10 MB = ~100 GB delivery; ≤20 GB stored | Static publication | $5–60 |
| Small public with live queries | Same delivery; ≤1 million short API requests; small always-on database | Static + Lambda/API Gateway + RDS and required endpoints | $60–200 |
| Moderate traffic | ~100,000 sessions × 20 MB = ~2 TB; 1–5 million API requests; 50–100 GB DB/storage | CDN + tuned API + database | $150–800 |
| Larger production | ~1 million sessions × 50 MB = ~50 TB; substantial query/curation traffic; higher availability | Larger CDN/data service and database capacity | $1,500–10,000+ |

Except the zero lower bounds, these are conservative pay-as-you-go-oriented envelopes rather than forecasts that depend on promotional credits. Current bundled plans or included allowances may reduce CDN charges substantially. Traffic alone cannot determine cost: request count, bytes/session, geography, cache behavior, database workload, availability, and retained versions matter.

CloudFront currently lists flat-rate plans at $0, $15, $200 and $1,000 per distribution/month. Its listed Free allowance is 1 million requests/100 GB; Pro lists 10 million requests/50 TB. Compare feature limits and required configuration before choosing. These prices do not cap the whole AWS bill. [CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/)

Flat-rate plans have no overage charges, but AWS documents possible delivery/performance adjustments for sustained or unusually high excess usage. Treat them as a plan with conditions, not unlimited guaranteed service. [CloudFront plan documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)

### Cost arithmetic worth understanding

- At an illustrative first-tier delivery rate of $0.085/GB, 100 GB is $8.50 **before applicable allowances**. The geographic tier and billing plan matter. [CloudFront pay-as-you-go pricing](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/)
- One million HTTP API calls at the published example rate are about $1 in API Gateway charges. [HTTP API pricing](https://aws.amazon.com/api-gateway/pricing/)
- One million Lambda invocations at 512 MB and 200 ms consume 100,000 GB-seconds. At the referenced x86 rate this is about $1.67 compute plus $0.20 requests before allowances—excluding database, networking, logging and delivery. Actual GIS calls may need much more memory/time. [Lambda pricing](https://aws.amazon.com/lambda/pricing/)
- A NAT gateway at the AWS Ohio example rate of $0.045/hour is about $32.85/month before data processing. A charged public IPv4 address at $0.005/hour adds about $3.65/month. [VPC pricing](https://aws.amazon.com/vpc/pricing/)
- RDS instance, storage, backups and deployment configuration are separate cost drivers. Stopping an instance still leaves storage charges; a stopped database is not a zero-cost storage plan. [RDS PostgreSQL pricing](https://aws.amazon.com/rds/postgresql/pricing/)

S3 costs also depend on requests and retained objects, not just dataset size. Keep PMTiles request patterns and old release archives in the estimate. [S3 pricing](https://aws.amazon.com/s3/pricing/)

Watch NAT gateways, idle RDS, Multi-AZ/read replicas, ALBs, interface endpoints, public IPv4, RDS Proxy, OpenSearch, provisioned concurrency, verbose logs, retained backups, oversized map downloads, and unused environments. Do not assume “serverless” means no idle or ancillary cost.

Start with a $20 demo budget and alerts at $5/$10/$20; use a separately agreed budget before enabling RDS. Budgets are alerts, not hard spend caps. Bound API concurrency/query sizes, monitor transfer per session, expire temporary environments, set log retention, review costs weekly during launch, and preserve a documented way to disable dynamic endpoints while leaving a static release available.

## Z. Project Risks

| Risk | Likelihood / impact | Mitigation and gate |
|---|---|---|
| No usable dated political geometries | High / critical | Three-case source feasibility dossier before viewer expansion; require rights and at least two states for a changing polity |
| Copyright/license incompatibility | High / high | Per-artifact rights register; preserve attribution and derivation; no publication when rights are unresolved |
| Historical false precision or unsupported claims | High / high | Claim citations, uncertainty dimensions, visible gaps, human editorial review, correction policy |
| Identity and continuity ambiguity | High / high | Typed identities, time-scoped relationships, written Roman/settlement test cases before schema freeze |
| Scope growth | High / high | Frozen release stories, 24–36 entities, data-state budget, backlog substitution rule |
| GIS complexity/topology | Medium / high | Small fixture suite, QGIS review, immutable originals, documented repair, real PostGIS tests |
| Slow map or large downloads | Medium / high | Vertex/byte budgets, representative device tests, progressive tiles/LOD only when needed |
| AWS cost surprises | Medium / high | Static-first deployment, priced architecture changes, budgets, bounded jobs/logs, no unexplained NAT or search cluster |
| AI-generated misinformation | High / high | AI output remains candidate processing data; verify sources and transformations; no self-approval |
| Rigid or overgeneralized schema | Medium / high | Typed assertion model, worked examples, migrations and backward-compatible contracts; no universal EAV engine |
| Accidental loss/release corruption | Medium / high | Input/release hashes, immutable manifests, backup/restore and rollback rehearsal |
| Security or license abuse in contributions | Medium / high | No public writes initially; authenticated review later; quarantine input, audit, sanitization and rights gates |
| Solo-maintainer overload | High / high | One workstream/milestone, repeatable commands, bounded dependencies, budget historical review time |
| Political/identity bias | High / high | Scope explanations, avoid modern nationality projection, display credible alternatives, distinguish source disagreement from editorial choice |
| Basemap anachronism | High / medium | Physical-reference disclosure, modern borders off, historical coastlines only when separately sourced |
| Vendor/dependency change | Medium / medium | Pinned versions, adapters and open publication formats; scheduled supported-version reviews |

If the first source audit fails, do not fabricate polygons or change the license label. Narrow the chronology/region to documented cases, obtain permission, or continue with a clearly fictional engine prototype until a sourced historical demonstration is feasible.

## Development Roadmap

Work through the following engineering phases in order. Minimal ingestion/export appears in Phase 3 so the viewer can use genuine reviewed records; Phase 7 adds repeatability and release-scale automation. Terraform begins in Phase 8; Phase 9 hardens it. API/RDS are a post-MVP extension unless a concrete MVP requirement proves they are necessary.

As a planning allowance, expect roughly 210–380 engineering hours plus 100–250 research/curation hours for this scope, with substantial uncertainty until the source audit. At 20 hours/week, 310–630 hours is roughly 16–32 working weeks. These are effort estimates, not delivery promises; source availability and personal learning pace can dominate. Re-estimate after the three-case feasibility milestone and after the first reviewed release export.

### Phase 0 — Research & Architecture

- **Objective:** establish that a small sourced temporal atlas can actually be built.
- **Features:** no application features; select three representative source cases and freeze the MVP boundary.
- **Technical work:** inspect political geometry availability and rights; audit one settlement/name record and one uncertain presence claim; decide astronomical years, identity rules, validity semantics, and publication contracts in short ADRs.
- **Documentation:** `MVP_DATA_FEASIBILITY.md`, source register, `PRODUCT_VISION.md`, `REQUIREMENTS.md`, ADRs for time, identity, GIS renderer and publication delivery.
- **Tests:** desk-check BCE examples, snapshot-versus-duration examples, source-to-claim tracing, and licensing decisions. No fake automated historical verification.
- **Definition of Done:** changing polity has at least two defensible geometry states or an explicitly authorized reconstruction path; other cases have usable evidence; rights status is recorded; scope and go/no-go verdict are explicit. If unavailable, revise dataset scope before proceeding.
- **What you learn:** historical data feasibility, source evaluation, licensing, requirements and architecture decision records.

### Phase 1 — Map Prototype

- **Objective:** validate map interaction and visual direction with minimal scaffolding.
- **Features:** physical reference basemap, pan/zoom, one polygon, one settlement point, selection highlight and legend.
- **Technical work:** initialize React/TypeScript/Vite, mount one MapLibre instance, pin assets/dependencies, render clearly synthetic fixtures; capture a baseline on desktop and a phone.
- **Documentation:** setup README, `GIS_ARCHITECTURE.md`, visual tokens and basemap attribution notes.
- **Tests:** build/typecheck, mount/unmount smoke test, point/polygon selection, keyboard focus, screenshot review and transfer measurement.
- **Definition of Done:** reproducible local startup; no external demo-tile dependency; correct attribution; map remains responsive with test geometry; synthetic content is labelled.
- **What you learn:** frontend tooling, WebGL map lifecycle, styles, coordinates and asset delivery.

### Phase 2 — Temporal Engine

- **Objective:** make time deterministic before introducing large historical records.
- **Features:** year entry, BCE/CE labels, timeline drag, year/decade/century steps, state appearance/disappearance and coverage gaps.
- **Technical work:** shared temporal package, parser/formatter, interval predicates, uncertain date envelopes, sorted change index, synthetic state selector and map integration.
- **Documentation:** `TEMPORAL_MODEL.md`, schemas and temporal ADR with worked edge cases.
- **Tests:** -1/0/1 round trips; no public year zero; half-open adjacency; gaps; negative-year floor semantics; occurrence windows versus durations; unknown date behavior.
- **Definition of Done:** all controls use the same module; selecting 120 in the synthetic case shows only state B; selecting 155 shows a gap; no JavaScript Date in historical arithmetic.
- **What you learn:** domain modeling, range queries, pure functions, boundary/property testing and UI/domain separation.

### Phase 3 — Historical Data Model

- **Objective:** prove the complete source-to-database-to-viewer data path.
- **Features:** typed entities, names, date claims, geographic states, citations, uncertainty and release identity for the three audited cases.
- **Technical work:** Docker/PostGIS compatibility check; initial SQL migrations; small idempotent importer; immutable geometry assets; manually reviewed assertions; first deterministic export and static repository adapter.
- **Documentation:** `DATA_MODEL.md`, `UNCERTAINTY_MODEL.md`, source records, migration instructions and first contract specification.
- **Tests:** real PostGIS import/query; referential integrity; missing-source publication rejection; geometry/time validation; repeated import; identical export hashes for identical inputs.
- **Definition of Done:** the viewer displays reviewed case data with traceable sources; geometry/date revisions survive reimport; synthetic fixtures cannot enter a public export accidentally.
- **What you learn:** relational design, PostGIS, migrations, provenance and reproducible data products.

### Phase 4 — Entity UI

- **Objective:** make the map understandable and inspectable.
- **Features:** date-aware panel, names, type, relationships, coverage status, citations, uncertainty disclosure, keyboard-accessible entity list and layer controls.
- **Technical work:** panel selectors derived from pinned release/year; stable selection across state changes; sanitized text/links; responsive layout; URL view state.
- **Documentation:** UI behavior specification, supported panel fields, accessibility checklist, updated user stories.
- **Tests:** panel/map year consistency; absent population; name validity; source links; focus restoration; responsive layout; browser back/reload.
- **Definition of Done:** selecting any reviewed case explains what is shown, when it applies, and why; unavailable information stays unavailable; no stale fields after a seek.
- **What you learn:** UI composition, accessibility, state synchronization and evidence presentation.

### Phase 5 — Search

- **Objective:** make entities discoverable without knowing their exact preferred name.
- **Features:** preferred-name, alias, prefix and limited fuzzy search; type disambiguation; date-aware navigation.
- **Technical work:** publish a small normalized search catalog; deterministic ranking; matched-alias explanation; atomic date/camera/selection command.
- **Documentation:** search ranking rules, historical-name/alias policy, search acceptance fixtures.
- **Tests:** Constantinople/Istanbul alias; polity versus settlement; typo; no-result; unsupported current date; unknown geography; release-pinned reload.
- **Definition of Done:** searches reach the correct identity and a supported date without fabricating geography; similarly named places remain distinguishable.
- **What you learn:** information retrieval basics, normalization, ranking and navigation transactions.

### Phase 6 — Playback

- **Objective:** turn deterministic seeking into reliable playback.
- **Features:** play/pause, five speeds, restart, end-of-range stop, background pause and visible buffering.
- **Technical work:** monotonic clock controller, change-boundary resolution, source-level updates, request generation guards, prefetch/cache interfaces and metrics.
- **Documentation:** playback state machine, performance baseline and reduced-motion behavior.
- **Tests:** fake clock; dropped frames; high speed; pause/resume; seek while playing; stale response; hidden page; ten-minute run for memory growth.
- **Definition of Done:** map, panel and date remain consistent at every tested speed; no per-frame server query; cached seek and frame-rate targets are met or explicitly revised with measurements.
- **What you learn:** animation timing, incremental rendering, race-condition prevention and performance profiling.

### Phase 7 — Data Pipeline

- **Objective:** turn the three-case workflow into repeatable publication of the selected MVP dataset.
- **Features:** staged import, validation reports, review decisions, release diff, attribution, coverage and rollback.
- **Technical work:** expand reviewed cases toward the 24-entity minimum/36 target; implement deterministic manifests/hashes, rights and source gates, validation commands, publication selection and retained versions. Keep enrichment restricted to agreed fields.
- **Documentation:** `DATA_SOURCES.md`, `DATA_INGESTION.md`, editorial rubric, license register, publication/correction runbook.
- **Tests:** repeated imports; malformed input quarantine; missing citation/rights block; topology changes; alternatives preserved; release reproducibility; rollback to prior compatible data.
- **Definition of Done:** a reviewed release candidate meets minimum categories; every published significant claim is traceable; no placeholder sources; coverage gaps and attribution are accurate; rebuild succeeds from recorded inputs.
- **What you learn:** ETL, artifact versioning, data QA, editorial accountability and release engineering.

### Phase 8 — AWS Deployment

- **Objective:** host the complete static MVP with a reproducible, bounded-cost setup.
- **Features:** HTTPS demo/public viewer, intended audience controls, release deployment and rollback.
- **Technical work:** Terraform bootstrap and minimal S3/CloudFront/IAM/budget resources; optional DNS/ACM; GitHub OIDC pipeline; cache headers; scoped routing; smoke checks and cost dashboard.
- **Documentation:** `DEPLOYMENT.md`, `SECURITY.md`, cost worksheet, access and rollback runbooks.
- **Tests:** direct S3 denied; intended viewer access works; expired private access fails; immutable/current cache policy; missing data not rewritten to HTML; old release restoration.
- **Definition of Done:** clean local build deploys through CI; no static AWS keys; dashboard/alerts exist; the demo is usable through HTTPS; rollback is demonstrated; actual bill components match the worksheet.
- **What you learn:** S3, CDN, IAM, TLS/DNS, OIDC, Terraform fundamentals, CI/CD and cost controls.

### Phase 9 — Terraform and Operations Hardening

- **Objective:** remove manual deployment assumptions and establish recovery discipline.
- **Features:** reproducible environment configuration, controlled applies, finite logging and drift detection.
- **Technical work:** pin providers, secure remote state/locking, separate bootstrap state, add plan review and environment protections, document destroy/recreate of disposable resources without deleting retained data. Add modules only where useful.
- **Documentation:** Terraform operating guide, recovery objectives, environment ownership and change process.
- **Tests:** format/validate/plan; harmless second plan; drift exercise; rebuild a disposable demo; restore manifest/data; confirm logs and retained assets have expected lifecycle policies.
- **Definition of Done:** all durable infrastructure is accounted for in code or an explicitly justified exception; no unexplained drift; recovery instructions work; no unneeded backend services exist.
- **What you learn:** state management, infrastructure lifecycle, least privilege, drift and operational runbooks.

### Phase 10 — MVP Release

- **Objective:** release a coherent, trusted, documented demonstration.
- **Features:** all accepted MVP stories; dataset coverage statement; attribution; known limitations; feedback/correction path.
- **Technical work:** release candidate freeze, device/performance checks, accessibility review, final source/rights audit, compatible app/data tags and release notes.
- **Documentation:** README demo walkthrough, `CHANGELOG.md`, `CONTRIBUTING.md`, updated roadmap, architectural evidence and measured performance/cost report.
- **Tests:** end-to-end flow; five-person usability exercise; every data gate; security/access checks; publication rollback; supported-browser/device checks.
- **Definition of Done:** accepted stories pass, minimum reviewed dataset exists, sources are inspectable, gaps/uncertainty visible, no critical known defect, rollback works, and monthly cost is inside the agreed budget.
- **What you learn:** product release, quality gates, feedback interpretation and defensible portfolio presentation.

### First post-MVP extension

Choose **location history** as the first substantial backend feature: implement one bounded PostGIS query that returns political, presence, and settlement tracks for a clicked point and date range. Benchmark locally, then add the smallest live API/RDS deployment only if needed. This provides a concrete reason to learn API Gateway, Lambda, networking and RDS. It is a separate milestone, not a hidden MVP dependency.

## First 30 Development Tasks

Each row is one bounded assignment. Dependencies refer to task numbers. Research tasks are time-boxed investigations that can return “not feasible” with evidence; they are not instructions to manufacture an answer. These are the first tasks, not a claim that thirty prompts finish the entire product.

| # | Assignment | Depends on | Reviewable output / acceptance |
|---:|---|---|---|
| 1 | Create the three-case MVP data feasibility dossier structure and evaluation rubric | This plan | One document with geometry/date/provenance/rights criteria and candidate source register |
| 2 | Audit one changing political entity for two usable dated geometry states | 1 | Exact source/version/locator and rights findings; explicit gaps or reconstruction requirements |
| 3 | Audit one Pleiades settlement with temporal names and location evidence | 1 | Source record mapping, date-convention check, attribution and limits |
| 4 | Audit one bounded people/presence claim with uncertainty | 1 | Defensible representation proposal and support/rights status |
| 5 | Write the feasibility verdict and confirm the restricted dataset scope | 2–4 | Go/no-go with evidence and revisions to candidate list if needed |
| 6 | Write temporal and identity ADRs using the three audited cases | 5 | Approved conventions, example records, continuity/alias decisions and rejected alternatives |
| 7 | Freeze MVP requirements and acceptance criteria | 5–6 | Traceable story IDs, non-goals, minimum dataset, performance hypotheses |
| 8 | Initialize Git and the minimal documentation layout | 7 | Focused initial commit, README navigation, ignore rules; no unused app folders |
| 9 | Scaffold the React/TypeScript/Vite shell with build and typecheck scripts | 8 | Empty runnable shell, pinned versions, one lockfile |
| 10 | Define the minimal date/entity/claim publication JSON schemas | 6, 9 | Valid/invalid schema fixtures and generated types |
| 11 | Implement BCE/CE parse and format functions | 10 | Passing round-trip, -1/0/1 and invalid era-zero tests |
| 12 | Implement exact/uncertain interval predicates and annual state selection | 11 | Gap, adjacency, occurrence-versus-duration and null tests |
| 13 | Create a labelled synthetic mini-atlas fixture | 10–12 | One changing polity, gap, uncertain alternative and named settlement; schema-valid |
| 14 | Mount one MapLibre map with a locally served physical reference basemap | 9 | Pan/zoom, correct attribution, clean disposal, no demo-server reliance |
| 15 | Render synthetic political polygons and settlement points with stable IDs | 13–14 | Correct styles, holes/multipart handling and click highlight |
| 16 | Add historical year input and a bounded slider | 11, 15 | Consistent labels, validation and keyboard year steps |
| 17 | Connect the temporal selector to map layer updates | 12, 16 | Correct state at each fixture boundary and visible gap behavior |
| 18 | Add an accessible visible-entity list and basic layer controls | 15–17 | Selection and toggles available without map-only gestures |
| 19 | Create a local Docker/PostGIS setup and record version compatibility | 8 | Repeatable start/stop, extension check, no cloud dependency |
| 20 | Add the first migration for entity identity, assertion revisions and date/name claims | 6, 19 | Migration applies to empty DB and enforces references |
| 21 | Add geometry-state, source/citation and release-membership migrations | 20 | Typed geometry checks, revision references, citable states and release selection |
| 22 | Import the synthetic mini-atlas idempotently into PostGIS | 13, 21 | Two runs create no duplicates; source data remains labelled synthetic |
| 23 | Create a validation report for invalid dates, geometries and missing publication evidence | 22 | Deliberately bad fixtures fail with actionable record IDs |
| 24 | Capture authorized artifacts/manifests for the three audited cases | 2–5, 23 | Original hashes, rights evidence and source versions; restricted files excluded from Git |
| 25 | Import and review the audited polity's two geographic states | 21, 24 | Sourced state records, validity policy and visible geometry review |
| 26 | Import and review the audited settlement and its temporal names | 21, 24 | Stable identity, source locators, dates and alias distinctions |
| 27 | Import and review the audited uncertain presence claim | 21, 24 | Uncertainty dimensions and sources preserved; no hard political-border assumption |
| 28 | Export the three-case reviewed mini-release with manifest and hashes | 23, 25–27 | Repeated build identical; incomplete/unreviewed records excluded |
| 29 | Implement the static atlas client and pin a viewer session to that release | 17, 28 | File/schema/hash checks; one release across map and metadata; useful failure state |
| 30 | Add the date-aware entity panel with field and geometry source disclosure | 18, 29 | Each case explains identity, selected date, evidence, uncertainty and missing data |

Then proceed to search, playback, dataset expansion and deployment through the roadmap. Do not skip the mini-release provenance gate to reach animation sooner.

## CLAUDE DEVELOPMENT RULES

1. Inspect the repository, applicable instructions, current branch and uncommitted changes before editing.
2. Never assume a feature, test, or document is missing without checking.
3. Read the current milestone, relevant ADRs, and acceptance criteria before choosing an implementation.
4. Before coding, state which files or modules will change and why.
5. Keep changes scoped to one milestone or explicitly bounded task.
6. Do not rewrite working systems without a concrete defect, requirement, or measured limitation.
7. Propose changes to identity, historical time, publication schema or GIS representation before implementing a costly migration.
8. Preserve user work and explain unexpected repository state; do not reset or discard it to simplify a task.
9. Prefer a small vertical slice over a broad scaffold full of placeholders.
10. Avoid unnecessary dependencies and services; explain each new dependency's role.
11. Never introduce AWS services without an architectural need, cost estimate and removal/recovery plan.
12. Do not provision cloud resources merely to make the portfolio diagram more impressive.
13. Never invent historical facts, dates, geometries, sources or citations and label them verified.
14. Keep synthetic/demo fixtures physically and logically separate from reviewed publication data.
15. Preserve source locators, rights metadata, original artifacts where authorized, and transformation lineage.
16. AI output is a candidate artifact; it cannot approve itself or become a source through repetition.
17. Use the shared astronomical-year convention everywhere. Public year zero is invalid; internal zero means 1 BCE.
18. Distinguish date precision, uncertain occurrence, duration, observation date and display validity.
19. Do not fill historical gaps or interpolate political boundaries without an explicit, labelled policy.
20. Preserve alternative interpretations and explain the published selection; do not erase disagreement during normalization.
21. Keep entity identity separate from names, types, political relationships and geometry.
22. Use parameterized SQL, validated inputs, least-privilege credentials and sanitized imported content.
23. Never store secrets in source files, fixtures, logs, screenshots, client bundles or commits.
24. Published data and tags are immutable. Corrections create new revisions/releases and preserve the audit trail.
25. Keep app version, schema version, source dataset version and atlas release version distinct.
26. Run tests appropriate to the change and report actual results. Never claim a test or historical review was performed when it was not.
27. Test GIS/database behavior against PostGIS where behavior depends on it; mocks cannot validate spatial correctness.
28. Do not weaken acceptance checks or remove difficult cases merely to obtain a passing build.
29. Inspect rendered UI changes and test accessibility for the affected interaction.
30. Update the relevant authoritative document, not several contradictory copies of the same specification.
31. Review the diff, prefer incremental commits, and tag only completed milestones.
32. Report what changed, why, how it was validated, unresolved issues, and any release impact.
33. Ask focused architectural questions when the answer could force a large rewrite; make routine reversible implementation choices within the approved task without unnecessary ceremony.
34. Maintain backward compatibility unless an explicit contract change includes migration and rollback/forward-recovery guidance.
35. Treat source/rights/historical review failures as real blockers for publication; narrowing scope is acceptable, pretending completion is not.
36. End each assignment with a concrete reviewable artifact and its acceptance result; do not silently expand into the next milestone.

## RECOMMENDED IMMEDIATE NEXT STEP

Create **`docs/research/MVP_DATA_FEASIBILITY.md`**, a three-case evidence and licensing dossier covering a changing political territory, a settlement with historical names, and an uncertain people/presence claim.

Its decisive question is: **Can we acquire or lawfully construct at least two dated territory states, preserve their provenance, and define honest temporal validity without inventing boundaries?** Include exact sources and versions, usable fields, geometry availability, dating conventions, attribution/reuse conditions, unresolved questions, estimated curation work, and a go/no-go verdict. This is the single next artifact; application scaffolding follows only after its verdict.

**Exact first Claude prompt name:**

**World Atlas Timeline — Phase 0.1: MVP Data Feasibility and Licensing Audit**
