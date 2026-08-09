import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { listPublishedStaticPages } from "@/lib/static-content";

// PACKAGE 08: blog routes are enumerated as url("…") string LITERALS (so the knowledge-feed
// validator + authority-manifest scanner can see each content-owned post). lastmod is a STABLE
// date, never the force-dynamic request time `t`: a post uses its own publishedDate; the hub
// (no publishedDate of its own) uses the NEWEST post's publishedDate so its crawl signal
// reflects real content changes instead of flipping on every fetch. `lastReviewed` (a required
// frontmatter field) is the fallback, and `t` only a last resort. Keep the list in lockstep
// with content/pages/blog/.
export function sitemapBlog(t: Date): MetadataRoute.Sitemap {
  const pages = listPublishedStaticPages({ section: "blog" });
  const metaByRoute = new Map(pages.map((p) => [p.meta.route, p.meta]));
  const newestPostDate = pages
    .filter((p) => p.meta.route !== "/blog" && p.meta.publishedDate)
    .map((p) => p.meta.publishedDate as string)
    .sort()
    .at(-1);
  const lastmod = (route: string): Date => {
    const m = metaByRoute.get(route);
    const iso =
      route === "/blog"
        ? newestPostDate ?? m?.lastReviewed
        : m?.publishedDate ?? m?.lastReviewed;
    return iso ? new Date(iso) : t;
  };
  return [
    { url: url("/blog"), lastModified: lastmod("/blog"), changeFrequency: "weekly", priority: 0.8 },
    {
      url: url("/blog/2026-06-11-ijen-medical-checkup-requirement"),
      lastModified: lastmod("/blog/2026-06-11-ijen-medical-checkup-requirement"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: url("/blog/2026-06-11-kawah-ijen-guide"),
      lastModified: lastmod("/blog/2026-06-11-kawah-ijen-guide"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
