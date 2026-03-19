import InsightsPage from "@/components/website/InsightsPage";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";

const fallbackSeo = {
  title: "Insights | JVTO's Blog on Safety, Planning & Community",
  h1: "Insights & Explainers",
  description: "Explore our articles on choosing a legal operator, understanding Ijen health screening, and maximizing your East Java trip. Expert advice from a police-led team.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/blog", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function Insights() {
  const seo = await getPageSeo("/blog", fallbackSeo);
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
        route: "/blog",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} />
      <InsightsPage title={seo.h1} description={seo.description} />;
    </>
  );
}
