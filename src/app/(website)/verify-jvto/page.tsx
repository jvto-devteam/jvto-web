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
    (a: any) => a.is_show === true,
  );

  // Map asset slug -> credential
  const credentialByAssetSlug = new Map<string, any>();
  ssotData.verification_credentials.forEach((cred: any) => {
    cred.evidence_asset_slugs?.forEach((slug: string) => {
      credentialByAssetSlug.set(slug, cred);
    });
  });

  function getSchemaForAsset(asset: any) {
    const cred = credentialByAssetSlug.get(asset.slug);
    const fileUrl = asset.file_url || asset.url || "";
    const baseProps: any = {
      "@id": `${siteUrl}/verify-jvto#asset-${asset.slug}`,
      name: cred?.title || asset.caption,
      description:
        asset.geo_context ||
        cred?.geo_narrative ||
        cred?.narrative ||
        asset.caption,
      creditText: "PT Java Volcano Rendezvous",
    };

    // 1) Stefan Loose (Book) - no uploadDate
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

    const propsWithDate = {
      ...baseProps,
      uploadDate: asset.last_verified_iso || "2025-01-01",
    };

    // 2) Founder photo
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

    // 3) Guide credentials (KTA)
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

    // 4) Doctor SIP screenshot
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

    // 5) Press screenshots
    if (asset.category === "Press") {
      const pressItem = orgProfile.press_coverage?.find(
        (p: any) => p.evidence?.proof_asset_slug === asset.slug,
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

    // 6) BBKSDA ticket terms screenshot
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

    // 7) Legal document previews (NIB, TDUP, HPWKI, SPRIN, etc.)
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

    // 8) Ops photos
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

    // 9) Health screening photos (not screenshots)
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

    // 10) Health clearance preview form
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

    // 11) History photos
    if (asset.category === "History") {
      return {
        "@type": "ImageObject",
        ...propsWithDate,
        contentUrl: fileUrl,
        encodingFormat: "image/jpeg",
        sha256: asset.sha256,
      };
    }

    // Default
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

  const assetItems = visibleAssets.map((asset: any) =>
    getSchemaForAsset(asset),
  );

  // =========
  // CORE ENTITIES (stitched + merged)
  // =========

  // Founder entity (re-usable @id)
  const founderSchema = {
    "@type": "Person",
    "@id": `${siteUrl}/#founder`,
    name: "Agung Sambuko",
    alternateName: "Mr. Sam",
    honorificPrefix: "Bripka",
    jobTitle: "Founder & Active Tourist Police Officer (Ditpamobvit)",
    image: `${siteUrl}/founder/mr-sam-tourist-police-portrait.png`,
    memberOf: {
      "@type": "GovernmentOrganization",
      name: "Indonesian National Police",
      alternateName: "Kepolisian Negara Republik Indonesia",
      department: "Ditpamobvit (Directorate of Vital Object Security)",
      sameAs: [
        "https://polri.go.id/",
        "https://www.wikidata.org/wiki/Q3103954",
      ],
    },
    knowsAbout: [
      "Volcano Safety",
      "Crisis Management",
      "Law Enforcement",
      "Tourism Safety",
      "Risk Management",
    ],
  };

  // Physician entity (re-usable @id)
  const physicianSchema = {
    "@type": "Physician",
    "@id": `${siteUrl}/#doctor-ahmad-irwandanu`,
    name: "dr. Ahmad Irwandanu",
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "SIP",
        value: "503.446/193/DRU/4/430.9.13/2020",
        description: "Surat Izin Praktik (Medical Practice License)",
      },
      {
        "@type": "PropertyValue",
        propertyID: "STR",
        value: "QN00001073380217",
        description: "Surat Tanda Registrasi (State Registered Number)",
      },
    ],
    url: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217",
    affiliation: {
      "@type": "MedicalOrganization",
      name: "Konsil Kesehatan Indonesia (KKI)",
    },
  };

  // Medical unit (Ijen screening)
  const ijenMedicalUnitSchema = {
    "@type": "MedicalBusiness",
    "@id": `${siteUrl}/#ijen-health-screening-unit`,
    name: "Ijen Health Screening Unit (JVTO)",
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    description: "Mandatory pre-climb medical assessment unit.",
    location: {
      "@type": "Place",
      name: "Baratha Hotel Lobby (Screening Station)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bondowoso",
        addressRegion: "East Java",
        addressCountry: "ID",
      },
    },
    employee: { "@id": `${siteUrl}/#doctor-ahmad-irwandanu` },
    potentialAction: {
      "@type": "MedicalTest",
      name: "Pre-Climb Vital Signs Assessment",
      status: "Mandatory",
      result: "Digital Health Certificate (QR Code)",
      instrument: ["Pulse Oximeter", "Sphygmomanometer"],
      healthCondition: {
        "@type": "MedicalCondition",
        name: "Hypoxia Risk & Cardiovascular Stress",
      },
    },
  };

  // Stefan Loose book (historical recognition)
  const stefanLooseBookSchema = {
    "@type": "Book",
    "@id": `${siteUrl}/#book-stefan-loose-indonesien`,
    name: "Stefan Loose Reiseführer Indonesien",
    publisher: { "@type": "Organization", name: "DuMont Reiseverlag" },
    bookEdition: "4th Edition",
    datePublished: "2018-07-05",
    isbn: "978-3-7701-7881-0",
    inLanguage: "de",
    numberOfPages: 772,
  };

  // Team persons (from your snippets)
  const teamPeopleSchema = [
    {
      "@type": "Person",
      "@id": `${siteUrl}/team/gufron`,
      name: "Gufron",
      jobTitle: "Senior Guide & Photography Specialist",
      image: `${siteUrl}/uploads/1768225567764-405955176-gufron.png`,
      description:
        "Specialist in volcanic photography and risk management. Known for capturing 'Blue Fire' imagery while maintaining strict safety protocols.",
      knowsAbout: [
        "Volcanic Photography",
        "Astrophotography",
        "Risk Management",
        "English",
      ],
      affiliation: { "@id": `${siteUrl}/#organization` },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Official Ijen Climbing License",
        url: `${siteUrl}/uploads/1771428741674-842615436-kta_gufron.jpg`,
        recognizedBy: {
          "@type": "Organization",
          name: "HPWKI (Himpunan Pelaku Wisata Khusus Ijen)",
        },
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/team/rendi`,
      name: "Rendi",
      jobTitle: "Expedition Safety Lead",
      image: `${siteUrl}/uploads/1768228514527-518051332-rendi.png`,
      description:
        "Technical safety specialist for Ijen Crater descents. Focuses on physical support and emergency response for high-altitude trekking.",
      knowsAbout: [
        "Mountain Rescue",
        "Expedition Safety",
        "First Aid",
        "Volcanology",
      ],
      affiliation: { "@id": `${siteUrl}/#organization` },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Official Ijen Climbing License",
        url: `${siteUrl}/uploads/1771428760524-516116110-kta_rendi.jpg`,
        recognizedBy: { "@type": "Organization", name: "HPWKI" },
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/team/anjas`,
      name: "Anjas",
      jobTitle: "Visual Storyteller & Guide",
      image: `${siteUrl}/uploads/1768270423657-690185912-anjas.png`,
      description:
        "Youth culture specialist and photographer. Expert in low-light crater photography.",
      knowsAbout: [
        "Social Media Content",
        "Night Photography",
        "Cultural Interpretation",
      ],
      affiliation: { "@id": `${siteUrl}/#organization` },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Official Ijen Climbing License",
        url: `${siteUrl}/uploads/1771428583288-513992233-kta_anjas.jpg`,
        recognizedBy: { "@type": "Organization", name: "HPWKI" },
      },
    },
  ];

  // ORGANIZATION (merged + expanded)
  const organizationSchema: any = {
    "@type": ["TravelAgency", "EmergencyService"],
    "@id": `${siteUrl}/#organization`,
    name: "Java Volcano Tour Operator",
    legalName: "PT Java Volcano Rendezvous",
    alternateName: "JVTO",
    url: siteUrl,
    description:
      "Tourist Police-led private tour operator in East Java, evolved from Ijen Miner Family Homestay (2015). Known for operational certainty, safety standards, and transparent pricing.",
    foundingDate: "2015",
    email: "hello@javavolcano-touroperator.com",
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "NIB",
        value: "1102230032918",
      },
      {
        "@type": "PropertyValue",
        propertyID: "TDUP",
        value: "1102230032918",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Khairil Anwar No.102 A",
      addressLocality: "Bondowoso",
      addressRegion: "East Java",
      postalCode: "68214",
      addressCountry: "ID",
    },
    image: `${siteUrl}/assets/img/office-hq.jpg`,
    logo: `${siteUrl}/assets/img/jvto-color.png`,
    priceRange: "$$",

    // Link to founder node by @id (clean graph stitching)
    founder: { "@id": `${siteUrl}/#founder` },

    // Medical unit as a department
    department: [{ "@id": `${siteUrl}/#ijen-health-screening-unit` }],

    knowsAbout: [
      "Volcano Safety",
      "High Altitude Medicine",
      "Crisis Management",
      "SpO2 Monitoring",
      "Crisis Management",
    ],

    // Historical recognition
    subjectOf: [{ "@id": `${siteUrl}/#book-stefan-loose-indonesien` }],

    // Review triangulation placeholder (kept from existing file)
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "200",
      bestRating: "5",
      worstRating: "1",
      description:
        "Consolidated rating from Trustpilot, Google, and TripAdvisor.",
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
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
      "https://trustpilot.com/review/javavolcano-touroperator.com",
      "https://www.isic.org/discounts/?providerId=259268",
      "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
      "https://www.google.com/maps?cid=1266403973589689021",
    ],
  };

  // COLLECTION PAGE (all visible assets)
  const collectionPageSchema = {
    "@type": "CollectionPage",
    "@id": `${siteUrl}/verify-jvto#page`,
    url: `${siteUrl}/verify-jvto`,
    name: "JVTO Digital Evidence Locker",
    description:
      "Central verification hub for PT Java Volcano Rendezvous legal, safety, and historical assets.",
    publisher: { "@id": `${siteUrl}/#organization` },
    hasPart: assetItems,
  };

  // BREADCRUMB
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/verify-jvto#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Verification Locker",
        item: `${siteUrl}/verify-jvto`,
      },
    ],
  };

  // FAQ
  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/verify-jvto#faq`,
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

  // HOW-TO
  const howToSchema = {
    "@type": "HowTo",
    "@id": `${siteUrl}/verify-jvto#howto`,
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

  // OPTIONAL: credential nodes generated from SSOT verification_credentials
  // (kept safe: only includes what is already in ssotData)
  const credentialNodes =
    ssotData.verification_credentials?.map((cred: any) => ({
      "@type": "EducationalOccupationalCredential",
      "@id": `${siteUrl}/verify-jvto#cred-${cred.slug}`,
      name: cred.title,
      description: cred.narrative || cred.geo_narrative,
      credentialCategory: cred.category,
      identifier: cred.identifiers
        ? Object.entries(cred.identifiers).map(([k, v]) => ({
            "@type": "PropertyValue",
            propertyID: k,
            value: String(v),
          }))
        : undefined,
      url: cred.identifiers?.registry_url,
      subjectOf: cred.evidence_asset_slugs?.map((slug: string) => ({
        "@id": `${siteUrl}/verify-jvto#asset-${slug}`,
      })),
    })) || [];

  // Link credential nodes into organization.hasCredential (by @id only)
  if (credentialNodes.length > 0) {
    organizationSchema.hasCredential = credentialNodes.map((c: any) => ({
      "@id": c["@id"],
    }));
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // stitched entities
      organizationSchema,
      founderSchema,
      physicianSchema,
      ijenMedicalUnitSchema,
      stefanLooseBookSchema,
      ...teamPeopleSchema,

      // page-level
      collectionPageSchema,
      breadcrumbSchema,
      faqSchema,
      howToSchema,

      // credential nodes (SSOT-derived)
      ...credentialNodes,
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
