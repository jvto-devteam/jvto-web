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
  const visibleAssets = ssotData.assets_inventory.filter(
    (a) => a.is_show === true,
  );

  // Buat mapping asset slug ke credential yang memuatnya
  const credentialByAssetSlug = new Map();
  ssotData.verification_credentials.forEach((cred) => {
    cred.evidence_asset_slugs?.forEach((slug) => {
      credentialByAssetSlug.set(slug, cred);
    });
  });

  // Fungsi untuk menentukan tipe schema dan properti tambahan per aset
  function getSchemaForAsset(asset: any) {
    const cred = credentialByAssetSlug.get(asset.slug);
    const fileUrl = asset.file_url || asset.url || "";
    const baseProps = {
      "@id": `${siteUrl}/verify-jvto#asset-${asset.slug}`,
      name: cred?.title || asset.caption,
      description:
        asset.geo_context ||
        cred?.geo_narrative ||
        cred?.narrative ||
        asset.caption,
      creditText: "PT Java Volcano Rendezvous",
    };

    // 1. Buku Stefan Loose (ISBN) - tanpa uploadDate
    if (
      asset.slug.includes("stefan-loose") ||
      cred?.evidence_items?.some((item: any) => item.type === "Book")
    ) {
      const bookItem = cred?.evidence_items?.find(
        (item: any) => item.type === "Book",
      );
      return {
        "@type": "Book",
        ...baseProps,
        isbn: bookItem?.bibliographic_metadata?.isbn_13,
        bookEdition: bookItem?.bibliographic_metadata?.title,
        image: asset.preview || asset.url,
        url: cred?.identifiers?.registry_url || "https://amzn.eu/d/08rBSWja",
      };
    }

    // Untuk semua tipe selain Book, tambahkan uploadDate
    const propsWithDate = {
      ...baseProps,
      uploadDate: asset.last_verified_iso || "2025-01-01",
    };

    // 2. Foto Founder (Mr. Sam)
    if (asset.slug === "mr-sam-tourist-police-portrait-png") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        sha256: asset.sha256,
        about: {
          "@type": "Person",
          name: "Agung Sambuko (Mr. Sam)",
          jobTitle: "Active Tourist Police Officer",
          memberOf: "Ditpamobvit",
        },
      };
    }

    // 3. Kartu Izin Pemandu (KTA) – masing-masing untuk person berbeda
    if (asset.category === "Credentials") {
      const nameMap: Record<string, string> = {
        "kta-anjas": "Anjas Setyawan R.",
        "kta-gufron": "Gufron",
        "kta-kiki": "Ahmad Lutfi Hagi (Kiki)",
        "kta-rendi": "Rendi Rivaldi",
        "kta-taufik": "Mohammad Taufik",
      };
      const personName = nameMap[asset.slug] || "Ijen Guide";
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        sha256: asset.sha256,
        about: {
          "@type": "Person",
          name: personName,
          description: "Licensed Ijen crater guide",
        },
      };
    }

    // 4. Screenshot SIP Dokter
    if (asset.slug === "screenshot-sip-dr-ahmad-irwandanu-2026") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        sha256: asset.sha256,
        about: {
          "@type": "Physician",
          name: "dr. Ahmad Irwandanu",
          identifier: "QN00001073380217",
          url: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217",
        },
      };
    }

    // 5. Screenshot artikel berita (Press)
    if (asset.category === "Press") {
      const pressItem = ssotData.organization_profile.press_coverage?.find(
        (p) => p.evidence?.proof_asset_slug === asset.slug,
      );
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        sha256: asset.sha256,
        about: {
          "@type": "NewsArticle",
          headline: pressItem?.title || asset.caption,
          url: pressItem?.url,
          publisher: pressItem?.publisher,
          datePublished: pressItem?.date,
        },
      };
    }

    // 6. Screenshot tiket BBKSDA
    if (asset.slug === "bbksda-ticket-terms-screenshot") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".jpeg")
          ? "image/jpeg"
          : "image/png",
        sha256: asset.sha256,
        about: {
          "@type": "WebPage",
          name: "tiket.bbksdajatim.org - Terms & Conditions",
          url: "https://tiket.bbksdajatim.org",
        },
      };
    }

    // 7. Preview dokumen legal (NIB, TDUP, HPWKI, SPRIN, dll.)
    if (
      ["BusinessID", "License", "Membership", "PoliceDocs"].includes(
        asset.category,
      )
    ) {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".webp")
          ? "image/webp"
          : "image/jpeg",
        sha256: asset.sha256,
        about: {
          "@type": "DigitalDocument",
          name: cred?.title || asset.caption,
          ...(cred?.identifiers?.registry_url && {
            url: cred.identifiers.registry_url,
          }),
        },
      };
    }

    // 8. Foto operasional (OpsPhoto)
    if (asset.category === "OpsPhoto") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        sha256: asset.sha256,
      };
    }

    // 9. Foto screening kesehatan (bukan screenshot)
    if (
      asset.category === "Screening" &&
      !asset.slug.includes("screenshot") &&
      !asset.slug.includes("print-surat")
    ) {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat:
          fileUrl.toLowerCase().endsWith(".jpeg") ||
          fileUrl.toLowerCase().endsWith(".jpg")
            ? "image/jpeg"
            : "image/png",
        sha256: asset.sha256,
      };
    }

    // 10. Preview form kesehatan (print-surat-sehat-preview)
    if (asset.slug === "print-surat-sehat-preview") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        sha256: asset.sha256,
        about: {
          "@type": "DigitalDocument",
          name: "Health Clearance Form (Surat Sehat)",
        },
      };
    }

    // 11. Foto sejarah (Booking awards, kunjungan)
    if (asset.category === "History") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: "image/jpeg",
        sha256: asset.sha256,
      };
    }

    // Default: ImageObject umum
    return {
      "@type": "ImageObject",
      ...propsWithDate,
      contentUrl: fileUrl,
      encodingFormat: fileUrl.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
      sha256: asset.sha256,
    };
  }

  // Buat daftar item untuk setiap aset (hanya yang is_show = true)
  const assetItems = visibleAssets.map((asset) => getSchemaForAsset(asset));

  // 1. ORGANIZATION SCHEMA
  const organizationSchema = {
    "@type": "TravelAgency",
    "@id": "https://javavolcano-touroperator.com/#organization",
    name: "Java Volcano Tour Operator",
    legalName: "PT Java Volcano Rendezvous",
    alternateName: "JVTO",
    description:
      "Tourist Police-led private tour operator in East Java, evolved from Ijen Miner Family Homestay (2015). Known for operational certainty, safety standards, and transparent pricing.",
    foundingDate: "2015",
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
      alternateName: "Mr. Sam",
      honorificPrefix: "Bripka",
      jobTitle: "Active Tourist Police Officer",
      memberOf: {
        "@type": "GovernmentOrganization",
        name: "Indonesian National Police (Polri)",
        department: "Ditpamobvit (Tourist Police)",
      },
      knowsAbout: ["Tourism Safety", "Risk Management", "Volcano Rescue"],
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Daily Bottled Water",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Breakfast Included (Hotel)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Professional Gas Masks (Ijen)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Headlamps (Ijen)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Digital Health Screening (Ijen)",
        value: "Mandatory prior to ascent",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Prepaid Entrance & Local Fees",
        value: true,
      },
    ],
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
      "https://share.google/QnZPeukNsBWg3sZaR",
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
      "https://www.instagram.com/javavolcanotouroperator/",
    ],
  };

  // 2. COLLECTION PAGE SCHEMA (berisi semua aset)
  const collectionPageSchema = {
    "@type": "CollectionPage",
    "@id": `${siteUrl}/verify-jvto`,
    name: "JVTO Verification Locker",
    description:
      "Repository of official legal, police, and operational safety documents.",
    publisher: { "@id": "https://javavolcano-touroperator.com/#organization" },
    hasPart: assetItems,
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
          text: "Yes. JVTO operates under PT Java Volcano Rendezvous with Business Identification Number (NIB) 1102230032918. The registered business activity codes listed in the NIB attachment are KBLI 79911, 62019, and 79121. Verification materials are available on the Verify JVTO page.",
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

  // 5. HOW-TO SCHEMA
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
      collectionPageSchema,
      breadcrumbSchema,
      faqSchema,
      howToSchema,
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
