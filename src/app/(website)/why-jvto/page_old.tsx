import StructuredData from "@/components/website/StructuredData";
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  ShieldCheck,
  FileText,
  Lock,
  HeartPulse,
  BookOpen,
  Star,
  User,
  Users,
  ArrowRight,
} from "lucide-react";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Why Travel with Java Volcano Tour Operator (JVTO)",
  description:
    "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
  openGraph: {
    title: "Why Travel with Java Volcano Tour Operator (JVTO)",
    description:
      "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
    url: `${siteUrl}/why-jvto`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/why-jvto.webp",
        width: 1200,
        height: 630,
        alt: "Why JVTO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Travel with Java Volcano Tour Operator (JVTO)",
    description:
      "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
    images: [siteUrl + "/assets/img/og/why-jvto.webp"],
  },
};

const differenceCards = [
  {
    title: "Tourist Police-Led Safety",
    description:
      "JVTO is founded and led by an active tourist police officer in East Java. Our route planning, partner selection and safety decisions are shaped by real experience handling tourist cases on the ground.",
    icon: ShieldCheck,
    color: "blue",
    link: "/why-jvto/our-story",
  },
  {
    title: "Registered & Verifiable",
    description:
      "We operate as a registered travel company in Indonesia (PT Java Volcano Rendezvous) with a physical office and official tourism licences you can check online.",
    icon: FileText,
    color: "green",
    link: "/verify-jvto",
  },
  {
    title: "Private, All-Inclusive Tours",
    description:
      "All itineraries are private only and designed to be transparent. Tickets, jeeps, Ijen screening, and essential gear are clearly written into each program.",
    icon: Lock,
    color: "purple",
    link: "/policy/inclusions-exclusions",
  },
  {
    title: "Real Ijen Health Screening",
    description:
      "For tours that include Ijen, JVTO includes real health screening performed by trained medical staff, logged in a digital system to prevent fake letters and improve safety for all.",
    icon: HeartPulse,
    color: "red",
    link: "/travel-guide/ijen-health-screening",
  },
];

const trustTiles = [
  {
    title: "Our Story",
    description:
      "How a small homestay grew into a tourist police-led travel company.",
    icon: BookOpen,
    link: "/why-jvto/our-story",
  },
  {
    title: "The JVTO Difference",
    description: "Our core standards for safety, transparency and community.",
    icon: Star,
    link: "/why-jvto/the-jvto-difference",
  },
  {
    title: "Guest Reviews",
    description:
      "Read independent reviews from Google, Tripadvisor, and Trustpilot.",
    icon: User,
    link: "/why-jvto/reviews",
  },
  {
    title: "Community Standards",
    description:
      "How we work with local guides and support fair, sustainable practices.",
    icon: Users,
    link: "/why-jvto/community-standards",
  },
];

export default function WhyJvtoPage() {
  const whyJVTOSchema = {
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
        logo: "https://javavolcano-touroperator.com/assets/img/jvto-logo.png",
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
        "@id": "https://javavolcano-touroperator.com/why-jvto#webpage",
        url: "https://javavolcano-touroperator.com/why-jvto",
        name: "Why Travel with Java Volcano Tour Operator",
        description:
          "Java Volcano Tour Operator (JVTO) is a tourist police-led, Indonesian-registered and fully licensed local operator based in Bondowoso. We design private, all-inclusive tours with real Ijen health screening, trained local guides and clear, written standards that you can verify before you book.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id": "https://javavolcano-touroperator.com/why-jvto#breadcrumb",
        },
        mainEntity: {
          "@id": "https://javavolcano-touroperator.com/why-jvto#article",
        },
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        relatedLink: [
          "https://javavolcano-touroperator.com/why-jvto/our-story",
          "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
          "https://javavolcano-touroperator.com/why-jvto/reviews",
          "https://javavolcano-touroperator.com/why-jvto/community-standards",
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
        "@id": "https://javavolcano-touroperator.com/why-jvto#breadcrumb",
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
            name: "Why Travel with Java Volcano Tour Operator",
            item: "https://javavolcano-touroperator.com/why-jvto",
          },
        ],
      },
      {
        "@type": "Article",
        "@id": "https://javavolcano-touroperator.com/why-jvto#article",
        headline: "Why Travel with Java Volcano Tour Operator",
        description:
          "Java Volcano Tour Operator (JVTO) is a tourist police-led, Indonesian-registered and fully licensed local operator based in Bondowoso. We design private, all-inclusive tours with real Ijen health screening, trained local guides and clear, written standards that you can verify before you book.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/why-jvto#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/why-jvto#webpage",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleBody:
          "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
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
        url: "https://javavolcano-touroperator.com/why-jvto",
        image: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        articleSection: ["At a Glance", "Explore Why JVTO", "Next Steps"],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={whyJVTOSchema} />

      <main className="pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="font-black text-2xl md:text-5xl mb-6">
              Why Travel with JVTO?
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              JVTO is a tourist police-led, registered Indonesian travel
              company. We run private, all-inclusive volcano tours in East Java
              with a non-negotiable focus on safety, transparency, and
              community.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Link className="flex" href="/travel-guide">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Our Travel Guide
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="/travel-guide/booking-information">
                  How to Book
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <section className="mb-16 md:mb-24">
                <h2 className="font-black text-xl md:text-3xl mb-12 text-center">
                  What Makes JVTO Different
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {differenceCards.map((card, index) => (
                    <Link key={index} href={card.link} className="group block">
                      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                        <CardHeader className="flex-col items-start gap-4 md:flex-row">
                          <div
                            className={`w-12 h-12 rounded-sm flex items-center justify-center text-2xl shrink-0 bg-jvto-green text-primary`}
                          >
                            <card.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-lg md:text-xl text-xl group-hover:text-primary mb-2">
                              {card.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {card.description}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="inline-flex items-center text-primary font-medium group-hover:text-primary/80 text-sm ml-auto">
                            Read more
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-black text-xl md:text-3xl mb-12 text-center">
                  Trust, Community & Guests
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trustTiles.map((tile, index) => (
                    <Link key={index} href={tile.link} className="group block">
                      <Card className="h-full p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                        <div className="w-16 h-16 rounded-sm bg-jvto-green flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                          <tile.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-black text-lg md:text-xl group-hover:text-primary mb-2">
                          {tile.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {tile.description}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
