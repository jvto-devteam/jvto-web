import Link from "@/components/website/AppLink";
import { Building2, ShieldCheck, Newspaper, History } from "lucide-react";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

const PILLARS = [
  {
    Icon: Building2,
    title: "Legal Identity",
    body: "PT Java Volcano Rendezvous — NIB and TDUP 1102230032918, checkable at oss.go.id. TDUP issued 2023-02-11 by Dinas Pariwisata.",
    meta: "Schema: TravelAgency · KBLI 79121 / 79911",
    href: "/verify-jvto/legal",
  },
  {
    Icon: ShieldCheck,
    title: "Police Context",
    body: "Founder Bripka Agung Sambuko serves with Ditpamobvit East Java (Directorate of Vital Object Security). SPRIN Polpar and SPRIN Wal Travel credentials are publicly documented.",
    meta: "Authority · Active officer · corroborated by press",
    href: "/verify-jvto/police-safety",
  },
  {
    Icon: Newspaper,
    title: "Partners & Press",
    body: "Guides hold HPWKI Ijen specialist credentials; ISIC Provider 259268. As featured in Detik.com (2021), Radar Jember (×2), and BBKSDA Jatim (2024).",
    meta: "Recognition · verified press coverage",
    href: "/verify-jvto/press-recognition",
  },
  {
    Icon: History,
    title: "Continuous History",
    body: "Guesthouse era opened 2015 (Booking.com Ijen Bondowoso Homestay guest award, 9.4/10). Legal registration as PT Java Volcano Rendezvous followed, with TDUP formalized 2023. Same founder, same address in Bondowoso.",
    meta: "Golden thread · one legal entity",
    href: "/verify-jvto/history-artifacts",
  },
] as const;

// PKG-11a: each pillar is a dossier tab — a top accent rule that ignites orange
// on hover/focus, and the meta line demoted to a mono footer rather than faded
// text (the old text-jvto-muted/70 measured 2.6:1 on white).
export default function HomeConfidence() {
  return (
    <Section surface="light" labelledBy="confidence-heading">
      <SectionHeading
        id="confidence-heading"
        eyebrow="§ 03"
        title={
          <>
            Operational <span className="text-jvto-orange">certainty.</span>
          </>
        }
        aside={
          <Link
            href="/verify-jvto"
            className="jvto-focus rounded-sm text-jvto-navy transition-colors hover:text-jvto-orange"
          >
            Open proof library &rarr;
          </Link>
        }
        className="mb-8 md:mb-10"
      />

      <p className="mb-12 max-w-[62ch] text-base leading-relaxed font-light text-jvto-ink-soft md:mb-16 md:text-lg">
        In a landscape where volcanic nature is uncertain, JVTO sells{" "}
        <em className="font-medium text-jvto-navy not-italic">operational certainty</em>{" "}
        — built on disciplined safety, documented proof, and local execution. Every
        licence below is checkable in a public registry.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map(({ Icon, title, body, meta, href }) => (
          <Link
            key={title}
            href={href}
            className="jvto-focus group relative flex flex-col overflow-hidden rounded-sm border border-jvto-border bg-white p-6 pt-7 shadow-jvto-soft transition-all duration-300 hover:-translate-y-1 hover:border-jvto-navy/25 hover:shadow-jvto-card-hover"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-jvto-navy/15 transition-colors duration-300 group-hover:bg-jvto-orange group-focus-visible:bg-jvto-orange"
            />
            <Icon
              size={26}
              className="mb-5 text-jvto-navy"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h3 className="font-jvto-heading mb-2.5 text-base font-black text-jvto-navy">
              {title}
            </h3>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-jvto-ink-soft">
              {body}
            </p>
            <span className="border-t border-jvto-border pt-3 font-mono text-[10px] font-bold tracking-wider text-jvto-ink-soft uppercase">
              {meta}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
