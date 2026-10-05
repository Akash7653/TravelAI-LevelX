import React, { useState, useRef } from "react";
import { MapPin, Check, Sparkles } from "lucide-react";

export default function DestinationCard({ destination, isSelected, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const fallbackImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

  const handleMouseMove = (e) => {
    // Only perform 3D tilt on devices with hover / mouse
    if (window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max ~5 degrees
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(destination.name, destination.image)}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.15s ease-out, box-shadow 0.25s ease, border-color 0.25s ease",
      }}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between border ${
        isSelected
          ? "border-purple-600 dark:border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/20 scale-[1.02] bg-purple-50/50 dark:bg-purple-950/20"
          : "border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0F17] hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10 shadow-sm"
      }`}
    >
      <div>
        {/* Landmark Image */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={imgError ? fallbackImage : destination.image}
            alt={destination.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Emoji Badge */}
          <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-sm shadow-sm">
            {destination.emoji || "📍"}
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-300/40 dark:border-purple-500/30 shadow-sm">
              {destination.category}
            </span>
          </div>

          {/* Selection Check Badge */}
          {isSelected && (
            <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-red-500 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          {/* Highlight pill */}
          {destination.highlight && (
            <div className="absolute bottom-2.5 left-3">
              <span className="text-[10px] font-medium text-slate-100 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10 line-clamp-1 inline-block">
                {destination.highlight}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{destination.city}, {destination.country}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
            {destination.shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
