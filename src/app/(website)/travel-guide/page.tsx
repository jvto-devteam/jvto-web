import { type Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "@/components/website/AppLink";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { DocumentPriorityNote } from "./document-priority-note";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Sidebar from "./sidebar";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { buildTgHubItemListSchema } from "@/lib/schemas/buildTravelGuideSchemas";
import {
  buildResolvedFaqSchema,
  resolveFaqsForPage,
} from "@/lib/content/resolveFaqs";

export const revalidate = 3600;

const today = new Date();

const formatted = today.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const travelGuideData = {
  route: "/travel-guide",
  seo: {
    title:
      "Travel Guide: Booking, Safety & Practical Info | Java Volcano Tour Operator",
    metaDescription:
      "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
  },
  h1: "Travel Guide: Booking, Safety & Practical Info",
  hero: {
    introParagraphs: [
      "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO).",
      "Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
    ],
    primaryCtas: [
      {
        label: "FAQ: Short Answers to Common Questions",
        href: "/travel-guide/faq",
      },
      {
        label: "Browse private tours",
        href: "/tours",
      },
    ],
  },
  latestUpdate: {
    title: "Latest JVTO Operations Update",
    fallback:
      "JVTO checks official volcanic activity sources and local access rules before departure. If weather, volcanic activity, or park instructions affect the route, we explain the change clearly and use the safest workable Plan B.",
    note:
      "Status data is generated from official MAGMA Indonesia / PVMBG reports and JVTO operating rules. Guests should still follow direct crew instructions on the day of travel.",
  },
  operatingStatus: {
    title: "JVTO Operating Status",
    paragraphs: [
      "JVTO operates private, pre-booked tours on standard East Java routes, subject to weather, volcanic activity, and access regulations.",
      "For volcano routes, we check MAGMA / PVMBG status, local park instructions, and field conditions before committing to the final route.",
      "Some viewpoints, hiking sections, crater areas, jeep routes, or waterfall access may be temporarily restricted even when the wider tour program continues.",
      "When conditions change, the first decision is safety. The second decision is value: we use reroutes, adjusted timing, alternative viewpoints, or Travel Credit according to the Weather & Closures and Booking, Payment & Cancellation policies.",
      "Guests should consult official travel advisories issued by their own governments in addition to this guide.",
    ],
  },
  toc: {
    title: "On This Page",
    items: [
      { id: "faq", label: "FAQ: Short Answers to Common Questions" },
      { id: "booking-information", label: "Booking & Payments" },
      { id: "ijen-health-screening", label: "Ijen Health Screening" },
      { id: "safety-on-tours", label: "Safety on Tours" },
      { id: "packing-and-fitness", label: "Packing & Fitness" },
      { id: "weather-and-closures", label: "Weather & Closures" },
      { id: "police-escort-for-groups", label: "Police Escort for Groups" },
    ],
  },
  panels: [
    {
      id: "faq",
      title: "FAQ: Short Answers to Common Questions",
      summaryParagraphs: [
        "Start here if you're not sure where to look. We answer the most common questions about private tours, what's included, payments, reschedules, and safety.",
      ],
      cta: {
        label: "Read FAQ",
        href: "/travel-guide/faq",
      },
    },
    {
      id: "booking-information",
      title: "Booking & Payments",
      summaryParagraphs: [
        "Details on how to book, deposits, final payments, Travel Credit, and why we don't offer cash refunds.",
      ],
      cta: {
        label: "Read Booking Information",
        href: "/travel-guide/booking-information",
      },
    },
    {
      id: "ijen-health-screening",
      title: "Ijen Health Screening",
      summaryParagraphs: [
        "How our health checks work for Ijen night hikes, what is included for JVTO guests, and how the digital system helps prevent fake certificates.",
      ],
      cta: {
        label: "Read Ijen Health Screening",
        href: "/travel-guide/ijen-health-screening",
      },
    },
    {
      id: "safety-on-tours",
      title: "Safety on Tours",
      summaryParagraphs: [
        "How we make decisions about safety on the road, at viewpoints, and on the mountain, including how we monitor conditions and when we change plans.",
        "Understand how safety is built into JVTO's private tours.",
      ],
      cta: {
        label: "Read Safety on Tours",
        href: "/travel-guide/safety-on-tours",
      },
    },
    {
      id: "packing-and-fitness",
      title: "Packing & Fitness",
      summaryParagraphs: [
        "What to pack for Bromo, Ijen and Tumpak Sewu, what kind of fitness you need, and a few tips to keep your belongings safe.",
        "This page helps you prepare realistically for your private tour.",
      ],
      cta: {
        label: "Read Packing & Fitness",
        href: "/travel-guide/packing-and-fitness",
      },
    },
    {
      id: "weather-and-closures",
      title: "Weather & Closures",
      summaryParagraphs: [
        "How rain, fog, or volcanic activity can affect your itinerary, which sources we follow, and what happens to your booking if part of the tour is closed.",
        "East Java's volcano and waterfall routes are dynamic. Weather and volcanic activity can change quickly.",
      ],
      cta: {
        label: "Read Weather & Closures",
        href: "/travel-guide/weather-and-closures",
      },
    },
    {
      id: "police-escort-for-groups",
      title: "Police Escort for Groups",
      summaryParagraphs: [
        "When and how official traffic police escort can be arranged for large groups, and why it is always done through formal channels.",
        "In some situations, large tourist groups may benefit from official traffic police escort: when moving several vehicles together through busy routes.",
      ],
      cta: {
        label: "Read Police Escort for Groups",
        href: "/travel-guide/police-escort-for-groups",
      },
    },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

type VolcanicStatusEntry = {
  status: "operational" | "restricted" | "closed";
  alert_level: string;
  alert_code: "level-1" | "level-2" | "level-3" | "level-4";
  last_verified: string;
  verified_by?: string;
  source: string;
  source_url: string;
  notes: string;
  tours_operating: boolean;
  exclusion_zone_active: boolean;
  exclusion_zone_radius_km?: number;
  pvmbg_report?: {
    visual_en?: string;
    climate_en?: string;
    recommendations_en?: string[];
    fetched_at?: string;
  };
};

type VolcanicStatusFile = {
  updated_at: string;
  update_frequency_hours?: number;
  note?: string;
  destinations: Record<string, VolcanicStatusEntry>;
};

const VOLCANIC_DESTINATION_LABELS: Record<string, string> = {
  "ijen-crater": "Ijen Crater",
  "mount-bromo": "Mount Bromo",
};

const STATUS_STYLES: Record<
  VolcanicStatusEntry["status"],
  { label: string; badge: string; dot: string }
> = {
  operational: {
    label: "Operational",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  restricted: {
    label: "Restricted",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    dot: "bg-amber-500",
  },
  closed: {
    label: "Closed",
    badge: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
};

function readVolcanicStatusFile(): VolcanicStatusFile | null {
  try {
    const statusPath = path.join(
      process.cwd(),
      "public",
      "ops",
      "volcanic-status.json",
    );
    const raw = fs.readFileSync(statusPath, "utf8");
    return JSON.parse(raw) as VolcanicStatusFile;
  } catch {
    return null;
  }
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = value.includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

function getStatusAgeHours(statusFile: VolcanicStatusFile) {
  const updatedAt = new Date(statusFile.updated_at);
  if (Number.isNaN(updatedAt.getTime())) return null;
  return Math.floor((Date.now() - updatedAt.getTime()) / (60 * 60 * 1000));
}

function getPrimaryPlanBMessage(entries: Array<[string, VolcanicStatusEntry]>) {
  const hasClosedRoute = entries.some(([, entry]) => !entry.tours_operating);
  if (hasClosedRoute) {
    return "One or more volcano routes are paused in the current status file. JVTO will confirm the safest reroute, replacement activity, or Travel Credit before departure.";
  }

  const hasRestriction = entries.some(
    ([, entry]) => entry.status === "restricted" || entry.exclusion_zone_active,
  );
  if (hasRestriction) {
    return "Tours can still operate where legal access remains open, but JVTO keeps guests outside exclusion zones and switches to approved viewpoints, timing changes, or route alternatives when needed.";
  }

  return "Current volcano routes are marked operational in the status file. JVTO still checks weather, visibility, gas conditions, and park instructions before the crew commits to the final route.";
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot("/travel-guide", {
    allowDatabaseFallback: false,
  });
  const title = page.snapshot.seo.title;
  const description =
    page.snapshot.seo.description ?? travelGuideData.seo.metaDescription;
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : "Travel Guide";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/travel-guide`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/travel-guide.webp",
          width: 1200,
          height: 630,
          alt: h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/travel-guide.webp"],
    },
  };
}

export default async function TravelGuideHubPage() {
  const [page, faqResolution] = await Promise.all([
    getPublicPageSnapshot("/travel-guide", {
      allowDatabaseFallback: false,
    }),
    resolveFaqsForPage("/travel-guide"),
  ]);
  const tgHubExtraSchemas = [
    buildTgHubItemListSchema(),
    buildResolvedFaqSchema(faqResolution, "/travel-guide"),
  ].filter(Boolean);
  const travelGuideSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": siteUrl + "/#organization",
        name: "Java Volcano Tour Operator (JVTO)",
        alternateName: "JVTO",
        url: siteUrl,
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        logo: siteUrl + "/assets/img/jvto-logo.png",
        image: [
          siteUrl + "/assets/img/jvto-logo.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        email: "hello@javavolcano-touroperator.com",
        telephone: "+62 822-4478-8833",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68214",
          postalCode: "68214",
          addressLocality: "Bondowoso",
          addressRegion: "East Java",
          addressCountry: "ID",
        },
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: "East Java",
          },
          {
            "@type": "Country",
            name: "Indonesia",
          },
          {
            "@type": "City",
            name: "Surabaya",
          },
          {
            "@type": "Place",
            name: "Bali",
          },
        ],
        identifier: [
          {
            "@type": "PropertyValue",
            name: "Business and tourism licence number",
            value: "1102230032918",
          },
        ],
        sameAs: [
          "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          "https://www.trustpilot.com/review/javavolcano-touroperator.com",
        ],
        founder: {
          "@type": "Person",
          name: "Agung Sambuko",
          alternateName: "Mr. Sam",
          jobTitle: "Tourist Police Officer",
          image:
            "https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png",
          description:
            "Founder of JVTO and active member of the East Java Tourist Police Unit (Ditpamobvit), specializing in tourist safety and risk management.",
          memberOf: {
            "@type": "GovernmentOrganization",
            name: "Indonesian National Police",
            alternateName: "Kepolisian Negara Republik Indonesia",
            subOrganization: {
              "@type": "GovernmentOrganization",
              name: "Ditpamobvit (Directorate of Vital Object Security)",
            },
            sameAs: [
              "https://www.wikidata.org/wiki/Q3103954",
              "https://polri.go.id/",
            ],
          },
          knowsAbout: [
            "TouristSafety",
            "EastJavaTourism",
            "VolcanoTrekking",
            "LogisticsManagement",
          ],
        },
        priceRange: "IDR 1.000.000 - IDR 9.050.000",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "07:30",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "08:00",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Monday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Tuesday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Wednesday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Thursday",
            opens: "08:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Friday",
            opens: "08:00",
            closes: "21:00",
          },
        ],
        geo: {
          "@type": "GeoCoordinates",
          latitude: -7.9161788,
          longitude: 113.8085868,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+62 822-4478-8833",
            email: "hello@javavolcano-touroperator.com",
            contactType: "customer support",
          },
        ],
        foundingDate: "2015-01-01",
        currenciesAccepted: "IDR",
        paymentAccepted: ["Credit Card", "Bank Transfer"],
      },
      {
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        url: siteUrl,
        name: "Java Volcano Tour Operator",
        publisher: {
          "@id": siteUrl + "/#organization",
        },
        inLanguage: "en",
        hasPart: [
          {
            "@id": siteUrl + "/travel-guide#webpage",
          },
        ],
      },
      {
        "@type": ["WebPage", "CollectionPage"],
        "@id": siteUrl + "/travel-guide#webpage",
        url: siteUrl + "/travel-guide",
        name: "Travel Guide: Booking, Safety & Practical Info",
        description:
          "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
        inLanguage: "en",
        isPartOf: {
          "@id": siteUrl + "/#website",
        },
        about: {
          "@id": siteUrl + "/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id": siteUrl + "/travel-guide#breadcrumb",
        },
        hasPart: [
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#faq`,
            name: "FAQ: Short Answers to Common Questions",
            description:
              "Answers to common questions about private tours, inclusions, and payments.",
            url: `${siteUrl}/travel-guide/faq`,
          },
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#booking-information`,
            name: "Booking & Payments",
            description:
              "Details on booking processes, deposits, and why we use Travel Credit.",
            url: `${siteUrl}/travel-guide/booking-information`,
          },
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#ijen-health-screening`,
            name: "Ijen Health Screening",
            description:
              "Information on mandatory health checks and QR-verified clearance for Ijen night hikes.",
            url: `${siteUrl}/travel-guide/ijen-health-screening`,
          },
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#safety-on-tours`,
            name: "Safety on Tours",
            description:
              "JVTO safety protocols for road travel, viewpoints, and mountain conditions.",
            url: `${siteUrl}/travel-guide/safety-on-tours`,
          },
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#packing-and-fitness`,
            name: "Packing & Fitness",
            description:
              "Practical advice on what to wear and fitness requirements for Bromo and Ijen.",
            url: `${siteUrl}/travel-guide/packing-and-fitness`,
          },
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#weather-and-closures`,
            name: "Weather & Closures",
            description:
              "How volcanic activity and weather affects itineraries and re-routing policies.",
            url: `${siteUrl}/travel-guide/weather-and-closures`,
          },
          {
            "@type": "WebPageElement",
            "@id": `${siteUrl}/travel-guide#police-escort-for-groups`,
            name: "Police Escort for Groups",
            description:
              "Information on official traffic police escort for large tourist groups.",
            url: `${siteUrl}/travel-guide/police-escort-for-groups`,
          },
        ],
        mainEntity: {
          "@id": siteUrl + "/travel-guide#help-topics",
        },
        datePublished: "2025-12-05",
        dateModified: "2026-01-17",
      },
      {
        "@type": "ItemList",
        "@id": siteUrl + "/travel-guide#help-topics",
        name: "What do you need help with?",
        itemListOrder: "ItemListOrderAscending",
        numberOfItems: 7,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Frequently Asked Questions: Short Answers to Common Questions",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/faq#webpage",
              url: siteUrl + "/travel-guide/faq",
              name: "Frequently Asked Questions: Short Answers to Common Questions",
              description:
                "Clear answers to the most common questions about private Bromo, Ijen and Tumpak Sewu tours with JVTO – bookings, payments, Travel Credit, health screening, safety, packing and groups.",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Booking Information",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/booking-information#webpage",
              url: siteUrl + "/travel-guide/booking-information",
              name: "Booking Information",
              description:
                "This page explains how bookings, payments, changes, and Travel Credit work for private tours with JVTO. It is a plain-language summary. For the full legal policy, see /policy/booking-payment-cancellation/.",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Ijen Health Screening",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/ijen-health-screening#webpage",
              url: siteUrl + "/travel-guide/ijen-health-screening",
              name: "Ijen Health Screening",
              description:
                "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
            },
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Safety on Tours",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/safety-on-tours#webpage",
              url: siteUrl + "/travel-guide/safety-on-tours",
              name: "Safety on Tours",
              description:
                "Understand how safety is built into JVTO's private tours, what you can expect from us, and what we expect from you as a guest.",
            },
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Packing & Fitness",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/packing-and-fitness#webpage",
              url: siteUrl + "/travel-guide/packing-and-fitness",
              name: "Packing & Fitness",
              description:
                "What to pack and how fit you should realistically be for private tours to Bromo, Ijen and Tumpak Sewu with JVTO. Clothing layers, footwear, fitness levels and practical tips for safer, more comfortable trips.",
            },
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Weather & Closures",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/weather-and-closures#webpage",
              url: siteUrl + "/travel-guide/weather-and-closures",
              name: "Weather & Closures",
              description:
                "How weather and volcanic activity can affect your Bromo, Ijen and Tumpak Sewu tour with JVTO, and how we handle timetable changes, reroutes, closures and Travel Credit.",
            },
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "Police Escort for Groups",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/police-escort-for-groups#webpage",
              url: siteUrl + "/travel-guide/police-escort-for-groups",
              name: "Police Escort for Groups",
              description:
                "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": siteUrl + "/travel-guide#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Travel Guide",
            item: siteUrl + "/travel-guide",
          },
        ],
      },
    ],
  };

  const { hero, latestUpdate, operatingStatus, toc, panels } = travelGuideData;
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : travelGuideData.h1;
  const volcanicStatusFile = readVolcanicStatusFile();
  const volcanicStatusEntries = volcanicStatusFile
    ? Object.entries(volcanicStatusFile.destinations).filter(
        ([slug]) => VOLCANIC_DESTINATION_LABELS[slug],
      )
    : [];
  const statusAgeHours = volcanicStatusFile
    ? getStatusAgeHours(volcanicStatusFile)
    : null;
  const isStatusStale =
    typeof statusAgeHours === "number" && statusAgeHours > 48;
  const statusUpdatedLabel = volcanicStatusFile
    ? formatDate(volcanicStatusFile.updated_at, {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;
  const planBMessage =
    volcanicStatusEntries.length > 0
      ? getPrimaryPlanBMessage(volcanicStatusEntries)
      : latestUpdate.fallback;

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={tgHubExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-jvto-navy text-white pb-16 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">Travel Guide</span>
            </nav>

            <h1
              className="font-black text-3xl md:text-5xl text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {h1}
            </h1>
            <div className="space-y-3 mb-8">
              {hero.introParagraphs.map((p, i) => (
                <p className="text-white/70 text-base md:text-lg leading-relaxed" key={i}>
                  {p}
                </p>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {hero.primaryCtas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  prefetch={false}
                  className={
                    cta.href.includes("tours")
                      ? "inline-block bg-jvto-orange text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-jvto-orange/90 transition-colors"
                      : "inline-block border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <main>
              <Card className="bg-jvto-green/5 border-jvto-green/80 border-2 mb-12">
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-jvto-green/70">
                        MAGMA / PVMBG monitored
                      </p>
                      <CardTitle className="text-jvto-green font-black">
                        {latestUpdate.title}
                      </CardTitle>
                    </div>
                    {statusUpdatedLabel && (
                      <p className="text-xs font-bold text-jvto-green/80">
                        Updated {statusUpdatedLabel}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-jvto-green">
                  {isStatusStale && (
                    <div className="mb-5 flex gap-3 rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="text-sm font-black">Status data may be stale</p>
                        <p className="mt-1 text-xs leading-relaxed">
                          This file was last refreshed {statusAgeHours} hours ago.
                          Treat volcano conditions as a pre-departure planning signal,
                          not a final access guarantee. JVTO will re-check official
                          sources and local instructions before the crew departs.
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed">{planBMessage}</p>

                  {volcanicStatusEntries.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {volcanicStatusEntries.map(([slug, status]) => {
                        const statusStyle = STATUS_STYLES[status.status];
                        const recommendations =
                          status.pvmbg_report?.recommendations_en?.slice(0, 2) ??
                          [];

                        return (
                          <article
                            key={slug}
                            className="rounded-sm border border-jvto-green/20 bg-white p-4 shadow-sm"
                            data-volcanic-status={status.status}
                            data-alert-level={status.alert_level}
                            data-last-verified={status.last_verified}
                            data-tours-operating={String(status.tours_operating)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h2 className="text-base font-black text-gray-950">
                                  {VOLCANIC_DESTINATION_LABELS[slug]}
                                </h2>
                                <p className="mt-1 text-xs font-bold text-gray-500">
                                  Verified {formatDate(status.last_verified)} by{" "}
                                  {status.verified_by ?? status.source}
                                </p>
                              </div>
                              <span
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${statusStyle.badge}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                                {statusStyle.label}
                              </span>
                            </div>

                            <div className="mt-4 flex items-start gap-2 text-sm text-gray-800">
                              {status.tours_operating ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              ) : (
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                              )}
                              <p>
                                <strong>{status.alert_level}.</strong> {status.notes}
                              </p>
                            </div>

                            {recommendations.length > 0 && (
                              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-gray-600">
                                {recommendations.map((recommendation) => (
                                  <li key={recommendation}>- {recommendation}</li>
                                ))}
                              </ul>
                            )}

                            {status.pvmbg_report?.visual_en && (
                              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                                Field report: {status.pvmbg_report.visual_en}
                                {status.pvmbg_report.climate_en
                                  ? ` · ${status.pvmbg_report.climate_en}`
                                  : ""}
                              </p>
                            )}

                            <a
                              href={status.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-jvto-green underline underline-offset-4"
                            >
                              Official source
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-sm border border-jvto-green/20 bg-white px-4 py-3 text-sm">
                      Live volcano status data is not available in this build.
                      Contact JVTO before departure for the latest operating
                      decision.
                    </p>
                  )}

                  <p className="mt-5 text-xs italic text-jvto-green/80">
                    {latestUpdate.note}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-2 mb-12">
                <CardHeader>
                  <CardTitle className="font-black">
                    {operatingStatus.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-gray-700">
                  {operatingStatus.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-12">
                {panels.map((panel) => (
                  <section
                    key={panel.id}
                    id={panel.id}
                    className="scroll-mt-24"
                  >
                    <h2 className="font-black text-2xl">{panel.title}</h2>
                    <hr className="my-2" />
                    <div className="prose max-w-none text-md text-muted-foreground">
                      {panel.summaryParagraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    {panel.cta && (
                      <div className="mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-0 flex h-auto"
                        >
                          <Link className="flex" href={panel.cta.href} prefetch={false}>
                            {panel.cta.label}{" "}
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              <DocumentPriorityNote />
            </main>
          </div>
        </section>
      </main>
    </div>
  );
}
