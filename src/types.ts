// FIX: Removed circular self-import and constant definitions. This file should only contain type declarations.
export interface HeroCopy {
  kicker: string;
  title: string;
  subhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  onCtaClick?: (ctaId: string, ctaText: string, section: string) => void;
}

export interface SectionCopy {
  overline: string;
  title: string;
  subhead: string;
}

export interface FoundersMissionCopy {
  overline: string;
  title: string;
  text: string;
  cta: string;
  imageUrl: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Guide {
  id: number;
  name: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
}

export interface CommunityPartner {
  icon: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  isExternal: boolean;
  imageUrl: string;
}

export interface Badge {
  name: string;
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  progress: number;
  progressBgColor: string;
}

export interface ContactInfo {
  website: string;
  email: string;
  whatsapp: string;
  whatsappLink: string;
  officeAddress: string;
  googleMapsEmbedUrl: string;
}

export interface Activity {
    name: string;
    description?: string;
    destinationName?: string;
    fromLocation?: string;
    toLocation?: string;
    timeWindow?: string;
    duration?: string;
    notes?: string;
}

export interface ItineraryDay {
    day: number;
    title: string;
    details: string;
    activities: Activity[];
}

export interface DetailedItineraryDay {
    day: number;
    title: string;
    drivingTime?: string;
    activities: Activity[];
    mealsPlan: {
        breakfast: string;
        lunch: string;
        dinner: string;
    };
    mealsNotes: string;
    overnight: string | null;
    summary?: string;
}


export interface AddOnService {
    name: string;
    description: string;
    price: string;
}

export interface FeaturedReview {
    text: string;
    author: string;
    source: string;
}

export interface Accommodation {
    standard: string;
    examples: string[];
}

export interface Gear {
    provided: string[];
    recommended: string[];
}

export interface AggregateRating {
    ratingValue: number;
    reviewCount: number;
}

export interface PriceTier {
  pax: number;
  pricePerPerson: number;
}

// New detailed types from trip data
export interface PickupOptionDetails {
    required: string[];
    notes?: string;
    meetingPoint?: string;
}
export interface PickupOptions {
    hotel?: PickupOptionDetails;
    airport?: PickupOptionDetails;
    train?: PickupOptionDetails;
}

export interface StartDetails {
    city: string;
    pickupOptions: PickupOptions;
    latestPickupGuidance: string;
    orientationTime: string;
}

export interface EndDetails {
    city: string;
    dropoffOptions: string[];
    safeFlightNote: string;
    estimatedArrival: string;
}

export interface AccommodationPlan {
    night: number;
    area: string;
    hotelStandard: string;
    examples: string[];
    checkinTime: string;
    checkoutTime: string;
}

export interface GearItem {
    item: string;
    for: string;
    [key: string]: any;
}

export interface RecommendedGearCategory {
    category: string;
    items: string[];
}

export interface CrewRole {
    role: string;
    scope: string;
    requirements: string[];
}

export interface Vehicle {
    type: string;
    model: string;
    maxPax: number;
    baggageCapacity: string;
    features: string[];
}

export interface JeepSpecs {
    type: string;
    capacity: string;
    inclusions: string[];
}

export interface VehiclePlan {
    primary: Vehicle[];
    jeepRequiredAt: string[];
    jeepSpecs: JeepSpecs | null;
    ferryIncluded?: boolean;
}

export interface OperationalNotes {
    healthRequirements: string[];
    environmentalRisks: string[];
    safetyMitigation: string[];
}

export interface EmergencyProtocols {
    medicalEmergency: string;
    weatherDisruption: string;
    vehicleBreakdown: string;
    [key: string]: any;
}

export interface TourPackage {
    id: string;
    label: string;
    imageUrl: string;
    gallery?: string[];
    originCity: string;
    endCity: string;
    durationDays: number;
    durationNights: number;
    route: string[];
    description: string;
    price?: string;
    priceTiers?: PriceTier[];
    itinerary: ItineraryDay[];
    keyExperiences: string[];
    physicality: string;
    inclusions: string[];
    exclusions: string[];
    addOns: AddOnService[];
    travelerRequirements: string[];
    accommodation?: Accommodation;
    gear?: Gear;
    featuredReviews?: FeaturedReview[];
    tags: string[];
    slug: string;
    aggregateRating?: AggregateRating;
    isFeatured?: boolean;
    recommendedFor?: string[];

    // New detailed operational fields
    start?: StartDetails;
    end?: EndDetails;
    accommodationPlan?: any[];
    gearProvided?: GearItem[];
    gearRecommended?: RecommendedGearCategory[];
    itineraryDays?: DetailedItineraryDay[];
    crewRolesNeeded?: CrewRole[];
    vehiclePlan?: VehiclePlan;
    operationalNotes?: OperationalNotes;
    handoverNotes?: string[];
    emergencyProtocols?: EmergencyProtocols;
}

export interface Review {
    id: number;
    avatar: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    platform: 'google' | 'tripadvisor' | 'trustpilot' | 'facebook';
    date: string;
    title: string;
    personnel?: { [key: string]: string | undefined };
}

export interface KnowledgeChunk {
  id: string;
  category: string;
  subcategory?: string;
  title: string;
  content: string;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'loading';
  content: string;
}

export interface DestinationProperty {
  propertyID: string;
  name: string;
  value: string | number;
  description?: string;
}

export type RiskLevel = 'None' | 'Low' | 'Moderate' | 'High';

export interface RiskProfile {
  gasToxicity: RiskLevel;
  floodRain: RiskLevel;
  slipperyTerrain: RiskLevel;
  coldExposure: RiskLevel;
  crowdOverTourism: RiskLevel;
}

export interface TrekkingData {
  distance: string;
  duration: string;
  terrain: string;
  access: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  geo: {
    latitude: number;
    longitude: number;
  };
  properties: DestinationProperty[];
  keyInfo: {
      type: string;
      phenomenon: string;
      difficulty: string;
      difficultyRating: string;
      elevation: string;
      bestSeason: string;
      coreEmotion: string;
  };
  risks: RiskProfile;
  trekkingData: TrekkingData;
  gpxTrack?: [number, number][];
  gpxElevationProfile?: { distance: number; elevation: number; }[];
}