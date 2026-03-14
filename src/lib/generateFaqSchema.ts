import { stripHtml } from "@/utils/stripHtml";

export function generateFaqSchema(allFaqs: { question: string; answer: string }[]) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    "@context": "https://schema.org",
    "@graph": [
      /* ============================================================
         ORGANIZATION / TRAVEL AGENCY
      ============================================================ */
      {
        "@type": "TravelAgency",
        "@id": siteUrl+"/#organization",
        "name": "Java Volcano Tour Operator (JVTO)",
        "alternateName": "JVTO",
        "url": siteUrl,
        "description":
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        "logo": siteUrl+"/assets/img/jvto-logo.png",
        "image": [
          siteUrl+"/assets/img/jvto-logo.png",
          siteUrl+"/assets/img/hero/home.webp"
        ],
        "email": "hello@javavolcano-touroperator.com",
        "telephone": "+62 822-4478-8833",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68214",
          "postalCode": "68214",
          "addressLocality": "Bondowoso",
          "addressRegion": "East Java",
          "addressCountry": "ID"
        },
        "areaServed": [
          { "@type": "AdministrativeArea", "name": "East Java" },
          { "@type": "Country", "name": "Indonesia" },
          { "@type": "City", "name": "Surabaya" },
          { "@type": "Place", "name": "Bali" }
        ],
        "identifier": [
          {
            "@type": "PropertyValue",
            "name": "Business and tourism licence number",
            "value": "1102230032918"
          }
        ],
        "sameAs": [
          "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          "https://www.trustpilot.com/review/javavolcano-touroperator.com"
        ],
        "founder": {
          "@type": "Person",
          "name": "Agung Sambuko",
          "alternateName": "Mr. Sam",
          "jobTitle": "Founder & CEO",
          "knowsAbout": [
            "TouristSafety",
            "EastJavaTourism",
            "VolcanoTrekking",
            "LogisticsManagement"
          ],
          "description": "Founder of JVTO; active-duty Tourist Police officer in East Java; Supervisor in HPWKI."
        },
        "priceRange": "IDR 1.000.000 - IDR 9.050.000",
        "openingHoursSpecification": [
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "07:30", "closes": "17:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "08:00", "closes": "17:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "08:00", "closes": "21:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "08:00", "closes": "21:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "08:00", "closes": "21:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "08:00", "closes": "21:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "08:00", "closes": "21:00" }
        ],
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -7.9161788,
          "longitude": 113.8085868
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+62 822-4478-8833",
            "email": "hello@javavolcano-touroperator.com",
            "contactType": "customer support"
          }
        ],
        "foundingDate": "2016-01-01",
        "currenciesAccepted": "IDR",
        "paymentAccepted": "Credit Card, Bank Transfer"
      },

      /* ============================================================
         WEBSITE
      ============================================================ */
      {
        "@type": "WebSite",
        "@id": siteUrl+"/#website",
        "url": siteUrl,
        "name": "Java Volcano Tour Operator",
        "publisher": { "@id": siteUrl+"/#organization" },
        "inLanguage": "en"
      },

      /* ============================================================
         FAQ PAGE — MAIN ENTITY (DINAMIS)
      ============================================================ */
      {
        "@type": "FAQPage",
        "@id": siteUrl+"/travel-guide/faq#faqpage",
        "url": siteUrl+"/travel-guide/faq",
        "name": "Frequently Asked Questions",
        "headline": "Frequently Asked Questions",
        "description":
          "Clear answers to the most common questions about private Bromo, Ijen and Tumpak Sewu tours with JVTO – bookings, payments, Travel Credit, health screening, safety, packing and groups.",
        "inLanguage": "en",
        "isPartOf": { "@id": siteUrl+"/#website" },
        "about": { "@id": siteUrl+"/#organization" },

        /* =============================
           BREADCRUMB
        ============================= */
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": siteUrl+"/travel-guide/faq#breadcrumb",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Homepage", "item": siteUrl },
            { "@type": "ListItem", "position": 2, "name": "Travel Guide", "item": siteUrl+"/travel-guide" },
            { "@type": "ListItem", "position": 3, "name": "Frequently Asked Questions", "item": siteUrl+"/travel-guide/faq" }
          ]
        },

        /* =============================
           MAIN ENTITY — FAQ FROM DB
        ============================= */
        "mainEntity": allFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": stripHtml(faq.answer)
          }
        })),

        /* =============================
           HAS PART (STATIC SUBPAGES)
        ============================= */
        "hasPart": [
          {
            "@type": "WebPage",
            "@id": siteUrl+"/travel-guide/booking-information#webpage",
            "url": siteUrl+"/travel-guide/booking-information",
            "name": "Booking Information – payments, deposits, Travel Credit and cancellations"
          },
          {
            "@type": "WebPage",
            "@id": siteUrl+"/travel-guide/ijen-health-screening#webpage",
            "url": siteUrl+"/travel-guide/ijen-health-screening",
            "name": "Ijen Health Screening – how screening works and what results mean"
          },
          {
            "@type": "WebPage",
            "@id": siteUrl+"/travel-guide/safety-on-tours#webpage",
            "url": siteUrl+"/travel-guide/safety-on-tours",
            "name": "Safety on Tours – our approach to risk and guest responsibilities"
          },
          {
            "@type": "WebPage",
            "@id": siteUrl+"/travel-guide/packing-and-fitness#webpage",
            "url": siteUrl+"/travel-guide/packing-and-fitness",
            "name": "Packing & Fitness – what to bring and how fit you should be"
          },
          {
            "@type": "WebPage",
            "@id": siteUrl+"/travel-guide/weather-and-closures#webpage",
            "url": siteUrl+"/travel-guide/weather-and-closures",
            "name": "Weather & Closures – how natural conditions affect your itinerary"
          },
          {
            "@type": "WebPage",
            "@id": siteUrl+"/travel-guide/police-escort-for-groups#webpage",
            "url": siteUrl+"/travel-guide/police-escort-for-groups",
            "name": "Police Escort for Groups – how official escorts work for large groups"
          }
        ]
      }
    ]
  };
}
