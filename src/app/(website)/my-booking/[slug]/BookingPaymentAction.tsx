"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Wallet, X, Loader2 } from "lucide-react";

interface Props {
  bookingUrl: string;
  balance: number;
  paymentLink?: string | null;
}

export default function BookingPaymentAction({ bookingUrl, balance, paymentLink }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDirectPay = () => {
    if (paymentLink) window.location.href = paymentLink;
  };

  const handleSelectMethod = async (type: 'cc' | 'wise' | 'cash') => {
    setLoading(true);
    try {
      const res = await fetch('/api/booking/pay-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: bookingUrl, type }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to set payment method");

      // --- UPDATE LOGIC: Hapus Redirect Otomatis ---
      
      // Tutup Modal
      setIsOpen(false);
      
      // Tampilkan Pesan Sukses
      alert(`Success! Payment method updated to ${type === 'cc' ? 'Credit Card' : type.toUpperCase()}.`);
      
      // Refresh Data Halaman (Agar tombol berubah jadi "Pay Balance")
      router.refresh();

    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Jika paymentLink sudah ada (User sudah set method CC sebelumnya), tombol jadi "Pay Balance"
  if (paymentLink) {
    return (
      <button 
        onClick={handleDirectPay}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase px-6 py-3 rounded-sm shadow-lg shadow-orange-500/30 transition-all w-full md:w-auto flex items-center justify-center gap-2"
      >
        Pay Balance &rarr;
      </button>
    );
  }

  // Jika belum pilih metode, tombol "Select Payment Method"
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase px-6 py-3 rounded-sm shadow-lg shadow-orange-500/30 transition-all w-full md:w-auto"
      >
        Select Payment Method
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden relative">
            
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Pay Remaining Balance</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-slate-50 p-4 rounded-sm border border-slate-100 text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total to Pay</p>
                <p className="text-2xl font-black text-slate-900">IDR {balance.toLocaleString('id-ID')}</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleSelectMethod('cc')}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-sm hover:border-jvto-lime hover:bg-jvto-lime/5 transition-all text-left group"
                >
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-jvto-lime/20 group-hover:text-jvto-lime-ink transition-colors">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">Credit / Debit Card</span>
                    <span className="text-xs text-slate-500">Instant via Xendit (Fee applies)</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleSelectMethod('wise')}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-sm hover:border-jvto-lime hover:bg-jvto-lime/5 transition-all text-left group"
                >
                  <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-jvto-lime/20 group-hover:text-jvto-lime-ink transition-colors">
                    <Banknote size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">Wise / Bank Transfer</span>
                    <span className="text-xs text-slate-500">Manual transfer instructions</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleSelectMethod('cash')}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-sm hover:border-jvto-lime hover:bg-jvto-lime/5 transition-all text-left group"
                >
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600 group-hover:bg-jvto-lime/20 group-hover:text-jvto-lime-ink transition-colors">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">Cash on Arrival</span>
                    <span className="text-xs text-slate-500">Pay directly to our team</span>
                  </div>
                </button>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 size={40} className="text-jvto-lime-ink animate-spin mb-2" />
                    <p className="text-sm font-bold text-slate-600">Processing Request...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}