import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import {
  ShieldCheck,
  BookOpen,
  Star,
  ArrowRight,
  CheckCircle2,
  Search,
  MessageCircleQuestion,
  ShieldAlert,
  Scale,
  Mountain,
  Handshake,
  Lock,
  ExternalLink,
  FileDigit,
  ChevronRight,
  Fingerprint,
  Newspaper,
} from "lucide-react";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { getAllNarrativeClaims } from "@/lib/queries/narrativeClaims";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";
import {
  buildWhyJvtoHubItemListSchema,
  buildNarrativeClaimsItemList,
} from "@/lib/schemas/buildWhyJvtoSchemas";
import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";
import { CREW_PORTRAITS, FOUNDER_LEADERSHIP, HISTORY_HERITAGE } from "@/lib/imageAssets";
import SidebarDesktop from "./SidebarDesktop";
import { WHY_JVTO_STYLES } from "./whyJvtoTokens";
import {
  DifferenceChips,
  ReviewQuoteRotator,
  StoryTimelineTabs,
  StandardsAccordion,
} from "./HubInteractive";

const siteUrl = "https://javavolcano-touroperator.com";

const defaultWhyTitle = "Why Choose Java Volcano Tour Operator";
const defaultWhyDescription =
  "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot("/why-jvto", {
    allowDatabaseFallback: false,
  });
  const title = page.snapshot.seo.title;
  const description = page.snapshot.seo.description ?? defaultWhyDescription;
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : "Why JVTO";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/why-jvto`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/why-jvto.webp",
          width: 1200,
          height: 630,
          alt: h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/why-jvto.webp"],
    },
  };
}

const trustStackCards = [
  {
    icon: ShieldAlert,
    title: "The JVTO Difference",
    desc: "Police-led safety mindset, documented operational discipline, and proof you can verify.",
    href: "/why-jvto/the-jvto-difference",
  },
  {
    icon: Scale,
    title: "Our Story: Roots Since 2015",
    desc: "Booking.com award, documented continuity, and artifacts tracing our history in Bondowoso.",
    href: "/why-jvto/our-story",
  },
  {
    icon: Mountain,
    title: "Our Team: Local Crew",
    desc: "14 named guides and drivers, HPWKI KTA-credentialed, recruited locally — no freelancers.",
    href: "/why-jvto/our-team",
  },
  {
    icon: Star,
    title: "Guest Reviews (Independent Platforms)",
    desc: "Independent reviews across Trustpilot, Google Maps and TripAdvisor.",
    href: "/why-jvto/reviews",
  },
  {
    icon: Handshake,
    title: "Community Standards & Partners",
    desc: "HPWKI, ISIC, INDECON partnerships plus operational ethics and cancellation rules.",
    href: "/why-jvto/community-standards",
  },
  {
    icon: Search,
    title: "Verify JVTO",
    desc: "Legal docs, safety docs, press, and history artifacts — organized for easy checking.",
    href: "/verify-jvto",
  },
];

const proofDocs = [
  {
    title: "NIB Entity",
    img: `${siteUrl}/legal/NIB-1102230032918-preview.webp`,
    hash: "FA20DDE3...",
  },
  {
    title: "Police SPRIN",
    img: `${siteUrl}/legal/SPRIN-POLPAR.webp`,
    hash: "03C8578D...",
  },
  {
    title: "Health Screening",
    img: `${siteUrl}/screening/ijen-screening-hotel-01.webp`,
    hash: "C52194BB...",
  },
  {
    title: "HPWKI License",
    img: `${siteUrl}/uploads/1763205255605-141795118-kiki.webp`,
    hash: "CA1FB1A4...",
  },
];

export default async function WhyJvtoPage() {
  const [page, faqResolution, narrativeClaims] = await Promise.all([
    getPublicPageSnapshot("/why-jvto", { allowDatabaseFallback: false }),
    resolveFaqsForPage("/why-jvto"),
    getAllNarrativeClaims().catch(() => []),
  ]);
  const heroH1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : defaultWhyTitle;
  const heroLede = Array.isArray(page.snapshot.content.lede)
    ? (page.snapshot.content.lede as string[])
    : [];

  const faqSchemaNode = buildResolvedFaqSchema(faqResolution, "/why-jvto");
  const extraSchemas = [
    buildWhyJvtoHubItemListSchema(),
    buildNarrativeClaimsItemList(narrativeClaims),
    faqSchemaNode,
  ].filter(Boolean);

  const faqItems = faqResolution.faqs.length
    ? faqResolution.faqs.map((f) => ({ q: f.question, a: f.answer }))
    : null;
  const cmsContentFaq = Array.isArray((page.pageRow.content as any)?.faq)
    ? ((page.pageRow.content as any).faq as Array<{ q: string; a: string }>)
    : [];
  const visibleFaqs = faqItems ?? cmsContentFaq;

  const trustpilot = REVIEW_PLATFORMS.find((p) => p.platform === "Trustpilot");
  const googleMaps = REVIEW_PLATFORMS.find((p) => p.platform === "Google Maps");
  const tripAdvisor = REVIEW_PLATFORMS.find((p) => p.platform === "TripAdvisor");

  const founderPhoto = FOUNDER_LEADERSHIP[0];
  const historyPhoto = HISTORY_HERITAGE[0];
  const crewPreview = CREW_PORTRAITS.slice(0, 8);

  return (
    <>
      <style>{WHY_JVTO_STYLES}</style>
      <style>{`
        .jw-feat { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .jw-feat.jw-reverse .jw-feat-media { order: 2; }
        @media (max-width: 940px) { .jw-feat { grid-template-columns: 1fr; gap: 2rem; } .jw-feat.jw-reverse .jw-feat-media { order: 0; } }
        .jw-feat-eyebrow { display: inline-flex; align-items: center; gap: .5rem; font-family: var(--jw-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #E8650A; margin-bottom: 1rem; }
        .jw-feat-eyebrow .jw-fe-num { color: #6B7280; }
        .jw-feat-body h3 { font-family: var(--jw-font-display); font-size: clamp(24px, 3.2vw, 38px); letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 1rem; color: #0D1B2A; }
        .jw-feat-body.jw-on-dark h3 { color: #fff; }
        .jw-feat-lede { color: #6B7280; font-size: 15.5px; font-weight: 400; line-height: 1.6; max-width: 46ch; margin-bottom: 1.5rem; }
        .jw-feat-body.jw-on-dark .jw-feat-lede { color: rgba(255,255,255,0.72); }
      `}</style>

      <div className="jw-root flex min-h-screen bg-white">
        <SidebarDesktop currentPath="/why-jvto" />
        <PageJsonLdCombined
          pageRow={page.pageRow}
          extraSchemas={extraSchemas}
          suppressCmsFaq={faqResolution.suppressCmsFaq}
        />

        <main className="pt-24 w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          {/* ══════════ HERO ══════════ */}
          <section style={{ padding: "1.5rem 1.5rem 0" }}>
            <header className="jw-hero">
              <div className="jw-hero-inner">
                <div className="jw-hero-eyebrow-row">
                  <span className="jw-eyebrow-pill">Why JVTO — Hub</span>
                  <span className="jw-eyebrow-meta">Six pillars, each verifiable</span>
                </div>
                <h1 className="jw-hero-h1" style={{ maxWidth: "24ch" }}>
                  {heroH1}
                </h1>
                {heroLede.slice(0, 2).map((p, i) => (
                  <p key={i} className="jw-hero-lede" style={{ marginBottom: i === 0 ? "0.6rem" : 0 }}>
                    {p}
                  </p>
                ))}
                <div className="jw-hero-meta">
                  <div className="jw-meta-row">
                    <span>Legal entity</span>
                    <strong>PT Java Volcano Rendezvous</strong>
                  </div>
                  <div className="jw-meta-row">
                    <span>NIB</span>
                    <strong>1102230032918</strong>
                  </div>
                  <div className="jw-meta-row">
                    <span>Founder</span>
                    <strong>Active Tourist Police</strong>
                  </div>
                  <div className="jw-meta-row">
                    <span>Tour format</span>
                    <strong>100% private</strong>
                  </div>
                </div>
              </div>
            </header>

            {/* Trust bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1.25rem 2.5rem",
                padding: "1.5rem",
                marginTop: "-1px",
              }}
            >
              {[
                { Icon: Star, label: `Trustpilot ${trustpilot?.rating ?? "4.8"}` },
                { Icon: Star, label: `Google Maps ${googleMaps?.rating ?? "4.9"}` },
                { Icon: Star, label: `TripAdvisor ${tripAdvisor?.rating ?? "4.95"}` },
                { Icon: CheckCircle2, label: "ISIC Partner" },
                { Icon: ShieldCheck, label: "HPWKI Member" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#0D1B2A", fontWeight: 700, fontSize: "0.85rem" }}
                >
                  <Icon size={15} color="#E8650A" />
                  {label}
                </div>
              ))}
            </div>
          </section>

          {/* ══════════ 01 · THE JVTO DIFFERENCE ══════════ */}
          <section style={{ padding: "4rem 1.5rem" }}>
            <div className="jw-feat jw-reverse" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  {founderPhoto && <img src={founderPhoto.url} alt={founderPhoto.alt} loading="lazy" />}
                  <span className="jw-media-tag">Ditpamobvit · operational authority</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <ShieldCheck />
                    <div>
                      <div className="jw-fb-title">Official Safety Authority</div>
                      <div className="jw-fb-sub">Active Tourist Police officer</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body">
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num">§ 01</span> · The JVTO Difference
                </span>
                <h3>
                  Six differentiators, <span className="jw-accent-orange">each verifiable.</span>
                </h3>
                <p className="jw-feat-lede">
                  Not marketing language — every one is backed by a credential you can check. Tap a pillar to see
                  what proves it.
                </p>
                <DifferenceChips />
                <Link href="/why-jvto/the-jvto-difference" prefetch={false} className="jw-inline-link" style={{ marginTop: "1.5rem" }}>
                  Read the difference →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ Press evidence (real, national media) ══════════ */}
          <section style={{ background: "#0D1B2A", padding: "3.5rem 1.5rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="jw-press-grid">
              <div>
                <div className="jw-micro" style={{ color: "#8CC63F", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
                  <Newspaper size={13} /> National Media Verification
                </div>
                <h3 style={{ fontFamily: "var(--jw-font-display)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 1rem" }}>
                  Duty first, business second.
                </h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Our founder, Bripka Agung Sambuko, was covered by national media (Detik.com) for his dedication as
                  a Tourist Police officer keeping visitors safe in the extreme conditions of Kawah Ijen.
                </p>
                <div className="jw-cred jw-dark" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
                  <span className="jw-cred-text" style={{ fontFamily: "var(--jw-font-display)", fontStyle: "italic", fontSize: "1rem", color: "#fff" }}>
                    &ldquo;The important thing is that the people who travel are safe.&rdquo;
                  </span>
                  <span className="jw-cred-label">— Bripka Agung Sambuko (Detik News)</span>
                </div>
                <a
                  href="https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="jw-inline-link jw-light"
                  style={{ marginTop: "1.25rem" }}
                >
                  Read original article <ExternalLink size={12} />
                </a>
              </div>
              <div>
                <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "var(--jw-shadow-hover)" }}>
                  <img
                    src={`${siteUrl}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.webp`}
                    alt="Detik.com article screenshot"
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", display: "block" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.9rem", background: "rgba(0,0,0,0.4)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--jw-font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                      <Fingerprint size={11} /> SHA-256: B257B7...
                    </span>
                    <span style={{ fontFamily: "var(--jw-font-mono)", fontSize: "10px", background: "rgba(140,198,63,0.15)", color: "#8CC63F", padding: "2px 8px", borderRadius: "4px" }}>
                      14 Mar 2021
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════ 02 · REVIEWS ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#F6F5F2" }}>
            <div className="jw-feat" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  {crewPreview[0] && <img src={crewPreview[0].url} alt={crewPreview[0].alt} loading="lazy" />}
                  <span className="jw-media-tag">Verified across 3 platforms</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <Star fill="#F5A623" color="#F5A623" />
                    <div>
                      <div className="jw-fb-title">{trustpilot?.rating ?? "4.8"} ★ Trustpilot</div>
                      <div className="jw-fb-sub">{trustpilot?.count ?? 51} verified reviews</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body">
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num">§ 02</span> · Reviews
                </span>
                <h3>
                  Patterns, not a <span className="jw-accent-orange">quote wall.</span>
                </h3>
                <p className="jw-feat-lede">
                  Feedback grouped by what it proves, across three independent platforms — verified, not
                  cherry-picked.
                </p>
                <div className="jw-agg-grid" style={{ marginBottom: "1.25rem" }}>
                  {[trustpilot, googleMaps, tripAdvisor].filter(Boolean).map((p) => (
                    <div key={p!.platform} className="jw-agg" style={{ padding: "1rem 1.1rem" }}>
                      <span className="jw-agg-plat">{p!.platform}</span>
                      <span className="jw-agg-score" style={{ fontSize: "1.6rem" }}>
                        {p!.rating}
                      </span>
                      <span className="jw-agg-meta" style={{ border: 0, paddingTop: 0 }}>
                        {p!.count} reviews
                      </span>
                    </div>
                  ))}
                </div>
                <ReviewQuoteRotator />
                <Link href="/why-jvto/reviews" prefetch={false} className="jw-inline-link" style={{ marginTop: "1.5rem" }}>
                  Read all reviews →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ 03 · OUR STORY ══════════ */}
          <section style={{ padding: "4rem 1.5rem" }}>
            <div className="jw-feat jw-reverse" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  {historyPhoto && <img src={historyPhoto.url} alt={historyPhoto.alt} loading="lazy" />}
                  <span className="jw-media-tag">Bondowoso · since 2015</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <BookOpen />
                    <div>
                      <div className="jw-fb-title">Est. 2015</div>
                      <div className="jw-fb-sub">Ijen Bondowoso Homestay</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body jw-on-dark" style={{ background: "#0D1B2A", borderRadius: "28px", padding: "2.5rem" }}>
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num" style={{ color: "rgba(255,255,255,0.5)" }}>
                    § 03
                  </span>{" "}
                  · Our Story
                </span>
                <h3>
                  From a homestay to a <span className="jw-accent-orange">licensed operator.</span>
                </h3>
                <p className="jw-feat-lede">
                  Documented operational continuity at one Bondowoso address — tap a milestone.
                </p>
                <StoryTimelineTabs />
                <Link href="/why-jvto/our-story" prefetch={false} className="jw-inline-link jw-light" style={{ marginTop: "1.5rem" }}>
                  Read our story →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ 04 · OUR TEAM ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#0D1B2A" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "2rem",
                  flexWrap: "wrap",
                  marginBottom: "2.25rem",
                }}
              >
                <div>
                  <span className="jw-feat-eyebrow" style={{ color: "#8CC63F" }}>
                    <span className="jw-fe-num" style={{ color: "rgba(255,255,255,0.5)" }}>
                      § 04
                    </span>{" "}
                    · Our Team
                  </span>
                  <h3 style={{ fontFamily: "var(--jw-font-display)", fontSize: "clamp(24px,3.2vw,38px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.08, maxWidth: "18ch", margin: 0 }}>
                    14 named crew. <span className="jw-accent-orange">No freelancers.</span>
                  </h3>
                </div>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  {[
                    ["7", "Guides"],
                    ["7", "Drivers"],
                    ["5", "HPWKI KTA"],
                  ].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: "var(--jw-font-display)", fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em", color: "#8CC63F", lineHeight: 1 }}>
                        {n}
                      </div>
                      <div className="jw-micro" style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.35rem" }}>
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                {crewPreview.map((m) => (
                  <div
                    key={m.url}
                    style={{
                      position: "relative",
                      width: "150px",
                      aspectRatio: "3/4",
                      borderRadius: "18px",
                      overflow: "hidden",
                      background: "#1C2E40",
                      flexShrink: 0,
                    }}
                  >
                    <img src={m.url} alt={m.alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, transparent 45%, rgba(13,27,42,0.92) 100%)",
                      }}
                    />
                    <div style={{ position: "absolute", left: "12px", bottom: "10px" }}>
                      <div style={{ fontFamily: "var(--jw-font-display)", fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                        {m.caption.split(" - ")[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="jw-micro" style={{ color: "rgba(255,255,255,0.5)", marginTop: "1.25rem" }}>
                Individually photographed &amp; license-linked · recruited from Bondowoso &amp; Banyuwangi
              </p>
              <Link href="/why-jvto/our-team" prefetch={false} className="jw-inline-link jw-light" style={{ marginTop: "1rem" }}>
                Meet the full team →
              </Link>
            </div>
          </section>

          {/* ══════════ 05 · COMMUNITY STANDARDS ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#F6F5F2" }}>
            <div className="jw-feat jw-reverse" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  {crewPreview[1] && <img src={crewPreview[1].url} alt={crewPreview[1].alt} loading="lazy" />}
                  <span className="jw-media-tag">Kawah Ijen · shared working path</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <Handshake />
                    <div>
                      <div className="jw-fb-title">Ecotourism-aligned</div>
                      <div className="jw-fb-sub">Local crew policy</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body">
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num">§ 05</span> · Community Standards
                </span>
                <h3>
                  Read the rulebook <span className="jw-accent-orange">before you book.</span>
                </h3>
                <p className="jw-feat-lede">
                  We publish what we don&rsquo;t do as plainly as what we do. Every policy is online before you pay.
                </p>
                <StandardsAccordion />
                <Link href="/why-jvto/community-standards" prefetch={false} className="jw-inline-link" style={{ marginTop: "1.5rem" }}>
                  See the standards →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ TRUST STACK INDEX ══════════ */}
          <section style={{ padding: "5rem 1.5rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-section-head" style={{ textAlign: "center" }}>
                <div className="jw-section-eyebrow" style={{ justifyContent: "center" }}>
                  <span className="jw-micro">◆ Verification Registry</span>
                </div>
                <h2 className="jw-section-h2">The JVTO Trust Stack</h2>
                <p className="jw-section-sub" style={{ margin: "0.6rem auto 0" }}>
                  Navigate our proof library. Marketing promises are cheap; operational discipline is verifiable.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1.25rem",
                  marginTop: "2.5rem",
                }}
              >
                {trustStackCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={i}
                      href={card.href}
                      prefetch={false}
                      style={{
                        background: "#fff",
                        border: "1px solid #E3E0DA",
                        borderRadius: "18px",
                        padding: "1.5rem",
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                        transition: "box-shadow .2s, border-color .2s",
                      }}
                    >
                      <div
                        style={{
                          width: "2.75rem",
                          height: "2.75rem",
                          borderRadius: "12px",
                          background: "#0D1B2A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <Icon size={20} color="#8CC63F" />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D1B2A", marginBottom: "0.4rem" }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.6, marginBottom: "1rem" }}>
                        {card.desc}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 700, color: "#E8650A" }}>
                        Explore proof <ChevronRight size={14} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══════════ PROOF LOCKER ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#F6F5F2" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", marginBottom: "2rem" }}>
                <div>
                  <h2 className="jw-section-h2">Don&rsquo;t guess. Verify.</h2>
                  <p className="jw-section-sub">In an industry of ghost operators, we publish credentials with cryptographic proofs.</p>
                </div>
                <Link href="/verify-jvto" prefetch={false} className="jw-inline-link">
                  <Lock size={14} /> Enter proof library
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="jw-proof-grid">
                {proofDocs.map((doc, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #E3E0DA", borderRadius: "14px", padding: "0.75rem" }}>
                    <div style={{ background: "#eceae4", borderRadius: "8px", overflow: "hidden", height: "9rem", position: "relative", marginBottom: "0.75rem" }}>
                      <img src={doc.img} alt={doc.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                      <FileDigit size={26} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#9aa08e" }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#0D1B2A", marginBottom: "0.3rem" }}>{doc.title}</div>
                    <span style={{ fontFamily: "var(--jw-font-mono)", fontSize: "0.6rem", color: "#6B7280", background: "#F6F5F2", padding: "0.25rem 0.5rem", borderRadius: "4px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      SHA-256: {doc.hash}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════ FAQ ══════════ */}
          {visibleFaqs.length > 0 && (
            <section style={{ padding: "5rem 1.5rem" }}>
              <div style={{ maxWidth: "820px", margin: "0 auto" }}>
                <div className="jw-section-head" style={{ textAlign: "center" }}>
                  <div className="jw-section-eyebrow" style={{ justifyContent: "center" }}>
                    <span className="jw-micro">◆ Quick Answers</span>
                  </div>
                  <h2 className="jw-section-h2">FAQ</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {visibleFaqs.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#F6F5F2",
                        border: "1px solid #E3E0DA",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        display: "flex",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          flexShrink: 0,
                          borderRadius: "10px",
                          background: "#0D1B2A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MessageCircleQuestion size={17} color="#8CC63F" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D1B2A", marginBottom: "0.375rem" }}>{item.q}</div>
                        <div style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.6 }}>{item.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══════════ CTA ══════════ */}
          <div style={{ padding: "0 1.5rem 2rem" }}>
            <div className="jw-cta-block" style={{ marginTop: 0 }}>
              <h2>
                Don&rsquo;t guess. <span className="jw-accent-orange">Verify.</span>
              </h2>
              <div className="jw-cta-ctas">
                <Link href="/verify-jvto" prefetch={false} className="jw-primary">
                  Open the proof library <ArrowRight size={14} />
                </Link>
                <Link href="/tours" prefetch={false} className="jw-ghost">
                  Explore private tours
                </Link>
              </div>
              <p className="jw-micro" style={{ color: "rgba(255,255,255,0.5)", marginTop: "2rem" }}>
                PT Java Volcano Rendezvous · NIB 1102230032918 · Trustpilot {trustpilot?.rating ?? "4.8"} / 5 (
                {trustpilot?.count ?? 51} reviews{trustpilot?.lastVerified ? `, verified ${trustpilot.lastVerified}` : ""})
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
