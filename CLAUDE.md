# CLAUDE.md

Guidance for Claude Code in this repository.

## Read first

- `.claude/rules/GLOBAL-CONSTRAINTS.md` — always on, **overrides this file** where they conflict.
- `.claude/rules/STALE-FACTS-CHECKLIST.md` — before quoting any count, rating, date, or commit hash.
- `STATUS.yaml` (`npm run status:list`) — current open items.
- Commands: `/audit-schema`, `/check-density`, `/resolve-stale` (see `.claude/README.md`).
- `npm run test:stale` guards against stale-fact regressions.

## Project

**Java Volcano Tour Operator (JVTO)** — Next.js 16 site for `PT Java Volcano Rendezvous`, a licensed East Java private volcano tour operator (Ijen, Bromo, Tumpak Sewu). The site leads with verifiable trust signals (NIB, police credentials, BBKSDA compliance), not generic marketing.

Canonical codebase since the 2026-04-29 AEO/GEO port from `e:\test-2-2026` (archived). Single-repo development from here.

## Where data comes from — read before writing any query

**The database stores customer login. Nothing else the site displays.**

| What | Source |
|---|---|
| Everything displayed — packages, destinations, travel guides, policies, reviews, crew, credentials, claims, ratings | **`jvto-ekosistem`** via `src/lib/ecosystemContent/*` |
| Bookings, invoices, payments | **legacy API** (`NEXT_PUBLIC_LEGACY_URL_DOMAIN`) |
| Customer login sessions (Google SSO + email magic link) | **PostgreSQL via Prisma** |

No application code queries Prisma. If you are about to write `prisma.something.findMany()` for content, you are working against the architecture — read it from ekosistem instead.

Content is edited in `jvto-ekosistem`, not here. Prose that appears in `jvto-web` is drift and belongs back at the source.

Why the schema holds only 6 models, and why `prisma db pull` must never be run: `prisma/schema.prisma` lines 12-22. Customer login is the only thing between this repo and no database at all — tracked as `PRISMA_AUTH_ONLY` in `STATUS.yaml`.

## Architecture

The AEO/GEO schema layer (entity-graph `@id`s, `DEFINED_TERMS`, per-cluster schema builders, the ekosistem content-reader layer, `PageJsonLdCombined`) is in `.claude/rules/schema-and-content-layer.md`. It auto-loads when you touch `src/lib/schemas/`, `src/lib/ecosystemContent/`, `src/components/seo/`, or `src/lib/*Faqs.ts`.

### Server + client split

**Every `page.tsx` is a Server Component.** Existing client components under `src/components/website/` keep their Framer Motion / useState dependencies.

1. Server `page.tsx` exports `metadata` and injects JSON-LD via `<PageJsonLdCombined>` or `<JsonLd>`
2. Client `XxxClient.tsx` (PascalCase) handles motion and interactivity
3. Server fetches data and passes it as props
4. Schema injection is server-side, never inside a client component

**Never self-fetch `${SITE_URL}/api/...` from a Server Component** — it breaks SSG with `ECONNREFUSED` at build time. Extract the data logic into a `src/lib/.../get*.ts` helper and call it directly; API routes stay as thin wrappers for external clients.

### Routing

Route folders live under `src/app/(website)/` — `Glob` it.

Both cities use full-path slugs. The bare-name Surabaya format was a jvto_dev data bug (fixed 2026-05-02), not intentional design.

## Things that bite

- **Prisma nullable narrowing**: `where: { star: { not: null } }` does NOT narrow the TypeScript return type — the field stays `number | null`. Always `.filter(r => r.field != null)` before `.map()`, then use `r.field!`. See `buildIndividualReviewSchemas()`.
- **`content_pages.content.faq` is gone** — it died with the FAQ resolver on 2026-08-18. FAQ copy is edited in `jvto-ekosistem` now; tell admins that, not the old CMS story.
- **Adding an AI crawler to `public/robots.txt`** → also update `images.remotePatterns` in `next.config.ts` if its bot fetches avatars from external CDNs. Nothing in `next.config.ts` hints at this.
- **Turbopack dev server is slow on Windows.** Verify changes with `npm run build` (SSG-safe post-port) rather than dev-server smoke tests.
- **Never trust a tsc baseline written in a document.** Run `npx tsc --noEmit` fresh before calling anything a regression.
- **`src/lib/content/resolveFaqs.ts` is LIVE — never delete it.** `resolveFaqsForPage()` and `CANONICAL_FAQ_REGISTRY` were retired 2026-08-18, but the file survives and exports `buildResolvedFaqSchema()`, imported by `markets/malaysia/page.tsx` and `markets/singapore/page.tsx`. A retired function is not a retired module.
- **Local builds always log `PrismaClientInitializationError` for runtime "windows".** `src/generated/prisma/query_engine-windows.dll.node` is gitignored and absent on this machine. The build still completes. Never report it as a regression.
- **Mengekstrak daftar rute dari output `npm run build` — satu pola yang GAGAL, satu yang bekerja.** Diuji 2026-09-02 pada Next.js 16.

  ❌ **JANGAN pakai** `grep -E '^[├└│ ]*[○●ƒλ] '` — mengembalikan **nol baris**, bukan error. Dua sebabnya: baris pertama tabel diawali `┌` (tidak ada di kelas karakter itu), dan baris turunan `│ ├ /3d/ijen-crater` tidak punya penanda `○●ƒλ` sama sekali. Nol baris yang diam itulah bahayanya — terlihat seperti "tidak ada rute yang berubah".

  ✅ **Pakai ini:**

  ```bash
  awk '/^Route \(app\)/,/^$/' build.log \
    | grep -oE '(/[^ ]*|\[\+[0-9]+ more paths\])' | sort > routes.txt
  ```

  Menghasilkan **104 entri** (rute + placeholder `[+N more paths]`), kolom `Revalidate`/`Expire` terbuang sendiri. Untuk jumlah halaman, ambil dari log: `grep -oE "Generating static pages using [0-9]+ workers \([0-9]+/[0-9]+\)" build.log | tail -1`. **Selalu cek hasilnya bukan nol sebelum menyimpulkan paritas.**

## Verification rules — WAJIB, tidak bisa ditawar

**1. Mata rantai terakhir.** Sebelum sebuah rantai sebab-akibat dipakai untuk merekomendasikan tindakan, mata rantai yang benar-benar menentukan kesimpulan WAJIB diverifikasi sendiri. Bukan diwarisi dari dokumen, bukan disimpulkan dari mata rantai sebelumnya.

Berhenti dan uji sendiri jika:
- Sumber memuat `dugaan`, `hipotesis`, `BELUM DIVERIFIKASI`, `unverified`, `assumed`. Mengutip labelnya BUKAN pengganti mengujinya.
- Akan menyebut URL, slug, rute, atau ID yang belum pernah dilihat di sumber. Buka `route-output-index.json` / registry / schema dan salin. Menebak lalu melapor 404 adalah alarm palsu.
- Rantai ≥3 langkah. Tulis tiap mata rantai, tandai `[terverifikasi]` atau `[diasumsikan]`. Kalau yang terakhir `[diasumsikan]`, rekomendasi belum boleh keluar.

**2. Otoritas keputusan.** `../jvto-ekosistem/state/goals.json` → `decisions[]` **TIDAK memuat semua keputusan** (9 entri, hanya 2026-08-18 / 08-26 / 08-27). Keputusan tahun pendirian ada di `credentials-and-public-evidence/trust-claims.json` → klaim `C8` → `decisions[]`. Sebelum menyimpulkan "keputusan itu tidak ada", cari di KEDUA tempat.

**3. DEC-002 — tiga tahun untuk tiga hal, tidak boleh saling menggantikan.**

| Field | Nilai |
|---|---|
| `marketing_founding_year` | **2015** (era brand/guesthouse) |
| `legal_incorporation_year` | **2016** |
| `tdup_issued_year` | **2023** (terbit AHU/TDUP) |

Dikunci `jvto-ekosistem/scripts/test/llm-wiki-sync/trust-claims.test.mjs:164`. Mengisi slot "Incorporated" dengan 2023 adalah kesalahan yang sudah pernah terjadi (`485b2f85`), bukan hipotesis.

**4. Presedensi rute sebelum klaim kode-vs-live.** Next.js App Router menyelesaikan segmen folder statis SEBELUM `[slug]` saudaranya. Sebelum melaporkan kontradiksi "kode bilang X, live bilang Y", jalankan `find <cluster> -name "page.tsx"` dan pastikan file yang dibaca memang yang melayani URL yang disampel. `why-jvto/[slug]` saat ini melayani **0 slug** — `our-story`, `the-jvto-difference`, `community-standards`, `our-team`, `reviews` punya folder sendiri.

**5. Kode/dependency mati dibuktikan lewat SIMBOL, bukan nama.** Grep nama file atau nama paket sebagai kata telanjang selalu salah di repo ini — dan sudah pernah salah.

| Yang dicari | Cara yang SALAH | Cara yang WAJIB |
|---|---|---|
| Modul lokal | `grep "runtime"` → 18 file tak relevan (`src/generated/prisma/runtime/`, `getVolcanicStatus.ts`) | grep tiap **simbol yang diekspor** file itu (`grep "^export" <file>`, lalu grep tiap namanya) |
| Paket npm | `grep "mapbox"` di `src` saja | grep **specifier impor**: `grep -rE "[\"'](<pkg>)(/[^\"']*)?[\"']" src scripts` + `npm ls <pkg>` untuk pemakai transitif |
| Paket `@types/*` | grep specifier — **selalu nol**, tipe ambient tidak pernah di-import | hidup/mati mengikuti paket runtime-nya. `@types/X` boleh dibuang **hanya** bila `X` juga dibuang |

Kejadian nyata 2026-09-02: inventaris warisan menyebut `@types/mapbox-gl` mati. Grep simbol membuktikan sebaliknya — `mapbox-gl` diimpor `src/components/Route3DViewer.tsx`, yang melayani rute `src/app/3d/[slug]`. Membuangnya akan merusak rute produksi.

**Nol importer bukan bukti tunggal.** Sebelum memutuskan sebuah paket bisa dibuang, jalankan `npm ls <pkg>` — paket yang nol importer bisa tetap wajib ada karena paket lain menuntutnya.

**6. Fakta terukur 2026-09-02 — FINAL, jangan diverifikasi ulang.** Diukur langsung pada commit `690efb1e` (`fix/dec002-authority-and-dead-weight`), tiga kali build berturut-turut:

| Fakta | Nilai |
|---|---|
| Halaman statis ter-generate | **106/106** |
| Entri tabel rute build | **104** |
| Dihapus di Fase 5a | **139 file · 378.498 byte** |
| Commit Fase 5a | **4** — `bae18b71`, `690efb1e` (jvto-web) · `c6c60d57`, `457080dc` (ekosistem) |

Verifikasi ulang hanya bila ada perubahan kode **setelah** `690efb1e`. Sebelum itu: pakai angkanya, jangan bangun ulang baseline-nya.

## Deploy — biaya setiap commit

- **Push ke `live` (jvto-web) = deploy produksi.** `deploy.yml` SSH ke VPS, `git reset --hard`, `npm ci`, build, restart pm2. Antre, tidak membatalkan.
- **Commit apa pun ke `main` (ekosistem) = deploy penuh + revalidasi 294 rute ke jvto-web.** `paths-ignore` di `deploy-vps.yml` TIDAK memuat `docs/**`, jadi commit dokumen pun memicunya. Gabungkan pekerjaan ekosistem jadi satu commit; tiap commit terpisah membayar satu siklus deploy.

## Scope guardrails

- No content or copy rewrites
- No legacy-route deletion, no new 301s
- No changes to the sync/deploy workflows: `.github/workflows/ci.yml`, `deploy.yml`, `update-volcanic-status.yml` (the old `sync-llm-wiki.yml` and `scripts/sync-trust-bundle.mjs` this line used to name were deleted 2026-08-15; verified gone 2026-09-02)
- No deploy or CI workflow changes
- No dependency changes without written approval
- No hiding TS or build errors
- No broad SEO edits
- Conversion scope: `travel-guide/faq` only

## Tool discipline — Windows, multi-root workspace

- **Setiap panggilan Bash yang menyentuh git/npm WAJIB diawali `cd <repo> &&` eksplisit.** Workspace ini punya 4 root dan cwd bertahan antar panggilan; panggilan paralel berbagi cwd. Tanpa `cd`, perintah jalan di repo yang salah — ini sudah terjadi berulang kali dalam satu sesi.
- **Jangan pakai here-string PowerShell (`@'…'@`) di tool Bash.** Untuk teks multi-baris pakai heredoc `<<'EOF'`. Untuk pesan commit panjang: `git commit -F - <<'MSGEOF'`.
- **Jangan parse output `ls` dengan `awk $9`.** Path Windows mengandung spasi. Pakai `git ls-files | while IFS= read -r f; do ... stat -c%s "$f" ...; done`.
- **Cek `.git/*.lock` di awal sesi.** Proses git yang crash meninggalkan `index.lock` / `HEAD.lock` 0 byte yang baru menggigit saat pindah branch. Sebelum menghapus: pastikan tidak ada proses git berjalan, dan `git fsck --connectivity-only` bersih.

## Working posture

- **Bedah dulu, baru tanya.** Sebelum meminta keputusan: sebutkan file apa yang disentuh, apa yang bisa rusak, dan berapa biayanya (termasuk deploy yang terpicu). Menyodorkan menu tanpa membedah opsinya menghasilkan keputusan yang lebih buruk, bukan lebih cepat.
- **Satu opsi = satu jenis keputusan.** Perubahan izin, dependency, atau kredensial TIDAK BOLEH menumpang opsi rutin.
- **Yang butuh persetujuan tertulis bukan item menu.** Kalau guardrail mensyaratkan persetujuan (mis. dependency), sajikan sebagai permintaan izin, bukan pilihan setara.
- Don't ask questions unless you hit a real blocker (credentials, new deps, deletion, live branch, sync/deploy workflow, env failure, PR merge). Otherwise take the safest in-scope option, document it, and continue.
- No dummy or fake DB. Never invent or hardcode a `DATABASE_URL`, never ask for production credentials. If Prisma needs it and it is absent, quote the error verbatim and continue with non-DB steps.
- Stop only if dependencies cannot install or file-based validation cannot run.
- No long SEO reports — doc stubs link to `docs/_audit/package1-audit.md`.

## Session Operating Rules

These rules are active every session. Claude must follow them without being reminded.

**RULE 1 — No blind continuation**
Never respond to vague prompts ("lanjutkan", "continue", "yes", "ok", "next") without first stating:
- `→ ORIENTATION: I am currently [doing X] in [file Y].`
- `→ NEXT ACTION : I will now [specific action Z].`
If you cannot fill both, ask 1 specific question. Do not assume and proceed.

**RULE 2 — Compact checkpoint at 60 calls**
At every 60th tool call, output:
`⚠ COMPACT CHECKPOINT — [N] calls. Done: [3 bullets]. → Recommend /compact.`

**RULE 3 — External content protocol**
If a URL or file path is pasted AND call count > 30:
`⚠ External content in heavy context. Recommend /compact first.`
Wait for user confirmation before fetching.

**RULE 4 — Subagent selection (enforce every spawn)**
- Read-only (search, analyze, inspect) → always `Explore`
- Writes, bash, DB changes → `general-purpose`
- Code quality, lint → `code-reviewer`
State the type and reason before spawning. Never use `general-purpose` for read-only tasks.

**RULE 5 — No mid-session /init**
If context feels unclear, read CLAUDE.md directly. `/init` is for fresh session starts only — never run it mid-session.

**RULE 6 — Drift check every 20 calls**
Before any file edit at call N (multiple of 20):
`→ DRIFT CHECK [N]: [current task] → serves [sprint goal] ✓`
If you cannot connect them: flag drift and stop before continuing.

**RULE 7 — Phase transition format**
Before starting any new phase, output or require:
```
## PHASE START: [name]
Previous phase completed: [1 sentence]
Current state: [last file touched]
This phase goal: [1 sentence]
Scope: ONLY [files/folders]
Do NOT: [what must stay unchanged]
```

Use `/phase-start` to run this automatically. Use `/session-close` to commit + handoff.

**Audit / mapping tasks** → invoke the `analisis-steril` skill before measuring anything.

## Auto-memory

Memory terpecah dua direktori, dan ini bukan bug yang bisa diabaikan:

- `~/.claude/projects/f--jvto-web/memory/` — **17 file lama**, ditulis saat repo masih di `F:`. Berisi kontrak yang masih berlaku.
- `~/.claude/projects/d--jvto-web/memory/` — **tempat sesi dari `D:` menulis dan membaca**. Diisi mulai 2026-09-02.

**Sesi dari `D:` hanya melihat direktori `d--`.** Jadi `ls` KEDUA direktori saat mencari memori lama; jangan simpulkan sebuah memori tidak ada hanya karena tidak muncul di `d--`.

**Read on demand, never all at once.** Di `f--`: `decision_filter_5check.md` gates any code/copy/DB/schema change; `cluster_role_contracts.md` is required before per-cluster work. `ls` the folder for the rest.

Update memory when significant work completes.

## Skill routing

Match the request to an available skill and invoke it. When in doubt, invoke. Skill names are listed in `~/.claude/CLAUDE.md`.

Ideas → `/office-hours` · strategy → `/plan-ceo-review` · architecture → `/plan-eng-review` · design consultation → `/design-consultation` · visual polish → `/design-review` · full pipeline → `/autoplan` · bugs → `/investigate` · QA → `/qa`, `/qa-only` · code review → `/review` · ship → `/ship`, `/land-and-deploy` · context → `/context-save`, `/context-restore`.
