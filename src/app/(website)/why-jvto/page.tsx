import { notFound } from "next/navigation";
import { getContentPage } from "@/lib/content/getContentPage";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";

export default async function WhyJVTOPage() {
  const row = await getContentPage("/why-jvto", "en");
  if (!row) return notFound();

  const content = row.content as any;

  // Assumption: content has { h1?: string, body_md: string }
  const h1 = content?.h1 ?? "Why JVTO";
  const body = content?.body_md ?? "";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{h1}</h1>
      </header>

      <MarkdownRenderer markdown={body} />
    </main>
  );
}
