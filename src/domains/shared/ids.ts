/**
 * Common identifier + primitive contracts (handoff §7.1).
 *
 * Milestone 1 — architecture foundation. Pure types + guards; no runtime behavior,
 * no I/O. Branded aliases document intent at call sites without changing emitted JS.
 */

export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Opaque UUID (never a sequential DB id at a boundary — handoff §7.4 rule). */
export type UUID = Brand<string, "UUID">;
/** Calendar date, `YYYY-MM-DD`. */
export type ISODate = Brand<string, "ISODate">;
/** Timestamp, RFC 3339 (`YYYY-MM-DDThh:mm:ssZ`). */
export type ISODateTime = Brand<string, "ISODateTime">;
/** ISO-4217 currency code; open string per handoff §7.1. */
export type Currency = "IDR" | "USD" | (string & {});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export const isUuid = (v: unknown): v is UUID => typeof v === "string" && UUID_RE.test(v);
export const isIsoDate = (v: unknown): v is ISODate => typeof v === "string" && ISO_DATE_RE.test(v);
export const isIsoDateTime = (v: unknown): v is ISODateTime =>
  typeof v === "string" && ISO_DATETIME_RE.test(v);

/** Assert-and-brand helpers (throw on malformed input — fail fast at boundaries). */
export function asUuid(v: string): UUID {
  if (!isUuid(v)) throw new TypeError(`not a UUID: ${v}`);
  return v as UUID;
}
export function asIsoDate(v: string): ISODate {
  if (!isIsoDate(v)) throw new TypeError(`not an ISODate (YYYY-MM-DD): ${v}`);
  return v as ISODate;
}
export function asIsoDateTime(v: string): ISODateTime {
  if (!isIsoDateTime(v)) throw new TypeError(`not an ISODateTime (RFC 3339): ${v}`);
  return v as ISODateTime;
}
