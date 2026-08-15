import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getEcosystemBlogPosts } from "@/lib/ecosystemContent/blog";

export async function sitemapBlog(t: Date): Promise<MetadataRoute.Sitemap> {
  const posts = await getEcosystemBlogPosts();
  return [
    {
      url: url("/blog"),
      lastModified: posts[0]?.date ? new Date(posts[0].date) : t,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: post.date ? new Date(post.date) : t,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
