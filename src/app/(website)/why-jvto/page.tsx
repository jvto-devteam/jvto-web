import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Fingerprint,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import HubSectionFrame from "@/components/website/HubSectionFrame";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

const fallbackSeo = {
  title: "Why Choose Java Volcano Tour Operator",
  h1: "Why JVTO",
  description:
    "Understand why travelers choose JVTO for private East Java routes: police-led safety culture, route discipline, real Ijen screening, and proof you can verify before payment.",
};

const trustCards = [
  {
    title: "The JVTO Difference",
    copy:
      "See how route seriousness, private-only operations, and documented safety handling shape the whole company.",
    href: "/why-jvto/the-jvto-difference",
    icon: ShieldCheck,
  },
  {
    title: "Our Story",
    copy:
      "Trace the company story, historical continuity, and why the operation is more documented than most local tour businesses.",
    href: "/why-jvto/our-story",
    icon: BookOpen,
  },
  {
    title: "Our Team",
    copy:
      "Meet the named local crew behind route execution, field handling, and guest support.",
    href: "/why-jvto/our-team",
    icon: Users,
  },
  {
    title: "Reviews",
    copy:
      "Read what independent platforms say about safety, handling, logistics, and real guest experience.",
    href: "/why-jvto/reviews",
    icon: Star,
  },
  {
    title: "Verify JVTO",
    copy:
      "Move from claims to proof through legal, safety, press, and history routes that can actually be checked.",
    href: "/verify-jvto",
    icon: Search,
  },
  {
    title: "Prepare & Book",
    copy:
      "Use the support layer for route fit, health readiness, weather rules, and payment clarity before booking.",
    href: "/travel-guide",
    icon: Fingerprint,
  },
];

const principles = [
  "Private tours only, so route handling stays coherent from pickup to finish.",
  "Ijen is treated as a real health and access decision, not just a photo opportunity.",
  "Proof is published in owner routes so guests can verify before payment.",
  "The support layer exists to reduce uncertainty before booking, not after something goes wrong.",
];

const fallbackFaq = [
  {
    q: "Do you mix strangers in one car?",
    a: "No. JVTO runs private tours only.",
  },
  {
    q: "Where can I check legal and safety proof?",
    a: "Open Verify JVTO to inspect the company’s proof categories and supporting documents.",
  },
  {
    q: "Where should I read route readiness rules before payment?",
    a: "Use Prepare & Book for Ijen screening, weather, packing, and booking information.",
  },
];

function extractIntro(content: Record<string, any> | null, fallback: string) {
  if (!content) return fallback;
  if (typeof content.lede === "string" && content.lede.trim()) return content.lede;
  if (Array.isArray(content.lede) && content.lede.length > 0) {
    return content.lede
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .join(" ");
  }
  if (typeof content.hero_subhead === "string" && content.hero_subhead.trim()) {
    return content.hero_subhead;
  }
  return fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/why-jvto", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/why-jvto",
    image: "/assets/img/og/why-jvto.webp",
    imageAlt: seo.h1,
  });
}

export default async function WhyJvtoPage() {
  const seo = await getPageSeo("/why-jvto", fallbackSeo);
  const content = (seo.row?.content as Record<string, any> | null) ?? null;
  const intro = extractIntro(content, seo.description);
  const faq = Array.isArray(content?.faq) && content.faq.length > 0 ? content.faq : fallbackFaq;
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
        route: "/why-jvto",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
          faq,
        },
      };

  return (
    <div className="bg-stone-50">
      <PageJsonLdCombined pageRow={pageRow as any} />

      <main className="pt-28 pb-20">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trust & Authority
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-stone-950 md:text-6xl">
                {seo.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                {intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/verify-jvto"
                  className="inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-stone-800"
                >
                  Verify JVTO
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/travel-guide"
                  className="inline-flex items-center gap-2 rounded-sm border border-stone-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  Open Prepare & Book
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700 sm:grid-cols-2 lg:w-[26rem]">
              {principles.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-700" />
                  <p className="leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HubSectionFrame
          eyebrow="Navigate The Trust Stack"
          title="The best way to read JVTO is by proof path, not marketing claim."
          description="These routes explain who runs the company, what makes the operation different, and where the proof lives when you want to verify it yourself."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trustCards.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[24px] border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-lime-300 hover:shadow-[0_20px_40px_rgba(20,28,4,0.08)]"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-lime-50 p-3 text-lime-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-stone-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.copy}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-950">
                    Open route
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </HubSectionFrame>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                What Guests Are Really Checking
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">
                The trust question is usually simple: can this operator handle the route properly?
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-600">
                On JVTO, trust is not separated from route handling. The same system that explains proof, crew, and history should also make payment readiness and Ijen seriousness easier to understand.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                Read next
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { href: "/tours", label: "Explore private tours" },
                  { href: "/travel-guide/booking-information", label: "Read booking information" },
                  { href: "/travel-guide/ijen-health-screening", label: "Understand Ijen health screening" },
                ].map((item) => (
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
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 lg:py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">FAQ</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">
              Quick answers before you go deeper.
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item: any, index: number) => (
              <div key={`${item.q}-${index}`} className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="text-lg font-bold text-stone-950">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
