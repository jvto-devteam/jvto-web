"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/UI/Button";
import {
  legalDocuments,
  operations,
  healthSafety,
  companyHistory,
} from "@/lib/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, EyeOff } from "lucide-react";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: "Verify JVTO Documents",
  description: "Official licences, police clearances, operational certificates, and verification documents for Java Volcano Tour Operator.",
  openGraph: {
    title: "Verify JVTO Documents",
    description: "Official licences, police clearances, operational certificates, and verification documents for Java Volcano Tour Operator.",
    url: `${siteUrl}/verify-jvto`,
    siteName: "Java Volcano Tour Operator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/verify-jvto.webp",
        width: 1200,
        height: 630,
        alt: "Verify JVTO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify JVTO Documents",
    description: "Official licences, police clearances, operational certificates, and verification documents for Java Volcano Tour Operator.",
    images: [siteUrl + "/assets/img/og/verify-jvto.webp"],
  },
};

// This is now the client component handling state and interactions
function VerifyJvtoClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [showHash, setShowHash] = useState<{ [key: string]: boolean }>({});

  const allDocs = [
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
      type: "pdf",
    },
    ...companyHistory.awards_and_recognition,
    ...companyHistory.historical_references,
  ];

  const getCategoryForDoc = (doc: any) => {
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

  const allDocuments = allDocs.map((doc) => ({
    ...doc,
    category: getCategoryForDoc(doc),
  }));

  const filteredDocuments =
    activeTab === "all"
      ? allDocuments
      : allDocuments.filter((doc) => doc.category === activeTab);

  const categories = [
    { id: "all", name: "All Documents", count: allDocuments.length },
    {
      id: "company_registration",
      name: "Registration",
      count: legalDocuments.company_registration.length,
    },
    {
      id: "police_clearances",
      name: "Police Docs",
      count: legalDocuments.police_clearances.flatMap((d:any) => d.files).length,
    },
    {
      id: "operations",
      name: "Operations",
      count: operations.team_and_activities.length + 1,
    },
    {
      id: "health_safety",
      name: "Health & Safety",
      count:
        healthSafety.screening_procedures.length +
        healthSafety.health_documents.length,
    },
    {
      id: "company_history",
      name: "History",
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow pt-20">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Verify JVTO Documents
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                Official licences, police clearances, operational certificates,
                and verification documents for Java Volcano Tour Operator.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === category.id
                        ? "bg-primary text-lime-600 shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeTab === category.id
                          ? "bg-lime-400 text-black"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map((doc, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-gray-100">
                      <Image
                        src={
                          (doc.previews &&
                            doc.previews.find((p: any) => p.format === "WebP")
                              ?.url) ||
                          (doc.preview && doc.preview.url) ||
                          doc.url
                        }
                        alt={doc.alt_text || doc.caption}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardTitle className="text-base font-bold line-clamp-2">
                      {doc.caption}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.filename}
                    </p>

                    <div className="mt-4 text-xs text-muted-foreground space-y-1">
                      <p>
                        <strong>Verified:</strong> {doc.last_verified}
                      </p>
                      <p>
                        <strong>Size:</strong> {doc.size_mb.toFixed(2)} MB
                      </p>
                    </div>

                    {doc.sha256 && (
                      <div className="mt-4">
                        <button
                          onClick={() => toggleHash(doc.filename)}
                          className="text-xs font-semibold text-primary flex items-center gap-1"
                        >
                          {showHash[doc.filename] ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          {showHash[doc.filename] ? "Hide" : "Show"} SHA256 Hash
                        </button>
                        {showHash[doc.filename] && (
                          <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all text-gray-500">
                            {doc.sha256}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <Button className="w-full">
                        <a
                          className="flex"
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
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

// This is the main page component (Server Component) that renders the client component.
export default function VerifyJvtoPage() {
  return <VerifyJvtoClient />;
}
