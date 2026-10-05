import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Mic, Compass, Waves, CheckCircle2, Music } from "lucide-react";
import AudioWaveform from "./AudioWaveform";

export default function LoadingState({ destination, language, voiceId }) {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { text: "Preparing your destination...", icon: Compass, color: "from-purple-600 to-indigo-600" },
    { text: "Gemini is writing your travel story...", icon: Brain, color: "from-indigo-600 to-purple-600" },
    { text: "Creating your AI narration...", icon: Sparkles, color: "from-purple-600 to-red-500" },
    { text: "Murf AI is generating your voice...", icon: Mic, color: "from-red-500 to-amber-500" },
    { text: "Finalizing your travel experience...", icon: Waves, color: "from-amber-500 to-emerald-500" },
    { text: "Your guide is ready ✨", icon: CheckCircle2, color: "from-emerald-500 to-purple-600" }
  ];

  useEffect(() => {
    const intervals = [
      setTimeout(() => setCurrentStage(1), 1600),
      setTimeout(() => setCurrentStage(2), 3800),
      setTimeout(() => setCurrentStage(3), 6800),
      setTimeout(() => setCurrentStage(4), 10500),
      setTimeout(() => setCurrentStage(5), 14000),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  const active = stages[currentStage] || stages[stages.length - 1];
  const Icon = active.icon;

  return (
    <div className="rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto border shadow-2xl relative overflow-hidden bg-white/95 dark:bg-[#0E0F17]/95 border-purple-500/25 dark:border-white/10">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Pulsing Icon */}
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-red-500/20 animate-pulse" />
        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-tr ${active.color} flex items-center justify-center shadow-xl text-white transition-all duration-500`}>
          <Icon className="w-8 h-8 animate-bounce" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white transition-all duration-300">
        {active.text}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">
        Crafting an immersive audio travel journey for{" "}
        <span className="text-purple-600 dark:text-purple-400 font-semibold">{destination}</span> in{" "}
        <span className="text-red-500 dark:text-red-400 font-semibold">{language}</span>.
      </p>

      {/* Active Waveform Graphic */}
      <div className="my-6 flex items-center justify-center">
        <div className="px-5 py-2.5 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20 flex items-center gap-3">
          <Music className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          <AudioWaveform isPlaying={true} barCount={16} />
        </div>
      </div>

      {/* 6 Stage Progress Indicators */}
      <div className="grid grid-cols-6 gap-2 mt-6 max-w-xs mx-auto">
        {stages.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx <= currentStage
                ? "bg-gradient-to-r from-purple-600 via-red-500 to-amber-400 shadow-sm"
                : "bg-slate-200 dark:bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin" />
        <span>Gemini AI Narration • Murf Falcon-2 Voice</span>
      </div>
    </div>
  );
}
