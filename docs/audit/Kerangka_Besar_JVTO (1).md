Protokol Analisis Steril · jvto-ekosistem

Digital Trust Fortress — Audit Steril
Klaim di JVTO_Digital_Trust_Fortress.pdf (deck NotebookLM, v1.9) diuji satu per satu terhadap isi nyata repo jvto-ekosistem. Setiap klaim yang lolos ke bawah sudah melewati gerbang falsifikasi §5.

Tanggal
2026-09-06
Branch
main
Snapshot commit
3f4fc358…24e
Scope
OBJEK
Klaim faktual di JVTO_Digital_Trust_Fortress.pdf (15 slide, output NotebookLM, "JVTO Ecosystem Architecture v1.9").
PERTANYAAN
Klaim mana di deck yang didukung data nyata di jvto-ekosistem, dan mana yang tidak ditemukan / murni konseptual?
BATAS
jvto-ekosistem branch main saja — jvto-web tidak diperiksa. Tidak ada perubahan file. Tidak menilai desain/branding deck. Temuan JVTO_Drift_Audit_20260905.md (C001–C008) tidak diulang.
KEDALAMAN
Isi file sumber dibaca langsung, bukan hanya nama file; cross-check ke ≥2 file independen per klaim bila tersedia.
OUTPUT
Laporan ini — SCOPE / METODE / HASIL / TEMUAN / PARKIR / TIDAK DIKETAHUI / CHANGELOG, satu artifact.
SELESAI
Semua klaim checkable di 15 slide sudah diuji falsifikasi; temuan yang lolos tercantum dengan ID stabil DTF-01…DTF-10.
OBJEK/PERTANYAAN dipilih Sam dari 4 opsi yang diajukan (2026-09-06); BATAS/KEDALAMAN/OUTPUT/SELESAI diisi mengikuti default protokol analisis-steril.

Metode
Sumber
D:\jvto-ekosistem di komputer Sam, dibaca read-only lewat device_bash.
Snapshot
git rev-parse HEAD pada main = 3f4fc35839d54afd12ddb1f064a32df59e4e824e — identik dengan snapshot "current" di JVTO_Drift_Audit_20260905.md. Tidak ada drift sejak audit itu. git status --porcelain hanya untracked files, tidak ada perubahan kode/data.
Decision log
Dicek sebelum mengukur (§2): state/goals.json.decisions[] (9 entri, 2026-08-18 s/d 08-27) dan trust-claims.json. Tidak satu pun menyebut deck ini. Decision source untuk deck ini: tidak ditemukan.
Perintah yang bisa diulang, dijalankan dari root jvto-ekosistem:

grep -rIlF -- "<istilah>" 1-knowledge-and-evidence-core 2-product-and-commercial-core \
  3-booking-and-journey-core 4-operations-core 5-experience-engine docs public scripts \
  schemas state tina
Istilah yang diuji:

AHU-0001072
why-jvto-ssot
SSOT-1138
proof-layer.json
Gufron
Joyo
Ahboy
R-9087
TRSTPLT_8X4
TRPADV_J7L
GOOGLE_NAPS
canonical_preserve_only_additive_merges
INDECON
0xFA3D
HPWKI
ISIC
Jason Li
Ditpamobvit
SIP dokter
Hasil10 elemen checkable dari 15 slide
Slide	Klaim inti	Status
05	Founder "Agung Sambuko", afiliasi Ditpamobvit	tidak cocok
06	SIP dr. Ahmad Irwandanu 503.446/193/…/2020	tidak cocok
07	Hash Stefan Loose 2015 · Booking.com Award 2015	sebagian
08	why-jvto-ssot.proof-layer.json, SSOT-1138-ALPHA	tidak ditemukan
10	"Proof Library": NIB, SPRIN-POLPAR, hash per dokumen	sebagian
11	Crew Registry: Gufron, Rendi, Joyo	real
12	HPWKI — "Govt Decree: AHU-0001072"	disalahtempatkan
12	ISIC — badge "Global Verification"	dilebih-lebihkan
12	Indecon — "NGO Validation"	dilebih-lebihkan
13	Review Registry: "Jason Li", ID R-9087-JLI, skor sentimen	sebagian
14	Hash contoh AF6VE5303O…	tidak valid
TemuanDTF-01 … DTF-10
DTF-01
Afiliasi kepolisian founder salah
tidak cocok
Slide 5
"AFFILIATION: Ditpamobvit (Directorate of Vital Object Security)"
police-safety.json
Jabatan harian: "Bintara Sie Propam, Polres Bondowoso". Penugasan Tourist Police: "Polisi Pariwisata (POLPAR) Bondowoso", Sprin/4954/XI/2020.
[terbaca] 1-knowledge-and-evidence-core/credentials-and-public-evidence/verify-jvto-pages/police-safety.json — status published, owner legal, lastReviewed 2026-08-06/07. "Ditpamobvit" nol hasil di seluruh repo yang diperiksa.

Kenapa penting — ini klaim YMYL di halaman resmi ber-owner legal. Ditpamobvit adalah direktorat Polri nyata tapi berbeda (Pengamanan Objek Vital), bukan unit yang menaungi founder menurut sumber JVTO sendiri.

DTF-02
Nomor SIP dokter salah
tidak cocok
Slide 6
License (SIP): 503.446/193/DRU/4/430.9.13/2020
credentials.json · trust-claims.json
SIP 503.446/664/DRU/4/430.9.13/2026, terbit 2026-01-06, STR QN00001073380217 berlaku s/d 2031-01-06.
[terbaca] Konsisten di 4 file independen: credentials.json (key sip-ahmad-irwandanu-2026), trust-claims.json, dan dua file blog *.source.json. Dua segmen berbeda sekaligus: nomor tengah (193 vs 664) dan tahun (2020 vs 2026).

Kenapa penting — nomor izin praktik ini dipakai untuk verifikasi publik di Kemenkes SatuSehat/KKI. Nomor salah tidak bisa diverifikasi siapa pun yang mengecek.

DTF-03
File/ID/policy "SSOT" di deck tidak ada
tidak ditemukan
Slide 8
File why-jvto-ssot.proof-layer.json, "proof_id": "SSOT-1138-ALPHA", "policy": "canonical_preserve_only_additive_merges"
verify-jvto-ssot.json
Skema verify-jvto-document-gallery/v1. Isinya rekonsiliasi hash: cross_referenced_hashes: 5, matched: 5, flagged: 0, verified_on: 2026-08-15.
[terbaca] Ketiga string di slide 8 nol hasil di seluruh repo non-arsip. Rekonsiliasi nyata mencocokkan hash NIB/TDUP/HPWKI (organization.json) dan SPRIN POLPAR/WAL-TRAVEL (people.json) secara silang — 5/5 cocok, 0 flag.

Kenapa penting — konsep rekonsiliasi-hash-lintas-file itu nyata dan lebih kuat dari gambaran deck, tapi nama file/ID/policy di slide 8 karangan — jangan dicari dengan nama itu.

DTF-04
Hash contoh di deck bukan hash asli
ilustratif
Slide 7 & 8
Hash identik ECD5B591A4D2F078… dipakai untuk dua dokumen berbeda (guidebook Stefan Loose & file SSOT). Slide 14: AF6VE5303O4ORA… — bukan format hex 64-karakter.
police-safety.json · verify-jvto-ssot.json
Hash asli berbeda per dokumen: SPRIN-POLPAR 03c8578dc229…, SPRIN-WAL-TRAVEL 179b061eae55…, NIB fa20dde3…, TDUP 27252d51…, HPWKI ca1fb1a4….
[terbaca] Dua artefak berbeda tidak mungkin ber-hash SHA-256 sama kalau keduanya nyata.

Kenapa penting — mekanisme hash-per-dokumen itu nyata; nilai hash yang ditampilkan deck adalah placeholder, bukan hash sungguhan.

DTF-05
Badge "VERIFIED" untuk ISIC melanggar claim boundary sumber sendiri
dilebih-lebihkan
Slide 12
Centang hijau "✓ VERIFIED" + "Global Verification. Student ID API Integration."
partners.json
"Registered ISIC provider (provider listing only) — never 'verified ISIC partner'; pending direct provider evidence."
[terbaca] Provider ID 259268 nyata. Tapi organization-identity/entity-graph-schema-facts.json:115 sendiri sudah menulis "JVTO is a verified ISIC partner" — bertentangan dengan claim boundary partners.json. Deck kemungkinan mewarisi kalimat yang sudah salah ini.

Kenapa penting — ini bukan cuma masalah deck — entity-graph-schema-facts.json juga sudah melewati batas yang ditetapkan sendiri oleh partners.json.

DTF-06
Decree AHU-0001072 disalahtempatkan sebagai kredensial JVTO
disalahtempatkan
Slide 12
"Govt Decree: AHU-0001072…" ditaruh di bawah node HPWKI dalam "Partner Ecosystem" berpusat JVTO.
credentials.json
AHU-0001072.AH.01.07.TAHUN 2024 = nomor badan hukum HPWKI sendiri. Lampirannya mencantumkan Agung Sambuko sebagai PENGAWAS · ANGGOTA — kursi pribadi, bukan keanggotaan korporat PT Java Volcano Rendezvous.
[terbaca] Koreksi eksplisit sudah tercatat 2026-08-21/22 di credentials.json baris 26–31 — persis kesalahan yang sama.

Kenapa penting — deck berisiko menghidupkan lagi framing yang sudah pernah diperbaiki secara eksplisit di sumbernya sendiri.

DTF-07
Indecon nyata, statusnya dilebih-lebihkan
dilebih-lebihkan
Slide 12
"Indecon" + centang hijau + "Sustainability Context. NGO Validation."
partners.json
"INDECON (Indonesian Ecotourism Network)", relationship network listing, claimBoundary "Public network listing only."
[terbaca] Ejaan sumber: INDECON, huruf besar semua. Tidak ada "NGO Validation" atau status verified di claimBoundary.

Kenapa penting — entitasnya real, tapi level "validasi" yang ditampilkan deck melebihi apa yang didokumentasikan.

DTF-10
Review Registry: reviewer nyata, format ID/skor tidak cocok skema data
sebagian
Slide 13
Review_ID R-9087-JLI, tag sumber TRSTPLT_8X4 / TRPADV_J7L / GOOGLE_NAPS, skor sentimen numerik 9.5/10 & 9.2/10.
google-review-records.json
ID asli: "google-review-135". Field: platform, reviewerName, date, star, mentionedCrews, themes — tidak ada skor sentimen numerik atau tag hash sumber.
[terbaca] "Jason Li" reviewer nyata (reviews.json:5183, review terkait crew "Boy"). Mekanisme themes + mentionedCrews itu real — persis "Tier B, belum dioptimalkan" di jvtokeunggulanaeogeoanalisis.md.

Kenapa penting — pengelompokan review-per-tema sudah ada di data; tampilan ID/skor/hash di slide 13 adalah rekaan visual, bukan nilai field asli.

Lampiran — Hipotesis Gugur (§5, bukan temuan)
"Gufron dan Joyo nama fiktif" — gugur. Keduanya real: our-team-gufron.source.json dan our-team-joyo.source.json ada lengkap dengan schema-output dan website-output.

"Ahboy nama fiktif" — gugur. "Ahboy" adalah alias resmi tercatat untuk crew "Boy" di google-review-crew-alias-reconciliation.json (2 review teratribusi: google-review-168, google-review-220).

Parkir
Temuan
JVTO_Drift_Audit_20260905.md
(C001 tourFaqs.ts, C002/C003 FAQ schema parity, C006
/entity
graph, C008 Breadcrumbs hardcode, mismatch route-output-index vs sitemap) — di luar scope tugas ini, tidak diinvestigasi ulang.
JVTO_AEO_GEO_Ekosistem_Web_Playbook.md
(diunggah saat tugas berjalan) mengklaim head
jvto-web@62989ceb
/
jvto-ekosistem@2bc370e1
per 2026-08-31 — sudah basi menurut isinya sendiri (16–21 commit di belakang saat itu), makin basi sekarang. Dipakai hanya sebagai konteks arsitektur (Bagian 4), bukan dasar HASIL.
Slide 9 ("Forensic Bento-Grid") — panduan desain/branding, bukan klaim faktual, tidak checkable.
Slide 1–3, 15 — framing naratif/kesimpulan, tanpa klaim yang bisa diuji ke data.
Tidak Diketahui
Apakah UI "Proof Library" (slide 10) pernah/sedang dirender di
jvto-web
— tidak dicek, di luar BATAS.
Siapa pembuat
JVTO_Digital_Trust_Fortress.pdf
dan untuk tujuan apa — tidak bisa disimpulkan dari isi repo atau deck.
Apakah skema tag
TRSTPLT_8X4
/
GOOGLE_NAPS
ada di
review-platforms.json
— disebut di komentar
organization.json
tapi isinya belum dibaca di tugas ini.
jvto-web/src/lib/Master_Dataset_JVTO.SSOT.v3.0.json
, disebut sebagai sumber rekonsiliasi di komentar
verify-jvto-ssot.json
— keberadaannya di repo
jvto-web
tidak diverifikasi (di luar BATAS).
CHANGELOG — v1 (2026-09-06): versi awal. DTF-01…DTF-10 (minus 2 hipotesis gugur) diterbitkan pertama kali di sini.