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
import {
  extractHubIntro,
  verifyJvtoHubDoctrine,
} from "@/lib/trust/trustSupportDoctrine";

const iconMap = {
  file: FileCheck2,
  shield: Shield,
  news: Newspaper,
  book: BookMarked,
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto", verifyJvtoHubDoctrine.fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/verify-jvto",
    image: "/assets/img/og/verify-jvto.webp",
    imageAlt: seo.h1,
  });
}

export default async function VerifyJvtoPage() {
  const seo = await getPageSeo("/verify-jvto", verifyJvtoHubDoctrine.fallbackSeo);
  const content = (seo.row?.content as Record<string, unknown> | null) ?? null;
  const intro = extractHubIntro(content, seo.description);
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
                {verifyJvtoHubDoctrine.eyebrow}
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">{seo.h1}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
                {intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {verifyJvtoHubDoctrine.actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={
                      action.variant === "primary"
                        ? "inline-flex items-center gap-2 rounded-sm bg-lime-400 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-950 transition hover:bg-lime-300"
                        : "inline-flex items-center gap-2 rounded-sm border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/5"
                    }
                  >
                    {action.label}
                    {action.variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
                How to use this page
              </p>
              <div className="mt-4 space-y-3">
                {verifyJvtoHubDoctrine.steps.map((item) => (
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
            {verifyJvtoHubDoctrine.categoryCards.map((item) => {
              const Icon = iconMap[item.icon];
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

        <section className="border-t border-stone-200 bg-stone-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:py-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                After Verification
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">
                Proof is there to reduce doubt, then send you back into the route decision.
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-600">
                Verify first if you need to. Once the operator checks out, move back into tours or
                preparation so the decision keeps moving toward the right route.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                Read next
              </p>
              <div className="mt-4 space-y-3">
                {verifyJvtoHubDoctrine.readNext.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-lime-300 hover:bg-white"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
