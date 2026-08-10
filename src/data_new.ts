import { TourPackage } from "./types";

export const tourPackagesData: TourPackage[] = [
  {
    id: "package-SUB-1D1N-001",
    label: "1 Day Bromo Midnight Experience from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new4.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-mt.-bromo-1-day-tour-1692564153744/bromo11.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-mt.-bromo-1-day-tour-1692564153744/bromo12.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-mt.-bromo-1-day-tour-1692564153744/bromo13.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-mt.-bromo-1-day-tour-1692564153744/bromo21.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-mt.-bromo-1-day-tour-1692564153744/bromo7.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 1,
    durationNights: 1,
    route: ["mount-bromo"],
    description:
      "Experience the magic of Mount Bromo on this unforgettable one-day sunrise tour. Your adventure begins with a midnight pickup from Surabaya for a scenic 2-hour drive to Mount Bromo. Switch to a vintage 4WD Jeep for a thrilling ride to Kingkong Hill, where you'll witness the spectacular sunrise over the volcanic landscape with panoramic views of Mount Bromo, Mount Batok, and Mount Semeru. After sunrise, journey to the Bromo Crater to see sulfurous smoke rising from the depths, then visit the Whispering Sand before enjoying breakfast and returning to Surabaya around noon.",
    priceTiers: [
      { pax: 2, pricePerPerson: 1550000 },
      { pax: 3, pricePerPerson: 1400000 },
      { pax: 4, pricePerPerson: 1400000 },
      { pax: 5, pricePerPerson: 1250000 },
      { pax: 6, pricePerPerson: 1250000 },
      { pax: 7, pricePerPerson: 1250000 },
      { pax: 8, pricePerPerson: 1050000 },
      { pax: 9, pricePerPerson: 1050000 },
      { pax: 10, pricePerPerson: 1050000 },
      { pax: 11, pricePerPerson: 1000000 },
    ],
    itinerary: [],
    keyExperiences: ["Bromo Sunrise Tour"],
    physicality: "Moderate",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Mount Bromo)",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "1 breakfast at local restaurant",
      "Complimentary travel T-shirt",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding at Bromo)",
      "Hotel accommodation",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000-350,000 (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for stair climbing and sand walking",
      "Warm clothing (5-15°C for Bromo)",
      "Sturdy hiking shoes",
      "Small daypack for essentials",
      "Ability to handle midnight start and early morning activities",
    ],
    tags: [
      "1d1n",
      "surabaya",
      "bromo",
      "sunrise",
      "midnight-tour",
      "day-trip",
      "quick-getaway",
    ],
    slug: "1d1n-bromo-midnight-sunrise-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Time-constrained travelers",
      "Nature lovers",
      "Adventure seekers",
      "Photography enthusiasts",
      "Weekend explorers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Midnight pickup from Surabaya city hotels",
        },
      },
      latestPickupGuidance: "00:00",
      orientationTime: "00:15",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["hotel"],
      safeFlightNote: "Recommend flights after 14:00 on tour day",
      estimatedArrival: "12:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "No accommodation",
        hotelStandard: "Day trip only",
        examples: ["n/a"],
        checkinTime: "n/a",
        checkoutTime: "n/a",
      },
    ],
    gearProvided: [
      {
        item: "Headlamps",
        for: "mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: ["Warm layers (5-15°C)", "Waterproof jacket", "Beanie & gloves"],
      },
      {
        category: "Footwear",
        items: ["Sturdy hiking shoes", "Comfortable walking shoes"],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Dust mask",
          "Flashlight",
          "Sunscreen",
          "Personal medications",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya - Mt. Bromo - Surabaya",
        drivingTime: "4 hours total",
        activities: [
          {
            name: "Midnight Transfer to Bromo",
            fromLocation: "Surabaya",
            toLocation: "Cemoro Lawang",
            timeWindow: "00:00-02:00",
            duration: "2 hours",
            notes: "Scenic night drive to Bromo base",
          },
          {
            name: "Jeep to Kingkong Hill",
            fromLocation: "Cemoro Lawang",
            toLocation: "Kingkong Hill",
            timeWindow: "02:00-03:00",
            duration: "1 hour",
            notes: "Vintage 4WD Jeep transfer to sunrise viewpoint",
          },
          {
            name: "Sunrise Experience",
            timeWindow: "03:00-06:00",
            duration: "3 hours",
            notes:
              "Stargazing followed by spectacular sunrise over Bromo panorama",
            destinationName: "mount-bromo",
          },
        ],
        mealsPlan: { breakfast: "included", lunch: "n_a", dinner: "n_a" },
        mealsNotes:
          "Breakfast included at local restaurant after sunrise activities",
        overnight: "n_a",
        summary:
          "Midnight start from Surabaya for Bromo sunrise experience and return by noon",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Night driving experience",
          "Bromo route knowledge",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Bromo expertise",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: [
          "4WD certified",
          "Sunrise viewpoint knowledge",
          "Sand driving experience",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Kingkong Hill access",
          "Vintage Jeep experience",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Moderate fitness required for stair climbing (250 steps) and sand walking",
        "Ability to handle sleep deprivation and early morning cold",
      ],
      environmentalRisks: [
        "Cold 5-15°C at Bromo pre-sunrise",
        "Volcanic dust at sand sea",
        "Potential fog or poor visibility at sunrise",
      ],
      safetyMitigation: [
        "Experienced drivers for night journey",
        "Weather monitoring for sunrise conditions",
        "Headlamps provided for early morning activities",
        "Regular guest condition checks",
      ],
    },
    handoverNotes: [
      "Confirm midnight pickup timing with guests",
      "Coordinate Jeep transfer at Cemoro Lawang",
      "Monitor weather for sunrise visibility",
      "Ensure breakfast timing aligns with return schedule",
      "Confirm Surabaya dropoff preferences",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic in Probolinggo",
      weatherDisruption:
        "Alternative viewpoints considered, guest safety first",
      vehicleBreakdown:
        "Backup vehicle on standby, immediate response coordination",
    },
  },
  {
    id: "package-SUB-2D1N-002",
    label: "2 Day Bromo Sunrise Adventure from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new2.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo14.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo5.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo6.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo8.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo9.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 2,
    durationNights: 1,
    route: ["mount-bromo", "madakaripura-waterfall"],
    description:
      "Embark on an exhilarating 2-day journey exploring East Java's iconic volcanic landscapes. Start from Surabaya City and journey to the village of Cemoro Lawang, the gateway to Mount Bromo. Experience the magical Bromo Stargaze followed by a spectacular sunrise over the caldera, then visit the awe-inspiring Madakaripura Waterfall before returning to Surabaya. This short yet impactful journey offers the perfect blend of adventure and natural beauty, ideal for those wanting a quick but memorable escape into East Java's volcanic wonders.",
    priceTiers: [
      { pax: 2, pricePerPerson: 2800000 },
      { pax: 3, pricePerPerson: 2550000 },
      { pax: 4, pricePerPerson: 2350000 },
      { pax: 5, pricePerPerson: 2350000 },
      { pax: 6, pricePerPerson: 2150000 },
      { pax: 7, pricePerPerson: 2150000 },
      { pax: 8, pricePerPerson: 1950000 },
      { pax: 9, pricePerPerson: 1950000 },
      { pax: 10, pricePerPerson: 1950000 },
      { pax: 11, pricePerPerson: 1750000 },
    ],
    itinerary: [],
    keyExperiences: ["Bromo Sunrise Tour", "Madakaripura Waterfall Tour"],
    physicality: "Moderate",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "1 night accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Mount Bromo, Madakaripura Waterfall)",
      "Helmets for Madakaripura Waterfall",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "1 breakfast as per itinerary",
      "Complimentary travel T-shirt",
      "Local guide at Madakaripura Waterfall",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary (lunches and dinners)",
      "Personal expenses and tips",
      "Optional activities (horse riding at Bromo)",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000-350,000 (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for trekking and stair climbing",
      "Warm clothing (5-15°C for Bromo)",
      "Sturdy hiking shoes and water shoes for waterfall",
      "Small daypack for essentials",
      "Early morning wake-up capability",
    ],
    tags: [
      "2d1n",
      "surabaya",
      "bromo",
      "madakaripura",
      "sunrise",
      "waterfall",
      "short-trip",
    ],
    slug: "2d1n-bromo-madakaripura-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Adventure seekers",
      "Nature lovers",
      "Time-constrained travelers",
      "First-time Java visitors",
      "Photography enthusiasts",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "Surabaya Airport Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "15:00",
      orientationTime: "15:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 19:00 on final day",
      estimatedArrival: "16:00-18:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Traditional mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
    ],
    gearProvided: [
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        safetyStandard: "CE certified",
        issuingPoint: "Waterfall entrance",
      },
      {
        item: "Headlamps",
        for: "mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5-15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfall",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfall)",
          "Trekking sandals",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Dust mask for sand sea",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Journey to the Highlands - From Surabaya to Cemoro Lawang",
        drivingTime: "3-4 hours",
        activities: [
          {
            name: "Surabaya to Bromo Transfer",
            fromLocation: "Surabaya",
            toLocation: "Cemoro Lawang",
            timeWindow: "15:00-19:00",
            duration: "3-4 hours",
            notes:
              "Scenic drive through East Java countryside with lunch stop option in Probolinggo",
          },
          {
            name: "Hotel Check-in Bromo",
            timeWindow: "19:00-20:00",
            notes: "Briefing about next day's early morning Bromo adventure",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense, lunch available en route",
        overnight: "Cemoro Lawang",
        summary:
          "Transfer from Surabaya to Bromo highlands with hotel check-in",
      },
      {
        day: 2,
        title:
          "The Magic of Bromo - Stargazing, Sunrise, and Madakaripura Waterfall",
        drivingTime: "5-6 hours total",
        activities: [
          {
            name: "Bromo Sunrise Jeep Transfer",
            fromLocation: "Bromo Hotel",
            toLocation: "Bromo Viewpoint",
            timeWindow: "02:00-03:00",
            duration: "1 hour",
            notes: "Early morning Jeep ride to sunrise viewpoint",
          },
          {
            name: "Bromo Stargazing and Sunrise",
            timeWindow: "03:00-07:00",
            duration: "4 hours",
            notes:
              "Milky Way viewing followed by sunrise spectacle over volcanic landscape",
            destinationName: "mount-bromo",
          },
          {
            name: "Bromo Crater Exploration",
            timeWindow: "07:00-09:00",
            duration: "2 hours",
            notes:
              "Sand sea crossing, visit Poten temple, climb 253 steps to crater rim",
            destinationName: "mount-bromo",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "n_a",
        },
        mealsNotes:
          "Breakfast at hotel after sunrise tour, lunch during travel to waterfall",
        overnight: "n_a",
        summary:
          "Bromo sunrise experience followed by Madakaripura Waterfall visit and return to Surabaya",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Bromo route knowledge",
          "Mountain driving experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Bromo expertise",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: [
          "4WD certified",
          "Sand driving experience",
          "Sunrise viewpoint knowledge",
        ],
      },
      {
        role: "Madakaripura Local Guide",
        scope: "Madakaripura segment only",
        requirements: [
          "Waterfall safety certified",
          "River crossing expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand sea crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Moderate fitness required for stair climbing and trekking",
        "No respiratory restrictions (unlike Ijen)",
      ],
      environmentalRisks: [
        "Cold 5-15°C at Bromo pre-sunrise",
        "Slippery rocks and strong water flow at Madakaripura",
        "Volcanic dust at Bromo sand sea",
      ],
      safetyMitigation: [
        "Helmets provided at Madakaripura Waterfall",
        "Local guides at challenging sections",
        "Weather monitoring for waterfall safety",
        "Experienced Jeep drivers for sand terrain",
      ],
    },
    handoverNotes: [
      "Confirm Surabaya pickup timing for Day 1 afternoon departure",
      "Arrange early morning wake-up call for 2:00 AM Bromo departure",
      "Coordinate Jeep transfer timing for sunrise viewing",
      "Monitor weather conditions for waterfall accessibility",
      "Confirm Surabaya dropoff preferences on final day",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic in Probolinggo or Surabaya",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first, may modify waterfall visit in heavy rain",
      vehicleBreakdown: "Backup vehicle on standby, max 2-hour response time",
    },
  },
  {
    id: "package-SUB-2D1N-001",
    label: "2 Day Ijen Blue Fire Expedition from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen12.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen13.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen14.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen15.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen16.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen6.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 2,
    durationNights: 1,
    route: ["mount-ijen"],
    description:
      "Embark on an exciting 2-day journey through East Java's beautiful landscapes and cultural highlights. Start your adventure from Surabaya City, journeying to Bondowoso, where the scenic beauty sets the tone for a memorable experience. Explore the magnificent Ijen Crater, known for its mesmerizing blue flames and breathtaking turquoise crater lake, before returning to Surabaya. This itinerary is crafted for those seeking a compact yet immersive adventure into East Java's natural beauty, featuring the world-famous blue fire phenomenon and stunning volcanic landscapes.",
    priceTiers: [
      { pax: 2, pricePerPerson: 2300000 },
      { pax: 3, pricePerPerson: 2200000 },
      { pax: 4, pricePerPerson: 2050000 },
      { pax: 5, pricePerPerson: 2050000 },
      { pax: 6, pricePerPerson: 1850000 },
      { pax: 7, pricePerPerson: 1850000 },
      { pax: 8, pricePerPerson: 1650000 },
      { pax: 9, pricePerPerson: 1650000 },
      { pax: 10, pricePerPerson: 1650000 },
      { pax: 11, pricePerPerson: 1550000 },
    ],
    itinerary: [],
    keyExperiences: ["Ijen Crater Hike"],
    physicality: "Moderate",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "1 night accommodation with daily breakfast",
      "All entrance fees & permits (Mount Ijen)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Trekking poles for Ijen hike",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "1 breakfast, 1 lunch, 2 dinners as per itinerary",
      "Complimentary travel T-shirt",
      "Medical check-up for Ijen permit",
      "Malabar Coffee Plantation visit",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (Ijen trolley ojek)",
    ],
    addOns: [
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the Ijen trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for steep 1.5-2 hour trek",
      "Printed passport copy for Ijen permit processing",
      "Warm clothing (5-15°C for Ijen)",
      "Sturdy hiking shoes",
      "Small daypack for essentials",
      "Medical check-up mandatory for Ijen trek",
      "No respiratory conditions (due to sulfur exposure)",
    ],
    tags: [
      "2d1n",
      "surabaya",
      "ijen",
      "blue-fire",
      "crater-lake",
      "volcano",
      "adventure",
    ],
    slug: "2d1n-ijen-blue-fire-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Adventure seekers",
      "Nature lovers",
      "Photography enthusiasts",
      "Geology enthusiasts",
      "Active travelers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "Surabaya Airport Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels before 12:00 PM",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "12:00",
      orientationTime: "12:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 20:00 on final day",
      estimatedArrival: "17:00-18:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "Nature retreat homestay",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen",
        batteryCheck: "Pre-trek verification",
      },
      { item: "Trekking poles", for: "mount-ijen", adjustable: true },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: ["Warm layers (5-15°C)", "Waterproof jacket", "Beanie & gloves"],
      },
      {
        category: "Footwear",
        items: ["Sturdy hiking shoes", "Comfortable walking shoes"],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Flashlight",
          "Sunscreen",
          "Personal medications",
          "Dust mask",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Journey Begins - From Surabaya to Bondowoso",
        drivingTime: "5 hours",
        activities: [
          {
            name: "Surabaya to Bondowoso Transfer",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00-17:00",
            duration: "5 hours",
            notes:
              "Scenic drive through East Java countryside with lunch stop in Probolinggo",
          },
          {
            name: "Hotel Check-in and Medical Screening",
            timeWindow: "17:00-18:00",
            notes:
              "Medical check-up for Ijen permit and briefing about next day's trek",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Dinner included at Bondowoso hotel",
        overnight: "Bondowoso",
        summary:
          "Transfer from Surabaya to Bondowoso with hotel check-in and medical screening",
      },
      {
        day: 2,
        title: "Witness the Blue Flames - From Ijen Crater to Surabaya",
        drivingTime: "6-7 hours total",
        activities: [
          {
            name: "Transfer to Ijen Base",
            fromLocation: "Bondowoso",
            toLocation: "Paltuding",
            timeWindow: "00:00-02:00",
            duration: "2 hours",
            notes: "Midnight drive to Ijen trailhead",
          },
          {
            name: "Ijen Blue Fire Trek",
            timeWindow: "02:00-06:00",
            duration: "4 hours",
            notes:
              "Night trek to witness blue flames and sunrise over turquoise crater lake",
            destinationName: "mount-ijen",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "included",
        },
        mealsNotes: "All meals included - breakfast box, lunch, dinner",
        overnight: "n_a",
        summary:
          "Early morning Ijen Crater trek for blue flames and sunrise, then return to Surabaya",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Surabaya-Bondowoso route knowledge",
          "Night driving experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Ijen expertise",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur mining knowledge",
          "Emergency response training",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: [],
      jeepSpecs: null,
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check at Bondowoso hotel",
        "Respiratory condition screening - not suitable for asthma or heart conditions",
      ],
      environmentalRisks: [
        "Sulfur gas exposure at Ijen crater",
        "Cold 5-15°C during night trek",
        "Steep and rocky terrain with potential slippery conditions",
        "Limited visibility during night trek",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for all guests",
        "Headlamps for night trek visibility",
        "Local Ijen guides with emergency training",
        "Regular guest condition checks during trek",
        "Weather and gas level monitoring",
      ],
    },
    handoverNotes: [
      "Arrange medical screening at Bondowoso hotel upon arrival",
      "Distribute gas masks and headlamps at Paltuding with safety briefing",
      "Monitor sulfur gas levels and guest conditions during Ijen trek",
      "Check guest condition post-trek before continuing journey",
      "Confirm Surabaya dropoff preferences on final day",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic in Bondowoso or Banyuwangi",
      weatherDisruption:
        "Alternative timing considered, guest safety first, gas level monitoring",
      vehicleBreakdown:
        "Backup vehicle on standby, max 3-hour response time in remote areas",
    },
  },
  {
    id: "package-BALI-3D2N-001",
    label: "3 Day Bromo & Ijen Volcano Discovery from Bali",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/00000IMG_00000_BURST20230827072437106_COVER1.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/IMG202308070559221.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/IMG_20230416_0602291.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/IMG_24951.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/IMG_78191.webp",
    ],
    originCity: "bali",
    endCity: "bali",
    durationDays: 3,
    durationNights: 2,
    route: ["mount-bromo", "madakaripura-waterfall", "mount-ijen"],
    description:
      "Explore the stunning volcanoes of East Java on this 3-day adventure from Bali. Begin your journey with a scenic transfer from Bali to the Bromo area, where you'll enjoy a relaxing evening. Experience a thrilling sunrise at Mount Bromo with majestic views of Mount Batok, Mount Bromo, and Gunung Semeru. Take an exciting 4WD ride across the volcanic sand sea and explore the active crater. Visit the magnificent Madakaripura Waterfall before continuing to Bondowoso. On the final day, witness the magical blue fire of Ijen Crater during a sunrise trek, marvel at the turquoise sulfuric lake, and observe the hard-working sulfur miners before returning to Bali.",
    priceTiers: [
      { pax: 2, pricePerPerson: 4050000 },
      { pax: 3, pricePerPerson: 3800000 },
      { pax: 4, pricePerPerson: 3550000 },
      { pax: 5, pricePerPerson: 3550000 },
      { pax: 6, pricePerPerson: 3350000 },
      { pax: 7, pricePerPerson: 3350000 },
      { pax: 8, pricePerPerson: 3050000 },
      { pax: 9, pricePerPerson: 3050000 },
      { pax: 10, pricePerPerson: 3050000 },
      { pax: 11, pricePerPerson: 2850000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Bromo Sunrise Tour",
      "Madakaripura Waterfall Tour",
      "Ijen Crater Hike",
    ],
    physicality: "Moderate to Challenging",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "2 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Mount Bromo, Madakaripura Waterfall, Mount Ijen)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Trekking poles for Ijen hike",
      "Helmets for Madakaripura Waterfall",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "2 breakfasts, 1 dinner as per itinerary",
      "Complimentary travel T-shirt",
      "Medical check-up for Ijen permit",
      "Ferry tickets (Bali-Java-Bali) with air-conditioned cabins",
      "Arabica coffee break at Ijen",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary (lunches and some dinners)",
      "Personal expenses and tips",
      "Optional activities (horse riding at Bromo, Ijen trolley ojek)",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000-350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the Ijen trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Good physical fitness for challenging treks",
      "Printed passport copy for Ijen permit processing",
      "Warm clothing (5-15°C for Bromo/Ijen)",
      "Sturdy hiking shoes and water shoes for waterfall",
      "Small daypack for essentials",
      "Medical check-up mandatory for Ijen trek",
      "No respiratory conditions (due to sulfur exposure)",
    ],
    tags: [
      "3d2n",
      "bali",
      "bromo",
      "ijen",
      "blue-fire",
      "madakaripura",
      "volcano",
      "adventure",
      "cross-island",
    ],
    slug: "3d2n-bromo-ijen-discovery-from-bali",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: true,
    recommendedFor: [
      "Adventure seekers",
      "Nature lovers",
      "Volcano enthusiasts",
      "Photography enthusiasts",
      "Active travelers",
    ],
    start: {
      city: "bali",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint:
            "I Gusti Ngurah Rai International Airport (DPS) Arrival Gate",
          notes: "Ideal pickup before 9:00 AM",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Bali hotels in main tourist areas",
        },
      },
      latestPickupGuidance: "09:00",
      orientationTime: "09:30",
    },
    end: {
      city: "bali",
      dropoffOptions: ["airport", "hotel"],
      safeFlightNote: "Recommend flights after 17:00 on final day",
      estimatedArrival: "14:00-15:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Traditional mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 2,
        area: "Bondowoso/Ijen",
        hotelStandard: "Nature retreat homestay",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      { item: "Trekking poles", for: "mount-ijen", adjustable: true },
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        safetyStandard: "CE certified",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5-15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfall",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfall)",
          "Comfortable walking shoes",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Flashlight",
          "Sunscreen",
          "Personal medications",
          "Dust mask",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Bali to East Java - Arrival & Transfer to Cemoro Lawang",
        drivingTime: "8-9 hours total",
        activities: [
          {
            name: "Bali to Java Transfer",
            fromLocation: "Bali",
            toLocation: "Cemoro Lawang",
            timeWindow: "08:00-17:00",
            duration: "8-9 hours",
            notes:
              "Includes ferry crossing with potential views of Mount Agung and Mount Raung",
          },
          {
            name: "Hotel Check-in Bromo",
            timeWindow: "17:00-18:00",
            notes: "Briefing about next day's Bromo sunrise adventure",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense during travel",
        overnight: "Cemoro Lawang",
        summary:
          "Cross-island transfer from Bali to Java with ferry crossing and arrival at Bromo area",
      },
      {
        day: 2,
        title: "The Majesty of Bromo & Sunrise Adventure",
        drivingTime: "6-7 hours total",
        activities: [
          {
            name: "Bromo Sunrise Experience",
            timeWindow: "03:30-09:00",
            duration: "5.5 hours",
            notes:
              "Stargazing, sunrise viewing, sand sea Jeep tour, and crater exploration",
            destinationName: "mount-bromo",
          },
          {
            name: "Madakaripura Waterfall",
            timeWindow: "13:30-15:00",
            duration: "1.5 hours",
            notes:
              "Trek to Java's highest waterfall through canyon and streams",
            destinationName: "madakaripura-waterfall",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Breakfast and dinner included, lunch during travel",
        overnight: "Bondowoso",
        summary:
          "Bromo sunrise experience followed by Madakaripura Waterfall visit and transfer to Bondowoso",
      },
      {
        day: 3,
        title: "The Blue Fire of Ijen & Return to Bali",
        drivingTime: "7-8 hours total",
        activities: [
          {
            name: "Ijen Blue Fire Trek",
            timeWindow: "02:00-08:00",
            duration: "6 hours",
            notes:
              "Night trek to witness blue flames, sunrise over turquoise lake, and sulfur mining observation",
            destinationName: "mount-ijen",
          },
          {
            name: "Return to Bali",
            fromLocation: "Ijen",
            toLocation: "Bali",
            timeWindow: "09:00-14:00",
            duration: "5 hours",
            notes: "Includes ferry crossing back to Bali",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "n_a",
        },
        mealsNotes:
          "Breakfast included with coffee break, lunch during travel to Bali",
        overnight: "n_a",
        summary:
          "Ijen Crater blue fire trek followed by return to Bali via ferry",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Bali-Java route knowledge",
          "Ferry crossing experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: [
          "4WD certified",
          "Sunrise viewpoint knowledge",
          "Sand driving experience",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur mining knowledge",
          "Emergency response training",
        ],
      },
      {
        role: "Madakaripura Local Guide",
        scope: "Madakaripura segment only",
        requirements: [
          "Waterfall safety certified",
          "River crossing expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand sea crossing",
        ],
      },
      ferryIncluded: true,
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check at Bondowoso hotel",
        "Respiratory condition screening - not suitable for asthma or heart conditions",
        "Good physical fitness required for challenging treks",
      ],
      environmentalRisks: [
        "Sulfur gas exposure at Ijen crater",
        "Cold 5-15°C at Bromo and Ijen pre-sunrise",
        "Steep and rocky terrain at Ijen with potential slippery conditions",
        "Slippery rocks and strong water flow at Madakaripura",
        "Volcanic dust at Bromo sand sea",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for all guests at Ijen",
        "Headlamps for night treks at both Bromo and Ijen",
        "Helmets provided at waterfall",
        "Local guides with specialized training at each location",
        "Regular guest condition checks during challenging activities",
        "Weather and gas level monitoring",
      ],
    },
    handoverNotes: [
      "Coordinate Bali pickup timing for ferry schedule",
      "Arrange medical screening at Bondowoso hotel upon arrival",
      "Monitor weather conditions for both sunrise viewings",
      "Check guest condition post-treks before continuing journey",
      "Coordinate ferry timing for return to Bali",
      "Confirm Bali dropoff preferences",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic in Probolinggo, Bondowoso, or Banyuwangi",
      weatherDisruption:
        "Alternative timing considered, guest safety first, gas level monitoring at Ijen",
      vehicleBreakdown:
        "Backup vehicle on standby, immediate response coordination",
      ferryCancellation:
        "Alternative land route coordination, accommodation arrangements if needed",
    },
  },
  {
    id: "package-SUB-3D2N-003",
    label:
      "3 Day Bromo, Madakaripura Waterfall & Ijen Overland from Surabaya to Bali",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb4.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697/bromo8.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697/bromo7.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697/ijen4.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697/ijen5.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697/ijen9.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697/bromo9.webp",
    ],
    originCity: "surabaya",
    endCity: "bali",
    durationDays: 3,
    durationNights: 2,
    route: ["mount-bromo", "madakaripura-waterfall", "mount-ijen"],
    description:
      "Join a thrilling 3-day journey from Surabaya to Bali, exploring Indonesia's iconic Mount Bromo and Ijen Crater. This adventure is perfect for nature lovers and young explorers. Start with a sunrise visit to Mount Bromo, where the first light reveals the vast caldera and scenic peaks. Then, head to Madakaripura Waterfall, a hidden treasure surrounded by lush cliffs, ideal for a refreshing experience. Next, embark on a nighttime hike to Ijen Crater to see the rare blue flames, followed by a sunrise over the turquoise crater lake. This tour includes comfortable accommodations, private transport, and guidance from experienced English-speaking guides.",
    priceTiers: [
      { pax: 1, pricePerPerson: 6300000 },
      { pax: 2, pricePerPerson: 3570000 },
      { pax: 3, pricePerPerson: 3275000 },
      { pax: 4, pricePerPerson: 3050000 },
      { pax: 5, pricePerPerson: 3050000 },
      { pax: 6, pricePerPerson: 2850000 },
      { pax: 7, pricePerPerson: 2850000 },
      { pax: 8, pricePerPerson: 2550000 },
      { pax: 9, pricePerPerson: 2550000 },
      { pax: 10, pricePerPerson: 2550000 },
      { pax: 11, pricePerPerson: 2450000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Bromo Sunrise",
      "Madakaripura Waterfall",
      "Ijen Blue Fire",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "2 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Bromo, Madakaripura, Ijen)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary travel T-shirt",
      "Trekking poles for Ijen and Madakaripura",
      "Helmets for Madakaripura Waterfall",
      "Ferry tickets from Ketapang Harbour to Bali",
      "Medical certificate arrangement for Ijen",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Lunch on all days, Dinner on day 1 and 3",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for trekking",
      "Printed passport copy for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes and water shoes",
      "Small daypack for essentials",
      "Medical check-up for Ijen trekking",
    ],
    tags: [
      "3d2n",
      "surabaya",
      "bali",
      "bromo",
      "ijen",
      "madakaripura",
      "overland",
      "east-java",
    ],
    slug: "3d-bromo-madakaripura-ijen-from-surabaya-to-bali",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Nature lovers",
      "Young explorers",
      "Adventure seekers",
      "Cross-Java travelers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "16:00",
      orientationTime: "16:30",
    },
    end: {
      city: "bali",
      dropoffOptions: ["hotel", "airport"],
      safeFlightNote: "Recommend flights after 15:00 on final day from Bali",
      estimatedArrival: "12:00-14:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Basic mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 2,
        area: "Bondowoso/Ijen",
        hotelStandard: "3-star equivalent",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, madakaripura-waterfall",
        adjustable: true,
      },
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
        ],
      },
      {
        category: "Footwear",
        items: ["Sturdy hiking shoes", "Water shoes (waterfalls)"],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya to Bromo Highlands",
        drivingTime: "3-4 hours",
        activities: [
          {
            name: "Transfer to Cemoro Lawang",
            fromLocation: "Surabaya",
            toLocation: "Cemoro Lawang",
            timeWindow: "12:00–16:00",
            duration: "3-4 hours",
            notes: "Scenic drive through East Java countryside with lunch stop",
            destinationName: "mount-bromo",
          },
          {
            name: "Hotel Check-in",
            timeWindow: "20:00–21:00",
            notes:
              "Briefing about Bromo sunrise tour and rest before early departure",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense on arrival day",
        overnight: "Cemoro Lawang/Bromo",
        summary: "Pickup from Surabaya and scenic drive to Bromo highlands",
      },
      {
        day: 2,
        title: "Bromo Sunrise & Madakaripura to Bondowoso",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Bromo Sunrise Jeep Tour",
            fromLocation: "Cemoro Lawang",
            toLocation: "Kingkong Hill/Penanjakan",
            timeWindow: "02:00–03:30",
            duration: "1.5 hours",
            notes: "4WD jeep transfer for stargazing and sunrise viewing",
            destinationName: "mount-bromo",
          },
          {
            name: "Bromo Crater Exploration",
            timeWindow: "06:30–09:00",
            duration: "2.5 hours",
            notes:
              "Sea of Sand crossing, optional horse ride, 253-step climb to crater rim",
          },
          {
            name: "Madakaripura Waterfall",
            timeWindow: "13:30–15:00",
            duration: "1.5 hours",
            notes: "Canyon trek to waterfall with local guide, wet terrain",
          },
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Madakaripura",
            toLocation: "Bondowoso",
            timeWindow: "15:00–18:00",
            duration: "3 hours",
            notes:
              "Drive to Bondowoso for Ijen preparation and medical screening",
            destinationName: "mount-ijen",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes:
          "Breakfast at Bromo hotel before checkout, dinner at Bondowoso hotel",
        overnight: "Bondowoso/Ijen",
        summary:
          "Sunrise at Bromo, crater exploration, visit to Madakaripura Waterfall, transfer to Bondowoso",
      },
      {
        day: 3,
        title: "Ijen Crater to Bali Ferry",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Transfer to Ijen Basecamp",
            fromLocation: "Bondowoso",
            toLocation: "Paltuding",
            timeWindow: "00:00–02:00",
            duration: "2 hours",
            notes: "Night drive to Ijen for blue fire trek",
            destinationName: "mount-ijen",
          },
          {
            name: "Ijen Crater Trek",
            timeWindow: "02:00–08:00",
            duration: "6 hours",
            notes:
              "Night trek for blue fire, sunrise, turquoise lake, sulfur miners observation",
          },
          {
            name: "Ferry to Bali",
            fromLocation: "Ketapang Harbour",
            toLocation: "Bali",
            timeWindow: "09:00–12:00",
            duration: "3 hours",
            notes:
              "Ferry crossing with air-conditioned cabins, end of tour in Bali",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast included before Ijen trek departure",
        overnight: null,
        summary:
          "Midnight trek to Ijen for blue fire and sunrise, ferry to Bali",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip until Bali dropoff",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Cross-province experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip until Bali dropoff",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Madakaripura segment only",
        requirements: ["Local terrain knowledge", "Water safety awareness"],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check evening before trek",
        "Medical certificate for Ijen authorities (IDR 35,000-50,000 fee)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and strong water flow at waterfalls",
        "Ferry crossing weather conditions",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Regular guest condition checks",
        "Weather monitoring for ferry crossing",
      ],
    },
    handoverNotes: [
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Bromo before continuing to Ijen",
      "Coordinate ferry timing and Bali dropoff locations in advance",
      "Brief guests on optional activities pricing and payment methods",
      "Confirm Bali accommodation details for smooth dropoff",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      ferryCancellation:
        "Alternative land route coordination, accommodation arrangements if needed",
    },
  },
  {
    id: "package-SUB-3D2N-002",
    label: "3 Day Ijen, Bromo & Madakaripura Waterfall from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb9.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya---ijen---bromo-(3d-2n)-1676510962600/bromo2.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya---ijen---bromo-(3d-2n)-1676510962600/bromo22.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya---ijen---bromo-(3d-2n)-1676510962600/ijen11.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya---ijen---bromo-(3d-2n)-1676510962600/ijen2.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya---ijen---bromo-(3d-2n)-1676510962600/bromo18.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb1.jpg",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 3,
    durationNights: 2,
    route: ["mount-ijen", "mount-bromo", "madakaripura-waterfall"],
    description:
      "Embark on an exciting 3-day journey to explore two of Indonesia's most renowned volcanoes: Mount Bromo and Ijen Crater. This adventure is perfect for young explorers who love nature and want to witness breathtaking landscapes. The tour begins with a visit to Mount Ijen, where you'll trek to see the rare blue flames and the stunning turquoise crater lake at sunrise. Next, we head to Mount Bromo to experience the mesmerizing sunrise illuminating the vast caldera and surrounding peaks. The journey continues to the hidden gem of Madakaripura Waterfall, nestled within lush green cliffs, offering a refreshing and serene experience.",
    priceTiers: [
      { pax: 1, pricePerPerson: 6300000 },
      { pax: 2, pricePerPerson: 3570000 },
      { pax: 3, pricePerPerson: 3275000 },
      { pax: 4, pricePerPerson: 3050000 },
      { pax: 5, pricePerPerson: 3050000 },
      { pax: 6, pricePerPerson: 2850000 },
      { pax: 7, pricePerPerson: 2850000 },
      { pax: 8, pricePerPerson: 2550000 },
      { pax: 9, pricePerPerson: 2550000 },
      { pax: 10, pricePerPerson: 2550000 },
      { pax: 11, pricePerPerson: 2450000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Blue Fire",
      "Bromo Sunrise",
      "Madakaripura Waterfall",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "2 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Ijen, Bromo, Madakaripura)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary travel T-shirt",
      "Trekking poles for Ijen and Madakaripura",
      "Helmets for Madakaripura Waterfall",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Lunch on day 1 and 3, Dinner on day 2 and 3",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for night trek",
      "Printed passport copy for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes and water shoes",
      "Small daypack for essentials",
      "Medical check-up for Ijen trekking",
    ],
    tags: [
      "3d2n",
      "surabaya",
      "ijen",
      "bromo",
      "madakaripura",
      "east-java",
      "volcano-tour",
    ],
    slug: "3d-ijen-bromo-madakaripura-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: true,
    recommendedFor: [
      "Active travelers",
      "First-time Java visitors",
      "Nature photographers",
      "Adventure seekers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "16:00",
      orientationTime: "16:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 19:00 on final day",
      estimatedArrival: "17:00-20:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "3-star equivalent",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Basic mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, madakaripura-waterfall",
        adjustable: true,
      },
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
        ],
      },
      {
        category: "Footwear",
        items: ["Sturdy hiking shoes", "Water shoes (waterfalls)"],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya → Ijen area",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00–18:00",
            duration: "5-6 hours",
            notes: "Scenic drive through East Java countryside with lunch stop",
            destinationName: "mount-ijen",
          },
          {
            name: "Hotel Check-in & Briefing",
            timeWindow: "18:00–19:00",
            notes: "Medical screening for Ijen trek and trip briefing",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Dinner included at Bondowoso hotel",
        overnight: "Bondowoso/Ijen",
        summary:
          "Pickup from Surabaya and transfer to Bondowoso with stops for lunch",
      },
      {
        day: 2,
        title: "Ijen Crater & Transfer to Bromo",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Paltuding",
            fromLocation: "Bondowoso",
            toLocation: "Paltuding",
            timeWindow: "00:00–02:00",
            duration: "2 hours",
            notes: "Night drive to Ijen basecamp",
            destinationName: "mount-ijen",
          },
          {
            name: "Ijen Crater Trek",
            timeWindow: "02:00–08:00",
            duration: "6 hours",
            notes:
              "Night trek for blue fire, sunrise views, and crater exploration",
          },
          {
            name: "Transfer to Bromo",
            fromLocation: "Bondowoso",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–17:00",
            duration: "3.5-4 hours",
            notes: "Scenic drive through East Java highlands",
            destinationName: "mount-bromo",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast at hotel after Ijen trek, lunch before departure to Bromo",
        overnight: "Cemoro Lawang/Bromo",
        summary:
          "Midnight trek to Ijen crater for blue fire and sunrise, then transfer to Bromo area",
      },
      {
        day: 3,
        title: "Bromo Sunrise & Madakaripura Waterfall",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Bromo Sunrise Experience",
            timeWindow: "02:00–09:00",
            duration: "7 hours",
            notes:
              "Stargazing, sunrise viewpoint, Sea of Sand crossing, and crater climb",
          },
          {
            name: "Madakaripura Waterfall",
            timeWindow: "13:00–15:00",
            duration: "2 hours",
            notes:
              "River walk and exploration of hidden waterfall with local guide",
          },
          {
            name: "Return to Surabaya",
            fromLocation: "Madakaripura",
            toLocation: "Surabaya",
            timeWindow: "16:00–20:00",
            duration: "4 hours",
            notes: "Direct transfer to dropoff points",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast at Bromo hotel before checkout",
        overnight: null,
        summary:
          "Sunrise at Bromo, crater exploration, and visit to majestic Madakaripura Waterfall",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "MPV/Hiace licensed",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Destination knowledge",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Madakaripura segment only",
        requirements: ["Local terrain knowledge", "Water safety awareness"],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check evening before trek",
        "Medical certificate for Ijen authorities (IDR 35,000-50,000 fee)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and strong water flow at Madakaripura",
        "Volcanic dust and occasional gas at Bromo",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Regular guest condition checks",
        "Weather monitoring and alternative plans",
      ],
    },
    handoverNotes: [
      "Distribute gas masks at Paltuding 00:30 and conduct safety briefing",
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to Bromo",
      "Confirm flight timings for final day dropoff and recommend flights after 19:00",
      "Brief guests on optional activities pricing and payment methods",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      volcanicActivity:
        "Immediate evacuation and itinerary adjustment based on official warnings",
    },
  },
  {
    id: "package-BALI-3D2N-003",
    label:
      "3 Day Ijen, Bromo & Madakaripura Waterfall Journey from Bali to Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-bromo-surabaya-(3d-2n)-1690426694716/bromo20.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-bromo-surabaya-(3d-2n)-1690426694716/bromo21.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-bromo-surabaya-(3d-2n)-1690426694716/bromo22.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-bromo-surabaya-(3d-2n)-1690426694716/ijen13.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-bromo-surabaya-(3d-2n)-1690426694716/ijen14.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-bromo-surabaya-(3d-2n)-1690426694716/ijen15.webp",
    ],
    originCity: "bali",
    endCity: "surabaya",
    durationDays: 3,
    durationNights: 2,
    route: ["mount-ijen", "mount-bromo", "madakaripura-waterfall"],
    description:
      "Join us on a 3-day romantic journey from Bali, exploring the enchanting landscapes of Ijen Crater, Mount Bromo, and Madakaripura Waterfall. This retreat is perfect for couples seeking adventure and natural beauty. Begin with a trek to Ijen Crater to witness the mesmerizing blue flames and the stunning turquoise crater lake at sunrise. Next, experience the breathtaking sunrise over Mount Bromo, illuminating the vast caldera and surrounding peaks. The journey continues to the serene Madakaripura Waterfall, nestled within lush green cliffs, offering a refreshing and serene experience. Throughout the tour, enjoy comfortable accommodations, private transportation, and the guidance of experienced English-speaking guides.",
    priceTiers: [
      { pax: 1, pricePerPerson: 7500000 },
      { pax: 2, pricePerPerson: 4050000 },
      { pax: 3, pricePerPerson: 3800000 },
      { pax: 4, pricePerPerson: 3550000 },
      { pax: 5, pricePerPerson: 3550000 },
      { pax: 6, pricePerPerson: 3350000 },
      { pax: 7, pricePerPerson: 3350000 },
      { pax: 8, pricePerPerson: 3050000 },
      { pax: 9, pricePerPerson: 3050000 },
      { pax: 10, pricePerPerson: 3050000 },
      { pax: 11, pricePerPerson: 2850000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Blue Fire",
      "Bromo Sunrise",
      "Madakaripura Waterfall",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "2 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Ijen, Bromo, Madakaripura)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary travel T-shirt",
      "Trekking poles for Ijen and Madakaripura",
      "Helmets for Madakaripura Waterfall",
      "Medical certificate arrangement for Ijen",
      "Ferry tickets from Bali to Java",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Lunch on day 1, 3 and dinner on day 1, 2, 3",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for trekking",
      "Printed passport copy for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes and water shoes",
      "Small daypack for essentials",
      "Medical check-up for Ijen trekking",
    ],
    tags: [
      "3d2n",
      "bali",
      "surabaya",
      "ijen",
      "bromo",
      "madakaripura",
      "cross-province",
      "ferry-included",
    ],
    slug: "3d-ijen-bromo-madakaripura-from-bali-to-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Couples seeking adventure",
      "Bali-based travelers",
      "Cross-island explorers",
      "Romantic getaway seekers",
    ],
    start: {
      city: "bali",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint:
            "I Gusti Ngurah Rai International Airport (DPS) Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Bali hotels in main tourist areas",
        },
      },
      latestPickupGuidance: "10:00",
      orientationTime: "10:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel"],
      safeFlightNote:
        "Recommend flights after 19:00 on final day from Surabaya",
      estimatedArrival: "16:00-18:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Banyuwangi/Ijen",
        hotelStandard: "4-star modern hotel",
        examples: ["Luminor Hotel"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Basic mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, madakaripura-waterfall",
        adjustable: true,
      },
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
          "Bali-appropriate casual wear",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfalls)",
          "Comfortable travel shoes",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
          "Travel documents for ferry crossing",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Bali to Banyuwangi via Ferry",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Gilimanuk Port",
            fromLocation: "Bali",
            toLocation: "Gilimanuk Port",
            timeWindow: "10:00–14:00",
            duration: "4 hours",
            notes: "Scenic drive through Bali with views of Mount Agung",
          },
          {
            name: "Ferry Crossing to Java",
            fromLocation: "Gilimanuk Port",
            toLocation: "Ketapang Port",
            timeWindow: "14:00–15:00",
            duration: "1 hour",
            notes: "Ferry ride with views of Mount Raung in Java",
          },
          {
            name: "Hotel Check-in",
            timeWindow: "14:30–15:30",
            notes: "Check in at Luminor Hotel and rest before Ijen trek",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense on arrival day",
        overnight: "Banyuwangi/Ijen",
        summary:
          "Pickup from Bali, ferry crossing to Java, and transfer to Banyuwangi",
      },
      {
        day: 2,
        title: "Ijen Crater & Transfer to Bromo",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Paltuding",
            fromLocation: "Banyuwangi",
            toLocation: "Paltuding",
            timeWindow: "00:30–02:00",
            duration: "1.5 hours",
            notes: "Night drive to Ijen basecamp for blue fire trek",
            destinationName: "mount-ijen",
          },
          {
            name: "Ijen Crater Trek",
            timeWindow: "02:00–09:00",
            duration: "7 hours",
            notes:
              "Night trek for blue fire, sunrise views, turquoise lake, sulfur miners observation",
          },
          {
            name: "Transfer to Bromo Highlands",
            fromLocation: "Banyuwangi",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–17:00",
            duration: "4 hours",
            notes: "Scenic drive through East Java to Bromo area via Bondowoso",
            destinationName: "mount-bromo",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast after Ijen trek, lunch in Bondowoso before transfer to Bromo",
        overnight: "Cemoro Lawang/Bromo",
        summary:
          "Midnight trek to Ijen for blue fire and sunrise, transfer to Bromo area",
      },
      {
        day: 3,
        title: "Bromo Sunrise & Madakaripura to Surabaya",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Bromo Sunrise Jeep Tour",
            fromLocation: "Cemoro Lawang",
            toLocation: "Kingkong Hill/Penanjakan",
            timeWindow: "02:00–03:30",
            duration: "1.5 hours",
            notes: "4WD jeep transfer for stargazing and sunrise viewing",
            destinationName: "mount-bromo",
          },
          {
            name: "Bromo Crater Exploration",
            timeWindow: "06:30–10:00",
            duration: "3.5 hours",
            notes:
              "Sea of Sand crossing, optional horse ride, 253-step climb to crater rim",
          },
          {
            name: "Madakaripura Waterfall",
            timeWindow: "12:00–14:00",
            duration: "2 hours",
            notes:
              "Canyon trek to waterfall with local guide, wet and rocky terrain",
          },
          {
            name: "Transfer to Surabaya",
            fromLocation: "Madakaripura",
            toLocation: "Surabaya",
            timeWindow: "14:00–18:00",
            duration: "4 hours",
            notes:
              "Direct transfer to Surabaya for departure, end of cross-island tour",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast at Bromo hotel before departure",
        overnight: null,
        summary:
          "Sunrise at Bromo with stargazing, crater exploration, visit to Madakaripura Waterfall, transfer to Surabaya",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Ferry crossing experience",
          "Bali-Java route expertise",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Cross-province tour experience",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Madakaripura segment only",
        requirements: ["Local terrain knowledge", "Water safety awareness"],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
      ferryIncluded: true,
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check evening before trek",
        "Medical certificate for Ijen authorities (IDR 35,000-50,000 fee)",
        "Travel insurance recommended for cross-province travel",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and strong water flow at waterfalls",
        "Ferry crossing weather conditions",
        "Sea conditions during ferry transfer",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Weather monitoring for ferry operations",
        "Life jackets available on ferry",
      ],
    },
    handoverNotes: [
      "Coordinate Bali pickup timing with ferry schedule",
      "Ensure medical check-up completed at Banyuwangi hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to Bromo",
      "Verify ferry departure times and passenger documentation",
      "Confirm Surabaya dropoff locations and flight timings",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, ferry operations may be delayed in rough seas",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      ferryCancellation:
        "Alternative land route via Banyuwangi or overnight accommodation arrangement",
      documentIssues:
        "Assist with immigration and ferry documentation requirements",
    },
  },
  {
    id: "package-SUB-4D3N-001",
    label:
      "4 Day Ijen, Bromo & Madakaripura Waterfall Expedition from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb2.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/bromo1.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/ijen4.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/ijen5.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/madakaripura (2).webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/madakaripura1.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/bromo.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 4,
    durationNights: 3,
    route: ["mount-ijen", "mount-bromo", "madakaripura-waterfall"],
    description:
      "Embark on a captivating 4-day journey through East Java's most iconic landscapes. This adventure is perfect for nature enthusiasts and young explorers eager to witness breathtaking sights. Start with a trek to Ijen Crater to witness the rare blue flames and the stunning turquoise crater lake at sunrise. Next, experience the mesmerizing sunrise over Mount Bromo, illuminating the vast caldera and surrounding peaks. The journey continues to the hidden gem of Madakaripura Waterfall, nestled within lush green cliffs, offering a refreshing and serene experience. Throughout the tour, enjoy comfortable accommodations, private transportation, and the guidance of experienced English-speaking guides.",
    priceTiers: [
      { pax: 1, pricePerPerson: 7550000 },
      { pax: 2, pricePerPerson: 4450000 },
      { pax: 3, pricePerPerson: 4250000 },
      { pax: 4, pricePerPerson: 3950000 },
      { pax: 5, pricePerPerson: 3950000 },
      { pax: 6, pricePerPerson: 3650000 },
      { pax: 7, pricePerPerson: 3650000 },
      { pax: 8, pricePerPerson: 3175000 },
      { pax: 9, pricePerPerson: 3175000 },
      { pax: 10, pricePerPerson: 3175000 },
      { pax: 11, pricePerPerson: 3025000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Blue Fire",
      "Bromo Sunrise",
      "Madakaripura Waterfall",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "3 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Ijen, Bromo, Madakaripura)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary travel T-shirt",
      "Trekking poles for Ijen and Madakaripura",
      "Helmets for Madakaripura Waterfall",
      "Medical certificate arrangement for Ijen",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Lunch on day 1, 3, 4 and dinner on day 2, 3, 4",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for trekking",
      "Printed passport copy for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes and water shoes",
      "Small daypack for essentials",
      "Medical check-up for Ijen trekking",
    ],
    tags: [
      "4d3n",
      "surabaya",
      "ijen",
      "bromo",
      "madakaripura",
      "east-java",
      "expedition",
    ],
    slug: "4d-ijen-bromo-madakaripura-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    recommendedFor: [
      "Nature enthusiasts",
      "Young explorers",
      "Adventure seekers",
      "Extended weekend travelers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "16:00",
      orientationTime: "16:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 14:00 on final day",
      estimatedArrival: "11:00-12:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "3-star equivalent",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Basic mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 3,
        area: "Surabaya City",
        hotelStandard: "4-star international hotel",
        examples: ["Holiday Inn Express Surabaya Centerpoint"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, madakaripura-waterfall",
        adjustable: true,
      },
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
          "Comfortable city wear for Surabaya",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfalls)",
          "Casual shoes for city",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya to Bondowoso",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00–17:00",
            duration: "5-6 hours",
            notes: "Scenic drive through East Java countryside with lunch stop",
          },
          {
            name: "Hotel Check-in & Ijen Briefing",
            timeWindow: "17:00–19:00",
            notes: "Medical screening for Ijen trek and detailed trip briefing",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Dinner included at Bondowoso hotel",
        overnight: "Bondowoso/Ijen",
      },
      {
        day: 2,
        title: "Ijen Crater & Transfer to Bromo",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Paltuding",
            fromLocation: "Bondowoso",
            toLocation: "Paltuding",
            timeWindow: "00:00–02:00",
            duration: "2 hours",
            notes: "Night drive to Ijen basecamp",
          },
          {
            name: "Ijen Crater Trek",
            timeWindow: "02:00–08:00",
            duration: "6 hours",
            notes:
              "Night trek for blue fire, sunrise views, and crater exploration with sulfur miners",
          },
          {
            name: "Transfer to Bromo",
            fromLocation: "Bondowoso",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–17:00",
            duration: "3.5-4 hours",
            notes: "Scenic drive through East Java highlands to Bromo area",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast at hotel after Ijen trek, lunch before departure to Bromo",
        overnight: "Cemoro Lawang/Bromo",
      },
      {
        day: 3,
        title: "Bromo Sunrise & Madakaripura to Surabaya",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Bromo Sunrise Jeep Tour",
            fromLocation: "Cemoro Lawang",
            toLocation: "Kingkong Hill/Penanjakan",
            timeWindow: "02:00–03:30",
            duration: "1.5 hours",
            notes: "4WD jeep transfer for stargazing and sunrise viewing",
          },
          {
            name: "Bromo Crater Exploration",
            timeWindow: "06:30–09:00",
            duration: "2.5 hours",
            notes:
              "Sea of Sand crossing, optional horse ride, 253-step climb to crater rim",
          },
          {
            name: "Madakaripura Waterfall",
            timeWindow: "13:00–15:00",
            duration: "2 hours",
            notes:
              "Canyon trek to waterfall with local guide, wet and rocky terrain",
          },
          {
            name: "Return to Surabaya",
            fromLocation: "Madakaripura",
            toLocation: "Surabaya",
            timeWindow: "15:00–19:00",
            duration: "4 hours",
            notes: "Direct transfer to Surabaya city hotel",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast at Bromo hotel before checkout",
        overnight: "Surabaya City",
      },
      {
        day: 4,
        title: "Departure from Surabaya",
        drivingTime: "1-2 hours",
        activities: [
          {
            name: "Hotel Check-out",
            timeWindow: "09:00–11:00",
            duration: "2 hours",
            notes: "Breakfast and preparation for departure",
          },
          {
            name: "Airport Transfer",
            fromLocation: "Surabaya Hotel",
            toLocation: "Juanda International Airport",
            timeWindow: "11:00–12:00",
            duration: "1 hour",
            notes: "Transfer to airport for departure, end of tour",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast included at hotel",
        overnight: null,
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Long-distance experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Madakaripura segment only",
        requirements: ["Local terrain knowledge", "Water safety awareness"],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check evening before trek",
        "Medical certificate for Ijen authorities (IDR 35,000-50,000 fee)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and strong water flow at Madakaripura",
        "Fatigue from consecutive early mornings",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Regular guest condition checks",
        "Adequate rest periods between activities",
      ],
    },
    handoverNotes: [
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to Bromo",
      "Coordinate Surabaya hotel check-in for smooth transition to city stay",
      "Confirm flight timings for final day airport transfer",
      "Brief guests on extended itinerary pacing and rest opportunities",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      guestFatigue:
        "Flexible pacing, optional rest periods, hydration monitoring",
    },
  },
  {
    id: "package-BALI-4D3N-001",
    label:
      "4 Day Ijen, Papuma Beach, Tumpak Sewu & Bromo Expedition from Bali to Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb6.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-(4d-3n)-1688359082662/bromo8.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-(4d-3n)-1688359082662/ijen11.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-(4d-3n)-1688359082662/ijen12.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-(4d-3n)-1688359082662/papuma1.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-(4d-3n)-1688359082662/tumpaksewu6.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-(4d-3n)-1688359082662/bromo3.webp",
    ],
    originCity: "bali",
    endCity: "surabaya",
    durationDays: 4,
    durationNights: 3,
    route: [
      "mount-ijen",
      "papuma-beach",
      "tumpak-sewu-waterfall",
      "mount-bromo",
    ],
    description:
      "Experience the best of East Java on this 4-day adventure, starting with a scenic transfer from Bali to Banyuwangi. Witness Ijen Crater's turquoise sulfuric lake and blue fire phenomenon, enjoy Papuma Beach's stunning sunset, explore the magnificent Tumpak Sewu Waterfall with its curtain-like water flow, and experience the iconic Mount Bromo sunrise across the sea of sand. This comprehensive expedition combines volcanic landscapes, pristine beaches, and breathtaking waterfalls for an unforgettable Indonesian adventure.",
    priceTiers: [
      { pax: 1, pricePerPerson: 9050000 },
      { pax: 2, pricePerPerson: 4900000 },
      { pax: 3, pricePerPerson: 4700000 },
      { pax: 4, pricePerPerson: 4400000 },
      { pax: 5, pricePerPerson: 4400000 },
      { pax: 6, pricePerPerson: 4100000 },
      { pax: 7, pricePerPerson: 4100000 },
      { pax: 8, pricePerPerson: 3625000 },
      { pax: 9, pricePerPerson: 3625000 },
      { pax: 10, pricePerPerson: 3625000 },
      { pax: 11, pricePerPerson: 3475000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Crater Hike",
      "Papuma Beach Sunset Tour",
      "Tumpak Sewu Waterfall Tour",
      "Bromo Sunrise Tour",
    ],
    physicality: "Challenging",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "3 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Ijen, Papuma Beach, Tumpak Sewu, Bromo)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Trekking poles for Ijen and Tumpak Sewu",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "3 breakfasts, 2 lunches as per itinerary",
      "Complimentary travel T-shirt",
      "Medical check-up for Ijen permit",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary (specific lunches and dinners)",
      "Personal expenses and tips",
      "Optional activities (horse riding at Bromo, Ijen trolley ojek)",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000-350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the Ijen trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate to high fitness for challenging treks",
      "Printed passport copy for Ijen permit processing",
      "Warm clothing (5-15°C for Bromo/Ijen)",
      "Sturdy hiking shoes and water shoes for waterfalls",
      "Small daypack for essentials",
      "Medical check-up mandatory for Ijen trek",
    ],
    tags: [
      "4d3n",
      "bali",
      "ijen",
      "papuma-beach",
      "tumpak-sewu",
      "bromo",
      "surabaya",
      "adventure",
    ],
    slug: "4d3n-ijen-papuma-tumpaksewu-bromo-from-bali",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    recommendedFor: [
      "Adventure seekers",
      "Nature lovers",
      "Active travelers",
      "First-time Java visitors",
      "Landscape photographers",
    ],
    start: {
      city: "bali",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint:
            "I Gusti Ngurah Rai International Airport (DPS) Arrival Gate",
          notes: "Ideal pickup before 10:00 AM",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Bali area hotels",
        },
      },
      latestPickupGuidance: "10:00",
      orientationTime: "10:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 19:00 on final day",
      estimatedArrival: "16:00-17:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Banyuwangi",
        hotelStandard: "3-star equivalent",
        examples: ["Luminor Hotel"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Jember",
        hotelStandard: "Garden-style homestay with pool",
        examples: ["Doho Homestay"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 3,
        area: "Bromo",
        hotelStandard: "Traditional mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, tumpak-sewu-waterfall",
        adjustable: true,
      },
      {
        item: "Helmets",
        for: "tumpak-sewu-waterfall",
        safetyStandard: "CE certified",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5-15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfalls)",
          "Trekking sandals",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Insect repellent",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Bali to Banyuwangi - Arrival and Transfer",
        drivingTime: "5-6 hours total",
        activities: [
          {
            name: "Bali to Gilimanuk Transfer",
            fromLocation: "Bali",
            toLocation: "Gilimanuk Port",
            timeWindow: "10:00-12:00",
            duration: "2 hours",
            notes: "Scenic drive to port with potential coastal views",
          },
          {
            name: "Ferry Crossing",
            fromLocation: "Gilimanuk Port",
            toLocation: "Ketapang Port",
            timeWindow: "12:00-13:00",
            duration: "1 hour",
            notes:
              "Views of Mount Agung (Bali) and Mount Raung (Java) if clear",
          },
          {
            name: "Hotel Check-in Banyuwangi",
            destinationName: "Banyuwangi",
            timeWindow: "14:00-14:30",
            notes: "Briefing about next day's Ijen trek",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense today",
        overnight: "Banyuwangi",
      },
      {
        day: 2,
        title: "Ijen Crater - Jember - Papuma Beach Sunset",
        drivingTime: "5 hours",
        activities: [
          {
            name: "Transfer to Ijen Base",
            fromLocation: "Banyuwangi",
            toLocation: "Paltuding",
            timeWindow: "00:30-02:00",
            duration: "1.5 hours",
            notes: "Check out and drive to Paltuding (Ijen base camp)",
          },
          {
            name: "Ijen Crater Trek",
            timeWindow: "02:00-06:00",
            duration: "4 hours",
            notes:
              "1.5-2 hour trek to Ijen crater rim to witness turquoise sulfuric lake and sulfur miners",
          },
          {
            name: "Lunch in Bondowoso",
            timeWindow: "12:00-13:00",
            duration: "1 hour",
            notes: "Lunch at local restaurant in Bondowoso City",
          },
          {
            name: "Papuma Beach Sunset",
            timeWindow: "16:00-18:00",
            duration: "2 hours",
            notes: "Visit Papuma Beach for stunning sunset views over the sea",
          },
          {
            name: "Hotel Check-in Jember",
            timeWindow: "20:00-20:30",
            notes: "Check into Jember hotel after beach visit",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast and lunch included, dinner at own expense",
        overnight: "Jember",
      },
      {
        day: 3,
        title: "Tumpak Sewu Waterfall to Bromo",
        drivingTime: "7 hours",
        activities: [
          {
            name: "Transfer to Tumpak Sewu",
            fromLocation: "Jember",
            toLocation: "Tumpak Sewu",
            timeWindow: "03:30-06:30",
            duration: "3 hours",
            notes: "Early check out and drive to Tumpak Sewu Waterfall",
          },
          {
            name: "Tumpak Sewu Waterfall Exploration",
            timeWindow: "07:30-11:00",
            duration: "3.5 hours",
            notes:
              "Descend to waterfall base (30-45 minutes) through canyon with river crossings",
          },
          {
            name: "Transfer to Bromo",
            fromLocation: "Tumpak Sewu",
            toLocation: "Bromo",
            timeWindow: "13:00-17:00",
            duration: "4 hours",
            notes: "Drive from Tumpak Sewu to Bromo area",
          },
          {
            name: "Hotel Check-in Bromo",
            timeWindow: "17:00-17:30",
            notes: "Check into Bromo hotel",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast and lunch included, dinner at own expense",
        overnight: "Bromo",
      },
      {
        day: 4,
        title: "Mount Bromo Stargazing and Sunrise - Transfer to Surabaya",
        drivingTime: "6 hours",
        activities: [
          {
            name: "Bromo Sunrise Jeep Transfer",
            fromLocation: "Bromo Hotel",
            toLocation: "Bromo Viewpoint",
            timeWindow: "02:00-03:30",
            duration: "1.5 hours",
            notes: "Transfer to Bromo viewpoint by private Jeep",
          },
          {
            name: "Bromo Stargazing and Sunrise",
            timeWindow: "03:30-07:00",
            duration: "3.5 hours",
            notes:
              "Milky Way viewing followed by sunrise over Bromo landscape with views of Mount Batok and Semeru",
          },
          {
            name: "Bromo Crater Exploration",
            timeWindow: "07:00-10:00",
            duration: "3 hours",
            notes:
              "4WD across Sand Sea to Poten temple, then hike or pony ride to crater rim (253 steps)",
          },
          {
            name: "Transfer to Surabaya",
            fromLocation: "Bromo",
            toLocation: "Surabaya",
            timeWindow: "11:00-16:00",
            duration: "5 hours",
            notes: "Journey back to Surabaya for drop-off",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "n_a",
        },
        mealsNotes: "Breakfast included, lunch at own expense during transfer",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Coastal and mountain terrain experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Tumpak Sewu segment only",
        requirements: [
          "Local terrain knowledge",
          "Water safety awareness",
          "Bamboo ladder expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check evening before trek",
        "Medical certificate for Ijen authorities (IDR 35,000-50,000 fee)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and strong water flow at Madakaripura",
        "Strong waves and currents at Papuma Beach",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Regular guest condition checks",
        "Weather monitoring for beach conditions",
      ],
    },
    handoverNotes: [
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to beach activities",
      "Coordinate timing for Papuma Beach sunset viewing",
      "Ensure proper footwear for Tumpak Sewu bamboo ladders and wet terrain",
      "Confirm flight timings for final day Surabaya dropoff",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      beachSafety:
        "Monitor tide conditions, provide swimming safety briefings at Papuma",
    },
  },
  {
    id: "package-SUB-4D3N-002",
    label:
      "4 Day Ijen, Papuma Beach, Tumpak Sewu & Bromo Journey from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n-surabaya-bromo-mt.ijen-papuma-beach-tumpak-sewu-fall-surabaya-2023-private-tour/ijen8.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n-surabaya-bromo-mt.ijen-papuma-beach-tumpak-sewu-fall-surabaya-2023-private-tour/ijen3.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n-surabaya-bromo-mt.ijen-papuma-beach-tumpak-sewu-fall-surabaya-2023-private-tour/bromo7.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n-surabaya-bromo-mt.ijen-papuma-beach-tumpak-sewu-fall-surabaya-2023-private-tour/papuma3.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n-surabaya-bromo-mt.ijen-papuma-beach-tumpak-sewu-fall-surabaya-2023-private-tour/tumpaksewu.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n-surabaya-bromo-mt.ijen-papuma-beach-tumpak-sewu-fall-surabaya-2023-private-tour/tumpaksewu2.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 4,
    durationNights: 3,
    route: [
      "mount-ijen",
      "papuma-beach",
      "tumpak-sewu-waterfall",
      "mount-bromo",
    ],
    description:
      "Embark on an exciting 4-day journey through East Java's most iconic landscapes. This adventure is perfect for nature enthusiasts and young explorers eager to witness breathtaking sights. Begin with a trek to Ijen Crater to witness the rare blue flames and the stunning turquoise crater lake at sunrise. Next, relax at the pristine shores of Papuma Beach, known for its white sands and clear waters. The journey continues to the majestic Tumpak Sewu Waterfall, a multi-tiered waterfall surrounded by lush greenery. Finally, experience the mesmerizing sunrise over Mount Bromo, illuminating the vast caldera and surrounding peaks. Throughout the tour, enjoy comfortable accommodations, private transportation, and the guidance of experienced English-speaking guides.",
    priceTiers: [
      { pax: 1, pricePerPerson: 8050000 },
      { pax: 2, pricePerPerson: 4550000 },
      { pax: 3, pricePerPerson: 4350000 },
      { pax: 4, pricePerPerson: 4050000 },
      { pax: 5, pricePerPerson: 4050000 },
      { pax: 6, pricePerPerson: 3750000 },
      { pax: 7, pricePerPerson: 3750000 },
      { pax: 8, pricePerPerson: 3275000 },
      { pax: 9, pricePerPerson: 3275000 },
      { pax: 10, pricePerPerson: 3275000 },
      { pax: 11, pricePerPerson: 3125000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Blue Fire",
      "Papuma Beach Sunset",
      "Tumpak Sewu Waterfall",
      "Bromo Sunrise",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "3 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Ijen, Papuma Beach, Tumpak Sewu, Bromo)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary travel T-shirt",
      "Trekking poles for Ijen and Tumpak Sewu",
      "Medical certificate arrangement for Ijen",
      "Malabar Coffee Plantation visit",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Lunch on day 1, 4 and dinner on day 2, 3, 4",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for multiple treks",
      "Printed passport copy for Ijen permit",
      "Warm clothing (5–15°C) and beachwear",
      "Sturdy hiking shoes and water shoes",
      "Small daypack for essentials",
      "Medical check-up for Ijen trekking",
    ],
    tags: [
      "4d3n",
      "surabaya",
      "ijen",
      "papuma-beach",
      "tumpak-sewu",
      "bromo",
      "beach-and-volcano",
    ],
    slug: "4d-ijen-papuma-tumpak-sewu-bromo-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    recommendedFor: [
      "Nature enthusiasts",
      "Young explorers",
      "Beach and volcano lovers",
      "Photography enthusiasts",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "16:00",
      orientationTime: "16:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 18:00 on final day",
      estimatedArrival: "16:00-17:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "3-star equivalent",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Jember City",
        hotelStandard: "Garden-style homestay",
        examples: ["Doho Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 3,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Basic mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, tumpak-sewu-waterfall",
        adjustable: true,
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
          "Beachwear for Papuma",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfalls)",
          "Sandals for beach",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
          "Swimwear",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya to Bondowoso",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00–17:00",
            duration: "5-6 hours",
            notes:
              "Scenic drive through East Java countryside with lunch stop in Probolinggo",
          },
          {
            name: "Hotel Check-in & Ijen Briefing",
            timeWindow: "17:00–19:00",
            notes: "Medical screening for Ijen trek and detailed trip briefing",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Dinner included at Bondowoso hotel",
        overnight: "Bondowoso/Ijen",
      },
      {
        day: 2,
        title: "Ijen Crater & Papuma Beach Sunset",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Transfer to Paltuding",
            fromLocation: "Bondowoso",
            toLocation: "Paltuding",
            timeWindow: "00:00–02:00",
            duration: "2 hours",
            notes: "Night drive to Ijen basecamp for blue fire trek",
          },
          {
            name: "Ijen Crater Trek",
            timeWindow: "02:00–08:00",
            duration: "6 hours",
            notes:
              "Night trek for blue fire, sunrise views, turquoise lake, sulfur miners observation",
          },
          {
            name: "Malabar Coffee Plantation",
            timeWindow: "09:00–10:00",
            duration: "1 hour",
            notes: "Coffee break and local snacks at plantation",
          },
          {
            name: "Papuma Beach Sunset",
            timeWindow: "16:00–18:00",
            duration: "2 hours",
            notes: "Beach relaxation and sunset viewing at white sand beach",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast after Ijen trek, lunch before transfer to Jember",
        overnight: "Jember City",
      },
      {
        day: 3,
        title: "Tumpak Sewu Waterfall to Bromo",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Tumpak Sewu Waterfall Exploration",
            timeWindow: "07:30–12:00",
            duration: "4.5 hours",
            notes:
              "Trek to multi-tiered waterfall with bamboo ladders, wet and rocky terrain requiring local guide",
          },
          {
            name: "Transfer to Bromo Highlands",
            fromLocation: "Jember",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–17:00",
            duration: "4 hours",
            notes: "Scenic drive from coastal area to volcanic highlands",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast before waterfall visit, lunch before departure to Bromo",
        overnight: "Cemoro Lawang/Bromo",
      },
      {
        day: 4,
        title: "Bromo Sunrise and Return to Surabaya",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Bromo Sunrise Jeep Tour",
            fromLocation: "Cemoro Lawang",
            toLocation: "Kingkong Hill/Penanjakan",
            timeWindow: "02:00–03:30",
            duration: "1.5 hours",
            notes: "4WD jeep transfer for stargazing and sunrise viewing",
          },
          {
            name: "Bromo Crater Exploration",
            timeWindow: "06:30–10:00",
            duration: "3.5 hours",
            notes:
              "Sea of Sand crossing, optional horse ride, 253-step climb to crater rim",
          },
          {
            name: "Return to Surabaya",
            fromLocation: "Bromo",
            toLocation: "Surabaya",
            timeWindow: "10:00–16:00",
            duration: "6 hours",
            notes: "Direct transfer to Surabaya for departure",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast at Bromo hotel before departure",
        overnight: null,
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Coastal and mountain terrain experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Tumpak Sewu segment only",
        requirements: [
          "Local terrain knowledge",
          "Water safety awareness",
          "Bamboo ladder expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check evening before trek",
        "Medical certificate for Ijen authorities (IDR 35,000-50,000 fee)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and bamboo ladders at Tumpak Sewu",
        "Strong waves and currents at Papuma Beach",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides with safety equipment at Tumpak Sewu",
        "Weather monitoring for beach conditions",
        "Regular guest condition checks during challenging activities",
      ],
    },
    handoverNotes: [
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to beach activities",
      "Coordinate timing for Papuma Beach sunset viewing",
      "Ensure proper footwear for Tumpak Sewu bamboo ladders and wet terrain",
      "Confirm flight timings for final day Surabaya dropoff",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      beachSafety:
        "Monitor tide conditions, provide swimming safety briefings at Papuma",
    },
  },
  {
    id: "package-SUB-4D3N-003",
    label: "4 Day Tumpak Sewu, Bromo & Ijen Adventure from Surabaya to Bali",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/tumpaksewu.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/bromo4.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/bromo9.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/ijen13.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/ijen14.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/tumpaksewu.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/4d-3n--surabaya---jodipan---tumpak-sewu-fall---bromo---ijen---bali---reg-1669902198543/tumpaksewu6.webp",
    ],
    originCity: "surabaya",
    endCity: "bali",
    durationDays: 4,
    durationNights: 3,
    route: ["tumpak-sewu-waterfall", "mount-bromo", "mount-ijen"],
    description:
      "Embark on an exciting 4-day journey from Surabaya to Bali, exploring Indonesia's iconic Mount Bromo, Ijen Crater, and the majestic Tumpak Sewu Waterfall. This adventure is perfect for nature lovers and young explorers eager to witness breathtaking landscapes. Begin with a visit to Tumpak Sewu Waterfall, a multi-tiered cascade surrounded by lush greenery. Experience the mesmerizing sunrise over Mount Bromo, illuminating the vast caldera and surrounding peaks. The journey culminates with a nighttime trek to Ijen Crater to witness the rare phenomenon of blue flames, followed by the stunning turquoise crater lake at sunrise before continuing to Bali.",
    priceTiers: [
      { pax: 1, pricePerPerson: 8050000 },
      { pax: 2, pricePerPerson: 4550000 },
      { pax: 3, pricePerPerson: 4350000 },
      { pax: 4, pricePerPerson: 4050000 },
      { pax: 5, pricePerPerson: 4050000 },
      { pax: 6, pricePerPerson: 3750000 },
      { pax: 7, pricePerPerson: 3750000 },
      { pax: 8, pricePerPerson: 3275000 },
      { pax: 9, pricePerPerson: 3275000 },
      { pax: 10, pricePerPerson: 3275000 },
      { pax: 11, pricePerPerson: 3125000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Tumpak Sewu Waterfall Tour",
      "Bromo Sunrise Tour",
      "Ijen Crater Hike",
    ],
    physicality: "Moderate to Challenging",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "3 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Tumpak Sewu Waterfall, Mount Bromo, Mount Ijen)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Trekking poles for Ijen hike",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "3 breakfasts, 1 lunch, 1 dinner as per itinerary",
      "Complimentary travel T-shirt",
      "Medical check-up for Ijen permit",
      "Ferry tickets from Ketapang Harbour to Bali (air-conditioned cabins)",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary (most lunches and dinners)",
      "Personal expenses and tips",
      "Optional activities (horse riding at Bromo, Ijen trolley ojek)",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000-350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the Ijen trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate to good physical fitness for challenging treks",
      "Printed passport copy for Ijen permit processing",
      "Warm clothing (5-15°C for Bromo/Ijen)",
      "Sturdy hiking shoes and water shoes for waterfalls",
      "Small daypack for essentials",
      "Medical check-up mandatory for Ijen trek",
      "No respiratory conditions (due to sulfur exposure)",
    ],
    tags: [
      "4d3n",
      "surabaya",
      "bali",
      "tumpak-sewu",
      "bromo",
      "ijen",
      "blue-fire",
      "waterfall",
      "volcano",
      "adventure",
      "one-way",
    ],
    slug: "4d3n-tumpaksewu-bromo-ijen-from-surabaya-to-bali",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    recommendedFor: [
      "Nature lovers",
      "Young explorers",
      "Adventure seekers",
      "Photography enthusiasts",
      "Active travelers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "Surabaya Airport Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels before 12:00 PM",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "12:00",
      orientationTime: "12:30",
    },
    end: {
      city: "bali",
      dropoffOptions: ["hotel"],
      safeFlightNote: "Recommend flights after 14:00 on final day",
      estimatedArrival: "10:30-11:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Lumajang/Tumpak Sewu",
        hotelStandard: "Comfortable cottage",
        examples: ["Artha Cottage"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Traditional mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 3,
        area: "Bondowoso/Ijen",
        hotelStandard: "Nature retreat homestay",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, tumpak-sewu-waterfall",
        adjustable: true,
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5-15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfall",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfall)",
          "Comfortable walking shoes",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Flashlight",
          "Sunscreen",
          "Personal medications",
          "Dust mask",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya to Lumajang - Arrival and Free Time",
        drivingTime: "4 hours",
        activities: [
          {
            name: "Surabaya to Lumajang Transfer",
            fromLocation: "Surabaya",
            toLocation: "Lumajang",
            timeWindow: "12:00-16:00",
            duration: "4 hours",
            notes: "Scenic drive to Tumpak Sewu area with lunch stop",
          },
          {
            name: "Hotel Check-in",
            timeWindow: "16:00-17:00",
            notes: "Rest and prepare for next day's waterfall adventure",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense during travel",
        overnight: "Lumajang",
      },
      {
        day: 2,
        title: "Tumpak Sewu Waterfall & Journey to Bromo",
        drivingTime: "4 hours",
        activities: [
          {
            name: "Tumpak Sewu Waterfall",
            timeWindow: "07:00-12:00",
            duration: "5 hours",
            notes:
              "Trek through canyon with river crossings to multi-tiered waterfall",
          },
          {
            name: "Transfer to Bromo",
            fromLocation: "Lumajang",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00-17:00",
            duration: "4 hours",
            notes: "Scenic drive to Bromo highlands",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast and lunch included, dinner at own expense",
        overnight: "Cemoro Lawang",
      },
      {
        day: 3,
        title: "Bromo Sunrise Tour & Transfer to Bondowoso",
        drivingTime: "3-4 hours",
        activities: [
          {
            name: "Bromo Sunrise Experience",
            timeWindow: "03:00-10:00",
            duration: "7 hours",
            notes:
              "Stargazing, sunrise viewing, sand sea Jeep tour, crater exploration, and Whispering Sands",
          },
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Cemoro Lawang",
            toLocation: "Bondowoso",
            timeWindow: "12:00-16:00",
            duration: "4 hours",
            notes: "Drive to Bondowoso with medical screening upon arrival",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Breakfast and dinner included, lunch during travel",
        overnight: "Bondowoso",
      },
      {
        day: 4,
        title: "Ijen Crater Tour & Journey to Bali",
        drivingTime: "4-5 hours total",
        activities: [
          {
            name: "Ijen Blue Fire Trek",
            timeWindow: "02:00-07:00",
            duration: "5 hours",
            notes:
              "Night trek to witness blue flames, sunrise over turquoise lake, and sulfur mining observation",
          },
          {
            name: "Transfer to Bali",
            fromLocation: "Ijen",
            toLocation: "Bali",
            timeWindow: "07:30-10:30",
            duration: "3 hours",
            notes: "Includes ferry crossing to Bali",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "n_a",
        },
        mealsNotes: "Breakfast included, lunch during travel to Bali",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Surabaya-Bali route knowledge",
          "Ferry crossing experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: [
          "4WD certified",
          "Sunrise viewpoint knowledge",
          "Sand driving experience",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur mining knowledge",
          "Emergency response training",
        ],
      },
      {
        role: "Tumpak Sewu Local Guide",
        scope: "Tumpak Sewu segment only",
        requirements: [
          "Waterfall safety certified",
          "River crossing expertise",
          "Canyon navigation skills",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand sea crossing",
        ],
      },
      ferryIncluded: true,
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check at Bondowoso hotel",
        "Respiratory condition screening - not suitable for asthma or heart conditions",
        "Good physical fitness required for challenging treks at Tumpak Sewu and Ijen",
      ],
      environmentalRisks: [
        "Slippery paths and flash flood risk at Tumpak Sewu Waterfall",
        "Sulfur gas exposure at Ijen crater",
        "Cold 5-15°C at Bromo and Ijen pre-sunrise",
        "Steep and rocky terrain at Ijen with potential slippery conditions",
        "Volcanic dust at Bromo sand sea",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for all guests at Ijen",
        "Headlamps for night treks at both Bromo and Ijen",
        "Local guides with specialized training at each location",
        "Regular guest condition checks during challenging activities",
        "Weather monitoring for waterfall and volcano conditions",
      ],
    },
    handoverNotes: [
      "Coordinate Surabaya pickup timing for Day 1 afternoon departure",
      "Arrange medical screening at Bondowoso hotel upon arrival",
      "Monitor weather conditions for waterfall and sunrise viewings",
      "Check guest condition post-treks before continuing journey",
      "Coordinate ferry timing for transfer to Bali",
      "Confirm Bali dropoff preferences",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic in Lumajang, Probolinggo, or Bondowoso",
      weatherDisruption:
        "Alternative timing considered, guest safety first, gas level monitoring at Ijen",
      vehicleBreakdown:
        "Backup vehicle on standby, immediate response coordination",
      ferryCancellation:
        "Alternative accommodation arrangements in Banyuwangi if needed",
    },
  },
  {
    id: "package-SUB-3D2N-006",
    label:
      "3 Day Taman Safari Prigen, Bromo & Madakaripura Family Adventure from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736406701_baobab4.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736405193_Taman Safari 1.jpg",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736405200_Taman Safari 2.jpg",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736405217_Taman Safari 5.jpg",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736404959_baobab3.png",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736404641_baobab1.png",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1736404647_baobab2.png",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new1.jpg",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/ijen-bromo-tumpak-sewu-malang-sightseeing-tour-1676526893742/1687320433_IJEN31.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/bromo11.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen-bromo-madakaripura-surabaya-yogyakarta-(4d-3n)-1692071618205/bromo15.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/1687322060_BROMO 1.jpg",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/madakaripura1.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/madakaripura.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 3,
    durationNights: 2,
    route: ["taman-safari-prigen", "mount-bromo", "madakaripura-waterfall"],
    description:
      "Take part in an exciting 3-day journey to explore two of Indonesia's most renowned destinations: Taman Safari Prigen and Mount Bromo. This adventure is perfect for explorers who love nature and want to witness breathtaking landscapes. The tour begins with a visit to Taman Safari Prigen, where you'll enjoy a variety of wildlife encounters and experience an immersive animal safari. Next, we head to Mount Bromo to witness the stunning sunrise illuminating the vast caldera and surrounding peaks. The journey continues to the hidden gem of Madakaripura Waterfall, nestled within lush green cliffs, offering a refreshing and serene experience.",
    priceTiers: [
      { pax: 2, pricePerPerson: 4350000 },
      { pax: 3, pricePerPerson: 4150000 },
      { pax: 4, pricePerPerson: 3950000 },
      { pax: 5, pricePerPerson: 3950000 },
      { pax: 6, pricePerPerson: 3750000 },
      { pax: 7, pricePerPerson: 3750000 },
      { pax: 8, pricePerPerson: 3550000 },
      { pax: 9, pricePerPerson: 3550000 },
      { pax: 10, pricePerPerson: 3550000 },
      { pax: 11, pricePerPerson: 3450000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Bromo Sunrise Tour",
      "Madakaripura Waterfall Tour",
      "Taman Safari Adventure",
    ],
    physicality: "Easy to Moderate",
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests) with fuel, tolls, parking included",
      "2 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Taman Safari Prigen, Mount Bromo, Madakaripura Waterfall)",
      "Helmets for Madakaripura Waterfall",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "2 breakfasts as per itinerary",
      "Complimentary travel T-shirt",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA (if applicable)",
      "Travel Insurance",
      "Meals not stated in the itinerary (lunches and dinners)",
      "Personal expenses and tips",
      "Optional activities (horse riding at Bromo, animal feeding at safari, ATV adventure)",
      "Breakfast with giraffes (optional add-on)",
      "Night walk and night stories at Baobab Safari Resort",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000-350,000 (on-site cash)",
      },
      {
        name: "Breakfast with Giraffes",
        description:
          "Magical breakfast experience with giraffes (advance booking required)",
        price: "Additional fee applies - contact for booking",
      },
      {
        name: "Animal Feeding at Safari",
        description: "Interactive animal feeding experiences",
        price: "Variable (personal expense)",
      },
      {
        name: "ATV Adventure",
        description: "ATV riding adventure at Baobab Safari Resort",
        price: "Variable (personal expense)",
      },
    ],
    travelerRequirements: [
      "Minimal to moderate fitness level",
      "Warm clothing (5-15°C for Bromo)",
      "Comfortable walking shoes",
      "Water shoes for Madakaripura Waterfall",
      "Small daypack for essentials",
      "Swimwear for resort activities",
    ],
    tags: [
      "3d2n",
      "surabaya",
      "taman-safari",
      "bromo",
      "madakaripura",
      "family-friendly",
      "wildlife",
      "adventure",
    ],
    slug: "3d2n-taman-safari-bromo-madakaripura-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: true,
    recommendedFor: [
      "Families with children",
      "Wildlife enthusiasts",
      "Nature lovers",
      "First-time Java visitors",
      "Multi-generational travel",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "Surabaya Airport Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels at 12:00 PM",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "12:00",
      orientationTime: "12:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 19:00 on final day",
      estimatedArrival: "16:00-17:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Prigen",
        hotelStandard: "Safari-themed resort",
        examples: ["Baobab Safari Resort"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Traditional mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
    ],
    gearProvided: [
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        safetyStandard: "CE certified",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5-15°C)",
          "Waterproof jacket",
          "Comfortable casual wear",
          "Swimwear",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Comfortable walking shoes",
          "Water shoes (waterfall)",
          "Sandals",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Insect repellent",
          "Camera",
          "Binoculars for wildlife",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "A Warm Welcome to East Java",
        drivingTime: "2 hours",
        activities: [
          {
            name: "Surabaya to Prigen Transfer",
            fromLocation: "Surabaya",
            toLocation: "Prigen",
            timeWindow: "12:00-14:00",
            duration: "2 hours",
            notes: "Transfer to Baobab Safari Resort",
          },
          {
            name: "Resort Check-in and Leisure",
            destinationName: "Baobab Safari Resort",
            timeWindow: "14:00-18:00",
            notes:
              "Check-in and free time for resort activities: swimming, animal feeding, ATV",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes:
          "All meals at own expense - resort dining options available",
        overnight: "Prigen",
      },
      {
        day: 2,
        title: "Into the Wild at Taman Safari",
        drivingTime: "2 hours",
        activities: [
          {
            name: "Taman Safari Prigen",
            destinationName: "Taman Safari Prigen",
            timeWindow: "09:00-15:00",
            duration: "6 hours",
            notes: "Wildlife safari, animal shows, and family attractions",
          },
          {
            name: "Transfer to Bromo",
            fromLocation: "Prigen",
            toLocation: "Cemoro Lawang",
            timeWindow: "15:00-17:00",
            duration: "2 hours",
            notes: "Scenic drive to Bromo area",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast included at resort, other meals at own expense",
        overnight: "Cemoro Lawang",
      },
      {
        day: 3,
        title:
          "From the Majestic Bromo Sunrise to the Hidden Madakaripura Waterfall",
        drivingTime: "5-6 hours total",
        activities: [
          {
            name: "Bromo Sunrise Experience",
            destinationName: "Mount Bromo",
            timeWindow: "03:30-09:00",
            duration: "5.5 hours",
            notes:
              "Sunrise viewing, sand sea Jeep tour, and crater exploration",
          },
          {
            name: "Madakaripura Waterfall",
            destinationName: "Madakaripura Waterfall",
            timeWindow: "11:00-12:30",
            duration: "1.5 hours",
            notes:
              "Trek to Java's highest waterfall through canyon and streams",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "n_a",
        },
        mealsNotes:
          "Breakfast included at hotel, lunch during travel to Surabaya",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Family-friendly service",
          "Route knowledge",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Family-oriented",
          "Wildlife knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: [
          "4WD certified",
          "Sunrise viewpoint knowledge",
          "Sand driving experience",
        ],
      },
      {
        role: "Madakaripura Local Guide",
        scope: "Madakaripura segment only",
        requirements: [
          "Waterfall safety certified",
          "River crossing expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports", "Family-friendly"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom", "Luggage space for families"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand sea crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Suitable for all ages and fitness levels",
        "No special medical requirements",
      ],
      environmentalRisks: [
        "Cold 5-15°C at Bromo pre-sunrise",
        "Slippery rocks and water at Madakaripura Waterfall",
        "Wildlife safety at safari park",
        "Volcanic dust at Bromo sand sea",
      ],
      safetyMitigation: [
        "Helmets provided at waterfall",
        "Wildlife safety briefing at safari",
        "Experienced guides for family groups",
        "Weather monitoring for outdoor activities",
      ],
    },
    handoverNotes: [
      "Confirm family requirements and children's ages",
      "Coordinate safari park timing and optional activities",
      "Arrange early morning wake-up for Bromo sunrise",
      "Prepare waterproof gear for waterfall visit",
      "Confirm Surabaya dropoff preferences",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic in Prigen or Probolinggo",
      weatherDisruption:
        "Alternative activities prepared, indoor options available",
      vehicleBreakdown:
        "Backup vehicle on standby, family-friendly replacement ensured",
    },
  },
  {
    id: "package-SUB-5D4N-002",
    label:
      "5 Day Ijen, Bromo, Madakaripura & Malang City Adventure from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/bromo11.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/bromo11.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/ijen17.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/madakaripura1.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/malang.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/malang1.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 5,
    durationNights: 4,
    route: [
      "mount-ijen",
      "mount-bromo",
      "madakaripura-waterfall",
      "malang-city",
    ],
    description:
      "Embark on an exhilarating 5-day journey through East Java's most captivating landscapes. Begin your adventure with a drive from Surabaya to Bondowoso, setting the stage for an incredible exploration. On Day 2, trek to the stunning Ijen Crater, witnessing the mesmerizing blue flames and the turquoise crater lake at sunrise, before continuing to the quaint village of Cemoro Lawang, your gateway to Mount Bromo. Day 3 begins early with an unforgettable Bromo Sunrise experience, where you can also enjoy a spectacular stargazing opportunity over the volcanic landscape. Afterward, visit the majestic Madakaripura Waterfall before continuing to the vibrant city of Malang. On Day 4, explore Batu City on a sightseeing tour, enjoying its cultural and natural highlights, and end the day at the bustling Surabaya Night Market. On Day 5, conclude your journey with a comfortable transfer from your hotel to the airport, ensuring a seamless end to your East Java adventure.",
    priceTiers: [
      { pax: 2, pricePerPerson: 5250000 },
      { pax: 3, pricePerPerson: 5050000 },
      { pax: 4, pricePerPerson: 4750000 },
      { pax: 5, pricePerPerson: 4750000 },
      { pax: 6, pricePerPerson: 4450000 },
      { pax: 7, pricePerPerson: 4450000 },
      { pax: 8, pricePerPerson: 4050000 },
      { pax: 9, pricePerPerson: 4050000 },
      { pax: 10, pricePerPerson: 4050000 },
      { pax: 11, pricePerPerson: 3850000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Crater Hike",
      "Bromo Sunrise Tour",
      "Madakaripura Waterfall Tour",
      "Malang City Tour",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "4 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (mount-ijen, mount-bromo, madakaripura-waterfall, malang-city)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary Travel T-Shirt",
      "Meals: 4x Breakfast, 1x Lunch, 1x Dinner",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for night trek",
      "Printed passport for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes & water shoes",
      "Small daypack for essentials",
      "Rain jacket/poncho for waterfalls",
    ],
    tags: ["5d4n", "surabaya", "ijen", "bromo", "madakaripura", "malang"],
    slug: "5d4n-ijen-bromo-madakaripura-malang-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Active travelers",
      "First-time Java visitors",
      "Nature photographers",
      "Adventure seekers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: { required: ["pickupTime"], notes: "" },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "12:00",
      orientationTime: "12:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 14:00 on final day",
      estimatedArrival: "10:00-11:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "3-star equivalent",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Basic mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 3,
        area: "Malang",
        hotelStandard: "3-star equivalent",
        examples: ["Whiz Prime Malang"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
      {
        night: 4,
        area: "Surabaya",
        hotelStandard: "4-star equivalent",
        examples: ["Holiday Inn Express Surabaya Centerpoint, an IHG Hotel"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, madakaripura-waterfall",
        adjustable: true,
      },
      {
        item: "Helmets",
        for: "madakaripura-waterfall",
        issuingPoint: "Waterfall entrance",
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
        ],
      },
      {
        category: "Footwear",
        items: ["Sturdy hiking shoes", "Water shoes (waterfalls)"],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Surabaya → Ijen area",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00–18:00",
            duration: "5-6 hours",
            notes:
              "Lunch stop at local restaurant in Probolinggo (own expense)",
          },
          {
            name: "Hotel Check-in & Ijen Briefing",
            timeWindow: "18:00–19:00",
            notes: "Medical screening for Ijen trek and next day briefing",
          },
        ],
        mealsPlan: {
          breakfast: "n_a",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Dinner included at Bondowoso hotel",
        overnight: "Bondowoso/Ijen",
      },
      {
        day: 2,
        title: "Ijen Blue Fire & Transfer to Bromo",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Ijen Crater Night Trek",
            fromLocation: "Bondowoso",
            toLocation: "Mount Ijen",
            timeWindow: "00:00–09:00",
            duration: "8-9 hours",
            notes: "Blue flames observation, sunrise at crater, sulfur miners",
          },
          {
            name: "Transfer to Bromo Area",
            fromLocation: "Bondowoso",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–16:30",
            duration: "3.5 hours",
            notes: "Scenic drive through East Java highlands",
          },
        ],
        mealsPlan: { breakfast: "included", lunch: "included", dinner: "n_a" },
        mealsNotes: "Breakfast box after Ijen trek, lunch before departure",
        overnight: "Cemoro Lawang/Bromo",
      },
      {
        day: 3,
        title: "Bromo Sunrise & Madakaripura to Malang",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Bromo Stargazing & Sunrise",
            destinationName: "Mount Bromo",
            timeWindow: "02:00–09:00",
            duration: "7 hours",
            notes:
              "Private 4WD Jeep to viewpoints, crater walk, Whispering Sands",
          },
          {
            name: "Madakaripura Waterfall",
            destinationName: "Madakaripura Waterfall",
            timeWindow: "11:00–13:00",
            duration: "2 hours",
            notes: "Motorbike transfer + 30min trek with local guide",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "n_a",
        },
        mealsNotes: "Lunch at local restaurant en route to Malang",
        overnight: "Malang",
      },
      {
        day: 4,
        title: "Batu City Exploration to Surabaya",
        drivingTime: "4 hours",
        activities: [
          {
            name: "Batu City Sightseeing",
            destinationName: "Batu City",
            timeWindow: "08:00–13:00",
            duration: "5 hours",
            notes: "Omah Kayu, Taman Langit, Goa Pinus at Mount Banyak slopes",
          },
          {
            name: "Transfer to Surabaya",
            fromLocation: "Malang",
            toLocation: "Surabaya",
            timeWindow: "13:00–17:00",
            duration: "4 hours",
            notes: "Evening free for G-Walk night market exploration",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Lunch during travel to Surabaya",
        overnight: "Surabaya",
      },
      {
        day: 5,
        title: "Departure from Surabaya",
        drivingTime: "1 hour",
        activities: [
          {
            name: "Airport Transfer",
            fromLocation: "Surabaya Hotel",
            toLocation: "Juanda International Airport",
            timeWindow: "09:00–10:00",
            duration: "1 hour",
            notes: "End of program after airport dropoff",
          },
        ],
        mealsPlan: { breakfast: "included", lunch: "n_a", dinner: "n_a" },
        mealsNotes: "Breakfast at hotel before departure",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: ["Defensive driving certified", "Route knowledge"],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: ["English fluent", "First aid certified"],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: ["Local certification", "Gas mask expertise"],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["Experienced in sandy terrain"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Madakaripura segment only",
        requirements: ["Knowledge of waterfall conditions"],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand Sea crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Blood pressure and oxygen saturation check at Bondowoso hotel",
        "Medical certificate processing for Ijen authorities",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater",
        "Slippery rocks and strong water flow at Madakaripura",
        "High altitude at multiple destinations",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided at Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Regular guest condition checks",
        "Alternative routes during adverse weather",
      ],
    },
    handoverNotes: [
      "Conduct Ijen medical screening at Bondowoso hotel evening before trek",
      "Distribute gas masks and briefing at Paltuding basecamp 00:30",
      "Monitor guest fatigue levels after consecutive early starts",
      "Coordinate motorbike transfer for Madakaripura waterfall access",
      "Confirm final day flight schedules for timely airport transfer",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
    },
  },
  {
    id: "package-BALI-5D4N-001",
    label:
      "5 Day Ijen, Papuma Beach, Tumpak Sewu & Bromo Discovery from Bali to Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb5.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688370984892/bromo14.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688370984892/bromo2.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688370984892/ijen2.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688370984892/papuma.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688370984892/papuma3.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688370984892/tumpaksewu6.webp",
    ],
    originCity: "bali",
    endCity: "surabaya",
    durationDays: 5,
    durationNights: 4,
    route: [
      "mount-ijen",
      "papuma-beach",
      "tumpak-sewu-waterfall",
      "mount-bromo",
    ],
    description:
      "Your journey begins with a scenic ferry crossing from Bali to Banyuwangi, where you'll spend the night before setting out for an unforgettable trek to the stunning Ijen Crater. Witness the turquoise crater lake, meet the courageous sulfur miners, and enjoy the serene sunrise over one of Indonesia's most iconic volcanoes. Afterward, relax with a coffee break and head to Papuma Beach to catch a breathtaking sunset. Next, prepare for an early adventure to Tumpak Sewu Waterfall, often called Java's grandest waterfall for its spectacular curtain-like cascades. Trek through the canyon to fully experience its beauty before continuing to the Bromo area for a night of rest. The following day, enjoy a magical stargazing experience and witness the sunrise over Mount Bromo's dramatic landscape. Explore the Sand Sea, visit the Poten Temple, and trek up to the crater rim for panoramic views. Your adventure concludes with a scenic drive to Surabaya, where you'll enjoy a comfortable stay before departing from Juanda International Airport.",
    priceTiers: [
      { pax: 2, pricePerPerson: 5450000 },
      { pax: 3, pricePerPerson: 5250000 },
      { pax: 4, pricePerPerson: 4950000 },
      { pax: 5, pricePerPerson: 4950000 },
      { pax: 6, pricePerPerson: 4650000 },
      { pax: 7, pricePerPerson: 4650000 },
      { pax: 8, pricePerPerson: 4250000 },
      { pax: 9, pricePerPerson: 4250000 },
      { pax: 10, pricePerPerson: 4250000 },
      { pax: 11, pricePerPerson: 4050000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Crater Hike",
      "Papuma Beach Sunset Tour",
      "Tumpak Sewu Waterfall Tour",
      "Bromo Sunrise Tour",
    ],
    physicality: "Moderate to Challenging",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "4 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (mount-ijen, papuma-beach, tumpak-sewu-waterfall, mount-bromo)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary Travel T-Shirt",
      "Meals: 4x Breakfast, 2x Lunch",
      "Ferry crossing from Bali to Java",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Dinner throughout the tour",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate to good fitness level for challenging treks",
      "Printed passport for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes & water shoes",
      "Small daypack for essentials",
      "Rain jacket/poncho for waterfalls",
    ],
    tags: ["5d4n", "bali", "ijen", "papuma", "tumpaksewu", "bromo", "surabaya"],
    slug: "5d4n-ijen-papuma-tumpaksewu-bromo-from-bali",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Adventure seekers",
      "Nature lovers",
      "Photography enthusiasts",
      "Active travelers",
    ],
    start: {
      city: "bali",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: { required: ["pickupTime"], notes: "" },
      },
      latestPickupGuidance: "10:00 Bali time",
      orientationTime: "10:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 14:00 on final day",
      estimatedArrival: "11:00-12:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Banyuwangi",
        hotelStandard: "Comfortable city hotel",
        examples: ["Luminor Hotel"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Jember",
        hotelStandard: "Garden style family homestay",
        examples: ["Doho Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 3,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Traditional Javanese mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 4,
        area: "Surabaya",
        hotelStandard: "Modern city hotel",
        examples: ["Holiday Inn Express Surabaya Centerpoint"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, tumpak-sewu-waterfall",
        adjustable: true,
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Trekking sandals/water shoes",
          "Beach footwear",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Crossing to Java - From Bali to Banyuwangi",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Bali to Gilimanuk Transfer",
            fromLocation: "Bali",
            toLocation: "Gilimanuk Port",
            timeWindow: "10:00–14:00",
            duration: "4 hours",
            notes: "Scenic drive through Bali to ferry port",
          },
          {
            name: "Ferry Crossing to Java",
            fromLocation: "Gilimanuk Port",
            toLocation: "Ketapang Port",
            timeWindow: "14:00–15:00",
            duration: "1 hour",
            notes: "Ferry from Gilimanuk to Ketapang Port with mountain views",
          },
          {
            name: "Hotel Check-in Banyuwangi",
            destinationName: "Banyuwangi",
            timeWindow: "16:00–17:00",
            notes: "Check in at Luminor Hotel",
          },
        ],
        mealsPlan: {
          breakfast: "n_a",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "All meals at own expense during travel",
        overnight: "Banyuwangi",
      },
      {
        day: 2,
        title:
          "The Blue Fire of Ijen - From Sunrise at Ijen Crater to Papuma Beach Sunset",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Ijen Crater Night Trek",
            destinationName: "mount-ijen",
            timeWindow: "00:00–09:00",
            duration: "8-9 hours",
            notes:
              "Night trek to witness blue flames and sunrise over turquoise crater lake",
          },
          {
            name: "Transfer to Jember",
            fromLocation: "Ijen",
            toLocation: "Jember",
            timeWindow: "10:00–15:00",
            duration: "5 hours",
            notes: "Drive from Ijen area to Jember via Bondowoso",
          },
          {
            name: "Papuma Beach Sunset",
            destinationName: "papuma-beach",
            timeWindow: "16:00–18:00",
            duration: "2 hours",
            notes: "Visit white-sand beach for spectacular sunset views",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast box after Ijen trek, lunch at local restaurant",
        overnight: "Jember",
      },
      {
        day: 3,
        title:
          "Tumpak Sewu's Majesty - From Java's Grandest Waterfall to Mount Bromo",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Tumpak Sewu Waterfall Trek",
            destinationName: "tumpak-sewu-waterfall",
            timeWindow: "06:00–12:00",
            duration: "6 hours",
            notes:
              "Trek to Java's grandest waterfall through canyon with river crossings",
          },
          {
            name: "Transfer to Bromo Area",
            fromLocation: "Jember",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–17:00",
            duration: "4 hours",
            notes: "Drive from Jember to Cemoro Lawang",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Lunch after waterfall visit",
        overnight: "Cemoro Lawang/Bromo",
      },
      {
        day: 4,
        title:
          "Bromo's Wonders - Stargazing, Sunrise, and the Surabaya Journey",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Bromo Stargazing & Sunrise",
            destinationName: "mount-bromo",
            timeWindow: "02:00–09:00",
            duration: "7 hours",
            notes:
              "Stargazing followed by sunrise over volcanic landscape with 4WD Jeep tour",
          },
          {
            name: "Transfer to Surabaya",
            fromLocation: "Cemoro Lawang",
            toLocation: "Surabaya",
            timeWindow: "11:00–16:00",
            duration: "5 hours",
            notes: "Drive from Bromo area to Surabaya",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Lunch during travel to Surabaya",
        overnight: "Surabaya",
      },
      {
        day: 5,
        title: "Farewell East Java - From Hotel to Airport",
        drivingTime: "1 hour",
        activities: [
          {
            name: "Airport Transfer",
            fromLocation: "Surabaya hotel",
            toLocation: "SUB Airport",
            timeWindow: "09:00–10:00",
            duration: "1 hour",
            notes: "Transfer to Juanda International Airport",
          },
        ],
        mealsPlan: { breakfast: "included", lunch: "n_a", dinner: "n_a" },
        mealsNotes: "End of program after airport dropoff",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Ferry crossing experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Cross-island logistics",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur mine knowledge",
        ],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Tumpak Sewu segment only",
        requirements: [
          "Canyon navigation",
          "Flash flood awareness",
          "First aid certified",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand Sea crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Medical certificate processing for Ijen authorities",
        "Fitness assessment for challenging treks (Ijen and Tumpak Sewu)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater - not suitable for respiratory conditions",
        "Slippery rocks and flash flood risk at Tumpak Sewu",
        "Strong waves at Papuma Beach",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided at Ijen",
        "Headlamps for night treks",
        "Local guides at challenging sections",
        "Weather monitoring for waterfall safety",
        "Regular guest condition checks",
      ],
    },
    handoverNotes: [
      "Coordinate Bali pickup timing with ferry schedule",
      "Conduct Ijen medical screening at Banyuwangi hotel",
      "Monitor guest fatigue after consecutive early starts and long drives",
      "Check weather conditions for Tumpak Sewu waterfall safety",
      "Confirm final day flight schedules for timely airport transfer",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, ferry cancellation contingencies",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 3-hour response time for remote areas",
    },
  },
  {
    id: "package-SUB-5D4N-001",
    label:
      "5 Day Ijen, Papuma Beach, Tumpak Sewu & Bromo Nature Trip from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/ijen-bromo-tumpak-sewu-malang-sightseeing-tour-1676526893742/1687320433_IJEN31.webp",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688629701719/bromo11.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688629701719/bromo13.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688629701719/papuma.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688629701719/papuma3.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688629701719/tumpaksewu6.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-ijen-papuma-beach-tumpak-sewu-bromo-surabaya-(5d-4n)-1688629701719/1687447787_WhatsApp Image 2019-05-12 at 2.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb3.jpg",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 5,
    durationNights: 4,
    route: [
      "mount-ijen",
      "papuma-beach",
      "tumpak-sewu-waterfall",
      "mount-bromo",
    ],
    description:
      "Embark on an exciting 5-day journey through East Java's most iconic landscapes. This adventure is perfect for nature enthusiasts and explorers eager to witness breathtaking sights. Begin with a trek to Ijen Crater to witness the rare blue flames and the stunning turquoise crater lake at sunrise. Next, relax at the pristine shores of Papuma Beach, known for its white sands and clear waters. The journey continues to the majestic Tumpak Sewu Waterfall, a multi-tiered waterfall surrounded by lush greenery. Finally, experience the mesmerizing sunrise over Mount Bromo, illuminating the vast caldera and surrounding peaks. Throughout the tour, enjoy comfortable accommodations, private transportation, and the guidance of experienced English-speaking guides.",
    priceTiers: [
      { pax: 1, pricePerPerson: 9050000 },
      { pax: 2, pricePerPerson: 5050000 },
      { pax: 3, pricePerPerson: 4850000 },
      { pax: 4, pricePerPerson: 4550000 },
      { pax: 5, pricePerPerson: 4250000 },
      { pax: 6, pricePerPerson: 3850000 },
      { pax: 7, pricePerPerson: 3650000 },
      { pax: 8, pricePerPerson: 3650000 },
      { pax: 9, pricePerPerson: 3650000 },
      { pax: 10, pricePerPerson: 3650000 },
      { pax: 11, pricePerPerson: 3650000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Blue Fire",
      "Papuma Beach Sunset",
      "Tumpak Sewu Waterfall",
      "Bromo Sunrise",
    ],
    physicality: "Moderate",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "4 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Ijen, Papuma Beach, Tumpak Sewu, Bromo)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary travel T-shirt",
      "Trekking poles for Ijen and Tumpak Sewu",
      "Medical certificate arrangement for Ijen",
      "Malabar Coffee Plantation visit",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Lunch on day 1, 4, 5 and dinner on day 2, 3, 4, 5",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate fitness for multiple treks",
      "Printed passport copy for Ijen permit",
      "Warm clothing (5–15°C) and beachwear",
      "Sturdy hiking shoes and water shoes",
      "Small daypack for essentials",
      "Medical check-up for Ijen trekking",
    ],
    tags: [
      "5d4n",
      "surabaya",
      "ijen",
      "papuma-beach",
      "tumpak-sewu",
      "bromo",
      "extended-tour",
      "nature-trip",
    ],
    slug: "5d-ijen-papuma-tumpak-sewu-bromo-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Nature enthusiasts",
      "Explorers",
      "Extended vacation travelers",
      "Photography enthusiasts",
      "Comprehensive Java experience seekers",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "International Arrival Gate",
        },
        hotel: {
          required: ["pickupTime", "hotelName", "address"],
          notes: "Pickup from Surabaya city center hotels",
        },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "16:00",
      orientationTime: "16:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 14:00 on final day",
      estimatedArrival: "11:00-12:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "3-star equivalent",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Jember City",
        hotelStandard: "Garden-style family homestay with pool",
        examples: ["Doho Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 3,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Strategic location for sunrise access",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 4,
        area: "Surabaya City",
        hotelStandard: "Modern city hotel with full amenities",
        examples: ["Holiday Inn Express Surabaya Centerpoint"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, tumpak-sewu-waterfall",
        adjustable: true,
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
          "Beachwear for Papuma",
          "Comfortable city wear",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Water shoes (waterfalls)",
          "Sandals for beach",
          "Casual shoes for city",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
          "Swimwear",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Arrival in Surabaya and Journey to Bondowoso",
        drivingTime: "5-6 hours",
        activities: [
          {
            name: "Transfer to Bondowoso",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00–17:00",
            duration: "5-6 hours",
            notes:
              "Scenic drive through East Java countryside with lunch stop in Probolinggo",
          },
          {
            name: "Hotel Check-in",
            destinationName: "Bondowoso",
            timeWindow: "17:00–18:00",
            notes: "Check in at Riverside Homestay and Ijen preparation",
          },
        ],
        mealsPlan: {
          breakfast: "own_expense",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Dinner included at Bondowoso hotel",
        overnight: "Bondowoso/Ijen",
      },
      {
        day: 2,
        title: "Ijen Crater Adventure and Papuma Beach Sunset",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Transfer to Paltuding",
            fromLocation: "Bondowoso",
            toLocation: "Paltuding",
            timeWindow: "00:00–02:30",
            duration: "2.5 hours",
            notes: "Night drive to Ijen basecamp for blue fire trek",
          },
          {
            name: "Ijen Crater Trek",
            destinationName: "Mount Ijen",
            timeWindow: "02:30–08:00",
            duration: "5.5 hours",
            notes:
              "Night trek for blue fire, sunrise views, turquoise lake, sulfur miners observation",
          },
          {
            name: "Malabar Coffee Plantation",
            destinationName: "Malabar Coffee Plantation",
            timeWindow: "09:00–10:00",
            duration: "1 hour",
            notes: "Coffee break and local snacks at plantation",
          },
          {
            name: "Papuma Beach Sunset",
            destinationName: "Papuma Beach",
            timeWindow: "16:00–18:00",
            duration: "2 hours",
            notes: "Beach relaxation and sunset viewing at white sand beach",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast after Ijen trek, lunch before transfer to Jember",
        overnight: "Jember City",
      },
      {
        day: 3,
        title: "Tumpak Sewu Waterfall and Journey to Bromo",
        drivingTime: "4-5 hours",
        activities: [
          {
            name: "Tumpak Sewu Waterfall Exploration",
            destinationName: "Tumpak Sewu Waterfall",
            timeWindow: "07:30–12:00",
            duration: "4.5 hours",
            notes:
              "Trek to multi-tiered waterfall with bamboo ladders and natural water spa",
          },
          {
            name: "Transfer to Bromo Highlands",
            fromLocation: "Jember",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–17:00",
            duration: "4 hours",
            notes: "Scenic drive from coastal area to volcanic highlands",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes:
          "Breakfast before waterfall visit, lunch before departure to Bromo",
        overnight: "Cemoro Lawang/Bromo",
      },
      {
        day: 4,
        title: "Bromo Sunrise Adventure and Return to Surabaya",
        drivingTime: "3-4 hours",
        activities: [
          {
            name: "Bromo Sunrise Jeep Tour",
            fromLocation: "Cemoro Lawang",
            toLocation: "Kingkong Hill/Penanjakan",
            timeWindow: "02:00–03:30",
            duration: "1.5 hours",
            notes: "4WD jeep transfer for stargazing and sunrise viewing",
          },
          {
            name: "Bromo Crater Exploration",
            destinationName: "Mount Bromo",
            timeWindow: "06:30–10:00",
            duration: "3.5 hours",
            notes:
              "Sea of Sand crossing, optional horse ride, 253-step climb to crater rim",
          },
          {
            name: "Return to Surabaya",
            fromLocation: "Bromo",
            toLocation: "Surabaya",
            timeWindow: "12:00–15:00",
            duration: "3 hours",
            notes: "Direct transfer to Surabaya for overnight stay",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast at Bromo hotel before departure",
        overnight: "Surabaya City",
      },
      {
        day: 5,
        title: "Departure from Surabaya",
        drivingTime: "1-2 hours",
        activities: [
          {
            name: "Hotel Check-out",
            destinationName: "Surabaya",
            timeWindow: "09:00–11:00",
            duration: "2 hours",
            notes: "Breakfast and preparation for departure",
          },
          {
            name: "Airport Transfer",
            fromLocation: "Surabaya Hotel",
            toLocation: "Juanda International Airport",
            timeWindow: "11:00–12:00",
            duration: "1 hour",
            notes: "Transfer to airport for departure, end of extended tour",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast included at hotel",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Extended trip experience",
          "Coastal and mountain terrain expertise",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
          "Extended itinerary management",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Tumpak Sewu segment only",
        requirements: [
          "Local terrain knowledge",
          "Water safety awareness",
          "Bamboo ladder expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports", "Extended comfort seating"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sea of Sand crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Medical certificate processing for Ijen authorities",
        "Fitness assessment for challenging treks (Ijen and Tumpak Sewu)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater - not suitable for respiratory conditions",
        "Slippery rocks and bamboo ladders at Tumpak Sewu",
        "Strong waves and currents at Papuma Beach",
        "Extended driving fatigue",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides with safety equipment at Tumpak Sewu",
        "Weather monitoring for beach conditions",
        "Regular guest condition checks during extended itinerary",
        "Adequate rest periods between activities",
      ],
    },
    handoverNotes: [
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to beach activities",
      "Coordinate timing for Papuma Beach sunset viewing",
      "Ensure proper footwear for Tumpak Sewu bamboo ladders and wet terrain",
      "Manage pacing for extended 5-day itinerary to prevent fatigue",
      "Confirm flight timings for final day Surabaya dropoff",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      beachSafety:
        "Monitor tide conditions, provide swimming safety briefings at Papuma",
      guestFatigue:
        "Flexible pacing, optional rest periods, hydration monitoring for extended trip",
    },
  },
  {
    id: "package-SUB-6D5N-001",
    label:
      "6 Day Ijen, Papuma Beach, Tumpak Sewu, Bromo & Malang City Discovery from Surabaya",
    imageUrl:
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new5.jpg",
    gallery: [
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/bromo8.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/ijen2.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/ijen8.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/papuma.webp",
      "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/tumpaksewu2.webp",
    ],
    originCity: "surabaya",
    endCity: "surabaya",
    durationDays: 6,
    durationNights: 5,
    route: [
      "mount-ijen",
      "papuma-beach",
      "tumpak-sewu-waterfall",
      "mount-bromo",
      "malang-city",
    ],
    description:
      "Experience the Ultimate East Java Journey, a 6-day exploration that combines breathtaking landscapes, thrilling adventures, and cultural discoveries. Start your trip with a scenic drive from Surabaya to Bondowoso, where you'll rest before embarking on a midnight adventure to Ijen Crater. Witness the stunning Blue Fire and vibrant crater lake at sunrise, followed by a visit to Papuma Beach to enjoy a tranquil sunset. Afterward, explore the famous Tumpak Sewu Waterfall, then continue to the Bromo area for the night. The journey continues with an early morning stargazing experience at Mount Bromo, where you'll witness the sunrise over a landscape of volcanic peaks. A thrilling ride through the Sand Sea takes you to the Bromo Crater, before heading to Malang for a relaxing evening. On Day 5, explore Batu City, known for its scenic views, colorful Jodipan Village, and apple harvesting. Finally, return to Surabaya, where the adventure concludes with a transfer to the airport.",
    priceTiers: [
      { pax: 2, pricePerPerson: 6050000 },
      { pax: 3, pricePerPerson: 5750000 },
      { pax: 4, pricePerPerson: 5550000 },
      { pax: 5, pricePerPerson: 5550000 },
      { pax: 6, pricePerPerson: 5250000 },
      { pax: 7, pricePerPerson: 5250000 },
      { pax: 8, pricePerPerson: 4950000 },
      { pax: 9, pricePerPerson: 4950000 },
      { pax: 10, pricePerPerson: 4950000 },
      { pax: 11, pricePerPerson: 4750000 },
    ],
    itinerary: [],
    keyExperiences: [
      "Ijen Crater Hike",
      "Papuma Beach Sunset Tour",
      "Tumpak Sewu Waterfall Tour",
      "Bromo Sunrise Tour",
      "Malang City Tour",
    ],
    physicality: "Moderate to Challenging",
    inclusions: [
      "Private transport (fuel, tolls, parking included)",
      "5 nights accommodation with daily breakfast",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (mount-ijen, papuma-beach, tumpak-sewu-waterfall, mount-bromo, malang-city)",
      "Professional-grade gas masks & headlamps for Ijen",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "Ijen health screening & digital clearance",
      "Complimentary Travel T-Shirt",
      "Meals: 5x Breakfast, 2x Lunch, 1x Dinner",
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Visa & Travel Insurance",
      "Meals not stated in the itinerary",
      "Personal expenses and tips",
      "Optional activities (horse riding, trolley ojek)",
      "Additional dinners throughout the tour",
    ],
    addOns: [
      {
        name: "Horse Ride at Bromo",
        description: "Ride a horse across the Sea of Sand to the crater base",
        price: "IDR 150,000–350,000 (on-site cash)",
      },
      {
        name: "Ijen Trolley Ojek",
        description: "Optional assistance service during the trek",
        price: "Variable (on-site cash)",
      },
    ],
    travelerRequirements: [
      "Moderate to good fitness level for challenging treks",
      "Printed passport for Ijen permit",
      "Warm clothing (5–15°C)",
      "Sturdy hiking shoes & water shoes",
      "Small daypack for essentials",
      "Rain jacket/poncho for waterfalls",
    ],
    tags: [
      "6d5n",
      "surabaya",
      "ijen",
      "papuma",
      "tumpaksewu",
      "bromo",
      "malang",
    ],
    slug: "6d5n-ijen-papuma-tumpaksewu-bromo-malang-from-surabaya",
    aggregateRating: { ratingValue: 4.8, reviewCount: 51 },
    isFeatured: false,
    recommendedFor: [
      "Adventure seekers",
      "Nature lovers",
      "Cultural explorers",
      "Photography enthusiasts",
    ],
    start: {
      city: "surabaya",
      pickupOptions: {
        airport: {
          required: ["flightNumber", "route", "eta"],
          meetingPoint: "Juanda International Airport Arrival Gate",
        },
        hotel: { required: ["pickupTime"], notes: "" },
        train: {
          required: ["station", "trainName", "route", "eta"],
          meetingPoint: "Main station entrance",
        },
      },
      latestPickupGuidance: "12:00",
      orientationTime: "12:30",
    },
    end: {
      city: "surabaya",
      dropoffOptions: ["airport", "hotel", "train"],
      safeFlightNote: "Recommend flights after 14:00 on final day",
      estimatedArrival: "11:00-12:00",
    },
    accommodationPlan: [
      {
        night: 1,
        area: "Bondowoso/Ijen",
        hotelStandard: "Nature retreat homestay with tropical gardens",
        examples: ["Riverside Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 2,
        area: "Jember",
        hotelStandard: "Garden style family homestay with pool",
        examples: ["Doho Homestay"],
        checkinTime: "14:00",
        checkoutTime: "11:00",
      },
      {
        night: 3,
        area: "Cemoro Lawang/Bromo",
        hotelStandard: "Traditional Javanese mountain lodge",
        examples: ["Joglo Kecombrang Bromo"],
        checkinTime: "14:00",
        checkoutTime: "10:00",
      },
      {
        night: 4,
        area: "Malang",
        hotelStandard: "City hotel with modern amenities",
        examples: ["Whiz Prime Malang"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
      {
        night: 5,
        area: "Surabaya",
        hotelStandard: "Modern city hotel",
        examples: ["Holiday Inn Express Surabaya Centerpoint"],
        checkinTime: "14:00",
        checkoutTime: "12:00",
      },
    ],
    gearProvided: [
      {
        item: "Gas masks",
        for: "mount-ijen",
        cleaningProtocol: "Sterilized after each use",
        issuingPoint: "Paltuding basecamp",
      },
      {
        item: "Headlamps",
        for: "mount-ijen, mount-bromo",
        batteryCheck: "Pre-trek verification",
      },
      {
        item: "Trekking poles",
        for: "mount-ijen, tumpak-sewu-waterfall",
        adjustable: true,
      },
    ],
    gearRecommended: [
      {
        category: "Clothing",
        items: [
          "Warm layers (5–15°C)",
          "Waterproof jacket",
          "Beanie & gloves",
          "Quick-dry clothes for waterfalls",
        ],
      },
      {
        category: "Footwear",
        items: [
          "Sturdy hiking shoes",
          "Trekking sandals/water shoes",
          "Comfortable walking shoes",
        ],
      },
      {
        category: "Accessories",
        items: [
          "Small daypack",
          "Waterproof bag",
          "Sunscreen",
          "Personal medications",
          "Camera with protective cover",
        ],
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: "Welcome to East Java – From Surabaya to Bondowoso",
        drivingTime: "5 hours",
        activities: [
          {
            name: "Surabaya to Bondowoso Transfer",
            fromLocation: "Surabaya",
            toLocation: "Bondowoso",
            timeWindow: "12:00–17:00",
            duration: "5 hours",
            notes: "Scenic drive from Surabaya to Bondowoso via Probolinggo",
          },
          {
            name: "Hotel Check-in Bondowoso",
            destinationName: "Bondowoso",
            timeWindow: "17:00–18:00",
            notes: "Check in at Riverside Homestay and rest",
          },
        ],
        mealsPlan: {
          breakfast: "n_a",
          lunch: "own_expense",
          dinner: "included",
        },
        mealsNotes: "Lunch at own expense at local restaurant in Probolinggo",
        overnight: "Bondowoso",
      },
      {
        day: 2,
        title:
          "The Blue Fire of Ijen – From Sunrise at Ijen Crater to Papuma Beach Sunset",
        drivingTime: "6-7 hours",
        activities: [
          {
            name: "Ijen Crater Night Trek",
            destinationName: "mount-ijen",
            timeWindow: "00:00–09:00",
            duration: "9 hours",
            notes:
              "Night trek to witness blue flames and sunrise over turquoise crater lake",
          },
          {
            name: "Transfer to Jember",
            fromLocation: "Ijen",
            toLocation: "Jember",
            timeWindow: "10:00–15:00",
            duration: "5 hours",
            notes: "Drive from Ijen area to Jember via Bondowoso",
          },
          {
            name: "Papuma Beach Sunset",
            destinationName: "papuma-beach",
            timeWindow: "16:00–18:00",
            duration: "2 hours",
            notes: "Visit white-sand beach for spectacular sunset views",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Breakfast box after Ijen trek, lunch at local restaurant",
        overnight: "Jember",
      },
      {
        day: 3,
        title: "Tumpak Sewu Waterfall to Cemoro Lawang",
        drivingTime: "4 hours",
        activities: [
          {
            name: "Tumpak Sewu Waterfall Trek",
            destinationName: "tumpak-sewu-waterfall",
            timeWindow: "06:00–12:00",
            duration: "6 hours",
            notes:
              "Trek to Java's 'Thousand Waterfalls' through canyon with river crossings",
          },
          {
            name: "Transfer to Bromo Area",
            fromLocation: "Jember",
            toLocation: "Cemoro Lawang",
            timeWindow: "13:00–16:00",
            duration: "3 hours",
            notes: "Drive from Jember to Cemoro Lawang",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "included",
          dinner: "own_expense",
        },
        mealsNotes: "Lunch after waterfall exploration",
        overnight: "Cemoro Lawang/Bromo",
      },
      {
        day: 4,
        title: "Bromo Stargazing and Sunrise – From Bromo to Malang City",
        drivingTime: "3 hours",
        activities: [
          {
            name: "Bromo Stargazing & Sunrise",
            destinationName: "mount-bromo",
            timeWindow: "02:00–09:00",
            duration: "7 hours",
            notes:
              "Stargazing followed by sunrise over volcanic landscape with 4WD Jeep tour",
          },
          {
            name: "Transfer to Malang",
            fromLocation: "Cemoro Lawang",
            toLocation: "Malang",
            timeWindow: "12:00–15:00",
            duration: "3 hours",
            notes: "Drive from Bromo area to Malang City",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Lunch during travel to Malang",
        overnight: "Malang",
      },
      {
        day: 5,
        title: "Batu City Sightseeing – From Malang to Surabaya",
        drivingTime: "3 hours",
        activities: [
          {
            name: "Batu City Sightseeing",
            destinationName: "malang-city",
            timeWindow: "08:00–13:00",
            duration: "5 hours",
            notes:
              "Visit Jodipan Rainbow Village, San Terra Delaponte, Taman Langit, Goa Pinus",
          },
          {
            name: "Transfer to Surabaya",
            fromLocation: "Malang",
            toLocation: "Surabaya",
            timeWindow: "13:00–16:00",
            duration: "3 hours",
            notes: "Drive from Malang to Surabaya",
          },
        ],
        mealsPlan: {
          breakfast: "included",
          lunch: "own_expense",
          dinner: "own_expense",
        },
        mealsNotes: "Lunch during travel to Surabaya",
        overnight: "Surabaya",
      },
      {
        day: 6,
        title: "Departure from Surabaya",
        drivingTime: "1 hour",
        activities: [
          {
            name: "Airport Transfer",
            fromLocation: "Surabaya Hotel",
            toLocation: "Juanda International Airport",
            timeWindow: "09:00–10:00",
            duration: "1 hour",
            notes: "Transfer to airport for departure",
          },
        ],
        mealsPlan: { breakfast: "included", lunch: "n_a", dinner: "n_a" },
        mealsNotes: "Breakfast at hotel before departure",
        overnight: "n_a",
      },
    ],
    crewRolesNeeded: [
      {
        role: "Driver",
        scope: "Full trip",
        requirements: [
          "Defensive driving certified",
          "Route knowledge",
          "Extended trip experience",
        ],
      },
      {
        role: "Escort Guide",
        scope: "Full trip",
        requirements: [
          "English fluent",
          "First aid certified",
          "Multi-destination expertise",
          "Extended itinerary management",
        ],
      },
      {
        role: "Ijen Local Guide",
        scope: "Ijen segment only",
        requirements: [
          "Local certification",
          "Gas mask expertise",
          "Sulfur safety knowledge",
        ],
      },
      {
        role: "Bromo Jeep Driver",
        scope: "Bromo segment only",
        requirements: ["4WD experience", "Sunrise route knowledge"],
      },
      {
        role: "Waterfall Local Guide",
        scope: "Tumpak Sewu segment only",
        requirements: [
          "Local terrain knowledge",
          "Water safety awareness",
          "Bamboo ladder expertise",
        ],
      },
    ],
    vehiclePlan: {
      primary: [
        {
          type: "MPV",
          model: "Toyota Avanza/Innova",
          maxPax: 3,
          baggageCapacity: "3 medium bags",
          features: ["AC", "Charging ports", "Extended comfort seating"],
        },
        {
          type: "Hiace",
          model: "Toyota Hiace",
          maxPax: 11,
          baggageCapacity: "11 medium bags",
          features: ["AC", "Spacious legroom"],
        },
      ],
      jeepRequiredAt: ["mount-bromo"],
      jeepSpecs: {
        type: "4WD Jeep",
        capacity: "4-6 pax",
        inclusions: [
          "Experienced driver",
          "Sunrise viewpoint access",
          "Sand Sea crossing",
        ],
      },
    },
    operationalNotes: {
      healthRequirements: [
        "Ijen health screening & digital clearance mandatory",
        "Medical certificate processing for Ijen authorities",
        "Fitness assessment for challenging treks (Ijen and Tumpak Sewu)",
      ],
      environmentalRisks: [
        "Cold 5–15°C at Bromo pre-sunrise and Ijen night trek",
        "Sulfur gas exposure at Ijen crater - not suitable for respiratory conditions",
        "Slippery rocks and bamboo ladders at Tumpak Sewu",
        "Strong waves and currents at Papuma Beach",
        "Extended driving fatigue",
      ],
      safetyMitigation: [
        "Sanitized gas masks provided for Ijen",
        "Headlamps for night treks",
        "Local guides with safety equipment at Tumpak Sewu",
        "Weather monitoring for beach conditions",
        "Regular guest condition checks during extended itinerary",
        "Adequate rest periods between activities",
      ],
    },
    handoverNotes: [
      "Ensure medical check-up completed at Bondowoso hotel before Ijen trek",
      "Monitor guest condition post-Ijen before continuing to beach activities",
      "Coordinate timing for Papuma Beach sunset viewing",
      "Ensure proper footwear for Tumpak Sewu bamboo ladders and wet terrain",
      "Manage pacing for extended 6-day itinerary to prevent fatigue",
      "Confirm flight timings for final day Surabaya dropoff",
    ],
    emergencyProtocols: {
      medicalEmergency:
        "Contact JVTO Ops +62 822-4478-8833, proceed to nearest clinic/hospital",
      weatherDisruption:
        "Alternative itinerary prepared, guest safety first decision-making",
      vehicleBreakdown:
        "Backup vehicle on standby, maximum 2-hour response time",
      beachSafety:
        "Monitor tide conditions, provide swimming safety briefings at Papuma",
      guestFatigue:
        "Flexible pacing, optional rest periods, hydration monitoring for extended trip",
    },
  },
];
