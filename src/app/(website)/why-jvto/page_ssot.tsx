import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ShieldCheck,
  BookOpen,
  Star,
  User,
  Users,
  ArrowRight,
  CheckCircle,
  Search,
  MessageCircleQuestion,
} from "lucide-react";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
import Sidebar from "./sidebar";

export const metadata: Metadata = {
  title: "Why Choose Java Volcano Tour Operator (JVTO)",
  description:
    "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
  openGraph: {
    title: "Why Choose Java Volcano Tour Operator (JVTO)",
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
    title: "Why Choose Java Volcano Tour Operator (JVTO)",
    description:
      "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
    images: [siteUrl + "/assets/img/og/why-jvto.webp"],
  },
};

const trustStackCards = [
  {
    title: "Safety Leadership & The JVTO Difference",
    summary:
      "Police-led safety mindset, documented operational discipline, and proof you can verify.",
    icon: ShieldCheck,
    href: "/why-jvto/the-jvto-difference",
  },
  {
    title: "Our Story: Roots Since 2015",
    summary:
      "Booking.com award, Stefan Loose guidebook feature, and artifacts tracing our documented history.",
    icon: BookOpen,
    href: "/why-jvto/our-story",
  },
  {
    title: "Our Team: Local Crew",
    summary: "A local operations team trained for real East Java logistics.",
    icon: Users,
    href: "/why-jvto/our-team",
  },
  {
    title: "Guest Reviews (Independent Platforms)",
    summary:
      "Independent reviews across Tripadvisor, Trustpilot, Google, ISIC and Indecon.",
    icon: Star,
    href: "/why-jvto/reviews",
  },
  {
    title: "Community Standards & Partners",
    summary:
      "HPWKI, ISIC, INDECON partnerships plus operational ethics and cancellation rules.",
    icon: User,
    href: "/why-jvto/community-standards",
  },
  {
    title: "Verify JVTO",
    summary:
      "Legal docs, safety docs, press, and history artifacts—organized for easy checking.",
    icon: Search,
    href: "/verify-jvto",
  },
];

const faqItems = [
  {
    q: "Do you mix strangers into one car?",
    a: "No. JVTO runs private tours only.",
    link: "/travel-guide/booking-information",
    linkLabel: "Booking Information",
  },
  {
    q: "What if weather or closures change the plan?",
    a: "We adapt early and communicate clearly.",
    link: "/why-jvto/the-jvto-difference",
    linkLabel: "Safety Approach",
    link2: "/travel-guide",
    linkLabel2: "Practical Rules",
  },
  {
    q: "Where can I verify legality and proof?",
    a: "Everything is organized in our Proof Library.",
    link: "/why-jvto/the-jvto-difference",
    linkLabel: "Proof Library",
  },
  {
    q: "Where are your booking/payment terms?",
    a: "Full terms are on the booking & payment policy page.",
    link: "/policy/booking-payment-cancellation",
    linkLabel: "Booking & Payment Policy",
  },
  {
    q: "How do you handle personal data?",
    a: "All data handling is documented in our privacy policy.",
    link: "/policy/privacy",
    linkLabel: "Privacy Policy",
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
        name: "Why Choose Java Volcano Tour Operator",
        description:
          "Java Volcano Tour Operator (JVTO) is a tourist police-led, Indonesian-registered and fully licensed local operator based in Bondowoso. We design private, all-inclusive tours with real Ijen health screening, trained local guides and clear, written standards that you can verify before you book.",
        inLanguage: "en",
        isPartOf: { "@id": "https://javavolcano-touroperator.com/#website" },
        about: { "@id": "https://javavolcano-touroperator.com/#organization" },
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
            name: "Why Choose Java Volcano Tour Operator",
            item: "https://javavolcano-touroperator.com/why-jvto",
          },
        ],
      },
      {
        "@type": "Article",
        "@id": "https://javavolcano-touroperator.com/why-jvto#article",
        headline: "Why Choose Java Volcano Tour Operator",
        description:
          "Java Volcano Tour Operator (JVTO) is a tourist police-led, Indonesian-registered and fully licensed local operator based in Bondowoso. We design private, all-inclusive tours with real Ijen health screening, trained local guides and clear, written standards that you can verify before you book.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/why-jvto#webpage",
        },
        author: { "@id": "https://javavolcano-touroperator.com/#organization" },
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
        about: { "@id": "https://javavolcano-touroperator.com/#organization" },
        articleSection: ["The JVTO Trust Stack", "How to Verify Us", "FAQ"],
      },
      {
        "@type": "FAQPage",
        "@id": "https://javavolcano-touroperator.com/why-jvto#faq",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <StructuredData data={whyJVTOSchema} />

      <main className="pt-24">
        {/* Hero / H1 Section */}
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h1 className="font-black text-2xl md:text-5xl mb-6">
              Why Choose Java Volcano Tour Operator?
            </h1>

            {/* Lede paragraphs */}
            <div className="text-left max-w-3xl mx-auto space-y-4 mb-8">
              <p className="text-lg text-muted-foreground">
                Java Volcano Tour Operator (JVTO) is a registered Indonesian
                tour operator based in Bondowoso, East Java. We specialize in
                private volcano trips—Bromo, Ijen, and selected extensions.
              </p>
              <p className="text-muted-foreground">
                In a landscape where volcanic nature is uncertain, JVTO sells
                operational certainty—built on disciplined safety, documented
                proof, and local execution.
              </p>
              <p className="text-muted-foreground">
                If you want the practical rulebook (clear steps, what to bring,
                safety, payments), start with{" "}
                <Link
                  href="/travel-guide"
                  className="text-primary font-medium hover:underline"
                >
                  /travel-guide
                </Link>
                . For binding terms, use{" "}
                <Link
                  href="/policy"
                  className="text-primary font-medium hover:underline"
                >
                  /policy
                </Link>
                .
              </p>
              <p className="text-sm text-muted-foreground">
                Official channels:{" "}
                <a
                  href="https://javavolcano-touroperator.com"
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  javavolcano-touroperator.com
                </a>{" "}
                &bull;{" "}
                <a
                  href="https://wa.me/6282244788833"
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp +6282244788833
                </a>{" "}
                &bull;{" "}
                <a
                  href="mailto:hello@javavolcano-touroperator.com"
                  className="text-primary font-medium hover:underline"
                >
                  hello@javavolcano-touroperator.com
                </a>
              </p>
            </div>

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
            <div className="max-w-5xl mx-auto space-y-20 md:space-y-28">
              {/* Section 1: The JVTO Trust Stack */}
              <section id="trust-stack">
                <h2 className="font-black text-xl md:text-3xl mb-4 text-center">
                  The JVTO Trust Stack
                </h2>
                <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                  Pick what matters most to you. Each card links to proof-backed
                  details.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trustStackCards.map((card, index) => (
                    <Link key={index} href={card.href} className="group block">
                      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                        <CardHeader className="flex-col items-start gap-4 md:flex-row">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-lime-400 text-primary">
                            <card.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-base md:text-lg group-hover:text-primary mb-2">
                              {card.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {card.summary}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="inline-flex items-center text-primary font-medium group-hover:text-primary/80 text-sm">
                            Read more
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section 2: How to Verify Us */}
              <section id="how-to-verify-us-in-60-seconds">
                <h2 className="font-black text-xl md:text-3xl mb-8 text-center">
                  How to verify us in 60 seconds
                </h2>
                <Card className="max-w-2xl mx-auto p-8">
                  <p className="text-muted-foreground mb-6">
                    Open our Proof Library. Check the legal documents first,
                    then the safety and history artifacts.
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        label: "Start here",
                        href: "/why-jvto/the-jvto-difference",
                      },
                      {
                        label: "Quick checklist",
                        href: "/why-jvto/the-jvto-difference#how-proof-works",
                      },
                      { label: "Full proof library", href: "/verify-jvto" },
                    ].map((item, i) => (
                      <li key={i}>
                        <Link
                          href={item.href}
                          className="group flex items-center gap-3 text-sm"
                        >
                          <CheckCircle className="w-5 h-5 text-lime-500 shrink-0" />
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.label}
                          </span>
                          <span className="text-muted-foreground group-hover:text-primary/70 transition-colors">
                            {item.href}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>

              {/* Section 3: FAQ */}
              <section id="quick-answers-with-the-right-link">
                <h2 className="font-black text-xl md:text-3xl mb-4 text-center">
                  FAQ
                </h2>
                <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
                  Short answers here. Full details live on the owner page or
                  policy page.
                </p>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {faqItems.map((item, index) => (
                    <Card
                      key={index}
                      className="p-6 transition-all duration-300 hover:shadow-md hover:border-primary/30"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-lg bg-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageCircleQuestion className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-base mb-1">{item.q}</p>
                          <p className="text-muted-foreground text-sm mb-3">
                            {item.a}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={item.link}
                              className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80"
                            >
                              {item.linkLabel}
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                            {item.link2 && (
                              <Link
                                href={item.link2}
                                className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80"
                              >
                                {item.linkLabel2}
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
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
