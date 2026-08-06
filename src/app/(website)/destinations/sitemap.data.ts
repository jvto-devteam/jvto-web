import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";
import { getPublicDestinationRoutesForSitemap } from "@/lib/publicContent/destinationDetailSnapshot";

// PACKAGE 06 (2026-08-06): the 5 destination-detail routes are enumerated as string
// LITERALS below (not a template-interpolated `url(`/destinations/${slug}`)`), so the
// knowledge-feed validator (scripts/validate-public-knowledge.mjs) and the
// authority-manifest sitemap scanner — both of which only match a literal `url("…")`
// argument — can see each content-owned detail route. The set is kept in lockstep with
// the published content/pages/destinations/<slug>.json records and the detail snapshot
// slugs (validate-static-route-ownership.mjs check 9 fails on any mismatch). lastmod
// still comes from the DB-backed snapshot, so it stays dynamic.
export async function sitemapDestinations(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): Promise<MetadataRoute.Sitemap> {
  const snapshot = getPublicDestinationRoutesForSitemap();
  const lastModBySlug = new Map(snapshot.map((d) => [d.slug, d.updatedAt]));
  const detailLastMod = (slug: string) => lastModBySlug.get(slug) ?? t;

  return [
    {
      url: url("/destinations"),
      lastModified: getLastModified(lastModifiedMap, "/destinations", t),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/destinations/ijen-crater"),
      lastModified: detailLastMod("ijen-crater"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/destinations/mount-bromo"),
      lastModified: detailLastMod("mount-bromo"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/destinations/tumpak-sewu-waterfall"),
      lastModified: detailLastMod("tumpak-sewu-waterfall"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/destinations/madakaripura-waterfall"),
      lastModified: detailLastMod("madakaripura-waterfall"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/destinations/papuma-beach"),
      lastModified: detailLastMod("papuma-beach"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
