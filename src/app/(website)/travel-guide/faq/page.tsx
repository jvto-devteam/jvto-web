import FaqPage from "@/components/website/FaqPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "FAQ | Travel Guide | JVTO",
  description: "Answers to common questions about booking, payments, safety, and logistics for Bromo & Ijen tours.",
};

export default function FAQ() {
  const faqSchema = {
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
            name: "Travel Guide",
            item: "https://javavolcano-touroperator.com/travel-guide/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "FAQ",
            item: "https://javavolcano-touroperator.com/travel-guide/faq/",
          }
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={faqSchema} />
      <FaqPage />;
    </>
  );
}
