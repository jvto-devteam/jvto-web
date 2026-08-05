/**
 * Feature-flag mechanism (handoff §16 M1). All flags default OFF, so importing this
 * module changes no behavior. New Milestone paths gate on these until proven.
 *
 * Resolution: an explicit override map (tests) → env var `FLAG_<UPPER_SNAKE>` === "1"
 * / "true" → the registered default (always false in M1).
 */

export type FeatureFlag = "outbox-worker" | "domain-events" | "ai-envelopes";

const DEFAULTS: Record<FeatureFlag, boolean> = {
  "outbox-worker": false,
  "domain-events": false,
  "ai-envelopes": false,
};

let overrides: Partial<Record<FeatureFlag, boolean>> = {};

/** Test seam: force flags on/off deterministically. */
export function __setFlagOverrides(next: Partial<Record<FeatureFlag, boolean>>): void {
  overrides = { ...next };
}

function envValue(flag: FeatureFlag): boolean | undefined {
  const key = "FLAG_" + flag.toUpperCase().replace(/-/g, "_");
  const raw = typeof process !== "undefined" ? process.env?.[key] : undefined;
  if (raw === undefined) return undefined;
  return raw === "1" || raw.toLowerCase() === "true";
}

export function isEnabled(flag: FeatureFlag): boolean {
  if (flag in overrides) return overrides[flag] === true;
  const env = envValue(flag);
  if (env !== undefined) return env;
  return DEFAULTS[flag];
}
