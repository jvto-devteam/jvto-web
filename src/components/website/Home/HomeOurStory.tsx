import Link from "@/components/website/AppLink";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

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

// PKG-11a: the timeline spine becomes a graded rule with orange survey nodes,
// and the entry titles move from <h4> to <h3> — they sit directly under this
// section's <h2>, so the old markup skipped a level.
export default function HomeOurStory() {
  return (
    <Section surface="light" labelledBy="story-heading">
      <SectionHeading
        id="story-heading"
        eyebrow="§ 10"
        title={
          <>
            Built by someone who saw the{" "}
            <span className="text-jvto-orange">alternatives.</span>
          </>
        }
        aside={<>One legal entity, since 2015</>}
        titleClassName="max-w-xl"
      />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="font-jvto-heading mb-6 text-xl leading-snug font-black text-jvto-navy md:text-2xl">
            JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour
            operator shaped by the Tourist Police experience of our founder, Mr. Sam.
          </p>
          <p className="mb-4 max-w-[56ch] text-sm leading-relaxed text-jvto-ink-soft md:text-base">
            We saw the gaps in safety standards first-hand — unlicensed guides, no
            medical screening coordination, operators with no BBKSDA clearance, no
            written rules for guests. We decided to build something different:
            private-only routes, realistic driving days, and clear written policies.
          </p>
          <p className="mb-8 max-w-[56ch] text-sm leading-relaxed text-jvto-ink-soft md:text-base">
            Today, we act as a bridge between wild adventure and professional safety
            standards. The Tourist Police experience isn&apos;t a marketing credential —
            it&apos;s the lens through which every route, every safety rule, and every
            Plan-B decision is made.
          </p>
          <Link
            href="/why-jvto/our-story"
            className="jvto-focus rounded-sm text-sm font-bold text-jvto-navy transition-colors hover:text-jvto-orange"
          >
            Read the full story <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <ol className="relative flex flex-col gap-9 pl-7">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-0 w-px bg-gradient-to-b from-jvto-orange via-jvto-rule to-transparent"
          />
          {TIMELINE.map((item) => (
            <li key={item.year} className="relative">
              <span
                className="absolute top-1.5 -left-7 h-2.5 w-2.5 -translate-x-[4.5px] rounded-full bg-jvto-orange ring-4 ring-white"
                aria-hidden="true"
              />
              <p className="mb-1.5 font-mono text-xs font-bold tracking-[0.15em] text-jvto-orange">
                {item.year}
              </p>
              <h3 className="font-jvto-heading mb-1.5 text-base font-black text-jvto-navy">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-jvto-ink-soft">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
