// src/lib/ecosystemContent/blog.ts
// Fetches the canonical /blog/<slug> post content from jvto-ekosistem's rendered
// public-website output
// (5-experience-engine/public-website/pages/blog__<slug>.website-output.json).
// This is RENDERED output, not a raw source file — same file family as the
// travel-guide/policy/why-jvto pages consumed via ecosystemContent/website.ts's
// getEcosystemWebsitePage and the markets__<country> pages consumed via
// ecosystemContent/markets.ts's getEcosystemMarket (see those files' readLocal/
// fetchRemote helpers for the established local-read + `/api/website/page` fetch
// convention for this file family). The render_contract on the ekosistem output
// explicitly marks `website_should_not_resolve_raw_sources: true`, so this adapter
// never reads 1-knowledge-and-evidence-core/blog/<slug>.source.json directly.
//
// Replaces src/lib/blog.ts (deleted as part of this migration), which read synced
// markdown + YAML frontmatter from src/data/blog/*.md via a local manifest. There is
// now exactly one place blog post content is edited.
//
// KNOWN GAP (flagged in task 2.3's report, not fixed here — the fix belongs in
// jvto-ekosistem's scripts/render-web-content-sources.mjs, out of scope for this
// jvto-web-only task): the raw *.source.json `meta` block for each blog post carries
// `tags`, `estimatedReadMin`, and `bannerImage`, but buildWebsiteOutput() in that
// render script only copies title/summary/owner/lastReviewed/content/faq through to
// the rendered website-output.json — it drops those three fields. Since this adapter
// is required to read only the rendered output, `tags`, `estimated_read_min`, and
// `banner_image` below are always empty/undefined. The consuming pages already treat
// all three as optional (conditionally rendered), so nothing breaks, but the two
// migrated posts lose their hero banner image, tag chips, and "X min read" line
// compared to the pre-migration markdown version — a visible content regression.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { url } from "@/lib/site";
import { getEcosystemWebsiteRoutes } from "./website";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

export type BlogManifestEntry = {
  slug: string;
  title: string;
  date: string;
  status: string;
  tags?: string[];
  seo_description?: string;
  estimated_read_min?: number;
  banner_image?: string;
};

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  status: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  sources?: string[];
  estimated_read_min?: number;
  banner_image?: string;
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  body: string;
};

// Minimal shape of the rendered website-output.json this adapter reads — only the
// fields blog.ts consumes, not the full EcosystemWebsitePage contract from website.ts.
interface BlogWebsiteOutput {
  route: string;
  slug: string;
  status?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  page: {
    title?: string;
    summary?: string;
    lastReviewed?: string;
    content?: {
      payload?: {
        body_md?: string;
      };
    };
  };
}

function outputRelativePath(slug: string): string {
  return path.join(
    "5-experience-engine",
    "public-website",
    "pages",
    `blog__${slug}.website-output.json`,
  );
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(slug: string): Promise<BlogWebsiteOutput | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), outputRelativePath(slug)),
      "utf8",
    );
    return JSON.parse(raw) as BlogWebsiteOutput;
  } catch {
    return null;
  }
}

async function fetchRemote(slug: string): Promise<BlogWebsiteOutput | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const requestUrl = new URL("/api/website/page", baseUrl);
    requestUrl.searchParams.set("route", `/blog/${slug}`);

    const response = await fetch(requestUrl, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-blog"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { payload?: BlogWebsiteOutput };
    if (!body.payload) return null;
    return body.payload;
  } catch {
    return null;
  }
}

async function getOutput(slug: string): Promise<BlogWebsiteOutput | null> {
  const local = await readLocal(slug);
  if (local) return local;
  return fetchRemote(slug);
}

function toBlogPost(output: BlogWebsiteOutput, slug: string): BlogPost {
  const title = output.page.title || output.seo?.title || slug;
  return {
    frontmatter: {
      title,
      slug,
      date: output.page.lastReviewed ?? "",
      status: output.status ?? "published",
      // tags/estimated_read_min/banner_image: not present on the rendered
      // output — see the KNOWN GAP note at the top of this file.
      tags: [],
      seo_title: output.seo?.title,
      seo_description: output.seo?.description,
      sources: undefined,
      estimated_read_min: undefined,
      banner_image: undefined,
    },
    body: output.page.content?.payload?.body_md ?? "",
  };
}

/**
 * Canonical /blog/<slug> post content from ekosistem's rendered public-website
 * output. Local sibling-directory read first (dev, same-server deploys), HTTP
 * fetch to the ekosistem origin as fallback. Returns null if neither source is
 * reachable, or the payload is missing/malformed — callers decide how to handle
 * that (blog/[slug]/page.tsx calls notFound()).
 */
export async function getEcosystemBlogPost(slug: string): Promise<BlogPost | null> {
  const output = await getOutput(slug);
  if (!output) return null;
  return toBlogPost(output, slug);
}

/**
 * All published blog slugs, sourced from ekosistem's route index (the same
 * `/blog/*` routes surfaced by getEcosystemWebsiteRoutes in website.ts) rather
 * than a locally hardcoded list, so a new post added on the ekosistem side
 * shows up here without a jvto-web code change.
 */
export async function getEcosystemBlogSlugs(): Promise<string[]> {
  const index = await getEcosystemWebsiteRoutes();
  return (index.routes ?? [])
    .map((item) => item.route)
    .filter((route) => route.startsWith("/blog/"))
    .map((route) => route.replace("/blog/", ""))
    .filter(Boolean);
}

/** All published posts, newest first — mirrors the pre-migration manifest shape. */
export async function getEcosystemBlogPosts(): Promise<BlogManifestEntry[]> {
  const slugs = await getEcosystemBlogSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getEcosystemBlogPost(slug);
      if (!post) return null;
      const fm = post.frontmatter;
      const entry: BlogManifestEntry = {
        slug: fm.slug,
        title: fm.title,
        date: fm.date,
        status: fm.status,
        tags: fm.tags,
        seo_description: fm.seo_description,
        estimated_read_min: fm.estimated_read_min,
        banner_image: fm.banner_image,
      };
      return entry;
    }),
  );

  return posts
    .filter((entry): entry is BlogManifestEntry => entry !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** BlogPosting JSON-LD node. Publisher cross-references the global Organization
 *  entity by its stable @id so the entity graph stays connected. Ported unchanged
 *  from the pre-migration src/lib/blog.ts. */
export function buildBlogPostingSchema(fm: BlogFrontmatter) {
  const pageUrl = url(`/blog/${fm.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#blogposting`,
    headline: fm.title,
    description: fm.seo_description ?? fm.title,
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    datePublished: fm.date || undefined,
    dateModified: fm.date || undefined,
    keywords: fm.tags.length ? fm.tags.join(", ") : undefined,
    inLanguage: "en",
    image: fm.banner_image
      ? fm.banner_image.startsWith("http")
        ? fm.banner_image
        : `https://javavolcano-touroperator.com${fm.banner_image}`
      : undefined,
    author: { "@id": "https://javavolcano-touroperator.com/#organization" },
    publisher: { "@id": "https://javavolcano-touroperator.com/#organization" },
  };
}
