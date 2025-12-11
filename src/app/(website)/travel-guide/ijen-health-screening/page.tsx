import Link from "next/link";
import Button from "@/components/website/UI/Button";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

export const metadata: Metadata = {
  title: "Ijen Health Screening — Real Checks, Digital Proof | JVTO",
  description:
    "Learn how JVTO includes real health screening for Ijen hikes and supports digital, QR-verified clearance for all travelers via health.mountijen.com",
};

export default function IjenHealthScreeningPage() {
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
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        },
        primaryImageOfPage: {
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
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
        "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
        url: siteUrl + "/assets/img/hero/home.webp",
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
          "@id": siteUrl + "/assets/img/hero/home.webp#primaryimage",
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
        articleBody: `
Ijen Health Screening — Real Checks, Digital Proof

Kawah Ijen is beautiful, but it is also a demanding night hike with steep sections and sulfur gas exposure. This page explains how JVTO handles health screening for Ijen and how our digital system supports safer decisions for all visitors.

Why Health Screening Is Necessary

Ijen combines a night hike, altitude, uneven terrain, and volcanic gases.
In the past, some visitors attempted the hike with serious health issues or using fake medical letters. This increased the risk of incidents for themselves, for other guests, and for local teams.
Our approach is to screen properly, record results clearly, and make it easy to verify.

What JVTO Includes for Its Guests

If your JVTO tour includes the Ijen night hike:

Health screening is included in your package.

Screening is carried out by trained medical staff at a partner clinic or accommodation.

Checks focus on key indicators such as blood pressure, oxygen saturation, heart rate, and relevant medical history.

Results are recorded in a digital system and linked to a QR code.

If the screening result suggests that the hike is too risky for you, we will explain the situation, propose safer alternatives in your itinerary when possible, and never pressure you to continue against medical advice.

Digital System and QR Verification

Screening results are stored in a digital system that allows:

staff at checkpoints to verify that a real screening was done,

reduced reliance on paper letters that can be forged,

clearer documentation for both guests and authorities.

JVTO supports this digital approach as part of a wider effort to reduce fake certificates, improve consistency of checks, and keep more visitors within safe limits.

For Non-JVTO Travelers

The same digital system is also available to travelers who are not touring with JVTO, through participating clinics and hotels in the Ijen area.
The goal is not to restrict competition, but to raise overall safety standards, reduce the circulation of fake letters, and provide everyone with clearer information about their own condition.

What Screening Does Not Do

Health screening helps reduce risk, supports better decisions, and provides documentation.
It does not guarantee that nothing can go wrong, replace your responsibility to disclose medical conditions, or replace the advice of your personal doctor.

Conditions on the mountain such as gas, weather, or crowding can still change. We may still decide to modify or cancel the hike if we believe it is the safest option for the group.

Data and Privacy (Short Summary)

Health data collected during screening is used only for safety and operational purposes related to your Ijen hike, shared only with parties who need to verify your eligibility to join, and handled according to the data protection and retention rules in our Privacy Policy.

Full legal details will be available in the Privacy Policy section of our website.

For JVTO Guests
Health screening is included in your Ijen tour package. No separate arrangement is needed.

For Independent Travelers
You can access the same digital health screening system used by JVTO guests through official partners.        
        `,
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
                Ijen Health Screening
              </span>
            </nav>

            <h1 className="font-black uppercase text-4xl text-center mb-6 tracking-tight">
              Ijen Health Screening — Real Checks, Digital Proof
            </h1>

            <div className="prose prose-lg mb-12 mx-auto text-center">
              <p className="text-muted-foreground text-lg">
                Kawah Ijen is beautiful, but it is also a demanding night hike
                with steep sections and sulfur gas exposure. This page explains
                how JVTO handles health screening for Ijen and how our digital
                system supports safer decisions for all visitors.
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-black uppercase mb-4">
                  1. Why Health Screening Is Necessary
                </h2>
                <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-6">
                  <p className="text-muted-foreground mb-4">
                    Ijen combines: a night hike, altitude, uneven terrain, and
                    volcanic gases.
                  </p>
                  <p className="text-muted-foreground">
                    In the past, some visitors attempted the hike with serious
                    health issues or using fake medical letters. This increased
                    the risk of incidents for themselves, for other guests, and
                    for local teams.
                  </p>
                  <p className="text-destructive font-medium mt-4">
                    Our approach: screen properly, record results clearly, and
                    make it easy to verify.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase mb-4">
                  2. What JVTO Includes for Its Guests
                </h2>
                <div className="bg-green-500/10 border border-green-500/20 rounded-sm p-6">
                  <p className="text-muted-foreground mb-4">
                    If your JVTO tour includes the Ijen night hike:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-6">
                    <li>Health screening is included in your package.</li>
                    <li>
                      Screening is carried out by trained medical staff at a
                      partner clinic or accommodation.
                    </li>
                    <li>
                      Checks focus on key indicators such as: blood pressure,
                      oxygen saturation, heart rate, and relevant medical
                      history related to heart, lungs, or circulation.
                    </li>
                    <li>
                      Results are recorded in a digital system and linked to a
                      QR code.
                    </li>
                  </ul>
                  <div className="bg-white border border-green-500/30 rounded-sm p-4">
                    <p className="text-green-800 font-semibold mb-2">
                      If the screening result suggests that the hike is too
                      risky for you, we will:
                    </p>
                    <ul className="list-disc pl-5 text-green-700 space-y-1">
                      <li>explain the situation,</li>
                      <li>
                        propose safer alternatives in your itinerary where
                        possible,
                      </li>
                      <li>
                        and never pressure you to continue against medical
                        advice.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase mb-4">
                  3. Digital System & QR Verification
                </h2>
                <div className="bg-primary/10 border border-primary/20 rounded-sm p-6">
                  <p className="text-muted-foreground mb-4">
                    Screening results are stored in a digital system that
                    allows:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-6">
                    <li>
                      staff at checkpoints to verify that a real screening was
                      done,
                    </li>
                    <li>less reliance on paper letters that can be forged,</li>
                    <li>
                      clearer documentation for both guests and authorities.
                    </li>
                  </ul>
                  <div className="bg-white border border-primary/30 rounded-sm p-4">
                    <p className="text-primary-foreground font-semibold">
                      JVTO supports this digital approach as part of a wider
                      effort to:
                    </p>
                    <ul className="list-disc pl-5 text-primary-foreground/80 space-y-1 mt-2">
                      <li>reduce fake certificates,</li>
                      <li>improve consistency of checks,</li>
                      <li>and keep more visitors within safe limits.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase mb-4">
                  4. For Non-JVTO Travelers
                </h2>
                <div className="bg-muted border rounded-sm p-6">
                  <p className="text-muted-foreground mb-4">
                    The same digital system is also available to travelers who
                    are not touring with JVTO, through participating clinics and
                    hotels in the Ijen area.
                  </p>
                  <div className="bg-background border rounded-sm p-4">
                    <p className="font-semibold mb-2">
                      The goal is not to restrict competition, but to:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>raise the overall standard of safety,</li>
                      <li>make it harder for fake letters to circulate,</li>
                      <li>
                        and give everyone clearer information about their own
                        condition.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase mb-4">
                  5. What Screening Does Not Do
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-sm p-6">
                  <p className="text-muted-foreground mb-4">
                    Health screening:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-6">
                    <li>helps reduce risk,</li>
                    <li>supports better decisions,</li>
                    <li>and provides documentation.</li>
                  </ul>
                  <p className="text-muted-foreground mb-4">It does not:</p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li>guarantee that nothing can go wrong,</li>
                    <li>
                      replace your own responsibility to disclose medical
                      conditions,
                    </li>
                    <li>replace the advice of your personal doctor.</li>
                  </ul>
                  <div className="mt-6 bg-white border border-yellow-500/30 rounded-sm p-4">
                    <p className="text-yellow-800 font-semibold">
                      Conditions on the mountain (gas, weather, crowding) can
                      still change. We may still decide to modify or cancel the
                      hike if we believe it is the safest option for the group.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black uppercase mb-4">
                  6. Data & Privacy (Short Summary)
                </h2>
                <div className="bg-muted border rounded-sm p-6">
                  <p className="text-muted-foreground">
                    Health data collected during screening is:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 my-4">
                    <li>
                      used only for safety and operational purposes related to
                      your Ijen hike,
                    </li>
                    <li>
                      shared only with parties who need to verify you are fit to
                      join,
                    </li>
                    <li>
                      handled according to the data protection and retention
                      rules stated in our Privacy Policy.
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Full legal details will be available in the{" "}
                    <Link
                      href="/travel-guide/privacy-policy"
                      className="text-primary underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    section of our website.
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-sm p-8 border border-blue-200">
                <h3 className="text-xl font-bold mb-4">For JVTO Guests</h3>
                <p className="text-muted-foreground mb-6">
                  Health screening is included in your Ijen tour package. No
                  need to arrange separately.
                </p>
                <Button>
                  <Link href="/tours?destination=ijen">Browse Ijen Tours</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-sm p-8 border border-green-200">
                <h3 className="text-xl font-bold mb-4">
                  For Independent Travelers
                </h3>
                <p className="text-muted-foreground mb-6">
                  Access the same digital health screening system used by JVTO
                  guests.
                </p>
                <Button variant="outline">
                  <a
                    href="https://health.mountijen.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit health.mountijen.com
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
