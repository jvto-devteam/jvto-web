/**
 * Stale Facts Regression Tests
 * Run: npm run test:stale
 *
 * Setiap angka di sini diverifikasi dari jvto-web + jvto-ekosistem pada 2026-08-28,
 * dan dibaca ulang dari sumber hidup saat test berjalan — bukan dibekukan di sini.
 * Yang dibekukan hanyalah jumlah yang memang harus stabil (26 claims, 11 terms, 16
 * entities); begitu berubah secara sah, ubah test-nya di commit yang sama.
 *
 * Runner: `node --test`. Bukan jest — jest/ts-jest tidak terinstal dan penambahan
 * dependency butuh persetujuan tertulis (.claude/rules/GLOBAL-CONSTRAINTS.md).
 * Node >= 23.6 melakukan type-stripping TypeScript secara native.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const ekosistem = path.resolve(
  process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ?? path.join(repoRoot, '..', 'jvto-ekosistem'),
);
const CORE = path.join(ekosistem, '1-knowledge-and-evidence-core');

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', '.git', 'out', 'generated']);

function walkSync(dir: string): string[] {
  let results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) results = results.concat(walkSync(path.join(dir, entry.name)));
    } else {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

const rel = (p: string) => path.relative(repoRoot, p);

/**
 * Buang komentar sebelum mencocokkan. Tanpa ini checker menyalak pada catatan yang
 * justru mendokumentasikan penghapusan nilai basi (TourDetail.tsx: "carried a stale
 * blended 4.91 / 203 and has been deleted") dan pada blok JSX yang sudah di-comment-out.
 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const codeFiles = walkSync(srcDir).filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));
const readCode = (file: string) => stripComments(fs.readFileSync(file, 'utf8'));

const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const hasEkosistem = fs.existsSync(CORE);
const skipWithoutEkosistem = (t: { skip: (m: string) => void }) => {
  t.skip(`jvto-ekosistem checkout tidak ditemukan di ${ekosistem}`);
};

// ── jvto-web ────────────────────────────────────────────────────────────────

test('No emitted aggregateRating with ratingValue 0', () => {
  // Dibatasi ke layer emisi JSON-LD. Di luar itu `{ ratingValue: 0 }` adalah default
  // normalizer yang sah (ecosystemContent/tourPackageDetail.ts). Yang dilarang adalah
  // mengirimkan node-nya — keputusan 2026-08-26: rating per-tour dihilangkan bila kosong.
  const offenders = [path.join(srcDir, 'lib/schemas'), path.join(srcDir, 'lib/seo')]
    .filter((d) => fs.existsSync(d))
    .flatMap(walkSync)
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .filter((file) => {
      const c = readCode(file);
      return c.includes('aggregateRating') && /ratingValue\s*:\s*0(?![.\d])/.test(c);
    });

  assert.deepEqual(offenders.map(rel), [], 'aggregateRating: 0 dilarang — hilangkan node-nya');
});

test('No hardcoded stale review figures', () => {
  // Live 2026-08-28: 221 review; Google 4.9/156; Trustpilot 4.8/51; TripAdvisor 4.95/21.
  // Angka lama yang pernah beredar: 4.9/112, 4.91/203, 152, 149, 138, Trustpilot 44.
  const stale = [
    /["']?4\.91?["']?\s*[,/]\s*["']?(112|152|203)["']?/,
    /ratingValue\s*:\s*["']?4\.91?["']?/,
    /reviewCount\s*:\s*["']?(112|152|203|149|138|44)["']?/,
    /Rated by (112|152|203)\b/,
  ];
  const offenders = codeFiles.filter((f) => stale.some((p) => p.test(readCode(f))));

  assert.deepEqual(
    offenders.map(rel),
    [],
    'Angka review dibaca dari ekosistem review-platforms.json, bukan di-hardcode',
  );
});

test('Homepage title spells out the company name', () => {
  const homeFile = path.join(srcDir, 'app/(website)/page.tsx');
  assert.ok(fs.existsSync(homeFile), `homepage tidak ditemukan di ${rel(homeFile)}`);

  const content = readCode(homeFile);
  assert.ok(content.includes('Java Volcano Tour Operator'), 'title harus mengeja nama penuh');
  assert.ok(!/\|\s*JVTO["'\s]/.test(content), 'title tidak boleh memakai singkatan "| JVTO"');
});

test('No founding-date field set to 2016-01-01', () => {
  // Keputusan 2026-08-03: foundingDate = 2015 (era brand/guesthouse).
  const assignment = /founding[_-]?date["']?\s*[:=]\s*["']2016-01-01["']/i;
  const offenders = walkSync(srcDir)
    .filter((f) => /\.(ts|tsx|json)$/.test(f))
    .filter((f) => assignment.test(readCode(f)));

  assert.deepEqual(offenders.map(rel), [], 'foundingDate adalah 2015, bukan 2016');
});

test('entityGraph exposes all 11 DEFINED_TERMS', () => {
  const entityGraph = path.join(srcDir, 'lib/schemas/entityGraph.ts');
  assert.ok(fs.existsSync(entityGraph), `tidak ada ${rel(entityGraph)}`);

  const content = fs.readFileSync(entityGraph, 'utf8');
  const expected = ['NIB', 'TDUP', 'HPWKI', 'KTA', 'POLPAR', 'BBKSDA', 'SE1658',
    'ISIC', 'INDECON', 'JVTO_TRAVEL_CREDIT', 'JVTO_FOC_SCHEME'];
  const missing = expected.filter((k) => !new RegExp(`\\b${k}:\\s*\``).test(content));

  assert.deepEqual(missing, [], 'DEFINED_TERMS harus memuat 11 kunci');
});

// ── jvto-ekosistem (sumber kebenaran) ───────────────────────────────────────

test('narrative claims: 26 (C1-C9 + POL-BPC-* + POL-IE-*)', (t) => {
  if (!hasEkosistem) return skipWithoutEkosistem(t);

  const ids: string[] = (
    readJson(path.join(CORE, 'narrative-claims/narrative-claims.json')).claims ?? []
  ).map((c: { id: string }) => c.id);

  assert.equal(ids.length, 26, `harusnya 26 claim, dapat ${ids.length}`);
  assert.ok(ids.includes('C1') && ids.includes('C9'), 'C1-C9 harus ada');
  assert.ok(
    ids.some((i) => i.startsWith('POL-BPC-')) && ids.some((i) => i.startsWith('POL-IE-')),
    'POL-BPC-* dan POL-IE-* harus ada',
  );
});

test('external entities: 16', (t) => {
  if (!hasEkosistem) return skipWithoutEkosistem(t);
  const recs = readJson(path.join(CORE, 'organization-identity/external-entities.json')).records;
  assert.equal(recs.length, 16, `harusnya 16 entity, dapat ${recs.length}`);
});

test('crew: 11 published, 3 unpublished never rendered', (t) => {
  if (!hasEkosistem) return skipWithoutEkosistem(t);
  const { crew } = readJson(path.join(CORE, 'people-and-crew/people.json'));

  assert.equal(crew.roster.length, 11, 'roster published = 11');
  assert.equal(crew.total, crew.roster.length, 'crew.total harus cocok dengan panjang roster');
  assert.equal(crew.guides + crew.drivers, crew.total, 'guides + drivers harus = total');
  assert.equal(crew.unpublished.length, 3, 'unpublished (KTA pending) = 3');

  // Crew diidentifikasi lewat `code`, bukan `id`.
  const published = new Set(crew.roster.map((m: { code: string }) => m.code));
  const leaked = crew.unpublished
    .filter((m: { code: string }) => published.has(m.code))
    .map((m: { code: string }) => m.code);
  assert.deepEqual(leaked, [], 'crew unpublished tidak boleh muncul di roster');
});

test('organization asserts foundingDate 2015 and no PT incorporation year', (t) => {
  if (!hasEkosistem) return skipWithoutEkosistem(t);
  const org = readJson(path.join(CORE, 'organization-identity/organization.json'));

  assert.equal(org.foundingDate, '2015', 'foundingDate = 2015 (era brand/guesthouse)');
  assert.ok(
    !JSON.stringify(org).includes('2016'),
    // DEC-002 (trust-claims.json C8) memisahkan tiga tahun: marketing_founding_year
    // 2015, legal_incorporation_year 2016, tdup_issued_year 2023. organization.json
    // hanya memegang yang pertama — tahun inkorporasi tinggal di trust-claims.json,
    // bukan di sini. Assert ini menjaga pemisahan itu, bukan melarang angka 2016.
    'organization.json hanya memegang foundingDate 2015; legal_incorporation_year ada di trust-claims.json DEC-002',
  );
});

test('public rating is Google Maps only and non-zero', (t) => {
  if (!hasEkosistem) return skipWithoutEkosistem(t);
  const { profiles } = readJson(
    path.join(CORE, 'credentials-and-public-evidence/review-platforms.json'),
  );
  const google = profiles.find((p: { platform: string }) => p.platform === 'Google Maps');

  assert.ok(google, 'profil Google Maps harus ada — sumber rating publik tunggal');
  assert.ok(google.ratingValue ?? google.rating, 'rating Google tidak boleh 0/null');
  assert.ok((google.reviewCount ?? 0) >= 1, 'reviewCount Google harus >= 1 (G4)');
});

test('recorded policy decisions are readable and not frozen in checkers', (t) => {
  if (!hasEkosistem) return skipWithoutEkosistem(t);
  const goals = readJson(path.join(ekosistem, 'state/goals.json'));

  assert.ok(Array.isArray(goals.decisions) && goals.decisions.length >= 9,
    'state/goals.json harus memuat keputusan tercatat');
  assert.equal(goals.policies.contentSignal, 'search=yes,ai-train=yes,use=reference');

  // Checker tidak boleh membekukan policy di source-nya sendiri — pola ini pernah
  // menghasilkan 11 kegagalan palsu selama 8 hari (keputusan 2026-08-18).
  const frozen = walkSync(path.join(repoRoot, 'scripts'))
    .filter((f) => /\.(mjs|js)$/.test(f))
    .filter((f) => /ai-train=no/.test(readCode(f))); // komentar yang mencatat pembekuan lama bukan temuan

  assert.deepEqual(frozen.map(rel), [], 'checker tidak boleh membekukan contentSignal');
});
