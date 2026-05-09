import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title:
    "Official Traffic Police Escort for Tourist Groups in East Java | JVTO",
  description:
    "Learn how official traffic police escort can be coordinated for larger tourist groups in East Java, when it is appropriate, and how JVTO handles requests and written approvals.",
  openGraph: {
    title:
      "Official Traffic Police Escort for Tourist Groups in East Java | JVTO",
    description:
      "Learn how official traffic police escort can be coordinated for larger tourist groups in East Java, when it is appropriate, and how JVTO handles requests and written approvals.",
    url: `${siteUrl}/travel-guide/police-escort-for-groups`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/travel-guide.webp",
        width: 1200,
        height: 630,
        alt: "Police Escort for Groups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Official Traffic Police Escort for Tourist Groups in East Java | JVTO",
    description:
      "Learn how official traffic police escort can be coordinated for larger tourist groups in East Java, when it is appropriate, and how JVTO handles requests and written approvals.",
    images: [siteUrl + "/assets/img/og/travel-guide.webp"],
  },
};

export default function PoliceEscortForGroupsPage() {
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
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        name: "Traffic Police Escort for Tourist Groups in East Java",
        description:
          "Learn how official traffic police escort can be coordinated for larger tourist groups in East Java, when it is appropriate, and how JVTO handles requests and written approvals.",
        inLanguage: "en",
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#faq",
          },
        ],
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#article",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
          "https://javavolcano-touroperator.com/why-jvto/reviews",
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#breadcrumb",
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
            name: "Traffic Police Escort for Groups",
            item: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
          },
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#article",
        headline: "Traffic Police Escort for Tourist Groups in East Java",
        description:
          "Learn how official traffic police escort can be coordinated for larger tourist groups in East Java, when it is appropriate, and how JVTO handles requests and written approvals.",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "Intro",
          "What 'Traffic Police Escort' Means in Practice",
          "When Can a Traffic Police Escort Be Considered?",
          "How Requests Are Made & Approved",
          "Costs & What Is Included (If Approved)",
          "What an Escort Does – And What It Is Not",
          "Behaviour Expectations for Groups with Escort",
          "How JVTO's Tourist Police Experience Fits Into This",
          "Where to Check Your Group's Exact Arrangement",
        ],
        articleBody:
          "Information about official traffic police escort services for larger tourist groups in East Java. When it's appropriate, how it's arranged, and what it includes.",
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
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
            name: "Safety On Tours",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#faq",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        inLanguage: "en",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntity: [
          {
            "@type": "Question",
            name: "Is police escort included in standard tour packages?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Police escort is a conditional inclusion and only applies if explicitly written on your package page and/or voucher.",
            },
          },
          {
            "@type": "Question",
            name: "Can any group request police escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It may be considered for large group movements or VIP arrangements, but availability depends on local regulations and operational feasibility.",
            },
          },
          {
            "@type": "Question",
            name: "Does police escort guarantee faster travel times?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Safety always overrides speed. Escort helps with coordination but does not override road laws, weather limits, or park closures.",
            },
          },
          {
            "@type": "Question",
            name: "How is police escort arranged?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If applicable, JVTO confirms feasibility and availability. Details (timing, route constraints) will be communicated in writing when applicable.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if conditions change?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Availability depends on local regulations and operational conditions. JVTO cannot promise this service unless it is confirmed in writing.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StructuredData data={pageSchema} />
      <Sidebar/>

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
                Police Escort for Groups
              </span>
            </nav>

            {/* Main Header */}
            <div className=" mb-12">
              <h1 className="font-black text-2xl md:text-5xl mb-6">
                Traffic Police Escort for Tourist Groups in East Java
              </h1>

              {/* Intro Section */}
              <div className="prose max-w-none text-left bg-white p-6 rounded-lg shadow-sm mb-6">
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use this page to understand what official traffic police
                    escort is, when it is appropriate, and how it is requested.
                  </strong>{" "}
                  This page explains how official traffic police escort can be
                  coordinated for certain larger groups travelling with JVTO in
                  East Java.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Do not treat escort as guaranteed or informal.
                  </strong>{" "}
                  Escort is not guaranteed for every group and is not an offer
                  of unofficial or informal privileges.
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
                  1) What "Traffic Police Escort" Means in Practice
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Treat escort as a legally authorised convoy support service.
                  </strong>{" "}
                  Escort refers to official traffic police support such as
                  marked police vehicles guiding a convoy on specific segments
                  and assisting convoy movement through junctions.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Treat escort as safety support—not rule bypass.
                  </strong>{" "}
                  Escort is not a license to ignore traffic laws, a guarantee of
                  higher speeds, or an informal favour sold as a trick.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2) When Can a Traffic Police Escort Be Considered?
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Consider escort only for larger, multi-vehicle convoys on
                    specific segments.
                  </strong>{" "}
                  JVTO generally considers requesting escort when the group is
                  significantly larger (for example, around 18 guests or more),
                  multiple vehicles move together, and certain segments benefit
                  from coordinated movement.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Treat approval as conditional and authority-driven.
                  </strong>{" "}
                  Escort is never automatic and depends on law, regulations,
                  availability, and police priorities.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3) How Requests Are Made & Approved
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect a documented request and written approval process.
                  </strong>{" "}
                  JVTO can discuss escort during planning, prepare route/timing
                  details, and submit a formal request through relevant
                  channels.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Expect tours to proceed without escort if not approved.
                  </strong>{" "}
                  If not approved, the tour runs without escort and JVTO applies
                  its convoy and safety procedures within normal traffic rules.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4) Costs & What Is Included (If Approved)
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Expect additional costs to be agreed in advance and
                    documented.
                  </strong>{" "}
                  Costs may include escort-related charges and operational
                  adjustments, and any costs are discussed with the organiser,
                  stated in writing, and included in the Official
                  E-Voucher/Invoice if confirmed.
                </p>
                <p className="text-muted-foreground">
                  <strong>Do not expect unofficial roadside payments.</strong>{" "}
                  There is no "cash-on-the-road" payment for unofficial escort
                  services offered by JVTO; charges are documented as part of
                  booking where applicable.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5) What an Escort Does – And What It Is Not
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use escort to support orderly convoy movement only.
                  </strong>{" "}
                  Escort is meant to support safe movement and coordination on
                  approved segments.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Do not use escort as a speed promise or rule override.
                  </strong>{" "}
                  Escort is not intended to break regulations or guarantee
                  travel times, and standard safety expectations still apply.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6) Behaviour Expectations for Groups with Escort
                </h2>
                <p className="text-muted-foreground">
                  <strong>
                    Follow instructions and keep convoy behaviour orderly.
                  </strong>{" "}
                  Guests must follow instructions from JVTO staff and traffic
                  police, drivers remain responsible for safe driving, and
                  distracting or inappropriate behaviour is not acceptable.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7) How JVTO's Tourist Police Experience Fits Into This
                </h2>
                <p className="text-muted-foreground mb-4">
                  <strong>
                    Use JVTO's experience to support legal, documented
                    coordination only.
                  </strong>{" "}
                  The founder's professional experience is described as helping
                  JVTO understand legal escort requests and communicate with
                  relevant units.
                </p>
                <p className="text-muted-foreground">
                  <strong>
                    Do not treat this as a promise of escort availability.
                  </strong>{" "}
                  JVTO does not promise escort will always be available and does
                  not offer unofficial escort services.
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Section 8 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  8) Where to Check Your Group's Exact Arrangement
                </h2>
                <p className="text-muted-foreground">
                  <strong>
                    Treat escort as included only if written in your booking
                    documents.
                  </strong>{" "}
                  Final details appear in your Official E-Voucher/Invoice and
                  any written JVTO confirmation; if escort is not mentioned,
                  assume the programme runs without escort.
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
                      Is police escort included in standard tour packages?
                    </h3>
                    <p className="text-muted-foreground">
                      No. Police escort is a conditional inclusion and only
                      applies if explicitly written on your package page and/or
                      voucher.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Can any group request police escort?
                    </h3>
                    <p className="text-muted-foreground">
                      It may be considered for large group movements or VIP
                      arrangements, but availability depends on local
                      regulations and operational feasibility.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      Does police escort guarantee faster travel times?
                    </h3>
                    <p className="text-muted-foreground">
                      No. Safety always overrides speed. Escort helps with
                      coordination but does not override road laws, weather
                      limits, or park closures.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      How is police escort arranged?
                    </h3>
                    <p className="text-muted-foreground">
                      If applicable, JVTO confirms feasibility and availability.
                      Details (timing, route constraints) will be communicated
                      in writing when applicable.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      What happens if conditions change?
                    </h3>
                    <p className="text-muted-foreground">
                      Availability depends on local regulations and operational
                      conditions. JVTO cannot promise this service unless it is
                      confirmed in writing.
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
