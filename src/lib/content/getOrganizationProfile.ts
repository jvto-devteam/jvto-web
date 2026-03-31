import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getOrganizationProfileCached = unstable_cache(
  async () => {
    try {
      return await prisma.organization_profile.findFirst({
        orderBy: { id: "asc" },
        select: {
          legal_name: true,
          brand_name: true,
          alternate_name: true,
          founding_date: true,
          description: true,
          price_range: true,
          contact_email: true,
          contact_phone: true,
          available_languages: true,
          address_json: true,
          same_as_urls: true,
          website_url: true,
          logo_url: true,
          hero_image_url: true,
          schema_json: true,
          updated_at: true,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[organization_profile] fallback to null: ${message}`);
      return null;
    }
  },
  ["organization-profile"],
  {
    revalidate: 3600,
    tags: ["organization-profile"],
  },
);

export async function getOrganizationProfile() {
  return getOrganizationProfileCached();
}
