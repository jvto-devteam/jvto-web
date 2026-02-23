"use client";

import { useState } from "react";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Gavel,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

// Helper: dapatkan semua aset yang ditampilkan (is_show = true)
const visibleAssets = ssotData.assets_inventory.filter(
  (a) => a.is_show === true,
);

// Kelompokkan aset berdasarkan kategori
const assetsByCategory = visibleAssets.reduce(
  (acc, asset) => {
    const cat = asset.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(asset);
    return acc;
  },
  {} as Record<string, typeof visibleAssets>,
);

// Urutan kategori (opsional, bisa disesuaikan)
const categoryOrder = [
  "BusinessID",
  "License",
  "Membership",
  "PoliceDocs",
  "Founder",
  "Credentials",
  "OpsPhoto",
  "Screening",
  "Press",
  "History",
  "Brand",
];

// Sortir kategori berdasarkan urutan di atas, sisanya di akhir
const sortedCategories = Object.keys(assetsByCategory).sort((a, b) => {
  const ia = categoryOrder.indexOf(a);
  const ib = categoryOrder.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
});

export default function VerifyJvtoClient() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Cari credential yang terkait dengan aset (untuk external link)
  const findCredentialForAsset = (assetSlug: string) => {
    return ssotData.verification_credentials.find((cred) =>
      cred.evidence_asset_slugs?.includes(assetSlug),
    );
  };

  const selectedCred = selectedAsset
    ? findCredentialForAsset(selectedAsset.slug)
    : null;
  const externalUrl = selectedCred?.identifiers?.registry_url;

  return (
    <div className="flex flex-col flex-1 h-full md:py-25 py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-6 pb-2 px-4 md:px-10 border-b border-border bg-background">
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500 mb-2">
            <span>HOME</span>
            <span>/</span>
            <span className="text-[#9fce33] font-bold">VERIFY JVTO</span>
          </div>
          <h1 className="text-[#9fce33] font-display text-3xl md:text-4xl font-bold uppercase tracking-tight leading-none">
            Evidence Locker
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider">
            SYSTEM STATUS: ONLINE
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex justify-center px-4 md:px-10 py-8 bg-background">
        <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
          {/* Left Sidebar: Asset List by Category */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-border shadow-sm flex flex-col h-full rounded-sm overflow-hidden">
              <div className="bg-gray-100 border-b border-border px-4 py-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-[#9fce33] tracking-wide uppercase">
                  Dossier Index
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  [{visibleAssets.length} ITEMS]
                </span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px]">
                {sortedCategories.map((category) => (
                  <div key={category} className="mb-2">
                    <div className="sticky top-0 z-10 bg-gray-50 py-1 px-2 font-mono text-xs font-bold text-[#9fce33] uppercase tracking-wider border-b border-gray-200">
                      {category}
                    </div>
                    <div className="mt-1 space-y-1">
                      {assetsByCategory[category].map((asset) => (
                        <div
                          key={asset.slug}
                          onClick={() => setSelectedAsset(asset)}
                          className={`group relative cursor-pointer border-l-4 p-3 transition-all ${
                            selectedAsset?.slug === asset.slug
                              ? "border-l-[#9fce33] bg-blue-50/50"
                              : "border-l-transparent hover:bg-gray-50 hover:border-l-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-0.5">
                            <span
                              className={`font-mono text-[8px] font-bold px-1 rounded-sm ${
                                selectedAsset?.slug === asset.slug
                                  ? "text-[#9fce33] bg-[#9fce33]/10"
                                  : "text-gray-500 bg-gray-100"
                              }`}
                            >
                              {asset.sha256}
                            </span>
                            <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-200">
                              <CheckCircle className="size-2.5" /> Verified
                            </span>
                          </div>
                          <h4
                            className={`text-sm font-bold leading-tight transition-colors ${
                              selectedAsset?.slug === asset.slug
                                ? "text-[#9fce33]"
                                : "text-gray-700 group-hover:text-[#9fce33]"
                            }`}
                          >
                            {asset.caption}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-mono line-clamp-2 mt-0.5">
                            {asset.geo_context || asset.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Link Block - Tampil jika aset dipilih dan punta external URL */}
            {selectedAsset && externalUrl && (
              <div className="bg-[#9fce33] text-white border border-[#9fce33]/80 p-5 rounded-sm shadow-md relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                  <Gavel className="size-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="text-accent size-5" />
                    <h4 className="font-display font-bold text-lg uppercase tracking-wide">
                      External Verification
                    </h4>
                  </div>
                  <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                    Verify this document directly with the official registry.
                  </p>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between w-full bg-white text-[#9fce33] px-4 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                  >
                    <span>OPEN REGISTRY DATABASE</span>
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            )}
          </aside>

          {/* Right Area: Document Viewer */}
          <section className="lg:col-span-8 flex flex-col">
            {/* Viewer Controls Header */}
            <div className="bg-slate-800 text-white rounded-t-sm p-3 flex flex-wrap justify-between items-center gap-4 border-b border-slate-600 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded-sm">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider font-display">
                    {selectedAsset ? selectedAsset.caption : "Select an asset"}
                  </h2>
                  {selectedAsset && (
                    <div className="text-[10px] font-mono text-slate-400">
                      {selectedAsset.filename} •{" "}
                      {selectedAsset.size_mb
                        ? `${selectedAsset.size_mb.toFixed(2)} MB`
                        : ""}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 hover:bg-white/10 rounded-sm text-slate-300 hover:text-white transition-colors"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                  title="Zoom Out"
                >
                  <ZoomOut className="size-4" />
                </button>
                <span className="font-mono text-xs text-slate-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  className="p-1.5 hover:bg-white/10 rounded-sm text-slate-300 hover:text-white transition-colors"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                  title="Zoom In"
                >
                  <ZoomIn className="size-4" />
                </button>
                <div className="h-4 w-px bg-slate-600 mx-2"></div>
                {selectedAsset && (
                  <a
                    href={selectedAsset.file_url || selectedAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-accent bg-orange-600 text-white px-3 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Download className="size-3" /> Open File
                  </a>
                )}
                {selectedAsset && externalUrl && (
                  <>
                    <div className="h-4 w-px bg-slate-600 mx-2"></div>
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <ExternalLink className="size-3" /> Verify
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Main Viewer Canvas */}
            <div className="bg-slate-200 flex-1 relative  max-h-[600px] overflow-y-auto border-x border-slate-300 technical-grid flex items-center justify-center p-8 overflow-hidden group/viewer">
              {selectedAsset ? (
                // Tampilkan aset yang dipilih
                selectedAsset.preview?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                  <div
                    className="relative shadow-2xl max-h-full max-w-full transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <Image
                      key={selectedAsset.slug} 
                      src={selectedAsset.preview}
                      alt={selectedAsset.caption}
                      width={800}
                      height={600}
                      className="max-h-[600px] w-auto h-auto object-contain bg-white p-2"
                    />
                    {(() => {
                      try {
                        const url = new URL(selectedAsset.preview);
                        return (
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded-sm">
                            SOURCE: {url.hostname}
                          </div>
                        );
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white p-12 shadow-xl rounded-sm max-w-md text-center">
                    <div className="size-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                      <FileText className="size-10" />
                    </div>
                    <h3 className="font-display font-bold text-xl uppercase mb-2">
                      {selectedAsset.caption}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      This is a secure PDF document. Access it directly via the
                      link below.
                    </p>
                    <a
                      href={selectedAsset.file_url || selectedAsset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#9fce33] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-[#9fce33]/80 transition-colors flex items-center gap-2"
                    >
                      Open PDF Document <ExternalLink className="size-4" />
                    </a>
                  </div>
                )
              ) : (
                // Placeholder jika belum ada aset dipilih
                <div className="relative bg-white shadow-2xl w-full max-w-[600px] aspect-[1/1.414] transform transition-transform duration-300 group-hover/viewer:scale-[1.01] flex flex-col">
                  <div className="absolute top-4 right-4 z-20 bg-[#9fce33]/90 text-white text-[10px] font-mono px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm pointer-events-none opacity-0 group-hover/viewer:opacity-100 transition-opacity">
                    Hover to Inspect
                  </div>
                  <div className="flex-1 p-8 flex flex-col relative">
                    <div className="border-b-2 border-black pb-4 mb-6 opacity-80 flex justify-between items-center">
                      <div className="size-12 bg-slate-800 rounded-full flex items-center justify-center text-white">
                        <Gavel className="size-6" />
                      </div>
                      <div className="text-right">
                        <h2 className="text-xs font-serif font-bold uppercase text-slate-900">
                          Republic of Indonesia
                        </h2>
                        <p className="text-[10px] text-slate-600 uppercase">
                          Official Document
                        </p>
                      </div>
                    </div>
                    <div className="text-center mb-8">
                      <h1 className="font-serif font-bold text-lg uppercase underline decoration-double underline-offset-4">
                        Select an asset from the dossier
                      </h1>
                      <p className="font-mono text-xs mt-2">to view details</p>
                    </div>
                    <div className="space-y-3 text-[10px] text-slate-800 font-serif leading-relaxed text-justify opacity-70">
                      <p>
                        Choose any verified document from the left panel to
                        inspect its contents, cryptographic signature, and
                        external verification links.
                      </p>
                    </div>
                    <div className="mt-auto flex justify-end pt-10 relative">
                      <div className="text-center relative">
                        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-4 border-blue-600/40 text-blue-600/40 flex items-center justify-center transform -rotate-12 mix-blend-multiply">
                          <div className="w-20 h-20 rounded-full border-2 border-blue-600/40 flex items-center justify-center text-[8px] font-bold uppercase text-center leading-tight tracking-tighter p-1">
                            OFFICIAL
                            <br />
                            VERIFIED
                            <br />
                            APPROVED
                          </div>
                        </div>
                        <div className="absolute -top-10 -left-16 transform -rotate-12 border-4 border-accent text-accent px-4 py-1 text-xl font-black uppercase tracking-widest opacity-80 mix-blend-multiply">
                          VERIFIED
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-200 font-mono text-[8px] text-slate-400 break-all text-center opacity-60">
                      <span className="font-bold text-slate-600">
                        DIGITAL SIGNATURE (SHA-256):
                      </span>
                      <br />
                      0x1a2b3c...e4f9a2b
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                      <span className="text-6xl font-black uppercase transform -rotate-45">
                        OFFICIAL COPY
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="bg-white border border-t-0 border-slate-300 p-3 flex flex-wrap justify-between items-center text-xs font-mono text-gray-500 rounded-b-sm">
              <div className="flex gap-4">
                <span>
                  LAST AUDIT:{" "}
                  <span className="text-slate-800 font-bold">24 HOURS AGO</span>
                </span>
                <span className="hidden md:inline text-slate-300">|</span>
                <span>
                  AUDITOR:{" "}
                  <span className="text-slate-800">INTERNAL COMPLIANCE</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-emerald-700">
                  DOCUMENT VALID
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
