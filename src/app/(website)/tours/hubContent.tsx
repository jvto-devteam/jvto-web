// src/app/(website)/tours/hubContent.tsx
//
// Milestone 2 (2026-08-09): shared read helpers for the three tours HUB routes
// (/tours, /tours/from-bali, /tours/from-surabaya), which are served from the
// static-content SSOT (content/pages/tours/*.json).
//
// Scope rules this module encodes:
//   - content/ owns the EVERGREEN NARRATIVE only (hero lede, explainer prose,
//     inclusions/credential/booking copy). It never carries a package, a price,
//     or a package count — those stay DYNAMIC from the package data helper the
//     hubs already call (getPublicPackageList).
//   - one FAQ array (page.faq) feeds BOTH the visible Q&A block and the single
//     FAQPage JSON-LD node per page (AD-08) — they can never diverge.
import type { StaticPage } from "@/lib/static-content";
import { PRODUCTION_ORIGIN } from "@/lib/static-content";

const DISPLAY_FONT = { fontFamily: "Raleway, Inter, sans-serif" };

type AnyRecord = Record<string, unknown>;

function findSection(page: StaticPage, id: string) {
  return page.sections?.find((s) => s.id === id);
}

/**
 * Paragraphs of a content section's markdown prose, split on blank lines.
 * Used where the hub renders plain <p> copy today — no markup transformation,
 * so visible output is identical to the previously hardcoded strings.
 */
export function hubProse(page: StaticPage, sectionId: string): string[] {
  const sec = findSection(page, sectionId);
  if (!sec) return [];
  const bodies: string[] = [];
  if (sec.body_md) bodies.push(sec.body_md);
  for (const block of sec.blocks ?? []) {
    if (block.type === "markdown") bodies.push(block.body_md);
  }
  return bodies
    .join("\n\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** The raw grid block of a section carrying `variant` (loose — extra keys allowed). */
export function hubGridBlock(
  page: StaticPage,
  sectionId: string,
  variant: string,
): AnyRecord | undefined {
  const sec = findSection(page, sectionId);
  for (const block of sec?.blocks ?? []) {
    if (block.type !== "grid") continue;
    const record = block as unknown as AnyRecord;
    if (record.variant === variant) return record;
  }
  return undefined;
}

/** Items of the grid block of a section carrying `variant`. */
export function hubGrid<T>(page: StaticPage, sectionId: string, variant: string): T[] {
  return (hubGridBlock(page, sectionId, variant)?.items as T[] | undefined) ?? [];
}

/** One item of a variant grid, looked up by its `key` field. */
export function hubGridItem<T extends { key: string }>(
  page: StaticPage,
  sectionId: string,
  variant: string,
  key: string,
): T | undefined {
  return hubGrid<T>(page, sectionId, variant).find((item) => item.key === key);
}

/** Single FAQPage node for the route, built from the same array the HTML renders. */
export function buildHubFaqSchema(route: string, faq: NonNullable<StaticPage["faq"]>) {
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
 * Visible Q&A block. Renders the SAME `page.faq` array that feeds the FAQPage
 * JSON-LD, in the hub's existing section chrome (eyebrow + display heading).
 */
export function HubFaqSection({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: NonNullable<StaticPage["faq"]>;
}) {
  if (items.length === 0) return null;
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">
            {eyebrow}
          </span>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
            style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
          >
            Common <em className="text-jvto-orange not-italic">questions.</em>
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">
            Before you book
          </span>
        </div>

        <dl className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.question}
              className="bg-jvto-off border border-jvto-border rounded-[24px] p-8"
            >
              <dt className="text-lg font-black text-jvto-navy mb-3" style={DISPLAY_FONT}>
                {item.question}
              </dt>
              <dd className="text-sm text-jvto-muted leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
