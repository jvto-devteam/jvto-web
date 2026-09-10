// src/lib/tourFaqResolution.ts
//
// The single place the visible tour-detail FAQ list is assembled (backlog T05B).
//
// Before this existed the list was computed twice from the same inputs — once on
// the server in each PDP page.tsx, and again on the client in TourDetail.tsx —
// and the FAQPage schema was a THIRD, longer list that also contained
// narrative-claim pillars and package FAQs the page never rendered. Measured at
// the time: 905 of 1162 Question nodes site-wide had no on-page counterpart, 779
// of them on the 17 tour pages (docs/audit/baseline-2026-08-30/render_chain_audit.md:396).
//
// Now the server resolves once and hands the same array to both the renderer and
// the schema builder, so "what the page says" and "what the structured data
// claims" cannot drift apart.
//
// Pure: no I/O, no clock, no randomness. Everything it needs is passed in.
import type { TourSpineFaqItem } from "@/lib/ecosystemContent/tourSpineFaq";
import type { IjenRequirementFaqItem } from "@/lib/ecosystemContent/ijenCraterRequirements";

/**
 * Where a Q&A is rendered. ALL THREE surfaces are visible to a reader and all
 * three are counted by the parity gate — this is not a visible/hidden split.
 * Nothing may appear on two surfaces, or it renders twice while the schema
 * counts it once.
 *
 *  - `quick-answers`  the 8–9 canonical spine items, as open cards
 *  - `package`        the per-package FAQs, as a collapsed accordion. Measured
 *                     2026-09-11: 13–71 per route, 772 across the 17 PDPs. Open
 *                     cards would have put up to 80 of them on one page and
 *                     buried the spine, so they get their own folded section
 *                     (owner decision 2026-09-11).
 *  - `requirements`   the Ijen requirements accordion, left exactly as it was
 *                     (owner decision 2026-09-10).
 */
export type FaqSurface = "quick-answers" | "package" | "requirements";

export interface ResolvedFaq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly surface: FaqSurface;
  /** Ekosistem records this answer's facts came from; empty for locally-sourced groups. */
  readonly sourceTrace: readonly string[];
  readonly uiMeta?: string;
  readonly uiLink?: string;
}

const PACKAGE_CONTRACT_TRACE = "2-product-and-commercial-core/tour-products";
const IJEN_REQUIREMENTS_TRACE =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/ijen-crater-tour-requirements.json";

/**
 * Flatten a segmented answer into the plain string the accordion renders.
 *
 * TourRequirements answers are `{ text, strong? }[]`, not strings, so they
 * cannot become an Answer.text unflattened. The result must equal the
 * accordion's rendered text exactly — the live parity gate compares the two.
 */
function flattenSegments(item: IjenRequirementFaqItem): string {
  const segments = item.answerSegments;
  if (!Array.isArray(segments)) return "";
  return segments.map((s) => s?.text ?? "").join("");
}

export function resolveVisibleTourFaqs({
  spineItems,
  ijenRelevant,
  ijenRequirementFaqs,
  packageFaqs,
}: {
  spineItems: readonly TourSpineFaqItem[];
  ijenRelevant: boolean;
  ijenRequirementFaqs: readonly IjenRequirementFaqItem[];
  packageFaqs: readonly { question: string; answer: string }[];
}): ResolvedFaq[] {
  const resolved: ResolvedFaq[] = [];

  // 1. Canonical spine from ekosistem. `applies_when` is the payload's own gate;
  //    an unknown value is excluded rather than guessed at.
  for (const item of spineItems) {
    if (item.applies_when === "ijen_only" && !ijenRelevant) continue;
    if (item.applies_when !== "always" && item.applies_when !== "ijen_only") continue;
    resolved.push({
      id: item.id,
      question: item.question,
      answer: item.answer,
      surface: "quick-answers",
      sourceTrace: item.source_trace?.source_files ?? [],
      ...(item.ui_meta ? { uiMeta: item.ui_meta } : {}),
      ...(item.ui_link ? { uiLink: item.ui_link } : {}),
    });
  }

  // 2. Ijen requirements accordion. Rendered by TourRequirements, gated by the
  //    same ijenRelevant the caller used — see the note on FaqSurface.
  if (ijenRelevant) {
    ijenRequirementFaqs.forEach((item, index) => {
      const answer = flattenSegments(item);
      if (!item?.question || answer === "") return;
      resolved.push({
        id: `ijen-req-${index}`,
        question: item.question,
        answer,
        surface: "requirements",
        sourceTrace: [IJEN_REQUIREMENTS_TRACE],
      });
    });
  }

  // 3. Per-package FAQs from the product contract. Schema-only until T05B; now
  //    rendered too, so the schema stops asserting unseen content. Their own
  //    collapsed surface because there are 13-71 of them per route.
  packageFaqs.forEach((faq, index) => {
    if (!faq?.question || !faq?.answer) return;
    resolved.push({
      id: `pkg-${index}`,
      question: faq.question,
      answer: faq.answer,
      surface: "package",
      sourceTrace: [PACKAGE_CONTRACT_TRACE],
    });
  });

  return resolved;
}

/** Selects one visible surface. The others are elsewhere on the page, not hidden. */
export function faqsForSurface(
  faqs: readonly ResolvedFaq[],
  surface: FaqSurface,
): readonly ResolvedFaq[] {
  return faqs.filter((f) => f.surface === surface);
}

/** The open cards at the top of the page: the canonical spine. */
export function quickAnswerFaqs(
  faqs: readonly ResolvedFaq[],
): readonly ResolvedFaq[] {
  return faqsForSurface(faqs, "quick-answers");
}

/** The collapsed per-package section. */
export function packageFaqEntries(
  faqs: readonly ResolvedFaq[],
): readonly ResolvedFaq[] {
  return faqsForSurface(faqs, "package");
}
