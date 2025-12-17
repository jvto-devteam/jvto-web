"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/website/UI/Button";
import {
  legalDocuments,
  operations,
  healthSafety,
  companyHistory,
} from "@/lib/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, EyeOff } from "lucide-react";

type Doc = {
  filename: string;
  caption?: string;
  alt_text?: string;
  url: string;
  size_mb: number;
  last_verified: string;
  sha256?: string;
  preview?: { url: string };
  previews?: { format: string; url: string }[];
  category?: string;
};

export default function VerifyJvtoClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [showHash, setShowHash] = useState<Record<string, boolean>>({});

  /* =========================
     BUILD ALL DOCUMENT LIST
  ========================== */
  const allDocs: Doc[] = [
    ...legalDocuments.company_registration,
    ...legalDocuments.police_clearances.flatMap((doc: any) =>
      doc.files.map((file: any) => ({
        ...file,
        document_type: doc.document_type,
      }))
    ),
    operations.facility.office_photo,
    ...operations.team_and_activities,
    ...healthSafety.screening_procedures,
    {
      ...healthSafety.health_documents[0],
      caption: healthSafety.health_documents[0].alt_text,
    },
    ...companyHistory.awards_and_recognition,
    ...companyHistory.historical_references,
  ];

  /* =========================
     CATEGORY RESOLVER
  ========================== */
  const resolveCategory = (doc: Doc) => {
    if (
      legalDocuments.company_registration.some(
        (d: any) => d.filename === doc.filename
      )
    )
      return "company_registration";

    if (
      legalDocuments.police_clearances.some((p: any) =>
        p.files.some((f: any) => f.filename === doc.filename)
      )
    )
      return "police_clearances";

    if (
      operations.team_and_activities.some(
        (a: any) => a.filename === doc.filename
      ) ||
      doc.filename === operations.facility.office_photo.filename
    )
      return "operations";

    if (
      healthSafety.screening_procedures.some(
        (s: any) => s.filename === doc.filename
      ) ||
      (healthSafety.health_documents[0] &&
        doc.filename === healthSafety.health_documents[0].filename)
    )
      return "health_safety";

    if (
      companyHistory.awards_and_recognition.some(
        (h: any) => h.filename === doc.filename
      ) ||
      companyHistory.historical_references.some(
        (h: any) => h.filename === doc.filename
      )
    )
      return "company_history";

    return "all";
  };

  const documents: Doc[] = allDocs.map((doc) => ({
    ...doc,
    category: resolveCategory(doc),
  }));

  const filteredDocuments =
    activeTab === "all"
      ? documents
      : documents.filter((doc) => doc.category === activeTab);

  /* =========================
     CATEGORY MENU
  ========================== */
  const categories = [
    { id: "all", label: "All Documents", count: documents.length },
    {
      id: "company_registration",
      label: "Registration",
      count: legalDocuments.company_registration.length,
    },
    {
      id: "police_clearances",
      label: "Police Docs",
      count: legalDocuments.police_clearances.flatMap((d: any) => d.files).length,
    },
    {
      id: "operations",
      label: "Operations",
      count: operations.team_and_activities.length + 1,
    },
    {
      id: "health_safety",
      label: "Health & Safety",
      count:
        healthSafety.screening_procedures.length +
        healthSafety.health_documents.length,
    },
    {
      id: "company_history",
      label: "History",
      count:
        companyHistory.awards_and_recognition.length +
        companyHistory.historical_references.length,
    },
  ];

  const toggleHash = (filename: string) => {
    setShowHash((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow pt-20">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* HEADER */}
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-gray-900">
                Verify JVTO Documents
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                Official licences, police clearances, operational certificates,
                and verification documents for Java Volcano Tour Operator.
              </p>
            </div>

            {/* CATEGORY TABS */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === cat.id
                      ? "bg-primary text-lime-600 shadow"
                      : "bg-white border text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === cat.id
                        ? "bg-lime-400 text-black"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* DOCUMENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map((doc, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="relative aspect-[4/3] rounded-md border bg-gray-100 overflow-hidden">
                      <Image
                        src={
                          doc.previews?.find((p) => p.format === "WebP")?.url ||
                          doc.preview?.url ||
                          doc.url
                        }
                        alt={doc.alt_text || doc.caption || doc.filename}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow">
                    <CardTitle className="text-base line-clamp-2">
                      {doc.caption}
                    </CardTitle>

                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.filename}
                    </p>

                    <div className="mt-3 text-xs text-muted-foreground space-y-1">
                      <p>
                        <strong>Verified:</strong> {doc.last_verified}
                      </p>
                      <p>
                        <strong>Size:</strong> {doc.size_mb.toFixed(2)} MB
                      </p>
                    </div>

                    {doc.sha256 && (
                      <div className="mt-3">
                        <button
                          onClick={() => toggleHash(doc.filename)}
                          className="flex items-center gap-1 text-xs font-semibold text-primary"
                        >
                          {showHash[doc.filename] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          {showHash[doc.filename] ? "Hide" : "Show"} SHA256
                        </button>

                        {showHash[doc.filename] && (
                          <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                            {doc.sha256}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <Button className="w-full">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Document
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
