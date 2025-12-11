import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

export const metadata: Metadata = {
  title: "Safety on Tours — How We Make Decisions | JVTO Travel Guide",
  description:
    "Learn how JVTO thinks about safety across all tours — on the road, at viewpoints, on trails, and around volcanoes.",
};

export default function SafetyOnToursPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "https://javavolcano-touroperator.com/#organization",
        name: "Java Volcano Tour Operator (JVTO)",
        alternateName: "JVTO",
        url: "https://javavolcano-touroperator.com",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        logo: "https://legacy.javavolcano-touroperator.com/assets/img/jvto-color.png",
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
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        inLanguage: "en",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
        name: "Safety on Tours — How JVTO Plans and Manages Risk",
        description:
          "Understand how safety is built into JVTO\u2019s private tours, what you can expect from us, and what we expect from you as a guest.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#article",
        },
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Travel Guide",
            item: "https://javavolcano-touroperator.com/travel-guide/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Safety on Tours",
            item: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          },
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#article",
        headline: "Safety on Tours — How JVTO Plans and Manages Risk",
        description:
          "Understand how safety is built into JVTO\u2019s private tours, what you can expect from us, and what we expect from you as a guest.",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/safety-on-tours#webpage",
        },
        articleSection: [
          "Our Safety Approach in One Look",
          "Before Your Trip: Information & Fitness",
          "During Your Tour: Crew, Vehicles & On-Site Decisions",
          "Volcanoes, Weather & Closures",
          "What You Can Expect from JVTO",
          "What JVTO Expects from You",
          "Related Safety Pages",
        ],
        articleBody: `
Safety on Tours — How We Make Decisions

This page explains how JVTO thinks about safety across all tours — on the road, at viewpoints, on trails, and around volcanoes.

Responsibility & Roles
JVTO is a registered Indonesian travel company specializing in private volcano tours. The company is led by a tourist police officer who works daily with real tourism and safety cases. Our crews (drivers and guides) are trained to follow internal procedures and local regulations, not just chase “the best photo”. On tour, the tour leader or guide and the driver are your first line of support. For larger groups, coordination may also involve local authorities when needed.

Before the Tour
Before your trip starts, we check recent updates on road and park conditions, review weather patterns and any official alerts, confirm hotel and transport availability, and align with local partners in key areas like Bromo, Ijen, and Tumpak Sewu. For Ijen, health screening is a mandatory part of preparation for those doing the night hike.

During the Tour
During your tour, our crew monitors conditions on the ground: weather, road status, crowding, and local announcements. They communicate with other operators and local contacts when necessary, and adjust timings if there are delays or sudden changes. We may leave earlier or later to avoid traffic or unsafe crowding, switch viewpoints if one area is too congested or temporarily restricted, or choose safer walking paths at waterfalls or along crater rims.

When Plans Need to Change
Sometimes, the safest decision is to change or cancel part of the plan. Reasons can include heavy rain, strong winds, or dense fog; volcanic gas levels or alerts; road closures, landslides, or accidents; or local ceremonies or regulations. If we need to change plans, we will explain why, propose reasonable alternatives where possible, and apply our Travel Credit rules if key elements cannot be operated.

Your Role as a Guest
Safety works best when everyone plays their part. We ask you to wear appropriate clothing and footwear, follow instructions from guides and drivers (especially in narrow, wet, or crowded areas), tell the crew immediately if you feel unwell, dizzy, or anxious, and be honest about your health and any conditions that might affect the trip. If you feel something is unsafe, you can always ask to slow down, stop, or skip an activity. There is no pressure to push through discomfort.

Alcohol, Substances & Risky Behaviour
For safety reasons, guests under the influence of alcohol or other substances may be refused participation in certain activities, especially hikes and steep trails. Dangerous behaviour that puts yourself or others at risk may result in parts of the tour being modified or stopped. Our priority is that everyone finishes the trip safely — guests, crew, and local communities.        
        `,
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        mentions: [
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
            name: "Ijen Health Screening",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
            name: "Police Escort for Groups",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
            name: "Packing & Fitness",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
            name: "Weather & Closures",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/booking-information",
            name: "Booking Information",
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Safety on Tours
              </span>
            </nav>
            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Safety on Tours — How We Make Decisions
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                This page explains how JVTO thinks about safety across all tours
                — on the road, at viewpoints, on trails, and around volcanoes.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Responsibility & Roles
              </h2>
              <p>
                JVTO is a registered Indonesian travel company specializing in
                private volcano tours. The company is led by a tourist police
                officer who works daily with real tourism and safety cases. Our
                crews (drivers and guides) are trained to follow internal
                procedures and local regulations, not just chase “the best
                photo”. On tour, the tour leader/guide and driver are your first
                line of support. For larger groups, coordination may also
                involve local authorities when needed.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Before the Tour
              </h2>
              <p>
                Before your trip starts, we check recent updates on road and
                park conditions, review weather patterns and any official
                alerts, confirm hotel and transport availability, and align with
                local partners in key areas like Bromo, Ijen, and Tumpak Sewu.
                For Ijen, health screening is a mandatory part of preparation
                for those doing the night hike.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                During the Tour
              </h2>
              <p>
                During your tour, our crew monitors conditions on the ground:
                weather, road status, crowding, and local announcements,
                communicates with other operators and local contacts when
                necessary, and adjusts timings if there are delays or sudden
                changes. We may leave earlier or later to avoid traffic or
                unsafe crowding, switch viewpoints if one area is too congested
                or temporarily restricted, or choose safer walking paths at
                waterfalls or along crater rims.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                When Plans Need to Change
              </h2>
              <p>
                Sometimes, the safest decision is to change or cancel part of
                the plan. Reasons can include heavy rain, strong winds, or dense
                fog, volcanic gas levels or alerts, road closures, landslides,
                or accidents, or local ceremonies or regulations. If we need to
                change plans we will explain why, we will propose reasonable
                alternatives where possible, and we will apply our Travel Credit
                rules if key elements cannot be operated. See{" "}
                <Link href="/travel-guide/weather-and-closures">
                  Weather & Closures
                </Link>{" "}
                and{" "}
                <Link href="/travel-guide/booking-information">
                  Booking Information
                </Link>
                .
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Your Role as a Guest
              </h2>
              <p>
                Safety works best when everyone plays their part. We ask you to
                wear appropriate clothing and footwear (see{" "}
                <Link href="/travel-guide/packing-and-fitness">
                  Packing & Fitness
                </Link>
                ), follow instructions from guides and drivers, especially in
                narrow, wet, or crowded areas, tell the crew immediately if you
                feel unwell, dizzy, or anxious, and be honest about your health
                and any conditions that might affect the trip. If you feel
                something is unsafe, you can always ask to slow down, stop, or
                skip an activity. There is no pressure to “push through”
                discomfort.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Alcohol, Substances & Risky Behaviour
              </h2>
              <p>
                For safety reasons, guests under the influence of alcohol or
                other substances may be refused participation in certain
                activities (especially hikes and steep trails). Dangerous
                behaviour that puts yourself or others at risk may result in
                parts of the tour being modified or stopped. Our priority is
                that everyone finishes the trip safely — guests, crew, and local
                communities.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
