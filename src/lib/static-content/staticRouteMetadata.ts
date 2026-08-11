// src/lib/static-content/staticRouteMetadata.ts
/**
 * Metadata helper for content/-owned migrated routes.
 *
 * live-direct has no compiled knowledge-feed (main's Package 07); canonical is
 * derived directly from PRODUCTION_ORIGIN + route, which is always correct —
 * just not memoized against a feed.
 */
import type { Metadata } from "next";
import { canonicalUrlForRoute } from "./loadStaticPage";

export function staticRouteCanonical(route: string): string {
  return canonicalUrlForRoute(route);
}

type StaticRouteMetadataExtras = Omit<Metadata, "alternates">;

export function buildStaticRouteMetadata(
  route: string,
  extras: StaticRouteMetadataExtras = {},
): Metadata {
  return {
    ...extras,
    alternates: { canonical: staticRouteCanonical(route) },
  };
}
