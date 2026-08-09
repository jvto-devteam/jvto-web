// src/app/(website)/markets/marketShared.ts
//
// Milestone 2 (2026-08-09): shared server-side projections for the /markets/* cluster after
// its migration to the static-content SSOT (content/pages/markets/**). Both market routes
// read copy, SEO, canonical, and FAQ from content/; these helpers only project that record
// into JSON-LD. No DB, no CMS seed, no snapshot.
import { PRODUCTION_ORIGIN, type StaticPage } from "@/lib/static-content";

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
export function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      // Non-default schema classification from the content file (null = WebPage only).
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

/** Visible FAQ HTML and the FAQPage JSON-LD share this one content array (AD-08). */
export function buildStaticFaqSchema(route: string, faq: NonNullable<StaticPage["faq"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PRODUCTION_ORIGIN}${route}#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
