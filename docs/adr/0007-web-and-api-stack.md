# ADR 0007: Browser atlas and one TypeScript API
Status: Accepted, M007, 2026-09-14.

Choose React, TypeScript and Vite for the interactive single-page atlas, MapLibre GL JS for geographic layers, and one Fastify/TypeScript API. React controls UI state; a map adapter owns MapLibre lifecycle and cleanup. Avoid rerendering all geometry per animation frame. Public contracts cross HTTP; database objects do not.

Vite avoids an unnecessary SSR server for the initial atlas. MapLibre meets vector styling and interaction needs without choosing a paid map SDK; basemap assets still require separate rights/hosting decisions. Fastify supports a small modular service and injection testing; evaluate its Lambda adapter in the runtime module. A Python backend would duplicate shared contract tooling; a large decorator-based framework is unnecessary initially. These are scope decisions, not benchmark claims.

Risks: WebGL/device support, map bundle size, accessibility outside canvas, cold starts and Lambda/Postgres connection limits. Test accessible list alternatives, lazy loading, concurrency caps and connection reuse in the applicable modules. Do not introduce connection pooling infrastructure without measured need.

References checked: [Vite guide](https://vite.dev/guide/), [MapLibre documentation](https://maplibre.org/maplibre-gl-js/docs/), [Fastify support policy](https://fastify.dev/docs/latest/Reference/LTS/). Exact frontend/API versions and adapter compatibility are verified at installation.
