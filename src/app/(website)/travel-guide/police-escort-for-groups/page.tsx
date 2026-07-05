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
  "For large groups — typically around 18 guests or more — JVTO can coordinate an official traffic police escort on certain road segments, when approved by the relevant Traffic Police (Ditlantas) unit. A formal request process, not a marketing add-on — approval is never guaranteed.";
const defaultH1 = "Traffic Police Escort for Tourist Groups in East Java";

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage("/travel-guide/police-escort-for-groups", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? defaultTitle,
    description: seo.description ?? defaultDescription,
  };
}

const ESCORT_DAY = FIELD_OPERATIONS[5];     // police-escort-arrival-hotel-bondowoso-day
const ESCORT_NIGHT = FIELD_OPERATIONS[6];   // police-escort-arrival-hotel-bondowoso-night
const ESCORT_VEHICLE = FIELD_OPERATIONS[7]; // police-vehicle-support

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
      <main className="flex-1 pt-24 md:pt-36 pb-20 w-full">
        <section className="bg-jvto-navy text-white pb-10 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" className="hover:text-white transition-colors">Travel Guide</Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">Police Escort for Groups</span>
            </nav>
            <div className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              <Shield size={11} /> ≈18 guests+ · request only · approval not guaranteed
            </div>
            <h1
              className="font-black text-3xl md:text-5xl text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {h1}
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-2xl">
              {seo.description ?? defaultDescription}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Photo evidence — escort day + night */}
          <section className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Photo Evidence — Escorted Group Arrivals
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[ESCORT_DAY, ESCORT_NIGHT, ESCORT_VEHICLE].map((img) => (
                <figure key={img.url} className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 leading-snug">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* What a police escort involves */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              What a Traffic Police Escort Is
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                A traffic police escort in East Java is a formal arrangement between JVTO
                and the relevant Traffic Police unit (<strong>Ditlantas</strong>). When
                approved, uniformed traffic police travel in official police vehicles,
                under written orders (SPRIN documentation), to help manage road flow on
                specific segments — particularly high-traffic junctions and toll-road
                exits — for large vehicle convoys.
              </p>
              <p>
                JVTO does not provide escort vehicles itself. The escort, when it occurs,
                is provided by the Indonesian National Police under a formal request
                process — it is not a security detail in the personal-protection sense,
                and it does not bypass speed limits, road rules, or grant preferential
                access to national parks or restricted sites.
              </p>
              <p>
                The escort operates under official police authority, not JVTO instruction.
                Its role ends at the handoff point — for Ijen or Bromo itineraries, BBKSDA
                jurisdiction begins at the crater gate, where the JVTO guide takes over for
                the hiking section.
              </p>
            </div>
          </section>

          {/* How JVTO coordinates */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <ol className="list-decimal pl-5 space-y-2">
                <li>JVTO submits a formal request to the competent Traffic Police unit — including group size, vehicle count, route, and date.</li>
                <li>The request is reviewed against current regulations, unit availability, and route specifications.</li>
                <li>If approved, the escort is issued with written orders (SPRIN documentation). JVTO has existing police-cooperation framework documents on file.</li>
                <li>On the day, uniformed traffic police in official vehicles accompany the convoy on designated road segments — for example, from a toll exit to Bondowoso.</li>
              </ol>
              <p>
                JVTO's founder, Mr. Sam (Agung Sambuko), is an active officer of the
                Indonesian National Police, assigned to Ditpamobvit (Directorate of Vital
                Object Security), East Java. This credential — verifiable on the{" "}
                <Link href="/verify-jvto/police-safety" className="text-jvto-green font-medium hover:underline">
                  Police Safety verification page
                </Link>{" "}
                — gives JVTO an established institutional relationship with police
                coordination frameworks most private operators do not have. It is not a
                shortcut around regulations, but an established protocol within them.
              </p>
              <p>
                No unofficial on-road payments are associated with a JVTO-coordinated
                escort. If anyone requests payment on the road during an escort, report it
                to JVTO immediately.
              </p>
            </div>
          </section>

          {/* Who qualifies */}
          <section className="mb-10 bg-jvto-green/5 border border-jvto-green/20 rounded-xl p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
              Who Qualifies
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                The escort is a coordination service for large vehicle convoys that meet
                the qualifying group size — <strong>typically around 18 guests or more</strong>.
                It is not a default inclusion for smaller groups, and not part of any
                standard JVTO package unless it is written on your E-Voucher.
              </p>
              <p>
                Whether a specific route and date are approved depends on regulations,
                Traffic Police unit availability, and route definitions at the time of
                request. <strong>Approval is not guaranteed.</strong> If your group meets
                the qualifying size, raise the escort request when you contact JVTO for
                your initial quotation — include group size, vehicle count, proposed
                route, and travel dates. If approved, escort costs are listed explicitly
                in your programme and invoice — no post-booking additions.
              </p>
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
                "Coordinated through official channels with the Traffic Police (Ditlantas) unit; JVTO's founder holds an active police commission (Ditpamobvit).",
                "Escort covers designated road segments — typically from a toll exit or the departure point to the hotel or crater gate.",
                "Qualifying size is typically around 18 guests or more; approval is not guaranteed and depends on unit availability and route.",
                "Escort costs, if approved, are listed explicitly on the programme and invoice — no unofficial on-road payments.",
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
