import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ENDPOINTS } from "../config/api";
import AudioPlayer from "../components/AudioPlayer";
import { HistorySkeletonList } from "../components/Skeletons";
import {
  Clock,
  Search,
  Trash2,
  Heart,
  Play,
  Languages,
  Calendar,
  Compass,
  Sparkles,
  X,
  ArrowRight
} from "lucide-react";

export default function HistoryPage() {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const url = new URL(ENDPOINTS.HISTORY);
      if (languageFilter !== "All") {
        url.searchParams.set("language", languageFilter);
      }
      if (searchQuery.trim()) {
        url.searchParams.set("search", searchQuery.trim());
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory(data.data.history || []);
      }
    } catch (err) {
      console.warn("Could not fetch history:", err);
      addToast("Failed to load history.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [languageFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (guideId, place) => {
    if (!window.confirm(`Delete audio guide for ${place}?`)) return;

    try {
      const res = await fetch(`${ENDPOINTS.HISTORY}/${guideId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory((prev) => prev.filter((item) => item._id !== guideId));
        if (activeGuide?._id === guideId) {
          setActiveGuide(null);
        }
        addToast(`Deleted guide for ${place}.`, "info");
      }
    } catch (err) {
      addToast("Failed to delete guide.", "error");
    }
  };

  const handleToggleFavorite = async (guideId) => {
    try {
      const res = await fetch(`${ENDPOINTS.HISTORY}/${guideId}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const isFav = data.data.favorite;
        setHistory((prev) =>
          prev.map((item) => (item._id === guideId ? { ...item, favorite: isFav } : item))
        );
        addToast(isFav ? "Saved to favorites!" : "Removed from favorites.", "success");
      }
    } catch (err) {
      addToast("Could not update favorite.", "error");
    }
  };

  const displayedHistory = onlyFavorites
    ? history.filter((item) => item.favorite)
    : history;

  const createAudioUrlFromBase64 = (base64Audio, mimeType = "audio/mpeg") => {
    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: mimeType });
      return URL.createObjectURL(audioBlob);
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 mb-2">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>Saved Audio Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            My Travel History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Revisit, replay, and manage your AI-generated travel audio guides.
          </p>
        </div>

        {/* Favorites only filter toggle */}
        <button
          type="button"
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            onlyFavorites
              ? "bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-400 shadow-sm"
              : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-purple-600"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-red-500 text-red-500" : ""}`} />
          <span>{onlyFavorites ? "Showing Favorites Only" : "Show Favorites Only"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0E0F17]/90 shadow-sm">
        {/* Languages tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["All", "English", "Hindi", "Tamil", "Telugu"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguageFilter(lang)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                languageFilter === lang
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved destinations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </form>
      </div>

      {/* Active Audio Player if selected */}
      {activeGuide && (
        <div className="p-6 rounded-3xl border border-purple-500/30 bg-white/95 dark:bg-[#0E0F17]/95 shadow-2xl relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              Now Playing: {activeGuide.place}
            </span>
            <button
              type="button"
              onClick={() => setActiveGuide(null)}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <AudioPlayer
            audioUrl={createAudioUrlFromBase64(activeGuide.audio_data)}
            destination={activeGuide.place}
          />
        </div>
      )}

      {/* History Grid with Shimmer Loading */}
      {loading ? (
        <HistorySkeletonList count={4} />
      ) : displayedHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedHistory.map((item) => {
            const hasAudio = !!item.audio_data;
            const dateStr = item.created_at
              ? new Date(item.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              : "Recent";

            return (
              <div
                key={item._id}
                className="rounded-3xl p-5 border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0F17] hover:border-purple-400/50"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {item.place}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">{item.language}</span>
                        <span>•</span>
                        <span>{item.answer_type || "Summary"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(item._id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        item.favorite
                          ? "bg-red-500/15 border-red-500/30 text-red-500"
                          : "border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.favorite ? "fill-red-500" : ""}`} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasAudio && (
                      <button
                        type="button"
                        onClick={() => setActiveGuide(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-red-500 shadow-sm hover:scale-105 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Listen</span>
                      </button>
                    )}
                    <Link
                      to={`/guide/${item._id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      Read Full
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id, item.place)}
                    title="Delete from history"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white/50 dark:bg-slate-900/30 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              No travel stories yet.
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Your next adventure starts here.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 shadow-md shadow-purple-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <span>Create Your First Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
