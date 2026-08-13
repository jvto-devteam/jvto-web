import type { Metadata } from "next";
import {
  getEcosystemWebsitePage,
  getEcosystemWebsiteRoutes,
  type EcosystemSection,
  type EcosystemStaticPage,
} from "@/lib/ecosystemContent/website";

export const PRODUCTION_ORIGIN = "https://javavolcano-touroperator.com";

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

export async function loadStaticPage(
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

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: overrides.openGraph ?? {
      title,
      description,
      url: canonical,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "article",
    },
  };
}
