// src/app/(website)/markets/singapore/page.tsx
//
// Milestone 2 (2026-08-09): served from the static-content SSOT
// (content/pages/markets/singapore.json + content/faqs/markets-singapore.json).
// Copy, SEO, canonical, and FAQ come from content/; this file keeps only layout wiring and
// the JSON-LD projection. Package/offer inputs (IDR prices) stay in @/lib/marketContent.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarketPageSections } from "@/components/website/MarketPageSections";
import { SINGAPORE_MARKET, buildMarketSchemas } from "@/lib/marketContent";
import { loadStaticPage, staticRouteCanonical } from "@/lib/static-content";
import { staticPageRow, buildStaticFaqSchema } from "../marketShared";

export const revalidate = 86400;

const ROUTE = "/markets/singapore";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

export default async function SingaporeMarketPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const faqItems = page.faq ?? [];
  const faqNode = faqItems.length ? buildStaticFaqSchema(ROUTE, faqItems) : null;

  return (
    <>
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={[...buildMarketSchemas(SINGAPORE_MARKET), faqNode].filter(Boolean)}
        suppressCmsFaq
      />
      <MarketPageSections page={page} market={SINGAPORE_MARKET} />
    </>
  );
}
