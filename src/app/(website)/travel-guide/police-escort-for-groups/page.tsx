import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Shield, ExternalLink } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import Sidebar from "../sidebar";
import { FIELD_OPERATIONS } from "@/lib/imageAssets";

export const revalidate = 86400;

const defaultTitle = "Traffic Police Escort for Tourist Groups in East Java | JVTO";
const defaultDescription =
  "How official traffic police escorts work for larger tourist groups in East Java. When it is appropriate, how JVTO coordinates it, and what it involves.";
const defaultH1 = "Traffic Police Escort for Tourist Groups in East Java";

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage("/travel-guide/police-escort-for-groups", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? defaultTitle,
    description: seo.description ?? defaultDescription,
  };
}

const ESCORT_DAY = FIELD_OPERATIONS[5];   // police-escort-arrival-hotel-bondowoso-day
const ESCORT_NIGHT = FIELD_OPERATIONS[6]; // police-escort-arrival-hotel-bondowoso-night

export default async function PoliceEscortPage() {
  const row = await getContentPage("/travel-guide/police-escort-for-groups", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  const content = (row?.content as Record<string, any> | null) ?? {};
  const h1 = content.h1 ?? defaultH1;

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
        route: "/travel-guide/police-escort-for-groups",
        lang: "en",
        seo: { title: defaultTitle, description: defaultDescription },
        content: { h1 },
      };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[]}
        suppressCmsFaq={false}
      />
      <main className="pt-24 w-full">
        {/* Breadcrumb */}
        <nav className="border-b border-slate-200 px-6 py-3 text-xs text-slate-500">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/travel-guide" className="hover:text-slate-700 transition-colors">Travel Guide</Link>
            <span>/</span>
            <span className="text-slate-700">Police Escort for Groups</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2.5 py-1 rounded-full mb-4">
              <Shield size={11} /> Available on request — not auto-included
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
              {h1}
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
              {seo.description ?? defaultDescription}
            </p>
          </div>

          {/* Photo evidence — escort day + night */}
          <section className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Photo Evidence — Escorted Group Arrivals
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <figure className="rounded-xl overflow-hidden border border-slate-200">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={ESCORT_DAY.url}
                    alt={ESCORT_DAY.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 leading-snug">
                  {ESCORT_DAY.caption}
                </figcaption>
              </figure>
              <figure className="rounded-xl overflow-hidden border border-slate-200">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={ESCORT_NIGHT.url}
                    alt={ESCORT_NIGHT.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 leading-snug">
                  {ESCORT_NIGHT.caption}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Key facts */}
          <section className="mb-10 bg-slate-50 rounded-xl border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">
              Key Facts
            </h2>
            <ul className="space-y-2.5">
              {[
                "Available on request for large groups — not automatically included in standard packages.",
                "Coordinated through official channels: JVTO's founder holds an active Tourist Police (POLPAR) commission.",
                "Escort covers the transfer leg — typically from the departure point to the hotel or crater gate.",
                "Groups of 10+ pax typically qualify; confirm at booking.",
                "No additional charge for the escort vehicle — it is arranged through the police unit, not a private service.",
              ].map((fact, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-jvto-green mt-0.5 shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cross-links */}
          <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/verify-jvto/police-safety" className="text-jvto-green hover:underline font-medium">
              Police safety credentials →
            </Link>
            <Link href="/travel-guide/safety-on-tours" className="text-slate-500 hover:text-slate-800 transition-colors">
              Safety on tours →
            </Link>
            <Link href="/tours" className="text-slate-500 hover:text-slate-800 transition-colors">
              Browse private tours →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
