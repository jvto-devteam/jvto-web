// src/app/(website)/contact/page.tsx
//
// MILESTONE 2 (2026-08-09): /contact is served from the static-content SSOT
// (content/pages/contact/index.json). Title, description, the H1, the hero lede,
// the production canonical, and the evergreen reference narrative (contact
// methods, support hours, office address, legal entity) all read from content/;
// this file keeps layout + the JSON-LD projection of that content.
//
// The interactive shell (ContactPage: channel tiles, BookingForm, response
// standard) is unchanged — it renders the same hardcoded UI as before.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "@/components/website/ContactPage";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import { loadStaticPage, staticRouteCanonical, type StaticPage } from "@/lib/static-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const ROUTE = "/contact";

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs from content/. */
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

  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;

  return {
    title,
    description,
    alternates: {
      canonical: staticRouteCanonical(ROUTE),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/contact`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/contact.webp",
          width: 1200,
          height: 630,
          alt: page.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/contact.webp"],
    },
  };
}

export default async function Contact() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const sections = page.sections;

  return (
    <>
      <PageJsonLdCombined pageRow={staticPageRow(page) as any} suppressCmsFaq />
      <ContactPage
        title={page.meta.title}
        description={page.lede?.[0] ?? page.meta.description}
      />

      {/* Evergreen reference narrative from content/pages/contact/index.json. */}
      <section className="bg-jvto-off py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-8 flex flex-col gap-10">
          {sections.map((sec) => (
            <div key={sec.id} id={sec.id} style={{ scrollMarginTop: "7rem" }}>
              {sec.title && (
                <h2 className="text-2xl font-bold text-jvto-navy mb-4">{sec.title}</h2>
              )}
              {sec.blocks ? (
                <BlocksRenderer blocks={sec.blocks as never} sectionId={sec.id} />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
