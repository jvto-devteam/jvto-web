"use client";

import { useState, useEffect } from "react";
import { getVerificationDocs, type Doc } from "@/lib/data-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Eye,
  EyeOff,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Landmark,
  Shield,
  Gavel,
  BadgeCheck,
  Lock,
  CalendarCheck,
  FileText,
} from "lucide-react";
import Button from "@/components/website/UI/Button";

export default function VerifyJvtoClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [showHash, setShowHash] = useState<Record<string, boolean>>({});

  // State untuk Modal Preview
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Ambil Data
  const data = getVerificationDocs();
  const rawDocs: Doc[] = [
    ...data.company_registration,
    ...data.membership,
    ...data.police_clearances,
    ...data.operations,
    ...data.health_safety,
    ...data.company_history,
    ...data.press_coverage,
  ];

  // Filter dokumen valid
  const documents = rawDocs.filter((doc) => {
    const isImageFile = doc.url.match(/\.(jpg|jpeg|png|webp)$/i);
    const hasPreview = doc.preview?.url;
    return isImageFile || hasPreview;
  });

  const categories = [
    { id: "all", label: "All Evidence", count: documents.length },
    {
      id: "police_clearances",
      label: "Police Authority",
      count: documents.filter((d) => d.category === "PoliceDocs").length,
    },
    {
      id: "company_registration",
      label: "Legal & NIB",
      count: documents.filter((d) =>
        ["BusinessID", "License", "Membership"].includes(d.category),
      ).length,
    },
    {
      id: "operations",
      label: "Operations",
      count: documents.filter((d) =>
        ["OpsPhoto", "Facility"].includes(d.category),
      ).length,
    },
    {
      id: "health_safety",
      label: "Health Protocols",
      count: documents.filter((d) => d.category === "Screening").length,
    },
    {
      id: "press_coverage",
      label: "Media Validation",
      count: documents.filter((d) => d.category === "Press").length,
    },
    {
      id: "company_history",
      label: "History",
      count: documents.filter((d) => d.category === "History").length,
    },
  ];

  const filteredDocuments =
    activeTab === "all"
      ? documents
      : documents.filter((doc) => {
          if (activeTab === "company_registration")
            return ["BusinessID", "License", "Membership"].includes(
              doc.category,
            );
          if (activeTab === "police_clearances")
            return doc.category === "PoliceDocs";
          if (activeTab === "operations")
            return ["OpsPhoto", "Facility"].includes(doc.category);
          if (activeTab === "health_safety")
            return doc.category === "Screening";
          if (activeTab === "press_coverage") return doc.category === "Press";
          if (activeTab === "company_history")
            return doc.category === "History";
          return true;
        });

  const toggleHash = (filename: string) => {
    setShowHash((prev) => ({ ...prev, [filename]: !prev[filename] }));
  };

  // Navigasi Next/Prev di Modal
  const handleNext = () => {
    if (!selectedDoc) return;
    const currentIndex = filteredDocuments.findIndex(
      (d) => d.filename === selectedDoc.filename,
    );
    const nextIndex = (currentIndex + 1) % filteredDocuments.length;
    setSelectedDoc(filteredDocuments[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedDoc) return;
    const currentIndex = filteredDocuments.findIndex(
      (d) => d.filename === selectedDoc.filename,
    );
    const prevIndex =
      (currentIndex - 1 + filteredDocuments.length) % filteredDocuments.length;
    setSelectedDoc(filteredDocuments[prevIndex]);
  };

  // Prevent scroll saat modal terbuka
  useEffect(() => {
    if (selectedDoc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedDoc]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <main className="flex-grow pt-20">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* HEADER */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                Tourist Police Protected
              </div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-gray-900">
                Forensic Evidence Locker
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                A digitally signed repository of JVTO's legal standing, police
                authority, and operational history.
              </p>
            </div>

            {/* TABS */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${
                    activeTab === cat.id
                      ? "bg-blue-900 text-white shadow-lg ring-2 ring-yellow-400 ring-offset-2"
                      : "bg-white border text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-full ${
                      activeTab === cat.id
                        ? "bg-yellow-400 text-blue-900"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* GRID DOKUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map((doc, i) => {
                const isPdf = doc.url.endsWith(".pdf");
                const displayImage = doc.preview?.url || doc.url;
                const isHighAuthority = [
                  "PoliceDocs",
                  "BusinessID",
                  "License",
                ].includes(doc.category);
                const headerColor = isHighAuthority
                  ? "bg-slate-900 border-slate-900"
                  : "bg-gray-100 border-gray-200";
                const badgeColor = isHighAuthority
                  ? "bg-yellow-500 text-black"
                  : "bg-black/70 text-white";

                return (
                  <Card
                    key={i}
                    className={`flex flex-col h-full border hover:shadow-xl transition-shadow duration-300 ${isHighAuthority ? "border-slate-300" : "border-gray-200"}`}
                  >
                    <CardHeader className="p-0">
                      <div
                        className={`relative aspect-[4/3] w-full overflow-hidden group ${headerColor}`}
                      >
                        <img
                          src={displayImage}
                          alt={doc.alt_text || doc.caption}
                          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div
                          className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded shadow-sm ${badgeColor}`}
                        >
                          {isPdf ? "OFFICIAL DOC" : "VERIFIED ASSET"}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-grow p-6 bg-white">
                      <CardTitle className="text-base font-bold line-clamp-2 leading-tight text-gray-900 mb-3">
                        {doc.official_title}
                      </CardTitle>

                      <div className="mb-4 p-3 bg-slate-50 border-l-4 border-blue-900 rounded-r text-xs text-slate-700 leading-relaxed">
                        {doc.narrative_context}
                      </div>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-3">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Size: {doc.size_mb.toFixed(2)} MB
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Verified: {doc.last_verified}
                          </span>
                        </div>

                        {/* HASH TOGGLE */}
                        {doc.sha256 && (
                          <div className="mb-4 pt-3 border-t border-dashed border-gray-200">
                            <button
                              onClick={() => toggleHash(doc.filename)}
                              className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 hover:text-blue-900 transition-colors uppercase"
                            >
                              {showHash[doc.filename] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                              {showHash[doc.filename]
                                ? "Hide Signature"
                                : "Show SHA256 Hash"}
                            </button>
                            {showHash[doc.filename] && (
                              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[9px] font-mono break-all leading-relaxed">
                                {doc.sha256}
                              </div>
                            )}
                          </div>
                        )}

                        {/* BUTTONS */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* PREVIEW BUTTON (Updated) */}
                          <Button
                            className={`w-full text-xs font-bold col-span-2 bg-blue-900 hover:bg-blue-800 text-white shadow-sm border border-blue-800`}
                            onClick={() => setSelectedDoc(doc)}
                          >
                            <span className="flex items-center justify-center gap-2">
                              <Maximize2 className="w-3.5 h-3.5" />
                              Preview Evidence
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* --- JVTO EVIDENCE VIEWER MODAL (Custom Implementation) --- */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 z-50 backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 z-50 backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Wrapper */}
          <div className="relative w-full max-w-7xl bg-white dark:bg-[#111621] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-[95vh] border border-gray-200 dark:border-gray-800">
            {/* Header Mobile Close */}
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 lg:hidden z-50 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
              {/* SIDEBAR: Metadata & Verification */}
              <div className="w-full lg:w-[35%] border-b lg:border-b-0 lg:border-r border-gray-200 bg-slate-50/80 p-6 lg:p-8 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  {/* Title Section */}
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-green-100 text-green-700 mb-3 border border-green-200 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                      Official Verified Asset
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight font-display">
                      {selectedDoc.official_title}
                    </h3>
                    <p className="text-slate-500 text-xs font-mono mt-2 bg-slate-100 inline-block px-2 py-1 rounded">
                      SHA256: {selectedDoc.sha256?.substring(0, 16)}...
                    </p>
                  </div>

                  {/* External Verification Box */}
                  {selectedDoc.external_validation_url ? (
                    <div className="p-5 bg-white rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                      <div className="flex items-center gap-2 mb-4 relative z-10">
                        <Landmark className="w-4 h-4 text-blue-700" />
                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                          Official Registry Verification
                        </p>
                      </div>

                      <div className="flex gap-4 items-center relative z-10">
                        {/* QR Placeholder or Icon */}
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shrink-0">
                          <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <a
                            href={selectedDoc.external_validation_url}
                            target="_blank"
                            className="flex items-center justify-center rounded-lg h-9 px-4 bg-blue-600 text-white font-bold text-xs gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Verify Source Live
                          </a>
                          <p className="text-[10px] leading-tight text-slate-500 italic">
                            Redirects to official government/media domain for
                            cross-reference.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between relative z-10">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                          Registry Status
                        </span>
                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Active & Valid
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-slate-100 rounded-xl border border-slate-200 text-center">
                      <BadgeCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-bold">
                        Internal Forensic Asset
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Digitally signed and archived by JVTO.
                      </p>
                    </div>
                  )}

                  {/* Metadata List */}
                  <div className="space-y-0 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          Last Verified
                        </p>
                        <div className="flex items-center gap-1.5">
                          <CalendarCheck className="w-3.5 h-3.5 text-slate-600" />
                          <p className="text-sm font-bold text-slate-800">
                            {selectedDoc.last_verified}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          File Size
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedDoc.size_mb.toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Document Context
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {selectedDoc.narrative_context}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Category
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">
                        {categories.find(
                          (c) =>
                            selectedDoc.category === c.id ||
                            (selectedDoc.category === "BusinessID" &&
                              c.id === "company_registration") ||
                            (selectedDoc.category === "OpsPhoto" &&
                              c.id === "operations"),
                        )?.label || selectedDoc.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAIN PREVIEW AREA */}
              <div className="w-full lg:w-[65%] bg-slate-200 relative flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-4 z-20 flex gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-lg border border-white/50">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                    className="p-2 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-2 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Reset"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                    className="p-2 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                </div>

                {/* Document Canvas */}
                <div className="flex-1 overflow-auto p-4 lg:p-12 flex justify-center items-center bg-slate-100/50 relative">
                  {/* Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(#cbd5e1 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>

                  <div
                    className="relative bg-white shadow-2xl rounded-sm transition-transform duration-200 ease-out origin-top"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  >
                    {/* Watermark / Header Document (Visual Flair) */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 z-10"></div>

                    <img
                      src={selectedDoc.preview?.url || selectedDoc.url}
                      alt={selectedDoc.caption}
                      className="max-w-full md:max-w-[600px] h-auto object-contain block mx-auto bg-white"
                    />

                    {/* Footer Stamp */}
                    <div className="absolute bottom-4 right-4 opacity-80 pointer-events-none">
                      <div className="border-2 border-red-600/30 rounded-full px-3 py-1 -rotate-12">
                        <p className="text-[10px] font-black text-red-600/40 uppercase">
                          JVTO Verified
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <footer className="p-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 px-6 lg:px-8">
              <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5 mr-2 text-blue-600" />
                Secure Document Access • {selectedDoc.filename}
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="flex-1 md:flex-none flex items-center justify-center rounded-lg h-10 px-6 bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center rounded-lg h-10 px-8 bg-blue-900 text-white font-bold text-sm gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  <Download className="w-4 h-4" />
                  Download Official File
                </a>
              </div>
            </footer>

            {/* Desktop Close Button (Floating) */}
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 hidden lg:flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full text-slate-500 transition-all z-50 border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
