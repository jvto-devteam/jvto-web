import Link from "@/components/website/AppLink";
import { ExternalLink, ArrowRight } from "lucide-react";

const TOP_CREDENTIALS = [
  {
    tier: "01",
    label: "Business Registration",
    summary: "NIB 1102230032918 (verifiable at oss.go.id) · TDUP issued by Dinas Pariwisata · PT Java Volcano Rendezvous registered at AHU",
    link: "https://oss.go.id",
    linkLabel: "Check at oss.go.id",
    external: true,
  },
  {
    tier: "02",
    label: "Founder — Active Tourist Police Officer",
    summary: "Bripka Agung Sambuko is an active officer, Ditpamobvit (Tourist Police), East Java. SPRIN documents SHA-256 anchored. Corroborated by Detik.com and BBKSDA Jatim.",
    link: "/verify-jvto/police-safety",
    linkLabel: "See police credentials",
    external: false,
  },
  {
    tier: "03",
    label: "Guide Association & Park Clearance",
    summary: "HPWKI membership AHU-0001072.AH.01.07.TAHUN 2024 · BBKSDA operator clearance for Bromo Tengger Semeru and Ijen.",
    link: "/verify-jvto/legal",
    linkLabel: "See license",
    external: false,
  },
];

const TrustVerification: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-jvto-off">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime-ink">
              Verify JVTO
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Credentials you can check —{" "}
            <em className="text-jvto-orange not-italic">not logos you have to take on faith.</em>
          </h2>
          <p className="text-jvto-muted text-sm md:text-base max-w-xl leading-relaxed">
            Every license below links directly to the official government registry where you can confirm it yourself — before you pay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {TOP_CREDENTIALS.map((cred) => (
            <div
              key={cred.tier}
              className="bg-white rounded-[24px] border border-jvto-border p-6 flex gap-4 card-jvto"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jvto-navy flex items-center justify-center mt-0.5">
                <span className="text-[9px] font-bold text-white font-mono">{cred.tier}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-black text-jvto-navy text-sm mb-2"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {cred.label}
                </h3>
                <p className="text-xs text-jvto-muted leading-relaxed mb-3">
                  {cred.summary}
                </p>
                <a
                  href={cred.link}
                  target={cred.external ? "_blank" : undefined}
                  rel={cred.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-jvto-orange hover:underline"
                >
                  {cred.linkLabel}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center flex-col md:flex-row gap-4">
          <Link
            href="/verify-jvto"
            prefetch={false}
            className="inline-flex items-center gap-2 border border-jvto-navy/30 text-jvto-navy px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.18em] hover:bg-jvto-navy hover:text-white transition-colors"
          >
            See all 5 credentials
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-xs text-jvto-muted text-center md:text-left">
            Medical officer · ISIC provider · press recognition · history artifacts
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrustVerification;
