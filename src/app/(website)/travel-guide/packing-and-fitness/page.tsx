import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
  description:
    "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
  openGraph: {
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
    description:
      "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
    url: `${siteUrl}/travel-guide/packing-and-fitness`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/packing-fitness.webp",
        width: 1200,
        height: 630,
        alt: "Packing and Fitness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
    description:
      "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
    images: [siteUrl + "/assets/img/og/packing-fitness.webp"],
  },
};

export default function PackingAndFitnessPage() {
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
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
        name: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
        description:
          "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
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
            "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#article",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
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
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#breadcrumb",
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
            name: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
            item: "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          },
        ],
      },

      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#article",
        headline: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
        description:
          "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
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
            "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "What to Expect Physically",
          "Simple Fitness Self-Check",
          "Essentials for All Volcano Routes",
          "Extra Items for Mount Bromo",
          "Extra Items for Ijen Night Hike",
          "Extra Items for Tumpak Sewu",
          "Official References",
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
          "Essential packing list and fitness guidelines for Bromo, Ijen, and Tumpak Sewu tours. Practical tips for cold weather, night treks, and waterfall hikes.",
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
                Packing & Fitness
              </span>
            </nav>

            {/* Main Header */}
            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Packing & Fitness for Bromo, Ijen & Tumpak Sewu
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
                  1) What to Expect Physically
                </h2>
                <p className="text-muted-foreground mb-4">
                  JVTO routes often involve:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>early departures,</li>
                  <li>uneven terrain and stairs (waterfalls),</li>
                  <li>cold wind at viewpoints,</li>
                  <li>optional hiking segments (especially Ijen).</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) Simple Fitness Self-Check
                </h2>
                <p className="text-muted-foreground mb-4">
                  Before booking, consider whether you can comfortably handle:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>sustained walking on inclines,</li>
                  <li>cold conditions at night/early morning,</li>
                  <li>basic exertion at altitude.</li>
                </ul>
                <p className="text-muted-foreground">
                  If you have concerns, message JVTO via official WhatsApp/email so we can advise based on your route.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) Essentials for All Volcano Routes
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Warm layers (jacket, long pants)</li>
                  <li>Closed shoes with grip (sneakers/trekking shoes)</li>
                  <li>Rain protection (light rain jacket or poncho)</li>
                  <li>Personal medications</li>
                  <li>Power bank (cold mornings can drain batteries faster)</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Extra Items for Mount Bromo
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Gloves / beanie for early morning wind</li>
                  <li>Mask or scarf for dust (conditions vary)</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) Extra Items for Ijen Night Hike
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>Headlamp (recommended) or reliable flashlight</li>
                  <li>Comfortable hiking shoes</li>
                  <li>Warm layers</li>
                  <li>Follow all instructions regarding health screening and gas mask use</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) Extra Items for Tumpak Sewu
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Sandals/water shoes (optional) and quick-dry clothing</li>
                  <li>Dry bag / waterproof cover for electronics</li>
                </ul>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) Official References
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    Inclusions & Exclusions:{' '}
                    <Link href="/policy/inclusions-exclusions" className="text-primary hover:underline">
                      /policy/inclusions-exclusions
                    </Link>
                  </li>
                  <li>
                    Booking Policy:{' '}
                    <Link href="/policy/booking-payment-cancellation" className="text-primary hover:underline">
                      /policy/booking-payment-cancellation
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
                      How cold does it get at Bromo sunrise?
                    </h3>
                    <p className="text-muted-foreground">
                      Temperatures at Bromo viewpoints can drop to 5-10°C (41-50°F), and with wind chill it can feel even colder. Layered clothing, a warm jacket, beanie, and gloves are essential.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What type of shoes are best?
                    </h3>
                    <p className="text-muted-foreground">
                      For Bromo and Ijen: closed walking shoes or light hiking boots with good grip. For Tumpak Sewu: shoes that can get wet with excellent traction, or sport sandals with heel straps.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Do I need to bring my own gas mask for Ijen?
                    </h3>
                    <p className="text-muted-foreground">
                      No, when Ijen is included in your tour, JVTO typically provides a professional gas mask suitable for sulfur conditions. This is included as written on your voucher/package.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What if I'm not very fit?
                    </h3>
                    <p className="text-muted-foreground">
                      JVTO aims to support guests with various fitness levels and pacing. However, guests should be able to walk 3–4 hours with breaks (typical range depends on the itinerary). If you have concerns, please discuss them with JVTO before booking to assess suitability.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can children join these tours?
                    </h3>
                    <p className="text-muted-foreground">
                      Some itineraries are family-friendly, but certain hikes (especially Ijen night trek and Tumpak Sewu) may not be suitable for young children. JVTO can advise on age-appropriate alternatives.
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