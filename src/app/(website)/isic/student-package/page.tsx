// src/app/(website)/isic/student-package/page.tsx
//
// MILESTONE 2 (2026-08-09): served from the static-content SSOT
// (content/pages/isic/student-package.json). Every evergreen string on the page —
// hero badge label, the "What is ISIC?" narrative, the verification steps, the
// package-section heading/intro, the student-package features, the ISIC-card CTA,
// the apply steps, and the inclusions/exclusions lists — now reads from content/.
// This file keeps layout, styling, icons, and image assets only.
//
// STAYS DYNAMIC: the package cards (getPublicPackageList, category 2) and the
// ItemList JSON-LD built from them; the ISIC provider ID + verify-directory URL and
// the NIB, which are operational config (SITE_CONFIG), not narrative.
// No FAQ is rendered on this route today, so no FAQ set was created and
// `suppressCmsFaq` keeps any legacy CMS FAQ from being injected.
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import TourCard from "@/components/website/TourCard";
import Button from "@/components/website/UI/Button";
import { ListTourPackage } from "@/types";
import Image from "next/image";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  ShieldCheck,
  Users,
  Ticket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  loadStaticPage,
  staticRouteCanonical,
  type StaticPage,
} from "@/lib/static-content";

export const revalidate = 3600;

const ROUTE = "/isic/student-package";

// ─── Content access helpers (throw at build so missing copy fails SSG rather than
//     silently dropping narrative — parity with the destinations/why-jvto hubs). ───
type Section = NonNullable<StaticPage["sections"]>[number];

function requireSection(page: StaticPage, id: string): Section {
  const sec = page.sections?.find((s) => s.id === id);
  if (!sec) {
    throw new Error(
      `${ROUTE}: required section "${id}" missing from content/pages/isic/student-package.json`,
    );
  }
  return sec;
}

function sectionText(sec: Section, key: string): string {
  const v = (sec as Record<string, unknown>)[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`${ROUTE}: section "${sec.id}" is missing text field "${key}"`);
  }
  return v;
}

function gridItems<T>(sec: Section, role: string): T[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as Record<string, unknown>).role === role,
  );
  if (!block) {
    throw new Error(`${ROUTE}: section "${sec.id}" is missing its grid block (role="${role}")`);
  }
  return (block as { items: unknown[] }).items as T[];
}

type LabelItem = { key: string; label: string; value?: string };
type CopyItem = { key: string; title: string; body: string };
type FeatureItem = CopyItem & { icon: string };
type LinkItem = { key: string; label: string; href: string };

function itemByKey<T extends { key: string }>(items: T[], key: string, sectionId: string): T {
  const item = items.find((i) => i.key === key);
  if (!item) {
    throw new Error(`${ROUTE}: section "${sectionId}" has no item "${key}"`);
  }
  return item;
}

const FEATURE_ICONS: Record<string, typeof Users> = {
  users: Users,
  ticket: Ticket,
  "shield-check": ShieldCheck,
};

const APPLY_STEP_IMAGES: Record<string, { src: string; alt: string }> = {
  "choose-adventure": { src: "/assets/img/isic/isic-step-1.jpg", alt: "Step 1" },
  "fill-details": { src: "/assets/img/isic/isic-step-2.jpg", alt: "Step 2" },
  "apply-verify": { src: "/assets/img/isic/isic-step-3.jpg", alt: "Step 3" },
};

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

async function getAllTours(): Promise<ListTourPackage[]> {
  return getPublicPackageList({ categoryId: 2, limit: 8 });
}

export default async function IsicStudentPackagePage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const studentPackages = await getAllTours();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";

  // ── Content sections (evergreen copy) ───────────────────────────────────────
  const hero = requireSection(page, "hero");
  const whatIsIsic = requireSection(page, "what-is-isic");
  const verification = requireSection(page, "how-verification-works");
  const packagesSection = requireSection(page, "packages");
  const studentPackageSection = requireSection(page, "what-is-student-package");
  const needCard = requireSection(page, "need-isic-card");
  const howToApply = requireSection(page, "how-to-apply");
  const inclusions = requireSection(page, "inclusions");

  const heroBadge = gridItems<LabelItem>(hero, "hero-badge");
  const providerFacts = gridItems<LabelItem>(whatIsIsic, "provider-facts");
  const steps = gridItems<CopyItem>(verification, "steps");
  const emptyState = gridItems<LabelItem>(packagesSection, "empty-state");
  const features = gridItems<FeatureItem>(studentPackageSection, "features");
  const needCardLinks = gridItems<LinkItem>(needCard, "cta-links");
  const applySteps = gridItems<CopyItem>(howToApply, "apply-steps");
  const included = gridItems<LabelItem>(inclusions, "included");
  const notIncluded = gridItems<LabelItem>(inclusions, "not-included");

  const providerFact = itemByKey(providerFacts, "provider", whatIsIsic.id);
  const providerIdFact = itemByKey(providerFacts, "provider-id", whatIsIsic.id);
  const directoryFact = itemByKey(providerFacts, "verify-directory", whatIsIsic.id);
  const buyCardLink = itemByKey(needCardLinks, "buy-isic", needCard.id);

  // ── Dynamic: the package list drives the ItemList JSON-LD, exactly as before ──
  const packageListSchema = {
    "@type": "ItemList",
    "@id": `${siteUrl}${ROUTE}#packages`,
    name: "ISIC student packages",
    numberOfItems: studentPackages.length,
    itemListElement: studentPackages.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/${tour.slug}`,
      name: tour.name,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={[packageListSchema]}
        suppressCmsFaq
      />
      <main className="flex-grow">

        {/* ================= HERO SECTION ================= */}
        <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center text-center text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo6.webp" // Replace with your hero image path
              alt="Students at Mount Bromo"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-jvto-navy/60" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-6">
              {itemByKey(heroBadge, "provider", hero.id).label}{" "}
              {SITE_CONFIG.reviewLinks.isicProviderId}
            </span>
            <h1 className="font-black text-4xl md:text-6xl tracking-tight mb-4 drop-shadow-lg">
              {page.meta.title}
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-3xl drop-shadow-md">
              {page.lede?.[0] ?? page.meta.description}
            </p>
          </div>
        </section>

        {/* ================= WHAT IS ISIC — provider ID + verified facts ================= */}
        <section className="py-14 md:py-16 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-start max-w-5xl mx-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-4">
                  {sectionText(whatIsIsic, "eyebrow")}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  {sectionText(whatIsIsic, "body_1")}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {sectionText(whatIsIsic, "body_2")}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-1">{providerFact.label}</p>
                  <p className="font-semibold text-foreground">{providerFact.value}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-1">{providerIdFact.label}</p>
                  <p className="font-semibold text-foreground">{SITE_CONFIG.reviewLinks.isicProviderId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-1">{directoryFact.label}</p>
                  <a href={SITE_CONFIG.reviewLinks.isic} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline break-words text-sm">
                    isic.org/discounts/?providerId={SITE_CONFIG.reviewLinks.isicProviderId}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW VERIFICATION WORKS ================= */}
        <section className="py-14 md:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-8">
                {sectionText(verification, "eyebrow")}
              </p>
              <ol className="space-y-6">
                {steps.map((step, i) => (
                  <li key={step.key} className="flex gap-5">
                    <span className="font-mono text-xs font-bold text-jvto-orange pt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ================= EXCLUSIVE PACKAGES GRID ================= */}
        <section className="py-16 md:py-24 bg-background" id="packages">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-black text-3xl md:text-4xl text-foreground mb-4">
                {sectionText(packagesSection, "heading")}
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {sectionText(packagesSection, "body_text")}
              </p>
            </div>

            {studentPackages.length > 0 ? (
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {studentPackages.map((tour) => (
                    <div key={tour.id} className="h-full">
                      <TourCard tour={tour} />
                    </div>
                  ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/20 rounded-sm">
                    <p className="text-muted-foreground">
                      {itemByKey(emptyState, "empty", packagesSection.id).label}
                    </p>
                </div>
            )}
          </div>
        </section>

        {/* ================= WHAT IS STUDENT PACKAGE? ================= */}
        {/* Adapting original "What Stays the Same" content to the design's icon layout */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-black text-3xl text-foreground">
                {sectionText(studentPackageSection, "heading")}{" "}
                <span className="text-primary">{sectionText(studentPackageSection, "heading_accent")}</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                {sectionText(studentPackageSection, "intro_before")}{" "}
                <strong>{sectionText(studentPackageSection, "intro_emphasis")}</strong>{" "}
                {sectionText(studentPackageSection, "intro_after")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature) => {
                const Icon = FEATURE_ICONS[feature.icon] ?? ShieldCheck;
                return (
                  <div
                    key={feature.key}
                    className="bg-background border border-border p-8 rounded-sm text-center flex flex-col items-center shadow-sm"
                  >
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                      <Icon size={40} />
                    </div>
                    <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= NEED AN ISIC CARD? SECTION ================= */}
        <section className="py-16 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 bg-muted/30 rounded-sm p-8 md:p-12 relative">

              {/* Left Column: Image & Card Graphic */}
              <div className="flex-1 relative w-full max-w-md md:max-w-none">
                <div className="relative z-10">
                  <Image
                    src="https://legacy.javavolcano-touroperator.com/assets/img/isic-card.png" // Replace with student & card graphic
                    alt="Student with ISIC Card"
                    width={500}
                    height={400}
                    className="w-full h-auto object-contain"
                  />
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-0" />
              </div>

              {/* Right Column: Content */}
              <div className="flex-1 text-left">
                <h2 className="font-black text-3xl md:text-4xl text-foreground mb-6">
                  {sectionText(needCard, "heading")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {sectionText(needCard, "body_text")}
                </p>
                <Button size="lg" className="w-full md:w-auto">
                  <a href={buyCardLink.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    {buyCardLink.label} <ArrowRight size={20} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW TO APPLY (VISUAL STEPS) ================= */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-black text-3xl md:text-4xl text-center mb-16 text-foreground">
              {sectionText(howToApply, "heading")}
            </h2>

            <div className="flex flex-col gap-16 md:gap-24 max-w-5xl mx-auto">
              {applySteps.map((step, i) => {
                const image = APPLY_STEP_IMAGES[step.key];
                const reverse = i % 2 === 1;
                return (
                  <div
                    key={step.key}
                    className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}
                  >
                    <div className="flex-1 flex justify-center">
                      <div className="relative w-64 shadow-xl rounded-[2rem] overflow-hidden border-4 border-muted">
                        {image ? (
                          <Image src={image.src} alt={image.alt} width={256} height={512} className="w-full h-auto" />
                        ) : null}
                      </div>
                    </div>
                    <div
                      className={`flex-1 flex flex-col ${
                        reverse ? "items-start md:items-end text-left md:text-right" : "items-start"
                      }`}
                    >
                      <span className="text-8xl font-black text-muted/30 leading-none mb-4">{i + 1}</span>
                      <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                      <p className="text-muted-foreground text-lg">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SAME INCLUSIONS AS STANDARD ================= */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 max-w-5xl mx-auto">
              <div>
                <h2 className="font-black text-2xl md:text-3xl text-foreground mb-6">
                  {sectionText(inclusions, "heading")}{" "}
                  <span className="text-jvto-orange">{sectionText(inclusions, "heading_accent")}</span>
                </h2>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item.key} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className="text-jvto-lime mt-0.5 shrink-0" />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3">
                    {sectionText(inclusions, "not_included_label")}
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {notIncluded.map((item) => (
                      <li key={item.key}>{item.label}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-jvto-lime/30 bg-jvto-lime/5 p-5">
                  <p className="text-sm text-foreground">
                    <strong>{sectionText(inclusions, "notice_lead")}</strong>{" "}
                    {sectionText(inclusions, "notice_body")}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground">
                    {sectionText(inclusions, "operator_line_prefix")}{" "}
                    {SITE_CONFIG.registrationNumber}{" "}
                    {sectionText(inclusions, "operator_line_suffix")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
