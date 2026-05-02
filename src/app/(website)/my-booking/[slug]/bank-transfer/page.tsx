"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";

// --- HELPERS ---
const formatIDR = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

export default function BankTransferUploadPage() {
  const router = useRouter();
  const { slug } = useParams();

  // States
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [senderName, setSenderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch booking details to show "Amount Due"
  useEffect(() => {
    async function fetchBooking() {
      try {
        const legacyDomain = process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN;
        const res = await fetch(
          `${legacyDomain}/bookings/details/${slug}?json=true`,
        );
        const data = await res.json();
        setBooking(data.booking);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !booking) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("booking_id", booking.id); // Mengirim ID booking sesuai permintaan
    formData.append("proof", file); // Bukti transfer
    formData.append("sender_name", senderName);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/bank-transfer`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push(`/my-booking/${slug}`), 3000);
      } else {
        alert("Failed to upload proof. Please try again.");
      }
    } catch (error) {
      alert("System error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-jvto-green" size={40} />
      </div>
    );

  if (isSuccess)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="h-20 w-20 bg-jvto-green/10 rounded-full flex items-center justify-center text-jvto-green mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 uppercase">
          Receipt Uploaded!
        </h1>
        <p className="text-slate-500 mt-2 max-w-sm">
          We have received your payment proof for <b>{booking.booking_code}</b>.
          Our team will verify it shortly.
        </p>
        <p className="text-xs text-slate-400 mt-8 animate-pulse">
          Redirecting to your dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-20">
      <div className="container mx-auto max-w-2xl px-4">
        {/* BACK LINK */}
        <Link
          href={`/my-booking/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-jvto-green text-xs font-black uppercase tracking-widest mb-1">
                  Payment Confirmation
                </p>
                <h2 className="text-2xl font-black">Upload Proof</h2>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[10px] font-bold uppercase">
                  Amount to Transfer
                </p>
                <p className="text-xl font-black text-white">
                  {formatIDR(booking.finance.balance)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="mb-8 p-6 bg-slate-50 rounded-sm border border-slate-200">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                Bank Transfer Information
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-sm border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Bank BRI
                  </p>
                  <p className="font-black text-slate-900">
                    PT Java Volcano Rendezvous
                  </p>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    001301001779564
                  </p>
                  <p className="text-xs text-slate-500">SWIFT: BRINIDJAXXX</p>
                </div>
                <div className="bg-white p-4 rounded-sm border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Bank BCA
                  </p>
                  <p className="font-black text-slate-900">
                    PT Java Volcano Rendezvous
                  </p>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    1200944352
                  </p>
                  <p className="text-xs text-slate-500">SWIFT: CENAIDJAXXX</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                For detailed payment terms, please check our{" "}
                <a
                  href="https://javavolcano-touroperator.com/policy/booking-payment-cancellation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-jvto-green hover:text-jvto-green font-bold underline"
                >
                  Booking & Payment Policy
                </a>
              </p>
            </div>

            {/* SENDER NAME */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                required
                placeholder="Full name on bank account"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 rounded-sm border border-slate-200 focus:border-jvto-green focus:ring-4 focus:ring-jvto-green/10 outline-none transition-all font-bold"
              />
            </div>

            {/* UPLOAD AREA */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Transfer Receipt
              </label>
              <div
                className={`relative border-2 border-dashed rounded-sm transition-all ${
                  previewUrl
                    ? "border-jvto-green bg-jvto-green/5/30"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />

                <div className="p-10 flex flex-col items-center text-center">
                  {previewUrl ? (
                    <div className="space-y-4">
                      {/* CHECK IF FILE IS PDF OR IMAGE */}
                      {file?.type === "application/pdf" ? (
                        /* 1. PDF ICON VIEW */
                        <div className="h-40 w-40 mx-auto rounded-sm bg-white flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                          <div className="h-16 w-16 bg-red-50 rounded-sm flex items-center justify-center text-red-500 mb-2">
                            <FileText size={32} />
                          </div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 px-2 truncate w-full">
                            {file.name}
                          </span>
                          <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded mt-1">
                            PDF
                          </span>
                        </div>
                      ) : (
                        /* 2. IMAGE PREVIEW VIEW */
                        <div className="relative h-40 w-40 mx-auto rounded-sm overflow-hidden border-2 border-white shadow-md">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <p className="text-xs font-bold text-jvto-green flex items-center justify-center gap-1">
                        <CheckCircle size={14} />{" "}
                        {file?.type === "application/pdf"
                          ? "PDF Document"
                          : "Image"}{" "}
                        selected. Click to change.
                      </p>
                    </div>
                  ) : (
                    /* EMPTY STATE */
                    <>
                      <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-400">
                        <Upload size={24} />
                      </div>
                      <p className="font-bold text-slate-700">
                        Click to upload receipt
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PNG, JPG or PDF (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="w-full bg-jvto-green hover:bg-[#8cb82b] disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 font-black uppercase tracking-wider py-4 rounded-sm shadow-lg shadow-jvto-green/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                "Submit Payment Proof"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          Need help? Contact our finance team via WhatsApp <br />
          <b>+62 822-4478-8833</b>
        </p>
      </div>
    </div>
  );
}
