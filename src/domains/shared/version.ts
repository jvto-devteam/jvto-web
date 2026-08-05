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

export const isEffectiveAt = (ref: VersionRef, at: ISODateTime): boolean =>
  ref.effectiveFrom <= at && (ref.effectiveTo === undefined || at < ref.effectiveTo);
