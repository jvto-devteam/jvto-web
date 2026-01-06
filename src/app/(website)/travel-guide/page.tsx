import { type Metadata } from "next";
import Link from "next/link";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DocumentPriorityNote } from "./document-priority-note";
import StructuredData from "@/components/website/StructuredData";

const travelGuideData = {
  version: "v1",
  hub: {
    route: "/travel-guide",
    seo: {
      title:
        "Travel Guide – Private Bromo, Ijen & East Java Tours | Java Volcano Tour Operator",
      metaDescription:
        "Official travel guide for private Bromo, Ijen and Tumpak Sewu tours with Java Volcano Tour Operator. Learn how booking, payments, health screening, safety, weather alerts and police escort for groups work.",
    },
    h1: "Travel Guide for Private Bromo, Ijen & East Java Tours",
    hero: {
      kicker: "Official Travel Guide",
      headline: "Plan Safe, Informed Private Volcano Tours in East Java",
      subheadline:
        "This Travel Guide explains, in plain English, how our private Bromo, Ijen and Tumpak Sewu tours work – from booking, payments and Travel Credit to health screening, safety, weather and group logistics.",
      body: [
        "Use these pages as your **single source of truth** before and after booking. They translate JVTO's internal policies and on-the-ground experience into clear guidance for international travellers – and for AI assistants that help you plan.",
        "For anything legal or case-specific, your **Official E-Voucher** and the **Booking, Payment & Cancellation Policy** remain the final reference.",
      ],
      primaryCta: {
        label: "How Private JVTO Tours Work",
        href: "/travel-guide/booking-information",
      },
      secondaryCta: {
        label: "Frequently Asked Questions",
        href: "/travel-guide/faq",
      },
    },
    latestUpdate: {
      label: "Latest operational update",
      placeholder: true,
      body: "This area is reserved for time-sensitive information about access, closures and special conditions for Bromo, Ijen and Tumpak Sewu. Before your departure, always check the latest email from JVTO and your Official E-Voucher for date-specific details.",
      note: "Content here should be updated manually by JVTO staff based on official information from local authorities and MAGMA Indonesia.",
    },
    summaryPanels: [
      {
        id: "booking-information",
        title: "Booking Information – How JVTO Private Tours Work",
        href: "/travel-guide/booking-information",
        summary:
          "Step-by-step explanation of how private tours are booked, paid, changed or cancelled – including deposits, balance payments and JVTO Travel Credit.",
        tags: ["Booking", "Payments", "Travel Credit"],
      },
      {
        id: "faq",
        title: "Frequently Asked Questions",
        href: "/travel-guide/faq",
        summary:
          "Short answers to the most common questions about private tours, inclusions, payments, Travel Credit, Ijen screening, closures, student deals and group options.",
        tags: ["FAQ", "Overview"],
      },
      {
        id: "ijen-health-screening",
        title: "Ijen Health Screening – Real Checks, Digital Proof",
        href: "/travel-guide/ijen-health-screening",
        summary:
          "How health screening works for Ijen night hikes, what is included for JVTO guests, and how the digital system and QR checks help reduce fake certificates.",
        tags: ["Health", "Ijen", "Screening"],
      },
      {
        id: "weather-and-closures",
        title: "Weather, Volcano Alerts & Closures",
        href: "/travel-guide/weather-and-closures",
        summary:
          "How weather, volcanic activity and official closures can affect your itinerary, and how JVTO responds with alternative routes and Travel Credit options.",
        tags: ["Weather", "Closures", "Policy"],
      },
      {
        id: "police-escort-for-groups",
        title: "Traffic Police Escort for Tourist Groups",
        href: "/travel-guide/police-escort-for-groups",
        summary:
          "When an official traffic police escort can be requested for larger groups, how the formal process works, and what an escort does and does not do.",
        tags: ["Groups", "Escort", "Logistics"],
      },
      {
        id: "packing-and-fitness",
        title: "Packing & Fitness",
        href: "/travel-guide/packing-and-fitness",
        summary:
          "What to pack and how fit you should be for Bromo, Ijen and Tumpak Sewu – including simple self-checks and route-specific packing tips.",
        tags: ["Packing", "Fitness", "Preparation"],
      },
      {
        id: "safety-on-tours",
        title: "Safety on JVTO Tours",
        href: "/travel-guide/safety-on-tours",
        summary:
          "How JVTO builds safety into every private tour using police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
        tags: ["Safety", "MAGMA", "Screening"],
      },
    ],
    ctaStrip: {
      headline: "Ready to Plan Your Private Volcano Tour?",
      body: "After reviewing this Travel Guide, you can choose a route from Surabaya or Bali, check what is included, and book with clear expectations on payments, safety and flexibility.",
      primaryCta: {
        label: "Browse Private Tour Routes",
        href: "/tours",
      },
      secondaryCta: {
        label: "Talk to JVTO via WhatsApp",
        href: "https://wa.me/6282244788833",
      },
    },
    description:
      "Official JVTO Travel Guide for planning your private tour. For binding terms, always refer to the Policy pages and your Official E-Voucher / Invoice (PDF).",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: travelGuideData.hub.seo.title,
  description: travelGuideData.hub.seo.metaDescription,
  openGraph: {
    title: travelGuideData.hub.seo.title,
    description: travelGuideData.hub.seo.metaDescription,
    url: `${siteUrl}/travel-guide`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/travel-guide.webp",
        width: 1200,
        height: 630,
        alt: "Travel Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: travelGuideData.hub.seo.title,
    description: travelGuideData.hub.seo.metaDescription,
    images: [siteUrl + "/assets/img/og/travel-guide.webp"],
  },
};

export default function TravelGuideHubPage() {
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
        logo: siteUrl + "/assets/img/jvto-color.png",
        image: [
          siteUrl + "/assets/img/jvto-color.png",
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
          jobTitle: "Founder & CEO",
          knowsAbout: [
            "TouristSafety",
            "EastJavaTourism",
            "VolcanoTrekking",
            "LogisticsManagement",
          ],
          description:
            "Founder of JVTO; active-duty Tourist Police officer in East Java; Supervisor in HPWKI.",
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
        mainEntity: {
          "@id": siteUrl + "/travel-guide#help-topics",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
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
                "This page is a plain-language summary of the official JVTO Booking, Payment & Cancellation Policy and the Inclusions & Exclusions Policy. Your Official E-Voucher / Invoice is always the primary contract for your specific booking.",
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

  const { h1, hero, latestUpdate, summaryPanels, ctaStrip } =
    travelGuideData.hub;

  // Generate TOC from summaryPanels
  const tocItems = summaryPanels.map((panel) => ({
    id: panel.id,
    label: panel.title,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={travelGuideSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
            <div className="space-y-2 mx-auto">
              <p className="text-gray-600 text-lg">{hero.subheadline}</p>
              {hero.body.map((p, i) => (
                <p className="text-gray-600 text-lg" key={i}>
                  {p.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary">
                <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-12 gap-16">
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-32">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="font-black">On this page</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tocItems.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className="underline font-medium text-md text-muted-foreground hover:text-lime-600 transition-colors"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              <main className="lg:col-span-8">
                <Card className="bg-lime-50 border-lime-600 border-2 mb-12">
                  <CardHeader>
                    <CardTitle className="text-lime-800 font-black">
                      {latestUpdate.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none text-lime-700">
                    <p>{latestUpdate.body}</p>
                    <p className="text-xs italic mt-4">{latestUpdate.note}</p>
                  </CardContent>
                </Card>

                <div className="space-y-12">
                  {summaryPanels.map((panel) => (
                    <section
                      key={panel.id}
                      id={panel.id}
                      className="scroll-mt-24"
                    >
                      <h2 className="font-black text-2xl">{panel.title}</h2>
                      <hr className="my-2" />
                      <div className="prose max-w-none text-md text-muted-foreground">
                        <p>{panel.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {panel.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-0 flex h-auto"
                        >
                          <Link className="flex" href={panel.href}>
                            Read more <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </section>
                  ))}
                </div>

                <DocumentPriorityNote />
              </main>
            </div>
            <section className="mt-16 text-center bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
              <h2 className="font-black text-2xl mb-4">{ctaStrip.headline}</h2>
              <p className="text-gray-600 mb-6">{ctaStrip.body}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" variant="primary">
                  <Link href={ctaStrip.primaryCta.href}>
                    {ctaStrip.primaryCta.label}
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href={ctaStrip.secondaryCta.href} target="_blank">
                    {ctaStrip.secondaryCta.label}
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
