# JVTO Technical Implementation Backlog

Tanggal pemeriksaan kode: 2026-09-06

## 1. Scope dan Snapshot

Dokumen ini menerjemahkan `JVTO_Drift_Audit_2026-09-05.md` menjadi task implementasi yang dapat dikerjakan dan diuji.

| Sumber | Ref yang diperiksa | Peran |
|---|---|---|
| `jvto-devteam/jvto-web` | `live` @ `492fab115872a1151deadb65689116d690cdefdf` | Pemilik route publik, sitemap, rendering HTML, metadata, dan komposisi JSON-LD live |
| `jvto-devteam/jvto-ekosistem` | `main` @ `3f4fc35839d54afd12ddb1f064a32df59e4e824e` | Pemilik sumber konten/fakta, generator website output, generator schema output, dan manifest output |
| Website live | audit 2026-09-05 | Bukti output HTTP/HTML; bukan bukti deployment SHA |

Catatan: semua path berlabel **BARU** adalah usulan implementasi dan belum ada di repository saat pemeriksaan.

## 2. Koreksi Model Pengukuran

`route-output-index.json` dan `sitemap.xml` tidak mengukur hal yang sama:

- `route-output-index.json` mencatat artifact yang dihasilkan ekosistem.
- `sitemap.xml` mencatat URL yang dipublikasikan sebagai indexable oleh website.

Karena itu, target yang benar bukan memaksa kedua set selalu identik. Fondasi yang dibutuhkan adalah kontrak route publik di `jvto-web`, kemudian validator yang menjelaskan hubungan setiap URL publik dengan artifact ekosistem.

## 3. Urutan Eksekusi

| Urutan | Task | Repo | Dependency | Hasil utama |
|---:|---|---|---|---|
| 1 | T01 — Public route contract | `jvto-web` | Tidak ada | Definisi resmi keluarga route publik |
| 2 | T02 — Route reconciliation validator | `jvto-web` | T01 | Mismatch berubah menjadi klasifikasi yang dapat diuji |
| 3 | T03 — Schema contract per URL group | `jvto-ekosistem` | Tidak ada | Tipe/node schema expected per keluarga route |
| 4 | T04 — Live audit v2 | `jvto-ekosistem` | T03 | Audit node-level, bukan hanya daftar tipe |
| 5 | T05A — FAQ canonical producer | `jvto-ekosistem` | T03 | FAQ tour berasal dari satu source |
| 6 | T05B — FAQ consumer migration | `jvto-web` | T05A merged | Visible FAQ dan FAQPage memakai payload yang sama |
| 7 | T06 — Entity graph composition | `jvto-web` | T03 | Reference `#website`/`#organization` terdefinisi |
| 8 | T07 — Breadcrumb ownership | `jvto-web` | T03 | Satu pemilik BreadcrumbList dan URL production |
| 9 | T08 — Generator hardening | `jvto-ekosistem` | T02–T04 | Satu writer manifest, atomic output, invalid data gagal jelas |
| 10 | T09 — Cross-repo CI gate | Kedua repo | Semua task di atas | Kontrak diuji sebelum merge/deploy |

---

## T01 — Public Route Contract

### Tujuan

Mendefinisikan route mana yang public/indexable, siapa pemilik sumbernya, siapa perendernya, dan output apa yang expected. Ini menjadi pembanding sitemap; bukan `route-output-index.json`.

### Repo dan file

Repo: `jvto-devteam/jvto-web`, branch kerja baru dari `live`.

- **BARU** `src/lib/routes/publicRouteContract.ts`
- **BARU** `src/lib/routes/buildPublicRouteInventory.ts`
- **BARU** `scripts/validate-public-route-contract.mjs`
- Ubah `package.json`

### Input

- Static route yang sekarang tersebar di `src/app/**/sitemap.data.ts`.
- Review IDs dari `getEcosystemReviews()`.
- Destination slugs dari `getEcosystemDestinationRoutes()`.
- Crew codes dari `getPublicCrewCodes()`.
- Tour slugs dari loader tour yang sudah dipakai sitemap.

### Contoh kontrak

```ts
export type RouteFamilyContract = {
  id: string;
  pattern: string;
  group: string;
  contentOwner: "jvto-web" | "jvto-ekosistem";
  renderOwner: "jvto-web";
  schemaOwner: "jvto-web" | "jvto-ekosistem";
  sitemapExpected: boolean;
  websiteOutputExpected: boolean;
  schemaOutputExpected: boolean;
  expectedStatus: 200;
};

export const PUBLIC_ROUTE_CONTRACT = [
  {
    id: "review-detail",
    pattern: "/why-jvto/reviews/:id",
    group: "why-jvto/reviews-detail",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "jvto-ekosistem",
    sitemapExpected: true,
    websiteOutputExpected: false,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "destination-detail",
    pattern: "/destinations/:slug",
    group: "destinations/detail",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "jvto-web",
    sitemapExpected: true,
    websiteOutputExpected: false,
    schemaOutputExpected: false,
    expectedStatus: 200,
  },
] satisfies readonly RouteFamilyContract[];
```

`schemaOutputExpected: false` pada destination detail berarti tidak diwajibkan mempunyai file di `jvto-ekosistem/5-experience-engine/json-ld/pages`; schema dapat disusun di `jvto-web`. Nilai ini harus dikonfirmasi dari kontrak produk sebelum di-merge.

### Output

```json
{
  "schemaVersion": "jvto/public-route-inventory/v1",
  "generatedAt": "2026-09-06T00:00:00.000Z",
  "routes": [
    {
      "route": "/why-jvto/reviews/333",
      "group": "why-jvto/reviews-detail",
      "contractId": "review-detail",
      "sitemapExpected": true,
      "schemaOutputExpected": true,
      "sourceRecord": "reviews.json#333"
    }
  ]
}
```

### Tests

- Tidak ada duplicate route.
- Semua route cocok tepat satu contract family.
- Semua route sudah dinormalisasi: leading slash, tanpa trailing slash kecuali `/`.
- Tidak ada uppercase path.
- Semua dynamic record memiliki ID/slug non-kosong.
- Builder menghasilkan output deterministik bila `generatedAt` dikeluarkan dari perbandingan.

### Definition of Done

- `npm run validate:public-routes` tersedia.
- Validator exit `1` untuk duplicate/unclassified route.
- Belum mengubah isi sitemap; ini foundation-only.

---

## T02 — Route Reconciliation Validator

### Tujuan

Mengubah perbedaan route menjadi hasil yang dapat dijelaskan: expected, missing, unexpected, atau intentionally web-owned.

### Repo dan file

Repo: `jvto-devteam/jvto-web`.

- **BARU** `scripts/reconcile-route-outputs.mjs`
- **BARU** `scripts/test/reconcile-route-outputs.test.mjs`
- Ubah `package.json`

### Input

1. Inventory dari T01.
2. `jvto-ekosistem/5-experience-engine/manifests/route-output-index.json`.
3. Sitemap hasil fungsi Next.js atau sitemap live.

### Contoh hasil per URL

```json
{
  "route": "/destinations/mount-bromo",
  "contractId": "destination-detail",
  "inPublicInventory": true,
  "inSitemap": true,
  "inRouteOutputIndex": false,
  "classification": "EXPECTED_WEB_OWNED_OUTPUT",
  "status": "PASS"
}
```

```json
{
  "route": "/why-jvto/reviews/333",
  "contractId": "review-detail",
  "inPublicInventory": true,
  "inSitemap": false,
  "inRouteOutputIndex": true,
  "classification": "MISSING_FROM_SITEMAP",
  "status": "FAIL"
}
```

### Implementasi inti

```js
export function reconcileRoute(route, contract, observed) {
  const failures = [];

  if (contract.sitemapExpected !== observed.inSitemap) {
    failures.push("SITEMAP_EXPECTATION_MISMATCH");
  }
  if (contract.schemaOutputExpected !== observed.hasSchemaOutput) {
    failures.push("SCHEMA_OUTPUT_EXPECTATION_MISMATCH");
  }
  if (contract.websiteOutputExpected !== observed.hasWebsiteOutput) {
    failures.push("WEBSITE_OUTPUT_EXPECTATION_MISMATCH");
  }

  return {
    route,
    failures,
    status: failures.length === 0 ? "PASS" : "FAIL",
  };
}
```

### Output

- `artifacts/route-reconciliation.json`
- `artifacts/route-reconciliation.csv`
- Ringkasan counts di stdout.

### Definition of Done

- Delapan mismatch dari audit 5 September mempunyai klasifikasi eksplisit.
- Tidak ada logic `if route === ...` dalam validator; exception harus berada di contract data.
- Exit code non-zero hanya untuk perbedaan yang melanggar contract.

---

## T03 — Schema Contract per URL Group

### Tujuan

Menentukan schema minimal, optional, singleton, dan forbidden untuk setiap keluarga URL. Perubahan `jsonld_types` kemudian dinilai terhadap kontrak, bukan dianggap salah hanya karena berubah.

### Repo dan file

Repo: `jvto-devteam/jvto-ekosistem`.

- **BARU** `5-experience-engine/contracts/schema-route-groups.json`
- **BARU** `scripts/lib/validate-route-schema-contract.mjs`
- **BARU** `scripts/test/route-schema-contract.test.mjs`
- Ubah `scripts/validate-schema.mjs`
- Ubah `package.json`

### Input

- Generated schema di `5-experience-engine/json-ld/pages/*.schema-output.json`.
- Schema yang tetap dirakit oleh web harus diuji pada T04 terhadap HTML live/build output.

### Contoh kontrak

```json
{
  "schemaVersion": "jvto/schema-route-groups/v1",
  "groups": {
    "why-jvto/reviews-detail": {
      "requiredTypes": ["WebPage", "WebSite", "BreadcrumbList", "Product", "Review"],
      "optionalTypes": ["Organization", "Person", "Rating"],
      "singletonTypes": ["WebPage", "WebSite", "BreadcrumbList", "Product"],
      "forbiddenTypes": ["FAQPage"],
      "requiredIds": ["#webpage", "#website", "#breadcrumb", "#product"]
    },
    "entity": {
      "requiredTypes": ["CollectionPage", "WebSite", "Organization"],
      "optionalTypes": ["GovernmentOrganization", "Place", "PostalAddress", "DigitalDocument"],
      "singletonTypes": ["CollectionPage", "WebSite"],
      "forbiddenTypes": [],
      "requiredIds": ["#webpage", "/#website", "/#organization"]
    }
  }
}
```

Daftar tipe di atas adalah contoh struktur, bukan keputusan final. Isi final harus mengikuti node yang memang dirender dan disetujui untuk setiap group.

### Rules validator

- Required type harus ada.
- Forbidden type harus tidak ada.
- Singleton type dihitung berdasarkan node, bukan `Set` tipe.
- Semua object reference berbentuk hanya `{ "@id": ... }` harus resolve pada graph atau registry yang diizinkan.
- `Review`, `Rating`, `AggregateRating`, `FAQPage`, `Question`, dan `Answer` harus mempunyai source trace.
- Unknown type dilaporkan sebagai `REVIEW`, bukan otomatis `FAIL`, sampai kontrak diperbarui.

### Definition of Done

- Seluruh 21 URL group audit mempunyai contract.
- `npm run validate:schema` menjalankan validator group.
- Failure mencetak route, group, rule, expected, dan actual.

---

## T04 — Live Audit v2: Node-Level Drift

### Tujuan

Mengukur perubahan node schema secara benar. Audit saat ini menyimpan daftar tipe yang sudah di-deduplicate, sehingga tidak dapat membedakan satu `WebPage` dari dua `WebPage`.

### Repo dan file

Repo: `jvto-devteam/jvto-ekosistem` karena `package.json` sudah memiliki `audit:website-live`.

- Ubah `scripts/live-html-audit.mjs`
- **BARU** `scripts/lib/extract-jsonld-nodes.mjs`
- **BARU** `scripts/test/live-html-audit.test.mjs`

### Input

- Sitemap URL.
- Raw HTML setiap URL.
- Schema contract T03.
- Baseline audit sebelumnya.

### Output per URL

```json
{
  "url": "https://javavolcano-touroperator.com/entity",
  "group": "entity",
  "httpStatus": 200,
  "jsonLd": {
    "blockCount": 1,
    "nodeCount": 22,
    "typeCounts": {
      "CollectionPage": 1,
      "WebSite": 0,
      "Organization": 16
    },
    "duplicateIds": [],
    "danglingInternalIds": ["https://javavolcano-touroperator.com/#website"],
    "parseErrors": []
  },
  "contractStatus": "FAIL"
}
```

### Implementasi extraction

```js
export function collectTopLevelNodes(value) {
  if (Array.isArray(value)) return value.flatMap(collectTopLevelNodes);
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value["@graph"])) return value["@graph"];
  return value["@type"] ? [value] : [];
}

export function countTypes(nodes) {
  const counts = new Map();
  for (const node of nodes) {
    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]].filter(Boolean);
    for (const type of types) counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return Object.fromEntries([...counts].sort(([a], [b]) => a.localeCompare(b)));
}
```

### Coding requirements

- HTML entity normalization terpisah dari schema normalization.
- Urutan object key tidak dianggap drift.
- Array yang secara semantik unordered dinormalisasi sebelum hashing.
- Simpan `nodeFingerprint` per `@id` agar laporan menunjukkan node mana yang berubah.
- Jangan menyimpan hanya daftar tipe.

### Definition of Done

- Fixture dengan dua `WebPage` menghasilkan count `2`.
- Duplicate `@id` terdeteksi.
- Dangling internal reference terdeteksi.
- Perubahan global menghasilkan summary per group dan CSV baris per URL.

---

## T05A — FAQ Canonical Producer

### Tujuan

Memindahkan fakta tour FAQ dari `jvto-web/src/lib/tourFaqs.ts` ke sumber kanonis ekosistem dan memberikan setiap Q&A identitas/source trace.

### Repo dan file

Repo: `jvto-devteam/jvto-ekosistem`.

- **BARU** `1-knowledge-and-evidence-core/faqs/tour-spine.source.json`
- Ubah `scripts/render-web-content-sources.mjs` atau buat generator khusus.
- **BARU** `scripts/test/tour-spine-faq.test.mjs`

### Input yang saat ini masih hardcoded di web

- NIB.
- Nomor circular/safety regulation.
- Dokter/health-screening wording.
- Policy cancellation/closure.
- ISIC provider ID.
- Review summary.

### Contoh source

```json
{
  "schemaVersion": "jvto/source/tour-spine-faq/v1",
  "owner": "jvto-ekosistem",
  "items": [
    {
      "id": "tour-licensed-operator",
      "question": "Is JVTO a licensed Indonesian tour operator?",
      "answerTemplate": "Yes. JVTO operates as {{organization.legalName}} with NIB {{organization.nib}}.",
      "appliesWhen": "always",
      "evidenceRefs": ["organization-identity/organization.json#nib"],
      "status": "published"
    }
  ]
}
```

### Output

Satu payload terkompilasi yang sudah resolve placeholder dan dapat langsung dirender:

```json
{
  "routeFamily": "tour-detail",
  "items": [
    {
      "id": "tour-licensed-operator",
      "question": "Is JVTO a licensed Indonesian tour operator?",
      "answer": "Yes. JVTO operates as PT Java Volcano Rendezvous with NIB 1102230032918.",
      "sourceTrace": ["organization-identity/organization.json#nib"]
    }
  ]
}
```

### Definition of Done

- Generator test menguji placeholder yang tidak resolve sebagai failure.
- Tidak ada fallback rating/identity yang dibuat-buat ketika source invalid.
- Ekosistem menyediakan payload sebelum consumer web diubah.

---

## T05B — FAQ Consumer Migration

### Tujuan

Visible FAQ dan `FAQPage.mainEntity` menggunakan array Q&A yang sama. `narrativeClaims.pillar` tidak lagi diperlakukan sebagai pertanyaan FAQ.

### Repo dan file

Repo: `jvto-devteam/jvto-web`, dikerjakan setelah T05A merged.

- Ubah `src/lib/tourFaqs.ts` menjadi adapter sementara, kemudian hapus hardcoded facts.
- Ubah `src/lib/schemas/buildTourSchemas.ts`.
- Ubah `src/components/website/TourDetail.tsx`.
- Ubah dua route PDP:
  - `src/app/(website)/tours/from-bali/[slug]/page.tsx`
  - `src/app/(website)/tours/from-surabaya/[slug]/page.tsx`
- **BARU** test FAQ parity.

### Perubahan API yang disarankan

Sebelum:

```ts
buildTourFaqSchema({ tour, fullData, narrativeClaims, reviewProfiles });
```

Sesudah:

```ts
type ResolvedFaq = Readonly<{
  id: string;
  question: string;
  answer: string;
  sourceTrace: readonly string[];
}>;

buildTourFaqSchema({ route, visibleFaqs });
```

```ts
export function buildTourFaqSchema({
  route,
  visibleFaqs,
}: {
  route: string;
  visibleFaqs: readonly ResolvedFaq[];
}) {
  if (visibleFaqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://javavolcano-touroperator.com${route}#faq`,
    mainEntity: visibleFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
```

### Improvement khusus pada kode saat ini

`buildReviewSummaryAnswer()` saat ini menjumlahkan seluruh review count, tetapi menghitung rating sebagai rata-rata antar-platform tanpa bobot review count. Bila satu platform mempunyai 5 review dan platform lain 500 review, keduanya diberi bobot sama.

Perhitungan yang konsisten dengan total review:

```ts
const totalReviews = profiles.reduce((sum, p) => sum + p.reviewCount, 0);
const weightedRating = profiles.reduce(
  (sum, p) => sum + p.rating * p.reviewCount,
  0,
) / totalReviews;
```

Tambahkan guard untuk `reviewCount > 0`, rating dalam rentang yang disetujui, dan `totalReviews > 0`.

### Tests

- Jumlah visible FAQ sama dengan jumlah `Question`.
- Question dan answer sama setelah normalisasi whitespace.
- Tidak ada `NarrativeClaimLite.pillar` dalam `Question.name`.
- Tidak ada duplicate question ID.
- Ijen-only FAQ hanya muncul pada tour Ijen.
- Weighted rating fixture: rating 5.0 × 5 dan 4.0 × 500 tidak boleh menghasilkan 4.5.

### Definition of Done

- `rg "1102230032918|SE\\.35|Dr\\. Ahmad Irwandanu" src/lib/tourFaqs.ts` tidak menemukan hardcoded canonical facts.
- Semua 17 PDP lulus FAQ parity.
- HTML visible dan JSON-LD berasal dari object Q&A yang sama.

---

## T06 — Entity Graph Composition

### Tujuan

Halaman `/entity` tidak hanya mereferensikan `/#website` dan `/#organization`, tetapi memasukkan definisi node yang dimiliki builder bersama.

### Repo dan file

Repo: `jvto-devteam/jvto-web`.

- Ubah `src/app/(website)/entity/page.tsx`.
- Gunakan builder yang sudah ada di `src/lib/seo/jsonld/builders.ts`.
- Tambah test output `/entity`.

### Input

- Organization profile melalui loader yang sama dengan halaman lain.
- `buildOrganizationJsonLd()`.
- `buildWebSiteJsonLd()`.
- `buildBreadcrumbJsonLd()` bila contract T03 mewajibkannya.
- External entities dari `getEcosystemExternalEntities()`.

### Contoh komposisi

```ts
const organization = toOrganizationReferenceOnly(
  buildOrganizationJsonLd(org, SITE_URL),
);

const schema = {
  "@context": "https://schema.org",
  "@graph": composeUniqueGraph([
    organization,
    buildWebSiteJsonLd(SITE_URL),
    collectionPage,
    ...externalEntityNodes,
  ]),
};
```

`composeUniqueGraph()` harus menolak duplicate `@id`; jangan menggunakan array concat tanpa validasi.

### Definition of Done

- `/entity` mempunyai tepat satu `WebSite`.
- `/#organization` dan `/#website` resolve.
- Tidak ada duplicate `@id`.
- Existing external entity nodes tetap tampil.

---

## T07 — Breadcrumb Ownership dan URL Safety

### Bukti kode saat ini

`src/components/website/Breadcrumbs.tsx`:

- Default `emitSchema = true`.
- Base URL `https://jvto.example.com`.
- Schema item dibentuk sebagai `${baseUrl}/#${crumb.path}`.
- React list memakai `key={index}`.

### Tujuan

Memisahkan presentational component dari schema emission. Visible breadcrumb tidak seharusnya diam-diam menjadi pemilik JSON-LD.

### Repo dan file

Repo: `jvto-devteam/jvto-web`.

- Ubah `src/components/website/Breadcrumbs.tsx`.
- Gunakan `buildBreadcrumbJsonLd()` di route/schema composer.
- Audit seluruh caller `<Breadcrumbs>`.
- Ubah `scripts/validate-jsonld-schema.mjs` untuk memeriksa domain placeholder.

### Implementasi yang disarankan

```tsx
interface BreadcrumbsProps {
  crumbs: readonly Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path}>{/* visible UI only */}</li>
        ))}
      </ol>
    </nav>
  );
}
```

Schema hanya dibangun oleh page-level composer:

```ts
const breadcrumbSchema = buildBreadcrumbJsonLd(route, SITE_URL);
```

### Migration safety

1. Cari semua caller `Breadcrumbs`.
2. Identifikasi halaman yang belum memiliki BreadcrumbList dari `PageJsonLdCombined` atau composer lain.
3. Tambahkan schema owner di page-level untuk caller tersebut.
4. Baru hapus `emitSchema` dan `StructuredData` dari UI component.

### Definition of Done

- `rg "jvto\\.example\\.com" src` menghasilkan nol hasil.
- Setiap halaman yang membutuhkan breadcrumb mempunyai tepat satu `BreadcrumbList`.
- Seluruh `item` URL menggunakan origin production dan path normal, bukan `/#/path`.

---

## T08 — Generator Hardening

### Tujuan

Mengurangi risiko manifest terpotong, data invalid disamarkan, dan beberapa generator saling menimpa output.

### Repo dan file

Repo: `jvto-devteam/jvto-ekosistem`.

- Ubah `scripts/render-web-content-sources.mjs`.
- Ubah `scripts/generate-review-schema.mjs`.
- Ubah `scripts/generate-tourist-trip-schema.mjs`.
- **BARU** `scripts/lib/route-index-writer.mjs`.
- Tambah tests untuk manifest assembly.

### Masalah yang terverifikasi

1. `render-web-content-sources.mjs` menulis `route-output-index.json` sebelum generator tour/review selesai.
2. `generate-review-schema.mjs` kembali menulis manifest yang sama.
3. Bila route index tidak ditemukan, `updateRouteIndex()` memakai fallback `{ routes: [] }`; hasil berikutnya dapat berisi hanya route review.
4. Invalid star rating diperingatkan lalu diarahkan ke fallback rating `5` oleh builder path.
5. `updatePdpReviews()` menangkap seluruh error saat membaca directory dan mengembalikan hasil kosong.

### Perbaikan

#### Satu writer manifest

Setiap generator mengembalikan entries, tetapi tidak menulis manifest:

```js
const webEntries = await renderWebContentSources();
const tourEntries = await generateTourSchemaOutputs();
const reviewEntries = await generateReviewSchemaOutputs();

await writeRouteIndexAtomic(
  mergeRouteEntries(webEntries, tourEntries, reviewEntries),
);
```

#### Atomic write

```js
export async function writeJsonAtomic(target, value) {
  const temp = `${target}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temp, target);
}
```

#### Invalid rating

Jangan mengubah nilai invalid menjadi `5`.

```js
if (!isValidStar(review.star)) {
  throw new Error(`Invalid star rating for review id=${review.id}`);
}
```

Jika business rule mengizinkan review tanpa rating, output harus menghilangkan `reviewRating`; bukan membuat nilai baru.

#### Narrow error handling

```js
try {
  files = await readdir(dir);
} catch (error) {
  if (error?.code === "ENOENT") return emptyResult;
  throw error;
}
```

### Tests

- Dua generator menghasilkan route berbeda tanpa saling menghapus.
- Duplicate route dengan payload berbeda menyebabkan failure.
- Missing base manifest tidak membuat manifest review-only.
- Malformed JSON gagal keras.
- Invalid rating tidak menghasilkan rating 5.
- Simulated write failure meninggalkan manifest lama tetap valid.

### Definition of Done

- Hanya satu function menulis `route-output-index.json`.
- Semua generator dapat diuji sebagai pure output producer.
- Render dua kali menghasilkan content-identical output selain timestamp.

---

## T09 — Cross-Repo CI Gate

### Tujuan

Menjadikan kontrak sebagai gate merge/deployment, bukan laporan manual setelah drift sudah live.

### Repo `jvto-ekosistem`

Tambahkan script agregat:

```json
{
  "scripts": {
    "check:foundation": "npm run render:web-content && npm run test:schema && npm run test:review-schema && npm run validate:schema"
  }
}
```

### Repo `jvto-web`

Tambahkan script agregat:

```json
{
  "scripts": {
    "check:foundation": "npm run lint && npm run validate && npm run validate:jsonld-schema && npm run validate:public-routes && npm run build"
  }
}
```

### Cross-repo workflow

Workflow web harus checkout ekosistem pada SHA yang eksplisit, bukan mengambil `main` tanpa pencatatan. Pilihan implementasi yang direkomendasikan:

- Input workflow `ecosystem_sha`.
- Checkout kedua repo.
- Set `JVTO_EKOSYSTEM_CONTENT_ROOT` ke checkout ekosistem.
- Render/test ekosistem.
- Build/test web terhadap output tersebut.
- Simpan pasangan `web_sha` + `ecosystem_sha` sebagai artifact build.

### Output CI

```json
{
  "webSha": "492fab115872a1151deadb65689116d690cdefdf",
  "ecosystemSha": "3f4fc35839d54afd12ddb1f064a32df59e4e824e",
  "routeContract": "PASS",
  "schemaContract": "PASS",
  "build": "PASS"
}
```

### Definition of Done

- PR tidak dinyatakan siap bila salah satu contract gagal.
- Deployment mencatat pasangan SHA.
- Post-deploy smoke test membandingkan SHA deployment dengan pasangan yang diuji.

---

## 4. Perbaikan Kode Prioritas Tinggi

| Priority | Kode saat ini | Improvement | Repo |
|---:|---|---|---|
| P0 | Audit membandingkan sitemap dengan artifact index tanpa contract | Tambah public route contract dan classification | `jvto-web` |
| P0 | JSON-LD type disimpan sebagai set | Simpan count, `@id`, fingerprint, dan dangling refs | `jvto-ekosistem` |
| P0 | Invalid review rating dapat fallback ke 5 | Fail validation atau omit rating | `jvto-ekosistem` |
| P0 | Beberapa generator menulis route index | Jadikan satu writer setelah seluruh generator selesai | `jvto-ekosistem` |
| P1 | FAQ schema menggabungkan visible FAQ + narrative claims + DB FAQ | Schema hanya menerima resolved visible FAQ | Kedua repo |
| P1 | Review average tidak dibobot review count | Gunakan weighted average atau tampilkan per-platform saja | `jvto-web` |
| P1 | `/entity` mereferensikan node global tanpa definisi setempat | Compose shared Organization/WebSite nodes | `jvto-web` |
| P1 | Breadcrumb UI mengemit schema default dengan placeholder domain | UI-only component; schema dimiliki page composer | `jvto-web` |
| P1 | Loader menangkap seluruh error dan mengembalikan `null` | Runtime validation + narrow catch + explicit failure mode | `jvto-web` |
| P2 | Destination sitemap memakai `lastModified: t` | Gunakan tanggal source sebenarnya; jangan berubah setiap request | `jvto-web` |

## 5. Improvement untuk `website.ts`

`jvto-web/src/lib/ecosystemContent/website.ts` adalah boundary data lintas-repo. Saat ini boundary tersebut banyak memakai cast TypeScript dan catch-all.

### Gunakan runtime validation

`zod` sudah menjadi dependency `jvto-web`, sehingga payload remote/local dapat divalidasi sebelum digunakan.

```ts
const RouteIndexItemSchema = z.object({
  route: z.string().startsWith("/"),
  domain: z.string().optional(),
  slug: z.string().optional(),
  websiteOutput: z.string().optional(),
  schemaOutput: z.string().optional(),
});

const RouteIndexSchema = z.object({
  generated_at: z.string().datetime().optional(),
  routes: z.array(RouteIndexItemSchema).default([]),
});
```

### Jangan sembunyikan malformed data

```ts
async function readLocalJson<T>(relativePath: string, parse: (v: unknown) => T) {
  try {
    const raw = await readFile(resolveSafePath(relativePath), "utf8");
    return parse(JSON.parse(raw));
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return null;
    throw error;
  }
}
```

### Validasi configuration

```ts
const revalidateSeconds = z.coerce
  .number()
  .int()
  .nonnegative()
  .parse(process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? 300);
```

### Failure mode sitemap

Loader dynamic yang gagal tidak boleh diam-diam mengembalikan `[]` lalu membuat sitemap kehilangan ratusan URL. Pilih satu kontrak eksplisit:

- gunakan bundled last-known-good snapshot; atau
- gagalkan pembuatan sitemap dan biarkan cache sitemap valid sebelumnya tetap digunakan.

Jangan membentuk sitemap baru dari dataset kosong yang muncul karena fetch failure.

## 6. Aturan Coding untuk Semua Task

1. Pure function untuk transformasi; I/O hanya di orchestration layer.
2. Runtime validation pada setiap boundary file/network.
3. Generated artifact tidak boleh diedit manual.
4. Satu file output hanya mempunyai satu writer.
5. Gunakan atomic write untuk manifest.
6. Jangan swallow error selain kondisi yang memang didokumentasikan, misalnya `ENOENT` optional.
7. Setiap exception berada di contract data, bukan conditional tersebar.
8. Setiap test mempunyai fixture minimum dan failure message berisi route.
9. Jangan menggunakan current time sebagai `lastModified` bila sumber tidak berubah.
10. Jangan fallback ke fakta bisnis buatan ketika input invalid.
11. Schema builder menerima data yang sudah resolved; jangan mengambil data sendiri.
12. PR producer harus merged dan terverifikasi sebelum PR consumer dinyatakan siap.

## 7. PR Sequence

| PR | Repo | Isi | Merge gate |
|---:|---|---|---|
| PR-1 | `jvto-web` | T01 + T02, no output behavior change | Unit test contract/reconciliation hijau |
| PR-2 | `jvto-ekosistem` | T03 + T04 | Schema contract dan audit fixtures hijau |
| PR-3 | `jvto-ekosistem` | T05A | FAQ payload generated dan validated |
| PR-4 | `jvto-web` | T05B | PR-3 merged; 17 PDP parity hijau |
| PR-5 | `jvto-web` | T06 + T07 | `/entity` dan breadcrumb contract hijau |
| PR-6 | `jvto-ekosistem` | T08 | Single-writer dan atomic-write tests hijau |
| PR-7 | Kedua repo, producer dulu | T09 | Cross-repo SHA pair terbukti di build artifact |

Jangan gabungkan seluruh task ke satu PR. Batas di atas memisahkan foundation, producer, consumer, dan hardening sehingga rollback dan review tetap terukur.

## 8. Stopping Condition Program Fondasi

Fondasi dinyatakan selesai hanya bila:

- 100% URL publik cocok tepat satu route contract.
- 100% perbedaan sitemap/output index mempunyai classification.
- Seluruh URL group mempunyai schema contract.
- Live audit menghitung node dan `@id`, bukan hanya unique type.
- Visible FAQ dan FAQPage berasal dari array yang sama.
- Tidak ada invalid rating yang diganti menjadi nilai buatan.
- `/entity` tidak mempunyai dangling global reference.
- Tidak ada `jvto.example.com` dalam source/build output.
- Setiap build/deployment mencatat `web_sha` dan `ecosystem_sha`.

