"use client";

import Image from "next/image";
import Link from "@/components/website/AppLink";
import { ArrowRight, Clock, Search, X } from "lucide-react";

interface NavbarSearchModalProps {
  isOpen: boolean;
  isLoadingTours: boolean;
  tourLoadError: boolean;
  searchQuery: string;
  filteredResults: any[];
  onClose: () => void;
  onSearchQueryChange: (value: string) => void;
}

const NavbarSearchModal = ({
  isOpen,
  isLoadingTours,
  tourLoadError,
  searchQuery,
  filteredResults,
  onClose,
  onSearchQueryChange,
}: NavbarSearchModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            autoFocus
            type="text"
            placeholder="Search tour packages (e.g. Bromo, Ijen...)"
            className="w-full outline-none text-jvto-dark text-lg font-medium"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoadingTours ? (
            <div className="py-12 text-center text-gray-400 font-medium">
              Loading tours...
            </div>
          ) : tourLoadError ? (
            <div className="py-12 text-center text-gray-400 font-medium">
              Search is temporarily unavailable.
            </div>
          ) : searchQuery.length > 0 ? (
            filteredResults.length > 0 ? (
              <div className="py-2">
                {filteredResults.map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/${tour.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 mx-2 mb-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                  >
                    <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                      <Image
                        src={tour.banner.url}
                        alt={tour.banner.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold text-jvto-dark leading-snug group-hover:text-jvto-green transition-colors line-clamp-1">
                        {tour.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          <Clock size={12} className="text-gray-400" />
                          {tour.duration.day}D/{tour.duration.night}N
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
                          {tour.startDestination} → {tour.endDestination}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[14px] font-black text-jvto-green">
                          IDR {tour.startFrom?.toLocaleString("id-ID")}
                          <span className="text-[10px] text-gray-400 font-normal ml-1 tracking-normal italic lowercase">
                            / person
                          </span>
                        </p>
                        <span className="text-[10px] font-bold text-jvto-green opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all -translate-x-2 group-hover:translate-x-0">
                          DETAILS <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 font-medium">
                No tours found for "{searchQuery}"
              </div>
            )
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              Start typing to find your adventure...
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Java Volcano Tour Operator</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default NavbarSearchModal;
