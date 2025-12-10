export interface Asset {
  id: number;
  folder_id: number;
  name: string;
  caption: string;
  description: string;
  type: string;
  url: string; // Contoh: "/uploads/..."
  file_ext: string;
  size_bytes: number;
  is_active: boolean;
}

export interface DestinationAsset {
  id: number;
  destination_id: number;
  asset_id: number;
  type: 'primary' | 'gallery' | string; // Type aset, kita cari yang 'primary'
  asset: Asset;
}
// types/destination.ts
export interface DestinationDetail {
  id: number;
  code: string;
  name: string;
  category: string;
  region: string;
  province: string;
  country: string;
  latitude: string;
  longitude: string;
  altitude: number;
  area_hectares: string;
  terrain: string;
  best_time_to_visit: string;
  difficulty_level: string;
  duration: string;
  physical_demand: number;
  cultural_depth: number;
  photo_potential: number;
  weather_by_season: string;
  rainfall_intensity: string;
  temperature_range: string;
  trail_details: string;
  required_gear: string[];
  summary: string;
  description: string;
  highlight: string;
  main_attractions: Array<{ title: string; description: string }>;
  key_highlights: Array<{ title: string; description: string }>;
  permit_required: boolean;
  permit_details: string;
  guide_required: boolean;
  safety_notes: string[];
  risk_factors: Array<{
    type: string;
    level: string;
    mitigation: string;
    description: string;
  }>;
  environmental_factors: Array<{
    unit?: string;
    value: string;
    factor: string;
    impact: string;
    condition?: string;
  }>;
  physical_requirements: string;
  cultural_context: string;
  local_tribes: string[];
  tips_for_visitors: string;
  featured_image: string;
  tags: string[];
  destination_assets: DestinationAsset[];
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  slug: string;
  banner: {
    url: string;
    alt: string;
  };
  keyInfo: {
    difficulty_level: string;
    temperature_range: string;
    best_time_to_visit: string;
  };
}

export interface TourPackageDetail {
  id: string;
  packageId: string;
  type: string;
  version: string;
  meta: _Meta;
  product: _Product;
  trip: _Trip;
}

interface _Meta {
  createdFrom: {
    productFile: string;
    tripFile: string;
  };
}

interface _Trip {
  vehiclePlan: {
    primary: {
      type: string;
      model: string;
      banner: string;
      maxPax: number;
      baggageCapacity: string;
      features: string[];
    }[];
    jeepRequiredAt: string[];
    jeepSpecs: {
      type: string;
      capacity: string;
      inclusions: string[];
    };
  };
}

interface _Product {
  id: string;
  packageId: string;
  slug: string;
  name: string;
  shortLabel: string;
  originCity: string;
  endCity: string;
  durationId: number;
  durationDays: number;
  durationNights: number;
  marketedDurationLabel: string;
  route: string[];
  tripRef: string;
  description: string;
  keyExperiences: {
    name: string;
    highlight: string;
  }[];
  physicalDifficulty: string;

  offers: _Offers;

  inclusions: string[];
  exclusions: string[];
  travelerRequirements: string[];

  addOns: _AddOn[];
  accommodationPlan: _AccommodationPlan[];

  gear: _Gear;

  itineraryDays: _ItineraryDay[];

  gallery: string[];
  imageUrl: string;
  tags: string[];

  aggregateRating: {
    ratingValue: number;
    reviewCount: number;
  };

  marketing: _Marketing;

  operationalComplexityNote: string;

  provider: _Provider;

  compliance: _Compliance;

  channelMetadata: _ChannelMetadata;

  _cms: _CMS;
}

interface _Offers {
  currency: string;
  aggregateOffer: {
    lowPrice: number;
    highPrice: number;
  };
  tiers: _PriceTier[];
}

interface _PriceTier {
  sku: string;
  paxMin: number;
  paxMax: number;
  pricePerPerson: number;
}

interface _AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface _AccommodationPlan {
  night: number;
  name: string;
  area: string;
  image: string;
}

interface _Gear {
  provided: string[];
  recommended: string[];
}

interface _ItineraryDay {
  day: number;
  title: string;
  summary: string;
  activities: _Activity[];
  mealsPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  mealsNotes: string;
  overnight: string | null;
}

interface _ActivityBase {
  type: string | null;
  name: string | null;
  description: string;
  timeWindow: string | null;
  durationMinutes: number | null;
}

interface _Activity extends _ActivityBase {
  location?: string | null;
  fromLocation?: string | null;
  toLocation?: string | null;
  destination?: string | null;
}

interface _Marketing {
  perfectFor: string[];
  highlightsBullets: string[];
  safetyPositioning: string;
  uniqueSellingPoints: string[];
}

interface _Provider {
  brand: string;
  legalEntity: string;
  nib: string;
  tdup: string;
  official: {
    website: string;
    whatsapp: string;
    email: string;
  };
  policyRef: {
    booking: string;
    inclusions: string;
  };
  policyVersion: string;
}

interface _Compliance {
  destinationsWhitelist: boolean;
  itineraryTablesGenerated: boolean;
  healthScreeningIncluded: boolean;
  touristPoliceSupport: boolean;
}

interface _ChannelMetadata {
  internalPackageId: string;
  orderChannelEnabled: {
    JVTO: boolean;
    KLOOK: boolean;
    TRAVELOKA: boolean;
    TIKETCOM: boolean;
    OTHERS: boolean;
  };
  externalPackageIds: {
    klook: string;
    traveloka: string;
    tiketcom: string;
  };
  isFreesale: boolean;
  requiresAvailabilityCheck: boolean;
  supportedPickupCities: string[];
  supportedDropoffCities: string[];
  languageOffered: string[];
  status: string;
  minLeadTimeHours: number;
  maxPaxRecommended: number;
  minPaxOperational: number;
}

interface _CMS {
  contentType: string;
  version: string;
  created: string;
  lastModified: string;
  status: string;
  owner: string;
  i18nReady: boolean;
  seoOptimized: boolean;
  schemaType: string;
}
