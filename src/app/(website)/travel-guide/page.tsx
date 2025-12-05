import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  HeartPulse,
  ShieldCheck,
  Package,
  CloudSun,
  Siren,
} from "lucide-react";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Travel Guide & FAQ | JVTO",
  description:
    "Your hub for essential travel information. Find FAQs, booking policies, and details on the Ijen health screening.",
};
const guideLinks = [
  {
    href: "/travel-guide/faq",
    icon: HelpCircle,
    title: "FAQ — Short Answers to Common Questions",
    description:
      "Start here if you’re not sure where to look. We answer the most common questions about private tours, what’s included, payments, reschedules, and safety.",
  },
  {
    href: "/travel-guide/booking-information",
    icon: BookOpen,
    title: "Booking & Payments",
    description:
      "Details on how to book, deposits, final payments, Travel Credit, and why we don’t offer cash refunds.",
  },
  {
    href: "/travel-guide/ijen-health-screening",
    icon: HeartPulse,
    title: "Ijen Health Screening",
    description:
      "How our health checks work for Ijen night hikes, what is included for JVTO guests, and how the digital system helps prevent fake certificates.",
  },
  {
    href: "/travel-guide/safety-on-tours",
    icon: ShieldCheck,
    title: "Safety on Tours",
    description:
      "How we make decisions about safety on the road, at viewpoints, and on the mountain, including how we monitor conditions and when we change plans.",
  },
  {
    href: "/travel-guide/packing-and-fitness",
    icon: Package,
    title: "Packing & Fitness",
    description:
      "What to pack for Bromo, Ijen and Tumpak Sewu, what kind of fitness you need, and a few tips to keep your belongings safe.",
  },
  {
    href: "/travel-guide/weather-and-closures",
    icon: CloudSun,
    title: "Weather, Alerts & Closures",
    description:
      "How rain, fog, or volcanic activity can affect your itinerary, which sources we follow, and what happens to your booking if part of the tour is closed.",
  },
  {
    href: "/travel-guide/police-escort-for-groups",
    icon: Siren,
    title: "Police Escort for Groups",
    description:
      "When and how official traffic police escort can be arranged for large groups, and why it is always done through formal channels.",
  },
];

export default function TravelGuidePage() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const travelGudideSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": siteUrl+"/#organization",
        name: "Java Volcano Tour Operator (JVTO)",
        alternateName: "JVTO",
        url: siteUrl,
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        logo: siteUrl+"/assets/img/jvto-color.png",
        "image": [
          siteUrl+"/assets/img/jvto-color.png",
          siteUrl+"/assets/img/hero/home.webp"
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
        "@id": siteUrl+"/#website",
        url: siteUrl,
        name: "Java Volcano Tour Operator",
        publisher: {
          "@id": siteUrl+"/#organization",
        },
        inLanguage: "en",
        hasPart: [
          {
            "@id": siteUrl+"/travel-guide#webpage",
          },
        ],
      },
      {
        "@type": ["WebPage", "CollectionPage"],
        "@id": siteUrl+"/travel-guide#webpage",
        url: siteUrl+"/travel-guide",
        name: "Travel Guide — Booking, Safety & Practical Info",
        description:
          "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you’ll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
        inLanguage: "en",
        isPartOf: {
          "@id": siteUrl+"/#website",
        },
        about: {
          "@id": siteUrl+"/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl+"/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id": siteUrl+"/travel-guide#breadcrumb",
        },
        mainEntity: {
          "@id":
            siteUrl+"/travel-guide#help-topics",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
      },
      {
        "@type": "ItemList",
        "@id": siteUrl+"/travel-guide#help-topics",
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
              "@id":
                siteUrl+"/travel-guide/faq#webpage",
              url: siteUrl+"/travel-guide/faq",
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
              "@id":
                siteUrl+"/travel-guide/booking-information#webpage",
              url: siteUrl+"/travel-guide/booking-information",
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
              "@id":
                siteUrl+"/travel-guide/ijen-health-screening#webpage",
              url: siteUrl+"/travel-guide/ijen-health-screening",
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
              "@id":
                siteUrl+"/travel-guide/safety-on-tours#webpage",
              url: siteUrl+"/travel-guide/safety-on-tours",
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
              "@id":
                siteUrl+"/travel-guide/packing-and-fitness#webpage",
              url: siteUrl+"/travel-guide/packing-and-fitness",
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
              "@id":
                siteUrl+"/travel-guide/weather-and-closures#webpage",
              url: siteUrl+"/travel-guide/weather-and-closures",
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
              "@id":
                siteUrl+"/travel-guide/police-escort-for-groups#webpage",
              url: siteUrl+"/travel-guide/police-escort-for-groups",
              name: "Police Escort for Groups",
              description:
                "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": siteUrl+"/travel-guide#breadcrumb",
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
            item: siteUrl+"/travel-guide",
          },
        ],
      },
    ],
  };
  return (
    <>
      <StructuredData data={travelGudideSchema} />
      <div className="flex flex-col min-h-screen bg-background py-20">
        <main className="flex-grow">
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                  Travel Guide – Booking, Safety & Practical Info
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                  This Travel Guide is your practical handbook for traveling
                  with Java Volcano Tour Operator (JVTO). Here you’ll find clear
                  information on bookings, payments, reschedules, health
                  screening for Ijen, safety on tours, packing, weather-related
                  closures, and when police escort can be arranged for groups.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guideLinks.map((link, index) => (
                  <Link href={link.href} key={index} className="group">
                    <div className="bg-card p-6 rounded-lg shadow-sm border h-full transition-shadow duration-300 hover:shadow-lg">
                      <link.icon className="h-8 w-8 text-primary mb-4" />
                      <h3 className="font-headline text-xl font-semibold mb-2">
                        {link.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
