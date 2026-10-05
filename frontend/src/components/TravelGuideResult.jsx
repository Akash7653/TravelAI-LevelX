import React, { useState } from "react";
import {
  MapPin,
  Languages,
  Clock,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Heart,
  Share2
} from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../config/api";

export default function TravelGuideResult({
  result,
  destination,
  destinationImage,
  language,
  guideType,
  voiceName,
  onRegenerate,
  isLoading
}) {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(result?.favorite || false);
  const { addToast } = useToast();
  const { token, isAuthenticated } = useAuth();

  if (!result || !result.description) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.description);
      setCopied(true);
      addToast("Transcript copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      addToast("Failed to copy transcript.", "error");
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      addToast("Please log in to save guides to your favorites.", "info");
      return;
    }
    const guideId = result?.guide_id || result?._id;
    if (!guideId) return;

    try {
      const res = await fetch(`${ENDPOINTS.HISTORY}/${guideId}/favorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsFavorite(data.data.favorite);
        addToast(
          data.data.favorite ? "Added to your favorites!" : "Removed from favorites.",
          "success"
        );
      }
    } catch (err) {
      addToast("Could not update favorite.", "error");
    }
  };

  return (
    <section className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden bg-slate-900/80 border-indigo-500/30 dark:bg-[#0c0d14]/90 dark:border-indigo-500/30 light:bg-white light:border-slate-200">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Generated Guide Ready
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
              {destination}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-800/80 border-slate-700 text-slate-200 dark:bg-slate-800 dark:text-slate-200 light:bg-slate-100 light:text-slate-700 light:border-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {destination}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-800/80 border-slate-700 text-slate-200 dark:bg-slate-800 dark:text-slate-200 light:bg-slate-100 light:text-slate-700 light:border-slate-300">
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              {language}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-800/80 border-slate-700 text-slate-200 dark:bg-slate-800 dark:text-slate-200 light:bg-slate-100 light:text-slate-700 light:border-slate-300">
              <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
              {guideType}
            </span>

            {/* Favorite button */}
            <button
              type="button"
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-md shadow-rose-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title={isFavorite ? "Favorited" : "Save to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Audio Player Section */}
        {result.audioUrl && (
          <div className="my-6">
            <AudioPlayer audioUrl={result.audioUrl} destination={destination} />
          </div>
        )}

        {/* Story Transcript */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
                Your AI Travel Story
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:text-slate-200 light:bg-slate-100 light:text-slate-800 light:border-slate-300 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Transcript</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onRegenerate}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Generate Again</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border text-sm sm:text-base leading-relaxed tracking-normal whitespace-pre-line shadow-inner bg-slate-950/60 border-slate-800/80 text-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 dark:text-slate-200 light:bg-slate-50 light:border-slate-200 light:text-slate-800">
            {result.description}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>AI Narration powered by Google Gemini 2.0 / 3.0</span>
          <span>Audio Voice synthesized via Murf AI Falcon-2 Engine</span>
        </div>
      </div>
    </section>
  );
}
