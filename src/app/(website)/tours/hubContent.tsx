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
//
// PKG-11b (visual layer): the lower funnel that /tours/from-bali and
// /tours/from-surabaya render identically — inclusions, the why grid, the
// independent-signals table, the booking ladder, the FAQ and the closing plate
// — now lives here as one set of section components instead of two divergent
// copies of the same 250 lines. Every one of them is a pure presentation shell:
// all copy is passed in by the calling route, which sources it from the content
// record or its own local constants. Route differentiation is deliberately
// pushed UP the page (hero, ledger, first section), not scattered through the
// proof sections, so the two departure hubs stay one product below the fold.
//
// Colour discipline (extends PKG-11a): --color-jvto-orange is 3.34:1 behind
// white text and as text on white, so it is used only for large display accents
// and non-text ornament. Small text uses -ink-soft / -navy on light grounds and
// -on-navy / -on-navy-dim on navy; lime as text on a light ground is always
// -lime-ink (the bright lime is 1.9:1 there).
import type { ReactNode } from "react";
import { Award, Check, FileText, Shield, Users } from "lucide-react";
import Link from "@/components/website/AppLink";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";
import type { StaticPage } from "@/lib/static-content";
import { PRODUCTION_ORIGIN } from "@/lib/static-content";

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

// ── Shared content-record shapes (all three hubs read the same JSON blocks) ──

export type HubInclusion = { label: string; detail: string };
export type HubExclusion = { label: string };
export type HubCallout = { key: string; lead: string; body: string };
export type HubSignal = { signal: string; source: string };
export type HubBookingStep = { step: string; title: string; text: string };
export type HubTerm = { k: string; v: string };
export type HubNote = {
  key: string;
  lead: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
};

/** Content-owned `why` copy → the icons that render it (icons stay presentational). */
export const WHY_ICONS = {
  shield: Shield,
  users: Users,
  "file-text": FileText,
  award: Award,
} as const;

export type HubWhyItem = {
  icon: keyof typeof WHY_ICONS;
  title: string;
  body: string;
};

/** Credential strip shown in every hub hero (identical on all three routes). */
export const HUB_CREDENTIALS = [
  "NIB 1102230032918",
  "Trustpilot 4.8/5 · 51 reviews",
  "Founded 2015",
] as const;

/** Column headers of the independent-signals table (identical on both hubs). */
const SIGNAL_COLUMNS = ["Signal", "Source"] as const;

/** Label above the exclusions chip list (identical on both hubs). */
const EXCLUSIONS_LABEL = "Not included";

const WHATSAPP_HREF = "https://wa.me/6282244788833";

// ── Section shells ──────────────────────────────────────────────────────────

/** Evergreen explainer prose at a comfortable measure. */
export function HubProse({
  paragraphs,
  className = "",
}: {
  paragraphs: string[];
  className?: string;
}) {
  if (paragraphs.length === 0) return null;
  return (
    <div className={`max-w-[68ch] space-y-5 ${className}`}>
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="text-base leading-relaxed text-jvto-ink-soft md:text-lg"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/**
 * "Every package includes — in writing." The inclusion list is a <dl> ledger
 * rather than a bulleted paragraph stack: label and detail are separated, so a
 * visitor comparing two hubs can skim the labels alone.
 */
export function HubInclusions({
  eyebrow,
  headingId,
  title,
  aside,
  inclusions,
  exclusions,
  note,
}: {
  eyebrow: ReactNode;
  headingId: string;
  title: ReactNode;
  aside?: ReactNode;
  inclusions: HubInclusion[];
  exclusions: HubExclusion[];
  note?: HubCallout;
}) {
  return (
    <Section surface="light" labelledBy={headingId}>
      <SectionHeading id={headingId} eyebrow={eyebrow} title={title} aside={aside} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <dl className="border-t border-jvto-rule">
          {inclusions.map((item) => (
            <div key={item.label} className="border-b border-jvto-border py-4">
              <dt className="flex items-start gap-3 text-sm leading-snug font-bold text-jvto-navy">
                <Check
                  aria-hidden="true"
                  className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-jvto-lime-ink"
                  strokeWidth={2.75}
                />
                <span>{item.label}</span>
              </dt>
              <dd className="mt-1.5 pl-[30px] text-sm leading-relaxed text-jvto-ink-soft">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>

        <div className="lg:sticky lg:top-32">
          <div className="rounded-sm border border-jvto-border bg-jvto-off p-6">
            <p className="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-jvto-ink-soft uppercase">
              {EXCLUSIONS_LABEL}
            </p>
            <ul className="flex flex-wrap gap-2">
              {exclusions.map((item) => (
                <li
                  key={item.label}
                  className="rounded-sm border border-jvto-border bg-white px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em] text-jvto-ink-soft uppercase"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {note && (
            <div className="relative mt-5 overflow-hidden rounded-sm border border-jvto-border bg-jvto-off p-5">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px] bg-jvto-lime"
              />
              <p className="pl-3 text-sm leading-relaxed text-jvto-navy">
                <strong className="font-bold">{note.lead}</strong> {note.body}
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/** "The facts behind the booking." Four credential tiles, dossier-tab styling. */
export function HubWhyGrid({
  eyebrow,
  headingId,
  title,
  aside,
  items,
}: {
  eyebrow: ReactNode;
  headingId: string;
  title: ReactNode;
  aside?: ReactNode;
  items: HubWhyItem[];
}) {
  return (
    <Section surface="off" labelledBy={headingId}>
      <SectionHeading id={headingId} eyebrow={eyebrow} title={title} aside={aside} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((item) => {
          const Icon = WHY_ICONS[item.icon] ?? Shield;
          return (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-sm border border-jvto-border bg-white p-7 pt-8 shadow-jvto-soft"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-jvto-navy/15"
              />
              <Icon
                aria-hidden="true"
                className="mb-5 h-6 w-6 text-jvto-orange"
                strokeWidth={1.5}
              />
              <h3 className="font-jvto-heading mb-2.5 text-lg font-black text-jvto-navy">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-jvto-ink-soft">{item.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/** "Check us before you book." Signal → source, on the dark proof ground. */
export function HubSignals({
  eyebrow,
  headingId,
  title,
  aside,
  signals,
  prose,
}: {
  eyebrow: ReactNode;
  headingId: string;
  title: ReactNode;
  aside?: ReactNode;
  signals: HubSignal[];
  prose: string[];
}) {
  return (
    <Section surface="navy" labelledBy={headingId}>
      <SectionHeading
        id={headingId}
        eyebrow={eyebrow}
        title={title}
        aside={aside}
        tone="dark"
      />

      <div className="overflow-hidden rounded-sm border border-white/15">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-white/[0.05]">
              {SIGNAL_COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3.5 font-mono text-[10px] font-bold tracking-[0.18em] text-jvto-on-navy uppercase md:px-5"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {signals.map((row) => (
              <tr key={row.signal} className="border-t border-white/10">
                <th
                  scope="row"
                  className="px-4 py-4 text-left text-[13px] leading-snug font-bold text-white md:px-5"
                >
                  {row.signal}
                </th>
                <td className="px-4 py-4 text-[13px] leading-snug text-jvto-on-navy md:px-5">
                  {row.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {prose.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="mt-6 max-w-[68ch] text-[13px] leading-relaxed text-jvto-on-navy"
        >
          {paragraph}
        </p>
      ))}
    </Section>
  );
}

/**
 * "Book direct — no agency fees." The four-step ladder plus the terms card and
 * the two actions. Step headings are <h3> (the section heading is the <h2>);
 * they were <h4> before, which skipped a level.
 */
export function HubBookDirect({
  eyebrow,
  headingId,
  title,
  aside,
  steps,
  terms,
  notes,
  primaryLabel,
  secondaryLabel,
}: {
  eyebrow: ReactNode;
  headingId: string;
  title: ReactNode;
  aside?: ReactNode;
  steps: HubBookingStep[];
  terms: HubTerm[];
  notes: HubNote[];
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <Section surface="light" labelledBy={headingId}>
      <SectionHeading id={headingId} eyebrow={eyebrow} title={title} aside={aside} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <ol className="border-t border-jvto-rule">
          {steps.map(({ step, title: stepTitle, text }) => (
            <li
              key={step}
              className="grid grid-cols-[auto_1fr] items-start gap-x-5 border-b border-jvto-border py-5"
            >
              <span
                aria-hidden="true"
                className="mt-1 border-l-2 border-jvto-orange pl-3 font-mono text-[11px] font-bold tracking-[0.18em] text-jvto-navy"
              >
                {step}
              </span>
              <div>
                <h3 className="font-jvto-heading mb-1 text-lg font-black text-jvto-navy">
                  {stepTitle}
                </h3>
                <p className="text-sm leading-relaxed text-jvto-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-sm border border-jvto-border bg-jvto-off p-7 sm:grid-cols-2">
            {terms.map(({ k, v }) => (
              <div key={k}>
                <dt className="mb-1 font-mono text-[10px] font-bold tracking-[0.18em] text-jvto-ink-soft uppercase">
                  {k}
                </dt>
                <dd className="text-sm leading-snug font-semibold text-jvto-navy">{v}</dd>
              </div>
            ))}
          </dl>

          {notes.map((note) => (
            <p
              key={note.key}
              className="mt-4 rounded-sm border border-jvto-border bg-white p-5 text-sm leading-relaxed text-jvto-navy"
            >
              <strong className="font-bold">{note.lead}</strong> {note.body}
              {note.linkHref && note.linkLabel && (
                <>
                  {" "}
                  <Link
                    href={note.linkHref}
                    className="jvto-focus rounded-sm font-bold text-jvto-navy underline decoration-jvto-orange decoration-2 underline-offset-4 transition-colors hover:text-jvto-orange-hover"
                  >
                    {note.linkLabel}
                  </Link>
                </>
              )}
            </p>
          ))}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="jvto-focus inline-flex items-center justify-center gap-2 rounded-sm bg-jvto-navy px-7 py-3.5 text-sm font-bold tracking-wider text-white uppercase shadow-jvto-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-jvto-navy-raise hover:shadow-jvto-card-hover"
            >
              {primaryLabel}
              <span aria-hidden="true">&rarr;</span>
            </a>
            <Link
              href="/tours"
              className="jvto-focus inline-flex items-center justify-center gap-2 rounded-sm border-2 border-jvto-navy/30 px-7 py-3.5 text-sm font-bold tracking-wider text-jvto-navy uppercase transition-colors duration-200 hover:border-jvto-navy hover:bg-jvto-navy hover:text-white"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * Visible Q&A block. Renders the SAME `page.faq` array that feeds the FAQPage
 * JSON-LD — one array, one node (AD-08). Disclosure pattern + index ornament
 * match the homepage FAQ so the site reads as one product; the ornament is
 * aria-hidden because it is computed, not copy.
 */
export function HubFaqSection({
  eyebrow,
  items,
  surface,
}: {
  eyebrow: ReactNode;
  items: NonNullable<StaticPage["faq"]>;
  /** Keeps the light/off alternation intact: the FAQ sits at § 05 on the hub
   *  and at § 07 on the departure routes, i.e. on opposite grounds. */
  surface: "light" | "off";
}) {
  if (items.length === 0) return null;

  return (
    <Section surface={surface} labelledBy="hub-faq-heading">
      <SectionHeading
        id="hub-faq-heading"
        eyebrow={eyebrow}
        title={
          <>
            Common <span className="text-jvto-orange">questions.</span>
          </>
        }
        aside="Before you book"
      />

      <div className="grid grid-cols-1 border-t border-jvto-rule md:grid-cols-2 md:gap-x-14">
        {items.map((item, index) => (
          <details
            key={item.question}
            className="group border-b border-jvto-border border-l-2 border-l-transparent py-5 transition-[border-color,padding] duration-300 open:border-l-jvto-orange open:pl-5"
          >
            <summary className="jvto-focus flex cursor-pointer list-none items-start justify-between gap-4 rounded-sm [&::-webkit-details-marker]:hidden">
              <span className="text-sm leading-snug font-bold text-jvto-navy md:text-base">
                <span aria-hidden="true" className="mr-2 font-mono text-jvto-ink-soft">
                  Q{String(index + 1).padStart(2, "0")}
                </span>
                <span className="decoration-jvto-orange decoration-2 underline-offset-4 group-hover:underline">
                  {item.question}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border border-jvto-border bg-white text-xs text-jvto-ink-soft transition-all duration-200 group-hover:border-jvto-navy/30 group-hover:text-jvto-navy group-open:rotate-45 group-open:border-jvto-orange group-open:text-jvto-orange"
              >
                +
              </span>
            </summary>
            <p className="mt-3 pr-9 text-sm leading-relaxed text-jvto-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** Closing plate — the page ends on the ground it opened on. */
export function HubClosingCta({
  headingId,
  title,
  primary,
  secondary,
}: {
  headingId: string;
  title: ReactNode;
  primary: { href: string; label: string; external?: boolean };
  secondary: { href: string; label: string };
}) {
  return (
    <Section surface="navy" labelledBy={headingId} containerClassName="text-center">
      <h2
        id={headingId}
        className="font-jvto-heading mx-auto mb-10 max-w-3xl text-[2rem] leading-[1.05] font-black tracking-[-0.025em] text-white md:text-5xl"
      >
        {title}
      </h2>
      <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        {primary.external ? (
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="jvto-focus-dark inline-flex items-center justify-center gap-2 rounded-sm bg-jvto-lime px-8 py-3.5 text-sm font-bold tracking-wider text-jvto-navy uppercase shadow-[0_12px_34px_-16px_rgba(140,198,63,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
          >
            {primary.label}
            <span aria-hidden="true">&rarr;</span>
          </a>
        ) : (
          <Link
            href={primary.href}
            className="jvto-focus-dark inline-flex items-center justify-center gap-2 rounded-sm bg-jvto-lime px-8 py-3.5 text-sm font-bold tracking-wider text-jvto-navy uppercase shadow-[0_12px_34px_-16px_rgba(140,198,63,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
          >
            {primary.label}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
        <Link
          href={secondary.href}
          className="jvto-focus-dark inline-flex items-center justify-center gap-2 rounded-sm border-2 border-white/35 bg-white/[0.04] px-8 py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-colors duration-200 hover:border-white/70 hover:bg-white/10"
        >
          {secondary.label}
        </Link>
      </div>
    </Section>
  );
}
