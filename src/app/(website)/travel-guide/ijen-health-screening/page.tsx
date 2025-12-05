import { prisma } from "@/lib/prisma";
import StructuredData from "@/components/website/StructuredData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { stripHtml } from "@/utils/stripHtml";

export const metadata: Metadata = {
  title: "Ijen Health Screening | JVTO",
  description:
    "Real checks, digital proof, and safer night hikes. Learn how JVTO implements mandatory health screening for Ijen Crater tours.",
};

// Konstanta slug untuk halaman ini
const PAGE_SLUG = "travel-guide/ijen-health-screening";

// Helper function untuk mengambil data (digunakan di Page dan Metadata)
async function getPolicyData() {
  const policy = await prisma.policy_documents.findUnique({
    where: {
      slug: PAGE_SLUG,
    },
  });

  return policy;
}

export default async function IjenHealthScreening() {
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
        logo: "https://javavolcano-touroperator.com/assets/img/jvto-color.png",
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
        paymentAccepted: ["Credit Card", "Bank Transfer"],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.9,
          reviewCount: 102,
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator (JVTO)",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
        name: "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        headline:
          "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        description:
          "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        image: {
          "@id": siteUrl+"/assets/img/hero/home.webp#primaryimage",
        },
        primaryImageOfPage: {
          "@id": siteUrl+"/assets/img/hero/home.webp#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#article",
        },
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#faq",
          },
        ],
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/faq",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide/weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups",
        ],
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        lastReviewed: "2025-12-05",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
      },
      {
        "@type": "ImageObject",
        "@id": siteUrl+"/assets/img/hero/home.webp#primaryimage",
        url: siteUrl+"/assets/img/hero/home.webp",
        inLanguage: "en",
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#article",
        headline:
          "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        description:
          "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#webpage",
        },
        image: {
          "@id": siteUrl+"/assets/img/hero/home.webp#primaryimage",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        articleSection: [
          "Why Ijen Needs Real Health Screening",
          "How Health Screening Works for JVTO Guests",
          "Digital Health Clearance & QR Verification",
          "Possible Outcomes & What Happens If You Are Not Cleared",
          "What Screening Does Not Do",
          "Data & Privacy (Short Summary)",
          "Quick FAQ (On-Page)",
          "Related Pages",
        ],
        articleBody: stripHtml(policy.content),
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com",
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
            name: "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
            item: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Ijen health screening optional if I travel with JVTO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. For JVTO tours that include the Ijen night hike, health screening is part of our standard operating procedure. We will not run the hike for guests who are not cleared.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Does a \u201ccleared\u201d result mean there is no risk?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. It means that, at the time of screening, there is no obvious reason to block you based on the checks used. Natural conditions and personal responses can still change.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "What if I refuse to be screened?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If you refuse mandatory screening, you will not be allowed to join the Ijen hike. The relevant costs are treated as used, and our standard Travel Credit and late cancellation rules apply.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "Can I get a refund if I am not cleared?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No cash refund is provided when you are not cleared to hike after screening, because the related costs have been committed. Where possible, we may arrange alternative activities, but these depend on real-time conditions.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
          {
            "@type": "Question",
            name: "I already have a letter from my doctor. Do I still need screening?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases, yes. Local implementation requires a recognised screening process on-site or through participating providers, not just a letter carried from overseas.",
            },
            inLanguage: "en",
            lastReviewed: "2025-12-05",
            dateModified: "2025-12-05",
          },
        ],
        inLanguage: "en",
      },
      {
        "@type": "TouristAttraction",
        "@id":
          "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        name: "Ijen Crater",
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
                Real checks, digital proof, and safer night hikes. Learn how
                JVTO implements mandatory health screening for Ijen Crater
                tours.
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
