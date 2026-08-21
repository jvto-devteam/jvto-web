import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import {
  getAllPublishedBlogRoutes,
  getEcosystemBlogPosts,
} from "@/lib/ecosystemContent/blog";

export async function sitemapBlog(t: Date): Promise<MetadataRoute.Sitemap> {
  // Two sources on purpose. getEcosystemBlogPosts() carries per-post dates but
  // omits slugs that own a dedicated page.tsx — those are excluded from
  // generateStaticParams to avoid a Next.js route conflict.
  // getAllPublishedBlogRoutes() returns every live /blog/* route. A dedicated
  // page is still an indexable URL, so the sitemap takes the full route list
  // and borrows a date from the post index where one exists.
  const [posts, allRoutes] = await Promise.all([
    getEcosystemBlogPosts(),
    getAllPublishedBlogRoutes(),
  ]);

  const dateBySlug = new Map(posts.map((post) => [post.slug, post.date]));
  const slugs = allRoutes
    .map((route) => route.replace("/blog/", ""))
    .filter(Boolean);

  return [
    {
      url: url("/blog"),
      lastModified: posts[0]?.date ? new Date(posts[0].date) : t,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...slugs.map((slug) => {
      const date = dateBySlug.get(slug);
      return {
        url: url(`/blog/${slug}`),
        lastModified: date ? new Date(date) : t,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    }),
  ];
}
