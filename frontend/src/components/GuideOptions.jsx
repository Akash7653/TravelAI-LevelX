import React from "react";
import { Clock, BookOpen, Sparkles, Check, Flame } from "lucide-react";

export default function GuideOptions({ selectedType, onSelectType }) {
  const options = [
    {
      id: "Summary",
      title: "Quick Guide",
      duration: "~1 min audio",
      wordCount: "150 – 200 words",
      badge: "Popular",
      badgeIcon: Flame,
      summary: "Crisp, fast-paced overview highlighting the top essentials.",
      topics: [
        "Historical significance & origin",
        "Why the destination is famous",
        "Key architectural & cultural highlights",
        "Fun & surprising trivia facts"
      ]
    },
    {
      id: "Detailed",
      title: "Detailed Guide",
      duration: "~3 min audio",
      wordCount: "350 – 450 words",
      badge: "In-Depth",
      badgeIcon: BookOpen,
      summary: "Comprehensive, deep-dive walking-tour narration.",
      topics: [
        "In-depth historical background & timeline",
        "Architectural analysis & construction lore",
        "Cultural traditions & notable milestones",
        "Curated visitor insights & secrets"
      ]
    }
  ];

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <Clock className="w-3.5 h-3.5" />
          Step 3 of 4
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Choose Guide Depth & Duration
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Whether you want a rapid audio snapshot or a rich, immersive walking documentary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = selectedType === opt.id;
          const BadgeIcon = opt.badgeIcon;
          return (
            <div
              key={opt.id}
              onClick={() => onSelectType(opt.id)}
              className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <BadgeIcon className="w-3 h-3" />
                      {opt.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {opt.duration}
                    </span>
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

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-white">
                      {opt.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400">
                      {opt.wordCount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {opt.summary}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  What's included:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {opt.topics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
