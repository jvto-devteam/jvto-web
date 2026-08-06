import { type Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, CheckCircle2, ShieldCheck, Stethoscope, Star } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  getPublicGuides,
  getPublicDrivers,
  getCrewCounts,
  getPublicLeadership,
  getPublicMedicalPartner,
  getDisclaimer,
  type PublicCrewMember,
} from "@/lib/people/canonicalPeople";
import { buildTeamFaqs } from "@/lib/people/teamFaqs";
import {
  buildTeamAboutPageSchema,
  buildTeamItemListSchema,
  buildTeamFaqSchema,
} from "@/lib/schemas/buildTeamSchemas";

export const revalidate = 3600;

const SITE_URL = "https://javavolcano-touroperator.com";
const TITLE = "JVTO Field Team — Licensed Guides, Drivers, Leadership & Medical Screening";
const DESCRIPTION =
  "Meet JVTO's directly-managed East Java field team: 11 HPWKI KTA-holding guides and drivers, plus founder-led operations and a licensed doctor coordinating mandatory Ijen health screening.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/team` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/team`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  };
}

function CrewCard({ member, accent }: { member: PublicCrewMember; accent: boolean }) {
  return (
    <Link
      href={`/team/${member.code}`}
      className={`group flex flex-col items-center text-center p-4 rounded-xl border border-slate-800 transition-all hover:bg-slate-900 ${
        accent ? "hover:border-jvto-green/40" : "hover:border-slate-600"
      }`}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 mb-3 ring-2 ring-transparent group-hover:ring-jvto-green/30 transition-all">
        {member.image?.src ? (
          <img src={member.image.src} alt={member.image.alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users size={20} className="text-slate-600" />
          </div>
        )}
      </div>
      <span className="text-sm font-bold text-white group-hover:text-jvto-green transition-colors">{member.name}</span>
      <div className="flex items-center gap-1 mt-1">
        <CheckCircle2 size={9} className="text-jvto-green" />
        <span className="text-[10px] text-slate-500">KTA member</span>
      </div>
      <span className="text-[10px] text-slate-600 mt-0.5 group-hover:text-jvto-green/60 transition-colors">
        View profile →
      </span>
    </Link>
  );
}

export default function TeamHubPage() {
  const guides = getPublicGuides();
  const drivers = getPublicDrivers();
  const counts = getCrewCounts();
  const leadership = getPublicLeadership();
  const medical = getPublicMedicalPartner();
  const disclaimer = getDisclaimer();
  const faqs = buildTeamFaqs();

  const pageRow = {
    route: "/team",
    lang: "en",
    seo: { title: TITLE, description: DESCRIPTION },
    content: {},
  };

  const extraSchemas = [
    buildTeamAboutPageSchema(),
    buildTeamItemListSchema([...guides, ...drivers]),
    buildTeamFaqSchema(faqs),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <PageJsonLdCombined pageRow={pageRow as any} extraSchemas={extraSchemas} suppressCmsFaq={true} />

      {/* Breadcrumb */}
      <nav className="border-b border-slate-800 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-300">Team</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2.5 py-1 rounded-full mb-5">
            <ShieldCheck size={12} /> HPWKI KTA-holding crew
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            The directly-managed field team behind<br />
            <span className="text-jvto-green">JVTO's private volcano operations.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            {counts.total} active crew — {counts.guides} guides, {counts.drivers} drivers. Every crew member holds a KTA
            (an HPWKI membership credential, not a government licence), supervised by BBKSDA Jawa Timur. {disclaimer.directManagedCrew}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/why-jvto/our-team"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-jvto-green border border-jvto-green/30 rounded-lg px-4 py-2 hover:bg-jvto-green/10 transition-colors"
            >
              Why trust this team <ArrowRight size={14} />
            </Link>
            <Link
              href="/why-jvto/reviews"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 border border-slate-700 rounded-lg px-4 py-2 hover:border-slate-500 transition-colors"
            >
              See reviews that name guides
            </Link>
          </div>
        </div>

        {/* Guides */}
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">Licensed Guides ({guides.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {guides.map((m) => <CrewCard key={m.code} member={m} accent />)}
          </div>
        </section>

        {/* Drivers */}
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">Drivers ({drivers.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {drivers.map((m) => <CrewCard key={m.code} member={m} accent={false} />)}
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">Operations &amp; Safety Leadership</h2>
          <div className="space-y-4">
            {leadership.map((l) => (
              <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-black">{l.name}</h3>
                  {(l.roles ?? []).map((r) => (
                    <span key={r} className="text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2 py-0.5 rounded-full">{r}</span>
                  ))}
                </div>
                {l.background && <p className="text-slate-300 text-sm leading-relaxed">{l.background}</p>}
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{disclaimer.policeIndependence}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Medical screening partner */}
        {medical?.name && (
          <section className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">Mandatory Ijen Health Screening</h2>
            <div className="bg-slate-900 border border-jvto-green/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Stethoscope size={20} className="text-jvto-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-black">{medical.name}</h3>
                  {medical.jobTitle && <p className="text-jvto-green text-xs font-bold mt-0.5">{medical.jobTitle}</p>}
                  {medical.role && <p className="text-slate-300 text-sm leading-relaxed mt-2">{medical.role}</p>}
                  {medical.credentials && (
                    <ul className="text-xs text-slate-400 mt-3 space-y-1">
                      {medical.credentials.str && (
                        <li>STR {medical.credentials.str}{medical.credentials.strValidTo ? ` — valid to ${medical.credentials.strValidTo}` : ""}</li>
                      )}
                      {medical.credentials.sip && <li>SIP {medical.credentials.sip}</li>}
                      {medical.credentials.facility && <li>{medical.credentials.facility}</li>}
                      {medical.credentials.verifiableVia && <li>Publicly verifiable via {medical.credentials.verifiableVia}</li>}
                    </ul>
                  )}
                  {medical.claimBoundary && <p className="text-slate-500 text-xs mt-3 leading-relaxed">{medical.claimBoundary}</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ (derived from the canonical people record) */}
        <section className="mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">Team FAQ</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-start gap-2">
                  <Star size={12} className="text-jvto-green mt-1 flex-shrink-0" /> {f.question}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer cross-links */}
        <div className="border-t border-slate-800 pt-8 flex flex-wrap gap-4">
          <Link href="/why-jvto/our-team" className="text-sm text-slate-400 hover:text-white transition-colors">← Team trust overview</Link>
          <Link href="/travel-guide/safety-on-tours" className="text-sm text-slate-400 hover:text-white transition-colors">Safety protocols →</Link>
          <Link href="/verify-jvto/police-safety" className="text-sm text-slate-400 hover:text-white transition-colors">Police credentials →</Link>
        </div>
      </div>
    </div>
  );
}
