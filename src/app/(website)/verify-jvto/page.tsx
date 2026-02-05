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
  // 1. ORGANIZATION SCHEMA (Dari Script yang Anda Berikan)
  // Ini adalah definisi statis yang kuat untuk entitas "TravelAgency"
  const organizationSchema = {
    "@type": "TravelAgency",
    "@id": "https://javavolcano-touroperator.com/#organization",
    name: "Java Volcano Tour Operator",
    legalName: "PT Java Volcano Rendezvous",
    alternateName: "JVTO",
    description:
      "Tourist Police-led private tour operator in East Java, evolved from Ijen Miner Family Homestay (2015). Recognized by Stefan Loose Guidebook and Booking.com Awards.",
    foundingDate: "2015",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Khairil Anwar No.102 A",
      addressLocality: "Bondowoso",
      addressRegion: "East Java",
      postalCode: "68214",
      addressCountry: "ID",
    },
    image: "https://javavolcano-touroperator.com/assets/img/office-hq.jpg",
    priceRange: "$$",
    founder: {
      "@type": "Person",
      name: "Agung Sambuko",
      jobTitle: "Tourist Police Officer",
      memberOf: {
        "@type": "GovernmentOrganization",
        name: "Indonesian National Police (Polri)",
        department: "Polisi Pariwisata (Tourist Police)",
      },
      knowsAbout: ["Tourism Safety", "Risk Management", "Volcano Rescue"],
    },
    award: [
      {
        "@type": "Award",
        name: "Booking.com Guest Review Award 2016",
        description: "Score 9.2/10 (Homestay Era)",
      },
      {
        "@type": "Award",
        name: "Stefan Loose Travel Handbuch Recommendation",
        datePublished: "2018",
        description:
          "Featured in Stefan Loose Indonesien Guidebook as a trusted local operator.",
      },
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "HPWKI",
        description: "Himpunan Pelaku Wisata Khusus Ijen",
      },
      {
        "@type": "Organization",
        name: "ISIC",
        description: "International Student Identity Card Provider",
      },
      {
        "@type": "Organization",
        name: "INDECON",
        description: "Indonesia Ecotourism Network",
      },
    ],
    sameAs: [
      "https://www.trustpilot.com/review/javavolcano-touroperator.com",
      "https://g.page/javavolcano",
      "https://www.tripadvisor.com/Attraction_Review-g317070-d12836253-Reviews-Java_Volcano_Tour_Operator",
      "https://www.instagram.com/javavolcano.tour/",
    ],
  };

  // 2. DOCUMENT COLLECTION SCHEMA (Dinamis dari SSOT)
  // Bagian ini tetap mengambil data dari file JSON SSOT agar daftar dokumen selalu update otomatis
  const documentCollectionSchema = {
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
          license:
            cred.identifiers?.registry_url ||
            cred.identifiers?.value ||
            "Public Verification",
          accessMode: "public",
          fileFormat: "application/pdf",
        },
      })),
    },
  };

  // 3. MERGE MENJADI SATU GRAPH
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, documentCollectionSchema],
  };

  return (
    <>
      {/* Inject Combined Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VerifyJvtoClient />
    </>
  );
}
