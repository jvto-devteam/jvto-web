import { getContentPage } from "@/lib/content/getContentPage";

type FallbackPageSeo = {
  title: string;
  h1?: string;
  description?: string;
};

export type PageSeoResult = {
  title: string;
  h1: string;
  description: string;
  row: Awaited<ReturnType<typeof getContentPage>> | null;
};

export async function getPageSeo(
  route: string,
  fallback: FallbackPageSeo,
): Promise<PageSeoResult> {
  const row = await getContentPage(route, "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  const content = (row?.content as Record<string, any> | null) ?? {};

  return {
    title: seo.title ?? fallback.title,
    h1: content.h1 ?? fallback.h1 ?? seo.title ?? fallback.title,
    description: seo.description ?? fallback.description ?? "",
    row,
  };
}
