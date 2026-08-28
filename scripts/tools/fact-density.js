#!/usr/bin/env node
/**
 * Fact Density Calculator
 * Usage: node scripts/tools/fact-density.js [file-path] [--json]
 */

const fs = require('fs');
const path = require('path');

// Fact patterns
const FACT_PATTERNS = [
  /\d+(?:[,.]\d+)?\s*(?:km|m|min|hour|jam|hari|bulan|%|percent|rp|idr)\b/gi,
  /\b\d{4}-\d{2}-\d{2}\b/g,
  /\b(?:since|sejak)\s+[A-Z][a-z]+\s+\d{4}\b/gi,
  /\b[A-Z]{2,}[.\-/]?\d[\w./-]*\b/g, // Regulation / licence numbers
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\s+(?:Jawa|Timur|Bali|Indonesia)\b/g, // Place names
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?=\s*[,.])/g, // Attributed person names
];

// Fluff blacklist
const FLUFF_WORDS = [
  'menakjubkan', 'tak terlupakan', 'magis', 'surga tersembunyi',
  'pengalaman seumur hidup', 'terbaik', 'paling terpercaya', 'nomor satu',
  'pelayanan prima', 'kepuasan Anda prioritas kami', 'tim profesional',
  'harga bersaing',
];

function countFacts(text) {
  const matches = new Set();
  FACT_PATTERNS.forEach((pattern) => {
    const found = text.match(pattern) || [];
    found.forEach((m) => matches.add(m.trim()));
  });
  return matches.size;
}

function countSentences(text) {
  return text.split(/[.!?。]+/).filter((s) => s.trim().length > 10).length;
}

function detectFluff(text) {
  const found = [];
  const lines = text.split('\n');
  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    FLUFF_WORDS.forEach((word) => {
      if (lower.includes(word.toLowerCase())) {
        found.push({ word, line: idx + 1, text: line.trim() });
      }
    });
  });
  return found;
}

// Median terukur per tipe halaman atas 295 rute live, dari
// ../jvto-ekosistem/state/goals.json -> baseline.byPageType (diukur 2026-08-27 dengan
// scripts/audit-answer-structure.py). Dibaca dari file itu bila ada; angka di bawah
// hanya fallback saat checkout ekosistem tidak tersedia.
//
// Ambang = baseline - TOLERANCE. Aturannya "jangan turun di bawah baseline", bukan
// mengejar target aspiratif: target 1.0-1.2 dari arsip lama akan memvonis FAIL hampir
// seluruh situs, dan checker yang menyalak di 40% korpus akan dibungkam orang
// (keputusan 2026-08-26).
const TOLERANCE = 0.05;

const FALLBACK_BASELINE = {
  trust: 0.88,
  pdp: 0.59,
  'why-jvto': 0.54,
  destination: 0.48,
  blog: 0.43,
  homepage: 0.42,
  policy: 0.40,
  'travel-guide': 0.27,
  crew: 0.10,
};

// Rendah by design, bukan cacat: homepage sengaja tanpa answer-first block (keputusan
// 2026-08-27); halaman crew dibangun dari kutipan verbatim tamu.
const BY_DESIGN_LOW = new Set(['homepage', 'crew']);

function loadBaseline() {
  const root = process.env.JVTO_EKOSYSTEM_CONTENT_ROOT
    || path.resolve(__dirname, '..', '..', '..', 'jvto-ekosistem');
  try {
    const goals = JSON.parse(fs.readFileSync(path.join(root, 'state/goals.json'), 'utf8'));
    const byType = goals.baseline.byPageType;
    return Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.density]));
  } catch {
    return FALLBACK_BASELINE;
  }
}

const BASELINE = loadBaseline();

function getDensityTarget(pageType) {
  const base = BASELINE[pageType];
  if (base === undefined) return 0.4; // tipe tak dikenal: median terendah yang diukur
  return Math.max(0, parseFloat((base - TOLERANCE).toFixed(2)));
}

function detectPageType(filePath) {
  if (/our-team|\/crew/.test(filePath)) return 'crew';
  if (/package|\/tours\//.test(filePath)) return 'pdp';
  if (/verify|trust/.test(filePath)) return 'trust';
  if (/why-jvto/.test(filePath)) return 'why-jvto';
  if (/travel-guide/.test(filePath)) return 'travel-guide';
  if (/destination/.test(filePath)) return 'destination';
  if (/polic(y|ies)|legal/.test(filePath)) return 'policy';
  if (/\/blog/.test(filePath)) return 'blog';
  if (/\/home\//.test(filePath)) return 'homepage';
  return 'other';
}

function analyze(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const facts = countFacts(content);
  const sentences = countSentences(content);
  const density = sentences > 0 ? facts / sentences : 0;
  const fluff = detectFluff(content);
  const pageType = detectPageType(filePath);
  const target = getDensityTarget(pageType);
  const byDesignLow = BY_DESIGN_LOW.has(pageType);
  const meets = byDesignLow || density >= target;

  return {
    file: filePath,
    page_type: pageType,
    baseline_density: BASELINE[pageType] ?? null,
    total_sentences: sentences,
    verified_facts: facts,
    density: parseFloat(density.toFixed(2)),
    target_density: target,
    meets_density: meets,
    by_design_low: byDesignLow,
    fluff_found: fluff,
    passes_checklist: meets && fluff.length === 0,
  };
}

function main() {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const filePath = args.find((a) => !a.startsWith('--'));

  if (!filePath) {
    console.error('Usage: node scripts/tools/fact-density.js <file-path> [--json]');
    console.error('Example: node scripts/tools/fact-density.js src/content/guide.md');
    process.exit(1);
  }

  let output;
  try {
    output = analyze(filePath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  if (isJson) {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  console.log(`Fact Density Report: ${path.basename(filePath)}`);
  console.log(`   Page Type: ${output.page_type}` + (output.baseline_density !== null
    ? ` (live median ${output.baseline_density})` : ' (no measured baseline)'));
  console.log(`   Sentences: ${output.total_sentences}`);
  console.log(`   Verified Facts: ${output.verified_facts}`);
  console.log(
    `   Density: ${output.density} (floor: ${output.target_density}) ${output.meets_density ? 'OK' : 'FAIL'}`
      + (output.by_design_low ? ' — low by design, not a defect' : ''),
  );
  console.log(
    `   Fluff: ${output.fluff_found.length} issue(s) ${output.fluff_found.length === 0 ? 'OK' : 'WARN'}`,
  );
  output.fluff_found.forEach((f) => {
    console.log(`      - "${f.word}" at line ${f.line}: ${f.text.slice(0, 90)}`);
  });
  console.log(`   Overall: ${output.passes_checklist ? 'PASS' : 'FAIL'}`);
}

if (require.main === module) main();

module.exports = { countFacts, countSentences, detectFluff, getDensityTarget, analyze };
