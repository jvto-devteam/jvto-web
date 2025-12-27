// app/(website)/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

// =================================================================
// 1. UTILITIES & INTERFACES
// =================================================================

function formatCurrency(value: number) {
  return `IDR ${Math.round(value).toLocaleString("id-ID")}`;
}

function getPriceForPax(pax: number, tiers: any[]) {
  if (!tiers || !tiers.length) return null;
  const tier = tiers.find((t: any) => {
    const minOk = pax >= t.paxMin;
    const maxOk = t.paxMax === 0 ? true : pax <= t.paxMax;
    return minOk && maxOk;
  });
  return tier ? tier.pricePerPerson : null;
}

function calculateDownPayment(dateStr: string, total: number) {
  if (!dateStr) return 0;

  // Parse input "YYYY-MM-DD" menjadi tahun, bulan, tanggal local
  const [y, m, d] = dateStr.split("-").map(Number);
  const tripDate = new Date(y, m - 1, d); // Bulan di JS mulai dari 0
  tripDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hitung selisih hari
  const diffTime = tripDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Jika H-7 atau kurang (bahkan minus/hari H), wajib Full Payment
  if (diffDays <= 7) {
    return total;
  }
  // Jika lebih dari 7 hari, DP 20%
  return Math.ceil(total * 0.2);
}

// --- HELPER: Hitung Diskon FOC ---
function calculateFOCDiscount(pax: number, pricePerPerson: number) {
  if (pax >= 50) {
    return { amount: pricePerPerson * 3, label: "FOC: 3 Pax Free" };
  } else if (pax >= 34) {
    return { amount: pricePerPerson * 2, label: "FOC: 2 Pax Free" };
  } else if (pax >= 18) {
    return { amount: pricePerPerson * 1, label: "FOC: 1 Pax Free" };
  }
  return { amount: 0, label: "" };
}

interface ContactDetails {
  email: string;
  phone: string;
  customerName: string;
}

interface AddOn {
  addOnId: string;
  label: string;
  price: number;
  qty: number;
  subtotal: number;
  type?: string | null;
  transportType?: string | null;
  transportDestination?: string | null;
}

interface CheckoutPayload {
  packageCategory?: string; // Tambahkan ini
  isicCodes?: string[]; // Tambahkan ini untuk menyimpan array kode ISIC
  packageId: string;
  durationId: string;
  date: string;
  pax: number;
  paxMin: number;
  packageLabel: string;
  pricePerPerson: number | null;
  packageTotal: number;
  grandTotal: number;
  priceTiers: any[];
  allAddOns: any[];
  imageUrl: string;
  addon?: AddOn[];
  contact?: ContactDetails;

  totalPackage: number;
  totalAddons: number;
  totalDiscount: number;
  discountLabel?: string;
  downPayment: number;
}

// =================================================================
// 2. LOGIC & CALCULATION
// =================================================================

function recalculateTotals(
  payload: CheckoutPayload,
  newPax: number
): CheckoutPayload {
  const newPricePerPerson = getPriceForPax(newPax, payload.priceTiers);
  const newPackageTotal = newPricePerPerson ? newPricePerPerson * newPax : 0;

  // 1. Hitung Diskon
  let discountAmount = 0;
  let discountLabel = "";

  if (newPricePerPerson) {
    const discount = calculateFOCDiscount(newPax, newPricePerPerson);
    discountAmount = discount.amount;
    discountLabel = discount.label;
  }

  // 2. Hitung Addons
  let newAddonTotal = 0;
  let updatedAddons: AddOn[] = [];

  if (payload.addon && payload.addon.length > 0) {
    updatedAddons = payload.addon.map((a) => {
      const isTransport = a.type === "transport";
      const newQty = isTransport ? 1 : newPax;
      const newSubtotal = newQty * a.price;
      newAddonTotal += newSubtotal;

      return { ...a, qty: newQty, subtotal: newSubtotal };
    });
  }

  // 3. Grand Total (dikurangi diskon, tidak boleh minus)
  const newGrandTotal = Math.max(
    0,
    newPackageTotal + newAddonTotal - discountAmount
  );

  const newDownPayment = calculateDownPayment(payload.date, newGrandTotal);

  return {
    ...payload,
    pax: newPax,
    pricePerPerson: newPricePerPerson,
    packageTotal: newPackageTotal,
    grandTotal: newGrandTotal,
    addon: updatedAddons,
    totalDiscount: discountAmount,
    discountLabel: discountLabel,
    totalPackage: newPackageTotal,
    totalAddons: newAddonTotal,
    downPayment: newDownPayment,
  };
}

// =================================================================
// 3. UI COMPONENTS
// =================================================================

const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm text-lime-400">
      {icon}
    </span>
    <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900">
      {title}
    </h3>
  </div>
);

const JVTOButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg 
      bg-lime-400 px-6 py-4 font-bold uppercase tracking-wider text-slate-900 
      transition-all hover:bg-lime-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50
      ${fullWidth ? "w-full" : ""}
    `}
  >
    <span className="relative z-10">{children}</span>
  </button>
);

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-10">
    <div className="flex justify-center gap-2 text-xs font-bold uppercase tracking-widest md:text-sm">
      <span className={currentStep >= 1 ? "text-slate-900" : "text-slate-400"}>
        1. Details
      </span>
      <span className="text-slate-300">/</span>
      <span className={currentStep === 2 ? "text-slate-900" : "text-slate-400"}>
        2. Payment
      </span>
    </div>
    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full bg-lime-500 transition-all duration-500 ease-out"
        style={{ width: currentStep === 1 ? "50%" : "100%" }}
      />
    </div>
  </div>
);

const StickyOrderSummary = ({
  payload,
}: {
  payload: CheckoutPayload | null;
}) => {
  if (!payload) return null;

  return (
    <div className="sticky top-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="relative h-40 bg-slate-900">
        {payload.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={payload.imageUrl}
            alt={payload.packageLabel}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="h-full w-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-lime-400">
            Selected Adventure
          </span>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white">
            {payload.packageLabel}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4 text-sm">
          <div>
            <span className="block text-xs text-slate-500">Date</span>
            <span className="font-semibold text-slate-900">{payload.date}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-500">Guests</span>
            <span className="font-semibold text-slate-900">
              {payload.pax} Pax
            </span>
          </div>
        </div>

        <div className="space-y-3 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Base Price</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(payload.packageTotal)}
            </span>
          </div>

          {payload.addon && payload.addon.length > 0 && (
            <div className="space-y-1 border-l-2 border-lime-200 pl-3">
              <p className="text-xs font-bold uppercase text-slate-400">
                Add-ons Included
              </p>
              {payload.addon.map((a, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-slate-600">
                    {a.label} <span className="text-slate-400">x{a.qty}</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatCurrency(a.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* DISKON SECTION */}
          {payload.totalDiscount > 0 && (
            <div className="flex justify-between text-lime-600 font-bold bg-lime-50 px-2 py-1 rounded">
              <span>{payload.discountLabel || "Group Discount"}</span>
              <span>- {formatCurrency(payload.totalDiscount)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">TOTAL</span>
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(payload.grandTotal)}
            </span>
          </div>
          <p className="mt-1 text-right text-xs text-slate-500">
            Included taxes & fees
          </p>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// 4. STEP COMPONENTS
// =================================================================

const StepOneDetails = ({
  payload,
  setPayload,
  onNext,
}: {
  payload: CheckoutPayload;
  setPayload: (p: CheckoutPayload) => void;
  onNext: () => void;
}) => {
  const { data: session } = useSession();
  const [customerName, setCustomerName] = useState(
    payload.contact?.customerName || ""
  );
  const [email, setEmail] = useState(payload.contact?.email || "");
  const [phone, setPhone] = useState(payload.contact?.phone || "");
  const [paxCount, setPaxCount] = useState(payload.pax);

  const [isicCodes, setIsicCodes] = useState<string[]>(
    payload.isicCodes && payload.isicCodes.length === payload.pax
      ? payload.isicCodes
      : Array(payload.pax).fill("")
  );

  useEffect(() => {
    if (session?.user) {
      // Hanya isi jika field masih kosong (agar tidak menimpa ketikan user)
      if (!customerName && session.user.name) {
        setCustomerName(session.user.name);
      }
      if (!email && session.user.email) {
        setEmail(session.user.email);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleIsicChange = (index: number, value: string) => {
    const newCodes = [...isicCodes];
    newCodes[index] = value;
    setIsicCodes(newCodes);

    // Update payload realtime agar tersimpan jika refresh
    const updatedPayload = { ...payload, isicCodes: newCodes };
    setPayload(updatedPayload);
    localStorage.setItem("checkoutPayload", JSON.stringify(updatedPayload));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const newDownPayment = calculateDownPayment(newDate, payload.grandTotal);
    const updatedPayload = {
      ...payload,
      date: newDate,
      downPayment: newDownPayment,
    };
    setPayload(updatedPayload);
    localStorage.setItem("checkoutPayload", JSON.stringify(updatedPayload));
  };

  const handlePaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    const newPax = Math.max(payload.paxMin, inputValue);

    if (!payload.priceTiers || payload.priceTiers.length === 0) {
      alert("Pricing data missing.");
      return;
    }

    const recalculatedPayload = recalculateTotals(payload, newPax);

    // --- LOGIC RESIZE ARRAY ISIC ---
    // Jika pax bertambah, tambah string kosong. Jika berkurang, potong array.
    const currentCodes = [...isicCodes];
    let newCodes = [];
    if (newPax > currentCodes.length) {
      const diff = newPax - currentCodes.length;
      newCodes = [...currentCodes, ...Array(diff).fill("")];
    } else {
      newCodes = currentCodes.slice(0, newPax);
    }

    setIsicCodes(newCodes);
    setPaxCount(newPax);

    // Simpan payload baru dengan pax baru & array isic yang sudah di-resize
    const finalPayload = { ...recalculatedPayload, isicCodes: newCodes };
    setPayload(finalPayload);
    localStorage.setItem("checkoutPayload", JSON.stringify(finalPayload));
  };
  const [isVerifying, setIsVerifying] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !phone) {
      alert("Please fill in all essential contact details.");
      return;
    }

    // --- LOGIKA BARU: VALIDASI ISIC ---
    if (payload.packageCategory === "student") {
      // Cek field kosong
      if (isicCodes.some((code) => !code.trim())) {
        alert("Please enter ISIC Codes for all travelers.");
        return;
      }

      setIsVerifying(true);

      try {
        // --- LOGIC BARU: BULK CHECK (1 Request) ---
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/check-isic`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codes: isicCodes }), // Kirim Array ['A', 'B']
          }
        );

        const data = await res.json();

        if (!data.valid) {
          // Jika ada yang salah, backend mengirim list 'invalid_items'
          let errorMessage = "Verification Failed:\n";

          if (data.invalid_items && data.invalid_items.length > 0) {
            data.invalid_items.forEach((item: any) => {
              // Tampilkan error spesifik: "Traveler #2 (KODE): Invalid"
              errorMessage += `- Traveler #${item.index + 1} (${
                item.code
              }): Invalid\n`;
            });
          } else {
            errorMessage += data.message;
          }

          alert(errorMessage);
          setIsVerifying(false);
          return; // STOP
        }
      } catch (error) {
        alert("System error. Please try again.");
        setIsVerifying(false);
        return;
      }
      setIsVerifying(false);
    }
    // --- AKHIR LOGIKA ISIC ---

    const updatedPayload = {
      ...payload,
      contact: { customerName, email, phone },
      isicCodes: isicCodes, // Pastikan tersimpan final
      userId: session?.user?.id, // Asumsi ada properti id di user session
    };

    localStorage.setItem("checkoutPayload", JSON.stringify(updatedPayload));
    setPayload(updatedPayload);
    onNext();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader icon="1" title="Trip Configuration" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="startDate"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-900"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              min={today}
              value={payload.date}
              onChange={handleDateChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="pax"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-900"
            >
              Travelers{" "}
              <span className="text-slate-400 normal-case">
                (Min {payload.paxMin})
              </span>
            </label>
            <input
              id="pax"
              type="number"
              min={payload.paxMin}
              value={paxCount}
              onChange={handlePaxChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold text-slate-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none transition-all"
            />
            {payload.totalDiscount > 0 && (
              <p className="mt-2 text-xs font-bold text-lime-600">
                🎉 {payload.discountLabel} Applied!
              </p>
            )}
          </div>
        </div>
      </div>
      {/* --- EXCLUSIVE STUDENT VERIFICATION SECTION --- */}
      {payload.packageCategory === "student" && (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {/* Header Section */}
          <div className="border-b border-slate-200 bg-white px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-2xl">
                  🎓
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    Student Verification
                    <span className="rounded bg-lime-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
                      Required
                    </span>
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    This package is exclusive for{" "}
                    <strong className="text-slate-800">
                      ISIC Card Holders
                    </strong>
                    . Please enter the valid ISIC discount code for each
                    traveler to avail the student discount.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input Grid Section */}
          <div className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {isicCodes.map((code, index) => (
                <div key={index} className="group relative">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 transition-colors group-focus-within:text-lime-600">
                    Traveler #{index + 1} Discount Code
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      {/* SVG Card Icon */}
                      <svg
                        className="h-5 w-5 transition-colors group-focus-within:text-lime-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. S 123 456 789 X"
                      value={code}
                      onChange={(e) =>
                        handleIsicChange(index, e.target.value.toUpperCase())
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 font-mono text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none transition-all uppercase"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <span className="text-lg">💡</span>
              <p className="text-xs text-slate-500">
                Get your discount code from the official{" "}
                <a
                  href="https://www.isic.org/discounts/?providerId=259268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-900 underline decoration-lime-400 decoration-2 hover:no-underline"
                >
                  ISIC Website
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader icon="2" title="Contact Details" />
        <div className="mb-8 border-b border-slate-100 pb-8">
          {!session ? (
            // TAMPILAN BELUM LOGIN (GUEST)
            <div className="rounded-lg bg-slate-50 p-5 border border-slate-200">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-base">
                  Express Checkout
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in to auto-fill your contact details instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* TOMBOL GOOGLE */}
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-all"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          ) : (
            // TAMPILAN SUDAH LOGIN (SESSION ACTIVE)
            <div className="flex items-center justify-between rounded-lg bg-lime-50 p-4 border border-lime-200">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-lime-200 flex items-center justify-center font-bold text-lime-700">
                    {session.user?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Welcome back, {session.user?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Your details have been auto-filled.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-900">
              Lead Traveler Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name as per ID"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-900">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ticket@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-900">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <JVTOButton type="submit" fullWidth>
        Review & Pay <span className="ml-2">→</span>
      </JVTOButton>
    </form>
  );
};

const StepTwoPayment = ({
  payload,
  onBack,
  router,
}: {
  payload: CheckoutPayload;
  onBack: () => void;
  router: any;
}) => {
  const [consent, setConsent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cc" | "bank">("cc");

  const isFullPayment = payload.downPayment === payload.grandTotal;
  const depositAmount = Math.ceil(payload.grandTotal * 0.2);
  const remainingAmount = payload.grandTotal - depositAmount;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert("Please accept the terms to proceed.");
      return;
    }

    setProcessing(true);

    const legacyPayload = {
      contactDetails: {
        name: payload.contact?.customerName || "",
        email: payload.contact?.email || "",
        phone: payload.contact?.phone || "",
        note: "Booking from New Next.js Website",
      },
      bookingSelection: {
        package_id: Number(payload.packageId),
        travel_date_start: payload.date,
        numb_of_pax: Number(payload.pax),
        user_id: 0,

        down_payment: payload.downPayment,
        total_package: payload.totalPackage,
        total_addons: payload.totalAddons,
        grand_total: payload.grandTotal,
        total_discount: payload.totalDiscount || 0,
        addons:
          payload.addon?.map((item) => {
            if (item.type === "transport") {
              return {
                id: "bali_transport",
                name: item.label,
                price: item.price,
                details: [
                  { destination: item.transportDestination || "Unknown" },
                ],
              };
            }
            if (item.type === "madakaripura" || item.addOnId === "2") {
              return {
                id: "madakaripura",
                name: item.label,
                price: item.price,
                details: [],
              };
            }
            return {
              id: item.addOnId,
              name: item.label,
              price: item.price,
              details: [],
            };
          }) || [],
      },
      isic_codes: payload.isicCodes || [],
      travelerDetails: {
        pickupLocation: "",
        pickupDetail: "",
        flightNumber: "",
        trainNumber: null,
        pickupTime: "",
        dropoffLocation: "",
        dropoffDetail: "",
        dropoffFlightNumber: null,
        dropoffTrainNumber: null,
        dropoffTime: "",
        specialRequirements: "",
      },
    };

    try {
      const internalApiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout`;
      console.log("🚀 Sending Payload to Internal Proxy:", internalApiUrl);

      const response = await fetch(internalApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(legacyPayload),
      });

      const result = await response.json();
      if (response.ok && result.success && result.payment_link) {
        localStorage.removeItem("checkoutPayload");
        window.location.href = result.payment_link;
      } else {
        throw new Error(result.message || "Gagal memproses booking.");
      }
    } catch (error: any) {
      console.error("❌ Checkout Error:", error);
      setProcessing(false);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form
      onSubmit={handlePay}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader icon="3" title="Review & Payment" />

        <div className="mb-6 rounded-xl bg-slate-50 p-5 text-sm border border-slate-100">
          <div className="space-y-2 pb-4 border-b border-slate-200">
            <p className="flex justify-between">
              <span className="font-medium text-slate-600">
                Total Trip Cost:
              </span>
              <span
                className={`font-bold ${
                  isFullPayment
                    ? "text-slate-900"
                    : "text-slate-500 line-through decoration-red-400"
                }`}
              >
                {formatCurrency(payload.grandTotal)}
              </span>{" "}
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-slate-900">
                {payload.downPayment === payload.grandTotal
                  ? "Due Now (Full Payment):"
                  : "Due Now (20% Deposit):"}
              </span>
              <span className="text-xl font-black text-lime-600">
                {formatCurrency(payload.downPayment)}
              </span>
            </p>
          </div>
          <div className="pt-3 text-xs text-slate-500 flex items-start gap-2">
            <span>ℹ️</span>
            {isFullPayment ? (
              <p>
                Since your trip is within 7 days, <strong>full payment</strong>{" "}
                is required to secure your reservation immediately. No further
                payment will be collected.
              </p>
            ) : (
              <p>
                You only pay{" "}
                <strong>{formatCurrency(payload.downPayment)}</strong> today to
                secure your spot. The remaining{" "}
                <strong>{formatCurrency(remainingAmount)}</strong> can be paid
                upon arrival or 7 days before the trip.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div
            onClick={() => setPaymentMethod("cc")}
            className={`relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
              paymentMethod === "cc"
                ? "border-lime-500 bg-lime-50/50 shadow-sm ring-1 ring-lime-500"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                paymentMethod === "cc"
                  ? "border-lime-600 bg-lime-600"
                  : "border-slate-300"
              }`}
            >
              {paymentMethod === "cc" && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <span className="block font-bold text-slate-900">
                Credit Card / Debit Card
              </span>
              <span className="text-xs text-slate-500">
                Instant confirmation via Xendit
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Image
                src="/assets/img/icons/visa.svg"
                alt="Visa"
                width={40}
                height={25}
                className="h-5 w-auto object-contain"
              />
              <Image
                src="/assets/img/icons/mastercard.svg"
                alt="Mastercard"
                width={40}
                height={25}
                className="h-5 w-auto object-contain"
              />
              <Image
                src="/assets/img/icons/jcb.svg"
                alt="JCB"
                width={40}
                height={25}
                className="h-5 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-300 text-lime-500 focus:ring-lime-500"
            />
            <span className="text-sm leading-relaxed text-slate-600 group-hover:text-slate-800">
              I agree to the{" "}
              <a
                target="_blank"
                href="/travel-guide/booking-information"
                className="font-bold underline decoration-lime-400 decoration-2 underline-offset-2"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                href="/travel-guide/booking-information"
                className="font-bold underline decoration-lime-400 decoration-2 underline-offset-2"
              >
                Cancellation Policy
              </a>
              .
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <JVTOButton type="submit" disabled={processing} fullWidth>
          {processing
            ? "Processing..."
            : isFullPayment
            ? `Pay Full Amount ${formatCurrency(payload.downPayment)}`
            : `Pay Deposit ${formatCurrency(payload.downPayment)}`}
        </JVTOButton>
        <button
          type="button"
          onClick={onBack}
          className="text-center text-sm font-semibold text-slate-400 hover:text-slate-600 hover:underline"
        >
          ← Back to Details
        </button>
      </div>
    </form>
  );
};

// =================================================================
// 5. MAIN PAGE
// =================================================================

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<CheckoutPayload | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("checkoutPayload");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (!parsed.packageLabel) throw new Error("Invalid Data");

        // --- FIX PENTING: HITUNG ULANG SAAT LOAD PERTAMA KALI ---
        // Ini memastikan diskon terhitung meskipun data dari halaman sebelumnya belum punya diskon.
        const recalculated = recalculateTotals(parsed, parsed.pax);

        setPayload(recalculated);
      } catch (e) {
        console.error(e);
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  if (loading || !payload) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-400 border-t-transparent"></div>
        <p className="font-bold uppercase tracking-widest text-slate-400">
          Loading Adventure...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-26 md:py-40">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900 md:text-4xl">
            Secure Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-600">
              Spot
            </span>
          </h1>
          <p className="mt-2 text-slate-500">
            Complete your details to start the adventure.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ProgressIndicator currentStep={step} />

            {step === 1 && (
              <StepOneDetails
                payload={payload}
                setPayload={setPayload}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <StepTwoPayment
                payload={payload}
                onBack={() => setStep(1)}
                router={router}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            <StickyOrderSummary payload={payload} />

            <div className="mt-6 text-center text-xs leading-relaxed text-slate-400">
              <p>Need help? Contact our support via WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
