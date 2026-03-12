import prisma from "@/lib/prisma";

export async function getContentPage(route: string, lang = "en") {
  return prisma.content_pages.findFirst({
    where: { route, lang, is_active: true },
  });
}