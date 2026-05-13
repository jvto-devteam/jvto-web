import {
  ShieldCheck,
  Users,
  FileCheck,
  Activity,
  BadgeCheck,
  Compass,
} from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    headline: "Police-Led",
    body: "Mr. Sam — Bripka Agung Sambuko — is an active officer of the Indonesian Tourist Police (Ditpamobvit, East Java). No other licensed tour operator in East Java is founded and led by an active Polpar officer. His police authorization documents are publicly SHA-256 anchored.",
    href: "/verify-jvto/police-safety",
  },
  {
    icon: Users,
    headline: "100% Private",
    body: "Every tour is private by default. Your booking means your vehicle, your driver, your guide — nobody else's group added to your seat. This keeps timing decisions yours, recovery time realistic, and safety coordination simple.",
    href: "/tours",
  },
  {
    icon: FileCheck,
    headline: "All-Inclusive — No Surprise Local Payments",
    body: 'Entrance fees, the Bromo 4WD jeep, accommodation, breakfast, gas masks, and transfers are bundled in writing. What is and isn\'t included is published in the booking reference before you pay. "Read the Rulebook Before You Book" is a policy, not a tagline.',
    href: "/policy/inclusions-exclusions",
  },
  {
    icon: Activity,
    headline: "Ijen Health-Screening Coordination",
    body: "Ijen access rules can require a recent local health certificate. JVTO coordinates the clinic workflow when current BBKSDA rules require it — before the hike, not as an afterthought. Dr. Ahmad Irwandanu holds a verified SIP license (Kemenkes RI, checkable at satusehat.kemkes.go.id).",
    href: "/travel-guide/ijen-health-screening",
  },
  {
    icon: BadgeCheck,
    headline: "Verifiable Licenses",
    body: "NIB 1102230032918 is checkable at oss.go.id. HPWKI membership (AHU-0001072.AH.01.07.TAHUN 2024) verifies Ijen specialist guide training. BBKSDA clearance covers both Bromo Tengger Semeru National Park and Ijen. SHA-256 hashes for every credential document are published in public/llms.txt.",
    href: "/verify-jvto/legal",
  },
  {
    icon: Compass,
    headline: "Plan B When Conditions Change",
    body: "Bromo and Ijen both close without warning. JVTO operates a written Plan-B framework: if a site closes, you get an alternative route — briefed in advance, not improvised at the gate. You don't lose a day, and that is a written policy, not a verbal promise.",
    href: "/travel-guide/weather-and-closures",
  },
];

const Differentiators: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-navy/5 border border-jvto-navy/10 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy">
              Why JVTO
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Six things that separate JVTO{" "}
            <span className="text-jvto-orange italic">
              from every other operator
            </span>{" "}
            in East Java.
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.headline}
                href={item.href}
                className="group block bg-white rounded-[32px] border border-jvto-border p-8 card-jvto hover:-translate-y-1"
              >
                {/* Icon tile */}
                <div className="w-12 h-12 rounded-2xl bg-jvto-off flex items-center justify-center mb-6 group-hover:bg-jvto-navy transition-colors duration-300">
                  <Icon className="w-6 h-6 text-jvto-orange group-hover:text-white transition-colors duration-300" />
                </div>

                <h3
                  className="text-lg font-black text-jvto-navy mb-3 leading-snug"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {item.headline}
                </h3>
                <p className="text-sm text-jvto-muted leading-relaxed">
                  {item.body}
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
