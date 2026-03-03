// src/lib/seo/getOrganizationProfile.ts
import prisma from "@/lib/prisma";

export async function getOrganizationProfile() {
  return prisma.organization_profile.findUnique({
    where: { id: 1n },
  });
}