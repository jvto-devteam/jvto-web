import { JsonLd } from "@/components/seo/JsonLd";
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
