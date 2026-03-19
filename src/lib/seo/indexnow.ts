import sitemap from "@/app/sitemap";
import { BASE_URL } from "@/lib/site";

export const INDEXNOW_KEY = "f6d885656876420a925cbbd9b27a2139";
export const INDEXNOW_KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function uniqueUrls(urls: string[]) {
  return [...new Set(urls.map((value) => value.trim()).filter(Boolean))];
}

export async function getSitemapUrls() {
  const entries = await sitemap();
  return uniqueUrls(entries.map((entry) => entry.url));
}

export async function submitIndexNow(urls: string[]) {
  const unique = uniqueUrls(urls).filter((value) => value.startsWith(BASE_URL));

  if (!unique.length) {
    return {
      ok: false,
      status: 400,
      submitted: 0,
      message: "No valid URLs to submit.",
    };
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: new URL(BASE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: unique,
    }),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    submitted: unique.length,
    message: text || response.statusText,
  };
}
