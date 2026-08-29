import type { Metadata } from "next";
import {
  getEcosystemWebsitePage,
  getEcosystemWebsiteRoutes,
  resolveOgImage,
  type EcosystemSection,
  type EcosystemStaticPage,
} from "@/lib/ecosystemContent/website";

export const PRODUCTION_ORIGIN = "https://javavolcano-touroperator.com";

/**
 * hreflang for a monolingual site.
 *
 * The site had none on any of its 73 pages while running dedicated landing
 * pages for Singapore and Malaysia, so search engines were given no signal
 * about which audience each URL serves. Every page is English, so the honest
 * declaration is `en` plus `x-default` pointing at the same URL — that states
 * "this is the one version, serve it to everyone" rather than implying
 * translations that do not exist.
 *
 * /markets/* are NOT language variants and must never be declared as hreflang
 * alternates of each other: they are separate pages about travelling from a
 * given country, both written in English.
 */
export function hreflangFor(canonical: string): Record<string, string> {
  return { en: canonical, "x-default": canonical };
}

export type StaticPage = EcosystemStaticPage;
export type StructuredSection = EcosystemSection;

type MetadataOverrides = {
  title?: string;
  description?: string;
  openGraph?: NonNullable<Metadata["openGraph"]>;
};

function normalizeRoute(route: string): string {
  let normalized = route.trim();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized.toLowerCase();
}

/**
 * Named `loadEcosystemPage` (not `loadStaticPage`) on purpose: the identically
 * named legacy local-file resolver it used to collide with (`src/lib/static-
 * content/loadStaticPage.ts` + the `content/pages/*.md|*.json` tree it read)
 * was proven unreachable and deleted 2026-08-20 — every page.tsx caller was
 * already on this ekosistem-first path exclusively.
 */
export async function loadEcosystemPage(
  route: string,
): Promise<EcosystemStaticPage | null> {
  return getEcosystemWebsitePage(route);
}

export async function listPublishedStaticPages({
  section,
}: {
  section?: string;
} = {}): Promise<Array<{ meta: { route: string; section?: string } }>> {
  const index = await getEcosystemWebsiteRoutes();
  return (index.routes ?? [])
    .filter((item) => {
      if (!section) return true;
      const normalized = normalizeRoute(item.route);
      return normalized === `/${section}` || normalized.startsWith(`/${section}/`);
    })
    .map((item) => ({
      meta: {
        route: normalizeRoute(item.route),
        section,
      },
    }));
}

export function staticRouteCanonical(route: string): string {
  return `${PRODUCTION_ORIGIN}${normalizeRoute(route)}`;
}

export function buildStaticRouteMetadata(
  route: string,
  overrides: MetadataOverrides = {},
): Metadata {
  const title = overrides.title;
  const description = overrides.description;
  const canonical = staticRouteCanonical(route);
  const openGraph = overrides.openGraph ?? {
    title,
    description,
    url: canonical,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "article",
  };

  return {
    title,
    description,
    alternates: { canonical, languages: hreflangFor(canonical) },
    // Next.js does not merge openGraph.images from the root layout into a
    // route that defines its own openGraph object, so every caller — whether
    // it uses the default above or passes its own override — must end up
    // with an images array or the page silently ships with no og:image.
    openGraph: "images" in openGraph && openGraph.images
      ? openGraph
      : { ...openGraph, images: resolveOgImage(route, title ?? "Java Volcano Tour Operator") },
  };
}
