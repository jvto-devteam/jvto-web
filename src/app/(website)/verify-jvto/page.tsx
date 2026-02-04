// src/app/(website)/verify-jvto/page.tsx
import type { Metadata } from "next";
import VerifyJvtoClient from "./VerifyJvtoClient";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v2.1.public.ready_to_copy.json";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export const metadata: Metadata = {
  title: "Verify JVTO: Forensic Evidence Locker & Legal Documents",
  description:
    "Forensic verification of JVTO's Tourist Police authority, NIB legality, and operational safety protocols. Download official SHA256-signed documents.",
  openGraph: {
    title: "Verify JVTO: Forensic Evidence Locker",
    description:
      "Access official Police Orders (SPRIN), Business Licenses (NIB), and Safety Protocols. Verified Single Source of Truth.",
    url: `${siteUrl}/verify-jvto`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/img/og/verify-jvto.webp`,
        width: 1200,
        height: 630,
        alt: "JVTO Verification Shield",
      },
    ],
  },
};

export default function VerifyJvtoPage() {
  // Construct Schema.org Data from SSOT
  const organizationSchema = ssotData.organization_profile;

  // Create an ItemList schema for the documents
  const documentCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/verify-jvto`,
    name: "JVTO Verification Locker",
    description:
      "Repository of official legal, police, and operational safety documents.",
    publisher: {
      "@id": "https://javavolcano-touroperator.com/#organization",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ssotData.verification_credentials.map((cred, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DigitalDocument",
          name: cred.title,
          description: cred.narrative,
          url: `${siteUrl}/verify-jvto`,
          license: cred.identifiers?.value || "Public Public",
          accessMode: "public",
          fileFormat: "application/pdf",
        },
      })),
    },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, documentCollectionSchema],
  };

  return (
    <>
      {/* Inject GEO/SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VerifyJvtoClient />
    </>
  );
}
