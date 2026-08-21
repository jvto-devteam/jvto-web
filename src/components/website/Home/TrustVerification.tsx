import Link from "@/components/website/AppLink";
import { ExternalLink, ArrowRight } from "lucide-react";

interface CredentialData {
  tier: string;
  label: string;
  summary: string;
  link: string;
  linkLabel: string;
  external: boolean;
}

interface TrustVerificationSection {
  eyebrow?: string;
  heading?: string;
  description?: string;
  credentials?: CredentialData[];
  ctaLabel?: string;
  ctaSubLabel?: string;
}

// Fallback: same copy as the pre-migration hardcoded version, used only if the
// ekosistem section (home/index.source.json, section id "trust-verification")
// is unreachable — same pattern as fallbackSeo elsewhere.
const FALLBACK: Required<TrustVerificationSection> = {
  eyebrow: "Verify JVTO",
  heading: "Credentials you can check — not logos you have to take on faith.",
  description:
    "Every license below links directly to the official government registry where you can confirm it yourself — before you pay.",
  credentials: [
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
      summary: "Bripka Agung Sambuko is an active officer, Tourist Police (POLPAR) Bondowoso, East Java. SPRIN documents SHA-256 anchored. Corroborated by Detik.com and BBKSDA Jatim.",
      link: "/verify-jvto/police-safety",
      linkLabel: "See police credentials",
      external: false,
    },
    {
      tier: "03",
      label: "Guide Association & Park Clearance",
      summary: "HPWKI supervisory-board seat held by the founder (decree AHU-0001072.AH.01.07.TAHUN 2024) · operating under the BBKSDA Jawa Timur access regime for Kawah Ijen.",
      link: "/verify-jvto/legal",
      linkLabel: "See license",
      external: false,
    },
  ],
  ctaLabel: "See all 5 credentials",
  ctaSubLabel: "Medical officer · ISIC provider · press recognition · history artifacts",
};

interface TrustVerificationProps {
  section?: TrustVerificationSection;
}

const TrustVerification: React.FC<TrustVerificationProps> = ({ section }) => {
  const eyebrow = section?.eyebrow ?? FALLBACK.eyebrow;
  const heading = section?.heading ?? FALLBACK.heading;
  const description = section?.description ?? FALLBACK.description;
  const credentials = section?.credentials?.length ? section.credentials : FALLBACK.credentials;
  const ctaLabel = section?.ctaLabel ?? FALLBACK.ctaLabel;
  const ctaSubLabel = section?.ctaSubLabel ?? FALLBACK.ctaSubLabel;

  return (
    <section className="py-20 md:py-28 bg-jvto-off">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime-ink">
              {eyebrow}
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            {heading}
          </h2>
          <p className="text-jvto-muted text-sm md:text-base max-w-xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {credentials.map((cred) => (
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
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-xs text-jvto-muted text-center md:text-left">
            {ctaSubLabel}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrustVerification;
