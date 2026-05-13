import Link from "@/components/website/AppLink";
import { ExternalLink } from "lucide-react";

const TRUST_STACK = [
  {
    tier: "01",
    label: "Business Registration",
    items: [
      {
        text: "NIB 1102230032918",
        link: "https://oss.go.id",
        linkLabel: "oss.go.id",
      },
      {
        text: "TDUP 1102230032918 — Dinas Pariwisata",
        link: null,
        linkLabel: null,
      },
      {
        text: "PT Java Volcano Rendezvous — AHU registry",
        link: "https://ahu.go.id",
        linkLabel: "ahu.go.id",
      },
    ],
  },
  {
    tier: "02",
    label: "Founder's Police Status",
    items: [
      {
        text: "Bripka Agung Sambuko — active officer, Ditpamobvit (Tourist Police), East Java",
        link: "/verify-jvto/police-safety",
        linkLabel: "See police credentials",
      },
      {
        text: "SPRIN documents SHA-256 anchored. Corroborated by Detik.com (2021), Radar Jember (2021 × 2), and BBKSDA Jatim (2024)",
        link: "/verify-jvto/press-recognition",
        linkLabel: "See press coverage",
      },
    ],
  },
  {
    tier: "03",
    label: "Guide Association & Park Clearance",
    items: [
      {
        text: "HPWKI membership AHU-0001072.AH.01.07.TAHUN 2024 — Ijen specialist guide association, state-recognized, BBKSDA-supervised training",
        link: "/verify-jvto/legal",
        linkLabel: "See license",
      },
      {
        text: "BBKSDA operator clearance: Bromo Tengger Semeru National Park + Ijen",
        link: null,
        linkLabel: null,
      },
    ],
  },
  {
    tier: "04",
    label: "Medical Officer",
    items: [
      {
        text: "Dr. Ahmad Irwandanu — SIP license issued by Kemenkes RI",
        link: "https://satusehat.kemkes.go.id",
        linkLabel: "Verify at satusehat.kemkes.go.id",
      },
      {
        text: "Also verifiable at KKI (kki.go.id)",
        link: "https://kki.go.id",
        linkLabel: "kki.go.id",
      },
    ],
  },
  {
    tier: "05",
    label: "Third-Party Recognition",
    items: [
      {
        text: "ISIC Provider 259268 (UNESCO-endorsed student identification)",
        link: null,
        linkLabel: null,
      },
      {
        text: "INDECON live member (Indonesian Ecotourism Network)",
        link: null,
        linkLabel: null,
      },
      {
        text: "Stefan Loose Indonesia guidebook 2016, p. 287",
        link: "/verify-jvto/press-recognition",
        linkLabel: "See press",
      },
      {
        text: "Booking.com 2015 award (Ijen Bondowoso Homestay, 9.4/10)",
        link: "/verify-jvto/history-artifacts",
        linkLabel: "See history",
      },
    ],
  },
];

const TrustVerification: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
              Verify JVTO
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight mb-4"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Credentials you can check —{" "}
            <span className="text-jvto-orange italic">
              not logos you have to take on faith.
            </span>
          </h2>
          <p className="text-jvto-muted text-base md:text-lg">
            Every license on this page is publicly verifiable. We publish
            SHA-256 hashes for all credential documents in{" "}
            <code className="font-mono text-sm bg-jvto-navy/8 px-1.5 py-0.5 rounded text-jvto-navy">
              public/llms.txt
            </code>{" "}
            so you can confirm authenticity before you book.
          </p>
        </div>

        {/* Trust stack */}
        <div className="space-y-4 max-w-3xl">
          {TRUST_STACK.map((tier) => (
            <div
              key={tier.tier}
              className="bg-white rounded-[24px] border border-jvto-border p-6 md:p-8"
              style={{ boxShadow: "var(--shadow-jvto)" }}
            >
              <div className="flex items-start gap-4">
                {/* Tier number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jvto-navy flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white font-mono">
                    {tier.tier}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-black text-jvto-navy text-base mb-3"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {tier.label}
                  </h3>
                  <ul className="space-y-2">
                    {tier.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-jvto-muted"
                      >
                        <span className="text-jvto-lime mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span>
                          {item.text}
                          {item.link && (
                            <a
                              href={item.link}
                              target={
                                item.link.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                item.link.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="inline-flex items-center gap-1 ml-2 text-jvto-orange hover:underline font-medium"
                            >
                              {item.linkLabel}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to full verify page */}
        <div className="mt-12">
          <Link
            href="/verify-jvto"
            prefetch={false}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-jvto-lime/50 text-jvto-lime font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-lime/10 transition-colors"
          >
            Open Full Verification Library
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrustVerification;
