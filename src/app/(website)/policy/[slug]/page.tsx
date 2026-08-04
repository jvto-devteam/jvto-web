import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import Sidebar from "../sidebar";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildJvtoTravelCreditAnnouncementSchema,
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";
import {
  listPublishedStaticPages,
  loadStaticPage,
  PRODUCTION_ORIGIN,
  type Block,
  type StaticPage,
  type StructuredSection,
} from "@/lib/static-content";

// PACKAGE 03 (2026-08-04): Policy routes are served from content/pages/policy/
// (the static-content SSOT). No content_pages / snapshot / cms-seed / FAQ-resolver
// / policy-bundle reader is consulted at runtime — the complete visible policy
// wording (including the formerly bundle-injected booking/payment/guarantee
// blocks) lives in the content files. See docs/architecture/public-content-*.md.

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listPublishedStaticPages({ section: "policy" })
    .filter((p) => p.meta.route !== "/policy")
    .map((p) => ({ slug: p.meta.route.replace("/policy/", "") }));
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
    },
    content: { h1: page.meta.title },
  };
}

/** Visible FAQ HTML and FAQPage JSON-LD share this one array (AD-08). */
function buildStaticFaqSchema(route: string, faq: NonNullable<StaticPage["faq"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PRODUCTION_ORIGIN}${route}#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = loadStaticPage(`/policy/${slug}`);
  if (!page || page.meta.status !== "published") {
    return { title: "Page Not Found" };
  }
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

function GuaranteeGrid({ block }: { block: Extract<Block, { type: "grid" }> }) {
  return (
    <dl className="space-y-4">
      {block.items.map((item, i) => (
        <div key={i}>
          <dt className="font-bold text-jvto-navy">{String(item.title ?? "")}</dt>
          <dd className="text-jvto-navy/80">{String(item.text ?? "")}</dd>
        </div>
      ))}
    </dl>
  );
}

function StructuredPolicySection({ section }: { section: StructuredSection }) {
  const isGuaranteeBox = section.id === "lifetime-package-guarantee";
  const heading = section.title ? (
    <h2
      className={`font-black text-xl md:text-2xl text-jvto-navy ${isGuaranteeBox ? "mb-5" : "mb-4"}`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {section.title}
    </h2>
  ) : null;

  const blocks = (section.blocks ?? []).map((block, i) => {
    if (block.type === "grid") return <GuaranteeGrid key={i} block={block} />;
    if (block.type === "markdown") {
      // Inside the guarantee box the trailing markdown is the precedence note —
      // rendered small, exactly as the pre-migration layout did.
      return isGuaranteeBox ? (
        <p key={i} className="mt-5 text-xs text-jvto-navy/60">
          {block.body_md}
        </p>
      ) : (
        <div key={i} className="text-jvto-navy/80">
          <MarkdownRenderer markdown={block.body_md} />
        </div>
      );
    }
    return null;
  });

  if (isGuaranteeBox) {
    return (
      <section className="mb-12 rounded-2xl border border-jvto-lime/30 bg-jvto-lime/5 p-6 md:p-8">
        {heading}
        {blocks}
      </section>
    );
  }
  return (
    <section>
      {heading}
      {blocks}
      {section.body_md ? (
        <div className="text-jvto-navy/80">
          <MarkdownRenderer markdown={section.body_md} />
        </div>
      ) : null}
    </section>
  );
}

export default async function PolicyDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/policy/${slug}`;
  const page = loadStaticPage(route);
  if (!page || page.meta.status !== "published") return notFound();

  const h1 = page.meta.title;
  const mentionsTermIds = POLICY_SLUG_MENTIONS[slug] ?? [];
  const policyAnchorSchema = buildPolicyWebPageSchema({
    subpath: slug,
    name: page.meta.browserTitle ?? h1,
    description: page.meta.description,
    mentionsTermIds,
  });
  const faqItems = page.faq ?? [];
  const faqSchema = faqItems.length ? buildStaticFaqSchema(route, faqItems) : null;
  const announcementSchema =
    slug === "booking-payment-cancellation"
      ? buildJvtoTravelCreditAnnouncementSchema()
      : null;

  const slugExtraSchemas = [policyAnchorSchema, faqSchema, announcementSchema].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq
      />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-jvto-navy text-white pb-10 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/policy" prefetch={false} className="hover:text-white transition-colors">
                Policy
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">{h1}</span>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              Policy
            </span>
            <h1
              className="font-black text-3xl md:text-5xl text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {h1}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pt-12">
          {page.format === "structured" ? (
            <div className="mb-10 space-y-8">
              {(page.sections ?? []).map((section) => (
                <StructuredPolicySection key={section.id} section={section} />
              ))}
            </div>
          ) : (
            <MarkdownRenderer markdown={page.body ?? ""} />
          )}
          {faqItems.length > 0 && (
            <Faq items={faqItems.map((f) => ({ q: f.question, a: f.answer }))} title="FAQ" />
          )}
        </div>
      </main>
    </div>
  );
}
