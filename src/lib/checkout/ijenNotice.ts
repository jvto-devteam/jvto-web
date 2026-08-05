/**
 * Canonical checkout notice text for Kawah Ijen itineraries (Milestone 0).
 *
 * Facts are canon-locked (docs/CANONICAL_FACTS.md): the Ijen health screening is
 * MANDATORY for every guest before Kawah Ijen crater entry — supported by BBKSDA
 * SE.1658/KSA.9/2024 as authority, included in the package, and conducted at the
 * guest's hotel before the guide briefing. This is the single source of the notice
 * text so wording + absence-of-retired-wording are unit-testable and cannot drift.
 *
 * TARGETING lives in src/lib/ijenRelevance.ts (isIjenRelevantCheckout) — off the
 * payload's explicit `ijenRelevant` boolean, derived from a stable destination
 * identifier, never a label substring.
 *
 * Retired wording that must never appear here: conditional "may require" /
 * "dapat mensyaratkan"; "Travel Credit" (retired → "Lifetime Package Credit"); any
 * "<48h forfeit" / "hangus" cancellation clause.
 */

/** Canonical, mandatory-wording Ijen health-screening notice (no retired wording). */
export const IJEN_HEALTH_NOTICE = {
  heading: "Ijen health screening (required)",
  body:
    "Every guest must complete a health screening before Kawah Ijen crater entry, " +
    "supported by BBKSDA SE.1658/KSA.9/2024. The screening is included in your package " +
    "and is conducted at your hotel before the guide briefing.",
} as const;
