/**
 * Versioning + provenance contracts (handoff §7.1).
 * Milestone 1 — pure types. Version refs make product/price/policy identity explicit
 * so historical agreements stay immutable (P-04); provenance tags generated outputs
 * so they are never mistaken for authorities (P-05).
 */
import type { ISODateTime } from "./ids";

export interface VersionRef {
  id: string;
  version: number;
  effectiveFrom: ISODateTime;
  effectiveTo?: ISODateTime;
}

export type SourceType = "git" | "database" | "provider" | "derived";

export interface SourceProvenance {
  sourceType: SourceType;
  sourceId: string;
  sourceVersion: string;
  generatedAt?: ISODateTime;
}

/**
 * True when `at` falls in `[effectiveFrom, effectiveTo)`. Compares parsed INSTANTS,
 * not raw strings — RFC 3339 offsets (`+08:00` vs `Z`) make lexicographic comparison
 * order the wrong instant, and these refs gate product/price/policy versions.
 */
export function isEffectiveAt(ref: VersionRef, at: ISODateTime): boolean {
  const t = Date.parse(at);
  const from = Date.parse(ref.effectiveFrom);
  const to = ref.effectiveTo === undefined ? undefined : Date.parse(ref.effectiveTo);
  if (Number.isNaN(t) || Number.isNaN(from) || (to !== undefined && Number.isNaN(to))) {
    throw new TypeError("isEffectiveAt: unparseable ISODateTime");
  }
  return from <= t && (to === undefined || t < to);
}
