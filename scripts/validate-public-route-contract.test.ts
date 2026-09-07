/**
 * Tests for the public route contract (T01, 2026-09-06).
 *
 * Runner is node:test with node:assert/strict — no jest, no vitest. Adding a
 * test dependency needs written approval per .claude/rules/GLOBAL-CONSTRAINTS.md.
 *
 * Run it with `npm run test:routes`, never bare `node --test`: the src imports
 * below only resolve with --import ./scripts/lib/register-ts-hook.mjs.
 *
 * Those imports carry NO file extension, and must not. This file is a .ts file
 * inside tsconfig's include (**\/*.ts covers scripts/), so writing
 * "../src/lib/routes/normalizeRoute.ts" fails tsc with TS5097 — the same error
 * that made allowImportingTsExtensions the rejected option in D-2026-09-06-02.
 * Extensionless satisfies tsc directly and node through the resolver hook.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeRoute } from "../src/lib/routes/normalizeRoute";
import { PUBLIC_ROUTE_CONTRACT } from "../src/lib/routes/publicRouteContract";
import {
  buildPublicRouteInventory,
  findDuplicateRoutes,
} from "../src/lib/routes/buildPublicRouteInventory";
// The .mjs extension is required here and is not the src-import asymmetry: this
// specifier names a real file on disk that tsconfig's include (**/*.ts) never
// covers, so tsc resolves it through allowJs and node needs the literal name.
import { extractSitemapStaticRoutes } from "./validate-public-route-contract.mjs";

test("normalizeRoute: adds leading slash, strips trailing, lowercases", () => {
  assert.equal(normalizeRoute("why-jvto"), "/why-jvto");
  assert.equal(normalizeRoute("/why-jvto/"), "/why-jvto");
  assert.equal(normalizeRoute("/Why-JVTO"), "/why-jvto");
  assert.equal(normalizeRoute("  /why-jvto  "), "/why-jvto");
});

test("normalizeRoute: root stays a bare slash", () => {
  assert.equal(normalizeRoute("/"), "/");
  assert.equal(normalizeRoute(""), "/");
  assert.equal(normalizeRoute("   "), "/");
});

// ── contract shape ──────────────────────────────────────────────────────────

test("contract: family ids are unique", () => {
  const ids = PUBLIC_ROUTE_CONTRACT.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate family id: ${ids.join(", ")}`);
});

test("contract: every static route is already normalized", () => {
  for (const family of PUBLIC_ROUTE_CONTRACT) {
    if (family.kind !== "static") continue;
    for (const route of family.routes) {
      assert.equal(normalizeRoute(route), route, `${family.id}: "${route}" is not normalized`);
    }
  }
});

test("contract: no static route is declared by two families", () => {
  const seen = new Map<string, string>();
  for (const family of PUBLIC_ROUTE_CONTRACT) {
    if (family.kind !== "static") continue;
    for (const route of family.routes) {
      const prior = seen.get(route);
      assert.equal(prior, undefined, `${route} claimed by both ${prior} and ${family.id}`);
      seen.set(route, family.id);
    }
  }
});

test("contract: every dynamic family has a non-empty prefix and pattern", () => {
  for (const family of PUBLIC_ROUTE_CONTRACT) {
    if (family.kind !== "dynamic") continue;
    assert.ok(family.prefix.startsWith("/"), `${family.id}: prefix must start with "/"`);
    assert.ok(family.pattern.includes(":"), `${family.id}: pattern must name its parameter`);
  }
});

// ── inventory builder ───────────────────────────────────────────────────────

const EMPTY_SOURCES = {
  reviewIds: [],
  crewCodes: [],
  destinationSlugs: [],
  tourSlugsFromBali: [],
  tourSlugsFromSurabaya: [],
  blogRoutes: [],
} as const;

/**
 * A fixture, not the real contract. Builder behaviour is asserted against a
 * two-family shape that cannot move when PUBLIC_ROUTE_CONTRACT gains a family;
 * the real contract is exercised separately in the last test below.
 */
const FIXTURE_CONTRACT = [
  {
    id: "root-static",
    kind: "static",
    group: "root",
    routes: ["/", "/contact"],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "jvto-web",
    sitemapExpected: true,
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
    expectedStatus: 200,
  },
  {
    id: "review-detail",
    kind: "dynamic",
    pattern: "/why-jvto/reviews/:id",
    group: "why-jvto/reviews-detail",
    source: "reviewIds",
    expansion: "id",
    prefix: "/why-jvto/reviews",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "jvto-ekosistem",
    sitemapExpected: true,
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
    expectedStatus: 200,
  },
] as const;

test("builder: expands a dynamic family from its source", () => {
  const inv = buildPublicRouteInventory(
    { ...EMPTY_SOURCES, reviewIds: ["333", "334"] },
    { generatedAt: "2026-09-06T00:00:00.000Z", contract: FIXTURE_CONTRACT },
  );
  const routes = inv.routes.map((r) => r.route);
  assert.ok(routes.includes("/why-jvto/reviews/333"), routes.join(","));
  assert.ok(routes.includes("/why-jvto/reviews/334"), routes.join(","));
});

test("builder: dynamic route carries its source record", () => {
  const inv = buildPublicRouteInventory(
    { ...EMPTY_SOURCES, reviewIds: ["333"] },
    { generatedAt: "2026-09-06T00:00:00.000Z", contract: FIXTURE_CONTRACT },
  );
  const entry = inv.routes.find((r) => r.route === "/why-jvto/reviews/333");
  assert.equal(entry?.sourceRecord, "reviewIds#333");
  assert.equal(entry?.contractId, "review-detail");
});

test("builder: an empty source id is a hard error, not a silent skip", () => {
  assert.throws(
    () =>
      buildPublicRouteInventory(
        { ...EMPTY_SOURCES, reviewIds: ["333", "  "] },
        { contract: FIXTURE_CONTRACT },
      ),
    /review-detail/,
  );
});

test("builder: output is deterministic apart from generatedAt", () => {
  const sources = { ...EMPTY_SOURCES, reviewIds: ["334", "333"] };
  const a = buildPublicRouteInventory(sources, { generatedAt: "A", contract: FIXTURE_CONTRACT });
  const b = buildPublicRouteInventory(sources, { generatedAt: "B", contract: FIXTURE_CONTRACT });
  assert.deepEqual(a.routes, b.routes, "route list must not depend on generatedAt or input order");
});

test("builder: no uppercase survives expansion", () => {
  const inv = buildPublicRouteInventory(
    { ...EMPTY_SOURCES, reviewIds: ["ABC"] },
    { contract: FIXTURE_CONTRACT },
  );
  const routes = inv.routes.map((r) => r.route);
  assert.ok(
    routes.every((r) => r === r.toLowerCase()),
    routes.join(","),
  );
});

test("findDuplicateRoutes: reports a route claimed twice", () => {
  const dupContract = [FIXTURE_CONTRACT[0], { ...FIXTURE_CONTRACT[0], id: "root-static-copy" }] as const;
  const inv = buildPublicRouteInventory(EMPTY_SOURCES, { contract: dupContract });
  assert.deepEqual([...findDuplicateRoutes(inv)].sort(), ["/", "/contact"]);
});

// ── sitemap static-literal extractor (drift guard input) ────────────────────

test("extractor: takes double-quoted routes, skips dynamic and commented", () => {
  const fixture = [
    'import { url } from "@/lib/site";',
    "export function s(t, m) {",
    "  return [",
    '    { url: url("/"), lastModified: getLastModified(m, "/", t) },',
    '    // { url: url("/ijen-crater-blue-fire-tour"), lastModified: t },',
    '    { url: url("/contact"), lastModified: getLastModified(m, "/contact", t) },',
    "    ...crewCodes.map((code) => ({ url: url(`/why-jvto/our-team/${code}`) })),",
    '    /* { url: url("/block-commented") } */',
    "  ];",
    "}",
  ].join("\n");

  assert.deepEqual(extractSitemapStaticRoutes(fixture), ["/", "/contact"]);
});

test("extractor: does not mistake a getLastModified key for a url", () => {
  const fixture = '{ lastModified: getLastModified(map, "/why-jvto/our-team", t) }';
  assert.deepEqual(extractSitemapStaticRoutes(fixture), []);
});

test("builder: real contract with empty sources yields only static routes", () => {
  const inv = buildPublicRouteInventory(EMPTY_SOURCES);
  assert.ok(inv.routes.length > 0);
  assert.equal(findDuplicateRoutes(inv).length, 0);
  assert.ok(inv.routes.every((r) => normalizeRoute(r.route) === r.route));
  assert.ok(inv.routes.every((r) => r.sourceRecord === null));
});

/**
 * T02, 2026-09-07 — the deliverable of T02's contract task, written before the
 * declarations so it is seen failing (14 unconfirmed families) before it passes.
 *
 * Every value asserted here was derived from route-output-index.json coverage
 * measured per family on 2026-09-07, and for the two web-owned families from
 * the live production markup (Rule 8) rather than from the manifest — see
 * docs/audit/VERIFIED_FACTS.md. Guessing a value would put an invented claim
 * into the file that acts as the authority on public routes.
 *
 * schemaOwner is deliberately NOT asserted: PageJsonLdCombined injects
 * web-assembled nodes on every page, so ownership is genuinely split and its
 * resolution belongs to T03/T06/T07. T01's --strict-expectations filter checks
 * only the two artifact fields, so leaving it unconfirmed blocks nothing.
 */
test("contract: no family leaves an artifact expectation unconfirmed (T02)", () => {
  const unconfirmed = PUBLIC_ROUTE_CONTRACT.filter(
    (f) =>
      f.websiteOutputExpected === "unconfirmed" ||
      f.schemaOutputExpected === "unconfirmed",
  ).map((f) => f.id);

  assert.deepEqual(
    unconfirmed,
    [],
    `families still unconfirmed: ${unconfirmed.join(", ")}`,
  );
});
