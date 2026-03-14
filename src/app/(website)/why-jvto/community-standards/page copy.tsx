import Link from "next/link";
import Image from "next/image";
import { type Metadata } from "next";
import Button from "@/components/website/UI/Button";
import { Check } from "lucide-react";
import { operations, healthSafety } from "@/lib/legal";
import StructuredData from "@/components/website/StructuredData";

export const metadata: Metadata = {
  title: "Community Standards – Local Guides & Responsible Travel | JVTO",
  description:
    "How JVTO works with local guides, communities and networks around Bromo, Ijen and Tumpak Sewu, and what we expect from guests to keep trips fair and respectful.",
};

export default function CommunityStandardsPage() {
  const standards = [
    {
      title: "Local Guides & Jobs",
      description:
        "JVTO partners with local guides and drivers across the Bromo–Ijen–Tumpak Sewu corridor. Many are youth from the surrounding villages, trained and supported over time. This keeps knowledge and income close to the destinations themselves.",
      icon: "👥",
      color: "bg-blue-100 text-blue-600",
      images: [
        operations.team_and_activities.find(
          (i) => i.filename === "group-at-jvto-office.jpg"
        )?.url,
        operations.team_and_activities.find(
          (i) => i.filename === "guest-welcome-evening.png"
        )?.url,
      ].filter(Boolean) as string[],
      links: [{ text: "Meet our team", href: "/why-jvto/our-team" }],
    },
    {
      title: "Responsible Operations",
      description: "Practical standards, not slogans:",
      icon: "🌱",
      color: "bg-green-100 text-green-600",
      points: [
        "We keep group sizes appropriate to the environment and safety.",
        "We work with accommodations and service providers that respect basic environmental and social standards.",
        "We encourage refill-first water habits and waste reduction where possible.",
        "Our guides are briefed to avoid risky behaviour (standing on dangerous edges, ignoring closures, etc.).",
      ],
      links: [
        { text: "Safety on tours", href: "/travel-guide/safety-on-tours" },
        {
          text: "Packing and fitness",
          href: "/travel-guide/packing-and-fitness",
        },
      ],
    },
    {
      title: "Ijen Health Screening as Community Safety",
      description:
        "Ijen screening is not only a private feature but a public-safety contribution:",
      icon: "🏥",
      color: "bg-red-100 text-red-600",
      points: [
        "Screening reduces the number of unfit or unprepared visitors on the trail.",
        "The digital system makes it harder to use fraudulent documents.",
        "This supports park staff, medical teams and fellow hikers.",
      ],
      images: [
        healthSafety.screening_procedures.find(
          (i) => i.filename === "ijen-screening-hotel-01.jpeg"
        )?.url,
        healthSafety.screening_procedures.find(
          (i) => i.filename === "jvto-office-screening-2.jpg"
        )?.url,
      ].filter(Boolean) as string[],
      links: [
        {
          text: "Ijen health screening explained",
          href: "/travel-guide/ijen-health-screening",
        },
      ],
    },
    {
      title: "Students & Fair Access",
      description:
        "International students often face higher travel and ticket costs. Through ISIC, we offer student-friendly structures on selected tours so that safety and local contribution are maintained, while pricing stays fair.",
      icon: "🎓",
      color: "bg-yellow-100 text-yellow-600",
      links: [
        { text: "ISIC student package", href: "/isic/student-package" },
        { text: "FAQ", href: "/travel-guide/faq" },
      ],
    },
  ];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const communityStandardsSchema = {
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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "112",
        },
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
          "https://javavolcano-touroperator.com/why-jvto/community-standards#webpage",
        url: "https://javavolcano-touroperator.com/why-jvto/community-standards",
        name: "Community Standards & Responsible Travel in East Java | Java Volcano Tour Operator",
        headline: "Community Standards & Responsible Travel in East Java",
        description:
          "Learn how Java Volcano Tour Operator works with local guides, youth and communities around Bromo, Ijen and Tumpak Sewu, and what we expect from our guests in return.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        primaryImageOfPage: {
          "@type": "ImageObject",
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/community-standards#primaryimage",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        image: [
          {
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#primaryimage",
          },
        ],
        about: [
          {
            "@type": "Thing",
            name: "Community Standards & Responsible Travel in East Java",
          },
        ],
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide/safety-on-tours",
          "https://javavolcano-touroperator.com/isic/student-package",
          "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness",
          "https://javavolcano-touroperator.com/verify-jvto",
          "https://javavolcano-touroperator.com/why-jvto/our-story",
        ],
        breadcrumb: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/community-standards#breadcrumb",
        },
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/community-standards#article",
        headline: "Community Standards & Responsible Travel in East Java",
        description:
          "Learn how Java Volcano Tour Operator works with local guides, youth and communities around Bromo, Ijen and Tumpak Sewu, and what we expect from our guests in return.",
        inLanguage: "en",
        mainEntityOfPage: {
          "@id":
            "https://javavolcano-touroperator.com/why-jvto/community-standards#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
        articleSection: [
          "Local Routes, Local People",
          "Working With Local Networks & Tourism Bodies",
          "Health & Safety as a Shared Responsibility",
          "Fair Pricing & Students",
          "Environmental Conduct on Tour",
          "Behaviour, Respect & Expectations",
          "How You Will Notice These Standards in Your Tour",
        ],
        articleBody: "JVTO partners with local guides and drivers across the Bromo–Ijen–Tumpak Sewu corridor. Many are youth from the surrounding villages, trained and supported over time. This keeps knowledge and income close to the destinations themselves.",
        image: [
          {
            "@type": "ImageObject",
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#image-group-at-jvto-office",
            url: siteUrl + "/ops/group-at-jvto-office.jpg",
            caption:
              "International group visiting JVTO Bondowoso operations office",
            description:
              "International travelers posing at JVTO Bondowoso operations office",
          },
          {
            "@type": "ImageObject",
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#image-guest-welcome-evening",
            url: "https://javavolcano-touroperator.com/ops/guest-welcome-evening.png",
            caption: "Evening welcome with guests at JVTO office",
            description:
              "Evening welcome and briefing with guests at JVTO office",
          },
          {
            "@type": "ImageObject",
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#image-ijen-geopark-briefing",
            url: "https://javavolcano-touroperator.com/ops/ijen-geopark-briefing.png",
            caption:
              "Tourist Police briefing at Ijen Geopark Information Center with local miners present",
            description:
              "Tourist Police briefing at Ijen Geopark Center with local miners present",
          },
          {
            "@type": "ImageObject",
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#image-baratha-hotel-departure-team",
            url: "https://javavolcano-touroperator.com/ops/baratha-hotel-departure-team.jpg",
            caption:
              "Pre-ascent lineup at Baratha Hotel with Tourist Police support",
            description:
              "Team and guests lined up outside Baratha Hotel before Ijen ascent with Tourist Police support vehicle",
          },
          {
            "@type": "ImageObject",
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#image-ijen-screening-hotel-01",
            url: "https://javavolcano-touroperator.com/screening/ijen-screening-hotel-01.jpeg",
            caption: "Pre-ascent health screening at partner hotel",
            description:
              "Nurse checks blood pressure during Ijen pre-ascent screening at hotel lobby",
          },
          {
            "@type": "ImageObject",
            "@id":
              "https://javavolcano-touroperator.com/why-jvto/community-standards#image-ijen-screening-hotel-02",
            url: "https://javavolcano-touroperator.com/screening/ijen-screening-hotel-02.jpg",
            caption: "Vitals taken and logged before night ascent",
            description:
              "Medical staff measure vitals for adult traveler at a hotel table",
          },
        ],
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://javavolcano-touroperator.com/why-jvto/community-standards#breadcrumb",
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
            name: "Community Standards & Responsible Travel in East Java",
            item: "https://javavolcano-touroperator.com/why-jvto/community-standards",
          },
        ],
      },
    ],
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={communityStandardsSchema} />
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-sm text-muted-foreground">
              <Link href="/why-jvto" className="hover:text-primary">
                Why JVTO
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Community Standards
              </span>
            </nav>

            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Community Standards – How We Work with People & Places
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                How JVTO works with local guides, communities and networks
                around Bromo, Ijen and Tumpak Sewu, and what we expect from
                guests to keep trips fair and respectful.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="space-y-12">
              {standards.map((standard, index) => (
                <section
                  key={index}
                  className="bg-card rounded-sm border p-6 md:p-8 shadow-sm"
                >
                  <div className="md:flex items-start mb-6">
                    <div
                      className={`w-16 h-16 rounded-sm flex items-center justify-center text-3xl mr-6 mb-4 md:mb-0 ${standard.color}`}
                    >
                      {standard.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase text-foreground">
                        {standard.title}
                      </h2>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-muted-foreground">
                      {standard.description}
                    </p>

                    {standard.points && (
                      <ul className="text-muted-foreground mt-4 space-y-2">
                        {standard.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {standard.images && standard.images.length > 0 && (
                    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      {standard.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative h-48 rounded-sm overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`${standard.title} illustration ${
                              imgIndex + 1
                            }`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {standard.links && standard.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 not-prose">
                      {standard.links.map((link, linkIndex) => (
                        <Button variant="link" key={linkIndex}>
                          <Link href={link.href}>{link.text}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
