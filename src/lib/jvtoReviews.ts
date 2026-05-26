// src/lib/jvtoReviews.ts — Canonical source: JVTO_REVIEW_REGISTRY_v1.json (2026-04-22)
// Ported from rewrite repo (e:\test-2-2026\lib\jvtoReviews.ts) on 2026-04-29 as part of AEO/GEO port.
// Schema rule: AggregateRating ACTIVE on Organization. Individual @type:Review ACTIVE on /why-jvto/reviews.

export interface ReviewPlatform {
  platform: string;
  count: number | null;
  rating: number | null;
  url: string;
  isPrimary: boolean;
  lastVerified: string | null;
}

export interface ReviewTheme {
  themeId: string;
  theme: string;
  pattern: string;
  claimLinkage: string;
}

export const AGGREGATE_RATING = {
  ratingValue: 4.8,
  bestRating: 5,
  worstRating: 1,
  reviewCount: 51,
  primaryPlatform: 'Trustpilot',
  primaryPlatformUrl: 'https://trustpilot.com/review/javavolcano-touroperator.com',
  lastVerified: '2026-05-09',
} as const;

export const REVIEW_PLATFORMS: ReviewPlatform[] = [
  {
    platform: 'Trustpilot',
    count: 51,
    rating: 4.8,
    url: 'https://trustpilot.com/review/javavolcano-touroperator.com',
    isPrimary: true,
    lastVerified: '2026-05-09',
  },
  {
    platform: 'Google Maps',
    count: 123,
    rating: 4.9,
    url: 'https://www.google.com/maps?cid=1266403973589689021',
    isPrimary: false,
    lastVerified: '2026-05-26',
  },
  {
    platform: 'TripAdvisor',
    count: 21,
    rating: 4.95,
    url: 'https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html',
    isPrimary: false,
    lastVerified: '2026-04-22',
  },
  {
    platform: 'GetYourGuide',
    count: null,
    rating: null,
    url: 'https://www.getyourguide.com/java-volcano-tour-operator-s260697/',
    isPrimary: false,
    lastVerified: null,
  },
];

// HTML-first review themes for /why-jvto/reviews. NOT @type:Review schema.
export const REVIEW_THEMES: ReviewTheme[] = [
  {
    themeId: 'T1',
    theme: 'Private tour quality',
    pattern: 'Guests repeatedly mention the value of having dedicated private guides and vehicles — no rush, no compromises.',
    claimLinkage: 'C2',
  },
  {
    themeId: 'T2',
    theme: 'Guide knowledge and English communication',
    pattern: 'Reviews frequently highlight English-speaking ability and route-specific knowledge of guides.',
    claimLinkage: 'C7',
  },
  {
    themeId: 'T3',
    theme: 'Ijen Blue Fire experience quality',
    pattern: 'Reviews from Ijen-route guests reference the Blue Fire experience and the health screening coordination.',
    claimLinkage: 'C4',
  },
  {
    themeId: 'T4',
    theme: 'Safety and trust',
    pattern: "Guests mention feeling safe, well-informed, and prepared — often referencing the founder's police background.",
    claimLinkage: 'C1',
  },
  {
    themeId: 'T5',
    theme: 'All-inclusive clarity and no surprises',
    pattern: 'Guests note that everything was included as described — no unexpected costs or negotiations.',
    claimLinkage: 'C3',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sarah & Mark',
    location: 'United Kingdom',
    text: 'The private tour was flawless. From start to finish, the safety standards and professionalism of our guide Gufron made the Ijen trek feel completely manageable.',
    stars: 5,
  },
  {
    name: 'Tobias L.',
    location: 'Germany',
    text: 'The communication was excellent. Having the NIB and police verification up front really set my mind at ease before booking. A truly transparent operator.',
    stars: 5,
  },
  {
    name: 'Elena P.',
    location: 'Spain',
    text: 'Everything was private and personalized. No crowded buses, no shared rides — just our own vehicle and guide. It made all the difference during the long drives.',
    stars: 5,
  },
  {
    name: 'Kevin D.',
    location: 'USA',
    text: 'The health screening process was thorough, and I felt much safer knowing everything was done professionally. Highly recommend for the East Java circuit.',
    stars: 5,
  },
];
