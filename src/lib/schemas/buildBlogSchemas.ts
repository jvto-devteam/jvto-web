// src/lib/schemas/buildBlogSchemas.ts — BlogPosting JSON-LD for the /blog cluster.
// PACKAGE 08: reads the content/ SSOT page meta (content/pages/blog/<slug>.md) instead of
// the retired src/lib/blog.ts frontmatter. Publisher/author cross-reference the global
// Organization entity by its stable @id so the entity graph stays connected.
import type { PageMeta } from "@/lib/static-content/schemas";
import { url } from "@/lib/site";

const PROD = "https://javavolcano-touroperator.com";

export function buildBlogPostingSchema(meta: PageMeta) {
  const pageUrl = url(meta.route);
  const banner = meta.bannerImage;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#blogposting`,
    headline: meta.title,
    description: meta.description,
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    datePublished: meta.publishedDate || undefined,
    dateModified: meta.publishedDate || undefined,
    keywords: meta.tags?.length ? meta.tags.join(", ") : undefined,
    inLanguage: "en",
    image: banner ? (banner.startsWith("http") ? banner : `${PROD}${banner}`) : undefined,
    author: { "@id": `${PROD}/#organization` },
    publisher: { "@id": `${PROD}/#organization` },
  };
}
