/**
 * Task 7: Insert 4 content_pages rows for content moat travel guide pages
 * Run: node scripts/insert-content-moat-pages.mjs
 */
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const pages = [
  {
    route: '/travel-guide/bbksda-se-1658',
    lang: 'en',
    seo: {
      title: 'BBKSDA SE-1658 Regulation — Ijen Crater Access Rules | JVTO',
      description: 'BBKSDA SE-1658 is the East Java Nature Conservation regulation governing Ijen Crater access. JVTO operates in full compliance — learn what this means for your tour.',
    },
    content: {
      body_md: `## What is BBKSDA SE-1658?

BBKSDA SE-1658 is a circular letter (Surat Edaran) issued by the East Java Branch of BBKSDA (Balai Besar Konservasi Sumber Daya Alam — Natural Resource Conservation Agency). It governs visitor access conditions at Kawah Ijen Crater in Bondowoso/Banyuwangi.

## What Does It Require?

The regulation sets conditions under which Ijen Crater may be accessed, including:

- **Health fitness requirements**: Visitors with certain medical conditions (heart disease, asthma, hypertension) may be restricted based on current volcanic activity status.
- **Access windows**: Trek hours are regulated (typically 02:00–10:00 WIB), subject to volcanic activity.
- **Operator compliance**: Licensed tour operators like JVTO must coordinate with the park authority (Balai TNBTS for Bromo; BBKSDA for Ijen) when conditions change.

## How JVTO Complies

Java Volcano Tour Operator (JVTO) is registered with HPWKI (Himpunan Pemandu Wisata Kawah Ijen), the official Ijen guide association supervised by BBKSDA. Our NIB license number \`1102230032918\` is verifiable at [oss.go.id](https://oss.go.id).

When SE-1658 or updated circulars impose access restrictions, JVTO:

1. Notifies booked clients immediately via WhatsApp
2. Reschedules or offers 100% Travel Credit per our [cancellation policy](/policy/booking-payment-cancellation)
3. Coordinates health documentation if screening becomes required

## What This Means for Your Booking

Ijen access conditions can change with volcanic activity. JVTO monitors these in real time and communicates proactively. You are never left guessing — any access restriction is communicated before your departure night.

[Book an Ijen tour with full compliance guaranteed →](/tours/from-surabaya)`,
      faq: [
        {
          question: 'What happens to my booking if BBKSDA closes Ijen access?',
          answer: 'JVTO notifies you immediately and offers a reschedule or 100% Travel Credit. No penalty for closures outside your control.',
        },
        {
          question: 'Does JVTO have official BBKSDA compliance?',
          answer: 'Yes. JVTO is a member of HPWKI, the Ijen Guide Association supervised by BBKSDA. Our operator license (NIB 1102230032918) is publicly verifiable.',
        },
        {
          question: 'Is health screening always required for Ijen access?',
          answer: 'Akses Ijen dapat mensyaratkan surat sehat terkini. JVTO mengoordinasikan alur klinik bila aturan akses mensyaratkan. Our team confirms current requirements at time of booking.',
        },
      ],
    },
    is_active: true,
  },
  {
    route: '/travel-guide/ijen-health-certificate',
    lang: 'en',
    seo: {
      title: 'Ijen Health Certificate — What It Is and How JVTO Handles It | JVTO',
      description: "The Ijen health certificate (surat sehat) verifies fitness for the sulfuric Kawah Ijen environment. JVTO coordinates the clinic process for all Ijen tour participants.",
    },
    content: {
      body_md: `## What Is the Ijen Health Certificate?

The Ijen health certificate (locally: *surat keterangan sehat*) is a medical clearance document that verifies a visitor's fitness to enter Kawah Ijen Crater — a high-altitude environment with active sulfur gas (SO₂).

This document is coordinated by JVTO for all participants on Ijen-route tours.

## Why Ijen Requires Health Screening

Kawah Ijen sits at 2,386m elevation. The crater produces sulfur dioxide gas, particularly during the Blue Fire observation period (02:00–05:00 WIB). Participants with the following conditions face elevated risk:

- Heart disease or arrhythmias
- Severe asthma or chronic obstructive pulmonary disease
- Hypertension (uncontrolled)
- Recent surgery or acute illness

## How JVTO Coordinates the Process

JVTO partners with a certified clinic to conduct health screening at your hotel — the evening before your Ijen trek. The process takes approximately 15–20 minutes and includes:

1. Blood pressure and heart rate check
2. Respiratory assessment
3. Medical history questionnaire
4. Digital QR certificate valid for Ijen gate entry

**You do not need to arrange this yourself.** JVTO handles the scheduling, clinic coordination, and documentation.

## Is Screening Always Required?

Akses Ijen dapat mensyaratkan surat sehat terkini. JVTO mengoordinasikan alur klinik bila aturan akses mensyaratkan. The requirement depends on current BBKSDA/park authority guidelines. JVTO confirms the current status at booking and communicates any changes before your departure.

[See all Ijen tours →](/tours/from-surabaya) · [Learn about BBKSDA SE-1658 →](/travel-guide/bbksda-se-1658)`,
      faq: [
        {
          question: 'Do I need to get a health certificate before arriving in Indonesia?',
          answer: 'No. The health screening is conducted at your hotel in Indonesia, coordinated by JVTO the evening before your Ijen trek.',
        },
        {
          question: 'How much does the health screening cost?',
          answer: 'The health screening coordination is included in your JVTO package price. There is no separate fee.',
        },
        {
          question: 'What happens if I fail the health screening?',
          answer: 'If screening results indicate a risk, JVTO will discuss alternatives with you — such as a Bromo-only itinerary. Your safety is the priority. A cancellation/modification in this case is treated under our Travel Credit policy.',
        },
      ],
    },
    is_active: true,
  },
  {
    route: '/travel-guide/bromo-vs-ijen-comparison',
    lang: 'en',
    seo: {
      title: "Bromo vs Ijen — Which Volcano Should You Visit? | JVTO",
      description: "Mt. Bromo and Kawah Ijen are East Java's two iconic volcanoes, but they offer very different experiences. Compare difficulty, highlights, and what fits your travel style.",
    },
    content: {
      body_md: `## Bromo vs Ijen — The East Java Volcano Comparison

Most travelers visiting East Java have time for one or both volcanoes. This guide compares them across the dimensions that matter for trip planning.

## At a Glance

| | Mt. Bromo | Kawah Ijen |
|---|---|---|
| **Elevation** | 2,329m (crater rim) | 2,386m (crater rim) |
| **Trek difficulty** | Easy–Moderate | Moderate |
| **Main draw** | Sunrise over the Sea of Sand | Blue Fire + sulfur lake |
| **Best time** | Year-round (dry season Apr–Oct optimal) | Year-round (Blue Fire: Apr–Oct) |
| **Trek distance** | ~2 km (4WD + short hike) | ~6 km round trip |
| **Night start** | Yes (depart ~10pm for 4am arrival) | Yes (depart ~1am for 3am crater) |
| **Health screening** | Not required | Coordinated by JVTO if required |

## Mt. Bromo — What to Expect

Bromo is famous for its **Sea of Sand (Lautan Pasir)** and the dramatic sunrise viewpoint at Penanjakan. The trek is accessible by 4WD to the base, followed by a short 20-minute walk up to the crater rim.

**Best for:** First-time East Java visitors, families with older children, photographers, travelers with limited fitness.

## Kawah Ijen — What to Expect

Ijen's signature feature is the **Blue Fire (Api Biru)** — a rare electric-blue flame caused by combusting sulfuric gases. It's visible only before sunrise (02:00–05:00 WIB) in low-light conditions. The crater also contains the world's largest highly-acidic lake, with an eerie turquoise color visible at dawn.

**Best for:** Adventure seekers, photographers, travelers comfortable with a 3km uphill night trek.

## Can You Do Both?

Yes — JVTO specializes in combined Bromo + Ijen itineraries. The classic route:

- **2D1N**: Bromo sunrise → drive to Ijen area → Ijen Blue Fire next morning
- **3D2N**: Same + Tumpak Sewu Waterfall

[See all combined tour options →](/tours/from-surabaya)

## Which Should You Choose?

- **Choose Bromo only** if: you have limited time, prefer an easier trek, or are traveling with children.
- **Choose Ijen only** if: the Blue Fire is your primary goal and you've seen Bromo before.
- **Choose both** if: you have 2+ days and want the full East Java volcano circuit.`,
      faq: [
        {
          question: 'Can I visit both Bromo and Ijen in 2 days?',
          answer: 'Yes. JVTO offers 2D1N combined tours: Bromo sunrise on Day 1, drive to Ijen area, Ijen Blue Fire trek Day 2 morning. It is physically demanding but very achievable.',
        },
        {
          question: 'Which volcano is harder to trek?',
          answer: 'Ijen requires a 3km uphill trek each way at altitude, starting at 1am. Bromo involves a shorter walk after a 4WD drive. Most fit adults handle both without difficulty.',
        },
        {
          question: 'Is the Blue Fire at Ijen visible year-round?',
          answer: 'The Blue Fire is visible year-round on clear nights without rain. Volcanic activity occasionally restricts crater access — JVTO monitors real-time conditions and communicates any changes before your tour.',
        },
      ],
    },
    is_active: true,
  },
  {
    route: '/travel-guide/is-bromo-open-today',
    lang: 'en',
    seo: {
      title: 'Is Mt. Bromo Open Today? — Current Access Status | JVTO',
      description: 'Real-time Mt. Bromo access status from JVTO. We monitor PVMBG volcanic activity levels and TNBTS access decisions daily. Check before you book.',
    },
    content: {
      body_md: `## Is Mt. Bromo Open Today?

Mt. Bromo access is controlled by **TNBTS (Taman Nasional Bromo Tengger Semeru)** and can be affected by volcanic activity monitored by **PVMBG (Center for Volcanology and Geological Hazard Mitigation)**.

> **JVTO monitors Bromo access status daily.** If you have an upcoming booking, our team will contact you proactively if any access restrictions apply. If you are planning a trip, [WhatsApp us](https://wa.me/6282244788833?text=Hi%20JVTO%2C%20is%20Mt.%20Bromo%20open%20for%20tours%20this%20week%3F) for the current status.

## How Bromo Access Works

Bromo operates at access levels set by PVMBG volcanic alert system:

| PVMBG Level | Color | Bromo Access |
|---|---|---|
| Level I | Green (Normal) | Fully open |
| Level II | Yellow (Waspada) | Open with restrictions (no crater rim) |
| Level III | Orange (Siaga) | Exclusion zone ~2km; Sea of Sand access varies |
| Level IV | Red (Awas) | Fully closed |

As of the last JVTO update (check with us for current status), Bromo is operating at the standard access level for tourism.

## What Happens If Bromo Closes During My Booking?

JVTO monitors PVMBG bulletins daily. If Bromo access changes after your booking:

1. We contact you immediately via WhatsApp
2. We discuss alternatives (Ijen-only, Tumpak Sewu substitution, or reschedule)
3. Any modification due to force majeure (volcanic closure) is handled under our [Travel Credit policy](/policy/booking-payment-cancellation) — 100% credit, no penalties

## Check Status Now

For the most up-to-date access status, [WhatsApp JVTO directly](https://wa.me/6282244788833?text=Hi%20JVTO%2C%20is%20Mt.%20Bromo%20open%20for%20tours%20this%20week%3F). We respond within 1 hour (08:00–22:00 WIB).

Official sources:
- [PVMBG Bromo Activity](https://magma.esdm.go.id/v1/gunung-api/laporan)
- [TNBTS Official](https://bromotenggersemeru.org)

[Book a Bromo tour →](/tours/from-surabaya) · [Compare Bromo vs Ijen →](/travel-guide/bromo-vs-ijen-comparison)`,
      faq: [
        {
          question: 'How do I check if Bromo is open before I travel?',
          answer: 'WhatsApp JVTO at +62 822-4478-8833 — we monitor PVMBG daily and respond within 1 hour. You can also check the official PVMBG magma.esdm.go.id bulletin.',
        },
        {
          question: 'What PVMBG alert level closes Bromo to tourists?',
          answer: 'Level III (Siaga/Orange) typically restricts the 2km exclusion zone around the crater, limiting summit access. The Sea of Sand viewpoint may remain open. Level IV (Awas/Red) closes all tourism in the area.',
        },
        {
          question: 'Will I get a refund if Bromo closes on my tour date?',
          answer: 'JVTO offers 100% Travel Credit for cancellations due to volcanic closure — no penalties. See our full cancellation policy at /policy/booking-payment-cancellation.',
        },
      ],
    },
    is_active: true,
  },
];

async function main() {
  // Check existing
  const existing = await prisma.$queryRaw`
    SELECT route, is_active FROM content_pages
    WHERE route IN (
      '/travel-guide/bbksda-se-1658',
      '/travel-guide/ijen-health-certificate',
      '/travel-guide/bromo-vs-ijen-comparison',
      '/travel-guide/is-bromo-open-today'
    )
    ORDER BY route;
  `;
  console.log('Existing rows before insert:', existing);

  let inserted = 0;
  for (const page of pages) {
    try {
      const result = await prisma.$executeRaw`
        INSERT INTO content_pages (route, lang, seo, content, is_active)
        VALUES (
          ${page.route},
          ${page.lang},
          ${JSON.stringify(page.seo)}::jsonb,
          ${JSON.stringify(page.content)}::jsonb,
          ${page.is_active}
        )
        ON CONFLICT (route, lang) DO NOTHING;
      `;
      console.log(`  ${page.route}: ${result} row(s) affected`);
      if (result > 0) inserted++;
    } catch (err) {
      console.error(`  ERROR ${page.route}:`, err.message);
    }
  }
  console.log(`\nInserted: ${inserted} new rows`);

  // Verify all 4 present
  const verified = await prisma.$queryRaw`
    SELECT route, is_active, created_at FROM content_pages
    WHERE route IN (
      '/travel-guide/bbksda-se-1658',
      '/travel-guide/ijen-health-certificate',
      '/travel-guide/bromo-vs-ijen-comparison',
      '/travel-guide/is-bromo-open-today'
    )
    ORDER BY route;
  `;
  console.log('\nVerification (should be 4 rows):');
  for (const row of verified) {
    console.log(`  ${row.route} | is_active=${row.is_active}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
