"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/website/UI/Button";
import { getVerificationDocs, type Doc } from "@/lib/data-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Eye,
  EyeOff,
  Maximize2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function VerifyJvtoClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [showHash, setShowHash] = useState<Record<string, boolean>>({});

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
    setShowHash((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
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
                <span className="block mt-1 font-medium text-gray-900">
                  Verify everything. Trust is not a commodity.
                </span>
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

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map((doc, i) => {
                const isPdf = doc.url.endsWith(".pdf");
                const displayImage = doc.preview?.url || doc.url;

                // Styling Logic
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

                // Button Logic
                const hasExternalLink = !!doc.external_validation_url;

                // Definisi Kelas Warna (Hijau color-jvto-green sesuai screenshot)
                // Jika ingin persis seperti screenshot (color-jvto-green Green):
                const greenButtonClass =
                  "bg-color-jvto-green-500 hover:bg-color-jvto-green-600 text-white border-color-jvto-green-600 shadow-sm";
                // Definisi Kelas Warna Putih/Outline
                const whiteButtonClass =
                  "bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50";

                return (
                  <Card
                    key={i}
                    className={`flex flex-col h-full border hover:shadow-xl transition-shadow duration-300 ${isHighAuthority ? "border-slate-300" : "border-gray-200"}`}
                  >
                    {/* VISUAL PREVIEW */}
                    <CardHeader className="p-0">
                      <div
                        className={`relative aspect-[4/3] w-full overflow-hidden group ${headerColor}`}
                      >
                        <Image
                          src={displayImage}
                          alt={doc.alt_text || doc.caption || doc.filename}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded shadow-sm ${badgeColor}`}
                        >
                          {isPdf ? "OFFICIAL DOC" : "VERIFIED ASSET"}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-grow p-6 bg-white">
                      {/* TITLE & META */}
                      <CardTitle className="text-base font-bold line-clamp-2 leading-tight text-gray-900">
                        {doc.caption}
                      </CardTitle>

                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Size: {doc.size_mb.toFixed(2)} MB
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Verified: {doc.last_verified}
                        </span>
                      </div>

                      {/* FORENSIC HASH */}
                      {doc.sha256 && (
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
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

                      {/* ACTION BUTTONS: LOGIC PERBAIKAN */}
                      <div className="mt-auto pt-5 grid grid-cols-2 gap-3">
                        {/* 1. Tombol Download / View Image */}
                        {/* Logic: 
                            - Jika ada link eksternal (2 tombol), dia pakai outline (putih) & col-span-1. 
                            - Jika TIDAK ada link eksternal (1 tombol), dia pakai primary (HIJAU) & col-span-2 (Full Width).
                        */}
                        <Button
                          className={`w-full text-xs font-bold ${
                            hasExternalLink
                              ? "col-span-1 " + whiteButtonClass
                              : "col-span-2 " + greenButtonClass
                          }`}
                          
                        >
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            {isPdf ? (
                              <Download className="w-3.5 h-3.5" />
                            ) : (
                              <Maximize2 className="w-3.5 h-3.5" />
                            )}
                            {isPdf ? "Download" : "View Image"}
                          </a>
                        </Button>

                        {/* 2. Tombol Verify Source (Hanya muncul jika ada external link) */}
                        {/* Logic: Selalu Hijau */}
                        {hasExternalLink && (
                          <Button
                            className={`w-full text-xs font-bold col-span-1 ${greenButtonClass}`}
                            
                          >
                            <a
                              href={doc.external_validation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Verify Source
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
