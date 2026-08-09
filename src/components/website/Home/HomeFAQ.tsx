// MILESTONE 2 (2026-08-09): the homepage FAQ is no longer imported from the
// hardcoded canonical registry here. The page passes `items` straight from
// content/faqs/home.json — the SAME array that builds the FAQPage JSON-LD — so
// the visible accordion and the structured data can never diverge (AD-08).
import Link from "@/components/website/AppLink";

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
    <details className="group py-5">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-bold text-jvto-navy text-sm md:text-base leading-snug">
          <span className="font-mono text-jvto-muted/60 mr-2">
            Q{String(index + 1).padStart(2, "0")}
          </span>
          {question}
        </span>
        <span
          className="flex-shrink-0 w-5 h-5 rounded-sm border border-jvto-border flex items-center justify-center text-jvto-muted text-xs mt-0.5 group-open:rotate-45 transition-transform duration-200"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-jvto-muted text-sm leading-relaxed pr-9">
        {answer}
      </p>
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
    <section aria-labelledby="faq-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
          § 09 · FAQ
        </p>
        <h2
          id="faq-heading"
          className="font-black text-2xl md:text-3xl text-jvto-navy mb-12"
        >
          Common <span className="text-jvto-orange">questions.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 border-t border-jvto-border">
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
            className="text-sm font-bold text-jvto-muted hover:text-jvto-navy transition-colors"
          >
            See all questions <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
