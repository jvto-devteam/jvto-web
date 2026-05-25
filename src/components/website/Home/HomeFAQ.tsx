// src/components/website/Home/HomeFAQ.tsx
import Link from "@/components/website/AppLink";
import { HOMEPAGE_FAQS } from "@/lib/homepageFaqs";

const DISPLAY_FAQS = HOMEPAGE_FAQS.slice(0, 6);
const LEFT_FAQS = DISPLAY_FAQS.slice(0, 3);
const RIGHT_FAQS = DISPLAY_FAQS.slice(3);

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group py-5">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
        <span className="font-bold text-jvto-navy text-sm md:text-base leading-snug">
          {question}
        </span>
        <span
          className="flex-shrink-0 w-5 h-5 rounded-full border border-jvto-navy/20 flex items-center justify-center text-jvto-navy/50 text-xs mt-0.5 group-open:rotate-45 transition-transform"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-jvto-navy/60 text-sm leading-relaxed pr-9">
        {answer}
      </p>
    </details>
  );
}

export default function HomeFAQ() {
  return (
    <section aria-labelledby="faq-heading" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-12"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Common Questions
        </h2>

        {/* 2 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
          <div className="flex flex-col divide-y divide-jvto-navy/10">
            {LEFT_FAQS.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
          <div className="flex flex-col divide-y divide-jvto-navy/10 border-t border-jvto-navy/10 md:border-t-0">
            {RIGHT_FAQS.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/travel-guide/faq"
            className="text-sm font-bold text-jvto-navy/60 hover:text-jvto-navy underline"
          >
            See all questions <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
