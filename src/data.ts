import { TourPackage, Review, KnowledgeChunk } from "./types";
import { tourPackagesData } from "./data_new";
import { reviewsData } from "./data/reviews_new";

export const reviews: Review[] = reviewsData.map((r, index) => {
  const ratingString = String(r.Rating || "0/5");
  const sourceString = r.Source || "";

  let platform: Review["platform"] = "google";
  if (sourceString.toLowerCase().includes("tripadvisor"))
    platform = "tripadvisor";
  if (sourceString.toLowerCase().includes("trustpilot"))
    platform = "trustpilot";
  if (sourceString.toLowerCase().includes("facebook")) platform = "facebook";

  return {
    id: index + 1,
    name: r.Reviewer_Name,
    location:
      sourceString.split("(")[1]?.replace(")", "").trim() || "Global Traveler",
    rating: parseInt(ratingString.split("/")[0], 10) || 5,
    text: r.Review_Text,
    platform: platform,
    avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(
      r.Reviewer_Name
    )}`,
    date: r.Review_Date,
    title: r.Review_Title,
    personnel: r.Key_Personnel_Mentioned,
  };
});

// FIX: Added 'galleryImages' data to be consumed by the Gallery component.
export const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600&auto=format&fit=crop",
    alt: "Mount Bromo sunrise view",
    location: "Mount Bromo",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1596643533596-81534130043c?q=80&w=600&auto=format&fit=crop",
    alt: "Ijen Crater turquoise lake",
    location: "Ijen Crater",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1608231387042-6a74535b1b2a?q=80&w=600&auto=format&fit=crop",
    alt: "Tumpak Sewu Waterfall cascade",
    location: "Tumpak Sewu",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1622329383383-7a9b89b4c0a5?q=80&w=600&auto=format&fit=crop",
    alt: "Madakaripura Waterfall canyon",
    location: "Madakaripura",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1555165936-1a5cd4c59858?q=80&w=600&auto=format&fit=crop",
    alt: "Jeep on the Sea of Sand at Bromo",
    location: "Sea of Sand, Bromo",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1621215423303-12a87a1d7c31?q=80&w=600&auto=format&fit=crop",
    alt: "Sulphur miner at Ijen Crater",
    location: "Ijen Crater",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1549638363-e38714de1e6e?q=80&w=600&auto=format&fit=crop",
    alt: "Viewpoint overlooking Mount Bromo caldera",
    location: "Penanjakan Viewpoint",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1596422846543-162d9f102773?q=80&w=600&auto=format&fit=crop",
    alt: "Colorful village of Jodipan, Malang",
    location: "Jodipan, Malang",
  },
  {
    id: 9,
    src: "https://storage.googleapis.com/aai-web-samples/pro-code/JVTO/mr-sam-tourist-selfie.jpg",
    alt: "Founder Mr. Sam with a happy tourist near Mount Bromo",
    location: "East Java",
  },
  {
    id: 10,
    src: "https://storage.googleapis.com/aai-web-samples/pro-code/JVTO/mr-sam-tourist-group.jpg",
    alt: "Founder Mr. Sam with guests at the JVTO office",
    location: "JVTO Office",
  },
];

export const tourPackages: TourPackage[] = tourPackagesData;

export const knowledgeBase: KnowledgeChunk[] = [
  // --- START OF ABOUT JVTO SECTION ---
  {
    id: "jvto-legal-status",
    category: "About JVTO",
    title: "JVTO Legal Status and Government Licensing",
    content: `Java Volcano Tour Operator (JVTO) is a fully legal and officially licensed tourism company.
* **Legal Entity:** PT Java Volcano Rendezvous (an Indonesian Limited Liability Company)
* **Business ID (NIB):** 1102230032918
* **Tourism License (TDUP):** 1102230032918 (Issued 11 February 2023)
* **Registered Office:** Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68214, Indonesia.`,
    tags: [
      "legal",
      "license",
      "registered",
      "TDUP",
      "PT Java Volcano Rendezvous",
      "legitimacy",
      "official",
      "company status",
      "government approved",
      "NIB",
    ],
  },
  {
    id: "jvto-office-and-contact",
    category: "About JVTO",
    title: "Physical Office and Official Contact Channels",
    content: `To protect you from fraud, JVTO recognizes **only** the following channels for bookings, payments, and official communication:
* **Website & Secure Checkout:** https://javavolcano-touroperator.com
* **WhatsApp:** +62 822-4478-8833
* **Email:** hello@javavolcano-touroperator.com
Our physical office is located at Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java.`,
    tags: [
      "office",
      "address",
      "location",
      "contact",
      "email",
      "whatsapp",
      "phone number",
      "google maps",
      "official channel",
    ],
  },
  {
    id: "jvto-the-difference",
    category: "About JVTO",
    title: "The JVTO Difference: Trust, Safety, and Quality",
    content: `What sets JVTO apart is our commitment to trust, safety, and quality.
- **Police-Led Safety Culture:** Founded by an on-duty tourism police officer in East Java (Operator-verified, last confirmed: October 2025), our safety standards are informed by real-world law enforcement experience.
- **Exclusively Private & All-Inclusive:** We only offer private tours. This means no hidden fees and a personalized experience with clear inclusions.
- **Legally Licensed & Accountable:** JVTO is a fully licensed Indonesian company with a physical office, ensuring full accountability.`,
    tags: [
      "why jvto",
      "jvto difference",
      "usp",
      "trust",
      "safety",
      "private tour",
      "all-inclusive",
      "founder",
      "police",
      "legal",
      "licensed",
    ],
  },
  // --- END OF ABOUT JVTO SECTION ---

  // Tour Packages & Features
  {
    id: "tour-type-and-private",
    category: "Tour Packages & Features",
    title: "Types of Tours Offered (Private, All-Inclusive)",
    content:
      'All JVTO tours are exclusively private, all-inclusive itineraries run specifically for your party. We do not operate open join-in group tours, and we do not sell standalone "transport-only" services as our core product. This ensures higher quality, safety, and a more personal experience.',
    tags: [
      "tours",
      "private",
      "all-inclusive",
      "shared tours",
      "tour type",
      "transport only",
    ],
  },
  {
    id: "tour-customization",
    category: "Tour Packages & Features",
    title: "Itinerary Customization Policy",
    content:
      "Our itineraries are integrated private services. Choosing to skip an attraction or leave an activity early does not reduce the tour package price. Major deviations from the confirmed route are not possible as logistics are locked in for your group.",
    tags: [
      "customization",
      "customize",
      "itinerary",
      "flexible",
      "changes",
      "adjustments",
      "skip",
    ],
  },
  {
    id: "special-services",
    category: "Tour Packages & Features",
    title: "Special Services and Requests",
    content:
      "Upon request, we can arrange for special services like professional photography, videographer services, or extra transfers. For large groups (18+), we can coordinate an official traffic police escort on specific routes, subject to approval by the relevant police unit. Drone usage by guests is permitted, but you must operate it safely.",
    tags: [
      "special services",
      "photographer",
      "videographer",
      "drone",
      "groups",
      "requests",
      "police escort",
    ],
  },

  // Payment & Booking
  {
    id: "how-to-book",
    category: "Payment & Booking",
    title: "Booking & Confirmation Process",
    content: `Booking is confirmed through a clear process:
* **Step 1: Select Tour & Pay Deposit:** Choose a tour on our website and pay a 20% deposit via our secure gateway. For bookings less than 14 days away, 100% payment may be required.
* **Step 2: Receive E-Voucher:** Upon payment, you will receive an Official E-Voucher. Your booking is only confirmed once this is issued.
* **Step 3: Submit Details:** At least 48 hours before Day 1, submit pickup details via the secure link provided.
* **Step 4: Pay Remaining Balance:** Settle the balance by the deadline.`,
    tags: [
      "book",
      "booking",
      "reservation",
      "website",
      "how to book",
      "checkout",
      "confirmation",
      "voucher",
      "pickup details",
    ],
  },
  {
    id: "payment-terms",
    category: "Payment & Booking",
    title: "Payment Terms and Deposit",
    content:
      "A **20% deposit** is required to secure your tour. For **bookings made less than 14 days before departure, 100% full payment** is required upfront. Missing a payment deadline can result in booking cancellation.",
    tags: [
      "payment",
      "terms",
      "deposit",
      "invoice",
      "balance",
      "due date",
      "upfront",
      "last-minute",
    ],
  },
  {
    id: "payment-methods",
    category: "Payment & Booking",
    title: "Accepted Payment Methods and Deadlines",
    content: `Deadlines for the final balance are strict:
* **Credit/Debit Card:** No later than **5 days before Day 1**.
* **Bank Transfer / Wise:** No later than **3 days before Day 1**.
* **Cash at JVTO office:** Only if explicitly pre-approved in writing.
Payments to non-official channels or personal accounts are at your own risk.`,
    tags: [
      "payment methods",
      "credit card",
      "debit card",
      "bank transfer",
      "wise",
      "cash",
      "deadline",
    ],
  },
  {
    id: "payment-security",
    category: "Payment & Booking",
    title: "Payment Information & Security",
    content:
      "All online card payments are processed via a secure, SSL-encrypted checkout. JVTO does not store full card numbers. **JVTO will never ask you to send full card numbers, CVV, or banking credentials via email or unsecured chat.**",
    tags: [
      "payment security",
      "secure",
      "ssl",
      "credit card",
      "scam",
      "fraud",
      "safe payment",
    ],
  },
  {
    id: "cancellation-policy",
    category: "Payment & Booking",
    title: "Cancellation and Refund Policy",
    content: `Our cancellation policy is based on a strict 48-hour window before Day 1 pickup time.
* **Cancel MORE than 48 hours before Day 1:** You receive **100% JVTO Travel Credit** for all payments made. This credit is non-expiring and transferable.
* **Cancel LESS than 48 hours before Day 1 (or no-show):** Your payment is **forfeited in full**. No Travel Credit is provided.
* **No cash refunds are ever issued.** Travel Credit is the only form of compensation for eligible cancellations.`,
    tags: [
      "cancellation",
      "refund",
      "policy",
      "cancel",
      "48 hours",
      "no-show",
      "travel credit",
      "forfeited",
    ],
  },
  {
    id: "rescheduling-policy",
    category: "Payment & Booking",
    title: "Rescheduling Policy",
    content: `* **Request MORE than 48 hours before Day 1:** You are allowed **one (1) free reschedule**, subject to availability.
* **Request LESS than 48 hours before Day 1:** Rescheduling is **not available**. Your request is treated as a late cancellation, and payment is forfeited.`,
    tags: [
      "reschedule",
      "rescheduling",
      "policy",
      "availability",
      "48 hours",
      "free",
      "change date",
    ],
  },

  // Logistics & Timing
  {
    id: "pickup-dropoff-locations",
    category: "Logistics & Timing",
    title: "Pick-up and Drop-off Locations",
    content:
      "We offer flexible pick-up and drop-off points, including Surabaya (airport, hotel, train station), Malang, and Bali-origin handovers. Drop-off can be at a different location than pickup.",
    tags: [
      "pickup",
      "dropoff",
      "start location",
      "end location",
      "surabaya",
      "malang",
      "bali",
      "ketapang",
    ],
  },

  // Inclusions & Exclusions
  {
    id: "inclusions-summary",
    category: "Inclusions & Exclusions",
    title: "Summary of Tour Inclusions",
    content:
      "Our all-inclusive private tours typically cover: private transport, accommodation with breakfast, all entrance fees & permits, Bromo 4WD Jeep, Ijen health screening, professional safety gear (gas mask, poles), bottled water, and a JVTO travel T-shirt.",
    tags: [
      "inclusions",
      "included",
      "all-inclusive",
      "what is included",
      "package",
      "gear",
      "ijen medical",
    ],
  },
  {
    id: "exclusions-summary",
    category: "Inclusions & Exclusions",
    title: "Summary of Tour Exclusions",
    content:
      "Unless explicitly listed, the following are excluded: flights, visas, travel insurance, meals not stated as included (e.g., lunches, dinners), tips, and personal expenses.",
    tags: [
      "exclusions",
      "not included",
      "extra cost",
      "optional",
      "add-ons",
      "personal expenses",
    ],
  },

  // Health, Safety & Packing
  {
    id: "safety-protocols",
    category: "Health, Safety & Packing",
    title: "JVTO Safety Record and Protocols",
    content:
      "Safety is our top priority. Guests must follow all instructions from JVTO crew and local authorities. Mandatory seatbelt use is required. JVTO may remove a traveler for behavior that creates a safety risk.",
    tags: ["safety", "safe", "solo traveler", "rules", "behavior"],
  },
  {
    id: "ijen-health-certificate",
    category: "Health, Safety & Packing",
    title: "Ijen Crater Health Certificate Requirement",
    content:
      "A medical certificate is **mandatory** to enter Mount Ijen, as enforced by local authorities. JVTO arranges this screening for you, and it is **included in the tour price**. A licensed medical professional performs the check. You must show your passport or valid ID.",
    tags: [
      "ijen",
      "health certificate",
      "medical check",
      "doctor",
      "requirement",
      "safety",
      "fee",
      "nurse",
    ],
  },
  {
    id: "ijen-health-contingency",
    category: "Health, Safety & Packing",
    title: "Contingency Plan if Unfit for Ijen Trek",
    content:
      "If the medical professional determines you are not fit to hike Ijen, you will not be permitted to enter for your own safety. The tour will continue, but there is **no partial cash refund or compensation** for the missed hike, as all costs were pre-committed.",
    tags: [
      "ijen",
      "health certificate",
      "unfit",
      "contingency",
      "medical",
      "safety",
      "refund policy",
    ],
  },
  {
    id: "travel-insurance",
    category: "Health, Safety & Packing",
    title: "Travel Insurance",
    content:
      "Travel insurance is **not included** but is highly recommended. JVTO is not responsible for costs you incur outside the tour itself.",
    tags: [
      "travel insurance",
      "insurance",
      "policy",
      "emergency",
      "medical",
      "optional",
    ],
  },
  {
    id: "force-majeure",
    category: "Health, Safety & Packing",
    title: "Changes due to Force Majeure / Safety",
    content:
      "If safety, regulations, or external events (e.g., volcanic activity, severe weather, park closures) require changes, JVTO may adjust itineraries. We aim to offer alternatives of equal or higher standard. Where significant components are cancelled by JVTO, we may offer alternatives, Travel Credit, or a partial refund (net of unrecoverable costs).",
    tags: [
      "force majeure",
      "volcano closure",
      "bad weather",
      "safety changes",
      "cancellation by jvto",
    ],
  },

  // Privacy & Data
  {
    id: "data-privacy-summary",
    category: "Privacy & Data",
    title: "Data Privacy and Usage",
    content:
      "JVTO collects only data reasonably required to operate tours, comply with regulations, and protect safety. This includes identification, contact details, booking details, and necessary health information. We apply technical and organizational safeguards to protect your data.",
    tags: ["privacy", "data protection", "personal data", "security"],
  },
  {
    id: "data-sale-policy",
    category: "Privacy & Data",
    title: "Data Sale to Third Parties",
    content: "JVTO does not sell personal data.",
    tags: ["sell data", "privacy", "third party", "personal data"],
  },

  // --- NEW KNOWLEDGE BASE FROM PROVIDED FILES ---
  {
    id: "kb-ijen-location",
    category: "Kawah Ijen",
    title: "Where is Kawah Ijen located?",
    content:
      "Kawah Ijen lies in East Java, Indonesia, between Banyuwangi and Bondowoso Regencies, at coordinates 8.058° S, 114.242° E.",
    tags: ["kawah ijen", "location", "geography", "coordinates"],
  },
  {
    id: "kb-ijen-fame",
    category: "Kawah Ijen",
    title: "What makes Kawah Ijen famous?",
    content:
      "It is globally known for its turquoise acidic crater lake and the rare “blue fire” phenomenon caused by burning sulfuric gas.",
    tags: ["kawah ijen", "famous", "blue fire", "acidic lake", "phenomenon"],
  },
  {
    id: "kb-ijen-altitude",
    category: "Kawah Ijen",
    title: "What is the altitude of Kawah Ijen?",
    content:
      "The summit reaches 2,799 meters, with the crater rim around 2,386 meters above sea level.",
    tags: ["kawah ijen", "altitude", "elevation", "height"],
  },
  {
    id: "kb-ijen-best-time",
    category: "Kawah Ijen",
    title: "When is the best time to visit Kawah Ijen?",
    content:
      "Between May and October during the dry season — clear skies, minimal fog, and the best visibility for blue fire and sunrise.",
    tags: ["kawah ijen", "best time", "season", "visit", "weather"],
  },
  {
    id: "kb-ijen-blue-fire-time",
    category: "Kawah Ijen",
    title: "What time can you see the blue fire?",
    content:
      "The blue fire is visible between 01:00–04:00 AM before sunrise when the temperature and wind are stable.",
    tags: ["kawah ijen", "blue fire", "time", "visibility"],
  },
  {
    id: "kb-ijen-trek-difficulty",
    category: "Kawah Ijen",
    title: "How difficult is the Ijen trek?",
    content:
      "Moderate (3/5). The round trip is about 6 km with ~530 m elevation gain.",
    tags: ["kawah ijen", "trek", "difficulty", "hiking", "fitness"],
  },
  {
    id: "kb-ijen-lake-safety",
    category: "Kawah Ijen",
    title: "Is the crater lake safe to touch?",
    content:
      "No. The lake has a pH of 0.2–0.5 and contains sulfuric acid; it can cause severe burns.",
    tags: ["kawah ijen", "lake", "safety", "acidic", "danger"],
  },
  {
    id: "kb-ijen-gas-mask",
    category: "Kawah Ijen",
    title: "Do you need a gas mask at Ijen?",
    content:
      "Yes, especially when descending toward the crater floor due to sulfur gas exposure.",
    tags: ["kawah ijen", "gas mask", "safety", "sulfur"],
  },
  {
    id: "kb-bromo-location",
    category: "Mount Bromo",
    title: "Where is Mount Bromo located?",
    content:
      "In the Bromo Tengger Semeru National Park, East Java, near Sukapura and Cemoro Lawang.",
    tags: ["mount bromo", "location", "geography"],
  },
  {
    id: "kb-bromo-fame",
    category: "Mount Bromo",
    title: "Why is Bromo famous?",
    content:
      "For its sunrise views over the Tengger Caldera and its active smoking crater.",
    tags: ["mount bromo", "famous", "sunrise", "crater", "caldera"],
  },
  {
    id: "kb-bromo-sunrise-viewpoint",
    category: "Mount Bromo",
    title: "What is the best sunrise viewpoint?",
    content: "Kingkong Hill (Bukit Kingkong) at 2,600 meters elevation.",
    tags: ["mount bromo", "sunrise", "viewpoint", "kingkong hill"],
  },
  {
    id: "kb-tumpak-sewu-location",
    category: "Tumpak Sewu",
    title: "Where is Tumpak Sewu located?",
    content: "On the border of Lumajang and Malang Regencies, East Java.",
    tags: ["tumpak sewu", "location", "geography"],
  },
  {
    id: "kb-tumpak-sewu-name",
    category: "Tumpak Sewu",
    title: "Why is it called “Tumpak Sewu”?",
    content:
      "The Javanese term means “a thousand waterfalls,” referring to its multi-stream cascade.",
    tags: ["tumpak sewu", "name", "meaning", "javanese"],
  },
  {
    id: "kb-tumpak-sewu-trek-difficulty",
    category: "Tumpak Sewu",
    title: "How hard is the trek to the base?",
    content:
      "Moderate to hard (3.5/5), involving ropes, bamboo ladders, and slippery rocks.",
    tags: ["tumpak sewu", "trek", "difficulty", "hiking", "fitness"],
  },
  {
    id: "kb-regional-overview",
    category: "Master Reference",
    subcategory: "Regional Overview",
    title: "Geographic Identity of East Java",
    content: `East Java forms the Volcanic–Maritime Arc of Indonesia, a zone where tectonic fire meets oceanic calm. It’s home to some of the planet’s most diverse landscapes within 400 km:
* Active stratovolcanoes (Semeru, Bromo, Ijen)
* Karst and marine formations (Papuma, Nusa Barong)
* Multi-tier waterfalls and canyons (Tumpak Sewu, Madakaripura)
The core philosophy is “Alam iku guru sejati” — Nature is the truest teacher.`,
    tags: ["east java", "overview", "geography", "volcanoes", "philosophy"],
  },
  {
    id: "kb-geological-continuum",
    category: "Master Reference",
    subcategory: "Geological Continuum",
    title: "The Fire Spine of East Java",
    content: `The volcanoes are linked:
* **Semeru (Mahameru):** The central magma conduit and highest point in Java.
* **Bromo–Tengger Caldera:** Semeru’s outflow basin, still active.
* **Ijen Caldera:** The eastern terminal, dominated by acidic lake and sulfur vents.
Semeru’s eruptions feed the Glidik River (creating Tumpak Sewu), whose sediments shape Papuma’s coastal cliffs, and whose tectonic belt links to Ijen’s geothermal system. A tour route follows the geological life cycle of Java: fire → water → ocean.`,
    tags: [
      "geology",
      "volcanoes",
      "semeru",
      "bromo",
      "ijen",
      "tumpak sewu",
      "tectonics",
    ],
  },
  {
    id: "kb-cultural-framework",
    category: "Master Reference",
    subcategory: "Cultural Framework",
    title: "Cultural and Spiritual Framework",
    content: `Each site manifests an element of the Javanese cosmological balance:
* **Fire (Api):** Represented by Ijen and Bromo, symbolizing power, creation, and purification.
* **Water (Banyu):** Represented by Tumpak Sewu and Madakaripura, symbolizing cleansing and renewal.
* **Ocean (Segara):** Represented by Papuma, symbolizing balance and unity where the cycle completes.`,
    tags: [
      "culture",
      "spiritual",
      "javanese",
      "cosmology",
      "philosophy",
      "elements",
    ],
  },
];
