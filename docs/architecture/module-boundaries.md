# Module Boundaries (Milestone 1 — architecture foundation)

> Grounded in [JVTO_TECHNICAL_PROJECT_HANDOFF.md](JVTO_TECHNICAL_PROJECT_HANDOFF.md) §5.1
> (deployment form) + §6 (domain ownership) + §7 (canonical contracts). Milestone 1
> establishes module **APIs and boundaries** — it does **not** move existing files
> (handoff §5.1: "Establish module APIs, migrate importers, then relocate code when
> tests prove behavior"). Existing `src/app`, `src/components`, `src/lib` are untouched
> and remain out of the boundary gate's scope until they are migrated in later milestones.

## Layers (modular monolith)

| Layer | Path | Role | May depend on |
|---|---|---|---|
| Shared contracts | `src/domains/shared/**` | IDs, Money, VersionRef/provenance, DomainEvent, errors (§7) | (nothing internal) + external |
| Domains | `src/domains/<domain>/**` | pure business rules per §6 authority | `domains/shared`, own domain, external |
| Application | `src/application/**` | commands/queries/orchestrators (§7.8) | domains, infrastructure, shared, external |
| Infrastructure | `src/infrastructure/**` | flags, observability, audit, outbox, (later) prisma/queues/providers | domains, shared, prisma, external |
| Integrations | `src/integrations/**` | Xendit/WhatsApp/email/partners adapters (later milestones) | application, infrastructure, shared |
| Presentation / UI | `src/app/**`, `src/components/**`, `src/presentation/**` | Next routes + composition | application (read models), shared |

## Enforced dependency rules (`scripts/validate-architecture-deps.mjs`, blocking in `verify`)

The gate scans **only** `src/domains`, `src/application`, `src/infrastructure` and fails on:

- a **domain** importing UI (`app`/`components`/`presentation`), `prisma`, the application layer,
  infrastructure, or **another domain** (cross-domain only via `domains/shared`);
- **`domains/shared`** importing any specific domain, infrastructure, application, prisma, or UI;
- the **application** layer importing UI or `prisma` directly (repositories are injected);
- **infrastructure** importing UI or the application layer.

`node scripts/validate-architecture-deps.mjs --selftest` proves the matcher (19 cases).

## What Milestone 1 shipped (all behavior-preserving, nothing wired into the running app)

- **Shared contracts** — `src/domains/shared/{ids,money,version,events,errors}.ts`.
- **Application contracts** — `src/application/contracts.ts` (Command/Query handler shapes +
  the §7.8 command/query catalogs).
- **Infrastructure** — `src/infrastructure/`:
  - `flags/` — feature-flag mechanism, all flags **OFF** by default;
  - `observability/` — structured logger (§20.1 fields) + correlation-id helper;
  - `audit/` — `AuditLog` interface + no-op / in-memory impls (durable table deferred);
  - `outbox/` — `OutboxStore` interface, `InMemoryOutboxStore`, `OutboxWorker` skeleton behind
    the `outbox-worker` flag; `withOutbox` unit-of-work (§7.7). Physical `domain_outbox` table
    is deferred to a later **owner-gated** migration (expand–migrate–contract, §14).
- **ADRs** — `docs/architecture/adr/ADR-0001..0005` (ownership, snapshots, events, caching, AI envelopes).
- **Gates** — architecture-deps gate + outbox integration test, both in CI `verify`.

## Deferred (not Milestone 1)

- Physical DB tables (`domain_outbox`, `audit_log`, …) — owner-gated migration in a later milestone.
- Concrete domain logic + Prisma-backed repositories — arrive with each domain's milestone.
- Relocating existing `src/app`/`src/lib` code into the tree — only after parity tests (§5.1).
