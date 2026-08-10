
import { TourPackage, Difficulty } from '@/typesNew';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 10 }).format(price);
};

export const FEATURED_TOURS: TourPackage[] = [
  {
    id: "SUB-1D1N-001",
    slug: "1d1n-bromo-midnight-sunrise-from-surabaya",
    name: "1 Day Bromo Midnight Experience from Surabaya",
    shortLabel: "1D1N Bromo Midnight Tour (SUB)",
    originCity: "Surabaya",
    duration: "1 Day",
    priceFrom: 1000000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "Experience the magic of Mount Bromo on this unforgettable one-day sunrise tour. Your adventure begins with a midnight pickup from Surabaya for a scenic 2-hour drive to Mount Bromo. Switch to a vintage 4WD Jeep for a thrilling ride to Kingkong Hill.",
    highlights: [
      "Midnight departure for optimal sunrise timing at Kingkong Hill",
      "Vintage 4WD Jeep experience to sunrise viewpoint",
      "Bromo crater exploration with sulfur smoke views",
      "Whispering Sand mystical landscape discovery",
      "Complete experience returning to Surabaya by noon"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new4.jpg",
    gallery: [
        "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new4.jpg",
        "https://legacy.javavolcano-touroperator.com/assets/img/destinations/surabaya-mt.-bromo-1-day-tour-1692564153744/bromo11.webp"
    ],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["1d1n", "surabaya", "bromo", "sunrise", "midnight-tour"],
    inclusions: [
      "Private transport (MPV for 1-3 guests, Hiace Van for 4-11 guests)",
      "Private 4WD Jeep for Bromo sunrise tour",
      "All entrance fees & permits (Mount Bromo)",
      "Bottled mineral water during transfers",
      "English-speaking guide services",
      "1 breakfast at local restaurant",
      "Complimentary travel T-shirt"
    ],
    exclusions: [
      "International/Domestic Air Tickets",
      "Indonesian VISA",
      "Travel Insurance",
      "Meals not stated in itinerary",
      "Personal expenses and tips",
      "Optional horse riding at Bromo"
    ],
    travelerRequirements: [
      "Moderate fitness for stair climbing",
      "Warm clothing (5-15°C)",
      "Sturdy hiking shoes"
    ],
    itinerary: [
      {
        day: 1,
        title: "Surabaya - Mt. Bromo - Surabaya",
        summary: "Midnight start from Surabaya for Bromo sunrise experience and return by noon",
        activities: [
          { type: "Travel", name: "Midnight Departure", description: "Pickup from Surabaya hotel", timeWindow: "00:00-02:00" },
          { type: "Activity", name: "Jeep Transfer", description: "Switch to 4WD Jeep", timeWindow: "02:00-03:00" },
          { type: "Activity", name: "Bromo Sunrise", description: "Spectacular sunrise over volcanic landscape", timeWindow: "03:00-06:00" },
          { type: "Activity", name: "Crater Exploration", description: "Climb 250 steps to crater rim", timeWindow: "06:00-08:00" },
          { type: "Travel", name: "Return", description: "Journey back to Surabaya", timeWindow: "10:00-12:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "n/a", dinner: "n/a" }
      }
    ]
  },
  {
    id: "SUB-2D1N-002",
    slug: "2d1n-bromo-madakaripura-from-surabaya",
    name: "2 Day Bromo Sunrise Adventure from Surabaya",
    shortLabel: "2D1N Bromo & Madakaripura (SUB)",
    originCity: "Surabaya",
    duration: "2 Days, 1 Night",
    priceFrom: 1750000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "Embark on an exhilarating 2-day journey exploring East Java's iconic volcanic landscapes. Start from Surabaya City and journey to the village of Cemoro Lawang. Experience the magical Bromo Stargaze followed by a spectacular sunrise.",
    highlights: [
      "Iconic Bromo sunrise with Milky Way stargazing experience",
      "4WD Jeep adventure across the volcanic sand sea",
      "Visit Java's highest waterfall at Madakaripura",
      "Perfect short escape from Surabaya with maximum impact"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new2.jpg",
    gallery: [
        "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new2.jpg"
    ],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["2d1n", "surabaya", "bromo", "madakaripura", "sunrise"],
    inclusions: [
      "Private transport & fuel",
      "1 night accommodation with breakfast",
      "Private 4WD Jeep for Bromo",
      "All entrance fees (Bromo, Madakaripura)",
      "Helmets for waterfall",
      "English-speaking guide",
      "Complimentary T-shirt"
    ],
    exclusions: [
      "Flights & Visa",
      "Travel Insurance",
      "Lunch and Dinner",
      "Personal expenses",
      "Horse riding"
    ],
    travelerRequirements: [
      "Moderate fitness",
      "Warm clothing (5-15°C)",
      "Water shoes for waterfall"
    ],
    itinerary: [
      {
        day: 1,
        title: "Journey to the Highlands",
        summary: "Transfer from Surabaya to Bromo highlands with hotel check-in",
        activities: [
          { type: "Travel", name: "Transfer", description: "Surabaya to Cemoro Lawang", timeWindow: "15:00-19:00" },
          { type: "CheckIn", name: "Hotel Check-in", description: "Rest before early morning", timeWindow: "19:00-20:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "own_expense" }
      },
      {
        day: 2,
        title: "The Magic of Bromo",
        summary: "Bromo sunrise experience followed by Madakaripura Waterfall",
        activities: [
          { type: "Activity", name: "Sunrise Jeep", description: "Transfer to viewpoint", timeWindow: "02:00-03:00" },
          { type: "Activity", name: "Sunrise & Crater", description: "Stargazing and crater hike", timeWindow: "03:00-09:00" },
          { type: "Activity", name: "Madakaripura", description: "Trek to waterfall", timeWindow: "13:00-14:30" },
          { type: "Travel", name: "Return", description: "Back to Surabaya", timeWindow: "14:30-18:30" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "n/a" }
      }
    ]
  },
  {
    id: "SUB-2D1N-001",
    slug: "2d1n-ijen-blue-fire-from-surabaya",
    name: "2 Day Ijen Blue Fire Expedition from Surabaya",
    shortLabel: "2D1N Ijen Blue Fire (SUB)",
    originCity: "Surabaya",
    duration: "2 Days, 1 Night",
    priceFrom: 1550000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "Embark on an exciting 2-day journey through East Java. Explore the magnificent Ijen Crater, known for its mesmerizing blue flames and breathtaking turquoise crater lake.",
    highlights: [
      "Witness the world-famous Ijen blue fire phenomenon",
      "See the stunning turquoise sulfuric crater lake",
      "Observe local sulfur miners",
      "Visit Malabar Coffee Plantation"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen12.webp",
    gallery: ["https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-ijen-1-day-tours-1679724664576/ijen12.webp"],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["2d1n", "surabaya", "ijen", "blue-fire", "crater-lake"],
    inclusions: [
      "Private transport",
      "1 night accommodation",
      "All entrance fees (Ijen)",
      "Gas masks & headlamps",
      "Trekking poles",
      "Ijen health screening",
      "Meals: 1B, 1L, 2D"
    ],
    exclusions: [
      "Flights & Visa",
      "Travel Insurance",
      "Personal expenses",
      "Trolley ojek"
    ],
    travelerRequirements: [
      "Moderate fitness for steep trek",
      "No respiratory conditions",
      "Printed passport copy"
    ],
    itinerary: [
      {
        day: 1,
        title: "Journey to Bondowoso",
        summary: "Transfer from Surabaya to Bondowoso with screening",
        activities: [
          { type: "Travel", name: "Transfer", description: "Surabaya to Bondowoso", timeWindow: "12:00-17:00" },
          { type: "Health", name: "Screening", description: "Pre-hike health check", timeWindow: "17:00-18:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "included" }
      },
      {
        day: 2,
        title: "Witness Blue Flames",
        summary: "Early morning Ijen Crater trek",
        activities: [
          { type: "Travel", name: "Transfer", description: "To Paltuding base", timeWindow: "00:00-02:00" },
          { type: "Activity", name: "Ijen Trek", description: "Blue fire and sunrise", timeWindow: "02:00-07:00" },
          { type: "Travel", name: "Return", description: "Back to Surabaya", timeWindow: "13:00-17:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "included", dinner: "included" }
      }
    ]
  },
  {
    id: "BALI-3D2N-001",
    slug: "3d2n-bromo-ijen-discovery-from-bali",
    name: "3 Day Bromo & Ijen Volcano Discovery from Bali",
    shortLabel: "3D2N Bromo & Ijen (BALI)",
    originCity: "Bali",
    duration: "3 Days, 2 Nights",
    priceFrom: 2850000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "Explore the stunning volcanoes of East Java on this 3-day adventure from Bali. Begin with a scenic transfer, experience Bromo sunrise, visit Madakaripura, and witness the magical blue fire of Ijen Crater.",
    highlights: [
      "Witness Ijen's blue fire phenomenon",
      "Iconic Bromo sunrise with Milky Way",
      "Explore Java's highest waterfall at Madakaripura",
      "Cross-island adventure from Bali"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/00000IMG_00000_BURST20230827072437106_COVER1.webp",
    gallery: ["https://legacy.javavolcano-touroperator.com/assets/img/destinations/bali-bromo-ijen-bali-(3d-2n)-1698473982924/00000IMG_00000_BURST20230827072437106_COVER1.webp"],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["3d2n", "bali", "bromo", "ijen", "blue-fire", "cross-island"],
    inclusions: [
      "Private transport",
      "2 nights accommodation",
      "Jeep for Bromo",
      "All entrance fees",
      "Gas masks & headlamps",
      "Ijen health screening",
      "Ferry tickets (Return)",
      "Meals: 2B, 1D"
    ],
    exclusions: [
      "Flights & Visa",
      "Travel Insurance",
      "Lunches and some dinners",
      "Personal expenses"
    ],
    travelerRequirements: [
      "Good physical fitness",
      "No respiratory conditions",
      "Warm clothing"
    ],
    itinerary: [
      {
        day: 1,
        title: "Bali to East Java",
        summary: "Cross-island transfer to Bromo area",
        activities: [
          { type: "Travel", name: "Ferry", description: "Crossing to Java", timeWindow: "12:00-13:00" },
          { type: "Travel", name: "Transfer", description: "To Cemoro Lawang", timeWindow: "13:00-17:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "own_expense" }
      },
      {
        day: 2,
        title: "Bromo Sunrise",
        summary: "Bromo sunrise, Madakaripura, transfer to Bondowoso",
        activities: [
          { type: "Activity", name: "Bromo Sunrise", description: "Jeep & Trek", timeWindow: "03:30-09:00" },
          { type: "Activity", name: "Madakaripura", description: "Waterfall Trek", timeWindow: "13:30-15:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "included" }
      },
      {
        day: 3,
        title: "Ijen Blue Fire",
        summary: "Ijen Crater trek and return to Bali",
        activities: [
          { type: "Activity", name: "Ijen Trek", description: "Blue fire & sunrise", timeWindow: "02:00-08:00" },
          { type: "Travel", name: "Return", description: "Ferry back to Bali", timeWindow: "11:00-14:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "n/a" }
      }
    ]
  },
  {
    id: "SUB-3D2N-003",
    slug: "3d-bromo-madakaripura-ijen-from-surabaya-to-bali",
    name: "3 Day Bromo, Madakaripura & Ijen Overland (SUB to BALI)",
    shortLabel: "3D2N Bromo-Ijen (SUB-BALI)",
    originCity: "Surabaya",
    duration: "3 Days, 2 Nights",
    priceFrom: 2450000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "Join a thrilling 3-day journey from Surabaya to Bali. Start with a sunrise visit to Mount Bromo, visit Madakaripura Waterfall, and embark on a nighttime hike to Ijen Crater before crossing to Bali.",
    highlights: [
      "Iconic Bromo sunrise",
      "Towering Madakaripura Waterfall",
      "Mesmerizing Ijen Blue Fire",
      "Seamless transfer to Bali"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb4.jpg",
    gallery: ["https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb4.jpg"],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["3d2n", "surabaya", "bali", "overland", "bromo", "ijen"],
    inclusions: [
      "Private transport",
      "2 nights accommodation",
      "Jeep for Bromo",
      "All entrance fees",
      "Gas masks & headlamps",
      "Ijen health screening",
      "Ferry ticket to Bali",
      "Meals: 2B, 1D"
    ],
    exclusions: [
      "Flights",
      "Travel Insurance",
      "Lunches and some dinners",
      "Personal expenses"
    ],
    travelerRequirements: [
      "Moderate fitness",
      "Printed passport copy",
      "Warm clothing"
    ],
    itinerary: [
      {
        day: 1,
        title: "Surabaya to Bromo",
        summary: "Pickup and scenic drive to Bromo highlands",
        activities: [
          { type: "Travel", name: "Transfer", description: "To Cemoro Lawang", timeWindow: "12:00-16:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "own_expense" }
      },
      {
        day: 2,
        title: "Bromo & Waterfall",
        summary: "Sunrise at Bromo, Madakaripura, transfer to Bondowoso",
        activities: [
          { type: "Activity", name: "Sunrise", description: "Kingkong Hill & Crater", timeWindow: "02:00-09:00" },
          { type: "Activity", name: "Waterfall", description: "Madakaripura Trek", timeWindow: "13:30-15:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "included" }
      },
      {
        day: 3,
        title: "Ijen to Bali",
        summary: "Ijen night trek and ferry to Bali",
        activities: [
          { type: "Activity", name: "Ijen Trek", description: "Blue fire & sunrise", timeWindow: "00:00-08:00" },
          { type: "Travel", name: "Transfer", description: "To Bali via ferry", timeWindow: "09:00-12:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "n/a" }
      }
    ]
  },
  {
    id: "SUB-3D2N-002",
    slug: "3d-ijen-bromo-madakaripura-from-surabaya",
    name: "3 Day Ijen, Bromo & Madakaripura Waterfall from Surabaya",
    shortLabel: "3D2N Ijen-Bromo-Madakaripura (SUB)",
    originCity: "Surabaya",
    duration: "3 Days, 2 Nights",
    priceFrom: 2450000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "A 3-day journey exploring Ijen Crater first, then Mount Bromo and Madakaripura. Perfect for those who want to tackle the hardest hike first.",
    highlights: [
      "Ijen Blue Fire first",
      "Bromo Sunrise",
      "Madakaripura Waterfall"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb9.jpg",
    gallery: ["https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb9.jpg"],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["3d2n", "surabaya", "ijen", "bromo", "reverse-route"],
    inclusions: [
      "Private transport",
      "2 nights accommodation",
      "Jeep for Bromo",
      "All entrance fees",
      "Gas masks & headlamps",
      "Ijen health screening",
      "Meals: 2B, 1D, 1L"
    ],
    exclusions: [
      "Flights",
      "Travel Insurance",
      "Personal expenses",
      "Some meals"
    ],
    travelerRequirements: [
      "Moderate fitness",
      "Printed passport copy",
      "Warm clothing"
    ],
    itinerary: [
      {
        day: 1,
        title: "Surabaya to Ijen",
        summary: "Transfer to Bondowoso with screening",
        activities: [
          { type: "Travel", name: "Transfer", description: "To Bondowoso", timeWindow: "12:00-18:00" },
          { type: "Health", name: "Screening", description: "Pre-hike check", timeWindow: "18:00-19:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "included" }
      },
      {
        day: 2,
        title: "Ijen to Bromo",
        summary: "Ijen trek and transfer to Bromo area",
        activities: [
          { type: "Activity", name: "Ijen Trek", description: "Blue fire & sunrise", timeWindow: "00:00-08:00" },
          { type: "Travel", name: "Transfer", description: "To Cemoro Lawang", timeWindow: "13:00-17:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "included", dinner: "own_expense" }
      },
      {
        day: 3,
        title: "Bromo & Waterfall",
        summary: "Bromo sunrise, Madakaripura, return to Surabaya",
        activities: [
          { type: "Activity", name: "Bromo", description: "Sunrise & Crater", timeWindow: "02:00-09:00" },
          { type: "Activity", name: "Waterfall", description: "Madakaripura", timeWindow: "13:00-15:00" },
          { type: "Travel", name: "Return", description: "To Surabaya", timeWindow: "16:00-20:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "n/a" }
      }
    ]
  },
  {
    id: "SUB-4D3N-001",
    slug: "4d-ijen-bromo-madakaripura-from-surabaya",
    name: "4 Day Ijen, Bromo & Madakaripura Waterfall Expedition",
    shortLabel: "4D3N Ijen-Bromo-Madakaripura (SUB)",
    originCity: "Surabaya",
    duration: "4 Days, 3 Nights",
    priceFrom: 3025000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "A relaxed 4-day pace to explore East Java's icons. Includes an extra night in Surabaya city for a comfortable finish.",
    highlights: [
      "Ijen Blue Fire",
      "Bromo Sunrise",
      "Madakaripura Waterfall",
      "Comfortable city stay in Surabaya"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb2.jpg",
    gallery: ["https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb2.jpg"],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["4d3n", "surabaya", "ijen", "bromo", "relaxed-pace"],
    inclusions: [
      "Private transport",
      "3 nights accommodation (inc. Surabaya)",
      "Jeep for Bromo",
      "All entrance fees",
      "Gas masks & headlamps",
      "Ijen health screening",
      "Meals: 3B, 1D, 1L"
    ],
    exclusions: [
      "Flights",
      "Travel Insurance",
      "Personal expenses",
      "Some meals"
    ],
    travelerRequirements: [
      "Moderate fitness",
      "Printed passport copy"
    ],
    itinerary: [
      {
        day: 1,
        title: "Surabaya to Bondowoso",
        summary: "Transfer to Ijen area",
        activities: [
          { type: "Travel", name: "Transfer", description: "To Bondowoso", timeWindow: "12:00-17:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "included" }
      },
      {
        day: 2,
        title: "Ijen to Bromo",
        summary: "Ijen trek and transfer to Bromo",
        activities: [
          { type: "Activity", name: "Ijen Trek", description: "Blue fire & sunrise", timeWindow: "00:00-08:00" },
          { type: "Travel", name: "Transfer", description: "To Bromo", timeWindow: "13:00-17:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "included", dinner: "own_expense" }
      },
      {
        day: 3,
        title: "Bromo & Waterfall",
        summary: "Bromo sunrise, Madakaripura, transfer to Surabaya hotel",
        activities: [
          { type: "Activity", name: "Bromo", description: "Sunrise & Crater", timeWindow: "02:00-09:00" },
          { type: "Activity", name: "Waterfall", description: "Madakaripura", timeWindow: "13:00-15:00" },
          { type: "CheckIn", name: "Hotel", description: "Surabaya city hotel", timeWindow: "19:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "own_expense" }
      },
      {
        day: 4,
        title: "Departure",
        summary: "Transfer to airport",
        activities: [
          { type: "Travel", name: "Airport", description: "Transfer to Juanda", timeWindow: "11:00-12:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "n/a", dinner: "n/a" }
      }
    ]
  },
  {
    id: "BALI-4D3N-001",
    slug: "4d3n-ijen-papuma-tumpaksewu-bromo-from-bali",
    name: "4 Day Ijen, Papuma, Tumpak Sewu & Bromo Expedition",
    shortLabel: "4D3N Ultimate Java (BALI)",
    originCity: "Bali",
    duration: "4 Days, 3 Nights",
    priceFrom: 3475000,
    currency: "IDR",
    difficulty: Difficulty.MODERATE,
    description: "The ultimate East Java expedition starting from Bali. Includes Ijen, the stunning Papuma Beach, Tumpak Sewu Waterfall, and Mount Bromo.",
    highlights: [
      "Ijen Crater Hike",
      "Papuma Beach Sunset",
      "Tumpak Sewu Waterfall",
      "Bromo Sunrise"
    ],
    imageUrl: "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb6.jpg",
    gallery: ["https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb6.jpg"],
    isPrivate: true,
    rating: 4.8,
    reviewCount: 51,
    tags: ["4d3n", "bali", "ijen", "papuma", "tumpak-sewu", "bromo"],
    inclusions: [
      "Private transport",
      "3 nights accommodation",
      "Jeep for Bromo",
      "All entrance fees",
      "Gas masks & headlamps",
      "Ijen health screening",
      "Meals: 3B, 2L",
      "Ferry tickets"
    ],
    exclusions: [
      "Flights",
      "Travel Insurance",
      "Dinners",
      "Personal expenses"
    ],
    travelerRequirements: [
      "Moderate to high fitness",
      "Printed passport copy"
    ],
    itinerary: [
      {
        day: 1,
        title: "Bali to Banyuwangi",
        summary: "Ferry crossing to Java",
        activities: [
          { type: "Travel", name: "Transfer", description: "To Gilimanuk Port", timeWindow: "10:00-12:00" },
          { type: "Travel", name: "Ferry", description: "To Ketapang", timeWindow: "12:00-13:00" }
        ],
        mealsPlan: { breakfast: "n/a", lunch: "own_expense", dinner: "own_expense" }
      },
      {
        day: 2,
        title: "Ijen & Papuma",
        summary: "Ijen trek and Papuma Beach sunset",
        activities: [
          { type: "Activity", name: "Ijen Trek", description: "Blue fire & sunrise", timeWindow: "00:30-06:00" },
          { type: "Activity", name: "Papuma", description: "Beach Sunset", timeWindow: "16:00-18:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "included", dinner: "own_expense" }
      },
      {
        day: 3,
        title: "Tumpak Sewu & Bromo",
        summary: "Waterfall trek and transfer to Bromo",
        activities: [
          { type: "Activity", name: "Tumpak Sewu", description: "Canyon descent", timeWindow: "07:30-11:00" },
          { type: "Travel", name: "Transfer", description: "To Bromo area", timeWindow: "13:00-17:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "included", dinner: "own_expense" }
      },
      {
        day: 4,
        title: "Bromo Sunrise",
        summary: "Sunrise, crater, return to Surabaya",
        activities: [
          { type: "Activity", name: "Bromo", description: "Sunrise & Crater", timeWindow: "02:00-10:00" },
          { type: "Travel", name: "Return", description: "To Surabaya", timeWindow: "11:00-16:00" }
        ],
        mealsPlan: { breakfast: "included", lunch: "own_expense", dinner: "n/a" }
      }
    ]
  }
];

export const REVIEWS = [
  {
    "Reviewer_Name": "fedenmark",
    "Review_Date": "July 28, 2025",
    "Rating": "5/5",
    "Source": "Tripadvisor (Gallarate, Italy)",
    "Review_Title": "A beautiful tour to discover the wonders of East Java",
    "Review_Text": "Beautiful tour to explore the wonders of East Java. Among the different operators I chose Java Volcano Tour Operator and we really enjoyed it. Excellent guide Gufran and driver Johan. Excellent hotels included in the tour price. (Automatically translated)",
    "Traveler_Type": "Family (Jul 2025)",
    "Key_Personnel_Mentioned": {
      "Guide": "Gufran",
      "Driver": "Johan"
    },
    "JVTO_Response_Date": "August 2, 2025"
  },
  {
    "Reviewer_Name": "JLJason Li",
    "Review_Date": "Oct 18, 2025",
    "Rating": "5/5",
    "Source": "Trustpilot (SG)",
    "Review_Title": "Ahboy was a phenomenal Ijen guide from...",
    "Review_Text": "Ahboy was a phenomenal Ijen guide from start to end. Not only was he incredibly knowledgeable and went out of his way to make sure everything we needed was sorted out (safety, logistics, equipment), he also made sure to build a strong bond with each one of us. Above all, an amazing and fun person to be around and we're glad he was able to show Ijen to us!",
    "Traveler_Type": "Not specified",
    "Key_Personnel_Mentioned": {
      "Guide": "Ahboy (Ijen guide)"
    },
    "JVTO_Response_Date": "Oct 18, 2025"
  },
  {
    "Reviewer_Name": "Nina nguyen",
    "Review_Date": "Oct 12, 2025",
    "Rating": "5/5",
    "Source": "Trustpilot (US)",
    "Review_Title": "I recently joined a tour to East Java…",
    "Review_Text": "I recently joined a tour to East Java with JVTO, and it was absolutely incredible! Our guide, Gufron, and driver, Holili, made the entire trip so comfortable and safe. Gufron was so knowledgeable, friendly, and attentive. He made sure we are safe during the hike and help taking many pictures for us. He also chooses good spots for photos. Thanks to both of them, we got to see the best of East Java from sunrise at Mount Bromo to the blue fire of Ijen all perfectly organized and stress-free. However, keep in mind, Ijen can be dangerous when going down to see the blue fire, requiring hiker to be good in shape. It's sad when we went back to Bali and couldn't find good tour guide like them.",
    "Traveler_Type": "Not specified",
    "Key_Personnel_Mentioned": {
      "Guide": "Gufron",
      "Driver": "Holili"
    },
    "JVTO_Response_Date": "Oct 18, 2025"
  }
];
