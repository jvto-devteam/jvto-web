/**
 * Enumeration helpers (PACKAGE 01). generateStaticParams()/sitemap/knowledge
 * feed consumers list pages from here — draft pages are excluded from the
 * published listing and must never reach params, sitemap, or the feed.
 */
import { defaultContentRoot } from "./discoverContentFiles";
import { buildRouteIndex } from "./loadStaticPage";
import type { StaticPage } from "./types";
import type { PageMeta } from "./schemas";

export type ListOptions = {
  section?: PageMeta["section"];
};

/** Every valid static page (draft + published), sorted by route. */
export function listStaticPages(
  options: ListOptions = {},
  contentRoot = defaultContentRoot(),
): StaticPage[] {
  const pages = [...buildRouteIndex(contentRoot).values()]
    .map((entry) => entry.page)
    .filter((p) => (options.section ? p.meta.section === options.section : true));
  return pages.sort((a, b) => (a.meta.route < b.meta.route ? -1 : 1));
}

/** Published pages only — the only listing routes/sitemap/feed may consume. */
export function listPublishedStaticPages(
  options: ListOptions = {},
  contentRoot = defaultContentRoot(),
): StaticPage[] {
  return listStaticPages(options, contentRoot).filter((p) => p.meta.status === "published");
}
