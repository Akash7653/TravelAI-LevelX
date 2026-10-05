import React, { useState } from "react";
import { MapPin, Search, Sparkles, Check, Compass, Building2, Globe } from "lucide-react";
import { destinations } from "../data/destinations";

export default function DestinationSelector({
  selectedPlace,
  onSelectPlace,
  customPlace,
  onCustomPlaceChange
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'india' | 'international'
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter((dest) => {
    const matchesFilter = filter === "all" || dest.category === filter;
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (name) => {
    onSelectPlace(name);
  };

  const handleCustomInputChange = (e) => {
    const val = e.target.value;
    onCustomPlaceChange(val);
    if (val.trim()) {
      onSelectPlace(val.trim());
    }
  };

  const isCustomActive = customPlace && selectedPlace === customPlace.trim();

  return (
    <section id="destinations" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            Step 1 of 4
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Choose Your Destination
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Pick a legendary landmark or type in any tourist location worldwide.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({destinations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("india")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filter === "india"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3 h-3" />
            India Heritage
          </button>
          <button
            type="button"
            onClick={() => setFilter("international")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filter === "international"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3 h-3" />
            International
          </button>
        </div>
      </div>

      {/* Custom Destination Input Box */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 focus-within:border-emerald-500/50 transition-all duration-300">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <label htmlFor="custom-destination" className="text-sm font-semibold text-slate-200">
            Or enter your own destination:
          </label>
        </div>
        <div className="relative">
          <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="custom-destination"
            type="text"
            value={customPlace}
            onChange={handleCustomInputChange}
            placeholder="e.g. Kyoto Golden Pavilion, Grand Canyon, Leaning Tower of Pisa..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            maxLength={120}
          />
          {isCustomActive && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Selected
            </span>
          )}
        </div>
      </div>

      {/* Search Filter for Cards */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter popular destinations by name or country..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
        />
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDestinations.map((dest) => {
          const isSelected = selectedPlace === dest.name;
          return (
            <div
              key={dest.id}
              onClick={() => handleCardClick(dest.name)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? "bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 hover:-translate-y-1"
              }`}
            >
              {/* Image banner */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Emoji Badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-base shadow-sm">
                  {dest.emoji}
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Highlight chip */}
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="text-[10px] font-medium text-emerald-400 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-emerald-500/20 line-clamp-1 inline-block">
                    {dest.highlight}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-1.5">
                <div className="flex items-baseline justify-between gap-1">
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    {dest.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{dest.location}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {dest.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No destinations found matching "{searchQuery}". You can enter it in the custom destination box above!
        </div>
      )}
    </section>
  );
}
