# Historical Time Standard

Module M003. Accepted convention; runtime domain library is M024.

## Annual representation

Use integer astronomical years: CE n maps to n; BCE n maps to 1 − n. Thus 500 BCE is -499, 2 BCE is -1, 1 BCE is 0, and 1 CE is 1. Public era-qualified zero, negative era magnitudes, fractional years and ambiguous unqualified year input are invalid in the first public parser. Historical time never depends on JavaScript Date. UTC audit timestamps are unrelated.

Public formatting emits BCE/CE. Era-qualified input may accept BC/AD aliases when the parser is implemented, but the canonical fixture format is BCE/CE. Year zero is valid only in the explicitly documented internal representation. An integer year means annual precision, not a particular day.

## Intervals and precision

Compiled annual durations use [start,end): lower included, upper excluded. The full year 117 is [117,118); 500 BCE through 500 CE inclusive is [-499,501). At an adjacent boundary exactly one exclusive state is active. Gaps remain gaps. Overlap is allowed only under an explicit interpretation/role policy.

An occurrence window is not a duration. “1200–1100 BCE” as uncertain dating gives candidate years -1199 through -1099, searchable envelope [-1199,-1098). A multi-year process spanning that interval is a separate duration expression. Retain expression kind, original wording, calendar, precision and normalization policy.

The 5th century BCE is 500–401 BCE, interval [-499,-399). The 5th century CE is 401–500 CE. Early/mid/late subdivisions require a cited convention; “late” alone does not create numeric bounds. Decades and millennia follow explicit ordinal era conventions rather than Unix timestamps.

Approximate dates preserve c./circa wording. “~3000 BCE” maps its nominal year to -2999, but does not imply a hidden ±50-year tolerance. Unknown dates/bounds are null with explicit status, not year zero, sentinel extremes or infinity. Deliberately open and ongoing-as-of-source bounds are distinct from unknown.

## Uncertain start and end

For finite, justified boundary ranges, possible occupancy is [start_min,end_max), and certain occupancy is [start_max,end_min) when nonempty. Validate start_min ≤ start_max, end_min ≤ end_max and feasible ordering. End bounds represent exclusive boundaries. Example start 100–110 and end 150–160 gives possible [100,160), certain [110,150). Empty certain occupancy is legitimate uncertainty, not proof of an invalid historical claim.

An observed snapshot does not establish persistence to the next snapshot. Store observation and reviewed validity separately. Selected year, interpretation and data release must be identical across a rendered map and panel. Search into an uncovered date reports the gap.

## Future calendars and playback

Retain original calendar names/components and BP epochs/calibration methods; do not guess conversions. Day-level conversion is deferred and must use a tested calendar-aware ordinal system, never fractional years. Approximate dates do not imply probability distributions.

Playback speeds are historical years per real second: 1, 10, 50, 100, 500. The later controller uses a monotonic clock, deterministic integer selection, negative-year floor semantics, and pause/reset on buffering/background/manual seek. This resolves DEP-10's unit ambiguity without implementing M031.

## Gate

[data/fixtures/planning/temporal.json](data/fixtures/planning/temporal.json) records ten year round-trips, invalid era inputs, boundary intervals, occurrence/duration/century/unknown expressions and uncertain bounds. The planning checker independently checks the standard and thousands of year round-trips. It is a test oracle only; M024 must implement the production canonical library against these fixtures. No frontend or production module may import a planning test oracle.
