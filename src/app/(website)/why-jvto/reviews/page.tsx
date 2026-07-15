// app/(website)/why-jvto/reviews/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { getReviewsForSchema } from "@/lib/queries/schemaReviews";
import {
  buildIndividualReviewSchemas,
  buildWhyJvtoReviewsAggregateRatingSchema,
} from "@/lib/schemas/buildWhyJvtoSchemas";

export const revalidate = 86400;

const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
];

const PLATFORMS = [
  {
    name: "Trustpilot",
    score: "4.8",
    count: "51 reviews",
    verified: "Verified 2026-05-09",
    href: "https://trustpilot.com/review/javavolcano-touroperator.com",
  },
  {
    name: "Google Maps",
    score: "4.90",
    count: "123 reviews",
    verified: "Verified 2026-05-26",
    href: "https://www.google.com/maps?cid=1266403973589689021",
  },
  {
    name: "TripAdvisor",
    score: "4.95",
    count: "21 reviews",
    verified: "Verified 2026-05-12",
    href: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
  },
];

const THEMES = [
  {
    code: "T1 · Private Tour Quality",
    title: "No rush, no compromises on timing.",
    body: "Guests repeatedly mention dedicated private guides and vehicles — no adjustments because another group needs to be somewhere. Private structure lets the crew respond to the actual group, not a fixed schedule for strangers.",
  },
  {
    code: "T2 · Guide Knowledge & English",
    title: "Named guides, route-specific knowledge.",
    body: "Reviews frequently name individual guides and praise English-speaking ability alongside route knowledge. Guides are credited for pre-activity briefings, proactive photography, and flexibility for impromptu stops — consistent across platforms.",
  },
  {
    code: "T3 · Ijen Experience Quality",
    title: "The hike, the knowledge, the preparation.",
    body: "Guests on Ijen routes describe hiking to the crater in pre-dawn hours. Blue Fire is a natural phenomenon subject to weather and gas activity. Reviews describe the experience and safety prep — not a guarantee of any specific sighting.",
  },
  {
    code: "T4 · Safety & Trust",
    title: "Prepared, well-informed, before each activity.",
    body: "The founder's Tourist Police background is referenced directly in some reviews. Guests on multi-day tours describe guides responding effectively to changed conditions — including one incident where an injured group member was assisted.",
  },
  {
    code: "T5 · All-Inclusive Clarity",
    title: "Costs as described — no surprises.",
    body: "Guests note no unexpected fees at checkpoints, no mid-trip negotiation for tickets or logistics. The written-inclusions model means guests arrive knowing exactly what is covered.",
  },
];

const EXCERPTS = [
  {
    tag: "T1 · Family tour · guide Taufik",
    quote:
      '"Hiked up mount ijen with a 12 and 15 years old in the wee hours of morning… Taufik ensure all briefing is always done prior to all trips and flexible with timing. When i wanted to eat local durians, he even dropped by a well known durian stall."',
    name: "Kevin Foo",
    source: "Trustpilot",
  },
  {
    tag: "T2 · Named guide · Anjas",
    quote:
      '"I don\'t think there is a better tour guide anywhere than Anjas — head and shoulders above the rest."',
    name: "John Joyce",
    source: "Trustpilot",
  },
  {
    tag: "T2 · Guide Fauzi · driver Fredi",
    quote:
      '"Fauzi was very attentive to our needs, ensured we were comfortable and safe at all times, and always went the extra mile to help us."',
    name: "Han Waye",
    source: "Trustpilot · May 2026",
  },
  {
    tag: "T2 · Steep terrain · guide Rendi",
    quote:
      '"When we went down the steep crater, he held our hands to prevent us from falling."',
    name: "Wing Shan Lui",
    source: "Google · KTA-G-2024-002",
  },
  {
    tag: "T3 · Ijen route · guide Ahboy",
    quote:
      '"Ahboy was a phenomenal Ijen guide — knowledgeable, went out of his way for safety, logistics, equipment."',
    name: "Jason Li",
    source: "Trustpilot · KTA-G-2024-004",
  },
  {
    tag: "T4 · Solo traveler",
    quote: '"Being a solo traveler it was safe and stress free with JVTO."',
    name: "Karthika TS",
    source: "Trustpilot",
  },
  {
    tag: "T4 · Emergency handling",
    quote:
      '"One of our friends was injured and they helped him as well. Fantastic planning."',
    name: "Jiang Tianjian",
    source: "Trustpilot",
  },
  {
    tag: "T1/T2 · Guide Kiki · driver Derry",
    quote:
      '"Kiki and Derry made the whole experience really enjoyable. Service was excellent, vibes were immaculate, and were really accommodating with our requests. 10/10"',
    name: "Yong Xiang Leow",
    source: "Trustpilot · May 2026",
  },
  {
    tag: "T5 · Logistics · driver Yandi",
    quote:
      '"Our driver Yandi was really reliable and friendly. He briefed us on what to expect."',
    name: "Divya_Stri",
    source: "Trustpilot · KTA-D-2024-003",
  },
];

export const metadata: Metadata = {
  title: "Guest Reviews · Why JVTO",
  description:
    "Reviews organized by platform and by theme — Trustpilot 4.8, Google 4.90, TripAdvisor 4.95. Five recurring patterns across 195+ verified reviews from independent guests.",
};

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="15"
    height="15"
    aria-hidden="true"
  >
    <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function WhyJvtoReviewsPage() {
  const [page, reviewsData] = await Promise.all([
    getPublicPageSnapshot("/why-jvto/reviews", { allowDatabaseFallback: false }),
    getReviewsForSchema().catch(() => []),
  ]);

  const extraSchemas = [
    buildWhyJvtoReviewsAggregateRatingSchema(),
    ...buildIndividualReviewSchemas(reviewsData),
  ].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined pageRow={page.pageRow} extraSchemas={extraSchemas} />

      {/* ── Interior hero — navy ───────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Why JVTO</Link>
            <span>›</span>
            <span className="text-white/70">Reviews</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · Reviews
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 004B
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Patterns, not a{" "}
                <span className="italic">quote wall.</span>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                Reviews organized by platform and by theme — so you can check patterns, not
                cherry-picked excerpts. Each theme maps to a core operational claim.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Trustpilot", value: "4.8 / 5 · 51" },
                { label: "Google Maps", value: "4.90 / 5 · 123" },
                { label: "TripAdvisor", value: "4.95 / 5 · 21" },
                { label: "Themes", value: "5 patterns" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">
                    {label}
                  </span>
                  <strong className="text-white text-sm font-semibold text-right">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Article section — off-white, stacked ──────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">

            {/* Sidebar nav */}
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Why JVTO
              </p>
              <nav className="space-y-0.5">
                {WHY_JVTO_NAV.map(({ href, label }) => {
                  const isActive = href === "/why-jvto/reviews";
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-jvto-navy text-white"
                          : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Open proof library <ArrowRight />
              </Link>
            </aside>

            {/* Article body */}
            <article className="min-w-0">

              {/* ── Platform aggregate ─────────────────────────────────── */}
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
                Platform Aggregate
              </span>
              <h2
                className="font-black text-jvto-navy mb-8"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  fontSize: "clamp(28px,3vw,42px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Verified across three platforms.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
                {PLATFORMS.map((p) => (
                  <div
                    key={p.name}
                    className="bg-white border border-[#E3E0DA] rounded-xl p-9 flex flex-col gap-2"
                    style={{ boxShadow: "0 1px 8px 0 rgba(13,27,42,0.06)" }}
                  >
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#9ca3af]">
                      {p.name}
                    </span>
                    <span
                      className="font-black text-jvto-navy leading-none"
                      style={{
                        fontFamily: "Raleway, Inter, sans-serif",
                        fontSize: "56px",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {p.score}
                      <small className="text-[22px] font-medium text-[#9ca3af]"> / 5</small>
                    </span>
                    <div className="flex gap-0.5 text-[#F5A623]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon key={s} />
                      ))}
                    </div>
                    <div
                      className="font-mono text-[11px] tracking-[0.14em] text-[#9ca3af] mt-auto pt-4 flex justify-between"
                      style={{ borderTop: "1px solid #E3E0DA" }}
                    >
                      <span>{p.count}</span>
                      <span>{p.verified}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-mono text-[11px] tracking-[0.12em] text-[#9ca3af] leading-[1.9] mb-14">
                Live profiles:{" "}
                {PLATFORMS.map((p, i) => (
                  <span key={p.name}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity"
                    >
                      {p.name}
                    </a>
                    {i < PLATFORMS.length - 1 && " · "}
                  </span>
                ))}
              </p>

              <hr className="border-0 border-t border-[#E3E0DA] mb-14" />

              {/* ── Five themes ───────────────────────────────────────── */}
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
                What guests say · Five themes
              </span>
              <h2
                className="font-black text-jvto-navy mb-8"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  fontSize: "clamp(28px,3vw,42px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Five recurring patterns.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {THEMES.map((t) => (
                  <div
                    key={t.code}
                    className="bg-white border border-[#E3E0DA] rounded-xl p-8 flex flex-col gap-3"
                    style={{ boxShadow: "0 1px 8px 0 rgba(13,27,42,0.06)" }}
                  >
                    <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-jvto-orange">
                      {t.code}
                    </span>
                    <h3
                      className="font-bold text-jvto-navy"
                      style={{ fontSize: "22px", letterSpacing: "-0.01em", lineHeight: 1.15 }}
                    >
                      {t.title}
                    </h3>
                    <p className="text-[#6b7280] text-[14.5px] font-light leading-relaxed">
                      {t.body}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-0 border-t border-[#E3E0DA] mb-14" />

              {/* ── Excerpts ──────────────────────────────────────────── */}
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
                Selected excerpts
              </span>
              <h2
                className="font-black text-jvto-navy mb-8"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  fontSize: "clamp(28px,3vw,42px)",
                  letterSpacing: "-0.02em",
                }}
              >
                In guests&apos; own words.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {EXCERPTS.map((e, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange">
                      {e.tag}
                    </span>
                    <p
                      className="text-jvto-navy leading-snug"
                      style={{ fontSize: "19px", lineHeight: 1.4 }}
                    >
                      {e.quote}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-semibold text-[13px] text-jvto-navy">{e.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af]">
                        {e.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Named guide attribution ───────────────────────────── */}
              <div className="mt-12 border border-[#E3E0DA] rounded-xl overflow-hidden">
                <div className="px-6 py-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
                    Named guide attribution
                  </span>
                  <p className="text-jvto-navy text-[15px] leading-relaxed font-light">
                    Reviews that name guides — Anjas, Taufik, Rendi, Gufron, Kiki, Fauzi, Boy
                    (Ahboy) — are linked to their profiles in{" "}
                    <Link
                      href="/why-jvto/our-team"
                      prefetch={false}
                      className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity"
                    >
                      Our Team
                    </Link>
                    . Each profile includes the guide&apos;s KTA credential, languages, routes, and
                    selected review mentions. Named guides are verified against the HPWKI crew
                    registry, not sourced from freelance marketplaces.
                  </p>
                </div>
              </div>

            </article>
          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ───────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.04] mb-4"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(32px,4vw,56px)",
            }}
          >
            Read the patterns.{" "}
            <span className="text-jvto-orange">Then verify.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/why-jvto/our-team"
              prefetch={false}
              className="inline-flex items-center gap-2 bg-jvto-orange text-white font-bold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-[#C4520A] transition-colors"
            >
              Meet the named crew <ArrowRight />
            </Link>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-white/10 transition-colors"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
