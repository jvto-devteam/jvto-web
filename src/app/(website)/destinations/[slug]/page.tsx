import DestinationDetail from "@/components/website/DestinationDetail";
import StructuredData from "@/components/website/StructuredData";

export default function Detail({ params }: { params: { slug: string } }) {
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
            name: "Destinations",
            item: "https://javavolcano-touroperator.com/destinations/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <DestinationDetail slug={params.slug} />
    </>
  );
}
