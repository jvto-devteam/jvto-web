export type RegistrationId = {
  label: string;
  value: string;
  document?: string; // media URL (sementara)
};

export type PaymentAccount = {
  label: string;
  accountDetails: string;
};

export type SiteIdentity = {
  brandName: string;
  legalEntityName: string;
  registrationIds: RegistrationId[]; // repeatable object
  officialWebsiteUrl: string;        // url
  officialEmails: string[];          // email[]
  officialWhatsAppNumbers: string[]; // string[]
  officialPaymentAccounts: PaymentAccount[]; // repeatable object
  mapsListings: string[];            // url[]
  associationMemberships: string[];  // relation:partnerships (sementara pakai string[])
  orgSchemaJsonLd: unknown | null;   // json (readonly, auto)
};

export type GlobalSeo = {
  defaultTitle: string;
  defaultMetaDescription: string;
  defaultOgImage?: string;   // media URL (sementara)
  defaultTwitterHandle: string;
  index: boolean;            // indexing defaults
  follow: boolean;
};

export type LinkedType = "static" | "collection" | "external";

export type PrimaryNavItem = {
  label: string;
  url: string;
  linkedType: LinkedType;
  linkedCollection?: string;
  linkedEntry?: string; // relation:any (sementara string id/slug)
};

export type BreadcrumbConfig = {
  toursBasePath: string;
  destinationsBasePath: string;
  guidesBasePath: string;
  insightsBasePath: string;
};

export type SitemapTargetType =
  // dokumen memuat dua variasi enum; gabungkan agar tidak ada yang hilang:
  // (faqItem) dan (policyDocument) sama-sama diakomodasi. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}
  | "tourPackage"
  | "destination"
  | "travelGuide"
  | "insightPost"
  | "faqItem"
  | "policyDocument"
  | "staticPage";

export type Changefreq = "daily" | "weekly" | "monthly" | "yearly";

export type SitemapRule = {
  targetType: SitemapTargetType;
  includeInSitemap: boolean; // default true
  changefreq: Changefreq;
  priority: number;          // 0.0–1.0
};

export type NavigationSettings = {
  primaryNav: PrimaryNavItem[]; // repeatable
  breadcrumbConfig: BreadcrumbConfig;
  sitemapRules: SitemapRule[];  // repeatable
};

export type GlobalSingletonsState = {
  siteIdentity: SiteIdentity;
  globalSeo: GlobalSeo;
  navigationSettings: NavigationSettings;
};
