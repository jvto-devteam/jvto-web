import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Shield } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Sidebar from "../sidebar";
import { FIELD_OPERATIONS } from "@/lib/imageAssets";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import { loadStaticPage, staticRouteCanonical, type StaticPage } from "@/lib/static-content";
import { KeyFactSchema, parseGrid, type KeyFact } from "@/lib/content/travelGuideGrids";

// PACKAGE 04b (2026-08-06): narrative + SEO come from the static-content SSOT
// (content/pages/travel-guide/police-escort-for-groups.json). The repository fallback copy
// is the canonical content (owner decision: do not wait for a content_pages export). The
// photo-evidence grid stays TSX chrome (image assets). No getContentPage / content_pages.

const ROUTE = "/travel-guide/police-escort-for-groups";

export const revalidate = 86400;

type Sec = NonNullable<StaticPage["sections"]>[number] & Record<string, unknown>;

function findSection(page: StaticPage, id: string): Sec | undefined {
  return page.sections?.find((s) => s.id === id) as Sec | undefined;
}
function sectionBody(sec: Sec | undefined): string {
  return typeof sec?.body_md === "string" ? sec.body_md : "";
}
function sectionTitle(sec: Sec | undefined): string {
  return typeof sec?.title === "string" ? sec.title : "";
}
function sectionGrid(sec: Sec | undefined, role: string): Record<string, unknown>[] {
  const block = (sec?.blocks ?? []).find(
    (b) => b.type === "grid" && (b as { role?: string }).role === role,
  );
  return block ? ((block as { items?: Record<string, unknown>[] }).items ?? []) : [];
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

const ESCORT_DAY = FIELD_OPERATIONS[5]; // police-escort-arrival-hotel-bondowoso-day
const ESCORT_NIGHT = FIELD_OPERATIONS[6]; // police-escort-arrival-hotel-bondowoso-night
const ESCORT_VEHICLE = FIELD_OPERATIONS[7]; // police-vehicle-support

export default async function PoliceEscortPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") {
    const { notFound } = await import("next/navigation");
    return notFound();
  }

  const h1 = page.meta.title;
  const whatIs = findSection(page, "what-is");
  const howItWorks = findSection(page, "how-it-works");
  const whoQualifies = findSection(page, "who-qualifies");
  const keyFactsSec = findSection(page, "key-facts");
  const keyFacts = parseGrid(KeyFactSchema, sectionGrid(keyFactsSec, "key-facts"), "key-facts");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined pageRow={staticPageRow(page) as any} extraSchemas={[]} suppressCmsFaq />
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
              {page.meta.description}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Photo evidence — escort day + night (image assets, chrome) */}
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
            <h2 className="text-lg font-bold text-slate-900 mb-4">{sectionTitle(whatIs)}</h2>
            <MarkdownRendererTravelGuide markdown={sectionBody(whatIs)} />
          </section>

          {/* How JVTO coordinates */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{sectionTitle(howItWorks)}</h2>
            <MarkdownRendererTravelGuide markdown={sectionBody(howItWorks)} />
          </section>

          {/* Who qualifies */}
          <section className="mb-10 bg-jvto-green/5 border border-jvto-green/20 rounded-xl p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
              {sectionTitle(whoQualifies)}
            </h2>
            <MarkdownRendererTravelGuide markdown={sectionBody(whoQualifies)} />
          </section>

          {/* Key facts */}
          <section className="mb-10 bg-slate-50 rounded-xl border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">
              {sectionTitle(keyFactsSec)}
            </h2>
            <ul className="space-y-2.5">
              {keyFacts.map((fact: KeyFact, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-jvto-green mt-0.5 shrink-0" />
                  <span>{fact.text}</span>
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
