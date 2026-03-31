import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CloudSun,
  CreditCard,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { getContentPage } from "@/lib/content/getContentPage";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Sidebar from "../sidebar";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

type Props = {
  params: Promise<{ slug: string }>;
};

const pageMeta: Record<
  string,
  {
    eyebrow: string;
    helper: string;
    links: Array<{ href: string; label: string }>;
  }
> = {
  "booking-information": {
    eyebrow: "Booking & Payment",
    helper:
      "Read this page as the owner guide for deposits, payment timing, and the practical steps before a route is locked in.",
    links: [
      { href: "/policy/booking-payment-cancellation", label: "Open booking policy" },
      { href: "/travel-guide/ijen-health-screening", label: "Read Ijen screening" },
    ],
  },
  "ijen-health-screening": {
    eyebrow: "Health Readiness",
    helper:
      "Ijen should be treated as a route-readiness decision. This page exists to reduce preventable mistakes before ascent.",
    links: [
      { href: "/travel-guide/weather-and-closures", label: "Check weather & closures" },
      { href: "/travel-guide/packing-and-fitness", label: "Check packing & fitness" },
    ],
  },
  "weather-and-closures": {
    eyebrow: "Volcano & Weather Context",
    helper:
      "This page should be read alongside official volcano and access signals such as MAGMA / PVMBG plus local field conditions that affect the route on the day.",
    links: [
      { href: "/travel-guide/safety-on-tours", label: "Read safety on tours" },
      { href: "/policy/booking-payment-cancellation", label: "Read closure policy logic" },
    ],
  },
  "packing-and-fitness": {
    eyebrow: "Route Fit",
    helper:
      "Use this page to check whether the route still fits the guest, not just what gear looks good in photos.",
    links: [
      { href: "/travel-guide/ijen-health-screening", label: "Read Ijen screening" },
      { href: "/travel-guide/booking-information", label: "Back to booking information" },
    ],
  },
  "safety-on-tours": {
    eyebrow: "Operational Safety",
    helper:
      "Safety here means how JVTO handles uncertainty on the road and on the mountain, not just generic reassurance copy.",
    links: [
      { href: "/verify-jvto/police-safety", label: "Open police & safety proof" },
      { href: "/travel-guide/weather-and-closures", label: "Read weather & closures" },
    ],
  },
  "police-escort-for-groups": {
    eyebrow: "Large Group Support",
    helper:
      "This route explains a narrow, formal service. It is not a generic marketing add-on and should be read in that context.",
    links: [
      { href: "/travel-guide/booking-information", label: "Read booking information" },
      { href: "/contact", label: "Contact the team" },
    ],
  },
  faq: {
    eyebrow: "Quick Answers",
    helper:
      "This page exists to remove the common uncertainties first, then send guests to the right owner page when they need detail.",
    links: [
      { href: "/travel-guide/booking-information", label: "Open booking information" },
      { href: "/tours", label: "Back to tours" },
    ],
  },
};

function getPageMeta(slug: string) {
  return (
    pageMeta[slug] ?? {
      eyebrow: "Prepare & Book",
      helper:
        "This owner page sits inside JVTO's support layer and should make route, booking, and readiness questions easier before payment.",
      links: [
        { href: "/travel-guide", label: "Back to Prepare & Book" },
        { href: "/tours", label: "Explore tours" },
      ],
    }
  );
}

function extractIntro(content: Record<string, any>) {
  if (typeof content?.hero_subhead === "string" && content.hero_subhead.trim()) {
    return content.hero_subhead;
  }
  if (Array.isArray(content?.lede) && content.lede.length > 0) {
    return content.lede.filter((item: unknown) => typeof item === "string").join(" ");
  }
  if (typeof content?.lede === "string" && content.lede.trim()) {
    return content.lede;
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const row = await getContentPage(`/travel-guide/${slug}`, "en");

  if (!row) {
    return {
      title: "Page Not Found",
    };
  }

  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};

  return {
    ...buildWebsiteMetadata({
      title: seo.title ?? content.h1 ?? row.route,
      description: seo.description ?? content?.hero_subhead ?? content?.h1 ?? "Travel Guide",
      path: `/travel-guide/${slug}`,
      image: "/assets/img/og/travel-guide.webp",
      imageAlt: content.h1 ?? "Prepare & Book page",
    }),
  };
}

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;

  const row = await getContentPage(`/travel-guide/${slug}`, "en");

  if (!row) return notFound();

  const content = row.content as any;
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Travel Guide";
  const body = content?.body_md ?? "";
  const intro = extractIntro(content);
  const meta = getPageMeta(slug);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <PageJsonLdCombined
        pageRow={{
          route: row.route,
          lang: row.lang,
          seo: row.seo,
          content: row.content,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }}
      />
      <Sidebar />

      <main className="flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="mb-5 text-sm text-stone-500">
            <Link href="/" className="transition hover:text-stone-900">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/travel-guide" className="transition hover:text-stone-900">
              Prepare &amp; Book
            </Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-stone-900">{h1}</span>
          </nav>

          <header className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-800">
              {slug === "weather-and-closures" ? (
                <CloudSun className="h-3.5 w-3.5" />
              ) : slug === "booking-information" ? (
                <CreditCard className="h-3.5 w-3.5" />
              ) : slug === "ijen-health-screening" ? (
                <Stethoscope className="h-3.5 w-3.5" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              {meta.eyebrow}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-950 md:text-5xl">
              {h1}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 md:text-lg">
              {intro ?? meta.helper}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                  Why this page exists
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{meta.helper}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                  Read next
                </p>
                <div className="mt-3 space-y-2">
                  {meta.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-lime-300"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="prose prose-stone max-w-none">
              <MarkdownRendererTravelGuide markdown={body} />
            </div>
          </section>

          {content?.faq ? (
            <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <Faq items={content.faq} title={content?.faq_title ?? "FAQ"} />
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
