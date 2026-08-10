// src/components/design/SectionHeading.tsx
//
// PKG-11a shared heading primitive — the "spec-sheet header line" used at the
// top of every narrative section:
//
//   ───────────────────────────────────────────────────────────  (hairline rule)
//   § 02                                    16 private itineraries · 1D–6D
//   Find your perfect route.
//
// CONTRACT
//   • Renders the rule + eyebrow + heading + optional aside. It supplies NO
//     copy: `eyebrow`, `title` and `aside` are passed in by the calling section,
//     which owns them (content record or its own local constants).
//   • `id` MUST match the `labelledBy` passed to the enclosing <Section>, so the
//     landmark's accessible name is this heading.
//   • It always renders an <h2>: it names a top-level page section, and the
//     only sub-headings on the homepage (card titles, timeline entries) are
//     plain <h3>s owned by their own component.
//   • `tone` follows the Section surface: "light" on white/off-white grounds,
//     "dark" on navy. It only swaps the rule + secondary text colours, both of
//     which are AA-rated pairs from the website.css token set.
import type { ReactNode } from "react";

export type SectionHeadingTone = "light" | "dark";

export interface SectionHeadingProps {
  /** Must equal the enclosing <Section>'s `labelledBy`. */
  id: string;
  /** Short structural label, e.g. "§ 02". Supplied by the caller. */
  eyebrow: ReactNode;
  /** Heading content. ReactNode so callers can accent a clause inline. */
  title: ReactNode;
  /** Optional right-hand meta or link, sitting on the rule line. */
  aside?: ReactNode;
  tone?: SectionHeadingTone;
  /** Extra classes on the wrapper (usually bottom spacing). */
  className?: string;
  /** Extra classes on the heading element (usually a max-width). */
  titleClassName?: string;
}

export default function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
  tone = "light",
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className={`mb-10 md:mb-14 ${className}`}>
      <div
        className={`flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t pt-4 ${
          isDark ? "border-white/15" : "border-jvto-rule"
        }`}
      >
        <p
          className={`font-mono text-[10px] font-bold uppercase tracking-[0.22em] ${
            isDark ? "text-jvto-on-navy-dim" : "text-jvto-ink-soft"
          }`}
        >
          {eyebrow}
        </p>
        {aside ? (
          <div
            className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
              isDark ? "text-jvto-on-navy-dim" : "text-jvto-ink-soft"
            }`}
          >
            {aside}
          </div>
        ) : null}
      </div>

      <h2
        id={id}
        className={`font-jvto-heading mt-5 text-[1.75rem] leading-[1.08] font-black tracking-[-0.02em] md:text-[2.5rem] ${
          isDark ? "text-white" : "text-jvto-navy"
        } ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}
