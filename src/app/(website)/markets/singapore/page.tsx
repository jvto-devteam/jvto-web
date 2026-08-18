import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageSeo } from "@/lib/content/getPageSeo";
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

  const seo = await getPageSeo(ROUTE, {
    title: content.title,
    h1: content.h1,
    description: content.description,
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${BASE_URL}${ROUTE}` },
  };
}

export default async function SingaporeMarketPage() {
  const content = await getEcosystemMarket("singapore");
  if (!content) return notFound();
  const googleRating = await getPublicAggregateRating();

  const seo = await getPageSeo(ROUTE, {
    title: content.title,
    h1: content.h1,
    description: content.description,
  });

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
        suppressCmsFaq={true}
      />
      <MarketPageSections content={content} googleRating={googleRating} />
    </>
  );
}
