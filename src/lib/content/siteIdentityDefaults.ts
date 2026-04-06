import { SITE_CONFIG } from "@/lib/site-config";

type FounderPayload = {
  name?: string;
  full_name?: string;
  role_in_JVTO?: string;
  asset_url?: string;
  public_mission_statement?: string;
};

type BrandPositioningPayload = {
  founding_mission?: string;
  slogans?: string[];
  value_propositions?: {
    safety_leadership?: string;
    transparency?: string;
    inclusivity?: string;
    social_impact?: string;
  };
  differentiators?: string[];
};

const DEFAULT_FOUNDER: FounderPayload = {
  name: "Agung",
  full_name: `${SITE_CONFIG.founder.name} (${SITE_CONFIG.founder.alias})`,
  role_in_JVTO: SITE_CONFIG.founder.role,
  asset_url: "https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png",
  public_mission_statement:
    "JVTO is led by Agung Sambuko (Mr. Sam), an active Tourist Police officer, and built around safety, transparent operations, and authentic local execution in East Java.",
};

const DEFAULT_BRAND_POSITIONING: BrandPositioningPayload = {
  founding_mission:
    "Private East Java volcano routes built on police-led safety culture, transparent booking logic, and route clarity before payment.",
  slogans: ["Tourist Police-Led Private Volcano Tours in East Java"],
  value_propositions: {
    safety_leadership:
      "Active Tourist Police leadership shapes route discipline, screening, and escalation decisions.",
    transparency:
      "Legal proof, operator verification, and route conditions are exposed before booking.",
    inclusivity:
      "Private-only routes reduce mismatch and allow better pacing for families, couples, and students.",
    social_impact:
      "Local crews, East Java route knowledge, and accountable operating context stay visible.",
  },
  differentiators: [
    "Private-only operation",
    "Tourist Police-led safety culture",
    "Ijen screening before night trek",
    "Visible proof and verification layer",
  ],
};

function asObject<T extends Record<string, any>>(value: unknown): T | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as T)
    : null;
}

function isBlank(value: unknown) {
  return typeof value !== "string" || value.trim().length === 0;
}

function isFounderPlaceholder(founder: FounderPayload | null, brandName: string) {
  if (!founder) return true;

  const name = founder.full_name ?? founder.name ?? "";
  if (isBlank(name)) return true;

  const normalized = name.trim().toLowerCase();
  const brandNormalized = brandName.trim().toLowerCase();

  return normalized === brandNormalized;
}

export function normalizeFounder(
  founder: unknown,
  brandName = SITE_CONFIG.brand,
): FounderPayload {
  const candidate = asObject<FounderPayload>(founder);

  if (isFounderPlaceholder(candidate, brandName)) {
    return { ...DEFAULT_FOUNDER };
  }

  return {
    ...DEFAULT_FOUNDER,
    ...candidate,
  };
}

export function normalizeBrandPositioning(
  brandPositioning: unknown,
): BrandPositioningPayload {
  const candidate = asObject<BrandPositioningPayload>(brandPositioning);

  return {
    ...DEFAULT_BRAND_POSITIONING,
    ...candidate,
    slogans:
      candidate?.slogans && candidate.slogans.length > 0
        ? candidate.slogans
        : DEFAULT_BRAND_POSITIONING.slogans,
    differentiators:
      candidate?.differentiators && candidate.differentiators.length > 0
        ? candidate.differentiators
        : DEFAULT_BRAND_POSITIONING.differentiators,
    value_propositions: {
      ...DEFAULT_BRAND_POSITIONING.value_propositions,
      ...(candidate?.value_propositions ?? {}),
    },
  };
}

export function normalizeSiteIdentitySchema(
  schema: unknown,
  founder: FounderPayload,
  brandPositioning: BrandPositioningPayload,
) {
  const candidate = asObject<Record<string, any>>(schema);
  if (!candidate) return schema ?? null;

  const next = { ...candidate };

  const schemaFounder = asObject<Record<string, any>>(next.founder);
  const schemaFounderName =
    typeof schemaFounder?.name === "string" ? schemaFounder.name.trim() : "";

  if (!schemaFounderName || schemaFounderName.toLowerCase() === SITE_CONFIG.brand.toLowerCase()) {
    next.founder = {
      "@type": "Person",
      name: founder.full_name ?? founder.name,
      givenName: founder.name,
      jobTitle: founder.role_in_JVTO,
      image: founder.asset_url,
    };
  }

  if (isBlank(next.description) && brandPositioning.founding_mission) {
    next.description = brandPositioning.founding_mission;
  }

  if (isBlank(next.slogan) && brandPositioning.slogans?.[0]) {
    next.slogan = brandPositioning.slogans[0];
  }

  return next;
}
