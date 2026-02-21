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

function assetSchemaTypeFromMime(mime?: string): "ImageObject" | "MediaObject" {
  if (mime?.startsWith("image/")) return "ImageObject";
  return "MediaObject";
}

function safeDateIso(d?: string | null): string | undefined {
  if (!d) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  if (/^\d{4}-\d{2}-\d{2}T/.test(d)) return d;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
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
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
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

function assetId(slug: string): string {
  return `${siteUrl}/verify-jvto/assets/${encodeURIComponent(slug)}#media`;
}
function credentialId(id: string): string {
  return `${siteUrl}/verify-jvto/credentials/${encodeURIComponent(id)}#credential`;
}
function personId(slug: string): string {
  return `${siteUrl}/verify-jvto/people/${encodeURIComponent(slug)}#person`;
}
function pressId(slug: string): string {
  return `${siteUrl}/verify-jvto/press/${encodeURIComponent(slug)}#news`;
}
function orgId(slug: string): string {
  return `${siteUrl}/verify-jvto/org/${encodeURIComponent(slug)}#org`;
}

function toSlug(input: string): string {
  return String(input || "")
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
  if (!slug || typeof slug !== "string") return null;

  const contentUrl = getAssetContentUrl(asset);
  if (!contentUrl) return null;

  const previewUrl = toAbsoluteUrl(asset.preview);
  const mime = mimeFromUrl(contentUrl) || mimeFromUrl(previewUrl);
  const type = assetSchemaTypeFromMime(mime);

  const node: AnyRecord = {
    "@id": assetId(slug),
    "@type": type,
    url: contentUrl,
    name: asset.caption || asset.filename || slug,
    description: asset.geo_context || asset.caption || undefined,
    contentUrl,
    encodingFormat: mime,
    uploadDate: safeDateIso(asset.last_verified_iso),
    sha256: asset.sha256 || undefined, // valid for MediaObject/ImageObject in schema.org
    isPartOf: { "@id": `${siteUrl}/verify-jvto#page` },
    additionalProperty: objectToAdditionalProperty(asset, "ssot.asset"),
  };

  // Thumbnail only if different and available
  if (previewUrl && previewUrl !== contentUrl) node.thumbnailUrl = previewUrl;

  // Content size (schema.org MediaObject/ImageObject supports contentSize)
  const sizeBytes = asset.size_bytes ?? null;
  if (typeof sizeBytes === "number" && Number.isFinite(sizeBytes)) {
    node.contentSize = `${sizeBytes} bytes`;
  }

  // Optional: label PDFs as documents without breaking validator
  if (mime === "application/pdf") {
    node.additionalProperty.push(pv("schema.hint", "DigitalDocument"));
  }

  return node;
}

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

  const node: AnyRecord = {
    "@id": credentialId(id),
    "@type": "EducationalOccupationalCredential",
    name: cred.title || id,
    description: cred.geo_narrative || cred.narrative || undefined,
    credentialCategory: cred.category || undefined,
    recognizedBy: { "@id": `${siteUrl}/#organization` },
    subjectOf: subjectOf.length ? subjectOf : undefined,
    additionalProperty: objectToAdditionalProperty(cred, "ssot.credential"),
  };

  // Keep registry URL as a safe identifier (not inventing schema props)
  const registryUrl =
    typeof cred?.identifiers?.registry_url === "string"
      ? cred.identifiers.registry_url
      : undefined;
  const valueId =
    typeof cred?.identifiers?.value === "string"
      ? cred.identifiers.value
      : undefined;

  if (registryUrl) node.identifier = registryUrl;
  if (!node.identifier && valueId) node.identifier = valueId;

  return node;
}

function buildGuidePersonFromKtaAsset(
  asset: AnyRecord,
): { person: AnyRecord; credential: AnyRecord } | null {
  const slug = asset?.slug;
  if (!slug || typeof slug !== "string") return null;
  const m = slug.match(/^kta-(.+)$/);
  if (!m) return null;

  const raw = m[1]; // e.g. "kiki"
  const name = raw
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  const pSlug = `guide-${toSlug(name)}`;

  const credentialNode: AnyRecord = {
    "@id": credentialId(`ijen-guide-license:${raw}`),
    "@type": "EducationalOccupationalCredential",
    name: asset.caption || "Licensed Ijen Guide Credential",
    description: asset.geo_context || undefined,
    recognizedBy: { "@id": `${siteUrl}/#organization` },
    subjectOf: { "@id": assetId(slug) },
    additionalProperty: objectToAdditionalProperty(asset, "ssot.asset"),
  };

  const personNode: AnyRecord = {
    "@id": personId(pSlug),
    "@type": "Person",
    name,
    worksFor: { "@id": `${siteUrl}/#organization` },
    jobTitle: "Licensed Ijen Guide",
    image: { "@id": assetId(slug) },
    hasCredential: [{ "@id": credentialNode["@id"] }],
    additionalProperty: [
      pv("ssot.source", "assets_inventory"),
      pv("ssot.asset_slug", slug),
    ],
  };

  return { person: personNode, credential: credentialNode };
}

/**
 * Fix TravelAgency errors:
 * - SSOT founder.member_of contains non-schema keys: native_name, sub_organization
 * - Convert them into schema-valid Organization props:
 *   - native_name -> alternateName
 *   - sub_organization -> subOrganization (Organization node)
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
    additionalProperty: objectToAdditionalProperty(
      memberOf,
      "ssot.founder.member_of",
    ),
  };

  if (subOrgName) {
    const childSlug = `memberof-${toSlug(name)}-${toSlug(subOrgName)}`;
    const child: AnyRecord = {
      "@id": orgId(childSlug),
      "@type": "Organization",
      name: subOrgName,
      parentOrganization: { "@id": parent["@id"] },
      additionalProperty: [
        pv("ssot.founder.member_of.sub_organization", subOrgName),
      ],
    };

    parent.subOrganization = [{ "@id": child["@id"] }];
    out.push(child);
  }

  out.push(parent);
  return out;
}

function buildFounderNode(
  orgProfile: AnyRecord,
  assetSlugSet: Set<string>,
): AnyRecord | null {
  const f = orgProfile?.founder;
  if (!f || typeof f !== "object") return null;

  const linkedSlug =
    typeof f.linked_asset_slug === "string" ? f.linked_asset_slug : undefined;

  const image =
    linkedSlug && assetSlugSet.has(linkedSlug)
      ? { "@id": assetId(linkedSlug) }
      : undefined;

  // memberOf MUST be schema-safe; do not pass raw SSOT object directly
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
    image,
    memberOf: memberOfId ? [{ "@id": memberOfId }] : undefined,
    additionalProperty: objectToAdditionalProperty(
      f,
      "ssot.organization_profile.founder",
    ),
  };

  // keep knowsAbout as plain values only (safe)
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
    logo: logoUrl
      ? { "@type": "ImageObject", url: logoUrl, contentUrl: logoUrl }
      : undefined,
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
    additionalProperty: objectToAdditionalProperty(
      orgProfile,
      "ssot.organization_profile",
    ),
  };
}

function buildPressNodes(
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

    const slug = toSlug(`${p.publisher || "press"}-${p.title || url}`);
    const evidenceSlug = p?.evidence?.proof_asset_slug;

    out.push({
      "@id": pressId(slug),
      "@type": "NewsArticle",
      headline: p.title,
      url,
      datePublished: safeDateIso(p.date),
      publisher: p.publisher
        ? { "@type": "Organization", name: p.publisher }
        : undefined,
      about: { "@id": `${siteUrl}/#organization` },
      subjectOf:
        typeof evidenceSlug === "string" && assetSlugSet.has(evidenceSlug)
          ? { "@id": assetId(evidenceSlug) }
          : undefined,
      additionalProperty: objectToAdditionalProperty(p, "ssot.press_coverage"),
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
  for (const a of assetsAll)
    if (typeof a?.slug === "string") assetSlugSet.add(a.slug);

  const organizationNode = buildOrganizationNode(orgProfile);
  const founderNode = buildFounderNode(orgProfile, assetSlugSet);

  // Fix TravelAgency errors by converting member_of object → schema-safe org nodes
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

  const credentialNodes: AnyRecord[] = [];
  for (const c of credentials) {
    const node = buildCredentialNode(c, assetSlugSet);
    if (node) credentialNodes.push(node);
  }

  // KTA assets -> Person + Credential nodes (ONLY from shown assets)
  const guidePeople: AnyRecord[] = [];
  const guideCreds: AnyRecord[] = [];
  for (const a of assetsShown) {
    if (a?.category !== "Credentials") continue;
    const built = buildGuidePersonFromKtaAsset(a);
    if (built?.person) guidePeople.push(built.person);
    if (built?.credential) guideCreds.push(built.credential);
  }

  const pressNodes = buildPressNodes(orgProfile, assetSlugSet);

  // Attach "about" references for each shown asset:
  // - Organization
  // - If evidence maps to credential IDs
  const credentialByEvidence: Map<string, string[]> = new Map();
  for (const c of credentials) {
    const id = c?.id;
    const ev: string[] = Array.isArray(c?.evidence_asset_slugs)
      ? c.evidence_asset_slugs
      : [];
    if (!id || typeof id !== "string") continue;
    for (const s of ev) {
      if (typeof s !== "string") continue;
      const list = credentialByEvidence.get(s) || [];
      list.push(id);
      credentialByEvidence.set(s, list);
    }
  }

  for (const node of assetNodes) {
    const slug = decodeURIComponent(
      String(node["@id"]).split("/assets/")[1]?.split("#")[0] || "",
    );

    const about: AnyRecord[] = [{ "@id": `${siteUrl}/#organization` }];

    const credIds = credentialByEvidence.get(slug) || [];
    for (const cid of credIds) about.push({ "@id": credentialId(cid) });

    // KTA -> link to person node
    if (/^kta-/.test(slug)) {
      const raw = slug.replace(/^kta-/, "");
      const personSlug = `guide-${toSlug(raw)}`;
      about.push({ "@id": personId(personSlug) });
    }

    node.about = about;
  }

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
          text: "This page publishes primary-source evidence assets (documents and proof media) intended for verification against original registries and references.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify an evidence asset?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open the evidence item, follow any registry/verification reference provided, and optionally verify file integrity using published SHA-256.",
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
        text: "Use the listed registry reference (if any) to verify authenticity.",
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
      ...founderAffiliationNodes, // fixes native_name/sub_organization errors
      pageNode,
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
