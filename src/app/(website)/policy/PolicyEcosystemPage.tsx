import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import { Faq } from "@/components/content/Faq";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import {
  loadStaticPage,
  listPublishedStaticPages,
  buildStaticRouteMetadata,
  type StructuredSection,
  type StaticPage,
} from "@/lib/ecosystemContent/staticPageAdapter";
import {
  buildJvtoTravelCreditAnnouncementSchema,
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";

const POLICY_NAV = [
  { href: "/policy", label: "Policy Hub" },
  {
    href: "/policy/booking-payment-cancellation",
    label: "Booking, Payment & Cancellation",
  },
  {
    href: "/policy/inclusions-exclusions",
    label: "Inclusions & Exclusions",
  },
  { href: "/policy/privacy", label: "Privacy & Data Protection" },
];

function slugFromRoute(route: string): string {
  return route.split("/").filter(Boolean).pop() ?? route;
}

function formatLabel(value: string): string {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(renderValue).join(", ");
  if (typeof value === "object" && value !== null) {
    return Object.entries(value as Record<string, unknown>)
      .filter(
        ([, entry]) => entry !== undefined && entry !== null && entry !== "",
      )
      .map(([key, entry]) => `${formatLabel(key)}: ${renderValue(entry)}`)
      .join(" / ");
  }
  return String(value ?? "");
}

function normalizeBlocks(blocks: unknown[]): any {
  return blocks.map((block: any) =>
    block && block.type === "grid" && Array.isArray(block.items)
      ? {
          ...block,
          items: block.items.map((item: any) => ({
            ...item,
            summary: item?.summary ?? item?.text,
          })),
        }
      : block,
  );
}

function structuredPayload(page: StaticPage): Record<string, unknown> {
  const payload = page.raw.page.content?.payload;
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : {};
}

function heroPayloadFor(page: StaticPage): Record<string, unknown> {
  const payload = structuredPayload(page);
  return payload.hero && typeof payload.hero === "object"
    ? (payload.hero as Record<string, unknown>)
    : {};
}

function stringFromPayload(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function heroEyebrowFor(page: StaticPage): string {
  return (
    stringFromPayload(heroPayloadFor(page).eyebrow) ??
    formatLabel(page.raw.domain || page.meta.section)
  );
}

function heroSecondaryMetaFor(page: StaticPage): string {
  return (
    stringFromPayload(heroPayloadFor(page).meta) ??
    formatLabel(page.raw.slug || slugFromRoute(page.meta.route))
      .toUpperCase()
      .replace(/\s+/g, " / ")
  );
}

function heroDescriptionFor(page: StaticPage): string {
  return (
    stringFromPayload(heroPayloadFor(page).lede) ??
    stringFromPayload(structuredPayload(page).intro) ??
    page.meta.summary ??
    page.meta.description
  );
}

function heroMetaFor(page: StaticPage) {
  const quickFacts = structuredPayload(page).quickFacts;
  if (!Array.isArray(quickFacts)) return [];

  return quickFacts
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        label: renderValue(record.label),
        value: renderValue(record.value),
      };
    })
    .filter((item): item is { label: string; value: string } =>
      Boolean(item?.label && item.value),
    );
}

function faqSchemaFor(page: StaticPage) {
  const faqItems = page.faq ?? [];
  if (!faqItems.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${page.canonicalUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

function PolicySections({ sections }: { sections: StructuredSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="mb-10 last:mb-0">
          {section.title && (
            <h2
              className="font-black text-jvto-navy text-[22px] mb-4 leading-snug"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {section.title}
            </h2>
          )}
          {section.body_md && <MarkdownRenderer markdown={section.body_md} />}
          {section.blocks && section.blocks.length > 0 && (
            <div className="mt-4">
              <BlocksRenderer
                blocks={normalizeBlocks(section.blocks)}
                sectionId={section.id}
              />
            </div>
          )}
        </section>
      ))}
    </>
  );
}

export async function generatePolicyEcosystemStaticParams() {
  const pages = await listPublishedStaticPages({ section: "policy" });
  return pages
    .map((page) => page.meta.route)
    .filter((route) => route.startsWith("/policy/"))
    .map((route) => route.replace("/policy/", ""))
    .map((slug) => ({ slug }));
}

export async function generatePolicyEcosystemMetadata(
  route: string,
): Promise<Metadata> {
  const page = await loadStaticPage(route);
  if (!page || page.meta.status !== "published") {
    return { title: "Page Not Found" };
  }

  return buildStaticRouteMetadata(page.meta.route, {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  });
}

export async function PolicyEcosystemPage({ route }: { route: string }) {
  const page = await loadStaticPage(route);
  if (!page || page.meta.status !== "published") return notFound();

  const isHubPage = page.meta.route === "/policy";
  const slug = isHubPage ? "" : slugFromRoute(page.meta.route);
  const body = page.body ?? "";
  const sections = page.sections ?? [];
  const hasBody = body.trim().length > 0;
  const hasSections = sections.length > 0;
  if (!hasBody && !hasSections) return notFound();

  const h1 = page.meta.title;
  const seoTitle = page.meta.browserTitle ?? page.meta.title;
  const seoDescription = page.meta.description;
  const heroMeta = heroMetaFor(page);
  const answerFirst =
    typeof page.raw.page.answerFirst === "string"
      ? page.raw.page.answerFirst.trim()
      : "";
  const faqItems = page.faq ?? [];
  const mentionsTermIds = slug ? (POLICY_SLUG_MENTIONS[slug] ?? []) : [];
  const policyAnchorSchema = buildPolicyWebPageSchema({
    subpath: slug,
    name: seoTitle,
    description: page.meta.summary ?? page.meta.description,
    mentionsTermIds,
  });
  const announcementSchema =
    slug === "booking-payment-cancellation"
      ? buildJvtoTravelCreditAnnouncementSchema()
      : null;

  return (
    <>
      <PageJsonLdCombined
        pageRow={{
          route: page.meta.route,
          lang: "en",
          seo: { title: seoTitle, description: seoDescription },
          content: { h1 },
        }}
        extraSchemas={[
          policyAnchorSchema,
          faqSchemaFor(page),
          announcementSchema,
        ].filter(Boolean)}
        suppressCmsFaq
      />

      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {heroEyebrowFor(page)}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  {heroSecondaryMetaFor(page)}
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {h1}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {heroDescriptionFor(page)}
              </p>
              {answerFirst ? (
                <div className="mt-6 rounded-xl border border-jvto-lime/25 bg-white/10 px-5 py-4 text-sm leading-relaxed text-white/80">
                  {answerFirst}
                </div>
              ) : null}
            </div>
            {heroMeta.length ? (
              <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
                {heroMeta.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">
                      {label}
                    </span>
                    <strong className="text-white text-sm font-semibold text-right break-words">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Policy
              </p>
              <nav className="space-y-0.5">
                {POLICY_NAV.map(({ href, label }) => {
                  const isActive = href === page.meta.route;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-jvto-navy text-white"
                          : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/policy"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                All policies <ArrowRight />
              </Link>
            </aside>

            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              {hasSections ? (
                <PolicySections sections={sections} />
              ) : (
                <MarkdownRenderer markdown={body} />
              )}
              {faqItems.length ? (
                <Faq
                  items={faqItems.map((item) => ({
                    q: item.question,
                    a: item.answer,
                  }))}
                  title={null}
                  eyebrow={null}
                />
              ) : null}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
