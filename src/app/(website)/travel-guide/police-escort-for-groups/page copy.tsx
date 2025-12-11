import { prisma } from "@/lib/prisma";
import StructuredData from "@/components/website/StructuredData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { stripHtml } from "@/utils/stripHtml";

export const metadata: Metadata = {
  title: "Police Escort for Tourist Groups in East Java | JVTO",
  description:
    "Learn how JVTO coordinates official traffic police escorts for large groups (18+ guests) on specific travel segments, based on formal orders and Indonesian law.",
};

// Konstanta slug untuk halaman ini
const PAGE_SLUG = "travel-guide/police-escort-for-groups";

// Helper function untuk mengambil data (digunakan di Page dan Metadata)
async function getPolicyData() {
  const policy = await prisma.policy_documents.findUnique({
    where: {
      slug: PAGE_SLUG,
    },
  });

  return policy;
}

export default async function PoliceEscortForGroups() {
  // 2. Ambil data dari database
  const policy = await getPolicyData();

  // 3. Jika data tidak ditemukan di DB, return 404
  if (!policy) {
    notFound();
  }

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
        articleBody: stripHtml(policy.content),
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
    <div className="flex flex-col min-h-screen bg-background py-20">
      {/* Inject JSON-LD Schema */}
      <StructuredData data={pageSchema} />

      <main className="flex-grow">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header Section: Mengambil Title & Intro dari DB */}
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                {policy.title}
              </h1>

              {/* Optional: Menggunakan meta description sebagai intro text jika ada */}
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Learn how JVTO coordinates official traffic police escorts for
                large groups (18+ guests) on specific travel segments, based on
                formal orders and Indonesian law.{" "}
              </p>
            </div>

            {/* Content Section: Render HTML dari Database */}
            <div
              className="prose prose-lg max-w-none mx-auto text-muted-foreground prose-headings:font-headline prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: policy.content }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
