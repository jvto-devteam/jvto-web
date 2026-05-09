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
    width: 800,
    quality: 68,
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
for (const job of [...historyJobs, ...crewJobs]) {
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
