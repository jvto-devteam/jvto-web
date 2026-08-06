// src/app/(website)/verify-jvto/verifyShared.tsx
//
// PACKAGE 06 (2026-08-06): shared server-side helpers + narrative renderer for the
// verify-jvto cluster after its migration to the static-content SSOT
// (content/pages/verify-jvto/**). Every verify route now reads copy, SEO, and FAQ
// from content/; this module keeps only layout/rendering and the JSON-LD projection
// of that content — no DB, no seed, no snapshot. The evidence locker (VerifyJvtoClient
// + getDocsByGroup) remains its own Master_Dataset SSOT and is unaffected.
import { Faq } from "@/components/content/Faq";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
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

/**
 * Renders the evergreen narrative (BlocksRenderer sections) + the visible FAQ for a
 * verify-jvto page, from content/. The same page.faq array feeds the FAQPage JSON-LD
 * in the page component, so visible Q&A and structured data never diverge (AD-08).
 * Sits below the evidence-locker shell (VerifyJvtoClient) and continues its light
 * slate backdrop.
 */
export default function VerifyNarrative({ page }: { page: StaticPage }) {
  const sections = page.sections ?? [];
  const faqItems = (page.faq ?? []).map((f) => ({ q: f.question, a: f.answer }));
  if (sections.length === 0 && faqItems.length === 0) return null;

  return (
    <div style={{ background: "#f6f6f8", padding: "0 1.5rem 4rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "1.75rem 2rem",
              marginBottom: "1.5rem",
              scrollMarginTop: "7rem",
            }}
          >
            {sec.title && (
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  color: "#0f172a",
                  margin: "0 0 1.1rem",
                }}
              >
                {sec.title}
              </h2>
            )}
            {sec.blocks ? (
              <BlocksRenderer blocks={sec.blocks as never} sectionId={sec.id} />
            ) : null}
          </section>
        ))}

        {faqItems.length > 0 && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "0.5rem 2rem 1.75rem",
            }}
          >
            <Faq items={faqItems} title="FAQ" />
          </div>
        )}
      </div>
    </div>
  );
}
