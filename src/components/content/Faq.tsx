// components/content/Faq.tsx
import React from "react";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";

type FaqItem = { q: string; a: string };

export function Faq({
  items,
  title = "FAQ",
}: {
  items?: FaqItem[];
  title?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-12 pt-10 border-t border-[#dde3d0]">
      {/* Header */}
      <div className="mb-6">
        <span className="block font-mono text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[#9fce33] mb-[0.3rem]">
          ◆ Quick Answers
        </span>
        <h2 className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-[#0c0e09] m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
          {title}
        </h2>
      </div>

      {/* FAQ items — native <details> accordion */}
      <div className="flex flex-col gap-[0.625rem]">
        {items.map((it, idx) => (
          <details
            key={`${idx}-${it.q}`}
            className="jvto-faq-item bg-white border border-[#dde3d0] rounded-[0.875rem] overflow-hidden"
          >
            <summary className="cursor-pointer list-none p-4 px-5 flex items-start gap-3 select-none">
              {/* Icon box */}
              <div
                className="jvto-faq-icon w-8 h-8 rounded-lg bg-[#9fce33] flex items-center justify-center shrink-0 mt-[0.05rem]"
              >
                <MessageCircleQuestion size={14} />
              </div>

              {/* Question text */}
              <span className="text-[0.875rem] font-semibold text-[#0c0e09] flex-1 leading-[1.45] pt-[0.2rem]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {it.q}
              </span>

              {/* Chevron */}
              <ArrowRight
                size={16}
                color="#9aaa80"
                className="jvto-faq-chevron shrink-0 mt-1 transition-transform duration-[0.25s]"
              />
            </summary>

            {/* Answer */}
            <div className="jvto-faq-answer">
              <MarkdownRenderer markdown={it.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
