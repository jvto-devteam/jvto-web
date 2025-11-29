import PoliceEscortPage from "@/components/website/PoliceEscortPage";
import StructuredData from "@/components/website/StructuredData";
export const metadata: Metadata = {
  title: "Police Escort for Tourist Groups in East Java | JVTO",
  description: "Learn how JVTO coordinates official traffic police escorts for large groups (18+ guests) on specific travel segments, based on formal orders and Indonesian law.",
};

export default function Reviews() {
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
            name: "Travel Guide",
            item: "https://javavolcano-touroperator.com/travel-guide/",
          },        
          {
            "@type": "ListItem",
            position: 3,
            name: "Police Escort for Groups",
            item: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups/",
          },        
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <PoliceEscortPage />;
    </>
  );
}
