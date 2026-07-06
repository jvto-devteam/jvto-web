import Link from "@/components/website/AppLink";
import { Building2, ShieldCheck, Newspaper, History } from "lucide-react";

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

export default function HomeConfidence() {
  return (
    <section aria-labelledby="confidence-heading" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 03
            </p>
            <h2
              id="confidence-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy"
            >
              Operational <span className="text-jvto-orange">certainty.</span>
            </h2>
          </div>
          <Link
            href="/verify-jvto"
            className="text-sm font-bold text-jvto-navy hover:text-jvto-orange transition-colors"
          >
            Open proof library &rarr;
          </Link>
        </div>

        <p className="max-w-[60ch] text-jvto-muted text-base md:text-lg font-light leading-relaxed mb-10 md:mb-14">
          In a landscape where volcanic nature is uncertain, JVTO sells{" "}
          <em className="not-italic font-medium text-jvto-navy">operational certainty</em>{" "}
          — built on disciplined safety, documented proof, and local execution. Every
          licence below is checkable in a public registry.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map(({ Icon, title, body, meta, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col rounded-sm border border-jvto-border p-6 hover:-translate-y-1 hover:shadow-[0_14px_28px_-14px_rgba(13,27,42,0.18)] transition-all duration-300"
            >
              <Icon size={26} className="text-jvto-navy mb-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-black text-jvto-navy text-base mb-2.5">{title}</h3>
              <p className="text-jvto-muted text-sm leading-relaxed mb-4 flex-1">
                {body}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-jvto-muted/70">
                {meta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
