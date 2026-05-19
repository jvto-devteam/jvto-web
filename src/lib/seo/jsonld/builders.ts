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
  founding_date?: Date | string | null;
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

type DestinationApiItem = {
  id: number;
  name: string;
  slug: string;
  short_slug?: string | null;
  featured?: boolean;
  banner: { url: string; alt: string };
  summary?: string | null;
  highlight?: string | null;
  description?: string | null;
  geo?: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
  };
  keyInfo?: {
    difficulty_level?: string | null;
    temperature_range?: string | null;
    best_time_to_visit?: string | null;
    permit_required?: boolean;
    permit_details?: string | null;
    physical_requirements?: string | null;
  };
  main_attractions?: Array<{ title: string; description: string }>;
  key_highlights?: Array<{ title: string; description: string }>;
  seo?: { title?: string | null; description?: string | null };
  tags?: string[];
  types?: string[];
  schema_json?: Record<string, any> | null;
};

export const DEFAULT_SITE = "https://javavolcano-touroperator.com";
const GLOBAL_SCHEMA_TYPES = new Set([
  "Organization",
  "LocalBusiness",
  "TravelAgency",
  "WebSite",
]);

// ─── Shared @id constants ─────────────────────────────────────────────────────
export const ORG_ID = `${DEFAULT_SITE}/#organization`;
export const WEBSITE_ID = `${DEFAULT_SITE}/#website`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatDateOnly(value?: Date | string | null) {
  if (!value) return undefined;

  if (value instanceof Date) {
    const iso = safeIso(value);
    return iso ? iso.slice(0, 10) : undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return trimmed.length >= 10 ? trimmed.slice(0, 10) : undefined;
}

function clean(obj: Record<string, any>) {
  Object.keys(obj).forEach((k) => obj[k] === undefined && delete obj[k]);
  return obj;
}

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function nodeTypes(node: Record<string, any>) {
  const type = node["@type"];
  if (Array.isArray(type)) return type.filter((item) => typeof item === "string");
  return typeof type === "string" ? [type] : [];
}

function isGlobalSchemaNode(node: Record<string, any>) {
  return nodeTypes(node).some((type) => GLOBAL_SCHEMA_TYPES.has(type));
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

const LABEL_MAP: Record<string, string> = {
  "travel-guide": "Travel Guide",
  policy: "Policy",
  "why-jvto": "Why JVTO",
  destinations: "Destinations",
  tours: "Tours",
  "verify-jvto": "Verify JVTO",
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
  "from-surabaya": "From Surabaya",
  "from-bali": "From Bali",
};

export function buildBreadcrumbItems(route: string, siteUrl = DEFAULT_SITE) {
  const clean = route.split("?")[0].split("#")[0];
  const segs = clean.split("/").filter(Boolean);

  const items: Array<{ name: string; item: string }> = [
    { name: "Home", item: absUrl(siteUrl, "/") },
  ];

  let acc = "";
  for (const s of segs) {
    acc += `/${s}`;
    items.push({
      name: LABEL_MAP[s] ?? titleCaseFromSlug(s),
      item: absUrl(siteUrl, acc),
    });
  }
  return items;
}

/** NOTE: Tidak menyertakan @context — dihandle oleh @graph wrapper */
export function buildBreadcrumbJsonLd(route: string, siteUrl = DEFAULT_SITE) {
  const items = buildBreadcrumbItems(route, siteUrl);
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

// ─── Organization ─────────────────────────────────────────────────────────────

/** NOTE: Tidak menyertakan @context — dihandle oleh @graph wrapper */
export function buildOrganizationJsonLd(
  org: OrgRow | null,
  siteUrl = DEFAULT_SITE,
) {
  if (!org) return null;

  // Jika schema_json sudah tersimpan di DB (sudah complete) — strip @context
  if (org.schema_json && typeof org.schema_json === "object") {
    if (Array.isArray(org.schema_json)) {
      return org.schema_json;
    }
    
    // Fallback jika berupa objek yang punya @graph
    if (Array.isArray(org.schema_json["@graph"])) {
      return org.schema_json["@graph"];
    }
    
    const { "@context": _ctx, ...rest } = org.schema_json as any;
    return rest;
  }

  // Fallback: generate dari kolom
  const website = absUrl(siteUrl, org.website_url || "/");
  const name = org.brand_name || org.legal_name || "Java Volcano Tour Operator";
  const sameAs = (org.same_as_urls || []).filter(Boolean);
  const address =
    org.address_json && typeof org.address_json === "object"
      ? org.address_json
      : undefined;

  return clean({
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": ORG_ID,
    name,
    url: website,
    description: org.description || undefined,
    logo: org.logo_url ? absUrl(siteUrl, org.logo_url) : undefined,
    image: org.hero_image_url ? absUrl(siteUrl, org.hero_image_url) : undefined,
    email: org.contact_email || undefined,
    telephone: org.contact_phone || undefined,
    priceRange: org.price_range || undefined,
    foundingDate: formatDateOnly(org.founding_date),
    alternateName: org.alternate_name || undefined,
    hasMap: "https://www.google.com/maps?cid=1266403973589689021",
    areaServed: [
      { "@type": "City", "name": "Surabaya" },
      { "@type": "City", "name": "Bondowoso" },
      { "@type": "AdministrativeArea", "name": "East Java", "containedInPlace": { "@type": "Country", "name": "Indonesia" } },
    ],
    sameAs: sameAs.length ? sameAs : undefined,
    address,
  });
}

// ─── WebSite node (tambahkan ke graph sekali) ─────────────────────────────────

/** NOTE: Tidak menyertakan @context */
export function buildWebSiteJsonLd(siteUrl = DEFAULT_SITE) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absUrl(siteUrl, "/"),
    name: "Java Volcano Tour Operator",
    publisher: { "@id": ORG_ID },
  };
}

/** NOTE: Tidak menyertakan @context */
export function buildSchemaTypeJsonLd(
  page: PageRowLike,
  schemaType: string,
  siteUrl = DEFAULT_SITE,
) {
  if (!schemaType || GLOBAL_SCHEMA_TYPES.has(schemaType)) return null;

  const pageUrl = absUrl(siteUrl, page.route);
  const seo: Seo = page.seo || {};
  const title = seo.title || page?.content?.h1 || page.route;
  const description = seo.description || undefined;

  return clean({
    "@type": schemaType,
    "@id": `${pageUrl}#${schemaType.toLowerCase()}`,
    url: pageUrl,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  });
}

/** NOTE: Tidak menyertakan @context */
export function buildContentPageExtraJsonLd(
  page: PageRowLike,
  siteUrl = DEFAULT_SITE,
) {
  const seo = (page?.seo as Record<string, any> | null) ?? {};
  const extracted = [
    ...asArray(seo.schema_json),
    ...asArray(seo.schema_jsonld),
    ...asArray(seo.schemas_jsonld),
  ].filter((item): item is Record<string, any> => !!item && typeof item === "object");

  const filtered = extracted.filter((node) => !isGlobalSchemaNode(node));
  const schemaTypeNode =
    typeof seo.schema_type === "string"
      ? buildSchemaTypeJsonLd(page, seo.schema_type, siteUrl)
      : null;

  return [...filtered, ...(schemaTypeNode ? [schemaTypeNode] : [])];
}

// ─── WebPage ──────────────────────────────────────────────────────────────────

/** NOTE: Tidak menyertakan @context */
export function buildWebPageJsonLd(
  page: PageRowLike,
  org: OrgRow | null,
  siteUrl = DEFAULT_SITE,
) {
  const pageUrl = absUrl(siteUrl, page.route);
  const seo: Seo = page.seo || {};
  const title = seo.title || page?.content?.h1 || page.route;
  const description = seo.description || undefined;

  return clean({
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: page.lang || "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: org ? { "@id": ORG_ID } : undefined,
    publisher: org ? { "@id": ORG_ID } : undefined,
    datePublished: safeIso(page.created_at),
    dateModified: safeIso(page.updated_at),
  });
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

/** NOTE: Tidak menyertakan @context */
export function buildFaqJsonLdFromContent(
  page: PageRowLike,
  siteUrl = DEFAULT_SITE,
) {
  const faq = page?.content?.faq;
  if (!Array.isArray(faq) || faq.length === 0) return null;

  const mainEntity = faq
    .filter((x) => x && typeof x.q === "string" && typeof x.a === "string")
    .map((x) => ({
      "@type": "Question",
      name: x.q.trim(),
      acceptedAnswer: { "@type": "Answer", text: x.a.trim() },
    }));

  if (!mainEntity.length) return null;

  const pageUrl = absUrl(siteUrl, page.route);
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faqpage`,
    mainEntity,
  };
}

// ─── Destinations CollectionPage ──────────────────────────────────────────────

/** NOTE: Tidak menyertakan @context */
export function buildDestinationsCollectionJsonLd(
  destinations: DestinationApiItem[],
  siteUrl = DEFAULT_SITE,
) {
  const pageUrl = absUrl(siteUrl, "/destinations");

  const items = destinations.map((dest, idx) => {
    const destUrl = absUrl(siteUrl, `/destinations/${dest.slug}`);
    const imageUrl = dest.banner?.url
      ? absUrl(siteUrl, dest.banner.url)
      : undefined;

    // Prefer summary (concise) over full description for hub page
    const descText =
      (dest.summary || dest.description || "")
        .replace(/\r\n/g, " ")
        .trim()
        .slice(0, 300) || undefined;

    const attraction: Record<string, any> = {
      "@type": "TouristAttraction",
      "@id": `${destUrl}#attraction`,
      name: dest.name,
      url: destUrl,
      description: descText,
      image: imageUrl
        ? {
            "@type": "ImageObject",
            url: imageUrl,
            name: dest.banner?.alt || dest.name,
          }
        : undefined,
      containedInPlace: {
        "@type": "Place",
        name: "East Java, Indonesia",
        "@id": `${siteUrl}#east-java`,
      },
      touristType: "Adventure travelers, nature enthusiasts, photographers",
    };

    // GeoCoordinates — dari field geo yang sekarang di-expose API
    if (dest.geo?.latitude && dest.geo?.longitude) {
      attraction.geo = {
        "@type": "GeoCoordinates",
        latitude: dest.geo.latitude,
        longitude: dest.geo.longitude,
        ...(dest.geo.altitude
          ? { elevation: `${dest.geo.altitude} masl` }
          : {}),
      };
    }

    // additionalProperty — keyInfo + permit
    const props: any[] = [];
    if (dest.keyInfo?.difficulty_level)
      props.push({
        "@type": "PropertyValue",
        name: "Difficulty Level",
        value: dest.keyInfo.difficulty_level,
      });
    if (dest.keyInfo?.temperature_range)
      props.push({
        "@type": "PropertyValue",
        name: "Temperature Range",
        value: dest.keyInfo.temperature_range.replace(/\r\n/g, " "),
      });
    if (dest.keyInfo?.best_time_to_visit)
      props.push({
        "@type": "PropertyValue",
        name: "Best Time to Visit",
        value: dest.keyInfo.best_time_to_visit,
      });
    if (dest.keyInfo?.permit_required !== undefined)
      props.push({
        "@type": "PropertyValue",
        name: "Permit Required",
        value: dest.keyInfo.permit_required ? "Yes" : "No",
      });
    if (dest.keyInfo?.physical_requirements)
      props.push({
        "@type": "PropertyValue",
        name: "Physical Requirements",
        value: dest.keyInfo.physical_requirements,
      });
    if (props.length) attraction.additionalProperty = props;

    // amenityFeature — dari key_highlights (fitur utama destinasi)
    if (dest.key_highlights?.length) {
      attraction.amenityFeature = dest.key_highlights.map((h) => ({
        "@type": "LocationFeatureSpecification",
        name: h.title,
        value: true,
        description: h.description,
      }));
    }

    // keywords dari tags
    if (dest.tags?.length) {
      attraction.keywords = dest.tags.join(", ");
    }

    clean(attraction);

    return { "@type": "ListItem", position: idx + 1, item: attraction };
  });

  // Buat daftar nama destination untuk description dinamis
  const destNames = destinations.map((d) => d.name).join(", ");

  return {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collectionpage`,
    name: "East Java Destinations | Java Volcano Tour Operator",
    description: `Discover ${destinations.length} breathtaking destinations in East Java with JVTO — ${destNames}. Private guided tours with police-led safety.`,
    url: pageUrl,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    provider: { "@id": ORG_ID },
    about: {
      "@type": "Place",
      name: "East Java, Indonesia",
      "@id": `${siteUrl}#east-java`,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${pageUrl}#destination-list`,
      name: "East Java Destinations",
      description:
        "Complete list of JVTO-guided destinations in East Java, Indonesia",
      numberOfItems: destinations.length,
      itemListElement: items,
    },
  };
}
