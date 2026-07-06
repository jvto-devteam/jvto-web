import Link from "@/components/website/AppLink";

// Timeline — foundingDate/since = 2015 per docs/CANONICAL_FACTS.md. Legal
// registration (PT Java Volcano Rendezvous, NIB/TDUP) is mentioned only in a
// legal context, without asserting a specific incorporation year — the
// design-reference spec's "2016: PT registered" milestone has zero support in
// the verified facts catalog and is intentionally NOT reproduced here.
const TIMELINE = [
  {
    year: "2015",
    title: "Guesthouse era",
    body: "The Ijen Bondowoso Homestay opens. Booking.com 2015 Guest Review Award — guest score 9.4/10.",
  },
  {
    year: "2023",
    title: "TDUP formalized",
    body: "Tourism Business Registration (TDUP) issued 2023-02-11 by Dinas Pariwisata. NIB 1102230032918 — checkable at oss.go.id.",
  },
  {
    year: "Today",
    title: "One legal entity",
    body: "16 private itineraries, a 14-person crew (11 KTA-confirmed), and every credential publicly verifiable — the same founder, the same address, the whole way.",
  },
] as const;

export default function HomeOurStory() {
  return (
    <section aria-labelledby="story-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10 md:mb-14">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 10
            </p>
            <h2
              id="story-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy max-w-xl"
            >
              Built by someone who saw the{" "}
              <span className="text-jvto-orange">alternatives.</span>
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-jvto-muted">
            One legal entity, since 2015
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="font-black text-xl md:text-2xl text-jvto-navy leading-snug mb-5">
              JVTO grew from a humble local guesthouse in Bondowoso into a licensed
              tour operator shaped by the Tourist Police experience of our founder,
              Mr. Sam.
            </p>
            <p className="text-jvto-muted text-sm md:text-base leading-relaxed mb-4 max-w-[56ch]">
              We saw the gaps in safety standards first-hand — unlicensed guides, no
              medical screening coordination, operators with no BBKSDA clearance, no
              written rules for guests. We decided to build something different:
              private-only routes, realistic driving days, and clear written
              policies.
            </p>
            <p className="text-jvto-muted text-sm md:text-base leading-relaxed mb-8 max-w-[56ch]">
              Today, we act as a bridge between wild adventure and professional
              safety standards. The Tourist Police experience isn&apos;t a
              marketing credential — it&apos;s the lens through which every route,
              every safety rule, and every Plan-B decision is made.
            </p>
            <Link
              href="/why-jvto/our-story"
              className="text-sm font-bold text-jvto-navy hover:text-jvto-orange transition-colors"
            >
              Read the full story <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ul className="flex flex-col gap-8 border-l border-jvto-border pl-6">
            {TIMELINE.map((item) => (
              <li key={item.year} className="relative">
                <span
                  className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-jvto-navy"
                  aria-hidden="true"
                />
                <p className="font-mono text-xs font-bold text-jvto-orange mb-1">
                  {item.year}
                </p>
                <h4 className="font-black text-jvto-navy text-base mb-1.5">
                  {item.title}
                </h4>
                <p className="text-jvto-muted text-sm leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
