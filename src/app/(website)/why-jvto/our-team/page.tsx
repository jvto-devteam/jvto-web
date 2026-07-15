import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import { getContentPage } from "@/lib/content/getContentPage";
import { getActiveCrewMembers } from "@/lib/queries/crewMembers";
import { buildCrewPersonSchema } from "@/lib/schemas/entityGraph";
import {
  buildAllNamedGuideSchemas,
  buildNamedGuideItemListSchema,
  NAMED_GUIDE_PERSONAS,
} from "@/lib/schemas/buildCrewSchemas";

export const revalidate = 3600;

const SITE_URL = "https://javavolcano-touroperator.com";

const defaultTitle = "Our Team — 14 Named JVTO Crew · KTA-Licensed Guides & Drivers";
const defaultDescription =
  "Meet JVTO's 14 named crew: 7 KTA-licensed guides and 7 drivers, all recruited from Bondowoso and Banyuwangi — no freelancers. Leadership by Bripka Agung Sambuko (Tourist Police) and Dr. Ahmad Irwandanu (Medical Officer).";

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

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const GUIDES = [
  {
    name: "Anjas",
    role: "Guide · KTA-G-2024-006",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768270423657-690185912-anjas.png`,
    bio: "Kawah Ijen & multi-day packages. Volcanic photography, astrophotography, cultural heritage, terrain navigation. Named in reviews as \"phenomenal guide\" and \"best guide anywhere.\"",
    kta: "HPWKI verified",
    pending: false,
  },
  {
    name: "Taufik",
    role: "Guide · KTA-G-2024-007",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768228083285-919198019-taufik_1_.png`,
    bio: "Kawah Ijen & family groups. Thorough pre-activity briefings, logistics, flexible timing, family-friendly. Completed Ijen night hike with 12- and 15-year-old children.",
    kta: "HPWKI verified",
    pending: false,
  },
  {
    name: "Rendi",
    role: "Guide · KTA-G-2024-002",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768228514527-518051332-rendi.png`,
    bio: "Kawah Ijen & steep-terrain routes. Expedition safety, mountain rescue, first aid, crater safety procedures. \"When we went down the steep crater, he held our hands to prevent us from falling.\"",
    kta: "HPWKI verified",
    pending: false,
  },
  {
    name: "Kiki",
    role: "Guide · KTA-G-2024-008",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768271545598-834784538-kiki.png`,
    bio: "Kawah Ijen & multi-day packages. Communication, photography, logistics, safety-first. Consistent praise across multi-activity tours for communication and accommodating requests.",
    kta: "HPWKI verified",
    pending: false,
  },
  {
    name: "Gufron",
    role: "Guide · KTA-G-2024-001",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768225567764-405955176-gufron.png`,
    bio: "Kawah Ijen & multi-day packages. Volcano photography, geology, cultural heritage, crater safety. \"Always willing to help you get your best photo.\"",
    kta: "HPWKI verified",
    pending: false,
  },
  {
    name: "Fauzi",
    role: "Guide · KTA-G-2024-010",
    langs: "ID",
    img: `${SITE_URL}/uploads/1768226003889-338819579-fauzi.png`,
    bio: "Multi-day East Java: Ijen, Papuma, Tumpak Sewu, Bromo. Attentiveness, guest comfort, photo documentation, safety-first. \"Always went the extra mile to help us.\"",
    kta: "KTA registered",
    pending: false,
  },
  {
    name: "Boy",
    nameSuffix: "(Ahboy)",
    role: "Guide · KTA-G-2024-004",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768228191022-893381041-boy.png`,
    bio: "Kawah Ijen & multi-day packages. Ijen specialist knowledge, safety focus, logistics, equipment readiness. \"A phenomenal Ijen guide — knowledgeable, went out of his way for safety.\"",
    kta: "KTA registered",
    pending: false,
  },
] as const;

const DRIVERS = [
  {
    name: "Yandi",
    role: "Driver · KTA-D-2024-003",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768270364125-144711646-yandi.png`,
    bio: "\"Our driver Yandi was really reliable and friendly. He briefed us on what to expect.\"",
    kta: "KTA registered",
    pending: false,
  },
  {
    name: "Fredi",
    role: "Driver · KTA-D-2024-005",
    langs: "EN / ID",
    img: `${SITE_URL}/uploads/1768276791622-262250680-freddy.png`,
    bio: "\"Always on time no matter what time of the day. Exceptional driving skills.\" Named as \"the best driver\" alongside Gufron.",
    kta: "KTA registered",
    pending: false,
  },
  {
    name: "Holili",
    role: "Driver · KTA-D-2024-009",
    langs: "ID",
    img: `${SITE_URL}/uploads/1768277053384-470130286-holili.jpg`,
    bio: "Confirmed KTA-credentialed driver. Named in reviews paired with Taufik and Gufron on multi-day tours.",
    kta: "KTA registered",
    pending: false,
  },
  {
    name: "Joyo",
    role: "Driver · KTA-D-2024-011",
    langs: "ID",
    img: `${SITE_URL}/uploads/1768277336049-911840775-joyo.png`,
    bio: "Confirmed KTA-credentialed driver. Named in reviews as an experienced operator.",
    kta: "KTA registered",
    pending: false,
  },
  {
    name: "Yusuf",
    role: "Driver · active",
    langs: "ID",
    img: null,
    bio: "Confirmed active driver in the JVTO system. KTA code not yet recorded.",
    kta: "KTA pending verification",
    pending: true,
  },
  {
    name: "Dika",
    role: "Driver · active",
    langs: "ID",
    img: null,
    bio: "Confirmed active driver. Named in guest reviews as caring and informative. KTA code not yet recorded.",
    kta: "KTA pending verification",
    pending: true,
  },
  {
    name: "Pras",
    role: "Driver · active",
    langs: "EN / ID",
    img: null,
    bio: "Confirmed active driver. Strong English noted in JVTO crew profile. KTA code not yet recorded.",
    kta: "KTA pending verification",
    pending: true,
  },
] as const;

export default async function OurTeamPage() {
  const [row, crewMembers] = await Promise.all([
    getContentPage("/why-jvto/our-team", "en"),
    getActiveCrewMembers().catch(() => []),
  ]);

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
      <PageJsonLdCombined pageRow={pageRow as any} extraSchemas={extraSchemas} suppressCmsFaq={false} />

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
                14 named crew.{" "}
                <em className="not-italic text-white/90">No freelancers.</em>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                7 guides and 7 drivers — individually named, photographed, and license-linked. Five guides hold HPWKI KTA credentials from BBKSDA-supervised volcanic safety training.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Guides", value: "7" },
                { label: "Drivers", value: "7" },
                { label: "KTA-credentialed", value: "11 registered" },
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

      {/* ── §01 Leadership & medical — bg-off ─────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
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

          {/* Lead grid — 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agung card */}
            <div className="bg-white border border-[#E3E0DA] rounded-[clamp(18px,2.5vw,28px)] overflow-hidden shadow-sm grid" style={{ gridTemplateColumns: "140px 1fr" }}>
              <div className="relative bg-jvto-navy min-h-[200px]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }} aria-hidden="true" />
              </div>
              <div className="p-7 flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange">Founder · Active Tourist Police</span>
                <h3
                  className="text-[26px] font-black text-jvto-navy leading-[1.1]"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
                >
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

            {/* Dr. Ahmad card */}
            <div className="bg-white border border-[#E3E0DA] rounded-[clamp(18px,2.5vw,28px)] overflow-hidden shadow-sm grid" style={{ gridTemplateColumns: "140px 1fr" }}>
              <div className="relative bg-jvto-navy min-h-[200px]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }} aria-hidden="true" />
              </div>
              <div className="p-7 flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange">Medical Officer · Ijen Screening</span>
                <h3
                  className="text-[26px] font-black text-jvto-navy leading-[1.1]"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
                >
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

      {/* ── §02 The guides — bg-white ─────────────────────────────── */}
      <section
        className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-orange">§ 02</span>
            <h2
              className="font-black text-jvto-navy leading-[1.04]"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}
            >
              The <span className="text-jvto-orange">guides.</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af] ml-2">All English-speaking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {GUIDES.map((guide) => (
              <div key={guide.name} className="bg-white border border-[#E3E0DA] rounded-[clamp(16px,2vw,24px)] overflow-hidden shadow-sm">
                {/* Photo */}
                <div className="relative bg-jvto-navy" style={{ aspectRatio: "4/3" }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }} aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={guide.img}
                    alt={guide.name}
                    className="absolute inset-0 w-full h-full object-cover object-top z-[1]"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 z-[2] font-mono text-[9px] font-bold uppercase tracking-[0.14em] bg-white/90 text-jvto-navy px-2 py-1 rounded-sm backdrop-blur-sm">
                    {guide.langs}
                  </span>
                </div>
                {/* Body */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">{guide.role}</div>
                  <h3 className="font-black text-jvto-navy text-[20px] leading-[1.1]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}>
                    {guide.name}
                    {"nameSuffix" in guide && (
                      <span className="text-[#9ca3af] font-normal text-[15px] ml-1.5">{guide.nameSuffix}</span>
                    )}
                  </h3>
                  <p className="text-[#6b7280] text-[13px] font-light leading-[1.6]">{guide.bio}</p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#8CC63F] mt-1">
                    <CheckIcon />
                    {guide.kta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §03 The drivers — bg-off ──────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-orange">§ 03</span>
            <h2
              className="font-black text-jvto-navy leading-[1.04]"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}
            >
              The <span className="text-jvto-orange">drivers.</span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af] ml-2">7 crew · local roster</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {DRIVERS.map((driver) => (
              <div key={driver.name} className="bg-white border border-[#E3E0DA] rounded-[clamp(16px,2vw,24px)] overflow-hidden shadow-sm">
                {/* Photo */}
                <div className="relative bg-jvto-navy" style={{ aspectRatio: "4/3" }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)" }} aria-hidden="true" />
                  {driver.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={driver.img}
                      alt={driver.name}
                      className="absolute inset-0 w-full h-full object-cover object-top z-[1]"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute top-3 right-3 z-[2] font-mono text-[9px] font-bold uppercase tracking-[0.14em] bg-white/90 text-jvto-navy px-2 py-1 rounded-sm backdrop-blur-sm">
                    {driver.langs}
                  </span>
                </div>
                {/* Body */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">{driver.role}</div>
                  <h3 className="font-black text-jvto-navy text-[20px] leading-[1.1]" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}>
                    {driver.name}
                  </h3>
                  <p className="text-[#6b7280] text-[13px] font-light leading-[1.6]">{driver.bio}</p>
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] mt-1"
                    style={{ color: driver.pending ? "#9ca3af" : "#8CC63F" }}
                  >
                    {!driver.pending && <CheckIcon />}
                    {driver.kta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9ca3af] leading-relaxed mt-8 max-w-[80ch]">
            KTA registration covers 11 members; 3 additional drivers (Yusuf, Dika, Pras) are confirmed active in our system with KTA codes pending verification.
          </p>
        </div>
      </section>

      {/* ── §04 KTA chain + Local Boys — bg-navy ─────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-start">
            {/* Left — KTA chain */}
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8CC63F] block mb-4">HPWKI KTA Chain</span>
              <h2
                className="font-black text-white leading-[1.05] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px,3.6vw,44px)" }}
              >
                What the credential <span className="text-jvto-orange">proves.</span>
              </h2>
              <p className="text-white/72 text-[16px] font-light leading-[1.65] mb-5">
                A guide holding a JVTO KTA card is a registered member of HPWKI (AHU-0001072.AH.01.07.TAHUN 2024) — a state-recognized association for Ijen crater operators. Membership requires completing volcanic safety training supervised by BBKSDA Jawa Timur, covering SAR protocols and First Aid certification.
              </p>
              <p className="text-white/72 text-[16px] font-light leading-[1.65]">
                The training is documented independently by BBKSDA in their own institutional press record (2024-05-24). All 5 KTA-confirmed guides — Anjas, Taufik, Rendi, Kiki, Gufron — are confirmed HPWKI members through this chain.
              </p>
              {/* Trust chain visualization */}
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
                      style={node.highlight
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

            {/* Right — Local Boys data-box */}
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

      {/* ── CTA block ─────────────────────────────────────────────── */}
      <section className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]" style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.04] mb-4"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px,4vw,56px)" }}
          >
            Real people. <span className="text-jvto-orange">Real credentials.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/why-jvto/reviews"
              prefetch={false}
              className="inline-flex items-center gap-2 bg-jvto-orange text-white font-bold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-jvto-orange/90 transition-colors"
            >
              Read their reviews <ArrowRight />
            </Link>
            <Link
              href="/why-jvto/the-jvto-difference"
              prefetch={false}
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-white/5 transition-colors"
            >
              The JVTO Difference
            </Link>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mt-10">
            PT Java Volcano Rendezvous · NIB 1102230032918 · 14 named crew · no freelancers
          </p>
        </div>
      </section>
    </>
  );
}
