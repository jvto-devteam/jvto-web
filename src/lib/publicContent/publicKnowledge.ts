/**
 * Public Knowledge — typed reader over the compiled manifest (Milestone 2, handoff §16).
 *
 * The manifest `generated/public-knowledge.json` is produced by
 * `scripts/compile-public-knowledge.ts` from the `content/` Git SSOT and is the single
 * projection the sitemap, canonical/metadata, JSON-LD, and the public knowledge feed
 * read through. This module is fs-/DB-free: it imports the committed, deterministic
 * artifact and exposes typed lookups. Never hand-edit the JSON — regenerate it.
 */
import manifest from "./generated/public-knowledge.json";
import type { Metadata } from "next";

export type KnowledgeRouteEntry = {
  route: string;
  section: string;
  canonicalUrl: string;
  title: string;
  browserTitle: string;
  description: string;
  summary: string;
  schemaTypes: string[];
  owner: string;
  lastReviewed: string;
  faqKey: string | null;
  faqCount: number;
};

export type PublicKnowledgeManifest = {
  schemaVersion: number;
  generator: string;
  productionOrigin: string;
  routes: KnowledgeRouteEntry[];
  entities: string[];
  counts: { routes: number; entities: number; sections: Record<string, number> };
  contentDigest: string;
};

const MANIFEST = manifest as PublicKnowledgeManifest;
const BY_ROUTE = new Map<string, KnowledgeRouteEntry>(MANIFEST.routes.map((r) => [r.route, r]));

/** Lowercase, strip a trailing slash (mirrors static-content normalizeRoute for lookups). */
function normalize(route: string): string {
  const r = route.trim().toLowerCase();
  if (r === "/" || r === "") return "/";
  return r.replace(/\/+$/, "");
}

/** The whole compiled manifest (read-only). */
export function getPublicKnowledgeManifest(): PublicKnowledgeManifest {
  return MANIFEST;
}

/** Every compiled public route string, sorted. */
export function knowledgeRoutes(): string[] {
  return MANIFEST.routes.map((r) => r.route);
}

/** The compiled entry for a route, or null if the route is not migrated to content/. */
export function getKnowledgeEntry(route: string): KnowledgeRouteEntry | null {
  return BY_ROUTE.get(normalize(route)) ?? null;
}

/** The production canonical URL for a migrated route, or null. */
export function canonicalForRoute(route: string): string | null {
  return getKnowledgeEntry(route)?.canonicalUrl ?? null;
}

/**
 * Next.js `metadata` fragment for a migrated route, sourced entirely from the compiler
 * (title/description/canonical). Returns null for an unmigrated route so callers keep
 * their existing metadata path. Additive — pages opt in.
 */
export function metadataForRoute(route: string): Pick<Metadata, "title" | "description" | "alternates"> | null {
  const e = getKnowledgeEntry(route);
  if (!e) return null;
  return {
    title: e.browserTitle,
    description: e.description,
    alternates: { canonical: e.canonicalUrl },
  };
}

/** Content integrity digest of the compiled artifact (SHA-256 over the deterministic payload). */
export function knowledgeContentDigest(): string {
  return MANIFEST.contentDigest;
}
