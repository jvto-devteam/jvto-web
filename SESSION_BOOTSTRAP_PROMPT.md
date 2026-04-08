Use this prompt at the start of a new Codex session on another PC:

```
Active repo is `jvto-web`.
Treat this repo as the only active frontend workspace.
Final target architecture is:
- one frontend codebase
- DB mirror as runtime data source

Do not reset context back to `JVTO-Why-JVTO-Next15`, `remix-why-jvto`, or `jvto-web-baseline-20260401`.
Those are not active workspaces.

Read these files first and use them as the project handoff:
- `SESSION_ARTIFACT_INDEX.md`
- `WORKSPACE_HANDOFF.md`
- `SESSION_FULL_HANDOFF.md`
- `FINAL_RECONCILIATION_MATRIX.md`
- `src/lib/homepage/homepageDoctrine.ts`
- `src/lib/trust/trustSupportDoctrine.ts`
- `src/lib/packages/packageDoctrine.ts`
- `src/lib/packages/priceTiers.ts`
- `src/lib/packages/checkoutPricingContract.ts`
- `src/lib/content/pinnedContentOverrides.ts`
- `src/lib/content/whyJvtoSsotFallback.ts`

Current realities:
- local build works
- DB mirror direct access from local has been historically intermittent, but a successful write sync was executed on `2026-04-06`
- DB-owned content for trust/support SEO, `why-jvto` SSOT pages, FAQ, `site_identity`, and `organization_profile` has already been synced to `DB mirror`

Work forward from the current `jvto-web` state. Do not re-derive strategy from old repos unless a missing payload is explicitly needed to repair runtime parity.
```
