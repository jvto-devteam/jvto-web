const LIVE_BASE_URL =
  process.env.JVTO_AUDIT_LIVE_BASE_URL ??
  "https://javavolcano-touroperator.com";
const LOCAL_BASE_URL =
  process.env.JVTO_AUDIT_LOCAL_BASE_URL ?? "http://localhost:3000";

const ROUTES = [
  "/travel-guide",
  "/travel-guide/best-time-to-visit",
  "/travel-guide/booking-information",
  "/travel-guide/faq",
  "/travel-guide/ijen-health-screening",
  "/travel-guide/mount-bromo-logistics",
  "/travel-guide/packing-and-fitness",
  "/travel-guide/police-escort-for-groups",
  "/travel-guide/rijik-monthly-closure",
  "/travel-guide/safety-on-tours",
  "/travel-guide/tumpak-sewu-logistics",
  "/travel-guide/weather-and-closures",
];

const REQUIRED_LOCAL_MARKERS = {
  "/travel-guide/ijen-health-screening": [
    "Gas Masks",
    "The hard gate",
    "Why each vital is measured",
    "Verify your physician",
    "What you should do before the trip",
    "Verify before you book",
  ],
  "/travel-guide/mount-bromo-logistics": [
    "The night sequence",
    "Viewpoints",
    "Vehicle & temperature",
    "What to wear",
    "The crater walk",
  ],
  "/travel-guide/packing-and-fitness": [
    "Optional: an 8-week conditioning plan",
    "Related Destinations",
  ],
  "/travel-guide/tumpak-sewu-logistics": [
    "The route",
    "When NOT to go",
    "Best season",
    "Tumpak Sewu Waterfall",
  ],
};

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<!-- -->/g, " ");
}

function stripToText(html) {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMainHtml(html) {
  return html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
}

function extractHeadings(html) {
  const headings = [];
  const pattern = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;

  while ((match = pattern.exec(html))) {
    const heading = stripToText(match[2]);
    if (heading) headings.push(heading);
  }

  return [...new Set(headings)];
}

async function fetchRoute(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });

  if (response.status >= 300 && response.status < 400) {
    return {
      status: response.status,
      redirect: response.headers.get("location"),
      headings: [],
      text: "",
    };
  }

  const html = await response.text();
  const mainHtml = extractMainHtml(html);

  return {
    status: response.status,
    redirect: null,
    headings: extractHeadings(mainHtml),
    text: stripToText(mainHtml),
  };
}

function normalizeRedirect(value) {
  if (!value) return null;

  try {
    return new URL(value, LIVE_BASE_URL).pathname;
  } catch {
    return value;
  }
}

function diffRoute(route, live, local) {
  const issues = [];

  if (live.status !== local.status) {
    issues.push(`status mismatch: live ${live.status}, local ${local.status}`);
  }

  if (normalizeRedirect(live.redirect) !== normalizeRedirect(local.redirect)) {
    issues.push(
      `redirect mismatch: live ${live.redirect ?? "-"}, local ${
        local.redirect ?? "-"
      }`,
    );
  }

  const missingHeadings = live.headings.filter(
    (heading) => heading.length > 2 && !local.text.includes(heading),
  );

  if (missingHeadings.length) {
    issues.push(`missing headings: ${missingHeadings.join(" | ")}`);
  }

  const extraHeadings = local.headings.filter(
    (heading) => heading.length > 2 && !live.text.includes(heading),
  );

  if (extraHeadings.length) {
    issues.push(`extra headings: ${extraHeadings.join(" | ")}`);
  }

  const missingMarkers = (REQUIRED_LOCAL_MARKERS[route] ?? []).filter(
    (marker) => !local.text.includes(marker),
  );

  if (missingMarkers.length) {
    issues.push(
      `missing required local markers: ${missingMarkers.join(" | ")}`,
    );
  }

  return issues;
}

async function main() {
  const failures = [];

  for (const route of ROUTES) {
    const [live, local] = await Promise.all([
      fetchRoute(LIVE_BASE_URL, route),
      fetchRoute(LOCAL_BASE_URL, route),
    ]);
    const issues = diffRoute(route, live, local);

    if (issues.length) {
      failures.push({ route, issues });
      console.error(`FAIL ${route}`);
      for (const issue of issues) console.error(`  - ${issue}`);
    } else {
      console.log(`OK   ${route}`);
    }
  }

  if (failures.length) {
    console.error(
      `\nTravel Guide live parity audit failed for ${failures.length} route(s).`,
    );
    process.exit(1);
  }

  console.log("\nTravel Guide live parity audit passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
