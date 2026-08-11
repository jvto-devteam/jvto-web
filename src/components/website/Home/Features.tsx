import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";

const CREDENTIALS = [
  {
    label: "NIB License",
    value: "1102230032918",
    sub: "Verifiable at oss.go.id",
    href: "https://oss.go.id",
    external: true,
  },
  {
    label: "Tourist Police",
    value: "Bripka Agung Sambuko",
    sub: "Active Polpar · Ditpamobvit",
    href: "/verify-jvto/police-safety",
    external: false,
  },
  {
    label: "Trustpilot",
    value: (() => {
      const tp = REVIEW_PLATFORMS.find((p) => p.platform === "Trustpilot");
      return tp ? `${tp.rating} · ${tp.count} Reviews` : "4.93 · 44 Reviews";
    })(),
    sub: "Excellent — verified platform",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    external: true,
  },
  {
    label: "Health Coordination",
    value: "Ijen Gate Certified",
    sub: "JVTO coordinates Ijen access screening",
    href: "/travel-guide/ijen-health-screening",
    external: false,
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-white border-b border-jvto-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-jvto-border">
          {CREDENTIALS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-0.5 px-6 py-5 hover:bg-jvto-off transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                {item.label}
              </span>
              <span
                className="font-black text-sm text-jvto-navy leading-snug group-hover:text-jvto-orange transition-colors"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {item.value}
              </span>
              <span className="text-[11px] text-jvto-muted mt-0.5">
                {item.sub}
                {item.external && (
                  <span className="ml-1 text-jvto-muted/50">↗</span>
                )}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
