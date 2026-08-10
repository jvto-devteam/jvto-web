// src/lib/content/resolvePageContent.ts
// Single per-route composition resolver for the Website Content SSOT + CMS console.
//
// Composes the public-facing view of a route (seo + body + faq + schema types) AND
// an ownership/editability map (`atoms[]`) so the CMS console can show exactly which
// atoms are editable and where each one is sourced from. SSR-safe, dependency-light:
// reuses existing helpers (getPublicPageSnapshot, getContentPage, resolveFaqsForPage,
// getNarrativeClaimsByPage, PAGE_REGISTRY) — never self-fetches an API.
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { getContentPage } from "@/lib/content/getContentPage";
import { resolveFaqsForPage } from "@/lib/content/resolveFaqs";
import { getNarrativeClaimsByPage } from "@/lib/queries/narrativeClaims";
import { PAGE_REGISTRY } from "@/lib/registry/pages";

export type AtomSource =
  | "narrative_claims"
  | "canonical"
  | "cms"
  | "synced"
  | "facts-lock"
  | "hardcoded"
  | "none";

export interface ContentAtom {
  key: string;
  label: string;
  value: unknown;
  source: AtomSource;
  owner: string;
  editable: boolean;
  note?: string;
}

export interface PageComposition {
  route: string;
  lang: string;
  seo: { title?: string; description?: string; schema_json?: unknown };
  body?: string;
  faq: {
    items: { question: string; answer: string }[];
    source: string;
    suppressCmsFaq: boolean;
    origin: string;
  };
  schemaTypes: string[];
  emitVia: "combined" | "inline" | "none" | "unknown";
  atoms: ContentAtom[];
  editable: {
    contentPage?: {
      route: string;
      lang: string;
      seo: unknown;
      content: unknown;
    };
    narrativeClaims?: Array<{
      id?: string;
      pillar: string;
      core_claim: string;
      primary_page: string;
    }>;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

/**
 * Resolve the full composition + ownership map for a route.
 * @param route absolute route path (e.g. '/verify-jvto/legal')
 * @param lang  content language, defaults to 'en'
 */
export async function resolvePageContent(
  route: string,
  lang = "en",
): Promise<PageComposition> {
  // 1. Public seo + content (snapshot › DB-fallback › inline). Read-only view.
  const resolution = await getPublicPageSnapshot(route);
  const pageRow = resolution.pageRow;
  const seoObj: Record<string, unknown> = isRecord(pageRow.seo)
    ? pageRow.seo
    : {};
  const contentObj: Record<string, unknown> = isRecord(pageRow.content)
    ? pageRow.content
    : {};

  const title = asString(seoObj.title);
  const description = asString(seoObj.description);
  const schemaJson =
    seoObj.schema_json !== undefined ? seoObj.schema_json : seoObj.schema_jsonld;
  const body = asString(contentObj.body_md);

  // 2. FAQ via centralized resolver (narrative_claims › canonical › cms).
  const faqResolution = await resolveFaqsForPage(route);

  // 3. Registry lookup for schema types + emit strategy.
  const registryEntry = PAGE_REGISTRY.find((e) => e.route === route);
  const schemaTypes = registryEntry?.schemaType ?? [];
  const emitVia: PageComposition["emitVia"] = registryEntry?.emitVia ?? "unknown";

  // 4. Editable payloads.
  //    contentPage: raw active content_pages row (for the editor to load).
  const rawRow = await getContentPage(route, lang);
  const contentPageEditable = rawRow
    ? {
        route: rawRow.route || route,
        lang: rawRow.lang || lang,
        seo: rawRow.seo,
        content: rawRow.content,
      }
    : undefined;

  //    narrativeClaims: rows wired to primary_page === route.
  const claimRows = await getNarrativeClaimsByPage(route);
  const narrativeClaimsEditable = claimRows
    .filter((c) => c.pillar && c.core_claim)
    .map((c) => ({
      id: c.id,
      pillar: c.pillar as string,
      core_claim: c.core_claim as string,
      primary_page: c.primary_page ?? route,
    }));

  // 5. Build the atom ownership/editability map.
  const atoms: ContentAtom[] = [];

  atoms.push({
    key: "seo.title",
    label: "SEO Title",
    value: title,
    source: "cms",
    owner: "jvto-web:content_pages",
    editable: true,
  });

  atoms.push({
    key: "seo.description",
    label: "SEO Description",
    value: description,
    source: "cms",
    owner: "jvto-web:content_pages",
    editable: true,
  });

  atoms.push({
    key: "content.body_md",
    label: "Body (Markdown)",
    value: body,
    source: "cms",
    owner: "jvto-web:content_pages",
    editable: true,
  });

  // FAQ atom — ownership + editability follow the resolved source.
  if (faqResolution.source === "narrative_claims") {
    atoms.push({
      key: "faq",
      label: "FAQ",
      value: faqResolution.faqs,
      source: "narrative_claims",
      owner: "db:narrative_claims",
      editable: true,
      note: "Edit via narrative_claims rows wired to this primary_page (DB, brand-voice canonical). Highest FAQ precedence.",
    });
  } else if (faqResolution.source === "canonical") {
    atoms.push({
      key: "faq",
      label: "FAQ",
      value: faqResolution.faqs,
      source: "canonical",
      owner: "code:canonical-faqs",
      editable: false,
      note: "Canonical hardcoded Q&A — edit in code (src/lib/*Faqs.ts, CANONICAL_FAQ_REGISTRY). Not editable from the CMS.",
    });
  } else {
    atoms.push({
      key: "faq",
      label: "FAQ",
      value: faqResolution.faqs,
      source: "cms",
      owner: "jvto-web:content_pages",
      editable: true,
      note: "CMS fallback — edit content_pages.content.faq. Lowest FAQ precedence; suppressed when a canonical/narrative source exists.",
    });
  }

  // Schema atom — page-authored schema_json is CMS-editable; otherwise code-built.
  if (schemaJson !== undefined && schemaJson !== null) {
    atoms.push({
      key: "seo.schema_json",
      label: "Page Schema (JSON-LD)",
      value: schemaJson,
      source: "cms",
      owner: "jvto-web:content_pages",
      editable: true,
    });
  } else {
    atoms.push({
      key: "schema",
      label: "Schema (JSON-LD)",
      value: schemaTypes,
      source: "hardcoded",
      owner: "code:build*Schemas",
      editable: false,
      note: `Emitted by code (${emitVia}) via src/lib/schemas/build*.ts. Not editable from the CMS; edit the builder.`,
    });
  }

  return {
    route,
    lang,
    seo: { title, description, schema_json: schemaJson },
    body,
    faq: {
      items: faqResolution.faqs,
      source: faqResolution.source,
      suppressCmsFaq: faqResolution.suppressCmsFaq,
      origin: faqResolution.origin,
    },
    schemaTypes,
    emitVia,
    atoms,
    editable: {
      contentPage: contentPageEditable,
      narrativeClaims: narrativeClaimsEditable.length
        ? narrativeClaimsEditable
        : undefined,
    },
  };
}
