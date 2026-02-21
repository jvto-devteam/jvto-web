// src/app/(website)/verify-jvto/page.tsx
import type { Metadata } from "next";
import VerifyJvtoClient from "./VerifyJvtoClient";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export const metadata: Metadata = {
  title: "Verify JVTO: Forensic Evidence Locker & Legal Documents",
  description:
    "Official verification hub for Java Volcano Tour Operator (JVTO). Browse legal documents, licenses, press references, and cryptographic hashes (SHA-256) to verify authenticity.",
  alternates: {
    canonical: `${siteUrl}/verify-jvto`,
  },
  openGraph: {
    title: "Verify JVTO: Evidence Locker",
    description:
      "Verify JVTO with primary-source documents, QR registries, and SHA-256 hashes.",
    url: `${siteUrl}/verify-jvto`,
    siteName: "Java Volcano Tour Operator",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type AnyRecord = Record<string, any>;

function toAbsoluteUrl(u?: string | null): string | null {
  if (!u) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(u);
    return u;
  } catch {
    if (u.startsWith("/")) return `${siteUrl}${u}`;
    return `${siteUrl}/${u}`;
  }
}

function mimeFromUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const u = url.toLowerCase();
  if (u.endsWith(".pdf")) return "application/pdf";
  if (u.endsWith(".webp")) return "image/webp";
  if (u.endsWith(".png")) return "image/png";
  if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
  if (u.endsWith(".gif")) return "image/gif";
  if (u.endsWith(".svg")) return "image/svg+xml";
  return undefined;
}

function assetTypeFromUrl(
  url?: string | null,
): "DigitalDocument" | "ImageObject" | "MediaObject" {
  const mime = mimeFromUrl(url);
  if (mime === "application/pdf") return "DigitalDocument";
  if (mime?.startsWith("image/")) return "ImageObject";
  return "MediaObject";
}

function pv(name: string, value: any): AnyRecord {
  const v =
    value === null || value === undefined
      ? undefined
      : typeof value === "object"
        ? JSON.stringify(value)
        : value;
  return { "@type": "PropertyValue", name, value: v };
}

function objectToAdditionalProperty(obj: AnyRecord, prefix = ""): AnyRecord[] {
  const out: AnyRecord[] = [];
  const entries = Object.entries(obj || {});
  for (const [k, v] of entries) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v === null || v === undefined) continue;

    if (Array.isArray(v)) {
      // store arrays as JSON string to preserve full SSOT without inventing schema props
      out.push(pv(key, JSON.stringify(v)));
      continue;
    }
    if (typeof v === "object") {
      out.push(...objectToAdditionalProperty(v as AnyRecord, key));
      continue;
    }
    out.push(pv(key, v));
  }
  return out;
}

function safeDateIso(d?: string | null): string | undefined {
  if (!d) return undefined;
  // Accept YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // Accept ISO date-time
  if (/^\d{4}-\d{2}-\d{2}T/.test(d)) return d;
  // Try parse (best-effort) but do not invent if invalid
  const t = Date.parse(d);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
}

function assetId(slug: string): string {
  return `${siteUrl}/verify-jvto/assets/${encodeURIComponent(slug)}#media`;
}

function credentialId(credId: string): string {
  return `${siteUrl}/verify-jvto/credentials/${encodeURIComponent(
    credId,
  )}#credential`;
}

function personId(slug: string): string {
  return `${siteUrl}/verify-jvto/people/${encodeURIComponent(slug)}#person`;
}

function newsId(slug: string): string {
  return `${siteUrl}/verify-jvto/press/${encodeURIComponent(slug)}#news`;
}

function toSlugFromName(n: string): string {
  return n
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getAssetContentUrl(asset: AnyRecord): string | null {
  return (
    toAbsoluteUrl(asset.file_url) ||
    toAbsoluteUrl(asset.url) ||
    toAbsoluteUrl(asset.preview) ||
    null
  );
}

function buildAssetNode(asset: AnyRecord): AnyRecord | null {
  const slug = asset?.slug;
  if (!slug) return null;

  const contentUrl = getAssetContentUrl(asset);
  if (!contentUrl) return null;

  const previewUrl = toAbsoluteUrl(asset.preview);
  const encodingFormat = mimeFromUrl(contentUrl) || mimeFromUrl(previewUrl);

  const node: AnyRecord = {
    "@id": assetId(slug),
    "@type": assetTypeFromUrl(contentUrl),
    name: asset.caption || asset.filename || slug,
    description: asset.geo_context || asset.caption || undefined,
    contentUrl,
    encodingFormat,
    sha256: asset.sha256 || undefined,
    uploadDate: safeDateIso(asset.last_verified_iso),
    dateModified: safeDateIso(asset.last_verified_iso),
    isPartOf: { "@id": `${siteUrl}/verify-jvto#page` },
    additionalProperty: objectToAdditionalProperty(asset, "ssot.asset"),
  };

  if (previewUrl && previewUrl !== contentUrl) {
    node.thumbnailUrl = previewUrl;
  }

  // File size (if present)
  const sizeBytes = asset.size_bytes ?? null;
  const sizeMb = asset.size_mb ?? null;
  if (typeof sizeBytes === "number" && Number.isFinite(sizeBytes))
    node.contentSize = `${sizeBytes} bytes`;
  if (typeof sizeMb === "number" && Number.isFinite(sizeMb))
    node.additionalProperty.push(pv("ssot.asset.size_mb", sizeMb));

  return node;
}

function buildCredentialNode(
  cred: AnyRecord,
  assetSlugSet: Set<string>,
): AnyRecord | null {
  const cid = cred?.id;
  if (!cid) return null;

  const evidenceSlugs: string[] = Array.isArray(cred.evidence_asset_slugs)
    ? cred.evidence_asset_slugs.filter((s: any) => typeof s === "string")
    : [];

  const subjectOf = evidenceSlugs
    .filter((s) => assetSlugSet.has(s))
    .map((s) => ({ "@id": assetId(s) }));

  const node: AnyRecord = {
    "@id": credentialId(cid),
    "@type": "EducationalOccupationalCredential",
    name: cred.title || cid,
    description: cred.narrative || cred.geo_narrative || undefined,
    credentialCategory: cred.category || undefined,
    identifier:
      (typeof cred?.identifiers?.value === "string" &&
        cred.identifiers.value) ||
      (typeof cred?.identifiers?.registry_url === "string" &&
        cred.identifiers.registry_url) ||
      undefined,
    subjectOf: subjectOf.length ? subjectOf : undefined,
    recognizedBy: { "@id": `${siteUrl}/#organization` },
    additionalProperty: objectToAdditionalProperty(cred, "ssot.credential"),
  };

  return node;
}

function buildGuidePersonFromCredentialAsset(
  asset: AnyRecord,
): { person: AnyRecord; credential: AnyRecord } | null {
  // Expected slugs like "kta-kiki"
  const slug = asset?.slug;
  if (!slug || typeof slug !== "string") return null;

  const m = slug.match(/^kta-(.+)$/);
  if (!m) return null;

  const rawName = m[1];
  const name = rawName
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  const personSlug = `guide-${toSlugFromName(name)}`;

  const person: AnyRecord = {
    "@id": personId(personSlug),
    "@type": "Person",
    name,
    worksFor: { "@id": `${siteUrl}/#organization` },
    description: asset.geo_context || asset.caption || undefined,
    image: { "@id": assetId(slug) },
    additionalProperty: [
      pv("ssot.source", "assets_inventory"),
      pv("ssot.asset_slug", slug),
    ],
  };

  // Represent the card itself as a credential linked to the person
  const credential: AnyRecord = {
    "@id": credentialId(`ijen-guide-license:${rawName}`),
    "@type": "EducationalOccupationalCredential",
    name: asset.caption || "Ijen guide credential",
    description: asset.geo_context || undefined,
    subjectOf: { "@id": assetId(slug) },
    recognizedBy: { "@id": `${siteUrl}/#organization` },
    additionalProperty: objectToAdditionalProperty(asset, "ssot.asset"),
  };

  person.hasCredential = [{ "@id": credential["@id"] }];

  return { person, credential };
}

function buildFounder(
  orgProfile: AnyRecord,
  assetSlugSet: Set<string>,
): AnyRecord | null {
  const f = orgProfile?.founder;
  if (!f) return null;

  const founderId = f["@id"] || `${siteUrl}/#founder`;
  const linkedSlug = f.linked_asset_slug;
  const imageAsset =
    typeof linkedSlug === "string" && assetSlugSet.has(linkedSlug)
      ? { "@id": assetId(linkedSlug) }
      : undefined;

  const node: AnyRecord = {
    "@id": founderId,
    "@type": "Person",
    name: f.name,
    jobTitle: f.job_title,
    description: f.description,
    knowsAbout: f.knows_about,
    memberOf: f.member_of,
    worksFor: { "@id": `${siteUrl}/#organization` },
    image: imageAsset,
    additionalProperty: objectToAdditionalProperty(
      f,
      "ssot.organization_profile.founder",
    ),
  };

  return node;
}

function buildOrganization(
  orgProfile: AnyRecord,
  assetSlugSet: Set<string>,
): AnyRecord {
  const logoUrl = toAbsoluteUrl(orgProfile?.digital_presence?.logo_url);
  const heroUrl = toAbsoluteUrl(orgProfile?.digital_presence?.hero_image_url);
  const address = orgProfile?.address || {};
  const contact = orgProfile?.contact_point || {};
  const founder = orgProfile?.founder || {};

  const sameAs: string[] = [];
  const dp = orgProfile?.digital_presence || {};
  for (const v of Object.values(dp)) {
    if (typeof v === "string") sameAs.push(v);
  }
  const spa = Array.isArray(orgProfile?.social_proof_and_authority)
    ? orgProfile.social_proof_and_authority
    : [];
  for (const item of spa) {
    if (item?.url && typeof item.url === "string") sameAs.push(item.url);
  }

  const orgNode: AnyRecord = {
    "@id": orgProfile?.["@id"] || `${siteUrl}/#organization`,
    "@type": "TravelAgency",
    name:
      orgProfile?.brand_name ||
      orgProfile?.legal_name ||
      "Java Volcano Tour Operator",
    legalName: orgProfile?.legal_name,
    alternateName: orgProfile?.alternate_name,
    description: orgProfile?.description,
    foundingDate:
      safeDateIso(orgProfile?.founding_date) || orgProfile?.founding_date,
    priceRange: orgProfile?.price_range,
    areaServed: orgProfile?.area_served,
    url: toAbsoluteUrl(dp.website) || `${siteUrl}/`,
    logo: logoUrl ? { "@type": "ImageObject", contentUrl: logoUrl } : undefined,
    image: heroUrl || logoUrl || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street_address,
      addressLocality: address.address_locality,
      addressRegion: address.address_region,
      postalCode: address.postal_code,
      addressCountry: address.address_country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: contact.contact_type || "Customer Service",
      email: contact.email,
      telephone: contact.telephone,
      availableLanguage: contact.available_languages,
    },
    founder: founder?.["@id"] ? { "@id": founder["@id"] } : undefined,
    sameAs: sameAs.length ? Array.from(new Set(sameAs)) : undefined,
    additionalProperty: objectToAdditionalProperty(
      orgProfile,
      "ssot.organization_profile",
    ),
  };

  // Link founder portrait asset if available
  const linkedSlug = founder?.linked_asset_slug;
  if (typeof linkedSlug === "string" && assetSlugSet.has(linkedSlug)) {
    orgNode.additionalProperty.push(
      pv("ssot.organization_profile.founder.linked_asset_slug", linkedSlug),
    );
  }

  return orgNode;
}

function buildPressArticles(
  orgProfile: AnyRecord,
  assetSlugSet: Set<string>,
): AnyRecord[] {
  const press = Array.isArray(orgProfile?.press_coverage)
    ? orgProfile.press_coverage
    : [];
  const out: AnyRecord[] = [];

  for (const p of press) {
    if (!p || typeof p !== "object") continue;
    const url = typeof p.url === "string" ? p.url : undefined;
    if (!url) continue;

    const slug = toSlugFromName(`${p.publisher || "press"}-${p.title || url}`);
    const evidenceSlug = p?.evidence?.proof_asset_slug;
    const subjectOf =
      typeof evidenceSlug === "string" && assetSlugSet.has(evidenceSlug)
        ? { "@id": assetId(evidenceSlug) }
        : undefined;

    out.push({
      "@id": newsId(slug),
      "@type": "NewsArticle",
      headline: p.title,
      datePublished: safeDateIso(p.date) || undefined,
      url,
      publisher: p.publisher
        ? { "@type": "Organization", name: p.publisher }
        : undefined,
      about: { "@id": `${siteUrl}/#organization` },
      subjectOf,
      additionalProperty: objectToAdditionalProperty(p, "ssot.press_coverage"),
    });
  }

  return out;
}

export default function VerifyJvtoPage() {
  const orgProfile: AnyRecord =
    (ssotData as AnyRecord).organization_profile || {};
  const assets: AnyRecord[] = Array.isArray(
    (ssotData as AnyRecord).assets_inventory,
  )
    ? (ssotData as AnyRecord).assets_inventory
    : [];
  const credentials: AnyRecord[] = Array.isArray(
    (ssotData as AnyRecord).verification_credentials,
  )
    ? (ssotData as AnyRecord).verification_credentials
    : [];

  const assetSlugSet = new Set<string>();
  for (const a of assets) {
    if (a?.slug && typeof a.slug === "string") assetSlugSet.add(a.slug);
  }

  const organizationNode = buildOrganization(orgProfile, assetSlugSet);
  const founderNode = buildFounder(orgProfile, assetSlugSet);

  const pageNode: AnyRecord = {
    "@id": `${siteUrl}/verify-jvto#page`,
    "@type": "CollectionPage",
    url: `${siteUrl}/verify-jvto`,
    name: String(metadata.title),
    description: String(metadata.description),
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    hasPart: assets
      .filter((a) => a?.slug && a.is_show === true)
      .map((a) => ({ "@id": assetId(a.slug) })),
    additionalProperty: objectToAdditionalProperty(
      (ssotData as AnyRecord).meta || {},
      "ssot.meta",
    ),
  };

  const websiteNode: AnyRecord = {
    "@id": `${siteUrl}/#website`,
    "@type": "WebSite",
    url: `${siteUrl}/`,
    name: organizationNode.name,
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  // Full-SSOT preservation node: keeps *all* SSOT fields in a schema-safe way (additionalProperty)
  const datasetNode: AnyRecord = {
    "@id": `${siteUrl}/verify-jvto#dataset:ssot`,
    "@type": "Dataset",
    name: "JVTO SSOT (Single Source of Truth)",
    description:
      "Structured dataset used to generate the Verify JVTO evidence locker page and the associated JSON-LD knowledge graph.",
    creator: { "@id": `${siteUrl}/#organization` },
    isBasedOn: { "@id": `${siteUrl}/verify-jvto#page` },
    additionalProperty: objectToAdditionalProperty(
      ssotData as AnyRecord,
      "ssot",
    ),
  };

  const assetNodes: AnyRecord[] = [];
  for (const a of assets) {
    const node = buildAssetNode(a);
    if (node) assetNodes.push(node);
  }

  const credentialNodes: AnyRecord[] = [];
  for (const c of credentials) {
    const node = buildCredentialNode(c, assetSlugSet);
    if (node) credentialNodes.push(node);
  }

  // Create Person + Credential nodes from credential-card assets (kta-*)
  const guidePeople: AnyRecord[] = [];
  const guideCreds: AnyRecord[] = [];
  for (const a of assets) {
    if (a?.category !== "Credentials") continue;
    const built = buildGuidePersonFromCredentialAsset(a);
    if (built?.person) guidePeople.push(built.person);
    if (built?.credential) guideCreds.push(built.credential);
  }

  // Press article nodes (from SSOT organization_profile.press_coverage)
  const pressNodes = buildPressArticles(orgProfile, assetSlugSet);

  // Map evidence assets -> credentials
  const credentialByEvidence: Map<string, AnyRecord[]> = new Map();
  for (const c of credentials) {
    const ev: string[] = Array.isArray(c?.evidence_asset_slugs)
      ? c.evidence_asset_slugs
      : [];
    for (const s of ev) {
      if (typeof s !== "string") continue;
      const list = credentialByEvidence.get(s) || [];
      list.push(c);
      credentialByEvidence.set(s, list);
    }
  }

  // Populate asset.about links (Org + related credential/person if determinable from SSOT)
  for (const node of assetNodes) {
    const slugMatch = decodeURIComponent(
      String(node["@id"]).split("/assets/")[1]?.split("#")[0] || "",
    );

    const about: AnyRecord[] = [{ "@id": `${siteUrl}/#organization` }];

    const evid = credentialByEvidence.get(slugMatch) || [];
    for (const c of evid) {
      if (c?.id) about.push({ "@id": credentialId(c.id) });
    }

    if (/^kta-/.test(slugMatch)) {
      const raw = slugMatch.replace(/^kta-/, "");
      const personSlug = `guide-${toSlugFromName(raw)}`;
      about.push({ "@id": personId(personSlug) });
    }

    node.about = about;
  }

  const breadcrumbSchema: AnyRecord = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/verify-jvto#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Verify JVTO",
        item: `${siteUrl}/verify-jvto`,
      },
    ],
  };

  // Keep these minimal to avoid introducing non-SSOT facts.
  const faqSchema: AnyRecord = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/verify-jvto#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is this page?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This page publishes primary-source evidence (documents, IDs, and proof images) and their SHA-256 hashes to help verify authenticity using the original source registries and the uploaded files.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify a document?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open the document and use the registry URL (if provided) to verify status at the issuing registry. If a SHA-256 hash is provided, you can compute the hash of the downloaded file and compare it to the published hash.",
        },
      },
    ],
  };

  const howToSchema: AnyRecord = {
    "@type": "HowTo",
    "@id": `${siteUrl}/verify-jvto#howto`,
    name: "How to verify JVTO evidence",
    step: [
      {
        "@type": "HowToStep",
        name: "Open an evidence item",
        text: "Choose an evidence item (document or proof image) from the evidence locker.",
      },
      {
        "@type": "HowToStep",
        name: "Verify at the original registry",
        text: "If the evidence lists a registry URL or QR verification link, open it to validate the record at the issuing source.",
      },
      {
        "@type": "HowToStep",
        name: "Optional: verify file integrity via SHA-256",
        text: "If a SHA-256 hash is published, compute the SHA-256 of the downloaded file locally and compare it to the published hash.",
      },
    ],
  };

  const jsonLd: AnyRecord = {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode,
      organizationNode,
      ...(founderNode ? [founderNode] : []),
      pageNode,
      datasetNode,
      ...credentialNodes,
      ...guidePeople,
      ...guideCreds,
      ...pressNodes,
      ...assetNodes,
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
