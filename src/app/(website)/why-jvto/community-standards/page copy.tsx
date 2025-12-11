import CommunityStandardsPage from "@/components/website/CommunityStandardsPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Community & Sustainability Standards | JVTO",
  description: "Our commitment to local hiring, training, Indecon alignment, and ethical operations. See how your tour supports communities in East Java.",
};

export default function CommunityStandarts() {
  const communityStandardsSchema = {
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
            name: "Why JVTO",
            item: "https://javavolcano-touroperator.com/why-jvto/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Community Standards",
            item: "https://javavolcano-touroperator.com/why-jvto/community-standards/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={communityStandardsSchema} />
      <CommunityStandardsPage />;
    </>
  );
}
