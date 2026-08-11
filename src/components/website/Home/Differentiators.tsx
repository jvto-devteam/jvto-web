import {
  ShieldCheck,
  Users,
  FileCheck,
  Activity,
  BadgeCheck,
  Compass,
} from "lucide-react";

const LARGE_CARDS = [
  {
    icon: ShieldCheck,
    headline: "Police-Led",
    body: "Mr. Sam is an active Polpar officer — the only licensed East Java operator founded and led by an active Tourist Police.",
    href: "/verify-jvto/police-safety",
  },
  {
    icon: Users,
    headline: "100% Private",
    body: "Your booking = your vehicle, your driver, your guide. No shared groups, no strangers added to your seat.",
    href: "/tours",
  },
];

const SMALL_CARDS = [
  {
    icon: FileCheck,
    headline: "All-Inclusive — No Surprises",
    body: "Entrance fees, jeep, accommodation, breakfast, gas masks, and transfers — bundled in writing before payment.",
    href: "/policy/inclusions-exclusions",
    variant: "lime" as const,
  },
  {
    icon: Activity,
    headline: "Ijen Health Screening",
    body: "Medical screening coordinated before the hike — not improvised. Licensed doctor on file with Kemenkes RI.",
    href: "/travel-guide/ijen-health-screening",
    variant: "white" as const,
  },
  {
    icon: BadgeCheck,
    headline: "Verifiable Licenses",
    body: "Business license, guide association, and park clearance — all publicly verifiable, SHA-256 anchored.",
    href: "/verify-jvto/legal",
    variant: "white" as const,
  },
  {
    icon: Compass,
    headline: "Written Plan B",
    body: "If a site closes, you get an alternative route — briefed before departure, not improvised at the gate.",
    href: "/travel-guide/weather-and-closures",
    variant: "white" as const,
  },
];

const Differentiators: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-navy/5 border border-jvto-navy/10 mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
              Why JVTO
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Six things that separate JVTO{" "}
            <em className="text-jvto-orange not-italic">from every other operator</em>{" "}
            in East Java.
          </h2>
        </div>

        {/* Top row — 2 large navy cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {LARGE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.headline}
                href={card.href}
                className="group block bg-jvto-navy rounded-[32px] p-8 md:p-10 min-h-[220px]"
                style={{ boxShadow: "0 20px 40px -15px rgba(13,27,42,0.20)" }}
              >
                <div className="w-11 h-11 rounded-2xl bg-jvto-orange/15 flex items-center justify-center mb-6 group-hover:bg-jvto-orange/25 transition-colors">
                  <Icon className="w-5 h-5 text-jvto-orange" />
                </div>
                <h3
                  className="text-xl font-black text-white mb-3 leading-snug"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {card.headline}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {card.body}
                </p>
              </a>
            );
          })}
        </div>

        {/* Bottom row — 4 small cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SMALL_CARDS.map((card) => {
            const Icon = card.icon;
            const isLime = card.variant === "lime";
            return (
              <a
                key={card.headline}
                href={card.href}
                className={`group block rounded-[32px] p-7 card-jvto border ${
                  isLime
                    ? "bg-jvto-lime border-jvto-lime"
                    : "bg-white border-jvto-border"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                    isLime
                      ? "bg-jvto-navy/10 group-hover:bg-jvto-navy/20"
                      : "bg-jvto-off group-hover:bg-jvto-navy"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isLime
                        ? "text-jvto-navy"
                        : "text-jvto-orange group-hover:text-white"
                    }`}
                  />
                </div>
                <h3
                  className={`text-sm font-black mb-2 leading-snug ${
                    isLime ? "text-jvto-navy" : "text-jvto-navy"
                  }`}
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {card.headline}
                </h3>
                <p className={`text-xs leading-relaxed ${isLime ? "text-jvto-navy/70" : "text-jvto-muted"}`}>
                  {card.body}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Differentiators;
