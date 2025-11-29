import ContactPage from "@/components/website/ContactPage";
import StructuredData from "@/components/website/StructuredData";
export const metadata: Metadata = {
  title: "Contact JVTO Tours | Plan Your East Java Adventure",
  description:
    "Get in touch with our expert team to plan your private, all-inclusive tour of Mount Bromo, Ijen, and more. We're here to help you 24/7.",
};

export default function Contact() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://javavolcano-touroperator.com/contact/#webpage",
        url: "https://javavolcano-touroperator.com/contact/",
        name: "Contact Us | Java Volcano Tour Operator",
        description:
          "Ready to embark on an unforgettable Java volcano adventure? Contact Java Volcano Tour Operator for tour bookings, inquiries, and travel support. Get in touch with our team today to plan your next incredible journey in Indonesia.",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        mainEntity: {
          "@id": "https://javavolcano-touroperator.com/#travelagency",
        },
      },
      {
        "@type": "TravelAgency",
        "@id": "https://javavolcano-touroperator.com/#travelagency",
        name: "Java Volcano Tour Operator",
        url: "https://javavolcano-touroperator.com/",
        logo: "https://javavolcano-touroperator.com/assets/img/download.png",
        image:
          "https://javavolcano-touroperator.com/assets/img/destinations/og-image/java-volcano-home-thumb.jpg",
        description:
          "Private volcano tours in East Java: Mount Bromo, Ijen Crater, Tumpak Sewu & more. Licensed local tour operator based in Bondowoso.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Khairil Anwar Street No.102 A, Badean",
          addressLocality: "Bondowoso",
          addressRegion: "East Java",
          postalCode: "68219",
          addressCountry: "ID",
        },
        telephone: "+6282244788833",
        email: "hello@javavolcano-touroperator.com",
        priceRange: "$$",
        geo: {
          "@type": "GeoCoordinates",
          latitude: -7.91377,
          longitude: 113.82075,
        },
        hasMap: "https://maps.app.goo.gl/yWxCyyCvaEcWy5AU9",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+6282244788833",
          contactType: "Customer Service",
          areaServed: "ID",
          availableLanguage: ["English", "Indonesian"],
        },
        sameAs: [
          "https://www.facebook.com/javavolcanotouroperator",
          "https://www.instagram.com/javavolcanotour",
          "https://www.trustpilot.com/review/javavolcano-touroperator.com",
        ],
      },
      {
        "@type": "BreadcrumbList",
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
            name: "Contact",
            item: "https://javavolcano-touroperator.com/contact/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={contactSchema} />
      <ContactPage />;
    </>
  );
}
