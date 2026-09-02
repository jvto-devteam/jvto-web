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
- **`PrismaClientInitializationError` for runtime "windows" is conditional — it is not a constant, in either direction.** It appears only when `src/generated/prisma/query_engine-windows.dll.node` is missing. That file is gitignored (`.gitignore:48`), so a fresh clone starts without one and the error is expected there; the build completes regardless. On this machine the engine exists as of 2026-09-03 (21,046,272 bytes, generated 2026-09-02) and the build logged **zero** occurrences. This line previously said local builds "always" log it and that the file is "absent on this machine" — true when written, false now. So neither direction is a finding: seeing the error is not a regression, and not seeing it is not a signal. Check whether the engine file exists before saying anything about it.
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

**Jangkar diperbarui 2026-09-02:** angka di atas diukur ulang pada hasil merge `0e646a22` di `live` — yang sudah memuat penghapusan 28 dependency (`792c98ed`) **dan** PR #194 (`7d19b466`). Commit sesudahnya di `live` hanya menyentuh dokumen.

Verifikasi ulang wajib bila ada perubahan **kode** setelah `0e646a22`. Angka ini bukan pengecualian dari `STALE-FACTS-CHECKLIST.md` — ia berlaku selama jangkarnya masih HEAD; begitu ada commit kode baru, jangkarnya batal dan checklist yang berlaku lagi. Kalau tidak yakin jangkarnya masih HEAD, **ukur**, jangan kutip.

**7. Bedakan runtime dependency dari deployment dependency — jangan tertukar.**

| | Runtime dependency | Deployment dependency |
|---|---|---|
| Artinya | aplikasi butuh data/file/service ini untuk **menjalankan fitur** | proses **rilis** butuh host/jalur tertentu |
| Contoh di repo ini | `/api/file` ekosistem, Postgres untuk login pelanggan | SSH ke VPS, `git reset --hard`, `npm ci`, pm2 |
| Kalau hilang | fitur rusak bagi pengunjung | tidak ada rilis baru; versi lama tetap melayani |

Prosedur wajib sebelum menyimpulkan "aplikasi ini butuh `<host>`":

1. **Tulis ke disk saat runtime?** grep `writeFile|writeFileSync|mkdir|createWriteStream|unlink|rename\(|appendFile|rmdir|copyFile` di `src/app`, `src/lib`, `src/components`, `src/middleware.ts`. Nol = tidak ada state di disk.
2. **Butuh repo saudara?** cari `path.resolve(.*"\.\.")` dan `process.cwd(), ".."`. Untuk **setiap** hit, periksa apakah ada jalur `fetch` pendamping. **Cari di seluruh `src/`, bukan hanya `src/lib/ecosystemContent/`** — `src/lib/people/crewReviews.ts` lolos dari survei 2026-09-02 justru karena dibatasi ke direktori itu. Ia ternyata punya pola yang sama, tapi survei tersaring akan melaporkan 19 pembaca sebagai 18.
3. **Baca dari `public/`?** `path.join(process.cwd(), "public", …)` ikut bundle. Itu bukan keterikatan host.
4. **Mana yang cuma deploy?** `git reset --hard`, `npm ci`, `pm2`, `scp`, `rsync`, `ssh` — semuanya deployment, bukan runtime.
5. **HTTP 200 membuktikan apa?** Bahwa app dan infra hidup. **Bukan** bahwa repo harus menyatu, dan bukan bahwa jalur deploy sehat. Deploy bisa mati total sementara situs melayani normal — itu terjadi 2026-09-02.

Kalau langkah 1-3 nol dan yang tersisa cuma langkah 4, itu **deployment dependency**. Melaporkannya sebagai keterikatan arsitektur adalah kesalahan yang sudah pernah terjadi. Peta lengkapnya: `docs/architecture/repo-correlation-and-vps-boundary.md`.

## Deploy — biaya setiap commit

- **🔒 KEPUTUSAN PEMILIK 2026-09-02: jvto-web TIDAK memakai VPS.** Final. Jangan ditanyakan ulang, jangan disajikan sebagai pilihan, jangan dibuka lagi tanpa pemilik yang membukanya. Dibuktikan sebelum diputuskan: `JVTO_EKOSYSTEM_CONTENT_ROOT="/nonexistent-forces-http" npm run build` → exit 0, 106/106 halaman, paritas rute identik. Nol perubahan `src/`. **Ekosistem tetap di VPS** — ia melayani `/api/file` dan jadi target rsync. Konsekuensi lengkapnya di `docs/architecture/repo-correlation-and-vps-boundary.md` dan item `JVTO_WEB_VPS_MIGRATION` di `STATUS.yaml`. Aturan deploy di bawah berlaku sampai pemindahan itu benar-benar dikerjakan.

- **Push ke `live` (jvto-web) = deploy produksi.** `deploy.yml` SSH ke VPS, `git reset --hard`, `npm ci`, build, restart pm2. Antre, tidak membatalkan. **Tidak ada `paths-ignore`** — commit dokumen, `CLAUDE.md`, atau `.claude/rules/` pun membayar satu siklus deploy penuh. Gabungkan pekerjaan dokumen dengan pekerjaan kode; jangan push satu paragraf sendirian.
- **Merge beberapa branch = merge lokal semuanya dulu, lalu SATU push.** Verifikasi hasil merge (bukan hasil tiap branch), baru push. Dua push berurutan membayar dua deploy untuk hasil akhir yang sama.
- **🔴 JANGAN deploy jvto-web dan jvto-ekosistem berdekatan — keduanya satu VPS.** `concurrency` di `deploy.yml` hanya mengantre deploy **dalam satu repo**; tidak ada yang mengantre lintas repo. Terjadi 2026-09-02, **empat kali**: pukul 13:14 dua deploy mati saat deploy lain sedang `npm ci` + `next build`, lalu 15:47 dan 15:51 dua deploy mati lagi **tanpa deploy lain berjalan**. Pesannya sama — `dial tcp ***:22: i/o timeout` dan `ssh: connect to host *** port ***: Connection timed out` (exit 255) — sementara HTTPS kedua app tetap 200 sepanjang itu.

  **Sebabnya belum terbukti.** Beban bersamaan tidak menjelaskan yang 15:47/15:51. Yang terbukti hanya polanya: SSH tidak bisa dijangkau sementara app tetap melayani. Tetap urutkan deploy satu per satu — itu murah — tapi **jangan laporkan penyebabnya sebagai fakta**.

  Ini **deployment dependency**, bukan runtime dependency: repo tetap benar, produksi tetap menyajikan build sebelumnya, dan yang hilang cuma kemampuan merilis. Lihat Rule 7 dan `docs/architecture/repo-correlation-and-vps-boundary.md`.
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

- **Setiap laporan penyelesaian task WAJIB ditutup bagian `## Urgent Next Steps`.** Tiga kategori, pakai tanda yang sama persis:
  - 🔴 **Wajib ditindak sebelum sesi berikutnya** — risiko produksi, keamanan, atau biaya
  - 🟡 **Perlu diputuskan pemilik** — bukan sesuatu yang boleh dieksekusi sendiri
  - 🟢 **Bisa ditunda** — tapi dicatat supaya tidak jadi debt tak terlihat

  Kalau tidak ada satu pun yang masuk kategori mana pun, tulis eksplisit **"Tidak ada urgent next steps"**. Diam bukan jawaban — pembaca tidak bisa membedakan "sudah bersih" dari "belum diperiksa".

  **Hanya yang BARU atau BERUBAH sejak laporan sebelumnya.** Item yang sudah ada di `STATUS.yaml` dan belum bergerak **tidak diulang** — sebut jumlahnya saja (`STATUS.yaml: 5 NEEDS_OWNER, 9 TODO`). Mengulang item yang sama di laporan berturut-turut bukan pelacakan, itu bertanya lagi dengan bungkus lain, dan sudah bikin pemilik marah 2026-09-02 setelah VPS + Booking.com muncul di **empat** laporan beruntun. `STATUS.yaml` sudah jadi tempat yang bertahan; laporan tidak perlu jadi salinannya.

  **Bagian ini kebal ringkas.** Laporan boleh sependek mungkin, tapi `Urgent Next Steps` tidak boleh dipangkas, digabung ke paragraf lain, atau diringkas jadi satu baris "ada beberapa hal". Perlakuannya sama seperti pesan error, peringatan keamanan, dan konfirmasi aksi destruktif: gaya ringkas memangkas basa-basi, **bukan** isi yang menentukan tindakan. Kalau harus memilih antara memotong bagian ini atau memanjangkan laporan — panjangkan laporan.
- **Temuan risiko dicatat ke tempat yang bertahan, bukan cuma prosa.** Task list repo adalah `STATUS.yaml` — `npm run status:list`, dan `npm run status:set -- <ID> <STATUS> "catatan"` yang **membuat item baru kalau ID-nya belum ada** (status sah: `TODO`, `IN_PROGRESS`, `DONE`, `BLOCKED`, `NEEDS_OWNER`). Temuan yang hanya hidup di prosa hilang saat context di-compact. Catatan: `TodoWrite`/`TaskCreate` tidak selalu ada di sesi ini — periksa tool list, jangan asumsikan.
- **Review adversarial adalah gerbang, bukan pilihan.** Sebelum melaporkan pekerjaan besar selesai — penghapusan massal, perubahan dependency, merge ke `live`/`main` — jalankan subagent **`Explore`** (read-only, sesuai RULE 4) dengan brief yang secara eksplisit menyuruhnya **menyerang bukti sesi ini**, bukan mengulanginya. Sesi utama sudah terbiasa dengan asumsinya sendiri; fresh context yang menangkap sisanya. Brief-nya wajib menyebut apa yang `tsc` dan `build` **tidak bisa** tangkap: `import()` dinamis, referensi lewat string, konsumen non-JS (workflow, script npm, `public/`), rantai CSS/aset, dan kebocoran kredensial. Laporkan hanya yang berdampak produksi/keamanan/biaya.
- **Simulasikan, jangan tanya.** Kalau ada alat yang bisa membuktikan sesuatu aman — `git merge-tree --write-tree`, `npm run build`, `--dry-run`, merge lokal yang belum di-push — jalankan alatnya. Simulasi **menggantikan** pertanyaan, bukan mendahuluinya. Simulasi bersih + tujuan akhir tunggal = **eksekusi, lapor hasilnya**.
- **Jangan pecah satu tujuan jadi menu langkah.** "Push branch saja" vs "push + merge" bukan dua pilihan kalau kodenya memang untuk dipakai — itu satu tujuan yang dipaksa diputuskan dua kali, dan menyisakan branch menggantung. Tanyakan **tujuannya sekali** ("tayangkan sekarang?"), bukan tiap langkah menuju ke sana. Daftar gerbang yang mengikat ada di *Working posture* di bawah — dan `GLOBAL-CONSTRAINTS.md` tetap menang: **kalau ragu, TANYA.** "Simulasikan, jangan tanya" berlaku ketika alatnya bisa menjawab; keraguan yang tidak bisa dijawab alat tetap jadi pertanyaan.
- **`NEEDS_OWNER` hanya setelah mencari buktinya, bukan sebagai tempat parkir.** Sebelum melabeli apa pun "butuh keputusan pemilik" atau "tanpa bukti tercatat", cari dulu di `jvto-ekosistem` — `grep -rIn "<klaim>" --include="*.json"` — dan baca pesan commit yang membuatnya. Kejadian 2026-09-02: perubahan award Booking.com (`2016/9.2` → `2015/9.4`) dilabeli "tanpa bukti tercatat" dan diangkat ke pemilik **empat kali**, padahal buktinya ada di `organization.json:122`, di foto plakat + label kirim pada `verify-jvto-assets-inventory.json:825-840`, dan di lima file sumber lain — dan pesan commit-nya sendiri menyebut sumbernya. Nol file dibuka sebelum label itu ditulis.
- **Arahkan, jangan sodorkan pertanyaan terbuka.** Pemilik meminta rekomendasi berikut alasannya, bukan menu. Kalau ada kritik, tugasnya memahami maksudnya lalu bertindak — bukan bertanya "maksudnya apa". Pertanyaan hanya untuk gerbang yang benar-benar milik pemilik, dan bentuknya satu ya/tidak dengan konsekuensinya.
- **Bedah dulu, baru tanya.** Sebelum meminta keputusan: sebutkan file apa yang disentuh, apa yang bisa rusak, dan berapa biayanya (termasuk deploy yang terpicu). Menyodorkan menu tanpa membedah opsinya menghasilkan keputusan yang lebih buruk, bukan lebih cepat.
- **Satu opsi = satu jenis keputusan.** Perubahan izin, dependency, atau kredensial TIDAK BOLEH menumpang opsi rutin.
- **Yang butuh persetujuan tertulis bukan item menu.** Kalau guardrail mensyaratkan persetujuan (mis. dependency), sajikan sebagai permintaan izin, bukan pilihan setara.
- **Daftar gerbang yang mengikat — satu daftar, bukan dua.** Berhenti dan minta keputusan hanya untuk: kredensial · dependency baru atau dibuang · perubahan izin · penghapusan **data** · perubahan workflow sync/deploy · kegagalan env · **push/merge ke `live` atau `main`**. Selain itu: ambil opsi teraman yang masih dalam scope, catat, lanjut.

  Dua klarifikasi, karena daftar ini pernah bertabrakan dengan "Simulasikan, jangan tanya" di atas:
  - **"Penghapusan" di daftar ini berarti penghapusan DATA**, bukan penghapusan kode mati yang sudah dibuktikan tak terjangkau. Menghapus 139 file mati dengan bukti grep-simbol + paritas rute adalah pekerjaan biasa, bukan gerbang.
  - **Push/merge ke branch produksi TETAP gerbang**, meskipun `git merge-tree` bersih. Simulasi membuktikan *tidak ada konflik*; ia tidak membuktikan *pemilik ingin ini tayang sekarang*. Simulasi menghapus pertanyaan tentang **caranya**, bukan tentang **kapannya**.
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
