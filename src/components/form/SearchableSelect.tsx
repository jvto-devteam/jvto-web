"use client";

import type React from "react";
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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
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

  // Atur highlighted index saat dropdown dibuka atau list/filter berubah
  useEffect(() => {
    let frameId = 0;

    const syncHighlight = (nextIndex: number) => {
      frameId = window.requestAnimationFrame(() => {
        setHighlightedIndex(nextIndex);
      });
    };

    if (!open) {
      syncHighlight(-1);
      return;
    }

    if (filteredOptions.length === 0) {
      syncHighlight(-1);
      return;
    }

    // Coba highlight opsi yang saat ini terpilih
    const selectedIndex =
      selectedValueKey != null
        ? filteredOptions.findIndex(
            (opt) => String(getOptionValue(opt)) === selectedValueKey
          )
        : -1;

    if (selectedIndex >= 0) {
      syncHighlight(selectedIndex);
    } else {
      // Kalau belum ada yang kepilih, highlight item pertama
      syncHighlight(0);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [open, filteredOptions, selectedValueKey, getOptionValue]);

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || disabled) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (filteredOptions.length === 0) return;

        setHighlightedIndex((prev) => {
          if (prev < 0) return 0;
          const next =
            prev + 1 < filteredOptions.length ? prev + 1 : 0; // wrap ke atas
          return next;
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (filteredOptions.length === 0) return;

        setHighlightedIndex((prev) => {
          if (prev < 0) return filteredOptions.length - 1;
          const next =
            prev - 1 >= 0 ? prev - 1 : filteredOptions.length - 1; // wrap ke bawah
          return next;
        });
        break;
      }
      case "Enter": {
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          e.preventDefault();
          const option = filteredOptions[highlightedIndex];
          handleSelect(option);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setOpen(false);
        break;
      }
      default:
        break;
    }
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
          {value ? (
            getOptionLabel(value)
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
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
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto nice-scrollbar py-1 text-[11px]">
            {filteredOptions.length === 0 && (
              <div className="px-2 py-1 text-slate-500">
                {noOptionsText}
              </div>
            )}

            {filteredOptions.map((opt, idx) => {
              const key = String(getOptionValue(opt));
              const label = getOptionLabel(opt);
              const isSelected = selectedValueKey === key;
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={key}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={[
                    "px-2 py-1.5 flex items-center justify-between",
                    isHighlighted
                      ? "bg-slate-700/80 text-slate-50"
                      : "hover:bg-slate-800/70",
                    isSelected
                      ? "text-emerald-300"
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
