import { unstable_cache } from "next/cache";
import { cache } from "react";
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

// cache() adds per-request memoization on top of unstable_cache's persistent layer.
// This deduplicates calls within the same render pass (e.g. generateMetadata + page component).
export const getContentPage = cache(async (route: string, lang = "en") => {
  return getContentPageCached(route, lang);
});
