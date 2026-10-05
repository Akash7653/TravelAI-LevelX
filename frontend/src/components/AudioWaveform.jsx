import React from "react";

export default function AudioWaveform({ isPlaying, barCount = 28 }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center gap-[3px] h-8 px-2 overflow-hidden">
      {bars.map((i) => {
        // Pseudo-random varying heights for realistic waveform effect
        const randomHeight = 20 + ((i * 17 + 7) % 80);
        const animationDelay = `${(i * 0.08) % 1.2}s`;
        const animationDuration = `${0.6 + ((i * 0.1) % 0.8)}s`;

        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-gradient-to-t from-cyan-400 via-indigo-400 to-fuchsia-400 animate-pulse"
                : "bg-slate-700/60 dark:bg-slate-700 light:bg-slate-300"
            }`}
            style={{
              height: isPlaying ? `${randomHeight}%` : "18%",
              animationDelay: isPlaying ? animationDelay : "0s",
              animationDuration: isPlaying ? animationDuration : "0s"
            }}
          />
        );
      })}
    </div>
  );
}
