import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ENDPOINTS } from "../config/api";
import AudioPlayer from "../components/AudioPlayer";
import {
  Compass,
  ArrowLeft,
  MapPin,
  Languages,
  Clock,
  Copy,
  Check,
  Heart,
  Loader2,
  BookOpen
} from "lucide-react";

export default function GuideDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await fetch(`${ENDPOINTS.HISTORY}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setGuide(data.data.guide);
          setIsFavorite(data.data.guide.favorite || false);
        } else {
          addToast("Travel guide not found.", "error");
          navigate("/history");
        }
      } catch (err) {
        addToast("Failed to load guide details.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadGuide();
  }, [id, token]);

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

  const handleCopy = async () => {
    if (!guide?.description) return;
    try {
      await navigator.clipboard.writeText(guide.description);
      setCopied(true);
      addToast("Transcript copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      addToast("Copy failed.", "error");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await fetch(`${ENDPOINTS.HISTORY}/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsFavorite(data.data.favorite);
        addToast(data.data.favorite ? "Added to favorites!" : "Removed from favorites.", "success");
      }
    } catch (_) {
      addToast("Favorite update failed.", "error");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading guide...</p>
      </div>
    );
  }

  if (!guide) return null;

  const audioUrl = guide.audio_data ? createAudioUrlFromBase64(guide.audio_data) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <Link
        to="/history"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to History</span>
      </Link>

      <div className="rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden backdrop-blur-xl border-indigo-500/30 bg-slate-900/80 dark:bg-[#0c0d14]/90 dark:border-indigo-500/30 light:bg-white light:border-slate-200 space-y-6">
        {/* Title and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900">
              {guide.place}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
                <Languages className="w-3.5 h-3.5" />
                {guide.language}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Clock className="w-3.5 h-3.5" />
                {guide.answer_type || "Summary"} Guide
              </span>
              <span>•</span>
              <span>Voice: {guide.voice || "Murf Falcon"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isFavorite
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-md shadow-rose-500/10"
                : "border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
          </button>
        </div>

        {/* Audio player */}
        {audioUrl && (
          <div className="my-6">
            <AudioPlayer audioUrl={audioUrl} destination={guide.place} />
          </div>
        )}

        {/* Transcript */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                Audio Tour Transcript
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
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
          </div>

          <div className="p-6 rounded-2xl border text-sm sm:text-base leading-relaxed tracking-normal whitespace-pre-line shadow-inner bg-slate-950/60 border-slate-800/80 text-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 dark:text-slate-200 light:bg-slate-50 light:border-slate-200 light:text-slate-800">
            {guide.description}
          </div>
        </div>
      </div>
    </div>
  );
}
