import { proofLinks } from "@/constants";
import { SITE_CONFIG } from "@/lib/site-config";

type OrganizationProfileRow = {
  legal_name?: string | null;
  brand_name?: string | null;
  alternate_name?: string | null;
  founding_date?: Date | null;
  description?: string | null;
  price_range?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  available_languages?: string[] | null;
  address_json?: Record<string, any> | null;
  same_as_urls?: string[] | null;
  website_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  schema_json?: Record<string, any> | null;
  updated_at?: Date | null;
} | null;

const DEFAULT_SITE_URL = "https://javavolcano-touroperator.com/";
const DEFAULT_LOGO_URL = "https://javavolcano-touroperator.com/assets/img/jvto-logo.png";
const DEFAULT_HERO_IMAGE_URL = "https://javavolcano-touroperator.com/assets/img/hero/home.webp";
const DEFAULT_FOUNDER_IMAGE =
  "https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png";

function cleanArray(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())))];
}

function buildDefaultSchemaJson() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://javavolcano-touroperator.com/#organization",
    legalName: SITE_CONFIG.legalName,
    name: SITE_CONFIG.brand,
    alternateName: SITE_CONFIG.brandAbbreviation,
    foundingDate: "2016-01-01",
    description:
      "Java Volcano Tour Operator (JVTO) is a private East Java volcano tour operator built around Tourist Police-led safety culture, transparent booking logic, and route readiness before payment.",
    priceRange: "$$",
    url: DEFAULT_SITE_URL,
    logo: DEFAULT_LOGO_URL,
    image: DEFAULT_HERO_IMAGE_URL,
    sameAs: cleanArray([
      SITE_CONFIG.office.googleMaps,
      proofLinks.tripadvisor,
      proofLinks.trustpilot,
      proofLinks.googleMaps,
      proofLinks.indecon,
      "https://www.instagram.com/javavolcano.touroperator/",
    ]),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: SITE_CONFIG.contact.email,
      telephone: SITE_CONFIG.contact.phone,
      availableLanguages: ["en", "id"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.office.street,
      addressLocality: SITE_CONFIG.office.city,
      addressRegion: SITE_CONFIG.office.region,
      postalCode: SITE_CONFIG.office.postalCode,
      addressCountry: SITE_CONFIG.office.country,
    },
    founder: {
      "@type": "Person",
      "@id": "https://javavolcano-touroperator.com/#founder",
      name: `${SITE_CONFIG.founder.name} (${SITE_CONFIG.founder.alias})`,
      givenName: SITE_CONFIG.founder.name.split(" ")[0],
      alternateName: SITE_CONFIG.founder.alias,
      jobTitle: SITE_CONFIG.founder.role,
      image: DEFAULT_FOUNDER_IMAGE,
    },
  };
}

function normalizeSchemaJson(schema: unknown) {
  const candidate =
    schema && typeof schema === "object" && !Array.isArray(schema)
      ? ({ ...(schema as Record<string, any>) } as Record<string, any>)
      : buildDefaultSchemaJson();

  const founder =
    candidate.founder && typeof candidate.founder === "object"
      ? { ...(candidate.founder as Record<string, any>) }
      : {};

  const founderName =
    typeof founder.name === "string" && founder.name.trim()
      ? founder.name.trim()
      : `${SITE_CONFIG.founder.name} (${SITE_CONFIG.founder.alias})`;

  const founderLooksWrong =
    founderName.toLowerCase() === SITE_CONFIG.brand.toLowerCase();

  candidate.founder = {
    "@type": "Person",
    "@id": "https://javavolcano-touroperator.com/#founder",
    ...founder,
    name: founderLooksWrong ? `${SITE_CONFIG.founder.name} (${SITE_CONFIG.founder.alias})` : founderName,
    givenName:
      typeof founder.givenName === "string" && founder.givenName.trim()
        ? founder.givenName
        : SITE_CONFIG.founder.name.split(" ")[0],
    alternateName:
      typeof founder.alternateName === "string" && founder.alternateName.trim()
        ? founder.alternateName
        : SITE_CONFIG.founder.alias,
    jobTitle:
      typeof founder.jobTitle === "string" && founder.jobTitle.trim()
        ? founder.jobTitle
        : SITE_CONFIG.founder.role,
    image:
      typeof founder.image === "string" && founder.image.trim()
        ? founder.image
        : DEFAULT_FOUNDER_IMAGE,
  };

  if (typeof candidate.description !== "string" || !candidate.description.trim()) {
    candidate.description =
      "Java Volcano Tour Operator (JVTO) is a private East Java volcano tour operator built around Tourist Police-led safety culture, transparent booking logic, and route readiness before payment.";
  }

  if (!Array.isArray(candidate.sameAs) || candidate.sameAs.length === 0) {
    candidate.sameAs = cleanArray([
      SITE_CONFIG.office.googleMaps,
      proofLinks.tripadvisor,
      proofLinks.trustpilot,
      proofLinks.googleMaps,
      proofLinks.indecon,
      "https://www.instagram.com/javavolcano.touroperator/",
    ]);
  }

  return candidate;
}

export function normalizeOrganizationProfile(
  row: OrganizationProfileRow,
): Exclude<OrganizationProfileRow, null> {
  const normalized = {
    legal_name: row?.legal_name ?? SITE_CONFIG.legalName,
    brand_name: row?.brand_name ?? SITE_CONFIG.brand,
    alternate_name: row?.alternate_name ?? SITE_CONFIG.brandAbbreviation,
    founding_date: row?.founding_date ?? new Date("2016-01-01T00:00:00.000Z"),
    description:
      row?.description ??
      "Java Volcano Tour Operator (JVTO) is a private East Java volcano tour operator built around Tourist Police-led safety culture, transparent booking logic, and route readiness before payment.",
    price_range: row?.price_range ?? "$$",
    contact_email: row?.contact_email ?? SITE_CONFIG.contact.email,
    contact_phone: row?.contact_phone ?? SITE_CONFIG.contact.phone,
    available_languages:
      row?.available_languages && row.available_languages.length > 0
        ? row.available_languages
        : ["en", "id"],
    address_json:
      row?.address_json ?? {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.office.street,
        addressLocality: SITE_CONFIG.office.city,
        addressRegion: SITE_CONFIG.office.region,
        postalCode: SITE_CONFIG.office.postalCode,
        addressCountry: SITE_CONFIG.office.country,
      },
    same_as_urls:
      row?.same_as_urls && row.same_as_urls.length > 0
        ? row.same_as_urls
        : cleanArray([
            SITE_CONFIG.office.googleMaps,
            proofLinks.tripadvisor,
            proofLinks.trustpilot,
            proofLinks.googleMaps,
            proofLinks.indecon,
            "https://www.instagram.com/javavolcano.touroperator/",
          ]),
    website_url: row?.website_url ?? DEFAULT_SITE_URL,
    logo_url: row?.logo_url ?? DEFAULT_LOGO_URL,
    hero_image_url: row?.hero_image_url ?? DEFAULT_HERO_IMAGE_URL,
    schema_json: normalizeSchemaJson(row?.schema_json),
    updated_at: row?.updated_at ?? null,
  };

  return normalized;
}
