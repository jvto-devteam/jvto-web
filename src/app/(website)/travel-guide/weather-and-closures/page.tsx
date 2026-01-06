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
          "Why Conditions Can Change",
          "How JVTO Handles Safety & Access",
          "Blue Fire, Sunrise Views & Visibility",
          "If JVTO Must Change or Cancel (Force Majeure)"
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
                  <strong>Note:</strong> This Travel Guide is for information and trip planning. For binding terms (payments, cancellations, refunds/credits), please refer to the official policies and your <strong>Official E-Voucher / Invoice (PDF)</strong>. If anything differs, the E-Voucher/Invoice and the Policy pages take precedence.
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
                  1) Why Conditions Can Change
                </h2>
                <p className="text-muted-foreground mb-4">
                  Routes may change due to factors such as:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>volcanic activity and sulfur gas exposure levels,</li>
                  <li>extreme weather, heavy rain, or unsafe terrain,</li>
                  <li>national park closures or partial access restrictions,</li>
                  <li>road and traffic constraints (especially during peak periods).</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) How JVTO Handles Safety & Access
                </h2>
                <p className="text-muted-foreground mb-4">
                  JVTO coordinates with local teams and follows legal access rules for parks and sites.
                </p>
                <p className="text-muted-foreground mb-4">
                  If conditions change, JVTO may:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>adjust timing (earlier/later departures),</li>
                  <li>change viewpoints/route segments,</li>
                  <li>substitute a closed site with a safer alternative (where feasible).</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) Blue Fire, Sunrise Views & Visibility
                </h2>
                <p className="text-muted-foreground">
                  Natural phenomena (blue fire visibility, clear sunrise views) depend on conditions and cannot be guaranteed. JVTO will prioritise safety and legal access.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) If JVTO Must Change or Cancel (Force Majeure)
                </h2>
                <p className="text-muted-foreground mb-4">
                  In rare cases, JVTO may need to change or cancel a portion of the program due to safety/legal closures.
                </p>
                <p className="text-muted-foreground mb-4">
                  Remedies follow the official policy under "Changes or Cancellation by JVTO / Force Majeure".
                </p>
                <p className="text-muted-foreground">
                  Policy:{' '}
                  <Link href="/policy/booking-payment-cancellation" className="text-primary hover:underline">
                    /policy/booking-payment-cancellation
                  </Link>
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
                      If Bromo is closed for safety reasons, JVTO may substitute with alternative viewpoints or activities. The specific remedy depends on what costs have already been committed and the terms in your Booking, Payment & Cancellation Policy.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Do I get a refund if weather affects my tour?
                    </h3>
                    <p className="text-muted-foreground">
                      Weather-related changes are handled differently from guest cancellations. If JVTO can provide alternative arrangements, these will be offered. Refunds depend on what costs have already been committed to third parties (hotels, permits, etc.).
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      How will I know if there are last-minute changes?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO communicates through official WhatsApp channels. Keep your phone accessible, especially on travel dates. Our crew will also provide real-time updates during the tour.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What should I pack for changing mountain weather?
                    </h3>
                    <p className="text-muted-foreground">
                      Pack layers: warm clothing for cold mornings (especially for Bromo sunrise), waterproof jacket, proper hiking shoes with good grip, and sun protection. Check our Packing & Fitness guide for detailed recommendations.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can I cancel my tour if the weather forecast looks bad?
                    </h3>
                    <p className="text-muted-foreground">
                      Guest cancellations follow the standard cancellation rules, including the 48-hour cutoff. Weather forecasts don't automatically trigger cancellations - JVTO makes decisions based on actual conditions and safety assessments on the day.
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