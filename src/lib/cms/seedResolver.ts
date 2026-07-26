// src/lib/cms/seedResolver.ts
// Pure build-time resolver over the jvto_cms bootstrap seed (src/data/cms/*.json,
// populated by `npm run sync:cms-seed`). This is the editorial content-plane:
// for the 50 fully-rendered seed routes it is the SINGLE source of page copy,
// FAQ, and SEO at BOTH build and runtime — superseding the retired jvto_dev
// editorial export (generated/dbPageSnapshots.json) and, for FAQ, the hardcoded
// canonical files for covered routes only.
//
// PURE: no DB, no fetch, no Date.now(). The seed JSON is a static build asset.
// Never throws at import time — missing/odd sections are guarded, not fatal.
//
// TRANSACTIONAL data (tour pricing, destination assets, booking, reviews) is NOT
// sourced here — those stay on their Prisma get* helpers.

import type {
  PublicPageSnapshot,
  PublicSnapshotContent,
  PublicSnapshotSeo,
} from "@/lib/publicContent/types";
import type { QaPair } from "@/lib/tourFaqs";

import manifestJson from "@/data/cms/_manifest.json";
import pagesJson from "@/data/cms/pages.json";
import pageSectionsJson from "@/data/cms/page_sections.json";
import entitiesJson from "@/data/cms/entities.json";

// Fixed fallback timestamp — keep the resolver pure (no Date.now()). Only used
// when the manifest lacks generated_at (it always has one today).
const FALLBACK_GENERATED_AT = "2026-07-21T00:00:00.000Z";

// ---- Loose shapes over the seed JSON (the seed is authored upstream; fields
// vary per route, so we read defensively rather than asserting a rigid type). --

type SeedPageRecord = {
  route: string;
  title?: string;
  h1?: string;
  seo?: { title?: string; description?: string; schema_type?: string } & Record<
    string,
    unknown
  >;
  status?: string;
  [key: string]: unknown;
};

type SeedSectionRecord = {
  route: string;
  section_type: string;
  sort_order?: number;
  content?: Record<string, unknown> | null;
  entity_refs?: string[] | null;
  [key: string]: unknown;
};

type SeedEntityRecord = {
  entity_type?: string;
  canonical_key?: string;
  slug?: string;
  data?: Record<string, unknown> | null;
  [key: string]: unknown;
};

const manifest = manifestJson as {
  generated_at?: string;
  routes_scaffold_only?: string[];
};
const pages = pagesJson as SeedPageRecord[];
const sections = pageSectionsJson as SeedSectionRecord[];
const entities = entitiesJson as SeedEntityRecord[];

const GENERATED_AT = manifest.generated_at ?? FALLBACK_GENERATED_AT;

// Scaffold-only routes (e.g. /blog*) keep jvto-web's EXISTING behavior — the seed
// does NOT own them. Everything the seed marks scaffold-only is excluded from the
// covered-route set regardless of whether a stray page_content section exists.
const SCAFFOLD_ONLY_ROUTES = new Set<string>(
  manifest.routes_scaffold_only ?? [],
);

// Index page records + the single page_content section per route.
const pageByRoute = new Map<string, SeedPageRecord>();
for (const p of pages) {
  if (p && typeof p.route === "string") pageByRoute.set(p.route, p);
}

const pageContentByRoute = new Map<string, SeedSectionRecord>();
const faqListByRoute = new Map<string, SeedSectionRecord[]>();
for (const s of sections) {
  if (!s || typeof s.route !== "string") continue;
  if (s.section_type === "page_content" && !SCAFFOLD_ONLY_ROUTES.has(s.route)) {
    // One page_content per non-blog route. First wins if a duplicate ever appears.
    if (!pageContentByRoute.has(s.route)) pageContentByRoute.set(s.route, s);
  }
  if (s.section_type === "faq_list") {
    const list = faqListByRoute.get(s.route) ?? [];
    list.push(s);
    faqListByRoute.set(s.route, list);
  }
}

// entities.json lookup by canonical_key ("faq:<slug>", etc.).
const entityByKey = new Map<string, SeedEntityRecord>();
for (const e of entities) {
  if (e && typeof e.canonical_key === "string") {
    entityByKey.set(e.canonical_key, e);
  }
}

/**
 * Authoritative "seed owns this route" set — every route that has a page_content
 * section, excluding the scaffold-only blog routes. Expected size: 50.
 */
export const SEED_COVERED_ROUTES: Set<string> = new Set(
  pageContentByRoute.keys(),
);

function toSeo(page: SeedPageRecord | undefined, route: string): PublicSnapshotSeo {
  const seo = page?.seo ?? {};
  const title =
    typeof seo.title === "string" && seo.title.trim().length > 0
      ? seo.title
      : typeof page?.title === "string" && page.title.trim().length > 0
        ? page.title
        : route;
  return {
    ...seo,
    title,
    description:
      typeof seo.description === "string" ? seo.description : undefined,
  };
}

function toContent(
  section: SeedSectionRecord | undefined,
  page: SeedPageRecord | undefined,
): PublicSnapshotContent {
  const raw = (section?.content ?? {}) as Record<string, unknown>;
  const h1 =
    typeof raw.h1 === "string" && raw.h1.trim().length > 0
      ? raw.h1
      : typeof page?.h1 === "string"
        ? page.h1
        : undefined;
  // Carry the whole page_content.content through (body_md, sections, faq,
  // intro_paragraphs, cross_links, schema_version, …) so downstream
  // pageRow.content.body_md / .sections / .faq reads keep working unchanged.
  return {
    ...raw,
    h1,
  };
}

/**
 * Per-route PublicPageSnapshot built from the seed. Only covered routes appear.
 * meta.source = "cms-seed" marks provenance for telemetry/debug.
 */
export const seedPageSnapshots: Record<string, PublicPageSnapshot> = (() => {
  const out: Record<string, PublicPageSnapshot> = {};
  for (const route of SEED_COVERED_ROUTES) {
    const page = pageByRoute.get(route);
    const section = pageContentByRoute.get(route);
    out[route] = {
      route,
      lang: "en",
      seo: toSeo(page, route),
      content: toContent(section, page),
      meta: {
        generatedAt: GENERATED_AT,
        source: "cms-seed",
      },
    };
  }
  return out;
})();

// ---- FAQ resolution ------------------------------------------------------

function pickQuestion(item: Record<string, unknown>): string | undefined {
  const v = item.question ?? item.q ?? item.name;
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

function pickAnswer(item: Record<string, unknown>): string | undefined {
  const v = item.answer ?? item.a ?? item.text;
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

/**
 * Resolve the seed FAQ for a covered route.
 *   - page_content.content.faq[] (field-name variance q/question/name,
 *     a/answer/text handled).
 *   - PLUS any faq_list section entity_refs ("faq:<slug>") hydrated against
 *     entities.json (data.question / data.answer), appended + deduped by question.
 * Returns [] for non-covered routes.
 */
export function getSeedFaqsForRoute(route: string): QaPair[] {
  if (!SEED_COVERED_ROUTES.has(route)) return [];

  const out: QaPair[] = [];
  const seen = new Set<string>();

  const push = (question?: string, answer?: string) => {
    if (!question || !answer) return;
    const key = question.trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ question, answer });
  };

  // 1. Inline page_content.content.faq[]
  const section = pageContentByRoute.get(route);
  const rawFaq = section?.content?.faq;
  if (Array.isArray(rawFaq)) {
    for (const item of rawFaq) {
      if (item && typeof item === "object") {
        const rec = item as Record<string, unknown>;
        push(pickQuestion(rec), pickAnswer(rec));
      }
    }
  }

  // 2. faq_list section entity_refs → entities.json
  const faqLists = faqListByRoute.get(route) ?? [];
  for (const list of faqLists) {
    for (const ref of list.entity_refs ?? []) {
      if (typeof ref !== "string" || !ref.startsWith("faq:")) continue;
      const entity = entityByKey.get(ref);
      const data = entity?.data;
      if (data && typeof data === "object") {
        const rec = data as Record<string, unknown>;
        push(pickQuestion(rec), pickAnswer(rec));
      }
    }
  }

  return out;
}
