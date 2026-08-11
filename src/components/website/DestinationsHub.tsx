import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { PublicDestinationListSnapshot } from "@/lib/publicContent/types";

type DestItem = PublicDestinationListSnapshot["items"][number];

interface Props {
  items: DestItem[];
}

// Editorial metadata per slug (canonical from CLAUDE.md §1)
const DEST_DISPLAY: Record<
  string,
  { index: string; region: string; elevation: string; diff: string; chips: string[] }
> = {
  "mount-bromo": {
    index: "01", region: "Probolinggo", elevation: "2,329 m",
    diff: "Tengger caldera · Easy–Moderate",
    chips: ["Penanjakan sunrise", "Sea of sand", "4WD jeep traverse", "Smoking crater"],
  },
  "ijen-crater": {
    index: "02", region: "Banyuwangi", elevation: "2,386 m",
    diff: "Active stratovolcano · Moderate–High",
    chips: ["Blue fire (weather permitting)", "Acidic crater lake", "Sulfur miners", "Night hike"],
  },
  "kawah-ijen": {
    index: "02", region: "Banyuwangi", elevation: "2,386 m",
    diff: "Active stratovolcano · Moderate–High",
    chips: ["Blue fire (weather permitting)", "Acidic crater lake", "Sulfur miners", "Night hike"],
  },
  "tumpak-sewu-waterfall": {
    index: "03", region: "Lumajang", elevation: "~120 m",
    diff: "Multi-tiered curtain · Moderate",
    chips: ["Java's Niagara", "Rim viewpoint", "Canyon descent", "Fitness-assessed"],
  },
  "tumpak-sewu": {
    index: "03", region: "Lumajang", elevation: "~120 m",
    diff: "Multi-tiered curtain · Moderate",
    chips: ["Java's Niagara", "Rim viewpoint", "Canyon descent", "Fitness-assessed"],
  },
  "madakaripura-waterfall": {
    index: "04", region: "Probolinggo", elevation: "~100 m",
    diff: "Tallest in Java · Easy–Moderate",
    chips: ["Tallest waterfall in Java", "Canyon walk", "Horseshoe curtain", "Gajah Mada heritage"],
  },
  "madakaripura": {
    index: "04", region: "Probolinggo", elevation: "~100 m",
    diff: "Tallest in Java · Easy–Moderate",
    chips: ["Tallest waterfall in Java", "Canyon walk", "Horseshoe curtain", "Gajah Mada heritage"],
  },
  "papuma-beach": {
    index: "05", region: "Jember", elevation: "~86 m cape",
    diff: "Coastal headland · Easy",
    chips: ["White-sand beach", "Cape headland", "Offshore rock formations", "Coastal contrast"],
  },
};

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const Check = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-jvto-lime flex-shrink-0" aria-hidden="true">
    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DestinationsHub({ items }: Props) {
  const volcanoCount = items.filter((d) => (d.tags ?? []).includes("volcano")).length;
  const waterfallCount = items.filter((d) => (d.tags ?? []).includes("waterfall")).length;
  const coastalCount = items.filter(
    (d) => (d.tags ?? []).some((t) => t === "beach" || t === "coastal"),
  ).length;

  const stats = [
    { label: "Destinations", value: items.length },
    { label: "Active volcanoes", value: volcanoCount },
    { label: "Waterfalls", value: waterfallCount },
    { label: "Coastal stop", value: coastalCount },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-50  md:pb-42 pb-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            {/* Left: copy */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  East Java Destinations
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Five destinations.{" "}
                <em className="not-italic text-jvto-orange">One</em> operator.
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                Every site on JVTO's East Java circuit — volcano craters, canyon waterfalls,
                a coastal headland — reached by dedicated private vehicle, BBKSDA park
                clearance already in hand.
              </p>
            </div>

            {/* Right: stats */}
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {label}
                  </span>
                  <strong
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature list ──────────────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-18 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {items.map((dest, i) => {
            const slug = dest.slug ?? "";
            const fallbackIndex = String(i + 1).padStart(2, "0");
            const meta = DEST_DISPLAY[slug] ?? {
              index: fallbackIndex,
              region: "",
              elevation: dest.geo?.altitude
                ? `${Number(dest.geo.altitude).toLocaleString()} m`
                : "",
              diff: dest.keyInfo?.difficulty_level ?? "",
              chips: [],
            };
            const isReverse = i % 2 !== 0;
            const text = dest.summary ?? dest.description ?? "";
            const description = text.length > 300 ? text.slice(0, 300).trimEnd() + "…" : text;
            const isLast = i === items.length - 1;

            return (
              <div
                key={dest.id}
                className={`grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-9 md:gap-[4.5rem] items-center${isLast ? "" : " mb-16 md:mb-[6.5rem]"}`}
              >
                {/* Image tile */}
                <div
                  className={`relative rounded-[40px] overflow-hidden bg-jvto-navy${isReverse ? " md:order-2" : ""}`}
                  style={{ aspectRatio: "5/4", boxShadow: "var(--shadow-jvto-card-hover)" }}
                >
                  {dest.banner?.url ? (
                    <Image
                      src={dest.banner.url}
                      alt={dest.banner.alt || dest.name || ""}
                      fill
                      unoptimized
                      loading={i === 0 ? "eager" : "lazy"}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1C2E40] to-jvto-navy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/80 via-jvto-navy/15 to-transparent z-[1]" />
                  {meta.elevation && (
                    <span className="absolute right-4 top-4 z-[2] font-mono text-[10px] font-bold tracking-[0.16em] uppercase bg-white/92 text-jvto-navy px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {meta.elevation}
                    </span>
                  )}
                  {meta.region && (
                    <span className="absolute left-5 bottom-4 z-[2] font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">
                      {meta.region}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className={`flex flex-col justify-center${isReverse ? " md:order-1" : ""}`}>
                  {meta.diff && (
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-orange mb-4">
                      {meta.diff}
                    </p>
                  )}
                  <h2
                    className="font-black text-jvto-navy leading-[0.98] mb-5"
                    style={{
                      fontFamily: "Raleway, Inter, sans-serif",
                      letterSpacing: "-0.03em",
                      fontSize: "clamp(38px, 5vw, 68px)",
                    }}
                  >
                    {dest.name}
                  </h2>
                  {description && (
                    <p className="text-[17px] text-[#6b7280] font-light leading-[1.55] mb-7 max-w-[48ch]">
                      {description}
                    </p>
                  )}
                  {meta.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {meta.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-jvto-navy"
                        >
                          <Check />
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/destinations/${slug}`}
                    prefetch={false}
                    className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors w-fit"
                  >
                    Explore {dest.name} <ArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Transport note ────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:pt-26 md:pb-38 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-lime mb-4">
                Private Transport
              </p>
              <h2
                className="font-black text-white leading-[1.04] mb-5"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(32px, 4vw, 52px)",
                }}
              >
                Your vehicle. Your driver.{" "}
                <span className="text-jvto-orange">Your schedule.</span>
              </h2>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[46ch]">
                Every destination on this list is reached by dedicated private vehicle — AC MPV
                for smaller groups, Toyota Hiace for larger ones. No public buses. No shared
                transfers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/10 rounded-[20px] overflow-hidden border border-white/10">
              {[
                { k: "Small groups", v: "AC MPV · 2–3 guests" },
                { k: "Larger groups", v: "Toyota Hiace · 4–9" },
                { k: "Park access", v: "BBKSDA clearance in hand" },
                { k: "Shared transfers", v: "Never" },
              ].map(({ k, v }) => (
                <div key={k} className="bg-white/[0.04] p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-1.5">
                    {k}
                  </div>
                  <div className="text-white font-semibold text-sm leading-snug">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-18 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-jvto-navy leading-[1.02] mb-8"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(36px, 5vw, 56px)",
            }}
          >
            Ready for your{" "}
            <span className="text-jvto-orange">expedition?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              View all tours <ArrowRight />
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#E3E0DA] text-jvto-navy font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-jvto-navy hover:text-white transition-colors"
            >
              Custom inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
