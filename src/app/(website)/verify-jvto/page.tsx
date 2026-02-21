// src/app/(website)/verify-jvto/page.tsx
import type { Metadata } from "next";
import VerifyJvtoClient from "./VerifyJvtoClient";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export const metadata: Metadata = {
  title: "Verify JVTO: Evidence Locker",
  description:
    "Primary-source verification hub for Java Volcano Tour Operator (JVTO). Browse evidence assets and reference registries.",
  alternates: { canonical: `${siteUrl}/verify-jvto` },
  robots: { index: true, follow: true },
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

function safeDateIso(d?: string | null): string | undefined {
  if (!d) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  if (/^\d{4}-\d{2}-\d{2}T/.test(d)) return d;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
}

function mimeFromUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const u = url.toLowerCase().split("?")[0];
  if (u.endsWith(".pdf")) return "application/pdf";
  if (u.endsWith(".webp")) return "image/webp";
  if (u.endsWith(".png")) return "image/png";
  if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
  if (u.endsWith(".gif")) return "image/gif";
  if (u.endsWith(".svg")) return "image/svg+xml";
  return undefined;
}

function schemaTypeForAsset(mime?: string): "ImageObject" | "MediaObject" {
  if (mime?.startsWith("image/")) return "ImageObject";
  return "MediaObject";
}

function toSlug(input: string): string {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function assetId(slug: string): string {
  return `${siteUrl}/verify-jvto/assets/${encodeURIComponent(slug)}#media`;
}
function credentialId(id: string): string {
  return `${siteUrl}/verify-jvto/credentials/${encodeURIComponent(id)}#credential`;
}
function personId(slug: string): string {
  return `${siteUrl}/verify-jvto/people/${encodeURIComponent(slug)}#person`;
}
function orgId(slug: string): string {
  return `${siteUrl}/verify-jvto/org/${encodeURIComponent(slug)}#org`;
}
function pressId(slug: string): string {
  return `${siteUrl}/verify-jvto/press/${encodeURIComponent(slug)}#work`;
}

function getAssetContentUrl(asset: AnyRecord): string | null {
  // Prefer original, then fallback
  return (
    toAbsoluteUrl(asset.file_url) ||
    toAbsoluteUrl(asset.url) ||
    toAbsoluteUrl(asset.preview) ||
    null
  );
}

function getBestImageUrl(asset: AnyRecord): string | null {
  // For Person.image, prefer preview image if available
  return toAbsoluteUrl(asset.preview) || getAssetContentUrl(asset);
}

/**
 * Asset node rules (schema.org-safe):
 * - Use MediaObject / ImageObject (NOT DigitalDocument) so contentUrl/uploadDate/sha256/contentSize are valid.  (schema.org)
 * - Keep everything schema-safe (no custom fields).
 */
function buildAssetNode(asset: AnyRecord): AnyRecord | null {
  const slug = asset?.slug;
  if (!slug || typeof slug !== "string") return null;

  const contentUrl = getAssetContentUrl(asset);
  if (!contentUrl) return null;

  const previewUrl = toAbsoluteUrl(asset.preview);
  const mime = mimeFromUrl(contentUrl) || mimeFromUrl(previewUrl);
  const type = schemaTypeForAsset(mime);

  const node: AnyRecord = {
    "@id": assetId(slug),
    "@type": type,
    name: asset.caption || asset.filename || slug,
    description: asset.geo_context || asset.caption || undefined,
    contentUrl, // MediaObject/ImageObject supports contentUrl
    encodingFormat: mime,
    uploadDate: safeDateIso(asset.last_verified_iso), // MediaObject supports uploadDate
    dateModified: safeDateIso(asset.last_verified_iso),
    sha256: asset.sha256 || undefined, // schema.org sha256 exists
    isPartOf: { "@id": `${siteUrl}/verify-jvto#page` },
  };

  if (previewUrl && previewUrl !== contentUrl) node.thumbnailUrl = previewUrl;

  const sizeBytes = asset.size_bytes ?? null;
  if (typeof sizeBytes === "number" && Number.isFinite(sizeBytes)) {
    node.contentSize = `${sizeBytes} bytes`;
  }

  // Link to organization as the primary subject
  node.about = [{ "@id": `${siteUrl}/#organization` }];

  return node;
}

/**
 * Credentials:
 * Keep ONLY schema-valid fields to avoid validator errors.
 */
function buildCredentialNode(
  cred: AnyRecord,
  assetSlugSet: Set<string>,
): AnyRecord | null {
  const id = cred?.id;
  if (!id || typeof id !== "string") return null;

  const evidenceSlugs: string[] = Array.isArray(cred.evidence_asset_slugs)
    ? cred.evidence_asset_slugs.filter((s: any) => typeof s === "string")
    : [];

  const subjectOf = evidenceSlugs
    .filter((s) => assetSlugSet.has(s))
    .map((s) => ({ "@id": assetId(s) }));

  const registryUrl =
    typeof cred?.identifiers?.registry_url === "string"
      ? cred.identifiers.registry_url
      : undefined;

  const node: AnyRecord = {
    "@id": credentialId(id),
    "@type": "EducationalOccupationalCredential",
    name: cred.title || id,
    description: cred.geo_narrative || cred.narrative || undefined,
    credentialCategory: cred.category || undefined,
    recognizedBy: { "@id": `${siteUrl}/#organization` },
    url: registryUrl || undefined,
    subjectOf: subjectOf.length ? subjectOf : undefined,
  };

  return node;
}

/**
 * KTA assets -> Person + Credential nodes
 * Person.image must be URL or ImageObject. To avoid type mismatch errors,
 * use direct URL (preview) instead of referencing an @id that might not be ImageObject.
 */
function buildGuideNodesFromKtaAsset(asset: AnyRecord): AnyRecord[] {
  const slug = asset?.slug;
  if (!slug || typeof slug !== "string") return [];
  const m = slug.match(/^kta-(.+)$/);
  if (!m) return [];

  const raw = m[1];
  const name = raw
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  const pSlug = `guide-${toSlug(name)}`;
  const imgUrl = getBestImageUrl(asset);

  const credNode: AnyRecord = {
    "@id": credentialId(`ijen-guide-license:${raw}`),
    "@type": "EducationalOccupationalCredential",
    name: asset.caption || "Licensed Ijen Guide Credential",
    description: asset.geo_context || undefined,
    recognizedBy: { "@id": `${siteUrl}/#organization` },
    subjectOf: { "@id": assetId(slug) },
  };

  const personNode: AnyRecord = {
    "@id": personId(pSlug),
    "@type": "Person",
    name,
    worksFor: { "@id": `${siteUrl}/#organization` },
    jobTitle: "Licensed Ijen Guide",
    image: imgUrl || undefined, // URL
    hasCredential: [{ "@id": credNode["@id"] }],
  };

  return [personNode, credNode];
}

/**
 * Founder affiliation:
 * SSOT uses native_name and sub_organization which are not schema.org props.
 * Convert to:
 * - alternateName
 * - subOrganization (Organization node)
 */
function buildFounderAffiliationNodes(founder: AnyRecord): AnyRecord[] {
  const out: AnyRecord[] = [];
  const memberOf = founder?.member_of;
  if (!memberOf || typeof memberOf !== "object") return out;

  const type = memberOf["@type"] || "Organization";
  const name = memberOf.name;
  if (!name || typeof name !== "string") return out;

  const nativeName =
    typeof memberOf.native_name === "string" ? memberOf.native_name : undefined;
  const subOrgName =
    typeof memberOf.sub_organization === "string"
      ? memberOf.sub_organization
      : undefined;

  const parentSlug = `memberof-${toSlug(name)}`;
  const parent: AnyRecord = {
    "@id": orgId(parentSlug),
    "@type": type,
    name,
    alternateName: nativeName,
  };

  if (subOrgName) {
    const childSlug = `memberof-${toSlug(name)}-${toSlug(subOrgName)}`;
    const child: AnyRecord = {
      "@id": orgId(childSlug),
      "@type": "Organization",
      name: subOrgName,
      parentOrganization: { "@id": parent["@id"] },
    };
    parent.subOrganization = [{ "@id": child["@id"] }];
    out.push(child);
  }

  out.push(parent);
  return out;
}

function buildFounderNode(
  orgProfile: AnyRecord,
  assetBySlug: Map<string, AnyRecord>,
): AnyRecord | null {
  const f = orgProfile?.founder;
  if (!f || typeof f !== "object") return null;

  const linkedSlug =
    typeof f.linked_asset_slug === "string" ? f.linked_asset_slug : undefined;
  const linkedAsset = linkedSlug ? assetBySlug.get(linkedSlug) : undefined;
  const imgUrl = linkedAsset ? getBestImageUrl(linkedAsset) : null;

  const memberOfObj = f.member_of;
  const memberOfName = memberOfObj?.name;
  const memberOfId =
    typeof memberOfName === "string"
      ? orgId(`memberof-${toSlug(memberOfName)}`)
      : undefined;

  const node: AnyRecord = {
    "@id": f["@id"] || `${siteUrl}/#founder`,
    "@type": "Person",
    name: f.name,
    jobTitle: f.job_title,
    description: f.description,
    worksFor: { "@id": `${siteUrl}/#organization` },
    image: imgUrl || undefined, // URL (avoid type mismatch)
    memberOf: memberOfId ? [{ "@id": memberOfId }] : undefined,
  };

  if (Array.isArray(f.knows_about)) {
    node.knowsAbout = f.knows_about.filter((x: any) => typeof x === "string");
  }

  return node;
}

function buildOrganizationNode(orgProfile: AnyRecord): AnyRecord {
  const dp = orgProfile?.digital_presence || {};
  const address = orgProfile?.address || {};
  const contact = orgProfile?.contact_point || {};

  const sameAs: string[] = [];
  for (const v of Object.values(dp)) if (typeof v === "string") sameAs.push(v);
  const spa = Array.isArray(orgProfile?.social_proof_and_authority)
    ? orgProfile.social_proof_and_authority
    : [];
  for (const item of spa)
    if (typeof item?.url === "string") sameAs.push(item.url);

  const logoUrl = toAbsoluteUrl(dp.logo_url);
  const heroUrl = toAbsoluteUrl(dp.hero_image_url);

  return {
    "@id": orgProfile?.["@id"] || `${siteUrl}/#organization`,
    "@type": "TravelAgency",
    name:
      orgProfile?.brand_name ||
      orgProfile?.legal_name ||
      "Java Volcano Tour Operator",
    legalName: orgProfile?.legal_name,
    alternateName: orgProfile?.alternate_name,
    description: orgProfile?.description,
    foundingDate: safeDateIso(orgProfile?.founding_date),
    priceRange: orgProfile?.price_range,
    areaServed: orgProfile?.area_served,
    url: toAbsoluteUrl(dp.website) || `${siteUrl}/`,
    logo: logoUrl ? logoUrl : undefined, // URL is allowed
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
    sameAs: sameAs.length ? Array.from(new Set(sameAs)) : undefined,
  };
}

/**
 * PRESS: Avoid NewsArticle type to stop validator from throwing many errors.
 * Use CreativeWork + additionalType "https://schema.org/NewsArticle".
 */
function buildPressNodes(orgProfile: AnyRecord): AnyRecord[] {
  const press = Array.isArray(orgProfile?.press_coverage)
    ? orgProfile.press_coverage
    : [];
  const out: AnyRecord[] = [];

  for (const p of press) {
    if (!p || typeof p !== "object") continue;
    const url = typeof p.url === "string" ? p.url : undefined;
    if (!url) continue;

    const slug = toSlug(`${p.publisher || "press"}-${p.title || url}`);

    out.push({
      "@id": pressId(slug),
      "@type": "CreativeWork",
      additionalType: "https://schema.org/NewsArticle",
      name: p.title || url,
      url,
      datePublished: safeDateIso(p.date),
      publisher: p.publisher
        ? { "@type": "Organization", name: p.publisher }
        : undefined,
      about: { "@id": `${siteUrl}/#organization` },
    });
  }

  return out;
}

export default function VerifyJvtoPage() {
  const ssot = ssotData as AnyRecord;
  const orgProfile: AnyRecord = ssot.organization_profile || {};

  const assetsAll: AnyRecord[] = Array.isArray(ssot.assets_inventory)
    ? ssot.assets_inventory
    : [];
  const assetsShown = assetsAll.filter((a) => a?.is_show === true);

  const credentials: AnyRecord[] = Array.isArray(ssot.verification_credentials)
    ? ssot.verification_credentials
    : [];

  const assetSlugSet = new Set<string>();
  const assetBySlug = new Map<string, AnyRecord>();
  for (const a of assetsAll) {
    if (typeof a?.slug === "string") {
      assetSlugSet.add(a.slug);
      assetBySlug.set(a.slug, a);
    }
  }

  const organizationNode = buildOrganizationNode(orgProfile);
  const founderNode = buildFounderNode(orgProfile, assetBySlug);
  const founderAffiliationNodes = buildFounderAffiliationNodes(
    orgProfile?.founder,
  );

  const websiteNode: AnyRecord = {
    "@id": `${siteUrl}/#website`,
    "@type": "WebSite",
    url: `${siteUrl}/`,
    name: organizationNode.name,
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  const pageNode: AnyRecord = {
    "@id": `${siteUrl}/verify-jvto#page`,
    "@type": "CollectionPage",
    url: `${siteUrl}/verify-jvto`,
    name: String(metadata.title),
    description: String(metadata.description),
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    hasPart: assetsShown
      .filter((a) => typeof a?.slug === "string")
      .map((a) => ({ "@id": assetId(a.slug) })),
  };

  // Assets: ONLY is_show === true
  const assetNodes: AnyRecord[] = [];
  for (const a of assetsShown) {
    const node = buildAssetNode(a);
    if (node) assetNodes.push(node);
  }

  // Credentials
  const credentialNodes: AnyRecord[] = [];
  for (const c of credentials) {
    const node = buildCredentialNode(c, assetSlugSet);
    if (node) credentialNodes.push(node);
  }

  // KTA -> Person + Credential (ONLY if asset is_show true)
  const peopleAndKtaCreds: AnyRecord[] = [];
  for (const a of assetsShown) {
    if (a?.category !== "Credentials") continue;
    for (const node of buildGuideNodesFromKtaAsset(a))
      peopleAndKtaCreds.push(node);
  }

  // Press
  const pressNodes = buildPressNodes(orgProfile);

  // SSOT as Dataset (super kaya, schema-safe)
  const ssotDataset: AnyRecord = {
    "@id": `${siteUrl}/verify-jvto#dataset-ssot`,
    "@type": "Dataset",
    name: "JVTO SSOT (Single Source of Truth)",
    description:
      "Internal structured dataset used to generate the Verify JVTO evidence locker and JSON-LD graph.",
    creator: { "@id": `${siteUrl}/#organization` },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${siteUrl}/ssot/Master_Dataset_JVTO.SSOT.v3.0.json`,
      },
    ],
    // Keep full SSOT without non-schema fields: put it into `text` (valid on CreativeWork/Thing contexts in schema usage)
    text: JSON.stringify(ssot),
  };

  const breadcrumbSchema: AnyRecord = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/verify-jvto#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Verify JVTO",
        item: `${siteUrl}/verify-jvto`,
      },
    ],
  };

  const faqSchema: AnyRecord = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/verify-jvto#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is this page?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This page publishes primary-source evidence assets (documents and proof media) intended for verification against original references.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify an evidence asset?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open the evidence item, follow any listed reference links (if present), and optionally verify file integrity using SHA-256 when provided.",
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
        text: "Choose an evidence item from the locker.",
      },
      {
        "@type": "HowToStep",
        name: "Check the issuing reference",
        text: "Use the listed reference (if any) to verify authenticity.",
      },
      {
        "@type": "HowToStep",
        name: "Optional: verify SHA-256",
        text: "Compute SHA-256 for the downloaded file and compare with the published value.",
      },
    ],
  };

  const jsonLd: AnyRecord = {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode,
      organizationNode,
      ...(founderNode ? [founderNode] : []),
      ...founderAffiliationNodes,

      pageNode,

      // Dataset SSOT (super kaya, schema-safe)
      ssotDataset,

      // Credentials / People
      ...credentialNodes,
      ...peopleAndKtaCreds,

      // Press as CreativeWork (avoid NewsArticle validator errors)
      ...pressNodes,

      // Assets (should surface as MediaObject/ImageObject and count should match is_show true)
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
