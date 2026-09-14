# Historical Uncertainty Contract

Module M004. Reference cases are planning fixtures, not historical reconstructions.

## Independent dimensions

| Dimension | Vocabulary | Interpretation |
|---|---|---|
| evidence assessment | HIGH, MEDIUM, LOW, UNASSESSED | Strength of support for this particular assertion under a recorded rubric |
| temporal precision/certainty | EXACT_AT_PRECISION, APPROXIMATE, BOUNDED, UNKNOWN | A known year need not be a known day |
| spatial representation | HIGH, APPROXIMATE, CORE, PROBABLE, POSSIBLE, UNKNOWN | Method and positional precision are recorded separately |
| identity | CONTEXTUAL, DISPUTED, UNKNOWN | Competing continuity, membership or identification claims |
| scholarly disagreement | DISPUTED, NOT_ASSESSED, NO_DISAGREEMENT_IN_REVIEWED_SOURCES | A strong source can still support a disputed claim |
| editorial workflow | DRAFT, REVIEWED, VERIFIED_UNDER_POLICY, PUBLISHED | Review status, never a probability of truth |

The outline's HIGH/MEDIUM/LOW, DISPUTED, APPROXIMATE and UNKNOWN are supported without collapsing incompatible meanings into one enum. Each assessment requires a rationale, assessor/policy and interpretation ID. Keep source quality separate from geometry precision. Alternative interpretations preserve their own geometry and dating; publication records its chosen view, not a silent merge.

HIGH means explicit, relevant support with documented methodology at the stated precision. MEDIUM means support with material limitations or inference. LOW means weak or indirect support. UNASSESSED means no review judgment. These labels are a project rubric, not universal scholarly ranks. Primary sources are not automatically HIGH.

## Rendering policy

Political control may use bounded fills according to its evidence. Peoples, ethnic groups, religions, languages, civilizations and archaeological cultures use role-appropriate presence/distribution/influence; they cannot inherit a control role or hard border merely for style. A related polity must be modeled separately.

Approximate boundaries use dashed lines or patterned areas plus text. Core/probable/possible zones are separate components only when evidence supports them. Unknown location means unmapped, not a zero coordinate or fabricated point. A known site with uncertain dating is a valid combination. Gradients/probability numbers require a named calibrated model, units and source; an LLM confidence score is not acceptable evidence.

Color alone is insufficient. Legends and panels explain uncertainty, selected interpretation, missing coverage and alternative claims. A disagreement badge does not turn all sources into equally credible alternatives; reviewers document relevance and grounds for inclusion.

## Required examples and gate

Celtic regional identity, early Germanic peoples and Hallstatt material-culture distributions are covered by [12 rule fixtures](data/fixtures/planning/uncertainty.json), alongside independent date/site confidence, unknown location, rival interpretation and deliberate false-border/probability failures. Seven valid representations and five invalid cases test the distinctions without manufacturing historical coordinates.

The British Museum cautions against treating Celts as a single fixed people/identity: [Who were the Celts?](https://www.britishmuseum.org/blog/who-were-celts). The NHM discusses Hallstatt as a site giving its name to an archaeological culture: [Hallstatt site](https://www.nhm-wien.ac.at/hallstatt/en/site). Pleiades documents uncertain locations and representative-point limits: [uncertainty](https://pleiades.stoa.org/help/uncertainty), [representative points](https://pleiades.stoa.org/help/representative-points). These support the modeling caution; they do not establish a new territorial polygon.

Run node scripts/planning/verify.mjs 4. Database and map enforcement will be integrated in their later modules; this gate verifies the standard and adversarial examples.
