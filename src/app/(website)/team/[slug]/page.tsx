import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Globe, ShieldCheck, Users } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import { prisma } from "@/lib/prisma";
import {
  getPersonaByCode,
  buildNamedGuidePersonaSchema,
} from "@/lib/schemas/buildCrewSchemas";

export const revalidate = 3600;

const SITE_URL = "https://javavolcano-touroperator.com";
const ORG_ID = `${SITE_URL}/#organization`;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Source from crew_members (authoritative) not content_pages.
  // This prevents deleted crew (deleted_at IS NOT NULL) from generating stale pages.
  const crew = await prisma.crew_members.findMany({
    where: { deleted_at: null, code: { not: null } },
    select: { code: true },
  });
  return crew
    .filter((m): m is { code: string } => Boolean(m.code))
    .map((m) => ({ slug: m.code as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getContentPage(`/team/${slug}`, "en");
  if (!row) return { title: "Team Member Not Found" };
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? content.h1 ?? slug,
    description: seo.description ?? undefined,
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;

  const [row, crewMember] = await Promise.all([
    getContentPage(`/team/${slug}`, "en"),
    prisma.crew_members
      .findFirst({ where: { code: slug, deleted_at: null } })
      .catch(() => null),
  ]);

  if (!row) notFound();

  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};
  const name = content.h1 ?? seo.title ?? slug;
  const description = seo.description ?? "";
  const photoUrl = (crewMember as any)?.photo_url as string | null ?? null;
  const isGuide = (crewMember as any)?.type === "Guide";

  // Try to use the named persona schema (with specialty signals) first.
  // Fall back to a generic Person schema built from DB data.
  const persona = getPersonaByCode(slug);
  const personSchema = persona
    ? buildNamedGuidePersonaSchema({
        ...persona,
        photoUrl: photoUrl ?? persona.photoUrl,
      })
    : {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/#crew-${slug}`,
        name,
        description,
        url: `${SITE_URL}/team/${slug}`,
        worksFor: { "@id": ORG_ID },
        employmentType: "FULL_TIME",
        jobTitle: isGuide ? "Licensed Tour Guide" : "Professional Tour Driver",
        ...(photoUrl
          ? { image: { "@type": "ImageObject", url: photoUrl, caption: name } }
          : {}),
        ...(isGuide
          ? {
              hasCredential: {
                "@type": "EducationalOccupationalCredential",
                name: "KTA (Kartu Tanda Anggota) — HPWKI Guide Licence",
                credentialCategory: "Indonesian Tour Guide Licence — Ijen Volcano",
                recognizedBy: {
                  "@type": "Organization",
                  name: "HPWKI (Himpunan Pelaku Wisata Khusus Ijen)",
                },
              },
            }
          : {}),
      };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Team", item: `${SITE_URL}/team` },
      { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/team/${slug}` },
    ],
  };

  const pageRow = {
    route: `/team/${slug}`,
    lang: "en",
    seo: row.seo,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[personSchema, breadcrumb]}
        suppressCmsFaq={false}
      />

      {/* Breadcrumb */}
      <nav className="border-b border-slate-800 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/team" className="hover:text-slate-300 transition-colors">Team</Link>
          <span>/</span>
          <span className="text-slate-300">{name}</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-8 transition-colors"
        >
          <ArrowLeft size={12} /> All team members
        </Link>

        {/* Profile header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex-shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users size={28} className="text-slate-600" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isGuide && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={9} /> KTA Licensed Guide
                </span>
              )}
              {!isGuide && (crewMember != null) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  Licensed Driver
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight">{name}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {persona?.jobTitle ?? (isGuide ? "Licensed Tour Guide" : "Tour Driver")}
              {" · "}Java Volcano Tour Operator
            </p>
          </div>
        </div>

        {/* Description — uses DB content (guide's own voice) */}
        {description && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
            <p className="text-slate-300 text-base leading-relaxed italic">
              &ldquo;{description}&rdquo;
            </p>
          </div>
        )}

        {/* Specialty signals (named personas only) */}
        {persona && persona.knowsAbout.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Specialty Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {persona.knowsAbout.map((k) => (
                <span
                  key={k}
                  className="text-xs px-3 py-1 bg-jvto-green/10 border border-jvto-green/20 rounded-full text-jvto-green"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {persona && (
          <div className="mb-8 flex items-center gap-3">
            <Globe size={14} className="text-slate-500 flex-shrink-0" />
            <div className="flex gap-2">
              {persona.knowsLanguage.map((lang) => (
                <span key={lang} className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HPWKI credential badge */}
        {isGuide && (
          <div className="flex items-center gap-3 bg-slate-900 border border-jvto-green/20 rounded-xl p-4 mb-8">
            <ShieldCheck size={20} className="text-jvto-green flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-jvto-green">KTA — HPWKI Guide Licence</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Licensed by HPWKI (Himpunan Pelaku Wisata Khusus Ijen), supervised by BBKSDA Jawa Timur. Required for all Ijen crater guides.
              </div>
            </div>
          </div>
        )}

        {/* Cross-cluster links */}
        <div className="border-t border-slate-800 pt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/why-jvto/our-team" className="text-slate-400 hover:text-white transition-colors">
            Full team overview →
          </Link>
          <Link href="/why-jvto/reviews" className="text-slate-400 hover:text-white transition-colors">
            Reviews that name crew →
          </Link>
          <Link href="/tours" className="text-slate-400 hover:text-jvto-green transition-colors">
            Book a tour →
          </Link>
        </div>
      </div>
    </div>
  );
}
