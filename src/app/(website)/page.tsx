import StructuredData from "@/components/website/StructuredData";
import Hero from "@/components/website/Home/Hero";
import Features from "@/components/website/Home/Features";
import LevelSelector from "@/components/website/Home/LevelSelector";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import Testimonials from "@/components/website/Home/Testimonials";
import Reviews from "@/components/website/Home/Reviews";
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
          image:
            "https://upload.wikimedia.org/wikipedia/commons/b/bf/Agung_Sambuko.jpg",
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
            propertyID: "KBLI",
            value: "79911",
          },
          {
            "@type": "PropertyValue",
            propertyID: "KBLI",
            value: "62019",
          },
          {
            "@type": "PropertyValue",
            propertyID: "KBLI",
            value: "79121",
          },
          {
            "@type": "PropertyValue",
            propertyID: "AHU-Company-Profile",
            value:
              "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==",
          },
        ],
        memberOf: [
          {
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
            description:
              "Professional guides association trained in SAR and volcanic risk mitigation.",
          },
          {
            "@type": "Organization",
            name: "ISIC",
            description:
              "International Student Identity Card provider (digital verification).",
          },
          {
            "@type": "Organization",
            name: "INDECON",
            description: "Indonesia ecotourism network.",
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
        "@type": "Service",
        "@id": "https://javavolcano-touroperator.com/why-jvto#tourService",
        name: "Private Volcano Tour Operations (Mount Bromo & Mount Ijen)",
        provider: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        serviceType: [
          "Private tour",
          "Volcano tour",
          "Tour guiding service",
          "Travel agency service",
        ],
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: "East Java",
          },
          {
            "@type": "Country",
            name: "Indonesia",
          },
        ],
        description:
          "Standardized private operations for active-volcano environments, with disciplined risk protocols, own crew execution (not outsourced), and pre-ascent health screening for Mount Ijen when applicable.",
        termsOfService: "https://javavolcano-touroperator.com/verify-jvto",
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
      {
        "@type": "FAQPage",
        mainEntity: miniFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "WebApplication",
        "@id": "https://health.mountijen.com/#app",
        name: "Mount Ijen Digital Health Screening",
        alternateName: "Ijen Health Screening",
        url: "https://health.mountijen.com/",
        usageInfo:
          "Operational safety screening only. Does not replace medical diagnosis or treatment.",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        about: [
          {
            "@type": "Thing",
            name: "Pre-ascent health screening (SpO₂ & Blood Pressure)",
          },
          {
            "@type": "Place",
            name: "Mount Ijen",
          },
        ],
        featureList: [
          "Digital recording of SpO₂ and blood pressure",
          "QR-based clearance flow",
          "Supports go/no-go safety decisions",
        ],
        inLanguage: "en",
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

      {/* <Testimonials /> */}
      <div className="bg-jvto-green/5 pt-20 pb-20">
        <div className="w-full container mx-auto ">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center uppercase mb-3 text-jvto-dark">
              What Our Guests Say
            </h2>
            <p className="text-lg text-center">
              Real experiences from travelers who trusted us with their East
              Java adventure.
            </p>
          </div>

          <Reviews />
        </div>
      </div>

      <IjenHealthScreeningSection />
      {/* <Destinations /> */}
      <IsicSection />
      <FAQSection copy={faqsCopy} faqs={miniFaqs} />
      <TravelGuideTeaser />
      <Contact />
    </main>
  );
};

export default Home;
