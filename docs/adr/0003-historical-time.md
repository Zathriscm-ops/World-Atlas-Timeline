# ADR 0003 — Astronomical historical chronology

Status: Accepted
Module: M003

Use integer astronomical years internally, BCE/CE publicly, half-open annual durations and typed uncertain expressions. Preserve original calendar/precision and distinguish unknown from unbounded. A date occurrence window is not event duration. Snapshot observation is not validity persistence. Use historical years per real second for future playback.

Rejected: negative BCE magnitudes without year zero; JavaScript Date as historical storage; automatic approximate tolerances; day-as-fractional-year; unsourced interpolation. One later canonical domain library (M024) owns production arithmetic. Planning checks are independent expected-value oracles, not duplicated production logic.
