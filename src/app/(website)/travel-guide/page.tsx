import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Backpack,
  CloudSun,
  CreditCard,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import HubSectionFrame from "@/components/website/HubSectionFrame";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
import {
  extractHubIntro,
  travelGuideHubDoctrine,
} from "@/lib/trust/trustSupportDoctrine";

const iconMap = {
  card: CreditCard,
  stethoscope: Stethoscope,
  shield: ShieldCheck,
  backpack: Backpack,
  weather: CloudSun,
  activity: Activity,
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/travel-guide", travelGuideHubDoctrine.fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/travel-guide",
    image: "/assets/img/og/travel-guide.webp",
    imageAlt: seo.h1,
  });
}

export default async function TravelGuideHubPage() {
  const seo = await getPageSeo("/travel-guide", travelGuideHubDoctrine.fallbackSeo);
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
        route: "/travel-guide",
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
    <div className="bg-stone-50">
      <PageJsonLdCombined pageRow={pageRow as any} />

      <main className="pt-28 pb-20">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                {travelGuideHubDoctrine.eyebrow}
              </div>
              <h1 className="text-4xl font-black tracking-tight text-stone-950 md:text-6xl">
                {seo.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                {intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {travelGuideHubDoctrine.actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={
                      action.variant === "primary"
                        ? "inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-stone-800"
                        : "inline-flex items-center gap-2 rounded-sm border border-stone-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
                    }
                  >
                    {action.label}
                    {action.variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                What this cluster is for
              </p>
              <div className="mt-4 space-y-3">
                {travelGuideHubDoctrine.supportPrinciples.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-700" />
                    <p className="text-sm leading-6 text-stone-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HubSectionFrame
          eyebrow="Support routes"
          title="Each page removes a different kind of uncertainty before payment or departure."
          description="This cluster should feel practical, not decorative. Open the route that answers the question blocking the booking decision right now."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {travelGuideHubDoctrine.guideCards.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[24px] border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-lime-300 hover:shadow-[0_20px_40px_rgba(20,28,4,0.08)]"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-lime-50 p-3 text-lime-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-stone-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.copy}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-950">
                    Open page
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
