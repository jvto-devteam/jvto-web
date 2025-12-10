// app/(website)/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// =================================================================
// 1. UTILITIES & INTERFACES
// =================================================================

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
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
}

interface CheckoutPayload {
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

  let newAddonTotal = 0;
  let updatedAddons: AddOn[] = [];

if (payload.addon && payload.addon.length > 0) {
    updatedAddons = payload.addon.map((a) => {
      const isTransport = a.type === 'transport';
      
      const newQty = isTransport ? 1 : newPax;
      
      const newSubtotal = newQty * a.price;
      newAddonTotal += newSubtotal;

      return { ...a, qty: newQty, subtotal: newSubtotal };
    });
  }

  const newGrandTotal = newPackageTotal + newAddonTotal;
  const newDownPayment = Math.ceil(newGrandTotal * 0.2);

  return {
    ...payload,
    pax: newPax,
    pricePerPerson: newPricePerPerson,
    packageTotal: newPackageTotal,
    grandTotal: newGrandTotal,
    addon: updatedAddons,

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
      {/* Header Image */}
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
  const [customerName, setCustomerName] = useState(
    payload.contact?.customerName || ""
  );
  const [email, setEmail] = useState(payload.contact?.email || "");
  const [phone, setPhone] = useState(payload.contact?.phone || "");
  const [paxCount, setPaxCount] = useState(payload.pax);

  // LOGIKA BARU: Handle Date Change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const updatedPayload = { ...payload, date: newDate };
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

    const updatedPayload = recalculateTotals(payload, newPax);
    setPaxCount(newPax);
    setPayload(updatedPayload);
    localStorage.setItem("checkoutPayload", JSON.stringify(updatedPayload));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !phone) {
      alert("Please fill in all essential contact details.");
      return;
    }
    const updatedPayload = {
      ...payload,
      contact: { customerName, email, phone },
    };
    localStorage.setItem("checkoutPayload", JSON.stringify(updatedPayload));
    setPayload(updatedPayload);
    onNext();
  };

  // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD untuk atribut min
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Card 1: Guest Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader icon="1" title="Trip Configuration" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* LOGIKA BARU: Date Editable */}
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

          {/* Pax Input */}
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
          </div>
        </div>
      </div>

      {/* Card 2: Contact Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader icon="2" title="Contact Details" />

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

  const depositAmount = Math.ceil(payload.grandTotal * 0.2);
  const remainingAmount = payload.grandTotal - depositAmount;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert("Please accept the terms to proceed.");
      return;
    }

    setProcessing(true);

    try {
      // POST ke API route
      const response = await fetch(siteUrl + "/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const result = await response.json();
      console.log("Booking created:", result);

      // Simulasi delay sedikit untuk UX
      setTimeout(() => {
        setProcessing(false);
        // Hapus data cart setelah sukses
        localStorage.removeItem("checkoutPayload");
        // Redirect ke halaman success
        router.push("/my-booking");
      }, 1000);
    } catch (error) {
      console.error(error);
      setProcessing(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handlePay}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader icon="3" title="Review & Payment" />

        {/* --- UPDATE: TAMPILAN RINCIAN HARGA (TOTAL vs DP) --- */}
        <div className="mb-6 rounded-xl bg-slate-50 p-5 text-sm border border-slate-100">
          <div className="space-y-2 pb-4 border-b border-slate-200">
            <p className="flex justify-between">
              <span className="font-medium text-slate-600">
                Total Trip Cost:
              </span>
              <span className="font-bold text-slate-500 line-through decoration-red-400">
                {formatCurrency(payload.grandTotal)}
              </span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold text-slate-900">
                Due Now (20% Deposit):
              </span>
              <span className="text-xl font-black text-lime-600">
                {formatCurrency(depositAmount)}
              </span>
            </p>
          </div>
          <div className="pt-3 text-xs text-slate-500 flex items-start gap-2">
            <span>ℹ️</span>
            <p>
              You only pay <strong>{formatCurrency(depositAmount)}</strong>{" "}
              today to secure your spot. The remaining{" "}
              <strong>{formatCurrency(remainingAmount)}</strong> can be paid
              upon arrival or 7 days before the trip.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Option 1: CC */}
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
                Instant confirmation via Xendit/Midtrans
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

          {/* Option 2: Bank Transfer */}
          {/* <div 
                onClick={() => setPaymentMethod('bank')}
                className={`relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    paymentMethod === 'bank' 
                    ? 'border-lime-500 bg-lime-50/50 shadow-sm ring-1 ring-lime-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
            >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                    paymentMethod === 'bank' ? 'border-lime-600 bg-lime-600' : 'border-slate-300'
                }`}>
                    {paymentMethod === 'bank' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <div>
                    <span className="block font-bold text-slate-900">Bank Transfer / QRIS</span>
                    <span className="text-xs text-slate-500">BCA, Mandiri, BRI, QRIS</span>
                </div>
            </div> */}
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
        {/* --- UPDATE: TEKS TOMBOL MENAMPILKAN NOMINAL DP --- */}
        <JVTOButton type="submit" disabled={processing} fullWidth>
          {processing
            ? "Processing..."
            : `Pay Deposit ${formatCurrency(depositAmount)}`}
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
        setPayload(parsed);
      } catch (e) {
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
          {/* Main Form Area */}
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

          {/* Sidebar Summary */}
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
