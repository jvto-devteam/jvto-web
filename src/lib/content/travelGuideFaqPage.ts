/**
 * /travel-guide/faq render logic — the single source for BOTH the visible accordions and
 * the FAQPage JSON-LD (AD-08). Pure (no JSX/CSS/DB), so the page and the render-parity test
 * exercise the exact same code: `getFaqCategories` drives the visible list, `getAllFaqItems`
 * feeds `buildFaqPageNode`, and the test proves those are the same array.
 */
import { PRODUCTION_ORIGIN, type StaticPage } from "@/lib/static-content";
import { FaqListItemSchema, parseGrid, type FaqListItem } from "@/lib/content/travelGuideGrids";

export const FAQ_ROUTE = "/travel-guide/faq";

type Sec = NonNullable<StaticPage["sections"]>[number] & Record<string, unknown>;

function sectionGrid(sec: Sec, role: string): Record<string, unknown>[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as { role?: string }).role === role,
  );
  return block ? ((block as { items?: Record<string, unknown>[] }).items ?? []) : [];
}

function sectionTitle(sec: Sec): string {
  return typeof sec.title === "string" ? sec.title : "";
}

export type FaqCategory = { id: string; title: string; faqs: FaqListItem[] };

/** One category per content section; `faqs` parsed from that section's faq-list grid. */
export function getFaqCategories(page: StaticPage): FaqCategory[] {
  return (page.sections ?? []).map((sec) => {
    const s = sec as Sec;
    return {
      id: s.id,
      title: sectionTitle(s),
      faqs: parseGrid(FaqListItemSchema, sectionGrid(s, "faq-list"), `faq-list:${s.id}`),
    };
  });
}

/** The flat union of every category's Q&A — the one array both the HTML and JSON-LD use. */
export function getAllFaqItems(page: StaticPage): FaqListItem[] {
  return getFaqCategories(page).flatMap((c) => c.faqs);
}

/** The single FAQPage node, mainEntity built from the visible Q&A array (AD-08). */
export function buildFaqPageNode(items: FaqListItem[], route = FAQ_ROUTE) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PRODUCTION_ORIGIN}${route}#faqpage`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for the FAQ page.
 *  schema_type intentionally excludes FAQPage — the FAQPage is emitted explicitly (with
 *  mainEntity) via buildFaqPageNode; routing "FAQPage" through the generic schema_type
 *  builder would add a duplicate, mainEntity-less node. */
export function faqStaticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type:
        page.meta.schemaTypes.find((t) => t !== "WebPage" && t !== "FAQPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}
