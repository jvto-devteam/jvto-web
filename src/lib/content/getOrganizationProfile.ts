import { unstable_cache } from "next/cache";
import { getPublicOrganizationProfile } from "@/lib/publicContent/getPublicOrganizationProfile";

const getOrganizationProfileCached = unstable_cache(
  async () => {
    return getPublicOrganizationProfile();
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
