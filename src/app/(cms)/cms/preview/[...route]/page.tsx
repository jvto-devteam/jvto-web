// src/app/(cms)/cms/preview/[...route]/page.tsx
// Admin-only DRAFT preview for the block-model editor. Renders the saved draft
// (content._draft.sections) via the SAME BlocksRenderer the live site uses, so an
// admin can see a draft BEFORE Publish — independent of whether the public route is
// DB-preferred yet. Gated by (cms)/layout.tsx (admin session). Reads the live row
// directly (not the 1h-cached getContentPage) + force-dynamic so a just-saved draft
// shows immediately. Never touches the public render path.
import { prisma } from "@/lib/prisma";
import Link from "@/components/website/AppLink";
import { ArrowLeft } from "lucide-react";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";

export const dynamic = "force-dynamic";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default async function CmsPreviewPage({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route: segments } = await params;
  const route = "/" + segments.map((s) => decodeURIComponent(s)).join("/");

  const row = await prisma.content_pages
    .findFirst({ where: { route, lang: "en" } })
    .catch(() => null);

  const content = isRecord(row?.content) ? (row!.content as Record<string, unknown>) : {};
  const draft = isRecord(content._draft) ? (content._draft as Record<string, unknown>) : null;
  const draftSections =
    draft && Array.isArray(draft.sections) ? (draft.sections as any[]) : null;
  const usingDraft = draftSections != null;
  const sections: any[] = usingDraft
    ? draftSections!
    : Array.isArray(content.sections)
      ? (content.sections as any[])
      : [];
  const bodyMd = typeof content.body_md === "string" ? content.body_md : null;

  const consoleHref = `/cms/pages${route}`;

  return (
    <div className="min-h-screen bg-white text-[#0D1B2A]">
      {/* Admin preview bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2 text-[13px] text-amber-900">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          {usingDraft ? "DRAFT PREVIEW" : "PUBLISHED (no draft saved)"}
        </span>
        <span className="font-mono text-amber-800">{route}</span>
        <Link
          href={consoleHref}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2 py-1 text-amber-900 hover:bg-amber-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to editor
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {!row && (
          <p className="text-sm text-slate-500">
            No content_pages row found for this route.
          </p>
        )}

        {!usingDraft && sections.length === 0 && !bodyMd && (
          <p className="text-sm text-slate-500">
            No draft and no published sections/body to preview. Save a draft in the
            editor first.
          </p>
        )}

        {sections.map((sec, i) => (
          <section
            key={sec?.id ?? i}
            id={sec?.id}
            style={{ marginBottom: "3rem" }}
          >
            {sec?.title && (
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: "0 0 0.5rem",
                }}
              >
                {sec.title}
              </h2>
            )}
            {sec?.summary && (
              <p style={{ color: "#5a6b52", margin: "0 0 1rem" }}>{sec.summary}</p>
            )}
            {Array.isArray(sec?.blocks) ? (
              <BlocksRenderer blocks={sec.blocks} sectionId={sec?.id} />
            ) : sec?.body_md ? (
              <MarkdownRenderer markdown={sec.body_md} />
            ) : null}
          </section>
        ))}

        {sections.length === 0 && bodyMd && <MarkdownRenderer markdown={bodyMd} />}
      </div>
    </div>
  );
}
