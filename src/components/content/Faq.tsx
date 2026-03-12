// components/content/Faq.tsx
import React from "react";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";

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
    <section
      style={{
        marginTop: "3rem",
        paddingTop: "2.5rem",
        borderTop: "1px solid #dde3d0",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            display: "block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#9fce33",
            marginBottom: "0.3rem",
          }}
        >
          ◆ Quick Answers
        </span>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.35rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#0c0e09",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* FAQ items — native <details> accordion */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
      >
        {items.map((it, idx) => (
          <details
            key={`${idx}-${it.q}`}
            style={{
              background: "#ffffff",
              border: "1px solid #dde3d0",
              borderRadius: "0.875rem",
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
                  background: "#9fce33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "0.05rem",
                }}
              >
                <MessageCircleQuestion size={14} color="#0c0e09" />
              </div>

              {/* Question text */}
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#0c0e09",
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
                color="#9aaa80"
                style={{
                  flexShrink: 0,
                  marginTop: "0.25rem",
                  transition: "transform 0.25s",
                }}
                className="jvto-faq-chevron"
              />
            </summary>

            {/* Answer */}
            <div
              style={{
                padding: "0 1.25rem 1.125rem 3.75rem",
                fontSize: "0.85rem",
                color: "#4a5a35",
                lineHeight: 1.75,
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "pre-wrap",
              }}
            >
              {it.a}
            </div>
          </details>
        ))}
      </div>

      {/* Scoped hover + open styles */}
      <style>{`
        .jvto-faq-item[open] {
          border-color: rgba(159,206,51,0.40);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .jvto-faq-item:not([open]):hover {
          border-color: rgba(159,206,51,0.25);
        }
        .jvto-faq-item[open] .jvto-faq-icon {
          background: #0c0e09;
        }
        .jvto-faq-item[open] .jvto-faq-icon svg {
          color: #9fce33 !important;
          stroke: #9fce33 !important;
        }
        .jvto-faq-item[open] .jvto-faq-chevron {
          transform: rotate(90deg);
          color: #9fce33 !important;
          stroke: #9fce33 !important;
        }
        .jvto-faq-item summary::-webkit-details-marker { display: none; }
      `}</style>
    </section>
  );
}
