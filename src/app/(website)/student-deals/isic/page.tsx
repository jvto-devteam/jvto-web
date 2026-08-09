// src/app/(website)/student-deals/isic/page.tsx
//
// MILESTONE 2 (2026-08-09): served from the static-content SSOT
// (content/pages/isic/student-deals.json). Headings, card/notice copy, and the two
// hub links now read from content/; this file keeps layout and the UI primitives.
//
// STAYS DYNAMIC: the official ISIC listing URL, still resolved at render time from
// the review-platforms proof data (getReviewPlatforms) — content stores only the
// section heading and the platform-name prefix used to find that entry.
// No FAQ is rendered on this route today, so no FAQ set was created and
// `suppressCmsFaq` keeps any legacy CMS FAQ from being injected.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { ButtonLink, Container, Divider, Grid, H1, Lead, Card, Section, Notice } from "@/components/ui";
import { getReviewPlatforms } from "@/lib/why-ssot";
import {
  loadStaticPage,
  staticRouteCanonical,
  type StaticPage,
} from "@/lib/static-content";

export const revalidate = 86400;

const ROUTE = "/student-deals/isic";

// ─── Content access helpers (throw at build so missing copy fails SSG rather than
//     silently dropping narrative — parity with the destinations/why-jvto hubs). ───
type Section = NonNullable<StaticPage["sections"]>[number];

function requireSection(page: StaticPage, id: string): Section {
  const sec = page.sections?.find((s) => s.id === id);
  if (!sec) {
    throw new Error(
      `${ROUTE}: required section "${id}" missing from content/pages/isic/student-deals.json`,
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

type LinkItem = { key: string; href: string; label: string; variant?: string };
type CardItem = { key: string; title?: string; body: string };
type NoticeItem = { key: string; title: string; body: string };
type ExternalLinkItem = { key: string; platform_prefix: string };

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

export default async function ISICStudentDealsPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const hubLinks = gridItems<LinkItem>(requireSection(page, "hub-links"), "cta-links");
  const signals = requireSection(page, "what-isic-signals");
  const verification = requireSection(page, "how-verification-works");
  const whyItMatters = requireSection(page, "why-it-matters");
  const officialListing = requireSection(page, "official-listing");

  const signalCards = gridItems<CardItem>(signals, "cards");
  const verificationNotices = gridItems<NoticeItem>(verification, "notices");
  const whyCards = gridItems<CardItem>(whyItMatters, "cards");
  const listingSource = gridItems<ExternalLinkItem>(officialListing, "external-link")[0];

  // Dynamic: the ISIC listing URL comes from the review-platforms proof data.
  const platforms = getReviewPlatforms();
  const isicListing = listingSource
    ? platforms.find((p) => p.platform.startsWith(listingSource.platform_prefix))?.url
    : undefined;

  return (
    <Container>
      <PageJsonLdCombined pageRow={staticPageRow(page)} suppressCmsFaq />

      <H1>{page.meta.title}</H1>
      <Lead>{page.lede?.[0] ?? page.meta.description}</Lead>

      <div className="mt-6 flex flex-wrap gap-3">
        {hubLinks.map((link) =>
          link.variant === "secondary" ? (
            <ButtonLink key={link.key} variant="secondary" href={link.href}>
              {link.label}
            </ButtonLink>
          ) : (
            <ButtonLink key={link.key} href={link.href}>
              {link.label}
            </ButtonLink>
          ),
        )}
      </div>

      <Divider />

      <Section title={sectionText(signals, "title")}>
        {signalCards.map((card) => (
          <Card key={card.key}>{card.body}</Card>
        ))}
      </Section>

      <Section title={sectionText(verification, "title")}>
        {verificationNotices.map((notice) => (
          <Notice key={notice.key} title={notice.title}>
            {notice.body}
          </Notice>
        ))}
      </Section>

      <Section title={sectionText(whyItMatters, "title")}>
        <Grid>
          {whyCards.map((card) => (
            <Card key={card.key} title={card.title}>
              {card.body}
            </Card>
          ))}
        </Grid>
      </Section>

      {isicListing ? (
        <Section title={sectionText(officialListing, "title")}>
          <a className="break-all underline underline-offset-4" href={isicListing} target="_blank" rel="noreferrer">
            {isicListing}
          </a>
        </Section>
      ) : null}
    </Container>
  );
}
