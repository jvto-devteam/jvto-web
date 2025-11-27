"use client";

import { useGlobalSingletonsStore } from "@/lib/globalSingletonsStore";

export default function Page() {
  const s = useGlobalSingletonsStore();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-3">Global SEO Defaults</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-xs text-slate-400">Default Title</div>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.globalSeo.defaultTitle}
              onChange={(e) => s.setGlobalSeo({ defaultTitle: e.target.value })}
              placeholder="Default site title"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-slate-400">
              Default Meta Description
            </div>
            <textarea
              className="w-full min-h-[96px] bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.globalSeo.defaultMetaDescription}
              onChange={(e) =>
                s.setGlobalSeo({ defaultMetaDescription: e.target.value })
              }
              placeholder="Short, human-readable description for search results."
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-400">
              Default OG Image (URL sementara)
            </div>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.globalSeo.defaultOgImage || ""}
              onChange={(e) =>
                s.setGlobalSeo({ defaultOgImage: e.target.value })
              }
              placeholder="https://cdn.yourdomain.com/.../og.jpg"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-400">Default Twitter Handle</div>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.globalSeo.defaultTwitterHandle}
              onChange={(e) =>
                s.setGlobalSeo({ defaultTwitterHandle: e.target.value })
              }
              placeholder="@yourbrand"
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h3 className="text-xs font-semibold mb-3">Indexing Defaults</h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.globalSeo.index}
              onChange={(e) => s.setGlobalSeo({ index: e.target.checked })}
            />
            <span>index</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.globalSeo.follow}
              onChange={(e) => s.setGlobalSeo({ follow: e.target.checked })}
            />
            <span>follow</span>
          </label>
        </div>
      </div>

      {/* Preview Meta Tags */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h3 className="text-xs font-semibold">Preview (readonly)</h3>
        <pre className="mt-3 text-xs bg-slate-950 border border-slate-800 rounded p-3 overflow-x-auto">
          {`<title>${s.globalSeo.defaultTitle || ""}</title>
<meta name="description" content="${
            s.globalSeo.defaultMetaDescription || ""
          }" />
<meta property="og:title" content="${s.globalSeo.defaultTitle || ""}" />
<meta property="og:description" content="${
            s.globalSeo.defaultMetaDescription || ""
          }" />
${
  s.globalSeo.defaultOgImage
    ? `<meta property="og:image" content="${s.globalSeo.defaultOgImage}" />`
    : ""
}
${
  s.globalSeo.defaultTwitterHandle
    ? `<meta name="twitter:site" content="${s.globalSeo.defaultTwitterHandle}" />`
    : ""
}
<meta name="robots" content="${s.globalSeo.index ? "index" : "noindex"}, ${
            s.globalSeo.follow ? "follow" : "nofollow"
          }" />`}
        </pre>
      </div>
    </div>
  );
}
