"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Providers } from "@/app/providers";
import {
  Calendar,
  Users,
  ChevronRight,
  Clock,
  MapPin,
  Palmtree,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plane,
  Loader2,
  Sparkles,
} from "lucide-react";

interface Booking {
  id: number;
  booking_code: string;
  url: string;
  customer_name: string;
  package_name: string;
  duration: string;
  travel_date_start: string;
  travel_date_end: string;
  total_pax: number;
  status: string;
  banner: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  let style = "bg-gray-100 text-gray-600 border-gray-200";
  let icon = <Clock size={12} />;

  if (["booked", "confirmed", "paid"].includes(s)) {
    style = "bg-emerald-100 text-emerald-700 border-emerald-200";
    icon = <CheckCircle2 size={12} />;
  } else if (["pending", "unpaid"].includes(s)) {
    style = "bg-amber-50 text-amber-700 border-amber-200";
    icon = <AlertCircle size={12} />;
  } else if (["cancelled", "failed"].includes(s)) {
    style = "bg-rose-50 text-rose-700 border-rose-200";
    icon = <XCircle size={12} />;
  }

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${style}`}
    >
      {icon} {status}
    </span>
  );
};

function MyBookingPageInner() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "COMPLETED">("ALL");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchBookings = async () => {
        try {
          const res = await fetch(
            `https://legacy.javavolcano-touroperator.com/bookings?json=true&email=${session.user?.email}`
          );
          if (!res.ok) throw new Error("Failed");
          const data = await res.json();
          setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const processedBookings = useMemo(() => {
    const today = new Date();
    return bookings
      .filter((b) => {
        const startDate = new Date(b.travel_date_start);
        if (activeTab === "UPCOMING")
          return startDate >= today && b.status !== "cancelled";
        if (activeTab === "COMPLETED")
          return startDate < today || b.status === "completed";
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.travel_date_start).getTime() -
          new Date(a.travel_date_start).getTime()
      );
  }, [bookings, activeTab]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter(
      (b) =>
        new Date(b.travel_date_start) >= new Date() && b.status !== "cancelled"
    ).length;
    return { total, upcoming };
  }, [bookings]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-jvto-green rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Plane className="text-slate-300" size={20} />
          </div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse tracking-wide">
          Preparing your itinerary...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-sm shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-jvto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-jvto-green" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            Login Required
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Please log in to access your dashboard and manage your upcoming adventures.
          </p>
          <Link
            href="/"
            className="inline-block w-full py-3 bg-jvto-dark text-white font-bold rounded-sm hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-100 md:bg-[#F8F9FA] pb-28 pt-20 md:pt-32">

      {/* desktop decoration */}
      <div className="hidden md:block fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-jvto-green/5 to-transparent -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">

        {/* ── MOBILE: Welcome card ── */}
        <div className="md:hidden mb-3">
          <div className="bg-white rounded-sm shadow-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-black text-gray-800">Hello, {firstName}</h1>
                <p className="text-gray-500 text-sm mt-0.5">Member Dashboard · JVTO</p>
              </div>
              <div className="bg-jvto-green/10 rounded-full p-3">
                <Palmtree className="h-6 w-6 text-jvto-green" />
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE: Stats summary card ── */}
        <div className="md:hidden mb-3">
          <div className="bg-white rounded-sm shadow-md p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Trip Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-sm shadow-sm p-3">
                <div className="flex">
                  <div className="bg-jvto-green/10 rounded-full p-2 mr-2 shrink-0">
                    <Palmtree className="h-4 w-4 text-jvto-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Trips</p>
                    <p className="text-xl font-bold text-jvto-green">
                      {stats.total}{" "}
                      <span className="text-xs text-gray-500 font-normal">trips</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-sm shadow-sm p-3">
                <div className="flex">
                  <div className="bg-blue-100 rounded-full p-2 mr-2 shrink-0">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 mb-1">Upcoming</p>
                    <p className="text-xl font-bold text-blue-600">
                      {stats.upcoming}{" "}
                      <span className="text-xs text-gray-500 font-normal">trips</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP HEADER (md+) ── */}
        <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                Member Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Hello, {firstName}! 👋
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              You have{" "}
              <span className="font-bold text-jvto-green">{stats.upcoming} upcoming</span>{" "}
              adventures waiting for you.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-sm border border-slate-100 shadow-sm min-w-[100px] text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Total Trips</p>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-jvto-dark p-4 rounded-sm shadow-lg min-w-[100px] text-center transform rotate-2">
              <p className="text-xs text-white/60 font-bold uppercase">Next Trip</p>
              <p className="text-2xl font-black text-white">
                {stats.upcoming > 0 ? "Soon" : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {(["ALL", "UPCOMING", "COMPLETED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-jvto-green text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {tab === "ALL" ? "All" : tab === "UPCOMING" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>

        {/* ── BOOKING LIST ── */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {processedBookings.length > 0 ? (
            processedBookings.map((booking) => (
              <div key={booking.id}>

                {/* ── DESKTOP CARD (md+) ── */}
                <div className="hidden md:block group relative bg-white rounded-sm p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:border-jvto-green/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-72 h-56 md:h-auto shrink-0 rounded-sm overflow-hidden">
                      <Image
                        src={booking.banner || "/assets/img/placeholder.jpg"}
                        alt={booking.package_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-sm shadow-sm flex flex-col items-center min-w-[50px]">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {new Date(booking.travel_date_start).toLocaleString("default", { month: "short" })}
                        </span>
                        <span className="text-xl font-black text-slate-900 leading-none">
                          {new Date(booking.travel_date_start).getDate()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 py-2 md:py-4 pr-4 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wide">
                            <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                              #{booking.booking_code}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> East Java
                            </span>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-jvto-green transition-colors leading-tight">
                          {booking.package_name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-sm border border-slate-100">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-jvto-green" />
                            <span>{booking.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-jvto-green" />
                            <span>{booking.total_pax} Travelers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-jvto-green" />
                            <span>
                              {new Date(booking.travel_date_start).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end gap-3">
                        <Link
                          href={`/my-booking/${booking.url}`}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          View Itinerary <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── MOBILE CARD (sam-app style) ── */}
                <div className="md:hidden bg-white rounded-sm shadow-md overflow-hidden mb-4">
                  <div className="p-4">
                    {/* Header: name + status */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 leading-snug">
                          {booking.package_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{booking.duration}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    {/* Date row */}
                    <div className="flex items-center mb-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1.5 shrink-0" />
                      <span>
                        {new Date(booking.travel_date_start).toLocaleDateString("en-US", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Footer: pax + code */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1.5 shrink-0" />
                        <span>{booking.total_pax} pax</span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        #{booking.booking_code}
                      </span>
                    </div>
                  </div>

                  {/* Action footer (sam-app colored footer strip) */}
                  <div className="bg-jvto-green/5 px-4 py-3 border-t border-jvto-green/15">
                    <Link
                      href={`/my-booking/${booking.url}`}
                      className="text-jvto-green text-sm font-medium"
                    >
                      Lihat Detail Booking →
                    </Link>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-sm border border-dashed border-slate-200">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-jvto-green/20 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 bg-jvto-green/5 rounded-full flex items-center justify-center">
                  <Palmtree size={40} className="text-jvto-green" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                No {activeTab.toLowerCase()} trips found
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                Your travel journal is empty. The volcanoes of East Java are calling!
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-8 py-4 bg-jvto-green hover:bg-[#8cb82b] text-slate-900 font-black text-lg rounded-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start an Adventure <Sparkles size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <Providers>
      <MyBookingPageInner />
    </Providers>
  );
}
