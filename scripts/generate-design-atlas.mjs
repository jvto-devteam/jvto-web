/**
 * JVTO Design Atlas Generator
 * Usage: npm run dev (in another terminal), then node scripts/generate-design-atlas.mjs
 *
 * Captures full-page screenshots of all active routes at desktop (1440×900)
 * and mobile (375×812) viewports. Saves to docs/design_atlas/screenshots/.
 *
 * Screenshots are gitignored — regenerate any time with the same command.
 */

import { chromium } from 'playwright';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load .env.local for DATABASE_URL
config({ path: path.join(ROOT, '.env.local') });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const OUT_DESKTOP = path.join(ROOT, 'docs/design_atlas/screenshots/desktop');
const OUT_MOBILE  = path.join(ROOT, 'docs/design_atlas/screenshots/mobile');

// Static routes to always include (even if not in content_pages)
const STATIC_ROUTES = [
  '/',
  '/tours',
  '/tours/from-surabaya',
  '/tours/from-bali',
  '/destinations',
  '/why-jvto',
  '/why-jvto/our-story',
  '/why-jvto/our-team',
  '/why-jvto/reviews',
  '/verify-jvto',
  '/verify-jvto/legal',
  '/verify-jvto/police-safety',
  '/verify-jvto/press-recognition',
  '/verify-jvto/history-artifacts',
  '/travel-guide',
  '/travel-guide/booking-information',
  '/travel-guide/ijen-health-screening',
  '/contact',
  '/policy/booking-payment-cancellation',
];

/**
 * Convert a route like /tours/from-bali/bromo-ijen-3d2n to
 * a safe filename: tours-from-bali-bromo-ijen-3d2n.png
 */
function routeToFilename(route) {
  return (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')) + '.png';
}

async function getDbRoutes() {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠  DATABASE_URL not set — using static routes only');
    return [];
  }
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(
      `SELECT DISTINCT route FROM content_pages
       WHERE is_active = true AND lang = 'en'
       ORDER BY route`
    );
    return res.rows.map(r => r.route);
  } catch (err) {
    console.warn('⚠  DB query failed:', err.message, '— using static routes only');
    return [];
  } finally {
    await client.end();
  }
}

async function capture(page, url, outPath, label) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(1500); // let animations settle
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`  ✓ ${label}`);
  } catch (err) {
    console.warn(`  ✗ ${label}: ${err.message}`);
  }
}

async function main() {
  fs.mkdirSync(OUT_DESKTOP, { recursive: true });
  fs.mkdirSync(OUT_MOBILE,  { recursive: true });

  const dbRoutes = await getDbRoutes();
  const allRoutes = [...new Set([...STATIC_ROUTES, ...dbRoutes])].sort();

  console.log(`\n📸  Capturing ${allRoutes.length} routes…`);
  console.log(`    Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch();

  // Desktop
  console.log('── Desktop (1440×900) ──────────────────────');
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await desktop.newPage();
  for (const route of allRoutes) {
    const file = routeToFilename(route);
    await capture(dPage, BASE_URL + route, path.join(OUT_DESKTOP, file), route);
  }
  await desktop.close();

  // Mobile
  console.log('\n── Mobile (375×812) ────────────────────────');
  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mPage = await mobile.newPage();
  for (const route of allRoutes) {
    const file = routeToFilename(route);
    await capture(mPage, BASE_URL + route, path.join(OUT_MOBILE, file), route);
  }
  await mobile.close();

  await browser.close();

  // Write route manifest for atlas viewer
  const manifest = allRoutes.map(route => ({
    route,
    filename: routeToFilename(route),
    label: route === '/' ? 'Homepage' : route,
  }));
  fs.writeFileSync(
    path.join(ROOT, 'docs/design_atlas/manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n✅  Done — ${allRoutes.length} routes captured.`);
  console.log(`   Screenshots: docs/design_atlas/screenshots/`);
  console.log(`   Manifest:    docs/design_atlas/manifest.json`);
  console.log(`   Open atlas:  docs/design_atlas/index.html\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
