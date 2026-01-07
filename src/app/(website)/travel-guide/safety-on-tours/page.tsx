import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Safety on JVTO Tours — How We Plan & What You Should Know",
  description:
    "How Java Volcano Tour Operator manages safety on private tours to Bromo, Ijen and Tumpak Sewu. Police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
  openGraph: {
    title: "Safety on JVTO Tours — How We Plan & What You Should Know",
    description:
      "How Java Volcano Tour Operator manages safety on private tours to Bromo, Ijen and Tumpak Sewu. Police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
    url: `${siteUrl}/travel-guide/safety-on-tours`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/travel-guide.webp",
        width: 1200,
        height: 630,
        alt: "Safety on Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Safety on JVTO Tours — How We Plan & What You Should Know",
    description:
      "How Java Volcano Tour Operator manages safety on private tours to Bromo, Ijen and Tumpak Sewu. Police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
    images: [siteUrl + "/assets/img/og/travel-guide.webp"],
  },
};

export default function SafetyOnToursPage() {
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
        name: "Safety on JVTO Tours — How We Plan & What You Should Know",
        description:
          "How Java Volcano Tour Operator manages safety on private tours to Bromo, Ijen and Tumpak Sewu. Police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
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
        headline: "Safety on JVTO Tours — How We Plan & What You Should Know",
        description:
          "How Java Volcano Tour Operator manages safety on private tours to Bromo, Ijen and Tumpak Sewu. Police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
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
          "Our Approach to Safety",
          "Official Information Sources We Monitor",
          "How Safety Is Built into Each Tour",
          "Your Responsibilities as a Guest",
          "Volcanic Alerts, Weather & Itinerary Changes",
          "Ijen Health Screening and Medical Limits",
          "Insurance, Documents & Emergency Support",
          "Where to Go Next in the Travel Guide",
        ],
        articleBody:
          "How Java Volcano Tour Operator manages safety on private tours to Bromo, Ijen and Tumpak Sewu. Police-informed planning, health screening, official MAGMA Indonesia updates and clear guest responsibilities.",
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
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
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

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Safety on JVTO Tours
              </h1>

              {/* Disclaimer Box */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left rounded-r-lg">
                <p className="text-sm italic mb-2">
                  <strong>Note:</strong> This Travel Guide is for information
                  and trip planning. For binding terms (payments, cancellations,
                  refunds/credits), please refer to the official policies and
                  your <strong>Official E-Voucher / Invoice (PDF)</strong>. If
                  anything differs, the E-Voucher/Invoice and the Policy pages
                  take precedence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose max-w-none space-y-12">
              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  1) Our Approach to Safety
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect safety to be built into route design, partners, and
                    documented processes.
                  </strong>{" "}
                  JVTO is presented as a licensed Indonesian inbound operator
                  led by an active Tourist Police officer, and this is stated to
                  influence how tours are designed and run.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect private-only operations with dedicated vehicles and
                    briefings.
                  </strong>{" "}
                  Every JVTO tour is private-only: no open-group buses, no
                  mixing with strangers, and your group gets its own vehicle,
                  schedule, and briefings.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) Official Information Sources We Monitor
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect JVTO to use official sources for volcano and
                    geohazard context.
                  </strong>{" "}
                  Before and during your tour, JVTO states it follows official
                  sources, in particular MAGMA Indonesia (PVMBG) for volcanic
                  and geohazard information, hazard maps, and recommendations.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use VONA notices only if you understand technical formats.
                  </strong>{" "}
                  VONA is described as a specialised service within MAGMA for
                  aviation ash notices, and an example technical endpoint is
                  provided:{" "}
                  <a
                    href="https://magma.esdm.go.id/v1/vona?code=KRA"
                    className="text-primary hover:underline break-all"
                  >
                    https://magma.esdm.go.id/v1/vona?code=KRA
                  </a>{" "}
                  This is described as technical and not required for guests to
                  interpret directly.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect local authority announcements to influence access.
                  </strong>{" "}
                  JVTO references local authorities and park management updates
                  for closures, restricted zones, and safety conditions.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect itinerary changes to follow related Travel Guide
                    rules.
                  </strong>{" "}
                  When risk or restrictions affect plans, changes follow{" "}
                  <Link
                    href="/travel-guide/weather-and-closures"
                    className="text-primary hover:underline"
                  >
                    /travel-guide/weather-and-closures
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/travel-guide/booking-information"
                    className="text-primary hover:underline"
                  >
                    /travel-guide/booking-information
                  </Link>
                  .
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) How Safety Is Built into Each Tour
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect professional transport, licensed local guides, and
                    structured briefings.
                  </strong>{" "}
                  JVTO describes private vehicles with professional drivers,
                  licensed local guides around key sites, and structured
                  briefings before major activities.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect Ijen to add screening and gas management steps.
                  </strong>{" "}
                  Ijen routes include screening by trained medical staff, gas
                  masks, and guidance on when to stop or turn back if conditions
                  change.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect large groups to use formal escort logic where
                    applicable.
                  </strong>{" "}
                  For large groups, JVTO may coordinate official traffic police
                  escort on specific segments under{" "}
                  <Link
                    href="/travel-guide/police-escort-for-groups"
                    className="text-primary hover:underline"
                  >
                    /travel-guide/police-escort-for-groups
                  </Link>
                  .
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Your Responsibilities as a Guest
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Treat safety as shared and dependent on honest information
                    and compliance.
                  </strong>{" "}
                  Guests are asked to be honest about health and mobility,
                  follow medical staff guidance during Ijen screening, respect
                  restrictions, stay with the group, and tell guides immediately
                  if serious symptoms occur.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use appropriate gear and follow instructions to prevent risk
                    escalation.
                  </strong>{" "}
                  Guests are instructed to bring and use appropriate gear as
                  described in{" "}
                  <Link
                    href="/travel-guide/packing-and-fitness"
                    className="text-primary hover:underline"
                  >
                    /travel-guide/packing-and-fitness
                  </Link>{" "}
                  and to follow guide instructions and marked paths.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Volcanic Alerts, Weather & Itinerary Changes
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect volcano and mountain weather to trigger changes
                    quickly.
                  </strong>{" "}
                  JVTO describes monitoring sources, adjusting
                  times/viewpoints/routes, explaining changes in plain language,
                  and applying closure and reroute rules from{" "}
                  <Link
                    href="/travel-guide/weather-and-closures"
                    className="text-primary hover:underline"
                  >
                    /travel-guide/weather-and-closures
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/travel-guide/booking-information"
                    className="text-primary hover:underline"
                  >
                    /travel-guide/booking-information
                  </Link>
                  .
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use official sources if you want national context, but do
                    not rely on raw codes for decision-making.
                  </strong>{" "}
                  Guests may consult official MAGMA information and the VONA
                  feed if familiar, but JVTO states it handles interpretation
                  and planning.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) Ijen Health Screening and Medical Limits
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect screening to be standard for Ijen routes and to
                    influence participation.
                  </strong>{" "}
                  Screening is included, performed by trained staff, and may
                  result in advice not to hike if unsafe.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Treat "cleared" outcomes as risk reduction, not risk
                    elimination.
                  </strong>{" "}
                  A cleared screening reduces risk but does not make the hike
                  risk-free, and guides retain the right to stop or turn back if
                  conditions become unsafe.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) Insurance, Documents & Emergency Support
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Arrange travel insurance that covers hiking and disruption
                    risks.
                  </strong>{" "}
                  Insurance is strongly recommended for trekking/hiking,
                  interruptions due to natural events, and medical evacuation
                  and treatment.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Carry basic documents and emergency information.
                  </strong>{" "}
                  Guests are advised to carry passport copy, insurance details,
                  and important contacts.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect JVTO to maintain internal route and contact
                    readiness.
                  </strong>{" "}
                  JVTO describes keeping emergency contacts and route plans
                  known to the office and maintaining access to local health
                  facilities, following local/national guidance for evacuations
                  or restrictions.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  8) Where to Go Next in the Travel Guide
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use these pages together as the official reference set.
                  </strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="/travel-guide/booking-information"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/booking-information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/faq"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/faq
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/packing-and-fitness"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/packing-and-fitness
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/ijen-health-screening"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/ijen-health-screening
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/weather-and-closures"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/weather-and-closures
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel-guide/police-escort-for-groups"
                      className="text-primary hover:underline"
                    >
                      /travel-guide/police-escort-for-groups
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What safety equipment is provided for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      When Ijen is included, JVTO typically provides a
                      sulfur-rated gas mask for each guest and trekking support
                      (poles depending on configuration).
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What happens in case of a medical emergency?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO crew can help coordinate basic response and assist
                      with local clinics/hospitals where feasible. However,
                      guests must have their own travel insurance for medical
                      and evacuation coverage.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can JVTO cancel tours for safety reasons?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, JVTO may adjust routes or activities when required
                      for safety due to weather, volcanic activity, closures, or
                      other risks. Safety is our priority.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What if a guest doesn't follow safety instructions?
                    </h3>
                    <p className="text-muted-foreground">
                      Guests must follow crew instructions and respect safety
                      boundaries. JVTO may restrict access to unsafe areas or
                      activities if guests engage in risky behavior.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What is the health screening for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      When Ijen is included, JVTO arranges a mandatory pre-hike
                      health screening by trained medical staff to ensure guests
                      are fit for the trek. This typically includes basic
                      measurements and questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
