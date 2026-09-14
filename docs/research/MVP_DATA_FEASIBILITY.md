# Representative data feasibility, 2026-09-14

This is a source and acquisition audit, not historical certification or permission to publish. All downloaded files stay in local research quarantine. Metadata and hashes are versioned; no candidate below is currently approved production data.

| Required case | Observed evidence | Feasibility and unresolved work |
|---|---|---|
| Changing political territory | Two pinned Historical Basemaps files (100 and 200 CE) contain Roman Empire MultiPolygons. File counts, sizes and SHA-256 are in snapshot-manifest.json. | Geometry is technically available. Extent accuracy, state-level sources, snapshot persistence and upstream rights need review. Do not interpolate, infer annual boundaries or map a snapshot to 117 CE. |
| Settlement, point and date | Pleiades Alexandria provides a representative point and reports a 332/331 BCE foundation; it also lists names and references. | Suitable source candidate for a point plus uncertain event, after attribution and field-level review. Period labels are not automatically name-validity intervals. |
| Cultural presence | NHM Vienna explains Hallstatt as an archaeological culture; the cited journal discusses archaeological terminology. | Supports cautious classification. Neither passage supplies a reusable, dated presence polygon. A qualified researcher must supply/digitize cited evidence with rights clearance; use an unmapped record until then. |

Sources: [Historical Basemaps](https://github.com/aourednik/historical-basemaps), [Alexandria](https://pleiades.stoa.org/places/727070), [NHM Hallstatt](https://www.nhm-wien.ac.at/hallstatt/en/site), [Gretzinger et al.](https://www.nature.com/articles/s41562-024-01888-7). Full source records and precise claim locators are in provenance.json.

Historical Basemaps declares GPL-3.0 at repository level, warns that the work needs verification and lists heterogeneous upstream sources. This does not establish every polygon's historical accuracy or downstream rights. The actual downloaded snapshot bytes are unchanged. Each contains one feature named Roman Empire; no GIS validity or historical boundary certification was performed in M005.

## Acquisition path before M028

1. Select a small political entity/date pair and identify source passages for each state, using the pinned candidates only as leads.
2. Obtain source and upstream rights records under M006; store originals, full attribution and transformation history.
3. Confirm coordinates, geometry validity and temporal semantics through the later GIS/time modules. Do not reuse a site's advertised location accuracy for a different representative point.
4. Have a historical reviewer record the interpretation, competing evidence and uncertainty. Rights clearance and historical review are separate.
5. Publish only after all applicable guards. If either reviewed geometry or rights is unavailable, M028 is BLOCKED; a synthetic map cannot silently replace it.

Architecture feasibility: sufficient evidence to design separate entity/state/claim, immutable acquisition and uncertain/unmapped representations. Production-content readiness: **NO-GO** for these research samples. M005 and M006 complete standards and audit gates, not later content gates.

## Raw evidence

Local raw files: world_100.geojson, world_200.geojson and pleiades-727070.json. The latter is the linked Pleiades sidebar JSON (related-resource links), not a full place export. Its SHA-256 is AD597145D36408A4F81EEB25BF08B824FE2FA51554373808B11E8503E550596E; historical assertions above were checked against the place page. Raw files are excluded from application assets and Git distribution. Reacquisition uses the manifest URLs and validates hashes.
