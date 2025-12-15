import StructuredData from "@/components/website/StructuredData";
import Hero from "@/components/website/Home/Hero";
import Features from "@/components/website/Home/Features";
import LevelSelector from "@/components/website/Home/LevelSelector";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import Testimonials from "@/components/website/Home/Testimonials";
import Destinations from "@/components/website/Home/Destinations";
import TravelGuideTeaser from "@/components/website/Home/TravelGuideTeaser";
import type { Metadata } from "next";
import FAQSection from '@/components/website/FAQSection';
import Contact from '@/components/website/Contact';
import { miniFaqs, faqsCopy } from '@/constants';

export const metadata: Metadata = {
  title:
    "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const Home = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": siteUrl + "/#organization",
        name: "Java Volcano Tour Operator (JVTO)",
        alternateName: "JVTO",
        url: siteUrl,
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        logo: siteUrl + "/assets/img/jvto-color.png",
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
      },
      {
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        url: siteUrl,
        name: "Java Volcano Tour Operator",
        alternateName: "JVTO",
        publisher: {
          "@id": siteUrl + "/#organization",
        },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": siteUrl + "/#webpage",
        url: siteUrl,
        name: "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
        isPartOf: {
          "@id": siteUrl + "/#website",
        },
        about: {
          "@id": siteUrl + "/#organization",
        },
        inLanguage: "en",
        description:
          "Private, all-inclusive volcano tours to Bromo, Ijen and Tumpak Sewu. Tourist Police-led safety culture, registered Indonesian travel company, clear rules and no hidden fees.",
        headline: "Tourist Police-Led Private Volcano Tours in East Java",
        alternativeHeadline:
          "Private, all-inclusive Bromo, Ijen & Tumpak Sewu routes",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteUrl + "/assets/img/hero/home.webp",
        },
        breadcrumb: {
          "@id": siteUrl + "/#breadcrumb",
        },
        significantLink: [
          siteUrl + "/why-jvto/the-jvto-difference",
          siteUrl + "/why-jvto/reviews",
          siteUrl + "/travel-guide/booking-information",
          siteUrl + "/travel-guide/faq",
          siteUrl + "/travel-guide/ijen-health-screening",
          siteUrl + "/travel-guide/packing-and-fitness",
          siteUrl + "/travel-guide/safety-on-tours",
          siteUrl + "/travel-guide/weather-and-closures",
          siteUrl + "/travel-guide/police-escort-for-groups",
        ],
        mainEntity: {
          "@id": siteUrl + "/#organization",
        },
        hasPart: [
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/booking-information#webpage",
            url: siteUrl + "/travel-guide/booking-information",
            name: "Booking Information & Travel Credit — How JVTO Private Tours Work",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/faq#webpage",
            url: siteUrl + "/travel-guide/faq",
            name: "Frequently Asked Questions – answers about privacy, inclusions, health screening and student deals",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/ijen-health-screening#webpage",
            url: siteUrl + "/travel-guide/ijen-health-screening",
            name: "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/packing-and-fitness#webpage",
            url: siteUrl + "/travel-guide/packing-and-fitness",
            name: "Packing & Fitness Guide for Bromo, Ijen & Tumpak Sewu",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/safety-on-tours#webpage",
            url: siteUrl + "/travel-guide/safety-on-tours",
            name: "Safety on Tours — How JVTO Plans and Manages Risk",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/weather-and-closures#webpage",
            url: siteUrl + "/travel-guide/weather-and-closures",
            name: "Weather, Volcano Alerts & Closures",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/travel-guide/police-escort-for-groups#webpage",
            url: siteUrl + "/travel-guide/police-escort-for-groups",
            name: "Official Police Escort for Large Tourist Groups in East Java",
          },
          {
            "@type": "WebPage",
            "@id": siteUrl + "/why-jvto/reviews#webpage",
            url: siteUrl + "/why-jvto/reviews",
            name: "Guest Reviews & Long-Term Track Record",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": siteUrl + "/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
        ],
      },
      {
        "@type": "TouristAttraction",
        "@id": siteUrl + "/destinations/mount-bromo#destination",
        name: "Mount Bromo",
      },
      {
        "@type": "TouristAttraction",
        "@id": siteUrl + "/destinations/ijen-crater#destination",
        name: "Ijen Crater",
      },
      {
        "@type": "TouristAttraction",
        "@id": siteUrl + "/destinations/tumpak-sewu-waterfall#destination",
        name: "Tumpak Sewu Waterfall",
      },
      {
        "@type": "TouristAttraction",
        "@id": siteUrl + "/destinations/madakaripura-waterfall#destination",
        name: "Madakaripura Waterfall",
      },
      {
        "@type": "TouristAttraction",
        "@id": siteUrl + "/destinations/papuma-beach#destination",
        name: "Papuma Beach",
      },
    ],
  };

  return (
    <main>
      <StructuredData data={homeSchema} />

      <Hero />
      <Features />
      {/* <LevelSelector /> */}
      <FeaturedTours />
      <WhyJVTO />
      <Testimonials />
      <Destinations />
      <FAQSection copy={faqsCopy} faqs={miniFaqs} />
      <Contact/>
      <TravelGuideTeaser />
    </main>
  );
};

export default Home;
