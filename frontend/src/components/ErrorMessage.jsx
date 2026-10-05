import React from "react";
import { AlertTriangle, RefreshCw, X, KeyRound } from "lucide-react";

export default function ErrorMessage({ message, onRetry, onDismiss }) {
  if (!message) return null;

  const isConfigError = message.toLowerCase().includes("configuration") || message.toLowerCase().includes("key");

  return (
    <div className="max-w-2xl mx-auto my-4 p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 shadow-xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
            {isConfigError ? <KeyRound className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-white text-base">
              {isConfigError ? "API Configuration Required" : "Generation Issue"}
            </h4>
            <p className="text-sm text-rose-300/90 mt-1 leading-relaxed">
              {message}
            </p>
            {isConfigError && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs text-slate-300 font-mono">
                <p className="text-emerald-400 font-semibold mb-1 font-sans">How to configure:</p>
                1. Open <span className="text-amber-300">backend/.env</span><br/>
                2. Set <span className="text-emerald-300">GEMINI_API_KEY</span> and <span className="text-emerald-300">MURF_API_KEY</span><br/>
                3. Restart the backend server.
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-rose-400 hover:text-white p-1 rounded-lg hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onRetry && (
        <div className="mt-4 pt-3 border-t border-rose-500/20 flex justify-end">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-white border border-rose-500/40 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
