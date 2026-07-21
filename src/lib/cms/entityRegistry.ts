// src/lib/cms/entityRegistry.ts
// The CMS taxonomy backbone — ported from jvto-unified-cms-bootstrap config
// (entity-types.yaml + visual-modes.yaml + field-ownership.yaml + consolidation-map.yaml).
// One place that says, for every CMS entity: which visual-mode cluster it belongs to,
// which repo source owns it, its write policy, and how a screen reaches its data.
// The sidebar, dashboard, and generic entity viewer all read this — so the CMS is
// grouped by logic (not ad-hoc) and every feature is wired to real consolidated data.

export type Cluster = "content" | "travel" | "trust" | "hybrid" | "global";

export const CLUSTER_META: Record<Cluster, { label: string; purpose: string }> = {
  content: { label: "Content & Pages", purpose: "page copy + SEO (all clusters)" },
  travel: { label: "Travel", purpose: "discovery, routes & products" },
  trust: { label: "Trust & Proof", purpose: "canonical proof and formal rules" },
  hybrid: { label: "Support & Narrative", purpose: "operational support, people, narrative" },
  global: { label: "Global & System", purpose: "identity, media, consolidation" },
};

// field-ownership.yaml write_policy vocabulary → how the screen behaves.
export type WritePolicy =
  | "editable" // CMS-owned, versioned edits
  | "read_only" // synced from an upstream repo — display, don't edit
  | "operational_only" // owned by the operational Postgres backend
  | "compliance_only"; // locked by CANONICAL_FACTS — never editable in CMS

// Static class strings (Tailwind purges dynamically-built class names).
export const POLICY_BADGE: Record<WritePolicy, { label: string; cls: string; dot: string }> = {
  editable: { label: "Editable", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
  read_only: { label: "Synced · read-only", cls: "bg-sky-500/10 text-sky-300 border-sky-500/30", dot: "bg-sky-400" },
  operational_only: { label: "Operational", cls: "bg-amber-500/10 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  compliance_only: { label: "Facts-locked", cls: "bg-rose-500/10 text-rose-300 border-rose-500/30", dot: "bg-rose-400" },
};

export type EntityDef = {
  type: string; // entity_types.yaml
  label: string;
  cluster: Cluster;
  ownerSource: string; // field-ownership owner_source / consolidation-map source
  writePolicy: WritePolicy;
  // Exactly one of `screen` (existing CRUD/editor route) or `dataFile`
  // (relative to src/data — rendered by the generic /cms/entity/[type] viewer).
  screen?: string;
  dataFile?: string;
  note?: string;
};

// The registry. Entities with a `dataFile` are rendered read-only by the generic
// viewer at /cms/entity/[type]; entities with a `screen` use their existing editor.
export const ENTITIES: EntityDef[] = [
  // ── Content ──
  { type: "page", label: "Pages (SSOT)", cluster: "content", ownerSource: "design-system + llm-wiki", writePolicy: "editable", screen: "/cms/pages" },
  { type: "narrative_claim", label: "Narrative Claims", cluster: "content", ownerSource: "cms + llm-wiki", writePolicy: "editable", screen: "/cms/collections/narrative-claims" },

  // ── Travel ──
  { type: "package", label: "Tour Packages", cluster: "travel", ownerSource: "cms · okf · itinerary-core · postgres", writePolicy: "editable", screen: "/cms/tour-packages", note: "public copy editable · price operational-locked" },
  { type: "package_profile", label: "Package Profiles", cluster: "travel", ownerSource: "knowledge-catalog-okf", writePolicy: "read_only", dataFile: "okf/package-profiles.json" },
  { type: "destination", label: "Destinations", cluster: "travel", ownerSource: "llm-wiki + itinerary-core", writePolicy: "read_only", screen: "/cms/destinations" },
  { type: "destination_operational", label: "Destination Ops (routes/gear)", cluster: "travel", ownerSource: "itinerary-core", writePolicy: "read_only", dataFile: "itinerary-core/destinations-master.json" },
  { type: "route", label: "Routes", cluster: "travel", ownerSource: "itinerary-core", writePolicy: "read_only", dataFile: "itinerary-core/package-route-map.json" },
  { type: "activity", label: "Activities", cluster: "travel", ownerSource: "itinerary-core", writePolicy: "read_only", dataFile: "itinerary-core/activities-master.json" },

  // ── Trust ──
  { type: "policy_document", label: "Policy Documents", cluster: "trust", ownerSource: "llm-wiki-policy", writePolicy: "read_only", screen: "/cms/collections/policy-documents" },
  { type: "policy_card", label: "Policy Cards (OKF)", cluster: "trust", ownerSource: "knowledge-catalog-okf", writePolicy: "read_only", dataFile: "okf/policy-cards.json" },
  { type: "claim", label: "Trust Claims (C1–C9)", cluster: "trust", ownerSource: "llm-wiki-trust", writePolicy: "read_only", dataFile: "trust-bundle/claims.json" },
  { type: "public_person_profile", label: "People (founder, doctor, crew)", cluster: "trust", ownerSource: "llm-wiki-trust", writePolicy: "read_only", dataFile: "trust-bundle/people.json" },
  { type: "review", label: "Reviews & Ratings", cluster: "trust", ownerSource: "canonical-facts", writePolicy: "compliance_only", note: "ratings adjudicated — display only" },

  // ── Hybrid (support + narrative) ──
  { type: "faq", label: "FAQ Items", cluster: "hybrid", ownerSource: "llm-wiki-trust", writePolicy: "editable", screen: "/cms/faq", note: "canonical FAQ syncs from trust-bundle" },
  { type: "general_module", label: "Knowledge Modules (OKF)", cluster: "hybrid", ownerSource: "knowledge-catalog-okf", writePolicy: "read_only", dataFile: "okf/general-modules.json" },
  { type: "blog", label: "Blog / Insight Posts", cluster: "hybrid", ownerSource: "cms", writePolicy: "editable", screen: "/cms/blog" },

  // ── Global & System ──
  { type: "site_identity", label: "Site Identity", cluster: "global", ownerSource: "cms", writePolicy: "editable", screen: "/cms/global-singletons/site-identity" },
  { type: "asset", label: "Media Assets", cluster: "global", ownerSource: "cms", writePolicy: "editable", screen: "/cms/assets" },
];

export function entitiesByCluster(): Record<Cluster, EntityDef[]> {
  const out = { content: [], travel: [], trust: [], hybrid: [], global: [] } as Record<Cluster, EntityDef[]>;
  for (const e of ENTITIES) out[e.cluster].push(e);
  return out;
}

export function getEntity(type: string): EntityDef | undefined {
  return ENTITIES.find((e) => e.type === type);
}

export const CLUSTER_ORDER: Cluster[] = ["content", "travel", "trust", "hybrid", "global"];
