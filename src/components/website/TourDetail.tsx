// PackageDetailPage.tsx
"use client";

import { useMemo, useState } from "react";
import { TourPackageDetail } from "@/interfaces";
import { useRouter } from "next/navigation";
// export const initialData = {
//   id: "SUB-3D2N-002",
//   type: "package",
//   version: "1.0.0",
//   meta: {
//     createdFrom: {
//       productFile:
//         "Product 3 Day Ijen, Bromo & Madakaripura Waterfall Discovery from Surabaya.json",
//       tripFile:
//         "Trip 3 Day Ijen, Bromo & Madakaripura Waterfall Discovery from Surabaya.json",
//     },
//   },
//   product: {
//     id: "SUB-3D2N-002",
//     slug: "3d2n-ijen-bromo-madakaripura-surabaya-surabaya",
//     name: "3 Day Ijen, Bromo & Madakaripura Waterfall Discovery from Surabaya",
//     shortLabel:
//       "3 Day Ijen, Bromo & Madakaripura Waterfall Discovery from Surabaya",
//     originCity: "Surabaya",
//     endCity: "Surabaya",
//     durationDays: 3,
//     durationNights: 2,
//     marketedDurationLabel: "3D2N",
//     route: ["Ijen Crater", "Mount Bromo", "Madakaripura Waterfall"],
//     tripRef: "/trips/trip-SUB-3D2N-002.json",
//     description:
//       "Embark on an exciting 3-day journey to explore two of Indonesia's most renowned volcanoes: Mount Bromo and Ijen Crater. This adventure is perfect for young explorers who love nature and want to witness breathtaking landscapes. The tour begins with a visit to Mount Ijen, where you'll trek to see the rare blue flames and the stunning turquoise crater lake at sunrise. Next, we head to Mount Bromo to experience the mesmerizing sunrise illuminating the vast caldera and surrounding peaks. The journey continues to the hidden gem of Madakaripura Waterfall, nestled within lush green cliffs, offering a refreshing and serene experience. Throughout the tour, you'll enjoy comfortable accommodations, private transportation, and the guidance of experienced English-speaking guides. This expedition is designed to provide a seamless and enriching exploration of Java's natural wonders, ensuring an unforgettable experience for all participants.",
//     keyExperiences: [
//       "Ijen Crater Hike",
//       "Bromo Sunrise Tour",
//       "Madakaripura Waterfall Tour",
//     ],
//     physicalDifficulty: "Moderate",
//     offers: {
//       currency: "IDR",
//       aggregateOffer: {
//         lowPrice: 2450000,
//         highPrice: 6300000,
//       },
//       tiers: [
//         {
//           sku: "SUB-3D2N-002-1",
//           paxMin: 11,
//           paxMax: 0,
//           pricePerPerson: 2450000,
//         },
//         {
//           sku: "SUB-3D2N-002-2",
//           paxMin: 8,
//           paxMax: 10,
//           pricePerPerson: 2550000,
//         },
//         {
//           sku: "SUB-3D2N-002-3",
//           paxMin: 6,
//           paxMax: 7,
//           pricePerPerson: 2850000,
//         },
//         {
//           sku: "SUB-3D2N-002-4",
//           paxMin: 4,
//           paxMax: 5,
//           pricePerPerson: 3050000,
//         },
//         {
//           sku: "SUB-3D2N-002-5",
//           paxMin: 3,
//           paxMax: 3,
//           pricePerPerson: 3275000,
//         },
//         {
//           sku: "SUB-3D2N-002-6",
//           paxMin: 2,
//           paxMax: 2,
//           pricePerPerson: 3570000,
//         },
//         {
//           sku: "SUB-3D2N-002-7",
//           paxMin: 1,
//           paxMax: 1,
//           pricePerPerson: 6300000,
//         },
//       ],
//     },
//     inclusions: [
//       "Private Transport: Air-conditioned private vehicles (MPV for 1-3 guests, Minibus for 4-11 guests) with a dedicated driver. This includes fuel, tolls, and parking fees.",
//       "Tour Guides: Experienced English-speaking guides. For 2-3 guests, a driver-guide. For 4+ guests, a separate local guide will be provided at each main destination (Bromo, Ijen, Madakaripura).",
//       "Mineral Water: Daily supply.",
//       "Complimentary Travel T-Shirt: One custom travel T-shirt per participant, with customizable designs/logos.",
//       "Full Assistance: From your arrival to your final drop-off.",
//       "Quality Hotel Accommodation: including daily breakfast.",
//       "All Entrance Fees & Permits: to attractions",
//       "Meals: As mention in the itinerary",
//       "Private 4WD Jeep: For the Mount Bromo sunrise tour.",
//       "Medical Check-up: Ijen authorities require a doctor's health certificate. This check-up will be conveniently arranged at your hotel in Bondowoso the evening before your trek. You only need your passport",
//       "Trekking Equipment: Gas masks and trekking poles for the Ijen Crater hike, and headlamps for the Ijen night hike. Helmets for Madakaripura Waterfall are provided by local management.",
//       "Ferry Tickets: From Ketapang Harbour to Bali (public ferry with air-conditioned cabins).",
//     ],
//     exclusions: [
//       "International/Domestic Air Tickets: To and from your tour's starting and ending points.",
//       "Indonesian VISA: (If applicable).",
//       "Travel Insurance: Optional but highly recommended for peace of mind, covering trip interruptions, medical emergencies, and lost luggage.",
//       "Meals Not Stated in Itinerary: Specific lunches and additional dinners are at your own expense.",
//       "Personal Expenses: Such as snacks, souvenirs, beverages, laundry, etc. It is recommended to carry at least IDR 500,000 per person for these.",
//       "Tips: For drivers and guides (at your discretion).",
//     ],
//     travelerRequirements: [
//       "Moderate fitness for night trek",
//       "Printed passport copy for Ijen permit",
//       "Warm clothing (5–15°C)",
//       "Sturdy hiking shoes and water shoes",
//       "Small daypack for essentials",
//       "Pre-hike health screening for Ijen trekking",
//     ],
//     addOns: [
//       {
//         name: "Horse Riding Fee",
//         description: "",
//         price: 200000,
//       },
//     ],
//     accommodationPlan: [
//       {
//         night: 1,
//         area: "Ijen Crater",
//         hotel: "Riverside Homestay",
//       },
//       {
//         night: 2,
//         area: "Mount Bromo",
//         hotel: "Joglo Kecombrang Bromo",
//       },
//     ],
//     gear: {
//       provided: ["Gas masks (Ijen)", "Headlamps", "Trekking poles", "Helmet"],
//       recommended: [
//         "Warm layers (5–15°C)",
//         "Sturdy hiking shoes & water shoes",
//         "Waterproof bag",
//         "Rain jacket",
//         "Beachwear",
//         "Sunscreen",
//         "Personal medications",
//       ],
//     },
//     itineraryDays: [
//       {
//         day: 1,
//         title:
//           "Towards the Ijen Plateau: Overland Travel from Surabaya to Bondowoso",
//         summary:
//           "This long journey is the perfect transition from the hustle and bustle of Surabaya to the tranquility of the mountains. After arriving and checking in, a medical professional will come to your hotel for a brief, comfortable health check. Afterward, enjoy a well-prepared dinner to conclude your day.",
//         activities: [
//           {
//             type: null,
//             name: null,
//             description:
//               "Pickup by our team at your location in Surabaya.",
//             location: null,
//             timeWindow: "11:00 AM",
//             durationMinutes: null,
//           },
//           {
//             type: null,
//             name: null,
//             description:
//               "Stop at a local restaurant for lunch (cost not included).",
//             location: null,
//             timeWindow: "1:30 PM",
//             durationMinutes: null,
//           },
//           {
//             type: null,
//             name: null,
//             description:
//               "Arrive in Bondowoso and check-in process at your hotel.",
//             location: null,
//             timeWindow: "5:00 PM",
//             durationMinutes: null,
//           },
//           {
//             type: null,
//             name: null,
//             description:
//               "A health check (MCU) will be conducted by medical personnel directly at your hotel. This is a quick procedure to check vital signs as a prerequisite for climbing Ijen.",
//             location: null,
//             timeWindow: "5:30 PM",
//             durationMinutes: null,
//           },
//           {
//             type: null,
//             name: null,
//             description:
//               "Dinner is served at the accommodation or a nearby restaurant (included).",
//             location: null,
//             timeWindow: "7:00 PM",
//             durationMinutes: null,
//           },
//         ],
//         mealsPlan: {
//           breakfast: "own expense",
//           lunch: "own expense",
//           dinner: "included",
//         },
//         mealsNotes: "",
//         overnight: "Bondowoso (Ijen Area)",
//       },
//       {
//         day: 2,
//         title: "From Two Peaks: Ijen Adventure Continues to Mount Bromo",
//         summary:
//           "After conquering Ijen, your adventure continues west. Enjoy our prepared lunch to refuel before embarking on the long overland journey to the majestic volcanic landscape of Bromo.",
//         activities: [
//           {
//             type: "TouristAttractionVisit",
//             name: "Ijen Tour Experience",
//             description: "Follow the entire Ijen tour series.",
//             location: "Ijen Crater",
//             timeWindow: "12:00 AM - 09:00 AM",
//             durationMinutes: 540,
//           },
//           {
//             type: "CheckOutAction",
//             name: "Ijen Hotel Check-out",
//             description: "Check-out from the Ijen area hotel.",
//             location: "Bondowoso City",
//             timeWindow: "11:00 AM",
//             durationMinutes: 10,
//           },
//           {
//             type: "TouristAttractionVisit",
//             name: "Lunch at Restaurant",
//             description: "Enjoy lunch at a local restaurant (included).",
//             location: "Local Restaurant",
//             timeWindow: "11:30 AM",
//             durationMinutes: 60,
//           },
//           {
//             type: "TravelAction",
//             name: "Journey to Bromo",
//             description:
//               "Start the journey to the Bromo area (about 5-6 hours).",
//             fromLocation: "Bondowoso City",
//             toLocation: "Bromo Area",
//             destination: "",
//             timeWindow: "12:30 PM",
//             durationMinutes: 210,
//           },
//           {
//             type: "CheckInAction",
//             name: "Bromo Hotel Check-in",
//             description: "Arrive in Bromo area, check-in hotel.",
//             location: "Hotel in Bromo Area",
//             timeWindow: "6:00 PM",
//             durationMinutes: 10,
//           },
//         ],
//         mealsPlan: {
//           breakfast: "included",
//           lunch: "included",
//           dinner: "own expense",
//         },
//         mealsNotes: "",
//         overnight: "Bromo Area",
//       },
//       {
//         day: 3,
//         title: "Two Icons in One Day: Bromo & Madakaripura, Back to Surabaya",
//         summary:
//           "A day that combines the majesty of Bromo with the splendor of Madakaripura. After enjoying the sunrise, the adventure continues with a refreshing trek through the canyon of the legendary Madakaripura Waterfall, before we return you to Surabaya.",
//         activities: [
//           {
//             type: "TouristAttractionVisit",
//             name: "Bromo Jeep Tour Experience",
//             description: "Starting the Bromo Jeep tour.",
//             location: "Mount Bromo",
//             timeWindow: "2:30 AM",
//             durationMinutes: 390,
//           },
//           {
//             type: "TouristAttractionVisit",
//             name: "Hotel Breakfast",
//             description: "Back to the hotel for breakfast.",
//             location: "Bromo Hotel",
//             timeWindow: "9:00 AM",
//             durationMinutes: 30,
//           },
//           {
//             type: "CheckOutAction",
//             name: "Bromo Hotel Check-out",
//             description: "Check-out, travel to Madakaripura.",
//             location: "Bromo Hotel",
//             timeWindow: "10:30 AM",
//             durationMinutes: 10,
//           },
//           {
//             type: "TouristAttractionVisit",
//             name: "Madakaripura Trekking",
//             description: "Arrive at Madakaripura and start trekking.",
//             location: "Madakaripura Waterfall",
//             timeWindow: "11:30 AM",
//             durationMinutes: 180,
//           },
//           {
//             type: "TouristAttractionVisit",
//             name: "Lunch After Trek (Own Expense)",
//             description: "After trekking, have lunch (fees not included).",
//             location: "Madakaripura Area",
//             timeWindow: "1:30 PM",
//             durationMinutes: 60,
//           },
//           {
//             type: "TravelAction",
//             name: "Transfer to Surabaya",
//             description: "Journey to Surabaya.",
//             fromLocation: "Madakaripura",
//             toLocation: "Surabaya",
//             destination: "",
//             timeWindow: "2:30 PM",
//             durationMinutes: 120,
//           },
//           {
//             type: "TravelAction",
//             name: "Arrival in Surabaya",
//             description: "Arrived in Surabaya.",
//             fromLocation: "",
//             toLocation: "",
//             destination: "Surabaya",
//             timeWindow: "6:00 PM",
//             durationMinutes: 0,
//           },
//         ],
//         mealsPlan: {
//           breakfast: "included",
//           lunch: "own expense",
//           dinner: "own expense",
//         },
//         mealsNotes: "",
//         overnight: null,
//       },
//     ],
//     gallery: [
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_0.jpg",
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_1.webp",
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_2.webp",
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_3.webp",
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_4.webp",
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_5.webp",
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_6.jpg",
//     ],
//     imageUrl:
//       "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_0.jpg",
//     tags: [
//       "3d2n",
//       "surabaya",
//       "ijen",
//       "bromo",
//       "madakaripura",
//       "east-java",
//       "volcano-tour",
//     ],
//     aggregateRating: {
//       ratingValue: 0,
//       reviewCount: 0,
//     },
//     marketing: {
//       perfectFor: [
//         "Active travelers",
//         "First-time Java visitors",
//         "Nature photographers",
//         "Adventure seekers",
//       ],
//       highlightsBullets: [
//         "Witness Ijen's electric-blue flames before sunrise",
//         "4WD to panoramic Bromo viewpoint then crater walk",
//         "Bonus stop at hidden Madakaripura waterfall",
//         "Private transportation and expert local guides",
//       ],
//       safetyPositioning:
//         "sanitized gas masks, health screening for Ijen, route decisions driven by safety, strong safety track record with professional guides and strict protocols",
//       uniqueSellingPoints: [
//         "Tourist Police support",
//         "Private 4WD experience",
//         "Health safety protocols",
//         "All-inclusive package",
//       ],
//     },
//     operationalComplexityNote:
//       "Midnight hikes for Ijen and Bromo (fatigue risk). Ensure Pre-hike health screening for Ijen; pre-book Bromo Jeep; manage long transfers (4-6 hours). Weather-dependent activities requiring contingency plans.",
//     provider: {
//       brand: "Java Volcano Tour Operator (JVTO)",
//       legalEntity: "PT Java Volcano Rendezvous",
//       nib: "1102230032918",
//       tdup: "1102230032918",
//       official: {
//         website: "https://javavolcano-touroperator.com",
//         whatsapp: "+62 822-4478-8833",
//         email: "info@javavolcano-touroperator.com",
//       },
//       policyRef: {
//         booking: "/policy/booking.json",
//         inclusions: "/policy/inclusions_exclusions.json",
//       },
//       policyVersion: "2025-11-09",
//     },
//     compliance: {
//       destinationsWhitelist: true,
//       itineraryTablesGenerated: true,
//       healthScreeningIncluded: true,
//       touristPoliceSupport: true,
//     },
//     channelMetadata: {
//       internalPackageId: "SUB-3D2N-002",
//       orderChannelEnabled: {
//         JVTO: true,
//         KLOOK: false,
//         TRAVELOKA: false,
//         TIKETCOM: false,
//         OTHERS: false,
//       },
//       externalPackageIds: {
//         klook: "",
//         traveloka: "",
//         tiketcom: "",
//       },
//       isFreesale: true,
//       requiresAvailabilityCheck: false,
//       supportedPickupCities: ["Surabaya"],
//       supportedDropoffCities: ["Surabaya"],
//       languageOffered: ["en"],
//       status: "active",
//       minLeadTimeHours: 24,
//       maxPaxRecommended: 11,
//       minPaxOperational: 2,
//     },
//     _cms: {
//       contentType: "tour-package",
//       version: "2.0",
//       created: "2025-01-15T00:00:00Z",
//       lastModified: "2025-01-15T00:00:00Z",
//       status: "published",
//       owner: "content-team",
//       i18nReady: true,
//       seoOptimized: true,
//       schemaType: "TouristTrip",
//     },
//   },
// };
interface Props {
  initialData: TourPackageDetail;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPriceForPax(pax: number, tiers: any[]) {
  if (!tiers || !tiers.length) return null;
  const tier = tiers.find((t) => {
    const minOk = pax >= t.paxMin;
    const maxOk = t.paxMax === 0 ? true : pax <= t.paxMax;
    return minOk && maxOk;
  });
  return tier ? tier.pricePerPerson : null;
}

export default function PackageDetailPage({ initialData }: Props) {
  const router = useRouter();

  const pkg = initialData.product;
  const [selectedImage, setSelectedImage] = useState(
    pkg.imageUrl || pkg.gallery[0]
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "details"
  >("overview");
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [startDate, setStartDate] = useState("");
  const [pax, setPax] = useState(2);

  const pricePerPerson = useMemo(
    () => getPriceForPax(pax, pkg.offers.tiers),
    [pax]
  );

  const total = pricePerPerson ? pricePerPerson * pax : 0;

  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [pendingBasePayload, setPendingBasePayload] = useState<any | null>(
    null
  );
  const [addOnSelections, setAddOnSelections] = useState(
    pkg.addOns?.map((a: any) => ({
      addOnId: a.name, // ganti ke ID asli jika nanti ada di data
      label: a.name,
      price: a.price,
      selected: false,
    })) ?? []
  );

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  const finalizeBooking = (
    basePayload: {
      packageId: string;
      date: string;
      pax: number;
      pricePerPerson: number | null;
      packageTotal: number;
    },
    addons: { addOnId: string; qty: number; price: number; subtotal: number }[]
  ) => {
    const addOnTotal = addons.reduce((sum, a) => sum + a.subtotal, 0);
    const discount = 0;
    const discountLabel = null;
    const grandTotal = basePayload.packageTotal + addOnTotal - discount;

    const payload = {
      ...basePayload,
      addon: addons,
      addOnTotal,
      discount,
      discountLabel,
      grandTotal,
    };
    localStorage.setItem("checkoutPayload", JSON.stringify(payload));

    // Redirect menggunakan Next.js router
    router.push("/checkout");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !pax || pax < pkg.channelMetadata.minPaxOperational) {
      alert("Please select a valid date and number of guests.");
      return;
    }

    const packageTotal = pricePerPerson ? pricePerPerson * pax : 0;

    const basePayload = {
      packageId: pkg.id,
      date: startDate,
      pax,
      pricePerPerson,
      packageTotal,
    };

    // Jika ada add-on, munculkan popup dulu
    if (pkg.addOns && pkg.addOns.length > 0) {
      setPendingBasePayload(basePayload);
      setShowAddOnModal(true);
      return;
    }

    // Jika tidak ada add-on, langsung kirim
    finalizeBooking(basePayload, []);
  };

  const handleConfirmAddOns = () => {
    if (!pendingBasePayload) return;

    const selectedAddOns = addOnSelections
      .filter((a) => a.selected)
      .map((a) => ({
        addOnId: a.addOnId,
        qty: pax, // qty otomatis = jumlah pax
        price: a.price,
        subtotal: pax * a.price,
      }));

    finalizeBooking(pendingBasePayload, selectedAddOns);
    setShowAddOnModal(false);
    setPendingBasePayload(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-20">
      <div className="mx-auto container px-4 pb-12 pt-6 lg:pt-10">
        {/* Breadcrumb + top meta */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {pkg.originCity} → {pkg.endCity}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
            {pkg.marketedDurationLabel} • {pkg.route.join(" • ")}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-600">
            Private Volcano Tour
          </span>
        </div>

        {/* Title + rating + hero price */}
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {pkg.name}
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Explore Ijen, Bromo and Madakaripura in one seamless, private
              adventure starting and ending in Surabaya.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="text-lg">🟧</span>
                <span>Physical: {pkg.physicalDifficulty}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="text-lg">🛡️</span>
                <span>Tourist Police Supported</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="text-lg">👥</span>
                <span>
                  Best for 2–{pkg.channelMetadata.maxPaxRecommended} guests
                </span>
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 p-[1px] shadow-lg">
            <div className="flex flex-col gap-2 rounded-2xl bg-white px-5 py-4 sm:px-6 sm:py-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                From
              </span>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold text-blue-700 sm:text-3xl">
                  {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
                </span>
                <span className="pb-1 text-xs text-slate-500">per person</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Based on larger groups. Final price updates with your group
                size.
              </span>
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-8">
          {/* Left: content */}
          <main className="space-y-6">
            {/* Gallery */}
            <section className="space-y-3">
              <div className="overflow-hidden rounded-3xl bg-slate-200 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt={pkg.name}
                  className="h-64 w-full object-cover sm:h-80 lg:h-96"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {pkg.gallery.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-2xl border transition hover:opacity-90 sm:h-20 sm:w-32 ${
                      selectedImage === img
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-slate-200"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* Tabs */}
            <section className="rounded-3xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur">
              <div className="flex gap-2 border-b border-slate-100 px-4 pt-3 sm:px-6">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "itinerary", label: "Itinerary" },
                  { id: "details", label: "Inclusions & Gear" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab.id as "overview" | "itinerary" | "details"
                      )
                    }
                    className={`relative rounded-t-xl px-3 py-2 text-xs font-medium transition sm:px-4 ${
                      activeTab === tab.id
                        ? "text-blue-700"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-orange-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-5 px-4 py-4 sm:px-6 sm:py-5">
                {activeTab === "overview" && (
                  <>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {pkg.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-blue-50/70 p-4">
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                          <span className="text-lg">✨</span>
                          Highlights
                        </h3>
                        <ul className="space-y-1.5 text-xs text-blue-900">
                          {pkg.marketing.highlightsBullets.map((h) => (
                            <li key={h} className="flex gap-2">
                              <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-orange-50/80 p-4">
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
                          <span className="text-lg">🎯</span>
                          Perfect For
                        </h3>
                        <ul className="space-y-1.5 text-xs text-orange-900">
                          {pkg.marketing.perfectFor.map((p) => (
                            <li key={p} className="flex gap-2">
                              <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Safety */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-start">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <span className="text-xl">🛡️</span>
                      </div>
                      <div>
                        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Safety First
                        </h3>
                        <p className="text-xs text-blue-900">
                          {pkg.marketing.safetyPositioning}.
                        </p>
                        <p className="mt-2 text-[11px] text-blue-900/70">
                          Operated by {pkg.provider.brand} (
                          {pkg.provider.legalEntity}). Tourist Police support
                          and pre-hike health screening for Ijen.
                        </p>
                      </div>
                    </div>

                    {/* Route tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {pkg.route.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          {r}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-3">
                    {pkg.itineraryDays.map((day) => {
                      const isOpen = openDay === day.day;
                      return (
                        <div
                          key={day.day}
                          className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenDay(isOpen ? null : day.day)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
                          >
                            <div>
                              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                <span className="inline-flex h-6 items-center rounded-full bg-blue-600/10 px-2 text-[11px] text-blue-700">
                                  Day {day.day}
                                </span>
                                <span className="hidden text-slate-400 sm:inline">
                                  •
                                </span>
                                <span className="hidden text-[11px] text-slate-500 sm:inline">
                                  {day.overnight || "Same-day"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs font-medium text-slate-800 sm:text-sm">
                                {day.title}
                              </p>
                            </div>
                            <span className="text-lg text-slate-400">
                              {isOpen ? "−" : "+"}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="space-y-3 border-t border-slate-100 bg-white px-4 py-4 text-xs text-slate-700 sm:px-5">
                              <p className="text-[13px] leading-relaxed">
                                {day.summary}
                              </p>
                              <div className="space-y-2">
                                {day.activities.map((act: any, idx: number) => (
                                  <div
                                    key={`${day.day}-${idx}`}
                                    className="flex gap-3 rounded-xl bg-slate-50 p-2.5"
                                  >
                                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[11px] font-semibold text-blue-700">
                                      {act.timeWindow?.split(" ")[0] || "•"}
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-[13px] font-medium text-slate-800">
                                        {act.name || act.description}
                                      </p>
                                      {act.location && (
                                        <p className="text-[11px] text-slate-500">
                                          📍 {act.location}
                                        </p>
                                      )}
                                      {act.description && act.name && (
                                        <p className="text-[11px] text-slate-600">
                                          {act.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                                <span className="rounded-full bg-slate-50 px-2.5 py-1">
                                  Breakfast: {day.mealsPlan.breakfast}
                                </span>
                                <span className="rounded-full bg-slate-50 px-2.5 py-1">
                                  Lunch: {day.mealsPlan.lunch}
                                </span>
                                <span className="rounded-full bg-slate-50 px-2.5 py-1">
                                  Dinner: {day.mealsPlan.dinner}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Inclusions / Exclusions */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        What's Included
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.inclusions.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                        What's Not Included
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.exclusions.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gear & Requirements */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Gear We Provide
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.gear.provided.map((g: string) => (
                          <li key={g} className="flex gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Recommended to Bring
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.gear.recommended.map((g: string) => (
                          <li key={g} className="flex gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                        Traveler Requirements
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.travelerRequirements.map((r: string) => (
                          <li key={r} className="flex gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Accommodation Plan
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.accommodationPlan.map((acc: any) => (
                          <li key={acc.night} className="flex gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                            <span>
                              Night {acc.night}: {acc.hotel} – {acc.area}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Right: booking card */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 p-[1px] shadow-xl">
              <div className="flex h-full flex-col gap-4 rounded-3xl bg-white px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Private 3D2N Package
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Tailored for your group size
                    </p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 px-3 py-2 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                      From
                    </p>
                    <p className="text-sm font-semibold text-blue-700">
                      {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
                    </p>
                    <p className="text-[10px] text-slate-500">per person</p>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Date */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="startDate"
                      className="flex items-center justify-between text-[11px] font-medium text-slate-700"
                    >
                      Start date from Surabaya
                      <span className="text-[10px] text-slate-400">
                        Min. {pkg.channelMetadata.minLeadTimeHours}h lead time
                      </span>
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      min={todayISO}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-0 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>

                  {/* Pax */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pax"
                      className="flex items-center justify-between text-[11px] font-medium text-slate-700"
                    >
                      Number of travelers
                      <span className="text-[10px] text-slate-400">
                        Min {pkg.channelMetadata.minPaxOperational} • Max{" "}
                        {pkg.channelMetadata.maxPaxRecommended} (recommended)
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="pax"
                        type="number"
                        min={pkg.channelMetadata.minPaxOperational}
                        max={pkg.channelMetadata.maxPaxRecommended}
                        value={pax}
                        onChange={(e) =>
                          setPax(
                            Math.max(
                              pkg.channelMetadata.minPaxOperational,
                              Math.min(
                                pkg.channelMetadata.maxPaxRecommended,
                                Number(e.target.value || 0)
                              )
                            )
                          )
                        }
                        className="w-24 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        required
                      />
                      <p className="text-[11px] text-slate-500">
                        Private vehicle & crew included.
                      </p>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="space-y-2 rounded-2xl bg-slate-50/80 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Price per person</span>
                      <span className="font-semibold text-slate-900">
                        {pricePerPerson
                          ? formatCurrency(pricePerPerson)
                          : "Will be confirmed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Travelers x {pax}</span>
                      <span className="font-semibold text-slate-900">
                        {pricePerPerson ? formatCurrency(total) : "—"}
                      </span>
                    </div>
                    {pkg.addOns?.length ? (
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Optional add-ons</span>
                        <span>
                          from {formatCurrency(pkg.addOns[0].price)} (e.g.{" "}
                          {pkg.addOns[0].name})
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-blue-200 active:scale-[0.99]"
                  >
                    Request this private trip
                    <span className="text-lg">→</span>
                  </button>

                  <p className="text-[10px] leading-relaxed text-slate-500">
                    No instant payment here yet. Submit your dates and group
                    size to receive a tailored quote and availability from{" "}
                    {pkg.provider.brand}. You can then confirm and pay securely.
                  </p>
                </form>

                {/* Small reassurance row */}
                <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600">
                    <span className="text-xs">🔒</span> Secure & private booking
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600">
                    <span className="text-xs">✅</span> Licensed Indonesian
                    operator
                  </span>
                </div>
              </div>
            </div>

            {/* Contact shortcuts */}
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <a
                href={`https://wa.me/${pkg.provider.official.whatsapp.replace(
                  /[^0-9]/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl border border-green-200 bg-green-50 px-3 py-2 font-medium text-green-700 transition hover:bg-green-100"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href={`mailto:${pkg.provider.official.email}`}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                ✉️ Email itinerary
              </a>
            </div>
          </aside>
        </div>
      </div>
      {showAddOnModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-900">
              Optional Add-ons
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Choose extra services for this trip. You can skip this step if you
              do not need any add-ons.
            </p>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
              {addOnSelections.map((item, idx) => (
                <div
                  key={item.addOnId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <div className="space-y-0.5 text-xs">
                    <p className="font-medium text-slate-900">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formatCurrency(item.price)} per person
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Qty will match your group size ({pax} travelers)
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAddOnSelections((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, selected: checked } : p
                          )
                        );
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Include</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="text-slate-600">
                <p className="font-medium">Add-on total</p>
                <p className="text-[11px] text-slate-500">
                  Based on selected add-ons × {pax} travelers
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(
                  addOnSelections.reduce(
                    (sum, a) =>
                      a.selected ? sum + pax * a.price : sum,
                    0
                  )
                )}
              </p>
            </div>


            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddOnModal(false);
                  setPendingBasePayload(null);
                }}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Skip add-ons
              </button>
              <button
                type="button"
                onClick={handleConfirmAddOns}
                className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-orange-400 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
              >
                Continue with selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
