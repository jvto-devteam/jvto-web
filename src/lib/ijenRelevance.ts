/**
 * Ijen-relevance derivation (single source).
 *
 * Ijen relevance is derived from a STABLE identifier — the package's destination
 * `route[]` (canonical destination names like "Kawah Ijen") — NOT from a display
 * label, which can be renamed. Name/slug are a resilience fallback only. The two
 * tour `[slug]` server pages call `deriveIjenRelevant` and pass the boolean into
 * TourDetail, which stamps it onto the checkout payload as `ijenRelevant`.
 *
 * The checkout surface then targets the mandatory Ijen health notice off the
 * carried boolean via `isIjenRelevantCheckout` — never a label substring.
 */

/** Stable Ijen detection: prefer destination route[]; fall back to name/slug. */
export function deriveIjenRelevant(
  name: string,
  slug: string | string[],
  route: string[] | undefined,
): boolean {
  if (route?.some((r) => /ijen/i.test(r))) return true;
  const slugStr = Array.isArray(slug) ? slug.join("/") : String(slug ?? "");
  return /ijen/i.test(name ?? "") || /ijen/i.test(slugStr);
}

/**
 * True iff a deserialized checkout payload is Ijen-relevant. Strict on the
 * explicit boolean the payload carries (no label guessing); null/malformed/
 * missing → false (fail closed, no crash).
 */
export function isIjenRelevantCheckout(payload: unknown): boolean {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as { ijenRelevant?: unknown }).ijenRelevant === true
  );
}
