import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { applyPinnedContentOverrideToRow } from "@/lib/content/pinnedContentOverrides";

const getContentPageCached = unstable_cache(
  async (route: string, lang: string) => {
    try {
      return await prisma.content_pages.findFirst({
        where: { route, lang, is_active: true },
        select: {
          route: true,
          lang: true,
          seo: true,
          content: true,
          created_at: true,
          updated_at: true,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[content_pages] fallback to null for ${route} (${lang}): ${message}`);
      return null;
    }
  },
  ["content-pages"],
  {
    revalidate: 3600,
    tags: ["content-pages"],
  },
);

export async function getContentPage(route: string, lang = "en") {
  const row = await getContentPageCached(route, lang);
  return applyPinnedContentOverrideToRow(route, row);
}
