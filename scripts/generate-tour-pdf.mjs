#!/usr/bin/env node
/**
 * Generate a PDF of one published tour page from the live production site.
 *
 * Usage:
 *   npm run pdf:tour                                                        (default slug)
 *   npm run pdf:tour -- tours/from-bali/ijen-bromo-madakaripura-3d2n
 *   npm run pdf:tour -- tours/from-surabaya/bromo-1d1n
 *
 * Output:
 *   pdfs/<slug-with-double-underscore>-<YYYY-MM-DD>.pdf
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const DEFAULT_SLUG = "tours/from-bali/ijen-bromo-madakaripura-3d2n";
const BASE_URL = "https://javavolcano-touroperator.com";

const slug = (process.argv[2] || DEFAULT_SLUG).replace(/^\/+|\/+$/g, "");
const url = `${BASE_URL}/${slug}`;
const outDir = path.resolve("pdfs");
const stamp = new Date().toISOString().slice(0, 10);
const outFile = `${slug.replaceAll("/", "__")}-${stamp}.pdf`;
const outPath = path.join(outDir, outFile);

await mkdir(outDir, { recursive: true });

console.log(`→ Rendering ${url}`);
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 1800 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 JVTO-PDF-Exporter/1.0",
  });
  const page = await ctx.newPage();

  const response = await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 90_000,
  });
  if (!response || !response.ok()) {
    throw new Error(
      `Bad response from ${url}: ${response ? response.status() : "no response"}`,
    );
  }

  // Force lazy images to load by scrolling through the page.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = 600;
      const tick = () => {
        window.scrollTo(0, y);
        y += step;
        if (y < document.body.scrollHeight) {
          setTimeout(tick, 80);
        } else {
          setTimeout(resolve, 600);
        }
      };
      tick();
    });
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Switch to print media so @media print kicks in (hides nav/footer/sticky, expands accordions, etc).
  await page.emulateMedia({ media: "print" });

  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", right: "12mm", bottom: "18mm", left: "12mm" },
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:8pt;width:100%;text-align:center;color:#888;font-family:Helvetica,Arial,sans-serif;">Java Volcano Tour Operator — ${slug}</div>`,
    footerTemplate: `<div style="font-size:8pt;width:100%;text-align:center;color:#888;font-family:Helvetica,Arial,sans-serif;">Page <span class="pageNumber"></span> of <span class="totalPages"></span> · javavolcano-touroperator.com</div>`,
  });

  console.log(`✓ PDF saved: ${outPath}`);
} finally {
  await browser.close();
}
