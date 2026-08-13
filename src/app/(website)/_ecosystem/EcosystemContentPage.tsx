import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrewGrid, type CrewMember } from "@/components/content/CrewGrid";
import { Faq } from "@/components/content/Faq";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import {
  buildEcosystemRouteMetadata,
  getEcosystemWebsitePage,
  getEcosystemWebsiteRoutes,
  type EcosystemBlock,
  type EcosystemGridBlock,
  type EcosystemSection,
  type EcosystemStaticPage,
} from "@/lib/ecosystemContent/website";

const NAV_LABELS: Record<string, string> = {
  "/policy": "Policy Hub",
  "/policy/booking-payment-cancellation": "Booking, Payment & Cancellation",
  "/policy/inclusions-exclusions": "Inclusions & Exclusions",
  "/policy/privacy": "Privacy & Data Protection",
  "/why-jvto": "Why JVTO overview",
  "/why-jvto/the-jvto-difference": "The JVTO Difference",
  "/why-jvto/reviews": "Reviews",
  "/why-jvto/our-story": "Our Story",
  "/why-jvto/our-team": "Our Team",
  "/why-jvto/community-standards": "Community Standards",
};

const SECTION_ORDER: Record<string, string[]> = {
  "/policy": [
    "/policy",
    "/policy/booking-payment-cancellation",
    "/policy/inclusions-exclusions",
    "/policy/privacy",
  ],
  "/why-jvto": [
    "/why-jvto",
    "/why-jvto/the-jvto-difference",
    "/why-jvto/reviews",
    "/why-jvto/our-story",
    "/why-jvto/our-team",
    "/why-jvto/community-standards",
  ],
};

type JsonRecord = Record<string, unknown>;

type EcosystemContentPageProps = {
  route: string;
  sectionLabel: string;
  eyebrow?: string;
  navBase: "/policy" | "/why-jvto";
  extraSchemas?: unknown[];
  cta?: {
    title: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
};

function normalizeRoute(route: string): string {
  let normalized = route.trim();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized.toLowerCase();
}

function routeDepth(route: string): number {
  return normalizeRoute(route).split("/").filter(Boolean).length;
}

function labelFromRoute(route: string): string {
  return (
    NAV_LABELS[route] ??
    route
      .split("/")
      .filter(Boolean)
      .pop()
      ?.split("-")
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" ") ??
    route
  );
}

async function getSectionNav(navBase: "/policy" | "/why-jvto") {
  const index = await getEcosystemWebsiteRoutes();
  const baseDepth = routeDepth(navBase);
  const order = new Map(
    (SECTION_ORDER[navBase] ?? []).map((route, index) => [route, index]),
  );

  const routes = (index.routes ?? [])
    .map((item) => normalizeRoute(item.route))
    .filter(
      (route) =>
        route === navBase ||
        (route.startsWith(`${navBase}/`) && routeDepth(route) === baseDepth + 1),
    )
    .map((route) => ({ href: route, label: labelFromRoute(route) }));

  const fallback = (SECTION_ORDER[navBase] ?? []).map((route) => ({
    href: route,
    label: labelFromRoute(route),
  }));

  return (routes.length ? routes : fallback).sort((a, b) => {
    const aOrder = order.get(a.href) ?? 100;
    const bOrder = order.get(b.href) ?? 100;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.label.localeCompare(b.label);
  });
}

function payloadFor(page: EcosystemStaticPage): JsonRecord {
  const payload = page.raw.page.content?.payload;
  return payload && typeof payload === "object" ? (payload as JsonRecord) : {};
}

function pageRowFor(page: EcosystemStaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
    },
    content: {
      h1: page.meta.title,
      reviewedBy: page.meta.owner ? `JVTO ${page.meta.owner}` : undefined,
      faq: page.faq,
    },
  };
}

function faqSchemaFor(page: EcosystemStaticPage, faqs = page.faq ?? []) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${page.canonicalUrl}#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function formatLabel(value: string): string {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value
      .map((entry) =>
        typeof entry === "object" && entry !== null
          ? renderValue(entry)
          : String(entry),
      )
      .join(", ");
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value as JsonRecord)
      .filter(
        ([, entry]) => entry !== undefined && entry !== null && entry !== "",
      )
      .map(([key, entry]) => `${formatLabel(key)}: ${renderValue(entry)}`)
      .join(" / ");
  }
  return String(value ?? "");
}

function itemTitle(item: JsonRecord): string {
  return renderValue(
    item.title ?? item.name ?? item.heading ?? item.label ?? item.question ?? "Item",
  );
}

function heroHeadingFor(page: EcosystemStaticPage) {
  const payload = payloadFor(page);
  const hero = payload.hero;
  if (hero && typeof hero === "object") {
    const heading = (hero as JsonRecord).heading;
    if (typeof heading === "string" && heading.trim()) return heading;
  }
  return page.meta.title;
}

function heroDescriptionFor(page: EcosystemStaticPage) {
  const payload = payloadFor(page);
  const hero = payload.hero;
  if (hero && typeof hero === "object") {
    const lede = (hero as JsonRecord).lede;
    if (typeof lede === "string" && lede.trim()) return lede;
  }
  if (page.lede?.length) return page.lede.join(" ");
  return page.meta.summary ?? page.meta.description;
}

function heroMetaFor(page: EcosystemStaticPage) {
  const payload = payloadFor(page);
  const hero = payload.hero;
  if (hero && typeof hero === "object") {
    const meta = (hero as JsonRecord).meta;
    if (typeof meta === "string" && meta.trim()) {
      return [{ label: "Page type", value: meta }];
    }
  }

  const metaRows =
    page.sections
      ?.flatMap((section) => section.blocks ?? [])
      .find((block) => block.type === "grid" && block.role === "meta-rows");

  if (metaRows?.type === "grid" && metaRows.items?.length) {
    return metaRows.items
      .map((item) => ({
        label: renderValue(item.label ?? item.key),
        value: renderValue(item.value),
      }))
      .filter((item) => item.label && item.value);
  }

  return [
    { label: "Document", value: page.meta.section },
    { label: "Reviewed", value: page.meta.lastReviewed ?? "Editorial" },
    { label: "Owner", value: formatLabel(page.meta.owner ?? "JVTO") },
    { label: "Status", value: formatLabel(page.meta.status) },
  ];
}

function collectFaqs(page: EcosystemStaticPage) {
  const fromPage = page.faq ?? [];
  const fromSections =
    page.sections?.flatMap(
      (section) =>
        section.blocks?.flatMap((block) => {
          if (block.type !== "grid" || block.role !== "faq-list") return [];
          return (block.items ?? [])
            .filter((item) => item.question && item.answer)
            .map((item) => ({
              question: String(item.question),
              answer: String(item.answer),
            }));
        }) ?? [],
    ) ?? [];

  return [...fromPage, ...fromSections];
}

function ArrowRight() {
  return (
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
}

function ImageBlock({ block }: { block: Extract<EcosystemBlock, { type: "image" }> }) {
  if (!block.src) return null;
  return (
    <figure className="overflow-hidden rounded-[20px] border border-[#E3E0DA] bg-[#F6F5F2]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt={block.alt ?? ""}
        className="aspect-[16/9] w-full object-cover"
        loading="lazy"
      />
      {block.caption ? (
        <figcaption className="px-4 py-3 text-xs leading-relaxed text-[#6b7280]">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function LinkButton({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant?: unknown;
}) {
  const isExternal = /^https?:\/\//i.test(href);
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center gap-2 rounded-[12px] bg-jvto-orange px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#C4520A]"
      : "inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#E3E0DA] bg-white px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-jvto-navy transition-colors hover:border-jvto-orange/40";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
  );
}

function GenericGrid({ block }: { block: EcosystemGridBlock }) {
  const items = block.items ?? [];
  if (!items.length) return null;

  if (block.role === "cta-links") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        {items.map((item, index) => (
          <LinkButton
            key={index}
            href={renderValue(item.href || "#")}
            variant={item.variant}
          >
            {renderValue(item.label ?? item.title ?? "Open")}
            <ArrowRight />
          </LinkButton>
        ))}
      </div>
    );
  }

  if (block.role === "faq-list") {
    const faqs = items
      .filter((item) => item.question && item.answer)
      .map((item) => ({ q: renderValue(item.question), a: renderValue(item.answer) }));
    return <Faq items={faqs} title="Questions" />;
  }

  const cols =
    block.columns === 3
      ? "md:grid-cols-3"
      : block.columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2";

  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((item, index) => {
        const title = itemTitle(item);
        const href = typeof item.href === "string" ? item.href : null;
        const img = typeof item.img === "string" ? item.img : null;
        const rows = Object.entries(item).filter(
          ([key, value]) =>
            ![
              "key",
              "type",
              "href",
              "img",
              "title",
              "name",
              "heading",
              "label",
            ].includes(key) &&
            value !== undefined &&
            value !== null &&
            value !== "",
        );

        const card = (
          <div className="h-full rounded-[16px] border border-[#E3E0DA] bg-white p-5 transition-colors hover:border-jvto-orange/35">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt={title}
                className="mb-4 aspect-[16/10] w-full rounded-[12px] object-cover"
                loading="lazy"
              />
            ) : null}
            <h3 className="text-base font-black leading-snug text-jvto-navy">
              {title}
            </h3>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-[#6b7280]">
              {rows.map(([key, value]) => (
                <p key={key}>
                  {key === "text" ||
                  key === "body" ||
                  key === "summary" ||
                  key === "description" ? null : (
                    <span className="mr-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#9ca3af]">
                      {formatLabel(key)}
                    </span>
                  )}
                  {renderValue(value)}
                </p>
              ))}
            </div>
            {href ? (
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-jvto-orange">
                Open <ArrowRight />
              </span>
            ) : null}
          </div>
        );

        if (!href) return <div key={index}>{card}</div>;
        if (/^https?:\/\//i.test(href)) {
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
              {card}
            </a>
          );
        }
        return (
          <Link key={index} href={href} prefetch={false}>
            {card}
          </Link>
        );
      })}
    </div>
  );
}

function StructuredBlock({ block }: { block: EcosystemBlock }) {
  if (block.type === "markdown") {
    return block.body_md ? (
      <MarkdownRendererTravelGuide markdown={block.body_md} />
    ) : null;
  }
  if (block.type === "image") return <ImageBlock block={block} />;
  if (block.type === "crew_grid") {
    return <CrewGrid items={(block.items ?? []) as CrewMember[]} />;
  }
  if (block.type === "grid") return <GenericGrid block={block} />;
  return null;
}

function StructuredSections({ sections }: { sections?: EcosystemSection[] }) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.id}>
          {section.title ? (
            <h2
              className="mb-4 text-[22px] font-black leading-tight text-jvto-navy md:text-[28px]"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {section.title}
            </h2>
          ) : null}
          {section.body_md ? (
            <MarkdownRendererTravelGuide markdown={section.body_md} />
          ) : null}
          {section.blocks?.length ? (
            <div className="mt-5 space-y-5">
              {section.blocks.map((block, index) => (
                <StructuredBlock key={`${section.id}-${index}`} block={block} />
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function CrewProfile({ payload }: { payload: JsonRecord }) {
  const member = (payload.member ?? {}) as JsonRecord;
  const bio = (payload.bio ?? {}) as JsonRecord;
  const featuredReviews = Array.isArray(payload.featuredReviews)
    ? (payload.featuredReviews as JsonRecord[])
    : [];
  const related = Array.isArray(payload.related) ? (payload.related as JsonRecord[]) : [];
  const image = (member.image ?? {}) as JsonRecord;
  const photo =
    typeof image.src === "string"
      ? image.src
      : typeof bio.photo_url === "string"
        ? bio.photo_url
        : "";
  const name = renderValue(member.name ?? "Crew member");
  const highlights = Array.isArray(bio.highlights) ? bio.highlights : [];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-[18px] border border-[#E3E0DA] bg-[#F6F5F2]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={name} className="aspect-[4/5] w-full object-cover object-top" />
          ) : null}
        </div>
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
            {renderValue(member.jobTitle ?? member.role ?? "JVTO crew")}
          </p>
          <h2 className="mt-2 text-3xl font-black text-jvto-navy">{name}</h2>
          {renderValue(bio.about) ? (
            <p className="mt-4 text-[15px] leading-relaxed text-[#6b7280]">
              {renderValue(bio.about)}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {highlights.map((item, index) => (
              <span
                key={index}
                className="rounded-full bg-[#8CC63F]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-jvto-navy"
              >
                {renderValue(item)}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3 text-sm text-[#6b7280] md:grid-cols-2">
            {(
              [
              ["Languages", bio.languages ?? (member.languages as unknown[])],
              ["KTA", (member.kta as JsonRecord | undefined)?.id],
              ["Instagram", bio.instagram],
              ["Facebook", bio.facebook],
              ] satisfies Array<[string, unknown]>
            ).map(([label, value]) =>
              value ? (
                <p key={label}>
                  <span className="mr-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#9ca3af]">
                    {label}
                  </span>
                  {/^https?:\/\//i.test(renderValue(value)) ? (
                    <a
                      href={renderValue(value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jvto-orange"
                    >
                      Open profile
                    </a>
                  ) : (
                    renderValue(value)
                  )}
                </p>
              ) : null,
            )}
          </div>
        </div>
      </section>

      {featuredReviews.length ? (
        <section>
          <h2 className="mb-4 text-[22px] font-black text-jvto-navy">
            Featured reviews
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredReviews.map((review, index) => {
              const media = Array.isArray(review.media) ? (review.media as JsonRecord[]) : [];
              const reviewUrl = renderValue(review.originalReviewUrl);
              return (
                <div
                  key={renderValue(review.reviewId) || index}
                  className="rounded-[16px] border border-[#E3E0DA] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-jvto-navy">
                        {renderValue(review.reviewerName)}
                      </h3>
                      <p className="text-xs text-[#6b7280]">
                        {renderValue(review.date)} - {renderValue(review.star)} stars
                      </p>
                    </div>
                    {reviewUrl ? (
                      <a
                        href={reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-jvto-orange"
                      >
                        Original
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#6b7280]">
                    {renderValue(review.reviewExcerpt)}
                  </p>
                  {review.package && typeof review.package === "object" ? (
                    <p className="mt-3 text-xs text-[#6b7280]">
                      <span className="font-semibold text-jvto-navy">Package:</span>{" "}
                      {renderValue((review.package as JsonRecord).name)}
                    </p>
                  ) : null}
                  {media.length ? (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {media.slice(0, 4).map((item, mediaIndex) => {
                        const src = renderValue(item.thumbnailUrl);
                        return src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={renderValue(item.id) || mediaIndex}
                            src={src}
                            alt=""
                            className="aspect-square rounded-[10px] object-cover"
                            loading="lazy"
                          />
                        ) : null;
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="flex flex-col gap-3 sm:flex-row">
          {related.map((item, index) => (
            <LinkButton key={index} href={renderValue(item.href || "#")}>
              {renderValue(item.label ?? "Open")}
              <ArrowRight />
            </LinkButton>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function PageContent({ page }: { page: EcosystemStaticPage }) {
  const payload = payloadFor(page);
  if (payload.type === "crew_profile") return <CrewProfile payload={payload} />;
  if (page.body) return <MarkdownRendererTravelGuide markdown={page.body} />;
  return (
    <>
      {page.lede?.length ? (
        <div className="mb-10 space-y-3 text-[16px] leading-relaxed text-[#6b7280]">
          {page.lede.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}
      <StructuredSections sections={page.sections} />
    </>
  );
}

export async function generateEcosystemContentMetadata(
  route: string,
  type: "article" | "website" = "article",
): Promise<Metadata> {
  const page = await getEcosystemWebsitePage(route);
  if (!page) return { title: "Page Not Found" };
  return buildEcosystemRouteMetadata(page, type);
}

export async function generateEcosystemContentStaticParams(
  prefix: "/policy" | "/why-jvto" | "/why-jvto/our-team",
) {
  const index = await getEcosystemWebsiteRoutes();
  const baseDepth = routeDepth(prefix);
  return (index.routes ?? [])
    .map((item) => normalizeRoute(item.route))
    .filter(
      (route) =>
        route.startsWith(`${prefix}/`) && routeDepth(route) === baseDepth + 1,
    )
    .map((route) => ({ slug: route.replace(`${prefix}/`, "") }));
}

export async function EcosystemContentPage({
  route,
  sectionLabel,
  eyebrow,
  navBase,
  extraSchemas = [],
  cta,
}: EcosystemContentPageProps) {
  const [page, navItems] = await Promise.all([
    getEcosystemWebsitePage(route),
    getSectionNav(navBase),
  ]);

  if (!page || page.meta.status !== "published") return notFound();

  const faqItems = collectFaqs(page);
  const currentHref = page.meta.route;
  const pageRow = pageRowFor(page);
  const heroMeta = heroMetaFor(page);
  const title = heroHeadingFor(page);
  const description = heroDescriptionFor(page);
  const schemas = [faqSchemaFor(page, faqItems), ...extraSchemas].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={schemas as any}
        suppressCmsFaq
      />

      <section className="relative overflow-hidden bg-jvto-navy pt-24 pb-28 md:pt-36 md:pb-36">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="transition-colors hover:text-white/70">
              Home
            </Link>
            <span>/</span>
            {currentHref === navBase ? (
              <span className="text-white/70">{sectionLabel}</span>
            ) : (
              <>
                <Link
                  href={navBase}
                  prefetch={false}
                  className="transition-colors hover:text-white/70"
                >
                  {sectionLabel}
                </Link>
                <span>/</span>
                <span className="text-white/70">{page.meta.title}</span>
              </>
            )}
          </nav>
          <div className="grid items-start gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {eyebrow ?? sectionLabel}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  JVTO / {formatLabel(page.meta.section)}
                </span>
              </div>
              <h1
                className="mb-5 text-4xl font-black leading-[0.98] text-white md:text-6xl"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {title}
              </h1>
              <p className="max-w-[54ch] text-[17px] font-light leading-relaxed text-white/60">
                {description}
              </p>
            </div>
            <div className="self-start rounded-[20px] border border-white/10 bg-white/[0.04] p-6 md:mt-6">
              {heroMeta.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-white/10 py-3.5 last:border-0"
                >
                  <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {label}
                  </span>
                  <strong className="break-words text-right text-sm font-semibold text-white">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-[2] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-[#F6F5F2] py-16 md:py-24"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[220px_1fr] md:gap-16">
            <aside className="self-start md:sticky md:top-24">
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange">
                {sectionLabel}
              </p>
              <nav className="space-y-0.5">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                      href === currentHref
                        ? "bg-jvto-navy text-white"
                        : "text-[#6b7280] hover:bg-white hover:text-jvto-navy"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </aside>

            <article className="min-w-0 rounded-[20px] border border-[#E3E0DA] bg-white p-8 md:p-12">
              <PageContent page={page} />

              {page.faq?.length ? (
                <Faq
                  items={page.faq.map((item) => ({
                    q: item.question,
                    a: item.answer,
                  }))}
                  title="Frequently asked"
                />
              ) : null}
            </article>
          </div>
        </div>
      </section>

      {cta ? (
        <section
          className="relative z-[3] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-jvto-navy py-20 md:py-28"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
        >
          <div className="mx-auto max-w-6xl px-6 text-center md:px-8">
            <h2
              className="mb-8 font-black leading-[1.02] text-white"
              style={{
                fontFamily: "Raleway, Inter, sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
              }}
            >
              {cta.title}
            </h2>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href={cta.primaryHref} variant="primary">
                {cta.primaryLabel}
                <ArrowRight />
              </LinkButton>
              {cta.secondaryHref && cta.secondaryLabel ? (
                <LinkButton href={cta.secondaryHref}>
                  {cta.secondaryLabel}
                  <ArrowRight />
                </LinkButton>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
