# WORLD ATLAS
## End-to-End Gated Development Master Plan

**Target:** Build a production-quality temporal historical GIS platform capable of visualizing how states, peoples, cities, cultures, events, migrations, trade networks, religions, languages, and other historical entities changed geographically through time.

**Initial MVP:** Europe + Mediterranean, approximately 500 BCE–500 CE.

**Long-term target:** Global human historical atlas from prehistory through the modern era.

---

# I. DEVELOPMENT LAW

Every module has four states:

`NOT_STARTED → IN_PROGRESS → BLOCKED/PASS`

A module may be marked `PASS` only when:

1. Its required artifact exists.
2. Its module-specific tests pass.
3. All previous regression tests still pass.
4. No Severity-0 or Severity-1 defects remain.
5. Required documentation has been updated.
6. Any architectural decision has an ADR.
7. The module ledger records the result.

The next module cannot begin until the previous module is `PASS`, except when an explicit Architecture Decision Record explains why work is intentionally parallelized.

---

# II. MASTER VERIFICATION COMMAND

Eventually the repository should expose one master command such as:

`pnpm verify`

Conceptually it will run:

`lint`

→ `typecheck`

→ `unit tests`

→ `domain tests`

→ `temporal tests`

→ `GIS tests`

→ `database tests`

→ `API integration tests`

→ `frontend component tests`

→ `historical data validation`

→ `E2E tests`

→ selected security tests

The suite grows as the project grows.

A later:

`pnpm verify:release`

will additionally run:

performance tests

accessibility checks

security scans

production build

infrastructure validation

end-to-end staging tests

---

# III. PROJECT-WIDE QUALITY TARGETS

These become the baseline standards.

### Code

- zero TypeScript errors
- zero lint errors
- critical domain logic heavily unit tested
- temporal engine target ≥90% branch coverage
- meaningful project-wide test coverage target ≥80%
- no skipped critical-path tests

### Historical data

- 100% valid database relationships
- 100% valid published geometries
- every published historical entity has sourcing
- every published temporal geography has sourcing
- uncertainty explicitly represented where appropriate
- no AI-generated historical assertion published as verified without review

### GIS

- no invalid production geometries
- correct CRS enforced
- expected spatial query results validated against fixtures
- no major polygon rendering artifacts

### API

Initial production targets:

- routine requests p95 <300 ms where practical
- no unrestricted database exposure
- deterministic pagination
- predictable errors
- schema validation on external input

### UX

Critical workflows must work:

Map

Timeline

Entity selection

Search

Playback

Layer controls

Deep-linking

Sources

### Accessibility

No serious or critical automated accessibility violations on primary screens.

### Security

- no secrets committed
- least-privilege AWS IAM
- no known critical dependency vulnerabilities
- production database private
- admin functionality authenticated
- public API rate-limited where necessary

---

# PHASE 0 — PRODUCT AND ARCHITECTURAL CONTRACT

---

## MODULE 01 — Product Charter

### Build

1.01 Define product mission.  
1.02 Define primary users.  
1.03 Define MVP.  
1.04 Define non-goals.  
1.05 Define long-term vision.  
1.06 Define success criteria.

### Outputs

`PRODUCT_VISION.md`

`MVP_SCOPE.md`

### Gate

PASS only if every proposed MVP feature can clearly be classified as:

- REQUIRED
- DEFERRED
- REJECTED

No unresolved critical scope contradictions.

---

## MODULE 02 — Historical Entity Ontology

Define canonical entity categories.

### Submodules

2.01 Political entities  
2.02 Peoples  
2.03 Ethnic groups  
2.04 Archaeological cultures  
2.05 Civilizations  
2.06 Cities/settlements  
2.07 Events  
2.08 Trade networks  
2.09 Religions  
2.10 Languages  
2.11 Geographic regions

### Test

Create 30 historical examples and attempt to classify them.

Examples:

Roman Republic  
Visigoths  
Hallstatt Culture  
Carthage  
Silk Road  
Christianity  
Latin

### Gate

Every test entity must either:

- fit an existing type, or
- demonstrate why the ontology needs extension.

---

## MODULE 03 — Historical Time Standard

This is one of the project's most important modules.

### Decision

Use **astronomical year numbering internally**.

Example:

`1 = 1 CE`

`0 = 1 BCE`

`-1 = 2 BCE`

`-499 = 500 BCE`

The UI converts this into conventional BCE/CE notation.

### Submodules

3.01 Internal year representation  
3.02 BCE display conversion  
3.03 CE display conversion  
3.04 Approximate dates  
3.05 Date ranges  
3.06 Century precision  
3.07 Unknown dates  
3.08 Earliest/latest possible dates

### Tests

Validate:

500 BCE  
1 BCE  
1 CE  
117 CE  
500 CE  
10,000 BCE

Test BCE/CE boundaries extensively.

### Gate

Round-trip:

`display → internal → display`

must preserve meaning for every fixture.

---

## MODULE 04 — Historical Uncertainty Model

### Support

certainty levels such as:

HIGH  
MEDIUM  
LOW  
DISPUTED  
APPROXIMATE  
UNKNOWN

### Submodules

4.01 Temporal uncertainty  
4.02 Geographic uncertainty  
4.03 Identity uncertainty  
4.04 Scholarly disagreement  
4.05 UI presentation rules

### Test

Model uncertain examples such as:

Celtic cultural regions  
early Germanic peoples  
archaeological cultures

### Gate

No uncertainty test case requires pretending an approximate region is a precise political border.

---

## MODULE 05 — Source and Provenance Standard

### Define

Source  
Citation  
Claim  
Dataset  
Contributor  
Revision

### Submodules

5.01 Book citations  
5.02 Journal citations  
5.03 Dataset citations  
5.04 Historical atlas citations  
5.05 Museum/academic sources  
5.06 URLs  
5.07 Source reliability categories  
5.08 AI-derived information labeling

### Gate

Every example historical fact must be traceable to a source record.

---

## MODULE 06 — Data Licensing Policy

### Build

`DATA_LICENSING.md`

### Classifications

PUBLIC DOMAIN

CC0

CC-BY

ODbL

RESTRICTED

UNKNOWN

INTERNAL TEST ONLY

### Gate

No external dataset enters the production pipeline without recorded license information.

---

## MODULE 07 — Technology Architecture Decision

Lock the initial stack.

### Recommended stack

Frontend:

React  
TypeScript  
Vite

Mapping:

MapLibre GL JS

Backend:

TypeScript

Database:

PostgreSQL  
PostGIS

Validation:

Zod

Testing:

Vitest  
React Testing Library  
Playwright

Infrastructure:

AWS  
Terraform

### Gate

Create ADRs explaining every major choice.

No technology may be included merely because it looks impressive on a portfolio.

---

## MODULE 08 — Quality, Performance and Cost Budgets

Define measurable engineering limits before coding.

### Include

initial load budget  
API latency budget  
map responsiveness  
database query targets  
AWS spending alerts  
bundle-size monitoring  
data-validation thresholds

### Gate

`QUALITY_BUDGETS.md` exists with measurable pass/fail criteria.

---

# PHASE 1 — DEVELOPMENT FOUNDATION

---

## MODULE 09 — Repository Architecture

Establish:

`apps/`

`packages/`

`database/`

`data/`

`infra/`

`docs/`

`scripts/`

`tests/`

### Gate

Fresh clone installs successfully.

---

## MODULE 10 — Package and Dependency Governance

### Configure

package manager lockfile  
Node version  
dependency update policy  
workspace configuration

### Test

Clean machine installation is deterministic.

### Gate

Identical dependency graph after fresh install.

---

## MODULE 11 — Code Quality Toolchain

Install and configure:

TypeScript strict mode  
ESLint  
Prettier  
Git hooks where appropriate

### Gate

Intentional lint/type failures are caught automatically.

---

## MODULE 12 — Continuous Integration Foundation

Create CI pipeline.

### Pipeline

install

→ lint

→ typecheck

→ unit tests

→ build

### Gate

Pull request cannot pass when any stage intentionally fails.

---

## MODULE 13 — Local PostgreSQL/PostGIS Environment

Use a reproducible containerized environment.

### Submodules

13.01 PostgreSQL  
13.02 PostGIS  
13.03 persistent development volume  
13.04 environment configuration  
13.05 health checks

### Tests

Verify:

`PostGIS_Full_Version()`

basic geometry creation

basic spatial query

### Gate

One command launches a working development database.

---

## MODULE 14 — Database Migration System

Create version-controlled migrations.

### Tests

empty DB → latest schema

latest schema → clean rebuild

migration failure detection

### Gate

Database can be recreated deterministically.

---

## MODULE 15 — Configuration and Secret Management

Create:

`.env.example`

runtime config validation

secret separation

production configuration policy

### Tests

Missing required configuration must fail clearly.

### Gate

No committed secret exists.

---

# PHASE 2 — GIS KERNEL

---

## MODULE 16 — Map Application Shell

Render first functional MapLibre map.

### Submodules

navigation  
zoom  
pan  
base style  
map container

### Gate

Map loads with zero console errors.

---

## MODULE 17 — Coordinate Reference System Contract

Standardize geographic storage.

Initial standard:

WGS84 / EPSG:4326

### Test

Known city coordinates render correctly.

Examples:

Rome  
Athens  
Alexandria  
Carthage

### Gate

Coordinates align within expected tolerance.

---

## MODULE 18 — GeoJSON Feature Loader

Support:

Point  
LineString  
Polygon  
MultiPolygon

### Tests

fixture geometries

malformed GeoJSON

missing coordinates

invalid feature types

### Gate

Invalid geographic input is rejected.

---

## MODULE 19 — Historical Map Layer Engine

Build abstraction for historical layers.

### Initial layers

Political territories

Cities

Events

Peoples/cultures

### Gate

Layers can independently enable/disable without rebuilding the map.

---

## MODULE 20 — Map Styling Architecture

Separate historical meaning from raw rendering.

Support:

entity type styles  
confidence styles  
selected-state styles  
hover styles

### Gate

Layer styles can change without changing underlying historical data.

---

## MODULE 21 — Feature Selection Engine

Implement:

hover

click

highlight

deselect

### Tests

overlapping polygons

cities over polygons

multiple layers

### Gate

Correct entity is returned from test fixtures.

---

## MODULE 22 — Geometry Validation System

Database validation includes:

`ST_IsValid`

coordinate bounds

empty geometry detection

self-intersection detection

### Gate

Invalid geometry cannot become `PUBLISHED`.

---

## MODULE 23 — Spatial Query Proof

Implement queries such as:

What entities contain this point?

What entities intersect this viewport?

What cities lie within this territory?

### Gate

Fixture queries return exactly expected results.

---

# PHASE 3 — TEMPORAL ENGINE

---

## MODULE 24 — Temporal Domain Library

Create core primitives:

HistoricalYear

HistoricalDate

DateRange

DatePrecision

### Gate

All Module 03 chronological fixtures pass in code.

---

## MODULE 25 — Historical Date Formatter

Examples:

`-499 → 500 BCE`

`0 → 1 BCE`

`1 → 1 CE`

### Support

circa

century

date range

### Gate

Snapshot tests verify all formatting rules.

---

## MODULE 26 — Temporal State Schema

An entity can have many states.

Concept:

Entity

→ TemporalState

→ Geometry

### Fields

valid_from

valid_until

geometry

confidence

sources

metadata

### Gate

One entity can successfully represent five different historical geographic states.

---

## MODULE 27 — Temporal Range Rules

Prefer half-open internal intervals:

`[start, end)`

This avoids double-active boundary states.

### Tests

state transitions

adjacent ranges

overlapping ranges

gaps

### Gate

Overlapping states are detected unless explicitly permitted.

---

## MODULE 28 — Active Historical State Query

Input:

entity + year

Output:

correct temporal state

### Test dataset

Roman territorial snapshots.

### Gate

Hundreds of randomized date queries produce expected state.

---

## MODULE 29 — Global Timeline State Engine

Create application-wide selected historical time.

### Requirements

single source of truth

URL synchronization capability

no duplicate timeline states

### Gate

Every time-sensitive component receives the same year.

---

## MODULE 30 — Timeline UI

Build:

slider

year input

BCE/CE display

step controls

### Gate

UI and internal historical year remain perfectly synchronized.

---

## MODULE 31 — Playback Engine

Implement:

play

pause

speed

seek

restart

### Initial speeds

1 year

10 years

50 years

100 years

500 years

per playback interval.

### Gate

Playback passes deterministic clock tests.

---

## MODULE 32 — Temporal Map Transition System

When time changes:

calculate active states

→ diff previous/new states

→ add/remove/update map features

### Rule

Do not reload the entire atlas every frame.

### Gate

Changing year updates only affected features.

---

# PHASE 4 — HISTORICAL DATABASE MODEL

---

## MODULE 33 — Entity Table

Create core entity structure.

### Fields

UUID

canonical name

type

summary

start chronology

end chronology

publication status

### Gate

Entity CRUD integration tests pass.

---

## MODULE 34 — Entity Alias and Historical Name System

Support:

alternate spellings

historical names

modern names

translations

### Example

Constantinople

Byzantium

Istanbul

### Gate

Aliases resolve to canonical entity.

---

## MODULE 35 — Entity Relationship Graph

Support:

PREDECESSOR_OF

SUCCESSOR_OF

SPLIT_INTO

MERGED_INTO

VASSAL_OF

CONQUERED_BY

MEMBER_OF

RELATED_TO

### Gate

Graph integrity prevents invalid self-relations and dangling IDs.

---

## MODULE 36 — Source Database

Implement structured sources.

### Include

title

author

publication

year

URL

identifier

source type

license

### Gate

Sources survive import/export without losing metadata.

---

## MODULE 37 — Citation and Claim Model

Allow citation at:

entity

date

geometry

event

population estimate

relationship

### Gate

A reviewer can answer:

"Why does the atlas claim this?"

for every fixture.

---

## MODULE 38 — Settlement Model

Create cities/settlements.

### Support

coordinates

historical names

founding

abandonment

destruction

ownership

population estimates

### Gate

Cities appear/disappear correctly by year.

---

## MODULE 39 — Event Model

Support:

wars

battles

migrations

foundings

conquests

collapses

treaties

### Gate

Events can link:

time

location

entities

sources.

---

# PHASE 5 — API FOUNDATION

---

## MODULE 40 — API Framework

Create versioned API boundary.

Example:

`/api/v1`

### Include

structured errors

request IDs

validation

logging

### Gate

API contract tests pass.

---

## MODULE 41 — Entity API

Endpoints for:

entity lookup

relationships

aliases

sources

### Gate

Integration tests against real test database pass.

---

## MODULE 42 — Timeline API

Query:

entities active at year X

### Gate

Results exactly match temporal fixtures.

---

## MODULE 43 — Spatial Map-State API

Input:

year

viewport

layers

### Output:

only relevant map entities.

### Gate

Spatial + temporal filter combination is correct.

---

## MODULE 44 — Search API

Support:

canonical name

alias

historical name

partial matching

### Benchmark queries

Rome

Roman

Byzantium

Carthage

Macedon

### Gate

Expected entity appears within top results.

---

## MODULE 45 — Location History API

Input:

latitude

longitude

Output:

historical entities occupying that location through time.

### Gate

Known fixture points produce expected historical sequence.

---

# PHASE 6 — PRIMARY USER EXPERIENCE

---

## MODULE 46 — Application Layout

Build:

map

top navigation

timeline

side panel

layer controls

### Gate

No critical layout collision at target resolutions.

---

## MODULE 47 — Layer Controller

Users toggle:

states

cities

peoples

events

### Gate

Layer visibility state persists correctly.

---

## MODULE 48 — Entity Information Panel

Display:

name

type

period

summary

current historical state

relationships

sources

### Gate

Panel reflects current selected year.

---

## MODULE 49 — Search Interface

Search

→ choose result

→ move camera

→ set date

→ highlight entity

→ open panel.

### Gate

Entire flow passes Playwright test.

---

## MODULE 50 — Deep Linking

URL encodes:

year

selected entity

map position

zoom

active layers

### Gate

Opening copied URL recreates atlas state.

---

## MODULE 51 — City Visualization

Cities respond to:

selected year

zoom

status

### Gate

Cities outside temporal range never display.

---

## MODULE 52 — Event Visualization

Render historically appropriate event markers.

### Gate

Selecting event shows entities, date, location and source.

---

## MODULE 53 — Location History Interface

User clicks location.

Atlas displays historical sequence.

### Gate

UI matches Location History API fixture.

---

## MODULE 54 — Responsive and Accessibility Pass

Support:

desktop

tablet

basic mobile

keyboard interaction

screen-reader labels

### Gate

No serious/critical automated accessibility findings on critical screens.

---

# PHASE 7 — HISTORICAL DATA PIPELINE

---

## MODULE 55 — Data Lifecycle Architecture

Formal stages:

RAW

NORMALIZED

REVIEWED

VERIFIED

PUBLISHED

RETIRED

### Gate

Records cannot skip required stages.

---

## MODULE 56 — Source Registry

Maintain catalog of approved sources/datasets.

### Gate

Every imported source contains licensing and provenance metadata.

---

## MODULE 57 — Raw Data Import System

Preserve original input unchanged.

### Rule

Raw source data is immutable.

### Gate

Checksum confirms imported source remains unchanged.

---

## MODULE 58 — Normalization Pipeline

Normalize:

names

dates

entity types

coordinates

source references

### Gate

Running normalization twice produces same result.

---

## MODULE 59 — Historical Chronology Validator

Detect:

impossible ranges

end before start

invalid precision

bad BCE conversion

temporal overlap errors

### Gate

Known-invalid fixture dataset is completely rejected.

---

## MODULE 60 — Geographic Data Import Pipeline

Support:

GeoJSON

CSV coordinates

eventually shapefiles/other formats through preprocessing.

### Gate

Imported geometries match expected feature count and bounds.

---

## MODULE 61 — Entity Resolution

Detect possible duplicates.

Example:

Roman Empire

Imperium Romanum

Rome Empire

### Gate

Duplicate benchmark produces review suggestions without destructive automatic merging.

---

## MODULE 62 — Review Workflow

Reviewer can:

approve

reject

request correction

attach notes

### Gate

Unreviewed content cannot reach `VERIFIED`.

---

## MODULE 63 — Dataset Versioning

Every publication creates identifiable dataset version.

Example:

`atlas-data-0.1.0`

### Gate

Atlas can report exactly which dataset version it is displaying.

---

## MODULE 64 — Dataset Rollback

Ability to restore previous published data.

### Gate

Deliberately publish bad fixture data, rollback, verify old state is restored.

---

# PHASE 8 — MVP HISTORICAL CONTENT

---

## MODULE 65 — MVP Historical Dataset Charter

Freeze:

Europe + Mediterranean

500 BCE–500 CE

### Initial categories

Political states

Major peoples

Major cities

Major events

### Gate

Anything outside scope enters backlog rather than MVP.

---

## MODULE 66 — Greek and Persian World Dataset

Candidates:

Achaemenid Empire

Athens

Sparta

Macedon

Greek regions

### Gate

Every entity passes citation + chronology + geometry validation.

---

## MODULE 67 — Hellenistic World Dataset

Candidates:

Macedonian Empire

Ptolemaic Kingdom

Seleucid Empire

Antigonid Macedonia

### Gate

Alexander/Hellenistic state transitions render correctly.

---

## MODULE 68 — Roman and Carthaginian Dataset

Candidates:

Roman Republic

Roman Empire

Carthage

### Gate

Timeline clearly demonstrates Roman territorial change.

This should become one of the primary demo sequences.

---

## MODULE 69 — Eastern Mediterranean / Near East Dataset

Candidates:

Parthian Empire

Sassanian Empire

Judean political entities

Armenian states where relevant

### Gate

Temporal intersections with Roman data validated.

---

## MODULE 70 — European Peoples Dataset

Carefully model selected groups such as:

Gauls

Germanic peoples

Goths

Visigoths

Ostrogoths

### Requirement

Use uncertain/cultural regions rather than false hard borders where appropriate.

### Gate

Uncertainty model visibly distinguishes these from political territory.

---

## MODULE 71 — Major Cities Dataset

Approximately 15–25 initial settlements.

Examples:

Rome

Athens

Alexandria

Carthage

Constantinople

Antioch

Jerusalem

Ephesus

### Gate

Historical existence/date validation passes for every city.

---

## MODULE 72 — Major Events Dataset

Select approximately 20–40 events useful for demonstrating the timeline.

### Gate

Each event links:

date

location

participants

source.

---

## MODULE 73 — MVP Historical Quality Audit

Run complete published dataset through:

chronology

geometry

citation

relationship

duplicate

licensing

publication-state checks.

### Gate

ZERO blocking data errors.

---

# PHASE 9 — PERFORMANCE ARCHITECTURE

---

## MODULE 74 — Performance Baseline

Measure before optimizing.

Collect:

initial load

map FPS

memory

API latency

query latency

bundle size.

### Gate

Baseline report committed.

---

## MODULE 75 — PostgreSQL Temporal Indexing

Add indexes to major date/range queries.

### Gate

Benchmark improvement recorded.

No index accepted without evidence.

---

## MODULE 76 — PostGIS Spatial Indexing

Introduce GiST indexes.

Measure:

viewport queries

point containment

intersection queries.

### Gate

Query plans show correct index usage where expected.

---

## MODULE 77 — Geometry Simplification / LOD

Generate appropriate geometries by zoom.

### Gate

Visual accuracy remains acceptable while payload decreases measurably.

---

## MODULE 78 — Vector Tile Pipeline

Move large map layers toward vector tiles when justified.

### Gate

Same historical snapshot visually matches GeoJSON reference fixtures.

---

## MODULE 79 — PMTiles Distribution

Evaluate packaged tile delivery for static historical layers.

### Gate

Range requests and MapLibre integration function successfully.

---

## MODULE 80 — Client Cache Architecture

Cache:

metadata

search results

map state

static tiles

### Gate

Repeated interactions show measurable network reduction without stale-state errors.

---

# PHASE 10 — AWS INFRASTRUCTURE

---

## MODULE 81 — AWS Environment Architecture

Separate:

local

development

staging

production

### Gate

Environment matrix documented.

---

## MODULE 82 — AWS Budget Guardrails

Configure:

AWS Budgets

alerts

resource tagging

cost allocation

### Gate

Intentional budget test notification confirmed.

---

## MODULE 83 — Terraform Foundation

Terraform manages:

providers

state

environment configuration

naming

tags

### Gate

`terraform validate`

and plan pass.

---

## MODULE 84 — Frontend Cloud Deployment

Deploy frontend through:

S3

CloudFront

### Gate

Production build reachable through CloudFront.

---

## MODULE 85 — API Gateway Deployment

Expose atlas API safely.

### Gate

Staging API passes existing integration contract suite.

---

## MODULE 86 — Lambda API Runtime

Deploy initial API compute.

Avoid creating dozens of functions unnecessarily.

### Gate

Local and Lambda API contract results match.

---

## MODULE 87 — RDS PostgreSQL/PostGIS

Provision private PostgreSQL database.

### Submodules

VPC

subnets

security groups

PostGIS

backups

parameter configuration

### Gate

Application connects.

Internet cannot directly access database.

PostGIS tests pass.

---

## MODULE 88 — IAM Architecture

Implement least privilege for:

CI/CD

Lambda

developers

database access

### Gate

Application works without administrator permissions.

---

## MODULE 89 — Secrets Management

Store production secrets outside code.

### Gate

Secret rotation test succeeds without source-code change.

---

## MODULE 90 — Route 53 + TLS + Production Domain

Configure:

domain

DNS

HTTPS

CloudFront certificate

### Gate

Production atlas loads only over valid HTTPS and passes deployment smoke test.

---

# PHASE 11 — CI/CD AND OPERATIONS

---

## MODULE 91 — Infrastructure CI

Pull requests automatically run:

Terraform format

validate

security/static checks

plan where appropriate.

### Gate

Invalid infrastructure PR is blocked.

---

## MODULE 92 — Application Deployment Pipeline

Pipeline:

test

→ build

→ deploy staging

→ smoke test

→ production approval

→ deploy

### Gate

Deliberately failing smoke test prevents promotion.

---

## MODULE 93 — Database Migration Deployment

Migrations become controlled deployment step.

### Gate

Failed migration stops deployment safely.

---

## MODULE 94 — Historical Data Deployment Pipeline

Historical datasets deploy separately from application code.

### Gate

Bad dataset version can be rejected or rolled back without application redeploy.

---

# PHASE 12 — OBSERVABILITY AND RELIABILITY

---

## MODULE 95 — Structured Application Logging

Include:

request ID

endpoint

duration

status

error type

### Gate

A failed request can be traced end-to-end.

---

## MODULE 96 — CloudWatch Monitoring

Monitor:

API errors

latency

Lambda errors

database health

CloudFront health

### Gate

Synthetic failure triggers expected metric/alarm.

---

## MODULE 97 — Error Handling Architecture

Create consistent user-facing error classes.

### Gate

Frontend does not expose raw stack traces or database details.

---

## MODULE 98 — Backup Strategy

RDS backups

dataset backups

Terraform state safeguards

### Gate

Documented restore procedure exists.

---

## MODULE 99 — Disaster Recovery Test

Perform actual restoration into isolated environment.

### Gate

Restored application passes critical data/API tests.

---

# PHASE 13 — SECURITY HARDENING

---

## MODULE 100 — Threat Model

Evaluate:

frontend

API

database

admin pipeline

AWS

supply chain

### Gate

High-risk threats have mitigations.

---

## MODULE 101 — API Input Security

Test:

SQL injection attempts

malformed parameters

oversized requests

unexpected types

### Gate

All attack fixtures safely rejected.

---

## MODULE 102 — Browser Security

Validate:

XSS

CSP

security headers

CORS

### Gate

Automated checks show no critical issue.

---

## MODULE 103 — Dependency Security

Automate dependency vulnerability scanning.

### Gate

No known critical vulnerabilities accepted without explicit documented exception.

---

## MODULE 104 — Rate Limiting / Abuse Controls

Protect expensive public endpoints.

### Gate

Load test verifies controlled rejection rather than infrastructure failure.

---

# PHASE 14 — FINAL MVP VALIDATION

---

## MODULE 105 — End-to-End Golden Path

Automate:

open atlas

→ search Rome

→ timeline jump

→ select Roman Empire

→ inspect sources

→ play timeline

→ toggle cities

→ copy URL

→ reopen URL.

### Gate

100% pass in staging.

---

## MODULE 106 — Temporal Regression Dataset

Create permanent expected historical snapshots.

Example:

500 BCE

300 BCE

100 BCE

1 CE

117 CE

300 CE

476 CE

### Gate

Atlas state matches expected fixture for every snapshot.

---

## MODULE 107 — GIS Regression Suite

Test known coordinates and intersections.

### Gate

No unexpected spatial regressions.

---

## MODULE 108 — Search Benchmark

Create 50+ representative queries.

Measure:

top result

top-three result

alias resolution

### Gate

Defined accuracy target met.

---

## MODULE 109 — Performance Certification

Test representative desktop and mobile hardware.

Measure:

load

interaction

timeline

search

memory

API.

### Gate

Quality budgets established in Module 08 pass.

---

## MODULE 110 — Accessibility Certification

Keyboard test

automated scanner

focus order

labels

contrast

### Gate

No serious/critical accessibility defects.

---

## MODULE 111 — Historical Data Release Audit

Ensure:

citations

licenses

uncertainty

dates

geometry

relationships.

### Gate

All published MVP entities are certified.

---

## MODULE 112 — Security Release Audit

Run full security checklist.

### Gate

Zero unresolved critical/high release blockers.

---

# PHASE 15 — PUBLIC MVP RELEASE

---

## MODULE 113 — Production Release Candidate

Create:

`v1.0.0-rc.1`

### Gate

Full `verify:release` passes against staging.

---

## MODULE 114 — Portfolio Documentation

Create:

architecture diagram

AWS diagram

database diagram

temporal model diagram

screenshots

engineering decisions

lessons learned.

### Gate

Another developer can understand the system without your explanation.

---

## MODULE 115 — Demo Dataset Story

Prepare demonstration sequence:

500 BCE

→ Alexander

→ Hellenistic kingdoms

→ Roman expansion

→ Roman Empire

→ late antiquity.

### Gate

Entire demo runs without manual correction.

---

## MODULE 116 — Production Launch

Deploy `v1.0.0`.

### Gate

Production smoke tests pass.

Monitoring healthy.

Budget alarms active.

Backups active.

---

# PHASE 16 — POST-MVP PRODUCT EXPANSION

Do not start this phase until v1.0 is stable.

---

## MODULE 117 — Compare Mode

Compare:

500 BCE vs 500 CE

### Gate

Independent temporal states render simultaneously without contamination.

---

## MODULE 118 — Advanced Location History

Click anywhere and receive richer chronological history.

### Gate

Spatial and temporal results remain deterministic.

---

## MODULE 119 — Curated Story Engine

Create scripted historical sequences.

Controls:

camera

timeline

layers

annotations

entity highlights.

### Gate

One complete "Rise of Rome" story plays automatically.

---

## MODULE 120 — Curator Administration Interface

Allow authorized editors to create/edit:

entities

states

geometries

citations.

### Gate

Admin actions create audited revisions.

---

## MODULE 121 — Geographic Polygon Editor

Draw and edit historical regions directly on map.

### Gate

Invalid polygons cannot be saved/published.

---

## MODULE 122 — Migration System

Model movement separately from static territory.

### Gate

One migration sequence renders temporally and geographically correctly.

---

## MODULE 123 — Trade Network System

Support routes and networks.

### Gate

Silk Road or Mediterranean trade proof-of-concept passes.

---

## MODULE 124 — Religion Layer

Represent influence without pretending it has precise political borders.

### Gate

Uncertainty and temporal changes work correctly.

---

## MODULE 125 — Language Layer

Support languages and language families.

### Gate

Family relationships and geographic states validate.

---

## MODULE 126 — Population Layer

Add historical population estimates with ranges/confidence.

### Gate

Estimated values never appear as false precision.

---

## MODULE 127 — Historical Rulers / People

Add historical persons linked to:

states

cities

events

periods.

### Gate

Person chronology cannot contradict linked entity chronology without warning.

---

## MODULE 128 — Historical Coastline Support

Prepare for ancient geography differences.

### Gate

Coastline dataset can change independently of political entities.

---

## MODULE 129 — Full Globe Mode

Activate globe experience.

### Gate

Core map functionality behaves equivalently between supported map/globe views.

---

# PHASE 17 — GLOBAL EXPANSION

---

## MODULE 130 — Regional Dataset Framework

Create reusable expansion process.

### Regions could include

East Asia

South Asia

Sub-Saharan Africa

Americas

Central Asia

Oceania.

### Gate

New region requires no database redesign.

---

## MODULE 131 — Prehistoric Timeline Expansion

Move farther back into:

archaeological cultures

human migration

early settlements.

### Gate

Approximate dating system supports prehistoric uncertainty.

---

## MODULE 132 — Medieval Expansion

500–1500 CE.

### Gate

New historical complexity requires no core engine rewrite.

---

## MODULE 133 — Early Modern Expansion

1500–1800.

### Gate

Colonial and maritime systems integrate.

---

## MODULE 134 — Modern Expansion

1800–present.

### Gate

Modern borders coexist with historical geographic models.

---

# PHASE 18 — ADVANCED SEARCH AND INTELLIGENCE

---

## MODULE 135 — Historical Query Language

Support structured concepts such as:

entities active in 500 BCE

cities inside Rome in 117 CE

states neighboring X

### Gate

Query fixtures produce deterministic answers.

---

## MODULE 136 — Natural-Language Atlas Assistant

Examples:

"Show me the Roman Empire at its greatest extent."

"Show the spread of the Mongol Empire."

### Rule

AI controls the atlas.

AI does **not** become the authoritative historical database.

### Gate

Answers must resolve against verified atlas records and expose sources.

---

## MODULE 137 — AI Source Guardrails

Prevent unsupported AI claims from entering verified data.

### Gate

Hallucinated test facts cannot enter publication pipeline automatically.

---

# PHASE 19 — SCALE ARCHITECTURE

---

## MODULE 138 — High-Volume Dataset Benchmark

Simulate:

10k

100k

1M geographic/time features.

### Gate

Identify real bottlenecks before architecture changes.

---

## MODULE 139 — Tile Generation Service

If necessary, build scalable tile creation pipeline.

### Gate

Benchmark demonstrates meaningful improvement over existing architecture.

---

## MODULE 140 — API Horizontal Scaling

Only implement after measurements justify it.

### Gate

Load test proves scaling behavior.

---

## MODULE 141 — Advanced Search Infrastructure

Evaluate OpenSearch only if PostgreSQL search demonstrably becomes insufficient.

### Gate

Migration requires benchmark proving actual need.

---

## MODULE 142 — CDN Dataset Distribution

Distribute global static geographic datasets efficiently.

### Gate

Global delivery metrics improve.

---

# PHASE 20 — PLATFORM MATURITY

---

## MODULE 143 — Community Contribution System

Users may propose corrections.

### Requirement

Contributions never automatically become historical truth.

### Gate

Submission → review → decision workflow tested.

---

## MODULE 144 — Expert Curator Roles

Differentiate:

viewer

contributor

reviewer

historian/editor

administrator.

### Gate

Permission tests prove role isolation.

---

## MODULE 145 — Dataset Audit History

Maintain permanent revision history.

### Gate

Every published change identifies:

what changed

who/what changed it

why

sources

previous value.

---

## MODULE 146 — Public Historical API

Expose selected verified atlas data.

### Gate

Rate limiting, API documentation and schema stability verified.

---

## MODULE 147 — Embeddable Maps

Allow educators/websites to embed atlas views.

### Gate

Embeds cannot gain admin privileges or expose secrets.

---

## MODULE 148 — Education / Classroom Mode

Curated timelines and assignments.

### Gate

Education UI does not modify authoritative historical data.

---

# FINAL PLATFORM GATE — MODULE 149

## WORLD ATLAS PLATFORM CERTIFICATION

At this point World Atlas should have demonstrated that its architecture can support:

✓ states  
✓ peoples  
✓ cultures  
✓ cities  
✓ historical events  
✓ changing territory  
✓ BCE/CE chronology  
✓ approximate chronology  
✓ uncertainty  
✓ historical citations  
✓ disputed interpretations  
✓ spatial queries  
✓ location history  
✓ search  
✓ playback  
✓ vector tiles  
✓ globe rendering  
✓ migrations  
✓ trade routes  
✓ language layers  
✓ religion layers  
✓ population layers  
✓ AWS deployment  
✓ infrastructure as code  
✓ automated testing  
✓ data review  
✓ dataset versioning  
✓ backup and recovery  
✓ public production deployment

The final architecture review should specifically ask:

**"Can a new historical domain be added primarily through data and configuration rather than rewriting the atlas engine?"**

If the answer is no, architectural debt must be addressed before calling the platform mature.

---

# IV. RELEASE LANDMARKS

## v0.1 — Architecture

Modules 1–8.

No meaningful product yet.

Architecture is locked.

---

## v0.2 — Engineering Foundation

Modules 9–15.

Repository and local environment stable.

---

## v0.3 — Geographic Engine

Modules 16–23.

Interactive historical GIS foundation exists.

---

## v0.4 — Temporal Engine

Modules 24–32.

History can change through time.

This is the first major technical breakthrough.

---

## v0.5 — Historical Database

Modules 33–45.

Entities, chronology, geography, relationships and APIs work together.

---

## v0.6 — Functional Atlas

Modules 46–54.

A real user can operate the atlas.

---

## v0.7 — Historical Data Pipeline

Modules 55–64.

Historical information can be ingested professionally.

---

## v0.8 — Historical MVP Dataset

Modules 65–73.

The atlas finally contains meaningful history.

---

## v0.9 — Optimized Cloud Beta

Modules 74–104.

Performance, AWS, operations and security become production-grade.

---

## v1.0 — PUBLIC MVP

Modules 105–116.

The Europe/Mediterranean 500 BCE–500 CE atlas is publicly usable.

---

## v1.5

Modules 117–129.

Major visualization systems and advanced historical layers arrive.

---

## v2.0

Modules 130–137.

Global expansion and intelligent atlas interaction.

---

## v3.0+

Modules 138–149.

World Atlas evolves from project into historical platform.

---

# V. CRITICAL DEPENDENCY CHAIN

There are five parts of this project that must not be rushed.

### 1. Historical time model

M03

↓

M24–32

If this is wrong, nearly everything eventually breaks.

### 2. Historical ontology

M02

↓

M33–39

If all history gets treated like "countries," the database will become unusable.

### 3. Temporal geography

M26–32

This is the technological heart of World Atlas.

### 4. Provenance

M05

↓

M36–37

↓

M55–73

Without this, World Atlas becomes an attractive map with questionable historical authority.

### 5. Historical-data pipeline

M55–64

This ultimately becomes more important than the frontend.

The frontend can be rebuilt.

Hundreds of thousands of poorly structured historical records cannot be easily repaired.

---

# VI. MODULE COMPLETION RECORD

Every module should create a record similar to:

MODULE: M032

STATUS: PASS

COMMIT: abc1234

DATE:

IMPLEMENTATION:

TESTS RUN:

UNIT:
PASS

INTEGRATION:
PASS

GIS:
PASS

REGRESSION:
PASS

DATA:
PASS

BUILD:
PASS

KNOWN ISSUES:
None blocking

DOCUMENTATION:
Updated

NEXT MODULE AUTHORIZED:
M033

This should eventually be stored in:

`docs/progress/MODULE_LEDGER.md`

---

# VII. DEFECT SEVERITY

## P0 — Critical

Data loss

Security breach

Deployment destruction

Corrupted history database

Production unavailable

Immediate blocker.

## P1 — Major

Incorrect historical time calculations

Wrong geographic query

Broken primary feature

Missing provenance

Major security weakness

Module cannot pass.

## P2 — Moderate

Secondary feature malfunction.

Normally resolve before phase completion.

## P3 — Minor

Visual/polish issue.

May enter backlog.

---

# VIII. CLAUDE / CODEX OPERATING RULES

Future AI coding agents should receive these rules.

1. Read the current module definition before editing anything.
2. Inspect the repository before modifying it.
3. Read relevant architecture documents.
4. Identify affected files before writing code.
5. Do not expand module scope.
6. Do not silently implement future modules.
7. Do not rewrite working architecture without an ADR.
8. Preserve backwards compatibility unless the module explicitly changes a contract.
9. Never invent historical data and mark it verified.
10. Keep demo data separate from verified data.
11. Every historical geographic state must support provenance.
12. Preserve uncertainty.
13. Never convert an approximate cultural region into a hard political border merely for visual convenience.
14. Use the canonical historical time library.
15. Never manually implement BCE conversions elsewhere.
16. Validate geographic data.
17. Do not bypass publication workflow.
18. Do not bypass database migrations.
19. Do not introduce a new dependency without justification.
20. Do not introduce a new AWS service merely for portfolio complexity.
21. Prefer simple systems until performance data demonstrates a bottleneck.
22. Keep infrastructure reproducible.
23. Never put credentials in source control.
24. Write tests for all meaningful domain behavior.
25. Add regression tests for every confirmed bug.
26. Run module tests.
27. Run cumulative regression tests.
28. Run build verification.
29. Update documentation.
30. Update Module Ledger.
31. Explicitly report tests that were not run.
32. Explicitly report unresolved defects.
33. Never call a module complete while required tests fail.
34. Stop if an architectural assumption conflicts with an existing ADR.
35. Never delete data or migrations to make a failing test pass.
36. Prefer deterministic tests.
37. Preserve raw imported datasets.
38. Make normalization reproducible.
39. Preserve original sources.
40. Treat historical correctness as product correctness.

---

# IX. AI MODULE EXECUTION FORMAT

For every future module, the coding agent should receive a prompt based on this structure:

`CURRENT MODULE: M###`

`OBJECTIVE:`

`DEPENDENCY: M### must already be PASS`

`READ FIRST:`

relevant files

`IMPLEMENT:`

explicit scope

`DO NOT IMPLEMENT:`

future scope

`REQUIRED TESTS:`

specific tests

`REGRESSION TESTS:`

existing suite

`REQUIRED DOCUMENTATION:`

docs affected

`DEFINITION OF DONE:`

objective pass/fail conditions

`FINAL RESPONSE MUST REPORT:`

files changed

architecture decisions

tests executed

test results

known limitations

module status

recommended next module

The AI must not merely say:

"Everything works."

It must provide evidence.

---

# X. MOST IMPORTANT RULE OF THE PROJECT

**World Atlas is not a website with historical polygons placed on a map.**

It is a:

**temporal + spatial + historical provenance engine**

with a map as its primary interface.

Therefore the development priority is:

Historical Model

↓

Temporal Model

↓

Geographic Model

↓

Provenance

↓

Data Pipeline

↓

API

↓

Visualization

↓

Cloud Scale

—not the reverse.

Beautiful UI should never be allowed to hide a weak historical-data architecture.