// src/lib/ecosystemContent/destinationDetail.ts
//
// Fetches a destination-detail record from jvto-ekosistem
// (1-knowledge-and-evidence-core/destination-knowledge/<slug>.content.json) — full field
// parity with the DestinationDetail interface, a 1:1 copy from the live Prisma
// `destinations` row as of 2026-08-18. Same local-first / HTTP-fallback pattern
// as ecosystemContent/reviewPlatforms.ts and ecosystemContent/people.ts.
//
// Replaces src/lib/publicContent/databaseDestinationDetail.ts (Prisma-backed) as
// part of the single-content-source (ekosistem-only) consolidation — destination
// editorial content now has exactly one canonical home. No live sync exists
// between Prisma and this file by design (owner decision 2026-08-18): edits go
// directly into the ekosistem source going forward.
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DestinationDetail } from "@/interfaces";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_DIR = "1-knowledge-and-evidence-core/destination-knowledge";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(slug: string): Promise<DestinationDetail | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_DIR, `${slug}.content.json`),
      "utf8",
    );
    return JSON.parse(raw) as DestinationDetail;
  } catch {
    return null;
  }
}

async function fetchRemote(slug: string): Promise<DestinationDetail | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", `${SOURCE_DIR}/${slug}.content.json`);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", `jvto-ekosistem-destination-${slug}`],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as DestinationDetail;
  } catch {
    return null;
  }
}

/**
 * Full destination-detail record, or null when the ekosistem record is
 * unreachable (caller renders notFound() rather than a stale/fabricated page).
 */
export async function getEcosystemDestinationDetail(
  slug: string,
): Promise<DestinationDetail | null> {
  return (await readLocal(slug)) ?? (await fetchRemote(slug));
}

const KNOWN_SLUGS = [
  "mount-bromo",
  "ijen-crater",
  "madakaripura-waterfall",
  "tumpak-sewu-waterfall",
  "papuma-beach",
] as const;

/** Published destination-detail routes for generateStaticParams/sitemap. */
export async function getEcosystemDestinationRoutes(): Promise<
  Array<{ slug: string }>
> {
  return KNOWN_SLUGS.map((slug) => ({ slug }));
}

/** Shape returned for homepage/hub listing cards — mirrors the retired getWebDestinationsList. */
export interface EcosystemDestinationListItem {
  id: number;
  name: string;
  slug: string;
  short_slug: string | null;
  featured: boolean;
  banner: { url: string; alt: string };
  /** Answer-first block: the page's question answered in 40-60 fact-dense words. */
  answerFirst?: string;
  summary: string;
  highlight: string;
  description: string;
  geo: { latitude: number | null; longitude: number | null; altitude: number };
  keyInfo: {
    difficulty_level: string;
    temperature_range: string;
    best_time_to_visit: string;
  };
  permit_required: boolean;
  permit_details: string;
  physical_requirements: string;
  seo: { title: string | null; description: string | null };
  tags: string[];
  schema_json: Record<string, any> | null;
  main_attractions: Array<{ title: string; description: string }>;
  hero_meta_line: string | null;
  hub_region: string | null;
  hub_elevation_label: string | null;
  hub_difficulty_label: string | null;
  hub_chips: string[];
}

export interface EcosystemDestinationsListFilters {
  featured?: boolean;
  limit?: number;
}

/**
 * Published destination listings for homepage/hub cards, filtered by featured flag.
 * Pure ekosistem read — no Prisma. Returns empty array on miss (caller-friendly).
 */
export async function getEcosystemDestinationsList(
  filters: EcosystemDestinationsListFilters = {},
): Promise<EcosystemDestinationListItem[]> {
  const { featured, limit } = filters;

  const items = (
    await Promise.all(
      KNOWN_SLUGS.map(async (slug) => {
        const d = (await readLocal(slug)) ?? (await fetchRemote(slug));
        if (!d) return null;
        const dAny = d as any;

        if (featured && !dAny.featured) return null;

        return {
          id: d.id,
          name: d.name,
          slug: dAny.slug ?? slug,
          short_slug: dAny.short_slug ?? null,
          featured: dAny.featured ?? false,
          banner: {
            url: dAny.hero_image_url ?? "",
            alt: d.name,
          },
          ...(typeof dAny.answerFirst === "string" && dAny.answerFirst.trim()
            ? { answerFirst: dAny.answerFirst.trim() }
            : {}),
          summary: d.summary ?? "",
          highlight: d.highlight ?? "",
          description: d.description ?? "",
          geo: {
            latitude: null as number | null,
            longitude: null as number | null,
            altitude: d.altitude,
          },
          keyInfo: {
            difficulty_level: d.difficulty_level ?? "",
            temperature_range: d.temperature_range ?? "",
            best_time_to_visit: d.best_time_to_visit ?? "",
          },
          permit_required: d.permit_required ?? false,
          permit_details: d.permit_details ?? "",
          physical_requirements: d.physical_requirements ?? "",
          seo: {
            title: d.seo_title ?? null,
            description: d.seo_description ?? null,
          },
          tags: Array.isArray(d.tags) ? d.tags : [],
          schema_json: d.schema_json ?? null,
          main_attractions: Array.isArray(d.main_attractions) ? d.main_attractions : [],
          hero_meta_line: (dAny.hero_meta_line as string | null) ?? null,
          hub_region: (dAny.hub_region as string | null) ?? null,
          hub_elevation_label: (dAny.hub_elevation_label as string | null) ?? null,
          hub_difficulty_label: (dAny.hub_difficulty_label as string | null) ?? null,
          hub_chips: Array.isArray(dAny.hub_chips) ? dAny.hub_chips : [],
        } satisfies EcosystemDestinationListItem;
      }),
    )
  ).filter((item): item is EcosystemDestinationListItem => item !== null);

  return limit !== undefined ? items.slice(0, limit) : items;
}
