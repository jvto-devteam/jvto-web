import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { listPublishedStaticPages } from "@/lib/static-content";

// PACKAGE 08: blog routes are enumerated as url("…") string LITERALS (so the knowledge-feed
// validator + authority-manifest scanner can see each content-owned post), with lastmod read
// from the content page's publishedDate. Keep this list in lockstep with content/pages/blog/.
export function sitemapBlog(t: Date): MetadataRoute.Sitemap {
  const dateByRoute = new Map(
    listPublishedStaticPages({ section: "blog" }).map((p) => [p.meta.route, p.meta.publishedDate]),
  );
  const lastmod = (route: string): Date => {
    const d = dateByRoute.get(route);
    return d ? new Date(d) : t;
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
