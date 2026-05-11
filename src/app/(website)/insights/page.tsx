import type { Metadata } from 'next';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import InsightsPage from '@/components/website/InsightsPage';
import { getPageSeo } from '@/lib/content/getPageSeo';

export const revalidate = 3600;

const FALLBACK_SEO = {
  title: "Insights — Safety, Planning & East Java Volcano Guides | JVTO",
  h1: "Insights & Explainers",
  description:
    "Expert articles on choosing a licensed East Java operator, Ijen health screening, combining Bromo–Ijen–Tumpak Sewu itineraries, and practical planning from a police-led team.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/insights', FALLBACK_SEO);
  return { title: seo.title, description: seo.description };
}

export default async function InsightsHubPage() {
  const seo = await getPageSeo('/insights', FALLBACK_SEO);
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
        route: '/insights',
        lang: 'en',
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} />
      <InsightsPage title={seo.h1} description={seo.description} />
    </>
  );
}
