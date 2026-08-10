// MILESTONE 2 (2026-08-09): the homepage FAQ is no longer imported from the
// hardcoded canonical registry here. The page passes `items` straight from
// content/faqs/home.json — the SAME array that builds the FAQPage JSON-LD — so
// the visible accordion and the structured data can never diverge (AD-08).
//
// PKG-11a is a VISUAL pass only: the `items` prop, its order, and the balanced
// two-column split are untouched. Every question rendered here is still exactly
// the array the FAQPage node was built from.
import Link from "@/components/website/AppLink";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

type HomeFaqItem = { question: string; answer: string };

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  return (
    <details className="group border-l-2 border-transparent py-5 pl-0 transition-[border-color,padding] duration-300 open:border-jvto-orange open:pl-5">
      <summary className="jvto-focus flex cursor-pointer list-none items-start justify-between gap-4 rounded-sm [&::-webkit-details-marker]:hidden">
        <span className="text-sm leading-snug font-bold text-jvto-navy md:text-base">
          <span className="mr-2 font-mono text-jvto-ink-soft">
            Q{String(index + 1).padStart(2, "0")}
          </span>
          <span className="group-hover:underline decoration-jvto-orange decoration-2 underline-offset-4">
            {question}
          </span>
        </span>
        <span
          className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border border-jvto-border bg-white text-xs text-jvto-ink-soft transition-all duration-200 group-hover:border-jvto-navy/30 group-hover:text-jvto-navy group-open:rotate-45 group-open:border-jvto-orange group-open:text-jvto-orange"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="mt-3 pr-9 text-sm leading-relaxed text-jvto-ink-soft">{answer}</p>
    </details>
  );
}

export default function HomeFAQ({ items }: { items: HomeFaqItem[] }) {
  if (!items.length) return null;

  // Two balanced columns — with the canonical 6 Q&A this is the same 3 / 3 split
  // the hardcoded slice produced, and it stays correct if the set ever changes.
  const mid = Math.ceil(items.length / 2);
  const leftFaqs = items.slice(0, mid);
  const rightFaqs = items.slice(mid);

  return (
    <Section surface="off" labelledBy="faq-heading">
      <SectionHeading
        id="faq-heading"
        eyebrow="§ 09 · FAQ"
        title={
          <>
            Common <span className="text-jvto-orange">questions.</span>
          </>
        }
      />

      <div className="grid grid-cols-1 border-t border-jvto-rule md:grid-cols-2 md:gap-x-16">
        <div className="flex flex-col divide-y divide-jvto-border">
          {leftFaqs.map((faq, i) => (
            <FaqItem key={faq.question} {...faq} index={i} />
          ))}
        </div>
        <div className="flex flex-col divide-y divide-jvto-border border-t border-jvto-border md:border-t-0">
          {rightFaqs.map((faq, i) => (
            <FaqItem key={faq.question} {...faq} index={i + leftFaqs.length} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <Link
          href="/travel-guide/faq"
          className="jvto-focus rounded-sm text-sm font-bold text-jvto-navy transition-colors hover:text-jvto-orange"
        >
          See all questions <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </Section>
  );
}
