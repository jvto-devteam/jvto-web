import { type Metadata } from "next";
import Link from "next/link";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DocumentPriorityNote } from "./document-priority-note";
import StructuredData from "@/components/website/StructuredData";

const travelGuideData = {
  route: "/travel-guide",
  seo: {
    title:
      "Travel Guide – Safety, Health & Practical Information | Java Volcano Tour Operator",
    metaDescription:
      "Official travel guide for private tours with Java Volcano Tour Operator (JVTO). Learn about booking, safety, Ijen health screening, weather and closures, packing, police escort for groups and ISIC student deals.",
  },
  h1: "Travel Guide – Safety, Health & Practical Information",
  hero: {
    introParagraphs: [
      "Use this Travel Guide as JVTO's official handbook for planning private tours to Mount Bromo, Kawah Ijen, and Tumpak Sewu. Java Volcano Tour Operator (JVTO) is presented here as a licensed Indonesian inbound operator based in Bondowoso, specialising in private, all-inclusive routes to East Java's key volcano and waterfall destinations.",
      "Understand how JVTO handles safety, health, weather, closures, payments, and student deals before you book or travel. This page summarises the key topics and directs you to dedicated detail pages for each subject.",
      "Use your Official E-Voucher / Invoice and the Booking, Payment & Cancellation Policy as the final reference for legal or case-specific details. This Travel Guide is a plain-language summary designed to help guests understand how things work, but binding terms remain in your official booking documents.",
    ],
    primaryCtas: [
      {
        label: "How to book & pay",
        href: "/travel-guide/booking-information",
      },
      {
        label: "Browse private tours",
        href: "/tours",
      },
    ],
  },
  latestUpdate: {
    title: "Latest JVTO Update",
    lastUpdatedPlaceholder: "07 January 2026",
    bodyParagraphs: [
      'Check this "Latest JVTO update" card for time-sensitive operational notes before departure. This section is reserved for information your team can confirm and update routinely.',
      "Bromo: Operating normally during the holy month of Wulan Kapitu, but please maintain respectful conduct. Note that the Sea of Sand will be closed to all vehicles on January 17–18 for the end of the observance. Expect overcast skies or rain.",
      "Ijen: Mandatory requirement: A physical Health Certificate (Surat Sehat) is strictly required for ticket purchase. Due to peak rainy season, the trail is slippery and Blue Fire visibility may be restricted by fog or gas safety limits.",
      "Tumpak Sewu: The panoramic viewpoint is open, but the lower river trekking path may be closed on short notice if water levels rise due to heavy rain. Non-slip shoes and raincoats are essential.",
      "Review the relevant preparation pages if you are travelling soon. Guests travelling in the next few weeks should review Packing & Fitness, Safety on Tours, and Weather & Closures before departure.",
    ],
    note: "Only publish what you can reasonably confirm at the time of update. Do not include rumours, assumptions, or unverified claims.",
  },
  operatingStatus: {
    title: "JVTO Operating Status",
    paragraphs: [
      "Treat JVTO's operating status as an operations update for JVTO routes—not a country-level travel advisory. JVTO currently operates private, pre-booked tours on standard East Java routes, subject to weather, volcanic activity, and access regulations.",
      "Expect tour plans to follow official sources and local access rules. We plan and adjust tours based on official information (including MAGMA / PVMBG) and local park management.",
      "Expect partial restrictions even when tours are running. Some viewpoints, hiking sections, or waterfall access may be temporarily restricted even when the tour program continues.",
      "Expect itinerary changes to follow the rules in Weather & Closures and Booking, Payment & Cancellation. Changes are handled according to those pages and your booking documents.",
      "Check your own government's travel advice for country-level alerts. Guests should consult official travel advisories issued by their own governments in addition to this guide.",
    ],
  },
  toc: {
    title: "On This Page",
    items: [
      { id: "safety-on-tours", label: "Safety on JVTO tours" },
      { id: "health-and-ijen-screening", label: "Health & Ijen screening" },
      {
        id: "weather-and-closures",
        label: "Weather, volcano alerts & closures",
      },
      { id: "packing-and-fitness", label: "Packing & fitness" },
      {
        id: "booking-and-payments",
        label: "Booking, payments & Travel Credit",
      },
      {
        id: "police-escort-for-groups",
        label: "Traffic police escort for groups",
      },
      { id: "isic-student-deals", label: "ISIC student deals" },
      { id: "official-sources", label: "Official sources & external links" },
    ],
  },
  sections: [
    {
      id: "safety-on-tours",
      title: "Safety on JVTO Tours",
      summaryParagraphs: [
        "Expect JVTO tours to be run as private-only, pre-briefed programs with defined safety procedures. JVTO is presented here as a licensed inbound operator led by an active Tourist Police officer in East Java, and all tours are stated to be private-only (no mixed groups, no transport-only tickets).",
        "Expect routing and decisions to adapt to conditions and regulations. We monitor official information on volcanic activity and weather, apply safety procedures on roads and trails, and adjust itineraries when conditions or regulations make the original plan unsafe.",
      ],
      cta: {
        label: "Read full safety overview",
        href: "/travel-guide/safety-on-tours",
      },
    },
    {
      id: "health-and-ijen-screening",
      title: "Health & Ijen Screening",
      summaryParagraphs: [
        "Expect Ijen night hikes to require screening and to remain subject to safety decisions even after clearance. Kawah Ijen is described here as a night hike at altitude with possible sulfur gas exposure.",
        "Expect screening to be included for eligible JVTO guests and to be digitally verifiable. For JVTO guests joining Ijen hikes, the package includes a formal health screening by trained medical staff, recorded digitally and verifiable via QR code.",
        "Expect the public tool to exist, and expect hikes to be modified or cancelled if conditions are unsafe. The same digital system is described as available to other travellers via a public tool. A cleared screening reduces risk but does not remove it; hikes may still be cancelled or modified based on conditions.",
      ],
      cta: {
        label: "Ijen health screening – what we do and why",
        href: "/travel-guide/ijen-health-screening",
      },
    },
    {
      id: "weather-and-closures",
      title: "Weather, Volcano Alerts & Closures",
      summaryParagraphs: [
        "Expect natural conditions to change access and require adjustments to plans. Heavy rain, landslides, volcanic ash, gas, smoke, floods, forest fires, road damage, or official ceremonies can affect access to Bromo, Ijen, and Tumpak Sewu.",
        "Expect JVTO to distinguish partial closures from full closures and propose alternatives where possible. Some issues affect only one viewpoint or path; others trigger full closure.",
        "Expect Travel Credit options to follow the Booking Policy and your E-Voucher. When changes are required, JVTO applies the options defined in the Booking, Payment & Cancellation Policy and your Official E-Voucher / Invoice, including Travel Credit where applicable.",
      ],
      cta: {
        label: "How JVTO handles weather, volcano alerts and closures",
        href: "/travel-guide/weather-and-closures",
      },
    },
    {
      id: "packing-and-fitness",
      title: "Packing & Fitness",
      summaryParagraphs: [
        "Expect these routes to be non-technical but physically demanding for many travellers. Early starts, night hiking, cold winds, steep paths, stairs, and wet or slippery sections can apply across Bromo, Ijen, and Tumpak Sewu.",
        "Expect the guide to provide self-checks and packing lists, not medical approval. The Packing & Fitness guide explains a basic self-check, what to pack for all routes, and extra items for Bromo sunrise, Ijen night hikes, and Tumpak Sewu.",
        "Expect final hike decisions to follow screening, on-site conditions, and safety assessments. The guide is a preparation reference; it does not override screening or safety decisions.",
      ],
      cta: {
        label: "Packing list & fitness checklist",
        href: "/travel-guide/packing-and-fitness",
      },
    },
    {
      id: "booking-and-payments",
      title: "Booking, Payments & Travel Credit",
      summaryParagraphs: [
        "Expect JVTO bookings to operate as private, all-inclusive tours on a pre-booked basis. The Booking Information page explains booking requests, confirmation steps, deposits, payment timing, and methods.",
        "Expect Travel Credit to be the core cancellation mechanism rather than cash refunds. The summary references Travel Credit, how it is used, and why cash refunds are not provided, balanced by Travel Credit flexibility.",
        "Expect different time windows to affect cancellations and changes. The page describes changes, reschedules, and cancellations across different timelines.",
      ],
      cta: {
        label: "Full booking, payment & Travel Credit rules",
        href: "/travel-guide/booking-information",
      },
    },
    {
      id: "police-escort-for-groups",
      title: "Traffic Police Escort for Groups",
      summaryParagraphs: [
        "Expect escort to be considered only for larger groups and only through formal approval. For larger groups (example: around 18 guests or more with multi-vehicle convoys), JVTO may propose requesting official traffic police escort for specific road segments.",
        "Expect escort to be official, conditional, documented, and not automatic. Escort is provided by the official traffic police unit, subject to law, written approval, and availability.",
        "Expect escort to be for safe convoy movement—not to bypass rules or guarantee faster travel. If approved, details and any charges are listed in your quotation and Official E-Voucher / Invoice.",
        "Expect no escort unless it is explicitly written. If escort is not stated in your booking documents, the tour should be considered to run without escort.",
      ],
      cta: {
        label: "How official traffic police escort works for tourist groups",
        href: "/travel-guide/police-escort-for-groups",
      },
    },
    {
      id: "isic-student-deals",
      title: "ISIC Student Deals",
      summaryParagraphs: [
        "Expect ISIC student deals to be presented as a fairness mechanism against higher foreign fees. Through collaboration with ISIC, JVTO describes student-focused structures on selected tours for verified students.",
        "Expect eligibility and verification details to be defined on the ISIC page. The ISIC page explains eligible tours, how to present valid ISIC identification, and how student pricing interacts with standard booking and Travel Credit rules.",
      ],
      cta: {
        label: "ISIC student packages",
        href: "/isic/student-package",
      },
    },
    {
      id: "official-sources",
      title: "Official Sources & External Links",
      summaryParagraphs: [
        "Use official Indonesian sources and your own government's travel advice alongside this Travel Guide. JVTO states it monitors official Indonesian authorities for planning and adjustments.",
        "Use MAGMA Indonesia / PVMBG for volcano and geohazard context, and VONA for advanced aviation-related notices. Links are presented as references rather than copied content.",
        "Use local park and government announcements for temporary closures and ceremony-related restrictions. Access rules may change due to closures, restricted zones, and official events.",
        "Use your own government's travel advisory for country-level security, health, and entry requirements. JVTO positions this guide as complementary to—not a replacement for—government advisories.",
      ],
      cta: null,
    },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: travelGuideData.seo.title,
  description: travelGuideData.seo.metaDescription,
  openGraph: {
    title: travelGuideData.seo.title,
    description: travelGuideData.seo.metaDescription,
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
    title: travelGuideData.seo.title,
    description: travelGuideData.seo.metaDescription,
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

  const { h1, hero, latestUpdate, operatingStatus, toc, sections } =
    travelGuideData;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={travelGuideSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
            <div className="space-y-2 mx-auto">
              {hero.introParagraphs.map((p, i) => (
                <p className="text-gray-600 text-lg" key={i}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {hero.primaryCtas.map((cta) => (
                <Button
                  key={cta.href}
                  size="lg"
                  variant={cta.href.includes("tours") ? "primary" : "outline"}
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ))}
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
                      <CardTitle className="font-black">{toc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {toc.items.map((item) => (
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
                  {sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-24"
                    >
                      <h2 className="font-black text-2xl">{section.title}</h2>
                      <hr className="my-2" />
                      <div className="prose max-w-none text-md text-muted-foreground">
                        {section.summaryParagraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                      {section.cta && (
                        <div className="mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-0 flex h-auto"
                          >
                            <Link className="flex" href={section.cta.href}>
                              {section.cta.label}{" "}
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
          </div>
        </section>
      </main>
    </div>
  );
}
