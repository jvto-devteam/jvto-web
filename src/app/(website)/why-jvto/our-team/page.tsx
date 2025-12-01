import OurTeamPage from "@/components/website/OurTeamPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Our Team | Local Guides & Experts | JVTO",
  description: "Meet the professional, local guides and drivers who make your JVTO tour of Bromo and Ijen safe and unforgettable. Learn about our commitment to local employment.",
};

export default function Reviews() {
  const ourTeamSchema = {
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
            name: "Our Team",
            item: "https://javavolcano-touroperator.com/why-jvto/our-team/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={ourTeamSchema} />
      <OurTeamPage />;
    </>
  );
}
