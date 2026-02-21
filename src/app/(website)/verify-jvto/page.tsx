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

  // Map asset slug -> credential
  const credentialByAssetSlug = new Map<string, any>();
  ssotData.verification_credentials.forEach((cred: any) => {
    cred.evidence_asset_slugs?.forEach((slug: string) => {
      credentialByAssetSlug.set(slug, cred);
    });
  });

  // Asset -> schema node
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

    // 1) Stefan Loose book (Book)
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
        name:
          bookItem?.bibliographic_metadata?.title ||
          cred?.title ||
          asset.caption ||
          "Stefan Loose Reiseführer Indonesien",
        image: asset.preview || asset.url,
        url: cred?.identifiers?.registry_url || "https://amzn.eu/d/08rBSWja",
      };
    }

    // Add uploadDate for non-Book
    const propsWithDate: any = {
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
          jobTitle: "Founder & Active Tourist Police Officer",
          memberOf: {
            "@type": "GovernmentOrganization",
            name: "Indonesian National Police",
            department: "Ditpamobvit",
          },
        },
      };
    }

    // 3) Licensed guide cards (KTA)
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

    // 4) Doctor license screenshot (keep as Person to avoid validator errors on Physician)
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
          "@type": "Person",
          "@id": `${siteUrl}/verify-jvto#doctor-ahmad-irwandanu`,
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
        },
      };
    }

    // 5) Press screenshots
    if (asset.category === "Press") {
      const pressItem = ssotData.organization_profile.press_coverage?.find(
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
          publisher: pressItem?.publisher
            ? { "@type": "NewsMediaOrganization", name: pressItem.publisher }
            : undefined,
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

    // 7) Legal document previews
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
        about: {
          "@type": "Event",
          name: "JVTO field operation documentation",
          description:
            "Operational evidence photo documenting safety support and logistics execution.",
        },
      };
    }

    // 9) PDFs
    if (fileUrl.toLowerCase().endsWith(".pdf")) {
      return {
        "@type": "DigitalDocument",
        ...propsWithDate,
        url: fileUrl,
        fileFormat: "application/pdf",
        sha256: asset.sha256,
      };
    }

    // Default
    return {
      "@type": "CreativeWork",
      ...propsWithDate,
      url: fileUrl,
      sha256: asset.sha256,
    };
  }

  // Build the evidence graph
  const evidenceGraphNodes = visibleAssets.map(getSchemaForAsset);

  // Build credential nodes (optional but useful)
  const credentialNodes =
    ssotData.verification_credentials?.map((cred: any) => ({
      "@type": "EducationalOccupationalCredential",
      "@id": `${siteUrl}/verify-jvto#cred-${cred.slug}`,
      name: cred.title,
      description: cred.narrative,
      credentialCategory: cred.category || "Verification",
      subjectOf: (cred.evidence_asset_slugs || []).map((slug: string) => ({
        "@id": `${siteUrl}/verify-jvto#asset-${slug}`,
      })),
      identifier: cred.identifiers
        ? Object.entries(cred.identifiers).map(([k, v]) => ({
            "@type": "PropertyValue",
            propertyID: k,
            value: String(v),
          }))
        : undefined,
    })) || [];

  // FAQ
  const faqEntities =
    ssotData.faqs?.map((faq: any) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })) || [];

  // HowTo
  const howToSteps =
    ssotData.health_screening_protocol?.steps?.map(
      (step: any, idx: number) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: step.title,
        text: step.description,
        url: step.url || undefined,
      }),
    ) || [];

  // ---------- Consolidated JSON-LD (validator-friendly) ----------
  // Key changes to reduce errors:
  // - Doctor typed as Person (not Physician) to satisfy strict validators.
  // - potentialAction uses Action (not MedicalTest).
  // - No non-standard MedicalTest fields like instrument/result/status that trigger schema validation complaints.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
      {
        "@type": ["TravelAgency", "EmergencyService"],
        "@id": `${siteUrl}/#organization`,
        name: orgProfile?.brand_name || "Java Volcano Tour Operator",
        legalName: orgProfile?.legal_name || "PT Java Volcano Rendezvous",
        alternateName: orgProfile?.alternate_name || "JVTO",
        url: siteUrl,
        email: "hello@javavolcano-touroperator.com",
        telephone: orgProfile?.contact_phone || "+6282244788833",
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "NIB",
            value: orgProfile?.nib || "1102230032918",
          },
          ...(orgProfile?.tdup
            ? [
                {
                  "@type": "PropertyValue",
                  propertyID: "TDUP",
                  value: orgProfile.tdup,
                },
              ]
            : []),
        ],
        address: orgProfile?.address
          ? {
              "@type": "PostalAddress",
              streetAddress: orgProfile.address.street,
              addressLocality: orgProfile.address.city,
              addressRegion: orgProfile.address.region,
              postalCode: orgProfile.address.postal_code,
              addressCountry: orgProfile.address.country_code || "ID",
            }
          : undefined,
        sameAs: orgProfile?.same_as || [
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          "https://trustpilot.com/review/javavolcano-touroperator.com",
          "https://www.isic.org/discounts/?providerId=259268",
          "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
          "https://www.google.com/maps?cid=1266403973589689021",
        ],
        founder: {
          "@type": "Person",
          "@id": `${siteUrl}/#founder`,
          name: "Agung Sambuko (Mr. Sam)",
          jobTitle: "Founder & Active Tourist Police Officer",
          memberOf: {
            "@type": "GovernmentOrganization",
            name: "Indonesian National Police",
            department: "Ditpamobvit",
          },
        },

        // Medical unit as a department (keep simple + validator-friendly)
        department: {
          "@type": "MedicalBusiness",
          "@id": `${siteUrl}/verify-jvto#ijen-health-screening-unit`,
          name: "Ijen Health Screening Unit",
          description:
            "Mandatory pre-climb vital signs screening before Mount Ijen ascent.",
          parentOrganization: { "@id": `${siteUrl}/#organization` },

          // employee expects Person (avoid Physician type)
          employee: {
            "@type": "Person",
            "@id": `${siteUrl}/verify-jvto#doctor-ahmad-irwandanu`,
            name: "dr. Ahmad Irwandanu",
            jobTitle: "Physician",
            url: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217",
            identifier: [
              {
                "@type": "PropertyValue",
                propertyID: "SIP",
                value: "503.446/193/DRU/4/430.9.13/2020",
              },
              {
                "@type": "PropertyValue",
                propertyID: "STR",
                value: "QN00001073380217",
              },
            ],
          },

          // potentialAction expects Action
          potentialAction: {
            "@type": "Action",
            name: "Complete digital health screening before Mount Ijen ascent",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://health.mountijen.com/",
              inLanguage: "en",
              actionPlatform: [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
              ],
            },
          },
        },

        // Historical recognition as subjectOf (Book node will be present in evidenceGraphNodes too)
        subjectOf: orgProfile?.history?.stefan_loose_isbn
          ? {
              "@type": "Book",
              "@id": `${siteUrl}/verify-jvto#stefan-loose-book`,
              name:
                orgProfile.history.stefan_loose_title ||
                "Stefan Loose Reiseführer Indonesien",
              isbn: orgProfile.history.stefan_loose_isbn,
            }
          : undefined,
      },

      // WebSite
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: orgProfile?.brand_name || "Java Volcano Tour Operator",
        publisher: { "@id": `${siteUrl}/#organization` },
      },

      // Page (CollectionPage)
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/verify-jvto#webpage`,
        url: `${siteUrl}/verify-jvto`,
        name: "Verify JVTO: Digital Evidence Locker",
        description:
          "Central verification hub for PT Java Volcano Rendezvous legal, safety, and historical assets.",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/assets/img/og/verify-jvto.webp`,
        },
      },

      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/verify-jvto#breadcrumbs`,
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
            name: "Verify JVTO",
            item: `${siteUrl}/verify-jvto`,
          },
        ],
      },

      // FAQPage
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/verify-jvto#faq`,
        mainEntity: faqEntities,
      },

      // HowTo (health screening)
      {
        "@type": "HowTo",
        "@id": `${siteUrl}/verify-jvto#howto-health-screening`,
        name: "How JVTO Health Screening Works (Mount Ijen)",
        description:
          "Step-by-step process of the mandatory pre-climb health screening used for Mount Ijen trips.",
        totalTime: "PT10M",
        supply: [
          { "@type": "HowToSupply", name: "Identification (passport/ID)" },
        ],
        tool: [
          { "@type": "HowToTool", name: "Pulse oximeter (SpO2)" },
          { "@type": "HowToTool", name: "Blood pressure monitor" },
        ],
        step: howToSteps,
      },

      // Credentials + evidence assets
      ...credentialNodes,
      ...evidenceGraphNodes,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VerifyJvtoClient ssotData={ssotData} />
    </>
  );
}
