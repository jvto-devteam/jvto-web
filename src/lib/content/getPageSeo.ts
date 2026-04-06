import { getContentPage } from "@/lib/content/getContentPage";
import { resolvePinnedContentFields } from "@/lib/content/pinnedContentOverrides";

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
  const resolved = resolvePinnedContentFields(route, row, fallback);

  return {
    title: resolved.title,
    h1: resolved.h1,
    description: resolved.description,
    row: resolved.row,
  };
}
