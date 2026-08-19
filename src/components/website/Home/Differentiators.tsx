import {
  ShieldCheck,
  Users,
  FileCheck,
  Activity,
  BadgeCheck,
  Compass,
} from "lucide-react";

const ICON_MAP = {
  ShieldCheck,
  Users,
  FileCheck,
  Activity,
  BadgeCheck,
  Compass,
} as const;

type IconName = keyof typeof ICON_MAP;

interface CardData {
  icon: IconName;
  headline: string;
  body: string;
  href: string;
  variant?: "lime" | "white";
}

interface DifferentiatorsSection {
  heading?: string;
  largeCards?: CardData[];
  smallCards?: CardData[];
}

// Fallback: same copy as the pre-migration hardcoded version, used only if the
// ekosistem section (home/index.source.json, section id "differentiators") is
// unreachable — same pattern as fallbackSeo elsewhere.
const FALLBACK: Required<DifferentiatorsSection> = {
  heading:
    "Six things that separate JVTO from every other operator in East Java.",
  largeCards: [
    {
      icon: "ShieldCheck",
      headline: "Police-Led",
      body: "Mr. Sam is an active Polpar officer — the only licensed East Java operator founded and led by an active Tourist Police.",
      href: "/verify-jvto/police-safety",
    },
    {
      icon: "Users",
      headline: "100% Private",
      body: "Your booking = your vehicle, your driver, your guide. No shared groups, no strangers added to your seat.",
      href: "/tours",
    },
  ],
  smallCards: [
    {
      icon: "FileCheck",
      headline: "All-Inclusive — No Surprises",
      body: "Entrance fees, jeep, accommodation, breakfast, gas masks, and transfers — bundled in writing before payment.",
      href: "/policy/inclusions-exclusions",
      variant: "lime",
    },
    {
      icon: "Activity",
      headline: "Ijen Health Screening",
      body: "Medical screening coordinated before the hike — not improvised. Licensed doctor on file with Kemenkes RI.",
      href: "/travel-guide/ijen-health-screening",
      variant: "white",
    },
    {
      icon: "BadgeCheck",
      headline: "Verifiable Licenses",
      body: "Business license, guide association, and park clearance — all publicly verifiable, SHA-256 anchored.",
      href: "/verify-jvto/legal",
      variant: "white",
    },
    {
      icon: "Compass",
      headline: "Written Plan B",
      body: "If a site closes, you get an alternative route — briefed before departure, not improvised at the gate.",
      href: "/travel-guide/weather-and-closures",
      variant: "white",
    },
  ],
};

interface DifferentiatorsProps {
  section?: DifferentiatorsSection;
}

const Differentiators: React.FC<DifferentiatorsProps> = ({ section }) => {
  const heading = section?.heading ?? FALLBACK.heading;
  const largeCards = section?.largeCards?.length ? section.largeCards : FALLBACK.largeCards;
  const smallCards = section?.smallCards?.length ? section.smallCards : FALLBACK.smallCards;

  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-tags bg-jvto-navy/5 border border-jvto-navy/10 mb-5">
            <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-muted">
              Why JVTO
            </span>
          </div>
          <h2 className="font-display text-subheading md:text-heading-sm font-black text-jvto-navy max-w-2xl">
            {heading}
          </h2>
        </div>

        {/* Top row — 2 large navy cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {largeCards.map((card) => {
            const Icon = ICON_MAP[card.icon] ?? ShieldCheck;
            return (
              <a
                key={card.headline}
                href={card.href}
                className="group block bg-jvto-navy rounded-largecards p-8 md:p-10 min-h-[220px] shadow-jvto-soft"
              >
                <div className="w-11 h-11 rounded-2xl bg-jvto-orange/15 flex items-center justify-center mb-6 group-hover:bg-jvto-orange/25 transition-colors">
                  <Icon className="w-5 h-5 text-jvto-orange" />
                </div>
                <h3 className="font-display text-body-lg font-black text-white mb-3">
                  {card.headline}
                </h3>
                <p className="text-caption text-white/60">
                  {card.body}
                </p>
              </a>
            );
          })}
        </div>

        {/* Bottom row — 4 small cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {smallCards.map((card) => {
            const Icon = ICON_MAP[card.icon] ?? FileCheck;
            const isLime = card.variant === "lime";
            return (
              <a
                key={card.headline}
                href={card.href}
                className={`group block rounded-largecards p-7 card-jvto border ${
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
                <h3 className="font-display text-body-sm font-black mb-2 text-jvto-navy">
                  {card.headline}
                </h3>
                <p className={`text-micro ${isLime ? "text-jvto-navy/75" : "text-jvto-muted"}`}>
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
