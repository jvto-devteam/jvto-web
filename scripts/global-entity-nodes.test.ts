// Reference resolution for the global entity nodes (T04, 2026-09-09).
//
// The defect these guard against was not a wrong value — it was a reference
// pointing at nothing while every local check passed. So the assertions below
// are about the SCAN: what counts as a reference, what counts as a definition,
// and the early exit that keeps the ekosistem read off pages that reference
// nothing.
//
// resolveGlobalEntityNodes() itself is not exercised here: it awaits
// getEntityGraphFacts(), which reads ekosistem over the filesystem or HTTP, and
// a unit test that needs the network is a test that fails for the wrong reason.
// collectUnresolvedGlobalIds() is the part that decides what gets built.

import assert from "node:assert/strict";
import test from "node:test";

import {
  GLOBAL_ENTITY_IDS,
  collectUnresolvedGlobalIds,
} from "../src/lib/schemas/globalEntityNodes";
import { AGUNG_ID, DEFINED_TERM_IDS, DOCTOR_ID } from "../src/lib/schemas/entityGraph";

const ORIGIN = "https://javavolcano-touroperator.com";

test("the id set covers the founder, the doctor and all 11 terms", () => {
  assert.equal(GLOBAL_ENTITY_IDS.size, 13);
  assert.ok(GLOBAL_ENTITY_IDS.has(AGUNG_ID));
  assert.ok(GLOBAL_ENTITY_IDS.has(DOCTOR_ID));
  for (const id of Object.values(DEFINED_TERM_IDS)) assert.ok(GLOBAL_ENTITY_IDS.has(id));
  // buildBbksdaRegulationSchema emits no @id, so it can never be referenced and
  // must not be resolvable. Injecting it would be an injection, not a fix.
  assert.equal(GLOBAL_ENTITY_IDS.has(`${ORIGIN}/#bbksda-regulation`), false);
});

test("a bare {@id} reference is unresolved when nothing defines it", () => {
  const graph = [
    { "@type": "WebPage", "@id": `${ORIGIN}/policy/x#webpage`, mentions: [{ "@id": DEFINED_TERM_IDS.JVTO_FOC_SCHEME }] },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), [DEFINED_TERM_IDS.JVTO_FOC_SCHEME]);
});

test("a {@type,@id} stub counts as a reference too", () => {
  // THE RULE THAT MATTERS. normalizeJsonLd() drops nodes without @type, so
  // toOrganizationReference() and friends emit {"@type","@id"} stubs. An
  // ekosistem-side check that only accepted a lone {"@id"} read these as full
  // nodes and never checked their targets.
  const graph = [
    { "@type": "Product", "@id": `${ORIGIN}/tours/x#product`, subjectOf: { "@type": "Person", "@id": AGUNG_ID } },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), [AGUNG_ID]);
});

test("an id the graph already defines is not reported — the hub-page no-op", () => {
  // This is why `/` and `/verify-jvto` need no special case: they define the
  // node, so the scan returns nothing and nothing is appended.
  const graph = [
    { "@type": "Person", "@id": AGUNG_ID, name: "Agung Sambuko" },
    { "@type": "WebPage", "@id": `${ORIGIN}/#webpage`, about: { "@id": AGUNG_ID } },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), []);
});

test("definition order does not matter", () => {
  const graph = [
    { "@type": "WebPage", "@id": `${ORIGIN}/#webpage`, about: { "@id": AGUNG_ID } },
    { "@type": "Person", "@id": AGUNG_ID, name: "Agung Sambuko" },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), []);
});

test("non-global ids are never resolved, however dangling", () => {
  // /entity's missing /#organization and the 12 /verify-jvto#asset-* ids are
  // real findings, but this module supplies no definition for them and must not
  // claim to. Out of Phase 1 by owner decision.
  const graph = [
    { "@type": "CollectionPage", "@id": `${ORIGIN}/entity#webpage`, about: { "@id": `${ORIGIN}/#organization` } },
    { "@type": "WebPage", "@id": `${ORIGIN}/verify-jvto#webpage`, mentions: [{ "@id": `${ORIGIN}/verify-jvto#asset-booking-2015-plaque` }] },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), []);
});

test("references are found at any depth, and reported once", () => {
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${ORIGIN}/x#webpage`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          { "@type": "ListItem", item: { "@id": DEFINED_TERM_IDS.NIB } },
          { "@type": "ListItem", item: { "@id": DEFINED_TERM_IDS.NIB } },
        ],
      },
      about: { "@id": DEFINED_TERM_IDS.TDUP },
    },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), [DEFINED_TERM_IDS.NIB, DEFINED_TERM_IDS.TDUP].sort());
});

test("a graph referencing nothing global returns empty — the early exit", () => {
  // Load-bearing for cost, not correctness: an empty result is what lets
  // resolveGlobalEntityNodes() skip getEntityGraphFacts() on ~280 routes.
  const graph = [
    { "@type": "WebPage", "@id": `${ORIGIN}/contact#webpage` },
    { "@type": ["Organization", "TravelAgency"], "@id": `${ORIGIN}/#organization` },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), []);
});

test("empty and malformed input do not throw", () => {
  assert.deepEqual(collectUnresolvedGlobalIds([]), []);
  assert.deepEqual(collectUnresolvedGlobalIds(null), []);
  assert.deepEqual(collectUnresolvedGlobalIds(undefined), []);
  assert.deepEqual(collectUnresolvedGlobalIds({ "@graph": [{ "@id": "" }] }), []);
});

test("a node carrying other keys alongside @id is a definition, not a reference", () => {
  // The boundary case in the other direction: an Organization stub that also
  // carries aggregateRating is a partial node, and treating it as a reference
  // would have the resolver hunting for a definition that is right there.
  const graph = [
    { "@type": "Person", "@id": AGUNG_ID, aggregateRating: { "@type": "AggregateRating", ratingValue: 5 } },
  ];
  assert.deepEqual(collectUnresolvedGlobalIds(graph), []);
});
