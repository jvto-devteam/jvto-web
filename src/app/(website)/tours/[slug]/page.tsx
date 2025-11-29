import TourDetail from "@/components/website/TourDetail";
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
            name: "Tours",
            item: "https://javavolcano-touroperator.com/tours/",
          },
        ],
      },
    ],
  };

  if (!params.slug) notFound();

  return (
    <>
      <StructuredData data={schema} />
      <TourDetail slug={params.slug} />
    </>
  );
}
