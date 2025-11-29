import JVTODifferencePage from "@/components/website/JVTODifferencePage";
import StructuredData from "@/components/website/StructuredData";
export const metadata: Metadata = {
  title: "The JVTO Difference | Verified, Private, Responsible",
  description: "Our 7 pillars of operation: Police-led safety, licensed and traceable, private-only all-inclusive packages, Ijen screening leadership, local teams, student fairness, and verifiable reviews.",
};

export default function OurStory() {
  const jvtoDifferenceSchema = {
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
            name: "The JVTO Difference",
            item: "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={jvtoDifferenceSchema} />
      <JVTODifferencePage />;
    </>
  );
}
