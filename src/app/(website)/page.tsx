import StructuredData from "@/components/website/StructuredData";
import Hero from "@/components/website/Home/Hero";
import Features from "@/components/website/Home/Features";
import LevelSelector from "@/components/website/Home/LevelSelector";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import Testimonials from "@/components/website/Home/Testimonials";
import Destinations from "@/components/website/Home/Destinations";
import TravelGuideTeaser from "@/components/website/Home/TravelGuideTeaser";
import IjenHealthScreeningSection from "@/components/website/Home/IjenHealthScreeningSection";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import IsicSection from "@/components/website/Home/IsicSection";
import type { Metadata } from "next";
import FAQSection from "@/components/website/FAQSection";
import Contact from "@/components/website/Contact";
import { miniFaqs, faqsCopy } from "@/constants";
import { headers } from "next/headers";

export async function getFullUrl() {
  const headersList = await headers(); // ⬅️ WAJIB await

  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  return `${protocol}://${host}`;
}

export const metadata: Metadata = {
  title:
    "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const Home = async () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "https://javavolcano-touroperator.com/#organization",
        name: "Java Volcano Tour Operator",
        legalName: "PT Java Volcano Rendezvous",
        alternateName: "JVTO",
        description:
          "Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.",
        url: "https://javavolcano-touroperator.com/",
        logo: "https://javavolcano-touroperator.com/assets/img/jvto-color.png",
        image: "https://javavolcano-touroperator.com/assets/img/hero/home.webp",
        foundingDate: "2016-01-01",
        priceRange: "$$",
        telephone: "+6282244788833",
        email: "hello@javavolcano-touroperator.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Khairil Anwar No.102 A, Badean",
          addressLocality: "Bondowoso",
          addressRegion: "Jawa Timur",
          postalCode: "68214",
          addressCountry: "ID",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+6282244788833",
          email: "hello@javavolcano-touroperator.com",
          availableLanguage: ["en", "id"],
        },
        founder: {
          "@type": "Person",
          "@id": "https://javavolcano-touroperator.com/#founder",
          name: "Agung Sambuko (Mr. Sam)",
          image: "https://commons.wikimedia.org/wiki/File:Agung_Sambuko.jpg",
          jobTitle: "Founder & Active Tourist Police Officer",
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
          affiliation: {
            "@id": "https://javavolcano-touroperator.com/#organization",
          },
        },
        areaServed: ["East Java", "Mount Bromo", "Mount Ijen"],
        memberOf: {
          "@type": "Organization",
          name: "Himpunan Pelaku Wisata Khusus Ijen (HPWKI)",
          url: "https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyaSAyMDI0",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bondowoso",
            addressRegion: "Jawa Timur",
            addressCountry: "ID",
          },
          identifier: [
            {
              "@type": "PropertyValue",
              propertyID: "AHU-Decree",
              value: "AHU-0001072.AH.01.07.TAHUN 2024",
            },
          ],
        },
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "TDUP",
            value: "0220001393513",
          },
          {
            "@type": "PropertyValue",
            name: "Business and tourism licence number",
            value: "1102230032918",
          },
          {
            "@type": "PropertyValue",
            propertyID: "AHU-Company-Profile",
            value:
              "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==",
          },
        ],
        sameAs: [
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          "https://trustpilot.com/review/javavolcano-touroperator.com",
          "https://www.google.com/maps?cid=1266403973589689021",
          "https://www.isic.org/discounts/?providerId=259268",
          "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
        ],
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
  const fullUrl = await getFullUrl();

  console.log("URL:", fullUrl);
  return (
    <main>
      <StructuredData data={homeSchema} />

      <Hero />
      <HomeDestinations />
      {/* <Features /> */}
      {/* <LevelSelector /> */}
      <FeaturedTours />
      <WhyJVTO />
      <Testimonials />
      <IsicSection />
      {/* <Destinations /> */}
      <IjenHealthScreeningSection />
      <FAQSection copy={faqsCopy} faqs={miniFaqs} />
      <TravelGuideTeaser />
      <Contact />
    </main>
  );
};

export default Home;
