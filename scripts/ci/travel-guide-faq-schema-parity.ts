/**
 * /travel-guide/faq FAQPage render-parity gate (Milestone 2 canonical/FAQ fix). Static — no server.
 *
 * Proves, against the exact code the page renders:
 *   1. the assembled JSON-LD graph contains EXACTLY ONE FAQPage node;
 *   2. that FAQPage's mainEntity is generated from the SAME FAQ array rendered visibly
 *      (getFaqCategories → getAllFaqItems → buildFaqPageNode — AD-08, one source);
 *   3. root-cause guard: the generic per-page schema_type builder never emits a FAQPage
 *      (a mainEntity-less stub used to duplicate the real node).
 *
 * The graph pieces are reconstructed exactly as PageJsonLdCombined assembles them for this
 * page: [WebPage] + buildContentPageExtraJsonLd(row) + the page's extraSchemas
 * ([buildFaqPageNode(...)]). The Organization/WebSite/Breadcrumb nodes are never FAQPage, so
 * they don't affect the count; the schema_type node (buildContentPageExtraJsonLd) is exactly
 * where the duplicate came from, so it IS included.
 */
import { loadStaticPage } from "@/lib/static-content";
import {
  buildContentPageExtraJsonLd,
  buildSchemaTypeJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/jsonld/builders";
import {
  FAQ_ROUTE,
  buildFaqPageNode,
  faqStaticPageRow,
  getAllFaqItems,
  getFaqCategories,
} from "@/lib/content/travelGuideFaqPage";

const failures: string[] = [];
const fail = (m: string) => failures.push(m);

function isFaqPage(node: unknown): boolean {
  const t = (node as { "@type"?: unknown })?.["@type"];
  return t === "FAQPage" || (Array.isArray(t) && t.includes("FAQPage"));
}

const page = loadStaticPage(FAQ_ROUTE);
if (!page) {
  fail(`${FAQ_ROUTE}: no content record (content/pages/travel-guide/faq.json missing)`);
} else if (page.meta.status !== "published") {
  fail(`${FAQ_ROUTE}: content status "${page.meta.status}" — must be published`);
} else {
  // Visible == JSON-LD: the accordions and the FAQPage read one array.
  const categories = getFaqCategories(page);
  const visible = getAllFaqItems(page);
  if (visible.length === 0) fail(`${FAQ_ROUTE}: no FAQ items parsed from content sections`);
  const flatFromCategories = categories.flatMap((c) => c.faqs);
  if (flatFromCategories.length !== visible.length) {
    fail(`${FAQ_ROUTE}: visible categories (${flatFromCategories.length}) != flat FAQ array (${visible.length})`);
  }

  // Reconstruct the exact graph pieces the page contributes via PageJsonLdCombined.
  const row = faqStaticPageRow(page);
  const faqNode = buildFaqPageNode(visible);
  const graph = [
    buildWebPageJsonLd(row as any, null),
    ...buildContentPageExtraJsonLd(row as any),
    faqNode,
  ].filter(Boolean);

  // 1. Exactly one FAQPage.
  const faqPages = graph.filter(isFaqPage);
  if (faqPages.length !== 1) {
    fail(`${FAQ_ROUTE}: expected exactly 1 FAQPage node in the emitted graph, found ${faqPages.length}`);
  }

  // 2. mainEntity == the visible Q&A, in order.
  const sole = faqPages[0] as { mainEntity?: Array<{ name?: string; acceptedAnswer?: { text?: string } }> } | undefined;
  const mainEntity = sole?.mainEntity ?? [];
  if (mainEntity.length !== visible.length) {
    fail(`${FAQ_ROUTE}: FAQPage.mainEntity has ${mainEntity.length} entries, visible FAQ has ${visible.length}`);
  } else {
    for (let i = 0; i < visible.length; i++) {
      if (mainEntity[i]?.name !== visible[i].question) {
        fail(`${FAQ_ROUTE}: mainEntity[${i}].name != visible question ${i}`);
      }
      if (mainEntity[i]?.acceptedAnswer?.text !== visible[i].answer) {
        fail(`${FAQ_ROUTE}: mainEntity[${i}].acceptedAnswer.text != visible answer ${i}`);
      }
    }
  }

  // 3. Root-cause guard: the generic schema_type builder must never emit a FAQPage stub.
  const stub = buildSchemaTypeJsonLd(row as any, "FAQPage");
  if (stub !== null) {
    fail(`buildSchemaTypeJsonLd(_, "FAQPage") must return null (it produced a duplicate mainEntity-less FAQPage)`);
  }
  // And the row that feeds buildContentPageExtraJsonLd must not classify as FAQPage.
  if ((row.seo as { schema_type?: unknown }).schema_type === "FAQPage") {
    fail(`faqStaticPageRow.seo.schema_type must not be "FAQPage" (the page emits the FAQPage explicitly)`);
  }
}

if (failures.length) {
  console.error(`[travel-guide-faq-schema-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  "[travel-guide-faq-schema-parity] PASS — /travel-guide/faq emits exactly one FAQPage, " +
    "mainEntity == the visible Q&A array, and the generic schema_type builder emits no FAQPage stub.",
);
