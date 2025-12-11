"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, X, Loader2, Save, Plane, Building, Train, Map } from "lucide-react";

interface Props {
  type: "pickup" | "drop";
  bookingUrl: string;
  initialData: { location: string | null; time: string | null; details?: string }; 
  onClose: () => void;
}

export default function EditLogisticsModal({ type, bookingUrl, initialData, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- FIX 100% AMAN: Handle Null Value ---
  // Kita beri fallback string kosong jika datanya null dari database
  const safeLocation = initialData.location || ""; 
  const safeTime = initialData.time || "08:00";

  const [category, setCategory] = useState<string>(() => {
    if (safeLocation.includes("Airport")) return "Airport";
    if (safeLocation.includes("Hotel")) return "Hotel";
    if (safeLocation.includes("Train")) return "Station";
    return "Others"; // Default category
  });
  
  const [formData, setFormData] = useState({
    location_category: category,
    // Jika user belum pernah isi (null), biarkan kosong agar user isi baru
    detail_value: "", 
    time_h: safeTime.includes(":") ? safeTime.split(":")[0] : "08",
    time_m: safeTime.includes(":") ? safeTime.split(":")[1] : "00",
    special_requirements: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    
    // Siapkan payload dasar
    const payload: any = { url: bookingUrl };
    
    // Logic Mapping ke Legacy Controller
    if (type === 'pickup') {
        let meetingPoint = "Surabaya Airport"; 
        if (category === "Hotel") meetingPoint = "Surabaya Hotel";
        if (category === "Station") meetingPoint = "Surabaya Train Station";
        if (category === "Others") meetingPoint = "Others";

        payload.meeting_point = meetingPoint;
        // Kirim detail sesuai kategori, sisanya string kosong (Legacy behavior)
        payload.flight_ticket_type_number = category === "Airport" ? formData.detail_value : "";
        payload.hotel = category === "Hotel" ? formData.detail_value : "";
        payload.train_ticket_type_number = category === "Station" ? formData.detail_value : "";
        payload.others_location = category === "Others" ? formData.detail_value : "";
        
        payload.pickup_time1 = formData.time_h;
        payload.pickup_time2 = formData.time_m;
    } else {
        let dropPoint = "Surabaya Airport";
        if (category === "Hotel") dropPoint = "Surabaya Hotel";
        if (category === "Station") dropPoint = "Surabaya Train Station";
        if (category === "Others") dropPoint = "Others";

        payload.drop = dropPoint;
        payload.drop_other_flight = category === "Airport" ? formData.detail_value : "";
        payload.drop_other_hotel = category === "Hotel" ? formData.detail_value : "";
        payload.drop_other_train = category === "Station" ? formData.detail_value : "";
        payload.drop_other_others = category === "Others" ? formData.detail_value : "";
        
        payload.drop_time1 = formData.time_h;
        payload.drop_time2 = formData.time_m;
        payload.special_requirements = formData.special_requirements;
    }

    try {
      const endpoint = type === 'pickup' ? '/api/booking/update-pickup' : '/api/booking/update-drop';
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle response error (HTML / Non-JSON)
      const text = await res.text();
      let result;
      try {
          result = JSON.parse(text);
      } catch (e) {
          console.error("Server Response:", text); // Lihat di console browser
          throw new Error("Server Error (Cek Console untuk detail)");
      }

      if (!res.ok) throw new Error(result.message || "Update failed");
      
      alert(`${type === 'pickup' ? 'Pick-up' : 'Drop-off'} updated successfully!`);
      onClose();
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2 capitalize">
                <MapPin size={20}/> Update {type === 'pickup' ? 'Pick-up' : 'Drop-off'}
            </h3>
            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white"/></button>
        </div>

        <div className="p-6 space-y-5">
            {/* 1. Category Selection */}
            <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Location Category</label>
                <div className="grid grid-cols-2 gap-2">
                    {["Airport", "Hotel", "Station", "Others"].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`p-3 rounded-lg border text-sm font-bold flex items-center gap-2 transition-all ${
                                category === cat 
                                ? "border-lime-500 bg-lime-50 text-lime-700" 
                                : "border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                        >
                            {cat === "Airport" && <Plane size={16}/>}
                            {cat === "Hotel" && <Building size={16}/>}
                            {cat === "Station" && <Train size={16}/>}
                            {cat === "Others" && <Map size={16}/>}
                            {cat === "Station" ? "Train Station" : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Detail Input */}
            <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    {category === "Airport" ? "Flight Number (e.g. GA-123)" : 
                     category === "Station" ? "Train Number (e.g. Argo Bromo)" : 
                     category === "Hotel" ? "Hotel Name" : "Address / Location Name"}
                </label>
                <input 
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none"
                    placeholder="Type details here..."
                    value={formData.detail_value}
                    onChange={(e) => setFormData({...formData, detail_value: e.target.value})}
                />
            </div>

            {/* 3. Time Selection */}
            <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Preferred Time</label>
                <div className="flex gap-2">
                    <select 
                        className="w-1/2 border border-slate-300 rounded-lg px-3 py-2 bg-white"
                        value={formData.time_h}
                        onChange={(e) => setFormData({...formData, time_h: e.target.value})}
                    >
                        {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                    <span className="self-center font-bold">:</span>
                    <select 
                        className="w-1/2 border border-slate-300 rounded-lg px-3 py-2 bg-white"
                        value={formData.time_m}
                        onChange={(e) => setFormData({...formData, time_m: e.target.value})}
                    >
                        {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 4. Special Req (Drop Only) */}
            {type === 'drop' && (
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Special Requirements</label>
                    <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none"
                        placeholder="e.g. Dietary needs, Wheelchair access"
                        value={formData.special_requirements}
                        onChange={(e) => setFormData({...formData, special_requirements: e.target.value})}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button 
                    onClick={onClose}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !formData.detail_value}
                    className="w-2/3 bg-lime-500 hover:bg-lime-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Save Details
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}