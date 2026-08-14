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
  const ecosystemSchema = await getEcosystemPageSchema(pageRow.route);
  if (ecosystemSchema) {
    const breadcrumbJson = buildBreadcrumbJsonLd(pageRow.route, SITE_URL);
    const webSiteJson = buildWebSiteJsonLd(SITE_URL);
    const ecosystemNodes = graphNodesFromSchema(ecosystemSchema);
    const existingTypes = new Set(ecosystemNodes.flatMap(schemaTypes));
    const runtimeSchemas = [webSiteJson, breadcrumbJson, ...(extraSchemas || [])].filter(
      (node) => shouldAppendRuntimeSchema(node, existingTypes),
    );

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

  const orgJson = buildOrganizationJsonLd(org as any, SITE_URL);
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
