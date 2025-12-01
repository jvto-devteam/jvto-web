import OurStoryPage from "@/components/website/OurStoryPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Our Story: A Commitment to Safer Java Travel | JVTO",
  description: "Founded by an active East Java Tourist Police officer, JVTO exists to deliver safe, authentic, all-inclusive volcano tours to Bromo & Ijen, while empowering local communities.",
};

export default function OurStory() {
  const ourStorySchema = {
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
            name: "Our Story",
            item: "https://javavolcano-touroperator.com/why-jvto/our-story/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={ourStorySchema} />
      <OurStoryPage />;
    </>
  );
}
