# Source and provenance standard

Status: M005 contract. Fixtures illustrate the contract; they are not published historical records.

## Records and immutable links

| Record | Required meaning and fields |
|---|---|
| Source | Bibliographic work or versioned resource: stable ID, kind, title, creators with roles, publisher, edition/version, language when known, publication date or explicit unknown, stable URI/DOI, access date for mutable resources, reliability category and rationale. Rights are linked separately. |
| Citation | Claim-to-source edge: ID, source/version, precise locator (page, map/grid, section, feature ID or JSON pointer), SUPPORTS/CONTRADICTS/BACKGROUND, direct/indirect consultation and via-source for indirect use. Optional short excerpt within reuse limits. |
| Claim | Atomic assertion about an entity or state, typed value, time and spatial scope, interpretation ID, uncertainty dimensions, supporting/contradicting citations, revision ID and review/publication state. |
| Dataset | Acquisition unit: source/version, original URI, retrieval timestamp, immutable bytes/hash/size, license record, upstream lineage, storage location, CRS and axis order, declared time convention, transformation manifest and responsible contributor. Unknown fields block the relevant normalization step. |
| Contributor | Stable identity and role: author, importer, transcriber, reviewer, editor. Automation is explicitly identified and cannot sign as a historian or rights reviewer. |
| Revision | Append-only change: parent revision, contributor, timestamp, reason, before/after or content hash, source/citation additions, tool/model involvement and review result. Reversion creates a new revision referencing the restored content. |

A citation is not a blanket endorsement of every field in an entity. Identity, name, date, location and polygon extent each need their own evidence. Opposing claims coexist under separate interpretations. Source reliability does not erase date, identity or geographic uncertainty. Deletion/public withdrawal retains a tombstone and audit history; public views omit private contributor contact details.

## Citation formats

- Book: creator(s), title, edition, publisher, year, volume/page; stable catalog URI or ISBN when verified.
- Journal: authors, article title, journal, year, volume/issue, pages/article number, DOI, precise passage.
- Dataset: creator, title, release/commit, feature ID, URI, access date and byte hash for acquired files.
- Historical atlas: editor, title, edition/year, publisher, map number, grid and feature label; identify the map actually consulted.
- Museum/academic page: institution/author, title, object/accession ID where applicable, section, URI, update/access date.
- URL-only resources still require a title, responsible creator or explicitly unknown creator, locator, dated capture/version and access date. A URL alone is not a citation.

The Barrington example in the fixture is a book/atlas bibliography and an **indirect** map reference from Pleiades. The map itself was not read; it supplies no directly verified geometry claim. Missing metadata stays unknown, never invented.

## Reliability and AI

Categories: PRIMARY_EVIDENCE, PEER_REVIEWED_RESEARCH, SCHOLARLY_REFERENCE, CURATED_REFERENCE, INSTITUTIONAL_INTERPRETATION, UNVERIFIED_AGGREGATE, COMMUNITY_REFERENCE, UNKNOWN. Record authorship, methods, date, scope, editorial process and known conflicts in the rationale; categories are not numeric truth scores. Ancient primary evidence can itself be biased or ambiguous.

AI output is a transformation/proposal, never an authoritative historical source. Preserve the source passage locator, tool/model identifier when available (unknown if unavailable), task, input/output hashes for durable transformations, contributor and review status. AI-derived assertions remain PROPOSED until a reviewer checks the original evidence. AI assistance cannot upgrade source reliability, supply a missing citation, calibrate a probability or approve rights.

## Traceable examples

See [the six source-linked facts](data/fixtures/planning/provenance.json) and [feasibility audit](docs/research/MVP_DATA_FEASIBILITY.md). Every factual claim in that fixture has a citation, source record and revision. The earlier thirty ontology entries are explicitly editorial classification inputs, not sourced historical database entries; their publication flag is false. Turning any into historical content requires this standard.

The Alexandria founding statement is an occurrence window, not proof of continuous existence during a range. Representative coordinates do not certify meter-level accuracy or political ownership. A page's broad name periods must be interpreted before becoming name-validity intervals.

## Gate and later enforcement

Planning checks reject missing/dangling citations, missing locators, AI authority and indirect citations mislabeled as direct. No database or publication service exists yet. M036/M037 implement the relational model; M051–M057 and the publication modules enforce source/rights/review guards transactionally. M028 must acquire a small rights-reviewed historical fixture with per-state citations and uncertainty; synthetic fixtures are a separate path and cannot satisfy a real historical-data gate.
