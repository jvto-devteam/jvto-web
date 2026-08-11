import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import { MarketPageSections } from "@/components/website/MarketPageSections";
import { SINGAPORE_MARKET, buildMarketSchemas } from "@/lib/marketContent";

export const revalidate = 86400;

const ROUTE = "/markets/singapore";
const BASE_URL = "https://javavolcano-touroperator.com";
const content = SINGAPORE_MARKET;

const fallbackSeo = {
  title: content.title,
  h1: content.h1,
  description: content.description,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${BASE_URL}${ROUTE}` },
  };
}

export default async function SingaporeMarketPage() {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqNode = buildResolvedFaqSchema(faqResolution, ROUTE);

  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: ROUTE,
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[...buildMarketSchemas(content), faqNode]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <MarketPageSections content={content} />
    </>
  );
}
