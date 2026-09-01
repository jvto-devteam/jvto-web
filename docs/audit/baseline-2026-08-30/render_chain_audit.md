# JVTO — RENDER CHAIN AUDIT (TERISI)
### Dari "apa yang live" sampai "apa yang boleh diubah"
**Versi template:** v1.0 · **Run:** 2026-08-30
**Status:** Section 0–6 TERISI · **Section 7 SENGAJA KOSONG** (fase pengisian, belum fase keputusan)
> ⚠️ **BACA ADENDUM A DI AKHIR DOKUMEN SEBELUM MEMAKAI SECTION 6.** Run kedua (2026-08-30) menemukan lapisan governance `state/goals.json` yang run pertama lewatkan. Empat temuan diturunkan/ditarik, satu temuan **P0 baru** muncul, dan kesimpulan "tidak ada P0" DITARIK. **ADENDUM B** (run ketiga) memetakan hubungan dua repo: D12 ditutup, D10 dibuka kembali ke P1, tiga temuan struktural baru. Peta penuh: `jvto-ekosistem/docs/architecture-as-built-2026-08-30.md`.

> Aturan tag: `[live]` = di-fetch dari produksi run ini · `[repo]` = dibaca dari working tree kedua repo run ini · `[doc]` = dari standing document/SSOT JVTO (tidak dibaca ulang run ini) · `[inferensi]` = kesimpulan, ditandai BELUM DIVERIFIKASI.
> `UNKNOWN` = tidak diverifikasi run ini karena tidak ada akses. Bukan kegagalan, tapi gap yang harus diisi.

---

## SECTION 0 — SCOPE & METADATA

| Field | Isi | Tag |
|---|---|---|
| Tanggal audit | 2026-08-30 (Asia/Bangkok) | |
| Yang mengaudit | Claude (Cowork session), eksekusi shell di mesin Sam, repo working tree + fetch produksi | |
| Pemicu audit | Sam menyerahkan template Render Chain + 3 dokumen framework; jalur Appendix C.2 (template kosong → diisi dengan pemeriksaan nyata) | |
| Scope yang diaudit | Seluruh site produksi: 296 URL sitemap, di-fetch semuanya. Dua repo: `jvto-web@live`, `jvto-ekosistem@main`. Host `ekosistem.*` dan `mcp.*` diprobe di permukaan. | `[live]` `[repo]` |
| Yang JELAS di luar scope | Section 7 (keputusan/rekomendasi) · Google Search Console · Klook / GBP / TripAdvisor / The Window Travel / social · isi MCP server (401) · WhatsApp agent runtime · Vercel deployment ID · database Postgres produksi | |
| Repo + branch | `jvto-devteam/jvto-web@live` · `jvto-devteam/jvto-ekosistem@main` | `[repo]` |
| Commit SHA saat audit | web: `99673b2f03676b255454688c3bca06092caddc0f` (2026-08-30T15:14:18+07:00, "Merge pull request #191 from jvto-devteam/fix/destination-og-image-featured-image-fallback")<br>ekosistem: `fceb97d2b7ce0a20f9c67d3c7b2c74d4a7c2bfeb` (2026-08-30T14:52:07+07:00, "Include destination-detail routes in the jvto-web revalidation webhook (#9)") | `[repo]` |
| Working tree bersih? | web: bersih. ekosistem: hanya `?? .claude/` (untracked, bukan konten). | `[repo]` |
| Deploy/build ID produksi | **UNKNOWN** — tidak ada akses Vercel. Yang bisa dibuktikan: header `x-nextjs-cache: STALE`, `x-nextjs-prerender: 1`, `x-nextjs-stale-time: 300`, `cf-ray: a332a59bde84fe0d-SIN` pada 2026-08-30T09:07:44Z. **Konsekuensi: temuan `[live]` tidak dapat dipin ke commit tertentu.** | `[live]` |
| Dokumen SSOT yang berlaku | `JVTO_Cetak_Biru_Arsitektur_Semantik_v1.md`, `JVTO-HANDOFF-2026-08-20.md` — **tidak dibaca run ini**. Aturan standing di Section 6.2 diberi tag `[doc]` dan harus diverifikasi ulang terhadap file aslinya. | `[doc]` |
| Definisi "selesai" audit ini | Section 0–5 terisi dari pemeriksaan nyata; Section 6 punya severity + gerbang falsifikasi dijalankan; semua UNKNOWN ditulis eksplisit; Section 7 kosong. | |
| Artefak bukti | `docs/audit/live_html_url_audit_2026-08-30.csv` (296 baris, 27 kolom, hasil fetch mentah) | `[live]` |

**Metode Section 5:** 296 URL di-fetch dengan `curl -sL`, UA `Mozilla/5.0 (compatible; JVTOAudit/1.0)`, HTML mentah disimpan (33 MB), field diekstrak dengan parser regex + parser JSON-LD rekursif. Semua angka di Section 5 dapat direproduksi dari CSV bukti.

---

## SECTION 1 — APA YANG LIVE?

### 1.1 Surface Inventory

| # | Surface | Host / Endpoint | Milik | Sumber deploy | Status terverifikasi | Tag |
|---|---|---|---|---|---|---|
| S1 | Website utama | `javavolcano-touroperator.com` | JVTO | `jvto-web@live` → Vercel di belakang Cloudflare | **live**, HTTP/2 200, `server: cloudflare`, `x-powered-by: Next.js` | `[live]` |
| S2 | Ekosistem content host | `ekosistem.javavolcano-touroperator.com` | JVTO | `jvto-ekosistem` (mekanisme UNKNOWN) | **live**, 200. Melayani `/api/website/page?route=…` (JSON) dan SPA shell HTML untuk semua path lain | `[live]` |
| S3 | MCP server | `mcp.javavolcano-touroperator.com/mcp` | JVTO | UNKNOWN | **live tapi terlindungi**: HTTP 401 | `[live]` |
| S4 | WhatsApp agent (Meta) | UNKNOWN | JVTO | UNKNOWN | **UNKNOWN** — tidak diperiksa run ini | |
| S5 | Google Business Profile | CID `1266403973589689021` | JVTO | manual | **UNKNOWN** — tidak diperiksa run ini | `[doc]` |
| S6 | Klook listing | UNKNOWN | pihak ke-3 | manual | **UNKNOWN** | |
| S7 | The Window Travel (B2B MY) | UNKNOWN | pihak ke-3 | manual | **UNKNOWN** | |
| S8 | OTA lain (TripAdvisor/Booking) | UNKNOWN | pihak ke-3 | manual | **UNKNOWN** — `sameAs` di JSON-LD menyebut Trustpilot/Google/TripAdvisor tapi tidak divalidasi run ini | |
| S9 | Social (IG/FB/TikTok) | UNKNOWN | JVTO | manual | **UNKNOWN** | |
| S10 | Preview/branch deploy | UNKNOWN | JVTO | Vercel | **UNKNOWN** — tidak ada akses daftar deployment | |
| S11 | Route `/3d/{slug}` | `javavolcano-touroperator.com/3d/*` | JVTO | `jvto-web@live` | **live, di luar sitemap**: `/3d/ijen-2d1n` → 200 + `<meta name="robots" content="noindex">`; `/3d/bromo-1d1n` → 404 | `[live]` `[repo]` |

### 1.2 Kontrol Edge & Crawler

| Item | Kondisi terverifikasi | Bukti | Tag |
|---|---|---|---|
| DNS / proxy (S1) | Cloudflare proxied | header `server: cloudflare`, `cf-ray`, `cf-cache-status: DYNAMIC`, `alt-svc: h3` | `[live]` |
| `robots.txt` — Googlebot | **Allow** | `User-Agent: Googlebot` / `Allow: /` | `[live]` |
| `robots.txt` — Google-Extended | **Allow** | blok eksplisit ada | `[live]` |
| `robots.txt` — ClaudeBot | **Allow** | blok eksplisit ada | `[live]` |
| `robots.txt` — GPTBot / OAI-SearchBot / ChatGPT-User | **Allow** | tiga blok terpisah | `[live]` |
| `robots.txt` — PerplexityBot | **Allow** | blok eksplisit | `[live]` |
| `robots.txt` — lainnya | Allow eksplisit untuk: CCBot, anthropic-ai, Claude-Web, Claude-User, Claude-SearchBot, YouBot, Google-CloudVertexBot, Bingbot, Slurp, DuckDuckBot, Diffbot, Bytespider, Omgilibot, FacebookBot, cohere-ai, MistralAI-User, xAI-Bot, Applebot, Applebot-Extended | 28 blok UA total | `[live]` |
| `robots.txt` — global | `User-Agent: *` → `Allow: /`, `Disallow: /api/`, `Disallow: /_next/` | | `[live]` |
| Toggle AI-crawler Cloudflare | **Tidak memblokir saat ini.** Uji per-UA ke `/`: Googlebot 200, ClaudeBot 200, GPTBot 200, PerplexityBot 200, browser-UA 200 | 5/5 status 200 | `[live]` |
| `sitemap.xml` | Ada. **296 URL**, semua punya `<lastmod>`, `<changefreq>`, `<priority>`. `lastmod` homepage `2026-08-18` (bukan tanggal commit terakhir 2026-08-30) | 54.893 byte | `[live]` |
| `llms.txt` | **Ada**, 200. Header menyebut "compiler render-llms-txt v1.2.0, compiled **2026-08-27**", sumber jvto-ekosistem SSOT, larangan hand-edit | | `[live]` |
| `llms-full.txt` / `ai.txt` | Tidak ada (404) | | `[live]` |
| Header Content-Signal | **Ada di S1**: `content-signal: search=yes,ai-train=yes,use=reference` — konsisten dengan `llms.txt` | | `[live]` |
| Header keamanan / CSP | HSTS 2 tahun + preload, `x-frame-options: SAMEORIGIN`, `nosniff`, `referrer-policy: strict-origin-when-cross-origin`, CSP dengan `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:`. **Tidak ada yang memblokir render crawler.** | | `[live]` |
| `robots.txt` pada S2 (ekosistem) | **TIDAK ADA.** `GET /robots.txt` mengembalikan **200 + SPA shell HTML**, bukan 404 dan bukan aturan robots. Crawler membaca ini sebagai "tidak ada aturan" = allow-all. | | `[live]` |
| `meta robots` / `X-Robots-Tag` pada S2 | **Tidak ada keduanya.** Shell HTML hanya punya `charset` + `viewport`. Header: `server: cloudflare`, `cache-control: no-store` — tanpa `x-robots-tag`. | | `[live]` |

### 1.3 Zombie & Shadow Surfaces

- Preview/branch deploy masih publik: **UNKNOWN** (butuh akses Vercel)
- Domain/subdomain lama masih resolve: **UNKNOWN**
- **Shadow surface terkonfirmasi — S2 `ekosistem.*`**: setiap path yang diuji mengembalikan **200 + HTML shell yang sama**, termasuk `/.git/config`, `/package.json`, `/4-operations-core`, `/state`, `/nonexistent-xyz`. Ini **soft-404 catch-all**: permukaan crawlable tak terbatas, tanpa robots.txt dan tanpa noindex. `[live]`
- **Shadow route terkonfirmasi — `/3d/{slug}`**: hidup di produksi, di luar sitemap, `noindex`, dan tidak konsisten (`ijen-2d1n` 200, `bromo-1d1n` 404). `[live]` `[repo]`
- **Route live di luar sitemap**: `/checkout` (200) dan `/my-booking` (200) — keduanya `index, follow` + self-canonical. Lihat D11. `[live]`
- Halaman lama tanpa redirect: **65 URL `/destinations/{slug}` mati** yang masih direferensikan JSON-LD. Lihat D3. `[live]`
- Repo lain yang men-deploy konten JVTO: `sambuko82/llm-wiki` disebut di dokumen SSOT — **UNKNOWN**, tidak diperiksa run ini `[doc]`
- Aset statis lama: **UNKNOWN**

---

## SECTION 2 — URL-NYA APA SAJA?

### 2.1 Ringkasan URL Inventory

296 URL sitemap, **100% di-fetch**, **100% HTTP 200**, **0 redirect**, **0 duplikat case/trailing-slash**.

| Group | Jumlah | Status | Canonical cocok | H1 = 1 | JSON-LD ≥1 | Tag |
|---|---:|---|---|---|---|---|
| `home` | 1 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `tours` + `tours/from-surabaya` + `tours/from-bali` (hub) | 3 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `tours/from-surabaya-detail` | 13 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `tours/from-bali-detail` | 4 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `destinations` + detail | 1 + 5 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `travel-guide` + detail | 1 + 12 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `why-jvto` + subhalaman | 1 + 4 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `why-jvto/our-team` + crew-detail | 1 + 11 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `why-jvto/reviews` + reviews-detail | 1 + 222 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `verify-jvto` + detail | 1 + 4 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `policy` + detail | 1 + 3 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `blog` + detail | 1 + 3 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `markets` (singapore, malaysia) | 2 | 200 | ✔ | ✔ | ✔ | `[live]` |
| `contact`, `entity`, `isic/student-package` | 3 | 200 | ✔ | ✔ | ✔ | `[live]` |
| **TOTAL** | **296** | **296× 200** | **296/296** | **296/296** | **296/296** | `[live]` |

**Kebersihan mekanikal dasar: bersih total.** Nol halaman kehilangan `<title>`, meta description, canonical, `og:image`, `twitter:image`, atau JSON-LD. Nol H1 ganda. Nol JSON-LD invalid. Nol halaman dengan teks mentah < 800 karakter (tidak ada CSR-only page). Detail per baris: `live_html_url_audit_2026-08-30.csv`.

### 2.2 Selisih Antar Sumber URL

Empat sumber yang dipakai: (a) `sitemap.xml` live, (b) fetch status live per URL, (c) route tree `src/app` di repo, (d) inventaris entitas di `jvto-ekosistem`. Google Search Console **tidak dipakai — UNKNOWN**.

| Jenis selisih | Jumlah | Contoh | Tag |
|---|---:|---|---|
| Ada di sitemap, tidak ada route di repo | 0 | — | `[live]` `[repo]` |
| Ada route di repo, tidak ada di sitemap | 5 pola | `/checkout`, `/my-booking`, `/my-booking/{slug}`, `/my-booking/{slug}/bank-transfer`, `/3d/{slug}` | `[repo]` `[live]` |
| Live tapi 404 / 500 | 0 dari sitemap | — | `[live]` |
| **URL direferensikan JSON-LD tapi mati** | **65 dari 70** | `/destinations/bondowoso-hotel` (410), `/destinations/transfer-to-bromo` (404) | `[live]` |
| Duplikat (trailing slash / uppercase / index.html) | 0 | — | `[live]` |
| Canonical menunjuk URL lain | 0 | — | `[live]` |
| Redirect chain > 1 hop | 0 | `num_redirects = 0` untuk 296/296 | `[live]` |
| URL dipromosikan di luar (OTA/social/GBP) tapi mati | **UNKNOWN** | tidak ada akses kanal luar | |
| Indexed di Google? | **UNKNOWN** untuk 296/296 | tidak ada akses GSC | |

### 2.3 Coverage per Entitas Bisnis

| Entitas | Jumlah di data sumber | Punya URL live | Selisih | Tag |
|---|---:|---:|---:|---|
| Tour packages | **17** (`2-product-and-commercial-core/tour-products/*.product-contract.json`) | **17** | **0** ✔ | `[repo]` `[live]` |
| Crew | **11** (`people-and-crew/crew-reviews.json` → `crew[]`) | **11** | **0** ✔ | `[repo]` `[live]` |
| Destinasi (master) | **10** (`destination-knowledge/destinations-master.json` → `destinations[]`) | **5** | **5** | `[repo]` `[live]` |
| — punya file konten penuh | 5 (`*.content.json` + `*.json`: ijen-crater, madakaripura-waterfall, mount-bromo, papuma-beach, tumpak-sewu-waterfall) | 5 | 0 ✔ | `[repo]` |
| — hanya di master, tanpa halaman | 5: Bali, Surabaya, Malang City, Coffee & Cocoa Science Technopark, **Taman Safari Prigen** | 0 | 5 | `[repo]` `[live]` |
| Review permalink | **UNKNOWN** (jumlah di sumber tidak dihitung run ini) | **222** | UNKNOWN | `[live]` |
| Partner hotel | 23 `[doc]` | **0 halaman publik** | 23 | `[doc]` `[live]` |
| Halaman kredensial | tersebar di `credentials-and-public-evidence` | 5 (`/verify-jvto` + 4 detail) + `/entity` | UNKNOWN | `[repo]` `[live]` |

> **Koreksi terhadap catatan lama:** catatan JVTO sebelumnya menyebut **22 tour packages**. Repo pada SHA ini berisi **17 product contract**, dan halaman `/tours` sendiri menampilkan teks "17 tours". Angka 22 **basi atau memakai definisi lain** (mis. termasuk varian channel/add-on). `[repo]` `[live]`
> Catatan lama juga menyebut **7 destinasi kanonik**; master file berisi **10 entri** (termasuk 3 kota + 1 technopark). Definisi "kanonik" perlu dipertegas. `[repo]` `[doc]`

---

## SECTION 3 — SIAPA YANG MERENDER URL ITU?

### 3.1 Renderer Map

Semua route publik berada di route group `src/app/(website)/` dengan layout induk `src/app/(website)/layout.tsx` (di bawah `src/app/layout.tsx`). Mode render: **ISR** di seluruh site (tidak ada `dynamic = "force-dynamic"` pada route publik; `sitemap.ts` satu-satunya `force-dynamic`). Semua `[repo]`.

| URL / route group | File perender | revalidate | dynamicParams | generateStaticParams |
|---|---|---:|---|---|
| `/` | `(website)/page.tsx` | 3600 | — | — |
| `/tours` | `(website)/tours/page.tsx` | 3600 | — | — |
| `/tours/from-surabaya` · `/tours/from-bali` | `…/from-{origin}/page.tsx` | 3600 | — | — |
| `/tours/from-surabaya/{slug}` · `/tours/from-bali/{slug}` | `…/from-{origin}/[slug]/page.tsx` → komponen `TourDetail` | 3600 | *tidak diset* | ✔ |
| `/destinations` | `(website)/destinations/page.tsx` | 3600 | — | — |
| `/destinations/{slug}` | `(website)/destinations/[slug]/page.tsx` | 3600 | `true` | ✔ |
| `/travel-guide` | `(website)/travel-guide/page.tsx` | 300 | — | — |
| `/travel-guide/{slug}` | `(website)/travel-guide/[slug]/page.tsx` | 300 | `true` | ✔ |
| `/travel-guide/{11 slug tertentu}` | file statis per-slug (mis. `travel-guide/faq/page.tsx`) | 300 | — | — |
| `/policy` · `/policy/{slug}` | `policy/page.tsx` · `policy/[slug]/page.tsx` + 3 file per-slug | 300 | `true` | ✔ |
| `/why-jvto` · `/why-jvto/{slug}` | `why-jvto/page.tsx` · `why-jvto/[slug]/page.tsx` + 3 file per-slug | 86400 | `true` | ✔ |
| `/why-jvto/our-team` | `why-jvto/our-team/page.tsx` | 3600 | — | — |
| `/why-jvto/our-team/{slug}` | `why-jvto/our-team/[slug]/page.tsx` | *tidak diset* | `true` | ✔ |
| `/why-jvto/reviews` | `why-jvto/reviews/page.tsx` | 86400 | — | — |
| `/why-jvto/reviews/{id}` | `why-jvto/reviews/[id]/page.tsx` | 1800 | *tidak diset* | UNKNOWN |
| `/verify-jvto` + 4 detail | file statis per-halaman | 86400 | — | — |
| `/blog` · `/blog/{slug}` | `blog/page.tsx` · `blog/[slug]/page.tsx` | 3600 · *tidak diset* | `true` | ✔ |
| `/markets/{singapore,malaysia}` | file per-market | 86400 | — | — |
| `/entity` | `(website)/entity/page.tsx` | 86400 | — | — |
| `/contact` · `/isic/student-package` | file per-halaman | — · 3600 | — | — |
| `/llms.txt` | `app/llms.txt/route.ts` | 60 | — | — |
| `/sitemap.xml` | `app/sitemap.ts` | `force-dynamic` | — | — |
| `/3d/{slug}` | `app/3d/[slug]/page.tsx` (di luar `(website)`) | — | — | ✔ |

**Catatan `dynamicParams`:** komentar di `why-jvto/our-team/[slug]/page.tsx` mencatat insiden 2026-08-21 — `dynamicParams = false` membuat 11 halaman crew 404 permanen setelah satu blip upstream. Sekarang `true` di blog, destinations, policy, travel-guide, why-jvto, our-team. **`tours/from-*/[slug]` dan `why-jvto/reviews/[id]` tidak menyetel `dynamicParams` secara eksplisit** — default Next.js adalah `true`, jadi aman, tapi tidak konsisten dengan route lain yang menyatakannya eksplisit. `[repo]`

### 3.2 Pertanyaan Wajib per Route

- **Berapa komponen menulis `<title>` / `<meta description>`?** Satu jalur: `generateMetadata` atau `export const metadata` per page file (36 file), plus default di `(website)/layout.tsx`. **Tidak ditemukan penulis kedua.** `[repo]`
- **Berapa tempat meng-inject JSON-LD?** Empat file menulis `application/ld+json`: `src/components/seo/JsonLd.tsx`, `src/components/website/StructuredData.tsx`, `(website)/checkout/page.tsx`, `(website)/my-booking/[slug]/page.tsx`. Untuk route publik yang diaudit, injector efektif adalah dua komponen pertama. `[repo]`
- **Siapa menang di HTML akhir?** Tidak ada konflik terdeteksi: 296/296 halaman punya jumlah blok `ld+json` yang wajar dan **0 blok invalid**. `[live]`
- **Build-time atau runtime fetch?** **Runtime fetch dengan cache ISR.** Loader di `src/lib/ecosystemContent/*` memakai pola dua-jalur: `readLocal()` (filesystem, sibling folder `../jvto-ekosistem`) lalu `fetchRemote()` ke `https://ekosistem.javavolcano-touroperator.com/api/website/page?route=…` dengan `next.revalidate` + `tags`. Di Vercel sibling folder tidak ada → **jalur remote yang efektif**. `[repo]` `[live]`
- **Middleware / rewrite / edge function?** Tidak ditemukan yang menyentuh route publik. `[repo]`

### 3.3 Batas Repo (arsitektur dua-repo)

| Pertanyaan | Jawaban | Tag |
|---|---|---|
| `jvto-ekosistem` menghasilkan artefak apa? | `5-experience-engine/public-website/pages/*.website-output.json` — **51 file** pada SHA ini. Plus `5-experience-engine/json-ld/`, `seo-metadata/`, `knowledge-feed/`, `partner-feed/`, `ai-answers/`, `manifests/`. | `[repo]` |
| **Folder `4-channel-outputs/` yang disebut dokumen** | **TIDAK ADA di repo.** Struktur nyata: `1-knowledge-and-evidence-core`, `2-product-and-commercial-core`, `3-booking-and-journey-core`, `4-operations-core`, `5-experience-engine`. Registry (`entity-registry.json`, `route-manifest.json`, `schema-contract.json`, `seo-manifest.json`) **tidak ada sebagai file**. `schema-contract` hanya ada sebagai kode: `scripts/lib/schema-contract.mjs`. **Dokumen arsitektur drift terhadap repo.** | `[repo]` `[doc]` |
| Bagaimana artefak sampai ke `jvto-web`? | **HTTP runtime, bukan commit/submodule.** `jvto-web` fetch `ekosistem.*/api/website/page?route=…`, hasilnya di-cache ISR dengan tag `jvto-ekosistem-content`. Invalidasi lewat webhook `POST /api/revalidate/ecosystem-content` (Bearer `ECOSYSTEM_REVALIDATE_SECRET`), yang memanggil `revalidateTag` untuk 3 tag + `revalidatePath(route)` **dan** `revalidatePath(route,"page")`. | `[repo]` |
| Kapan terakhir sinkron? | Tidak ada timestamp sinkron eksplisit. Proksi terdekat: payload `/api/website/page` menyertakan `generated_at: 2026-08-30T07:53:49.163Z`; `llms.txt` menyebut compiled 2026-08-27. | `[live]` |
| File di `jvto-web` yang **seharusnya** generated tapi diedit tangan? | **Ya — `src/lib/tourFaqs.ts`.** Header file mengklaim dirinya "single source of truth" untuk Q&A tour, berisi konstanta `NIB_NUMBER = '1102230032918'`, nomor regulasi `SE.35/K2/BIDTEK.1/KSA/1/2024`, nama dokter, klaim harga "From IDR 1M/pax", dan klaim kebijakan. Semua ini fakta kanonik yang authority-nya ada di `jvto-ekosistem`. Lihat D9. | `[repo]` |
| Hardcode fakta lain di web | `src/lib/schemas/entityGraph.ts:225` → `foundingDate: '2015'`; `(website)/verify-jvto/page.tsx:612` → `foundingDate: "2015"`; `…/verify-jvto/legal/page.tsx:72,87` → `Incorporated 2016`; `…/verify-jvto/page.tsx:1048` → `Since 2016`; `…/my-booking/[slug]/bank-transfer/page.tsx:169-171` → `1200944352` + `CENAIDJAXXX`. | `[repo]` |
| `llm-wiki` merender ke mana? | **UNKNOWN** — repo tidak ada di folder yang terhubung, tidak diperiksa. | |
| TinaCMS mengedit file mana? | TinaCMS ada di **`jvto-ekosistem/tina/`** (bukan di web). Collection path yang terbaca: `1-knowledge-and-evidence-core/travel-guide`, `…/why-jvto`, `…/policies` — yaitu **folder source, bukan folder generated**. **Tidak terdeteksi jalur tulis ganda dari Tina.** | `[repo]` |
| Prisma / Postgres di `jvto-web` | `prisma/schema.prisma` berisi **6 model**: `User`, `Account`, `Session`, `VerificationToken`, `packages`, `durations`. Model `narrative_claims` dan `package_faqs` **tidak ada lagi** — `narrativeClaims` sudah dimigrasi ke `src/lib/ecosystemContent/narrativeClaims.ts` (komentar file: "Replaces `src/lib/queries/narrativeClaims.ts` (Prisma-backed)"). | `[repo]` |
| Status `BLOCKED_DATES` | **Sudah hilang dari repo.** `grep -rn "BLOCKED_DATES" src/` → 0 hasil. Temuan lama sudah ditutup. | `[repo]` |

---

## SECTION 4 — DATANYA DATANG DARI MANA?

### 4.1 Data Provenance per Field

| Field yang tampil | Muncul di | Sumber akar | Path persis | Jalur tulis | Tag |
|---|---|---|---|---|---|
| Nama & legal entity | 295/296 halaman (JSON-LD `#organization`) | ekosistem | `1-knowledge-and-evidence-core/organization-identity/entity-graph-schema-facts.json` via `src/lib/ecosystemContent/entityGraphFacts.ts` | edit source ekosistem | `[repo]` `[live]` |
| `foundingDate` = 2015 | `/` JSON-LD | **hardcode di web** | `src/lib/schemas/entityGraph.ts:225` + `(website)/verify-jvto/page.tsx:612` | edit kode web | `[repo]` `[live]` |
| "Since 2016" / "Incorporated 2016-01-01" | `/verify-jvto`, `/verify-jvto/legal`, `/why-jvto` (teks tampak) | **hardcode di web** | `verify-jvto/page.tsx:23,1048`; `verify-jvto/legal/page.tsx:72,87`; `history-artifacts/page.tsx:166`; `WhyJvtoInteractive.tsx:198` | edit kode web | `[repo]` `[live]` |
| "Founded 2015 brand/guesthouse era; TDUP formalized 2023-02-11" | `/llms.txt` | ekosistem (compiler) | `render-llms-txt v1.2.0` | edit source ekosistem | `[live]` |
| NIB `1102230032918` | `/llms.txt`, halaman verify, JSON-LD | **dua tempat**: ekosistem SSOT **dan** `src/lib/tourFaqs.ts` (`const NIB_NUMBER`) | — | **dual-write** | `[repo]` `[live]` |
| Email `hello@` | **296/296 halaman** | ekosistem organization-identity | — | edit source ekosistem | `[live]` |
| `info@` | **0/296 halaman** ✔ | — | — | — | `[live]` |
| WhatsApp nomor | UNKNOWN (tidak dilacak ke akar run ini) | UNKNOWN | `src/lib/waLinks.ts` (kandidat) | UNKNOWN | `[repo]` |
| Harga paket | halaman tour + `AggregateOffer` (17 halaman) | ekosistem | `2-product-and-commercial-core/pricing-rules/*.pricing.json` + `package-pricing-matrix.json` | edit source ekosistem | `[repo]` |
| Klaim "From IDR 1M/pax" | `/tours` (teks tampak) | **hardcode di web** | `src/lib/tourFaqs.ts` | edit kode web | `[repo]` `[live]` |
| Itinerary / route destinations | 17 halaman tour, `TouristTrip` per-hari | ekosistem | `2-product-and-commercial-core/tour-products/*.product-contract.json` | edit source ekosistem | `[repo]` `[live]` |
| Blocked dates / availability | **tidak ada di HTML** | — (sudah dihapus dari web) | — | — | `[repo]` |
| Review & rating | 222 permalink + 11 halaman crew + org `AggregateRating` di 295 halaman | ekosistem | `1-knowledge-and-evidence-core/people-and-crew/crew-reviews.json` (11 crew) + `src/lib/ecosystemContent/reviews.ts`, `reviewPlatforms.ts` | edit source ekosistem | `[repo]` `[live]` |
| Data crew (11) | 11 halaman crew | ekosistem | `people-and-crew/crew-reviews.json` → `crew[]`, `people.json` → `leadership[]` | edit source ekosistem | `[repo]` `[live]` |
| Kredensial (BBKSDA SE.35, SIP dokter) | `/verify-jvto`*, tour pages (`EducationalOccupationalCredential`, `Physician`) | ekosistem `credentials-and-public-evidence` **dan** nomor SE.35 juga hardcode di `src/lib/tourFaqs.ts` | — | **dual-write** | `[repo]` `[live]` |
| FAQ tour — 9 "spine" | 17 halaman tour (UI + schema) | **hardcode di web** | `src/lib/tourFaqs.ts` → `getTourSpineQaPairs()` | edit kode web | `[repo]` `[live]` |
| FAQ tour — 6 "narrative claim" | 17 halaman tour (schema saja) | ekosistem | `1-knowledge-and-evidence-core/narrative-claims` via `ecosystemContent/narrativeClaims.ts`, dipetakan `question = c.pillar` | edit source ekosistem | `[repo]` `[live]` |
| FAQ tour — 13–71 "product faq" | 17 halaman tour (schema saja) | ekosistem | `product-contract.json` → `faqs[]` (contoh `ijen-2d1n`: 13 item, dimulai "Where is Kawah Ijen located?") | edit source ekosistem | `[repo]` `[live]` |
| Notice safety (blue fire, Bromo/Ijen status) | `SpecialAnnouncement` di `/destinations/mount-bromo` & `/destinations/ijen-crater`, `expires: 2026-09-01`, `datePosted: 2026-08-30` | ekosistem (regenerasi harian) | `destination-knowledge/*.content.json` (kandidat) | edit source ekosistem | `[live]` |
| Notice jembatan Madakaripura | **tidak ada di 296/296 halaman** | — | — | — | `[live]` |
| Rekening BCA `1200944352` | 1 halaman sitemap (`/travel-guide/booking-information`) + `/my-booking/{slug}/bank-transfer` (di luar sitemap) | **hardcode di web** untuk halaman bank-transfer | `my-booking/[slug]/bank-transfer/page.tsx:169-171` | edit kode web | `[repo]` `[live]` |

### 4.2 Klasifikasi Sumber

| Kelas | Contoh field | Risiko | Tag |
|---|---|---|---|
| **A. SSOT ekosistem** (mayoritas) | identitas org, itinerary, harga, crew, review, destinasi, narrative claims, product FAQ, llms.txt | rendah | `[repo]` |
| **B. Postgres** | `packages`, `durations`, sesi auth | rendah–sedang | `[repo]` |
| **C. JSON di repo web, edit tangan** | tidak ditemukan yang signifikan | — | `[repo]` |
| **D. Hardcode di komponen/lib web** | `tourFaqs.ts` (9 FAQ + NIB + SE.35 + klaim harga + nama dokter), `entityGraph.ts` `foundingDate:'2015'`, teks "Since 2016"/"Incorporated 2016" di 4 file, rekening BCA di halaman bank-transfer | **tinggi** | `[repo]` |
| **E. TinaCMS** | travel-guide, why-jvto, policies — **menulis ke source ekosistem, bukan ke generated** | sedang (terkendali) | `[repo]` |
| **F. API pihak ke-3 runtime** | tidak ditemukan pada route publik | — | `[repo]` |
| **G. Tidak ketahuan asalnya** | nomor WhatsApp; jumlah & sumber 222 review permalink; partner hotel (23) | **tertinggi** | UNKNOWN |

### 4.3 Jalur Tulis Ganda (dual-write)

| Field | Jalur tulis 1 | Jalur tulis 2 | Siapa menang di HTML | Tag |
|---|---|---|---|---|
| NIB `1102230032918` | ekosistem organization-identity | `src/lib/tourFaqs.ts` `NIB_NUMBER` | keduanya tampil di halaman berbeda; nilainya **kebetulan sama** hari ini | `[repo]` `[live]` |
| Nomor regulasi BBKSDA SE.35 | ekosistem credentials | `src/lib/tourFaqs.ts` (teks jawaban) | keduanya; nilai sama hari ini | `[repo]` `[live]` |
| Tahun berdiri | ekosistem (llms.txt: "2015 brand/guesthouse era; TDUP 2023-02-11") | `entityGraph.ts:225` (`2015`) + 4 file teks (`2016`) | **JSON-LD = 2015, teks tampak = 2016** → kontradiksi di halaman yang sama | `[repo]` `[live]` |
| Klaim harga entry | ekosistem pricing-rules | `tourFaqs.ts` "From IDR 1M/pax" | teks `/tours` dari hardcode | `[repo]` `[live]` |
| FAQ tour | ekosistem (`product-contract.faqs` + narrative-claims) | `tourFaqs.ts` spine | **keduanya digabung** di satu node `FAQPage` | `[repo]` `[live]` |

---

## SECTION 5 — APA YANG BENAR-BENAR KELUAR DI HTML?

Semua di bagian ini `[live]`, 2026-08-30, 296 URL, HTML **mentah** (bukan DOM ter-hidrasi).

### 5.1 Rendered Output — Agregat

| Check | Hasil | Kondisi lulus |
|---|---:|---|
| HTTP 200 | **296 / 296** | ✔ |
| `<title>` tidak kosong | **296 / 296** | ✔ |
| `meta description` tidak kosong | **296 / 296** | ✔ |
| `canonical` ada | **296 / 296** | ✔ |
| `canonical` == URL sendiri | **296 / 296** | ✔ |
| `h1_count == 1` | **296 / 296** | ✔ |
| `og:image` ada | **296 / 296** | ✔ |
| `twitter:image` ada | **296 / 296** | ✔ |
| ≥1 blok JSON-LD | **296 / 296** | ✔ |
| Blok JSON-LD invalid | **0** | ✔ |
| Redirect | **0** | ✔ |
| Konten utama ada di HTML mentah | **296 / 296** (tidak ada CSR-only) | ✔ |
| `@id` relatif (tidak absolut) | **0** | ✔ |
| Referensi `@id` yatim (dirujuk, tak pernah didefinisikan) | **0** | ✔ |

Contoh baris (bukti penuh di CSV):

| URL | `<title>` | H1 | Canonical | JSON-LD `@type` |
|---|---|---|---|---|
| `/blog` | "Insights \| JVTO's Blog on Safety, Planning & Community" | "Insights & Explainers" | `/blog` | BreadcrumbList; Organization,TravelAgency,LocalBusiness; WebPage; WebSite |
| `/tours/from-surabaya/ijen-2d1n` | (lihat CSV) | 1 | self | Organization…; WebSite; WebPage; BreadcrumbList; TouristTrip ×3; AggregateOffer; Review; Product; FAQPage |

### 5.2 Audit JSON-LD Aktual

**Distribusi `@type` di seluruh site (jumlah node / jumlah halaman):**

| `@type` | node | halaman | Catatan |
|---|---:|---:|---|
| `Organization,TravelAgency,LocalBusiness` | 295 | 295 | **hilang hanya di `/entity`** |
| `WebSite` | 295 | 295 | **hilang hanya di `/entity`** |
| `WebPage` | 279 | 275 | hilang di 7 halaman (di luar 11 crew yang memakai `ProfilePage`, subtipe sah) |
| `Product` | 239 | 239 | 17 tour + **222 review permalink** |
| `Review` | 300 | 11 | semua tersemat di halaman crew |
| `BreadcrumbList` | 73 | 73 | **hilang di 222 review permalink + `/entity`** |
| `FAQPage` | 43 | 43 | 20 di antaranya **tanpa `@id`** |
| `TouristTrip` | 77 | 17 | tour + node per-hari |
| `AggregateOffer` | 17 | 17 | |
| `Person` | 16 (dengan `@id`) + 698 (tanpa `@id`) | 13 | penulis review tanpa `@id` = wajar |
| `TouristAttraction` | 353 (semua **tanpa `@id`**) | — | lihat D3 |
| `AggregateRating` | 315 (semua **tanpa `@id`**) | — | |
| `ProfilePage` | 11 | 11 | halaman crew |
| `SpecialAnnouncement` | 3 | 3 | Bromo, Ijen, Lifetime Package Credit |
| `EducationalOccupationalCredential` | 11 | 1 | |
| `GovernmentOrganization` | 10 | 1 | |
| lain-lain | `DefinedTerm`(11), `CollectionPage`(8), `DigitalDocument`(5), `Place`(4), `Physician`(3), `GovernmentService`(3), `Article`(3), `BlogPosting`(3), `Book`(2), `NewsArticle`(2), `Report`(2), `Service`, `WebApplication`, `MedicalBusiness`, `HowTo`, `Award`, `AboutPage` | | |

**Cek khusus:**

**(a) Parity FAQ — schema vs UI.** Menghitung, untuk tiap `FAQPage`, berapa `Question.name` yang benar-benar muncul di markup setelah semua `<script>`/`<style>` dibuang dan tag di-strip:

| Halaman | Q di schema | Q tampil di HTML | Gap |
|---|---:|---:|---:|
| 5 × tour `ijen-papuma-tumpak-sewu-bromo-*` | 86 | 9 | **77** masing-masing |
| 5 × tour `ijen-bromo-madakaripura-*` / `tumpak-sewu-bromo-ijen-4d3n` / `bromo-ijen-3d2n` | 63 | 9 | **54** masing-masing |
| `bromo-madakaripura-ijen-3d2n` | 53 | 9 | 44 |
| `ijen-bromo-madakaripura-3d2n` | 52 | 9 | 43 |
| `taman-safari-prigen-bromo-madakaripura-3d2n` | 46 | 8 | 38 |
| `bromo-2d1n` | 37 | 8 | 29 |
| `tumpak-sewu-bromo-3d2n` | 32 | 8 | 24 |
| `ijen-2d1n` | 28 | 9 | 19 |
| `bromo-1d1n` | 26 | 8 | 18 |
| `/` (homepage) | 9 | **0** | 9 |
| `/verify-jvto` | 5 | 1 | 4 |
| `/verify-jvto/legal` | 4 | 0 | 4 |
| `/verify-jvto/press-recognition`, `/history-artifacts`, `/police-safety` | 3 | 0 | 3 masing-masing |
| `/tours`, `/tours/from-surabaya`, `/tours/from-bali` | 3 | 0 | 3 masing-masing |
| 17 halaman lain (travel-guide, why-jvto, markets) | 5–20 | sama | **0** ✔ |
| **TOTAL** | **1.162** | **257** | **905** |

**(b) Anatomi FAQ tour — dilacak sampai kode.** `src/lib/schemas/buildTourSchemas.ts:59-84` menggabung tiga sumber tanpa filter render:
```
spinePairs   = getTourSpineQaPairs(tour, reviewProfiles)   // 9  → DIRENDER di UI
claimPairs   = narrativeClaims.map(c => ({ question: c.pillar, answer: c.core_claim }))  // 6 → TIDAK dirender
dbPairs      = (fullData?.faqs ?? [])                       // 13-71 → TIDAK dirender
```
Untuk `ijen-2d1n`: 9 + 6 + 13 = **28**, persis jumlah yang terbaca live. `[repo]` `[live]`

Enam `claimPairs` menghasilkan `Question.name` yang **bukan pertanyaan**: "Safety-led operations", "Private tours (execution control)", "All-inclusive clarity (reduce surprises)", "Ijen Health Screening (safety layer)", "Proof-first trust (verification layer)", "Our Team (personality economy + operational credibility)". `[live]`

**(c) `AggregateRating` / `Review`.** `AggregateRating` ada di HTML (315 node, tanpa `@id`), menempel pada node organisasi. `Review`: 300 node, semuanya di 11 halaman crew, tersemat di dalam `Person`. `itemReviewed` **tidak ada** pada review yang tersemat di crew. Pada 222 review permalink, `Review.itemReviewed` menunjuk `{"@id": "…/#organization"}`. `[live]`

**(d) 39 review tamu di `crew-reviews.json` sudah menempel ke crew?** **Ya, secara sebagian dan dengan identitas ganda.** Contoh review 134 (Giorgos Rogakos):
- di `/why-jvto/our-team/gufron`: `@id = …/why-jvto/reviews/134#crew-gufron`, tersemat di `Person`, tanpa `itemReviewed`
- di `/why-jvto/reviews/134`: `@id = …/#review-134`, `itemReviewed → …/#organization`

Dua node berbeda untuk satu review nyata. Lihat D5. `[live]`

**(e) `@id` stabil & absolut?** **Ya** — 0 `@id` relatif di 296 halaman. Tapi **namespace tidak konsisten** untuk entitas yang sama:
- Person: 27 `@id` berbeda untuk ≤13 orang nyata — **11×** `…/#crew-{name}`, **11×** `…/why-jvto/our-team/{slug}#person`, **3×** `…/why-jvto/our-team/{slug}` (tanpa fragment), plus `…/#agung-sambuko` dan `…/#dr-ahmad-irwandanu`
- Review: `…/#review-134` **dan** `…/why-jvto/reviews/134#crew-gufron`
- Organisasi eksternal: `…/entity/#org-polri` — memakai `/entity/` (trailing slash) padahal canonical halaman `/entity` (tanpa)
`[live]`

**(f) `sameAs` mengarah ke profil hidup?** **UNKNOWN** — target `sameAs` tidak divalidasi run ini. Volume: node organisasi utama 9 `sameAs`; node eksternal di `/entity` sampai 116 (`#org-hpwki`), 74 (`#org-bbksda-jatim`), 68 (`#org-indecon`). `[live]`

**(g) `Product` pada 222 review permalink.** Setiap halaman review mendefinisikan Product generik:
```json
{"@id":"https://javavolcano-touroperator.com/why-jvto/reviews/134#product","@type":"Product",
 "name":"Java Volcano Tour Package","brand":{"@id":"…/#organization"},"url":"https://javavolcano-touroperator.com/tours"}
```
222 entitas Product berbeda `@id`, isi identik, `url` menunjuk halaman hub `/tours`, tidak merepresentasikan produk nyata mana pun. `[live]`

**(h) `/entity` — halaman jangkar entitas.** Satu-satunya halaman dari 296 yang **tidak** memuat node `Organization` JVTO, `WebSite`, `WebPage`, maupun `BreadcrumbList`. Yang ada hanya 16 organisasi **eksternal** (BBKSDA, POLRI, Kemenkes, KKI, OSS, HPWKI, INDECON, ISIC, Detik.com, DuMont, Radar Jember, dst). `[live]`

**(i) `TouristAttraction` pada halaman tour.** 353 node, semua tanpa `@id`, masing-masing membawa `url` ke `/destinations/{slug}`. Dari **70 URL unik**: **5 → 200**, **50 → 404**, **15 → 410**. Yang mati termasuk `/destinations/bondowoso-hotel`, `/destinations/surabaya-to-bondowoso-transfer`, `/destinations/rm-handayani-wisata-paiton`, `/destinations/transit-stop`, `/destinations/local-restaurant`. Isi node juga bukan atraksi: "Check-in Bondowoso Hotel", "Dinner at Accommodation", "Lunch at Local Restaurant", "Bondowoso to Surabaya Transfer". `[live]`

### 5.3 Perbedaan Mentah vs Hydrated

| Aspek | Hasil | Tag |
|---|---|---|
| Halaman dengan konten hanya-setelah-JS | **0 / 296** — semua punya teks substansial di HTML mentah | `[live]` |
| FAQ tersembunyi yang muncul setelah JS? | **Tidak.** 19 pertanyaan ekstra di `ijen-2d1n` diverifikasi hadir **hanya di dalam `<script type="application/ld+json">`**, tidak di markup mana pun. Bukan masalah aksesibilitas accordion — memang tidak dirender. | `[live]` |
| Dampak untuk crawler AI | Positif: seluruh konten terbaca tanpa eksekusi JS. Negatif: klaim schema yang tidak punya padanan di halaman ikut terbaca sebagai fakta. | `[inferensi]` — BELUM DIVERIFIKASI (dampak indexing tidak diukur) |

### 5.4 Apa yang Dilihat Mesin Lain

| Konsumen | Yang mereka lihat | Tag |
|---|---|---|
| Google (GSC / rich result test) | **UNKNOWN** — tidak ada akses GSC. Yang pasti: robots.txt allow, 296 URL 200, JSON-LD valid. | |
| Crawler AI (ClaudeBot/GPTBot/PerplexityBot) | **Bisa fetch, tidak diblokir** — 200 pada uji per-UA. Header `content-signal: search=yes,ai-train=yes,use=reference`. `llms.txt` tersedia. | `[live]` |
| MCP `JVTO` | **401 Unauthorized** dari luar. Isi tool tidak diverifikasi. | `[live]` |
| WhatsApp agent | **UNKNOWN** — data statis yang dipegang tidak diperiksa. Risiko quote harga dari data basi **belum bisa dinilai**. | |
| Host `ekosistem.*` | Terbuka penuh untuk crawler: tanpa robots.txt, tanpa noindex, 200 untuk semua path. Endpoint `/api/website/page` melayani payload halaman publik tanpa auth. | `[live]` |

---

## SECTION 6 — ADA DRIFT / KONFLIK ATAU TIDAK?

### 6.1 Matriks Drift

| # | Fakta / mekanisme | Sumber (repo/SSOT) bilang | HTML live bilang | Severity | Tag |
|---|---|---|---|---|---|
| **D1** | Parity FAQ **→ lihat Adendum A.2: baris homepage DITARIK; baris tour/hub/verify bertahan dengan diagnosis berubah** | `buildTourFaqSchema` menggabung 3 sumber tanpa filter render | **905 dari 1.162** `Question` tidak punya padanan di halaman. Terkonsentrasi di 17 halaman tour (779), `/` (9), 3 hub tour (9), 5 halaman verify (17) | **P1** | `[repo]` `[live]` |
| **D2** | `narrative_claims` di-emit sebagai `Question` | `claimPairs = claims.map(c => ({question: c.pillar, answer: c.core_claim}))` | 6 node `Question` per halaman tour (**102 node**) yang `name`-nya label pilar, bukan pertanyaan — mis. "Safety-led operations" | **P1** | `[repo]` `[live]` |
| **D3** | `TouristAttraction.url` **→ Adendum A.2: diagnosis berubah, bukan kelalaian tapi schema tertinggal dari retirement yang disengaja** | itinerary step di `product-contract.json` diubah jadi node atraksi | **65 dari 70 URL mati** (50× 404, 15× 410) di 17 halaman tour; entitasnya juga bukan atraksi (hotel, transfer, makan siang) | **P1** | `[live]` |
| **D4** | `Product` di halaman review | — | **222 node Product sintetis** identik, `name: "Java Volcano Tour Package"`, `url: /tours` | **P1** | `[live]` |
| **D5** | Identitas node `Review` | satu review = satu entitas | satu review = **dua `@id`**: `/#review-134` (itemReviewed→org) dan `…/reviews/134#crew-gufron` (nested di Person, tanpa itemReviewed) | **P2** | `[live]` |
| **D6** | Identitas node `Person` crew | satu crew = satu entitas | **27 `@id` untuk ≤13 orang**: 11× `/#crew-{name}`, 11× `/our-team/{slug}#person`, 3× `/our-team/{slug}`, 2 pola lain | **P2** | `[live]` |
| **D7** | Halaman `/entity` | dirancang sebagai jangkar entitas | **satu-satunya halaman dari 296** tanpa node `Organization` JVTO, `WebSite`, `WebPage`, `BreadcrumbList`. Hanya 16 org eksternal. | **P1** | `[live]` |
| **D8** | Tahun berdiri | SSOT/llms.txt: "2015 brand/guesthouse era; TDUP 2023-02-11" | JSON-LD `/` → `foundingDate: 2015` (hardcode `entityGraph.ts:225`); teks `/verify-jvto` → "Since 2016" + "incorporated 2016-01-01". **Mesin dan manusia membaca angka berbeda di site yang sama.** | **P2** | `[repo]` `[live]` |
| **D9** | Authority fakta kanonik di repo consumer | `jvto-ekosistem` adalah SSOT; `jvto-web` consumer `[doc]` | `src/lib/tourFaqs.ts` memegang NIB, nomor SE.35, nama dokter, klaim harga "From IDR 1M/pax", klaim kebijakan — dan menyebut dirinya "single source of truth" | **P1** | `[repo]` `[live]` |
| **D10** | Host `ekosistem.*` **→ Adendum B.2: DIBUKA KEMBALI, P2 → P1. `/api/tree` + `/api/file` menyajikan 1.296 file tanpa auth** | — | Publik, **tanpa robots.txt** (200 HTML), tanpa `meta robots`, tanpa `X-Robots-Tag`, **200 untuk setiap path** (soft-404 catch-all) → permukaan crawlable tak terbatas + potensi duplikasi konten | **P2** | `[live]` |
| **D11** | `/checkout`, `/my-booking` | halaman transaksional/sesi | `index, follow` + self-canonical, **di luar sitemap**. Bisa terindeks sebagai halaman tipis. | **P2** | `[live]` `[repo]` |
| **D12** | Notice jembatan Madakaripura **→ Adendum A.4 U4: aturannya sendiri tidak punya dasar di SSOT; beban pembuktian berbalik** | standing rule: sertakan di tempat relevan `[doc]` | **0 dari 296 halaman** memuat notice. `SpecialAnnouncement` hanya untuk Bromo & Ijen. Madakaripura ada di ≥6 paket. **Status jembatan saat ini UNKNOWN.** | **P1 bila jembatan masih rusak; P3 bila sudah normal** | `[live]` `[doc]` |
| **D13** | `BreadcrumbList` | — | hilang di **222 review permalink + `/entity`** (223 dari 296) | **P3** | `[live]` |
| **D14** | `WebPage` | — | hilang di 7 halaman: `/destinations`, `/entity`, `/policy`, `/tours`, `/travel-guide`, `/travel-guide/mount-bromo-logistics`, `/travel-guide/tumpak-sewu-logistics` | **P2** | `[live]` |
| **D15** | Coverage destinasi | `destinations-master.json` = 10 entri | 5 punya halaman. Tanpa halaman: Bali, Surabaya, Malang City, Coffee & Cocoa Technopark, **Taman Safari Prigen** (padahal masuk paket tour) | **P3** | `[repo]` `[live]` |
| **D16** | Route `/3d/{slug}` | route ada di repo | hidup, `noindex`, di luar sitemap, tidak konsisten (`ijen-2d1n` 200 / `bromo-1d1n` 404) | **P3** | `[live]` `[repo]` |
| **D17** | `@id` node schema | — | `FAQPage` (20 node), `AggregateRating` (315), `TouristAttraction` (353) tanpa `@id` → tidak bisa direferensikan silang | **P3** | `[live]` |
| **D18** | Dokumen arsitektur vs repo **→ Adendum A.2: DITURUNKAN ke P3, registry dihapus sengaja & tercatat** | dokumen menyebut `4-channel-outputs/` berisi `entity-registry.json`, `route-manifest.json`, `schema-contract.json`, `seo-manifest.json` `[doc]` | **Folder dan keempat file itu tidak ada.** Struktur nyata `1-…` s/d `5-experience-engine`. Sinkron antar-repo lewat **HTTP runtime + webhook revalidate**, bukan artefak registry ter-commit. | **P2** (drift dokumen, bukan drift produksi) | `[repo]` `[doc]` |
| **D19** | Jumlah tour package **→ Adendum A.2: rantai 16+1=17 terpecahkan; angka 22 tetap tanpa dasar** | catatan lama: 22 `[doc]` | 17 product contract di repo; `/tours` menampilkan "17 tours" | **P3** (fakta catatan basi) | `[repo]` `[live]` |
| **D20** | `dynamicParams` tidak seragam | 6 route menyatakan `dynamicParams = true` eksplisit dengan komentar insiden 2026-08-21 | `tours/from-*/[slug]` dan `why-jvto/reviews/[id]` tidak menyatakannya (default `true`, jadi aman) | **P3** | `[repo]` |

**Skala severity dipakai persis seperti template:** P0 = salah hukum/finansial atau menyesatkan soal keselamatan · P1 = schema mengklaim yang tidak ada di halaman / pelanggaran boundary authority · P2 = tidak konsisten antar-permukaan tapi tidak menyesatkan · P3 = peluang belum diambil.

~~**Tidak ada temuan P0 pada run ini.**~~ **KLAIM INI DITARIK — lihat Adendum A.3 (D21).** Dalam scope HTML memang tidak ada P0: harga, rekening bank, dan kredensial yang tampil live konsisten dengan sumber, dan tidak ditemukan klaim blue fire yang menjanjikan. Tetapi scope itu sendiri terlalu sempit — aset PDF/gambar yang ditautkan halaman live tidak diperiksa, dan di sanalah satu-satunya P0 berada.

### 6.2 Konflik dengan Standing Rules

Aturan diambil dari standing document JVTO `[doc]` — **file aslinya tidak dibaca ulang run ini**, jadi rumusan aturannya sendiri perlu diverifikasi.

| Aturan | Dipatuhi di live? | Bukti | Tag |
|---|---|---|---|
| BCA-only untuk detail bank | **Ya** | `1200944352` hanya muncul di `/travel-guide/booking-information` (dari 296) + `/my-booking/{slug}/bank-transfer`; tidak ada bank lain terdeteksi | `[live]` |
| Struktur deposit 20% | **UNKNOWN** | tidak diverifikasi run ini | |
| Travel Credit sebagai mekanisme pembatalan | **Ya, sebagian** | `SpecialAnnouncement` "Lifetime Package Credit Policy" di `/policy/booking-payment-cancellation` | `[live]` |
| Booking hanya via website; WhatsApp support-only | **Ya** | `llms.txt`: "bookings are created, confirmed, modified, cancelled, and transferred only on javavolcano-touroperator.com; WhatsApp and email are support channels" | `[live]` |
| Blue fire selalu kondisional | **Ya** | 50 halaman menyebut blue fire; **0 halaman** memuat pola janji ("guaranteed", "will see"). 23 penyebutan tanpa kata kondisional di dekatnya diperiksa manual → semuanya label deskriptif ("Ijen Crater — Blue Fire Crater · 2.386m", "Ijen blue fire" sebagai nama rute) | `[live]` |
| Notice jembatan Madakaripura | **TIDAK** | 0/296 halaman | `[live]` |
| Notice penutupan Ijen | **Ya** | `SpecialAnnouncement` "Ijen Crater Current Operational Status — 2026-08-30", `expires: 2026-09-01` | `[live]` |
| Destinasi hanya dari daftar kanonik | **TIDAK, di layer schema** | 70 `TouristAttraction` mencakup hotel, transfer, restoran, transit stop — di luar daftar kanonik. Di layer konten tampak, destinasi yang dipromosikan tetap kanonik. | `[live]` |
| `info@` tidak muncul di mana pun | **Ya** | 0/296 halaman; `hello@` di 296/296 | `[live]` |
| `jvto-web` bukan competing authority | **TIDAK** | D9 — `tourFaqs.ts` | `[repo]` |

### 6.3 Gerbang Falsifikasi

Setiap temuan diuji untuk dijatuhkan. **Lima hipotesis awal saya GAGAL dan ditarik — dicatat di sini supaya tidak dihidupkan lagi di audit berikutnya.**

| Temuan / hipotesis awal | Cara membuktikannya salah | Hasil |
|---|---|---|
| "505 referensi `@id` yatim" | Bedakan **definisi node** (punya `@type` + field) dari **referensi murni** (`{"@id": …}` saja). Hitung ulang dengan definisi ketat. | **DITARIK.** Referensi yatim sebenarnya **0**. Angka 505 salah hitung — ia menghitung node yang didefinisikan penuh di halamannya sendiri. |
| "`/entity` menyatakan `foundingDate: 2024-01-27` untuk JVTO" | Telusuri node pemilik field itu. | **DITARIK.** `2024-01-27` milik `#org-hpwki` (HPWKI), bukan JVTO. Temuan yang benar justru lebih besar: `/entity` **tidak punya node JVTO sama sekali** (D7). |
| "Blue fire disebut tanpa syarat di 23 halaman" | Baca konteks 140 karakter di sekitar tiap penyebutan pada halaman struktural. | **DITARIK.** Semuanya label deskriptif, bukan janji. Pola janji ("guaranteed…blue fire") = 0 halaman. Standing rule **dipatuhi**. |
| "SSOT terekspos publik di `ekosistem.*` (file JSON bisa diambil)" | Cek `content-type` dan uji path sensitif (pricing, cost-components, `.git/config`). | **SEBAGIAN DITARIK.** Semua path mengembalikan `text/html` shell, bukan JSON. `/api/website/page` hanya melayani route yang punya `website-output.json`; `?route=/2-product-and-commercial-core/pricing-rules/cost-components.json` → **404**. Yang **bertahan**: tidak ada robots.txt/noindex + 200 untuk semua path (D10). |
| "19 tour product di repo" | Hitung ulang hanya `*.product-contract.json`, kecualikan file index. | **DIKOREKSI** menjadi **17**, cocok dengan 17 URL live. |
| D1 parity FAQ — "mungkin FAQ dirender client-side / accordion" | Cari teks pertanyaan di HTML mentah **termasuk isi `<script>`**, bandingkan dengan markup. | **BERTAHAN.** 19 pertanyaan ekstra `ijen-2d1n` hanya ada di dalam blok `ld+json`. Tidak ada di markup. Konsisten di 17 halaman tour. |
| D1 — "mungkin regex parser saya melewatkan teks yang terpecah tag" | Strip semua tag lalu normalisasi whitespace sebelum mencocokkan, dan cek 17 halaman lain (travel-guide/markets) sebagai kontrol. | **BERTAHAN.** 17 halaman kontrol menunjukkan gap **0** dengan parser yang sama. Parser bukan penyebabnya. |
| D3 — "mungkin 404 karena rate-limit / UA saya diblokir" | Halaman lain dengan UA yang sama mengembalikan 200; campuran 404 **dan 410** menunjukkan keputusan server yang disengaja per-URL. | **BERTAHAN.** |
| D7 — "mungkin `/entity` punya node org di blok JSON-LD lain" | Parse ulang seluruh blok `ld+json` halaman itu secara rekursif, cari `@type` mengandung "Organization" dengan `@id` `#organization`. | **BERTAHAN.** Tidak ada. |
| D12 — "mungkin notice pakai kata lain (jembatan/bridge/damage)" | Grep 296 halaman dengan pola `madakaripura` ± 120 karakter berisi bridge\|jembatan\|damag\|closed. | **BERTAHAN** untuk "tidak ada notice". Tapi **status jembatan sebenarnya UNKNOWN** — tidak bisa dinilai apakah ini pelanggaran atau notice yang memang sudah tidak perlu. |
| D10 — "mungkin ada `X-Robots-Tag` di header" | `curl -I` pada host ekosistem. | **BERTAHAN.** Hanya `server`, `cache-control: no-store`. |

**Temuan yang tetap `[inferensi]` BELUM DIVERIFIKASI:** dampak D1/D3/D4 terhadap indexing Google atau sitasi AI. Tidak ada data GSC maupun log crawler run ini, jadi klaim "ini merusak peringkat" **tidak boleh ditulis sebagai fakta.**

---

## SECTION 7 — BARU PUTUSKAN APA YANG HARUS DIUBAH

> **SENGAJA KOSONG.** Sesuai aturan keras template dan instruksi run ini: fase pengisian selesai di Section 6. Tidak ada keputusan, rekomendasi, lapisan perbaikan, blast radius, task list, atau update `verify-jvto.sh` yang ditulis di sini.

### 7.5 Inbox — hanya parkir, bukan rekomendasi

- Pertanyaan terbuka: apakah `Question` yang bersumber dari `narrative_claims` dan `product-contract.faqs` memang diniatkan schema-only, atau memang seharusnya dirender? Jawabannya menentukan arah D1/D2, dan **belum dijawab oleh dokumen mana pun yang dibaca run ini**.
- Pertanyaan terbuka: apakah 65 URL `/destinations/*` yang mati pernah hidup (22 di antaranya 410 = pernah ada, dihapus sengaja)?
- Pertanyaan terbuka: siapa owner host `ekosistem.*` dari sisi konfigurasi Cloudflare?

---

## DAFTAR UNKNOWN — butuh akses atau keputusan Sam

| # | UNKNOWN | Yang dibutuhkan |
|---|---|---|
| U1 | Deploy/build ID produksi | akses Vercel — tanpa ini temuan `[live]` tidak bisa dipin ke commit |
| U2 | Status indexing 296 URL | akses Google Search Console |
| U3 | Preview/branch deploy yang masih publik | daftar deployment Vercel |
| U4 | Status jembatan Madakaripura saat ini | **BERGESER — Adendum A.4.** Tidak ada dasar aturannya di SSOT maupun git history. Tetap butuh konfirmasi Sam |
| U5 | Isi & kesegaran data WhatsApp agent | akses runtime agent |
| U6 | Kanal luar (Klook, GBP, TripAdvisor, The Window Travel, social) | URL + akses |
| U7 | Isi tool MCP `JVTO` | kredensial (endpoint 401) |
| U8 | Validitas target `sameAs` | keputusan apakah perlu divalidasi (sampai 116 target per node) |
| U9 | Jumlah review di sumber vs 222 permalink live | **TERTUTUP — Adendum A.4.** Korpus 221 vs 222 live |
| U10 | 23 partner hotel — apakah memang tidak boleh punya halaman? | **TERTUTUP — Adendum A.4.** hotels-master 27, summary 17, catatan lama 23. Nol halaman publik = benar (data runtime). Yang perlu ditegaskan: angka publik mana yang dipakai (U18) |
| U11 | Rumusan resmi standing rules | **SEBAGIAN TERTUTUP — Adendum A.4.** `state/goals.json` berisi 9 keputusan resmi. Sisa: 28 dokumen di `ekosistem/docs/` (U16) |
| U12 | Definisi "22 tour packages" dan "7 destinasi kanonik" | **SEBAGIAN TERTUTUP — Adendum A.4.** Rantai 16+1=17 terpecahkan; 22 tanpa dasar. Destinasi 10 tetap butuh keputusan Sam |
| U13 | Struktur deposit 20% di live | **TERTUTUP — Adendum A.4. PATUH.** Source dan live cocok, 20% di 7 halaman |
| U14 | `revalidate` untuk `our-team/[slug]`, `reviews/[id]`, `blog/[slug]` | tidak diset eksplisit; perilaku default perlu dikonfirmasi terhadap konfigurasi Next.js versi ini |

---

**Bukti mentah:** `docs/audit/live_html_url_audit_2026-08-30.csv` — 296 baris × 27 kolom (url, path, group, http_status, final_url, redirects, bytes, title, title_len, meta_description, desc_len, canonical, canonical_matches_url, h1_count, h1_text, og_title, og_description, og_image, twitter_card, twitter_image, meta_robots, jsonld_blocks, jsonld_invalid, jsonld_types, jsonld_ids, raw_text_chars).

---
---

# ADENDUM A — 2026-08-30, run kedua
### Setelah `D:\jvto-ekosistem` digali lebih dalam: lapisan governance ditemukan, empat temuan diturunkan, satu temuan baru berat

**Pemicu adendum:** run pertama membaca struktur folder `1-…` s/d `5-experience-engine` tetapi **tidak membuka `state/`**. Di sana ada `state/goals.json` — lapisan governance yang run pertama laporkan sebagai "tidak ada". Itu kesalahan run pertama, dan konsekuensinya besar: beberapa temuan yang kulabeli drift ternyata **keputusan sadar yang sudah tercatat lengkap dengan alasannya**.

Semua di adendum ini `[repo]` kecuali ditandai lain.

## A.1 — Lapisan governance yang terlewat

| Item | Isi | Tag |
|---|---|---|
| `state/goals.json` | Terakhir diperbarui **2026-08-27**. Berisi `baseline`, `policies`, **9 `decisions`**, **3 `backlog`**. Komentar file: *"Read at session start by jvto-ops (scripts/session-brief.mjs) and by checkers that would otherwise freeze a policy constant in their own source. Edit this file; do not duplicate its facts into a checker."* | `[repo]` |
| Repo ketiga: `jvto-devteam/jvto-ops` | **Private** (keputusan `jvto-ops-repo-visibility`, 2026-08-26). Berisi skill deploy protocol, infrastructure path, incident history. **Tidak terhubung ke sesi ini — isinya UNKNOWN.** | `[repo]` |
| `ekosistem/docs/` | 28 dokumen arsitektur & audit, termasuk `architecture.md`, `domain-boundaries.md`, `review-package-attribution.md`, `answer-first-editorial-rules.md`. **Tidak dibaca run ini.** | `[repo]` |
| `baseline` di goals.json | Pengukuran densitas fakta per tipe halaman, tool `jvto-web/scripts/audit-answer-structure.py`, diukur 2026-08-27 atas **295 route sitemap live**. | `[repo]` |

**Koreksi terhadap Section 3.3 run pertama.** Run pertama menyimpulkan: *"registry (`entity-registry.json`, `route-manifest.json`, `schema-contract.json`, `seo-manifest.json`) tidak ada sebagai file"* — itu **tetap benar secara faktual**, tetapi kesimpulan yang menyertainya keliru. Ketiadaan itu bukan kelalaian: ia **keputusan tercatat** (lihat A.2 D18). Dan control plane-nya memang ada, hanya berbentuk lain: sebuah decisions log yang dibaca otomatis oleh tooling, bukan sekumpulan file registry.

**Delta jumlah URL:** baseline goals.json mencatat **295** route sitemap live pada 2026-08-27; run ini menghitung **296** pada 2026-08-30. Selisih 1 route, konsisten dengan penambahan biasa. Bukan temuan.

## A.2 — Temuan run pertama yang DITURUNKAN oleh bukti baru

| # | Status baru | Bukti yang menjatuhkan / mengubahnya |
|---|---|---|
| **D1 (baris homepage)** | **DITARIK sebagai drift.** Homepage 9 `Question` / 0 tampil bukan cacat. | Keputusan `homepage-answer-block`, **2026-08-27**: *"The homepage renders no answer-first block. The hero stays a positioning line. Owner decision — the block was removed from the hero deliberately. The entity answer still lives in `1-knowledge-and-evidence-core/home/index.source.json` and flows to `home.website-output.json` and the knowledge feed, so machine consumers still get it; only the rendered hero omits it."* Catatannya bahkan mengantisipasi audit seperti ini: *"Recorded because the measurement argues the other way and will keep arguing it… the block was re-added on that evidence alone, and it was reverted the same day."* **Run pertama persis mengulang kesalahan yang keputusan itu peringatkan.** |
| **D1 (baris tour, verify-jvto, hub)** | **BERTAHAN**, tapi statusnya berubah dari "cacat" jadi **"pola schema-only yang belum punya keputusan tertulis".** | Keputusan `homepage-answer-block` menetapkan preseden bahwa schema-only bisa disengaja. Tapi keputusan itu **hanya menyebut hero homepage**. Tidak ada keputusan yang mencakup 779 `Question` schema-only di 17 halaman tour. Gap-nya nyata; yang belum ada adalah keputusannya. |
| **D3** | **BERTAHAN, diagnosis berubah.** Bukan "halaman lupa dibuat" tapi **"schema tidak diperbarui setelah URL sengaja dipensiunkan".** | Keputusan `validate-routes-registry`, 2026-08-26, mencatat rekonsiliasi **"207 redirect and gone sources against 41 static routes"**. Campuran 404/410 yang kutemukan adalah hasil konfigurasi sengaja, bukan kelalaian. Yang tetap cacat: 65 `TouristAttraction.url` di 17 halaman tour masih menunjuk URL yang sudah sengaja dimatikan. |
| **D18** | **DITURUNKAN P2 → P3.** Murni drift dokumen, bukan drift sistem. | Keputusan `validate-routes-registry`, 2026-08-26: *"The canonical and duplicate-intent checks in `npm run validate routes` are retired, not restored. `src/lib/registry/pages.ts` was deleted on 2026-08-15 in `3925805f` and nothing under `src/` has imported it since."* Registry hilang karena **dihapus dengan sengaja dan dicatat**. Yang belum diperbarui hanyalah dokumen blueprint. |
| **D19** | **SEBAGIAN TERPECAHKAN.** Rantai 16 → 17 terlacak penuh; angka 22 tetap tanpa dasar. | `package-index.json`: `count: 16`, `generatedAt: 2026-08-11`, snapshot dari `jvto-web@75a21d11`. Field `excludedFromMainPublicSnapshot` berisi **tepat 1 paket**: `tours/from-surabaya/tumpak-sewu-bromo-3d2n`, dengan catatan *"absent from jvto-web origin/main public package list after soft-deleted package rows were excluded"*. **16 + 1 = 17**, cocok dengan 17 product contract dan 17 URL live. Paket itu **sekarang hidup di produksi** (32 `Question` di schema-nya) — indexnya saja yang basi per 11 Agustus. **Angka 22 tidak dijelaskan oleh file mana pun di repo.** |

## A.3 — TEMUAN BARU: P0, dari backlog ekosistem sendiri, diverifikasi live run ini

| # | Temuan | Severity | Tag |
|---|---|---|---|
| **D21** | **Dokumen SIP dokter yang dipublikasikan memuat data pribadi pihak ketiga.** Backlog `sip-document-personal-data` (ditemukan **2026-08-27**, status *"open — needs an owner decision, deliberately not actioned"*) mencatat bahwa `/screening/SIP_DOKTER_AHMAD_IRWANDANU_2026.pdf` dan turunannya `/screening/SCREENSHOT_SIP_DOKTER_AHMAD_IRWANDANU_2026.png` memuat — **untuk pihak ketiga, bukan pemilik situs**: tempat/tanggal lahir; alamat rumah pada granularitas RT/RW; foto paspor; dan NIP pejabat penanda tangan, yang sendirinya mengkodekan tanggal lahirnya. | **P0** | `[repo]` `[live]` |

**Verifikasi live yang kulakukan sendiri hari ini (2026-08-30):**

| Cek | Hasil |
|---|---|
| `/screening/SIP_DOKTER_AHMAD_IRWANDANU_2026.pdf` | **HTTP 200**, `application/pdf`, 409.950 byte |
| `/screening/SCREENSHOT_SIP_DOKTER_AHMAD_IRWANDANU_2026.png` | **HTTP 200**, `image/png`, 526.792 byte |
| Ditautkan dari halaman live? | **Ya** — PDF dirujuk dari 4 halaman, PNG dari 2 halaman (dari 296 yang di-fetch) |
| `robots.txt` memblokir `/screening/`? | **Tidak.** Hanya `/api/` dan `/_next/` yang di-Disallow |

**Kenapa ini P0 menurut skala di templatemu sendiri** ("salah secara hukum/finansial"): yang terpublikasi adalah data pribadi seseorang yang bukan pemilik situs — alamat rumah, tanggal lahir, dan foto — pada dokumen yang dapat diakses dan diindeks siapa pun. Dan karena PDF-nya tidak mengandung teks (*"the document extracts zero text, so every text-based scan over it returns a false clean"*), **tidak ada checker berbasis teks yang akan pernah menangkapnya.**

**Kenapa run pertama melewatkannya:** scope run pertama adalah HTML dari 296 URL sitemap. PDF dan gambar tidak dirender maupun dibaca. **Ini gap metodologi, bukan gap data** — dan gap yang sama akan terulang di audit berikutnya kecuali scope-nya diperluas.

**Yang TIDAK kulakukan:** memutuskan apa pun soal ini. Backlog-nya sendiri menyatakan *"needs an owner decision, deliberately not actioned"*. Keputusannya milik Sam, dan tempatnya di Section 7 — bukan di sini.

## A.4 — UNKNOWN yang TERTUTUP oleh run kedua

| # | Status | Bukti |
|---|---|---|
| **U4** — status jembatan Madakaripura | **BERGESER, belum tertutup penuh.** | **Tidak ada catatan kerusakan/penutupan jembatan Madakaripura di mana pun** dalam source ekosistem maupun git history-nya. `grep -i "jembatan"` → 0 hasil di kelima core folder. `grep -i "bridge"` → hanya Suramadu Bridge, metafora "bridge between", dan "operational bridge" (istilah transfer day). `closure-plan-b-rules.json` memantau *"Madakaripura rainfall and stream levels"* — **bukan jembatan**. Satu-satunya catatan maintenance Madakaripura di history (commit `718347ae`, 2026-08-26) soal **tinggi air terjun**, bukan jembatan. **Beban pembuktian berbalik:** aturan standing "notice jembatan Madakaripura" yang dibawa dari catatan lama **tidak punya dasar di SSOT**. Kemungkinan besar fakta basi, bukan notice yang hilang. **Konfirmasi Sam tetap diperlukan** sebelum D12 ditutup. |
| **U9** — jumlah review sumber vs live | **TERTUTUP.** Korpus review = **221** (backlog `pdp-reviews-twelve-packages-unattributed`: *"169 of 221 reviews now carry a packageSlug, covering ten of seventeen products"*). Live = **222** permalink. Selisih 1, tidak material. | `[repo]` `[live]` |
| **U10** — 23 partner hotel | **TERTUTUP, dengan tiga angka berbeda.** `hotels-master.json` → **27** hotel (`confidence: verified`, ditarik dari endpoint backoffice). `hotel-partner-summary.json` → **17**. Catatan lama → 23. **Nol halaman publik untuk hotel**, dan itu **benar** — data hotel adalah runtime/operasional, bukan canonical knowledge yang dipublikasikan. Bukan gap coverage. Yang perlu ditegaskan: angka mana yang dipakai kalau disebut ke publik. | `[repo]` `[live]` |
| **U12** — definisi "22 paket" | **SEBAGIAN TERTUTUP.** Rantai 16 → 17 terlacak penuh (lihat A.2 D19). Angka **22 tetap tanpa dasar di repo mana pun**. | `[repo]` |
| **U13** — struktur deposit 20% | **TERTUTUP — PATUH.** Source `deposit-and-balance-rules.json`: `standard-deposit` = **20% of total booking value**; `close-departure-full-payment` = hingga 100% bila Day 1 dalam 14 hari; balance deadline 5 hari (card/QRIS) dan 3 hari (bank wire/Wise). Live: "20% deposit" tampil di **7 halaman**, "within 14 days" di 3 halaman, deadline 5/3 hari di 19 halaman. **Sumber dan live cocok.** | `[repo]` `[live]` |
| **U11** — rumusan resmi standing rules | **SEBAGIAN TERTUTUP.** `state/goals.json` berisi 9 keputusan resmi berikut alasannya. Yang belum dibaca: 28 dokumen di `ekosistem/docs/`. | `[repo]` |

## A.5 — UNKNOWN BARU yang lahir dari run kedua

| # | UNKNOWN | Kenapa penting |
|---|---|---|
| **U15** | Isi repo `jvto-devteam/jvto-ops` (private, tidak terhubung ke sesi ini) | Ia memegang deploy protocol, infrastructure path, dan incident history — dan `session-brief.mjs` di sana membaca `goals.json`. **Sepertiga sistem ini belum pernah masuk scope audit mana pun yang kujalankan.** |
| **U16** | 28 dokumen di `ekosistem/docs/` — termasuk `architecture.md`, `domain-boundaries.md`, `answer-first-editorial-rules.md` | Kemungkinan besar berisi aturan yang sudah menjawab sebagian temuan D1/D2. Membuat keputusan tanpa membacanya berisiko mengulang kesalahan D1-homepage. |
| **U17** | Aset non-HTML di produksi (PDF, PNG, dokumen bukti) | D21 membuktikan gap ini punya konsekuensi nyata. Tidak ada satu pun audit yang pernah memeriksa lapisan ini. |
| **U18** | Angka publik mana yang benar untuk partner hotel: 27, 17, atau 23 | Angka ini bocor ke materi B2B dan jawaban WhatsApp agent. |

## A.6 — Gerbang falsifikasi run kedua

| Hipotesis run pertama | Cara dijatuhkan | Hasil |
|---|---|---|
| "Control plane / governance layer tidak ada di repo" | Buka `state/`, yang run pertama tidak pernah lihat | **DITARIK.** Ada `state/goals.json`: 9 keputusan, 3 backlog, baseline, policies — dibaca otomatis oleh tooling |
| "Homepage 9 Question tanpa UI = parity violation" | Cari keputusan tertulis yang menyangkut hero homepage | **DITARIK.** Keputusan owner tertanggal 2026-08-27, eksplisit, lengkap dengan peringatan bahwa pengukuran akan terus berargumen sebaliknya |
| "Registry hilang = drift arsitektur" | Cari commit penghapusan dan alasannya | **DITURUNKAN.** Dihapus sengaja 2026-08-15 (`3925805f`), keputusan dicatat 2026-08-26 |
| "65 URL destinasi mati = halaman lupa dibuat" | Cari catatan konfigurasi redirect/gone | **DIAGNOSIS BERUBAH.** 207 redirect-and-gone source tercatat; yang cacat adalah schema yang belum menyesuaikan |
| "Notice jembatan Madakaripura hilang dari 296 halaman" *(temuan run pertama)* | Cari dasar aturannya di SSOT dan git history, bukan hanya di HTML | **BEBAN BERBALIK.** Aturannya sendiri tidak punya dasar di repo. Temuan bertahan sebagai pertanyaan, bukan sebagai pelanggaran |
| "Tidak ada temuan P0" *(kesimpulan run pertama)* | Perluas scope ke aset non-HTML yang ditautkan halaman live | **DITARIK.** D21 adalah P0, hidup, tertaut dari 4 halaman, dan tidak diblokir robots.txt |

## A.7 — Yang berubah pada gambaran besar

Run pertama menyimpulkan: *"situs JVTO tidak sakit di kulit; sakitnya di cara ia menceritakan dirinya ke mesin."* Setelah adendum ini, kalimat itu perlu dua koreksi:

1. **Sebagian dari yang kusebut "sakit" adalah pilihan sadar yang sudah dicatat.** Ekosistem ini punya disiplin governance yang lebih baik daripada yang run pertama kira — termasuk satu keputusan yang secara eksplisit memperingatkan agar tidak dibalik oleh pengukuran, dan run pertamaku langsung melanggarnya.
2. **Masalah paling serius tidak ada di HTML sama sekali.** Ia ada di sebuah PDF yang ditautkan dari empat halaman, tidak mengandung teks, dan karena itu tembus dari setiap checker berbasis teks yang dimiliki sistem ini.

**Section 7 tetap kosong.**

---
---

# ADENDUM B — 2026-08-30, run ketiga
### Pemetaan `jvto-ekosistem` ↔ `jvto-web`: D10 dibuka kembali dan dinaikkan, D12 ditutup

Peta lengkap ada di dokumen terpisah: **`jvto-ekosistem/docs/architecture-as-built-2026-08-30.md`**. Adendum ini hanya mencatat dampaknya terhadap Section 6.

## B.1 — D12 (notice jembatan Madakaripura): **DITUTUP**

Sam menyatakan pada 2026-08-30: **jembatan sudah diperbaiki.** Ini konsisten dengan temuan Adendum A.4 bahwa tidak ada catatan kerusakan jembatan di mana pun dalam SSOT maupun git history. Aturan standing "notice jembatan Madakaripura" adalah **fakta basi**, bukan notice yang hilang. **D12 turun ke P3 dan ditutup. U4 tertutup.** `[stated]`

## B.2 — D10 (host ekosistem): **DIBUKA KEMBALI, P2 → P1**

Run pertama menguji `/api/website/page` dan menyimpulkan API-nya ter-scope. Kesimpulan itu **benar untuk endpoint tersebut** tetapi salah untuk host secara keseluruhan, karena run pertama tidak membaca `server.mjs` dan karena itu tidak tahu ada endpoint lain.

`server.mjs` melayani **`/api/tree`** dan **`/api/file?path=…`**. Diverifikasi live hari ini:

| Cek | Hasil |
|---|---|
| `GET /api/tree` | **200**, `application/json`, **216 KB** — pohon direktori penuh: **1.296 file, 135 direktori** |
| `GET /api/file?path=2-product-and-commercial-core/pricing-rules/cost-components.json` | **200**, isi penuh 25 KB — model biaya internal |
| `GET /api/file?path=state/goals.json` | **200** — decisions log internal |
| Autentikasi di `server.mjs` | **Tidak ada.** Satu-satunya `process.env` adalah `PORT` |
| Path traversal (`../`, `.git/config`) | **Terblokir** (500). Paparan terbatas pada working tree |
| `GET /admin` | **200**, `<title>TinaCMS` — UI admin TinaCMS tersaji publik |

**Apa yang terbaca publik:** model biaya, margin per booking (74 booking di `booking-expense-records.json`), rate konfirmasi hotel, rencana kendaraan, penugasan crew, seluruh `docs/`, dan `state/goals.json`.

**Apa yang TIDAK terbaca:** data pribadi pelanggan. `booking-records.json` (154 record) membawa field `privacy` eksplisit — *"Customer names, phones, emails, portal links, payment links, receipts, references, expense, profit, and free-form notes are excluded from this working file."* Objek `customer` hanya `guestId`, `countryId`, `country`. Nol email, nol pola telepon terdeteksi. **Sanitasinya bekerja.**

**Klasifikasi:** paparan **komersial**, bukan privasi. Skala severity di template ini mengukur *kesalahan informasi*, bukan *keterbukaan informasi* — jadi P1 di sini dipakai sebagai penanda "butuh keputusan pemilik segera", bukan sebagai kecocokan definisi yang rapi. Perbedaan itu perlu disebut agar tidak dianggap sama dengan D1–D9.

**Yang tidak diuji, dan sengaja:** apakah `/admin` mengizinkan penulisan. Mengujinya berarti menulis ke data produksi. Di luar kewenangan audit — perlu diverifikasi pemilik.

## B.3 — Temuan struktural baru dari pemetaan

| # | Temuan | Severity |
|---|---|---|
| **D22** | **`/api/file` adalah dependensi produksi, bukan sisa alat internal.** 12 dari 18 loader di `jvto-web` mengonstruksi path repo ekosistem dan mem-fetch source mentah lewat endpoint itu. Kopling nyata antar-repo adalah **tata letak folder**, bukan kontrak. Rename file/folder di ekosistem → loader mengembalikan `null` → field hilang dari halaman, **tanpa error build**. | **P1** |
| **D23** | **`server.mjs` adalah single point of failure produksi tanpa autentikasi dan tanpa rate limit.** 16 dari 18 loader bergantung padanya. Fallback `readLocal()` membaca `../jvto-ekosistem` yang tidak pernah ada di Vercel, jadi kegagalan host = `null` diam-diam. Insiden 11 halaman crew 404 pada 2026-08-21 adalah bentuk ringan dari mode kegagalan ini. | **P1** |
| **D24** | **Tiga npm script di ekosistem menunjuk file yang tidak ada**: `generate:registry` → `scripts/generate-registry.mjs`, `validate:registry` → `scripts/validate.mjs`, `build:registry` → keduanya. Residu sistem registry yang dipensiunkan; sisi `jvto-web` sudah dibersihkan (`3925805f`, 2026-08-15), sisi ekosistem belum. | **P3** |

## B.4 — Koreksi terhadap Section 3.3 run pertama

Run pertama menulis: *"Bagaimana artefak sampai ke jvto-web? HTTP runtime, bukan commit/submodule"* — benar. Tapi kalimat berikutnya, *"jvto-web fetch ekosistem.*/api/website/page"*, **tidak lengkap**: itu hanya 3 dari 16 loader. Rasio sebenarnya:

| Endpoint | Loader | Yang dibaca |
|---|---:|---|
| `/api/file` | **12** | **source mentah** |
| `/api/website/page` | 3 | output terkompilasi |
| `/api/schema/page` | 1 | schema terkompilasi |
| tanpa fetch | 2 | helper murni |

Cluster editorial (`travel-guide`, `blog`, `markets`, `policy`) berjalan sepenuhnya lewat compiler — arsitekturnya bekerja sebagaimana dirancang di sana. Cluster komersial dan trust (`tours/*`, `verify-jvto`, `entity`, crew, reviews) membaca source langsung.

## B.5 — Gerbang falsifikasi run ketiga

| Hipotesis | Uji | Hasil |
|---|---|---|
| "API ekosistem ter-scope ke konten publik" *(kesimpulan run pertama)* | Baca `server.mjs`, temukan endpoint lain, probe `/api/file` dengan path pricing | **DITARIK.** Run pertama menguji satu endpoint dan menyimpulkan tentang host |
| "Data pelanggan ikut terekspos" | Tarik `booking-records.json`, periksa nama field + deteksi pola email/telepon | **DITARIK.** PII disanitasi secara sengaja, ada field `privacy` yang menyatakannya |
| "`/api/file` bisa keluar dari repo" | Uji `../../etc/passwd`, `../.git/config`, `.git/config` | **DITARIK.** Semua 500. Paparan terbatas working tree |
| "`4-channel-outputs/` hilang = sistem tidak lengkap" | Lacak apa yang sebenarnya menggantikannya | **DIAGNOSIS BERUBAH.** Digantikan HTTP runtime + `state/goals.json`, dan registry dipensiunkan dengan sengaja |
| "Blueprint dilanggar: web membaca source langsung" | Baca larangannya persis: *"Jangan frontend imports ../../../../1-knowledge-and-evidence-core/…"* | **BERTAHAN dengan catatan.** Tidak ada import filesystem. Tapi `/api/file?path=1-knowledge-and-evidence-core/…` adalah padanan HTTP-nya, dengan kopling identik |

**Section 7 tetap kosong.**

---
---

# ADENDUM C — 2026-08-30, run keempat (konsolidasi + eksekusi)
### D8 ditutup, C011 masuk, D24 ditutup, kontrak graf terender dibuat

Adendum ini menutup dua UNKNOWN terakhir yang butuh pemilik, menambah satu temuan terverifikasi, dan mencatat perubahan file yang **sudah dieksekusi** di working tree.

## C.1 — D8 (tahun berdiri): **DITUTUP**

Sam menetapkan pada 2026-08-30: **`foundingDate` = 2015.** `[stated]`

Validasi terhadap data sebelum menerapkan — dan hasilnya mengubah bentuk temuan:

| Sumber | Nilai | Putusan |
|---|---|---|
| `1-knowledge-and-evidence-core/organization-identity/organization.json` | `"foundingDate": "2015"` | **Sudah benar.** Komentar filenya: *"No PT incorporation year is asserted (**owner decision 2026-08-03**) — foundingDate 2015 is the brand/guesthouse era; 2023 is TDUP formalization."* |
| `src/lib/schemas/entityGraph.ts:225` | `foundingDate: '2015'` | Nilai benar, **authority duplikat** (hardcode di consumer) → masuk keluarga D9 |
| `verify-jvto/page.tsx:612` | `foundingDate: "2015"` | idem |
| `verify-jvto/page.tsx:1048` | `Since 2016` | **Satu-satunya drift nyata.** Menyatakan tahun berdiri yang bertentangan dengan keputusan pemilik |
| `verify-jvto/legal:72,87` · `history-artifacts:166` · `verify-jvto:23` · `WhyJvtoInteractive:198` | "Incorporated 2016" / "2016-01-01" | **Fakta legal sah, bukan klaim founding.** Dipertahankan |
| `llms.txt` | "2015 brand/guesthouse era; TDUP formalized 2023-02-11" | Konsisten |

**Jadi D8 bukan sengketa fakta.** Jawaban Sam mengonfirmasi keputusan yang sudah terkunci sejak 2026-08-03. D8 menyusut jadi **satu string di satu baris**.

**Dieksekusi:** `verify-jvto/page.tsx:1048` → `Since 2016` menjadi `Since 2015`. Satu penggantian. Empat entri "incorporated 2016" tidak disentuh.
**D8 turun ke P3 dan ditutup.** Sisa duplikasi authority tetap hidup sebagai bagian D9.

## C.2 — D12: **DITUTUP** (menegaskan Adendum B.1)

Sam menyatakan: **Madakaripura sudah efektif dibuka.** `[stated]`

Diverifikasi ulang run ini: **tidak ada klaim kerusakan/penutupan jembatan di SSOT.** `grep` atas `destination-knowledge/madakaripura-waterfall.json`, `.content.json`, dan `health-and-safety-rules/weather-and-closures.md` untuk pola bridge/jembatan/closed/damag → **0 hasil**. Satu-satunya closure terjadwal yang tercatat adalah **Ijen, Jumat pertama tiap bulan**.

Aturan standing *"notice jembatan Madakaripura disertakan di tempat relevan"* adalah **fakta basi**. Dipensiunkan, dan pemensiunannya dicatat di `rendered-graph-contract.json → globalRules.retiredRules` supaya audit berikutnya tidak menandainya lagi. **D12 ditutup. U4 ditutup.**

## C.3 — Temuan baru terverifikasi: singleton `WebPage` ganda

Berasal dari `conflict_register.csv` (C011) run konkuren; **diverifikasi independen run ini** dengan parser rekursif atas 296 halaman:

| Halaman | `WebPage` |
|---|---:|
| `/destinations/ijen-crater` | 2 |
| `/policy/booking-payment-cancellation` | 2 |
| `/policy/inclusions-exclusions` | 2 |
| `/policy/privacy` | 2 |
| `/verify-jvto` | 2 |

Melanggar singleton watchlist framework. **Run pertama melewatkannya** karena hanya menguji *kehadiran* node, bukan *multiplisitas*. **Severity P2.** Sudah masuk `baselineViolations` kontrak.

**Falsifikasi yang dijalankan:** `TouristTrip` juga muncul berulang (17 halaman tur, 5 destinasi, 2 market) — awalnya ikut tertandai. **Ditarik:** node hari (`#day-1`, `#day-2`) sah berulang sebagai `subTrip`. Pengecualian ditulis eksplisit di kontrak (`globalRules.singletonExemptions`) agar tidak jadi false positive permanen.

## C.4 — D24 (3 npm script mati): **DITUTUP**

`generate:registry` → `scripts/generate-registry.mjs`, `validate:registry` → `scripts/validate.mjs`, `build:registry` → keduanya. Ketiganya menunjuk file yang tidak ada; `npm run build:registry` gagal.

Residu sistem registry yang **dipensiunkan dengan sengaja** (decision `validate-routes-registry`, `3925805f`, 2026-08-15). Sisi `jvto-web` sudah dibersihkan; sisi ekosistem belum. **Dieksekusi:** 3 baris dihapus dari `package.json`; JSON diverifikasi tetap valid; 23 script tersisa. **D24 ditutup.**

## C.5 — Artefak baru: kontrak graf terender

`5-experience-engine/manifests/rendered-graph-contract.json` — **dibuat, bukan diusulkan.**

| Isi | Nilai |
|---|---|
| routeGroups | 22, mencakup **296/296** route |
| requiredNodes | diturunkan dari irisan `@type` jangkar yang teramati di semua halaman tiap group, digabung lapisan intent |
| `baselineViolations` | **14 aturan, 459 route-instance** — mereproduksi C005, C006, C010, C011 secara mekanis |
| governance | mengutip `state/goals.json`; 6 decision dihormati; rule yang bertentangan dengan decision **batal** |
| exemptions | `home` dibebaskan dari `uiParityRequired` atas `homepage-answer-block` (2026-08-27) |
| retiredRules | registry checks; notice jembatan Madakaripura |
| scopeBoundary | menyatakan eksplisit bahwa D21 (aset non-HTML) dan D10/D22/D23 (transport) **di luar jangkauan gerbang ini** |

`validate-schema.mjs` dijalankan ulang setelah semua perubahan: **`OK: 290 routes validated, 0 violations`** — tidak ada regresi.

## C.6 — Perubahan file yang sudah dieksekusi

| Repo | Path | Aksi |
|---|---|---|
| ekosistem | `5-experience-engine/manifests/rendered-graph-contract.json` | **DIBUAT** |
| ekosistem | `package.json` | 3 baris script mati **DIHAPUS** |
| ekosistem | `5-experience-engine/public-website/static-route-groups.json` | **DIPINDAH** → `archive/reverse-extracted-2026-08-11/` |
| ekosistem | `5-experience-engine/seo-metadata/page-metadata-index.json` | **DIPINDAH** → idem |
| ekosistem | `archive/reverse-extracted-2026-08-11/README.md` | **DIBUAT** (alasan + cara undo) |
| ekosistem | `docs/arsitektur-satu-graf-satu-gerbang-2026-08-30.md` | **DIBUAT + §10 koreksi** |
| web | `src/app/(website)/verify-jvto/page.tsx` | `Since 2016` → `Since 2015` |

Semua di working tree, **nol commit, nol push, nol deploy.** Produksi tidak tersentuh.

## C.7 — Peta ID: D (Render Chain) ↔ C (conflict register) ↔ T (handoff)

| D | C | T | Perkara |
|---|---|---|---|
| D1 | C002, C003 | T003, T004 | Parity FAQ |
| D2 | C002 | T003 | `narrative_claims` jadi `Question` |
| D3 | C004 | T005 | 65 `TouristAttraction.url` mati |
| D4 | C005 | T006 | 222 `Product` sintetis |
| D5 | C007 | T008 | `Review` identitas ganda |
| D6 | C009 | T009 | `Person` 27 `@id` |
| D7 | C006 | T007 | `/entity` tanpa node identitas |
| D8 | C008 | — | Tahun berdiri — **DITUTUP C.1** |
| D9 | C001 | T002 | `tourFaqs.ts` authority |
| D10 | — | T001 | Host ekosistem — **P1 (Adendum B.2)** |
| D11 | C012 | — | `/checkout`, `/my-booking` indexable |
| D12 | — | — | Madakaripura — **DITUTUP C.2** |
| D13 | C010 | T010 | `BreadcrumbList` hilang 223 halaman |
| D14 | — | — | `WebPage` hilang 7 halaman |
| D15–D20 | — | — | Coverage, shadow route, `@id`, dokumen, angka basi, kosmetik |
| D21 | — | — | **P0** — SIP dokter, aset non-HTML |
| D22, D23 | — | T001 | `/api/file` kopling · `server.mjs` SPOF |
| D24 | — | — | npm script mati — **DITUTUP C.4** |
| **baru** | **C011** | — | `WebPage` ganda di 5 halaman — **P2, C.3** |

## C.8 — UNKNOWN yang tersisa

| # | UNKNOWN | Butuh |
|---|---|---|
| U1 | Deploy/build ID produksi | akses Vercel |
| U2 | Status indexing 296 URL | akses GSC |
| U15 | Isi repo `jvto-ops` (privat) | akses repo |
| U16 | 28 dokumen `ekosistem/docs/` | pembacaan |
| U17 | Inventaris aset non-HTML produksi | **konsekuensi D21 — paling mendesak** |
| U18 | Angka publik partner hotel: 27 / 17 / 23 | keputusan Sam |
| U12 | Dasar angka "22 paket" | tidak ada di repo mana pun; rantai 16+1=17 terlacak penuh |

**Section 7 tetap kosong.** Keputusan atas D21 (P0) dan D10 (P1) belum diambil dan bukan milik audit.
