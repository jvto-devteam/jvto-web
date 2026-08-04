/**
 * Static-content SSOT — public API (PACKAGE 01).
 *
 * Rules for consumers:
 *  - a migrated route reads ONLY from here (never content_pages / cms-seed);
 *  - an unmigrated route keeps its current resolver until its package lands;
 *  - nothing in this module touches Prisma or the network.
 */
export { loadStaticPage, normalizeRoute, canonicalUrlForRoute, clearRouteIndexCache, DuplicateRouteError } from "./loadStaticPage";
export { listStaticPages, listPublishedStaticPages } from "./listStaticPages";
export { loadFaqSet } from "./loadFaqSet";
export { loadEntity } from "./loadEntity";
export { loadMarkdownPage, ContentFileError } from "./loadMarkdownPage";
export { loadStructuredPage } from "./loadStructuredPage";
export {
  discoverPageFiles,
  discoverFaqFiles,
  discoverEntityFiles,
  defaultContentRoot,
} from "./discoverContentFiles";
export * from "./schemas";
export * from "./types";
