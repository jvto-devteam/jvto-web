/**
 * Route reconciliation classifier (T02, 2026-09-07).
 *
 * Turns a difference between three independent observations into ONE named
 * classification per route. Pure: no I/O, no clock except an injected
 * generatedAt, so the whole table is provable over fixtures.
 *
 * WHY THREE SOURCES AND NOT TWO
 *
 * The 2026-09-05 drift audit compared sitemap.xml against route-output-index
 * directly. T01 showed that comparison is invalid — the two measure different
 * things. The tempting repair is "compare the T01 inventory to the sitemap",
 * and it is worse: measured 2026-09-07, all eight src/app/**\/sitemap.data.ts
 * read the SAME loaders the T01 validator reads, so for the 267 dynamic routes
 * that comparison is a tautology that cannot fail, and for the 38 static ones
 * T01's drift guard already covers it. A check that can only agree with itself
 * is this repo's dominant defect wearing a green tick.
 *
 * So the sitemap side must be observed from a running server (Rule 8), and the
 * three pairwise differences each answer a different question:
 *
 *   inventory ↔ sitemap   deployment/sync axis — is production caught up?
 *   inventory ↔ manifest  artifact-ownership axis — the real contract question
 *   sitemap  ↔ manifest   the 2026-09-05 comparison, now derived, never primary
 *
 * NO ROUTE LITERALS LIVE HERE. The T02 spec forbids `if (route === "...")`;
 * every exception is a row in PUBLIC_ROUTE_CONTRACT. This module never sees a
 * contract family, only the InventoryRoute shape T01 already carries, which
 * also keeps its tests immune to the contract growing.
 */
import type { ArtifactExpectation } from "./publicRouteContract";
import type { InventoryRoute } from "./buildPublicRouteInventory";
import { lookupRouteOutput, type RouteOutputIndex } from "./parseRouteOutputIndex";

export type ReconcileStatus = "PASS" | "WARN" | "FAIL";

export type Classification =
  | "EXPECTATION_UNDECLARED"
  | "UNDECLARED_PUBLISHED_ROUTE"
  | "UNDECLARED_ORPHAN_ROUTE"
  | "UNDECLARED_ARTIFACT_ONLY"
  | "UNEXPECTED_IN_SITEMAP"
  | "FAMILY_ABSENT_FROM_SITEMAP"
  | "SITEMAP_PUBLICATION_LAG"
  | "MISSING_FROM_SITEMAP"
  | "MISSING_SCHEMA_OUTPUT"
  | "UNEXPECTED_SCHEMA_OUTPUT"
  | "MISSING_WEBSITE_OUTPUT"
  | "UNEXPECTED_WEBSITE_OUTPUT"
  | "EXPECTED_ECOSYSTEM_OUTPUT"
  | "EXPECTED_WEB_OWNED_OUTPUT";

/**
 * The closed set, with the verdict each name carries and why it carries it.
 * Data, not branches — the reporter and the tests both read this rather than
 * repeating the mapping, so a name cannot be PASS in one place and FAIL in
 * another.
 */
export const CLASSIFICATIONS: Readonly<
  Record<Classification, Readonly<{ status: ReconcileStatus; reason: string }>>
> = {
  EXPECTATION_UNDECLARED: {
    status: "FAIL",
    reason:
      "the contract still says \"unconfirmed\", so no comparison happened — reporting one would be a lie about its cause",
  },
  UNDECLARED_PUBLISHED_ROUTE: {
    status: "FAIL",
    reason: "production publishes it and ekosistem generated for it; only this checkout omits it",
  },
  UNDECLARED_ORPHAN_ROUTE: {
    status: "FAIL",
    reason: "production publishes an indexable URL nothing declares and nothing generated",
  },
  UNDECLARED_ARTIFACT_ONLY: {
    status: "WARN",
    reason:
      "ekosistem generated artifacts for a route nobody publishes — wasted output, owned by T08, nothing indexable",
  },
  UNEXPECTED_IN_SITEMAP: {
    status: "FAIL",
    reason: "the contract says this route is not public, and production indexes it",
  },
  FAMILY_ABSENT_FROM_SITEMAP: {
    status: "FAIL",
    reason:
      "an entire contract family is missing from the sitemap — a broken sitemap.data.ts, not a per-record lag",
  },
  SITEMAP_PUBLICATION_LAG: {
    status: "WARN",
    reason:
      "this checkout and the ekosistem manifest both have it; only the deployed sitemap does not — a deployment state, not a repo defect",
  },
  MISSING_FROM_SITEMAP: {
    status: "FAIL",
    reason: "only the local contract believes this route exists",
  },
  MISSING_SCHEMA_OUTPUT: {
    status: "FAIL",
    reason: "the contract expects ekosistem to generate this route's schema; it did not",
  },
  UNEXPECTED_SCHEMA_OUTPUT: {
    status: "FAIL",
    reason: "two owners for one route's schema — the duplicate-JSON-LD shape T06/T07 exist to remove",
  },
  MISSING_WEBSITE_OUTPUT: {
    status: "FAIL",
    reason: "the contract expects ekosistem to generate this route's website output; it did not",
  },
  UNEXPECTED_WEBSITE_OUTPUT: {
    status: "FAIL",
    reason: "ekosistem generated website output the contract says it should not",
  },
  EXPECTED_ECOSYSTEM_OUTPUT: {
    status: "PASS",
    reason: "ekosistem owns this route's schema and produced it",
  },
  EXPECTED_WEB_OWNED_OUTPUT: {
    status: "PASS",
    reason: "jvto-web assembles this route's schema, so no ekosistem artifact is expected",
  },
};

export type RouteObservation = Readonly<{
  inSitemap: boolean;
  inRouteOutputIndex: boolean;
  hasSchemaOutput: boolean;
  hasWebsiteOutput: boolean;
}>;

export type ReconciledRoute = Readonly<{
  route: string;
  contractId: string | null;
  group: string | null;
  inPublicInventory: boolean;
  inSitemap: boolean;
  inRouteOutputIndex: boolean;
  hasSchemaOutput: boolean;
  hasWebsiteOutput: boolean;
  sitemapExpected: boolean | null;
  schemaOutputExpected: ArtifactExpectation | null;
  websiteOutputExpected: ArtifactExpectation | null;
  classification: Classification;
  status: ReconcileStatus;
  /** Every rule that fired, in precedence order. Empty on a PASS row. */
  failures: readonly Classification[];
}>;

export type ReconciliationReport = Readonly<{
  schemaVersion: "jvto/route-reconciliation/v1";
  generatedAt: string;
  counts: Readonly<{ total: number; pass: number; warn: number; fail: number }>;
  byClassification: Readonly<Partial<Record<Classification, number>>>;
  sitemapDuplicates: readonly string[];
  routes: readonly ReconciledRoute[];
}>;

const SEVERITY: Record<ReconcileStatus, number> = { PASS: 0, WARN: 1, FAIL: 2 };

/**
 * Classifies one route.
 *
 * `inventory` is null when the route is not declared. `familyFullyAbsent` is
 * the only family-scoped input and is why reconcileRoutes runs in two phases:
 * without it, a wholly broken sitemap section reports as N individual lag
 * warnings instead of one structural failure — a silent pass at scale.
 */
export function reconcileRoute(
  route: string,
  inventory: InventoryRoute | null,
  observed: RouteObservation,
  familyFullyAbsent: boolean,
): ReconciledRoute {
  const base = {
    route,
    inPublicInventory: inventory !== null,
    inSitemap: observed.inSitemap,
    inRouteOutputIndex: observed.inRouteOutputIndex,
    hasSchemaOutput: observed.hasSchemaOutput,
    hasWebsiteOutput: observed.hasWebsiteOutput,
  };

  // ── I = 0: undeclared. Three cells, partitioned by (S, M). ────────────────
  // (S=0, M=0) cannot occur: the universe is the union of the three sources, so
  // a route absent from all of them is never constructed. reconcileRoutes
  // refuses an empty union rather than printing "0 mismatches" over nothing.
  if (inventory === null) {
    const classification: Classification = observed.inSitemap
      ? observed.inRouteOutputIndex
        ? "UNDECLARED_PUBLISHED_ROUTE"
        : "UNDECLARED_ORPHAN_ROUTE"
      : "UNDECLARED_ARTIFACT_ONLY";
    return {
      ...base,
      contractId: null,
      group: null,
      sitemapExpected: null,
      schemaOutputExpected: null,
      websiteOutputExpected: null,
      classification,
      status: CLASSIFICATIONS[classification].status,
      failures: [classification],
    };
  }

  const declared = {
    contractId: inventory.contractId,
    group: inventory.group,
    sitemapExpected: inventory.sitemapExpected,
    schemaOutputExpected: inventory.schemaOutputExpected,
    websiteOutputExpected: inventory.websiteOutputExpected,
  };

  // ── Rule 1, highest precedence. ───────────────────────────────────────────
  // A comparison against "unconfirmed" is not a comparison. The spec's example
  // reconcileRoute does `expected !== observed`, which with "unconfirmed" on the
  // left emits a mismatch code that misstates its own cause; the obvious repair
  // (treat "unconfirmed" as always matching) turns it into a silent pass across
  // every undeclared family at once. Neither is acceptable, so it gets a name.
  if (
    inventory.schemaOutputExpected === "unconfirmed" ||
    inventory.websiteOutputExpected === "unconfirmed"
  ) {
    return {
      ...base,
      ...declared,
      classification: "EXPECTATION_UNDECLARED",
      status: CLASSIFICATIONS.EXPECTATION_UNDECLARED.status,
      failures: ["EXPECTATION_UNDECLARED"],
    };
  }

  const failures: Classification[] = [];

  // ── Sitemap axis. Publication is the highest-order fact, so it goes first. ─
  if (!inventory.sitemapExpected && observed.inSitemap) {
    failures.push("UNEXPECTED_IN_SITEMAP");
  } else if (inventory.sitemapExpected && !observed.inSitemap) {
    if (familyFullyAbsent) failures.push("FAMILY_ABSENT_FROM_SITEMAP");
    else if (observed.inRouteOutputIndex) failures.push("SITEMAP_PUBLICATION_LAG");
    else failures.push("MISSING_FROM_SITEMAP");
  }

  // ── Artifact axes. ────────────────────────────────────────────────────────
  if (inventory.schemaOutputExpected === true && !observed.hasSchemaOutput) {
    failures.push("MISSING_SCHEMA_OUTPUT");
  } else if (inventory.schemaOutputExpected === false && observed.hasSchemaOutput) {
    failures.push("UNEXPECTED_SCHEMA_OUTPUT");
  }

  if (inventory.websiteOutputExpected === true && !observed.hasWebsiteOutput) {
    failures.push("MISSING_WEBSITE_OUTPUT");
  } else if (inventory.websiteOutputExpected === false && observed.hasWebsiteOutput) {
    failures.push("UNEXPECTED_WEBSITE_OUTPUT");
  }

  if (failures.length === 0) {
    // Unconditional partition on the remaining axis, which is what makes this
    // function total by construction rather than by inspection.
    const classification: Classification =
      inventory.schemaOutputExpected === true
        ? "EXPECTED_ECOSYSTEM_OUTPUT"
        : "EXPECTED_WEB_OWNED_OUTPUT";
    return {
      ...base,
      ...declared,
      classification,
      status: CLASSIFICATIONS[classification].status,
      failures: [],
    };
  }

  // The row's status is the worst thing that fired, and its name is the first
  // failure carrying that status. A route that is BOTH a publication lag (WARN)
  // and a missing artifact (FAIL) must not be labelled a lag — that would file
  // a production defect under a deployment excuse.
  const status = failures.reduce<ReconcileStatus>(
    (worst, f) =>
      SEVERITY[CLASSIFICATIONS[f].status] > SEVERITY[worst] ? CLASSIFICATIONS[f].status : worst,
    "PASS",
  );
  const classification = failures.find((f) => CLASSIFICATIONS[f].status === status)!;

  return { ...base, ...declared, classification, status, failures };
}

export function reconcileRoutes(params: {
  inventory: readonly InventoryRoute[];
  sitemapRoutes: readonly string[];
  routeOutputIndex: RouteOutputIndex;
  generatedAt: string;
  sitemapDuplicates?: readonly string[];
}): ReconciliationReport {
  const { inventory, sitemapRoutes, routeOutputIndex, generatedAt } = params;

  const declaredByRoute = new Map(inventory.map((r) => [r.route, r]));
  const sitemapSet = new Set(sitemapRoutes);

  const universe = new Set<string>([
    ...declaredByRoute.keys(),
    ...sitemapSet,
    ...routeOutputIndex.keys(),
  ]);
  if (universe.size === 0) {
    throw new Error(
      "reconcileRoutes: all three sources are empty — refusing to report zero mismatches over nothing",
    );
  }

  // Phase 1: which families are wholly absent from the sitemap. Computed over
  // the DECLARED routes of each family, so a family that grew in this checkout
  // but has not deployed yet is judged as a whole rather than record by record.
  const familyTotals = new Map<string, { total: number; absent: number }>();
  for (const row of inventory) {
    const agg = familyTotals.get(row.contractId) ?? { total: 0, absent: 0 };
    agg.total += 1;
    if (!sitemapSet.has(row.route)) agg.absent += 1;
    familyTotals.set(row.contractId, agg);
  }

  // Phase 2.
  const routes = [...universe].sort().map((route) => {
    const declared = declaredByRoute.get(route) ?? null;
    const output = lookupRouteOutput(routeOutputIndex, route);
    const agg = declared ? familyTotals.get(declared.contractId) : undefined;
    const familyFullyAbsent = agg !== undefined && agg.total > 0 && agg.absent === agg.total;
    return reconcileRoute(
      route,
      declared,
      {
        inSitemap: sitemapSet.has(route),
        inRouteOutputIndex: output.present,
        hasSchemaOutput: output.hasSchemaOutput,
        hasWebsiteOutput: output.hasWebsiteOutput,
      },
      familyFullyAbsent,
    );
  });

  const counts = { total: routes.length, pass: 0, warn: 0, fail: 0 };
  const byClassification: Partial<Record<Classification, number>> = {};
  for (const row of routes) {
    if (row.status === "PASS") counts.pass += 1;
    else if (row.status === "WARN") counts.warn += 1;
    else counts.fail += 1;
    byClassification[row.classification] = (byClassification[row.classification] ?? 0) + 1;
  }

  return {
    schemaVersion: "jvto/route-reconciliation/v1",
    generatedAt,
    counts,
    byClassification,
    sitemapDuplicates: params.sitemapDuplicates ?? [],
    routes,
  };
}

/** Human-readable summary block. Kept pure so its shape is unit-testable. */
export function summarizeReconciliation(report: ReconciliationReport): string {
  const lines = [
    `routes reconciled: ${report.counts.total}`,
    `  pass: ${report.counts.pass}  warn: ${report.counts.warn}  fail: ${report.counts.fail}`,
  ];
  const names = Object.keys(report.byClassification).sort() as Classification[];
  for (const name of names) {
    lines.push(
      `  ${CLASSIFICATIONS[name].status.padEnd(4)} ${name} × ${report.byClassification[name]}`,
    );
  }
  if (report.sitemapDuplicates.length > 0) {
    lines.push(`  duplicate <loc> in sitemap: ${report.sitemapDuplicates.join(", ")}`);
  }
  return lines.join("\n");
}
