"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyBookingPage() {
  // Hanya visual effect simple
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <div 
        className={`max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100 transition-all duration-700 transform ${show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-100 mb-6">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">
          Booking Received!
        </h1>
        
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          Thank you for choosing JVTO. We have received your request. <br/>
          Our team will verify availability and send the <strong>Invoice & Payment Link</strong> to your email/WhatsApp shortly.
        </p>

        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full rounded-xl bg-lime-400 py-3.5 text-sm font-bold uppercase tracking-wide text-slate-900 transition hover:bg-lime-500 hover:shadow-lg"
          >
            Back to Home
          </Link>
          
          <a 
            href="https://wa.me/" // Masukkan nomor WA support
            target="_blank"
            className="block w-full rounded-xl border border-slate-200 py-3.5 text-sm font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}