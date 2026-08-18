// src/app/(website)/verify-jvto/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/website/AppLink";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { VerifyProofGrid } from "@/components/website/VerifyProofGrid";
import { getGoogleReviewStats } from "@/lib/publicContent/getReviewStats";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";
import { getAllDocs } from "@/lib/data-loader";

export const revalidate = 86400;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

const fallbackSeo = {
  title: "Verify: Forensic Evidence Locker & Legal Documents",
  h1: "Trust Through Transparency.",
  description:
    "Forensic verification of JVTO's Tourist Police authority, NIB legality, and operational safety protocols. Download official SHA256-signed documents.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/verify-jvto", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/verify-jvto`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/img/og/verify-jvto.webp`,
          width: 1200,
          height: 630,
          alt: seo.h1,
        },
      ],
    },
  };
}

export default async function VerifyJvtoPage() {
  const [seo, googleStats, reviewProfiles] = await Promise.all([
    getEcosystemPageSeo("/verify-jvto", fallbackSeo),
    getGoogleReviewStats(),
    getEcosystemReviewProfiles(),
  ]);
  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/verify-jvto",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };
  const orgProfile: any = (ssotData as any).organization_profile;
  const visibleAssets = (ssotData as any).assets_inventory.filter(
    (a: any) => a.is_show === true,
  );

  // Map asset slug -> credential
  const credentialByAssetSlug = new Map<string, any>();
  (ssotData as any).verification_credentials.forEach((cred: any) => {
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
        name: bookItem?.bibliographic_metadata?.title || baseProps.name,
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
          // Use Person (NOT Physician) to avoid validator errors on properties / ranges
          "@type": "Person",
          "@id": `${siteUrl}/#dr-ahmad-irwandanu`,
          name: "dr. Ahmad Irwandanu",
          jobTitle: "Physician",
          url: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217",
          identifier: {
            "@type": "PropertyValue",
            propertyID: "STR",
            value: "QN00001073380217",
          },
        },
      };
    }

    // 5) Press screenshots
    if (asset.category === "Press") {
      const pressItem = orgProfile?.press_coverage?.find(
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
          : fileUrl.toLowerCase().endsWith(".png")
            ? "image/png"
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
        : fileUrl.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg",
      sha256: asset.sha256,
    };
  }

  const assetItems = visibleAssets.map((asset: any) => getSchemaForAsset(asset));

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

  /**
   * IMPORTANT FIXES (to remove the errors you showed):
   * - Do NOT use @type Physician (validators often flag it in Organization contexts).
   * - Do NOT use potentialAction with @type MedicalTest (potentialAction expects Action).
   * - Do NOT use non-schema properties on MedicalTest (status, instrument, healthCondition, etc).
   */

  // Physician as Person (safe target for employee)
  const physicianSchema = {
    "@type": "Person",
    "@id": `${siteUrl}/#dr-ahmad-irwandanu`,
    name: "dr. Ahmad Irwandanu",
    jobTitle: "Physician",
    url: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217",
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
    memberOf: {
      "@type": "MedicalOrganization",
      name: "Konsil Kesehatan Indonesia (KKI)",
    },
  };

  // Medical unit (Ijen screening) - potentialAction must be Action
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
    // employee expects Person (this is now a Person @id)
    employee: { "@id": `${siteUrl}/#dr-ahmad-irwandanu` },

    // potentialAction expects Action (NOT MedicalTest)
    potentialAction: {
      "@type": "CheckAction",
      name: "Pre-Climb Vital Signs Assessment",
      description:
        "Mandatory screening prior to ascent (SpO2 & blood pressure) recorded digitally.",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://health.mountijen.com/",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Thing",
        name: "Digital Health Certificate (QR Code)",
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
      "@id": `${siteUrl}/why-jvto/our-team/gufron`,
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
      "@id": `${siteUrl}/why-jvto/our-team/rendi`,
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
      "@id": `${siteUrl}/why-jvto/our-team/anjas`,
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
    logo: `${siteUrl}/assets/img/jvto-logo.png`,
    priceRange: "$$",

    // Link to founder node by @id
    founder: { "@id": `${siteUrl}/#founder` },

    // Medical unit as a department
    department: [{ "@id": `${siteUrl}/#ijen-health-screening-unit` }],

    knowsAbout: [
      "Volcano Safety",
      "High Altitude Medicine",
      "Crisis Management",
      "SpO2 Monitoring",
    ],

    // Historical recognition
    subjectOf: [{ "@id": `${siteUrl}/#book-stefan-loose-indonesien` }],

    // Review triangulation
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(googleStats?.rating ?? 4.8),
      reviewCount: String(googleStats?.count ?? 141),
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

  // BREADCRUMB comes from PageJsonLdCombined (was emitted twice before).

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
          text: "Yes. JVTO operates under PT Java Volcano Rendezvous with Business Identification Number (NIB) 1102230032918. Verification materials are available on the Verify JVTO page.",
        },
      },
      {
        "@type": "Question",
        name: "Does JVTO have official Police authority?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JVTO is founded by an active Tourist Police officer (Ditpamobvit). Official coordination evidence is provided via SPRIN (Assignment Orders) documents in the Verification Locker.",
        },
      },
      {
        "@type": "Question",
        name: "How can I verify the documents provided by JVTO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Documents in the Evidence Locker include a SHA256 hash. Download the original file and compare its hash to the published value to detect tampering.",
        },
      },
      {
        "@type": "Question",
        name: "What safety standards does JVTO follow for Ijen Crater tours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every climber undergoes mandatory health screening before ascent. JVTO guides are licensed for Ijen operations and credentials are included as evidence assets on this page.",
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
      "Step-by-step guide to verifying Java Volcano Tour Operator's official legality, police-linked safety infrastructure, and evidence integrity using the Evidence Locker.",
    step: [
      {
        "@type": "HowToStep",
        name: "Access the Evidence Locker",
        text: "Open the Verify JVTO page to view the evidence repository.",
        url: `${siteUrl}/verify-jvto`,
      },
      {
        "@type": "HowToStep",
        name: "Select a document",
        text: "Open an evidence item to view its metadata and SHA256 value.",
      },
      {
        "@type": "HowToStep",
        name: "Verify integrity",
        text: "Compute the file hash locally and compare it to the SHA256 shown in the Evidence Locker.",
      },
      {
        "@type": "HowToStep",
        name: "Cross-reference sources",
        text: "Use registry links (where provided) to cross-check details on official portals.",
      },
    ],
  };

  // OPTIONAL: credential nodes generated from SSOT verification_credentials
  const credentialNodes =
    (ssotData as any).verification_credentials?.map((cred: any) => ({
      "@type": "EducationalOccupationalCredential",
      "@id": `${siteUrl}/verify-jvto#cred-${cred.id}`,
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
      faqSchema,
      howToSchema,

      // credential nodes (SSOT-derived)
      ...credentialNodes,
    ],
  };

  const _categoryMeta: Record<string, { meta: string; href: string; icon: string }> = {
    BusinessID:  { meta: "Legal · Business ID",     href: "/verify-jvto/legal",            icon: "doc"    },
    License:     { meta: "Legal · License",          href: "/verify-jvto/legal",            icon: "doc"    },
    Membership:  { meta: "Legal · Member",           href: "/verify-jvto/legal",            icon: "doc"    },
    PoliceDocs:  { meta: "Safety · Police",          href: "/verify-jvto/police-safety",    icon: "shield" },
    Screening:   { meta: "Safety · Screening",       href: "/verify-jvto/police-safety",    icon: "doc"    },
    Founder:     { meta: "Safety · Founder",         href: "/verify-jvto/police-safety",    icon: "shield" },
    Credentials: { meta: "Safety · Credentials",     href: "/verify-jvto/police-safety",    icon: "doc"    },
    OpsPhoto:    { meta: "Safety · Operations",      href: "/verify-jvto/police-safety",    icon: "doc"    },
    Press:       { meta: "Press · Media",            href: "/verify-jvto/press-recognition", icon: "doc"   },
    History:     { meta: "History · Archive",        href: "/verify-jvto/history-artifacts", icon: "doc"   },
  };

  const allDocs = await getAllDocs();
  const PROOF_CARDS = allDocs
    .filter((doc) => doc.category in _categoryMeta)
    .map((doc) => {
      const cm = _categoryMeta[doc.category];
      return {
        icon: cm.icon,
        h3: doc.official_title,
        p: doc.narrative_context,
        meta: cm.meta,
        href: cm.href,
        ...(doc.preview?.url ? { image: doc.preview.url } : {}),
      };
    });

  const TIMELINE = [
    { year: "'15", h4: "2015 · Guesthouse", p: "Mr. Sam opens the Ijen Bondowoso Homestay on Jl. Khairil Anwar No.102. Booking.com guests rate it 9.4/10." },
    { year: "'16", h4: "2016 · PT incorporation", p: "PT Java Volcano Rendezvous incorporated 2016-01-01 at the same Bondowoso address." },
    { year: "'18", h4: "2018 · Stefan Loose listing", p: "Stefan Loose Reiseführer Indonesien (4th ed., p. 287) names \"Agung\" as operator — an independent German guidebook." },
    { year: "'21", h4: "2021 · Independent press", p: "Detik.com and Radar Jember name Bripka Agung Sambuko in Tourist Police duties at Ijen Geopark." },
    { year: "'23", h4: "2023 · TDUP formalized", p: "Tourism Business Permit formalized 2023-02-11. NIB 1102230032918 OSS-verifiable." },
    { year: "'26", h4: "2026 · Today", p: "16 private itineraries; 14-person crew (11 KTA-confirmed); coordinated Ijen health screening with a licensed physician." },
  ] as const;

  const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[jsonLd]}
        suppressCmsFaq
      />

      {/* ── Hero — navy ───────────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jvto-navy via-jvto-navy/95 to-[#1a2f45] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/70">Verify JVTO</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Operational Transparency
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 006 / PROOF LIBRARY
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Don&rsquo;t guess.{" "}
                <em className="not-italic text-jvto-orange">Verify.</em>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[52ch]">
                Audit JVTO's legal identity, historical continuity, and safety authority through our verifiable proof library.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Database", value: "Evidence_Database_v2.0" },
                { label: "Records", value: "24" },
                { label: "Last audit", value: "2026-05-12" },
                { label: "Status", value: "OPEN" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className={`font-semibold text-sm text-right ${value === "OPEN" ? "text-[#8CC63F]" : "text-white"}`}>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── §01 Proof grid — navy, stacked ───────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.20)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F] flex-shrink-0" style={{ boxShadow: "0 0 0 4px rgba(140,198,63,0.18)" }} />
            <span className="font-mono text-[13px] font-bold uppercase tracking-[0.22em] text-[#8CC63F]">
              EVIDENCE_DATABASE_v2.0
            </span>
          </div>
          <VerifyProofGrid cards={PROOF_CARDS} />
        </div>
      </section>

      {/* ── §02 History & continuity — off-white, stacked ────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 02</span>
            <div>
              <h2
                className="font-black text-jvto-navy leading-[1.0]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.5vw, 44px)" }}
              >
                History &amp; <span className="text-jvto-orange">continuity.</span>
              </h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Since 2016</span>
            </div>
          </div>
          <p className="max-w-[64ch] text-[#6b7280] text-[18px] font-light mb-10">
            JVTO is not a new startup. We have a documented history of operational excellence and the same legal entity since day one.
          </p>
          <ol className="space-y-0 max-w-[64ch]">
            {TIMELINE.map(({ year, h4, p: tp }) => (
              <li key={year} className="flex gap-6 border-b border-[#E3E0DA] last:border-0 py-5">
                <div className="w-10 font-mono text-[12px] font-black text-jvto-orange flex-shrink-0 mt-0.5">{year}</div>
                <div>
                  <h4 className="font-semibold text-jvto-navy text-[15px] mb-1">{h4}</h4>
                  <p className="text-[14px] text-[#6b7280] font-light leading-relaxed">{tp}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/verify-jvto/history-artifacts"
            prefetch={false}
            className="inline-flex items-center gap-2 mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
          >
            Full artifact archive <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── §03 Police & Safety — navy, stacked ─────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden order-2 lg:order-1">
              <Image
                src="/founder/agung_sambuko.jpg"
                alt="Agung Sambuko – JVTO Founder & Tourist Police Officer"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8CC63F]">Bripka Agung Sambuko</span>
                <p className="text-white/80 text-[13px] font-light mt-1">Active Tourist Police · Ditpamobvit POLRI</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 03</span>
                <div>
                  <h2
                    className="font-black text-white leading-[1.0]"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.5vw, 44px)" }}
                  >
                    Police &amp; <span className="text-jvto-orange">safety proof.</span>
                  </h2>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#8CC63F]" aria-hidden="true">
                      <path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-[16px] mb-2" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Tourist Police Leadership</h3>
                    <p className="text-white/50 text-[14px] font-light leading-relaxed">Founder Agung Sambuko is an active member of the Indonesian Tourist Police (POLRI). Official assignment orders (SPRIN) are published in the proof library — independently verifiable.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#8CC63F]" aria-hidden="true">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-[16px] mb-2" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Ijen Health Screening</h3>
                    <p className="text-white/50 text-[14px] font-light leading-relaxed">When BBKSDA access rules require it (SE.1658/KSA.9/2024), JVTO coordinates the health certificate process with licensed physician Dr. Ahmad Irwandanu — every screening is documented and real.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#8CC63F]" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-[16px] mb-2" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>HPWKI-Certified Guides</h3>
                    <p className="text-white/50 text-[14px] font-light leading-relaxed">All JVTO Ijen guides hold KTA cards from HPWKI — the state-recognized Ijen specialist association. Membership requires BBKSDA-supervised SAR + emergency medical training.</p>
                  </div>
                </div>
              </div>
              <Link
                href="/verify-jvto/police-safety"
                prefetch={false}
                className="inline-flex items-center gap-2 mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                View police credentials <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── §04 Independent ratings — navy, stacked ──────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold text-white/40">§ 04</span>
            <div>
              <h2
                className="font-black text-white leading-[1.0]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.5vw, 44px)" }}
              >
                Independent <span className="text-jvto-orange">platform ratings.</span>
              </h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Trustpilot · Tripadvisor · Google</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(() => {
              const find = (platform: string) =>
                reviewProfiles.find((p) => p.platform === platform);
              const trustpilot = find("Trustpilot");
              const google = find("Google Maps");
              const tripadvisor = find("TripAdvisor");
              return [
                {
                  platform: "Trustpilot",
                  score: trustpilot ? `${trustpilot.rating} / 5` : "—",
                  desc: trustpilot ? `${trustpilot.reviewCount} verified reviews` : "",
                  href: trustpilot?.profileUrl ?? "https://www.trustpilot.com/review/javavolcano-touroperator.com",
                },
                {
                  platform: "Google Maps",
                  score: google ? `${google.rating} / 5` : "—",
                  desc: google ? `${google.reviewCount} reviews · verified location` : "",
                  href: google?.profileUrl ?? "https://www.google.com/maps?cid=1266403973589689021",
                },
                {
                  platform: "TripAdvisor",
                  score: tripadvisor ? `${tripadvisor.rating} / 5` : "—",
                  desc: tripadvisor ? `${tripadvisor.reviewCount} reviews` : "",
                  href: tripadvisor?.profileUrl ?? "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
                },
              ];
            })().map(({ platform, score, desc, href }) => (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.04] border border-white/10 rounded-[16px] p-7 hover:border-white/20 transition-colors block"
              >
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8CC63F] mb-3">{platform}</div>
                <div
                  className="text-white font-black mb-2"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "34px", letterSpacing: "-0.02em" }}
                >
                  {score}
                </div>
                <p className="text-white/50 text-[14px] font-light mb-4">{desc}</p>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">View profile →</span>
              </a>
            ))}
          </div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-white/35 uppercase mt-8">
            195 independent reviews across three platforms · Trustpilot is the schema-primary source
          </p>
        </div>
      </section>

      {/* ── §05 FAQ — off-white, stacked ─────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 05</span>
            <h2
              className="font-black text-jvto-navy leading-[1.0]"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.5vw, 44px)" }}
            >
              Verification <span className="text-jvto-orange">FAQ.</span>
            </h2>
          </div>
          <div className="space-y-0">
            {[
              { q: "Is Java Volcano Tour Operator a legal business?", a: "Yes. JVTO operates under PT Java Volcano Rendezvous with Business Identification Number (NIB) 1102230032918, verifiable via oss.go.id (Indonesia Online Single Submission portal)." },
              { q: "Is Agung Sambuko really a police officer?", a: "Yes. Agung Sambuko is an active member of the Indonesian Tourist Police (POLRI), Ditpamobvit division. Official SPRIN assignment orders are published in the proof library below." },
              { q: "How can I verify the documents provided by JVTO?", a: "Documents in the Evidence Locker include a SHA-256 hash. Download the original file and compare its hash to the published value to detect any tampering — mathematically certain proof." },
              { q: "What safety standards does JVTO follow for Ijen Crater tours?", a: "When BBKSDA rules require it (SE.1658/KSA.9/2024), every climber undergoes a formal health screening with licensed physician Dr. Ahmad Irwandanu. HPWKI-certified guides lead all crater descents." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-[#E3E0DA] py-7">
                <h3 className="font-bold text-jvto-navy text-[16px] mb-3" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>{q}</h3>
                <p className="text-[#6b7280] text-[15px] font-light leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ───────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.25)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
          >
            Ready for operational <span className="text-jvto-orange">certainty?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Explore tours <ArrowRight />
            </Link>
            <Link
              href="/why-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Why JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
