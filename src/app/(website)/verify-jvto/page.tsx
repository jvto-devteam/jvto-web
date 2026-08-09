// src/app/(website)/verify-jvto/page.tsx
//
// PACKAGE 06 (2026-08-06): served from the static-content SSOT
// (content/pages/verify-jvto/index.json). Hero copy, SEO, and FAQ come from content/;
// this file keeps layout + the JSON-LD projection (the hub's stitched entity/asset
// @graph). The evidence locker (VerifyJvtoClient) reads its own Master_Dataset SSOT.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerifyJvtoClient from "./VerifyJvtoClient";
import VerifyNarrative, { staticPageRow, buildStaticFaqSchema } from "./verifyShared";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { loadStaticPage, staticRouteCanonical } from "@/lib/static-content";

export const revalidate = 86400;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage("/verify-jvto");
  if (!page || page.meta.status !== "published") return { title: "Verify JVTO" };
  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;
  return {
    title,
    description,
    alternates: { canonical: staticRouteCanonical("/verify-jvto") },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/verify-jvto`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/img/og/verify-jvto.webp`,
          width: 1200,
          height: 630,
          alt: page.meta.title,
        },
      ],
    },
  };
}

export default async function VerifyJvtoPage() {
  const page = loadStaticPage("/verify-jvto");
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }
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
          description:
            "Mandatory Ijen health-screening certificate issued under SIP-licensed medical supervision. Electronically signed with a BSrE (Balai Sertifikasi Elektronik / BSSN) certificate — a legally valid e-signature under UU ITE — traceable to the doctor's SIP; an accountable, tamper-evident document, a safeguard against fake or self-issued certificates.",
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
        name: "BSrE-Signed Digital Health Certificate (Surat Sehat)",
      },
    },
  };

  // Stefan Loose book (historical recognition)
  const stefanLooseBookSchema = {
    "@type": "Book",
    "@id": `${siteUrl}/#book-stefan-loose-indonesien`,
    name: "Stefan Loose Reiseführer Indonesien: mit Reiseatlas",
    isbn: "9783770167654",
    inLanguage: "de",
    description: "Independently features Ijen Bondowoso Homestay (JVTO) on page 287 — non-paid editorial listing. Publication year and edition are not asserted.",
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

    // Review triangulation placeholder
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "195",
      bestRating: "5",
      worstRating: "1",
      description:
        "Consolidated cross-platform rating from Trustpilot, Google, and TripAdvisor.",
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
      "Booking.com Guest Review Award 2015 (Score 9.4/10 - Homestay Era)",
      "Stefan Loose Travel Handbuch Recommendation (Featured as trusted local operator)",
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
  // FAQPage comes from content/ (content/faqs/verify-jvto.json) via
  // buildStaticFaqSchema below — the same array rendered visibly by VerifyNarrative
  // (AD-08). No inline FAQ node here (single-FAQPage rule).

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
      howToSchema,

      // credential nodes (SSOT-derived)
      ...credentialNodes,
    ],
  };

  // FAQPage from content/ (content/faqs/verify-jvto.json) — the same array
  // VerifyNarrative renders visibly (AD-08). suppressCmsFaq guarantees a single FAQPage.
  const faqItems = page.faq ?? [];
  const faqNode = faqItems.length ? buildStaticFaqSchema("/verify-jvto", faqItems) : null;

  return (
    <>
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={[jsonLd, faqNode].filter(Boolean)}
        suppressCmsFaq
      />
      <VerifyJvtoClient
        heroTitle={page.meta.title}
        heroDescription={page.lede?.[0]}
      />
      <VerifyNarrative page={page} />
    </>
  );
}
