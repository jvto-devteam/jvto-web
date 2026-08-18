import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import { MarketPageSections } from "@/components/website/MarketPageSections";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";
import { getEcosystemMarket, buildMarketSchemas } from "@/lib/ecosystemContent/markets";

export const revalidate = 86400;

const ROUTE = "/markets/singapore";
const BASE_URL = "https://javavolcano-touroperator.com";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getEcosystemMarket("singapore");
  if (!content) return { title: "Page Not Found" };

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `${BASE_URL}${ROUTE}` },
  };
}

export default async function SingaporeMarketPage() {
  const content = await getEcosystemMarket("singapore");
  if (!content) return notFound();
  const googleRating = await getPublicAggregateRating();

  // Markets pages source their FAQ set directly from jvto-ekosistem (content.faqs) —
  // they no longer go through resolveFaqsForPage's narrative_claims/canonical-registry
  // precedence chain, since ekosistem is now the single canonical source for this route.
  const faqNode = buildResolvedFaqSchema(
    {
      source: "canonical",
      faqs: content.faqs,
      suppressCmsFaq: true,
      origin: "jvto-ekosistem markets source (ecosystemContent/markets.ts)",
    },
    ROUTE,
  );

  // content is already 100% ekosistem-sourced (getEcosystemMarket) — pageRow is built
  // straight from it rather than through getPageSeo()'s legacy content_pages DB lookup.
  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title: content.h1 ?? content.title, description: content.description },
    content: { h1: content.h1 ?? content.title },
  };

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[...buildMarketSchemas(content), faqNode]}
        suppressCmsFaq={true}
      />
      <MarketPageSections content={content} googleRating={googleRating} />
    </>
  );
}
