import type {
  EcosystemGridBlock,
  EcosystemSection,
  EcosystemStaticPage,
} from "@/lib/ecosystemContent/website";

export type WhyRecord = Record<string, unknown>;

export function whySection(
  page: EcosystemStaticPage | null | undefined,
  id: string,
): EcosystemSection | undefined {
  return page?.sections?.find((section) => section.id === id);
}

export function whySectionByTitle(
  page: EcosystemStaticPage | null | undefined,
  title: string,
): EcosystemSection | undefined {
  const needle = title.trim().toLowerCase();
  return page?.sections?.find(
    (section) => section.title?.trim().toLowerCase() === needle,
  );
}

export function whyMarkdown(section: EcosystemSection | undefined): string {
  return (
    section?.blocks
      ?.filter((block) => block.type === "markdown")
      .map((block) => ("body_md" in block ? block.body_md : ""))
      .filter(Boolean)
      .join("\n\n") ?? ""
  );
}

export function whyGridItems(
  section: EcosystemSection | undefined,
  role?: string,
): WhyRecord[] {
  const blocks = section?.blocks ?? [];
  const block = blocks.find(
    (candidate): candidate is EcosystemGridBlock =>
      candidate.type === "grid" && (!role || candidate.role === role),
  );
  return (block?.items ?? []) as WhyRecord[];
}

export function whyImage(section: EcosystemSection | undefined) {
  return section?.blocks?.find((block) => block.type === "image") as
    | { type: "image"; src?: string; alt?: string; caption?: string | null }
    | undefined;
}

export function whyString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function whyLede(page: EcosystemStaticPage | null | undefined): string {
  return page?.lede?.find((line) => line.trim()) ?? page?.meta.summary ?? "";
}

export function whyMetaRows(
  items: WhyRecord[],
  fallback: Array<{ label: string; value: string }>,
): Array<{ label: string; value: string }> {
  const rows = items
    .map((item) => ({
      label: whyString(item.label),
      value: whyString(item.value),
    }))
    .filter((item) => item.label && item.value);
  return rows.length ? rows : fallback;
}
