import { type Metadata } from "next";
import Link from "next/link";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DocumentPriorityNote } from "./document-priority-note";

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
      "Java Volcano Tour Operator (JVTO) is a licensed Indonesian inbound operator based in Bondowoso, specialising in private, all-inclusive tours to Mount Bromo, Kawah Ijen and Tumpak Sewu.",
      "This Travel Guide is the official handbook for guests who want to understand how JVTO handles safety, health, weather, closures, payments and student deals before they book or travel.",
      "It summarises key topics and links to detailed pages. For legal details and specific cases, your Official E-Voucher / Invoice and the Booking, Payment & Cancellation Policy are always the final reference.",
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
    title: "Latest JVTO update",
    lastUpdatedPlaceholder: "20 December 2025",
    bodyParagraphs: [
      "Bromo: operating normally; cold and windy conditions possible at sunrise.",
      "Ijen: night hikes require health screening and may be adjusted based on sulfur gas and wind.",
      "Tumpak Sewu: lower paths can be slippery after heavy rain; guides may change timings or access.",
      "Guests travelling in the next few weeks should review Packing & Fitness, Safety on Tours, and Weather & Closures before departure.",
    ],
    note: "This block is intended to be updated by the JVTO team and should only contain information that can be reasonably confirmed at the time of update.",
  },
  operatingStatus: {
    title: "JVTO operating status – East Java volcano routes",
    paragraphs: [
      "JVTO currently operates private, pre-booked tours on our standard routes in East Java, subject to weather, volcanic activity and access regulations.",
      "In practice this means:",
      "- We plan and adjust tours based on official information from Indonesian authorities (including MAGMA / PVMBG) and local park management.",
      "- Some viewpoints, hiking sections or waterfalls may be temporarily restricted even when tours are running.",
      "- Changes to itineraries are handled according to the rules described in Weather & Closures and Booking, Payment & Cancellation.",
      "For country-level travel advice (for example, political or health alerts), guests should always check the official travel advisories issued by their own governments in addition to this guide.",
    ],
  },
  toc: {
    title: "On this page",
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
      title: "Safety on JVTO tours",
      summaryParagraphs: [
        "JVTO is a licensed inbound operator led by an active Tourist Police officer in East Java. All tours are private-only: no mixed groups and no transport-only tickets. Routes are planned with documented partners, trained local guides and clear briefings before key activities.",
        "We monitor official information on volcanic activity and weather, apply our own safety procedures on the road and on the trails, and adjust itineraries when conditions or regulations make the original plan unsafe.",
      ],
      cta: {
        label: "Read full safety overview",
        href: "/travel-guide/safety-on-tours",
      },
    },
    {
      id: "health-and-ijen-screening",
      title: "Health & Ijen screening",
      summaryParagraphs: [
        "Kawah Ijen is a night hike at altitude with possible sulfur gas exposure. For JVTO guests joining Ijen hikes, we include a formal health screening carried out by trained medical staff. Results are recorded digitally and can be verified with a QR code to help prevent fake certificates and support safer decision-making at the gate.",
        "The same digital system is also available to other travellers via a public tool, so that more visitors can make informed choices and avoid unsafe attempts. A cleared screening reduces risk but does not remove it; JVTO and local authorities may still cancel or modify a hike if conditions are unsafe.",
      ],
      cta: {
        label: "Ijen health screening – what we do and why",
        href: "/travel-guide/ijen-health-screening",
      },
    },
    {
      id: "weather-and-closures",
      title: "Weather, volcano alerts & closures",
      summaryParagraphs: [
        "Volcanoes and waterfalls are part of a changing natural environment. Heavy rain, landslides, volcanic ash, gas, smoke, floods, forest fires, road damage or official ceremonies can affect access to Bromo, Ijen and Tumpak Sewu. Sometimes only one viewpoint is affected; sometimes entire sites or routes can be temporarily closed.",
        "When conditions or official regulations require changes, JVTO:",
        "- Uses official information (including MAGMA / PVMBG data and local government instructions) as a baseline.",
        "- Distinguishes between partial closures (for example, one path or rim section) and full closures.",
        "- Proposes alternative routes or timings where possible.",
        "- Applies the options defined in the Booking, Payment & Cancellation Policy and your Official E-Voucher / Invoice, including the use of JVTO Travel Credit where applicable.",
      ],
      cta: {
        label: "How JVTO handles weather, volcano alerts and closures",
        href: "/travel-guide/weather-and-closures",
      },
    },
    {
      id: "packing-and-fitness",
      title: "Packing & fitness for Bromo, Ijen & Tumpak Sewu",
      summaryParagraphs: [
        "Bromo, Ijen and Tumpak Sewu are not technical mountaineering routes, but they can still be physically demanding: early starts, night hiking, cold winds, steep paths, stairs, and wet or slippery sections.",
        "The Packing & Fitness guide explains a simple self-check for basic fitness and mobility, what to pack for all routes (footwear, layers, daypack and personal items), and extra items recommended specifically for Bromo sunrise, Ijen night hikes and Tumpak Sewu.",
        "It is a preparation guide, not a medical evaluation. Final decisions about hikes follow your health screening results, on-site conditions and the safety assessments described in the other Travel Guide pages.",
      ],
      cta: {
        label: "Packing list & fitness checklist",
        href: "/travel-guide/packing-and-fitness",
      },
    },
    {
      id: "booking-and-payments",
      title: "Booking, payments & Travel Credit",
      summaryParagraphs: [
        "JVTO operates private, all-inclusive tours on a pre-booked basis. The Booking Information page explains how to submit a booking request and confirm a private tour, deposit amounts and when final payment is due, accepted payment methods, and how JVTO Travel Credit works.",
        "It also explains why JVTO does not provide cash refunds and how this is balanced by flexible Travel Credit rules, as well as how changes, reschedules and cancellations are handled in different time windows before departure.",
      ],
      cta: {
        label: "Full booking, payment & Travel Credit rules",
        href: "/travel-guide/booking-information",
      },
    },
    {
      id: "police-escort-for-groups",
      title: "Traffic police escort for larger groups",
      summaryParagraphs: [
        "For larger groups (for example, around 18 guests or more on multi-vehicle convoys), JVTO may propose requesting official traffic police escort for specific road segments in East Java.",
        "Escort is provided by the official traffic police unit, not by JVTO itself. Requests are made through formal channels and are always subject to law, written approval and police availability. Escort is designed to support safe convoy movement, not to break traffic rules or promise faster travel times. If approved, details and any charges are listed in your group quotation and Official E-Voucher / Invoice.",
        "If escort is not explicitly stated in your booking documents, your tour should be considered as running without escort.",
      ],
      cta: {
        label: "How official traffic police escort works for tourist groups",
        href: "/travel-guide/police-escort-for-groups",
      },
    },
    {
      id: "isic-student-deals",
      title: "ISIC student deals & fair pricing",
      summaryParagraphs: [
        "International students often pay higher park entrance fees than local visitors. Through collaboration with ISIC (International Student Identity Card), JVTO offers student-focused structures on selected tours so that verified students can access safe, all-inclusive volcano tours without cutting standards or inclusions.",
        "The ISIC page explains which tours are eligible, how to show valid ISIC identification, and how student-oriented pricing interacts with JVTO’s normal booking, payment and Travel Credit rules.",
      ],
      cta: {
        label: "ISIC student packages",
        href: "/isic/student-package",
      },
    },
    {
      id: "official-sources",
      title: "Official sources & external links",
      summaryParagraphs: [
        "JVTO monitors and respects information from official Indonesian authorities and encourages guests to use official information alongside this Travel Guide.",
        "Important references include:",
        "- MAGMA Indonesia / PVMBG – the official national platform for volcanic and geohazard information, including alert levels, hazard maps and recommendations for the public.",
        "- VONA (Volcano Observatory Notice for Aviation) – specialised notices on volcanic ash for aviation stakeholders, available through MAGMA (for example, https://magma.esdm.go.id/v1/vona?code=KRA for technical users).",
        "- Local park and government announcements – including temporary closures, restricted zones and ceremony-related access rules.",
        "- Travel advice from your own government – for country-level security, health and entry requirements.",
        "JVTO uses these sources to plan and adjust tours, but does not replace government advisories or personal medical advice. Your own government’s travel advice and your Official E-Voucher / Invoice remain key references for any travel decision.",
      ],
      cta: null,
    },
  ],
};

export const metadata: Metadata = {
  title: travelGuideData.seo.title,
  description: travelGuideData.seo.metaDescription,
};

export default function TravelGuideHubPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const travelGudideSchema = {
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
        paymentAccepted: "Credit Card, Bank Transfer",
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
          "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you’ll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
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
                "Understand how safety is built into JVTO’s private tours, what you can expect from us, and what we expect from you as a guest.",
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

  const { h1, hero, latestUpdate, toc, sections } = travelGuideData;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={travelGudideSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              {hero.introParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {hero.primaryCtas.map((cta) => (
                <Button
                  key={cta.href}
                  size="lg"
                  variant={cta.href.includes("tours") ? "default" : "outline"}
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid lg:grid-cols-12 gap-16">
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-32">
                  <Card>
                    <CardHeader>
                      <CardTitle>{toc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {toc.items.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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
                <Card className="bg-blue-50 border-blue-200 mb-12">
                  <CardHeader>
                    <CardTitle className="text-blue-800">
                      {latestUpdate.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none text-blue-700">
                    <p className="font-bold">
                      Last updated : {latestUpdate.lastUpdatedPlaceholder}
                    </p>
                    <ul className="list-disc pl-5">
                      {latestUpdate.bodyParagraphs.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                    <p className="text-xs italic mt-4">{latestUpdate.note}</p>
                  </CardContent>
                </Card>

                <div className="space-y-12">
                  {sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-24"
                    >
                      <h2 className="heading-md text-2xl mb-4">
                        {section.title}
                      </h2>
                      <div className="prose max-w-none text-muted-foreground">
                        {section.summaryParagraphs.map((p, i) => {
                          if (p.startsWith("- ")) {
                            const items = section.summaryParagraphs.filter(
                              (sp) => sp.startsWith("- ")
                            );
                            if (
                              i > 0 &&
                              section.summaryParagraphs[i - 1].startsWith("- ")
                            )
                              return null;
                            return (
                              <ul key={i} className="list-disc pl-5">
                                {items.map((item, j) => (
                                  <li key={j}>{item.replace("- ", "")}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={i}>{p}</p>;
                        })}
                      </div>
                      {section.cta && (
                        <div className="mt-6">
                          <Button variant="link" className="p-0 flex h-auto">
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
