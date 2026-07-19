import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import Sidebar from "../sidebar";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildResolvedFaqSchema,
  resolveFaqsForPage,
} from "@/lib/content/resolveFaqs";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";
import {
  buildJvtoTravelCreditAnnouncementSchema,
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";
import { getCustomerCopy, type CustomerCopyKey } from "@/lib/policy-bundle";

// Canonical Lifetime Package Guarantee blocks (compiled from the llm-wiki YAML
// SSOT via customer-copy.json). Rendered on /policy/booking-payment-cancellation
// so the binding summary comes from the policy bundle, not hand-written copy.
const GUARANTEE_BLOCKS: { key: CustomerCopyKey; label: string }[] = [
  { key: "package_guarantee_summary", label: "Lifetime Package Guarantee" },
  { key: "before_48_full_cancellation", label: "Cancel your booking 48h+ before Day 1" },
  { key: "after_48_full_cancellation", label: "Cancel within 48h of Day 1" },
  { key: "partial_cancellation", label: "One traveller cancels (booking continues)" },
  { key: "flight_disruption", label: "Flight disruption" },
  { key: "destination_force_majeure", label: "Destination force majeure" },
  { key: "package_transfer", label: "Transferring Package Credit" },
  { key: "package_redemption", label: "Using Package Credit" },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listPublicPageRoutesByPrefix("/policy").map((route) => ({
    slug: route.replace("/policy/", ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageSnapshot(`/policy/${slug}`, {
    allowDatabaseFallback: false,
    requiredContentFields: ["body_md"],
  });
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const content = (page.pageRow.content as Record<string, any> | null) ?? {};

  if (typeof content.body_md !== "string" || content.body_md.trim().length === 0) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: seo.title ?? content.h1 ?? page.pageRow.route,
    description: seo.description ?? undefined,
  };
}

export default async function PolicyDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/policy/${slug}`;

  const [page, faqResolution] = await Promise.all([
    getPublicPageSnapshot(route, {
      allowDatabaseFallback: false,
      requiredContentFields: ["body_md"],
    }),
    resolveFaqsForPage(route),
  ]);
  const content = page.pageRow.content as any;
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Policy";
  const body = content?.body_md ?? "";
  const mentionsTermIds = POLICY_SLUG_MENTIONS[slug] ?? [];
  const policyAnchorSchema = buildPolicyWebPageSchema({
    subpath: slug,
    name: seo.title ?? h1,
    description: seo.description ?? `JVTO ${h1} policy.`,
    mentionsTermIds,
  });
  const faqSchema = buildResolvedFaqSchema(faqResolution, route);
  const announcementSchema =
    slug === "booking-payment-cancellation"
      ? buildJvtoTravelCreditAnnouncementSchema()
      : null;

  const slugExtraSchemas = [
    policyAnchorSchema,
    faqSchema,
    announcementSchema,
  ].filter(Boolean);

  if (!body.trim().length) return notFound();

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
          {slug === "booking-payment-cancellation" && (
            <section className="mb-12 rounded-2xl border border-jvto-lime/30 bg-jvto-lime/5 p-6 md:p-8">
              <h2
                className="font-black text-xl md:text-2xl text-jvto-navy mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Lifetime Package Guarantee — the rules in plain language
              </h2>
              <dl className="space-y-4">
                {GUARANTEE_BLOCKS.map(({ key, label }) => {
                  const text = getCustomerCopy(key);
                  if (!text) return null;
                  return (
                    <div key={key}>
                      <dt className="font-bold text-jvto-navy">{label}</dt>
                      <dd className="text-jvto-navy/80">{text}</dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-5 text-xs text-jvto-navy/60">
                These summaries are generated from JVTO&rsquo;s canonical policy source and take
                precedence. The detailed policy sections follow below.
              </p>
            </section>
          )}
          <MarkdownRenderer markdown={body} />
          {content?.faq && (
            <Faq items={content?.faq} title={content?.faq_title ?? "FAQ"} />
          )}
        </div>
      </main>
    </div>
  );
}
