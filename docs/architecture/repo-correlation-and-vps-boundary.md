# Batas jvto-web ↔ jvto-ekosistem ↔ VPS

Diverifikasi 2026-09-02. Dokumen ini ada karena kesimpulan yang salah pernah ditulis ke
file aturan yang selalu aktif: bahwa kedua repo "sengaja satu VPS karena jvto-web membaca
ekosistem sebagai direktori saudara". Itu keliru, dan koreksinya perlu satu tempat tinggal.

**Ini bukan rekomendasi migrasi.** Apakah jvto-web tetap di VPS adalah keputusan
infrastruktur pemilik. Dokumen ini hanya memastikan keputusan itu diambil dari fakta.

## Rantainya

```
source facts / data domain
        ↓
jvto-ekosistem      compiler + kontrak  (satu-satunya tempat konten diedit)
        ↓
generated output    *.website-output.json, *.schema-output.json, feed, manifest
        ↓
jvto-web            presentasi + runtime aplikasi
        ↓
halaman ter-render
```

Arahnya **satu**. jvto-web tidak pernah menulis ke ekosistem. Ketergantungannya logis —
web mengonsumsi kontrak yang dihasilkan ekosistem — bukan filesystem.

## Bagaimana konten berpindah: dua jalur, bukan satu

**19 pembaca** memakai pola yang sama:

```ts
const file = (await readLocal()) ?? (await fetchRemote());
```

| Jalur | Sumber | Kalau gagal |
|---|---|---|
| File | `JVTO_EKOSYSTEM_CONTENT_ROOT`, atau `path.resolve(cwd, "..", "jvto-ekosistem")` | jatuh ke HTTP |
| HTTP | `JVTO_EKOSYSTEM_CONTENT_BASE_URL`, atau default publik → `GET /api/file?path=…` | kembalikan `null`, komponen tidak dirender (G3) |

Rujukan: `src/lib/ecosystemContent/website.ts:141-183` (akar; 16 file lain di direktori itu
mengikutinya, dan `whyJvto.ts` + `staticPageAdapter.ts` tidak punya IO sendiri — keduanya
mendelegasikan ke `website.ts`), serta `src/lib/people/crewReviews.ts:71-118` — **pola yang
sama, di luar `ecosystemContent/`**.

> ⚠️ File terakhir itu lolos dari survei pertama 2026-09-02 karena surveinya dibatasi ke
> `src/lib/ecosystemContent/`. Setiap pemeriksaan berikutnya harus menyapu seluruh `src/`.

Perintah yang membuktikannya, dan angka yang harus keluar:

```bash
grep -rl 'process.cwd(), "\.\."' src/ --include="*.ts"          # 17 file
# lalu, untuk tiap file, pastikan ada fetch( di file yang sama  # 0 tanpa fallback
```

**17, bukan 2.** Tiap reader membawa salinan `ecosystemContentRoot()` sendiri — fungsinya
tidak dibagi. Menyimpulkan dari satu file yang kebetulan dibaca duluan akan salah.
(16 file `ecosystemContent/` punya jalur repo-saudara sendiri, 2 mendelegasikan, ditambah
`crewReviews.ts` → 19 pembaca, 17 titik `path.resolve`.)

Jadi jalur file adalah **optimisasi**: ia menghindari hop jaringan ketika kedua repo
kebetulan bersebelahan. Ia bukan syarat.

## Dorongan balik setelah deploy ekosistem

Setelah render + rsync + `pm2 reload`, ekosistem **menunggu app benar-benar listening**
(`deploy-vps.yml:359-372`) lalu memanggil jvto-web:

```
POST /api/revalidate/ecosystem-content     (deploy-vps.yml:383-429)
```

Urutan tunggu-dulu itu bukan hiasan, dan kegagalannya tidak sembuh sendiri. Pada
2026-08-21 revalidasi ditembakkan sebelum server siap: **11 halaman crew jadi 404**, render
gagalnya **ter-cache sebagai `notFound()`**, dan karena rute-rute itu ada di dalam himpunan
revalidasi, **setiap deploy ekosistem berikutnya memicu ulang race yang sama alih-alih
memulihkannya**. Probe-nya sekarang menembak `/api/file?path=…/people.json` sampai 200,
maksimal 30 percobaan, sebelum memberi tahu konsumen.

Setelah itu jvto-web membaca ulang, tag cache `jvto-ekosistem-content` di-bust, halaman
ter-render ulang.

## Bukti terkuat: build penuh tanpa repo saudara sama sekali

Diukur 2026-09-02. Jalur file dimatikan dengan menunjuknya ke direktori yang tidak ada,
sehingga **setiap** pembacaan konten terpaksa lewat HTTP:

```bash
JVTO_EKOSYSTEM_CONTENT_ROOT="/nonexistent-forces-http" npm run build
```

| Hasil | Nilai |
|---|---|
| Exit | **0** |
| Halaman statis | **106/106** |
| Entri tabel rute | **104** |
| Paritas terhadap build normal | **identik, nol diff** |

Ini menutup satu-satunya keberatan teknis terhadap pemindahan: kekhawatiran bahwa 296 rute
yang membaca lewat jaringan akan membuat build lambat atau flaky. Build-nya selesai dan
outputnya sama persis. (Durasi 29 detik diukur dengan `.next` hangat, jadi angka itu bukan
pembanding bersih — yang menentukan adalah build **selesai dengan output identik**.)

Kesimpulannya bukan lagi "secara teori tidak terikat". Kesimpulannya: **sudah dibuktikan
berjalan tanpa repo saudara.**

## Yang terikat VPS, dan yang tidak

**Terikat:**

- **Mekanisme deploy** — SSH + `git checkout live` + `git reset --hard` + `npm ci` + `next build` + pm2.
- **Tempat `/api/file` dilayani.** Endpoint-nya harus hidup di suatu tempat; sekarang di VPS yang sama.

**Tidak terikat:** kode aplikasi jvto-web.

**Tidak diketahui dari repo:** host Postgres produksi. `DATABASE_URL` hidup di `.env` VPS
dan IP VPS adalah secret, jadi tidak bisa dibandingkan dari sini. **Jangan asersikan** DB
ada di host lain maupun di VPS yang sama.

## Bukti (2026-09-02)

| Klaim | Cara diuji | Hasil |
|---|---|---|
| Tidak ada tulis ke disk saat runtime | grep 11 pola (`writeFile`, `mkdir`, `createWriteStream`, `unlink`, `rename(`, `appendFile`, `rmdir`, `copyFile`, dst.) di `src/app`, `src/lib`, `src/components`, `src/middleware.ts` | **nol** |
| Semua pemakaian `fs` bersifat baca | daftar seluruh import `fs`/`node:fs` di `src/` (kecuali `src/generated`) | 22 import, semuanya baca |
| Pembaca disk non-ekosistem tidak butuh repo saudara | `destinations/[slug]/page.tsx:134,147` · `3d/[slug]/page.tsx:23,75` · `ops/getVolcanicStatus.ts:24` | ketiganya `path.join(process.cwd(), "public", …)` — ikut bundle |
| Setiap pembaca ekosistem punya fallback HTTP | survei 18 file `ecosystemContent/` + `people/crewReviews.ts` | **19 pembaca, semuanya dua jalur** |
| `public/uploads/` bukan hasil upload runtime | `git ls-files public/uploads` | **191 file ter-track**; `app/uploads/[...path]/route.ts` hanya membacanya |
| Tidak ada `output: "standalone"` | grep `next.config.ts` | tidak ada |
| Endpoint HTTP ekosistem hidup | `curl .../api/file?path=state/goals.json` | **200** |
| Kegagalan ada di jalur deploy, bukan app | `gh run view` pada empat run gagal | `dial tcp ***:22: i/o timeout`, sementara HTTPS kedua app **200** |

## Cara memeriksa ulang

Prosedurnya ada di `CLAUDE.md` → *Verification rules* → **Rule 7**. Ringkasnya: tulis-disk,
repo-saudara-tanpa-fallback, dan baca-`public/` adalah pertanyaan **runtime**; `ssh`,
`rsync`, `pm2`, `git reset --hard` adalah pertanyaan **deployment**. Respons 200 dari API
publik membuktikan app hidup — bukan bahwa repo harus menyatu, dan bukan bahwa jalur deploy
sehat.
