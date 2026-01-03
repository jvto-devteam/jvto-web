import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Weather, Volcano Alerts & Closures",
  description:
    "How JVTO handles weather changes, volcanic alerts, and site closures for Bromo, Ijen and Tumpak Sewu tours. Safety procedures and operational guidelines.",
  openGraph: {
    title: "Weather, Volcano Alerts & Closures",
    description:
      "How JVTO handles weather changes, volcanic alerts, and site closures for Bromo, Ijen and Tumpak Sewu tours. Safety procedures and operational guidelines.",
    url: `${siteUrl}/travel-guide/weather-and-closures`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/weather-closures.webp",
        width: 1200,
        height: 630,
        alt: "Weather and Closures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather, Volcano Alerts & Closures",
    description:
      "How JVTO handles weather changes, volcanic alerts, and site closures for Bromo, Ijen and Tumpak Sewu tours. Safety procedures and operational guidelines.",
    images: [siteUrl + "/assets/img/og/weather-closures.webp"],
  },
};

export default function WeatherAndClosuresPage() {
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
          { "@type": "AdministrativeArea", name: "East Java" },
          { "@type": "Country", name: "Indonesia" },
          { "@type": "City", name: "Surabaya" },
          { "@type": "Place", name: "Bali" },
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
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator (JVTO)",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
      },

      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
        name: "Weather, Volcano Alerts & Closures",
        description:
          "How JVTO handles weather changes, volcanic alerts, and site closures for Bromo, Ijen and Tumpak Sewu tours. Safety procedures and operational guidelines.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        image: [
          siteUrl + "/assets/img/jvto-color.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#article",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        ],
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        about: [
          {
            "@type": "TouristAttraction",
            name: "Mount Bromo",
            url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
          },
          {
            "@type": "TouristAttraction",
            name: "Ijen Crater",
            url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
          },
          {
            "@type": "TouristAttraction",
            name: "Tumpak Sewu Waterfall",
            url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
          },
        ],
      },

      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#breadcrumb",
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
            item: "https://javavolcano-touroperator.com/travel-guide",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Weather, Volcano Alerts & Closures",
            item: "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
          },
        ],
      },

      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#article",
        headline: "Weather, Volcano Alerts & Closures",
        description:
          "How JVTO handles weather changes, volcanic alerts, and site closures for Bromo, Ijen and Tumpak Sewu tours. Safety procedures and operational guidelines.",
        inLanguage: "en",
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        image: [
          siteUrl + "/assets/img/jvto-color.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "Why conditions can change fast",
          "What JVTO monitors",
          "How JVTO handles closures",
          "What you should prepare",
          "Cancellations vs closures",
          "Driving times & buffers",
          "Communication",
          "Binding note",
        ],
        about: [
          {
            "@type": "TouristAttraction",
            name: "Mount Bromo",
            url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
          },
          {
            "@type": "TouristAttraction",
            name: "Ijen Crater",
            url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
          },
          {
            "@type": "TouristAttraction",
            name: "Tumpak Sewu Waterfall",
            url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
          },
        ],
        articleBody:
          "Information about weather conditions, volcanic alerts, and site closures for Bromo, Ijen and Tumpak Sewu tours. How JVTO handles safety changes and operational adjustments.",
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
                Weather & Closures
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Weather, Volcano Alerts & Closures
              </h1>

              {/* Disclaimer Box */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left rounded-r-lg">
                <p className="text-sm italic mb-2">
                  This page is informational. Binding terms are defined by the
                  documents below.
                </p>
                <p className="font-semibold text-foreground mb-2">
                  Order of precedence (if there is any discrepancy):
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>
                    Official E-Voucher / Invoice (PDF) (your booking-specific
                    contract)
                  </li>
                  <li>
                    <Link
                      href="/policy/booking-cancellation"
                      className="text-primary hover:underline"
                    >
                      Booking, Payment & Cancellation Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/policy/inclusions-exclusions"
                      className="text-primary hover:underline"
                    >
                      Inclusions & Exclusions Policy
                    </Link>
                  </li>
                  <li>Travel Guide pages (informational)</li>
                </ol>
              </div>

              {/* Contact Help */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded-r-lg">
                <p className="font-semibold text-foreground mb-2">Need help?</p>
                <p className="text-sm">
                  WhatsApp{" "}
                  <a
                    href="https://wa.me/6282244788833"
                    className="text-primary hover:underline"
                  >
                    +62 822-4478-8833
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:hello@javavolcano-touroperator.com"
                    className="text-primary hover:underline"
                  >
                    hello@javavolcano-touroperator.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Section 1 */}
              <div id="conditions-change" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  1) Why conditions can change fast
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Mountain weather and volcanic activity can change quickly.
                    Safety decisions may require route adjustments,
                    rescheduling, or site substitutions.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="jvto-monitors" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  2) What JVTO monitors
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO monitors relevant conditions to support trip planning
                    and on-ground coordination. Final decisions regarding site
                    access and closures are made by the relevant park offices
                    and local authorities.
                  </p>{" "}
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>local weather conditions along the route</li>
                    <li>
                      site access conditions communicated by local
                      authorities/park offices
                    </li>
                    <li>
                      operational constraints (road closures, safety alerts)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div id="handling-closures" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  3) How JVTO handles closures
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>If a site is closed or unsafe:</p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>
                      JVTO may substitute an alternative site or adjust timings;
                    </li>
                    <li>JVTO will prioritize safety and practicality;</li>
                    <li>
                      the remedy depends on what costs are already committed to
                      third parties (e.g., tickets, hotels).
                    </li>
                  </ul>
                  <p>
                    Binding terms are in the{" "}
                    <Link
                      href="/policy/booking-cancellation"
                      className="text-primary hover:underline"
                    >
                      Booking, Payment & Cancellation Policy
                    </Link>{" "}
                    and your voucher.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="what-to-prepare" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  4) What you should prepare
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>Prepare for cold mornings and wet conditions:</p>
                  <ul className="list-disc pl-5 space-y-2 my-4">
                    <li>warm layers (especially for sunrise)</li>
                    <li>rain protection</li>
                    <li>proper footwear for wet terrain</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div id="cancellations-vs-closures" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  5) Cancellations vs closures
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Guest cancellations follow the standard cancellation rules
                    as stated in the Booking, Payment & Cancellation Policy
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="driving-times" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  6) Driving times & buffers
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Driving times in East Java can vary due to traffic, weather,
                    and road works. JVTO includes buffer planning where
                    possible, but flexibility is essential in mountain
                    logistics.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="communication" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  7) Communication
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    JVTO will communicate changes through official channels.
                    Please keep your WhatsApp reachable during travel dates.
                    Changes may be communicated at night or early morning due to
                    sunrise or trek schedules.
                  </p>{" "}
                </div>
              </div>

              {/* Section 8 */}
              <div id="binding-note" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  8) Binding note
                </h2>
                <div className="prose max-w-none text-muted-foreground space-y-4">
                  <p>
                    Your Official E-Voucher / Invoice (PDF) remains the
                    booking-specific reference for inclusions and plan details.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="scroll-mt-24">
                <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4 text-foreground">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What happens if Bromo is closed due to volcanic activity?
                    </h3>
                    <p className="text-muted-foreground">
                      If Bromo is closed for safety reasons, JVTO may substitute
                      with alternative viewpoints or activities. The specific
                      remedy depends on what costs have already been committed
                      and the terms in your Booking, Payment & Cancellation
                      Policy.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Do I get a refund if weather affects my tour?
                    </h3>
                    <p className="text-muted-foreground">
                      Weather-related changes are handled differently from guest
                      cancellations. If JVTO can provide alternative
                      arrangements, these will be offered. Refunds depend on
                      what costs have already been committed to third parties
                      (hotels, permits, etc.).
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      How will I know if there are last-minute changes?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO communicates through official WhatsApp channels. Keep
                      your phone accessible, especially on travel dates. Our
                      crew will also provide real-time updates during the tour.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What should I pack for changing mountain weather?
                    </h3>
                    <p className="text-muted-foreground">
                      Pack layers: warm clothing for cold mornings (especially
                      for Bromo sunrise), waterproof jacket, proper hiking shoes
                      with good grip, and sun protection. Check our Packing &
                      Fitness guide for detailed recommendations.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can I cancel my tour if the weather forecast looks bad?
                    </h3>
                    <p className="text-muted-foreground">
                      Guest cancellations follow the standard cancellation
                      rules, including the 48-hour cutoff. Weather forecasts
                      don't automatically trigger cancellations - JVTO makes
                      decisions based on actual conditions and safety
                      assessments on the day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div
                id="important-notice"
                className="scroll-mt-24 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
              >
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Important Notice About Natural Phenomena
                </h3>
                <p className="text-muted-foreground mb-3">
                  Certain natural phenomena like blue fire at Ijen and perfect
                  sunrise views at Bromo depend on:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Wind direction and gas levels at Ijen</li>
                  <li>Cloud cover and fog conditions</li>
                  <li>Park regulations and crowd control measures</li>
                  <li>Current volcanic activity levels</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  JVTO plans itineraries based on the best available local
                  knowledge, but these phenomena are never guaranteed.
                  Screenshots or photos on our website are examples of past
                  conditions, not promises for your specific date.
                </p>
              </div>

              {/* Weather Preparedness Checklist */}
              <div
                id="preparedness-checklist"
                className="scroll-mt-24 bg-gray-50 p-6 rounded-lg"
              >
                <h2 className="heading-md font-black text-2xl mb-6 text-foreground">
                  Weather Preparedness Checklist
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      For Cold Mornings (Bromo/Ijen)
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Warm jacket or fleece layer</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Thermal base layer</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Beanie or warm hat</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Gloves (lightweight)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Extra pair of socks</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      For Wet Conditions (Waterfalls)
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Waterproof jacket or poncho</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Quick-dry clothing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Waterproof shoes or sandals with grip</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Waterproof bag for electronics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>Small towel and change of clothes</span>
                      </li>
                    </ul>
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
