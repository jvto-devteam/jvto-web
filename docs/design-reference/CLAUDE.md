# JVTO Design Reference — Visual/Layout Reference Only

> **This folder is a design-system reference** (HTML mockups, CSS, JS, assets, screenshots).
> It is **NOT** a source of truth for facts. Do **not** copy figures, dates, prices,
> credentials, policy wording, or review counts from these mockups (or from this folder's git
> history) — the copy baked into the mockups can be stale. Treat any fact rendered here as a
> **placeholder** and verify it against the real sources below.

## Where the canonical facts actually live

| Need | Authoritative source |
|---|---|
| Adjudicated facts lock (founding, reviews, prices, contact/legal IDs, blue-fire, health rule) | `docs/CANONICAL_FACTS.md` |
| Production content (compiled bundles) | `src/data/{trust-bundle,policy-bundle,package-readiness,blog,okf}` — synced from producers, never hand-edited |
| Content producers (upstream SSOT) | `sambuko82/llm-wiki` (`master`) + `sambuko82/knowledge-catalog-jvto-bootstrap` (OKF `main`) |
| Schema / JSON-LD emitters | `src/lib/schemas/*` (e.g. `entityGraph.ts`) **and** `src/lib/seo/jsonld/builders.ts` — the shared Organization/WebSite/WebPage/FAQ/breadcrumb builders emitted via `src/components/seo/PageJsonLdCombined.tsx` |
| FAQ / narrative copy | `src/lib/*Faqs.ts` + DB `narrative_claims` (resolver: `src/lib/content/resolveFaqs.ts`) |

When writing or fixing site copy or schema, read `docs/CANONICAL_FACTS.md` first. If a fact
isn't there, fix it at the **producer** (llm-wiki / OKF) and re-sync — never hand-author a fact
in this folder or in `src/data/`.

> **Removed 2026-08-03:** the former `uploads/` fact-dossier (an "SSOT v6" snapshot) was a stale
> hand-copied duplicate of the upstream canon — it still asserted conditional health screening,
> the retired "Travel Credit" naming, and a 2016 incorporation date, and it drove recurring
> drift. Facts now have exactly one home: the producers above. This folder keeps only the visual
> reference.

## Using this folder (design only)

- Reuse the design system in `jvto-system.css` (`data-box`, `proof-grid`, `timeline`,
  `cred-table`, accordion). Don't invent new visual languages.
- Shared chrome lives in `_parts/chrome.json`.
- Write canonical HTML (close every tag, double-quote attrs) so direct edits work.
