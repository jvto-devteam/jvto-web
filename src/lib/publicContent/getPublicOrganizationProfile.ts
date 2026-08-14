import prisma from "@/lib/prisma";
import { getEcosystemOrganizationNode } from "@/lib/ecosystemContent/schema";
import { publicOrganizationProfileSnapshot } from "./organizationSnapshot";
import type { PublicOrganizationProfileSnapshot } from "./types";

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
  address_json?: unknown | null;
  same_as_urls?: string[] | null;
  website_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  schema_json?: unknown | null;
  updated_at?: Date | null;
};

const globalForPublicContent = globalThis as unknown as {
  __jvtoPublicOrgWarnings?: Set<string>;
};

function getWarningSet(): Set<string> {
  if (!globalForPublicContent.__jvtoPublicOrgWarnings) {
    globalForPublicContent.__jvtoPublicOrgWarnings = new Set<string>();
  }

  return globalForPublicContent.__jvtoPublicOrgWarnings;
}

function logOnce(level: "warn" | "error", message: string) {
  const key = `${level}:${message}`;
  const seen = getWarningSet();
  if (seen.has(key)) return;

  seen.add(key);
  console[level](message);
}

function canUseDatabaseFallback(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.PUBLIC_CONTENT_ALLOW_DB_FALLBACK === "true") return true;

  return process.env.CI !== "true";
}

function stringFromValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function logoUrlFromNode(node: Record<string, unknown>) {
  const logo = node.logo;
  if (typeof logo === "string") return logo;
  if (logo && typeof logo === "object" && "url" in logo) {
    return stringFromValue((logo as { url?: unknown }).url);
  }
  return null;
}

function mapEcosystemOrganizationProfile(node: Record<string, any>): PublicOrganizationProfileSnapshot {
  return {
    legal_name: stringFromValue(node.legalName),
    brand_name: stringFromValue(node.name),
    alternate_name: Array.isArray(node.alternateName)
      ? node.alternateName.filter((item: unknown) => typeof item === "string").join(", ")
      : stringFromValue(node.alternateName),
    founding_date: stringFromValue(node.foundingDate),
    description: stringFromValue(node.description) || stringFromValue(node.slogan),
    contact_email: stringFromValue(node.email),
    contact_phone: stringFromValue(node.telephone),
    address_json: node.address && typeof node.address === "object" ? node.address : null,
    same_as_urls: Array.isArray(node.sameAs) ? node.sameAs.filter((item: unknown) => typeof item === "string") : [],
    website_url: stringFromValue(node.url),
    logo_url: logoUrlFromNode(node),
    schema_json: node,
    updated_at: null,
  };
}

export async function getPublicOrganizationProfile(): Promise<PublicOrganizationProfileSnapshot> {
  const ecosystemNode = await getEcosystemOrganizationNode();
  if (ecosystemNode) {
    return mapEcosystemOrganizationProfile(ecosystemNode);
  }

  const shouldUseDatabaseOverride =
    canUseDatabaseFallback() &&
    process.env.PUBLIC_CONTENT_PREFER_DB_ORGANIZATION === "true";

  if (!shouldUseDatabaseOverride) {
    return publicOrganizationProfileSnapshot;
  }

  try {
    const row = (await prisma.organization_profile.findFirst({
      orderBy: { id: "asc" },
    })) as OrganizationProfileRow | null;

    if (row) {
      logOnce(
        "warn",
        "[publicContent] Using organization_profile database override.",
      );
      return row as PublicOrganizationProfileSnapshot;
    }
  } catch (error) {
    logOnce(
      "error",
      `[publicContent] Failed to read organization_profile fallback: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return publicOrganizationProfileSnapshot;
}
