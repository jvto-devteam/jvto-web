import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, Search, ShieldCheck } from "lucide-react";
import { getContentPage } from "@/lib/content/getContentPage";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { EvidenceBox } from "@/components/content/EvidenceBox";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import Sidebar from "../sidebar";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

type Props = {
  params: Promise<{ slug: string }>;
};

const slugMeta: Record<
  string,
  {
    eyebrow: string;
    helper: string;
    nextLinks: Array<{ href: string; label: string }>;
  }
> = {
  "our-story": {
    eyebrow: "Continuity",
    helper:
      "Read this page to understand how JVTO's history, founder context, and documented continuity support the wider trust architecture.",
    nextLinks: [
      { href: "/verify-jvto/history-artifacts", label: "Open history artifacts" },
      { href: "/why-jvto/the-jvto-difference", label: "Read the JVTO difference" },
    ],
  },
  "our-team": {
    eyebrow: "Crew Layer",
    helper:
      "The team page matters because route trust depends on named local people, not anonymous operators behind a booking form.",
    nextLinks: [
      { href: "/why-jvto/reviews", label: "Read guest reviews" },
      { href: "/verify-jvto/police-safety", label: "Open police & safety proof" },
    ],
  },
  reviews: {
    eyebrow: "Independent Reviews",
    helper:
      "This route should help guests compare the trust layer with what independent platforms say about execution on the ground.",
    nextLinks: [
      { href: "/verify-jvto", label: "Verify JVTO" },
      { href: "/tours", label: "Back to tours" },
    ],
  },
  "the-jvto-difference": {
    eyebrow: "Core Differentiator",
    helper:
      "This is the page where guests should understand why JVTO is not just another Bromo-Ijen operator with the same promise structure.",
    nextLinks: [
      { href: "/verify-jvto", label: "Open verify hub" },
      { href: "/travel-guide", label: "Open Prepare & Book" },
    ],
  },
};

function getMeta(slug: string) {
  return (
    slugMeta[slug] ?? {
      eyebrow: "Why JVTO",
      helper:
        "This page belongs to the trust layer and should strengthen clarity around who runs JVTO, why it is credible, and how proof connects to operations.",
      nextLinks: [
        { href: "/verify-jvto", label: "Verify JVTO" },
        { href: "/travel-guide", label: "Open Prepare & Book" },
      ],
    }
  );
}

function SectionNav({
  items,
}: {
  items?: Array<{ id: string; label: string; href: string }>;
}) {
  if (!items?.length) return null;
  return (
    <nav className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
        On this page
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((it) => (
          <a
            key={it.id}
            href={it.href}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-lime-300"
          >
            <ArrowRight className="h-4 w-4 text-lime-700" />
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getContentPage(`/why-jvto/${slug}`, "en");
  if (!row) return { title: "Page Not Found" };
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};
  return {
    ...buildWebsiteMetadata({
      title: seo.title ?? content.h1 ?? row.route,
      description: seo.description ?? content?.hero_subhead ?? content?.h1 ?? "Why JVTO page",
      path: `/why-jvto/${slug}`,
      image: "/assets/img/og/why-jvto.webp",
      imageAlt: content.h1 ?? "Why JVTO page",
    }),
  };
}

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;
  const row = await getContentPage(`/why-jvto/${slug}`, "en");
  if (!row) return notFound();

  const content = row.content as any;
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Why JVTO";
  const meta = getMeta(slug);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />
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

      <main className="flex-1 pt-28 pb-20 md:pt-36">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="transition hover:text-stone-900">
              <Home className="h-4 w-4" />
            </Link>
            <span>›</span>
            <Link href="/why-jvto" className="transition hover:text-stone-900">
              Why JVTO
            </Link>
            <span>›</span>
            <span className="font-medium text-stone-900">{h1}</span>
          </nav>

          <header className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              {meta.eyebrow}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-950 md:text-5xl">
              {h1}
            </h1>
            {content?.hero_subhead ? (
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 md:text-lg">
                {content.hero_subhead}
              </p>
            ) : null}

            {Array.isArray(content?.lede) && content.lede.length > 0 ? (
              <div className="prose prose-stone mt-4 max-w-3xl">
                <MarkdownRenderer markdown={content.lede.join("\n\n")} />
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                  Why this page matters
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{meta.helper}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                  Read next
                </p>
                <div className="mt-3 space-y-2">
                  {meta.nextLinks.map((item) => (
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

          <section className="mt-8">
            <SectionNav items={content?.section_nav} />
          </section>

          {Array.isArray(content?.sections) &&
            content.sections.map((sec: any) => (
              <section
                key={sec.id}
                id={sec.id}
                className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8"
              >
                <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-lime-700">
                  <Search className="h-3.5 w-3.5" />
                  Trust section
                </div>
                <h2 className="text-2xl font-black tracking-tight text-stone-950">
                  {sec.title}
                </h2>

                {sec.summary ? (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">{sec.summary}</p>
                ) : null}

                <div className="prose prose-stone mt-6 max-w-none">
                  {sec.blocks ? (
                    <BlocksRenderer blocks={sec.blocks} sectionId={sec.id} />
                  ) : sec.body_md ? (
                    <MarkdownRenderer markdown={sec.body_md} />
                  ) : null}
                </div>

                <div className="mt-6">
                  <EvidenceBox
                    evidence={sec.evidence}
                    title="Proof Path"
                    description="Open the proof layer that best supports the claim in this section."
                  />
                </div>
              </section>
            ))}

          {content?.body_md ? (
            <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <div className="prose prose-stone max-w-none">
                <MarkdownRenderer markdown={content.body_md} />
              </div>
            </section>
          ) : null}

          {content?.faq ? (
            <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-lime-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                FAQ
              </div>
              <Faq items={content.faq} title={content?.faq_title ?? "FAQ"} />
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
