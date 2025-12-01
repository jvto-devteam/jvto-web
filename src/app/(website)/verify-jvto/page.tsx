import VerifyJVTOPage from "@/components/website/VerifyJVTOPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Verify JVTO: Licenses, Police Leadership & Office | Official Proof",
  description: "Verify our PT license (NIB/TDUP), see our physical office in Bondowoso, and confirm our Tourist Police leadership. Transparent proof for your safety.",
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
            name: "Verify JVTO",
            item: "https://javavolcano-touroperator.com/verify-jvto/",
          }
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <VerifyJVTOPage />;
    </>
  );
}
