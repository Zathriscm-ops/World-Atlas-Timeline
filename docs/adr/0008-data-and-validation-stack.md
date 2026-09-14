# ADR 0008: Relational geography and one validation definition
Status: Accepted, M007, 2026-09-14.

Choose PostgreSQL/PostGIS for entities, time-scoped states, citations and spatial predicates. Use explicit reviewed SQL migrations and parameterized SQL via the PostgreSQL driver; no ORM is required initially. SQL makes spatial plans and constraints inspectable. Embedded spatial databases remain useful research tools, but do not satisfy the required private RDS API architecture.

Target a supported RDS-compatible PostgreSQL/PostGIS pair. M013 pins an available image digest and extension version after compatibility checks; M081/M087 verify the managed engine supports it. Do not hardcode an unverified latest extension or use a floating production image tag.

Zod 4 is the application contract authority; infer TypeScript types and derive JSON Schema where useful. Do not independently maintain equivalent validators. Zod 4.6.5 is the initial pinned foundation dependency, checked against the registry on 2026-09-14. It creates no production historical schema in M009.

DEP-02: M022/M023 exercise isolated GIS/publication predicate fixtures. Those gates cannot certify a production publication transaction before its schema exists; repeat integration at M037 and the actual publication boundary. DEP-03: M026 defines domain-state contracts and fixtures; M033–M037 subsequently bind them to relational constraints, with mandatory cumulative tests. No dangling production foreign keys and no silent completion of those later modules.

Sources: [Zod](https://zod.dev/), [RDS PostgreSQL documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html). The three-case source audit supports separate claims, representations and unknown geometry; it does not establish production content readiness.
