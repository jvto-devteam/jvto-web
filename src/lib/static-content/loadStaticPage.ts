/**
 * loadStaticPage(route) — the target resolver (blueprint §6.1, PACKAGE 01).
 *
 * 1. normalize the route;
 * 2. locate exactly one matching file under content/pages (by frontmatter/meta
 *    `route`, NOT by file path — file layout is free within the section dirs);
 * 3. reject duplicate route declarations;
 * 4. dispatch loader by extension (.md → markdown, .json → structured);
 * 5. Zod-validate;
 * 6. resolve the referenced FAQ set, if any;
 * 7. derive canonical from PRODUCTION_ORIGIN + route (AD-06);
 * 8. return a typed StaticPage;
 * 9. return null for a missing route;
 * 10. NEVER query Prisma. This module must have no database import,
 *     and its output must not vary with database availability.
 */
import { relative, sep } from "node:path";
import { defaultContentRoot, discoverPageFiles } from "./discoverContentFiles";
import { loadFaqSet } from "./loadFaqSet";
import { ContentFileError, loadMarkdownPage } from "./loadMarkdownPage";
import { loadStructuredPage } from "./loadStructuredPage";
import { PRODUCTION_ORIGIN, type StaticPage } from "./types";

export function normalizeRoute(route: string): string {
  let r = route.trim();
  if (!r.startsWith("/")) r = `/${r}`;
  if (r.length > 1 && r.endsWith("/")) r = r.slice(0, -1);
  return r.toLowerCase();
}

export function canonicalUrlForRoute(route: string): string {
  const r = normalizeRoute(route);
  return r === "/" ? `${PRODUCTION_ORIGIN}/` : `${PRODUCTION_ORIGIN}${r}`;
}

type IndexedPage = { page: StaticPage; filePath: string };

/** route → page. Built once per content root; rebuilt for custom roots (tests). */
const indexCache = new Map<string, Map<string, IndexedPage>>();

export class DuplicateRouteError extends Error {
  constructor(route: string, files: string[]) {
    super(`route "${route}" is declared by more than one content file: ${files.join(", ")}`);
    this.name = "DuplicateRouteError";
  }
}

function loadOne(filePath: string, contentRoot: string): StaticPage {
  const sourceFile = relative(contentRoot, filePath).split(sep).join("/");
  if (filePath.endsWith(".md")) {
    const { meta, body } = loadMarkdownPage(filePath);
    return {
      meta,
      body,
      format: "markdown",
      canonicalUrl: canonicalUrlForRoute(meta.route),
      faq: meta.faqKey ? resolveFaq(meta.faqKey, filePath, contentRoot) : undefined,
      sourceFile,
    };
  }
  const doc = loadStructuredPage(filePath);
  return {
    meta: doc.meta,
    lede: doc.lede,
    sections: doc.sections,
    format: "structured",
    canonicalUrl: canonicalUrlForRoute(doc.meta.route),
    faq: doc.meta.faqKey ? resolveFaq(doc.meta.faqKey, filePath, contentRoot) : undefined,
    sourceFile,
  };
}

function resolveFaq(faqKey: string, pageFile: string, contentRoot: string) {
  const set = loadFaqSet(faqKey, contentRoot);
  if (!set) {
    throw new ContentFileError(pageFile, `faqKey "${faqKey}" has no file at faqs/${faqKey}.json`);
  }
  return set.items;
}

export function buildRouteIndex(contentRoot = defaultContentRoot()): Map<string, IndexedPage> {
  const cached = indexCache.get(contentRoot);
  if (cached) return cached;

  const index = new Map<string, IndexedPage>();
  const declaredBy = new Map<string, string[]>();
  for (const file of discoverPageFiles(contentRoot)) {
    const page = loadOne(file.filePath, contentRoot);
    const route = normalizeRoute(page.meta.route);
    const files = declaredBy.get(route) ?? [];
    files.push(file.relPath);
    declaredBy.set(route, files);
    if (files.length > 1) throw new DuplicateRouteError(route, files);
    index.set(route, { page, filePath: file.filePath });
  }
  indexCache.set(contentRoot, index);
  return index;
}

/** Test/validation hook — drop the memoized index for a root. */
export function clearRouteIndexCache(contentRoot?: string): void {
  if (contentRoot) indexCache.delete(contentRoot);
  else indexCache.clear();
}

/**
 * Load one static page by route. Returns null when no content file declares
 * the route (caller then falls back to its current, unmigrated behavior).
 */
export function loadStaticPage(route: string, contentRoot = defaultContentRoot()): StaticPage | null {
  const index = buildRouteIndex(contentRoot);
  return index.get(normalizeRoute(route))?.page ?? null;
}
