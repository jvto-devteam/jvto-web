import { getEcosystemOrganizationNode } from "@/lib/ecosystemContent/schema";
import { publicOrganizationProfileSnapshot } from "./organizationSnapshot";
import type { PublicOrganizationProfileSnapshot } from "./types";

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

/**
 * Organization profile for JSON-LD/SEO — ekosistem-first, with a last-resort static
 * snapshot fallback (publicOrganizationProfileSnapshot) if the ekosistem record is
 * genuinely unreachable. Migrated 2026-08-19: the Prisma `organization_profile`
 * fallback path (flag-gated, previously reachable via PUBLIC_CONTENT_PREFER_DB_ORGANIZATION)
 * has been removed — ekosistem is now the only live source, per the single-content-source
 * consolidation.
 */
export async function getPublicOrganizationProfile(): Promise<PublicOrganizationProfileSnapshot> {
  const ecosystemNode = await getEcosystemOrganizationNode();
  if (ecosystemNode) {
    return mapEcosystemOrganizationProfile(ecosystemNode);
  }

  return publicOrganizationProfileSnapshot;
}
