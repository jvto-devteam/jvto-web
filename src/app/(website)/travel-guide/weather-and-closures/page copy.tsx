import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Weather, Volcano Alerts & Closures – How JVTO Handles Changes",
  description:
    "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work.",
  openGraph: {
    title: "Weather, Volcano Alerts & Closures – How JVTO Handles Changes",
    description:
      "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work.",
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
    title: "Weather, Volcano Alerts & Closures – How JVTO Handles Changes",
    description:
      "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work.",
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
        logo: "https://legacy.javavolcano-touroperator.com/assets/img/jvto-logo.png",
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
          "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work.",
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
          siteUrl + "/assets/img/jvto-logo.png",
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
          "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work.",
        inLanguage: "en",
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        image: [
          siteUrl + "/assets/img/jvto-logo.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/weather-and-closures#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "Intro",
          "Factors That Can Change a Volcano or Waterfall Tour",
          "How JVTO Monitors Conditions & Decides on Changes",
          "Partial Closures vs Full Closures",
          "Alternative Routes & Adjustments",
          "Blue Fire, Sunrise Views & Visibility",
          "Closures, Travel Credit & External Events",
          "Your Role as a Guest During Uncertain Conditions",
          "Which Document Wins if There Is a Difference?",
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
    <div className="flex min-h-screen bg-background">
      <StructuredData data={pageSchema} />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav className="mb-4  text-sm text-muted-foreground">
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
            <div className=" mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Weather, Volcano Alerts & Closures
              </h1>

              {/* Intro Section */}
              <div className="prose max-w-none text-left bg-white p-6 rounded-lg shadow-sm mb-6">
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use this page to understand how closures and changing
                    conditions can affect a private tour and how JVTO responds.
                  </strong>{" "}
                  Volcanoes and waterfalls are part of a changing natural
                  environment, and this page explains how weather, volcanic
                  activity, and access closures can affect your tour and how
                  JVTO responds.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use your E-Voucher and Booking Policy for binding details.
                  </strong>{" "}
                  This is a plain-language summary; for legal details and
                  specific cases, your Official E-Voucher and the Booking,
                  Payment & Cancellation Policy are the final reference.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose max-w-none space-y-12">
              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  1) Factors That Can Change a Volcano or Waterfall Tour
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect access and timing to change due to natural events and
                    official regulations.
                  </strong>{" "}
                  Routes can be influenced by heavy rain, fog, strong winds,
                  lightning, ash, gas emissions, landslides, floods, road
                  damage, forest fires, smoke, ceremonies, and temporary rules.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect partial impacts or full closure depending on
                    severity.
                  </strong>{" "}
                  Sometimes only specific areas are affected; sometimes full
                  closure applies for safety and legal reasons.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) How JVTO Monitors Conditions & Decides on Changes
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect decisions to use local reports and official inputs.
                  </strong>{" "}
                  JVTO uses local guide/driver reports, park and government
                  information, and updates linked to alert levels, gas, and
                  weather.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect changes when conditions are unsafe or access is
                    restricted.
                  </strong>{" "}
                  When conditions are clearly unsafe or formally restricted,
                  JVTO adjusts plans in line with regulations, safety
                  considerations, and the options allowed under the Booking,
                  Payment & Cancellation Policy.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) Partial Closures vs Full Closures
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect JVTO to distinguish partial closures from full
                    closures.
                  </strong>{" "}
                  Not all changes are the same, and restrictions may affect
                  certain viewpoints, rim sections, crater floor access, or
                  lower paths at waterfalls.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect partial closures to keep a modified structure where
                    possible.
                  </strong>{" "}
                  In partial closures, JVTO typically adapts to what is still
                  legally and safely accessible while keeping the main structure
                  of your tour.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Alternative Routes & Adjustments
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect JVTO to propose alternatives where feasible and
                    explain how they relate to policy.
                  </strong>{" "}
                  JVTO will inform you as early as reasonably possible, propose
                  alternative viewpoints/routes/activities where available, and
                  explain how changes relate to the Booking, Payment &
                  Cancellation Policy and your Official E-Voucher.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect some substitutions to differ from the original
                    experience.
                  </strong>{" "}
                  Some alternatives may not fully match the original plan but
                  are chosen to keep your trip running safely and legally.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Blue Fire, Sunrise Views & Visibility
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Do not treat blue fire or perfect sunrise views as
                    guarantees.
                  </strong>{" "}
                  Blue fire and specific views depend on wind, gas, clouds, fog,
                  crowd control, and regulations.
                </p>
                <p className="text-muted-foreground">
                  <strong>Treat photos as examples, not promises.</strong>{" "}
                  Screenshots or photos on the website and social media are
                  examples of past conditions, not promises for your specific
                  date.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) Closures, Travel Credit & External Events
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect closure responses to follow official decisions and
                    your booking documents.
                  </strong>{" "}
                  JVTO aligns with authorities, applies options described in
                  your Booking, Payment & Cancellation Policy and Official
                  E-Voucher, and may continue with a modified route or apply
                  Travel Credit where applicable.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Use this page for principles, not every scenario.
                  </strong>{" "}
                  This page explains guiding principles rather than every
                  possible scenario.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) Your Role as a Guest During Uncertain Conditions
                </h2>
                <p className="text-muted-foreground">
                  <strong>
                    Help keep the tour safe by following briefings and accepting
                    reasonable flexibility.
                  </strong>{" "}
                  Read briefings, follow instructions from crew and authorities,
                  and allow flexibility when conditions change plans.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  8) Which Document Wins if There Is a Difference?
                </h2>
                <p className="text-muted-foreground">
                  <strong>
                    Follow the document hierarchy if wording differs.
                  </strong>{" "}
                  Priority order: Official E-Voucher/Invoice → Booking, Payment
                  & Cancellation Policy → Inclusions & Exclusions Policy →
                  general website and informal communication.
                </p>
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
