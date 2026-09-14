# Data licensing policy

M006. No external dataset may enter a production import, release artifact, public tile, API response or download without a versioned rights record. A file being public on the internet is not permission to reuse it. Source credibility and reuse permission are independent.

## Classification and disposition

| Class | Policy |
|---|---|
| PUBLIC DOMAIN | Record the publisher's declaration, version, jurisdiction/scope when relevant and any excluded components. Retain provenance and attribution even when optional. |
| CC0 | Record the CC0 version and the actual rights holder's dedication; other rights are not automatically waived. |
| CC-BY | Record exact version, creator/title/source and license link, modifications, notices and any third-party exclusions. |
| ODbL | Review attribution, derivative versus collective database, produced-work notices and applicable share-alike/database access obligations before combining or publishing. |
| RESTRICTED | No production import until a sufficient grant and compatible downstream use are documented. This is a project disposition, not a claim that all source licenses are proprietary. |
| UNKNOWN | Fail closed. Missing or ambiguous permission cannot be replaced by a guessed license. |
| INTERNAL TEST ONLY | Synthetic or unreviewed test material is segregated from release inputs; never publish as historical evidence. |

The inventory uses RESTRICTED for Historical Basemaps because its repository GPL notice, mixed lineage and intended distribution have not been cleared. GPL is an open-source license; it is not silently converted into CC-BY, CC0 or the application's license.

Primary terms reviewed: [CC0](https://creativecommons.org/publicdomain/zero/1.0/), [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/), [ODbL](https://opendatacommons.org/licenses/odbl/1-0/), [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/), [AWMC](https://github.com/AWMC/geodata). These links establish the relevant declarations/terms, not blanket approval of unselected assets.

## Rights record and admission

Each immutable dataset version needs source ID, version, SHA-256, original URI, retrieval date, license identifier/version, evidence URI and retained notice, covered components, excluded components, attribution text, upstream lineage, intended use, modifications, compatibility reasoning, reviewer and dated decision. File changes invalidate the prior version's approval. A bare license string is insufficient.

Production admission requires all of:
1. An eligible class with an explicit license/declaration covering the selected bytes.
2. Complete source/version/hash and notice/attribution.
3. Cleared upstream lineage and rights review by an identified reviewer.
4. Historical and publication review for historical content, independent of rights.
5. No unresolved restriction or incompatible combination. ODbL requires an explicit derivation/distribution review.
6. Output attribution, license/notice files and any required database offer included in the release manifest.

No record in the current inventory is production-approved. Synthetic positive admission fixtures prove policy behavior; they are not actual approvals. No external production dataset has been imported.

## Storage and reproducibility

Keep original downloads unchanged in data/research/raw locally, outside application assets. Commit only safe bibliographic metadata, source URLs and checksums until distribution rights are cleared. Preserve originals rather than deleting files to make checks pass. Production acquisitions later use immutable object storage plus a rights manifest; transformations point back to original hashes. Hash mismatch or changed terms triggers re-review.

Do not relicense third-party data under the code license. Layer-specific attribution stays visible in map credits and export/API metadata. Images, maps, dataset contents, database rights and textual quotations may have different grants. Citation of a work does not authorize reproducing its atlas maps.

## Enforcement boundary

The M006 planning oracle rejects absent rights, missing attribution, unresolved lineage, absent review, UNKNOWN, RESTRICTED and INTERNAL TEST ONLY. M055 and publication/export modules must implement this at actual ingestion and release boundaries, with no bypass via caches or generated tiles. M028 cannot substitute quarantined geometry for cleared historical fixtures.

See [inventory](data/fixtures/planning/licensing.json), [source audit](docs/research/MVP_DATA_FEASIBILITY.md) and ADR 0006.
