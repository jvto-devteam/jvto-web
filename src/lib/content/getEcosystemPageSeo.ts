// src/lib/content/getEcosystemPageSeo.ts
//
// Drop-in replacement for getPageSeo(): same PageSeoResult shape, sourced
// from jvto-ekosistem instead of the legacy content_pages DB table /
// hand-copied snapshot JSON. Part of the single-content-source
// consolidation (2026-08-18) — pages call this instead of getPageSeo once
// their ekosistem source file exists.
//
// Field mapping matches the convention already shipped in why-jvto/*.tsx
// (loadEcosystemPage callers): meta.browserTitle is the <title>-tag text,
// meta.title is the visible H1 (and what pageRow.seo.title carries — not
// browserTitle — to stay consistent with those pages).
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";

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
    seo: { title?: string; description?: string; [key: string]: unknown };
    content: { h1?: string; [key: string]: unknown };
    created_at?: Date;
    updated_at?: Date;
  };
};

export async function getEcosystemPageSeo(
  route: string,
  fallback: FallbackPageSeo,
): Promise<PageSeoResult> {
  const page = await loadEcosystemPage(route);

  const title = page?.meta.browserTitle ?? page?.meta.title ?? fallback.title;
  const h1 = page?.meta.title ?? fallback.h1 ?? fallback.title;
  const description = page?.meta.description ?? fallback.description ?? "";
  const seoTitle = page?.meta.title ?? fallback.h1 ?? fallback.title;

  return {
    title,
    h1,
    description,
    row: {
      route,
      lang: "en",
      seo: { title: seoTitle, description },
      content: { h1 },
    },
  };
}
