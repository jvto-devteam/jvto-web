import { type Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Globe,
  Camera,
  Mountain,
  Map,
} from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import { getActiveCrewMembers } from "@/lib/queries/crewMembers";
import { buildCrewPersonSchema } from "@/lib/schemas/entityGraph";
import {
  buildAllNamedGuideSchemas,
  buildNamedGuideItemListSchema,
  NAMED_GUIDE_PERSONAS,
} from "@/lib/schemas/buildCrewSchemas";
import Sidebar from "../sidebar";

export const revalidate = 3600;

const SITE_URL = "https://javavolcano-touroperator.com";

const defaultTitle = "Our Team — Local KTA-Licensed JVTO Crew";
const defaultDescription =
  "Meet the JVTO team: 4 named specialist guides (photography, Bromo, Tumpak Sewu, logistics) plus 11 active KTA-licensed crew. Every guide is HPWKI-certified via BBKSDA Jawa Timur.";

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage("/why-jvto/our-team", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? defaultTitle,
    description: seo.description ?? defaultDescription,
    openGraph: {
      title: seo.title ?? defaultTitle,
      description: seo.description ?? defaultDescription,
      url: `${SITE_URL}/why-jvto/our-team`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  };
}

const SPECIALTY_ICONS: Record<string, typeof Camera> = {
  anj: Camera,
  guf: Mountain,
  ren: Map,
  prs: Users,
};

export default async function OurTeamPage() {
  const [row, crewMembers] = await Promise.all([
    getContentPage("/why-jvto/our-team", "en"),
    getActiveCrewMembers().catch(() => []),
  ]);

  // Cross-reference named guide codes with DB to enrich with photo + KTA data
  const crewByCode = Object.fromEntries(crewMembers.map((m) => [m.code, m]));

  const namedGuideSchemas = buildAllNamedGuideSchemas().map((schema, i) => {
    const persona = NAMED_GUIDE_PERSONAS[i];
    const dbMember = crewByCode[persona.code];
    if (dbMember?.photoUrl) {
      return {
        ...schema,
        image: {
          "@type": "ImageObject",
          url: dbMember.photoUrl,
          caption: persona.name,
        },
      };
    }
    return schema;
  });

  // Generic crew schemas (DB-driven) for all active members
  const genericCrewSchemas = crewMembers.map((m) => buildCrewPersonSchema(m));

  const extraSchemas = [
    ...namedGuideSchemas,
    buildNamedGuideItemListSchema(),
    ...genericCrewSchemas,
  ];

  const pageRow = row
    ? {
        route: row.route,
        lang: row.lang,
        seo: row.seo,
        content: row.content,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }
    : {
        route: "/why-jvto/our-team",
        lang: "en",
        seo: { title: defaultTitle, description: defaultDescription },
        content: { h1: "Our Team" },
      };

  return (
    <>
      <style>{`
        .team-page {
          --brand: #9fce33;
          --brand-dark: #7aaa1a;
          --brand-dim: rgba(159,206,51,0.12);
          --brand-border: rgba(159,206,51,0.30);
          --ink: #0c0e09;
          --ink-mid: #1a1e12;
          --surface: #f5f7f0;
          --surface-2: #edf0e6;
          --card-bg: #ffffff;
          --border: #dde3d0;
          --text-muted: #6b7a55;
        }

        .team-hero {
          background: var(--ink);
          color: #fff;
          padding: 6rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .team-hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at 80% 20%, rgba(159,206,51,0.07), transparent 60%);
          pointer-events: none;
        }
        .team-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
        .team-hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.8rem; border-radius: 999px;
          background: rgba(159,206,51,0.12); border: 1px solid rgba(159,206,51,0.3);
          color: var(--brand); font-size: 0.65rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;
        }
        .team-hero h1 {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 800; line-height: 1.05; letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .team-hero h1 span {
          background: linear-gradient(95deg, var(--brand) 0%, #c8e86a 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .team-hero-sub {
          color: rgba(255,255,255,0.55); font-size: 1rem; line-height: 1.7;
          max-width: 540px; margin-bottom: 2.5rem;
        }
        .team-stat-row {
          display: flex; flex-wrap: wrap; gap: 2rem;
          border-top: 1px solid rgba(255,255,255,0.07); padding-top: 2rem;
        }
        .team-stat { display: flex; flex-direction: column; }
        .team-stat-num { font-size: 1.75rem; font-weight: 800; color: var(--brand); line-height: 1; }
        .team-stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }

        /* ── Breadcrumb ── */
        .team-breadcrumb {
          background: var(--ink-mid); border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0.75rem 2rem;
        }
        .team-breadcrumb-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.72rem; color: rgba(255,255,255,0.3);
        }
        .team-breadcrumb-inner a { color: rgba(255,255,255,0.45); text-decoration: none; }
        .team-breadcrumb-inner a:hover { color: var(--brand); }
        .team-breadcrumb-inner .sep { opacity: 0.3; }
        .team-breadcrumb-inner .current { color: rgba(255,255,255,0.7); }

        /* ── Section shared ── */
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .section-eyebrow {
          font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.14em; color: var(--brand); margin-bottom: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
        }

        /* ── Named Guides ── */
        .named-guides-section {
          background: #111510;
          padding: 5rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .named-guides-header { text-align: center; margin-bottom: 3rem; }
        .named-guides-header h2 {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 800; letter-spacing: -0.025em;
          color: #fff; margin-bottom: 0.75rem;
        }
        .named-guides-header p {
          color: rgba(255,255,255,0.4); font-size: 0.9rem;
          max-width: 520px; margin: 0 auto; line-height: 1.65;
        }
        .named-guides-grid {
          display: grid; grid-template-columns: 1fr; gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .named-guides-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .named-guides-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .guide-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.125rem; padding: 1.75rem;
          display: flex; flex-direction: column; gap: 1rem;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          position: relative; overflow: hidden;
        }
        .guide-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(135deg, rgba(159,206,51,0.06) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .guide-card:hover { border-color: rgba(159,206,51,0.3); background: rgba(255,255,255,0.05); }
        .guide-card:hover::before { opacity: 1; }

        .guide-photo-wrap {
          width: 3.5rem; height: 3.5rem; border-radius: 50%;
          background: rgba(159,206,51,0.15); border: 1px solid rgba(159,206,51,0.25);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .guide-photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .guide-photo-wrap svg { color: var(--brand); }

        .guide-header { display: flex; align-items: center; gap: 1rem; }
        .guide-name { font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1; }
        .guide-title { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 0.2rem; line-height: 1.3; }

        .guide-desc {
          font-size: 0.8rem; color: rgba(255,255,255,0.45);
          line-height: 1.65; flex: 1;
        }

        .guide-knows-label {
          font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.12em; color: rgba(255,255,255,0.25);
          font-family: 'JetBrains Mono', monospace; margin-bottom: 0.5rem;
        }
        .guide-knows-tags {
          display: flex; flex-wrap: wrap; gap: 0.4rem;
        }
        .guide-knows-tag {
          font-size: 0.62rem; padding: 0.2rem 0.55rem;
          background: rgba(159,206,51,0.1); border: 1px solid rgba(159,206,51,0.2);
          border-radius: 999px; color: var(--brand); line-height: 1.4;
        }

        .guide-langs {
          display: flex; gap: 0.4rem; flex-wrap: wrap;
        }
        .guide-lang-badge {
          font-size: 0.6rem; font-weight: 700; padding: 0.2rem 0.5rem;
          border-radius: 0.375rem;
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; gap: 0.25rem;
        }

        .guide-kta-badge {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.6rem; font-weight: 700;
          color: var(--brand); padding: 0.2rem 0.6rem;
          background: rgba(159,206,51,0.08); border: 1px solid rgba(159,206,51,0.2);
          border-radius: 0.375rem; margin-top: auto;
        }

        /* ── Full Crew Grid ── */
        .full-crew-section {
          background: var(--surface); padding: 5rem 0;
          border-top: 1px solid var(--border);
        }
        .full-crew-header { margin-bottom: 2.5rem; }
        .full-crew-header h2 {
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 800; letter-spacing: -0.02em; color: var(--ink);
          margin-bottom: 0.5rem;
        }
        .full-crew-header p {
          color: var(--text-muted); font-size: 0.875rem; line-height: 1.6;
        }

        .crew-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
        }
        @media (min-width: 480px) { .crew-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px) { .crew-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .crew-grid { grid-template-columns: repeat(6, 1fr); } }

        .crew-card {
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 0.875rem; padding: 1.25rem 1rem;
          display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.625rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .crew-card:hover { border-color: var(--brand-border); box-shadow: 0 6px 24px rgba(0,0,0,0.08); }

        .crew-avatar {
          width: 3rem; height: 3rem; border-radius: 50%;
          background: var(--surface-2); border: 1px solid var(--border);
          overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
        .crew-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .crew-name { font-size: 0.82rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
        .crew-type {
          font-size: 0.65rem; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .crew-kta {
          font-size: 0.6rem; color: var(--brand-dark);
          display: flex; align-items: center; gap: 0.25rem; font-weight: 700;
        }

        /* ── Trust Cross-links ── */
        .trust-links-section {
          background: var(--card-bg); padding: 4rem 0;
          border-top: 1px solid var(--border);
        }
        .trust-links-header h2 {
          font-size: clamp(1.25rem, 2vw, 1.75rem);
          font-weight: 800; letter-spacing: -0.02em; color: var(--ink);
          margin-bottom: 0.5rem;
        }
        .trust-links-header p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.6; max-width: 480px; }
        .trust-links-grid {
          display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem;
        }
        @media (min-width: 640px) { .trust-links-grid { grid-template-columns: repeat(2, 1fr); } }
        .trust-link-card {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 1.125rem; border-radius: 0.875rem;
          background: var(--surface); border: 1px solid var(--border);
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .trust-link-card:hover { border-color: var(--brand-border); background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .trust-link-icon { color: var(--brand); flex-shrink: 0; }
        .trust-link-text { flex: 1; }
        .trust-link-title { font-weight: 700; font-size: 0.875rem; color: var(--ink); display: block; }
        .trust-link-note { font-size: 0.75rem; color: var(--text-muted); }
        .trust-link-arrow { color: var(--text-muted); flex-shrink: 0; transition: transform 0.2s; }
        .trust-link-card:hover .trust-link-arrow { transform: translateX(3px); color: var(--brand-dark); }

        /* ── Footer CTA ── */
        .team-footer-cta {
          background: var(--ink); color: #fff; padding: 4.5rem 2rem;
          text-align: center; border-top: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
        }
        .team-footer-cta::before {
          content: '';
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(159,206,51,0.06), transparent 70%);
          pointer-events: none;
        }
        .team-footer-cta-inner { position: relative; z-index: 1; }
        .team-footer-cta h2 {
          font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 800;
          letter-spacing: -0.025em; margin-bottom: 0.75rem;
        }
        .team-footer-cta p {
          color: rgba(255,255,255,0.4); font-size: 0.95rem;
          margin-bottom: 2.25rem; line-height: 1.6;
        }
        .team-footer-btns { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.75rem; border-radius: 0.75rem; font-weight: 700;
          font-size: 0.875rem; background: var(--brand); color: var(--ink);
          border: none; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #b2de3d; transform: translateY(-1px); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.75rem; border-radius: 0.75rem; font-weight: 700;
          font-size: 0.875rem; background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.18); text-decoration: none;
          transition: background 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.07); }
      `}</style>

      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <PageJsonLdCombined
          pageRow={pageRow as any}
          extraSchemas={extraSchemas}
          suppressCmsFaq={false}
        />

        <main className="pt-24 w-full team-page">

          {/* ══════════ BREADCRUMB ══════════ */}
          <nav className="team-breadcrumb" aria-label="Breadcrumb">
            <div className="team-breadcrumb-inner">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href="/why-jvto">Why JVTO</Link>
              <span className="sep">/</span>
              <span className="current">Our Team</span>
            </div>
          </nav>

          {/* ══════════ HERO ══════════ */}
          <section className="team-hero">
            <div className="team-hero-inner">
              <div className="team-hero-badge">
                <ShieldCheck size={13} />
                HPWKI KTA-Licensed · BBKSDA Supervised
              </div>
              <h1>
                Our <span>Local Team</span>
              </h1>
              <p className="team-hero-sub">
                A permanent crew based in East Java. Every guide holds a KTA licence
                issued by HPWKI — the Ijen volcano guide association supervised by
                BBKSDA (Ministry of Environment). Four guides carry named specialties
                for photography, Bromo, Tumpak Sewu, and logistics.
              </p>
              <div className="team-stat-row">
                <div className="team-stat">
                  <span className="team-stat-num">{crewMembers.length || 11}+</span>
                  <span className="team-stat-label">Active Crew</span>
                </div>
                <div className="team-stat">
                  <span className="team-stat-num">4</span>
                  <span className="team-stat-label">Named Specialists</span>
                </div>
                <div className="team-stat">
                  <span className="team-stat-num">KTA</span>
                  <span className="team-stat-label">HPWKI Licensed · All Guides</span>
                </div>
                <div className="team-stat">
                  <span className="team-stat-num">2015</span>
                  <span className="team-stat-label">Crew Continuity Since</span>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════ NAMED GUIDE PERSONAS ══════════ */}
          {/* AEO: 4 Person entities with knowsAbout[] specialty signals.
              AI search: "best photography guide for Ijen" resolves to /#crew-anj */}
          <section className="named-guides-section" id="specialist-guides">
            <div className="section-inner">
              <div className="named-guides-header">
                <div className="section-eyebrow">◆ Specialist Guides</div>
                <h2>Named Guides with Documented Specialties</h2>
                <p>
                  Each guide below holds a structured identity entity — verifiable by name,
                  specialty, and employer. Not anonymous freelancers.
                </p>
              </div>
              <div className="named-guides-grid">
                {NAMED_GUIDE_PERSONAS.map((guide) => {
                  const dbData = crewByCode[guide.code];
                  const photoUrl = dbData?.photoUrl ?? guide.photoUrl;
                  const SpecialtyIcon = SPECIALTY_ICONS[guide.code] ?? Users;
                  return (
                    <article key={guide.code} className="guide-card">
                      <div className="guide-header">
                        <div className="guide-photo-wrap">
                          {photoUrl ? (
                            <img src={photoUrl} alt={guide.name} />
                          ) : (
                            <SpecialtyIcon size={20} />
                          )}
                        </div>
                        <div>
                          <div className="guide-name">{guide.name}</div>
                          <div className="guide-title">{guide.jobTitle}</div>
                        </div>
                      </div>

                      <p className="guide-desc">{guide.description}</p>

                      <div>
                        <div className="guide-knows-label">Specialty Areas</div>
                        <div className="guide-knows-tags">
                          {guide.knowsAbout.map((k) => (
                            <span key={k} className="guide-knows-tag">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="guide-langs">
                        <Globe size={10} style={{ color: "rgba(255,255,255,0.3)", marginTop: 2 }} />
                        {guide.knowsLanguage.map((lang) => (
                          <span key={lang} className="guide-lang-badge">
                            {lang}
                          </span>
                        ))}
                      </div>

                      <div className="guide-kta-badge">
                        <CheckCircle2 size={11} />
                        KTA Licensed · HPWKI
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══════════ FULL CREW GRID ══════════ */}
          {crewMembers.length > 0 && (
            <section className="full-crew-section" id="full-crew">
              <div className="section-inner">
                <div className="full-crew-header">
                  <div className="section-eyebrow" style={{ color: "var(--brand-dark)" }}>
                    ◆ Full Crew ({crewMembers.length} Active)
                  </div>
                  <h2>Permanent JVTO Crew</h2>
                  <p>
                    All crew below are full-time JVTO employees — not freelancers sourced
                    per trip. Each holds a KTA guide licence or is a licensed driver on
                    the JVTO vehicle fleet.
                  </p>
                </div>
                <div className="crew-grid">
                  {crewMembers.map((m) => (
                    <div key={m.code} className="crew-card">
                      <div className="crew-avatar">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.name} />
                        ) : (
                          <Users size={18} color="var(--text-muted)" />
                        )}
                      </div>
                      <div className="crew-name">{m.name}</div>
                      <div className="crew-type">
                        {m.type === "Guide" ? "Licensed Guide" : "Driver"}
                      </div>
                      {m.type === "Guide" && (
                        <div className="crew-kta">
                          <CheckCircle2 size={10} />
                          KTA Licensed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══════════ TRUST CROSS-LINKS ══════════ */}
          {/* Cluster gap #2 fix: /why-jvto/our-team → /travel-guide/safety-on-tours */}
          <section className="trust-links-section">
            <div className="section-inner">
              <div className="trust-links-header">
                <div className="section-eyebrow" style={{ color: "var(--brand-dark)" }}>
                  ◆ Verify The Team
                </div>
                <h2>How JVTO Builds Crew Accountability</h2>
                <p>
                  KTA credentials, police-led safety culture, and operational protocols
                  documented across two separate proof pages.
                </p>
              </div>
              <div className="trust-links-grid">
                <Link href="/travel-guide/safety-on-tours" className="trust-link-card">
                  <ShieldCheck size={20} className="trust-link-icon" />
                  <span className="trust-link-text">
                    <span className="trust-link-title">Safety On Tours</span>
                    <span className="trust-link-note">
                      Gas mask provisioning, vehicle-by-pax rules, police-led safety model
                    </span>
                  </span>
                  <ArrowRight size={16} className="trust-link-arrow" />
                </Link>
                <Link href="/verify-jvto/police-safety" className="trust-link-card">
                  <CheckCircle2 size={20} className="trust-link-icon" />
                  <span className="trust-link-text">
                    <span className="trust-link-title">Police Safety Credentials</span>
                    <span className="trust-link-note">
                      SPRIN-POLPAR, HPWKI/BBKSDA training chain, Tourist Police documentation
                    </span>
                  </span>
                  <ArrowRight size={16} className="trust-link-arrow" />
                </Link>
                <Link href="/verify-jvto/legal" className="trust-link-card">
                  <CheckCircle2 size={20} className="trust-link-icon" />
                  <span className="trust-link-text">
                    <span className="trust-link-title">Legal Registration (NIB / HPWKI)</span>
                    <span className="trust-link-note">
                      Business registration, HPWKI membership, BBKSDA compliance chain
                    </span>
                  </span>
                  <ArrowRight size={16} className="trust-link-arrow" />
                </Link>
                <Link href="/why-jvto/reviews" className="trust-link-card">
                  <CheckCircle2 size={20} className="trust-link-icon" />
                  <span className="trust-link-text">
                    <span className="trust-link-title">Guest Reviews Naming Guides</span>
                    <span className="trust-link-note">
                      Real reviews citing guide names — Trustpilot, TripAdvisor, Google
                    </span>
                  </span>
                  <ArrowRight size={16} className="trust-link-arrow" />
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ FOOTER CTA ══════════ */}
          <footer className="team-footer-cta">
            <div className="team-footer-cta-inner">
              <h2>Ready to Meet the Team in Person?</h2>
              <p>
                Private tour. Named guide. Verified credentials.
              </p>
              <div className="team-footer-btns">
                <Link href="/tours" className="btn-primary">
                  View Tours <ArrowRight size={16} />
                </Link>
                <Link href="/why-jvto" className="btn-ghost">
                  ← Back to Why JVTO
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
