import { type Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import { getActiveCrewMembers } from "@/lib/queries/crewMembers";
import { buildCrewPersonSchema } from "@/lib/schemas/entityGraph";

export const revalidate = 3600;

const SITE_URL = "https://javavolcano-touroperator.com";
const defaultTitle = "JVTO Team Registry — Local Guides & Drivers";
const defaultDescription =
  "Meet JVTO's East Java field team: local guides and drivers connected to the proof-first safety system behind private Bromo, Ijen, and Tumpak Sewu tours.";

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage("/team", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? defaultTitle,
    description: seo.description ?? defaultDescription,
    openGraph: {
      title: seo.title ?? defaultTitle,
      description: seo.description ?? defaultDescription,
      url: `${SITE_URL}/team`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function TeamHubPage() {
  const [row, crewMembers] = await Promise.all([
    getContentPage("/team", "en"),
    getActiveCrewMembers().catch(() => []),
  ]);

  const teamItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/team#crew-index`,
    name: "JVTO Field Crew — East Java",
    description:
      "Complete registry of JVTO's active East Java field crew: licensed guides and tour drivers operating on Bromo, Ijen, and Tumpak Sewu tours.",
    numberOfItems: crewMembers.length,
    itemListElement: crewMembers.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@id": `${SITE_URL}/#crew-${m.code}`,
        "@type": "Person",
        name: m.name,
        url: `${SITE_URL}/team/${m.code}`,
      },
    })),
  };

  const crewSchemas = crewMembers.map((m) => buildCrewPersonSchema(m));
  const extraSchemas = [teamItemList, ...crewSchemas];

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
        route: "/team",
        lang: "en",
        seo: { title: defaultTitle, description: defaultDescription },
        content: { h1: "JVTO Field Crew" },
      };

  const guides = crewMembers.filter((m) => m.type === "Guide");
  const drivers = crewMembers.filter((m) => m.type !== "Guide");

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={extraSchemas}
        suppressCmsFaq={false}
      />

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
            <ShieldCheck size={12} /> HPWKI KTA-Licensed Crew
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Local field crew behind<br />
            <span className="text-jvto-green">JVTO's private volcano operations.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            {crewMembers.length > 0 ? crewMembers.length : "11"}+ permanent crew. Every guide holds a KTA licence
            from HPWKI, supervised by BBKSDA Jawa Timur. No freelancers — same faces your reviews mention.
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

        {/* Guides section */}
        {guides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">
              Licensed Guides ({guides.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {guides.map((m) => (
                <Link
                  key={m.code}
                  href={`/team/${m.code}`}
                  className="group flex flex-col items-center text-center p-4 rounded-xl border border-slate-800 hover:border-jvto-green/40 hover:bg-slate-900 transition-all"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 mb-3 ring-2 ring-transparent group-hover:ring-jvto-green/30 transition-all">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users size={20} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-jvto-green transition-colors">
                    {m.name}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 size={9} className="text-jvto-green" />
                    <span className="text-[10px] text-slate-500">KTA Licensed</span>
                  </div>
                  <span className="text-[10px] text-slate-600 mt-0.5 group-hover:text-jvto-green/60 transition-colors">
                    View profile →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Drivers section */}
        {drivers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">
              Drivers ({drivers.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {drivers.map((m) => (
                <Link
                  key={m.code}
                  href={`/team/${m.code}`}
                  className="group flex flex-col items-center text-center p-4 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-slate-900 transition-all"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 mb-3">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users size={20} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-slate-300 transition-colors">
                    {m.name}
                  </span>
                  <span className="text-[10px] text-slate-600 mt-1">Licensed Driver</span>
                  <span className="text-[10px] text-slate-600 mt-0.5 group-hover:text-slate-500 transition-colors">
                    View profile →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer cross-links */}
        <div className="border-t border-slate-800 pt-8 flex flex-wrap gap-4">
          <Link href="/why-jvto/our-team" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Team trust overview
          </Link>
          <Link href="/travel-guide/safety-on-tours" className="text-sm text-slate-400 hover:text-white transition-colors">
            Safety protocols →
          </Link>
          <Link href="/verify-jvto/police-safety" className="text-sm text-slate-400 hover:text-white transition-colors">
            Police credentials →
          </Link>
        </div>
      </div>
    </div>
  );
}
