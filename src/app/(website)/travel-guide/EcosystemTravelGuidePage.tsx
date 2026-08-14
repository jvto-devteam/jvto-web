import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
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

const GUIDE_NAV_FALLBACK = [
  { href: "/travel-guide", label: "Guide overview" },
  {
    href: "/travel-guide/ijen-health-screening",
    label: "Ijen Health Screening",
  },
  {
    href: "/travel-guide/mount-bromo-logistics",
    label: "Mount Bromo Logistics",
  },
  {
    href: "/travel-guide/tumpak-sewu-logistics",
    label: "Tumpak Sewu Logistics",
  },
  { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  { href: "/travel-guide/weather-and-closures", label: "Weather & Closures" },
  { href: "/travel-guide/safety-on-tours", label: "Safety on Tours" },
  { href: "/travel-guide/booking-information", label: "Booking Information" },
  {
    href: "/travel-guide/police-escort-for-groups",
    label: "Police Escort for Groups",
  },
  {
    href: "/travel-guide/rijik-monthly-closure",
    label: "Ijen Rijik Monthly Closure",
  },
  { href: "/travel-guide/best-time-to-visit", label: "Best Time to Visit" },
  { href: "/travel-guide/faq", label: "FAQ" },
];

const NAV_ORDER = new Map(
  GUIDE_NAV_FALLBACK.map((item, index) => [item.href, index]),
);
const HIDDEN_TRAVEL_GUIDE_ROUTES = new Set(["/travel-guide/packing-list"]);

function labelFromRoute(route: string): string {
  if (route === "/travel-guide") return "Guide overview";
  return route
    .replace("/travel-guide/", "")
    .split("-")
    .map((part) =>
      part === "faq" ? "FAQ" : part[0]?.toUpperCase() + part.slice(1),
    )
    .join(" ");
}

async function getTravelGuideNav() {
  const index = await getEcosystemWebsiteRoutes();
  const routeItems = (index.routes ?? [])
    .filter(
      (item) =>
        (item.route === "/travel-guide" ||
          item.route.startsWith("/travel-guide/")) &&
        !HIDDEN_TRAVEL_GUIDE_ROUTES.has(item.route),
    )
    .map((item) => ({
      href: item.route,
      label:
        GUIDE_NAV_FALLBACK.find((fallback) => fallback.href === item.route)
          ?.label ?? labelFromRoute(item.route),
    }));

  if (!routeItems.length) return GUIDE_NAV_FALLBACK;

  return routeItems.sort((a, b) => {
    const aOrder = NAV_ORDER.get(a.href) ?? 100;
    const bOrder = NAV_ORDER.get(b.href) ?? 100;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.label.localeCompare(b.label);
  });
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

function faqSchemaFor(page: EcosystemStaticPage, extraFaqs = page.faq ?? []) {
  if (!extraFaqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${page.canonicalUrl}#faq`,
    mainEntity: extraFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function itemTitle(item: Record<string, unknown>): string {
  const raw =
    item.title ??
    item.name ??
    item.label ??
    item.question ??
    item.month ??
    item.key ??
    "Item";
  return String(raw);
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
    const record = value as Record<string, unknown>;
    return Object.entries(record)
      .filter(
        ([, entry]) => entry !== undefined && entry !== null && entry !== "",
      )
      .map(([key, entry]) => `${key}: ${String(entry)}`)
      .join(" / ");
  }
  return String(value ?? "");
}

function structuredPayload(page: EcosystemStaticPage): Record<string, unknown> {
  const payload = page.raw.page.content?.payload;
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : {};
}

function stringFromPayload(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function heroPayloadFor(page: EcosystemStaticPage): Record<string, unknown> {
  const payload = structuredPayload(page);
  return payload.hero && typeof payload.hero === "object"
    ? (payload.hero as Record<string, unknown>)
    : {};
}

function heroHeadingFor(page: EcosystemStaticPage): string {
  return stringFromPayload(heroPayloadFor(page).heading) ?? page.meta.title;
}

function heroEyebrowFor(page: EcosystemStaticPage): string {
  return (
    stringFromPayload(heroPayloadFor(page).eyebrow) ??
    formatLabel(page.raw.domain || page.meta.section)
  );
}

function heroSecondaryMetaFor(page: EcosystemStaticPage): string {
  return (
    stringFromPayload(heroPayloadFor(page).meta) ??
    formatLabel(page.raw.slug || page.raw.domain || page.meta.section)
      .toUpperCase()
      .replace(/\s+/g, " / ")
  );
}

function heroDescriptionFor(page: EcosystemStaticPage): string {
  return (
    stringFromPayload(heroPayloadFor(page).lede) ??
    stringFromPayload(structuredPayload(page).intro) ??
    page.meta.summary ??
    page.meta.description
  );
}

function heroMetaFor(page: EcosystemStaticPage) {
  const payload = structuredPayload(page);
  const quickFacts = payload.quickFacts;
  if (Array.isArray(quickFacts) && quickFacts.length) {
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

  return [];
}

function SeasonCards({ block }: { block: EcosystemGridBlock }) {
  const items = block.items ?? [];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => {
        const points = Array.isArray(item.points) ? item.points : [];
        return (
          <div
            key={index}
            className="rounded-xl border border-[#E3E0DA] bg-[#F6F5F2] p-5"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-jvto-orange">
              {renderValue(item.range)}
            </p>
            <h3 className="mt-1 text-lg font-black text-jvto-navy">
              {itemTitle(item)}
            </h3>
            <ul className="mt-4 space-y-2">
              {points.map((point, pointIndex) => {
                const pointRecord =
                  typeof point === "object" && point !== null
                    ? (point as Record<string, unknown>)
                    : { text: point };
                return (
                  <li
                    key={pointIndex}
                    className="flex gap-2 text-sm leading-relaxed text-[#6b7280]"
                  >
                    <span className="mt-1 text-jvto-orange">→</span>
                    <span>{renderValue(pointRecord.text)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function GenericGrid({ block }: { block: EcosystemGridBlock }) {
  const items = block.items ?? [];
  if (!items.length) return null;

  const isSimpleList = items.every((item) => {
    const keys = Object.keys(item);
    return (
      keys.includes("text") &&
      keys.every((key) => key === "text" || key === "label") &&
      (!item.label || /^\d+$/.test(String(item.label)))
    );
  });

  const isTimeline = items.every((item) => item.time && item.description);

  if (isTimeline) {
    return (
      <ol className="m-0 space-y-0 p-0">
        {items.map((item, index) => (
          <li
            key={`${item.time}-${index}`}
            className="flex gap-5 border-t border-[#E3E0DA] py-4 last:border-b"
          >
            <span className="w-14 flex-shrink-0 pt-0.5 font-mono text-[12px] font-bold text-jvto-orange">
              {renderValue(item.time)}
            </span>
            <span className="text-[15px] font-light leading-[1.6] text-[#6b7280]">
              {renderValue(item.description)}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (isSimpleList) {
    return (
      <ol className="m-0 space-y-3 p-0">
        {items.map((item, index) => (
          <li
            key={index}
            className="grid gap-x-4 border-t border-[#E3E0DA] py-4 last:border-b"
            style={{ gridTemplateColumns: "32px 1fr" }}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 font-mono text-[12px] font-bold text-jvto-orange">
              {index + 1}
            </span>
            <span className="pt-0.5 text-[15px] font-light leading-[1.6] text-[#6b7280]">
              {renderValue(item.text)}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  const isKeyValueList = items.every((item) => {
    const keys = Object.keys(item);
    return (
      keys.includes("key") &&
      keys.includes("value") &&
      keys.every((key) => key === "key" || key === "value")
    );
  });

  if (isKeyValueList) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#E3E0DA] bg-white p-5"
          >
            <h3 className="text-base font-black text-jvto-navy">
              {renderValue(item.key)}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
              {renderValue(item.value)}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => {
        const title = itemTitle(item);
        const rows = Object.entries(item).filter(
          ([key, value]) =>
            !["title", "name", "label", "question", "sweet"].includes(key) &&
            String(value) !== title &&
            value !== undefined &&
            value !== null &&
            value !== "",
        );

        return (
          <div
            key={index}
            className="rounded-xl border border-[#E3E0DA] bg-white p-5"
          >
            <h3 className="text-base font-black text-jvto-navy">{title}</h3>
            <div className="mt-3 space-y-2">
              {rows.map(([key, value]) => (
                <div key={key} className="flex gap-3 text-sm leading-relaxed">
                  <span className="min-w-20 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9ca3af]">
                    {formatLabel(key)}
                  </span>
                  <span className="text-[#6b7280]">{renderValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StructuredBlock({ block }: { block: EcosystemBlock }) {
  if (block.type === "grid") {
    if (block.role === "faq-list") {
      const items = (block.items ?? [])
        .filter((item) => item.question && item.answer)
        .map((item) => ({
          q: String(item.question),
          a: String(item.answer),
        }));
      return <Faq items={items} title={null} eyebrow={null} />;
    }

    if (block.role === "season-cards") {
      return <SeasonCards block={block} />;
    }

    return <GenericGrid block={block} />;
  }

  return <BlocksRenderer blocks={[block as any]} />;
}

function StructuredSections({ sections }: { sections?: EcosystemSection[] }) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.id}>
          {section.title && (
            <h2
              className="mb-4 text-[22px] font-black leading-tight text-jvto-navy md:text-[26px]"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {section.title}
            </h2>
          )}
          {section.body_md && (
            <MarkdownRendererTravelGuide markdown={section.body_md} />
          )}
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

export async function generateTravelGuideEcosystemMetadata(
  route: string,
  type: "article" | "website" = "article",
): Promise<Metadata> {
  const page = await getEcosystemWebsitePage(route);
  if (!page) return { title: "Page Not Found" };
  return buildEcosystemRouteMetadata(page, type);
}

export async function TravelGuideEcosystemPage({
  route,
}: {
  route: string;
}) {
  const [page, navItems] = await Promise.all([
    getEcosystemWebsitePage(route),
    getTravelGuideNav(),
  ]);

  if (!page || page.meta.status !== "published") return notFound();

  const faqItems = collectFaqs(page);
  const pageRow = pageRowFor(page);
  const h1 = heroHeadingFor(page);
  const description = heroDescriptionFor(page);
  const currentHref = page.meta.route;
  const heroMeta = heroMetaFor(page);
  const heroEyebrow = heroEyebrowFor(page);
  const heroSecondaryMeta = heroSecondaryMetaFor(page);
  const answerFirst =
    typeof page.raw.page.answerFirst === "string"
      ? page.raw.page.answerFirst.trim()
      : "";

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow}
        extraSchemas={[faqSchemaFor(page, faqItems)].filter(Boolean)}
        suppressCmsFaq={true}
      />

      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {heroEyebrow}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  {heroSecondaryMeta}
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
                {description}
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
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">
            <aside className="md:sticky md:top-24 self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Travel Guide
              </p>
              <nav className="space-y-0.5">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                      href === currentHref
                        ? "bg-jvto-navy text-white"
                        : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/tours"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Browse tours <ArrowRight />
              </Link>
            </aside>

            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              {page.body ? (
                <MarkdownRendererTravelGuide markdown={page.body} />
              ) : (
                <StructuredSections sections={page.sections} />
              )}

              {page.faq?.length ? (
                <Faq
                  items={page.faq.map((item) => ({
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
