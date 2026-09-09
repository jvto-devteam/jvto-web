/**
 * Resolve references to global entity nodes into definitions (T04, 2026-09-09).
 *
 * THE DEFECT THIS EXISTS TO FIX. Three places in this repo stated that the
 * founder, doctor and all eleven DefinedTerm nodes were injected globally from
 * `src/app/(website)/layout.tsx`: the DEFINED_TERM_IDS comment in
 * entityGraph.ts, the header of buildPolicySchemas.ts, and
 * .claude/rules/schema-and-content-layer.md. `layout.tsx` contains no JSON-LD
 * and never has. Builders across verify-jvto, why-jvto, policy and both tour
 * PDPs emit `{"@id": ".../#agung-sambuko"}` and `{"@id": ".../#term-nib"}`
 * against an injection point that does not exist.
 *
 * Measured against the live sitemap on 2026-09-09 (jvto-ekosistem 5f67c19d,
 * docs/website-audit/2026-09-09/nodes.json): 21 routes reference the founder
 * without defining it, 20 reference a term, 1 references the doctor. Only `/`
 * defines the terms; only `/` and `/verify-jvto` define the founder.
 *
 * WHY RESOLVE RATHER THAN INJECT EVERYWHERE. Appending all thirteen nodes to
 * all 307 routes would describe pages with entities they never mention, and
 * would grow every page for the benefit of the few that need it. So the rule is
 * the audit's own rule, applied at build time: whatever the assembled graph
 * REFERENCES but does not DEFINE, append.
 *
 * NO HUB-PAGE SPECIAL CASE, deliberately. Both graph assemblers already dedupe
 * by @id first-occurrence-wins — mergeGraphNodes (PageJsonLdCombined.tsx) and
 * dedupeNodes (lib/seo/jsonld/normalize.ts) — so appending a node to `/` or
 * `/verify-jvto`, which already define it, is a no-op. This function also skips
 * an id it can see is already defined, so it is a no-op twice over. Branching on
 * route would add a second rule that has to be kept in sync with the first.
 */

import {
  AGUNG_ID,
  DEFINED_TERM_IDS,
  DOCTOR_ID,
  buildDefinedTerms,
  buildDoctorSchema,
  buildFounderSchema,
  getEntityGraphFacts,
} from './entityGraph';

/**
 * Every `@id` this module can supply a definition for.
 *
 * buildBbksdaRegulationSchema() is deliberately absent: its GovernmentService
 * node carries no `@id` at all, so nothing can reference it and nothing can
 * dangle against it. Adding it here would be an injection, not a resolution.
 */
export const GLOBAL_ENTITY_IDS: ReadonlySet<string> = new Set<string>([
  AGUNG_ID,
  DOCTOR_ID,
  ...Object.values(DEFINED_TERM_IDS),
]);

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * A reference is an object carrying `@id` and no key outside {"@id","@type"}.
 *
 * THIS RULE MUST MATCH the audit's, in
 * jvto-ekosistem/scripts/lib/extract-jsonld-nodes.mjs. If the fix and the check
 * disagree about what counts as a reference, a green sweep proves nothing.
 *
 * `@type` is allowed alongside `@id` because normalizeJsonLd() drops any node
 * without a `@type`, so several builders here emit `{"@type","@id"}` stubs —
 * notably toOrganizationReference() in PageJsonLdCombined. The ekosistem-side
 * check that only accepted a lone `{"@id"}` classified those stubs as full
 * nodes and never checked their targets.
 */
const isReference = (value: UnknownRecord): boolean => {
  const id = value['@id'];
  if (typeof id !== 'string' || id === '') return false;
  return Object.keys(value).every((key) => key === '@id' || key === '@type');
};

interface GraphScan {
  referenced: Set<string>;
  defined: Set<string>;
}

/**
 * One walk, collecting both directions. Depth-bounded rather than cycle-tracked:
 * these graphs come from JSON, so they are trees.
 */
function scanGraph(value: unknown, scan: GraphScan, depth = 0): GraphScan {
  if (depth > 64) return scan;
  if (Array.isArray(value)) {
    for (const item of value) scanGraph(item, scan, depth + 1);
    return scan;
  }
  if (!isRecord(value)) return scan;

  const id = value['@id'];
  if (isReference(value)) {
    scan.referenced.add(id as string);
    return scan;
  }
  if (typeof id === 'string' && id !== '') scan.defined.add(id);

  for (const key of Object.keys(value)) {
    if (key === '@id' || key === '@type') continue;
    scanGraph(value[key], scan, depth + 1);
  }
  return scan;
}

/**
 * Global `@id`s this graph references but does not define. Synchronous and
 * cheap — it is what lets the caller skip the ekosistem read entirely on the
 * ~280 routes that reference nothing.
 */
export function collectUnresolvedGlobalIds(nodes: unknown): string[] {
  const { referenced, defined } = scanGraph(nodes, {
    referenced: new Set<string>(),
    defined: new Set<string>(),
  });
  return [...referenced].filter((id) => GLOBAL_ENTITY_IDS.has(id) && !defined.has(id)).sort();
}

/**
 * The definitions this graph is missing, ready to append.
 *
 * Returns `[]` WITHOUT awaiting anything when nothing is referenced. That early
 * exit is the point: getEntityGraphFacts() is an ekosistem read with an HTTP
 * fallback, and this runs during static generation of every route.
 */
export async function resolveGlobalEntityNodes(nodes: unknown): Promise<unknown[]> {
  const missing = collectUnresolvedGlobalIds(nodes);
  if (missing.length === 0) return [];

  const wanted = new Set(missing);
  const facts = await getEntityGraphFacts();
  const resolved: unknown[] = [];

  if (wanted.has(AGUNG_ID)) resolved.push(buildFounderSchema(facts?.founder));
  if (wanted.has(DOCTOR_ID)) resolved.push(buildDoctorSchema(facts?.doctor));

  const terms = buildDefinedTerms(facts?.definedTerms);
  for (const term of Object.values(terms)) {
    if (wanted.has(term['@id'])) resolved.push(term);
  }

  return resolved;
}
