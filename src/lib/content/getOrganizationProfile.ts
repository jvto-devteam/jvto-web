import prisma from "@/lib/prisma";

export async function getOrganizationProfile() {
  const row = await prisma.organization_profile.findFirst({
    orderBy: { id: "asc" },
  });

  return row;
}
