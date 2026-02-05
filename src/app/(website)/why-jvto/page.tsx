// src/app/(website)/why-jvto/page.tsx
import type { Metadata } from "next";
import WhyJvtoClient from "./WhyJvtoClient";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v2.1.public.ready_to_copy.json";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export const metadata: Metadata = {
  title: "Why JVTO: Tourist Police-Led Operational Certainty",
  description:
    "Not just a tour operator. A guardian infrastructure led by Active Tourist Police. Verified safety, private logistics, and proprietary health screening.",
  openGraph: {
    title: "Why JVTO: Operational Certainty & Safety",
    description:
      "Led by Active Tourist Police. Verified Legal Entity. Digital Health Screening. Explore the Trust Infrastructure.",
    url: `${siteUrl}/why-jvto`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/img/og/why-jvto.webp`, // Pastikan image ini ada atau gunakan home.webp
        width: 1200,
        height: 630,
        alt: "JVTO Tourist Police Leadership",
      },
    ],
  },
};

export default function WhyJvtoPage() {
  const orgProfile = ssotData.organization_profile;

  // Schema Organization dengan penekanan pada "memberOf Police"
  // Sesuai strategi GEO untuk meningkatkan E-E-A-T
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://javavolcano-touroperator.com/#organization",
    name: orgProfile.brand_name,
    legalName: orgProfile.legal_name,
    alternateName: "JVTO",
    description: orgProfile.description,
    foundingDate: orgProfile.founding_date,
    url: orgProfile.digital_presence.website,
    logo: orgProfile.digital_presence.logo_url,
    founder: {
      "@type": "Person",
      name: orgProfile.founder.name,
      jobTitle: "Active Tourist Police Officer", // KEYWORD KRITIS
      image: orgProfile.founder.image_url,
      memberOf: {
        "@type": "GovernmentOrganization",
        name: "Indonesian National Police",
        department: "Ditpamobvit (Tourist Police)",
      },
    },
    // Menautkan ke bukti pihak ketiga
    sameAs: orgProfile.social_proof_and_authority.map((item) => item.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <WhyJvtoClient />
    </>
  );
}
