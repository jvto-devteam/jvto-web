# LIVE FRONTEND IMPLEMENTATION TECHNICAL MAP

## Basis

- Repo: `jvto-web`
- Dibandingkan terhadap base commit workspace: `2379de7604d56f81969f3b60061a34a48109a81f`
- Scope: `src`, `scripts/deploy-preview.ps1`, `.gitignore`
- Total file berubah dalam scope ini: **87**
- Dokumen ini ditambah delta teknis terbaru per `2026-04-08` untuk perubahan yang menutup source reconciliation ke `DB mirror`

## Cara Baca

- `Status` mengikuti git diff: `A` added, `M` modified, `D` deleted, `R` renamed.
- `Hunk` menunjukkan lokasi perubahan terhadap base commit.
- `Old lines` = posisi di base commit. `New lines` = posisi di workspace sekarang.
- `Added snippets` dan `Removed snippets` adalah cuplikan teknis dari baris yang berubah, bukan narasi umum.

## Supplemental Update 2026-04-08

Bagian ini mencatat perubahan teknis terbaru yang belum masuk ke map awal.

Perubahan ini tidak semuanya mengubah UI secara langsung, tetapi mereka mengubah contract aktif antara frontend dan `DB mirror`.

## Source / DB Contract Closure

### prisma/schema.prisma

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `649-651`
- New lines: `649-666`
- Context: `about_me`
- Added snippets:
  - `ssot_id         String?  @db.Text`
  - `ssot_numeric_id Int?`
  - `role_label      String?  @db.Text`
  - `archetype       String?  @db.Text`
  - `archetype_tags  String[] @default([]) @db.Text`
  - `knows_about     Json?    @default("[]")`
  - `evidence_review_quotes Json? @default("[]")`
  - `forensic_evidence Json?  @default("[]")`
  - `social_links    Json?    @default("{}")`
  - `internal_contact Json?   @default("{}")`
  - `profile_snapshot Json?   @default("{}")`
  - `known_for       Json?    @default("[]")`
  - `operating_style Json?    @default("[]")`
  - `self_quote      String?  @db.Text`
  - `ssot_payload    Json?`

Fungsi perubahan:

- menambahkan storage layer resmi untuk enrichment `crew_registry` dari SSOT
- menghapus kebutuhan menyimpan crew richness hanya di fallback/frontend/local docs

### scripts/reconcile-final-matrix.js

- Status: `A`
- New file lines: `1-571`
- Key functions:
  - line `25`: `getConnectionString`
  - line `92`: `ensureCrewColumns`
  - line `138`: `reconcileAssets`
  - line `269`: `reconcileCrew`
  - line `433`: `reconcileDestinations`
  - line `535`: `auditStatus`
  - final block: `main().catch((error) => { ... })`

Added snippets:
  - `const SSOT_PATH = path.resolve(__dirname, "..", "JVTO_SSOT_v4_0_CLEAN.json");`
  - `async function ensureCrewColumns(client) {`
  - `async function reconcileAssets(client, ssot) {`
  - `async function reconcileCrew(client, ssot) {`
  - `async function reconcileDestinations(client, ssot) {`
  - `async function auditStatus(client, ssot) {`

Fungsi perubahan:

- mengeksekusi final reconciliation ke `DB mirror`
- menutup domain yang sebelumnya masih `PARTIAL` / `UNPROVEN`
- memberikan audit JSON sesudah write sehingga hasilnya bisa diverifikasi ulang

### src/generated/prisma/*

- Status: `M` pada file generated:
  - `src/generated/prisma/edge.js`
  - `src/generated/prisma/index-browser.js`
  - `src/generated/prisma/index.d.ts`
  - `src/generated/prisma/index.js`
  - `src/generated/prisma/package.json`
  - `src/generated/prisma/schema.prisma`
  - `src/generated/prisma/wasm.js`

Fungsi perubahan:

- ini adalah output `npx prisma generate` setelah schema `crew_members` diperluas
- file-file ini tidak diubah manual
- mereka harus dianggap bagian dari contract update, bukan feature surface baru

### FINAL_RECONCILIATION_MATRIX.md

- Status: `A`
- New file lines: `1-95`

Fungsi perubahan:

- merekam status akhir domain source ownership
- domain yang awalnya masih open sekarang ditandai closed bila sudah terbukti lewat direct DB audit

### FINAL_RECONCILIATION_AUDIT_REPORT.md

- Status: `A`
- New file lines: `1-169`

Fungsi perubahan:

- merekam command eksekusi final ke DB
- merekam hasil:
  - `assets_inventory 58/58`
  - `crew_registry 14/14`
  - `destinations 9/9`
  - `partner_network closed`
  - `press_coverage closed`
  - `package editorial doctrine proven in DB`

## Root / Tooling

### .gitignore

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `42`
- New lines: `43-50`
- Context: `next-env.d.ts`
- Added snippets:
  - `# logs`
  - `dev-server.log*`
  - `dev-server.err.log*`
  - `# generated files (auto-generated, should not be committed)`
  - `src/generated/`
  - `# exception: keep prisma generated types if needed`

### scripts/deploy-preview.ps1

- Status: `M`
- Total hunk: **4**

#### Hunk 1

- Old lines: `4`
- New lines: `5`
- Context: `$envFile = Join-Path $repoRoot ".env.local"`
- Added snippets:
  - `$projectFile = Join-Path $repoRoot ".vercel\\project.json"`

#### Hunk 2

- Old lines: `9`
- New lines: `11-14`
- Context: `if (!(Test-Path $envFile)) {`
- Added snippets:
  - `if (!(Test-Path $projectFile)) {`
  - `throw "Missing linked Vercel project config at $projectFile"`
  - `}`

#### Hunk 3

- Old lines: `21`
- New lines: `27`
- Context: `$allowedKeys = @(`
- Added snippets:
  - `"NEXT_PUBLIC_ENABLE_AUTH",`

#### Hunk 4

- Old lines: `68`
- New lines: `74-81`
- Context: `if ($vars.Count -eq 0) {`
- Added snippets:
  - `$project = Get-Content -Path $projectFile -Raw | ConvertFrom-Json`
  - `$scope = $project.orgId`
  - `if (-not $scope) {`
  - `throw "No orgId found in $projectFile"`
  - `}`
  - `$args = @("deploy", "--yes", "--scope", $scope)`
- Removed snippets:
  - `$args = @("deploy", "--yes", "--scope", "sams-projects-6638b46d")`

## Checkout / Payment

### src/app/(api)/api/booking/pay-balance/route.ts

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `33`
- New lines: `33`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `} catch {`
- Removed snippets:
  - `} catch (e) {`

#### Hunk 2

- Old lines: `56`
- New lines: `56`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `}`
- Removed snippets:
  - `}`

### src/app/(api)/api/checkout/bank-transfer/route.ts

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `50`
- New lines: `50`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `} catch {`
- Removed snippets:
  - `} catch (e) {`

#### Hunk 2

- Old lines: `68`
- New lines: `68`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `}`
- Removed snippets:
  - `}`

### src/app/(api)/api/checkout/route-main.ts

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `2`
- New lines: `3`
- Context: `import { prisma } from "@/lib/prisma";`
- Added snippets:
  - `import { calculateInitialPaymentAmount } from "@/lib/packages/paymentPolicy";`

#### Hunk 2

- Old lines: `125`
- New lines: `126`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `const depositAmount = calculateInitialPaymentAmount(date, grandTotal);`
- Removed snippets:
  - `const depositAmount = Math.ceil(grandTotal * 0.2); // 20% Deposit`

### src/app/(api)/api/checkout/route.ts

- Status: `M`
- Total hunk: **8**

#### Hunk 1

- Old lines: `1`
- New lines: `2-6`
- Context: `import { NextRequest, NextResponse } from "next/server";`
- Added snippets:
  - `import {`
  - `validateCheckoutPricingContract,`
  - `type CheckoutPricingAudit,`
  - `type CheckoutPricingSelection,`
  - `} from "@/lib/packages/checkoutPricingContract";`

#### Hunk 2

- Old lines: `5`
- New lines: `10`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `// 1. Terima payload dari frontend internal`
- Removed snippets:
  - `// 1. Terima Payload VALID dari Frontend`

#### Hunk 3

- Old lines: `6`
- New lines: `12-20`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `const {`
  - `pricing_audit: pricingAudit,`
  - `bookingSelection,`
  - `...legacyBody`
  - `}: {`
  - `pricing_audit?: CheckoutPricingAudit;`
  - `bookingSelection?: CheckoutPricingSelection;`
  - `[key: string]: unknown;`
  - `} = body;`

#### Hunk 4

- Old lines: `8`
- New lines: `22-71`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `if (!pricingAudit || !bookingSelection) {`
  - `return NextResponse.json(`
  - `{`
  - `message:`
  - `"Missing pricing audit or booking selection in checkout request",`
  - `},`
  - `{ status: 400 },`
  - `);`
  - `}`
  - `const contract = validateCheckoutPricingContract({`
  - `... 35 added lines omitted ...`
- Removed snippets:
  - `console.log("🔄 Proxying request to Legacy...");`

#### Hunk 5

- Old lines: `11-12`
- New lines: `74`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `const legacyUrl = \`${legacyUrlBase}/checkout\`;`
- Removed snippets:
  - `// Pastikan URL di env tidak diakhiri slash, atau sesuaikan penggabungannya`
  - `const legacyUrl = \`${process.env.NEXT_PUBLIC_LEGACY_URL}/checkout\`;`

#### Hunk 6

- Old lines: `20`
- New lines: `82`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `body: JSON.stringify(normalizedLegacyBody),`
- Removed snippets:
  - `body: JSON.stringify(body), // Kirim payload apa adanya (karena sudah disusun di frontend)`

#### Hunk 7

- Old lines: `29`
- New lines: `91`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `} catch {`
- Removed snippets:
  - `} catch (e) {`

#### Hunk 8

- Old lines: `48`
- New lines: `110`
- Context: `export async function POST(req: NextRequest) {`
- Added snippets:
  - `}`
- Removed snippets:
  - `}`

### src/app/(website)/checkout/page.tsx

- Status: `M`
- Total hunk: **37**

#### Hunk 1

- Old lines: `7`
- New lines: `8-23`
- Context: `import Image from "next/image";`
- Added snippets:
  - `import {`
  - `BALANCE_DEADLINE_RULE_COPY,`
  - `getDaysUntilTrip,`
  - `getInitialPaymentMode,`
  - `getPaymentLogicNarrative,`
  - `} from "@/lib/packages/paymentPolicy";`
  - `import {`
  - `buildCheckoutPricingAudit,`
  - `buildCheckoutPricingSnapshot,`
  - `type CheckoutAddOnLine,`
  - `... 6 added lines omitted ...`

#### Hunk 2

- Old lines: `17-61`
- New lines: `32`
- Context: `function formatCurrency(value: number) {`
- Removed snippets:
  - `function getPriceForPax(pax: number, tiers: any[]) {`
  - `if (!tiers || !tiers.length) return null;`
  - `const tier = tiers.find((t: any) => {`
  - `const minOk = pax >= t.paxMin;`
  - `const maxOk = t.paxMax === 0 ? true : pax <= t.paxMax;`
  - `return minOk && maxOk;`
  - `});`
  - `return tier ? tier.pricePerPerson : null;`
  - `}`
  - `function getDaysUntilTrip(dateStr: string): number {`
  - `... 29 removed lines omitted ...`

#### Hunk 3

- Old lines: `68`
- New lines: `39`
- Context: `interface ContactDetails {`
- Added snippets:
  - `interface AddOn extends CheckoutAddOnLine {`
- Removed snippets:
  - `interface AddOn {`

#### Hunk 4

- Old lines: `112-125`
- New lines: `82`
- Context: `function recalculateTotals(`
- Removed snippets:
  - `const newPricePerPerson = getPriceForPax(newPax, payload.priceTiers);`
  - `const newPackageTotal = newPricePerPerson ? newPricePerPerson * newPax : 0;`
  - `// 1. Hitung Diskon`
  - `let discountAmount = 0;`
  - `let discountLabel = "";`
  - `if (newPricePerPerson) {`
  - `const discount = calculateFOCDiscount(newPax, newPricePerPerson);`
  - `discountAmount = discount.amount;`
  - `discountLabel = discount.label;`
  - `}`
  - `... 1 removed lines omitted ...`

#### Hunk 5

- Old lines: `140-146`
- New lines: `97-102`
- Context: `function recalculateTotals(`
- Added snippets:
  - `const pricing = buildCheckoutPricingSnapshot({`
  - `pax: newPax,`
  - `date: payload.date,`
  - `priceTiers: payload.priceTiers,`
  - `addonLines: updatedAddons,`
  - `});`
- Removed snippets:
  - `// 3. Grand Total (dikurangi diskon, tidak boleh minus)`
  - `const newGrandTotal = Math.max(`
  - `0,`
  - `newPackageTotal + newAddonTotal - discountAmount,`
  - `);`
  - `const newDownPayment = calculateDownPayment(payload.date, newGrandTotal);`

#### Hunk 6

- Old lines: `151-153`
- New lines: `107-109`
- Context: `function recalculateTotals(`
- Added snippets:
  - `pricePerPerson: pricing.pricePerPerson,`
  - `packageTotal: pricing.totalPackage,`
  - `grandTotal: pricing.grandTotal,`
- Removed snippets:
  - `pricePerPerson: newPricePerPerson,`
  - `packageTotal: newPackageTotal,`
  - `grandTotal: newGrandTotal,`

#### Hunk 7

- Old lines: `155-157`
- New lines: `111-113`
- Context: `function recalculateTotals(`
- Added snippets:
  - `totalDiscount: pricing.totalDiscount,`
  - `discountLabel: pricing.discountLabel,`
  - `totalPackage: pricing.totalPackage,`
- Removed snippets:
  - `totalDiscount: discountAmount,`
  - `discountLabel: discountLabel,`
  - `totalPackage: newPackageTotal,`

#### Hunk 8

- Old lines: `159`
- New lines: `115`
- Context: `function recalculateTotals(`
- Added snippets:
  - `downPayment: pricing.downPayment,`
- Removed snippets:
  - `downPayment: newDownPayment,`

#### Hunk 9

- Old lines: `226`
- New lines: `183-188`
- Context: `const StickyOrderSummary = ({`
- Added snippets:
  - `const selectedTier = getMatchingPriceTier(payload.pax, payload.priceTiers);`
  - `const selectedTierLabel = selectedTier`
  - `? formatPriceTierRange(selectedTier)`
  - `: "Tier unavailable";`
  - `const startingPrice = getLowestTierPrice(payload.priceTiers);`

#### Hunk 10

- Old lines: `267`
- New lines: `229-243`
- Context: `const StickyOrderSummary = ({`
- Added snippets:
  - `<span className="text-slate-600">Active pax tier</span>`
  - `<span className="font-medium text-slate-900">`
  - `{selectedTierLabel}`
  - `</span>`
  - `</div>`
  - `<div className="flex justify-between">`
  - `<span className="text-slate-600">Selected pax rate</span>`
  - `<span className="font-medium text-slate-900">`
  - `{payload.pricePerPerson`
  - `? \`${formatCurrency(payload.pricePerPerson)} / person\``
  - `... 5 added lines omitted ...`
- Removed snippets:
  - `<span className="text-slate-600">Base Price</span>`

#### Hunk 11

- Old lines: `271`
- New lines: `248-253`
- Context: `const StickyOrderSummary = ({`
- Added snippets:
  - `{startingPrice ? (`
  - `<div className="flex justify-between text-xs text-slate-500">`
  - `<span>Public starting rate</span>`
  - `<span>{formatCurrency(startingPrice)} / person</span>`
  - `</div>`
  - `) : null}`

#### Hunk 12

- Old lines: `306`
- New lines: `289-293`
- Context: `const StickyOrderSummary = ({`
- Added snippets:
  - `<p className="mt-2 text-xs leading-5 text-slate-500">`
  - `Final route price is locked from the selected pax tier before`
  - `payment. Deposit or full-payment logic is then calculated from this`
  - `total.`
  - `</p>`

#### Hunk 13

- Old lines: `338`
- New lines: `326-330`
- Context: `const StepOneDetails = ({`
- Added snippets:
  - `const selectedTier = getMatchingPriceTier(payload.pax, payload.priceTiers);`
  - `const selectedTierLabel = selectedTier`
  - `? formatPriceTierRange(selectedTier)`
  - `: "Tier unavailable";`
  - `const startingPrice = getLowestTierPrice(payload.priceTiers);`

#### Hunk 14

- Old lines: `366`
- New lines: `358-363`
- Context: `const StepOneDetails = ({`
- Added snippets:
  - `const pricing = buildCheckoutPricingSnapshot({`
  - `pax: payload.pax,`
  - `date: newDate,`
  - `priceTiers: payload.priceTiers,`
  - `addonLines: payload.addon,`
  - `});`
- Removed snippets:
  - `const newDownPayment = calculateDownPayment(newDate, payload.grandTotal);`

#### Hunk 15

- Old lines: `370`
- New lines: `367`
- Context: `const StepOneDetails = ({`
- Added snippets:
  - `downPayment: pricing.downPayment,`
- Removed snippets:
  - `downPayment: newDownPayment,`

#### Hunk 16

- Old lines: `406`
- New lines: `403`
- Context: `const StepOneDetails = ({`
- Added snippets:
  - `const [, setIsVerifying] = useState(false);`
- Removed snippets:
  - `const [isVerifying, setIsVerifying] = useState(false);`

#### Hunk 17

- Old lines: `456`
- New lines: `453`
- Context: `const StepOneDetails = ({`
- Added snippets:
  - `} catch {`
- Removed snippets:
  - `} catch (error) {`

#### Hunk 18

- Old lines: `523`
- New lines: `521-544`
- Context: `const StepOneDetails = ({`
- Added snippets:
  - `<div className="mt-2 space-y-1 text-xs leading-5 text-slate-500">`
  - `<p>`
  - `Active tier:{" "}`
  - `<span className="font-bold text-slate-800">`
  - `{selectedTierLabel}`
  - `</span>`
  - `</p>`
  - `<p>`
  - `Current rate:{" "}`
  - `<span className="font-bold text-slate-800">`
  - `... 14 added lines omitted ...`

#### Hunk 19

- Old lines: `758`
- New lines: `778`
- Context: `const StepTwoPayment = ({`
- Removed snippets:
  - `router,`

#### Hunk 20

- Old lines: `762`
- New lines: `781`
- Context: `const StepTwoPayment = ({`
- Removed snippets:
  - `router: any;`

#### Hunk 21

- Old lines: `764`
- New lines: `784-788`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `const paymentLogicNarrative = getPaymentLogicNarrative(payload.date);`
  - `const selectedTier = getMatchingPriceTier(payload.pax, payload.priceTiers);`
  - `const selectedTierLabel = selectedTier`
  - `? formatPriceTierRange(selectedTier)`
  - `: "Tier unavailable";`

#### Hunk 22

- Old lines: `768-769`
- New lines: `791`
- Context: `const StepTwoPayment = ({`
- Removed snippets:
  - `let methodLabel = "Credit Card / Online Payment (Xendit)";`
  - `let methodDesc = "Your booking will be confirmed instantly after payment.";`

#### Hunk 23

- Old lines: `773-775`
- New lines: `794`
- Context: `const StepTwoPayment = ({`
- Removed snippets:
  - `methodLabel = "Manual Bank Transfer";`
  - `methodDesc =`
  - `"Please transfer the full amount. Our team will verify it manually.";`

#### Hunk 24

- Old lines: `781-783`
- New lines: `799`
- Context: `const StepTwoPayment = ({`
- Removed snippets:
  - `const depositAmount = Math.ceil(payload.grandTotal * 0.2);`
  - `const remainingAmount = payload.grandTotal - depositAmount;`

#### Hunk 25

- Old lines: `791`
- New lines: `808-813`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `const pricingAudit = buildCheckoutPricingAudit({`
  - `pax: payload.pax,`
  - `date: payload.date,`
  - `priceTiers: payload.priceTiers,`
  - `addonLines: payload.addon,`
  - `});`

#### Hunk 26

- Old lines: `839`
- New lines: `862`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `pricing_audit: pricingAudit,`

#### Hunk 27

- Old lines: `887`
- New lines: `911-924`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `<p className="flex justify-between">`
  - `<span className="font-medium text-slate-600">Locked pax tier:</span>`
  - `<span className="font-bold text-slate-900">{selectedTierLabel}</span>`
  - `</p>`
  - `<p className="flex justify-between">`
  - `<span className="font-medium text-slate-600">`
  - `Selected pax rate:`
  - `</span>`
  - `<span className="font-bold text-slate-900">`
  - `{payload.pricePerPerson`
  - `... 4 added lines omitted ...`

#### Hunk 28

- Old lines: `915`
- New lines: `952`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `{getInitialPaymentMode(payload.date) === "deposit" ? (`
- Removed snippets:
  - `{diffDays >= 14 ? (`

#### Hunk 29

- Old lines: `917-918`
- New lines: `954-955`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `Because your trip is still more than 7 days away, a 20% deposit`
  - `via Xendit is enough to secure the route first.`
- Removed snippets:
  - `Because your trip is 14+ days away, a 20% deposit via Xendit is`
  - `sufficient to secure your spot.`

#### Hunk 30

- Old lines: `920`
- New lines: `957`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `) : getInitialPaymentMode(payload.date) === "full-payment-card" ? (`
- Removed snippets:
  - `) : diffDays >= 6 ? (`

#### Hunk 31

- Old lines: `922-923`
- New lines: `959-960`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `Because your trip is now within 7 days of Day 1, full payment`
  - `via Xendit is required before the route can be locked.`
- Removed snippets:
  - `Because your trip is in less than 14 days, full payment via`
  - `Xendit is required.`

#### Hunk 32

- Old lines: `927-928`
- New lines: `964-966`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `Because your trip starts in 5 days or less, full payment is`
  - `required and manual bank-transfer verification may be used`
  - `before the route is locked.`
- Removed snippets:
  - `For last-minute trips (under 6 days), we require full payment`
  - `via Manual Bank Transfer for verification.`

#### Hunk 33

- Old lines: `931`
- New lines: `970-984`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `<div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs leading-6 text-slate-600">`
  - `<p className="font-bold uppercase tracking-[0.14em] text-slate-900">`
  - `{paymentLogicNarrative.title}`
  - `</p>`
  - `<p className="mt-2">{paymentLogicNarrative.currentCase}</p>`
  - `<p className="mt-2">`
  - `{getInitialPaymentMode(payload.date) === "deposit"`
  - `? BALANCE_DEADLINE_RULE_COPY`
  - `: paymentLogicNarrative.framework}`
  - `</p>`
  - `... 5 added lines omitted ...`

#### Hunk 34

- Old lines: `934-936`
- New lines: `987-989`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `> 7 Days: 20% DP via Xendit`
  - `6-7 Days: 100% via Xendit`
  - `<= 5 Days: 100% via Bank Transfer / manual verification`
- Removed snippets:
  - `>= 14 Days: 20% DP via Xendit`
  - `< 14 Days: 100% via Xendit`
  - `< 6 Days: 100% via Bank Transfer`

#### Hunk 35

- Old lines: `940`
- New lines: `993`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `{getInitialPaymentMode(payload.date) !== "full-payment-manual" ? (`
- Removed snippets:
  - `{diffDays >= 6 ? (`

#### Hunk 36

- Old lines: `981`
- New lines: `1034`
- Context: `const StepTwoPayment = ({`
- Added snippets:
  - `/* 2. BANK TRANSFER VERSION (AUTOMATIC FOR <= 5 DAYS) */`
- Removed snippets:
  - `/* 2. BANK TRANSFER VERSION (AUTOMATIC FOR < 6 DAYS) */`

#### Hunk 37

- Old lines: `1125`
- New lines: `1177`
- Context: `export default function CheckoutPage() {`
- Removed snippets:
  - `router={router}`

## Source / SEO / Entity

### src/app/(api)/api/site-identity/route.ts

- Status: `M`
- Total hunk: **4**

#### Hunk 1

- Old lines: `3`
- New lines: `4-8`
- Context: `import { prisma } from "@/lib/prisma";`
- Added snippets:
  - `import {`
  - `normalizeBrandPositioning,`
  - `normalizeFounder,`
  - `normalizeSiteIdentitySchema,`
  - `} from "@/lib/content/siteIdentityDefaults";`

#### Hunk 2

- Old lines: `15-29`
- New lines: `19`
- Context: `type PaymentAccount = {`
- Removed snippets:
  - `type OfficeAddress = {`
  - `street?: string;`
  - `city?: string;`
  - `operating_hours?: string;`
  - `};`
  - `type Founder = {`
  - `name?: string;`
  - `known_as?: string;`
  - `full_name?: string;`
  - `role_in_JVTO?: string;`
  - `... 4 removed lines omitted ...`

#### Hunk 3

- Old lines: `68`
- New lines: `59-66`
- Context: `function serializeSiteIdentity(data: any): SiteIdentityResponse {`
- Added snippets:
  - `const founder = normalizeFounder(data.founder, data.brand_name);`
  - `const brandPositioning = normalizeBrandPositioning(data.brand_positioning);`
  - `const orgSchema = normalizeSiteIdentitySchema(`
  - `data.org_schema_json_ld,`
  - `founder,`
  - `brandPositioning,`
  - `);`

#### Hunk 4

- Old lines: `89-90`
- New lines: `87-89`
- Context: `function serializeSiteIdentity(data: any): SiteIdentityResponse {`
- Added snippets:
  - `founder,`
  - `brand_positioning: brandPositioning,`
  - `org_schema_json_ld: orgSchema,`
- Removed snippets:
  - `founder: data.founder ?? null,`
  - `brand_positioning: data.brand_positioning ?? null,`

### src/lib/content/getContentPage.ts

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `2`
- New lines: `3`
- Context: `import prisma from "@/lib/prisma";`
- Added snippets:
  - `import { applyPinnedContentOverrideToRow } from "@/lib/content/pinnedContentOverrides";`

#### Hunk 2

- Old lines: `32`
- New lines: `33-34`
- Context: `export async function getContentPage(route: string, lang = "en") {`
- Added snippets:
  - `const row = await getContentPageCached(route, lang);`
  - `return applyPinnedContentOverrideToRow(route, row);`
- Removed snippets:
  - `return getContentPageCached(route, lang);`

### src/lib/content/getOrganizationProfile.ts

- Status: `M`
- Total hunk: **4**

#### Hunk 1

- Old lines: `2`
- New lines: `3`
- Context: `import prisma from "@/lib/prisma";`
- Added snippets:
  - `import { normalizeOrganizationProfile } from "@/lib/content/organizationProfileDefaults";`

#### Hunk 2

- Old lines: `7`
- New lines: `8`
- Context: `const getOrganizationProfileCached = unstable_cache(`
- Added snippets:
  - `const row = await prisma.organization_profile.findFirst({`
- Removed snippets:
  - `return await prisma.organization_profile.findFirst({`

#### Hunk 3

- Old lines: `27`
- New lines: `29-30`
- Context: `const getOrganizationProfileCached = unstable_cache(`
- Added snippets:
  - `return normalizeOrganizationProfile(row);`

#### Hunk 4

- Old lines: `31`
- New lines: `34`
- Context: `const getOrganizationProfileCached = unstable_cache(`
- Added snippets:
  - `return normalizeOrganizationProfile(null);`
- Removed snippets:
  - `return null;`

### src/lib/content/getPageSeo.ts

- Status: `M`
- Total hunk: **3**

#### Hunk 1

- Old lines: `1`
- New lines: `2`
- Context: `import { getContentPage } from "@/lib/content/getContentPage";`
- Added snippets:
  - `import { resolvePinnedContentFields } from "@/lib/content/pinnedContentOverrides";`

#### Hunk 2

- Old lines: `21-22`
- New lines: `22`
- Context: `export async function getPageSeo(`
- Added snippets:
  - `const resolved = resolvePinnedContentFields(route, row, fallback);`
- Removed snippets:
  - `const seo = (row?.seo as Record<string, any> | null) ?? {};`
  - `const content = (row?.content as Record<string, any> | null) ?? {};`

#### Hunk 3

- Old lines: `25-28`
- New lines: `25-28`
- Context: `export async function getPageSeo(`
- Added snippets:
  - `title: resolved.title,`
  - `h1: resolved.h1,`
  - `description: resolved.description,`
  - `row: resolved.row,`
- Removed snippets:
  - `title: seo.title ?? fallback.title,`
  - `h1: content.h1 ?? fallback.h1 ?? seo.title ?? fallback.title,`
  - `description: seo.description ?? fallback.description ?? "",`
  - `row,`

### src/lib/content/organizationProfileDefaults.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-190`
- Added snippets:
  - `import { proofLinks } from "@/constants";`
  - `import { SITE_CONFIG } from "@/lib/site-config";`
  - `type OrganizationProfileRow = {`
  - `legal_name?: string | null;`
  - `brand_name?: string | null;`
  - `alternate_name?: string | null;`
  - `founding_date?: Date | null;`
  - `description?: string | null;`
  - `price_range?: string | null;`
  - `contact_email?: string | null;`
  - `... 166 added lines omitted ...`

### src/lib/content/pinnedContentOverrides.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-190`
- Added snippets:
  - `type ContentPayload = Record<string, any>;`
  - `type ContentPageRow = {`
  - `route: string;`
  - `lang: string;`
  - `seo: unknown;`
  - `content: unknown;`
  - `created_at?: unknown;`
  - `updated_at?: unknown;`
  - `} | null;`
  - `type PinnedOverride = {`
  - `... 170 added lines omitted ...`

### src/lib/content/siteIdentityDefaults.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-148`
- Added snippets:
  - `import { SITE_CONFIG } from "@/lib/site-config";`
  - `type FounderPayload = {`
  - `name?: string;`
  - `full_name?: string;`
  - `role_in_JVTO?: string;`
  - `asset_url?: string;`
  - `public_mission_statement?: string;`
  - `};`
  - `type BrandPositioningPayload = {`
  - `founding_mission?: string;`
  - `... 116 added lines omitted ...`

### src/lib/seo/jsonld/builders.ts

- Status: `M`
- Total hunk: **4**

#### Hunk 1

- Old lines: `113`
- New lines: `114-125`
- Context: `function asArray<T>(value: T | T[] | null | undefined): T[] {`
- Added snippets:
  - `function normalizeBusinessRuleText(value: string) {`
  - `if (!value) return value;`
  - `return value`
  - `.replace(/within 14 days of booking/gi, "within 7 days of booking")`
  - `.replace(/within 14 calendar days of booking/gi, "within 7 calendar days of booking")`
  - `.replace(/within 14 days of Day 1/gi, "within 7 days of Day 1")`
  - `.replace(/within 14 calendar days of Day 1/gi, "within 7 calendar days of Day 1")`
  - `.replace(/14 calendar days/gi, "7 calendar days")`
  - `.replace(/14 days/gi, "7 days");`
  - `}`

#### Hunk 2

- Old lines: `127`
- New lines: `139`
- Context: `const LABEL_MAP: Record<string, string> = {`
- Added snippets:
  - `"travel-guide": "Prepare & Book",`
- Removed snippets:
  - `"travel-guide": "Travel Guide",`

#### Hunk 3

- Old lines: `205`
- New lines: `217-218`
- Context: `export function buildOrganizationJsonLd(`
- Added snippets:
  - `const rest = { ...(org.schema_json as any) };`
  - `delete rest["@context"];`
- Removed snippets:
  - `const { "@context": _ctx, ...rest } = org.schema_json as any;`

#### Hunk 4

- Old lines: `340`
- New lines: `353-356`
- Context: `export function buildFaqJsonLdFromContent(`
- Added snippets:
  - `acceptedAnswer: {`
  - `"@type": "Answer",`
  - `text: normalizeBusinessRuleText(x.a.trim()),`
  - `},`
- Removed snippets:
  - `acceptedAnswer: { "@type": "Answer", text: x.a.trim() },`

### src/lib/seo/jsonld/normalize.ts

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `17`
- New lines: `17-18`
- Context: `function stripNodeContext(node: JsonLdNode): JsonLdNode {`
- Added snippets:
  - `const rest = { ...node };`
  - `delete rest["@context"];`
- Removed snippets:
  - `const { "@context": _context, ...rest } = node;`

## Tours / Catalog

### src/app/(api)/api/tours-feed/route.ts

- Status: `M`
- Total hunk: **3**

#### Hunk 1

- Old lines: `2`
- New lines: `3`
- Context: `import { prisma } from "@/lib/prisma";`
- Added snippets:
  - `import { getEntryReferencePrice } from "@/lib/packages/priceTiers";`

#### Hunk 2

- Old lines: `19-22`
- New lines: `20-25`
- Context: `function serializeForXML(pkg: any) {`
- Added snippets:
  - `const tiers = (pkg.package_prices ?? []).map((p: any) => ({`
  - `paxMin: Number(p.min_pax) || 0,`
  - `paxMax: Number(p.max_pax) || 0,`
  - `pricePerPerson: Number(p.price) || 0,`
  - `}));`
  - `const startFrom = getEntryReferencePrice(tiers) ?? 0;`
- Removed snippets:
  - `const validPrices: number[] = (pkg.package_prices ?? [])`
  - `.map((p: any) => p.price)`
  - `.filter((price: any) => typeof price === "number" && price > 0);`
  - `const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;`

#### Hunk 3

- Old lines: `99`
- New lines: `103`
- Context: `export async function GET() {`
- Added snippets:
  - `console.error("GET /api/tours-feed error:", error);`

### src/app/(website)/tours/from-bali/page.tsx

- Status: `M`
- Total hunk: **10**

#### Hunk 1

- Old lines: `5`
- New lines: `6`
- Context: `import ToursCatalogShell from "@/components/website/Tours/ToursCatalogShell";`
- Added snippets:
  - `import ToursFamilyGuide from "@/components/website/Tours/ToursFamilyGuide";`

#### Hunk 2

- Old lines: `9`
- New lines: `11`
- Context: `import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";`
- Added snippets:
  - `import { getPackageUrl } from "@/lib/packages/packagePaths";`

#### Hunk 3

- Old lines: `10`
- New lines: `13`
- Context: `import { getWebTourList } from "@/lib/packages/webTourList";`
- Added snippets:
  - `import { getTourFamilyGuideItems } from "@/lib/packages/tourFamily";`

#### Hunk 4

- Old lines: `11`
- New lines: `15`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import { BASE_URL } from "@/lib/site";`

#### Hunk 5

- Old lines: `19-20`
- New lines: `23-24`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Private East Java Tours from Bali",`
  - `h1: "Private Tours from Bali",`
- Removed snippets:
  - `title: "Private Tours From Bali to Java | Bromo & Ijen Crater",`
  - `h1: "Bali Tours",`

#### Hunk 6

- Old lines: `22`
- New lines: `26`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Browse private East Java tours from Bali with guided cross-island handling, proof-backed operator context, and clear route seriousness before booking.",`
- Removed snippets:
  - `"Cross-island adventure from Bali to East Java. Includes ferry crossing, transport, and guided tours to Ijen Blue Fire and Mount Bromo. Drop-off in Bali or Surabaya.",`

#### Hunk 7

- Old lines: `45-47`
- New lines: `49-50`
- Context: `export default async function ToursPageBali() {`
- Added snippets:
  - `const familyGuideItems = getTourFamilyGuideItems(initialTours);`
  - `const siteUrl = BASE_URL;`
- Removed snippets:
  - `const siteUrl =`
  - `process.env.NEXT_PUBLIC_SITE_URL ||`
  - `"https://javavolcano-touroperator.com";`

#### Hunk 8

- Old lines: `103`
- New lines: `106`
- Context: `export default async function ToursPageBali() {`
- Added snippets:
  - `url: getPackageUrl(tour.slug),`
- Removed snippets:
  - `url: \`${siteUrl}/${tour.slug}\`,`

#### Hunk 9

- Old lines: `159`
- New lines: `163-168`
- Context: `export default async function ToursPageBali() {`
- Added snippets:
  - `<ToursFamilyGuide`
  - `eyebrow="Bali route families"`
  - `title="Bali routes should be compared by handoff logic first."`
  - `copy="Bali-origin packages are not just Java routes with a different pickup point. The real difference is whether the route returns to Bali, finishes forward into Surabaya, or e...`
  - `items={familyGuideItems}`
  - `/>`

#### Hunk 10

- Old lines: `166`
- New lines: `175`
- Context: `export default async function ToursPageBali() {`
- Added snippets:
  - `"Return loop versus handoff matters early",`
- Removed snippets:
  - `"Better when transfer continuity matters",`

### src/app/(website)/tours/from-surabaya/page.tsx

- Status: `M`
- Total hunk: **10**

#### Hunk 1

- Old lines: `5`
- New lines: `6`
- Context: `import ToursCatalogShell from "@/components/website/Tours/ToursCatalogShell";`
- Added snippets:
  - `import ToursFamilyGuide from "@/components/website/Tours/ToursFamilyGuide";`

#### Hunk 2

- Old lines: `9`
- New lines: `11`
- Context: `import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";`
- Added snippets:
  - `import { getPackageUrl } from "@/lib/packages/packagePaths";`

#### Hunk 3

- Old lines: `10`
- New lines: `13`
- Context: `import { getWebTourList } from "@/lib/packages/webTourList";`
- Added snippets:
  - `import { getTourFamilyGuideItems } from "@/lib/packages/tourFamily";`

#### Hunk 4

- Old lines: `11`
- New lines: `15`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import { BASE_URL } from "@/lib/site";`

#### Hunk 5

- Old lines: `19-20`
- New lines: `23-24`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Private East Java Tours from Surabaya",`
  - `h1: "Private Tours from Surabaya",`
- Removed snippets:
  - `title: "Private Tours From Surabaya | Bromo, Ijen & Tumpak Sewu",`
  - `h1: "Surabaya Tours",`

#### Hunk 6

- Old lines: `22`
- New lines: `26`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Explore private tours from Surabaya with proof-backed operator context, clear route differences, and official support before booking.",`
- Removed snippets:
  - `"Explore East Java starting from Surabaya. Best private tours to Mount Bromo sunrise, Ijen Blue Fire, and Madakaripura Waterfall. All-inclusive & hassle-free.",`

#### Hunk 7

- Old lines: `45-47`
- New lines: `49-50`
- Context: `export default async function ToursPageSurabaya() {`
- Added snippets:
  - `const familyGuideItems = getTourFamilyGuideItems(initialTours);`
  - `const siteUrl = BASE_URL;`
- Removed snippets:
  - `const siteUrl =`
  - `process.env.NEXT_PUBLIC_SITE_URL ||`
  - `"https://javavolcano-touroperator.com";`

#### Hunk 8

- Old lines: `103`
- New lines: `106`
- Context: `export default async function ToursPageSurabaya() {`
- Added snippets:
  - `url: getPackageUrl(tour.slug),`
- Removed snippets:
  - `url: \`${siteUrl}/${tour.slug}\`,`

#### Hunk 9

- Old lines: `159`
- New lines: `163-168`
- Context: `export default async function ToursPageSurabaya() {`
- Added snippets:
  - `<ToursFamilyGuide`
  - `eyebrow="Surabaya route families"`
  - `title="Use family logic before route-by-route comparison."`
  - `copy="Surabaya is where the biggest family spread lives: overnight-efficiency Bromo, focused Ijen, flagship 3-day loops, broader overlands, and the family-paced safari route. Th...`
  - `items={familyGuideItems}`
  - `/>`

#### Hunk 10

- Old lines: `166-167`
- New lines: `175-176`
- Context: `export default async function ToursPageSurabaya() {`
- Added snippets:
  - `"Route order changes fatigue and handoff logic",`
  - `"Strongest family spread in one hub",`
- Removed snippets:
  - `"Useful for longer overland structures",`
  - `"Strongest route range in one hub",`

### src/app/(website)/tours/page.tsx

- Status: `M`
- Total hunk: **10**

#### Hunk 1

- Old lines: `5`
- New lines: `6`
- Context: `import ToursCatalogShell from "@/components/website/Tours/ToursCatalogShell";`
- Added snippets:
  - `import ToursFamilyGuide from "@/components/website/Tours/ToursFamilyGuide";`

#### Hunk 2

- Old lines: `9`
- New lines: `11`
- Context: `import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";`
- Added snippets:
  - `import { getPackageUrl } from "@/lib/packages/packagePaths";`

#### Hunk 3

- Old lines: `10`
- New lines: `13`
- Context: `import { getWebTourList } from "@/lib/packages/webTourList";`
- Added snippets:
  - `import { getTourFamilyGuideItems } from "@/lib/packages/tourFamily";`

#### Hunk 4

- Old lines: `11`
- New lines: `15`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import { BASE_URL } from "@/lib/site";`

#### Hunk 5

- Old lines: `19-20`
- New lines: `23-24`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Private East Java Tours: Surabaya & Bali Departures",`
  - `h1: "Private East Java Tours: Surabaya & Bali Departures",`
- Removed snippets:
  - `title: "All Private Tours | East Java & Bali Adventures",`
  - `h1: "All Destinations Tours",`

#### Hunk 6

- Old lines: `22`
- New lines: `26`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Browse JVTO private East Java tour packages from Surabaya and Bali with product-first discovery, clear route differences, and official operator support before booking.",`
- Removed snippets:
  - `"Explore our complete collection of private tours in East Java and Bali. From Mount Bromo sunrise to Ijen Blue Fire and Tumpak Sewu Waterfall. Flexible starting points from Sura...`

#### Hunk 7

- Old lines: `45-47`
- New lines: `49-50`
- Context: `export default async function ToursPageGlobal() {`
- Added snippets:
  - `const familyGuideItems = getTourFamilyGuideItems(initialTours);`
  - `const siteUrl = BASE_URL;`
- Removed snippets:
  - `const siteUrl =`
  - `process.env.NEXT_PUBLIC_SITE_URL ||`
  - `"https://javavolcano-touroperator.com";`

#### Hunk 8

- Old lines: `73`
- New lines: `76`
- Context: `export default async function ToursPageGlobal() {`
- Added snippets:
  - `item: \`${siteUrl}/\`,`
- Removed snippets:
  - `item: "https://javavolcano-touroperator.com/",`

#### Hunk 9

- Old lines: `91`
- New lines: `94`
- Context: `export default async function ToursPageGlobal() {`
- Added snippets:
  - `url: getPackageUrl(tour.slug),`
- Removed snippets:
  - `url: \`${siteUrl}/${tour.slug}\`,`

#### Hunk 10

- Old lines: `147`
- New lines: `151-156`
- Context: `export default async function ToursPageGlobal() {`
- Added snippets:
  - `<ToursFamilyGuide`
  - `eyebrow="Package doctrine"`
  - `title="Compare route families before comparing price."`
  - `copy="The catalog should separate route families first. A 1-day Bromo run, a focused Ijen package, a flagship 3-day loop, and an overland East Java journey are not the same comm...`
  - `items={familyGuideItems}`
  - `/>`

### src/components/website/TourCard.tsx

- Status: `M`
- Total hunk: **8**

#### Hunk 1

- Old lines: `6`
- New lines: `7`
- Context: `import { ListTourPackage } from "@/types";`
- Added snippets:
  - `import { getPackagePath } from "@/lib/packages/packagePaths";`

#### Hunk 2

- Old lines: `9`
- New lines: `11`
- Context: `import { Dumbbell, Clock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";`
- Added snippets:
  - `import { getTourFamilyMeta } from "@/lib/packages/tourFamily";`

#### Hunk 3

- Old lines: `38`
- New lines: `40`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {`
- Added snippets:
  - `const fullTourSlug = getPackagePath(tour.slug);`
- Removed snippets:
  - `const fullTourSlug = "/" + tour.slug;`

#### Hunk 4

- Old lines: `39`
- New lines: `42`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {`
- Added snippets:
  - `const family = getTourFamilyMeta(tour);`

#### Hunk 5

- Old lines: `101`
- New lines: `105-116`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {`
- Added snippets:
  - `<div className="mb-3 flex flex-wrap items-center gap-2">`
  - `<span className="rounded-full border border-[#dce4c7] bg-[#f7faef] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-jvto-green">`
  - `{family.label}`
  - `</span>`
  - `<span className="rounded-full border border-[#e4e8da] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">`
  - `{family.routeOrder}`
  - `</span>`
  - `<span className="rounded-full border border-[#e4e8da] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600">`
  - `{family.finishLogic}`
  - `</span>`
  - `... 1 added lines omitted ...`

#### Hunk 6

- Old lines: `119`
- New lines: `135-138`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {`
- Added snippets:
  - `<p className="mb-4 text-sm leading-6 text-gray-600">`
  - `{family.summary}`
  - `</p>`

#### Hunk 7

- Old lines: `135`
- New lines: `154`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {`
- Added snippets:
  - `From`
- Removed snippets:
  - `Starts from`

#### Hunk 8

- Old lines: `138-144`
- New lines: `157-168`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {`
- Added snippets:
  - `<div>`
  - `<div className="flex items-center gap-1">`
  - `<span className="text-2xl md:text-3xl font-black tracking-tight text-lime-600">`
  - `{formatIDR(tour.startFrom)}`
  - `</span>`
  - `<span className="text-sm text-nowrap text-ink-neutral-500 dark:text-ink-neutral-400">`
  - `/ person`
  - `</span>`
  - `</div>`
  - `<p className="mt-1 text-[11px] text-ink-neutral-500 dark:text-ink-neutral-400">`
  - `... 2 added lines omitted ...`
- Removed snippets:
  - `<div className="flex items-center gap-1">`
  - `<span className="text-2xl md:text-3xl font-black tracking-tight text-lime-600">`
  - `{formatIDR(tour.startFrom)}`
  - `</span>`
  - `<span className="text-sm text-nowrap text-ink-neutral-500 dark:text-ink-neutral-400">`
  - `/ person`
  - `</span>`

### src/components/website/Tours/TourCard.tsx

- Status: `M`
- Total hunk: **6**

#### Hunk 1

- Old lines: `2`
- New lines: `2`
- Context: `import { Star, Clock, MapPin, ArrowRight } from "lucide-react";`
- Added snippets:
  - `import { Difficulty } from "@/types";`
- Removed snippets:
  - `import { TourPackage, Difficulty } from "@/typesNew";`

#### Hunk 2

- Old lines: `3`
- New lines: `4`
- Context: `import { ListTourPackage } from "@/types";`
- Added snippets:
  - `import { getPackagePath } from "@/lib/packages/packagePaths";`

#### Hunk 3

- Old lines: `18`
- New lines: `20-21`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour }) => {`
- Added snippets:
  - `const fullTourSlug = getPackagePath(tour.slug);`

#### Hunk 4

- Old lines: `111`
- New lines: `114`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour }) => {`
- Added snippets:
  - `From`
- Removed snippets:
  - `Starting From`

#### Hunk 5

- Old lines: `115`
- New lines: `119-121`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour }) => {`
- Added snippets:
  - `<span className="mt-1 text-[11px] leading-relaxed text-gray-500">`
  - `2-pax reference. Larger groups pay less per person.`
  - `</span>`

#### Hunk 6

- Old lines: `126`
- New lines: `132`
- Context: `const TourCard: React.FC<TourCardProps> = ({ tour }) => {`
- Added snippets:
  - `to={fullTourSlug}`
- Removed snippets:
  - `to={\`/${tour.slug}\`}`

### src/components/website/Tours/ToursCatalogShell.tsx

- Status: `M`
- Total hunk: **7**

#### Hunk 1

- Old lines: `23`
- New lines: `23`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(155,184,89,0.15),transparent_55%)]" />`
- Removed snippets:
  - `<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.12),transparent_55%)]" />`

#### Hunk 2

- Old lines: `27`
- New lines: `27`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `<p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">`
- Removed snippets:
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-safety-orange">`

#### Hunk 3

- Old lines: `30`
- New lines: `30`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `<h2 className="mt-3 text-3xl font-black uppercase leading-tight text-jvto-dark md:text-5xl">`
- Removed snippets:
  - `<h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[-0.03em] text-jvto-dark md:text-5xl">`

#### Hunk 4

- Old lines: `33`
- New lines: `33`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `<p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">`
- Removed snippets:
  - `<p className="mt-4 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">`

#### Hunk 5

- Old lines: `45`
- New lines: `45`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `className="rounded-2xl border border-[#dce4c7] bg-white/90 p-4 shadow-[0_14px_32px_rgba(35,48,18,0.06)] backdrop-blur"`
- Removed snippets:
  - `className="rounded-[24px] border border-[#dce4c7] bg-white/90 p-4 shadow-[0_18px_34px_rgba(35,48,18,0.06)] backdrop-blur"`

#### Hunk 6

- Old lines: `47`
- New lines: `47`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark">`
- Removed snippets:
  - `<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-authority-navy text-white">`

#### Hunk 7

- Old lines: `59-60`
- New lines: `59-60`
- Context: `const ToursCatalogShell = ({`
- Added snippets:
  - `<div className="mt-10 rounded-[28px] border border-[#dbe3c5] bg-white p-3 shadow-[0_24px_60px_rgba(35,48,18,0.08)] md:p-4">`
  - `<div className="rounded-[22px] border border-[#edf1e2] bg-[#fbfcf8]">`
- Removed snippets:
  - `<div className="mt-10 rounded-[32px] border border-[#dbe3c5] bg-white p-3 shadow-[0_30px_70px_rgba(35,48,18,0.08)] md:p-4">`
  - `<div className="rounded-[26px] border border-[#edf1e2] bg-[#fbfcf8]">`

### src/components/website/Tours/ToursFamilyGuide.tsx

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-70`
- Added snippets:
  - `import type { TourFamilyMeta } from "@/lib/packages/tourFamily";`
  - `interface ToursFamilyGuideProps {`
  - `eyebrow: string;`
  - `title: string;`
  - `copy: string;`
  - `items: TourFamilyMeta[];`
  - `}`
  - `const ToursFamilyGuide = ({`
  - `eyebrow,`
  - `title,`
  - `... 53 added lines omitted ...`

### src/components/website/Tours/ToursHubIntro.tsx

- Status: `M`
- Total hunk: **17**

#### Hunk 1

- Old lines: `2`
- New lines: `2`
- Context: `import Link from "next/link";`
- Added snippets:
  - `import { ArrowRight } from "lucide-react";`
- Removed snippets:
  - `import { ArrowRight, FileCheck2, ShieldCheck, Stethoscope } from "lucide-react";`

#### Hunk 2

- Old lines: `20`
- New lines: `20`
- Context: `const actionClassMap = {`
- Added snippets:
  - `"bg-jvto-green text-jvto-dark hover:bg-white",`
- Removed snippets:
  - `"rounded-full bg-jvto-green px-6 py-3 text-jvto-dark hover:bg-white",`

#### Hunk 3

- Old lines: `22`
- New lines: `22`
- Context: `const actionClassMap = {`
- Added snippets:
  - `"border border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white",`
- Removed snippets:
  - `"rounded-full border border-white/20 bg-white/6 px-6 py-3 text-white hover:border-white hover:bg-white hover:text-authority-navy",`

#### Hunk 4

- Old lines: `24`
- New lines: `24`
- Context: `const actionClassMap = {`
- Added snippets:
  - `"text-jvto-dark hover:text-jvto-green",`
- Removed snippets:
  - `"rounded-full border border-white/15 bg-black/15 px-6 py-3 text-white hover:bg-white/10",`

#### Hunk 5

- Old lines: `35-70`
- New lines: `35-37`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<section className="relative overflow-hidden border-b border-[#e4e8da] bg-[linear-gradient(180deg,#eef5e2_0%,#ffffff_72%)]">`
  - `<div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(110,143,44,0.2),transparent_50%)]" />`
  - `<div className="container relative mx-auto px-6 pt-28 pb-14 md:pt-36 md:pb-18">`
- Removed snippets:
  - `<section className="relative overflow-hidden border-b border-white/10 bg-authority-navy text-white">`
  - `<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16...`
  - `<div className="grid-pattern pointer-events-none absolute inset-0 opacity-15" />`
  - `<div className="relative z-10 border-b border-white/10 bg-black/20">`
  - `<div className="container mx-auto flex flex-wrap items-center gap-4 px-6 py-4 lg:justify-between">`
  - `<div className="flex items-center gap-3">`
  - `<span className="status-live" />`
  - `<span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-safety-orange">`
  - `Route Shortlist Protocol`
  - `</span>`
  - `... 24 removed lines omitted ...`

#### Hunk 6

- Old lines: `73`
- New lines: `40`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<p className="text-xs font-black uppercase tracking-[0.24em] text-jvto-green">`
- Removed snippets:
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-safety-orange">`

#### Hunk 7

- Old lines: `76`
- New lines: `43`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<h1 className="mt-4 text-4xl font-black uppercase leading-tight text-jvto-dark md:text-6xl">`
- Removed snippets:
  - `<h1 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-6xl">`

#### Hunk 8

- Old lines: `79`
- New lines: `46`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">`
- Removed snippets:
  - `<p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">`

#### Hunk 9

- Old lines: `87`
- New lines: `54`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `className="rounded-full border border-[#d7ddc6] bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"`
- Removed snippets:
  - `className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"`

#### Hunk 10

- Old lines: `99`
- New lines: `66`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `className={\`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors ${actionClassMap[action.variant ?? "primary"]}\`}`
- Removed snippets:
  - `className={\`inline-flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.16em] transition-colors ${actionClassMap[action.variant ?? "primary"]}\`}`

#### Hunk 11

- Old lines: `108-122`
- New lines: `75-77`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<div className="rounded-[28px] border border-[#d9e1c4] bg-white/90 p-5 shadow-[0_24px_60px_rgba(35,48,18,0.1)] backdrop-blur">`
  - `<p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">`
  - `Decision cues`
- Removed snippets:
  - `<div className="rounded-[32px] border border-white/12 bg-white/8 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">`
  - `<div className="flex items-center justify-between gap-4">`
  - `<div>`
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">`
  - `Decision cues`
  - `</p>`
  - `<h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">`
  - `Keep these beside the route list.`
  - `</h2>`
  - `</div>`
  - `... 4 removed lines omitted ...`

#### Hunk 12

- Old lines: `124-125`
- New lines: `79`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<div className="mt-4 grid gap-3">`
- Removed snippets:
  - `<div className="mt-5 grid gap-3">`

#### Hunk 13

- Old lines: `129`
- New lines: `83`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `className="rounded-2xl border border-[#e8edd9] bg-[#fbfcf8] px-4 py-4"`
- Removed snippets:
  - `className="rounded-2xl border border-white/10 bg-black/18 px-4 py-4"`

#### Hunk 14

- Old lines: `131`
- New lines: `85`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<p className="text-[11px] font-black uppercase tracking-[0.18em] text-jvto-green/80">`
- Removed snippets:
  - `<p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">`

#### Hunk 15

- Old lines: `134`
- New lines: `88`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<p className="mt-2 text-sm font-semibold leading-6 text-jvto-dark">`
- Removed snippets:
  - `<p className="mt-2 text-sm font-semibold leading-6 text-white">`

#### Hunk 16

- Old lines: `140-147`
- New lines: `93`
- Context: `const ToursHubIntro = ({`
- Removed snippets:
  - `<Link`
  - `href="/verify-jvto"`
  - `className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-verified-bright transition hover:text-white"`
  - `>`
  - `Open proof route`
  - `<ArrowRight className="h-3.5 w-3.5" />`
  - `</Link>`

#### Hunk 17

- Old lines: `151`
- New lines: `97`
- Context: `const ToursHubIntro = ({`
- Added snippets:
  - `<div className="mt-10 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(93,122,38,0.28),transparent)]" />`
- Removed snippets:
  - `<div className="mt-10 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />`

### src/components/website/Tours/ToursSupportGrid.tsx

- Status: `M`
- Total hunk: **8**

#### Hunk 1

- Old lines: `26`
- New lines: `26`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<section className="bg-[linear-gradient(180deg,#ffffff_0%,#f6f8ef_100%)] py-12 md:py-16">`
- Removed snippets:
  - `<section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7faf0_100%)] py-12 md:py-16">`

#### Hunk 2

- Old lines: `30`
- New lines: `30`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">`
- Removed snippets:
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-safety-orange">`

#### Hunk 3

- Old lines: `33`
- New lines: `33`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<h2 className="mt-3 text-2xl font-black uppercase leading-tight text-jvto-dark md:text-4xl">`
- Removed snippets:
  - `<h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[-0.03em] text-jvto-dark md:text-5xl">`

#### Hunk 4

- Old lines: `37`
- New lines: `37`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<p className="max-w-2xl text-base leading-7 text-gray-600">{copy}</p>`
- Removed snippets:
  - `<p className="max-w-2xl text-base leading-8 text-gray-600">{copy}</p>`

#### Hunk 5

- Old lines: `48`
- New lines: `48`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `className="group rounded-[24px] border border-[#dce4c7] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#b8c59a] hover:shadow-[0_20px_40px_rgba(35,48...`
- Removed snippets:
  - `className="group rounded-[28px] border border-[#dce4c7] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#b8c59a] hover:shadow-[0_24px_50px_rgba(35,48...`

#### Hunk 6

- Old lines: `50`
- New lines: `50`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jvto-green/12 text-jvto-dark">`
- Removed snippets:
  - `<span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-authority-navy text-white">`

#### Hunk 7

- Old lines: `53`
- New lines: `53`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<h3 className="text-sm font-black uppercase tracking-[0.14em] text-jvto-dark transition-colors group-hover:text-jvto-green">`
- Removed snippets:
  - `<h3 className="text-sm font-black uppercase tracking-[0.16em] text-jvto-dark transition-colors group-hover:text-jvto-green">`

#### Hunk 8

- Old lines: `56-57`
- New lines: `56-57`
- Context: `const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {`
- Added snippets:
  - `<p className="mt-3 text-sm leading-6 text-gray-600">{item.copy}</p>`
  - `<div className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-jvto-green">`
- Removed snippets:
  - `<p className="mt-3 text-sm leading-7 text-gray-600">{item.copy}</p>`
  - `<div className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-green">`

### src/components/website/ToursPageClient.tsx

- Status: `M`
- Total hunk: **15**

#### Hunk 1

- Old lines: `410-411`
- New lines: `410-411`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<div className="text-center mb-12">`
  - `<h1 className="text-3xl md:text-4xl font-black uppercase mb-4 text-jvto-dark">`
- Removed snippets:
  - `<div className="mb-12 text-center">`
  - `<h1 className="mb-4 text-3xl font-black uppercase tracking-[-0.03em] text-jvto-dark md:text-4xl">`

#### Hunk 2

- Old lines: `414`
- New lines: `414`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">`
- Removed snippets:
  - `<p className="mx-auto max-w-2xl leading-relaxed text-gray-600">`

#### Hunk 3

- Old lines: `421`
- New lines: `421`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<div className="rounded-[24px] border border-[#dce4c7] bg-white px-5 py-5 shadow-[0_20px_40px_rgba(35,48,18,0.06)]">`
- Removed snippets:
  - `<div className="rounded-[28px] border border-[#dce4c7] bg-white px-6 py-6 shadow-[0_20px_40px_rgba(35,48,18,0.06)]">`

#### Hunk 4

- Old lines: `424`
- New lines: `424`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<p className="text-xs font-black uppercase tracking-[0.2em] text-jvto-green">`
- Removed snippets:
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-safety-orange">`

#### Hunk 5

- Old lines: `427`
- New lines: `427`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<h3 className="mt-2 text-2xl font-black uppercase leading-tight text-jvto-dark">`
- Removed snippets:
  - `<h3 className="mt-2 text-2xl font-black uppercase leading-tight tracking-[-0.02em] text-jvto-dark">`

#### Hunk 6

- Old lines: `431`
- New lines: `431`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<div className="rounded-full border border-[#dbe3c5] bg-[#f7faef] px-4 py-2 text-sm font-bold text-jvto-dark">`
- Removed snippets:
  - `<div className="rounded-full border border-[#dbe3c5] bg-[#f7faef] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-jvto-dark">`

#### Hunk 7

- Old lines: `479-480`
- New lines: `479-480`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<div className="rounded-[24px] border border-[#dce4c7] bg-[linear-gradient(180deg,#ffffff_0%,#f7faef_100%)] px-5 py-5 shadow-[0_20px_40px_rgba(35,48,18,0.05)]">`
  - `<p className="text-xs font-black uppercase tracking-[0.2em] text-jvto-green">`
- Removed snippets:
  - `<div className="rounded-[28px] border border-[#dce4c7] bg-[linear-gradient(180deg,#ffffff_0%,#f7faef_100%)] px-6 py-6 shadow-[0_20px_40px_rgba(35,48,18,0.05)]">`
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-safety-orange">`

#### Hunk 8

- Old lines: `487`
- New lines: `487`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `className="rounded-2xl border border-[#e6ecd6] bg-white px-4 py-4 text-sm font-medium leading-6 text-gray-700"`
- Removed snippets:
  - `className="rounded-[22px] border border-[#e6ecd6] bg-white px-4 py-4 text-sm font-medium leading-7 text-gray-700"`

#### Hunk 9

- Old lines: `499`
- New lines: `499`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<div className="sticky top-32 rounded-[28px] border border-[#dce4c7] bg-white p-6 shadow-[0_24px_50px_rgba(35,48,18,0.08)]">`
- Removed snippets:
  - `<div className="sticky top-32 rounded-[32px] border border-[#dce4c7] bg-white p-6 shadow-[0_24px_50px_rgba(35,48,18,0.08)]">`

#### Hunk 10

- Old lines: `501`
- New lines: `501`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<p className="text-xs font-black uppercase tracking-[0.2em] text-jvto-green">`
- Removed snippets:
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-safety-orange">`

#### Hunk 11

- Old lines: `505-506`
- New lines: `505-506`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<h3 className="text-lg font-black uppercase tracking-wide">`
  - `Filters`
- Removed snippets:
  - `<h3 className="text-lg font-black uppercase tracking-wide text-jvto-dark">`
  - `Filters`

#### Hunk 12

- Old lines: `508`
- New lines: `508`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<span className="rounded-full bg-[#f0f5e5] px-2.5 py-1 text-xs font-semibold text-jvto-dark">`
- Removed snippets:
  - `<span className="rounded-full bg-[#f0f5e5] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-jvto-dark">`

#### Hunk 13

- Old lines: `583`
- New lines: `583`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<p className="text-xs font-black uppercase tracking-[0.18em] text-jvto-green">`
- Removed snippets:
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-safety-orange">`

#### Hunk 14

- Old lines: `586`
- New lines: `586`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<h3 className="mt-1 text-xl font-black uppercase text-jvto-dark">`
- Removed snippets:
  - `<h3 className="mt-1 text-xl font-black uppercase tracking-[-0.02em] text-jvto-dark">`

#### Hunk 15

- Old lines: `590`
- New lines: `590`
- Context: `export default function ToursPageClient({`
- Added snippets:
  - `<div className="rounded-full border border-[#dbe3c5] bg-white px-4 py-2 text-sm font-semibold text-gray-600">`
- Removed snippets:
  - `<div className="rounded-full border border-[#dbe3c5] bg-white px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600">`

## Package / Pricing / Conversion

### src/app/(website)/isic/student-package/page.tsx

- Status: `M`
- Total hunk: **13**

#### Hunk 1

- Old lines: `13`
- New lines: `14`
- Context: `import { getPageSeo } from "@/lib/content/getPageSeo";`
- Added snippets:
  - `import { getPackageUrl } from "@/lib/packages/packagePaths";`

#### Hunk 2

- Old lines: `14`
- New lines: `16`
- Context: `import { getWebTourList } from "@/lib/packages/webTourList";`
- Added snippets:
  - `import { getIsicEligibleTours } from "@/lib/packages/isicEligibleRoutes";`

#### Hunk 3

- Old lines: `15`
- New lines: `18`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import { BASE_URL } from "@/lib/site";`

#### Hunk 4

- Old lines: `36`
- New lines: `39`
- Context: `export async function generateMetadata(): Promise<Metadata> {`
- Added snippets:
  - `async function getEligibleStudentRoutes(): Promise<ListTourPackage[]> {`
- Removed snippets:
  - `async function getAllTours(): Promise<ListTourPackage[]> {`

#### Hunk 5

- Old lines: `38-40`
- New lines: `41-42`
- Context: `async function getAllTours(): Promise<ListTourPackage[]> {`
- Added snippets:
  - `const publicTours = (await getWebTourList({`
  - `categoryId: 1,`
- Removed snippets:
  - `return (await getWebTourList({`
  - `categoryId: 2,`
  - `limit: 8,`

#### Hunk 6

- Old lines: `41`
- New lines: `44-45`
- Context: `async function getAllTours(): Promise<ListTourPackage[]> {`
- Added snippets:
  - `return getIsicEligibleTours(publicTours);`

#### Hunk 7

- Old lines: `44`
- New lines: `48-50`
- Context: `async function getAllTours(): Promise<ListTourPackage[]> {`
- Added snippets:
  - `console.warn(`
  - `\`[isic-student-package] fallback to empty eligible route list: ${message}\`,`
  - `);`
- Removed snippets:
  - `console.warn(\`[isic-student-package] fallback to empty tour list: ${message}\`);`

#### Hunk 8

- Old lines: `51-54`
- New lines: `57-58`
- Context: `export default async function IsicStudentPackagePage() {`
- Added snippets:
  - `const studentPackages = await getEligibleStudentRoutes();`
  - `const siteUrl = BASE_URL;`
- Removed snippets:
  - `const studentPackages = await getAllTours();`
  - `const siteUrl =`
  - `process.env.NEXT_PUBLIC_SITE_URL ||`
  - `"https://javavolcano-touroperator.com";`

#### Hunk 9

- Old lines: `78`
- New lines: `82`
- Context: `export default async function IsicStudentPackagePage() {`
- Added snippets:
  - `name: "ISIC-eligible private routes",`
- Removed snippets:
  - `name: "ISIC student packages",`

#### Hunk 10

- Old lines: `83`
- New lines: `87`
- Context: `export default async function IsicStudentPackagePage() {`
- Added snippets:
  - `url: getPackageUrl(tour.slug),`
- Removed snippets:
  - `url: \`${siteUrl}/${tour.slug}\`,`

#### Hunk 11

- Old lines: `136`
- New lines: `140`
- Context: `export default async function IsicStudentPackagePage() {`
- Added snippets:
  - `Verified Student Access on Selected Private Routes`
- Removed snippets:
  - `Exclusive Student Package for ISIC Cardholders`

#### Hunk 12

- Old lines: `139`
- New lines: `143-155`
- Context: `export default async function IsicStudentPackagePage() {`
- Added snippets:
  - `These cards show the underlying private JVTO routes where verified`
  - `ISIC pricing can be applied. The public starting price stays visible on`
  - `each route card; student pricing is handled after ISIC verification,`
  - `before payment is finalized.`
  - `</p>`
  - `</div>`
  - `<div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-primary/20 bg-primary/5 p-5 text-left">`
  - `<p className="text-sm md:text-base text-foreground">`
  - `ISIC access in the phase-two baseline was structured as an internal`
  - `verification layer, not as a separate public inventory. This page`
  - `... 2 added lines omitted ...`
- Removed snippets:
  - `JVTO collaborates with ISIC to offer student-friendly pricing structures for safe, all-inclusive volcano tours. These prices are only available to ISIC cardholders. To redeem, y...`

#### Hunk 13

- Old lines: `153`
- New lines: `169-171`
- Context: `export default async function IsicStudentPackagePage() {`
- Added snippets:
  - `<p className="text-muted-foreground">`
  - `No verified ISIC-eligible routes are exposed right now.`
  - `</p>`
- Removed snippets:
  - `<p className="text-muted-foreground">No packages currently available.</p>`

### src/components/website/TourDetail.tsx

- Status: `M`
- Total hunk: **49**

#### Hunk 1

- Old lines: `6`
- New lines: `6-7`
- Context: `import Link from "next/link";`
- Added snippets:
  - `import Image from "next/image";`
  - `import { usePathname, useRouter } from "next/navigation";`
- Removed snippets:
  - `import { useRouter } from "next/navigation";`

#### Hunk 2

- Old lines: `8`
- New lines: `9`
- Context: `import { Swiper, SwiperSlide } from "swiper/react";`
- Added snippets:
  - `import { Pagination } from "swiper/modules";`
- Removed snippets:
  - `import { Pagination, Autoplay } from "swiper/modules";`

#### Hunk 3

- Old lines: `10-11`
- New lines: `10`
- Context: `import TourRequirements from "./TourRequirements";`
- Removed snippets:
  - `import LegalBadge from "@/components/website/LegalBadge";`
  - `import Image from "next/image";`

#### Hunk 4

- Old lines: `12`
- New lines: `12-20`
- Context: `import ReviewsClient from "@/components/website/Home/ReviewsClient";`
- Added snippets:
  - `import { buildPackageDoctrine } from "@/lib/packages/packageDoctrine";`
  - `import { buildBookingConfidence } from "@/lib/packages/bookingConfidence";`
  - `import { buildCheckoutPricingSnapshot } from "@/lib/packages/checkoutPricingContract";`
  - `import { calculateInitialPaymentAmount } from "@/lib/packages/paymentPolicy";`
  - `import {`
  - `formatPriceTierRange,`
  - `getMatchingPriceTier,`
  - `getPriceForPax,`
  - `} from "@/lib/packages/priceTiers";`

#### Hunk 5

- Old lines: `35`
- New lines: `42`
- Context: `import {`
- Removed snippets:
  - `Star,`

#### Hunk 6

- Old lines: `52`
- New lines: `58`
- Context: `import {`
- Removed snippets:
  - `Award,`

#### Hunk 7

- Old lines: `54-55`
- New lines: `59`
- Context: `import {`
- Removed snippets:
  - `HardHat,`
  - `Message,`

#### Hunk 8

- Old lines: `57`
- New lines: `60`
- Context: `import {`
- Removed snippets:
  - `Quote,`

#### Hunk 9

- Old lines: `66`
- New lines: `69`
- Context: `interface Props {`
- Added snippets:
  - `// ... (Utilities formatCurrency tetap lokal) ...`
- Removed snippets:
  - `// ... (Utilities formatCurrency & getPriceForPax TETAP SAMA) ...`

#### Hunk 10

- Old lines: `71-80`
- New lines: `73`
- Context: `function formatCurrency(value: number) {`
- Removed snippets:
  - `function getPriceForPax(pax: number, tiers: any[]) {`
  - `if (!tiers || !tiers.length) return null;`
  - `const tier = tiers.find((t) => {`
  - `const minOk = pax >= t.paxMin;`
  - `const maxOk = t.paxMax === 0 ? true : pax <= t.paxMax;`
  - `return minOk && maxOk;`
  - `});`
  - `return tier ? tier.pricePerPerson : null;`
  - `}`

#### Hunk 11

- Old lines: `169-192`
- New lines: `161`
- Context: `function getExperienceIcon(name: string) {`
- Removed snippets:
  - `function calculateDownPayment(dateStr: string, total: number) {`
  - `if (!dateStr) return 0;`
  - `// Parse input "YYYY-MM-DD" menjadi tahun, bulan, tanggal local`
  - `const [y, m, d] = dateStr.split("-").map(Number);`
  - `const tripDate = new Date(y, m - 1, d); // Bulan di JS mulai dari 0`
  - `tripDate.setHours(0, 0, 0, 0);`
  - `const today = new Date();`
  - `today.setHours(0, 0, 0, 0);`
  - `// Hitung selisih hari`
  - `const diffTime = tripDate.getTime() - today.getTime();`
  - `... 9 removed lines omitted ...`

#### Hunk 12

- Old lines: `243`
- New lines: `213`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const pathname = usePathname();`

#### Hunk 13

- Old lines: `244`
- New lines: `215-218`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const packageDoctrine = useMemo(`
  - `() => buildPackageDoctrine(pkg, pathname ?? undefined),`
  - `[pathname, pkg],`
  - `);`

#### Hunk 14

- Old lines: `317`
- New lines: `291-293`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `? hasTieredPricing`
  - `? \`Tiered by pax. Starts from ${formatCurrency(startingPrice)} per person at the largest group tier, then steps up as group size gets smaller.\``
  - `: \`Starts from ${formatCurrency(startingPrice)} per person before add-ons.\``
- Removed snippets:
  - `? \`Starts from ${formatCurrency(startingPrice)} per person before add-ons.\``

#### Hunk 15

- Old lines: `378`
- New lines: `355`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const routeRealityCards = packageDoctrine.routeReality.items;`

#### Hunk 16

- Old lines: `382`
- New lines: `359`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const [heroImage] = useState(pkg.imageUrl || pkg.gallery[0]);`
- Removed snippets:
  - `const [heroImage, setHeroImage] = useState(pkg.imageUrl || pkg.gallery[0]);`

#### Hunk 17

- Old lines: `419-424`
- New lines: `395`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Removed snippets:
  - `const getDayImage = (dayNum: number) => {`
  - `return pkg.gallery && pkg.gallery[dayNum - 1]`
  - `? pkg.gallery[dayNum - 1]`
  - `: pkg.imageUrl;`
  - `};`

#### Hunk 18

- Old lines: `428`
- New lines: `400-409`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const selectedPriceTier = useMemo(`
  - `() => getMatchingPriceTier(Number(pax), pkg.offers.tiers),`
  - `[pax, pkg.offers.tiers],`
  - `);`
  - `const selectedTierLabel = selectedPriceTier`
  - `? formatPriceTierRange(selectedPriceTier)`
  - `: null;`
  - `const hasTieredPricing = pkg.offers.tiers.length > 0;`
  - `const livePricePerPerson = pricePerPerson ?? startingPrice;`
  - `const livePriceLabel = pricePerPerson ? "Selected Pax Price" : "Starts From";`

#### Hunk 19

- Old lines: `429`
- New lines: `411-423`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const paymentDueNow = useMemo(() => {`
  - `if (!total) return 0;`
  - `if (!startDate) return Math.ceil(total * 0.2);`
  - `return calculateInitialPaymentAmount(startDate, total);`
  - `}, [startDate, total]);`
  - `const bookingConfidence = useMemo(`
  - `() =>`
  - `buildBookingConfidence({`
  - `total,`
  - `dateStr: startDate || null,`
  - `... 3 added lines omitted ...`

#### Hunk 20

- Old lines: `461-464`
- New lines: `455-460`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `const pricing = buildCheckoutPricingSnapshot({`
  - `pax: Number(basePayload.pax),`
  - `date: basePayload.date,`
  - `priceTiers: pkg.offers.tiers,`
  - `addonLines: addons,`
  - `});`
- Removed snippets:
  - `const addOnTotal = addons.reduce((sum, a) => sum + a.subtotal, 0);`
  - `const grandTotal = basePayload.packageTotal + addOnTotal;`
  - `const downPayment = calculateDownPayment(basePayload.date, grandTotal);`

#### Hunk 21

- Old lines: `475-478`
- New lines: `471-478`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `pricePerPerson: pricing.pricePerPerson,`
  - `packageTotal: pricing.totalPackage,`
  - `grandTotal: pricing.grandTotal,`
  - `totalPackage: pricing.totalPackage,`
  - `totalAddons: pricing.totalAddons,`
  - `totalDiscount: pricing.totalDiscount,`
  - `discountLabel: pricing.discountLabel,`
  - `downPayment: pricing.downPayment,`
- Removed snippets:
  - `grandTotal,`
  - `totalPackage: basePayload.packageTotal,`
  - `totalAddons: addOnTotal,`
  - `downPayment: downPayment,`

#### Hunk 22

- Old lines: `579`
- New lines: `579`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 23

- Old lines: `582`
- New lines: `582-585`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"`
  - `sizes="100vw"`
- Removed snippets:
  - `className="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"`

#### Hunk 24

- Old lines: `796`
- New lines: `799`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 25

- Old lines: `799`
- New lines: `802-805`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"`
  - `sizes="(max-width: 768px) 128px, 16vw"`
- Removed snippets:
  - `className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"`

#### Hunk 26

- Old lines: `846`
- New lines: `852`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 27

- Old lines: `849`
- New lines: `855-858`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-contain rounded-lg shadow-2xl"`
  - `sizes="100vw"`
- Removed snippets:
  - `className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"`

#### Hunk 28

- Old lines: `909`
- New lines: `919-973`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<PackageSection`
  - `eyebrow="Package doctrine"`
  - `title={packageDoctrine.routeFit.title}`
  - `description={packageDoctrine.routeFit.copy}`
  - `tone="muted"`
  - `>`
  - `<div className="grid grid-cols-1 gap-5 md:grid-cols-3">`
  - `{packageDoctrine.routeFit.items.map((item) => (`
  - `<div`
  - `key={item.title}`
  - `... 45 added lines omitted ...`

#### Hunk 29

- Old lines: `1026`
- New lines: `1090`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 30

- Old lines: `1029`
- New lines: `1093-1096`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-cover"`
  - `sizes="(max-width: 1024px) 100vw, 50vw"`
- Removed snippets:
  - `className="w-full h-full object-cover"`

#### Hunk 31

- Old lines: `1283`
- New lines: `1351-1369`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<div className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-3">`
  - `{packageDoctrine.hotelRooming.items.map((item) => (`
  - `<div`
  - `key={item.title}`
  - `className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"`
  - `>`
  - `<p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-700">`
  - `Accommodation logic`
  - `</p>`
  - `<h3 className="mt-3 text-lg font-black uppercase leading-tight text-slate-900">`
  - `... 8 added lines omitted ...`

#### Hunk 32

- Old lines: `1321`
- New lines: `1407`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 33

- Old lines: `1324`
- New lines: `1410-1413`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-cover transition-transform duration-700 group-hover:scale-110"`
  - `sizes="(max-width: 1024px) 100vw, 33vw"`
- Removed snippets:
  - `className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"`

#### Hunk 34

- Old lines: `1397`
- New lines: `1486`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 35

- Old lines: `1400`
- New lines: `1489-1492`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-contain p-4"`
  - `sizes="(max-width: 1024px) 100vw, 25vw"`
- Removed snippets:
  - `className="max-h-full object-contain"`

#### Hunk 36

- Old lines: `1460`
- New lines: `1552`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 37

- Old lines: `1463`
- New lines: `1555-1558`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-contain p-4"`
  - `sizes="(max-width: 1024px) 100vw, 25vw"`
- Removed snippets:
  - `className="max-h-full object-contain"`

#### Hunk 38

- Old lines: `1650`
- New lines: `1745-1841`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<PackageSection`
  - `eyebrow="Before payment"`
  - `title={packageDoctrine.paymentSummary.title}`
  - `description={packageDoctrine.paymentSummary.copy}`
  - `>`
  - `<div className="grid grid-cols-1 gap-10 xl:grid-cols-2">`
  - `<div>`
  - `<h3 className="text-lg font-bold text-slate-900">`
  - `{packageDoctrine.startEndLogic.title}`
  - `</h3>`
  - `... 87 added lines omitted ...`
- Removed snippets:
  - `{routePlanningNotes.length > 0 ||`

#### Hunk 39

- Old lines: `1668`
- New lines: `1860-1895`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `{routeRealityCards.length > 0 ? (`
  - `<div className="mb-6">`
  - `<div className="mb-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">`
  - `<div>`
  - `<p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-700">`
  - `Live route filters`
  - `</p>`
  - `<h3 className="mt-2 text-xl font-black uppercase text-slate-900">`
  - `{packageDoctrine.routeReality.title}`
  - `</h3>`
  - `... 25 added lines omitted ...`

#### Hunk 40

- Old lines: `1746`
- New lines: `1974-2014`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<div className="mt-10 border-t border-slate-200 pt-10">`
  - `<div className="mb-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">`
  - `<div>`
  - `<p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-700">`
  - `Compare route shape`
  - `</p>`
  - `<h3 className="mt-2 text-xl font-black uppercase text-slate-900">`
  - `{packageDoctrine.closestAlternative.title}`
  - `</h3>`
  - `</div>`
  - `... 31 added lines omitted ...`

#### Hunk 41

- Old lines: `1949`
- New lines: `2218-2272`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<div className="mb-6 rounded-2xl border border-[#dce4c7] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf1_100%)] p-4">`
  - `<p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-700">`
  - `{bookingConfidence.eyebrow}`
  - `</p>`
  - `<h3 className="mt-2 text-base font-black uppercase leading-tight text-slate-900">`
  - `{bookingConfidence.title}`
  - `</h3>`
  - `<div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">`
  - `<p className="text-[11px] font-black uppercase tracking-[0.16em] text-lime-700">`
  - `{bookingConfidence.paymentNowLabel}`
  - `... 45 added lines omitted ...`

#### Hunk 42

- Old lines: `2108`
- New lines: `2432-2439`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `{selectedTierLabel ? (`
  - `<div className="flex justify-between">`
  - `<span className="text-slate-500">Active pax tier:</span>`
  - `<span className="font-bold text-slate-700">`
  - `{selectedTierLabel}`
  - `</span>`
  - `</div>`
  - `) : null}`

#### Hunk 43

- Old lines: `2130`
- New lines: `2462-2472`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">`
  - `{bookingConfidence.links.map((link) => (`
  - `<Link`
  - `key={link.href}`
  - `href={link.href}`
  - `className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-black uppercase tracking-[0.16em] text-slate-700 transition-colors hover:border-lim...`
  - `>`
  - `{link.label}`
  - `</Link>`
  - `))}`
  - `... 1 added lines omitted ...`

#### Hunk 44

- Old lines: `2132-2139`
- New lines: `2474-2476`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<p className="text-xs leading-5 text-slate-500">`
  - `Final booking terms, payment handling, and what counts operationally are fixed by the written booking flow and Official E-Voucher.`
  - `</p>`
- Removed snippets:
  - `<a`
  - `href="/policy/booking-payment-cancellation"`
  - `target="_blank"`
  - `rel="noopener noreferrer"`
  - `className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-4 transition"`
  - `>`
  - `View Cancellation Policy`
  - `</a>`

#### Hunk 45

- Old lines: `2258`
- New lines: `2595`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<Image`
- Removed snippets:
  - `<img`

#### Hunk 46

- Old lines: `2261`
- New lines: `2598-2601`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `fill`
  - `unoptimized`
  - `className="object-contain p-1"`
  - `sizes="80px"`
- Removed snippets:
  - `className="h-full w-full object-contain p-1"`

#### Hunk 47

- Old lines: `2359`
- New lines: `2699`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `{livePriceLabel}`
- Removed snippets:
  - `Start From`

#### Hunk 48

- Old lines: `2363`
- New lines: `2703`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `{formatCurrency(livePricePerPerson)}`
- Removed snippets:
  - `{formatCurrency(pkg.offers.aggregateOffer.lowPrice)}`

#### Hunk 49

- Old lines: `2368`
- New lines: `2709-2717`
- Context: `export default function PackageDetailPage({ initialData,reviews }: Props) {`
- Added snippets:
  - `<p className="mt-1 text-[10px] text-slate-400">`
  - `{pricePerPerson`
  - `? selectedTierLabel`
  - `? \`Based on ${selectedTierLabel}.\``
  - `: \`Based on ${pax} travelers.\``
  - `: hasTieredPricing`
  - `? "Pricing steps by traveler count."`
  - `: "Live package rate."}`
  - `</p>`

### src/lib/packages/bookingConfidence.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-75`
- Added snippets:
  - `import {`
  - `getInitialPaymentNarrative,`
  - `getPaymentLogicNarrative,`
  - `} from "@/lib/packages/paymentPolicy";`
  - `export type BookingConfidenceLink = {`
  - `label: string;`
  - `href: string;`
  - `};`
  - `export type BookingConfidenceStep = {`
  - `title: string;`
  - `... 59 added lines omitted ...`

### src/lib/packages/checkoutPricingContract.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-261`
- Added snippets:
  - `import {`
  - `calculateInitialPaymentAmount,`
  - `getInitialPaymentMode,`
  - `type InitialPaymentMode,`
  - `} from "@/lib/packages/paymentPolicy";`
  - `import {`
  - `formatPriceTierRange,`
  - `getLowestTierPrice,`
  - `getMatchingPriceTier,`
  - `getPriceForPax,`
  - `... 227 added lines omitted ...`

### src/lib/packages/isicEligibleRoutes.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-46`
- Added snippets:
  - `import type { ListTourPackage } from "@/types";`
  - `export interface IsicEligibleRoute {`
  - `internalStudentSlug: string;`
  - `publicRouteSlug: string;`
  - `}`
  - `// Phase-two baseline pinned these student-package rows as internal-only mirror rows.`
  - `// The public ISIC page should therefore resolve to the underlying public routes that`
  - `// remain bookable, while keeping student-price verification as a separate step.`
  - `export const ISIC_ELIGIBLE_ROUTE_MAP: readonly IsicEligibleRoute[] = [`
  - `{`
  - `... 32 added lines omitted ...`

### src/lib/packages/packageDoctrine.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-544`
- Added snippets:
  - `import type { TourPackageDetail } from "@/interfaces";`
  - `type PackageProduct = TourPackageDetail["product"];`
  - `export type PackageDoctrineCard = {`
  - `title: string;`
  - `copy: string;`
  - `};`
  - `export type PackageDoctrineMetric = {`
  - `label: string;`
  - `value: string;`
  - `};`
  - `... 483 added lines omitted ...`

### src/lib/packages/packagePaths.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-39`
- Added snippets:
  - `import { url } from "@/lib/site";`
  - `type PackageSlugInput = string | string[] | null | undefined;`
  - `export function normalizePackageSlug(input: PackageSlugInput): string {`
  - `if (Array.isArray(input)) {`
  - `input = input.join("/");`
  - `}`
  - `if (!input) return "";`
  - `return input`
  - `.replace(/\\/g, "/")`
  - `.trim()`
  - `... 20 added lines omitted ...`

### src/lib/packages/paymentPolicy.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-131`
- Added snippets:
  - `export const FULL_PAYMENT_THRESHOLD_DAYS = 7;`
  - `export const MANUAL_VERIFICATION_THRESHOLD_DAYS = 5;`
  - `export const STANDARD_DEPOSIT_RATIO = 0.2;`
  - `export const CARD_BALANCE_DEADLINE_DAYS = 5;`
  - `export const BANK_TRANSFER_BALANCE_DEADLINE_DAYS = 3;`
  - `export const PAYMENT_GATE_RULE_COPY =`
  - `"More than 7 days before Day 1 usually starts with a 20% deposit. At 7 days or less, JVTO can require full payment. The most urgent requests may also shift to manual verificatio...`
  - `export const BALANCE_DEADLINE_RULE_COPY =`
  - `"If a balance remains after deposit, card settlement is due 5 calendar days before Day 1, while bank transfer or Wise settlement is due 3 calendar days before Day 1.";`
  - `export const VOUCHER_CONFIRMATION_RULE_COPY =`
  - `... 98 added lines omitted ...`

### src/lib/packages/priceTiers.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-63`
- Added snippets:
  - `export interface PriceTierLike {`
  - `paxMin: number;`
  - `paxMax: number;`
  - `pricePerPerson: number;`
  - `}`
  - `export function getMatchingPriceTier<T extends PriceTierLike>(`
  - `pax: number,`
  - `tiers: T[] | null | undefined,`
  - `): T | null {`
  - `if (!tiers || !tiers.length) return null;`
  - `... 44 added lines omitted ...`

### src/lib/packages/tourFamily.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-169`
- Added snippets:
  - `import type { ListTourPackage } from "@/types";`
  - `export type TourFamilyId =`
  - `| "ultra-efficient-bromo"`
  - `| "short-bromo-overnight"`
  - `| "focused-ijen"`
  - `| "flagship-3-day"`
  - `| "east-java-overland"`
  - `| "family-route";`
  - `export type TourFamilyMeta = {`
  - `id: TourFamilyId;`
  - `... 134 added lines omitted ...`

### src/lib/packages/webTourList.ts

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `2`
- New lines: `3`
- Context: `import { MOCK_PACKAGES } from "@/data/mockData";`
- Added snippets:
  - `import { getEntryReferencePrice } from "@/lib/packages/priceTiers";`

#### Hunk 2

- Old lines: `29-35`
- New lines: `30-35`
- Context: `function serializePackage(pkg: any) {`
- Added snippets:
  - `const tiers = (pkg.package_prices ?? []).map((p: any) => ({`
  - `paxMin: Number(p.price_tiers?.min_pax) || 0,`
  - `paxMax: Number(p.price_tiers?.max_pax) || 0,`
  - `pricePerPerson: Number(p.price) || 0,`
  - `}));`
  - `const startFrom = getEntryReferencePrice(tiers) ?? 0;`
- Removed snippets:
  - `const validPrices: number[] = (pkg.package_prices ?? [])`
  - `.map((p: any) => p.price)`
  - `.filter(`
  - `(price: any): price is number => typeof price === "number" && price > 0,`
  - `);`
  - `const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;`

## Homepage

### src/app/(website)/page.tsx

- Status: `M`
- Total hunk: **13**

#### Hunk 1

- Old lines: `5`
- New lines: `5`
- Context: `import Hero from "@/components/website/Home/Hero";`
- Added snippets:
  - `import HomeAuthorityReality from "@/components/website/Home/HomeAuthorityReality";`
- Removed snippets:
  - `import HomeDifferentiators from "@/components/website/Home/HomeDifferentiators";`

#### Hunk 2

- Old lines: `8-12`
- New lines: `8`
- Context: `import HomeFinalCta from "@/components/website/Home/HomeFinalCta";`
- Added snippets:
  - `import HomeTrustGateway from "@/components/website/Home/HomeTrustGateway";`
- Removed snippets:
  - `import HomeReviewProofBanner from "@/components/website/Home/HomeReviewProofBanner";`
  - `import HomeTrustMetricBar from "@/components/website/Home/HomeTrustMetricBar";`
  - `import WhyJVTO from "@/components/website/Home/WhyJVTO";`
  - `import Reviews from "@/components/website/Home/Reviews";`
  - `import IjenHealthScreeningSection from "@/components/website/Home/IjenHealthScreeningSection";`

#### Hunk 3

- Old lines: `14-16`
- New lines: `9`
- Context: `import HomeDestinations from "@/components/website/Home/HomeDestinations";`
- Removed snippets:
  - `import IsicSection from "@/components/website/Home/IsicSection";`
  - `import FAQSection from "@/components/website/FAQSection";`
  - `import Contact from "@/components/website/Contact";`

#### Hunk 4

- Old lines: `23`
- New lines: `15`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Removed snippets:
  - `import { miniFaqs, faqsCopy } from "@/constants";`

#### Hunk 5

- Old lines: `28-29`
- New lines: `20`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Tourist Police-Led Private Volcano Tours in East Java | JVTO",`
- Removed snippets:
  - `title:`
  - `"Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",`

#### Hunk 6

- Old lines: `32`
- New lines: `23`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed operator (No.1102230032918), led by an active Tourist Police officer.",`
- Removed snippets:
  - `"Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen hea...`

#### Hunk 7

- Old lines: `112-119`
- New lines: `103-108`
- Context: `const Home = async () => {`
- Added snippets:
  - `const core = { ...node };`
  - `delete core["@context"];`
  - `delete core.additionalProperty;`
  - `delete core.amenityFeature;`
  - `delete core.subjectOf;`
  - `delete core.mainEntityOfPage;`
- Removed snippets:
  - `const {`
  - `"@context": _ctx,`
  - `additionalProperty: _ap,`
  - `amenityFeature: _af,`
  - `subjectOf: _so,`
  - `mainEntityOfPage: _mep,`
  - `...core`
  - `} = node;`

#### Hunk 8

- Old lines: `125-140`
- New lines: `113`
- Context: `const Home = async () => {`
- Removed snippets:
  - `// ── FAQPage ───────────────────────────────────────────────────────────────`
  - `const faqNode =`
  - `miniFaqs?.length > 0`
  - `? {`
  - `"@type": "FAQPage",`
  - `"@id": \`${SITE_URL}/#faqpage\`,`
  - `mainEntity: miniFaqs.map(`
  - `(faq: { question: string; answer: string }) => ({`
  - `"@type": "Question",`
  - `name: faq.question,`
  - `... 5 removed lines omitted ...`

#### Hunk 9

- Old lines: `173`
- New lines: `146`
- Context: `const Home = async () => {`
- Added snippets:
  - `extraSchemas={[serviceNode, ...attractionNodes, healthAppNode]}`
- Removed snippets:
  - `extraSchemas={[serviceNode, ...attractionNodes, faqNode, healthAppNode]}`

#### Hunk 10

- Old lines: `176-178`
- New lines: `149`
- Context: `const Home = async () => {`
- Added snippets:
  - `<HomeAuthorityReality />`
- Removed snippets:
  - `<HomeTrustMetricBar />`
  - `<HomeDifferentiators />`
  - `<IjenHealthScreeningSection />`

#### Hunk 11

- Old lines: `180`
- New lines: `150`
- Context: `const Home = async () => {`
- Removed snippets:
  - `{/* Pass destinations dari sini — tidak perlu fetch ulang di HomeDestinations */}`

#### Hunk 12

- Old lines: `182-201`
- New lines: `152`
- Context: `const Home = async () => {`
- Added snippets:
  - `<HomeTrustGateway />`
- Removed snippets:
  - `<WhyJVTO />`
  - `<div className="bg-jvto-green/5 pt-20 pb-20">`
  - `<div className="w-full container mx-auto">`
  - `<div className="max-w-3xl mx-auto px-4">`
  - `<h2 className="text-3xl md:text-4xl font-black text-center uppercase mb-3 text-jvto-dark">`
  - `What Our Guests Say`
  - `</h2>`
  - `<p className="text-lg text-center">`
  - `Real experiences from travelers who trusted us with their East`
  - `Java adventure.`
  - `... 8 removed lines omitted ...`

#### Hunk 13

- Old lines: `204`
- New lines: `154`
- Context: `const Home = async () => {`
- Removed snippets:
  - `<Contact />`

### src/components/website/Home/FeaturedToursClient.tsx

- Status: `M`
- Total hunk: **22**

#### Hunk 1

- Old lines: `3`
- New lines: `3`
- Added snippets:
  - `import { useRef, useState } from "react";`
- Removed snippets:
  - `import { useRef, forwardRef } from "react";`

#### Hunk 2

- Old lines: `7`
- New lines: `7-14`
- Context: `import TourCard from "../TourCard";`
- Added snippets:
  - `import {`
  - `MapPin,`
  - `ArrowLeft,`
  - `ArrowRight,`
  - `ShieldCheck,`
  - `Users,`
  - `Waypoints,`
  - `} from "lucide-react";`
- Removed snippets:
  - `import {MapPin, ArrowLeft, ArrowRight, ShieldCheck, Users, Waypoints } from "lucide-react";`

#### Hunk 3

- Old lines: `18`
- New lines: `25`
- Context: `interface TourRowProps {`
- Added snippets:
  - `hubHref: string;`
- Removed snippets:
  - `bgColor?: string; // Opsional untuk membedakan background section`

#### Hunk 4

- Old lines: `21-56`
- New lines: `28-39`
- Context: `interface TourRowProps {`
- Added snippets:
  - `const TourCarouselRow = ({ title, tours, hubHref }: TourRowProps) => {`
  - `const scrollContainerRef = useRef<HTMLDivElement>(null);`
  - `const scroll = (direction: "left" | "right") => {`
  - `if (!scrollContainerRef.current) return;`
  - `const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;`
  - `scrollContainerRef.current.scrollBy({`
  - `left: direction === "left" ? -scrollAmount : scrollAmount,`
  - `behavior: "smooth",`
  - `});`
  - `};`
- Removed snippets:
  - `// --- SUB-COMPONENT: TOUR CAROUSEL ROW ---`
  - `// Menggunakan forwardRef agar parent bisa melakukan scrollIntoView ke komponen ini`
  - `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
  - `({ title, tours, bgColor = "bg-white" }, ref) => {`
  - `const scrollContainerRef = useRef<HTMLDivElement>(null);`
  - `// Logic scroll horizontal (kiri/kanan) untuk carousel`
  - `const scroll = (direction: "left" | "right") => {`
  - `if (scrollContainerRef.current) {`
  - `// Scroll sebesar 80% dari lebar layar agar user masih melihat konteks item berikutnya`
  - `const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;`
  - `... 23 removed lines omitted ...`

#### Hunk 5

- Old lines: `58-59`
- New lines: `41-64`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `if (tours.length === 0) return null;`
  - `return (`
  - `<section className="border-t border-[#e7ebdd] bg-white py-8 md:py-10">`
  - `<div className="container mx-auto px-6">`
  - `<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">`
  - `<div>`
  - `<h3 className="text-2xl font-black uppercase tracking-wide text-jvto-dark md:text-3xl">`
  - `{title}`
  - `</h3>`
  - `<p className="mt-1 text-sm text-gray-500 md:text-base">`
  - `... 12 added lines omitted ...`
- Removed snippets:
  - `{/* Tombol Panah Kiri/Kanan */}`
  - `<div className="hidden md:flex gap-3">`

#### Hunk 6

- Old lines: `62`
- New lines: `67`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-jvto-dark hover:bg-jvto-dark hover:text-...`
- Removed snippets:
  - `className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-jvto-dark hover:text-white hover:border-jvto-dark transition-a...`

#### Hunk 7

- Old lines: `65`
- New lines: `70`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />`
- Removed snippets:
  - `<ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />`

#### Hunk 8

- Old lines: `69`
- New lines: `74`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-jvto-dark hover:bg-jvto-dark hover:text-...`
- Removed snippets:
  - `className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-jvto-dark hover:text-white hover:border-jvto-dark transition-a...`

#### Hunk 9

- Old lines: `72`
- New lines: `77`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />`
- Removed snippets:
  - `<ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />`

#### Hunk 10

- Old lines: `75`
- New lines: `81`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `</div>`

#### Hunk 11

- Old lines: `77-92`
- New lines: `83-98`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `<div className="relative -mx-6 md:mx-0 md:px-0">`
  - `<div`
  - `ref={scrollContainerRef}`
  - `className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide md:gap-6"`
  - `style={{ scrollBehavior: "smooth" }}`
  - `>`
  - `{tours.map((tour, key) => (`
  - `<div`
  - `key={tour.id}`
  - `className={\`${key === 0 ? "ml-6" : ""} ${`
  - `... 6 added lines omitted ...`
- Removed snippets:
  - `{/* Carousel Container */}`
  - `<div className="relative -mx-6 md:mx-0 md:px-0">`
  - `<div`
  - `ref={scrollContainerRef}`
  - `className="flex md:gap-6 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"`
  - `style={{ scrollBehavior: "smooth" }}`
  - `>`
  - `{tours.map((tour,key) => (`
  - `<div`
  - `key={tour.id}`
  - `... 6 removed lines omitted ...`

#### Hunk 12

- Old lines: `95-101`
- New lines: `101-104`
- Context: `const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(`
- Added snippets:
  - `</div>`
  - `</section>`
  - `);`
  - `};`
- Removed snippets:
  - `</section>`
  - `);`
  - `}`
  - `);`
  - `// Diperlukan displayName untuk debugging React Component dengan forwardRef`
  - `TourCarouselRow.displayName = "TourCarouselRow";`

#### Hunk 13

- Old lines: `108-124`
- New lines: `111-129`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `const [activeOrigin, setActiveOrigin] = useState<"surabaya" | "bali">(`
  - `"surabaya",`
  - `);`
  - `const activeRow =`
  - `activeOrigin === "surabaya"`
  - `? {`
  - `key: "surabaya",`
  - `label: "From Surabaya",`
  - `hubHref: "/tours/from-surabaya",`
  - `note: "Best when you want the widest East Java route spread with cleaner mainland airport logic.",`
  - `... 9 added lines omitted ...`
- Removed snippets:
  - `// Ref untuk target scroll`
  - `const surabayaRef = useRef<HTMLDivElement>(null);`
  - `const baliRef = useRef<HTMLDivElement>(null);`
  - `// Handler untuk scroll ke section tertentu`
  - `const scrollToSection = (location: "surabaya" | "bali") => {`
  - `const targetRef = location === "surabaya" ? surabayaRef : baliRef;`
  - `if (targetRef.current) {`
  - `// Offset -100px agar judul section tidak tertutup sticky header (jika ada)`
  - `const yOffset = -100;`
  - `const element = targetRef.current;`
  - `... 4 removed lines omitted ...`

#### Hunk 14

- Old lines: `127-128`
- New lines: `132`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `<div className="min-h-screen bg-white">`
- Removed snippets:
  - `<div className="bg-white min-h-screen">`
  - `{/* --- HERO / HEADER SECTION --- */}`

#### Hunk 15

- Old lines: `158-159`
- New lines: `162-166`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `<div`
  - `role="tablist"`
  - `aria-label="Homepage tour origins"`
  - `className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-4"`
  - `>`
- Removed snippets:
  - `{/* --- NAVIGATION BUTTONS --- */}`
  - `<div className="flex mt-8 items-center justify-center md:gap-4 gap-2 relative z-10">`

#### Hunk 16

- Old lines: `161-162`
- New lines: `168-177`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `id="tab-surabaya"`
  - `role="tab"`
  - `aria-selected={activeOrigin === "surabaya"}`
  - `aria-controls="homepage-origin-panel"`
  - `onClick={() => setActiveOrigin("surabaya")}`
  - `className={\`w-full rounded-lg border-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 sm:w-auto md:px-8 ${`
  - `activeOrigin === "surabaya"`
  - `? "border-jvto-dark bg-jvto-dark text-white shadow-xl"`
  - `: "border-jvto-dark bg-white text-jvto-dark shadow-sm hover:-translate-y-1 hover:bg-jvto-dark hover:text-white"`
  - `}\`}`
- Removed snippets:
  - `onClick={() => scrollToSection("surabaya")}`
  - `className="w-full sm:w-auto md:px-8 py-3 bg-white border-2 border-jvto-dark text-jvto-dark font-bold uppercase tracking-wider rounded-lg shadow-sm hover:-translate-y-1 hover:sha...`

#### Hunk 17

- Old lines: `166`
- New lines: `180`
- Context: `const FeaturedToursClient = ({`

#### Hunk 18

- Old lines: `168-169`
- New lines: `182-191`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `id="tab-bali"`
  - `role="tab"`
  - `aria-selected={activeOrigin === "bali"}`
  - `aria-controls="homepage-origin-panel"`
  - `onClick={() => setActiveOrigin("bali")}`
  - `className={\`w-full rounded-lg border-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 sm:w-auto md:px-8 ${`
  - `activeOrigin === "bali"`
  - `? "border-jvto-dark bg-jvto-dark text-white shadow-xl"`
  - `: "border-jvto-dark bg-white text-jvto-dark shadow-sm hover:-translate-y-1 hover:bg-jvto-dark hover:text-white"`
  - `}\`}`
- Removed snippets:
  - `onClick={() => scrollToSection("bali")}`
  - `className="w-full sm:w-auto md:px-8 py-3 bg-white border-2 border-jvto-dark text-jvto-dark font-bold uppercase tracking-wider rounded-lg shadow-sm hover:-translate-y-1 hover:sha...`

#### Hunk 19

- Old lines: `173`
- New lines: `196-199`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `<div className="mt-5 text-sm text-gray-600">`
  - `{activeRow.note}`
  - `</div>`

#### Hunk 20

- Old lines: `176-183`
- New lines: `202`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `<div id="homepage-origin-panel" role="tabpanel" aria-labelledby={\`tab-${activeRow.key}\`}>`
- Removed snippets:
  - `{/* --- CONTENT SECTIONS (STACKED) --- */}`
  - `<div>`
  - `<TourCarouselRow`
  - `ref={surabayaRef}`
  - `title="Tours From Surabaya"`
  - `tours={surabayaTours}`
  - `/>`

#### Hunk 21

- Old lines: `185-187`
- New lines: `204-206`
- Context: `const FeaturedToursClient = ({`
- Added snippets:
  - `title={activeRow.label}`
  - `tours={activeRow.tours}`
  - `hubHref={activeRow.hubHref}`
- Removed snippets:
  - `ref={baliRef}`
  - `title="Tours From Bali"`
  - `tours={baliTours}`

#### Hunk 22

- Old lines: `191`
- New lines: `209`
- Context: `const FeaturedToursClient = ({`
- Removed snippets:
  - `{/* --- FOOTER CTA --- */}`

### src/components/website/Home/Hero.tsx

- Status: `M`
- Total hunk: **17**

#### Hunk 1

- Old lines: `4-11`
- New lines: `4-5`
- Context: `import Button from "../UI/Button";`
- Added snippets:
  - `import { ArrowRight, CheckCircle2, ShieldCheck, Star, Waves } from "lucide-react";`
  - `import { homepageHeroDoctrine } from "@/lib/homepage/homepageDoctrine";`
- Removed snippets:
  - `import {`
  - `Activity,`
  - `CheckCircle2,`
  - `FileCheck2,`
  - `ShieldCheck,`
  - `Star,`
  - `Waves,`
  - `} from "lucide-react";`

#### Hunk 2

- Old lines: `18-45`
- New lines: `11`
- Context: `interface HeroProps {`
- Removed snippets:
  - `const highlights = [`
  - `"Private tours only",`
  - `"Licensed Indonesian operator",`
  - `"No shared groups",`
  - `"Ijen screening before night trek",`
  - `];`
  - `const auditSteps = [`
  - `{`
  - `id: "LEGAL",`
  - `title: "Legal Entity",`
  - `... 16 removed lines omitted ...`

#### Hunk 3

- Old lines: `51`
- New lines: `17`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<section className="relative min-h-[90vh] overflow-hidden">`
- Removed snippets:
  - `<section className="relative overflow-hidden bg-authority-navy text-white">`

#### Hunk 4

- Old lines: `54-55`
- New lines: `20-21`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `src="/assets/img/hero/home.webp"`
  - `alt="East Java volcano landscape used on the JVTO homepage"`
- Removed snippets:
  - `src="/founder/mr-sam-tourist-police-portrait.png"`
  - `alt="Agung Sambuko, Tourist Police-led founder of JVTO"`

#### Hunk 5

- Old lines: `60`
- New lines: `26`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `className="object-cover"`
- Removed snippets:
  - `className="object-cover object-top grayscale"`

#### Hunk 6

- Old lines: `62-63`
- New lines: `28-29`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<div className="absolute inset-0 bg-black/50" />`
  - `<div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-[#101820]/30 to-black/15" />`
- Removed snippets:
  - `<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.22),transparent_30%),linear-gradient(90deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.9)_42...`
  - `<div className="grid-pattern absolute inset-0 opacity-20" />`

#### Hunk 7

- Old lines: `66-72`
- New lines: `32-36`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<div className="relative z-10 container mx-auto flex min-h-[90vh] items-center px-6 pt-28 pb-16 text-white">`
  - `<div className="mx-auto max-w-5xl text-center">`
  - `<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/90 ba...`
  - `<ShieldCheck className="h-4 w-4 text-jvto-green" />`
  - `{homepageHeroDoctrine.eyebrow}`
- Removed snippets:
  - `<div className="relative z-10 border-b border-white/10 bg-black/30">`
  - `<div className="container mx-auto flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">`
  - `<div className="flex items-center gap-3">`
  - `<span className="status-live" />`
  - `<span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-safety-orange">`
  - `60s Fast Audit`
  - `</span>`

#### Hunk 8

- Old lines: `74-104`
- New lines: `37`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Removed snippets:
  - `<div className="flex flex-wrap items-center gap-3 lg:gap-6">`
  - `{auditSteps.map(({ id, title, status, Icon }) => (`
  - `<div key={id} className="inline-flex items-center gap-2 text-white/90">`
  - `<span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/8">`
  - `<Icon className="h-4 w-4 text-verified-bright" />`
  - `</span>`
  - `<div className="leading-tight">`
  - `<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">`
  - `{title}`
  - `</p>`
  - `... 19 removed lines omitted ...`

#### Hunk 9

- Old lines: `106-108`
- New lines: `39-41`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<h1 className="mx-auto max-w-5xl text-3xl font-black leading-tight uppercase tracking-tight md:text-6xl">`
  - `{title}`
  - `</h1>`
- Removed snippets:
  - `<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">`
  - `{description}`
  - `</p>`

#### Hunk 10

- Old lines: `110-120`
- New lines: `43-45`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-200 md:text-xl">`
  - `{description}`
  - `</p>`
- Removed snippets:
  - `<div className="mt-8 flex flex-wrap gap-3">`
  - `{highlights.map((item) => (`
  - `<span`
  - `key={item}`
  - `className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/90 backdrop-blur"`
  - `>`
  - `<CheckCircle2 className="h-4 w-4 text-verified-bright" />`
  - `{item}`
  - `</span>`
  - `))}`
  - `... 1 removed lines omitted ...`

#### Hunk 11

- Old lines: `122-130`
- New lines: `47-51`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/90">`
  - `{homepageHeroDoctrine.highlights.map((item) => (`
  - `<span`
  - `key={item}`
  - `className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur"`
- Removed snippets:
  - `<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">`
  - `<Button to="/tours" variant="primary" size="lg" className="shadow-[0_18px_40px_rgba(163,230,53,0.2)]">`
  - `Browse Private Tours`
  - `</Button>`
  - `<Button`
  - `to="/verify-jvto"`
  - `variant="outline"`
  - `size="lg"`
  - `className="border-white/20 bg-white/6 text-white hover:border-white hover:bg-white hover:!text-authority-navy"`

#### Hunk 12

- Old lines: `132-147`
- New lines: `53-54`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<CheckCircle2 className="h-4 w-4 text-jvto-green" />`
  - `{item}`
- Removed snippets:
  - `Open Verify JVTO`
  - `</Button>`
  - `<Button`
  - `to="/travel-guide/weather-and-closures"`
  - `variant="ghost"`
  - `size="lg"`
  - `className="border border-white/15 bg-black/15 text-white hover:bg-white/10"`
  - `>`
  - `Route Conditions`
  - `</Button>`
  - `... 5 removed lines omitted ...`

#### Hunk 13

- Old lines: `149-153`
- New lines: `56`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `))}`
- Removed snippets:
  - `<span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />`
  - `<span>Prepare &amp; Book support built in</span>`
  - `<span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />`
  - `<span>Proof before payment</span>`
  - `</div>`

#### Hunk 14

- Old lines: `156-168`
- New lines: `59-71`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">`
  - `<Button to="/tours/from-surabaya" variant="white" size="lg">`
  - `From Surabaya`
  - `</Button>`
  - `<Button`
  - `to="/tours/from-bali"`
  - `variant="outline"`
  - `size="lg"`
  - `className="border-white text-white hover:bg-white hover:!text-black"`
  - `>`
  - `... 3 added lines omitted ...`
- Removed snippets:
  - `<div className="lg:justify-self-end">`
  - `<div className="bento-card max-w-xl border-white/12 bg-white/8 p-7 text-white backdrop-blur-xl lg:ml-auto lg:bg-white/6">`
  - `<div className="mb-5 flex items-center justify-between gap-4">`
  - `<div>`
  - `<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">`
  - `Operator Proof Path`
  - `</p>`
  - `<h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">`
  - `Verify before you pay.`
  - `</h2>`
  - `... 3 removed lines omitted ...`

#### Hunk 15

- Old lines: `170-210`
- New lines: `73-78`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-bold uppercase tracking-wide text-white/80">`
  - `<Link href="/tours" className="inline-flex items-center gap-2 hover:text-white">`
  - `View all tours`
  - `<ArrowRight className="h-4 w-4" />`
  - `</Link>`
  - `</div>`
- Removed snippets:
  - `<div className="space-y-4 border-t border-white/10 pt-5">`
  - `<div className="flex items-start justify-between gap-4">`
  - `<div>`
  - `<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">`
  - `Legal Identity`
  - `</p>`
  - `<p className="mt-1 text-sm leading-6 text-slate-200">`
  - `PT Java Volcano Rendezvous with visible verification routes and policy path.`
  - `</p>`
  - `</div>`
  - `... 31 removed lines omitted ...`

#### Hunk 16

- Old lines: `212-229`
- New lines: `80-88`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-sm border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85 backdrop-blur">`
  - `<span className="inline-flex items-center gap-2">`
  - `<Waves className="h-4 w-4 text-jvto-green" />`
  - `{homepageHeroDoctrine.trustStrip[0]}`
  - `</span>`
  - `<span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />`
  - `<span>{homepageHeroDoctrine.trustStrip[1]}</span>`
  - `<span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />`
  - `<span>{homepageHeroDoctrine.trustStrip[2]}</span>`
- Removed snippets:
  - `<Link`
  - `href="https://www.trustpilot.com/review/javavolcano-touroperator.com"`
  - `target="_blank"`
  - `rel="noreferrer"`
  - `className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-3 text-white transition-colors hover:bg-black/30"`
  - `aria-label="Read JVTO reviews on Trustpilot"`
  - `>`
  - `<span className="font-bold underline">Excellent</span>`
  - `<span className="inline-flex items-center gap-1 text-verified-bright">`
  - `<Star className="h-4 w-4 fill-current" />`
  - `... 8 removed lines omitted ...`

#### Hunk 17

- Old lines: `230`
- New lines: `90-120`
- Context: `const Hero: React.FC<HeroProps> = ({`
- Added snippets:
  - `<Link`
  - `href="/verify-jvto"`
  - `className="mx-auto mt-5 flex w-full max-w-3xl items-center justify-between rounded-sm border border-lime-400/35 bg-lime-400/10 px-4 py-3 text-left text-sm font-bold uppercase tr...`
  - `>`
  - `<span>All legal documents publicly verifiable</span>`
  - `<span className="inline-flex items-center gap-2 text-lime-200">`
  - `Verify JVTO`
  - `<ArrowRight className="h-4 w-4" />`
  - `</span>`
  - `</Link>`
  - `... 19 added lines omitted ...`

### src/components/website/Home/HomeAuthorityReality.tsx

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-82`
- Added snippets:
  - `import Link from "next/link";`
  - `import {`
  - `Activity,`
  - `ArrowRight,`
  - `Building2,`
  - `ShieldCheck,`
  - `Waves,`
  - `} from "lucide-react";`
  - `import { homepageAuthorityRealityDoctrine } from "@/lib/homepage/homepageDoctrine";`
  - `const iconMap = {`
  - `... 67 added lines omitted ...`

### src/components/website/Home/HomeDifferentiators.tsx

- Status: `M`
- Total hunk: **7**

#### Hunk 1

- Old lines: `1-2`
- New lines: `1`
- Added snippets:
  - `import { Activity, FileCheck2, ShieldCheck, Stethoscope } from "lucide-react";`
- Removed snippets:
  - `import Link from "next/link";`
  - `import { Activity, ArrowRight, Lock, ShieldCheck, Waves } from "lucide-react";`

#### Hunk 2

- Old lines: `6-8`
- New lines: `5-6`
- Context: `const differentiators = [`
- Added snippets:
  - `title: "Police Leadership",`
  - `copy: "Founded and led with Tourist Police context, not anonymous outsourced branding.",`
- Removed snippets:
  - `title: "You Know Who's Leading",`
  - `copy: "Founded by an active Tourist Police officer. Route discipline comes from real field accountability, not brochure language.",`
  - `href: "/verify-jvto/police-safety",`

#### Hunk 3

- Old lines: `12-15`
- New lines: `10-12`
- Context: `const differentiators = [`
- Added snippets:
  - `title: "Medical Protocols",`
  - `copy: "Ijen routes connect to real screening guidance before night ascent decisions are made.",`
  - `Icon: Stethoscope,`
- Removed snippets:
  - `title: "Screened Before You Climb",`
  - `copy: "Ijen access is gated by licensed doctor clearance. The workflow is visible before you commit, not discovered after you arrive.",`
  - `href: "/travel-guide/ijen-health-screening",`
  - `Icon: Activity,`

#### Hunk 4

- Old lines: `18-21`
- New lines: `15-17`
- Context: `const differentiators = [`
- Added snippets:
  - `title: "Proof Before Payment",`
  - `copy: "Verification, policy, and operator identity stay visible before deposit decisions.",`
  - `Icon: FileCheck2,`
- Removed snippets:
  - `title: "Fully Traceable, Not Anonymous",`
  - `copy: "A registered PT with visible legal documents and office identity. Every core claim can be verified before booking.",`
  - `href: "/verify-jvto/legal",`
  - `Icon: Lock,`

#### Hunk 5

- Old lines: `24-27`
- New lines: `20-22`
- Context: `const differentiators = [`
- Added snippets:
  - `title: "Private Route Handling",`
  - `copy: "Pickup logic, longer transfers, and route seriousness are built around private operations.",`
  - `Icon: Activity,`
- Removed snippets:
  - `title: "No Static Volcano Assumptions",`
  - `copy: "Bromo and Ijen decisions should follow live volcanic context. Route planning is stronger when status is treated seriously.",`
  - `href: "/travel-guide/weather-and-closures",`
  - `Icon: Waves,`

#### Hunk 6

- Old lines: `33`
- New lines: `28`
- Context: `const HomeDifferentiators = () => {`
- Added snippets:
  - `<section className="bg-white py-16 md:py-24">`
- Removed snippets:
  - `<section className="bg-[#f8faf5] py-16 md:py-20">`

#### Hunk 7

- Old lines: `35-85`
- New lines: `30-44`
- Context: `const HomeDifferentiators = () => {`
- Added snippets:
  - `<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">`
  - `{differentiators.map(({ title, copy, Icon }) => (`
  - `<article`
  - `key={title}`
  - `className="rounded-[28px] border border-[#e7ebdd] bg-[#f8faf4] p-7"`
  - `>`
  - `<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-safety-orange shadow-[0_10px_20px_rgba(15,23,42,0.06)]">`
  - `<Icon className="h-5 w-5" />`
  - `</div>`
  - `<h2 className="mt-6 text-xl font-black uppercase tracking-tight text-authority-navy">`
  - `... 5 added lines omitted ...`
- Removed snippets:
  - `<div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">`
  - `<div className="max-w-xl">`
  - `<p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-safety-orange">`
  - `Why the route feels different`
  - `</p>`
  - `<h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-authority-navy md:text-5xl">`
  - `Built for proof, not generic brochure comfort.`
  - `</h2>`
  - `<p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">`
  - `JVTO should feel like one system: the commercial route, the health seriousness,`
  - `... 40 removed lines omitted ...`

### src/components/website/Home/HomeFinalCta.tsx

- Status: `M`
- Total hunk: **11**

#### Hunk 1

- Old lines: `2`
- New lines: `2-3`
- Context: `import Link from "next/link";`
- Added snippets:
  - `import { ArrowRight, Search } from "lucide-react";`
  - `import { homepageFinalCtaDoctrine } from "@/lib/homepage/homepageDoctrine";`
- Removed snippets:
  - `import { ArrowRight, MessageCircle, Search } from "lucide-react";`

#### Hunk 2

- Old lines: `11`
- New lines: `12`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `{homepageFinalCtaDoctrine.eyebrow}`
- Removed snippets:
  - `JVTO · East Java Private Tours`

#### Hunk 3

- Old lines: `14`
- New lines: `15`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `{homepageFinalCtaDoctrine.lines[0]}`
- Removed snippets:
  - `Browse routes.`

#### Hunk 4

- Old lines: `16`
- New lines: `17`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `{homepageFinalCtaDoctrine.lines[1]}`
- Removed snippets:
  - `Check the proof.`

#### Hunk 5

- Old lines: `18`
- New lines: `19`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `<span className="text-jvto-green">{homepageFinalCtaDoctrine.lines[2]}</span>`
- Removed snippets:
  - `<span className="text-jvto-green">Book with confidence.</span>`

#### Hunk 6

- Old lines: `21-22`
- New lines: `22`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `{homepageFinalCtaDoctrine.copy}`
- Removed snippets:
  - `The right flow is simple: explore the route, verify the operator, then`
  - `move into booking with support pages already connected to the decision.`

#### Hunk 7

- Old lines: `27`
- New lines: `27`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `href={homepageFinalCtaDoctrine.actions[0].href}`
- Removed snippets:
  - `href="/tours"`

#### Hunk 8

- Old lines: `31`
- New lines: `31`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `{homepageFinalCtaDoctrine.actions[0].label}`
- Removed snippets:
  - `View All Tours`

#### Hunk 9

- Old lines: `34`
- New lines: `34`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `href={homepageFinalCtaDoctrine.actions[1].href}`
- Removed snippets:
  - `href="/verify-jvto"`

#### Hunk 10

- Old lines: `37`
- New lines: `37`
- Context: `const HomeFinalCta: React.FC = () => {`
- Added snippets:
  - `{homepageFinalCtaDoctrine.actions[1].label}`
- Removed snippets:
  - `Open Proof Library`

#### Hunk 11

- Old lines: `40-53`
- New lines: `39`
- Context: `const HomeFinalCta: React.FC = () => {`
- Removed snippets:
  - `<Link`
  - `href="/travel-guide"`
  - `className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-whit...`
  - `>`
  - `Prepare &amp; Book`
  - `<ArrowRight className="h-4 w-4" />`
  - `</Link>`
  - `<Link`
  - `href="/contact"`
  - `className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-whit...`
  - `... 4 removed lines omitted ...`

### src/components/website/Home/HomeTrustGateway.tsx

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-127`
- Added snippets:
  - `import Image from "next/image";`
  - `import Link from "next/link";`
  - `import { ArrowRight, FileCheck2, ShieldCheck, Star } from "lucide-react";`
  - `import { homepageTrustGatewayDoctrine } from "@/lib/homepage/homepageDoctrine";`
  - `const HomeTrustGateway = () => {`
  - `const founder = homepageTrustGatewayDoctrine.founder;`
  - `return (`
  - `<section className="bg-white py-20 md:py-24">`
  - `<div className="container mx-auto px-6">`
  - `<div className="grid gap-8 rounded-sm border border-[#dfe5d0] bg-[#f7f8f2] p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">`
  - `... 106 added lines omitted ...`

### src/components/website/Home/TravelGuideTeaser.tsx

- Status: `M`
- Total hunk: **11**

#### Hunk 1

- Old lines: `2`
- New lines: `3`
- Context: `import { Activity, ArrowRight, BookOpen, HelpCircle, WalletCards } from "lucide-`
- Added snippets:
  - `import { homepageSupportGatewayDoctrine } from "@/lib/homepage/homepageDoctrine";`

#### Hunk 2

- Old lines: `4-29`
- New lines: `5-10`
- Context: `import { Activity, ArrowRight, BookOpen, HelpCircle, WalletCards } from "lucide-`
- Added snippets:
  - `const iconMap = {`
  - `wallet: WalletCards,`
  - `activity: Activity,`
  - `book: BookOpen,`
  - `help: HelpCircle,`
  - `} as const;`
- Removed snippets:
  - `const guideCards = [`
  - `{`
  - `href: "/travel-guide/booking-information",`
  - `title: "Booking Information",`
  - `copy: "Deposits, timing, and how the booking process actually works before payment.",`
  - `Icon: WalletCards,`
  - `},`
  - `{`
  - `href: "/travel-guide/ijen-health-screening",`
  - `title: "Ijen Screening",`
  - `... 16 removed lines omitted ...`

#### Hunk 3

- Old lines: `42`
- New lines: `23`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `{homepageSupportGatewayDoctrine.eyebrow}`
- Removed snippets:
  - `Prepare &amp; Book`

#### Hunk 4

- Old lines: `47-49`
- New lines: `28`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `{homepageSupportGatewayDoctrine.title}`
- Removed snippets:
  - `Review the route support`
  - `<br />`
  - `before you pay.`

#### Hunk 5

- Old lines: `53-55`
- New lines: `32`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `{homepageSupportGatewayDoctrine.copy}`
- Removed snippets:
  - `JVTO should not force guests to click around blindly after they are`
  - `already emotionally sold. Booking information, Ijen readiness,`
  - `safety context, and practical guidance belong close to the decision.`

#### Hunk 6

- Old lines: `59-71`
- New lines: `36-49`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `{homepageSupportGatewayDoctrine.actions.map((action) => (`
  - `<Link`
  - `key={action.label}`
  - `href={action.href}`
  - `className={`
  - `action.variant === "primary"`
  - `? "inline-flex items-center gap-2 bg-jvto-green px-8 py-3 text-sm font-black uppercase tracking-widest text-jvto-dark transition-colors hover:bg-white"`
  - `: "inline-flex items-center gap-2 border border-white/20 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"`
  - `}`
  - `>`
  - `... 4 added lines omitted ...`
- Removed snippets:
  - `<Link`
  - `href="/travel-guide"`
  - `className="inline-flex items-center gap-2 bg-jvto-green px-8 py-3 text-sm font-black uppercase tracking-widest text-jvto-dark transition-colors hover:bg-white"`
  - `>`
  - `Open Prepare &amp; Book`
  - `<ArrowRight className="h-4 w-4" />`
  - `</Link>`
  - `<Link`
  - `href="/policy"`
  - `className="inline-flex items-center gap-2 border border-white/20 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"`
  - `... 3 removed lines omitted ...`

#### Hunk 7

- Old lines: `76`
- New lines: `54-56`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `{homepageSupportGatewayDoctrine.cards.map((card) => {`
  - `const Icon = iconMap[card.icon];`
  - `return (`
- Removed snippets:
  - `{guideCards.map(({ href, title, copy, Icon }) => (`

#### Hunk 8

- Old lines: `78-79`
- New lines: `58-59`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `key={card.title}`
  - `href={card.href}`
- Removed snippets:
  - `key={title}`
  - `href={href}`

#### Hunk 9

- Old lines: `86`
- New lines: `66`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `{card.title}`
- Removed snippets:
  - `{title}`

#### Hunk 10

- Old lines: `88`
- New lines: `68`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `<p className="mt-3 text-sm leading-6 text-gray-300">{card.copy}</p>`
- Removed snippets:
  - `<p className="mt-3 text-sm leading-6 text-gray-300">{copy}</p>`

#### Hunk 11

- Old lines: `90`
- New lines: `70`
- Context: `const TravelGuideTeaser: React.FC = () => {`
- Added snippets:
  - `)})}`
- Removed snippets:
  - `))}`

### src/components/website/Home/WhyJVTO.tsx

- Status: `M`
- Total hunk: **19**

#### Hunk 1

- Old lines: `7-9`
- New lines: `7`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<section className="relative overflow-hidden bg-white py-16 md:py-24">`
- Removed snippets:
  - `<section className="relative overflow-hidden bg-jvto-dark py-24 text-white">`
  - `<div className="absolute inset-y-0 right-0 w-1/3 translate-x-20 skew-x-12 bg-jvto-green/5" />`

#### Hunk 2

- Old lines: `13`
- New lines: `11`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<div className="relative z-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-[32px] shadow-[0_24px_50px_rgba(15,23,42,0.12)]">`
- Removed snippets:
  - `<div className="relative z-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-sm border-4 border-white/10 shadow-2xl">`

#### Hunk 3

- Old lines: `19`
- New lines: `17`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `className="object-cover grayscale"`
- Removed snippets:
  - `className="object-cover"`

#### Hunk 4

- Old lines: `21-22`
- New lines: `19-20`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<div className="absolute inset-0 bg-gradient-to-t from-authority-navy via-transparent to-transparent opacity-70" />`
  - `<div className="absolute bottom-0 left-0 right-0 p-8">`
- Removed snippets:
  - `<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">`

#### Hunk 5

- Old lines: `24`
- New lines: `22`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<ShieldCheck className="h-3.5 w-3.5 text-safety-orange" />`
- Removed snippets:
  - `<ShieldCheck className="h-3.5 w-3.5 text-jvto-green" />`

#### Hunk 6

- Old lines: `30`
- New lines: `28`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<p className="text-xs font-bold uppercase tracking-widest text-slate-200">`
- Removed snippets:
  - `<p className="text-xs font-bold uppercase tracking-widest text-jvto-green">`

#### Hunk 7

- Old lines: `36-37`
- New lines: `34-35`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-safety-orange/10 blur-3xl" />`
  - `<div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-authority-navy/5 blur-3xl" />`
- Removed snippets:
  - `<div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-jvto-green/10 blur-3xl" />`
  - `<div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />`

#### Hunk 8

- Old lines: `41`
- New lines: `39`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-safety-orange">`
- Removed snippets:
  - `<p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-jvto-green">`

#### Hunk 9

- Old lines: `46`
- New lines: `44`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<h2 className="text-4xl font-black uppercase leading-none tracking-[-0.04em] text-authority-navy md:text-6xl">`
- Removed snippets:
  - `<h2 className="text-4xl font-black uppercase leading-none md:text-6xl">`

#### Hunk 10

- Old lines: `49`
- New lines: `47`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<span className="text-safety-orange">From Local Host to Trusted Operator.</span>`
- Removed snippets:
  - `<span className="text-jvto-green">From Local Host to Trusted Operator.</span>`

#### Hunk 11

- Old lines: `52`
- New lines: `50`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<div className="mt-8 space-y-6 text-lg leading-relaxed text-[#5d6a5a]">`
- Removed snippets:
  - `<div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-300">`

#### Hunk 12

- Old lines: `71-73`
- New lines: `69-71`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<div className="rounded-[24px] border border-[#e7ebdd] bg-[#f8faf4] p-5">`
  - `<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-authority-navy shadow-[0_8px_18px_rgba(15,23,42,0.08)]">`
  - `<Award className="h-5 w-5 text-safety-orange" />`
- Removed snippets:
  - `<div className="rounded-sm border border-white/10 bg-white/5 p-4">`
  - `<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-green">`
  - `<Award className="h-5 w-5" />`

#### Hunk 13

- Old lines: `75`
- New lines: `73`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<h3 className="text-sm font-black uppercase tracking-wide text-authority-navy">`
- Removed snippets:
  - `<h3 className="text-sm font-black uppercase tracking-wide text-white">`

#### Hunk 14

- Old lines: `78`
- New lines: `76`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<p className="mt-2 text-sm leading-6 text-[#5d6a5a]">`
- Removed snippets:
  - `<p className="mt-2 text-sm leading-6 text-gray-300">`

#### Hunk 15

- Old lines: `84-86`
- New lines: `82-84`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<div className="rounded-[24px] border border-[#e7ebdd] bg-[#f8faf4] p-5">`
  - `<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-authority-navy shadow-[0_8px_18px_rgba(15,23,42,0.08)]">`
  - `<ShieldCheck className="h-5 w-5 text-safety-orange" />`
- Removed snippets:
  - `<div className="rounded-sm border border-white/10 bg-white/5 p-4">`
  - `<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-green">`
  - `<ShieldCheck className="h-5 w-5" />`

#### Hunk 16

- Old lines: `88`
- New lines: `86`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<h3 className="text-sm font-black uppercase tracking-wide text-authority-navy">`
- Removed snippets:
  - `<h3 className="text-sm font-black uppercase tracking-wide text-white">`

#### Hunk 17

- Old lines: `91`
- New lines: `89`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `<p className="mt-2 text-sm leading-6 text-[#5d6a5a]">`
- Removed snippets:
  - `<p className="mt-2 text-sm leading-6 text-gray-300">`

#### Hunk 18

- Old lines: `101`
- New lines: `99`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `className="inline-flex items-center gap-2 rounded-xl bg-authority-navy px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-authority-navy/90"`
- Removed snippets:
  - `className="inline-flex items-center gap-2 bg-jvto-green px-6 py-3 text-sm font-black uppercase tracking-wide text-jvto-dark transition-colors hover:bg-white"`

#### Hunk 19

- Old lines: `108`
- New lines: `106`
- Context: `const WhyJVTO: React.FC = () => {`
- Added snippets:
  - `className="inline-flex items-center gap-2 rounded-xl border border-[#d7dec8] px-6 py-4 text-sm font-black uppercase tracking-wide text-authority-navy transition-colors hover:bg-...`
- Removed snippets:
  - `className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-white/10"`

### src/lib/homepage/homepageDoctrine.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-189`
- Added snippets:
  - `import { SITE_CONFIG } from "@/lib/site-config";`
  - `export const homepageHeroDoctrine = {`
  - `eyebrow: "Tourist Police-Led Private Tours",`
  - `highlights: [`
  - `"Private tours only",`
  - `"Licensed Indonesian operator",`
  - `"No shared groups",`
  - `"Ijen screening before night trek",`
  - `],`
  - `trustStrip: [`
  - `... 174 added lines omitted ...`

## Other Frontend

### src/app/(website)/policy/page.tsx

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `10-11`
- New lines: `9`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Removed snippets:
  - `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;`

### src/components/website/Navbar.tsx

- Status: `M`
- Total hunk: **18**

#### Hunk 1

- Old lines: `13-14`
- New lines: `12`
- Context: `import {`
- Removed snippets:
  - `LogOut,`
  - `LayoutDashboard,`

#### Hunk 2

- Old lines: `21`
- New lines: `19-20`
- Context: `import { usePathname } from "next/navigation";`
- Added snippets:
  - `import { signIn } from "next-auth/react";`
  - `import { getPackagePath } from "@/lib/packages/packagePaths";`
- Removed snippets:
  - `import { useSession, signIn, signOut } from "next-auth/react";`

#### Hunk 3

- Old lines: `341-409`
- New lines: `340`
- Context: `const ToursDropdown: React.FC = () => {`
- Added snippets:
  - `// --- 4. MAIN NAVBAR COMPONENT ---`
- Removed snippets:
  - `// --- 4. MY ACCOUNT DROPDOWN (NEW) ---`
  - `const ProfileDropdown: React.FC = () => {`
  - `const [isOpen, setIsOpen] = useState(false);`
  - `const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);`
  - `const handleMouseEnter = () => {`
  - `if (timeoutRef.current) clearTimeout(timeoutRef.current);`
  - `setIsOpen(true);`
  - `};`
  - `const handleMouseLeave = () => {`
  - `timeoutRef.current = setTimeout(() => setIsOpen(false), 200);`
  - `... 54 removed lines omitted ...`

#### Hunk 4

- Old lines: `412`
- New lines: `342`
- Context: `const Navbar: React.FC = () => {`
- Removed snippets:
  - `const { data: session } = useSession();`

#### Hunk 5

- Old lines: `458`
- New lines: `389-391`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `const [searchState, setSearchState] = useState<`
  - `"idle" | "loading" | "ready" | "unavailable"`
  - `>("idle");`

#### Hunk 6

- Old lines: `460`
- New lines: `394-397`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `if (!isSearchOpen || searchState !== "idle") return;`
  - `const controller = new AbortController();`

#### Hunk 7

- Old lines: `461`
- New lines: `399`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `setSearchState("loading");`

#### Hunk 8

- Old lines: `463`
- New lines: `401-411`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `const res = await fetch("/api/packages/web", {`
  - `signal: controller.signal,`
  - `});`
  - `const contentType = res.headers.get("content-type") || "";`
  - `if (!res.ok || !contentType.includes("application/json")) {`
  - `setAllTours([]);`
  - `setSearchState("unavailable");`
  - `return;`
  - `}`
- Removed snippets:
  - `const res = await fetch("/api/packages/web");`

#### Hunk 9

- Old lines: `465-467`
- New lines: `413-418`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `setAllTours(Array.isArray(data) ? data : []);`
  - `setSearchState("ready");`
  - `} catch {`
  - `if (controller.signal.aborted) return;`
  - `setAllTours([]);`
  - `setSearchState("unavailable");`
- Removed snippets:
  - `setAllTours(data);`
  - `} catch (err) {`
  - `console.error("Error loading packages", err);`

#### Hunk 10

- Old lines: `469`
- New lines: `421`
- Context: `const Navbar: React.FC = () => {`

#### Hunk 11

- Old lines: `471`
- New lines: `423-427`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `return () => {`
  - `controller.abort();`
  - `};`
  - `}, [isSearchOpen, searchState]);`
- Removed snippets:
  - `}, []);`

#### Hunk 12

- Old lines: `599`
- New lines: `555`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `Prepare &amp; Book`
- Removed snippets:
  - `Travel Guide`

#### Hunk 13

- Old lines: `633-646`
- New lines: `589-595`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `<button`
  - `onClick={() => setIsLoginOpen(true)}`
  - `aria-label="Open login"`
  - `className="hidden cursor-pointer rounded-full border border-slate-200/60 bg-white/70 p-2 shadow-sm transition-colors hover:bg-white md:inline-flex"`
  - `>`
  - `<User size={20} className={finalMenuIconClass} />`
  - `</button>`
- Removed snippets:
  - `{/* --- AUTH LOGIC (DESKTOP) --- */}`
  - `{session ? (`
  - `// 1. SUDAH LOGIN -> Dropdown My Account`
  - `<ProfileDropdown />`
  - `) : (`
  - `// 2. BELUM LOGIN -> Tombol Log In Saja`
  - `<button`
  - `onClick={() => setIsLoginOpen(true)}`
  - `aria-label="Open login"`
  - `className="hidden cursor-pointer rounded-full border border-slate-200/60 bg-white/70 p-2 shadow-sm transition-colors hover:bg-white md:inline-flex"`
  - `... 4 removed lines omitted ...`

#### Hunk 14

- Old lines: `678-706`
- New lines: `627-635`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `<button`
  - `onClick={() => {`
  - `setIsMenuOpen(false);`
  - `setIsLoginOpen(true);`
  - `}}`
  - `className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-5 text-left text-jvto-dark shadow-sm transition-colors hover:text-jvto-green"`
  - `>`
  - `<LogIn size={20} /> Log In`
  - `</button>`
- Removed snippets:
  - `{/* --- AUTH LOGIC (MOBILE) --- */}`
  - `{session ? (`
  - `<>`
  - `{/* Tampilkan Menu User Jika Login */}`
  - `<Link`
  - `href="/my-booking"`
  - `className="flex items-center gap-3 rounded-[20px] border border-lime-200 bg-white p-5 text-jvto-green shadow-sm transition-colors hover:text-jvto-dark"`
  - `>`
  - `<LayoutDashboard size={20} /> My Booking`
  - `</Link>`
  - `... 19 removed lines omitted ...`

#### Hunk 15

- Old lines: `730`
- New lines: `659`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `Prepare &amp; Book`
- Removed snippets:
  - `Travel Guide`

#### Hunk 16

- Old lines: `789`
- New lines: `718-726`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `{searchState === "loading" ? (`
  - `<div className="py-12 text-center text-gray-400 text-sm">`
  - `Loading routes...`
  - `</div>`
  - `) : searchState === "unavailable" ? (`
  - `<div className="py-12 text-center text-gray-400 text-sm">`
  - `Search is unavailable in this local preview.`
  - `</div>`
  - `) : searchQuery.length > 0 ? (`
- Removed snippets:
  - `{searchQuery.length > 0 ? (`

#### Hunk 17

- Old lines: `795`
- New lines: `732`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `href={getPackagePath(tour.slug)}`
- Removed snippets:
  - `href={\`/${tour.slug}\`}`

#### Hunk 18

- Old lines: `822-828`
- New lines: `759-770`
- Context: `const Navbar: React.FC = () => {`
- Added snippets:
  - `<div className="mt-2 flex items-center justify-between gap-3">`
  - `<div>`
  - `<p className="text-[14px] font-black text-jvto-green">`
  - `IDR {tour.startFrom?.toLocaleString("id-ID")}`
  - `<span className="text-[10px] text-gray-400 font-normal ml-1 tracking-normal italic lowercase">`
  - `/ person`
  - `</span>`
  - `</p>`
  - `<p className="mt-1 text-[10px] leading-relaxed text-gray-400">`
  - `2-pax reference. Larger groups pay less per person.`
  - `... 2 added lines omitted ...`
- Removed snippets:
  - `<div className="mt-2 flex items-center justify-between">`
  - `<p className="text-[14px] font-black text-jvto-green">`
  - `IDR {tour.startFrom?.toLocaleString("id-ID")}`
  - `<span className="text-[10px] text-gray-400 font-normal ml-1 tracking-normal italic lowercase">`
  - `/ person`
  - `</span>`
  - `</p>`

## Trust / Support

### src/app/(website)/travel-guide/booking-information/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/travel-guide/document-priority-note.tsx

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `3`
- New lines: `2`
- Context: `import Link from "next/link";`
- Removed snippets:
  - `import Button from "@/components/website/UI/Button";`

### src/app/(website)/travel-guide/faq/page.tsx

- Status: `M`
- Total hunk: **13**

#### Hunk 1

- Old lines: `1-6`
- New lines: `0`
- Removed snippets:
  - `import {`
  - `Accordion,`
  - `AccordionContent,`
  - `AccordionItem,`
  - `AccordionTrigger,`
  - `} from "@/components/ui/accordion";`

#### Hunk 2

- Old lines: `8`
- New lines: `1`
- Context: `import { prisma } from "@/lib/prisma";`
- Removed snippets:
  - `import StructuredData from "@/components/website/StructuredData";`

#### Hunk 3

- Old lines: `14`
- New lines: `8-9`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import { BASE_URL } from "@/lib/site";`
  - `import { faqData } from "@/lib/faq-data";`

#### Hunk 4

- Old lines: `16`
- New lines: `11`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `const siteUrl = BASE_URL;`
- Removed snippets:
  - `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;`

#### Hunk 5

- Old lines: `23`
- New lines: `19-30`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `function normalizeFaqAnswer(answer: string) {`
  - `if (!answer) return answer;`
  - `return answer`
  - `.replace(/within 14 days of booking/gi, "within 7 days of booking")`
  - `.replace(/within 14 calendar days of booking/gi, "within 7 calendar days of booking")`
  - `.replace(/within 14 days of Day 1/gi, "within 7 days of Day 1")`
  - `.replace(/within 14 calendar days of Day 1/gi, "within 7 calendar days of Day 1")`
  - `.replace(/14 days/gi, "7 days")`
  - `.replace(/14 calendar days/gi, "7 calendar days");`
  - `}`

#### Hunk 6

- Old lines: `88-89`
- New lines: `95-112`
- Context: `async function getFaqData() {`
- Added snippets:
  - `console.warn(\`[travel-guide-faq] fallback to static faq dataset: ${message}\`);`
  - `return faqData.categories.map((category, index) => ({`
  - `id: 10000 + index,`
  - `name: category.name,`
  - `slug: category.name`
  - `.toLowerCase()`
  - `.replace(/[^a-z0-9]+/g, "-")`
  - `.replace(/^-+|-+$/g, ""),`
  - `sort_order: index + 1,`
  - `is_active: true,`
  - `... 8 added lines omitted ...`
- Removed snippets:
  - `console.warn(\`[travel-guide-faq] fallback to empty list: ${message}\`);`
  - `return [];`

#### Hunk 7

- Old lines: `119`
- New lines: `143-149`
- Context: `export default async function FaqPage() {`
- Added snippets:
  - `const normalizedCategories = categories.map((cat) => ({`
  - `...cat,`
  - `faqs: cat.faqs.map((faq) => ({`
  - `...faq,`
  - `answer: normalizeFaqAnswer(faq.answer),`
  - `})),`
  - `}));`

#### Hunk 8

- Old lines: `122`
- New lines: `152`
- Context: `export default async function FaqPage() {`
- Added snippets:
  - `const allFaqsForSeo = normalizedCategories.flatMap((cat) =>`
- Removed snippets:
  - `const allFaqsForSeo = categories.flatMap((cat) =>`

#### Hunk 9

- Old lines: `164`
- New lines: `194`
- Context: `export default async function FaqPage() {`
- Added snippets:
  - `name: "Prepare & Book",`
- Removed snippets:
  - `name: "Travel Guide",`

#### Hunk 10

- Old lines: `191`
- New lines: `221`
- Context: `export default async function FaqPage() {`
- Added snippets:
  - `Prepare &amp; Book`
- Removed snippets:
  - `Travel Guide`

#### Hunk 11

- Old lines: `206`
- New lines: `236`
- Context: `export default async function FaqPage() {`
- Added snippets:
  - `{normalizedCategories.length === 0 ? (`
- Removed snippets:
  - `{categories.length === 0 ? (`

#### Hunk 12

- Old lines: `211`
- New lines: `241`
- Context: `export default async function FaqPage() {`
- Added snippets:
  - `normalizedCategories.map((category) => (`
- Removed snippets:
  - `categories.map((category) => (`

#### Hunk 13

- Old lines: `230-247`
- New lines: `259`
- Context: `export default async function FaqPage() {`
- Removed snippets:
  - `{/* <Accordion type="single" collapsible className="w-full">`
  - `{category.faqs.map((item) => (`
  - `<AccordionItem`
  - `value={\`item-${category.id}-${item.id}\`}`
  - `key={item.id}`
  - `>`
  - `<AccordionTrigger className="text-lg text-left font-medium">`
  - `{item.question}`
  - `</AccordionTrigger>`
  - `<AccordionContent>`
  - `... 8 removed lines omitted ...`

### src/app/(website)/travel-guide/ijen-health-screening/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/travel-guide/packing-and-fitness/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/travel-guide/page.tsx

- Status: `M`
- Total hunk: **9**

#### Hunk 1

- Old lines: `15`
- New lines: `16-19`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import {`
  - `extractHubIntro,`
  - `travelGuideHubDoctrine,`
  - `} from "@/lib/trust/trustSupportDoctrine";`

#### Hunk 2

- Old lines: `17-74`
- New lines: `21-28`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `const iconMap = {`
  - `card: CreditCard,`
  - `stethoscope: Stethoscope,`
  - `shield: ShieldCheck,`
  - `backpack: Backpack,`
  - `weather: CloudSun,`
  - `activity: Activity,`
  - `} as const;`
- Removed snippets:
  - `const fallbackSeo = {`
  - `title: "Travel Guide — Booking, Safety & Practical Info | Java Volcano Tour Operator",`
  - `h1: "Prepare & Book",`
  - `description:`
  - `"Use the JVTO support layer before payment: booking information, Ijen screening, weather and closures, packing, route safety, and other practical decisions.",`
  - `};`
  - `const guideCards = [`
  - `{`
  - `title: "Booking Information",`
  - `copy:`
  - `... 46 removed lines omitted ...`

#### Hunk 3

- Old lines: `77`
- New lines: `31`
- Context: `export async function generateMetadata(): Promise<Metadata> {`
- Added snippets:
  - `const seo = await getPageSeo("/travel-guide", travelGuideHubDoctrine.fallbackSeo);`
- Removed snippets:
  - `const seo = await getPageSeo("/travel-guide", fallbackSeo);`

#### Hunk 4

- Old lines: `88`
- New lines: `42-44`
- Context: `export default async function TravelGuideHubPage() {`
- Added snippets:
  - `const seo = await getPageSeo("/travel-guide", travelGuideHubDoctrine.fallbackSeo);`
  - `const content = (seo.row?.content as Record<string, unknown> | null) ?? null;`
  - `const intro = extractHubIntro(content, seo.description);`
- Removed snippets:
  - `const seo = await getPageSeo("/travel-guide", fallbackSeo);`

#### Hunk 5

- Old lines: `120`
- New lines: `76`
- Context: `export default async function TravelGuideHubPage() {`
- Added snippets:
  - `{travelGuideHubDoctrine.eyebrow}`
- Removed snippets:
  - `Prepare & Book`

#### Hunk 6

- Old lines: `126`
- New lines: `82`
- Context: `export default async function TravelGuideHubPage() {`
- Added snippets:
  - `{intro}`
- Removed snippets:
  - `{seo.description}`

#### Hunk 7

- Old lines: `129-141`
- New lines: `85-98`
- Context: `export default async function TravelGuideHubPage() {`
- Added snippets:
  - `{travelGuideHubDoctrine.actions.map((action) => (`
  - `<Link`
  - `key={action.href}`
  - `href={action.href}`
  - `className={`
  - `action.variant === "primary"`
  - `? "inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-stone-800"`
  - `: "inline-flex items-center gap-2 rounded-sm border border-stone-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-900 transition hover:border-stone-400 hover:b...`
  - `}`
  - `>`
  - `... 4 added lines omitted ...`
- Removed snippets:
  - `<Link`
  - `href="/travel-guide/booking-information"`
  - `className="inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-stone-800"`
  - `>`
  - `Read Booking Information`
  - `<ArrowRight className="h-4 w-4" />`
  - `</Link>`
  - `<Link`
  - `href="/tours"`
  - `className="inline-flex items-center gap-2 rounded-sm border border-stone-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-900 transition hover:border-stone-400...`
  - `... 3 removed lines omitted ...`

#### Hunk 8

- Old lines: `150`
- New lines: `107`
- Context: `export default async function TravelGuideHubPage() {`
- Added snippets:
  - `{travelGuideHubDoctrine.supportPrinciples.map((item) => (`
- Removed snippets:
  - `{supportPrinciples.map((item) => (`

#### Hunk 9

- Old lines: `167-168`
- New lines: `124-125`
- Context: `export default async function TravelGuideHubPage() {`
- Added snippets:
  - `{travelGuideHubDoctrine.guideCards.map((item) => {`
  - `const Icon = iconMap[item.icon];`
- Removed snippets:
  - `{guideCards.map((item) => {`
  - `const Icon = item.icon;`

### src/app/(website)/travel-guide/police-escort-for-groups/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/travel-guide/safety-on-tours/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/travel-guide/sidebar.tsx

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `24`
- New lines: `24`
- Context: `const MENU_ITEMS = [`
- Added snippets:
  - `{ href: "/travel-guide", label: "Prepare & Book Hub", icon: MapPin },`
- Removed snippets:
  - `{ href: "/travel-guide", label: "Travel Guide Hub", icon: MapPin },`

#### Hunk 2

- Old lines: `79`
- New lines: `79`
- Context: `export default function Sidebar({ isMobile, onBack }: SidebarProps) {`
- Added snippets:
  - `Prepare &amp; Book Menu`
- Removed snippets:
  - `Travel Guide Menu`

### src/app/(website)/travel-guide/weather-and-closures/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/verify-jvto/history-artifacts/page.tsx

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `10-11`
- New lines: `10-11`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "History Artifacts – Documented JVTO Origins Since 2015 | JVTO",`
  - `h1: "History Artifacts: Documented Origins Since 2015",`
- Removed snippets:
  - `title: "Verify: History Artifacts",`
  - `h1: "History Artifacts",`

#### Hunk 2

- Old lines: `13`
- New lines: `13`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Physical and documentary proof of JVTO's origins: Booking.com Guest Review Award 2015, Stefan Loose guidebook 2016, and continuous operation records.",`
- Removed snippets:
  - `"Historical records and artifacts related to JVTO's operations and legacy.",`

### src/app/(website)/verify-jvto/legal/page.tsx

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `11-12`
- New lines: `11-12`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Legal & Accountability Proof – PT Java Volcano Rendezvous | JVTO",`
  - `h1: "Legal & Accountability Proof",`
- Removed snippets:
  - `title: "Verify: Legal Documents",`
  - `h1: "Legal Documents",`

#### Hunk 2

- Old lines: `14`
- New lines: `14`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Verify JVTO's legal standing: PT registration (AHU), NIB business identity, TDUP tourism licence, and accountability chain. All independently verifiable.",`
- Removed snippets:
  - `"Verify NIB, TDUP, and official business registrations of PT Java Volcano Rendezvous.",`

### src/app/(website)/verify-jvto/page.tsx

- Status: `M`
- Total hunk: **10**

#### Hunk 1

- Old lines: `14`
- New lines: `15-18`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import {`
  - `extractHubIntro,`
  - `verifyJvtoHubDoctrine,`
  - `} from "@/lib/trust/trustSupportDoctrine";`

#### Hunk 2

- Old lines: `16-59`
- New lines: `20-25`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `const iconMap = {`
  - `file: FileCheck2,`
  - `shield: Shield,`
  - `news: Newspaper,`
  - `book: BookMarked,`
  - `} as const;`
- Removed snippets:
  - `const fallbackSeo = {`
  - `title: "Verify: Forensic Evidence Locker & Legal Documents",`
  - `h1: "Verify JVTO",`
  - `description:`
  - `"Review JVTO's legal identity, police and safety context, press references, and history artifacts before booking or payment.",`
  - `};`
  - `const categoryCards = [`
  - `{`
  - `title: "Legal",`
  - `copy:`
  - `... 32 removed lines omitted ...`

#### Hunk 3

- Old lines: `62`
- New lines: `28`
- Context: `export async function generateMetadata(): Promise<Metadata> {`
- Added snippets:
  - `const seo = await getPageSeo("/verify-jvto", verifyJvtoHubDoctrine.fallbackSeo);`
- Removed snippets:
  - `const seo = await getPageSeo("/verify-jvto", fallbackSeo);`

#### Hunk 4

- Old lines: `73`
- New lines: `39-41`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `const seo = await getPageSeo("/verify-jvto", verifyJvtoHubDoctrine.fallbackSeo);`
  - `const content = (seo.row?.content as Record<string, unknown> | null) ?? null;`
  - `const intro = extractHubIntro(content, seo.description);`
- Removed snippets:
  - `const seo = await getPageSeo("/verify-jvto", fallbackSeo);`

#### Hunk 5

- Old lines: `105`
- New lines: `73`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `{verifyJvtoHubDoctrine.eyebrow}`
- Removed snippets:
  - `Proof Library`

#### Hunk 6

- Old lines: `109`
- New lines: `77`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `{intro}`
- Removed snippets:
  - `{seo.description}`

#### Hunk 7

- Old lines: `112-124`
- New lines: `80-93`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `{verifyJvtoHubDoctrine.actions.map((action) => (`
  - `<Link`
  - `key={action.href}`
  - `href={action.href}`
  - `className={`
  - `action.variant === "primary"`
  - `? "inline-flex items-center gap-2 rounded-sm bg-lime-400 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-950 transition hover:bg-lime-300"`
  - `: "inline-flex items-center gap-2 rounded-sm border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/5"`
  - `}`
  - `>`
  - `... 4 added lines omitted ...`
- Removed snippets:
  - `<Link`
  - `href="/verify-jvto/legal"`
  - `className="inline-flex items-center gap-2 rounded-sm bg-lime-400 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-950 transition hover:bg-lime-300"`
  - `>`
  - `Open Legal Proof`
  - `<ArrowRight className="h-4 w-4" />`
  - `</Link>`
  - `<Link`
  - `href="/travel-guide"`
  - `className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/5"`
  - `... 3 removed lines omitted ...`

#### Hunk 8

- Old lines: `133`
- New lines: `102`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `{verifyJvtoHubDoctrine.steps.map((item) => (`
- Removed snippets:
  - `{steps.map((item) => (`

#### Hunk 9

- Old lines: `151-152`
- New lines: `120-121`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `{verifyJvtoHubDoctrine.categoryCards.map((item) => {`
  - `const Icon = iconMap[item.icon];`
- Removed snippets:
  - `{categoryCards.map((item) => {`
  - `const Icon = item.icon;`

#### Hunk 10

- Old lines: `172`
- New lines: `142-176`
- Context: `export default async function VerifyJvtoPage() {`
- Added snippets:
  - `<section className="border-t border-stone-200 bg-stone-50">`
  - `<div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:py-16">`
  - `<div>`
  - `<p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">`
  - `After Verification`
  - `</p>`
  - `<h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">`
  - `Proof is there to reduce doubt, then send you back into the route decision.`
  - `</h2>`
  - `<p className="mt-4 text-base leading-7 text-stone-600">`
  - `... 23 added lines omitted ...`

### src/app/(website)/verify-jvto/police-safety/page.tsx

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `10-11`
- New lines: `10-11`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Police & Safety Proof – Tourist Police Integration | JVTO",`
  - `h1: "Police & Safety Proof",`
- Removed snippets:
  - `title: "Verify: Police Authority & Safety Protocols",`
  - `h1: "Police & Safety",`

#### Hunk 2

- Old lines: `13`
- New lines: `13`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Verify JVTO's safety credentials: SPRIN tourist police letters, Ijen health screening evidence, and BBKSDA regulation compliance. Downloadable documents.",`
- Removed snippets:
  - `"Forensic evidence of Tourist Police integration, health screening, and operational safety.",`

### src/app/(website)/verify-jvto/press-recognition/page.tsx

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `10-11`
- New lines: `10-11`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `title: "Press & Recognition – Third-Party Coverage of JVTO | JVTO",`
  - `h1: "Press & Recognition: Third-Party Context",`
- Removed snippets:
  - `title: "Verify: Press Recognition",`
  - `h1: "Press Recognition",`

#### Hunk 2

- Old lines: `13`
- New lines: `13`
- Context: `const fallbackSeo = {`
- Added snippets:
  - `"Third-party press coverage: Detik.com, Radar Jember (Jawa Pos), and BBKSDA Jatim. Each article mentions JVTO founder by name. Independent context.",`
- Removed snippets:
  - `"Media coverage and recognition received by JVTO in various publications and platforms.",`

### src/app/(website)/verify-jvto/VerifyJvtoClient.tsx

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `6`
- New lines: `5`
- Context: `import {`
- Removed snippets:
  - `Download,`

#### Hunk 2

- Old lines: `23-24`
- New lines: `21`
- Context: `import {`
- Removed snippets:
  - `Filter,`
  - `Grid,`

### src/app/(website)/why-jvto/[slug]/page.tsx -> src/app/(website)/why-jvto/[...slug]/page.tsx

- Status: `R095`
- Rename: dari `src/app/(website)/why-jvto/[slug]/page.tsx` ke `src/app/(website)/why-jvto/[...slug]/page.tsx`
- Total hunk: **6**

#### Hunk 1

- Old lines: `5`
- New lines: `6`
- Context: `import { getContentPage } from "@/lib/content/getContentPage";`
- Added snippets:
  - `import { getWhyJvtoSsotFallback } from "@/lib/content/whyJvtoSsotFallback";`

#### Hunk 2

- Old lines: `15`
- New lines: `16`
- Context: `type Props = {`
- Added snippets:
  - `params: Promise<{ slug: string[] }>;`
- Removed snippets:
  - `params: Promise<{ slug: string }>;`

#### Hunk 3

- Old lines: `107`
- New lines: `108-110`
- Context: `export async function generateMetadata({ params }: Props): Promise<Metadata> {`
- Added snippets:
  - `const slugPath = slug.join("/");`
  - `const route = \`/why-jvto/${slugPath}\`;`
  - `const row = (await getContentPage(route, "en")) ?? getWhyJvtoSsotFallback(route);`
- Removed snippets:
  - `const row = await getContentPage(\`/why-jvto/${slug}\`, "en");`

#### Hunk 4

- Old lines: `115`
- New lines: `118`
- Context: `export async function generateMetadata({ params }: Props): Promise<Metadata> {`
- Added snippets:
  - `path: route,`
- Removed snippets:
  - `path: \`/why-jvto/${slug}\`,`

#### Hunk 5

- Old lines: `124`
- New lines: `127-129`
- Context: `export default async function WhyJvtoDynamicPage({ params }: Props) {`
- Added snippets:
  - `const slugPath = slug.join("/");`
  - `const route = \`/why-jvto/${slugPath}\`;`
  - `const row = (await getContentPage(route, "en")) ?? getWhyJvtoSsotFallback(route);`
- Removed snippets:
  - `const row = await getContentPage(\`/why-jvto/${slug}\`, "en");`

#### Hunk 6

- Old lines: `130`
- New lines: `135-136`
- Context: `export default async function WhyJvtoDynamicPage({ params }: Props) {`
- Added snippets:
  - `const primarySlug = slug[0] ?? "";`
  - `const meta = getMeta(primarySlug);`
- Removed snippets:
  - `const meta = getMeta(slug);`

### src/app/(website)/why-jvto/community-standards/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/our-story/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/our-team/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/page_old.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/page_ssot.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/page.tsx

- Status: `M`
- Total hunk: **10**

#### Hunk 1

- Old lines: `16`
- New lines: `17-20`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `import {`
  - `extractHubIntro,`
  - `whyJvtoHubDoctrine,`
  - `} from "@/lib/trust/trustSupportDoctrine";`

#### Hunk 2

- Old lines: `18-104`
- New lines: `22-29`
- Context: `import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";`
- Added snippets:
  - `const iconMap = {`
  - `shield: ShieldCheck,`
  - `book: BookOpen,`
  - `users: Users,`
  - `star: Star,`
  - `search: Search,`
  - `fingerprint: Fingerprint,`
  - `} as const;`
- Removed snippets:
  - `const fallbackSeo = {`
  - `title: "Why Choose Java Volcano Tour Operator",`
  - `h1: "Why JVTO",`
  - `description:`
  - `"Understand why travelers choose JVTO for private East Java routes: police-led safety culture, route discipline, real Ijen screening, and proof you can verify before payment.",`
  - `};`
  - `const trustCards = [`
  - `{`
  - `title: "The JVTO Difference",`
  - `copy:`
  - `... 73 removed lines omitted ...`

#### Hunk 3

- Old lines: `107`
- New lines: `32`
- Context: `export async function generateMetadata(): Promise<Metadata> {`
- Added snippets:
  - `const seo = await getPageSeo("/why-jvto", whyJvtoHubDoctrine.fallbackSeo);`
- Removed snippets:
  - `const seo = await getPageSeo("/why-jvto", fallbackSeo);`

#### Hunk 4

- Old lines: `118`
- New lines: `43`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `const seo = await getPageSeo("/why-jvto", whyJvtoHubDoctrine.fallbackSeo);`
- Removed snippets:
  - `const seo = await getPageSeo("/why-jvto", fallbackSeo);`

#### Hunk 5

- Old lines: `120-121`
- New lines: `45-49`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `const intro = extractHubIntro(content, seo.description);`
  - `const faq =`
  - `Array.isArray(content?.faq) && content.faq.length > 0`
  - `? content.faq`
  - `: whyJvtoHubDoctrine.fallbackFaq;`
- Removed snippets:
  - `const intro = extractIntro(content, seo.description);`
  - `const faq = Array.isArray(content?.faq) && content.faq.length > 0 ? content.faq : fallbackFaq;`

#### Hunk 6

- Old lines: `154`
- New lines: `82`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `{whyJvtoHubDoctrine.eyebrow}`
- Removed snippets:
  - `Trust & Authority`

#### Hunk 7

- Old lines: `163-175`
- New lines: `91-104`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `{whyJvtoHubDoctrine.actions.map((action) => (`
  - `<Link`
  - `key={action.href}`
  - `href={action.href}`
  - `className={`
  - `action.variant === "primary"`
  - `? "inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-stone-800"`
  - `: "inline-flex items-center gap-2 rounded-sm border border-stone-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-900 transition hover:border-stone-400 hover:b...`
  - `}`
  - `>`
  - `... 4 added lines omitted ...`
- Removed snippets:
  - `<Link`
  - `href="/verify-jvto"`
  - `className="inline-flex items-center gap-2 rounded-sm bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-stone-800"`
  - `>`
  - `Verify JVTO`
  - `<ArrowRight className="h-4 w-4" />`
  - `</Link>`
  - `<Link`
  - `href="/travel-guide"`
  - `className="inline-flex items-center gap-2 rounded-sm border border-stone-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-stone-900 transition hover:border-stone-400...`
  - `... 3 removed lines omitted ...`

#### Hunk 8

- Old lines: `180`
- New lines: `109`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `{whyJvtoHubDoctrine.principles.map((item) => (`
- Removed snippets:
  - `{principles.map((item) => (`

#### Hunk 9

- Old lines: `196-197`
- New lines: `125-126`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `{whyJvtoHubDoctrine.trustCards.map((item) => {`
  - `const Icon = iconMap[item.icon];`
- Removed snippets:
  - `{trustCards.map((item) => {`
  - `const Icon = item.icon;`

#### Hunk 10

- Old lines: `240-244`
- New lines: `169`
- Context: `export default async function WhyJvtoPage() {`
- Added snippets:
  - `{whyJvtoHubDoctrine.readNext.map((item) => (`
- Removed snippets:
  - `{[`
  - `{ href: "/tours", label: "Explore private tours" },`
  - `{ href: "/travel-guide/booking-information", label: "Read booking information" },`
  - `{ href: "/travel-guide/ijen-health-screening", label: "Understand Ijen health screening" },`
  - `].map((item) => (`

### src/app/(website)/why-jvto/press-recognition/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/proof-transparency/history-artifacts/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/proof-transparency/legal/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/proof-transparency/police-safety/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/proof-transparency/press-recognition/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/reviews/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/app/(website)/why-jvto/the-jvto-difference/page copy.tsx

- Status: `D`
- Detail teknis: file dihapus penuh dari workspace aktif.
- Pola penghapusan ini dipakai untuk membuang file duplikat lama seperti `page copy.tsx`, `page_old.tsx`, atau `page_ssot.tsx`.

### src/lib/content/whyJvtoSsotFallback.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-113`
- Added snippets:
  - `import whyJvtoSsot from "@/content/why-jvto-ssot.json";`
  - `type SsotSection = {`
  - `id?: string;`
  - `title?: string;`
  - `paragraphs?: string[];`
  - `bullets?: string[];`
  - `cards?: Array<{`
  - `title?: string;`
  - `summary?: string;`
  - `link?: string;`
  - `... 88 added lines omitted ...`

### src/lib/trust/trustSupportDoctrine.ts

- Status: `A`
- Total hunk: **1**

#### Hunk 1

- Old lines: `0`
- New lines: `1-248`
- Added snippets:
  - `export const whyJvtoHubDoctrine = {`
  - `fallbackSeo: {`
  - `title: "Why Travel with Java Volcano Tour Operator (JVTO)",`
  - `h1: "Why Travel with Java Volcano Tour Operator (JVTO)",`
  - `description:`
  - `"Discover why travelers choose JVTO for private East Java volcano journeys: police-led safety culture, legal legitimacy, real Ijen health screening, and proof you can verify bef...`
  - `},`
  - `eyebrow: "Trust & Authority",`
  - `actions: [`
  - `{`
  - `... 231 added lines omitted ...`

## Data / Types / Fallback

### src/data.ts

- Status: `M`
- Total hunk: **2**

#### Hunk 1

- Old lines: `223`
- New lines: `223`
- Context: `Our physical office is located at Jl. Khairil Anwar No.102 A, Badean, Bondowoso,`
- Added snippets:
  - `* **Step 1: Select Tour & Pay Deposit:** Choose a tour on our website and pay a 20% deposit via our secure gateway when Day 1 is still more than 7 days away. For bookings within...`
- Removed snippets:
  - `* **Step 1: Select Tour & Pay Deposit:** Choose a tour on our website and pay a 20% deposit via our secure gateway. For bookings less than 14 days away, 100% payment may be requ...`

#### Hunk 2

- Old lines: `244`
- New lines: `244`
- Context: `Our physical office is located at Jl. Khairil Anwar No.102 A, Badean, Bondowoso,`
- Added snippets:
  - `"A **20% deposit** is required to secure your tour when Day 1 is still more than 7 days away. For **bookings made within 7 days of Day 1, 100% full payment** can be required upf...`
- Removed snippets:
  - `"A **20% deposit** is required to secure your tour. For **bookings made less than 14 days before departure, 100% full payment** is required upfront. Missing a payment deadline c...`

### src/data/knowledge.ts

- Status: `M`
- Total hunk: **3**

#### Hunk 1

- Old lines: `45`
- New lines: `45`
- Context: `Our physical office is located at Jl. Khairil Anwar No.102 A, Badean, Bondowoso,`
- Added snippets:
  - `* **Step 1: Select Tour & Pay Deposit:** Choose a tour on our website and pay a 20% deposit via our secure gateway when Day 1 is still more than 7 days away. For bookings within...`
- Removed snippets:
  - `* **Step 1: Select Tour & Pay Deposit:** Choose a tour on our website and pay a 20% deposit via our secure gateway. For bookings less than 14 days away, 100% payment may be requ...`

#### Hunk 2

- Old lines: `55`
- New lines: `55`
- Context: `Our physical office is located at Jl. Khairil Anwar No.102 A, Badean, Bondowoso,`
- Added snippets:
  - `content: 'A **20% deposit** of the total package price is required to secure a booking when Day 1 is still more than 7 days away. However, for **bookings where Day 1 is within 7...`
- Removed snippets:
  - `content: 'A **20% deposit** of the total package price is required to secure a booking. However, for **bookings where Day 1 is less than 14 days away**, JVTO may require up to *...`

#### Hunk 3

- Old lines: `223`
- New lines: `223`
- Context: `In these cases, up to **100% of the total package price is forfeited**, and no r`
- Added snippets:
  - `];`
- Removed snippets:
  - `];`

### src/services/mockData.ts

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `2`
- New lines: `2`
- Added snippets:
  - `import { TourPackage, Difficulty } from '@/types';`
- Removed snippets:
  - `import { TourPackage, Difficulty } from '@/typesNew';`

### src/types.ts

- Status: `M`
- Total hunk: **1**

#### Hunk 1

- Old lines: `1`
- New lines: `2-17`
- Added snippets:
  - `// ============================================================================`
  - `// TOUR & DIFFICULTY TYPES`
  - `// ============================================================================`
  - `export enum Difficulty {`
  - `EASY = 'easy',`
  - `MODERATE = 'moderate',`
  - `CHALLENGING = 'challenging',`
  - `HARD = 'hard'`
  - `}`
  - `// ============================================================================`
  - `... 2 added lines omitted ...`
