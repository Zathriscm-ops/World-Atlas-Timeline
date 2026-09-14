# ADR 0002 — Historical entity categories

Status: Accepted
Module: M002

Adopt the eleven categories and identity rules in ENTITY_ONTOLOGY.md. Separate identity from names, political form and geometry. Archaeological material groupings, peoples and linguistic/religious distributions must not inherit sovereign border semantics. Use contextual type assertions and role vocabularies instead of a country table or modern-country hierarchy.

Alternatives rejected: a country-only model, name-based identity merging, and a universal untyped JSON blob. Consequence: some labels resolve to multiple typed entities and require explicit disambiguation. Thirty editorial fixtures exercise all categories. No production historical claim is certified by this ADR.
