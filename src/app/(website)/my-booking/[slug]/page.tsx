import { notFound } from "next/navigation";
import { BookingData } from "./types";
import BookingPaymentAction from "./BookingPaymentAction";
import EditBookingModals from "./EditBookingModals";
import ItineraryAccordion from "./ItineraryAccordion";
import CrewTransportCards from "./CrewTransportCards";
import BookingInformation from "./BookingInformation";
import MobileBookingView from "./MobileBookingView";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Download,
  Phone,
  Mail,
  Info,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Camera,
  Star,
  ExternalLink,
} from "lucide-react";

// --- HELPERS ---
const formatIDR = (num: number) => {
  return `IDR ${num.toLocaleString("id-ID").replace(/\./g, ",")}`;
};
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// --- DATA FETCHING ---
async function getBookingData(slug: string): Promise<BookingData | null> {
  const legacyDomain = process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN;
  // Pastikan URL Legacy di .env.local benar
  const url = `${legacyDomain}/bookings/details/${slug}?json=true`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    console.log(data);
    return data.booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const booking = await getBookingData(slug);

  if (!booking) return notFound();

  // --- LOGIC STATUS ---
  const isFullyPaid = booking.finance.balance <= 0;
  const isCanceled = booking.status === "canceled";
  const isConfirmed = booking.status === "booked";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 pt-20 md:pt-30">
      {/* ── STICKY HEADER (shared) ── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 md:flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-900 rounded-sm flex items-center justify-center text-jvto-green font-black text-xs">
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
          {booking.channel != "KLOOK" && (
            <div className="mt-2 md:mt-0 md:text-right">
              {isFullyPaid ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-jvto-green/10 text-jvto-green border border-jvto-green/30">
                  <CheckCircle size={12} /> Confirmed & Paid
                </span>
              ) : isConfirmed ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                  <Info size={12} /> Confirmed (Balance Due)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-orange-100 text-orange-700 border border-orange-200">
                  <Clock size={12} />{" "}
                  {booking.finance.pending_upload_proof
                    ? "Payment Under Review"
                    : "Awaiting Payment"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden">
        <MobileBookingView booking={booking} />
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:block">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Hello,{" "}
            <span className="text-jvto-green">
              {booking.customer_name}
            </span>
            ! 👋
          </h2>
          <p className="text-slate-500 mt-2">
            Here is your personal dashboard for the{" "}
            <span id="packageName" className="font-bold text-slate-700">
              {booking.package_name}
            </span>{" "}
            trip.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* A. PAYMENT CARD LOGIC */}
            {booking.channel != "KLOOK" && !isFullyPaid && !isCanceled && (
              <>
                {isConfirmed ? (
                  // 1. TAMPILAN CONFIRMED (STYLE: WHITE CARD, BLUE TEXT, ORANGE BUTTON)
                  // Menggunakan bg-white (bukan blue-50) agar sama dengan Legacy
                  <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="shrink-0 mt-1">
                        <Info className="text-blue-500" size={24} />
                      </div>
                      <div className="flex-grow">
                        {/* Text Title Biru Tua */}
                        <h3 className="text-lg font-bold text-blue-800 mb-2">
                          Your booking is confirmed!
                        </h3>

                        <div className="text-sm text-slate-600 mb-4 space-y-2">
                          <p>
                            Please select a payment method for your remaining
                            balance of
                            <span className="font-bold text-orange-500 mx-1">
                              {formatIDR(booking.finance.balance)}
                            </span>
                            at your convenience.
                          </p>

                          {/* LOGIC METHOD: Hanya tampil jika user SUDAH MEMILIH sebelumnya */}
                          {booking.finance.balance_payment_method && (
                            <div className="bg-slate-50 p-3 rounded-sm border border-slate-100 mt-2">
                              <p className="font-bold text-xs uppercase text-slate-400 mb-1">
                                Selected Method
                              </p>
                              <p className="font-semibold text-slate-900 capitalize">
                                {booking.finance.balance_payment_method === "cc"
                                  ? "Credit Card (Xendit)"
                                  : booking.finance.balance_payment_method ===
                                      "wise"
                                    ? "Wise / Bank Transfer"
                                    : "Cash on Arrival"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Component Tombol Payment (Warnanya sudah Orange di component) */}
                        <BookingPaymentAction
                          bookingUrl={booking.url}
                          balance={booking.finance.balance}
                          paymentLink={booking.finance.payment_link}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // 2. TAMPILAN AWAITING DEPOSIT (Orange Alert)
                  <div className="bg-white rounded-sm border border-orange-100 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                          <AlertCircle size={18} className="text-orange-500" />
                          {booking.finance.pending_upload_proof
                            ? "Payment Checking Process"
                            : "Awaiting Payment"}
                        </h3>

                        <p className="text-sm text-slate-500 mb-3 max-w-md">
                          {booking.finance.pending_upload_proof ? (
                            <>
                              Your payment proof has been submitted and is being
                              reviewed.
                            </>
                          ) : (
                            <>
                              Please complete your payment before{" "}
                              <b>{formatDate(booking.finance.due_date)}</b> to
                              secure your reservation.
                            </>
                          )}
                        </p>

                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                          {formatIDR(booking.finance.balance)}
                        </div>
                      </div>

                      <div className="shrink-0 flex gap-3">
                        {/* tombol bayar */}
                        {!booking.finance.pending_upload_proof && (
                          <a
                            href={booking.finance.payment_link || "#"}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wide px-6 py-3 rounded-sm shadow-lg shadow-orange-500/30 transition-all inline-block"
                          >
                            Pay Now &rarr;
                          </a>
                        )}

                        {/* tombol lihat bukti */}
                        {booking.finance.pending_upload_proof && (
                          <a
                            href={booking.finance.uploaded_payment_proof ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wide px-6 py-3 rounded-sm border border-slate-200 transition-all inline-block"
                          >
                            View Payment Proof
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* B. TRIP OVERVIEW */}
            <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-4">
                Trip Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                  <div className="flex items-center gap-2 text-jvto-green mb-1">
                    <Calendar size={16} />{" "}
                    <span className="text-xs font-bold uppercase">Date</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {formatDate(booking.travel_date_start)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-jvto-green mb-1">
                    <Clock size={16} />{" "}
                    <span className="text-xs font-bold uppercase">
                      Duration
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{booking.duration}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-jvto-green mb-1">
                    <Users size={16} />{" "}
                    <span className="text-xs font-bold uppercase">Pax</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {booking.total_pax} People
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-jvto-green mb-1">
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

            {/* C. ADD-ONS LIST */}
            {booking.addons.length > 0 && (
              <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
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
                    <p className="text-xl font-black text-jvto-green">
                      {formatIDR(booking.finance.total_addons)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* D. ITINERARY SECTION */}
            <ItineraryAccordion
              itineraries={booking.itineraries}
              accommodations={booking.accommodations}
            />

            {/* E. CREW & TRANSPORT SECTION */}
            <CrewTransportCards
              crews={booking.crews}
              vehicles={booking.vehicle_specs}
            />

            {/* F. EDIT BOOKING SECTION */}
            <EditBookingModals
              bookingUrl={booking.url}
              totalPax={booking.total_pax}
              tshirtSizes={booking.tshirt_sizes}
              pickup={{ location: booking.pickup, time: booking.pickup_time }}
              drop={{ location: booking.drop, time: booking.drop_time }}
            />

            {/* G. INFO & MEDIA SECTION */}
            <BookingInformation
              faq={booking.faq}
              packing={booking.packing_recommendations}
              mediaLink={booking.media_link}
            />
          </div>

          {/* --- RIGHT COLUMN (SIDEBAR) --- */}
          <div className="lg:col-span-1 space-y-6">

            {/* 0. TRIP MEDIA & REVIEWS: top of sidebar for visibility */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 px-6 pt-5 pb-3 border-b border-slate-100">
                Your Trip
              </h3>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <a
                  href={booking.media_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="bg-orange-100 rounded-full p-2.5">
                    <Camera size={18} className="text-orange-500" />
                  </div>
                  <p className="text-xs font-semibold text-orange-700 text-center leading-tight">Trip Media</p>
                  <p className="text-[10px] text-orange-400 text-center">Photos & videos</p>
                </a>
                <a
                  href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="bg-green-100 rounded-full p-2.5">
                    <Star size={18} className="text-green-600" />
                  </div>
                  <p className="text-xs font-semibold text-green-700 text-center leading-tight">Trustpilot</p>
                  <p className="text-[10px] text-green-400 text-center">Rate us</p>
                </a>
                <a
                  href="https://g.page/r/Cb3i9Eu0K5MREB0/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="bg-blue-100 rounded-full p-2.5">
                    <ExternalLink size={18} className="text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-blue-700 text-center leading-tight">Google</p>
                  <p className="text-[10px] text-blue-400 text-center">Review us</p>
                </a>
              </div>
            </div>

            {/* 1. CONTACT OPERATOR */}
            <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Need Help?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-slate-100 rounded-full">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Email
                    </p>
                    <p className="font-bold text-sm">
                      hello@javavolcano-touroperator.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DOCUMENTS DOWNLOAD */}
            {booking.channel != "KLOOK" && (
              <div className="bg-slate-900 text-white rounded-sm p-6 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 bg-jvto-green blur-3xl opacity-20 rounded-full pointer-events-none"></div>
                <h3 className="font-bold uppercase tracking-widest mb-2 text-jvto-green text-xs relative z-10">
                  Documents
                </h3>
                <p className="text-white/60 text-xs mb-4 relative z-10 font-mono">
                  Invoice #<span id="invoiceCode">{booking.booking_code}</span>
                </p>
                <div className="space-y-3 relative z-10">
                  <a
                    href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/invoice/${booking.url}`}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-sm bg-white/10 hover:bg-white/20 transition-all group"
                  >
                    <span className="font-bold text-sm">Invoice</span>
                    <Download
                      size={18}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                  </a>

                  <a
                    href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/receipt/${booking.url}`}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-sm bg-white/10 hover:bg-white/20 transition-all group"
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
                      className="flex items-center justify-between w-full px-4 py-3 rounded-sm bg-white/10 hover:bg-white/20 transition-all group"
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
            )}
            {booking.channel != "KLOOK" && (
              <div className="bg-gradient-to-br from-jvto-green to-green-600 text-white rounded-sm p-6 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 bg-white blur-3xl opacity-20 rounded-full pointer-events-none"></div>
                <h3 className="font-bold uppercase tracking-widest mb-4 text-white/80 text-xs relative z-10">
                  Grand Total
                </h3>
                <div className="relative z-10">
                  <p
                    id="grandTotal"
                    className="text-3xl font-black tracking-tight"
                  >
                    {formatIDR(booking.finance.grand_total)}
                  </p>
                  <p className="text-sm text-white/80 mt-1">
                    Total overall trip cost
                  </p>
                </div>
              </div>
            )}

            {/* 3. PAYMENT HISTORY */}
            {booking.channel != "KLOOK" &&
              booking.finance.payment_history.length > 0 && (
                <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
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
                          <span className="text-[10px] uppercase font-bold text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded">
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
      </div>{/* end desktop */}

      {/* ── STICKY CHAT BUTTON (desktop only: mobile has its own in MobileBookingView) ── */}
      <a
        href={`https://chat.javavolcano-touroperator.com/chat/${booking.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-50 items-center gap-2 bg-jvto-green hover:bg-[#8cb82b] text-jvto-dark font-semibold text-sm px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
      >
        <MessageCircle size={18} />
        Chat with Us
      </a>
    </div>
  );
}
