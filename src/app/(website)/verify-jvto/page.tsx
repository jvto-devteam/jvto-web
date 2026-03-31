import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookMarked,
  FileCheck2,
  Newspaper,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import HubSectionFrame from "@/components/website/HubSectionFrame";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

const fallbackSeo = {
  title: "Verify: Forensic Evidence Locker & Legal Documents",
  h1: "Verify JVTO",
  description:
    "Review JVTO's legal identity, police and safety context, press references, and history artifacts before booking or payment.",
};

const categoryCards = [
  {
    title: "Legal",
    copy:
      "Company legality, entity traceability, and the route you should open first if you want to confirm JVTO exists as a real business.",
    href: "/verify-jvto/legal",
    icon: FileCheck2,
  },
  {
    title: "Police & Safety",
    copy:
      "The proof path for police context, safety handling, and why JVTO treats route seriousness differently from generic operators.",
    href: "/verify-jvto/police-safety",
    icon: Shield,
  },
  {
    title: "Press Recognition",
    copy:
      "Third-party references, media context, and the recognition layer that supports the company story from outside the site itself.",
    href: "/verify-jvto/press-recognition",
    icon: Newspaper,
  },
  {
    title: "History Artifacts",
    copy:
      "The continuity layer: artifacts that help show the operation did not appear yesterday and can be traced over time.",
    href: "/verify-jvto/history-artifacts",
    icon: BookMarked,
  },
];

const steps = [
  "Start with legal identity if you want the fastest proof path.",
  "Then move into police and safety context if route seriousness is your main concern.",
  "Use press and history as supporting layers, not replacements for core legality.",
  "After verification, move back into tours or Prepare & Book with better context.",
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/verify-jvto",
    image: "/assets/img/og/verify-jvto.webp",
    imageAlt: seo.h1,
  });
}

export default async function VerifyJvtoPage() {
  const seo = await getPageSeo("/verify-jvto", fallbackSeo);
  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/verify-jvto",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };

  return (
    <div className="bg-white">
      <PageJsonLdCombined pageRow={pageRow as any} />

      <main className="pt-28 pb-20">
        <section className="border-b border-stone-200 bg-stone-950 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Proof Library
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">{seo.h1}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
                {seo.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/verify-jvto/legal"
                  className="inline-flex items-center gap-2 rounded-sm bg-lime-400 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-950 transition hover:bg-lime-300"
                >
                  Open Legal Proof
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/travel-guide"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/5"
                >
                  Open Prepare & Book
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
                How to use this page
              </p>
              <div className="mt-4 space-y-3">
                {steps.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-black/10 p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                    <p className="text-sm leading-6 text-stone-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HubSectionFrame
          eyebrow="Proof categories"
          title="The verify cluster works best when it is read as four clear audit routes."
          description="This page should feel like a proof index, not a marketing block. Each category below moves from core legality outward into supporting context."
          tone="light"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {categoryCards.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[24px] border border-stone-200 bg-stone-50 p-6 transition hover:-translate-y-0.5 hover:border-lime-300 hover:bg-white hover:shadow-[0_20px_40px_rgba(20,28,4,0.08)]"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-white p-3 text-stone-950 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-stone-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.copy}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-950">
                    Open category
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </HubSectionFrame>
      </main>
    </div>
  );
}
