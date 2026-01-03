import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/website/UI/Button";
import { companyHistory } from "@/lib/legal";
import { SITE_CONFIG } from "@/lib/site-config";
import { type Metadata } from "next";
import { Check, Shield, Star, Users } from "lucide-react";
import StructuredData from "@/components/website/StructuredData";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Guest Reviews & Long-Term Feedback",
  description:
    "Read how guests describe their private volcano tours with JVTO and see independent reviews from Google, Tripadvisor and Trustpilot, plus early homestay-era recognition.",
  openGraph: {
    title: "Guest Reviews & Long-Term Feedback",
    description: "Read how guests describe their private volcano tours with JVTO and see independent reviews from Google, Tripadvisor and Trustpilot, plus early homestay-era recognition.",
    url: `${siteUrl}/why-jvto/reviews`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/reviews.webp",
        width: 1200,
        height: 630,
        alt: "Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guest Reviews & Long-Term Feedback",
    description: "Read how guests describe their private volcano tours with JVTO and see independent reviews from Google, Tripadvisor and Trustpilot, plus early homestay-era recognition.",
    images: [siteUrl + "/assets/img/og/reviews.webp"],
  },    
};

export default function ReviewsPage() {
  const reviewPlatforms = [
    {
      name: "Google Business Profile",
      icon: "⭐",
      color: "bg-blue-50 border-blue-200",
      link: SITE_CONFIG.proofLinks.googleReviews,
      description:
        "Live reviews from guests on Google Maps and Business Profile",
    },
    {
      name: "Tripadvisor",
      icon: "✈️",
      color: "bg-green-50 border-green-200",
      link: SITE_CONFIG.proofLinks.tripadvisor,
      description: "Independent reviews on the world's largest travel platform",
    },
    {
      name: "Trustpilot",
      icon: "🏆",
      color: "bg-purple-50 border-purple-200",
      link: SITE_CONFIG.proofLinks.trustpilot,
      description: "Transparent guest feedback on Trustpilot",
    },
  ];

  const reviewThemes = [
    {
      title: "Safety and Honesty",
      description:
        "Clear briefings, realistic explanations about blue fire, weather, closures",
      icon: Shield,
    },
    {
      title: "Private, Flexible Routes",
      description:
        "Ability to adjust stops for rest, food or health during private tours",
      icon: Check,
    },
    {
      title: "Local Connection",
      description:
        "Travelling with local guides and drivers who know the area well",
      icon: Users,
    },
    {
      title: "Smooth Logistics",
      description:
        "Airport pickups, ferries, transfers, and coordination across destinations",
      icon: Star,
    },
  ];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const reviewsSchema = {
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
            "Mount Bromo tours",
            "Ijen Crater tours",
            "Tumpak Sewu waterfall tours",
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
          ratingValue: "4.9",
          reviewCount: "112",
        },
        mainEntityOfPage: [
          "https://javavolcano-touroperator.com/",
          "https://javavolcano-touroperator.com/why-jvto/reviews",
        ],
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
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        url: "https://javavolcano-touroperator.com/why-jvto/reviews",
        name: "Real Guest Reviews & Long-Term Track Record",
        headline:
          "Guest Reviews & Long-Term Track Record | Java Volcano Tour Operator",
        description:
          "Read real guest reviews of Java Volcano Tour Operator across Google, Tripadvisor and Trustpilot, plus earlier homestay recognition that shows how long we’ve been hosting travelers in East Java.",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntity: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#primaryimage",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        image: [
          siteUrl + "/assets/img/jvto-color.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        inLanguage: "en",
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#breadcrumb",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/verify-jvto",
          "https://javavolcano-touroperator.com/travel-guide/",
          "https://javavolcano-touroperator.com/travel-guide/booking-information/",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours/",
        ],
        articleBody: "{{PLACEHOLDER_ARTICLE_BODY_HTML_REVIEWS}}",
        hasPart: [
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-intro",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-external-reviews",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-guest-highlights",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-homestay-recognition",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-guidebook-mentions",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-review-policy",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/reviews/#section-how-to-compare",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#breadcrumb",
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
            name: "Why JVTO",
            item: "https://javavolcano-touroperator.com/why-jvto",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Real Guest Reviews & Long-Term Track Record",
            item: "https://javavolcano-touroperator.com/why-jvto/reviews",
          },
        ],
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-intro",
        name: "Real Guest Reviews & Long-Term Track Record",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_INTRO_TEXT}}",
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-external-reviews",
        name: "Reviews on External Platforms",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_EXTERNAL_REVIEWS_TEXT}}",
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#reviews-platforms",
        },
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-guest-highlights",
        name: "What Guests Usually Mention",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_GUEST_HIGHLIGHTS_TEXT}}",
        keywords: [
          "Clear communication before and during the tour",
          "Itineraries explained in simple steps",
          "Questions answered directly, including about difficulty and closures",
          "Safety briefings and realistic expectations",
          "What to expect on the Ijen night hike",
          "How we respond to weather or volcanic alerts",
          "When a plan needs to change for safety reasons",
          "Local guides and drivers",
          "Friendly attitude, local knowledge, and help with small needs on the road (toilets, minimarkets, short stops).",
          "Fair and transparent pricing",
          "No surprise night-charges or forced “local fees” on arrival",
          "Included items (permits, jeep, screening, meals) matching what was promised",
          "Smooth logistics for complex routes",
          "Airport/train pick-ups that actually show up",
          "Overland connections between Bali – Ijen – Bromo – Tumpak Sewu – Surabaya",
        ],
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-homestay-recognition",
        name: "Recognition From the Early Homestay Years",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_HOMESTAY_RECOGNITION_TEXT}}",
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#homestay-recognition-list",
        },
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-guidebook-mentions",
        name: "Guidebook Mentions & Early International Guests",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_GUIDEBOOK_MENTIONS_TEXT}}",
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#guidebook-references-list",
        },
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-review-policy",
        name: "How We Handle Reviews (No Fake Testimonials)",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_REVIEW_POLICY_TEXT}}",
      },
      {
        "@type": "WebPageElement",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#section-how-to-compare",
        name: "How to Use These Reviews When You Choose an Operator",
        isPartOf: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/reviews/#webpage",
        },
        text: "{{PLACEHOLDER_SECTION_HOW_TO_COMPARE_TEXT}}",
      },
      {
        "@type": "ItemList",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#reviews-platforms",
        name: "External review platforms for Java Volcano Tour Operator",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id":
                "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id":
                "https://www.trustpilot.com/review/javavolcano-touroperator.com",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
        url: "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
        name: "Google Maps / Google Business Profile",
        description:
          "See our location, photos and reviews from guests over several years.",
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        potentialAction: {
          "@type": "ViewAction",
          target: "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
          name: "Open Google Profile",
        },
      },
      {
        "@type": "WebPage",
        "@id":
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
        url: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
        name: "Tripadvisor",
        description:
          "Read reviews from international travellers who joined our Bromo, Ijen and waterfall tours.",
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        potentialAction: {
          "@type": "ViewAction",
          target:
            "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          name: "Open Tripadvisor Profile",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://www.trustpilot.com/review/javavolcano-touroperator.com",
        url: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
        name: "Trustpilot",
        description:
          "Independent review platform where guests can rate their experience with JVTO.",
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        potentialAction: {
          "@type": "ViewAction",
          target:
            "https://www.trustpilot.com/review/javavolcano-touroperator.com",
          name: "Open Trustpilot Profile",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#image-booking-2015-plaque",
        name: "Booking.com Guest Review Award (2015)",
        contentUrl: "{{PLACEHOLDER_URL_BOOKING_2015_PLAQUE}}",
        url: "{{PLACEHOLDER_URL_BOOKING_2015_PLAQUE}}",
        encodingFormat: "image/jpeg",
        description:
          "A guest review award from Booking.com in 2015 recognising the performance of the guesthouse operation that later evolved into the current company.",
        caption:
          "{{PLACEHOLDER_COMPANY_HISTORY_AWARDS_AND_RECOGNITION_BOOKING_2015_CAPTION}}",
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#image-booking-2015-shipping-label",
        name: "Shipping label to early homestay address",
        contentUrl: "{{PLACEHOLDER_URL_BOOKING_2015_SHIPPING_LABEL}}",
        url: "{{PLACEHOLDER_URL_BOOKING_2015_SHIPPING_LABEL}}",
        encodingFormat: "image/jpeg",
        description:
          "Proof that recognition and awards were being sent to the address where the homestay and early hosting activity took place.",
        caption:
          "{{PLACEHOLDER_COMPANY_HISTORY_AWARDS_AND_RECOGNITION_SHIPPING_LABEL_CAPTION}}",
      },
      {
        "@type": "ItemList",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#homestay-recognition-list",
        name: "Homestay-era recognition artefacts",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id":
                "https://javavolcano-touroperator.com/why-jvto/reviews/#image-booking-2015-plaque",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id":
                "https://javavolcano-touroperator.com/why-jvto/reviews/#image-booking-2015-shipping-label",
            },
          },
        ],
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#image-guidebook-page",
        name: "Guidebook page",
        contentUrl: "{{PLACEHOLDER_URL_GUIDEBOOK_PAGE_IMAGE}}",
        url: "{{PLACEHOLDER_URL_GUIDEBOOK_PAGE_IMAGE}}",
        encodingFormat: "image/png",
        description:
          "A page from a European travel handbook that mentioned the homestay in Bondowoso and the tours arranged there.",
        caption:
          "{{PLACEHOLDER_COMPANY_HISTORY_HISTORICAL_REFERENCES_GUIDEBOOK_PAGE_CAPTION}}",
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#image-guidebook-guests",
        name: "Guests inspired by the guidebook",
        contentUrl: "{{PLACEHOLDER_URL_GUIDEBOOK_GUESTS_IMAGE}}",
        url: "{{PLACEHOLDER_URL_GUIDEBOOK_GUESTS_IMAGE}}",
        encodingFormat: "image/jpeg",
        description:
          "Guests who travelled to Bondowoso and Ijen after reading the guidebook entry.",
        caption:
          "{{PLACEHOLDER_COMPANY_HISTORY_HISTORICAL_REFERENCES_GUESTS_CAPTION}}",
      },
      {
        "@type": "ItemList",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/reviews/#guidebook-references-list",
        name: "Guidebook references and early international guests",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id":
                "https://javavolcano-touroperator.com/why-jvto/reviews/#image-guidebook-page",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id":
                "https://javavolcano-touroperator.com/why-jvto/reviews/#image-guidebook-guests",
            },
          },
        ],
      },
    ],
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={reviewsSchema} />

      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="text-center mb-8 text-sm text-muted-foreground">
              <Link href="/why-jvto" className="hover:text-primary">
                Why JVTO
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">Reviews</span>
            </nav>
            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Guest Reviews & Long-Term Proof
              </h1>
              <div className="prose prose-lg max-w-none mx-auto text-muted-foreground text-center mt-4">
                <p>
                  We encourage you to read reviews on platforms we don’t
                  control. These platforms contain feedback from guests hosted
                  over many years, including from private tours under JVTO and
                  earlier homestay-era trips.
                </p>
              </div>
              <div className="not-prose flex gap-4 justify-center mt-8">
                <Button variant="outline">
                  <a
                    href={SITE_CONFIG.proofLinks.googleReviews}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Reviews
                  </a>
                </Button>
                <Button variant="outline">
                  <a
                    href={SITE_CONFIG.proofLinks.tripadvisor}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TripAdvisor
                  </a>
                </Button>
                <Button variant="outline">
                  <a
                    href={SITE_CONFIG.proofLinks.trustpilot}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Trustpilot
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-accent">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-black uppercase text-3xl tracking-tight mb-8">
              What Guests Usually Highlight
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {reviewThemes.map((theme, index) => {
                const Icon = theme.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <Icon className="w-8 h-8 text-primary mb-2" />
                      <CardTitle className="font-black">
                        {theme.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Our booking, payment and Travel Credit rules are transparent and
                written in our{" "}
                <Link
                  href="/travel-guide/booking-information"
                  className="underline hover:text-primary"
                >
                  Travel Guide
                </Link>
                , which guests can read before confirming.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="font-black uppercase text-3xl tracking-tight mb-8">
              Early Recognition (Homestay Era)
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Before JVTO existed as a full travel company, our local homestay
              and early tours received guest awards and mentions in
              international guidebooks. These images show that history.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              {companyHistory.awards_and_recognition.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                      <Image
                        src={item.url}
                        alt={item.alt_text}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <p className="text-sm text-center mt-2 text-muted-foreground">
                      {item.caption}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button>
              <Link href="/why-jvto/our-story">Read Our Full Story</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
