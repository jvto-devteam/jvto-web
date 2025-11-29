import InsightsPage from "@/components/website/InsightsPage";
import StructuredData from "@/components/website/StructuredData";
export const metadata: Metadata = {
  title: "Insights | JVTO's Blog on Safety, Planning & Community",
  description: "Explore our articles on choosing a legal operator, understanding Ijen health screening, and maximizing your East Java trip. Expert advice from a police-led team.",
};

export default function Insights() {
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
      <InsightsPage />;
    </>
  );
}
