import prisma from "@/lib/prisma";
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

export async function getPublicOrganizationProfile(): Promise<PublicOrganizationProfileSnapshot> {
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
