// components/seo/PageJsonLdCombined.tsx
import React from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLdFromContent,
  buildWebPageJsonLd,
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
 */
export async function PageJsonLdCombined({
  pageRow,
  extraSchemas,
}: {
  pageRow: PageRow;
  extraSchemas?: any[]; // optional override from page code
}) {
  const org = await getOrganizationProfile();

  const orgJson = buildOrganizationJsonLd(org as any, SITE_URL);
  const breadcrumbJson = buildBreadcrumbJsonLd(pageRow.route, SITE_URL);
  const faqJson = buildFaqJsonLdFromContent(pageRow as any, SITE_URL);
  const webPageJson = buildWebPageJsonLd(pageRow as any, org as any, SITE_URL);
  const webSiteJson = {
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "Java Volcano Tour Operator",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  // Gabungkan jadi 1 JSON-LD agar ringkas + stabil
  const graph = [
    orgJson,
    webSiteJson,
    webPageJson,
    breadcrumbJson,
    faqJson,
    ...(extraSchemas || []),
  ].filter(Boolean);

  const combined = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return <JsonLd data={combined} />;
}
