// src/app/(website)/verify-jvto/page.tsx
import type { Metadata } from "next";
import VerifyJvtoClient from "./VerifyJvtoClient";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";

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

  // 1. ORGANIZATION SCHEMA (ENRICHED / DIPERKAYA)
  const organizationSchema = {
    "@type": "TravelAgency",
    "@id": "https://javavolcano-touroperator.com/#organization",
    name: "Java Volcano Tour Operator",
    legalName: "PT Java Volcano Rendezvous",
    alternateName: "JVTO",
    description:
      "Tourist Police-led private tour operator in East Java, evolved from Ijen Miner Family Homestay (2015). Known for operational certainty, safety standards, and transparent pricing.",
    foundingDate: "2015",
    // [BARU] Identifier NIB untuk Validasi Mesin
    identifier: {
      "@type": "PropertyValue",
      propertyID: "NIB",
      value: "1102230032918",
    },
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
    // [BARU] Aggregate Rating untuk Rich Snippets
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "200",
      bestRating: "5",
      worstRating: "1",
      description:
        "Consolidated rating from Trustpilot, Google, and TripAdvisor.",
    },
    founder: {
      "@type": "Person",
      name: "Agung Sambuko",
      alternateName: "Mr. Sam", // [BARU] Untuk pencarian "Mr. Sam Bromo"
      honorificPrefix: "Bripka", // [BARU] Title Kepolisian
      jobTitle: "Active Tourist Police Officer",
      memberOf: {
        "@type": "GovernmentOrganization",
        name: "Indonesian National Police (Polri)",
        department: "Ditpamobvit (Tourist Police)",
      },
      knowsAbout: ["Tourism Safety", "Risk Management", "Volcano Rescue"],
    },
    // [BARU] Fasilitas Utama (Amenities)
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Daily Bottled Water",
        value: "True",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Proper Breakfast Included",
        value: "True",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Digital Health Screening",
        value: "Mandatory for Ijen",
      },
    ],
    // Tetap gunakan Array of Strings agar Valid 100% (Google Friendly)
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

  // 2. DOCUMENT COLLECTION SCHEMA (Tetap Dinamis)
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
        const primaryAssetSlug = cred.evidence_asset_slugs?.[0];
        const asset = ssotData.assets_inventory.find(
          (a) => a.slug === primaryAssetSlug,
        );

        const directFileUrl = asset ? asset.url : `${siteUrl}/verify-jvto`;
        const fileFormat = asset?.url.endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg";

        // ISBN Injection Logic
        let finalDescription = cred.narrative;
        if (cred.evidence_items) {
          const bookItem = cred.evidence_items.find(
            (item: any) => item.type === "Book",
          );
          if (bookItem && bookItem.bibliographic_metadata?.isbn_13) {
            finalDescription = `${finalDescription} (Reference: ${bookItem.bibliographic_metadata.title}, ISBN-13: ${bookItem.bibliographic_metadata.isbn_13})`;
          }
        }

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "DigitalDocument",
            name: cred.title,
            description: finalDescription,
            url: directFileUrl,
            encodingFormat: fileFormat,
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

  // 3. BREADCRUMB SCHEMA
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Verification Locker",
        item: `${siteUrl}/verify-jvto`,
      },
    ],
  };

  // 4. FAQ SCHEMA
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Java Volcano Tour Operator a legal business in Indonesia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. JVTO is a registered Limited Company (PT Java Volcano Rendezvous) under NIB 1102230032918. We hold valid Tourism Business Licenses (TDUP) for Travel Agency (KBLI 79120) and Tour Guiding (KBLI 79921), verifiable via the Indonesian Investment Coordinating Board (BKPM).",
        },
      },
      {
        "@type": "Question",
        name: "Does JVTO have official Police authority?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. JVTO is founded by an active Tourist Police officer (Ditpamobvit). We maintain official coordination for safety patrols and VVIP escorts, evidenced by our SPRIN (Assignment Orders) documents available in our Verification Locker.",
        },
      },
      {
        "@type": "Question",
        name: "How can I verify the documents provided by JVTO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All documents in our Evidence Locker are digitally signed with a SHA256 hash. You can download the original files and verify them against official government registries (OSS/BKPM) using the QR codes provided on the documents.",
        },
      },
      {
        "@type": "Question",
        name: "What safety standards does JVTO follow for Ijen Crater tours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We follow strict 'No Screening, No Go' protocols. Every climber undergoes a mandatory digital health screening (Blood Pressure & SpO2) before ascent. Our guides are certified by HPWKI (Ijen Special Tourism Association) in SAR and First Aid.",
        },
      },
    ],
  };

  // 5. HOW-TO SCHEMA (BARU - Ditambahkan untuk AEO)
  // Menjelaskan langkah verifikasi dokumen kepada mesin pencari
  const howToSchema = {
    "@type": "HowTo",
    name: "How to Verify JVTO Legal & Safety Documents",
    description:
      "Step-by-step guide to verifying Java Volcano Tour Operator's official NIB, Police Authority, and Safety Protocols using the Forensic Evidence Locker.",
    step: [
      {
        "@type": "HowToStep",
        name: "Access the Evidence Locker",
        text: "Navigate to the official Verification Portal (verify-jvto) to view the immutable document repository.",
        url: `${siteUrl}/verify-jvto`,
      },
      {
        "@type": "HowToStep",
        name: "Select Document Category",
        text: "Filter documents by category such as 'Police Authority', 'Legal & NIB', or 'Health Protocols' to find specific evidence.",
      },
      {
        "@type": "HowToStep",
        name: "Inspect the Digital Signature",
        text: "Click on any document to reveal its SHA256 cryptographic hash, ensuring the file has not been tampered with since issuance.",
      },
      {
        "@type": "HowToStep",
        name: "Cross-Reference with Government Registries",
        text: "Use the 'Verify Source Live' button or scan the QR code on documents like the NIB or TDUP to confirm status directly on Indonesian government portals (OSS/BKPM).",
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      documentCollectionSchema,
      breadcrumbSchema,
      faqSchema,
      howToSchema, // [BARU] Ditambahkan ke Graph
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VerifyJvtoClient />
    </>
  );
}
