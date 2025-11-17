"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown, X, Search } from "lucide-react";

type SearchableSelectProps<T> = {
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  noOptionsText?: string;
};

export function SearchableSelect<T>({
  value,
  onChange,
  options,
  getOptionLabel,
  getOptionValue,
  placeholder = "Pilih...",
  disabled = false,
  clearable = true,
  className = "",
  noOptionsText = "Tidak ada data",
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedValueKey =
    value != null ? String(getOptionValue(value)) : null;

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((opt) =>
      getOptionLabel(opt).toLowerCase().includes(q)
    );
  }, [options, search, getOptionLabel]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  function handleSelect(option: T) {
    onChange(option);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setSearch("");
  }

  return (
    <div
      ref={containerRef}
      className={
        "relative text-xs " +
        (disabled ? "opacity-60 cursor-not-allowed " : "cursor-pointer ") +
        className
      }
    >
      {/* Control */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "w-full flex items-center justify-between rounded-md border px-2 py-1.5 text-left",
          "border-slate-800 bg-slate-900/60 text-slate-50",
          "focus:outline-none focus:ring-1 focus:ring-blue-500",
        ].join(" ")}
      >
        <span className="truncate text-xs">
          {value
            ? getOptionLabel(value)
            : <span className="text-slate-500">{placeholder}</span>}
        </span>
        <span className="flex items-center gap-1">
          {clearable && value && !disabled && (
            <X
              className="h-3 w-3 text-slate-400 hover:text-rose-300"
              onClick={handleClear}
            />
          )}
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </span>
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-40 mt-1 w-full rounded-md border border-slate-800 bg-slate-950 shadow-lg">
          {/* Search input */}
          <div className="flex items-center gap-1 px-2 py-1 border-b border-slate-800 bg-slate-950/80">
            <Search className="h-3 w-3 text-slate-500" />
            <input
              autoFocus
              className="w-full bg-transparent border-none text-[11px] text-slate-100 placeholder:text-slate-600 focus:outline-none"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto nice-scrollbar py-1 text-[11px]">
            {filteredOptions.length === 0 && (
              <div className="px-2 py-1 text-slate-500">
                {noOptionsText}
              </div>
            )}

            {filteredOptions.map((opt) => {
              const key = String(getOptionValue(opt));
              const label = getOptionLabel(opt);
              const isSelected = selectedValueKey === key;

              return (
                <div
                  key={key}
                  onClick={() => handleSelect(opt)}
                  className={[
                    "px-2 py-1.5 flex items-center justify-between",
                    "hover:bg-slate-800/70",
                    isSelected
                      ? "bg-slate-800/80 text-emerald-300"
                      : "text-slate-100",
                  ].join(" ")}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && (
                    <span className="text-[9px] text-emerald-400">
                      selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
