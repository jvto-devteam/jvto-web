# JVTO Strategic Reference — AI/AEO/GEO Architecture

> Extracted from three Google Drive strategy documents (read 2026-05-04).
> Sourceable IDs: GEO Strategy (16FiJE3rXKTcbTRFGqky3uf6MwJU6_hmtqy7d7cJu1h4),
> AEO Redesign (1_gdH1TTNn9AAEkWvq88eCJWrHfmZZ4K2lU4AfxcennA),
> URL SEO Config (1k3vslqWSZ1C6xKgDfEfdgbGovTg_T2apTzSYQGZFia4).

---

## 1. Core Strategic Framework

**GEO (Generative Engine Optimization)** — JVTO's primary AEO objective is to be cited by AI engines
(ChatGPT, Gemini, Perplexity, Claude) for queries like "best Mount Ijen tour operator" and
"is JVTO legit/licensed?". Citation frequency = Share of Voice (SOV).

**SSOT = GEO prerequisite.** Entity consistency across all surfaces (website, Google Business,
Trustpilot, Tripadvisor, ISIC, Indecon) is the minimum condition for GEO to work. If JVTO's
name/address/credentials differ across platforms, AI engines de-prioritise the entity.

**Three discoverability layers:**
1. Traditional search (Google/Bing) → structured data, E-E-A-T, Core Web Vitals
2. Generative AI (ChatGPT, Gemini) → entity clarity, claim verifiability, third-party corroboration
3. Answer engines (Google SGE) → snippet-ready content, FAQ structure, direct answer format

---

## 2. Citation Cliff + Content Freshness

The "citation cliff" problem (also called "answer drift" in the AEO doc): AI engines cache a snapshot
of a page. If volcanic status or review scores are stale in that snapshot, AI cites wrong info.

**Solution implemented (2026-05-04):**
- `public/ops/volcanic-status.json` — manually updated by JVTO ops team; `last_verified` field
- `SpecialAnnouncement` schema with `expires` field set to +72h from `last_verified`
- `revalidate = 3600` on destination pages ensures AI crawlers see fresh timestamps hourly
- AI crawlers reading `ai-agent-config.json` → `content_freshness.volcanic_status.stale_after_hours: 72`

**No MAGMA Indonesia API** — none of the three strategy documents references a real-time API.
Manual update approach is intentional and correct for JVTO's operational scale.

---

## 3. ai-agent-config.json Structure

File deployed at: `public/.well-known/ai-agent-config.json`

Key sections implemented:
- `capabilities`: real_time_availability, safety_verification, direct_booking, tour_information,
  destination_information, credential_verification, volcanic_status, health_screening_info
- `endpoints`: llms_txt, tours_api, destinations_api, volcanic_status, verify_hub, itineraries,
  booking_inquiry, safety_status, sitemap
- `scraping_permissions.per_crawler`: GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Googlebot
- `content_freshness`: volatile_status (72h), credentials (on_change + SHA256), reviews (monthly)
- `verification`: links to AHU, OSS, HPWKI, ISIC, satusehat.kemkes.go.id (doctor SIP), proof_library

**No official 2026 standard** — the three strategy documents do not prescribe a specific JSON schema
for ai-agent-config.json. The structure above is designed based on OpenAI plugin format conventions
+ JVTO-specific AEO needs.

---

## 4. SHA-256 Forensic Hashing

Already implemented in SSOT + llms.txt. Hashes for key documents:
- NIB `1102230032918`: `fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7`
- TDUP `1102230032918`: `27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3`
- HPWKI approval: `ca1fb1a48b550a7748d400f165899f12a356e6941aacdde9c043427698aaf63b`
- SPRIN-POLPAR: `03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab`
- SPRIN-WAL-TRAVEL-2024: `179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3`

SHA-256 hashes are published in `public/llms.txt` and referenced in `ai-agent-config.json`
under `credentials.sha256_anchored: true`. No new requirements from strategy documents.

---

## 5. Person Schema — Named Guides

**GEO doc GAP 4:** "15 crew tidak punya halaman terindeks. Review mentions nama guide spesifik
(Anjas, Boy, Taufik, Gufron, Kiki, Rendi) — ini topical entity signal yang AI gunakan."

**Required future work (NOT in scope of 2026-05-04 session):**
- Create `/why-jvto/our-team` with `buildCrewPersonSchema()` per active crew (schema already exists in entityGraph.ts)
- Create `/team/[slug]` per guide (minimal 8 guide utama) — GEO doc recommended
- Each page: `@type: Person` + `knowsAbout` + review quotes per guide
- Link `/why-jvto/reviews` → `/team/[slug]` for co-occurrence signal

**Current state:** `buildCrewPersonSchema()` exists in entityGraph.ts and is used on `/why-jvto/our-team`.
The gap is individual `/team/[slug]` URL-per-guide pages for deeper entity signal.

Named guides for Person schema (from SSOT):
- Anjas Setyawan R. (KTA: kta-anjas) — Visual Storyteller & Guide
- Ahmad Lutfi Hagi "Kiki" (KTA: kta-kiki) — Guide
- Gufron (KTA: kta-gufron) — Senior Guide & Photography Specialist
- Rendi Rivaldi (KTA: kta-rendi) — Expedition Safety Lead
- Mohammad Taufik (KTA: kta-taufik) — Guide
- Boy (Ahboy) — Guide (most-cited in reviews)
- Fauzi — Guide

---

## 6. MedicalWebPage Schema — Ijen Health Screening

**AEO Redesign doc:** `/travel-guide/ijen-health-screening` requires `MedicalWebPage + FAQPage`.
**URL SEO Config doc:** Confirms `WebPage;FAQPage;BreadcrumbList` for this page.

**Current state:** The page exists at `/travel-guide/ijen-health-screening` with `MedicalWebPage`
schema and `DOCTOR_SCHEMA` cross-ref (implemented in an earlier port session, 2026-04-29).
This gap was already closed. Verify via `src/app/(website)/travel-guide/ijen-health-screening/page.tsx`.

Key schema requirements per docs:
- `@type: MedicalWebPage`
- `HowTo` schema for 5-step screening process
- `DOCTOR_SCHEMA` cross-ref (`/#dr-ahmad-irwandanu`)
- `BBKSDA_REGULATION_SCHEMA` cross-ref
- `DEFINED_TERMS.SE1658` cross-ref
- External links to satusehat.kemkes.go.id (doctor verification) — must be `rel="noopener"` (no NoFollow)

---

## 7. GEO Gaps — Updated Status (as of 2026-05-05)

From GEO doc Bagian 3.2 — status updated after sesi 2026-05-05:

| Gap | Priority | Description | Status |
|-----|----------|-------------|--------|
| GAP 4 | HIGH | Crew registry pages per guide | ✅ CLOSED — `/team/[slug]` exists, 11 active crew with content_pages rows |
| Insights Hub | MED | Long-tail AEO content hub | ⏳ OPEN — `/blog/page.tsx` exists but URL mismatch vs spec (`/insights/[slug]`) |
| Per-crawler robots.txt | MED | AI bots in robots.txt | ✅ CLOSED — `src/app/robots.ts` has 22 bot entries + Disallow /api/ /_next/ /lp/ |
| Review → Team co-occurrence | LOW | `/why-jvto/reviews` → `/team/[slug]` links | ⏳ OPEN — links not yet added |
| Natural language search | LOW | NL query → filter mapping on `/tours` | ⏳ OPEN — not built |

---

## 8. URL Architecture (from URL SEO Config doc)

Key URL patterns confirmed by strategy documents:

| Route | Schema Types | Notes |
|-------|-------------|-------|
| `/` | TravelAgency + WebSite | sameAs array (5 platforms) |
| `/tours` | CollectionPage + ItemList | hub |
| `/tours/from-{origin}/{slug}` | TouristTrip + Offer + BreadcrumbList | tour detail |
| `/destinations/{slug}` | TouristDestination + WebPage + BreadcrumbList | destination detail |
| `/why-jvto` | AboutPage + WebPage | trust hub |
| `/verify-jvto` | AboutPage + WebPage + hasPart | proof library |
| `/travel-guide/ijen-health-screening` | MedicalWebPage + FAQPage | unique schema |
| `/policy/booking-payment-cancellation` | WebPage + TermsOfService | SpecialAnnouncement for Travel Credit |
| `/contact` | ContactPage + Organization | NAP anchor |
| `/insights/[slug]` | BlogPosting + Article | NOT YET BUILT |

---

## 9. Canonical Brand Rules (per AEO doc)

- **Entity name in citations:** "Java Volcano Tour Operator" (not just "JVTO")
- **Founder name:** "Agung Sambuko (Mr. Sam)" — consistent across all pages
- **Legal name:** "PT Java Volcano Rendezvous" — only on legal/verify pages
- **Policy consistency:** "No cash refunds; 100% JVTO Travel Credit if canceled ≥48h before Day 1"
- **Police escort:** Available on request for large groups — NOT automatically included
  (AEO doc warns this is a potential confusion point that should be clarified explicitly)

---

## 10. Image Assets

**Source of truth (typed constants):** `src/lib/imageAssets.ts`  
**Raw data:** `docs/assets/jvto_image_asset_map.json`  
**Human-readable tables:** `docs/assets/JVTO_SSOT_Image_Asset_Map.md`

Total: **54 assets** in the JSON map + 1 additional (`FOUNDER_WITH_GUESTS_STEFAN_LOOSE`) from the Inventory.

| Group | Count | Primary pages |
|-------|------:|---------------|
| `crew_portraits` | 11 | `/why-jvto/our-team`, `/team/[slug]` |
| `field_operations` | 8 | `/homepage`, `/why-jvto`, `/travel-guide`, `/travel-guide/police-escort-for-groups` |
| `crew_credentials` | 5 | `/verify-jvto`, `/why-jvto/our-team` |
| `health_screening` | 5 | `/verify-jvto`, `/travel-guide/ijen-health-screening` |
| `history_heritage` | 5 | `/why-jvto/our-story`, `/verify-jvto/history-artifacts` |
| `police_authority_documents` | 4 | `/verify-jvto/police-safety` |
| `founder_leadership` | 3 (+1) | `/homepage`, `/why-jvto`, `/verify-jvto/police-safety`, `/verify-jvto/press-recognition` |
| `press_mentions` | 3 | `/verify-jvto/press-recognition` |
| `brand_identity` | 2 | Sitewide |
| `legal_business_identity` | 2 | `/verify-jvto/legal` |
| `legal_membership` | 2 | `/verify-jvto/legal` |
| `legal_tourism_license` | 2 | `/verify-jvto/legal` |
| `partner_validation` | 1 | `/isic/student-package` |
| `uncertain` | 1 | Manual review |

Named lookup helpers in `imageAssets.ts`:
- `CREW_PORTRAITS_BY_CODE[code]` — portrait by crew_members.code
- `CREW_CREDENTIALS_BY_CODE[code]` — KTA card by crew_members.code
- `FOUNDER_WITH_GUESTS_STEFAN_LOOSE` — special asset from Inventory, not in JSON map
- `ALL_IMAGE_ASSETS` — flat array of all 55 assets for iteration

---

*Last updated: 2026-05-04. Re-fetch from Drive only if strategy changes.*

---

## 11. SSOT Documents

Canonical strategy documents archived to `docs/ssot/` on 2026-05-05. These are the authoritative
source-of-truth files for JVTO's digital strategy, schema architecture, and commercial logic.

| File | Role |
|------|------|
| `JVTO_CANONICAL_SSOT_PRD.md` | Master product requirements document — entity graph rules, @type specs (Section 4.3), credential requirements, schema precedence |
| `JVTO_MASTER_MAP.md` | Full site map — URL → schema type mapping, cluster ownership, build dependency order |
| `JVTO_TRUST_GRAPH_MAP.md` | Evidence correlation graph — how credentials, press, and associations link into a machine-readable trust chain |
| `JVTO_PACKAGE_LOGIC_SPEC.md` | Tour package data model — pricing logic, FOC scheme thresholds, Travel Credit policy, Xendit integration spec |
| `JVTO_Canonical_Spec_Set.md` | Per-cluster canonical Q&A pairs, MH/SH/NTH signal contracts, and FAQ source precedence rules |
| `Strategic_JSON-LD_Knowledge_Graph_Implementation_Guide.md` | Step-by-step JSON-LD implementation guide — node types, cross-ref patterns, GEO/AEO signal density targets |
| `JVTO_Unified_Commercial_System.md` | Strategic blueprint for trust-led digital growth — SOV targets, citation architecture, conversion funnel |

**Usage rule:** when adding a new schema node, cluster, or credential — consult `JVTO_CANONICAL_SSOT_PRD.md`
first for @type and @id conventions. `JVTO_TRUST_GRAPH_MAP.md` is the reference for evidence chain completeness.
