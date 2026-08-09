// src/components/design/Section.tsx
//
// PKG-11a shared layout primitive — the single source of the public-site
// section rhythm: ground colour, vertical density, container width, gutters,
// and the landmark element itself.
//
// CONTRACT
//   • Renders exactly ONE <section> landmark. Callers MUST name it, either with
//     `labelledBy` (the id of the heading it contains) or `label`. TypeScript
//     enforces that one of the two is present.
//   • `surface` is the only page ground allowed:
//       "light" → #fff · "off" → --color-jvto-off · "navy" → --color-jvto-navy
//     "navy" additionally paints the deep-floor gradient + contour texture, so
//     every dark section is the same material instead of N ad-hoc gradients.
//   • `density` is the only vertical rhythm allowed:
//       "major" → 4.5rem / 7rem (a full narrative section)
//       "band"  → --spacing-jvto-band / 4.5rem (a thin rail or logo strip)
//     Sections must not set their own py-*.
//
// This component carries NO copy. Every string stays in the calling section,
// which sources it from the content record or its own local constants.
import type { ReactNode } from "react";

export type SectionSurface = "light" | "off" | "navy";
export type SectionDensity = "major" | "band";

const SURFACE: Record<SectionSurface, string> = {
  light: "bg-white text-jvto-navy",
  off: "bg-jvto-off text-jvto-navy",
  navy: "bg-jvto-navy text-white",
};

const DENSITY: Record<SectionDensity, string> = {
  major: "py-18 md:py-28",
  band: "py-jvto-band md:py-18",
};

type SectionNameProps =
  | { labelledBy: string; label?: never }
  | { label: string; labelledBy?: never };

export type SectionProps = SectionNameProps & {
  children: ReactNode;
  surface?: SectionSurface;
  density?: SectionDensity;
  /**
   * Optional anchor id on the landmark itself (PKG-11b) — for in-page jump
   * links such as the tours hubs' hero → package list. Pair it with a
   * `scroll-mt-*` class so the fixed navbar does not cover the target.
   */
  id?: string;
  /** Extra classes on the <section> itself (ground/overflow tweaks). */
  className?: string;
  /** Extra classes on the inner container (grid setup, etc.). */
  containerClassName?: string;
};

export default function Section({
  children,
  surface = "light",
  density = "major",
  id,
  className = "",
  containerClassName = "",
  labelledBy,
  label,
}: SectionProps) {
  const isNavy = surface === "navy";

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={`relative isolate ${SURFACE[surface]} ${DENSITY[density]} ${className}`}
    >
      {isNavy && (
        <>
          {/* Deep floor: the section fades toward --color-jvto-navy-deep so
              stacked dark sections read as depth rather than a flat slab. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-jvto-navy-deep"
          />
          {/* Contour survey texture — decorative, ≤2.8% alpha. */}
          <div
            aria-hidden="true"
            className="jvto-topo pointer-events-none absolute inset-0 -z-10 opacity-70"
          />
        </>
      )}

      <div className={`mx-auto w-full max-w-7xl px-6 md:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
