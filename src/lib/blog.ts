// src/lib/blog.ts
// Blog loader — reads synced markdown posts from src/data/blog/.
// Source of truth is llm-wiki (synced via scripts/sync-blog.mjs, published-only).
// No DB: the `blogs` table is intentionally unused for rendering.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import blogManifest from "@/data/blog/_manifest.json";
import { url } from "@/lib/site";

const BLOG_DIR = join(process.cwd(), "src", "data", "blog");

export type BlogManifestEntry = {
  slug: string;
  title: string;
  date: string;
  status: string;
  tags?: string[];
  seo_description?: string;
  estimated_read_min?: number;
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
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  body: string;
};

type Manifest = {
  generated?: string;
  synced_at?: string;
  posts: BlogManifestEntry[];
};

const manifest = blogManifest as Manifest;

/** Minimal YAML frontmatter parser. Handles strings, quoted strings,
 *  inline arrays ([a, b]), and numbers. Format is controlled by the
 *  llm-wiki blog-publisher skill, so the surface is intentionally small. */
function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }
  const [, fmBlock, body] = match;
  const fm: Record<string, unknown> = {};

  for (const line of fmBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;

    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      fm[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }
    value = value.replace(/^["']|["']$/g, "");
    if (value !== "" && !Number.isNaN(Number(value)) && /^[0-9.]+$/.test(value)) {
      fm[key] = Number(value);
    } else {
      fm[key] = value;
    }
  }

  return { frontmatter: fm, body: (body ?? "").trim() };
}

/** All published posts, newest first (from the synced manifest). */
export function getAllBlogPosts(): BlogManifestEntry[] {
  return [...manifest.posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllBlogSlugs(): string[] {
  return manifest.posts.map((p) => p.slug);
}

/** Read and parse a single post by slug. Returns null if missing or not in manifest. */
export function getBlogPost(slug: string): BlogPost | null {
  if (!manifest.posts.some((p) => p.slug === slug)) return null;
  let raw: string;
  try {
    raw = readFileSync(join(BLOG_DIR, `${slug}.md`), "utf8");
  } catch {
    return null;
  }
  const { frontmatter, body } = parseFrontmatter(raw);
  return {
    frontmatter: {
      title: String(frontmatter.title ?? slug),
      slug: String(frontmatter.slug ?? slug),
      date: String(frontmatter.date ?? ""),
      status: String(frontmatter.status ?? "published"),
      tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [],
      seo_title: frontmatter.seo_title ? String(frontmatter.seo_title) : undefined,
      seo_description: frontmatter.seo_description
        ? String(frontmatter.seo_description)
        : undefined,
      sources: Array.isArray(frontmatter.sources)
        ? (frontmatter.sources as string[])
        : undefined,
      estimated_read_min:
        typeof frontmatter.estimated_read_min === "number"
          ? frontmatter.estimated_read_min
          : undefined,
    },
    body,
  };
}

/** BlogPosting JSON-LD node. Publisher cross-references the global Organization
 *  entity by its stable @id so the entity graph stays connected. */
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
    author: { "@id": "https://javavolcano-touroperator.com/#organization" },
    publisher: { "@id": "https://javavolcano-touroperator.com/#organization" },
  };
}
