// components/TravelGuideContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  MapPin,
  ReceiptText,
  HelpCircle,
  Shield,
  Backpack,
  CloudSun,
  ShieldAlert,
  Headphones,
  ChevronDown,
  Globe,
  MessageCircle,
  AlertTriangle,
  CheckSquare,
  Filter,
  ChevronUp,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  ExternalLink,
  Users,
  Mountain,
  Thermometer,
  Wind,
  Sun,
  Activity,
  Heart,
  Stethoscope,
  Smartphone,
  Calendar,
  CreditCard,
  FileText,
  Banknote,
  Car,
  Hotel,
  Umbrella,
  AlertCircle,
  Lock,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const TravelGuideContent = () => {
  const [openSections, setOpenSections] = useState({
    hub: true,
    booking: false,
    faq: false,
    ijen: false,
    safety: false,
    packing: false,
    weather: false,
    police: false,
  });

  const [openFaqItems, setOpenFaqItems] = useState<Record<number, boolean>>({});
  const [activeSection, setActiveSection] = useState("hub");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const travelGuideSchema = {
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
          "https://javavolcano-touroperator.com/_next/image?url=%2Fassets%2Fimg%2Fjvto-color.png&w=256&q=75",
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
          ratingValue: "4.9",
          reviewCount: "102",
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
        hasPart: [
          {
            "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
          },
        ],
      },
      {
        "@type": ["WebPage", "CollectionPage"],
        "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        url: "https://javavolcano-touroperator.com/travel-guide",
        name: "Travel Guide — Booking, Safety & Practical Info",
        description:
          "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you’ll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        breadcrumb: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#breadcrumb",
        },
        mainEntity: {
          "@id":
            "https://javavolcano-touroperator.com/travel-guide#help-topics",
        },
        datePublished: "2026-01-19T00:00:00+07:00",
        dateModified: "2026-01-19T00:00:00+07:00",
        hasPart: [
          {
            "@id": "https://javavolcano-touroperator.com/travel-guide#faq",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#booking-information",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
          },
          {
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": "https://javavolcano-touroperator.com/travel-guide#help-topics",
        name: "What do you need help with?",
        itemListOrder: "ItemListOrderAscending",
        numberOfItems: 7,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Frequently Asked Questions — Short Answers to Common Questions",
            item: {
              "@type": "WebPage",
              "@id": "https://javavolcano-touroperator.com/travel-guide#faq",
              url: "https://javavolcano-touroperator.com/travel-guide#faq",
              name: "Frequently Asked Questions — Short Answers to Common Questions",
              description:
                "Clear answers to the most common questions about private Bromo, Ijen and Tumpak Sewu tours with JVTO – bookings, payments, Travel Credit, health screening, safety, packing and groups.",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Booking Information",
            item: {
              "@type": "WebPage",
              "@id":
                "https://javavolcano-touroperator.com/travel-guide#booking-information",
              url: "https://javavolcano-touroperator.com/travel-guide#booking-information",
              name: "Booking Information",
              description:
                "This page is a plain-language summary of the official JVTO Booking, Payment & Cancellation Policy and the Inclusions & Exclusions Policy. Your Official E-Voucher / Invoice is always the primary contract for your specific booking.",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Ijen Health Screening",
            item: {
              "@type": "WebPage",
              "@id":
                "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
              url: "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
              name: "Ijen Health Screening",
              description:
                "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
            },
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Safety on Tours",
            item: {
              "@type": "WebPage",
              "@id":
                "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
              url: "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
              name: "Safety on Tours",
              description:
                "Understand how safety is built into JVTO’s private tours, what you can expect from us, and what we expect from you as a guest.",
            },
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Packing & Fitness",
            item: {
              "@type": "WebPage",
              "@id":
                "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
              url: "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
              name: "Packing & Fitness",
              description:
                "What to pack and how fit you should realistically be for private tours to Bromo, Ijen and Tumpak Sewu with JVTO. Clothing layers, footwear, fitness levels and practical tips for safer, more comfortable trips.",
            },
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Weather & Closures",
            item: {
              "@type": "WebPage",
              "@id":
                "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
              url: "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
              name: "Weather & Closures",
              description:
                "How weather and volcanic activity can affect your Bromo, Ijen and Tumpak Sewu tour with JVTO, and how we handle timetable changes, reroutes, closures and Travel Credit.",
            },
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "Police Escort for Groups",
            item: {
              "@type": "WebPage",
              "@id":
                "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
              url: "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
              name: "Police Escort for Groups",
              description:
                "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://javavolcano-touroperator.com/travel-guide#breadcrumb",
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
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://javavolcano-touroperator.com/travel-guide#faq",
        url: "https://javavolcano-touroperator.com/travel-guide#faq",
        name: "Frequently Asked Questions",
        headline: "Frequently Asked Questions",
        description:
          "Clear answers to the most common questions about private Bromo, Ijen and Tumpak Sewu tours with JVTO – bookings, payments, Travel Credit, health screening, safety, packing and groups.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntity: [
          {
            "@type": "Question",
            name: "Are your tours private or shared?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "All JVTO tours are private only. We do not mix your booking with other guests or sell “seat in coach” options. Your vehicle, driver and guide are arranged for your party alone.\n\nFor examples of private itineraries from Surabaya or Bali, see our Tours pages.",
            },
          },
          {
            "@type": "Question",
            name: "What is included in the price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each tour page shows a clear list of Inclusions and Exclusions. In general, our private, all-inclusive packages cover:\n\nPrivate vehicle and driver\n\nBromo 4WD jeep where listed\n\nStated park entrance tickets and permits\n\nAll hotel breakfasts\n\nSelected lunches and dinners (especially during the Bondowoso / Ijen segment)\n\nMineral water\n\nEssential gear for Ijen (gas mask and trekking pole) on tours that include Ijen\n\nJVTO travel T-shirt (where listed)\n\nAnything not listed under “Included” is treated as not included. For full details, please see Booking Information and the Inclusions & Exclusions section of your chosen tour.",
            },
          },
          {
            "@type": "Question",
            name: "How do I book and confirm a tour?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The usual steps are:\n\nYou send us your dates, origin (for example Surabaya or Bali), group size and preferred route.\n\nWe send you a tailored proposal with itinerary and price.\n\nYou confirm in writing and pay the booking deposit (normally 20% of the total).\n\nWe send you an official JVTO E-Voucher with your booking details.\n\nYour booking is considered confirmed when the deposit has been received and the E-Voucher has been issued. Full details are on the Booking Information page.",
            },
          },
          {
            "@type": "Question",
            name: "How do payments, deposits and deadlines work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases:\n\nA deposit is required to secure your booking.\n\nThe remaining balance is due a few days before Day 1 of your tour, depending on the payment method (for example card vs bank transfer).\n\nIf payment deadlines are missed, your booking may be at risk.\n\nThe exact amounts and dates are always stated in your E-Voucher and explained on our Booking Information page. That page and your E-Voucher together act as the official reference.",
            },
          },
          {
            "@type": "Question",
            name: "What is Travel Credit and do you offer cash refunds?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "JVTO uses a Travel Credit system instead of standard cash refunds for most guest-initiated cancellations. In general:\n\nIf you cancel far enough in advance (before the stated cutoff), we convert your paid amounts into Travel Credit.\n\nTravel Credit can be used for future JVTO tours, and may be transferable under the rules stated in our policy.\n\nTravel Credit does not normally expire.\n\nCash refunds are not normally provided except in specially defined situations.\n\nExact timing thresholds, percentages and special cases are described in detail on the Booking Information page and in the Booking & Cancellation Policy.",
            },
          },
          {
            "@type": "Question",
            name: "How does the Ijen health screening work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For tours that include the Ijen night hike, JVTO includes a mandatory health screening run by approved medical staff. The aim is to reduce the risk of sending unfit guests into a demanding environment with sulphur gas and steep trails.\n\nKey points:\n\nScreening takes place before the hike, often at your accommodation or a partner clinic.\n\nBasic checks are done (for example blood pressure, oxygen saturation and relevant medical history).\n\nResults are recorded and can be used to confirm whether the hike is appropriate.\n\nA digital system with QR verification is used to help prevent fake certificates.\n\nFull details, including what happens if you are not cleared, are explained on Ijen Health Screening.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if I do not pass the Ijen health screening?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If screening staff or our team advise that you should not attempt the hike, we will follow that decision. It is made to protect your safety and others on the trail.\n\nIn these cases, we may:\n\nOffer alternative low-risk activities or rest time, where practical\n\nContinue the rest of your itinerary as planned\n\nFinancial treatment (for example how costs for the Ijen segment are handled) follows the rules set in our Booking Information and policy. Please read that page carefully before you book.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need travel insurance?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we strongly recommend that all guests hold valid travel insurance that covers:\n\nMedical emergencies\n\nEvacuation and repatriation\n\nTrip interruption and cancellations\n\nJVTO operates as a licensed Indonesian tour operator, but we cannot act as an insurance provider and cannot cover costs that fall under personal insurance.",
            },
          },
          {
            "@type": "Question",
            name: "Can children or older travellers join JVTO tours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Many families and older travellers have joined our tours safely and comfortably. The key is matching itinerary difficulty to the real fitness and health of the guests:\n\nSome routes (for example Tumpak Sewu and the full Ijen hike) are physically demanding.\n\nOthers can be adapted with more viewpoints and less intense trails.\n\nPlease tell us clearly about ages and relevant conditions when you first contact us. We may suggest a slower or gentler plan based on your group’s needs.",
            },
          },
          {
            "@type": "Question",
            name: "What if I feel unwell during the tour?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tell your driver or guide as soon as you notice it – do not wait until it becomes an emergency. Because your tour is private, we have more flexibility to:\n\nAdjust the pace\n\nAdd extra rest stops\n\nChange or skip certain activities when it is safer to do so\n\nFor serious symptoms, we will prioritise getting you to appropriate medical support. Always follow the instructions of your crew in such situations.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if Bromo or Ijen is closed on my dates?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We follow official instructions from Indonesian authorities and park management. Depending on the situation:\n\nWe may adjust timings or use alternative viewpoints\n\nWe may replace certain stops with other available local visits\n\nIn more serious cases, specific segments (such as a night hike) may be cancelled while other parts of the tour continue.\n\nHow this affects your booking financially is explained in the Weather & Closures and Booking Information pages. External closures are handled differently from voluntary cancellations.",
            },
          },
          {
            "@type": "Question",
            name: "Can you guarantee sunrise views or blue fire?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Weather, cloud, volcanic gas and other natural factors are outside our control.\n\nWe design our itineraries to maximise the chance of good conditions.\n\nWe cannot promise specific colours, light or blue fire visibility on any given night.\n\nOur commitment is to honest briefings and to acting quickly if conditions become unsafe.",
            },
          },
          {
            "@type": "Question",
            name: "If it rains, will our tour be cancelled?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Light or normal rain rarely cancels an entire tour, but it can:\n\nMake trails more slippery\n\nReduce visibility\n\nRequire changes in timing or route\n\nSevere weather, landslides or dangerous conditions can lead to partial or full cancellations for safety. Our Weather & Closures page explains how we respond and how this links to Travel Credit and itinerary changes.",
            },
          },
          {
            "@type": "Question",
            name: "How much luggage can I bring?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases, standard airline-style luggage is fine:\n\nOne main suitcase or backpack per person\n\nOne small daypack\n\nIf you plan to travel with unusually large or heavy items, please tell us in advance so we can plan the right vehicle. On days with hikes, we recommend leaving your main luggage in the car or accommodation and carrying only what you need in a daypack.",
            },
          },
          {
            "@type": "Question",
            name: "What should I wear and bring for these tours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The key is layering, grip and simplicity:\n\nLayered clothing for cold pre-dawn starts and warmer later hours\n\nClosed shoes with good grip (hiking shoes recommended for Ijen and Tumpak Sewu)\n\nSmall backpack, personal headlamp or torch, waterproof cover for electronics\n\nEssential personal medication\n\nWe recommend keeping non-essential valuables and jewellery to a minimum, and avoiding silver items during Ijen days due to sulphur. For full details, see Packing & Fitness.",
            },
          },
          {
            "@type": "Question",
            name: "Do you offer ISIC student deals?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Through our collaboration with ISIC, verified international students may access adapted rates on selected packages. The goal is to keep travel fair for students facing higher foreign entrance fees, without reducing safety or quality.\n\nThe exact conditions and eligible tours are explained on our ISIC / Student Deals page.",
            },
          },
          {
            "@type": "Question",
            name: "Can you arrange an official police escort for our group?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For large groups (typically around 18 guests or more), JVTO can help coordinate an official traffic police escort on certain road segments (for example from a toll exit to Bondowoso), if approved by the relevant Traffic Police unit.\n\nKey points:\n\nEscorts are based on formal written orders from the authorities\n\nRoutes and times are clearly defined\n\nThe aim is safe convoy management, not speeding or bypassing laws\n\nThis is not automatic and not a marketing gimmick. Full details are on Police Escort for Groups.",
            },
          },
          {
            "@type": "Question",
            name: "How can we contact JVTO before and during the tour?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Before and during your tour, our official channels are:\n\nWhatsApp (primary)\n\nEmail\n\nThese details appear on your E-Voucher and on the Contact page. Please make sure your phone number (including country code) and email address are correct so we can reach you with any important updates.",
            },
          },
          {
            "@type": "Question",
            name: "Which documents should I keep with me?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We recommend keeping the following easily accessible:\n\nPassport and required visas\n\nTravel insurance information\n\nYour JVTO E-Voucher and contact details (printed or on your phone)\n\nAny relevant medical information you may need to show in an emergency",
            },
          },
          {
            "@type": "Question",
            name: "Where can I read the full legal policy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The full legal text of our booking and cancellation terms is available on:\n\nBooking Information (web page summary)\n\nBooking & Cancellation Policy (document)\n\nIn any confusion, the combination of your JVTO E-Voucher, the Booking Information page and the official policy document is treated as the final reference.",
            },
          },
        ],
        hasPart: [
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#booking-information",
            url: "https://javavolcano-touroperator.com/travel-guide#booking-information",
            name: "Booking Information – payments, deposits, Travel Credit and cancellations",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
            url: "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
            name: "Ijen Health Screening – how screening works and what results mean",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
            url: "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
            name: "Safety on Tours – our approach to risk and guest responsibilities",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
            url: "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
            name: "Packing & Fitness – what to bring and how fit you should be",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
            url: "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
            name: "Weather & Closures – how natural conditions affect your itinerary",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
            url: "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
            name: "Police Escort for Groups – how official escorts work for large groups",
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#booking-information",
        url: "https://javavolcano-touroperator.com/travel-guide#booking-information",
        name: "Booking Information & Travel Credit — How JVTO Private Tours Work",
        description:
          "This page is a plain-language summary of the official JVTO Booking, Payment & Cancellation Policy and the Inclusions & Exclusions Policy. Your Official E-Voucher / Invoice is always the primary contract for your specific booking.",
        provider: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
        headline:
          "Ijen Health Screening — Real Checks, Digital Proof for Safer Night Hikes",
        description:
          "Learn how JVTO includes real health screening for Ijen night hikes and supports digital, QR-verified health clearance to reduce fake certificates and avoid preventable incidents.",
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
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
        articleBody: "{{PLACEHOLDER_ARTICLE_BODY}}",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
        about: {
          "@id":
            "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide#booking-information",
          "https://javavolcano-touroperator.com/travel-guide#faq",
          "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
        ],
      },
      {
        "@type": "WebPage",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening-faq",
        url: "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening-faq",
        name: "Ijen Health Screening FAQ",
        inLanguage: "en",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Ijen health screening optional if I travel with JVTO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. For JVTO tours that include the Ijen night hike, health screening is part of our standard operating procedure. We will not run the hike for guests who are not cleared.",
            },
            inLanguage: "en",
            dateModified: "2026-01-19T00:00:00+07:00",
          },
          {
            "@type": "Question",
            name: "Does a “cleared” result mean there is no risk?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. It means that, at the time of screening, there is no obvious reason to block you based on the checks used. Natural conditions and personal responses can still change.",
            },
            inLanguage: "en",
            dateModified: "2026-01-19T00:00:00+07:00",
          },
          {
            "@type": "Question",
            name: "What if I refuse to be screened?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If you refuse mandatory screening, you will not be allowed to join the Ijen hike. The relevant costs are treated as used, and our standard Travel Credit and late cancellation rules apply.",
            },
            inLanguage: "en",
            dateModified: "2026-01-19T00:00:00+07:00",
          },
          {
            "@type": "Question",
            name: "Can I get a refund if I am not cleared?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No cash refund is provided when you are not cleared to hike after screening, because the related costs have been committed. Where possible, we may arrange alternative activities, but these depend on real-time conditions.",
            },
            inLanguage: "en",
            dateModified: "2026-01-19T00:00:00+07:00",
          },
          {
            "@type": "Question",
            name: "I already have a letter from my doctor. Do I still need screening?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In most cases, yes. Local implementation requires a recognised screening process on-site or through participating providers, not just a letter carried from overseas.",
            },
            inLanguage: "en",
            dateModified: "2026-01-19T00:00:00+07:00",
          },
        ],
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
        headline: "Safety on Tours — How JVTO Plans and Manages Risk",
        description:
          "Understand how safety is built into JVTO’s private tours, what you can expect from us, and what we expect from you as a guest.",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        articleSection: [
          "Our Safety Approach in One Look",
          "Before Your Trip: Information & Fitness",
          "During Your Tour: Crew, Vehicles & On-Site Decisions",
          "Volcanoes, Weather & Closures",
          "What You Can Expect from JVTO",
          "What JVTO Expects from You",
          "Related Safety Pages",
        ],
        articleBody: "{{PLACEHOLDER_ARTICLE_BODY_HTML_OR_TEXT}}",
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        datePublished: "2026-01-19T00:00:00+07:00",
        dateModified: "2026-01-19T00:00:00+07:00",
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide#booking-information",
          "https://javavolcano-touroperator.com/travel-guide#faq",
          "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
        headline: "Packing & Fitness Guide for Bromo, Ijen & Tumpak Sewu",
        description:
          "What to pack and how fit you should realistically be for private tours to Bromo, Ijen and Tumpak Sewu with JVTO. Clothing layers, footwear, fitness levels and practical tips for safer, more comfortable trips.",
        inLanguage: "en",
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        datePublished: "2026-01-19T00:00:00+07:00",
        dateModified: "2026-01-19T00:00:00+07:00",
        articleSection: [
          "Why This Guide Matters",
          "Temperatures & Conditions in Short",
          "Clothing: Layers Work Best",
          "Footwear, Small Gear & Valuables",
          "Special Note for Silver Jewellery at Ijen",
          "Fitness Levels by Destination",
          "Who Should Consider a Gentler Itinerary",
          "During the Tour: Tell Your Crew How You Feel",
          "Quick Packing Checklist",
          "Related Pages",
        ],
        about: [
          {
            "@type": "TouristAttraction",
            name: "Mount Bromo",
            url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
          },
          {
            "@type": "TouristAttraction",
            name: "Ijen Crater",
            url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
          },
          {
            "@type": "TouristAttraction",
            name: "Tumpak Sewu Waterfall",
            url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
          },
        ],
        articleBody: "{{PLACEHOLDER_ARTICLE_BODY_HTML}}",
        url: "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide#booking-information",
          "https://javavolcano-touroperator.com/travel-guide#faq",
          "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
          "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
        ],
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
        headline: "Weather, Volcano Alerts & Closures",
        description:
          "How weather and volcanic activity can affect your Bromo, Ijen and Tumpak Sewu tour with JVTO, and how we handle timetable changes, reroutes, closures and Travel Credit.",
        inLanguage: "en",
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        datePublished: "2026-01-19T00:00:00+07:00",
        dateModified: "2026-01-19T00:00:00+07:00",
        articleSection: [
          "Why Conditions Can Change Quickly",
          "Rain Patterns: What to Expect (Without Overpromising)",
          "Volcano Activity & Official Alerts",
          "Types of Changes You Might Experience",
          "How This Links to Booking Information & Travel Credit",
          "Your Role as a Guest",
          "Quick FAQ",
          "Related Pages",
        ],
        about: [
          {
            "@type": "TouristAttraction",
            name: "Mount Bromo",
            url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
          },
          {
            "@type": "TouristAttraction",
            name: "Ijen Crater",
            url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
          },
          {
            "@type": "TouristAttraction",
            name: "Tumpak Sewu Waterfall",
            url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
          },
        ],
        articleBody: "{{PLACEHOLDER_ARTICLE_BODY_HTML}}",
        url: "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        relatedLink: [
          "https://javavolcano-touroperator.com/travel-guide#booking-information",
          "https://javavolcano-touroperator.com/travel-guide#faq",
          "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
        ],
      },
      {
        "@type": "WebPage",
        name: "Weather & Closures FAQ",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        mainEntity: [
          {
            "@type": "Question",
            name: "What happens if Bromo or Ijen is closed on my travel dates?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We follow official instructions. Where possible, we will reroute to alternative viewpoints or destinations, or adjust the pacing of your trip. The financial treatment (for example Travel Credit or partial adjustments) follows the rules in our Booking Information and policy.",
            },
          },
          {
            "@type": "Question",
            name: "If the volcano is “on alert”, will you still run the tour?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It depends on the alert level, hazard zones, and permissions. Some alerts allow controlled access; others require full closure. We decide based on official guidance, not marketing promises.",
            },
          },
          {
            "@type": "Question",
            name: "Can you guarantee that we will see sunrise or blue fire?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Weather, visibility, and volcanic activity are outside our control. We design routes to maximise the chance of good conditions, but we cannot promise specific colours or phenomena.",
            },
          },
          {
            "@type": "Question",
            name: "If it rains, will our tour be cancelled?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Light or normal rain rarely cancels an entire tour. It may change timings, viewpoints, or which activities feel comfortable. Severe weather, landslides, or dangerous conditions can lead to partial or full cancellations for safety.",
            },
          },
          {
            "@type": "Question",
            name: "Can I get a full cash refund if a volcano is closed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our Booking & Cancellation Policy explains how Travel Credit and refunds work in these situations. In many cases, we focus on rerouting and providing alternative experiences rather than offering full cash refunds for services impacted by external events.",
            },
          },
        ],
        url: "https://javavolcano-touroperator.com/travel-guide#weather-and-closures-faq",
      },
      {
        "@type": "Article",
        "@id":
          "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
        headline:
          "Official Police Escort for Large Tourist Groups in East Java",
        description:
          "Learn when and how JVTO can coordinate official traffic police escort for large groups in East Java, and what this service does and does not include.",
        inLanguage: "en",
        url: "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups",
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        author: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        datePublished: "2026-01-19T00:00:00+07:00",
        dateModified: "2026-01-19T00:00:00+07:00",
        articleSection: [
          "What “Police Escort” Means in Our Context",
          "When Escort May Be Available",
          "How the Request Process Works",
          "Costs, Inclusions & Limitations",
          "Cancellation, Changes & Force Majeure",
          "Quick FAQ",
        ],
        articleBody: "{{PLACEHOLDER_ARTICLE_BODY_POLICE_ESCORT_FOR_GROUPS}}",
        mentions: [
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
            name: "Ijen Health Screening",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
            name: "Packing & Fitness",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
            name: "Weather & Closures",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#booking-information",
            name: "Booking Information",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
            name: "Safety On Tours",
          },
        ],
        relatedLink: [
          "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
          "https://javavolcano-touroperator.com/why-jvto/reviews",
          "https://javavolcano-touroperator.com/travel-guide#booking-information",
          "https://javavolcano-touroperator.com/travel-guide#faq",
          "https://javavolcano-touroperator.com/travel-guide#ijen-health-screening",
          "https://javavolcano-touroperator.com/travel-guide#packing-and-fitness",
          "https://javavolcano-touroperator.com/travel-guide#safety-on-tours",
          "https://javavolcano-touroperator.com/travel-guide#weather-and-closures",
        ],
      },
      {
        "@type": "WebPage",
        name: "Police Escort for Groups FAQ",
        url: "https://javavolcano-touroperator.com/travel-guide#police-escort-for-groups-faq",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        about: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
        mainEntityOfPage: {
          "@id": "https://javavolcano-touroperator.com/travel-guide#webpage",
        },
        mainEntity: [
          {
            "@type": "Question",
            name: "Can every JVTO tour get a police escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Escort is reserved for specific large group programs and must be approved by the relevant Traffic Police unit. Regular private tours are not escorted.",
            },
          },
          {
            "@type": "Question",
            name: "Can we decide to add escort at the last minute?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Normally no. Escort requires formal approvals, planning, and scheduling. Last-minute requests are unlikely to be accepted.",
            },
          },
          {
            "@type": "Question",
            name: "Is escort included in the standard tour price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. If escort is approved and included, any cost is clearly shown as a separate line in your group proposal and invoice.",
            },
          },
          {
            "@type": "Question",
            name: "Does escort mean we can ignore normal road rules?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Escort is intended to improve convoy management and safety, not to bypass the law.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if the police cancel our escort?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If the escort is cancelled by the authorities, JVTO will still operate your tour using normal private vehicles. We will apply the same principles that we use for other external changes, as described in our Booking Information.",
            },
          },
        ],
      },
      {
        "@type": "TouristAttraction",
        "@id":
          "https://javavolcano-touroperator.com/destinations/ijen-crater#destination",
        name: "Ijen Crater",
      },
    ],
  };
  const faqData = [
    {
      q: "Q1. Are your tours private or shared?",
      a: "All JVTO tours are private tours. We do not mix you with other groups or sell 'seat-in-coach' departures. Each itinerary is planned only for your party.",
    },
    {
      q: "Q2. What is included in the tour price?",
      a: "The binding list of inclusions is written on your Official E‑Voucher / Invoice (PDF). Depending on the package, inclusions may include private transport, Bromo jeep (if included), listed tickets/permits, accommodation + breakfasts (if included), and Ijen safety gear/screening (if included). Anything not written as included on your voucher is excluded by default.",
    },
    {
      q: "Q3. What is not included?",
      a: "Normally not included: flights, long-distance trains, visas, travel insurance, personal expenses (extra drinks, snacks, souvenirs, etc.), tips and gratuities, optional activities not listed.",
    },
    {
      q: "Q4. How do I book a tour with JVTO?",
      a: "A booking is confirmed only when (1) the required payment is successfully processed and (2) JVTO issues your Official E‑Voucher / Invoice (PDF). Enquiries and quotations are not binding until confirmation.",
    },
    {
      q: "Q5. Do you require a deposit and when is full payment due?",
      a: "Standard deposit: 20% of the total booking value. If Day 1 is within 14 days, JVTO may require up to 100% full payment. By card: no later than 5 days before Day 1. By bank transfer / Wise: no later than 3 days before Day 1.",
    },
    {
      q: "Q6. Do you offer cash refunds?",
      a: "JVTO uses a Travel Credit system instead of cash refunds. We do not offer cash refunds, except where required by applicable law.",
    },
    {
      q: "Q7. Can I change my dates or reschedule?",
      a: "Where possible, JVTO may allow a date change for the same package if requested 48 hours or more before Day 1 (local Indonesia time). All changes are subject to availability and any supplier cost differences. Requests made less than 48 hours before Day 1 are generally not permitted.",
    },
    {
      q: "Q8. What happens if Bromo or Ijen is closed?",
      a: "If a core activity is fully closed by authorities or unsafe to attempt, we first look for reasonable alternatives within safety limits. If no meaningful alternative is possible, we apply our Travel Credit policy for the affected part of your program.",
    },
    {
      q: "Q9. How does the Ijen health screening work?",
      a: "For tours that include the Ijen night hike: A proper health screening is included in your package. Checks are carried out by trained medical staff and recorded digitally. The result can be verified using a QR code to help prevent fake certificates.",
    },
    {
      q: "Q10. Can you arrange official traffic police escort for our group?",
      a: "For large groups, JVTO may help coordinate official traffic police escort on certain segments, subject to availability, local regulations, route feasibility, and any additional costs imposed by authorities.",
    },
    {
      q: "Q11. Do you offer student deals with ISIC?",
      a: "Yes. We collaborate with ISIC so that verified ISIC cardholders can access fair rates on selected packages, while keeping the same safety standards and inclusions as other guests.",
    },
    {
      q: "Q12. Do I need travel insurance?",
      a: "We strongly recommend you purchase comprehensive travel insurance that covers: medical care, cancellations, delays, and activities such as hiking and outdoor tours. JVTO does not sell insurance and cannot act as your insurer.",
    },
    {
      q: "Q13. I have a medical condition. Can I still join?",
      a: "Many guests with mild or managed conditions can still travel comfortably, but you must consult your doctor before the trip. Please inform us of any relevant conditions in advance, especially if you plan to hike Ijen.",
    },
    {
      q: "Q14. What should I pack and how fit do I need to be?",
      a: "Packing and fitness requirements depend on your itinerary (Bromo, Ijen, Tumpak Sewu). We summarize this in a dedicated page.",
    },
    {
      q: "Q15. Who can I contact during the tour if I need help?",
      a: "During your private tour, you will be accompanied by a dedicated driver and, on some segments, local guides. For any serious concern, the contact number on your confirmation remains active.",
    },
  ];
  // ADD: Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hub",
        "booking",
        "faq",
        "ijen",
        "safety",
        "packing",
        "weather",
        "police",
      ];

      // Navbar height (top bar 36px + main bar 80px + offset 20px)
      const navbarHeight = 136;
      const scrollPosition = window.scrollY + navbarHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ADD: Smooth scroll dengan offset navbar
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 136; // top bar + main bar + padding
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;
      setOpenSections((prev) => ({
        ...prev,
        [sectionId]: true,
      }));

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      {/* JSON-LD Schema untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelGuideSchema) }}
      />

      <div className="bg-background-light font-display text-[#111811] pt-20">
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 lg:px-10 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-32 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <nav className="flex flex-col gap-1">
                    <button
                      onClick={() => scrollToSection("hub")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-left transition-colors ${
                        activeSection === "hub"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <MapPin size={20} />
                      <span className="text-sm">Travel Guide Hub</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("booking")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "booking"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ReceiptText size={20} />
                      <span className="text-sm">Booking & Payments</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("faq")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "faq"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <HelpCircle size={20} />
                      <span className="text-sm">FAQ</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("ijen")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "ijen"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Filter size={20} />
                      <span className="text-sm">Ijen Health Screening</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("safety")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "safety"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Shield size={20} />
                      <span className="text-sm">Safety on Tours</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("packing")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "packing"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Backpack size={20} />
                      <span className="text-sm">Packing & Fitness</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("weather")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "weather"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <CloudSun size={20} />
                      <span className="text-sm">Weather & Closures</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("police")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                        activeSection === "police"
                          ? "bg-[#9fce33] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ShieldAlert size={20} />
                      <span className="text-sm">Police Escort for Groups</span>
                    </button>
                  </nav>
                </div>
                <div className="bg-[#1a1a1a] text-white p-6 rounded-xl relative overflow-hidden shadow-lg">
                  <div className="absolute -right-4 -top-4 text-white/5">
                    <Headphones size={120} />
                  </div>
                  <h4 className="font-bold mb-2 relative z-10">Need Help?</h4>
                  <p className="text-sm text-gray-300 mb-4 relative z-10">
                    Our team is available 24/7 for your questions.
                  </p>
                  <Link
                    target="_blank"
                    href="https://wa.me/6282244788833"
                    className="w-full py-2 bg-[#9fce33] text-[#1a1a1a] font-bold text-sm rounded-lg relative z-10 hover:bg-white transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div
                className="mb-10 border border-gray-200 p-6 rounded-lg shadow-sm bg-[#9fce33]/5"
                id="hub"
              >
                <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight mb-3">
                  Comprehensive Travel Guide
                </h1>
                <p className=" text-gray-600">
                  Everything you need to know for your journey with JVTO. Please
                  read through carefully to ensure a safe and memorable
                  adventure.
                </p>
                <div className="text-gray-600 mb-6 mt-2 space-y-4">
                  <p>
                    This Travel Guide is your practical handbook for traveling
                    with Java Volcano Tour Operator (JVTO). Here you'll find
                    clear information on bookings, payments, reschedules, health
                    screening for Ijen, safety on tours, packing,
                    weather-related closures, and when police escort can be
                    arranged for groups.
                  </p>
                  <p>
                    For binding legal terms, please refer to:
                    <Link
                      href="/policy/booking-payment-cancellation/"
                      className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded mx-1"
                    >
                      /policy/booking-payment-cancellation/
                    </Link>
                    ,
                    <Link
                      href="/policy/inclusions-exclusions/"
                      className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded mx-1"
                    >
                      /policy/inclusions-exclusions/
                    </Link>
                    , and{" "}
                    <Link
                      href="/policy/privacy/"
                      className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded mx-1"
                    >
                      /policy/privacy
                    </Link>
                    .
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="font-bold text-blue-800 mb-2">
                      Official channels:
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex md:items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">
                          Website: https://javavolcano-touroperator.com
                        </span>
                      </div>
                      <div className="flex md:items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">
                          WhatsApp: +62 822-4478-8833
                        </span>
                      </div>
                      <div className="flex md:items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">
                          Email: hello@javavolcano-touroperator.com
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:hidden mt-10">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                      <BookOpen size={20} />
                      Table of Contents
                    </h2>
                    <nav className="space-y-2">
                      <button
                        onClick={() => scrollToSection("booking")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "booking"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">Booking & Payments</span>
                      </button>

                      <button
                        onClick={() => scrollToSection("faq")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "faq"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">FAQ</span>
                      </button>

                      <button
                        onClick={() => scrollToSection("ijen")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "ijen"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">Ijen Health Screening</span>
                      </button>

                      <button
                        onClick={() => scrollToSection("safety")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "safety"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">Safety on Tours</span>
                      </button>

                      <button
                        onClick={() => scrollToSection("packing")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "packing"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">Packing & Fitness</span>
                      </button>

                      <button
                        onClick={() => scrollToSection("weather")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "weather"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">Weather & Closures</span>
                      </button>

                      <button
                        onClick={() => scrollToSection("police")}
                        className={`flex items-center border-b border-gray-200 gap-3 w-full text-left py-4 transition-colors ${
                          activeSection === "police"
                            ? "text-[#9fce33] font-bold"
                            : "text-gray-600 hover:text-[#9fce33]"
                        }`}
                      >
                        <ChevronRight size={18} className="flex-shrink-0" />
                        <span className="text-sm">
                          Police Escort for Groups
                        </span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <section
                  id="booking"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("booking")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ReceiptText size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Booking Information — Payments, Changes & Travel
                          Credit
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.booking ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.booking ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This section explains how bookings, payments, changes,
                        and Travel Credit work for private tours with JVTO. It
                        is a plain-language summary. For the full legal policy,
                        see{" "}
                        <Link
                          href="/policy/booking-payment-cancellation/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/booking-payment-cancellation/
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 2.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.1
                          </span>
                          How to Book a Private Tour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            JVTO operates private tours only. We do not sell
                            shared-group or "seat-in-coach" trips.
                          </p>
                          <p>
                            The standard way to book is through our website
                            secure checkout:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Choose your route/package on our website.</li>
                            <li>
                              Select your travel date and click Instant Book.
                            </li>
                            <li>
                              Enter the lead traveler contact details (email +
                              WhatsApp).
                            </li>
                            <li>Review & pay via secure checkout.</li>
                            <li>
                              After successful payment, JVTO issues your
                              Official E‑Voucher / Invoice (PDF) and you can
                              access My Booking Portal.
                            </li>
                            <li>
                              If you need help (or have a custom request),
                              contact us via WhatsApp +62 822-4478-8833 or email
                              hello@javavolcano-touroperator.com.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 2.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.2
                          </span>
                          Deposits & Final Payment
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <div>
                            <p className="font-bold">Deposit</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                Standard deposit: <strong>20%</strong> of the
                                total booking value.
                              </li>
                              <li>
                                If Day 1 is within <strong>14 days</strong>,
                                JVTO may require up to <strong>100%</strong>{" "}
                                full payment.
                              </li>
                              <li>
                                A booking is confirmed only after the required
                                payment is successfully processed and JVTO
                                issues your{" "}
                                <strong>
                                  Official E-Voucher / Invoice (PDF)
                                </strong>
                                .
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold">
                              Final payment (if applicable)
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                By card: no later than{" "}
                                <strong>5 days before Day 1</strong>.
                              </li>
                              <li>
                                By bank transfer / Wise: no later than{" "}
                                <strong>3 days before Day 1</strong>.
                              </li>
                              <li>
                                Cash at the JVTO office (IDR only): allowed only
                                if approved in writing in advance.
                              </li>
                            </ul>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 mb-2">
                              Bank transfer details (balance payments only)
                            </h4>
                            <p className="text-sm mb-2">
                              Use bank details only when instructed through
                              official channels.
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-yellow-600" />
                                <span>
                                  Bank BRI — PT Java Volcano Rendezvous —
                                  001301001779564 — SWIFT: BRINIDJAXXX
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-yellow-600" />
                                <span>
                                  Bank BCA — PT Java Volcano Rendezvous —
                                  1200944352 — SWIFT: CENAIDJAXXX
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-bold text-red-800 mb-2">
                              Payment security & anti-fraud
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>
                                Checkout is SSL-encrypted and processed via a
                                PCI DSS-compliant payment gateway.
                              </li>
                              <li>
                                JVTO does not store full card numbers, CVV
                                codes, or online banking passwords.
                              </li>
                              <li>
                                JVTO will never ask you for full card details,
                                CVV, or banking credentials via chat or email.
                                If you are unsure, verify via WhatsApp or email
                                before paying.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* 2.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.3
                          </span>
                          What's Included in the Tour Price
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Your Official E‑Voucher / Invoice (PDF) is the
                            binding reference for what is included in your
                            specific booking.
                          </p>
                          <p>
                            Depending on the package and what is written on your
                            voucher, inclusions may include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Private air‑conditioned transport with driver for
                              the confirmed itinerary.
                            </li>
                            <li>
                              Private 4WD jeep at Mount Bromo (when Bromo is
                              included).
                            </li>
                            <li>
                              Entrance tickets and permits for the sites listed
                              in the confirmed itinerary.
                            </li>
                            <li>
                              Accommodation and hotel breakfasts for the nights
                              listed (when accommodation is included).
                            </li>
                            <li>
                              Mount Ijen safety gear (gas mask, trekking poles)
                              and required health screening (when Ijen is
                              included).
                            </li>
                            <li>
                              Bottled mineral water during overland sectors.
                            </li>
                            <li>
                              Any additional meals, transfers, or extras only
                              when explicitly written as included on your
                              voucher.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 2.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.4
                          </span>
                          What's Not Included
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Unless clearly stated otherwise on your program, the
                            tour price does <strong>not</strong> include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>International or domestic flights</li>
                            <li>
                              Long-distance trains to/from East Java (unless
                              explicitly added)
                            </li>
                            <li>Visas or immigration fees</li>
                            <li>
                              Travel insurance (we strongly recommend you
                              purchase your own)
                            </li>
                            <li>
                              Personal expenses (snacks, drinks outside the
                              meals described, souvenirs, laundry, etc.)
                            </li>
                            <li>
                              Tips and gratuities for crew, guides, or hotel
                              staff
                            </li>
                            <li>
                              Optional activities not listed in the program
                            </li>
                            <li>
                              Medical treatment costs not related to the Ijen
                              health screening service
                            </li>
                          </ul>
                          <p>
                            If you are unsure whether a cost is included, please
                            ask us before you travel.
                          </p>
                        </div>
                      </div>

                      {/* 2.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.5
                          </span>
                          Travel Credit (No Cash Refund Policy)
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            JVTO uses a <strong>Travel Credit</strong> system
                            instead of cash refunds.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              If you cancel or change your tour under conditions
                              allowed by our policy, we issue{" "}
                              <strong>Travel Credit</strong> for the eligible
                              amount you already paid.
                            </li>
                            <li>
                              Travel Credit can be used for future private tours
                              with JVTO.
                            </li>
                            <li>
                              Travel Credit is <strong>non-expiring</strong> and
                              can be transferred to another traveler with your
                              written authorization.
                            </li>
                            <li>
                              We do not offer cash refunds, except where
                              required by applicable law.
                            </li>
                          </ul>
                          <p>
                            The exact conditions for Travel Credit (when it
                            applies, and how much) are defined in your full
                            Booking & Cancellation Policy.
                          </p>
                        </div>
                      </div>

                      {/* 2.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.6
                          </span>
                          Changes & Reschedules
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Where possible, JVTO may allow a date change for the
                            same package if requested 48 hours or more before
                            Day 1 (local Indonesia time).
                          </p>
                          <p>
                            All changes are subject to availability (vehicles,
                            hotels, guides) and any supplier cost differences.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Requests made less than 48 hours before Day 1 are
                              generally not permitted and may be treated as a
                              late cancellation.
                            </li>
                            <li>
                              Any approved change must be confirmed in writing
                              and reflected in an updated Official E‑Voucher /
                              Invoice (PDF).
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 2.7 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.7
                          </span>
                          Cancellations & No-Shows
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>If you decide to cancel:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Please inform us as soon as possible through our
                              official contact channels.
                            </li>
                            <li>
                              Any eligible amount is converted into{" "}
                              <strong>Travel Credit</strong> according to the
                              time of cancellation and the rules in our policy.
                            </li>
                            <li>
                              In some cases, late cancellations or no-shows may
                              result in reduced or zero Travel Credit if
                              suppliers have already been paid and cannot
                              refund.
                            </li>
                          </ul>

                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h4 className="font-bold text-amber-800 mb-2">
                              48-hour cut-off (local Indonesia time)
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                <span>
                                  If you cancel{" "}
                                  <strong>48 hours or more before Day 1</strong>
                                  : payments are{" "}
                                  <strong>not refundable in cash</strong>;{" "}
                                  <strong>
                                    100% converts to JVTO Travel Credit
                                  </strong>{" "}
                                  (issued in IDR, non-expiring, transferable
                                  with written confirmation).
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                                <span>
                                  If you cancel{" "}
                                  <strong>
                                    less than 48 hours before Day 1
                                  </strong>
                                  : the booking may be forfeited up to{" "}
                                  <strong>100%</strong>; Travel Credit and cash
                                  refunds are generally{" "}
                                  <strong>not provided</strong>.
                                </span>
                              </div>
                            </div>
                          </div>

                          <p>We will always:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Explain clearly which parts can be converted to
                              Travel Credit,
                            </li>
                            <li>
                              Provide written confirmation of any Travel Credit
                              issued.
                            </li>
                          </ul>
                          <p>
                            Full details:{" "}
                            <Link
                              href="/policy/booking-payment-cancellation/"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              /policy/booking-payment-cancellation/
                            </Link>
                          </p>
                        </div>
                      </div>

                      {/* 2.8 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.8
                          </span>
                          Changes Caused by Weather, Volcano Alerts, or Other
                          External Factors
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Some elements of your itinerary depend on local
                            conditions and official regulations (weather,
                            volcanic activity, closures, road conditions).
                          </p>
                          <p>
                            If a site is closed by authorities or conditions are
                            unsafe, JVTO will adjust the program where feasible
                            (change order, alternative stops, or timing
                            adjustments).
                          </p>
                          <p>
                            If a key part cannot operate, remedies follow the
                            Booking, Payment & Cancellation Policy (including
                            force majeure rules).
                          </p>
                        </div>
                      </div>

                      {/* 2.9 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.9
                          </span>
                          Your Responsibilities as a Guest
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            To keep the tour smooth and safe, we ask you to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Provide correct personal and contact information.
                            </li>
                            <li>
                              Inform us in advance of any{" "}
                              <strong>medical conditions</strong> that may be
                              relevant (especially for Ijen).
                            </li>
                            <li>
                              Read and follow our{" "}
                              <strong>Safety on Tours</strong> and{" "}
                              <strong>Packing & Fitness</strong> guidelines.
                            </li>
                            <li>
                              Use only our{" "}
                              <strong>official contact channels</strong>{" "}
                              (website, WhatsApp number, email) for payments and
                              changes.
                            </li>
                          </ul>
                          <p>
                            If you have any questions before you pay, please
                            ask. We prefer to explain everything clearly
                            upfront.
                          </p>
                        </div>
                      </div>

                      {/* 2.10 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.10
                          </span>
                          After Checkout: My Booking Portal
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            After payment success, you can access{" "}
                            <strong>My Booking Portal</strong> to manage your
                            confirmed booking.
                          </p>

                          <div>
                            <p className="font-bold">How to log in</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                Use the <strong>same email</strong> you entered
                                at checkout (Lead Traveler email).
                              </li>
                              <li>
                                The portal access method may use a secure
                                sign‑in link or verification code sent to your
                                email.
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold">
                              What you can see in My Booking Portal
                            </p>
                            <p>Your portal page may include:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Tour dates (Day 1 – End date)</li>
                              <li>Package / route summary</li>
                              <li>Pickup details (location, time, notes)</li>
                              <li>
                                Vehicle & crew assignment (when available)
                              </li>
                              <li>Accommodation plan (when included)</li>
                              <li>Daily itinerary overview</li>
                              <li>
                                Important notes (meeting points, what to bring,
                                health/safety reminders)
                              </li>
                              <li>
                                Your Official E‑Voucher / Invoice download link
                                (PDF)
                              </li>
                              <li>
                                A "To‑Do" section to submit missing required
                                details (guest list, pickup/drop-off, rooming,
                                dietary notes), if needed
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: FAQ */}
                <section
                  id="faq"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("faq")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <HelpCircle size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Frequently Asked Questions
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.faq ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.faq ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This FAQ covers the most common questions about private
                        tours with JVTO. For detailed rules, please check the
                        specific Travel Guide pages linked in each answer.
                      </p>
                      <p>
                        For binding terms, see{" "}
                        <Link
                          href="/policy/booking-payment-cancellation/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/booking-payment-cancellation/
                        </Link>
                        and{" "}
                        <Link
                          href="/policy/inclusions-exclusions/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/inclusions-exclusions/
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="space-y-4">
                      {faqData.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => toggleFaq(index)}
                          >
                            <span className="font-bold text-[#1a1a1a]">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`text-gray-400 transition-transform ${openFaqItems[index] ? "rotate-180" : ""}`}
                              size={20}
                            />
                          </div>
                          <div
                            className={`px-4 pb-4 pt-2 text-gray-600 ${openFaqItems[index] ? "block" : "hidden"}`}
                          >
                            {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 4: Ijen Health Screening */}
                <section
                  id="ijen"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("ijen")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Filter size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Ijen Health Screening — Real Checks, Digital Proof
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.ijen ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.ijen ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        Kawah Ijen is a demanding night hike with steep sections
                        and potential sulfur gas exposure. This section explains
                        health screening requirements for Ijen tours and what
                        guests need to prepare. For data handling related to
                        screening, see{" "}
                        <Link
                          href="/policy/privacy"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/privacy
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 4.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.1
                          </span>
                          Why Health Screening Is Necessary
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Health screening may be required by local
                            authorities or park/permit conditions for access to
                            certain Ijen areas.
                          </p>
                          <p>
                            Screening supports safer decisions for guests and
                            local teams.
                          </p>
                        </div>
                      </div>

                      {/* 4.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.2
                          </span>
                          What JVTO Includes for Its Guests
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            If your confirmed JVTO tour includes an Ijen night
                            hike, required health screening is arranged as part
                            of the Ijen segment (as written on your voucher).
                          </p>
                        </div>
                      </div>

                      {/* 4.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.3
                          </span>
                          Digital System & QR Verification
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Screening results are stored in a digital system
                            that allows:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              staff at checkpoints to <strong>verify</strong>{" "}
                              that a real screening was done,
                            </li>
                            <li>
                              less reliance on paper letters that can be forged,
                            </li>
                            <li>
                              clearer documentation for both guests and
                              authorities.
                            </li>
                          </ul>
                          <p>
                            JVTO supports this digital approach as part of a
                            wider effort to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>reduce fake certificates,</li>
                            <li>improve consistency of checks,</li>
                            <li>and keep more visitors within safe limits.</li>
                          </ul>
                        </div>
                      </div>

                      {/* 4.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.4
                          </span>
                          For Non-JVTO Travelers
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            The same digital system is also available to
                            travelers who are <strong>not</strong> touring with
                            JVTO, through participating clinics and hotels in
                            the Ijen area.
                          </p>
                          <p>
                            The goal is not to restrict competition, but to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>raise the overall standard of safety,</li>
                            <li>
                              make it harder for fake letters to circulate,
                            </li>
                            <li>
                              and give everyone clearer information about their
                              own condition.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 4.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.5
                          </span>
                          What Screening Does Not Do
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Health screening:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>helps reduce risk,</li>
                            <li>supports better decisions,</li>
                            <li>and provides documentation.</li>
                          </ul>
                          <p>
                            It does <strong>not</strong>:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>guarantee that nothing can go wrong,</li>
                            <li>
                              replace your own responsibility to disclose
                              medical conditions,
                            </li>
                            <li>replace the advice of your personal doctor.</li>
                          </ul>
                          <p>
                            Conditions on the mountain (gas, weather, crowding)
                            can still change. We may still decide to modify or
                            cancel the hike if we believe it is the safest
                            option for the group.
                          </p>
                        </div>
                      </div>

                      {/* 4.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.6
                          </span>
                          Data & Privacy (Short Summary)
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Health data collected during screening is:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              used only for safety and operational purposes
                              related to your Ijen hike,
                            </li>
                            <li>
                              shared only with parties who need to verify you
                              are fit to join,
                            </li>
                            <li>
                              handled according to our Privacy & Data Protection
                              Policy:{" "}
                              <Link
                                href="/policy/privacy"
                                className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                              >
                                /policy/privacy
                              </Link>
                              .
                            </li>
                          </ul>
                          <p>
                            For how we handle personal data related to permits
                            and health screening, see{" "}
                            <Link
                              href="/policy/privacy"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              /policy/privacy
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Safety on Tours */}
                <section
                  id="safety"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("safety")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Safety on Tours — How We Make Decisions
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.safety ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.safety ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This section explains how JVTO thinks about safety
                        across all tours — on the road, at viewpoints, on
                        trails, and around volcanoes.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 5.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.1
                          </span>
                          Responsibility & Roles
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              JVTO is a registered Indonesian travel company
                              specializing in private volcano tours.
                            </li>
                            <li>
                              JVTO operates under local regulations and works
                              with licensed partners and authorities where
                              required for safety and access.
                            </li>
                            <li>
                              Our crews (drivers and guides) are trained to
                              follow internal procedures and local regulations,
                              not just chase "the best photo".
                            </li>
                          </ul>
                          <p>On tour:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              The <strong>tour leader/guide</strong> and{" "}
                              <strong>driver</strong> are your first line of
                              support.
                            </li>
                            <li>
                              For larger groups, coordination may also involve
                              local authorities when needed.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 5.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.2
                          </span>
                          Before the Tour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Before your trip starts, we:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              check recent updates on road and park conditions,
                            </li>
                            <li>
                              review weather patterns and any official alerts,
                            </li>
                            <li>confirm hotel and transport availability,</li>
                            <li>
                              and align with local partners in key areas like
                              Bromo, Ijen, and Tumpak Sewu.
                            </li>
                          </ul>
                          <p>
                            For Ijen, health screening is a mandatory part of
                            preparation for those doing the night hike.
                          </p>
                        </div>
                      </div>

                      {/* 5.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.3
                          </span>
                          During the Tour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>During your tour, our crew:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              monitors conditions on the ground: weather, road
                              status, crowding, and local announcements,
                            </li>
                            <li>
                              communicates with other operators and local
                              contacts when necessary,
                            </li>
                            <li>
                              adjusts timings if there are delays or sudden
                              changes.
                            </li>
                          </ul>
                          <p>We may:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              leave earlier or later to avoid traffic or unsafe
                              crowding,
                            </li>
                            <li>
                              switch viewpoints if one area is too congested or
                              temporarily restricted,
                            </li>
                            <li>
                              choose safer walking paths at waterfalls or along
                              crater rims.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 5.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.4
                          </span>
                          When Plans Need to Change
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Sometimes, the safest decision is to change or
                            cancel part of the plan. Reasons can include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>heavy rain, strong winds, or dense fog,</li>
                            <li>volcanic gas levels or alerts,</li>
                            <li>road closures, landslides, or accidents,</li>
                            <li>local ceremonies or regulations.</li>
                          </ul>
                          <p>If we need to change plans:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>we will explain why,</li>
                            <li>
                              we will propose reasonable alternatives where
                              possible,
                            </li>
                            <li>
                              and we will apply our Travel Credit rules if key
                              elements cannot be operated.
                            </li>
                          </ul>
                          <p>
                            See:{" "}
                            <Link
                              href="/travel-guide#weather"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              Weather & Closures
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/travel-guide#booking"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              Booking Information
                            </Link>
                            .
                          </p>
                        </div>
                      </div>

                      {/* 5.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.5
                          </span>
                          Your Role as a Guest
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Safety works best when everyone plays their part. We
                            ask you to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Wear appropriate clothing and footwear (see{" "}
                              <Link
                                href="/travel-guide#packing"
                                className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                              >
                                Packing & Fitness
                              </Link>
                              ).
                            </li>
                            <li>
                              Follow instructions from guides and drivers,
                              especially in narrow, wet, or crowded areas.
                            </li>
                            <li>
                              Tell the crew immediately if you feel unwell,
                              dizzy, or anxious.
                            </li>
                            <li>
                              Be honest about your health and any conditions
                              that might affect the trip.
                            </li>
                          </ul>
                          <p>
                            If you feel something is unsafe, you can always ask
                            to slow down, stop, or skip an activity. There is no
                            pressure to "push through" discomfort.
                          </p>
                        </div>
                      </div>

                      {/* 5.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.6
                          </span>
                          Alcohol, Substances & Risky Behaviour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>For safety reasons:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Guests under the influence of alcohol or other
                              substances may be refused participation in certain
                              activities (especially hikes and steep trails).
                            </li>
                            <li>
                              Dangerous behaviour that puts yourself or others
                              at risk may result in parts of the tour being
                              modified or stopped.
                            </li>
                          </ul>
                          <p>
                            Our priority is that everyone finishes the trip
                            safely — guests, crew, and local communities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6: Packing & Fitness */}
                <section
                  id="packing"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("packing")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <Backpack size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Packing & Fitness — Bromo, Ijen & Tumpak Sewu
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.packing ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.packing ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This page helps you prepare realistically for your
                        private tour. We cover what to pack, how fit you should
                        be for each destination, and a few practical tips to
                        protect your belongings.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 6.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.1
                          </span>
                          General Clothing & Essentials
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            For all routes (Bromo, Ijen, waterfalls), we
                            recommend:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Light, quick-drying layers</li>
                            <li>
                              A warm jacket or fleece (for early mornings and
                              higher altitude)
                            </li>
                            <li>
                              Long trousers or leggings (more comfortable for
                              hiking than jeans)
                            </li>
                            <li>
                              Comfortable walking shoes with good grip (avoid
                              smooth soles)
                            </li>
                            <li>
                              A small daypack for water, snacks, and extra
                              layers
                            </li>
                            <li>
                              Sunscreen, sunglasses, and a hat for daytime
                            </li>
                            <li>
                              A light rain jacket or poncho (especially in the
                              rainy season)
                            </li>
                            <li>Personal medication you use regularly</li>
                          </ul>
                          <p>
                            Your main luggage stays in the car/hotel; you only
                            carry what you need for the activity.
                          </p>
                        </div>
                      </div>

                      {/* 6.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.2
                          </span>
                          Bromo — Packing & Fitness
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Packing</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Warm layers (early morning can feel near 5–10°C at
                              viewpoints).
                            </li>
                            <li>Hat, gloves, scarf or buff are helpful.</li>
                            <li>
                              Comfortable shoes; you may walk on sand and dust.
                            </li>
                          </ul>
                          <p className="font-bold">Fitness</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Bromo sunrise is suitable for most guests with
                              basic mobility.
                            </li>
                            <li>
                              You should be able to step in and out of the jeep,
                              walk short distances on uneven ground, and climb
                              modest stair sections if you choose to.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 6.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.3
                          </span>
                          Ijen — Packing & Fitness
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Packing</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Warm layers for the night (start can feel cold).
                            </li>
                            <li>
                              Long sleeves and trousers (for comfort and basic
                              protection).
                            </li>
                            <li>
                              Good hiking shoes with grip (the trail can be
                              dusty or slippery).
                            </li>
                            <li>
                              A light headlamp or torch (often provided, but
                              bring your own if you prefer).
                            </li>
                            <li>
                              Spare mask or scarf for general dust (this is not
                              a replacement for the gas mask we provide in the
                              crater area).
                            </li>
                          </ul>
                          <p className="font-bold">Fitness</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              The trail to the crater rim includes a sustained
                              uphill walk.
                            </li>
                            <li>
                              You should be able to walk uphill at a steady pace
                              for 1–2 hours with short breaks.
                            </li>
                            <li>
                              Guests with heart, lung, or circulation conditions
                              should consult a doctor in advance and be very
                              cautious.
                            </li>
                            <li>
                              Final permission to join the night hike depends on
                              the <strong>Ijen health screening</strong> results
                              and on-the-ground conditions.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 6.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.4
                          </span>
                          Tumpak Sewu — Packing & Fitness
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Packing</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Clothing and shoes that can get wet and muddy.
                            </li>
                            <li>
                              Sandals or water shoes with grip for river
                              sections.
                            </li>
                            <li>
                              A small towel and a change of clothes can be
                              useful.
                            </li>
                          </ul>
                          <p className="font-bold">Fitness</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              The trail can be steep, with sections of stairs,
                              rocks, and wet surfaces.
                            </li>
                            <li>
                              You should be comfortable with balance, descending
                              and ascending with support from ropes/handholds,
                              and walking on slippery ground.
                            </li>
                            <li>
                              This activity is not recommended for guests with
                              serious knee, ankle, or balance issues.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 6.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.5
                          </span>
                          Private Tour & Crew Support
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Because your tour is private, your JVTO crew (driver
                            and local guides) are focused on your group only:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              You can ask for extra stops for rest, toilets, or
                              minimarkets.
                            </li>
                            <li>
                              If you feel tired or unwell, tell the crew early —
                              they can slow the pace, offer alternatives, or
                              help you skip a section safely.
                            </li>
                          </ul>
                          <p>
                            Please do not hesitate to speak up; the crew is
                            there to support you, not to rush you.
                          </p>
                        </div>
                      </div>

                      {/* 6.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.6
                          </span>
                          Valuables & Jewellery
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            We recommend minimizing valuables on outdoor days:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Avoid wearing expensive jewellery or watches on
                              hikes and waterfall days.
                            </li>
                            <li>
                              Water, mud, and tight spaces make it easy for
                              items to be dropped, scratched, or lost.
                            </li>
                            <li>
                              Crowded areas are not ideal for showing valuables.
                            </li>
                          </ul>
                          <p>
                            If you bring valuables, keep them secured in your
                            main luggage or hotel safe whenever possible.
                          </p>
                        </div>
                      </div>

                      {/* 6.7 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.7
                          </span>
                          Special Note for Silver Items at Ijen
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>At Ijen, volcanic gases can tarnish silver:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Sulfur in the air can react with silver and cause
                              it to darken or change colour.
                            </li>
                            <li>
                              In some cases this is difficult or impossible to
                              fully reverse.
                            </li>
                          </ul>
                          <p>For this reason, we strongly recommend:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Do <strong>not</strong> wear silver jewellery
                              (rings, bracelets, necklaces, earrings) during the
                              Ijen activity.
                            </li>
                            <li>
                              Avoid taking silver-coated watches or accessories
                              close to the crater area.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 7: Weather & Closures */}
                <section
                  id="weather"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("weather")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <CloudSun size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Weather, Volcanic Activity & Closures
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.weather ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.weather ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        East Java's volcano and waterfall routes are dynamic.
                        Weather and volcanic activity can change quickly, and
                        local authorities may issue temporary restrictions or
                        closures. This section explains how we monitor
                        conditions and what happens to your tour when plans must
                        change.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 7.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.1
                          </span>
                          Weather Patterns on Our Routes
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Bromo & Ijen</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Main activities (Bromo sunrise, Ijen night hike)
                              typically happen between late night and early
                              morning.
                            </li>
                            <li>
                              In many seasons, heavier rain is more common later
                              in the day.
                            </li>
                            <li>
                              At higher viewpoints, conditions may be dry or
                              lightly drizzling while lower areas have heavier
                              rain.
                            </li>
                          </ul>
                          <p>
                            Weather is never fully predictable, but we plan
                            schedules to{" "}
                            <strong>
                              maximise the chance of safe and enjoyable
                              conditions
                            </strong>
                            .
                          </p>
                        </div>
                      </div>

                      {/* 7.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.2
                          </span>
                          Volcanic Activity & Official Alerts
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Our destinations are part of the{" "}
                            <strong>Ring of Fire</strong>. Low-level activity
                            (gas, tremors, minor events at volcanoes in the
                            region) can occur.
                          </p>
                          <p>For safety, we:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              refer to official Indonesian sources for volcanic
                              alert information,
                            </li>
                            <li>
                              follow restrictions and recommendations issued by
                              the relevant authorities,
                            </li>
                            <li>
                              and adjust activities when alert levels or local
                              regulations change.
                            </li>
                          </ul>
                          <p>
                            If authorities restrict access or close specific
                            areas, we will not attempt to bypass those rules.
                          </p>
                        </div>
                      </div>

                      {/* 7.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.3
                          </span>
                          Types of Changes You Might Experience
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Depending on conditions, we might need to:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              adjust <strong>timing</strong> (leave
                              earlier/later to avoid storms or congestion),
                            </li>
                            <li>
                              change <strong>viewpoints</strong> (alternative
                              sunrise spots or observation points),
                            </li>
                            <li>
                              modify <strong>walking routes</strong> (avoid
                              sections that are too slippery or crowded),
                            </li>
                            <li>
                              replace certain activities with safer alternatives
                              if a site is fully closed.
                            </li>
                          </ul>
                          <p>
                            Our crew will explain what is happening and why
                            adjustments are necessary.
                          </p>
                        </div>
                      </div>

                      {/* 7.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.4
                          </span>
                          If a Key Activity Cannot Run
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Sometimes, despite planning, a core activity may be
                            fully closed by authorities or unsafe to attempt.
                          </p>
                          <p>In those cases:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              We first look for reasonable alternatives within
                              safety limits.
                            </li>
                            <li>
                              If no meaningful alternative is possible, we apply
                              our <strong>Travel Credit</strong> policy for the
                              affected part of your program, as described in{" "}
                              <Link
                                href="/travel-guide#booking"
                                className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                              >
                                Booking Information
                              </Link>
                              .
                            </li>
                            <li>
                              We will always explain clearly which parts of the
                              tour are affected and how any Travel Credit is
                              calculated.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 7.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.5
                          </span>
                          Communication During Disruptions
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>When conditions change:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Your driver/guide will update you during the tour.
                            </li>
                            <li>
                              Our office remains reachable via official contact
                              channels for further clarification.
                            </li>
                            <li>
                              We encourage you to ask questions if you are
                              unsure about any decision.
                            </li>
                          </ul>
                          <p>
                            Our priority is to keep you informed and safe while
                            respecting local communities and regulations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 8: Police Escort */}
                <section
                  id="police"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("police")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <h2 className="md:text-xl text-lg font-bold text-[#1a1a1a]">
                          Police Escort for Tourist Groups in East Java
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.police ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.police ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        In some situations, large tourist groups may benefit
                        from official traffic police escort — when moving
                        several vehicles together through busy routes. This page
                        explains when and how JVTO can help coordinate{" "}
                        <strong>legal, documented</strong> escort services.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 8.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.1
                          </span>
                          When Escort May Be Considered
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Official traffic police escort may be relevant for:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>school or university groups,</li>
                            <li>incentive or corporate groups,</li>
                            <li>
                              other large groups traveling in multiple vehicles.
                            </li>
                          </ul>
                          <p>Typical segments include:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              connections from major road exits or meeting
                              points to partner accommodations,
                            </li>
                            <li>
                              specific routes agreed in advance with the traffic
                              police.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 8.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.2
                          </span>
                          How Escort Is Arranged
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            JVTO does <strong>not</strong> provide escort
                            vehicles ourselves. Instead:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              We submit a formal request to the competent{" "}
                              <strong>Traffic Police</strong> unit,
                            </li>
                            <li>
                              Escort is approved or declined according to
                              regulations, availability, and clear route
                              definitions,
                            </li>
                            <li>
                              When approved, the escort is carried out by{" "}
                              <strong>uniformed traffic police</strong> in
                              official vehicles, based on written orders.
                            </li>
                          </ul>
                          <p>
                            All arrangements are done transparently and in line
                            with Indonesian law.
                          </p>
                        </div>
                      </div>

                      {/* 8.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.3
                          </span>
                          What Escort Is Not
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Police escort:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              is <strong>not</strong> automatic for all tours,
                            </li>
                            <li>
                              is <strong>not</strong> a guarantee of special
                              treatment everywhere,
                            </li>
                            <li>
                              is <strong>not</strong> a tool to ignore speed
                              limits or basic road rules.
                            </li>
                          </ul>
                          <p>
                            Its purpose is safe and orderly convoy movement for
                            qualifying groups, not to bypass public safety.
                          </p>
                        </div>
                      </div>

                      {/* 8.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.4
                          </span>
                          Costs & Confirmation
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              If your group is eligible and escort is approved,
                              any related costs will be clearly listed in your
                              program and invoice.
                            </li>
                            <li>
                              No unofficial payments are requested from guests
                              on the road.
                            </li>
                            <li>
                              If escort is not available or not approved, we
                              will inform you and operate the tour using
                              standard safe convoy procedures.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 8.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.5
                          </span>
                          How to Request Escort Consideration
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            If you are planning a large group program and wish
                            to explore the possibility of official escort:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Inform us of your group size, vehicle count, and
                              route.
                            </li>
                            <li>
                              We will advise whether escort is realistic and
                              what information we need to submit a request.
                            </li>
                            <li>
                              Final decision always rests with the relevant
                              authorities.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelGuideContent;
