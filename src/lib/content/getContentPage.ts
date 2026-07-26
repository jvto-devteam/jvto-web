import { unstable_cache } from "next/cache";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { jvtoCmsEnabled } from "@/lib/cms/jvtoCmsClient";
import { getCmsContentPage } from "@/lib/cms/jvtoCmsContent";

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
//
// When JVTO_CMS_DATABASE_URL is set (the (cms) admin runtime — jvto_cms is the edit
// master, Model A), read the live jvto_cms row FRESH (no unstable_cache, so the console
// always shows current content). Everywhere else keeps the legacy prisma+cache path;
// the public SSG build has no JVTO_CMS_DATABASE_URL, so it stays DB-free/seed-only.
export const getContentPage = cache(async (route: string, lang = "en") => {
  if (jvtoCmsEnabled()) {
    return getCmsContentPage(route, lang);
  }
  return getContentPageCached(route, lang);
});
