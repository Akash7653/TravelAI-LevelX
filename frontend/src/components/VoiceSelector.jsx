import React from "react";
import { Mic, Check } from "lucide-react";
import { PRODUCT_VOICES } from "../data/voices";

export default function VoiceSelector({
  selectedVoiceId,
  onSelectVoice,
  selectedLanguage,
  selectedGender,
  onSelectGender
}) {
  const currentLangVoices = PRODUCT_VOICES[selectedLanguage] || PRODUCT_VOICES.English;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 mb-2">
            <Mic className="w-3.5 h-3.5 text-red-500" />
            Step 4 of 4
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Choose AI Voice & Gender
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Studio-grade Murf Falcon neural voice actors optimized for {selectedLanguage}.
          </p>
        </div>

        {/* Gender Toggle Pill */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSelectGender("Female")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedGender === "Female"
                ? "bg-gradient-to-r from-purple-600 to-red-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white"
            }`}
          >
            Female Narrator
          </button>
          <button
            type="button"
            onClick={() => onSelectGender("Male")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedGender === "Male"
                ? "bg-gradient-to-r from-purple-600 to-red-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white"
            }`}
          >
            Male Narrator
          </button>
        </div>
      </div>

      {/* Voice cards for chosen language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {["Female", "Male"].map((gender) => {
          const v = currentLangVoices[gender];
          if (!v) return null;
          const isSelected = selectedGender === gender;

          return (
            <div
              key={gender}
              onClick={() => {
                onSelectGender(gender);
                onSelectVoice(v.id, selectedLanguage);
              }}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between ${
                isSelected
                  ? "border-purple-600 ring-2 ring-purple-500/40 bg-purple-50/70 dark:bg-purple-950/20 shadow-md scale-[1.01]"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E0F17] hover:border-purple-300 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl shadow-inner">
                  {v.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {v.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300">
                      {v.gender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {v.description}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">
                    Murf Falcon • {selectedLanguage}
                  </span>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-gradient-to-tr from-purple-600 to-red-500 text-white shadow-sm"
                    : "border border-slate-300 dark:border-slate-700 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
