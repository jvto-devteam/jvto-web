// app/(website)/why-jvto/our-team/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import {
  getPublicGuides,
  getPublicDrivers,
  getCrewCounts,
  type PublicCrewMember,
} from "@/lib/people/canonicalPeople";
import { buildTeamItemListSchema, buildTeamAboutPageSchema } from "@/lib/schemas/buildTeamSchemas";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import { getWhyJvtoOptimizedImageSrc } from "@/lib/assets/whyJvtoImageVariants";
import { whyLede } from "@/lib/ecosystemContent/whyJvto";

export const revalidate = 3600;

const ROUTE = "/why-jvto/our-team";
const SITE_URL = "https://javavolcano-touroperator.com";

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Bio fields (about/photo_url/highlights) live in the why-jvto content file,
// not the canonical people record — matched by first-name, the same
// convention content/entities/people.json's `code` field uses.
type CrewBio = {
  about?: string | null;
  photo_url?: string | null;
  highlights?: string[];
};

function getCrewBio(
  page: Awaited<ReturnType<typeof loadStaticPage>>,
  code: string,
): CrewBio | null {
  if (!page || page.format !== "structured") return null;
  for (const section of page.sections ?? []) {
    for (const block of (section as any).blocks ?? []) {
      if (block.type !== "crew_grid") continue;
      const item = (block.items as any[]).find(
        (m) => m.name.trim().toLowerCase().split(/\s+/)[0] === code,
      );
      if (item) return item as CrewBio;
    }
  }
  return null;
}

function CrewCard({
  member,
  bio,
}: {
  member: PublicCrewMember;
  bio: CrewBio | null;
}) {
  const photo = bio?.photo_url ? getWhyJvtoOptimizedImageSrc(bio.photo_url) ?? bio.photo_url : member.image?.src;
  return (
    <Link
      href={`/why-jvto/our-team/${member.code}`}
      className="bg-white border border-[#E3E0DA] rounded-[clamp(16px,2vw,24px)] overflow-hidden shadow-sm block hover:border-jvto-orange/40 transition-colors"
    >
      <div className="relative bg-jvto-navy" style={{ aspectRatio: "4/3" }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }}
          aria-hidden="true"
        />
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={member.name} className="absolute inset-0 w-full h-full object-cover object-top z-[1]" loading="lazy" />
        )}
        <span className="absolute top-3 right-3 z-[2] font-mono text-[9px] font-bold uppercase tracking-[0.14em] bg-white/90 text-jvto-navy px-2 py-1 rounded-sm backdrop-blur-sm">
          {member.languages.join(" · ")}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
          {member.role === "guide" ? "Guide" : "Driver"}
        </div>
        <h3 className="font-black text-jvto-navy text-[20px] leading-[1.1]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}>
          {member.name}
        </h3>
        {bio?.about && <p className="text-[#6b7280] text-[13px] font-light leading-[1.6]">{bio.about}</p>}
        <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#8CC63F] mt-1">
          <CheckIcon />
          {member.kta.credentialType}
        </span>
      </div>
    </Link>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const counts = getCrewCounts();
  const page = await loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? `Our Team — ${counts.total} Named JVTO Crew · KTA-Holding Guides & Drivers`;
  const description =
    page?.meta.description ??
    `Meet JVTO's ${counts.total} named crew: ${counts.guides} KTA-holding guides and ${counts.drivers} drivers, all recruited from Bondowoso and Banyuwangi — no freelancers. Leadership by Bripka Agung Sambuko (Tourist Police) and Dr. Ahmad Irwandanu (Medical Officer).`;
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  });
}

export default async function OurTeamPage() {
  const guides = getPublicGuides();
  const drivers = getPublicDrivers();
  const counts = getCrewCounts();
  const page = await loadStaticPage(ROUTE);
  const allCrew = [...guides, ...drivers];
  const sections = page?.sections ?? [];
  const guardianMindset = sections.find((s) => s.id === "guardian-mindset");
  const trustPillars = sections.find((s) => s.id === "trust-pillar-crew-mapping");
  const meetTeam = sections.find((s) => s.id === "meet-our-team");
  const dreamTeam = sections.find((s) => s.id === "dream-team-pairing-how-it-works");
  const operationalPlaybook = sections.find((s) => s.id === "operational-playbook-overview");
  const faqItems = (page?.faq ?? []).map((item) => ({
    q: item.question,
    a: item.answer,
  }));

  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title: page?.meta.title, description: page?.meta.description },
    content: { h1: page?.meta.title ?? "Our Team" },
  };

  const extraSchemas = [buildTeamAboutPageSchema(), buildTeamItemListSchema(allCrew)];
  const sectionBody = (section: (typeof sections)[number] | undefined) =>
    (section?.blocks ?? [])
      .filter((b: any) => b.type === "markdown")
      .map((b: any) => b.body_md)
      .join("\n\n");

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} extraSchemas={extraSchemas} suppressCmsFaq />

      {/* ── Hero — navy ─────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${SITE_URL}/assets/img/hero/home.webp)` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-jvto-navy/60" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · Our Team
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">FILE 004D</span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {page?.meta.title ?? "Local Team, Daily Execution"}
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                {whyLede(page) ||
                  `${counts.guides} guides and ${counts.drivers} drivers — individually named, photographed, and license-linked.`}
              </p>
              {(page?.lede?.length ?? 0) > 1 ? (
                <div className="mt-5 space-y-2 max-w-[58ch]">
                  {page!.lede!.slice(1).map((line) => (
                    <p key={line} className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-white/45">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Guides", value: String(counts.guides) },
                { label: "Drivers", value: String(counts.drivers) },
                { label: "KTA-holding", value: `${counts.total} registered` },
                { label: "Recruited from", value: "Bondowoso · Banyuwangi" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">{label}</span>
                  <strong className="font-mono text-[12px] font-bold text-white">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Ecosystem editorial context ─────────────────────────────── */}
      {(guardianMindset || trustPillars) && (
        <section
          className="bg-[#F6F5F2] py-20 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {guardianMindset && (
                <article className="bg-white border border-[#E3E0DA] rounded-[20px] p-8 jvto-prose">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-4">
                    Team context
                  </span>
                  <h2
                    className="font-black text-jvto-navy mb-5 leading-tight"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
                  >
                    {guardianMindset.title}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(guardianMindset)} />
                </article>
              )}
              {trustPillars && (
                <article className="bg-white border border-[#E3E0DA] rounded-[20px] p-8 jvto-prose">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-4">
                    Trust mapping
                  </span>
                  <h2
                    className="font-black text-jvto-navy mb-5 leading-tight"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
                  >
                    {trustPillars.title}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(trustPillars)} />
                </article>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── §01 Leadership & medical — bg-off ─────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-orange">§ 01</span>
            <h2
              className="font-black text-jvto-navy leading-[1.04]"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}
            >
              Leadership &amp; <span className="text-jvto-orange">medical.</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af] ml-2">Founder · Medical Officer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E3E0DA] rounded-[clamp(18px,2.5vw,28px)] overflow-hidden shadow-sm grid" style={{ gridTemplateColumns: "140px 1fr" }}>
              <div className="relative bg-jvto-navy min-h-[200px]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }} aria-hidden="true" />
              </div>
              <div className="p-7 flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange">Founder · Active Tourist Police</span>
                <h3 className="text-[26px] font-black text-jvto-navy leading-[1.1]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}>
                  Agung &ldquo;Mr. Sam&rdquo; Sambuko
                </h3>
                <p className="text-[#6b7280] text-[14px] font-light leading-[1.6]">
                  Active officer in Ditpamobvit — the National Police directorate for security at vital tourist objects, including Ijen Crater. The operational authority behind every route decision and safety call. Police status independently documented in three press articles and SPRIN documents on file.
                </p>
                <p className="text-jvto-navy font-medium text-[14px]">
                  No other East Java volcano operator is led by an active Tourist Police officer.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E3E0DA] rounded-[clamp(18px,2.5vw,28px)] overflow-hidden shadow-sm grid" style={{ gridTemplateColumns: "140px 1fr" }}>
              <div className="relative bg-jvto-navy min-h-[200px]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }} aria-hidden="true" />
              </div>
              <div className="p-7 flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange">Medical Officer · Ijen Screening</span>
                <h3 className="text-[26px] font-black text-jvto-navy leading-[1.1]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}>
                  Dr. Ahmad Irwandanu
                </h3>
                <p className="text-[#6b7280] text-[14px] font-light leading-[1.6]">
                  Holds a valid SIP (Surat Izin Praktik) issued by Kemenkes RI. When BBKSDA rules require a health certificate for crater access, he issues the QR-verified surat sehat scannable at the gate. Based in Bondowoso, East Java.
                </p>
                <a
                  href="https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-jvto-orange text-[13px] font-semibold border-b border-jvto-orange/40 hover:border-jvto-orange transition-colors self-start"
                >
                  Verify SIP at SatuSehat SDMK →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §02 The guides — bg-white, driven from canonicalPeople.ts + content/ bio ── */}
      <section className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]" style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-orange">§ 02</span>
            <h2 className="font-black text-jvto-navy leading-[1.04]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}>
              The <span className="text-jvto-orange">guides.</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af] ml-2">
              {meetTeam?.title ?? "Meet our team"} · All English-speaking
            </span>
          </div>
          {meetTeam && sectionBody(meetTeam) && (
            <div className="jvto-prose max-w-3xl mb-10">
              <MarkdownRenderer markdown={sectionBody(meetTeam)} />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {guides.map((g) => (
              <CrewCard key={g.code} member={g} bio={getCrewBio(page, g.code)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── §03 The drivers — bg-off ──────────────────────────────── */}
      <section className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]" style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-orange">§ 03</span>
            <h2 className="font-black text-jvto-navy leading-[1.04]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}>
              The <span className="text-jvto-orange">drivers.</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af] ml-2">{counts.drivers} crew · local roster</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {drivers.map((d) => (
              <CrewCard key={d.code} member={d} bio={getCrewBio(page, d.code)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Ecosystem operating notes ───────────────────────────────── */}
      {(dreamTeam || operationalPlaybook) && (
        <section
          className="bg-white py-20 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {dreamTeam && (
                <article className="bg-[#F6F5F2] border border-[#E3E0DA] rounded-[20px] p-8 jvto-prose">
                  <h2
                    className="font-black text-jvto-navy mb-5 leading-tight"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
                  >
                    {dreamTeam.title}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(dreamTeam)} />
                </article>
              )}
              {operationalPlaybook && (
                <article className="bg-[#F6F5F2] border border-[#E3E0DA] rounded-[20px] p-8 jvto-prose">
                  <h2
                    className="font-black text-jvto-navy mb-5 leading-tight"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
                  >
                    {operationalPlaybook.title}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(operationalPlaybook)} />
                </article>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── §04 KTA chain + Local Boys — bg-navy ─────────────────── */}
      <section className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]" style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-start">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8CC63F] block mb-4">HPWKI KTA Chain</span>
              <h2 className="font-black text-white leading-[1.05] mb-6" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}>
                What the credential <span className="text-jvto-orange">proves.</span>
              </h2>
              <p className="text-white/72 text-[16px] font-light leading-[1.65] mb-5">
                A guide or driver holding a JVTO KTA card is a registered member of HPWKI (AHU-0001072.AH.01.07.TAHUN 2024) — a state-recognized association for Ijen crater operators. Membership requires completing volcanic safety training supervised by BBKSDA Jawa Timur, covering SAR protocols and First Aid certification.
              </p>
              <p className="text-white/72 text-[16px] font-light leading-[1.65]">
                The training is documented independently by BBKSDA in their own institutional press record (2024-05-24). All {counts.total} published crew are confirmed HPWKI members through this chain.
              </p>
              <div className="flex flex-wrap gap-2 items-center mt-8 font-mono text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                {[
                  { label: "Guest sees crew", highlight: false },
                  { label: "Crew holds KTA", highlight: false },
                  { label: "Issued by HPWKI", highlight: false },
                  { label: "Verified at AHU", highlight: false },
                  { label: "Training documented by BBKSDA", highlight: true },
                ].map((node, i, arr) => (
                  <span key={node.label} className="flex items-center gap-2">
                    <span
                      className="px-3 py-2 rounded-full"
                      style={
                        node.highlight
                          ? { background: "rgba(140,198,63,0.12)", border: "1px solid #8CC63F", color: "#8CC63F" }
                          : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }
                      }
                    >
                      {node.label}
                    </span>
                    {i < arr.length - 1 && <span className="text-[#8CC63F]">→</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-white/15 rounded-[clamp(16px,2vw,24px)] overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1.5">Local Boys Policy</div>
                <p className="text-white/85 text-[15px] font-light leading-[1.7]">
                  Every guide and driver is recruited from local Bondowoso and Banyuwangi communities — not sourced from freelance marketplaces. INDECON membership validates this commitment.
                </p>
              </div>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Aligned with</div>
                <div className="text-white font-medium text-[14px]">National ecotourism principles (INDECON)</div>
              </div>
              <div className="px-5 py-4">
                <a
                  href="https://www.indecon.id/spotlight-networks/java-volcano-tour-operator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
                >
                  See INDECON listing →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {faqItems.length ? (
        <section
          className="bg-white py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[8]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <Faq
              items={faqItems}
              title="Our Team: Common Questions"
              eyebrow="FAQ"
            />
          </div>
        </section>
      ) : null}

      {/* ── CTA block ─────────────────────────────────────────────── */}
      <section className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[9]" style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="font-black text-white leading-[1.04] mb-4" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px,4vw,56px)" }}>
            Real people. <span className="text-jvto-orange">Real credentials.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/why-jvto/reviews" prefetch={false} className="inline-flex items-center gap-2 bg-jvto-orange text-white font-bold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-jvto-orange/90 transition-colors">
              Read their reviews <ArrowRight />
            </Link>
            <Link href="/why-jvto/the-jvto-difference" prefetch={false} className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-white/5 transition-colors">
              The JVTO Difference
            </Link>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mt-10">
            PT Java Volcano Rendezvous · NIB 1102230032918 · {counts.total} named crew · no freelancers
          </p>
        </div>
      </section>
    </>
  );
}
