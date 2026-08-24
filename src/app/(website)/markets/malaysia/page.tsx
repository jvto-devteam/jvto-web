import type { Metadata } from "next";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";
import { applyLiveNumbers, getLiveNumbers } from "@/lib/publicContent/liveNumbers";
import { notFound } from "next/navigation";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import { MarketPageSections } from "@/components/website/MarketPageSections";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";
import { getEcosystemMarket, buildMarketSchemas } from "@/lib/ecosystemContent/markets";

export const revalidate = 86400;

const ROUTE = "/markets/malaysia";
const BASE_URL = "https://javavolcano-touroperator.com";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getEcosystemMarket("malaysia");
  if (!content) return { title: "Page Not Found" };

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${BASE_URL}${ROUTE}`,
      languages: { en: `${BASE_URL}${ROUTE}`, "x-default": `${BASE_URL}${ROUTE}` },
    },
  };
}

export default async function MalaysiaMarketPage() {
  const content = await getEcosystemMarket("malaysia");
  if (!content) return notFound();
  const googleRating = await getPublicAggregateRating();
  const [page, liveNumbers] = await Promise.all([
    loadEcosystemPage(ROUTE),
    getLiveNumbers(),
  ]);
  const answerFirst =
    typeof (page?.raw as any)?.page?.answerFirst === "string"
      ? applyLiveNumbers(((page!.raw as any).page.answerFirst as string).trim(), liveNumbers)
      : null;

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
  const marketSchemas = await buildMarketSchemas(content);

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[...marketSchemas, faqNode]}
        suppressCmsFaq={true}
      />
      <MarketPageSections content={content} googleRating={googleRating} answerFirst={answerFirst} />
    </>
  );
}
