import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getContentPageCached = unstable_cache(
  async (route: string, lang: string) => {
    return prisma.content_pages.findFirst({
      where: { route, lang, is_active: true },
    });
  },
  ["content-pages"],
  {
    revalidate: 3600,
    tags: ["content-pages"],
  },
);

export async function getContentPage(route: string, lang = "en") {
  return getContentPageCached(route, lang);
}
