"use client";

import { create } from "zustand";
import type {
  GlobalSingletonsState,
  RegistrationId,
  PaymentAccount,
  PrimaryNavItem,
  SitemapRule,
} from "./globalSingletonsTypes";

function buildOrgJsonLd(input: GlobalSingletonsState["siteIdentity"]) {
  // auto-generate basic Organization JSON-LD (readonly) — dari dokumen: orgSchemaJsonLd otomatis. :contentReference[oaicite:5]{index=5}
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": input.brandName,
    "legalName": input.legalEntityName,
    "url": input.officialWebsiteUrl,
    "email": input.officialEmails,
    "sameAs": input.mapsListings,
    "contactPoint": input.officialWhatsAppNumbers.map((wa) => ({
      "@type": "ContactPoint",
      "telephone": wa,
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": ["id", "en"],
    })),
  };
}

const initialState: GlobalSingletonsState = {
  siteIdentity: {
    brandName: "",
    legalEntityName: "",
    registrationIds: [],
    officialWebsiteUrl: "",
    officialEmails: [],
    officialWhatsAppNumbers: [],
    officialPaymentAccounts: [],
    mapsListings: [],
    associationMemberships: [],
    orgSchemaJsonLd: null, // auto
  },
  globalSeo: {
    defaultTitle: "",
    defaultMetaDescription: "",
    defaultOgImage: "",
    defaultTwitterHandle: "",
    index: true,
    follow: true,
  },
  navigationSettings: {
    primaryNav: [],
    breadcrumbConfig: {
      toursBasePath: "/tours",
      destinationsBasePath: "/destinations",
      guidesBasePath: "/travel-guide",
      insightsBasePath: "/insights",
    },
    sitemapRules: [],
  },
};

type Actions = {
  resetAll: () => void;
  // siteIdentity
  setBrandName: (v: string) => void;
  setLegalEntityName: (v: string) => void;
  setOfficialWebsiteUrl: (v: string) => void;
  setOfficialEmails: (arr: string[]) => void;
  setOfficialWhatsAppNumbers: (arr: string[]) => void;
  addRegistrationId: (item: RegistrationId) => void;
  removeRegistrationId: (idx: number) => void;
  addPaymentAccount: (item: PaymentAccount) => void;
  removePaymentAccount: (idx: number) => void;
  setMapsListings: (arr: string[]) => void;
  setAssociationMemberships: (arr: string[]) => void;

  // recompute org json-ld
  recomputeOrgSchema: () => void;

  // globalSeo
  setGlobalSeo: (patch: Partial<GlobalSingletonsState["globalSeo"]>) => void;

  // navigation
  addNavItem: (item: PrimaryNavItem) => void;
  updateNavItem: (idx: number, patch: Partial<PrimaryNavItem>) => void;
  removeNavItem: (idx: number) => void;

  setBreadcrumbConfig: (patch: Partial<GlobalSingletonsState["navigationSettings"]["breadcrumbConfig"]>) => void;

  addSitemapRule: (rule: SitemapRule) => void;
  updateSitemapRule: (idx: number, patch: Partial<SitemapRule>) => void;
  removeSitemapRule: (idx: number) => void;
};

export const useGlobalSingletonsStore = create<GlobalSingletonsState & Actions>((set, get) => ({
  ...initialState,

  resetAll: () => set(initialState),

  setBrandName: (v) => set((s) => ({ siteIdentity: { ...s.siteIdentity, brandName: v } })),
  setLegalEntityName: (v) => set((s) => ({ siteIdentity: { ...s.siteIdentity, legalEntityName: v } })),
  setOfficialWebsiteUrl: (v) => set((s) => ({ siteIdentity: { ...s.siteIdentity, officialWebsiteUrl: v } })),
  setOfficialEmails: (arr) => set((s) => ({ siteIdentity: { ...s.siteIdentity, officialEmails: arr } })),
  setOfficialWhatsAppNumbers: (arr) => set((s) => ({ siteIdentity: { ...s.siteIdentity, officialWhatsAppNumbers: arr } })),
  addRegistrationId: (item) => set((s) => ({ siteIdentity: { ...s.siteIdentity, registrationIds: [...s.siteIdentity.registrationIds, item] } })),
  removeRegistrationId: (idx) => set((s) => {
    const next = [...s.siteIdentity.registrationIds]; next.splice(idx,1);
    return { siteIdentity: { ...s.siteIdentity, registrationIds: next } };
  }),
  addPaymentAccount: (item) => set((s) => ({ siteIdentity: { ...s.siteIdentity, officialPaymentAccounts: [...s.siteIdentity.officialPaymentAccounts, item] } })),
  removePaymentAccount: (idx) => set((s) => {
    const next = [...s.siteIdentity.officialPaymentAccounts]; next.splice(idx,1);
    return { siteIdentity: { ...s.siteIdentity, officialPaymentAccounts: next } };
  }),
  setMapsListings: (arr) => set((s) => ({ siteIdentity: { ...s.siteIdentity, mapsListings: arr } })),
  setAssociationMemberships: (arr) => set((s) => ({ siteIdentity: { ...s.siteIdentity, associationMemberships: arr } })),
  recomputeOrgSchema: () => set((s) => ({ siteIdentity: { ...s.siteIdentity, orgSchemaJsonLd: buildOrgJsonLd(s.siteIdentity) } })),

  setGlobalSeo: (patch) => set((s) => ({ globalSeo: { ...s.globalSeo, ...patch } })),

  addNavItem: (item) => set((s) => ({ navigationSettings: { ...s.navigationSettings, primaryNav: [...s.navigationSettings.primaryNav, item] } })),
  updateNavItem: (idx, patch) => set((s) => {
    const next = [...s.navigationSettings.primaryNav];
    next[idx] = { ...next[idx], ...patch };
    return { navigationSettings: { ...s.navigationSettings, primaryNav: next } };
  }),
  removeNavItem: (idx) => set((s) => {
    const next = [...s.navigationSettings.primaryNav]; next.splice(idx,1);
    return { navigationSettings: { ...s.navigationSettings, primaryNav: next } };
  }),

  setBreadcrumbConfig: (patch) => set((s) => ({
    navigationSettings: {
      ...s.navigationSettings,
      breadcrumbConfig: { ...s.navigationSettings.breadcrumbConfig, ...patch }
    }
  })),

  addSitemapRule: (rule) => set((s) => ({ navigationSettings: { ...s.navigationSettings, sitemapRules: [...s.navigationSettings.sitemapRules, rule] } })),
  updateSitemapRule: (idx, patch) => set((s) => {
    const next = [...s.navigationSettings.sitemapRules];
    next[idx] = { ...next[idx], ...patch };
    return { navigationSettings: { ...s.navigationSettings, sitemapRules: next } };
  }),
  removeSitemapRule: (idx) => set((s) => {
    const next = [...s.navigationSettings.sitemapRules]; next.splice(idx,1);
    return { navigationSettings: { ...s.navigationSettings, sitemapRules: next } };
  }),
}));
