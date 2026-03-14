"use client";

import { useState, useEffect } from "react";
import { getVerificationDocs, type Doc } from "@/lib/data-loader";
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
  BadgeCheck,
  Lock,
  CalendarCheck,
  FileText,
  Filter,
  Grid,
  Gavel,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/website/UI/Button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function VerifyJvtoClient({
  initialDocs,
  groupTitle,
}: {
  initialDocs?: Doc[];
  groupTitle?: string;
}) {
  const [activeTab, setActiveTab] = useState("all");
  const pathname = usePathname();
  const [showHash, setShowHash] = useState<Record<string, boolean>>({});
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [documents, setDocuments] = useState<Doc[]>([]);
  useEffect(() => {
    if (initialDocs) {
      setDocuments(initialDocs);
    } else {
      const data = getVerificationDocs();
      const allDocs: Doc[] = [
        ...data.company_registration,
        ...data.police_clearances,
        ...data.operations,
        ...data.health_safety,
        ...data.company_history,
        ...data.press_coverage,
        ...data.membership,
        ...(data.founder || []),
        ...(data.credentials || []),
      ];
      setDocuments(allDocs);
    }
  }, [initialDocs]);
  const showTabs = !initialDocs;

  const categories = [
    { id: "all", label: "All Documents" },
    { id: "founder", label: "Founder" },
    { id: "police_clearances", label: "Police Authority" },
    { id: "company_registration", label: "Legal & NIB" },
    { id: "operations", label: "Operations" },
    { id: "health_safety", label: "Health & Safety" },
    { id: "press_coverage", label: "Media Proof" },
    { id: "company_history", label: "History" },
    { id: "credentials", label: "Guide Credentials" },
  ];

  const filteredDocuments = showTabs
    ? activeTab === "all"
      ? documents
      : documents.filter((doc) => {
          switch (activeTab) {
            case "founder":
              return doc.category === "Founder";
            case "police_clearances":
              return doc.category === "PoliceDocs";
            case "company_registration":
              return ["BusinessID", "License", "Membership"].includes(
                doc.category,
              );
            case "operations":
              return ["OpsPhoto", "Facility"].includes(doc.category);
            case "health_safety":
              return doc.category === "Screening";
            case "press_coverage":
              return doc.category === "Press";
            case "company_history":
              return doc.category === "History";
            case "credentials":
              return doc.category === "Credentials";
            default:
              return false;
          }
        })
    : documents;

  const toggleHash = (filename: string) => {
    setShowHash((prev) => ({ ...prev, [filename]: !prev[filename] }));
  };

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

  useEffect(() => {
    document.body.style.overflow = selectedDoc ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedDoc]);

  // Fungsi untuk memotong SHA256 agar tampil rapi di card
  const formatSha256 = (sha: string | undefined) => {
    if (!sha) return "";
    return `${sha.substring(0, 8)}...${sha.substring(sha.length - 8)}`;
  };

  return (
    <div className="flex py-30 flex-col min-h-screen bg-[#f6f6f8] font-sans text-slate-800">
      <main className="flex-grow p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        {/* HERO SECTION */}
        <section className="mb-10 bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-yellow-50/50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1445b8] rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                <Gavel className="w-3.5 h-3.5" />
                Forensic Verification Protocol
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
                Trust Through{" "}
                <span className="text-[#1445b8]">Transparency.</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mb-6">
                This locker serves as a digitally signed, immutable repository
                of <strong>PT Java Volcano Rendezvous</strong>'s legal standing
                (NIB 1102230032918), <strong>Tourist Police authority</strong>{" "}
                (Ditpamobvit), and operational history in East Java.
              </p>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-700 font-medium">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Verified Legal Entity (PT)
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Active Police Integration
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ISO-Standard Health Protocols
                </span>
              </div>
            </div>
            <div className="hidden lg:flex gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center min-w-[140px]">
                <p className="text-3xl font-black text-[#1445b8] mb-1">
                  {filteredDocuments.length}
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">
                  Verified Assets
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center min-w-[140px]">
                <p className="text-3xl font-black text-slate-900 mb-1">100%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">
                  Audit Pass Rate
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center min-w-[140px]">
                <p className="text-3xl font-black text-slate-900 mb-1">2015</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">
                  Since
                </p>
              </div>
            </div>
          </div>
        </section>
        {groupTitle && (
          <section className="mb-8">
            <h1 className="text-3xl font-bold">{groupTitle}</h1>
          </section>
        )}
        {/* Tab navigasi untuk semua halaman */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 sticky top-20 z-20 py-2 bg-[#f6f6f8]/95 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/verify-jvto"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                pathname === "/verify-jvto"
                  ? "bg-[#1445b8] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              All Documents
            </Link>
            <Link
              href="/verify-jvto/legal"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                pathname === "/verify-jvto/legal"
                  ? "bg-[#1445b8] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Legal
            </Link>
            <Link
              href="/verify-jvto/police-safety"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                pathname === "/verify-jvto/police-safety"
                  ? "bg-[#1445b8] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Police & Safety
            </Link>
            <Link
              href="/verify-jvto/press-recognition"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                pathname === "/verify-jvto/press-recognition"
                  ? "bg-[#1445b8] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Press Recognition
            </Link>
            <Link
              href="/verify-jvto/history-artifacts"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                pathname === "/verify-jvto/history-artifacts"
                  ? "bg-[#1445b8] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              History Artifacts
            </Link>
          </div>
        </div>{" "}
        {/* DOCUMENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc, i) => {
            const isPdf = doc.url.endsWith(".pdf");
            const displayImage = doc.preview?.url || doc.url;
            const isHighAuthority = [
              "PoliceDocs",
              "BusinessID",
              "License",
            ].includes(doc.category);

            return (
              <div
                key={i}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <Image
                      src={displayImage}
                      alt={doc.caption}
                      fill
                      className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button className="bg-white/90 p-2.5 rounded-full text-slate-900 hover:bg-white hover:scale-110 transition-all shadow-lg">
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        isHighAuthority
                          ? "bg-[#1445b8] text-white"
                          : "bg-white/90 text-slate-700"
                      }`}
                    >
                      {doc.category === "PoliceDocs"
                        ? "Authority"
                        : doc.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-bold text-slate-900 text-sm leading-snug line-clamp-2"
                        title={doc.official_title}
                      >
                        {doc.official_title}
                      </h3>
                      {isPdf && (
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {doc.narrative_context}
                    </p>
                  </div>

                  {/* SHA256 langsung ditampilkan di card */}
                  {doc.sha256 && (
                    <div className="mb-2 bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[8px] text-slate-600 break-all">
                      <span className="font-bold text-slate-400">SHA256: </span>
                      {doc.sha256}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {doc.size_mb.toFixed(2)} MB
                      </span>
                      {doc.external_validation_url ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                          <ShieldCheck className="w-3 h-3" /> Live Verify
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                          <Lock className="w-3 h-3" /> Signed
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-[#1445b8] hover:text-[#1445b8] text-xs h-9 font-bold shadow-none"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        Preview
                      </Button>

                      {doc.external_validation_url && (
                        <Button className="flex-1 bg-[#1445b8] text-white hover:bg-blue-800 text-xs h-9 font-bold shadow-sm border-transparent">
                          <a
                            href={doc.external_validation_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center w-full h-full"
                          >
                            Verify <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111621]/90 backdrop-blur-sm p-0 md:p-6 overflow-hidden animate-in fade-in duration-200">
          <button
            onClick={handlePrev}
            className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 z-50 backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 z-50 backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-7xl bg-white dark:bg-[#111621] rounded-none md:rounded-xl shadow-2xl overflow-hidden flex flex-col h-full md:h-[95vh] border border-gray-200 dark:border-gray-800">
            <div className="md:hidden p-4 bg-white border-b flex justify-between items-center">
              <h3 className="font-bold text-sm truncate pr-4">
                {selectedDoc.official_title}
              </h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
              {/* Sidebar */}
              <div className="w-full lg:w-[35%] border-b lg:border-b-0 lg:border-r border-gray-200 bg-slate-50/80 p-6 lg:p-8 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-green-100 text-green-700 mb-3 border border-green-200 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                      Official Verified Asset
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight font-display">
                      {selectedDoc.official_title}
                    </h3>
                    <p className="text-slate-500 text-xs font-mono mt-2 bg-slate-100 inline-block px-2 py-1 rounded border border-slate-200">
                      SHA256: {selectedDoc.sha256?.substring(0, 24)}...
                    </p>
                  </div>

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
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shrink-0">
                          <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <a
                            href={selectedDoc.external_validation_url}
                            target="_blank"
                            rel="noopener noreferrer"
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
                          Status
                        </span>
                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Active & Valid
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                      <BadgeCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-bold">
                        Internal Forensic Asset
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Digitally signed and archived by JVTO.
                      </p>
                    </div>
                  )}

                  {/* Context & Metadata */}
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Context
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {selectedDoc.narrative_context}
                      </p>
                    </div>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          Verified Date
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
                          Size
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedDoc.size_mb.toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={() => toggleHash(selectedDoc.filename)}
                        className="flex items-center gap-2 text-xs font-bold text-[#1445b8] hover:underline mb-2 w-full"
                      >
                        {showHash[selectedDoc.filename] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        {showHash[selectedDoc.filename]
                          ? "Hide Full Hash"
                          : "View Cryptographic Signature"}
                      </button>
                      {showHash[selectedDoc.filename] && (
                        <div className="bg-slate-900 text-green-400 p-3 rounded text-[10px] break-all font-mono leading-relaxed border border-slate-800 shadow-inner">
                          {selectedDoc.sha256}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Preview */}
              <div className="w-full lg:w-[65%] bg-slate-200 relative flex flex-col overflow-hidden">
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
                  <div className="w-px bg-slate-300 mx-1"></div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-2 rounded-md hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4 lg:p-12 flex justify-center items-center bg-slate-200/50 relative">
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(#94a3b8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>

                  <div
                    className="relative bg-white shadow-2xl rounded-sm transition-transform duration-200 ease-out origin-top border border-slate-200 flex justify-center items-center"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 z-10"></div>

                    <div className="relative w-full h-full min-h-[400px] flex justify-center items-center">
                      <Image
                        src={selectedDoc.preview?.url || selectedDoc.url}
                        alt={selectedDoc.caption}
                        width={800}
                        height={600}
                        className="max-w-full md:max-w-[650px] h-auto object-contain bg-white"
                        style={{ width: "auto", height: "auto" }}
                        sizes="(max-width: 768px) 100vw, 650px"
                        priority
                      />
                    </div>
                    <div className="absolute bottom-6 right-6 opacity-90 pointer-events-none mix-blend-multiply">
                      <div className="border-[3px] border-blue-900/20 rounded-full px-4 py-1.5 -rotate-12 bg-white/50 backdrop-blur-sm">
                        <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest flex items-center gap-1">
                          <Gavel className="w-3 h-3" /> JVTO Verified
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Ganti teks dari "Download" menjadi "Open Original" */}
            <footer className="p-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 px-6 lg:px-8 z-10">
              <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5 mr-2 text-[#1445b8]" />
                Secure Viewer • {selectedDoc.filename}
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="flex-1 md:flex-none flex items-center justify-center rounded-lg h-10 px-6 bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center rounded-lg h-10 px-8 bg-[#1445b8] text-white font-bold text-sm gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  <Eye className="w-4 h-4" />
                  Open Original
                </a>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
