import React from "react";
import { Search, Sparkles, Filter, X } from "lucide-react";
import { CATEGORIES } from "../data/destinations";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onSelectCustom
}) {
  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by landmark name, city, or country (e.g. Charminar, Paris, Hyderabad, Tokyo)..."
          className="w-full pl-12 pr-12 py-4 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white dark:bg-[#0E0F17] border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-sm focus:border-purple-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 text-white shadow-md shadow-purple-500/20 scale-105"
                  : "bg-white dark:bg-[#0E0F17] text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-purple-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
