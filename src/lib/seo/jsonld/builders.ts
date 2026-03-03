// lib/seo/jsonld/builders.ts
type Seo = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
};

type OrgRow = {
  legal_name?: string | null;
  brand_name?: string | null;
  alternate_name?: string | null;
  founding_date?: Date | null;
  description?: string | null;
  price_range?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  available_languages?: string[] | null;
  address_json?: any | null;
  same_as_urls?: string[] | null;
  website_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  schema_json?: any | null;
  updated_at?: Date | null;
};

type PageRowLike = {
  route: string;
  lang: string;
  seo: any;
  content: any;
  created_at?: Date;
  updated_at?: Date;
};

const DEFAULT_SITE = "https://javavolcano-touroperator.com";

function absUrl(siteUrl: string, pathOrUrl: string) {
  if (!pathOrUrl) return siteUrl;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://"))
    return pathOrUrl;
  return `${siteUrl.replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function safeIso(d?: Date | null) {
  if (!d) return undefined;
  try {
    return d.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Kamu bisa tambah mapping label khusus agar breadcrumb lebih “human”.
 * Fallback: Title Case dari slug.
 */
export function buildBreadcrumbItems(route: string, siteUrl = DEFAULT_SITE) {
  const clean = route.split("?")[0].split("#")[0];
  const segs = clean.split("/").filter(Boolean);

  const labelMap: Record<string, string> = {
    "travel-guide": "Travel Guide",
    policy: "Policy",
    "why-jvto": "Why JVTO",
    faq: "FAQ",
    "booking-information": "Booking Information",
    "booking-payment-cancellation": "Booking, Payment & Cancellation",
    "inclusions-exclusions": "Inclusions & Exclusions",
    privacy: "Privacy Policy",
    "ijen-health-screening": "Ijen Health Screening",
    "safety-on-tours": "Safety on Tours",
    "packing-and-fitness": "Packing & Fitness",
    "weather-and-closures": "Weather & Closures",
    "police-escort-for-groups": "Police Escort for Groups",
    "the-jvto-difference": "The JVTO Difference",
    "our-story": "Our Story",
    "our-team": "Our Team",
    reviews: "Reviews",
    "community-standards": "Community Standards",
  };

  const items: Array<{ name: string; item: string }> = [
    { name: "Home", item: absUrl(siteUrl, "/") },
  ];

  let acc = "";
  for (const s of segs) {
    acc += `/${s}`;
    items.push({
      name: labelMap[s] ?? titleCaseFromSlug(s),
      item: absUrl(siteUrl, acc),
    });
  }

  return items;
}

export function buildBreadcrumbJsonLd(route: string, siteUrl = DEFAULT_SITE) {
  const items = buildBreadcrumbItems(route, siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

/**
 * Organization/LocalBusiness:
 * - Kalau kamu sudah simpan schema_json di DB dan ingin “override”, bisa dipakai.
 * - Default: generate dari kolom2 organization_profile.
 */
export function buildOrganizationJsonLd(
  org: OrgRow | null,
  siteUrl = DEFAULT_SITE,
) {
  if (!org) return null;

  // Jika kamu sudah menyimpan schema_json yang sudah final:
  if (org.schema_json && typeof org.schema_json === "object") {
    // pastikan URL relatif jadi absolut bila perlu
    return org.schema_json;
  }

  const website = absUrl(siteUrl, org.website_url || "/");
  const name = org.brand_name || org.legal_name || "Java Volcano Tour Operator";
  const alternateName = org.alternate_name || undefined;

  const sameAs = (org.same_as_urls || []).filter(Boolean);

  const address =
    org.address_json && typeof org.address_json === "object"
      ? org.address_json
      : undefined;

  // Pilihan type:
  // - Organization aman.
  // - LocalBusiness / TourOperator bisa dipakai, tapi kalau kamu ragu, tetap Organization.
  // [Unverified] Saya tidak memverifikasi kategori bisnis kamu di schema.org; ini pilihan teknis.
  const jsonld: any = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${website}#organization`,
    name,
    url: website,
    description: org.description || undefined,
    logo: org.logo_url ? absUrl(siteUrl, org.logo_url) : undefined,
    image: org.hero_image_url ? absUrl(siteUrl, org.hero_image_url) : undefined,
    email: org.contact_email || undefined,
    telephone: org.contact_phone || undefined,
    priceRange: org.price_range || undefined,
    foundingDate: org.founding_date
      ? org.founding_date.toISOString().slice(0, 10)
      : undefined,
    alternateName,
    sameAs: sameAs.length ? sameAs : undefined,
    address,
  };

  // hapus key undefined supaya bersih
  Object.keys(jsonld).forEach(
    (k) => jsonld[k] === undefined && delete jsonld[k],
  );

  return jsonld;
}

export function buildFaqJsonLdFromContent(
  page: PageRowLike,
  siteUrl = DEFAULT_SITE,
) {
  const faq = page?.content?.faq;
  if (!Array.isArray(faq) || faq.length === 0) return null;

  // Validasi minimal: q dan a string
  const mainEntity = faq
    .filter((x) => x && typeof x.q === "string" && typeof x.a === "string")
    .map((x) => ({
      "@type": "Question",
      name: x.q.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: x.a.trim(),
      },
    }));

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function buildWebPageJsonLd(
  page: PageRowLike,
  org: OrgRow | null,
  siteUrl = DEFAULT_SITE,
) {
  const website = absUrl(siteUrl, "/");
  const pageUrl = absUrl(siteUrl, page.route);

  const seo: Seo = page.seo || {};
  const title = seo.title || page?.content?.h1 || page.route;
  const description = seo.description || undefined;

  const orgId = org?.website_url
    ? `${absUrl(siteUrl, org.website_url)}#organization`
    : `${website}#organization`;

  const jsonld: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: page.lang || "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${website}#website`,
      url: website,
      name: "Java Volcano Tour Operator",
    },
    about: org ? { "@id": orgId } : undefined,
    publisher: org ? { "@id": orgId } : undefined,
    datePublished: safeIso(page.created_at),
    dateModified: safeIso(page.updated_at),
  };

  Object.keys(jsonld).forEach(
    (k) => jsonld[k] === undefined && delete jsonld[k],
  );

  return jsonld;
}
