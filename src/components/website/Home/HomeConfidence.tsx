import Link from "@/components/website/AppLink";

const REASONS = [
  {
    number: "01",
    title: "Tourist Police-Led Safety Culture",
    description:
      "Founded by an active Tourist Police officer. Every guide follows standardized safety protocols, not improvised procedures.",
    link: { href: "/verify-jvto/police-safety", label: "Verify police credentials" },
  },
  {
    number: "02",
    title: "Licensed & Registered Operator",
    description:
      "PT Java Volcano Rendezvous, NIB 1102230032918. Business licence, tourism permit (TDUP), and guide certifications independently verifiable.",
    link: { href: "/verify-jvto/legal", label: "Verify business licence" },
  },
  {
    number: "03",
    title: "Own Crew, Never Outsourced",
    description:
      "14 permanent crew members (7 guides, 7 drivers). No freelance subcontracting. The guide you are assigned is who shows up.",
    link: { href: "/why-jvto/our-team", label: "Meet the team" },
  },
] as const;

export default function HomeConfidence() {
  return (
    <section aria-labelledby="confidence-heading" className="bg-jvto-navy py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-green mb-2">
            Book with confidence
          </p>
          <h2
            id="confidence-heading"
            className="font-black text-2xl md:text-3xl text-white mb-3"
          >
            Why Travelers Choose JVTO
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Every claim below links to its source document. No trust badges without evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.number}
              className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-6 md:p-8 flex flex-col"
            >
              <span className="text-3xl font-black text-white/10 leading-none mb-4" aria-hidden="true">
                {reason.number}
              </span>
              <h3 className="text-white font-bold text-base mb-3">
                {reason.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5 flex-1">
                {reason.description}
              </p>
              <Link
                href={reason.link.href}
                className="text-jvto-green text-xs font-bold uppercase tracking-wider hover:text-jvto-green/80 transition-colors"
              >
                {reason.link.label} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
