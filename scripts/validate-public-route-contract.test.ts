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
