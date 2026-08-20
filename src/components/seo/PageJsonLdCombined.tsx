import { JsonLd } from "@/components/seo/JsonLd";
import { getEcosystemPageSchema, graphNodesFromSchema } from "@/lib/ecosystemContent/schema";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
  buildContentPageExtraJsonLd,
  buildFaqJsonLdFromContent,
  buildWebPageJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";

type PageRowLike = {
  route: string;
  lang: string;
  seo: any;
  content: any;
  created_at?: Date;
  updated_at?: Date;
};

const SITE_URL = "https://javavolcano-touroperator.com";

function stripContext(node: any) {
  if (!node || typeof node !== "object") return node;
  const rest = { ...node };
  delete rest["@context"];
  return rest;
}

function normalizeNodes(value: any): any[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(normalizeNodes);
  if (value?.["@graph"] && Array.isArray(value["@graph"])) {
    return value["@graph"].map(stripContext);
  }
  if (typeof value === "object") return [stripContext(value)];
  return [];
}

function mergeGraphNodes(nodes: any[]) {
  const byId = new Map<string, any>();
  const withoutId: any[] = [];

  for (const node of nodes.flatMap(normalizeNodes).filter(Boolean)) {
    const id = node["@id"];
    if (typeof id === "string" && id) {
      if (!byId.has(id)) byId.set(id, node);
      continue;
    }
    withoutId.push(node);
  }

  return [...byId.values(), ...withoutId];
}

const SINGLETON_TYPES = new Set(["FAQPage", "WebSite", "BreadcrumbList", "ProfilePage"]);
const ORGANIZATION_TYPES = new Set(["Organization", "TravelAgency", "LocalBusiness"]);

function schemaTypes(node: any) {
  const type = node?.["@type"];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === "string");
  return typeof type === "string" ? [type] : [];
}

function singletonTypeIsUsable(node: any, type: string) {
  if (type === "FAQPage") {
    return Array.isArray(node?.mainEntity) && node.mainEntity.length > 0;
  }
  return true;
}

function sanitizeSchemaNode(node: any) {
  if (!node || typeof node !== "object") return node;
  const types = schemaTypes(node);
  if (!types.includes("FAQPage") || singletonTypeIsUsable(node, "FAQPage")) {
    return node;
  }

  const usableTypes = types.filter((type) => type !== "FAQPage");
  if (!usableTypes.length) return null;
  return {
    ...node,
    "@type": Array.isArray(node["@type"]) ? usableTypes : usableTypes[0],
  };
}

// GEO audit Priority 3 (2026-08-15): the full Organization/TravelAgency/LocalBusiness
// node only needs to render once — Google stitches the entity across pages via a
// consistent @id, it doesn't require re-declaring every property on every page.
// Homepage keeps the full node (canonical definition); every other route gets a
// stub with only @type + @id. This is a maintenance/duplication cleanup only (Medium,
// not Critical per the audit) — the @id was already consistent site-wide before this.
// Keeps @type: normalizeJsonLd() (src/lib/seo/jsonld/normalize.ts) drops any node
// without @type, so a bare {"@id"} reference silently vanishes instead of resolving.
function toOrganizationReference(node: any) {
  if (!node || typeof node !== "object" || !node["@id"]) return node;
  return {
    "@type": node["@type"],
    "@id": node["@id"],
    // Carried through even though every other property is stripped:
    // aggregateRating is an inline property of ekosistem's Organization node
    // (jvto-ekosistem scripts/lib/build-organization.mjs, Bagian 1 of the
    // 2026-08-20 schema-rendering-consolidation design), not a separate
    // cross-referenced node. Dropping it here would silently remove the
    // rating from every non-homepage route's JSON-LD.
    ...(node.aggregateRating ? { aggregateRating: node.aggregateRating } : {}),
  };
}

function shouldAppendRuntimeSchema(node: any, existingTypes: Set<string>) {
  const types = schemaTypes(node);
  if (!types.length) return true;
  if (types.some((type) => SINGLETON_TYPES.has(type) && existingTypes.has(type))) return false;
  if (
    types.some((type) => ORGANIZATION_TYPES.has(type)) &&
    [...ORGANIZATION_TYPES].some((type) => existingTypes.has(type))
  ) {
    return false;
  }
  return true;
}

/**
 * Server Component.
 * Output: 1 script berisi @graph (Organization + WebPage + Breadcrumb + FAQ)
 *
 * Phase 5 (2026-04-29): added `suppressCmsFaq` opt-out so pages with higher-precedence
 * FAQ sources (narrative_claims / canonical hardcoded) can prevent the auto-injected CMS FAQPage,
 * avoiding double-render. See src/lib/content/resolveFaqs.ts for precedence semantics.
 */
export async function PageJsonLdCombined({
  pageRow,
  extraSchemas,
  suppressCmsFaq = false,
}: {
  pageRow: PageRowLike;
  extraSchemas?: any[]; // optional override from page code
  suppressCmsFaq?: boolean;
}) {
  const isHomepage = pageRow.route === "/";
  const ecosystemSchema = await getEcosystemPageSchema(pageRow.route);
  if (ecosystemSchema) {
    const breadcrumbJson = buildBreadcrumbJsonLd(pageRow.route, SITE_URL);
    const webSiteJson = buildWebSiteJsonLd(SITE_URL);
    const ecosystemNodes = graphNodesFromSchema(ecosystemSchema)
      .map(sanitizeSchemaNode)
      .filter(Boolean)
      .map((node) =>
        !isHomepage && schemaTypes(node).some((type) => ORGANIZATION_TYPES.has(type))
          ? toOrganizationReference(node)
          : node,
      );
    const existingTypes = new Set(
      ecosystemNodes.flatMap((node) =>
        schemaTypes(node).filter((type) => singletonTypeIsUsable(node, type)),
      ),
    );
    // Flatten before filtering: shouldAppendRuntimeSchema reads @type off
    // each node, but a page can pass extraSchemas as a {"@context","@graph":
    // [...]} wrapper (several verify-jvto pages do). That wrapper has no
    // @type of its own, so filtering pre-flatten let every node inside it
    // bypass the singleton/Organization guard — currently harmless only
    // because those nodes happen to share an @id with something already in
    // ecosystemNodes (caught by mergeGraphNodes instead). Flattening first
    // makes the guard actually see what it's guarding.
    const runtimeSchemas = normalizeNodes([
      webSiteJson,
      breadcrumbJson,
      ...(extraSchemas || []),
    ]).filter((node) => shouldAppendRuntimeSchema(node, existingTypes));

    return (
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": mergeGraphNodes([
            ...ecosystemNodes,
            ...runtimeSchemas,
          ]),
        }}
      />
    );
  }

  const org = await getOrganizationProfile();

  const fullOrgJson = buildOrganizationJsonLd(org as any, SITE_URL);
  const orgJson = isHomepage ? fullOrgJson : toOrganizationReference(fullOrgJson);
  const breadcrumbJson = buildBreadcrumbJsonLd(pageRow.route, SITE_URL);
  const faqJson = suppressCmsFaq
    ? null
    : buildFaqJsonLdFromContent(pageRow as any, SITE_URL);
  // reviewedBy: E-E-A-T provenance signal.
  // This reads from pageRow.content.reviewedBy if a page threads it through,
  // else falls back to "JVTO Editorial". As of this task, NO page.tsx actually
  // threads page.meta.reviewedBy into its content object — every page currently
  // emits this hardcoded fallback. Wiring a real per-page value would require
  // updating each page.tsx's `content: { ... }` literal to include
  // `reviewedBy: page?.meta.reviewedBy`, which is out of this task's scope (~30 files).
  const webPageJson = {
    ...buildWebPageJsonLd(pageRow as any, org as any, SITE_URL),
    reviewedBy: {
      "@type": "Organization",
      name: pageRow.content?.reviewedBy ?? "JVTO Editorial",
    },
  };
  const webSiteJson = buildWebSiteJsonLd(SITE_URL);
  const contentPageExtraSchemas = buildContentPageExtraJsonLd(
    pageRow as any,
    SITE_URL,
  );

  // Gabungkan jadi 1 JSON-LD agar ringkas + stabil
  const graph = [
    orgJson,
    webSiteJson,
    webPageJson,
    breadcrumbJson,
    faqJson,
    ...contentPageExtraSchemas,
    ...(extraSchemas || []),
  ].filter(Boolean);

  const combined = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return <JsonLd data={combined} />;
}
