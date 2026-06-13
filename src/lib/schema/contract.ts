/**
 * Schema graph contract — pure, unit-testable composition for page JSON-LD.
 *
 * composeGraph() is the single chokepoint every page graph should pass through:
 * it enforces the invariants scripts/validate.mjs checks statically, at runtime:
 *   1. every node carries a stable `@id` (entity-graph cross-referencing rule)
 *   2. nodes with the same `@id` are deduped (first occurrence wins — later
 *      duplicates are assumed to be re-inlined references to the same entity)
 *   3. at most ONE node per singleton class per page:
 *      Organization (incl. TravelAgency/LocalBusiness), WebSite, BreadcrumbList,
 *      FAQPage, WebPage
 *
 * No I/O, no imports — safe to call from Server Components and unit tests.
 */

export type SchemaNode = {
  '@type': string | string[];
  '@id': string;
  [key: string]: unknown;
};

export type ComposedGraph = {
  '@context': 'https://schema.org';
  '@graph': SchemaNode[];
};

/** Org subtypes the site emits are all one singleton class. */
const ORGANIZATION_CLASS = new Set(['Organization', 'TravelAgency', 'LocalBusiness']);

const SINGLETON_CLASSES: Array<{ label: string; matches: (type: string) => boolean }> = [
  { label: 'Organization', matches: (t) => ORGANIZATION_CLASS.has(t) },
  { label: 'WebSite', matches: (t) => t === 'WebSite' },
  { label: 'BreadcrumbList', matches: (t) => t === 'BreadcrumbList' },
  { label: 'FAQPage', matches: (t) => t === 'FAQPage' },
  { label: 'WebPage', matches: (t) => t === 'WebPage' },
];

export class SchemaContractViolation extends Error {
  readonly violations: string[];

  constructor(violations: string[]) {
    super(`Schema contract violated:\n  - ${violations.join('\n  - ')}`);
    this.name = 'SchemaContractViolation';
    this.violations = violations;
  }
}

function typesOf(node: SchemaNode): string[] {
  const t = node['@type'];
  return Array.isArray(t) ? t : [t];
}

/**
 * Compose page nodes into a single `@graph`, enforcing the contract.
 * Falsy entries are dropped so callers can pass conditional nodes directly
 * (matching the existing `.filter(Boolean)` idiom in PageJsonLdCombined).
 *
 * @throws SchemaContractViolation listing every violation at once.
 */
export function composeGraph(
  nodes: ReadonlyArray<SchemaNode | null | undefined | false>,
): ComposedGraph {
  const violations: string[] = [];
  const present = nodes.filter((n): n is SchemaNode => Boolean(n));

  present.forEach((node, i) => {
    const id = node['@id'];
    if (typeof id !== 'string' || id.length === 0) {
      violations.push(
        `node[${i}] (@type ${typesOf(node).join(',') || 'unknown'}) is missing a non-empty @id`,
      );
    }
  });

  // Dedupe by @id BEFORE singleton counting: two occurrences of the same @id
  // are one entity, not a duplicate emission.
  const seen = new Set<string>();
  const deduped: SchemaNode[] = [];
  for (const node of present) {
    const id = node['@id'];
    if (typeof id === 'string' && id.length > 0) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    deduped.push(node);
  }

  for (const { label, matches } of SINGLETON_CLASSES) {
    const hits = deduped.filter((n) => typesOf(n).some(matches));
    if (hits.length > 1) {
      violations.push(
        `${label} emitted ${hits.length}× (@id: ${hits
          .map((h) => String(h['@id'] ?? '<none>'))
          .join(', ')}) — at most 1 allowed per page`,
      );
    }
  }

  if (violations.length) throw new SchemaContractViolation(violations);

  return { '@context': 'https://schema.org', '@graph': deduped };
}
