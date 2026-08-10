import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Globe, ShieldCheck, Users } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicCrewByCode, getPublicCrewCodes } from "@/lib/people/canonicalPeople";
import { buildTeamProfileSchema, crewJobTitle } from "@/lib/schemas/buildTeamSchemas";
import { staticRouteCanonical } from "@/lib/static-content";

export const revalidate = 3600;
// Only the 11 published crew codes are valid routes; any other slug (including
// crew.unpublished — yusuf/dika/pras) 404s without rendering.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublicCrewCodes().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getPublicCrewByCode(slug);
  if (!member) return { title: "Team Member Not Found" };
  const jobTitle = crewJobTitle(member.role);
  const title = `${member.name} — JVTO ${jobTitle}`;
  const description = `${member.name} is a KTA-holding JVTO ${jobTitle.toLowerCase()} for East Java volcano tours (Bromo, Ijen, Tumpak Sewu).`;
  return {
    title,
    description,
    alternates: { canonical: staticRouteCanonical(`/team/${slug}`) },
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = getPublicCrewByCode(slug);
  if (!member) notFound();

  const isGuide = member.role === "guide";
  const jobTitle = crewJobTitle(member.role);

  const pageRow = {
    route: `/team/${slug}`,
    lang: "en",
    seo: { title: `${member.name} — JVTO ${jobTitle}` },
    content: {},
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[buildTeamProfileSchema(member)]}
        suppressCmsFaq={true}
      />

      {/* Breadcrumb */}
      <nav className="border-b border-slate-800 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/team" className="hover:text-slate-300 transition-colors">Team</Link>
          <span>/</span>
          <span className="text-slate-300">{member.name}</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-8 transition-colors"
        >
          <ArrowLeft size={12} /> All team members
        </Link>

        {/* Profile header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex-shrink-0">
            {member.image?.src ? (
              <img src={member.image.src} alt={member.image.alt} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users size={28} className="text-slate-600" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={9} /> KTA member — {member.kta.credentialState}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{member.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{jobTitle}{" · "}Java Volcano Tour Operator</p>
          </div>
        </div>

        {/* Specialty areas (from the canonical record) */}
        {member.specialties.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Specialty Areas</h2>
            <div className="flex flex-wrap gap-2">
              {member.specialties.map((s) => (
                <span key={s} className="text-xs px-3 py-1 bg-jvto-green/10 border border-jvto-green/20 rounded-full text-jvto-green">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {member.languages.length > 0 && (
          <div className="mb-8 flex items-center gap-3">
            <Globe size={14} className="text-slate-500 flex-shrink-0" />
            <div className="flex gap-2">
              {member.languages.map((lang) => (
                <span key={lang} className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400">{lang}</span>
              ))}
            </div>
          </div>
        )}

        {/* KTA membership credential */}
        <div className="flex items-center gap-3 bg-slate-900 border border-jvto-green/20 rounded-xl p-4 mb-8">
          <ShieldCheck size={20} className="text-jvto-green flex-shrink-0" />
          <div>
            <div className="text-sm font-bold text-jvto-green">{member.kta.credentialType}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Issued by {member.kta.issuer}, supervised by BBKSDA Jawa Timur. This is a membership credential, not a government licence.
            </div>
          </div>
        </div>

        {/* Cross-cluster links */}
        <div className="border-t border-slate-800 pt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/why-jvto/our-team" className="text-slate-400 hover:text-white transition-colors">Full team overview →</Link>
          <Link href="/why-jvto/reviews" className="text-slate-400 hover:text-white transition-colors">Reviews that name crew →</Link>
          <Link href="/tours" className="text-slate-400 hover:text-jvto-green transition-colors">Book a tour →</Link>
        </div>
      </div>
    </div>
  );
}
