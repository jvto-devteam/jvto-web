/**
 * MIGRATED_STATIC_ROUTES — central registry of routes owned by the
 * static-content SSOT (PACKAGE 05c, owner directive 2026-08-04).
 *
 * DERIVED, not hand-listed: a route is "migrated" exactly when a published
 * page exists under content/pages/** (policy, travel-guide Path A, why-jvto
 * today; future packages join automatically). Consumers:
 *   - CMS write APIs (api/content-pages/*) reject create/update for these
 *     routes — content edits go through the repo, not the CMS;
 *   - CMS console renders them read-only/Git-managed;
 *   - scripts/validate-static-route-ownership.mjs re-derives the same set
 *     file-side and fails CI when a migrated route regains a legacy source.
 */
import { listPublishedStaticPages } from "./listStaticPages";
import { normalizeRoute } from "./loadStaticPage";

export function getMigratedStaticRoutes(): Set<string> {
  return new Set(
    listPublishedStaticPages().map((p) => normalizeRoute(p.meta.route)),
  );
}

export function isMigratedStaticRoute(route: string): boolean {
  return getMigratedStaticRoutes().has(normalizeRoute(route));
}

/** Standard rejection message for CMS write attempts on a migrated route. */
export function migratedRouteEditMessage(route: string): string {
  return (
    `Route "${route}" is Git-managed: it is served from the static content SSOT ` +
    `(content/pages/**) and content_pages rows for it never render (AD-10). ` +
    `Edit the content file in the repository instead.`
  );
}
