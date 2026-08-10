# ADR-0001 — Domain Ownership: One Authority per Domain

- Status: Accepted (Milestone 1)
- Date: 2026-08-05
- Context: JVTO grew from fragmented content, transactional logic, legacy resolvers, and
  multiple producer repositories in which the same fact could be authored in several
  places at once (handoff §1, §3.2–§3.3). Without a single declared owner per domain,
  a website gap silently downgrades an upstream fact, and duplicated public sources
  re-inject retracted canon on every recompile (§27 "old producer restores stale public
  facts"). The handoff's architecture decision register (§3.6) and binding principles
  P-01, P-02, P-03, P-05 (§4) require exactly one authority per domain — not one store
  for the whole company. This foundational decision is a Milestone 1 deliverable
  (§16 Milestone 1) and must be recorded before any code moves between domains.

- Decision: Declare exactly one authority per domain (P-01) and forbid any other store
  from owning that domain's truth. Git-owned `content/` is the sole authority for
  evergreen public knowledge — page copy, entities, FAQs, public policy, evidence
  metadata, team biographies (P-02). PostgreSQL / provider events own all transactional
  state — price, availability, quote, booking, payment, traveler, crew assignment,
  journey task, trip state, and audit records (P-03). Generated outputs — HTML,
  metadata, canonical URLs, JSON-LD, sitemap, robots, public feeds, message drafts — are
  projections and are never authored or treated as upstream authorities (P-05). The
  binding assignment is the repo-grounded matrix in
  `docs/architecture/domain-ownership-matrix.md` (Milestone 0), which maps every §6
  domain to a concrete file or Prisma model. "SSOT" means per-domain, never one universal
  datastore (§3.6 row 1).

- Consequences:
  - Positive: every public route and generated surface traces to one owner (§22
    Authority); CI can enforce that a migrated route never regains a legacy source
    (`scripts/validate-static-route-ownership.mjs`); a website gap is recorded as a
    propagation recommendation, never a reason to downgrade an upstream fact.
  - Negative: public knowledge is dual-plane during transition (`content/` plus legacy
    `src/data/*`, `content_pages`, `narrative_claims`) until Milestone 2/8 retirement,
    so two paths must be kept consistent meanwhile.
  - Forbids: authoring public narrative in Prisma or TSX; treating static Markdown/JSON
    prices as pricing authority; treating a cached page as availability authority;
    building a second public-content SSOT or a universal CMS database (§2.2).

- Alternatives considered:
  1. One universal datastore ("everything in the DB") — rejected: §2.2 forbids a new
     universal CMS/second public SSOT; couples evergreen narrative to transactional state.
  2. Website as primary source of truth — rejected: the website is a secondary
     presentation layer over domain contracts (§1.4, §8 "Experience Engine is not an
     authority"); a gap there must not rewrite the graph.
  3. Keep multiple co-equal producers — rejected: this is the drift engine §27 warns
     about; controlled replacement (§3.6 row 2) requires a single frozen owner.

- Handoff references: §3.6 (decision register rows 1–2), §4 (P-01, P-02, P-03, P-05),
  §6 (domain ownership matrix), §16 Milestone 1, §22 (Authority acceptance), §29
  (repository files are evidence, not authority). Milestone 0 grounding:
  `domain-ownership-matrix.md`, `producer-artifact-classification.md`.
