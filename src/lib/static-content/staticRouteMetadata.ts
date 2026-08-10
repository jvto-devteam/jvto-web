/**
 * Shared metadata path for content/-owned migrated routes (Milestone 2 canonical fix).
 *
 * WHY THIS EXISTS
 * The `(website)/layout.tsx` sets `metadataBase = NEXT_PUBLIC_SITE_URL` (the deploy host)
 * plus `alternates.canonical: "./"` (relative). A migrated route that does NOT override
 * `alternates` inherits that relative canonical, which Next resolves against `metadataBase`
 * — so on the help/preview box it emitted a HELP-origin canonical
 * (help.javavolcano-touroperator.com/…) instead of the production canonical. The knowledge
 * feed already records the one true production canonical per route; this helper makes every
 * migrated route render exactly that, on EVERY deploy box.
 *
 * noindex is unaffected: it is owned by the layout `robots` via `isIndexableDeployment()`,
 * a separate axis from canonical. Help stays noindex AND now advertises the production
 * canonical (correct: the preview is a copy of production, not a competing document).
 *
 * SSOT: the canonical is read from the compiled public-knowledge feed (`canonicalForRoute`).
 * A route not yet compiled falls back to the deterministic production-origin derivation
 * (`canonicalUrlForRoute`) — both yield the production origin, never the deploy host.
 */
import type { Metadata } from "next";
import { canonicalForRoute } from "@/lib/publicContent/publicKnowledge";
import { canonicalUrlForRoute } from "./loadStaticPage";

/**
 * Absolute production canonical URL for a content/-owned route, sourced from the compiled
 * knowledge feed. Identical to what the sitemap, JSON-LD, and feed publish for the route.
 */
export function staticRouteCanonical(route: string): string {
  return canonicalForRoute(route) ?? canonicalUrlForRoute(route);
}

type StaticRouteMetadataExtras = Omit<Metadata, "alternates">;

/**
 * Build a route's Next.js `metadata` with the production canonical already wired from the
 * knowledge feed. Pass the route's title/description/openGraph/etc. as `extras`; this helper
 * only owns `alternates.canonical` (always the feed's production URL). Any `alternates` in
 * `extras` is ignored — canonical is not the page's to decide.
 */
export function buildStaticRouteMetadata(
  route: string,
  extras: StaticRouteMetadataExtras = {},
): Metadata {
  return {
    ...extras,
    alternates: { canonical: staticRouteCanonical(route) },
  };
}
