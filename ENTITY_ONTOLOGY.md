# Historical Entity Ontology

Module M002. Status: adopted modeling contract, not certification of historical records.

## Canonical categories

| Type | Meaning | Default representation | Never infer |
|---|---|---|---|
| polity | Political institution with a defined identity/continuity policy | control, claim, administration | Modern sovereign-country status |
| people | Historically situated named collectivity | presence, movement | Uniform ancestry, language or statehood |
| ethnic_group | Contextual identity asserted through self/other identification | presence, attestation | Fixed biological boundaries or timeless membership |
| archaeological_culture | Scholarly grouping of material practices/assemblages | distribution | Ethnicity, language or political unity |
| civilization | Analytical cultural-historical grouping | cultural extent, sites | One polity or universally agreed boundary |
| settlement | Inhabited place with possible occupation/site episodes | site point or footprint | Founding from earliest surviving evidence |
| event | Occurrence or process with participants and locations | point, area, route | That a dating window is event duration |
| network | Time-scoped nodes and connections | routes, nodes | A unique fixed path or political ownership |
| religion | Tradition and its historically situated institutions/practice | influence, attestations | Exclusive religious ownership of space |
| language | Language/variety/family classification | distribution, attestations | Ethnicity or exclusive monolingual territory |
| geographic_region | Named physical or historical reference region | reference extent | Fixed modern-country containment |

## Identity and extension rules

Use opaque stable IDs. Primary category is editorial and versioned; additional identity/classification claims may be time-scoped and disputed. People and ethnic-group categories can overlap semantically: the identity note and claim context explain the choice, rather than asserting mutually exclusive human categories. Do not classify from a name alone.

Historical names, political form, dynasty, government, spatial representation and identity are separate. Carthage the city and the Carthaginian state use different IDs. Visigoths the people and a Visigothic kingdom use different IDs. Renaming a settlement normally adds a temporal name claim; mergers, splits and disputed continuities require sourced relationship claims. Roman eastern/western administrations do not silently duplicate imperial territory.

No mandatory modern-country parent. Geographic containment and political membership are distinct time-scoped relations; multiple parents or interpretations are allowed. A location query does not prove political control.

New labels/subtypes may extend controlled vocabularies with an ADR and fixtures. A genuinely new domain adds a type only after demonstrating that existing semantics cannot express it. Type registry entries declare valid representation roles and uncertainty requirements; adding a type never disables validation.

## Gate fixtures

[Thirty classification fixtures](data/fixtures/planning/ontology.json) cover all eleven required categories. Each supplies a rationale and is explicitly ineligible for historical publication. They exercise modeling with historical labels supplied as examples; they contain no dates or asserted territorial boundaries. Source-bearing factual examples are owned by M005. These are not verified production entities.

Cases deliberately include city/polity and people/polity ambiguity. All thirty fit the declared taxonomy without an extension; the model permits future subtype extensions while preserving IDs and provenance.

Reference context: [Pleiades](https://pleiades.stoa.org/) models ancient places; [UNESCO's Silk Roads introduction](https://www.unesco.org/en/silk-roads/about-silk-roads?hub=196704) describes interconnected exchange routes. These contextual references do not certify every fixture.

Run the dependency-free document/fixture gate: node scripts/planning/verify.mjs 2. The checker verifies taxonomy coverage, unique IDs, rationale, publication exclusion and preserved M001 artifacts.
