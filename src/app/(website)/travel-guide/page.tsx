import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DocumentPriorityNote } from "./document-priority-note";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Sidebar from "./sidebar";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
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
      "Travel Guide — Booking, Safety & Practical Info | Java Volcano Tour Operator",
    metaDescription:
      "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
  },
  h1: "Travel Guide — Booking, Safety & Practical Info",
  hero: {
    introParagraphs: [
      "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO).",
      "Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
    ],
    primaryCtas: [
      {
        label: "FAQ — Short Answers to Common Questions",
        href: "/travel-guide/faq",
      },
      {
        label: "Browse private tours",
        href: "/tours",
      },
    ],
  },
  latestUpdate: {
    title: "Latest JVTO Update",
    lastUpdatedPlaceholder: "17 January 2026",
    bodyParagraphs: [
      'Check this "Latest JVTO update" card for time-sensitive operational notes before departure. This section is reserved for information your team can confirm and update routinely.',
      "For current conditions, please contact us directly via WhatsApp +62 822-4478-8833 or email hello@javavolcano-touroperator.com.",
    ],
    note: "Only publish what you can reasonably confirm at the time of update. Do not include rumours, assumptions, or unverified claims.",
  },
  operatingStatus: {
    title: "JVTO Operating Status",
    paragraphs: [
      "JVTO operates private, pre-booked tours on standard East Java routes, subject to weather, volcanic activity, and access regulations.",
      "We plan and adjust tours based on official information (including MAGMA / PVMBG) and local park management.",
      "Some viewpoints, hiking sections, or waterfall access may be temporarily restricted even when the tour program continues.",
      "Changes are handled according to Weather & Closures and Booking, Payment & Cancellation Policy.",
      "Guests should consult official travel advisories issued by their own governments in addition to this guide.",
    ],
  },
  toc: {
    title: "On This Page",
    items: [
      { id: "faq", label: "FAQ — Short Answers to Common Questions" },
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
      title: "FAQ — Short Answers to Common Questions",
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
        "In some situations, large tourist groups may benefit from official traffic police escort — when moving several vehicles together through busy routes.",
      ],
      cta: {
        label: "Read Police Escort for Groups",
        href: "/travel-guide/police-escort-for-groups",
      },
    },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
  const page = await getPublicPageSnapshot("/travel-guide", {
    allowDatabaseFallback: false,
  });
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
        foundingDate: "2016-01-01",
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
        name: "Travel Guide — Booking, Safety & Practical Info",
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
            name: "FAQ — Short Answers to Common Questions",
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
            name: "Frequently Asked Questions — Short Answers to Common Questions",
            item: {
              "@type": "WebPage",
              "@id": siteUrl + "/travel-guide/faq#webpage",
              url: siteUrl + "/travel-guide/faq",
              name: "Frequently Asked Questions — Short Answers to Common Questions",
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

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined pageRow={page.pageRow} />
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-accent border-b pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-4 text-sm text-muted-foreground">
              <Link href="/" prefetch={false} className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">Travel Guide</span>
            </nav>

            <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
            <div className="space-y-2 mx-auto">
              {hero.introParagraphs.map((p, i) => (
                <p className="text-gray-600 text-lg" key={i}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {hero.primaryCtas.map((cta) => (
                <Button
                  key={cta.href}
                  size="lg"
                  variant={cta.href.includes("tours") ? "primary" : "outline"}
                >
                  <Link href={cta.href} prefetch={false}>{cta.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <main>
              <Card className="bg-lime-50 border-lime-600 border-2 mb-12">
                <CardHeader>
                  <CardTitle className="text-lime-800 font-black">
                    {latestUpdate.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-lime-700">
                  <p className="font-bold">
                    Last updated: {latestUpdate.lastUpdatedPlaceholder}
                  </p>
                  <div className="mt-4">
                    {latestUpdate.bodyParagraphs.map((p, i) => (
                      <p
                        key={i}
                        className={i > 0 && p.includes(":") ? "ml-4" : ""}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs italic mt-4">{latestUpdate.note}</p>
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
