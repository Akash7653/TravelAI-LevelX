import React from "react";
import { Languages, Check } from "lucide-react";
import { languages } from "../data/languages";

export default function LanguageSelector({ selectedLanguage, onSelectLanguage }) {
  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <Languages className="w-3.5 h-3.5" />
          Step 2 of 4
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Select Narration Language
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Gemini will craft your narration exclusively in your selected language.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <div
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {lang.name}
                    </h3>
                    <p className="text-emerald-400 font-semibold text-xs">
                      {lang.nativeName}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "border border-slate-700 bg-slate-800/40 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {lang.description}
                </div>
                <div className="mt-2 text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {lang.accent}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
