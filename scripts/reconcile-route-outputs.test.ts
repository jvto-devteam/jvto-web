/**
 * Tests for the route reconciliation validator (T02, 2026-09-07).
 *
 * Runner is node:test with node:assert/strict — no jest, no vitest. Adding a
 * test dependency needs written approval per .claude/rules/GLOBAL-CONSTRAINTS.md.
 *
 * Run with `npm run test:reconcile`, never bare `node --test`: the src imports
 * below only resolve with --import ./scripts/lib/register-ts-hook.mjs.
 *
 * Imports carry NO file extension — this is a .ts file inside tsconfig's
 * include (**\/*.ts covers scripts/), so an explicit ".ts" fails TS5097. The
 * sibling .mjs script is the opposite and must keep its extension. Both are
 * correct; see docs/audit/VERIFIED_FACTS.md § import-extension asymmetry.
 *
 * Half of this file tests failure paths. That is deliberate: a validator that
 * has never been seen to fail is a validator nobody has verified, and every
 * guard here exists because its absence produces a GREEN run over broken or
 * missing input — the failure mode this repo keeps rediscovering.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSitemapUrls } from "../src/lib/routes/parseSitemapUrls";
import {
  parseRouteOutputIndex,
  lookupRouteOutput,
} from "../src/lib/routes/parseRouteOutputIndex";
import {
  CLASSIFICATIONS,
  reconcileRoute,
  reconcileRoutes,
  type Classification,
  type ReconcileStatus,
  type RouteObservation,
} from "../src/lib/routes/reconcileRoutes";
import {
  reconciliationToCsv,
  RECONCILIATION_CSV_COLUMNS,
} from "../src/lib/routes/reconciliationToCsv";
import type { InventoryRoute } from "../src/lib/routes/buildPublicRouteInventory";
import type { ArtifactExpectation } from "../src/lib/routes/publicRouteContract";

const ORIGIN = "https://javavolcano-touroperator.com";

/** Wraps loc values in the smallest well-formed urlset the parser must accept. */
function sitemapXml(locs: readonly string[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...locs.map((l) => `<url><loc>${l}</loc><lastmod>2026-09-07</lastmod></url>`),
    "</urlset>",
  ].join("\n");
}

/** Minimal valid manifest; individual tests corrupt one thing at a time. */
function manifest(routes: readonly unknown[]): unknown {
  return { generated_at: "2026-09-07T00:00:00.000Z", routes };
}

// ── parseSitemapUrls ────────────────────────────────────────────────────────

test("sitemap: extracts and normalizes loc values", () => {
  const out = parseSitemapUrls(
    sitemapXml([ORIGIN, `${ORIGIN}/why-jvto`, `${ORIGIN}/travel-guide/faq`]),
    { expectOrigin: ORIGIN },
  );
  assert.deepEqual(out.routes, ["/", "/why-jvto", "/travel-guide/faq"]);
  assert.deepEqual(out.duplicates, []);
});

test("sitemap: bare origin with no path is the homepage, not an empty route", () => {
  // url("/") in src/lib/site.ts returns BASE_URL with no trailing slash, so the
  // homepage <loc> genuinely has no path. Reading that as "" would drop the
  // homepage from the comparison entirely and look like a clean run.
  const out = parseSitemapUrls(sitemapXml([ORIGIN]), { expectOrigin: ORIGIN });
  assert.deepEqual(out.routes, ["/"]);
});

test("sitemap: a trailing slash normalizes to the same route", () => {
  const out = parseSitemapUrls(sitemapXml([`${ORIGIN}/why-jvto/`]), {
    expectOrigin: ORIGIN,
  });
  assert.deepEqual(out.routes, ["/why-jvto"]);
});

test("sitemap: zero <loc> throws, never returns an empty list", () => {
  // The dangerous direction. An empty list makes every inventory route look
  // absent from the sitemap; worse, with no union guard it prints "0 mismatches".
  assert.throws(() => parseSitemapUrls(sitemapXml([]), { expectOrigin: ORIGIN }), {
    message: /zero <loc>/i,
  });
  assert.throws(() => parseSitemapUrls("", { expectOrigin: ORIGIN }), {
    message: /zero <loc>/i,
  });
  assert.throws(() => parseSitemapUrls("<html>not a sitemap</html>", { expectOrigin: ORIGIN }), {
    message: /zero <loc>/i,
  });
});

test("sitemap: a <loc> from a different origin throws", () => {
  // verify-live.mjs does NOT check this. A staging sitemap joins on pathname and
  // the whole run reads green against the wrong site — a real gap, not a copy.
  assert.throws(
    () =>
      parseSitemapUrls(sitemapXml([`${ORIGIN}/a`, "https://staging.example.com/b"]), {
        expectOrigin: ORIGIN,
      }),
    { message: /origin/i },
  );
});

test("sitemap: duplicates are reported, not silently deduped", () => {
  // A repeated <url> in production is itself a finding. T01's adversarial review
  // already caught a Set erasing exactly this class of evidence.
  const out = parseSitemapUrls(
    sitemapXml([`${ORIGIN}/why-jvto`, `${ORIGIN}/why-jvto`, `${ORIGIN}/blog`]),
    { expectOrigin: ORIGIN },
  );
  assert.deepEqual(out.duplicates, ["/why-jvto"]);
  assert.deepEqual(out.routes, ["/why-jvto", "/blog"]);
});

test("sitemap: a malformed <loc> throws rather than being skipped", () => {
  // Skipping an unparsable entry means it never enters the comparison, and a
  // route missing from both sides reads as agreement.
  assert.throws(
    () => parseSitemapUrls(sitemapXml([`${ORIGIN}/ok`, "not-a-url"]), { expectOrigin: ORIGIN }),
    { message: /loc/i },
  );
});

test("sitemap: expectOrigin itself is validated", () => {
  assert.throws(() => parseSitemapUrls(sitemapXml([ORIGIN]), { expectOrigin: "" }), {
    message: /origin/i,
  });
});

// ── parseRouteOutputIndex ───────────────────────────────────────────────────

const GOOD_ENTRY = {
  route: "/why-jvto/reviews/333",
  domain: "why-jvto",
  slug: "reviews/333",
  schemaOutput: "5-experience-engine/json-ld/pages/why-jvto__reviews__333.schema-output.json",
};

test("manifest: reads a well-formed index", () => {
  const idx = parseRouteOutputIndex(manifest([GOOD_ENTRY]));
  assert.equal(idx.size, 1);
  const hit = lookupRouteOutput(idx, "/why-jvto/reviews/333");
  assert.deepEqual(hit, { present: true, hasSchemaOutput: true, hasWebsiteOutput: false });
});

test("manifest: a miss can never claim an artifact — the impossible cell is structural", () => {
  // M=0 must imply SO=0 and WO=0. This is enforced by construction rather than
  // asserted downstream: the caller is never handed a shape it could get wrong.
  const idx = parseRouteOutputIndex(manifest([GOOD_ENTRY]));
  assert.deepEqual(lookupRouteOutput(idx, "/nowhere"), {
    present: false,
    hasSchemaOutput: false,
    hasWebsiteOutput: false,
  });
});

test("manifest: websiteOutput is an ABSENT key, and truthiness is not enough", () => {
  // Measured 2026-09-07: 248 of 299 entries omit the key entirely rather than
  // setting null. A truthy non-string coercing to "the artifact exists" is the
  // textbook silent pass, so anything that is not a string and not absent throws.
  const withEmpty = parseRouteOutputIndex(
    manifest([{ ...GOOD_ENTRY, websiteOutput: "" }]),
  );
  assert.equal(lookupRouteOutput(withEmpty, GOOD_ENTRY.route).hasWebsiteOutput, false);

  const withBlank = parseRouteOutputIndex(
    manifest([{ ...GOOD_ENTRY, websiteOutput: "   " }]),
  );
  assert.equal(lookupRouteOutput(withBlank, GOOD_ENTRY.route).hasWebsiteOutput, false);

  const withNull = parseRouteOutputIndex(
    manifest([{ ...GOOD_ENTRY, websiteOutput: null }]),
  );
  assert.equal(lookupRouteOutput(withNull, GOOD_ENTRY.route).hasWebsiteOutput, false);

  const withPath = parseRouteOutputIndex(
    manifest([{ ...GOOD_ENTRY, websiteOutput: "a/b.website-output.json" }]),
  );
  assert.equal(lookupRouteOutput(withPath, GOOD_ENTRY.route).hasWebsiteOutput, true);

  for (const bad of [123, true, {}, []]) {
    assert.throws(
      () => parseRouteOutputIndex(manifest([{ ...GOOD_ENTRY, websiteOutput: bad }])),
      { message: /websiteOutput/i },
      `websiteOutput: ${JSON.stringify(bad)} must throw, not coerce`,
    );
  }
});

test("manifest: structurally invalid input throws instead of reading as empty", () => {
  // When the sibling ekosistem repo is absent the review and blog readers return
  // empty rather than throwing, so a new reader gets no exception for free.
  for (const bad of [null, undefined, 42, "x", [], {}, { routes: "x" }, { routes: {} }]) {
    assert.throws(
      () => parseRouteOutputIndex(bad),
      `input ${JSON.stringify(bad)} must throw`,
    );
  }
});

test("manifest: an entry with a missing or empty route throws", () => {
  // A skipped entry is invisible: it silently shrinks the comparand.
  assert.throws(() => parseRouteOutputIndex(manifest([null])), { message: /entry/i });
  assert.throws(() => parseRouteOutputIndex(manifest([{ domain: "x" }])), { message: /route/i });
  assert.throws(() => parseRouteOutputIndex(manifest([{ route: "" }])), { message: /route/i });
  assert.throws(() => parseRouteOutputIndex(manifest([{ route: 7 }])), { message: /route/i });
});

test("manifest: an unnormalized route throws — the double-phantom guard", () => {
  // The nastiest mode. One unnormalized route on either side fails to join and
  // fabricates TWO symmetric findings from a single drift: the manifest side
  // reports an artifact nobody publishes, and the inventory side reports a
  // missing artifact. Both are phantoms; neither looks like a join bug.
  assert.throws(() => parseRouteOutputIndex(manifest([{ ...GOOD_ENTRY, route: "/Why-JVTO" }])), {
    message: /normalized/i,
  });
  assert.throws(() => parseRouteOutputIndex(manifest([{ ...GOOD_ENTRY, route: "why-jvto" }])), {
    message: /normalized/i,
  });
  assert.throws(() => parseRouteOutputIndex(manifest([{ ...GOOD_ENTRY, route: "/why-jvto/" }])), {
    message: /normalized/i,
  });
});

test("manifest: a duplicate route throws instead of last-write-wins", () => {
  // Building a Map silently keeps the last entry. Measured 2026-09-07: zero
  // duplicates today — which is exactly why nobody would notice the first one.
  assert.throws(() => parseRouteOutputIndex(manifest([GOOD_ENTRY, GOOD_ENTRY])), {
    message: /duplicate/i,
  });
});

test("manifest: schemaOutput obeys the same string rule as websiteOutput", () => {
  assert.throws(() => parseRouteOutputIndex(manifest([{ route: "/a", schemaOutput: 1 }])), {
    message: /schemaOutput/i,
  });
  const idx = parseRouteOutputIndex(manifest([{ route: "/a" }]));
  assert.equal(lookupRouteOutput(idx, "/a").hasSchemaOutput, false);
});

// ── classifier: exhaustiveness over the observation cube ────────────────────

const ALL_NAMES = Object.keys(CLASSIFICATIONS) as Classification[];

function declared(
  overrides: Partial<InventoryRoute> = {},
): InventoryRoute {
  return {
    route: "/fixture",
    group: "fixture",
    contractId: "fixture-family",
    sitemapExpected: true,
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    sourceRecord: null,
    ...overrides,
  };
}

function observe(overrides: Partial<RouteObservation> = {}): RouteObservation {
  return {
    inSitemap: true,
    inRouteOutputIndex: true,
    hasSchemaOutput: true,
    hasWebsiteOutput: true,
    ...overrides,
  };
}

type Cell = Readonly<{
  inventory: InventoryRoute | null;
  observed: RouteObservation;
  familyFullyAbsent: boolean;
}>;

/**
 * Every reachable combination of the observation cube.
 *
 * Membership is (I, S, M, SO, WO) constrained by M=0 ⟹ SO=WO=0, because SO and
 * WO are read FROM the manifest entry — no entry, no key. (I=0, S=0, M=0) is
 * excluded: the universe is the union of the three sources, so such a route is
 * never constructed at all.
 *
 * I=0 rows carry no declarations (9 cells). I=1 rows multiply by
 * sitemapExpected {T,F} and the two expectations {T,F,U} (10 × 2 × 3 × 3 = 180),
 * and the familyFullyAbsent split applies only where sitemapExpected=T ∧ S=0
 * (5 membership combos × 9 expectation combos = 45 cells that split in two).
 *
 * 9 + 180 + 45 = 234. The count is asserted so that widening the cube breaks
 * this test loudly instead of quietly shrinking the proof.
 */
function enumerateCube(): Cell[] {
  const cells: Cell[] = [];
  const bools = [false, true];
  const expectations: ArtifactExpectation[] = [true, false, "unconfirmed"];

  const membership: Array<{ S: boolean; M: boolean; SO: boolean; WO: boolean }> = [];
  for (const S of bools) {
    for (const M of bools) {
      if (M) {
        for (const SO of bools) for (const WO of bools) membership.push({ S, M, SO, WO });
      } else {
        membership.push({ S, M, SO: false, WO: false });
      }
    }
  }

  for (const m of membership) {
    const observed = observe({
      inSitemap: m.S,
      inRouteOutputIndex: m.M,
      hasSchemaOutput: m.SO,
      hasWebsiteOutput: m.WO,
    });

    // I = 0. (S=0, M=0) is out of domain, not merely untested.
    if (m.S || m.M) cells.push({ inventory: null, observed, familyFullyAbsent: false });

    // I = 1.
    for (const sitemapExpected of bools) {
      for (const schemaOutputExpected of expectations) {
        for (const websiteOutputExpected of expectations) {
          const inventory = declared({
            sitemapExpected,
            schemaOutputExpected,
            websiteOutputExpected,
          });
          const splits = sitemapExpected && !m.S ? bools : [false];
          for (const familyFullyAbsent of splits) {
            cells.push({ inventory, observed, familyFullyAbsent });
          }
        }
      }
    }
  }
  return cells;
}

test("classifier: every name carries exactly one status", () => {
  for (const name of ALL_NAMES) {
    const status: ReconcileStatus = CLASSIFICATIONS[name].status;
    assert.ok(["PASS", "WARN", "FAIL"].includes(status), `${name} has status ${status}`);
    assert.ok(CLASSIFICATIONS[name].reason.length > 0, `${name} has no recorded reason`);
  }
});

test("classifier: total function over all 234 reachable cells", () => {
  const cells = enumerateCube();
  assert.equal(cells.length, 234, "the reachable cube changed size — update the proof, not the number");

  for (const cell of cells) {
    const row = reconcileRoute("/fixture", cell.inventory, cell.observed, cell.familyFullyAbsent);
    assert.ok(
      ALL_NAMES.includes(row.classification),
      `unknown classification ${row.classification}`,
    );
    // The row's own status must match the name it reports, and the name must be
    // one of the rules that actually fired. Both invariants together are what
    // stop a row from being filed under a milder name than it earned.
    assert.equal(CLASSIFICATIONS[row.classification].status, row.status);
    if (row.failures.length > 0) {
      assert.ok(row.failures.includes(row.classification));
      const worst = row.failures
        .map((f) => CLASSIFICATIONS[f].status)
        .reduce((a, b) => (["PASS", "WARN", "FAIL"].indexOf(b) > ["PASS", "WARN", "FAIL"].indexOf(a) ? b : a));
      assert.equal(row.status, worst, "status must be the worst rule that fired");
    } else {
      assert.equal(row.status, "PASS");
    }
  }
});

test("classifier: no dead rule — every name is produced by some cell", () => {
  const produced = new Set(
    enumerateCube().map(
      (c) => reconcileRoute("/fixture", c.inventory, c.observed, c.familyFullyAbsent).classification,
    ),
  );
  const dead = ALL_NAMES.filter((n) => !produced.has(n));
  assert.deepEqual(dead, [], `names no cell can produce: ${dead.join(", ")}`);
});

// ── classifier: one fixture per name ────────────────────────────────────────

test("EXPECTED_WEB_OWNED_OUTPUT: the /destinations/mount-bromo shape", () => {
  // Verbatim reproduction of the T02 spec's first example: declared, published,
  // no ekosistem artifacts, both expectations false.
  const row = reconcileRoute(
    "/destinations/mount-bromo",
    declared({ schemaOutputExpected: false, websiteOutputExpected: false }),
    observe({ inRouteOutputIndex: false, hasSchemaOutput: false, hasWebsiteOutput: false }),
    false,
  );
  assert.equal(row.classification, "EXPECTED_WEB_OWNED_OUTPUT");
  assert.equal(row.status, "PASS");
  assert.deepEqual(row.failures, []);
});

test("SITEMAP_PUBLICATION_LAG: the /why-jvto/reviews/333 shape is a WARN", () => {
  // Deviates from the spec example, which marks this FAIL. Measured 2026-09-07:
  // this checkout and the ekosistem manifest both have 333/334/335; only the
  // deployed sitemap lacks them. Two producers agreeing against one deployment
  // state is a deployment dependency (Rule 7), and a gate that goes red after
  // every ekosistem sync gets ignored — worse than no gate. --fail-on-warn is
  // the zero-tolerance path.
  const row = reconcileRoute(
    "/why-jvto/reviews/333",
    declared({ websiteOutputExpected: false }),
    observe({ inSitemap: false, hasWebsiteOutput: false }),
    false,
  );
  assert.equal(row.classification, "SITEMAP_PUBLICATION_LAG");
  assert.equal(row.status, "WARN");
});

test("FAMILY_ABSENT_FROM_SITEMAP: the same shape, whole family gone, is a FAIL", () => {
  // The test that proves the lag WARN is not a mass silent pass. If the review
  // section of sitemap.data.ts broke, 231 routes would otherwise report as 231
  // lag warnings and the run would still exit 0.
  const row = reconcileRoute(
    "/why-jvto/reviews/333",
    declared({ websiteOutputExpected: false }),
    observe({ inSitemap: false, hasWebsiteOutput: false }),
    true,
  );
  assert.equal(row.classification, "FAMILY_ABSENT_FROM_SITEMAP");
  assert.equal(row.status, "FAIL");
});

test("EXPECTATION_UNDECLARED: 'unconfirmed' is neither a match nor an artifact mismatch", () => {
  const row = reconcileRoute(
    "/fixture",
    declared({ schemaOutputExpected: "unconfirmed" }),
    observe({ hasSchemaOutput: false }),
    false,
  );
  assert.equal(row.classification, "EXPECTATION_UNDECLARED");
  assert.equal(row.status, "FAIL");
  // The misleading code the spec's naive `expected !== observed` would emit.
  assert.ok(!row.failures.includes("MISSING_SCHEMA_OUTPUT"));
});

test("MISSING_FROM_SITEMAP: only the local contract believes in it", () => {
  const row = reconcileRoute(
    "/fixture",
    declared({ schemaOutputExpected: false, websiteOutputExpected: false }),
    observe({ inSitemap: false, inRouteOutputIndex: false, hasSchemaOutput: false, hasWebsiteOutput: false }),
    false,
  );
  assert.equal(row.classification, "MISSING_FROM_SITEMAP");
  assert.equal(row.status, "FAIL");
});

test("UNEXPECTED_IN_SITEMAP: unreachable in the real contract, so fixture-only", () => {
  const row = reconcileRoute("/fixture", declared({ sitemapExpected: false }), observe(), false);
  assert.equal(row.classification, "UNEXPECTED_IN_SITEMAP");
  assert.equal(row.status, "FAIL");
});

test("undeclared routes: three cells, three different diagnoses", () => {
  const published = reconcileRoute("/x", null, observe(), false);
  assert.equal(published.classification, "UNDECLARED_PUBLISHED_ROUTE");
  assert.equal(published.status, "FAIL");

  const orphan = reconcileRoute(
    "/x",
    null,
    observe({ inRouteOutputIndex: false, hasSchemaOutput: false, hasWebsiteOutput: false }),
    false,
  );
  assert.equal(orphan.classification, "UNDECLARED_ORPHAN_ROUTE");
  assert.equal(orphan.status, "FAIL");

  const artifactOnly = reconcileRoute("/x", null, observe({ inSitemap: false }), false);
  assert.equal(artifactOnly.classification, "UNDECLARED_ARTIFACT_ONLY");
  assert.equal(artifactOnly.status, "WARN");

  for (const row of [published, orphan, artifactOnly]) {
    assert.equal(row.contractId, null);
    assert.equal(row.sitemapExpected, null);
  }
});

test("artifact axes: the four mismatch names", () => {
  const missingSchema = reconcileRoute(
    "/x",
    declared({ websiteOutputExpected: false }),
    observe({ hasSchemaOutput: false, hasWebsiteOutput: false }),
    false,
  );
  assert.equal(missingSchema.classification, "MISSING_SCHEMA_OUTPUT");

  const unexpectedSchema = reconcileRoute(
    "/x",
    declared({ schemaOutputExpected: false, websiteOutputExpected: false }),
    observe({ hasWebsiteOutput: false }),
    false,
  );
  assert.equal(unexpectedSchema.classification, "UNEXPECTED_SCHEMA_OUTPUT");

  const missingWebsite = reconcileRoute("/x", declared(), observe({ hasWebsiteOutput: false }), false);
  assert.equal(missingWebsite.classification, "MISSING_WEBSITE_OUTPUT");

  const unexpectedWebsite = reconcileRoute(
    "/x",
    declared({ websiteOutputExpected: false }),
    observe(),
    false,
  );
  assert.equal(unexpectedWebsite.classification, "UNEXPECTED_WEBSITE_OUTPUT");

  const normal = reconcileRoute("/x", declared(), observe(), false);
  assert.equal(normal.classification, "EXPECTED_ECOSYSTEM_OUTPUT");
  assert.equal(normal.status, "PASS");
});

test("multiple failures: the primary name must not hide the second finding", () => {
  const row = reconcileRoute(
    "/x",
    declared({ schemaOutputExpected: false, websiteOutputExpected: true }),
    observe({ hasSchemaOutput: true, hasWebsiteOutput: false }),
    false,
  );
  assert.deepEqual(row.failures, ["UNEXPECTED_SCHEMA_OUTPUT", "MISSING_WEBSITE_OUTPUT"]);
  assert.equal(row.status, "FAIL");
});

test("a WARN row that also earns a FAIL is filed under the FAIL", () => {
  // A publication lag alongside a real artifact defect must not be excused as a
  // deployment state — that would file a production defect under a lag.
  const row = reconcileRoute(
    "/x",
    declared({ schemaOutputExpected: false, websiteOutputExpected: false }),
    observe({ inSitemap: false, hasWebsiteOutput: false }),
    false,
  );
  assert.ok(row.failures.includes("SITEMAP_PUBLICATION_LAG"));
  assert.ok(row.failures.includes("UNEXPECTED_SCHEMA_OUTPUT"));
  assert.equal(row.classification, "UNEXPECTED_SCHEMA_OUTPUT");
  assert.equal(row.status, "FAIL");
});

// ── reconcileRoutes: report-level guards ────────────────────────────────────

const AT = "2026-09-07T00:00:00.000Z";

test("report: refuses an empty union rather than reporting zero mismatches", () => {
  assert.throws(
    () =>
      reconcileRoutes({
        inventory: [],
        sitemapRoutes: [],
        routeOutputIndex: parseRouteOutputIndex(manifest([])),
        generatedAt: AT,
      }),
    { message: /empty/i },
  );
});

test("report: counts sum to the size of the union", () => {
  // An arithmetic identity that catches the whole class of "a route was
  // silently dropped from the report".
  const report = reconcileRoutes({
    inventory: [
      declared({ route: "/a", contractId: "f1" }),
      declared({ route: "/b", contractId: "f1" }),
    ],
    sitemapRoutes: ["/a", "/b", "/c"],
    routeOutputIndex: parseRouteOutputIndex(
      manifest([
        { route: "/a", schemaOutput: "s", websiteOutput: "w" },
        { route: "/b", schemaOutput: "s", websiteOutput: "w" },
        { route: "/d", schemaOutput: "s" },
      ]),
    ),
    generatedAt: AT,
  });

  assert.equal(report.counts.total, 4); // /a /b /c /d
  assert.equal(
    report.counts.pass + report.counts.warn + report.counts.fail,
    report.counts.total,
  );
  assert.ok(report.routes.every((r) => r.classification));
  const summed = Object.values(report.byClassification).reduce((a, b) => a + b, 0);
  assert.equal(summed, report.counts.total);
});

test("report: familyFullyAbsent is computed per family, not globally", () => {
  // /a present, /b absent, same family → /b is a lag, not a family failure.
  const report = reconcileRoutes({
    inventory: [
      declared({ route: "/a", contractId: "f1", websiteOutputExpected: false }),
      declared({ route: "/b", contractId: "f1", websiteOutputExpected: false }),
      declared({ route: "/c", contractId: "f2", websiteOutputExpected: false }),
    ],
    sitemapRoutes: ["/a"],
    routeOutputIndex: parseRouteOutputIndex(
      manifest([
        { route: "/a", schemaOutput: "s" },
        { route: "/b", schemaOutput: "s" },
        { route: "/c", schemaOutput: "s" },
      ]),
    ),
    generatedAt: AT,
  });
  const byRoute = new Map(report.routes.map((r) => [r.route, r]));
  assert.equal(byRoute.get("/b")!.classification, "SITEMAP_PUBLICATION_LAG");
  // f2 has exactly one declared route and it is absent → the whole family is.
  assert.equal(byRoute.get("/c")!.classification, "FAMILY_ABSENT_FROM_SITEMAP");
});

// ── CSV ─────────────────────────────────────────────────────────────────────

test("csv: header and every row have the same column count", () => {
  const report = reconcileRoutes({
    inventory: [declared({ route: "/a", contractId: "f1" })],
    sitemapRoutes: ["/a", "/b"],
    routeOutputIndex: parseRouteOutputIndex(
      manifest([{ route: "/a", schemaOutput: "s", websiteOutput: "w" }]),
    ),
    generatedAt: AT,
  });
  const lines = reconciliationToCsv(report).trimEnd().split("\r\n");
  assert.equal(lines[0], RECONCILIATION_CSV_COLUMNS.map((c) => `"${c}"`).join(","));
  for (const line of lines) {
    assert.equal(
      line.split('","').length,
      RECONCILIATION_CSV_COLUMNS.length,
      `column count drifted on: ${line}`,
    );
  }
});

test("csv: a field containing a comma, a quote and a newline survives quoting", () => {
  // Synthesised directly rather than routed through reconcileRoutes — no real
  // route can hold these today, and the point is that the serializer is correct
  // before one can.
  const hostile = {
    schemaVersion: "jvto/route-reconciliation/v1",
    generatedAt: AT,
    counts: { total: 1, pass: 1, warn: 0, fail: 0 },
    byClassification: { EXPECTED_ECOSYSTEM_OUTPUT: 1 },
    sitemapDuplicates: [],
    routes: [
      {
        route: '/a,b"c\nd',
        contractId: "f1",
        group: "g,1",
        inPublicInventory: true,
        inSitemap: true,
        inRouteOutputIndex: true,
        hasSchemaOutput: true,
        hasWebsiteOutput: true,
        sitemapExpected: true,
        schemaOutputExpected: true as ArtifactExpectation,
        websiteOutputExpected: true as ArtifactExpectation,
        classification: "EXPECTED_ECOSYSTEM_OUTPUT" as Classification,
        status: "PASS" as ReconcileStatus,
        failures: [],
      },
    ],
  } as const;

  const csv = reconciliationToCsv(hostile);
  assert.ok(csv.includes('"/a,b""c\nd"'), "quote must be doubled and the field kept whole");
  assert.ok(csv.endsWith("\r\n"));
});

test("csv: multiple failures stay in one field, pipe-joined", () => {
  const report = reconcileRoutes({
    inventory: [
      declared({
        route: "/a",
        contractId: "f1",
        schemaOutputExpected: false,
        websiteOutputExpected: true,
      }),
    ],
    sitemapRoutes: ["/a"],
    routeOutputIndex: parseRouteOutputIndex(manifest([{ route: "/a", schemaOutput: "s" }])),
    generatedAt: AT,
  });
  assert.ok(
    reconciliationToCsv(report).includes(
      '"UNEXPECTED_SCHEMA_OUTPUT|MISSING_WEBSITE_OUTPUT"',
    ),
  );
});

test("report: deterministic apart from generatedAt", () => {
  const build = (at: string) =>
    reconcileRoutes({
      inventory: [declared({ route: "/a", contractId: "f1" })],
      sitemapRoutes: ["/a"],
      routeOutputIndex: parseRouteOutputIndex(
        manifest([{ route: "/a", schemaOutput: "s", websiteOutput: "w" }]),
      ),
      generatedAt: at,
    });
  const a = build(AT);
  const b = build("2027-01-01T00:00:00.000Z");
  assert.deepEqual({ ...a, generatedAt: null }, { ...b, generatedAt: null });
});

