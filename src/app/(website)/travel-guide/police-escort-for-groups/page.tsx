import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

export const metadata: Metadata = {
  title: "Police Escort for Tourist Groups in East Java | JVTO Travel Guide",
  description:
    "When and how official traffic police escort can be arranged for large groups, and why it is always done through formal channels.",
};

export default function PoliceEscortForGroupsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // 4. Siapkan Schema.org Data secara dinamis
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
        logo: "https://javavolcano-touroperator.com/assets/img/jvto-color.png",
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
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        name: "Official Police Escort for Large Tourist Groups in East Java",
        description:
          "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
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
            name: "Police Escort for Groups",
            item: "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
          },
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups#article",
        headline:
          "Official Police Escort for Large Tourist Groups in East Java",
        description:
          "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
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
          "What \u201cPolice Escort\u201d Means in Our Context",
          "When Escort May Be Available",
          "How the Request Process Works",
          "Costs, Inclusions & Limitations",
          "Cancellation, Changes & Force Majeure",
          "Quick FAQ",
        ],
        articleBody: `
Police Escort for Tourist Groups in East Java

In some situations, large tourist groups may benefit from official traffic police escort. This page explains when and how JVTO can help coordinate legal, documented escort services.

When Escort May Be Considered

Official traffic police escort may be relevant for school or university groups, incentive or corporate groups, or other large groups traveling in multiple vehicles. Typical segments include routes from major road exits or meeting points to partner accommodations, and other predefined routes coordinated with the traffic police.

How Escort Is Arranged

JVTO does not provide escort vehicles directly. Instead, we submit a formal request to the appropriate Traffic Police unit. Escort approval depends on regulations, availability, and clear route details. When approved, escort is handled by uniformed traffic police using official vehicles under written orders. All arrangements are transparent and follow Indonesian law.

What Escort Is Not

Police escort is not automatically granted for all tours, does not guarantee special treatment everywhere, and cannot be used to bypass speed limits or standard road rules. Its purpose is to ensure safe and orderly convoy movement for qualifying groups—not to override public safety.

Costs & Confirmation

If your group qualifies and escort is approved, any associated costs will be clearly shown in your program and invoice. No unofficial payments will ever be requested from guests during the journey. If escort is not approved or not available, we will inform you and operate the program using standard safe convoy procedures.

How to Request Escort Consideration

If you are planning a large group and would like to explore the possibility of official escort, please provide your group size, number of vehicles, and planned route. We will advise whether escort is feasible and what information is required for submitting a request. Final approval always rests with the relevant authorities.        
        `,
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
            name: "Can every JVTO tour get a police escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Escort is reserved for specific large group programs and must be approved by the relevant Traffic Police unit. Regular private tours are not escorted.",
            },
          },
          {
            "@type": "Question",
            name: "Can we decide to add escort at the last minute?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Normally no. Escort requires formal approvals, planning, and scheduling. Last-minute requests are unlikely to be accepted.",
            },
          },
          {
            "@type": "Question",
            name: "Is escort included in the standard tour price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. If escort is approved and included, any cost is clearly shown as a separate line in your group proposal and invoice.",
            },
          },
          {
            "@type": "Question",
            name: "Does escort mean we can ignore normal road rules?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Escort is intended to improve convoy management and safety, not to bypass the law.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if the police cancel our escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If the escort is cancelled by the authorities, JVTO will still operate your tour using normal private vehicles. We will apply the same principles that we use for other external changes, as described in our Booking Information.",
            },
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
                Police Escort for Groups
              </span>
            </nav>
            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Police Escort for Tourist Groups in East Java
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                In some situations, large tourist groups may benefit from
                official traffic police escort. This page explains when and how
                JVTO can help coordinate legal, documented escort services.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                When Escort May Be Considered
              </h2>
              <p>
                Official traffic police escort may be relevant for school or
                university groups, incentive or corporate groups, or other large
                groups traveling in multiple vehicles. Typical segments include
                connections from major road exits or meeting points to partner
                accommodations, and specific routes agreed in advance with the
                traffic police.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                How Escort Is Arranged
              </h2>
              <p>
                JVTO does not provide escort vehicles ourselves. Instead, we
                submit a formal request to the competent Traffic Police unit.
                Escort is approved or declined according to regulations,
                availability, and clear route definitions. When approved, the
                escort is carried out by uniformed traffic police in official
                vehicles, based on written orders. All arrangements are done
                transparently and in line with Indonesian law.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                What Escort Is Not
              </h2>
              <p>
                Police escort is not automatic for all tours, is not a guarantee
                of special treatment everywhere, and is not a tool to ignore
                speed limits or basic road rules. Its purpose is safe and
                orderly convoy movement for qualifying groups, not to bypass
                public safety.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                Costs & Confirmation
              </h2>
              <p>
                If your group is eligible and escort is approved, any related
                costs will be clearly listed in your program and invoice. No
                unofficial payments are requested from guests on the road. If
                escort is not available or not approved, we will inform you and
                operate the tour using standard safe convoy procedures.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                How to Request Escort Consideration
              </h2>
              <p>
                If you are planning a large group program and wish to explore
                the possibility of official escort, inform us of your group
                size, vehicle count, and route. We will advise whether escort is
                realistic and what information we need to submit a request. The
                final decision always rests with the relevant authorities.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
