import { notFound } from "next/navigation";
import Image from "next/image";
import { BookingData } from "./types";
import BookingPaymentAction from "./BookingPaymentAction"; // Komponen Payment yg kita buat sebelumnya
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Download,
  Phone,
  Mail,
} from "lucide-react";
import ItineraryAccordion from "./ItineraryAccordion";
import CrewTransportCards from "./CrewTransportCards";
import EditBookingModals from "./EditBookingModals";


// --- HELPERS ---
const formatIDR = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// --- DATA FETCHING (GET KE LEGACY) ---
async function getBookingData(slug: string): Promise<BookingData | null> {
  const legacyUrl = process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN;
  // Endpoint ini sesuai dengan update UserBookingsController.php yang kita lakukan
  const res = await fetch(`${legacyUrl}/bookings/details/${slug}?json=true`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.booking;
}

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const booking = await getBookingData(slug);

  if (!booking) return notFound();

  // Status Logic
  const isFullyPaid = booking.finance.balance <= 0;
  const isCanceled = booking.status === "canceled"; // Sesuaikan status legacy

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-20 md:py-30">
      {/* 1. STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Kecil (Optional) */}
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-lime-400 font-black text-xs">
              JV
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Booking Ref
              </p>
              <h1 className="text-lg md:text-xl font-black text-slate-900 leading-none">
                {booking.booking_code}
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                isFullyPaid
                  ? "bg-lime-100 text-lime-700 border border-lime-200"
                  : "bg-orange-100 text-orange-700 border border-orange-200"
              }`}
            >
              {isFullyPaid ? "Confirmed & Paid" : "Awaiting Payment"}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 2. WELCOME HERO */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Hello,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-600">
              {booking.customer_name}
            </span>
            ! 👋
          </h2>
          <p className="text-slate-500 mt-2">
            Here is your personal dashboard for the{" "}
            <span className="font-bold text-slate-700">
              {booking.package_name}
            </span>{" "}
            trip.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (MAIN INFO) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* A. PAYMENT CARD (Jika Belum Lunas) */}
            {!isFullyPaid && !isCanceled && (
              <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <Clock size={18} className="text-orange-500" /> Payment
                      Required
                    </h3>
                    <p className="text-sm text-slate-500 mb-3 max-w-md">
                      Please complete your payment before{" "}
                      <b>{formatDate(booking.finance.due_date)}</b> to secure
                      your reservation.
                    </p>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {formatIDR(booking.finance.balance)}
                    </div>
                  </div>

                  {/* Tombol Action Bayar */}
                  <div className="shrink-0">
                    <BookingPaymentAction
                      bookingUrl={booking.url}
                      balance={booking.finance.balance}
                      paymentLink={booking.finance.payment_link}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* B. TRIP OVERVIEW CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-4">
                Trip Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                  <div className="flex items-center gap-2 text-lime-600 mb-1">
                    <Calendar size={16} />{" "}
                    <span className="text-xs font-bold uppercase">Date</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {formatDate(booking.travel_date_start)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lime-600 mb-1">
                    <Clock size={16} />{" "}
                    <span className="text-xs font-bold uppercase">
                      Duration
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{booking.duration}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lime-600 mb-1">
                    <Users size={16} />{" "}
                    <span className="text-xs font-bold uppercase">Pax</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {booking.total_pax} People
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lime-600 mb-1">
                    <MapPin size={16} />{" "}
                    <span className="text-xs font-bold uppercase">Start</span>
                  </div>
                  <p
                    className="font-bold text-slate-900 truncate"
                    title={booking.pickup}
                  >
                    {booking.pickup || "TBA"}
                  </p>
                </div>
              </div>
            </div>

            {/* C. ADD-ONS LIST (NEW FEATURE FROM JSON) */}
            {booking.addons.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-4">
                  Purchased Add-ons
                </h3>
                <div className="space-y-4">
                  {booking.addons.map((addon, idx) => (
                    <div
                      key={addon.id}
                      className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">
                            {addon.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatIDR(addon.price)} x {addon.qty}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        {formatIDR(addon.subtotal)}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <p className="font-bold text-slate-500">Total Add-ons</p>
                    <p className="text-xl font-black text-lime-600">
                      {formatIDR(booking.finance.total_addons)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <ItineraryAccordion
              itineraries={booking.itineraries}
              accommodations={booking.accommodations}
            />

            {/* E. CREW & TRANSPORT SECTION */}
            <CrewTransportCards
              crews={booking.crews}
              vehicles={booking.vehicle_specs}
            />
            <EditBookingModals
              bookingUrl={booking.url}
              totalPax={booking.total_pax}
              tshirtSizes={booking.tshirt_sizes}
              pickup={{ location: booking.pickup, time: booking.pickup_time }}
              drop={{ location: booking.drop, time: booking.drop_time }}
            />
          </div>

          {/* --- RIGHT COLUMN (SIDEBAR) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. CONTACT OPERATOR */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Need Help?
              </h3>
              <div className="space-y-4">
                <a
                  href="https://wa.me/6282244788833"
                  target="_blank"
                  className="flex items-center gap-3 text-slate-700 hover:text-lime-600 transition-colors"
                >
                  <div className="p-2 bg-slate-100 rounded-full">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      WhatsApp
                    </p>
                    <p className="font-bold">+62 822-4478-8833</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-slate-100 rounded-full">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Email
                    </p>
                    <p className="font-bold text-sm">
                      javavolcanotouroperator@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DOCUMENTS DOWNLOAD */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 bg-lime-500 blur-3xl opacity-20 rounded-full pointer-events-none"></div>
              <h3 className="font-bold uppercase tracking-widest mb-6 text-lime-400 text-xs relative z-10">
                Documents
              </h3>
              <div className="space-y-3 relative z-10">
                <a
                  href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/invoice/${booking.url}`}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all group"
                >
                  <span className="font-bold text-sm">Invoice</span>
                  <Download
                    size={18}
                    className="text-slate-400 group-hover:text-white transition-colors"
                  />
                </a>

                <a
                  href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/receipt/${booking.url}`}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all group"
                >
                  <span className="font-bold text-sm">Receipt</span>
                  <Download
                    size={18}
                    className="text-slate-400 group-hover:text-white transition-colors"
                  />
                </a>

                {booking.addons.length > 0 && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/invoice-addon/${booking.url}`}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all group"
                  >
                    <span className="font-bold text-sm">Add-on Invoice</span>
                    <Download
                      size={18}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                  </a>
                )}
              </div>
            </div>

            {/* 3. PAYMENT HISTORY */}
            {booking.finance.payment_history.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Payment History
                </h3>
                <div className="space-y-4">
                  {booking.finance.payment_history.map((hist, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {hist.method}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDate(hist.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">
                          {formatIDR(hist.nominal)}
                        </p>
                        <span className="text-[10px] uppercase font-bold text-lime-600 bg-lime-100 px-1.5 py-0.5 rounded">
                          Success
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
