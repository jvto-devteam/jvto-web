/**
 * Reader for jvto-ekosistem's route-output-index.json (T02, 2026-09-07).
 *
 * Takes an already-parsed JSON VALUE, not a path. That one choice is what lets
 * every integrity test below run without a fixture file, and what makes the
 * "a route absent from the manifest cannot claim an artifact" rule structural
 * instead of asserted: callers never receive a shape they could misread.
 *
 * The manifest is produced by a different repo on a different schedule. It is
 * therefore untrusted input, and validated totally rather than duck-typed. The
 * specific reason: when the sibling ekosistem checkout is missing, the reader
 * layer's review and blog loaders return EMPTY rather than throwing
 * (src/lib/ecosystemContent/reviews.ts:112, website.ts:405). A new reader gets
 * no exception for free, so every malformed shape here throws.
 *
 * Measured 2026-09-07 against the live manifest: 299 entries, 299 schemaOutput,
 * 51 websiteOutput, zero duplicates, zero unnormalized routes. The guards below
 * fire on none of it today — which is precisely why they must exist before the
 * first entry that would trip them, not after.
 */
import { normalizeRoute } from "./normalizeRoute";

export type RouteOutputEntry = Readonly<{
  route: string;
  /** Repo-relative path, or null when the manifest omits the key entirely. */
  schemaOutput: string | null;
  websiteOutput: string | null;
}>;

export type RouteOutputIndex = ReadonlyMap<string, RouteOutputEntry>;

export type RouteOutputLookup = Readonly<{
  present: boolean;
  hasSchemaOutput: boolean;
  hasWebsiteOutput: boolean;
}>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * An artifact path is present only as a non-empty string. Absent and null both
 * mean "not generated" — measured 2026-09-07, 248 of 299 entries OMIT
 * websiteOutput rather than nulling it, so absence is the normal case.
 *
 * Anything else throws. A truthy non-string (a number, `true`, an object) would
 * otherwise coerce to "the artifact exists" and turn a malformed manifest into
 * a clean PASS — the textbook shape of this repo's dominant defect.
 */
function readArtifactPath(
  entry: Record<string, unknown>,
  field: "schemaOutput" | "websiteOutput",
  route: string,
): string | null {
  const value = entry[field];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    throw new Error(
      `parseRouteOutputIndex: ${field} for ${route} must be a string or absent, got ${typeof value}`,
    );
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function parseRouteOutputIndex(value: unknown): RouteOutputIndex {
  if (!isPlainObject(value)) {
    throw new Error(
      `parseRouteOutputIndex: expected an object with a routes array, got ${
        Array.isArray(value) ? "array" : typeof value
      }`,
    );
  }
  const rawRoutes = value.routes;
  if (!Array.isArray(rawRoutes)) {
    throw new Error(
      "parseRouteOutputIndex: expected an object with a routes array — the manifest shape is {generated_at, routes[]}",
    );
  }

  const index = new Map<string, RouteOutputEntry>();

  for (const [position, raw] of rawRoutes.entries()) {
    if (!isPlainObject(raw)) {
      throw new Error(
        `parseRouteOutputIndex: entry at index ${position} is not an object`,
      );
    }

    const route = raw.route;
    if (typeof route !== "string" || route.trim() === "") {
      throw new Error(
        `parseRouteOutputIndex: entry at index ${position} has no usable route`,
      );
    }

    // A single unnormalized route on either side fails to join and fabricates
    // TWO symmetric phantom findings from one drift — an artifact nobody
    // publishes, plus a missing artifact — neither of which looks like a join
    // bug. Refusing is the only outcome that names the real cause.
    if (normalizeRoute(route) !== route) {
      throw new Error(
        `parseRouteOutputIndex: route ${JSON.stringify(route)} is not normalized (expected ${JSON.stringify(
          normalizeRoute(route),
        )})`,
      );
    }

    if (index.has(route)) {
      // Building a Map without this check silently keeps the last write.
      throw new Error(`parseRouteOutputIndex: duplicate route ${route}`);
    }

    index.set(route, {
      route,
      schemaOutput: readArtifactPath(raw, "schemaOutput", route),
      websiteOutput: readArtifactPath(raw, "websiteOutput", route),
    });
  }

  return index;
}

/**
 * The only way to ask about a route. A miss returns all-false, so the
 * combination "not in the manifest but has an artifact" is unconstructible
 * rather than merely untested.
 */
export function lookupRouteOutput(
  index: RouteOutputIndex,
  route: string,
): RouteOutputLookup {
  const entry = index.get(route);
  if (!entry) return { present: false, hasSchemaOutput: false, hasWebsiteOutput: false };
  return {
    present: true,
    hasSchemaOutput: entry.schemaOutput !== null,
    hasWebsiteOutput: entry.websiteOutput !== null,
  };
}
