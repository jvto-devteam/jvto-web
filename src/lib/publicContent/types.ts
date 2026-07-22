import type { Destination, DestinationDetail } from "@/interfaces";

export type PublicSnapshotSource =
  | "snapshot"
  | "database-fallback"
  | "inline-fallback";

export type PublicSnapshotSeo = {
  title: string;
  description?: string;
  [key: string]: unknown;
};

export type PublicSnapshotContent = {
  h1?: string;
  [key: string]: unknown;
};

export type PublicSnapshotMeta = {
  generatedAt: string;
  updatedAt?: string;
  version?: string;
  source?: string;
};

export type PublicPageSnapshot = {
  route: string;
  lang: string;
  seo: PublicSnapshotSeo;
  content: PublicSnapshotContent;
  meta: PublicSnapshotMeta;
};

export type PublicPageRow = {
  route: string;
  lang: string;
  seo: PublicSnapshotSeo;
  content: PublicSnapshotContent;
  created_at?: Date;
  updated_at?: Date;
};

export type PublicPageResolution = {
  source: PublicSnapshotSource;
  snapshot: PublicPageSnapshot;
  pageRow: PublicPageRow;
  usedDatabaseFallback: boolean;
};

export type PublicOrganizationProfileSnapshot = {
  legal_name?: string | null;
  brand_name?: string | null;
  alternate_name?: string | null;
  founding_date?: Date | string | null;
  description?: string | null;
  price_range?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  available_languages?: string[] | null;
  address_json?: Record<string, unknown> | null;
  same_as_urls?: string[] | null;
  website_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  schema_json?: Record<string, unknown> | unknown[] | null;
  updated_at?: Date | null;
};

export type PublicDestinationListSnapshot = {
  generatedAt: string;
  items: Array<
    Destination & {
      featured?: boolean;
      short_slug?: string | null;
      summary?: string | null;
      highlight?: string | null;
      geo?: {
        latitude: number | null;
        longitude: number | null;
        altitude: number | null;
      };
      permit_required?: boolean;
      permit_details?: string | null;
      physical_requirements?: string | null;
      seo?: {
        title?: string | null;
        description?: string | null;
      };
      tags?: string[];
      types?: string[];
    }
  >;
};

export type PublicDestinationDetailSnapshot = {
  generatedAt: string;
  payload: DestinationDetail;
};

export type PublicDestinationDetailSnapshotItem = {
  slug: string;
  updatedAt?: string;
  payload: DestinationDetail;
};

export type PublicDestinationDetailSnapshotCollection = {
  generatedAt: string;
  items: PublicDestinationDetailSnapshotItem[];
};

export type PublicReviewItem = {
  name: string;
  date: string;
  url?: string | null;
  stars: number;
  title: string;
  text: string;
  verified?: boolean;
};

export type PublicReviewSnapshotCollection = {
  generatedAt: string;
  items: PublicReviewItem[];
};

export type PublicFaqItem = {
  id: number;
  question: string;
  answer: string;
  category_id?: number | null;
  sort_order?: number | null;
};

export type PublicFaqCategory = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  faqs: PublicFaqItem[];
};

export type PublicFaqSnapshotCollection = {
  generatedAt: string;
  categories: PublicFaqCategory[];
};

export type PublicReviewApiFeedItem = {
  id: string;
  customer_name: string | null;
  platform: string | null;
  date: string;
  star: number;
  review: string | null;
  url: string | null;
  profile_photo: string | null;
  package_id: string | null;
  crews: Array<{
    id: string;
    name: string | null;
    type: string | null;
    photo_url: string | null;
    tags: string[] | null;
  }>;
  has_internal_crew: boolean;
};

export type PublicReviewApiCrewItem = {
  id: string;
  name: string | null;
  full_name?: string | null;
  type: string | null;
  photo_url: string | null;
  tags: string[] | null;
  year_of_joining?: number | null;
};

export type PublicReviewApiStats = {
  success: boolean;
  total: number;
  platforms: {
    google: number;
    trustpilot: number;
    tripadvisor: number;
  };
  average_rating: number;
};

export type PublicReviewXmlItem = {
  id: string;
  customer_name: string | null;
  date: string;
  review: string | null;
  star: number;
  package: {
    code: string | null;
    name: string | null;
    slug: string | null;
  } | null;
};

export type PublicReviewApiSnapshotCollection = {
  generatedAt: string;
  feed: PublicReviewApiFeedItem[];
  preview: {
    reviews: PublicReviewApiFeedItem[];
    crews: PublicReviewApiCrewItem[];
  };
  stats: PublicReviewApiStats;
  xmlItems: PublicReviewXmlItem[];
};
