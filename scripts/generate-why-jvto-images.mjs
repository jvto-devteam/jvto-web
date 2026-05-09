import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const historyJobs = [
  {
    input: "history/booking-2015-plaque.jpg",
    output: "history/booking-2015-plaque-optimized.webp",
    width: 1200,
    quality: 72,
  },
  {
    input: "history/booking-2015-shipping-label.jpg",
    output: "history/booking-2015-shipping-label-optimized.webp",
    width: 1200,
    quality: 72,
  },
  {
    input: "history/stefan-loose-ijen-bondowoso-page.png",
    output: "history/stefan-loose-ijen-bondowoso-page-optimized.webp",
    width: 1600,
    quality: 74,
  },
  {
    input: "history/stefan_loose_crop_enh.jpg",
    output: "history/stefan_loose_crop_enh-optimized.webp",
    width: 1200,
    quality: 72,
  },
  {
    input: "history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg",
    output:
      "history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired-optimized.webp",
    width: 1200,
    quality: 70,
  },
];

const sharedPublicJobs = [
  {
    input: "assets/img/hero/home.webp",
    output: "assets/img/hero/home-lite.webp",
    width: 1280,
    quality: 46,
  },
  {
    input: "legal/NIB-1102230032918-preview.png",
    output: "legal/NIB-1102230032918-preview.webp",
    width: 720,
    quality: 56,
  },
  {
    input: "legal/SPRIN-POLPAR.png",
    output: "legal/SPRIN-POLPAR.webp",
    width: 720,
    quality: 54,
  },
  {
    input: "screening/ijen-screening-hotel-01.jpeg",
    output: "screening/ijen-screening-hotel-01.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "uploads/1763205255605-141795118-kiki.png",
    output: "uploads/1763205255605-141795118-kiki.webp",
    width: 720,
    quality: 54,
  },
];

const homeCardJobs = [
  {
    input: "uploads/1764649856442-820608003-bromo-new.jpg",
    output: "uploads/1764649856442-820608003-bromo-new-home.webp",
    width: 420,
    quality: 46,
  },
  {
    input: "uploads/1764649921055-338810628-1687447803_whatsapp_image_2019-05-12_at_4.46.53_pm.jpeg",
    output:
      "uploads/1764649921055-338810628-1687447803_whatsapp_image_2019-05-12_at_4.46.53_pm-home.webp",
    width: 420,
    quality: 46,
  },
  {
    input: "uploads/1764650020192-295296217-madakaripura1.jpg",
    output: "uploads/1764650020192-295296217-madakaripura1-home.webp",
    width: 420,
    quality: 46,
  },
  {
    input: "uploads/1764650032945-926940542-tumpak-sewu1.jpg",
    output: "uploads/1764650032945-926940542-tumpak-sewu1-home.webp",
    width: 420,
    quality: 46,
  },
  {
    input: "uploads/1764650056490-963808584-papuma1.jpg",
    output: "uploads/1764650056490-963808584-papuma1-home.webp",
    width: 420,
    quality: 46,
  },
  {
    input: "uploads/3-day-bromo-madakaripura-waterfall-ijen-overland-from-surabaya-to-bali_0.jpg",
    output:
      "uploads/3-day-bromo-madakaripura-waterfall-ijen-overland-from-surabaya-to-bali_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_0.jpg",
    output:
      "uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/4-day-ijen-bromo-madakaripura-waterfall-expedition-from-surabaya_0.jpg",
    output:
      "uploads/4-day-ijen-bromo-madakaripura-waterfall-expedition-from-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-journey-from-surabaya_0.webp",
    output:
      "uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-journey-from-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/4-day-tumpak-sewu-bromo-ijen-adventure-from-surabaya-to-bali_0.webp",
    output:
      "uploads/4-day-tumpak-sewu-bromo-ijen-adventure-from-surabaya-to-bali_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/5-day-ijen-bromo-madakaripura-malang-city-adventure-from-surabaya_0.webp",
    output:
      "uploads/5-day-ijen-bromo-madakaripura-malang-city-adventure-from-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-expedition-from-bali-to-surabaya_0.jpg",
    output:
      "uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-expedition-from-bali-to-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/5-day-ijen-papuma-beach-tumpak-sewu-bromo-discovery-from-bali-to-surabaya_0.jpg",
    output:
      "uploads/5-day-ijen-papuma-beach-tumpak-sewu-bromo-discovery-from-bali-to-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/3-day-ijen-bromo-madakaripura-waterfall-journey-from-bali-to-surabaya_0.webp",
    output:
      "uploads/3-day-ijen-bromo-madakaripura-waterfall-journey-from-bali-to-surabaya_0-home.webp",
    width: 640,
    quality: 46,
  },
  {
    input: "uploads/3-day-bromo-ijen-volcano-discovery-from-bali_0.webp",
    output:
      "uploads/3-day-bromo-ijen-volcano-discovery-from-bali_0-home.webp",
    width: 640,
    quality: 46,
  },
];

const verifyJobs = [
  {
    input: "founder/mr-sam-tourist-police-portrait.png",
    output: "founder/mr-sam-tourist-police-portrait-optimized.webp",
    width: 900,
    quality: 52,
  },
  {
    input: "ops/baratha-hotel-departure-team.jpg",
    output: "ops/baratha-hotel-departure-team-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "ops/group-at-jvto-office.jpg",
    output: "ops/group-at-jvto-office-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "ops/guest-welcome-evening.png",
    output: "ops/guest-welcome-evening-optimized.webp",
    width: 900,
    quality: 54,
  },
  {
    input: "ops/ijen-geopark-briefing.png",
    output: "ops/ijen-geopark-briefing-optimized.webp",
    width: 900,
    quality: 54,
  },
  {
    input: "ops/jvto-police-escort-arrival-hotel-bondowoso-day.jpg",
    output: "ops/jvto-police-escort-arrival-hotel-bondowoso-day-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "ops/jvto-police-escort-arrival-hotel-bondowoso-night.jpg",
    output: "ops/jvto-police-escort-arrival-hotel-bondowoso-night-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "ops/police-vehicle-support.jpg",
    output: "ops/police-vehicle-support-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "legal/office-photo.jpg",
    output: "legal/office-photo-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen.png",
    output: "press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen-optimized.webp",
    width: 1200,
    quality: 54,
  },
  {
    input: "screening/SCREENSHOT_SIP_DOKTER_AHMAD_IRWANDANU_2026.png",
    output: "screening/SCREENSHOT_SIP_DOKTER_AHMAD_IRWANDANU_2026.webp",
    width: 1100,
    quality: 54,
  },
  {
    input: "screening/jvto-office-screening-1.JPG",
    output: "screening/jvto-office-screening-1-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "screening/jvto-office-screening-2.jpg",
    output: "screening/jvto-office-screening-2-optimized.webp",
    width: 900,
    quality: 56,
  },
  {
    input: "screening/print-surat-sehat-preview-2026.png",
    output: "screening/print-surat-sehat-preview-2026.webp",
    width: 900,
    quality: 54,
  },
];

const crewJobs = [
  "uploads/1768225567764-405955176-gufron.png",
  "uploads/1768228514527-518051332-rendi.png",
  "uploads/1768270364125-144711646-yandi.png",
  "uploads/1768228191022-893381041-boy.png",
  "uploads/1768276791622-262250680-freddy.png",
  "uploads/1768270423657-690185912-anjas.png",
  "uploads/1768228083285-919198019-taufik_1_.png",
  "uploads/1768271545598-834784538-kiki.png",
  "uploads/1768277053384-470130286-holili.jpg",
  "uploads/1768226003889-338819579-fauzi.png",
  "uploads/1768277336049-911840775-joyo.png",
].map((input) => {
  const ext = path.extname(input);
  return {
    input,
    output: input.replace(ext, "-thumb.webp"),
    width: 520,
    quality: 54,
  };
});

async function ensureGenerated(job) {
  const inputPath = path.join(PUBLIC_DIR, job.input);
  const outputPath = path.join(PUBLIC_DIR, job.output);

  if (!fs.existsSync(inputPath)) {
    return {
      input: job.input,
      output: job.output,
      skipped: true,
    };
  }

  await sharp(inputPath)
    .resize({
      width: job.width,
      withoutEnlargement: true,
    })
    .webp({
      quality: job.quality,
      effort: 6,
    })
    .toFile(outputPath);

  const before = fs.statSync(inputPath).size;
  const after = fs.statSync(outputPath).size;
  return {
    input: job.input,
    output: job.output,
    before,
    after,
  };
}

const results = [];
for (const job of [
  ...historyJobs,
  ...sharedPublicJobs,
  ...homeCardJobs,
  ...verifyJobs,
  ...crewJobs,
]) {
  results.push(await ensureGenerated(job));
}

console.log(
  JSON.stringify(
    results.map((r) => ({
      input: r.input,
      output: r.output,
      skipped: Boolean(r.skipped),
      beforeKB: Math.round(r.before / 1024),
      afterKB: Math.round(r.after / 1024),
    })),
    null,
    2,
  ),
);
