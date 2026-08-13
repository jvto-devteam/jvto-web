// components/content/Faq.tsx
import React from "react";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";

type FaqItem = { q: string; a: string };

export function Faq({
  items,
  title = "FAQ",
  eyebrow = "◆ Quick Answers",
}: {
  items?: FaqItem[];
  title?: string | null;
  eyebrow?: string | null;
}) {
  if (!items?.length) return null;
  const hasHeader = Boolean(title || eyebrow);

  return (
    <section
      style={{
        marginTop: "3rem",
        paddingTop: "2.5rem",
        borderTop: "1px solid var(--color-jvto-border)",
      }}
    >
      {hasHeader ? (
        <div style={{ marginBottom: "1.5rem" }}>
          {eyebrow ? (
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "0.6rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--color-jvto-orange)",
                marginBottom: "0.3rem",
              }}
            >
              {eyebrow}
            </span>
          ) : null}
          {title ? (
            <h2
              style={{
                fontFamily: "var(--font-raleway), sans-serif",
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--color-jvto-navy)",
                margin: 0,
              }}
            >
              {title}
            </h2>
          ) : null}
        </div>
      ) : null}

      {/* FAQ items — native <details> accordion */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
      >
        {items.map((it, idx) => (
          <details
            key={`${idx}-${it.q}`}
            style={{
              background: "#ffffff",
              border: "1px solid var(--color-jvto-border)",
              borderRadius: "var(--radius-jvto-sm)",
              overflow: "hidden",
            }}
            className="jvto-faq-item"
          >
            <summary
              style={{
                cursor: "pointer",
                listStyle: "none",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                userSelect: "none",
              }}
            >
              {/* Icon box */}
              <div
                className="jvto-faq-icon"
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.5rem",
                  background: "var(--color-jvto-lime)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "0.05rem",
                }}
              >
                <MessageCircleQuestion size={14} />
              </div>

              {/* Question text */}
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-jvto-navy)",
                  flex: 1,
                  lineHeight: 1.45,
                  paddingTop: "0.2rem",
                }}
              >
                {it.q}
              </span>

              {/* Chevron */}
              <ArrowRight
                size={16}
                color="var(--color-jvto-muted)"
                style={{
                  flexShrink: 0,
                  marginTop: "0.25rem",
                  transition: "transform 0.25s",
                }}
                className="jvto-faq-chevron"
              />
            </summary>

            {/* Answer */}
            <div className="jvto-faq-answer">
              <MarkdownRenderer markdown={it.a} />
            </div>
          </details>
        ))}
      </div>

      {/* Scoped hover + open styles */}
      <style>{`
        .jvto-faq-item[open] {
          border-color: rgba(140,198,63,0.40);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .jvto-faq-item:not([open]):hover {
          border-color: rgba(140,198,63,0.25);
        }

        /* Default: icon hitam di atas background hijau */
        .jvto-faq-icon {
          color: var(--color-jvto-navy);
        }

        /* Open: background navy, icon jadi lime */
        .jvto-faq-item[open] .jvto-faq-icon {
          background: var(--color-jvto-navy) !important;
          color: var(--color-jvto-lime);
        }
        /* Pastikan SVG inherit color dari wrapper */
        .jvto-faq-icon svg {
          color: inherit;
          stroke: currentColor;
        }

        .jvto-faq-item[open] .jvto-faq-chevron {
          transform: rotate(90deg);
          color: var(--color-jvto-lime) !important;
          stroke: var(--color-jvto-lime) !important;
        }
        .jvto-faq-item summary::-webkit-details-marker { display: none; }

        /* Answer wrapper: padding + override prose size/color */
        .jvto-faq-answer {
          padding: 0 1.25rem 1.125rem 3.75rem;
        }
        .jvto-faq-answer .jvto-prose {
          font-size: 0.85rem;
          color: var(--color-jvto-navy);
          line-height: 1.75;
        }
        .jvto-faq-answer .jvto-prose p {
          margin: 0 0 0.4rem;
        }
        .jvto-faq-answer .jvto-prose p:last-child {
          margin-bottom: 0;
        }
        /* Heading di dalam answer tidak perlu besar */
        .jvto-faq-answer .jvto-prose h1,
        .jvto-faq-answer .jvto-prose h2,
        .jvto-faq-answer .jvto-prose h3 {
          font-size: 0.85rem;
          margin-top: 0.5rem;
          border-bottom: none;
        }
      `}</style>
    </section>
  );
}
