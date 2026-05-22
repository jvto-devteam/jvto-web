# JVTO UX Audit — Modul 9 Design Spec

**Goal:** Tambahkan Modul 9 (`ux`) ke skill `jvto-audit` yang mengaudit UI/UX quality JVTO website secara per-halaman: design consistency, CTA & conversion effectiveness, dan visual hierarchy — lalu propose fix dengan konfirmasi sebelum eksekusi.

**Architecture:** Satu modul baru (`## Modul 9 — UX Audit`) ditambahkan ke `~/.claude/skills/jvto-audit/SKILL.md`. Mengikuti pola modul yang sudah ada (script + pass criteria + format output) tapi menambahkan satu workflow baru: confirmation loop sebelum fix. Modul ini spesifik untuk JVTO — mengacu pada JVTO Design System tokens dan cluster-specific CTA requirements.

**Scope:** Modul dijalankan per-halaman (bukan full 52-page sweep). Sampling default: 1 halaman per kelompok. Tools: Playwright `browser_evaluate` (DOM inspection) + `browser_take_screenshot` (visual confirmation) + `browser_resize` (mobile viewport).

---

## 1. Cara Penggunaan

```
/jvto-audit ux                            → sample 1 halaman per kelompok (6 halaman)
/jvto-audit ux /tours/from-surabaya/slug  → audit satu halaman spesifik
/jvto-audit ux homepage                   → hanya homepage
/jvto-audit ux tour                       → sample tour detail saja
```

Modul ditambahkan ke daftar modul tersedia:
```
Modul tersedia: seo schema performance wcag mobile content component images ux
```

---

## 2. Tiga Sub-modul

### 9A — Design Consistency

**Tujuan:** Verifikasi bahwa token desain JVTO (tipografi, warna, spacing, border-radius) diterapkan konsisten antar elemen.

**JVTO Design Tokens (canonical):**
- Warna: `jvto-green` (#B2F35F), `jvto-navy` (#0F172A / slate-900), `jvto-orange` (#FB923C), `jvto-dark` (#191919), `jvto-off` (#F8F8F5)
- Font: system-sans, heading `font-black` (900) atau `font-bold` (700)
- Border radius card: `rounded-[24px]` atau `rounded-xl` — harus konsisten satu varian
- Shadows: `shadow-sm` untuk card, `shadow-lg` untuk modal/popup

**Script DOM:**
```javascript
() => {
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const h3 = document.querySelector('h3');
  const bodySize = parseFloat(getComputedStyle(document.body).fontSize);
  const cards = Array.from(document.querySelectorAll('[class*="card"],[class*="Card"]')).slice(0, 5);
  const cardRadii = [...new Set(cards.map(c => getComputedStyle(c).borderRadius))];
  const ctaBtns = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
  const ctaBgColors = [...new Set(ctaBtns.map(b => getComputedStyle(b).backgroundColor))];
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const bodyFont = getComputedStyle(document.body).fontFamily.slice(0, 50);
  return {
    typography: {
      h1Size: h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0,
      h2Size: h2 ? parseFloat(getComputedStyle(h2).fontSize) : 0,
      h3Size: h3 ? parseFloat(getComputedStyle(h3).fontSize) : 0,
      bodySize,
      h1Ratio: h1 ? (parseFloat(getComputedStyle(h1).fontSize) / bodySize).toFixed(1) : 0,
    },
    cards: { radiiVariants: cardRadii, count: cards.length },
    cta: { bgColorVariants: ctaBgColors, count: ctaBtns.length },
    body: { bgColor: bodyBg, font: bodyFont }
  };
}
```

**Pass criteria:**

| Check | ✅ Pass | ⚠️ Warning | ❌ Fail |
|---|---|---|---|
| H1/body size ratio | ≥ 2.0× | 1.5–2.0× | < 1.5× |
| Card border-radius | 1 varian | — | > 1 varian |
| CTA background color | 1 warna unik | — | > 1 warna unik |
| Body font | contains "sans" atau "Inter" | — | Unexpected font |

---

### 9B — CTA & Conversion

**Tujuan:** Verifikasi bahwa setiap halaman punya call-to-action yang jelas, WhatsApp CTA terlihat above fold (mobile), dan trust signals tersedia di halaman komersial.

**Script DOM:**
```javascript
() => {
  const waLinks = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
  const firstWa = waLinks[0];
  const waRect = firstWa?.getBoundingClientRect();
  const text = document.body.innerText;
  const priceEl = document.querySelector('[class*="price"],[class*="Price"]');
  const priceRect = priceEl?.getBoundingClientRect();
  return {
    wa: {
      count: waLinks.length,
      present: !!firstWa,
      aboveFold: waRect ? waRect.top < window.innerHeight : false,
      text: firstWa?.textContent.trim().slice(0, 50) || null,
      positions: waLinks.map(l => Math.round(l.getBoundingClientRect().top + window.scrollY))
    },
    trustSignals: {
      trustpilot: /4\.8|trustpilot/i.test(text),
      touristPolice: /tourist police|polpar/i.test(text),
      reviewCount51: /51/i.test(text),
      nib: /NIB|1102230032918/i.test(text)
    },
    price: {
      present: !!priceEl,
      aboveFold: priceRect ? priceRect.top < window.innerHeight * 2 : false
    }
  };
}
```

**Pass criteria per cluster:**

| Cluster | WA Present | WA Above Fold | Trust Signal | Price |
|---|---|---|---|---|
| Homepage | ✅ required | ✅ required | ≥2 (Trustpilot + Police) | — |
| Tour detail | ✅ required (≥2) | ✅ required | ≥1 rating | ✅ visible |
| Tour hub | ✅ required | ⚠️ preferred | ≥1 | — |
| Destination | ✅ required | ⚠️ preferred | — | — |
| Why JVTO | ⚠️ preferred | — | ≥1 | — |
| Travel Guide | ⚠️ preferred | — | — | — |
| Verify JVTO | — | — | NIB/POLPAR ✅ | — |
| Policy | — | — | — | — |

**Mobile check (375px viewport):**
```javascript
// Jalankan setelah browser_resize(375, 812)
() => {
  const wa = document.querySelector('a[href*="wa.me"]');
  const rect = wa?.getBoundingClientRect();
  const isFullWidth = rect ? rect.width >= window.innerWidth * 0.8 : false;
  return {
    waAboveFold: rect ? rect.top < window.innerHeight : false,
    waFullWidth: isFullWidth,
    waWidth: rect ? Math.round(rect.width) : 0,
    viewportWidth: window.innerWidth
  };
}
```

---

### 9C — Visual Hierarchy

**Tujuan:** Verifikasi bahwa heading scale descending (H1 > H2 > H3), konten terpenting ada di above fold, dan density halaman tidak terlalu tinggi.

**Script DOM:**
```javascript
() => {
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const h3 = document.querySelector('h3');
  const sz = el => el ? parseFloat(getComputedStyle(el).fontSize) : 0;
  const h1s = sz(h1), h2s = sz(h2), h3s = sz(h3);
  const hierarchyOk = h1s > h2s && (h3s === 0 || h2s >= h3s);
  // Elements visible above fold
  const aboveFold = Array.from(document.querySelectorAll('h1,h2,p,[class*="badge"],[class*="hero"],[class*="trust"]'))
    .filter(el => el.getBoundingClientRect().top < window.innerHeight && el.textContent.trim().length > 0)
    .slice(0, 8)
    .map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 50) }));
  const sections = document.querySelectorAll('section,[class*="section"]').length;
  const hasHeroAboveFold = aboveFold.some(el => el.tag === 'H1');
  const hasCtaAboveFold = !!document.querySelector('a[href*="wa.me"],a[href*="/tours"]')
    && document.querySelector('a[href*="wa.me"],a[href*="/tours"]')?.getBoundingClientRect().top < window.innerHeight;
  return {
    sizes: { h1: h1s, h2: h2s, h3: h3s, body: sz(document.body) },
    hierarchyOk,
    aboveFold,
    hasHeroAboveFold,
    hasCtaAboveFold,
    sectionCount: sections
  };
}
```

**Pass criteria:**

| Check | ✅ Pass | ⚠️ Warning | ❌ Fail |
|---|---|---|---|
| H1 > H2 > H3 | Descending | H1 = H2 | H2 > H1 |
| H1 above fold | ✅ present | — | ❌ not visible |
| CTA above fold | ✅ (commercial pages) | — | ❌ missing |
| Section count | ≤ 10 | 11–15 | > 15 |

---

## 3. Halaman yang Disampling (default)

Jalankan 1 halaman per kelompok untuk efisiensi:

| Kelompok | Halaman Sample | Alasan |
|---|---|---|
| Homepage | `/` | Flagship, paling kritikal |
| Tour hub | `/tours/from-surabaya` | Listing dengan CTA terbanyak |
| Tour detail | `/tours/from-surabaya/ijen-bromo-madakaripura-3d2n` | Template semua tour |
| Destination | `/destinations/ijen-crater` | Destination paling penting |
| Why JVTO | `/why-jvto/the-jvto-difference` | Trust-building page |
| Verify JVTO | `/verify-jvto/legal` | Trust signal page |

---

## 4. Format Output

### Per halaman (di atas screenshot):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UX AUDIT — /tours/from-surabaya/ijen-bromo-3d2n
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9A CONSISTENCY    ⚠️  H1 ratio 1.8× (target ≥2.0) · card radii OK · CTA color OK
9B CTA            ❌  WA count 1 (target ≥2) · NOT above fold · price ✅ · police ✅
9C HIERARCHY      ✅  H1>H2>H3 ✅ · H1 above fold ✅ · sections 8 ✅

SCREENSHOT: [diambil di 375px mobile viewport]
```

### Summary setelah semua halaman:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UX AUDIT SUMMARY — 6 halaman — 2026-MM-DD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9A CONSISTENCY    ✅ 5/6  card radii inconsistency: /why-jvto/the-jvto-difference
9B CTA            ⚠️ 4/6  tour detail WA count 1 (need 2) · not above fold mobile
9C HIERARCHY      ✅ 6/6  semua pass

RECOMMENDATIONS:
  ❌ CRITICAL:  [list]
  ⚠️ HIGH:      [list]
  💡 MEDIUM:   [list]

Ada X fixes tersedia. Fix semua sekarang, atau pilih satu per satu?
[all] / [one-by-one] / [skip]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 5. Confirmation + Fix Workflow

Setelah laporan lengkap:

1. **Tampilkan ringkasan** semua issues dengan severity
2. **Tanya user:** "Fix semua sekarang, atau pilih satu per satu?"
3. Jika `all`: jalankan semua fix berurutan, commit per issue
4. Jika `one-by-one`: per issue, tampilkan detail + proposed code change → tanya konfirmasi → fix → next
5. Setiap fix: `Edit` file → `git add` + `git commit` atomik

**Fix categories (contoh per issue type):**

| Issue | File | Fix |
|---|---|---|
| WA CTA missing above fold | `TourDetail.tsx` | Tambah sticky WA button di top area |
| Card radius inconsistency | komponen spesifik | Unifikasi ke `rounded-[24px]` |
| H1 ratio < 2.0× | komponen atau globals.css | Naikkan font-size H1 |
| Trust signal missing | page.tsx | Tambah badge/trust block |
| WA text tidak action-oriented | komponen | Ubah copy: "Book via WhatsApp →" |

---

## 6. Integrasi ke SKILL.md

Penambahan di `~/.claude/skills/jvto-audit/SKILL.md`:

1. Tambah `ux` ke baris `Modul tersedia:`
2. Tambah `browser_take_screenshot` ke `allowed-tools:` (jika belum ada)
3. Tambah trigger `ux audit` dan `cek ux`
4. Tambah section `## Modul 9 — UX Audit` setelah Modul 8

---

## Self-Review

**Spec coverage:**
- ✅ JVTO-specific (bukan generic) → canonical tokens didokumentasikan
- ✅ 3 sub-modul: 9A consistency, 9B CTA/conversion, 9C hierarchy
- ✅ Screenshot + DOM inspection
- ✅ Confirmation loop sebelum fix
- ✅ Per-page scope dengan 6 sample default
- ✅ Cluster-specific CTA requirements (tour vs. verify vs. policy berbeda)
- ✅ Mobile viewport check (375px) di 9B
- ✅ Fix categories dengan file references konkret

**Placeholder scan:** Tidak ada TBD atau TODO.

**Consistency:** Token warna, pass criteria, dan cluster requirements konsisten di semua sub-modul.

**Scope check:** Cukup untuk satu skill modul. Tidak perlu dipecah lagi.
