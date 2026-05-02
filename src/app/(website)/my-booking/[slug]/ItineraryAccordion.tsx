"use client";

import { useState } from "react";
import { Calendar, MapPin, Bed, ChevronDown, ChevronUp, Clock } from "lucide-react";
import Image from "next/image";

interface Props {
  itineraries: any[];
  accommodations: any[];
}

export default function ItineraryAccordion({ itineraries, accommodations }: Props) {
  // Default buka hari pertama
  const [openDay, setOpenDay] = useState<number | null>(1);

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-jvto-green"></span>
        Daily Itinerary
      </h3>

      <div className="space-y-4">
        {itineraries.map((item) => {
          const isOpen = openDay === item.day;
          // Cari hotel untuk hari ini
          const hotel = accommodations.find((h) => h.day === item.day);

          return (
            <div 
              key={item.day} 
              className={`rounded-sm border transition-all duration-300 overflow-hidden ${
                isOpen ? "border-jvto-green shadow-md bg-white" : "border-slate-200 bg-slate-50"
              }`}
            >
              {/* Header Accordion */}
              <button
                onClick={() => toggleDay(item.day)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-sm font-bold ${
                    isOpen ? "bg-jvto-green/10 text-jvto-green" : "bg-white border border-slate-200 text-slate-400"
                  }`}>
                    <span className="text-[10px] uppercase">Day</span>
                    <span className="text-lg leading-none">{item.day}</span>
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm md:text-base ${isOpen ? "text-slate-900" : "text-slate-600"}`}>
                      {item.title}
                    </h4>
                    {hotel && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Bed size={12} /> 
                        <span className="truncate max-w-[200px]">{hotel.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                  <ChevronDown size={20} className="text-slate-400" />
                </div>
              </button>

              {/* Content Accordion */}
              <div 
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 pt-0 border-t border-dashed border-slate-100 bg-white">
                    
                    {/* Activity List (HTML Content) */}
                    <div className="prose prose-sm max-w-none text-slate-600 mt-4 pl-4 border-l-2 border-jvto-green/30">
                        <div dangerouslySetInnerHTML={{ __html: item.activity }} />
                    </div>

                    {/* Hotel Card (If Exists) */}
                    {hotel && (
                        <div className="mt-6 flex items-start gap-4 bg-slate-50 p-3 rounded-sm border border-slate-100">
                            <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-slate-200">
                                <Image 
                                    src={hotel.banner} 
                                    alt={hotel.name} 
                                    fill 
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Overnight At</p>
                                <p className="font-bold text-slate-900 text-sm">{hotel.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{hotel.rooms}</p>
                            </div>
                        </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}