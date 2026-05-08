import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import type { PublicPageSnapshot } from "@/lib/publicContent/types";

type FallbackPageSeo = {
  title: string;
  h1?: string;
  description?: string;
};

export type PageSeoResult = {
  title: string;
  h1: string;
  description: string;
  row: {
    route: string;
    lang: string;
    seo: PublicPageSnapshot["seo"];
    content: PublicPageSnapshot["content"];
    created_at?: Date;
    updated_at?: Date;
  } | null;
};

export async function getPageSeo(
  route: string,
  fallback: FallbackPageSeo,
): Promise<PageSeoResult> {
  const page = await getPublicPageSnapshot(route, {
    fallbackSnapshot: {
      route,
      lang: "en",
      seo: {
        title: fallback.title,
        description: fallback.description,
      },
      content: {
        h1: fallback.h1 ?? fallback.title,
      },
      meta: {
        generatedAt: new Date().toISOString(),
        source: "inline-fallback",
      },
    },
  });
  const row = page.pageRow;
  const seo = row.seo ?? {};
  const content = row.content ?? {};

  return {
    title: seo.title ?? fallback.title,
    h1: content.h1 ?? fallback.h1 ?? seo.title ?? fallback.title,
    description: seo.description ?? fallback.description ?? "",
    row,
  };
}
