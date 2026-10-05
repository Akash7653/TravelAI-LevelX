import React from "react";
import DestinationCard from "./DestinationCard";
import { Sparkles, Compass } from "lucide-react";

export default function DestinationGrid({
  destinations,
  selectedPlace,
  onSelectPlace,
  searchQuery,
  customPlace,
  onCustomPlaceChange
}) {
  return (
    <div className="space-y-6">
      {/* Custom input bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E0F17] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>Or type any landmark worldwide:</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            value={customPlace}
            onChange={(e) => onCustomPlaceChange(e.target.value)}
            placeholder="e.g. Kyoto Fushimi Inari, Grand Canyon, Leaning Tower of Pisa..."
            className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          {customPlace.trim() && (
            <button
              type="button"
              onClick={() => onSelectPlace(customPlace.trim())}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-red-500 hover:opacity-95 shrink-0 transition-all cursor-pointer shadow-sm"
            >
              Select
            </button>
          )}
        </div>
      </div>

      {/* Grid of Cards */}
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isSelected={selectedPlace === dest.name}
              onSelect={onSelectPlace}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900/30 space-y-3">
          <Compass className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Can't find "{searchQuery}"?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You can still generate a full AI travel narration for this destination!
          </p>
          <button
            type="button"
            onClick={() => onSelectPlace(searchQuery)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-red-500 shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate an AI guide for "{searchQuery}"</span>
          </button>
        </div>
      )}
    </div>
  );
}
