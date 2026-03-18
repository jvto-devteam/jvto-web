import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getOrganizationProfileCached = unstable_cache(
  async () => {
    return prisma.organization_profile.findFirst({
      orderBy: { id: "asc" },
    });
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
