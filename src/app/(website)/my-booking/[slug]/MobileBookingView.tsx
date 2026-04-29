"use client";

import { useState, useEffect } from "react";
import { BookingData } from "./types";
import BookingPaymentAction from "./BookingPaymentAction";
import EditBookingModals from "./EditBookingModals";
import ItineraryAccordion from "./ItineraryAccordion";
import CrewTransportCards from "./CrewTransportCards";
import BookingInformation from "./BookingInformation";
import { useBookingTab } from "../MobileBookingNav";
import {
  Calendar, Clock, Users, MapPin, Phone, Mail,
  Download, Info, AlertCircle, CheckCircle,
  FileText, ShoppingBag, Pencil, Wallet,
  ChevronDown, ChevronUp, MessageCircle, Camera, Star, ExternalLink,
} from "lucide-react";

const fmtIDR  = (n: number) => `IDR ${n.toLocaleString("id-ID").replace(/\./g, ",")}`;
const fmtDate = (s: string)  => new Date(s).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
const fmtShort= (s: string)  => new Date(s).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

// ── Expandable card ───────────────────────────────────────────────────────────
function Section({
  iconBg, iconColor, icon: Icon, title, badge, defaultOpen = true, children,
}: {
  iconBg: string; iconColor: string; icon: React.ElementType;
  title: string; badge?: React.ReactNode;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-md mb-4">
      <div
        className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <div className={`${iconBg} p-2 rounded-full mr-3`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          {badge && <span className="ml-2">{badge}</span>}
        </div>
        {open
          ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
          : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
        }
      </div>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

// ── 2-col info grid (label above value) ──────────────────────────────────────
function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className="font-medium text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function MobileBookingView({ booking }: { booking: BookingData }) {
  const { activeTab } = useBookingTab();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const isFullyPaid = booking.finance.balance <= 0;
  const isCanceled  = booking.status === "canceled";
  const isConfirmed = booking.status === "booked";
  const needsPayment = booking.channel !== "KLOOK" && !isFullyPaid && !isCanceled;

  return (
    <div>

      {/* ── BOOKING HEADER ────────────────────────────────────────────────── */}
      <div className="bg-white px-4 pt-4 pb-4 mb-1 border-b border-gray-100">
        <p className="text-xs text-gray-400 font-medium tracking-wide mb-1">
          Booking #{booking.booking_code}
        </p>
        <h2 className="text-lg font-bold text-gray-900 mb-0.5 leading-snug">
          {booking.package_name}
        </h2>
        <p className="text-sm text-gray-500 mb-2">
          {booking.customer_name}
        </p>

        {booking.channel !== "KLOOK" && (
          <>
            {isFullyPaid ? (
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3" /> Confirmed &amp; Paid
              </span>
            ) : isConfirmed ? (
              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                <Info className="h-3 w-3" /> Balance Due
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                <AlertCircle className="h-3 w-3" />
                {booking.finance.pending_upload_proof ? "Under Review" : "Awaiting Payment"}
              </span>
            )}
          </>
        )}
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────────────────────── */}
      <div className="px-4 pt-4">

        {/* ════ OVERVIEW ════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <>
            {/* Grand total banner */}
            {booking.channel !== "KLOOK" && (
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Grand Total</p>
                    <p className="text-2xl font-bold text-gray-900">{fmtIDR(booking.finance.grand_total)}</p>
                  </div>
                  <div className={`${isFullyPaid ? "bg-green-100" : "bg-orange-100"} p-3 rounded-full`}>
                    <Wallet className={`h-6 w-6 ${isFullyPaid ? "text-green-600" : "text-orange-500"}`} />
                  </div>
                </div>
                {!isFullyPaid && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Remaining Balance</p>
                    <p className="font-bold text-orange-500">{fmtIDR(booking.finance.balance)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Payment action */}
            {needsPayment && (
              isConfirmed ? (
                <Section iconBg="bg-blue-100" iconColor="text-blue-600" icon={Info} title="Complete Payment">
                  <p className="text-gray-500 text-sm mb-3">
                    Select a payment method for your remaining balance of{" "}
                    <span className="font-semibold text-orange-500">{fmtIDR(booking.finance.balance)}</span>.
                  </p>
                  {booking.finance.balance_payment_method && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-gray-500 text-sm mb-1">Selected Method</p>
                      <p className="font-medium capitalize">
                        {booking.finance.balance_payment_method === "cc" ? "Credit Card (Xendit)"
                          : booking.finance.balance_payment_method === "wise" ? "Wise / Bank Transfer"
                          : "Cash on Arrival"}
                      </p>
                    </div>
                  )}
                  <BookingPaymentAction
                    bookingUrl={booking.url}
                    balance={booking.finance.balance}
                    paymentLink={booking.finance.payment_link}
                  />
                </Section>
              ) : (
                <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 rounded-full mr-3">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {booking.finance.pending_upload_proof ? "Payment Under Review" : "Awaiting Payment"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {booking.finance.pending_upload_proof
                            ? "Your proof has been submitted and is being reviewed."
                            : <>Due by <span className="font-medium text-gray-700">{fmtDate(booking.finance.due_date)}</span></>
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-3xl font-bold text-gray-900 mb-4">{fmtIDR(booking.finance.balance)}</p>
                    {!booking.finance.pending_upload_proof && (
                      <a href={booking.finance.payment_link || "#"}
                        className="block w-full text-center py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
                        Pay Now →
                      </a>
                    )}
                    {booking.finance.pending_upload_proof && (
                      <a href={booking.finance.uploaded_payment_proof ?? "#"}
                        target="_blank" rel="noopener noreferrer"
                        className="block w-full text-center py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg border border-gray-200">
                        View Payment Proof
                      </a>
                    )}
                  </div>
                </div>
              )
            )}

            {/* ── QUICK ACTIONS: Media & Reviews ── */}
            <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Your Trip</h2>
              </div>
              <div className="flex">
                {/* Trip Media */}
                <a
                  href={booking.media_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 py-4 px-2 bg-orange-50 hover:bg-orange-100 border-r border-gray-100 transition-colors"
                >
                  <div className="bg-orange-100 rounded-full p-2.5">
                    <Camera className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-xs font-semibold text-orange-700 text-center leading-tight">Trip Media</p>
                  <p className="text-[10px] text-orange-500 text-center">Photos & videos</p>
                </a>

                {/* Trustpilot */}
                <a
                  href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 py-4 px-2 bg-green-50 hover:bg-green-100 border-r border-gray-100 transition-colors"
                >
                  <div className="bg-green-100 rounded-full p-2.5">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xs font-semibold text-green-700 text-center leading-tight">Trustpilot</p>
                  <p className="text-[10px] text-green-500 text-center">Rate us</p>
                </a>

                {/* Google */}
                <a
                  href="https://g.page/r/Cb3i9Eu0K5MREB0/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex flex-col items-center gap-2 py-4 px-2 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="bg-blue-100 rounded-full p-2.5">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-blue-700 text-center leading-tight">Google</p>
                  <p className="text-[10px] text-blue-500 text-center">Review us</p>
                </a>
              </div>
            </div>

            {/* Trip details */}
            <Section iconBg="bg-lime-100" iconColor="text-lime-600" icon={Calendar} title="Trip Details">
              <InfoGrid items={[
                { label: "Departure Date", value: fmtDate(booking.travel_date_start) },
                { label: "Duration",       value: booking.duration },
                { label: "Total Pax",      value: `${booking.total_pax} People` },
                { label: "Pickup Point",   value: booking.pickup || "TBA" },
              ]} />
              {booking.pickup && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-lime-600 mr-2 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-sm mb-0.5">Pickup</p>
                      <p className="font-medium">{booking.pickup} — {booking.pickup_time}</p>
                    </div>
                  </div>
                  {booking.drop && (
                    <div className="flex items-start mt-3">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-500 text-sm mb-0.5">Drop-off</p>
                        <p className="font-medium">{booking.drop} — {booking.drop_time}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Section>

            {/* Add-ons */}
            {booking.addons.length > 0 && (
              <Section
                iconBg="bg-purple-100" iconColor="text-purple-600"
                icon={ShoppingBag} title="Purchased Add-ons"
                badge={
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                    {booking.addons.length}
                  </span>
                }
                defaultOpen={false}
              >
                <div className="space-y-3">
                  {booking.addons.map((addon, idx) => (
                    <div key={addon.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <span className="bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{addon.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{fmtIDR(addon.price)} × {addon.qty}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm shrink-0">{fmtIDR(addon.subtotal)}</p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-500">Total Add-ons</p>
                    <p className="font-bold text-gray-900">{fmtIDR(booking.finance.total_addons)}</p>
                  </div>
                </div>
              </Section>
            )}

            {/* Edit booking */}
            <Section iconBg="bg-amber-100" iconColor="text-amber-600" icon={Pencil} title="Edit Booking" defaultOpen={false}>
              <EditBookingModals
                bookingUrl={booking.url}
                totalPax={booking.total_pax}
                tshirtSizes={booking.tshirt_sizes}
                pickup={{ location: booking.pickup, time: booking.pickup_time }}
                drop={{ location: booking.drop, time: booking.drop_time }}
              />
            </Section>
          </>
        )}

        {/* ════ ITINERARY ═══════════════════════════════════════════════════ */}
        {activeTab === "itinerary" && (
          <ItineraryAccordion
            itineraries={booking.itineraries}
            accommodations={booking.accommodations}
          />
        )}

        {/* ════ CREW ════════════════════════════════════════════════════════ */}
        {activeTab === "crew" && (
          <CrewTransportCards
            crews={booking.crews}
            vehicles={booking.vehicle_specs}
          />
        )}

        {/* ════ PAYMENT ═════════════════════════════════════════════════════ */}
        {activeTab === "payment" && (
          <>
            {booking.channel === "KLOOK" ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500 mb-4">
                <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Payment is managed by KLOOK.</p>
              </div>
            ) : (
              <>
                {/* Documents */}
                <Section iconBg="bg-blue-100" iconColor="text-blue-600" icon={FileText} title="Documents">
                  <p className="text-gray-500 text-sm mb-3">Invoice #{booking.booking_code}</p>
                  <div className="flex gap-2">
                    <a href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/invoice/${booking.url}`}
                      className="flex-1 flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all">
                      <Download className="h-8 w-8 text-blue-600 mb-2" />
                      <span className="font-medium text-sm text-blue-700 text-center">Invoice</span>
                    </a>
                    <a href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/receipt/${booking.url}`}
                      className="flex-1 flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all">
                      <Download className="h-8 w-8 text-green-600 mb-2" />
                      <span className="font-medium text-sm text-green-700 text-center">Receipt</span>
                    </a>
                    {booking.addons.length > 0 && (
                      <a href={`${process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN}/bookings/invoice-addon/${booking.url}`}
                        className="flex-1 flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all">
                        <Download className="h-8 w-8 text-purple-600 mb-2" />
                        <span className="font-medium text-sm text-purple-700 text-center">Add-on</span>
                      </a>
                    )}
                  </div>
                </Section>

                {/* Payment history */}
                {booking.finance.payment_history.length > 0 && (
                  <Section
                    iconBg="bg-green-100" iconColor="text-green-600"
                    icon={Wallet} title="Payment History"
                    badge={
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {booking.finance.payment_history.length}
                      </span>
                    }
                  >
                    <div className="space-y-3">
                      {booking.finance.payment_history.map((hist, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{hist.method}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{fmtShort(hist.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">{fmtIDR(hist.nominal)}</p>
                            <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium uppercase">
                              Paid
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-500">Total Paid / Grand Total</p>
                      <p className="text-sm font-bold text-gray-900">
                        <span className="text-green-600">{fmtIDR(booking.finance.paid_amount)}</span>
                        {" / "}
                        {fmtIDR(booking.finance.grand_total)}
                      </p>
                    </div>
                  </Section>
                )}
              </>
            )}
          </>
        )}

        {/* ════ INFO ════════════════════════════════════════════════════════ */}
        {activeTab === "info" && (
          <>
            <Section iconBg="bg-blue-100" iconColor="text-blue-600" icon={Phone} title="Need Help?">
              <div className="space-y-3">
                <a href="https://wa.me/6282244788833" target="_blank" rel="noopener noreferrer"
                  className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-0.5">WhatsApp</p>
                    <p className="font-medium">+62 822-4478-8833</p>
                  </div>
                </a>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="bg-gray-200 p-2 rounded-full mr-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-0.5">Email</p>
                    <p className="font-medium text-sm">hello@javavolcano-touroperator.com</p>
                  </div>
                </div>
              </div>
            </Section>

            <BookingInformation
              faq={booking.faq}
              packing={booking.packing_recommendations}
              mediaLink={booking.media_link}
            />
          </>
        )}
      </div>

      {/* ── STICKY CHAT BUTTON ────────────────────────────────────────────── */}
      {/* bottom-20 clears the fixed bottom nav bar (~56px) */}
      <a
        href={`https://chat.javavolcano-touroperator.com/chat/${booking.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-jvto-green text-jvto-dark font-semibold text-sm px-4 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        Chat
      </a>
    </div>
  );
}
