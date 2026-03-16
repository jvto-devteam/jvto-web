import InsightsPage from "@/components/website/InsightsPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
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
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: "https://javavolcano-touroperator.com/insights/",
          }
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <InsightsPage title={seo.h1} description={seo.description} />;
    </>
  );
}
