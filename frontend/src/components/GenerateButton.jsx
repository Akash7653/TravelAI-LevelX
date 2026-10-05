import React from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function GenerateButton({ onClick, isLoading, disabled }) {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading || disabled}
        className={`relative group px-8 sm:px-12 py-4 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl ${
          isLoading || disabled
            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700/50 shadow-none"
            : "bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 text-white hover:opacity-95 shadow-purple-500/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/30"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span className="text-white">Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-yellow-300 transition-transform group-hover:rotate-12" />
            <span>Generate My Travel Guide</span>
            <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 text-center font-medium">
        Powered by Google Gemini AI & Murf Studio Falcon-2
      </p>
    </div>
  );
}
