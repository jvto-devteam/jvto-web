import type { PublicOrganizationProfileSnapshot } from "./types";

export const publicOrganizationProfileSnapshot: PublicOrganizationProfileSnapshot =
  {
    legal_name: "PT Java Volcano Rendezvous",
    brand_name: "Java Volcano Tour Operator (JVTO)",
    alternate_name: "JVTO",
    founding_date: new Date("2015-01-01T00:00:00.000Z"),
    description:
      "Registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. Private volcano tours to Bromo, Ijen, and East Java highlights.",
    price_range: "IDR 1,000,000 – IDR 6,050,000 per person",
    contact_email: "hello@javavolcano-touroperator.com",
    contact_phone: "+62 822-4478-8833",
    available_languages: ["en"],
    address_json: {
      "@type": "PostalAddress",
      streetAddress:
        "Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68214",
      postalCode: "68214",
      addressLocality: "Bondowoso",
      addressRegion: "East Java",
      addressCountry: "ID",
    },
    same_as_urls: [
      "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
      "https://www.google.com/maps?cid=1266403973589689021",
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
      "https://www.trustpilot.com/review/javavolcano-touroperator.com",
      "https://www.getyourguide.com/java-volcano-tour-operator-s260697/",
      "https://www.isic.org/discounts/?providerId=259268",
      "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
      "https://www.facebook.com/javavolcanotours/",
      "https://www.instagram.com/javavolcanotouroperator/",
    ],
    website_url: "https://javavolcano-touroperator.com",
    logo_url: "/assets/img/jvto-logo.png",
    hero_image_url: "/assets/img/hero/home.webp",
    updated_at: new Date("2026-05-08T00:00:00.000Z"),
  };
