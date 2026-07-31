// Curated from src/data/okf/general-modules.json (npm run sync:okf).
// Regenerate the OKF snapshot with `npm run sync:okf`, then check consistency
// with `npm run validate:okf` before committing changes to this file — it
// catches hand-edits that drift from OKF's mandatory/canonical wording.
// Reusable agent explainer content — single source shared with the WhatsApp agent.

export type AgentGuide = {
  slug: string;
  route: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  related: { href: string; label: string }[];
};

export const AGENT_GUIDES: Record<string, AgentGuide> = {
  "what-is-included": {
    "slug": "what-is-included",
    "route": "/travel-guide/what-is-included",
    "title": "What's Included in a JVTO Tour",
    "description": "What every JVTO private volcano tour includes — and what is not — so there are no hidden costs.",
    "h1": "What's Included in a JVTO Tour",
    "intro": "Every JVTO package is all-inclusive of the essentials. Here is exactly what is covered, and what is not.",
    "sections": [
      {
        "h2": "All-Inclusive Baseline",
        "body": "Every package includes private transport, a dedicated driver and guide(s), all entrance fees and permits, drinking water, meals as stated, and full pick-up to drop-off assistance.\n\nNot included: international/domestic flights, visas, travel insurance, tips, personal expenses.\n\nIncluded: private transport (dedicated vehicle), dedicated private driver and guide(s), all entrance fees and permits, drinking water, meals as stated in the itinerary, full pick-up to drop-off assistance."
      },
      {
        "h2": "Standard Exclusions",
        "body": "Excluded: international/domestic flights, visas, travel insurance, tips, personal expenses.\n\nNot included: international/domestic flights, visas, travel insurance, tips, personal expenses."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/private-tour",
        "label": "What a Private Tour Means at JVTO"
      },
      {
        "href": "/travel-guide/vehicle-and-luggage",
        "label": "Vehicle & Luggage"
      }
    ]
  },
  "private-tour": {
    "slug": "private-tour",
    "route": "/travel-guide/private-tour",
    "title": "What a Private Tour Means at JVTO",
    "description": "JVTO tours are fully private — your own dedicated driver and guide, never a shared group.",
    "h1": "What a Private Tour Means at JVTO",
    "intro": "You are never combined with another group. Here is how the private format and crew work.",
    "sections": [
      {
        "h2": "Private Tour Format",
        "body": "This is a private tour with your own dedicated driver and guide(s); you are never combined with another group."
      },
      {
        "h2": "Crew & Language Standard",
        "body": "English-speaking driver/guide standard; other languages subject to confirmation\n\nprivate dedicated driver + guide (no shared groups)"
      }
    ],
    "related": [
      {
        "href": "/travel-guide/vehicle-and-luggage",
        "label": "Vehicle & Luggage"
      },
      {
        "href": "/travel-guide/rooming-and-accommodation",
        "label": "Rooming & Accommodation"
      }
    ]
  },
  "vehicle-and-luggage": {
    "slug": "vehicle-and-luggage",
    "route": "/travel-guide/vehicle-and-luggage",
    "title": "Vehicle & Luggage",
    "description": "Which vehicle JVTO uses for your group size, and how luggage is handled.",
    "h1": "Vehicle & Luggage",
    "intro": "The vehicle is matched to your group size. Oversized or special items are checked before they are confirmed.",
    "sections": [
      {
        "h2": "Vehicle by Group Size",
        "body": "We use an AC MPV for 1–3 guests and a Hiace for 4–9 guests."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/private-tour",
        "label": "What a Private Tour Means at JVTO"
      }
    ]
  },
  "rooming-and-accommodation": {
    "slug": "rooming-and-accommodation",
    "route": "/travel-guide/rooming-and-accommodation",
    "title": "Rooming & Accommodation",
    "description": "How rooming works on a JVTO tour and what can be requested.",
    "h1": "Rooming & Accommodation",
    "intro": "Standard rooming is arranged for your group, with options on request.",
    "sections": [
      {
        "h2": "Standard Rooming",
        "body": "Standard rooming is arranged for the group; twin, double, separate rooms, or an extra room can be requested (subject to confirmation)."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/what-is-included",
        "label": "What's Included in a JVTO Tour"
      }
    ]
  },
  "how-booking-works": {
    "slug": "how-booking-works",
    "route": "/travel-guide/how-booking-works",
    "title": "How Booking Works",
    "description": "Booking a JVTO tour is website-only: complete your booking on the official website under a JVTO Booking ID.",
    "h1": "How Booking Works",
    "intro": "JVTO accepts bookings exclusively through the official website. Here is how it works.",
    "sections": [
      {
        "h2": "How to Book",
        "body": "JVTO accepts bookings exclusively through the official website checkout. WhatsApp and email provide customer assistance but do not create, confirm, modify, cancel, or transfer bookings — every booking action is completed on the website and recorded under a valid JVTO Booking ID.\n\nTo book: choose your package, select your date and travellers, review the price and add-ons, accept the Terms & Cancellation Policy, and complete payment. JVTO then follows up with your confirmation / E-Voucher."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/payment-and-deposit",
        "label": "Payment & Deposit"
      },
      {
        "href": "/travel-guide/booking-safety",
        "label": "Booking Safety & Anti-Fraud"
      }
    ]
  },
  "payment-and-deposit": {
    "slug": "payment-and-deposit",
    "route": "/travel-guide/payment-and-deposit",
    "title": "Payment & Deposit",
    "description": "How deposits and balance payments work, and the official channels to use.",
    "h1": "Payment & Deposit",
    "intro": "A deposit secures your booking, with the balance due before the tour. Pay only through official channels.",
    "sections": [
      {
        "h2": "Payment & Deposit",
        "body": "A deposit secures the booking, with the balance due before the tour; exact amounts and deadlines are on the booking page.\n\nA deposit (standard 20% of the booking value) secures a booking, with the balance due before the tour starts; close-to-departure bookings may require fuller payment. Exact amounts, accepted methods, and deadlines are shown at checkout and on the booking information page."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/cancellation-travel-credit",
        "label": "Cancellation & Lifetime Package Credit"
      },
      {
        "href": "/travel-guide/booking-safety",
        "label": "Booking Safety & Anti-Fraud"
      }
    ]
  },
  "cancellation-travel-credit": {
    "slug": "cancellation-travel-credit",
    "route": "/travel-guide/cancellation-travel-credit",
    "title": "Cancellation & Lifetime Package Credit",
    "description": "How JVTO handles guest-initiated cancellations — Package Credit instead of cash refunds.",
    "h1": "Cancellation & Lifetime Package Credit",
    "intro": "For guest-initiated cancellations JVTO uses Lifetime Package Credit. Here is the rule.",
    "sections": [
      {
        "h2": "Cancellation & Lifetime Package Credit",
        "body": "How JVTO handles guest-initiated cancellations — Package Credit instead of cash refunds, on a 48-hour cut-off.\n\nFor guest-initiated cancellations JVTO uses Package Credit rather than cash refunds. The binding terms are in the published Booking, Payment & Cancellation policy; this is a summary — see that page for exact details."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/payment-and-deposit",
        "label": "Payment & Deposit"
      }
    ]
  },
  "booking-safety": {
    "slug": "booking-safety",
    "route": "/travel-guide/booking-safety",
    "title": "Booking Safety & Anti-Fraud",
    "description": "How to make sure you are booking and paying through JVTO's real, official channels.",
    "h1": "Booking Safety & Anti-Fraud",
    "intro": "Book and pay only through JVTO's official channels. Here is how to stay safe.",
    "sections": [
      {
        "h2": "Booking Safety & Anti-Fraud",
        "body": "Use only JVTO's official channels; JVTO never asks for full card numbers, CVV, banking passwords, or OTP codes.\n\nBook and pay only through JVTO's official channels — the website, the official WhatsApp number, the official email, and JVTO's listed payment links and accounts. JVTO never asks for your full card number, CVV, online banking password, or one-time codes by chat or email. If an account number, link, or contact looks different, pause and verify through an official channel."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/how-booking-works",
        "label": "How Booking Works"
      },
      {
        "href": "/travel-guide/payment-and-deposit",
        "label": "Payment & Deposit"
      }
    ]
  },
  "blue-fire-and-sunrise": {
    "slug": "blue-fire-and-sunrise",
    "route": "/travel-guide/blue-fire-and-sunrise",
    "title": "Blue Fire & Sunrise: Why They Cannot Be Guaranteed",
    "description": "Why weather-dependent sights like Ijen's blue fire and a clear sunrise cannot be guaranteed.",
    "h1": "Blue Fire & Sunrise: Why They Cannot Be Guaranteed",
    "intro": "Some sights depend on weather and volcanic conditions and cannot be guaranteed. Here is what that means.",
    "sections": [
      {
        "h2": "Natural Phenomena Are Not Guaranteed",
        "body": "JVTO cannot guarantee weather-dependent sights such as sunrise or Ijen's blue fire; itineraries are planned to maximise the chance.\n\nWeather-dependent sights — a clear sunrise, or Ijen's blue fire — cannot be guaranteed, because cloud, weather, and volcanic gas are outside any operator's control. JVTO plans timing and routes to maximise the chance of good conditions, and may adjust timing or routing for safety."
      },
      {
        "h2": "Kawah Ijen",
        "body": "Active East Java volcano known for its turquoise acidic crater lake, pre-dawn \"blue fire\", and active sulfur mining, reached by a guided night hike.\n\nTypical schedule: Hotel departure around midnight; the crater rim is reached near dawn for the blue fire and sunrise; finish mid-morning.\n\nYou need: BBKSDA health screening and certificate mandatory for every guest before crater entry, gas mask and trekking poles (provided by JVTO), licensed local guide."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/why-stay-near-ijen",
        "label": "Why We Stay Near Ijen Before the Hike"
      }
    ]
  },
  "finish-in-bali": {
    "slug": "finish-in-bali",
    "route": "/travel-guide/finish-in-bali",
    "title": "Finishing in Bali",
    "description": "What 'finish in Bali' actually involves — the Ketapang–Gilimanuk crossing and optional transfer.",
    "h1": "Finishing in Bali",
    "intro": "Finishing in Bali means a ferry crossing, not automatically a hotel drop-off. Here is how it works.",
    "sections": [
      {
        "h2": "East Java – Bali Ferry Crossing",
        "body": "Ketapang–Gilimanuk ferry crossing for Bali-linked packages."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/what-is-included",
        "label": "What's Included in a JVTO Tour"
      }
    ]
  },
  "why-stay-near-ijen": {
    "slug": "why-stay-near-ijen",
    "route": "/travel-guide/why-stay-near-ijen",
    "title": "Why We Stay Near Ijen Before the Hike",
    "description": "Why JVTO stages an overnight near Ijen before the midnight crater hike.",
    "h1": "Why We Stay Near Ijen Before the Hike",
    "intro": "Staying near Ijen lets you rest, prepare, and start the hike safely. Here is why.",
    "sections": [
      {
        "h2": "Why We Stay Near Ijen",
        "body": "We stage here so guests can rest and prepare before the next activity. medical check can be arranged at hotel; dinner before Ijen preparation.\n\n• medical check can be arranged at hotel\n• dinner before Ijen preparation\n• midnight departure to Ijen"
      }
    ],
    "related": [
      {
        "href": "/travel-guide/blue-fire-and-sunrise",
        "label": "Blue Fire & Sunrise: Why They Cannot Be Guaranteed"
      }
    ]
  },
  "bromo-sunrise": {
    "slug": "bromo-sunrise",
    "route": "/travel-guide/bromo-sunrise",
    "title": "Bromo Sunrise: How It Works",
    "description": "How the Bromo sunrise morning works and why we stage nearby the night before.",
    "h1": "Bromo Sunrise: How It Works",
    "intro": "An early jeep start gets you to the viewpoint for sunrise. Here is how the morning runs.",
    "sections": [
      {
        "h2": "Why We Stay Near Bromo Before Sunrise",
        "body": "We stage here so guests can rest and prepare before the next activity. early jeep pickup; takeaway breakfast possible.\n\n• early jeep pickup\n• takeaway breakfast possible\n• cold-weather preparation"
      },
      {
        "h2": "Mount Bromo",
        "body": "Active East Java volcano in the Tengger caldera \"Sea of Sand\", famous for its pre-dawn sunrise panorama reached by 4WD jeep.\n\nTypical schedule: Pre-dawn departure (around 03:00) by 4WD jeep for the sunrise viewpoint, then a crossing of the sand sea and a short ascent to the crater rim; finish mid-morning.\n\nYou need: TNBTS (Bromo Tengger Semeru National Park) ticket, 4WD jeep for the sand sea."
      }
    ],
    "related": [
      {
        "href": "/travel-guide/what-is-included",
        "label": "What's Included in a JVTO Tour"
      }
    ]
  },
  "malang-batu": {
    "slug": "malang-batu",
    "route": "/travel-guide/malang-batu",
    "title": "Malang & Batu City Stop",
    "description": "How the optional Malang / Batu city stop fits into longer JVTO itineraries.",
    "h1": "Malang & Batu City Stop",
    "intro": "Longer packages can include a Malang / Batu city stay. Here is how it fits the route.",
    "sections": [
      {
        "h2": "Malang / Batu Staging",
        "body": "We stage here so guests can rest and prepare before the next activity. Whiz Prime Malang / Holiday Inn Express Surabaya used for city stays; Malang city and Batu attractions accessible on day-use basis.\n\n• Whiz Prime Malang / Holiday Inn Express Surabaya used for city stays\n• Malang city and Batu attractions accessible on day-use basis\n• suitable for leisure day after highland activities\n• Surabaya airport accessible 2–4h from Malang depending on traffic"
      }
    ],
    "related": [
      {
        "href": "/travel-guide/what-is-included",
        "label": "What's Included in a JVTO Tour"
      }
    ]
  }
};
