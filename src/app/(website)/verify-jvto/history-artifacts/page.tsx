// src/app/(website)/verify-jvto/history-artifacts/page.tsx
//
// PACKAGE 06 (2026-08-06): served from the static-content SSOT
// (content/pages/verify-jvto/history-artifacts.json). Copy, SEO, and FAQ come from
// content/; this file keeps only layout + the JSON-LD projection. The evidence
// locker (VerifyJvtoClient + getDocsByGroup) remains its own Master_Dataset SSOT.
//
// The timeline Event graph below is kept here (not in content/) because it is
// structured JSON-LD, not prose. The Stefan Loose anchor is deliberately YEAR-FREE
// (no startDate, no "2016" @id fragment): per docs/CANONICAL_FACTS.md the guidebook
// citation asserts no publication year or edition.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerifyJvtoClient from "../VerifyJvtoClient";
import VerifyNarrative, { staticPageRow, buildStaticFaqSchema } from "../verifyShared";
import { getDocsByGroup } from "@/lib/data-loader";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { loadStaticPage } from "@/lib/static-content";

export const revalidate = 86400;

const ROUTE = "/verify-jvto/history-artifacts";
const BREADCRUMB_LABEL = "History & Artifacts";
const BASE_URL = "https://javavolcano-touroperator.com";

const HISTORY_TIMELINE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${BASE_URL}/verify-jvto/history-artifacts#timeline`,
  name: "JVTO Operational History Timeline",
  description:
    "Documented history of Java Volcano Tour Operator from the 2015 guesthouse era through PT formalization and current operations.",
  itemListOrder: "ItemListOrderAscending",
  numberOfItems: 5,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2015-booking`,
        name: "Booking.com Guest Review Award 2015",
        startDate: "2015",
        description:
          "Independent guest review award (score 9.4/10) issued by Booking.com to the guesthouse operated at Jl. Khairil Anwar 102A, Bondowoso — earliest independently-verified signal of JVTO operations.",
        organizer: {
          "@type": "Organization",
          name: "Booking.com",
          url: "https://www.booking.com",
        },
        about: { "@id": `${BASE_URL}/#organization` },
        image: [
          `${BASE_URL}/history/booking-2015-plaque.jpg`,
          `${BASE_URL}/history/booking-2015-shipping-label.jpg`,
        ],
        location: {
          "@type": "Place",
          name: "Jl. Khairil Anwar 102A, Bondowoso",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. Khairil Anwar No. 102A",
            addressLocality: "Bondowoso",
            addressRegion: "East Java",
            addressCountry: "ID",
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-guesthouse-stefan-loose`,
        name: "Stefan Loose European Travel Guide — First Editorial Mention",
        description:
          "The earliest independent editorial citation of the founder as operator for Ijen tours, appearing in a European travel guide — pre-digital third-party corroboration from the guesthouse era. Publication year and edition are not asserted.",
        about: { "@id": `${BASE_URL}/#organization` },
        image: [
          `${BASE_URL}/history/stefan-loose-ijen-bondowoso-page.png`,
          `${BASE_URL}/history/stefan_loose_crop_enh.jpg`,
          `${BASE_URL}/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg`,
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2021-detik`,
        name: "Detik.com National Press Coverage — Tourist Police Context",
        startDate: "2021-03-14",
        description:
          "National-reach Indonesian press article identifying the founder by rank (Bripka Agung Sambuko) in his Tourist Police capacity — independently confirming the police-led model JVTO is built on.",
        about: { "@id": `${BASE_URL}/#organization` },
        mentions: [{ "@id": `${BASE_URL}/#agung-sambuko` }],
        url: "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2023-pt`,
        name: "PT Java Volcano Rendezvous Formalized",
        startDate: "2023-02",
        description:
          "PT formalization: NIB 1102230032918 registered via OSS Indonesia and TDUP (tourism business licence) issued 2023-02-11 by Kementerian Pariwisata dan Ekonomi Kreatif.",
        about: { "@id": `${BASE_URL}/#organization` },
        url: "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-today-active`,
        name: "Active Licensed Operator — Police-Led",
        description:
          "PT Java Volcano Rendezvous operates today under NIB + TDUP (No. 1102230032918), HPWKI-certified guides, a registered ISIC provider listing (259268), and an INDECON network listing — all verifiable via public registries.",
        about: { "@id": `${BASE_URL}/#organization` },
        mentions: [{ "@id": `${BASE_URL}/#agung-sambuko` }],
      },
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

export default async function VerifyHistoryArtifactsPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const docs = getDocsByGroup("historyArtifacts");
  const faqItems = page.faq ?? [];
  const faqNode = faqItems.length ? buildStaticFaqSchema(ROUTE, faqItems) : null;

  const extraSchemas = [
    buildVerifySubpageSchema({
      pathname: ROUTE,
      title: page.meta.title,
      description: page.meta.description,
      breadcrumbLabel: BREADCRUMB_LABEL,
      docs,
    }),
    HISTORY_TIMELINE_SCHEMA,
    faqNode,
  ].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={extraSchemas}
        suppressCmsFaq
      />
      <VerifyJvtoClient
        initialDocs={docs}
        heroTitle={page.meta.title}
        heroDescription={page.lede?.[0]}
      />
      <VerifyNarrative page={page} />
    </>
  );
}
