const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const REVALIDATE_SECONDS = 60;

type EcosystemWebsitePageResponse = {
  route: string;
  payload?: {
    route?: string;
    page?: {
      title?: string;
      summary?: string;
      answerFirst?: string;
      [key: string]: unknown;
    };
  };
};

function ecosystemBaseUrl() {
  return (
    process.env.JVTO_ECOSYSTEM_BASE_URL ||
    process.env.NEXT_PUBLIC_ECOSYSTEM_BASE_URL ||
    DEFAULT_ECOSYSTEM_BASE_URL
  ).replace(/\/+$/, "");
}

function isJsonResponse(response: Response) {
  return response.headers.get("content-type")?.includes("application/json") ?? false;
}

export async function getEcosystemWebsitePage(route: string) {
  const url = `${ecosystemBaseUrl()}/api/website/page?route=${encodeURIComponent(route)}`;

  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["ecosystem-website-content"] },
    });
    if (!response.ok) return null;
    if (!isJsonResponse(response)) return null;

    const data = (await response.json()) as EcosystemWebsitePageResponse;
    return data.payload ?? null;
  } catch (error) {
    console.error(
      `[ecosystemContent] Failed to fetch website output for ${route}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null;
  }
}

export async function getEcosystemAnswerFirst(route: string) {
  const page = await getEcosystemWebsitePage(route);
  const answerFirst = page?.page?.answerFirst;
  return typeof answerFirst === "string" && answerFirst.trim() ? answerFirst.trim() : null;
}
