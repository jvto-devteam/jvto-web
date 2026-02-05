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
  const orgProfile = ssotData.organization_profile;

  // 1. ORGANIZATION SCHEMA
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
      "Booking.com Guest Review Award 2016 (Score 9.2/10 - Homestay Era)",
      "Stefan Loose Travel Handbuch Recommendation 2018 (Featured as trusted local operator)",
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

  // 2. DOCUMENT COLLECTION SCHEMA (Dinamis dari SSOT dengan URL Lookup)
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
      itemListElement: ssotData.verification_credentials.map((cred, index) => {
        // --- LOGIC BARU: LOOKUP URL ---
        // Kita cari slug aset bukti pertama dari credential ini
        const primaryAssetSlug = cred.evidence_asset_slugs?.[0];

        // Lalu kita cari objek asetnya di inventory untuk mendapatkan URL asli
        const asset = ssotData.assets_inventory.find(
          (a) => a.slug === primaryAssetSlug,
        );

        // Jika ketemu, pakai URL asli (PDF/Gambar). Jika tidak, fallback ke halaman verify.
        const directFileUrl = asset ? asset.url : `${siteUrl}/verify-jvto`;
        const fileFormat = asset?.url.endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg";

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "DigitalDocument",
            name: cred.title,
            description: cred.narrative,
            url: directFileUrl, // <--- SEKARANG MENGARAH KE FILE ASLI
            encodingFormat: fileFormat, // Memberitahu Google jenis filenya
            license:
              cred.identifiers?.registry_url ||
              cred.identifiers?.value ||
              "Public Verification",
            accessMode: "public",
          },
        };
      }),
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
