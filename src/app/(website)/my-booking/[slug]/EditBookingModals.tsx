"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Shirt, MapPin, X, Loader2, Save } from "lucide-react";
import EditLogisticsModal from "./EditLogisticsModal";
interface Props {
  bookingUrl: string;
  totalPax: number;
  tshirtSizes: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  pickup: { location: string; time: string; details?: string }; // Mapping string pickup legacy nanti
  drop: { location: string; time: string; details?: string };
}

export default function EditBookingModals({
  bookingUrl,
  totalPax,
  tshirtSizes,
  pickup,
  drop,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Modals
  const [showTshirtModal, setShowTshirtModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDropModal, setShowDropModal] = useState(false);

  // State Form T-Shirt
  const [sizes, setSizes] = useState(tshirtSizes);

  // Helper: Validasi Total Kaos
  const totalSelected = Object.values(sizes).reduce((a, b) => a + Number(b), 0);
  const isValidTshirt = totalSelected === Number(totalPax);
  
  // Handler Submit T-Shirt
  const handleSaveTshirt = async () => {
    if (!isValidTshirt)
      return alert(`Total T-Shirts must equal ${totalPax} pax.`);

    setLoading(true);
    try {
      const res = await fetch("/api/booking/update-tshirt", {
        method: "POST",
        body: JSON.stringify({ url: bookingUrl, ...sizes }),
      });
      if (!res.ok) throw new Error("Failed update");

      alert("T-Shirt sizes updated!");
      setShowTshirtModal(false);
      router.refresh();
    } catch (e) {
      alert("Error updating T-shirts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. T-SHIRT CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-500"></span>
              Travel T-Shirt
            </h3>
            <p className="text-sm text-slate-500">
              Free gift for every participant
            </p>
          </div>
          <button
            onClick={() => setShowTshirtModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-lime-100 text-slate-600 hover:text-lime-700 rounded-lg text-xs font-bold transition-colors"
          >
            <Pencil size={14} /> Edit Size
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(tshirtSizes).map(
            ([size, qty]) =>
              qty > 0 && (
                <div
                  key={size}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center"
                >
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    {size}
                  </span>
                  <span className="block text-xl font-black text-slate-900">
                    {qty}
                  </span>
                </div>
              )
          )}
          {Object.values(tshirtSizes).every((v) => v === 0) && (
            <p className="col-span-full text-sm text-slate-400 italic">
              No sizes selected yet.
            </p>
          )}
        </div>
      </div>

      {/* 2. PICKUP & DROP INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PICKUP CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900">
              Pickup
            </h3>
            <button
              onClick={() => setShowPickupModal(true)} // Implementasi modal pickup menyusul (Logic kompleks)
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-lime-100 text-slate-600 hover:text-lime-700 rounded-lg text-xs font-bold transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Location
              </p>
              <p className="font-semibold text-slate-900">
                {pickup.location || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Time</p>
              <p className="font-semibold text-slate-900">
                {pickup.time || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* DROPOFF CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900">
              Drop-off
            </h3>
            <button
              onClick={() => setShowDropModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-lime-100 text-slate-600 hover:text-lime-700 rounded-lg text-xs font-bold transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Location
              </p>
              <p className="font-semibold text-slate-900">
                {drop.location || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Time</p>
              <p className="font-semibold text-slate-900">
                {drop.time || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: EDIT T-SHIRT --- */}
      {showTshirtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Shirt size={20} /> Update T-Shirt Sizes
              </h3>
              <button onClick={() => setShowTshirtModal(false)}>
                <X size={20} className="text-slate-400 hover:text-white" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
                <span>
                  Total Pax: <strong>{totalPax}</strong>
                </span>
                <span>
                  Selected:{" "}
                  <strong
                    className={
                      isValidTshirt ? "text-green-600" : "text-red-600"
                    }
                  >
                    {totalSelected}
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.keys(sizes).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                      {key}
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none"
                      value={sizes[key as keyof typeof sizes]}
                      onChange={(e) =>
                        setSizes({ ...sizes, [key]: Number(e.target.value) })
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveTshirt}
                disabled={loading || !isValidTshirt}
                className="w-full bg-lime-500 hover:bg-lime-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: PICKUP & DROPOFF --- */}
      {showPickupModal && (
        <EditLogisticsModal
          type="pickup"
          bookingUrl={bookingUrl}
          initialData={{ location: pickup.location, time: pickup.time }}
          onClose={() => setShowPickupModal(false)}
        />
      )}

      {showDropModal && (
        <EditLogisticsModal
          type="drop"
          bookingUrl={bookingUrl}
          initialData={{ location: drop.location, time: drop.time }}
          onClose={() => setShowDropModal(false)}
        />
      )}
    </div>
  );
}
