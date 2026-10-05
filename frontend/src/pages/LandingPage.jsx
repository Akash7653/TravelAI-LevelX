import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import DestinationCard from "../components/DestinationCard";
import { destinations } from "../data/destinations";
import {
  Compass,
  Headphones,
  Sparkles,
  ShieldCheck,
  Globe2,
  ArrowRight,
  Radio,
  Layers,
  Cpu,
  Volume2,
  Languages,
  CheckCircle2,
  Zap,
  MapPin,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const location = useLocation();
  const featuredDestinations = destinations.slice(0, 8);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  const supportedLanguages = [
    { name: "English", locale: "en-US", voice: "Alicia & Matthew", sample: "Welcome to the legendary Taj Mahal..." },
    { name: "Hindi (हिंदी)", locale: "hi-IN", voice: "Namrita & Aman", sample: "ताज महल के इस ऐतिहासिक सफर में आपका स्वागत है..." },
    { name: "Tamil (தமிழ்)", locale: "ta-IN", voice: "Iniya & Murali", sample: "வரலாற்று சிறப்புமிக்க இந்த பயணத்திற்கு உங்களை வரவேற்கிறோம்..." },
    { name: "Telugu (తెలుగు)", locale: "te-IN", voice: "Josie & Zion", sample: "చారిత్రక కట్టడాల అద్భుతమైన ప్రయాణానికి స్వాగతం..." },
  ];

  const valueProps = [
    {
      title: "AI-Powered Intelligence",
      description: "Powered by Google Gemini for accurate, culturally rich spoken-word history tailored for audio narration.",
      icon: Cpu,
      gradient: "from-purple-600 to-indigo-600",
    },
    {
      title: "Multilingual Narration",
      description: "Fluent storytelling in English, Hindi, Tamil, and Telugu with native regional voice timbre and accents.",
      icon: Languages,
      gradient: "from-red-500 to-amber-500",
    },
    {
      title: "Audio-First Architecture",
      description: "Low-latency streaming Falcon-2 neural TTS from Murf AI delivering authentic emotion without robotic tone.",
      icon: Volume2,
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "Personalized & Persistent",
      description: "Choose Quick (~1m) or Detailed (~3m) modes. Auto-saved to your personal MongoDB Atlas travel dashboard.",
      icon: Sparkles,
      gradient: "from-purple-600 to-red-500",
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Popular Destinations Showcase */}
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Handpicked Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular World Landmarks
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select any iconic monument to hear an instant AI-powered audio guide.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 self-start sm:self-auto group"
          >
            <span>View All 25+ Landmarks</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isSelected={false}
              onSelect={() => {}}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 shadow-xl shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all text-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Open Interactive Guide Studio</span>
          </Link>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Architecture & Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            How TravelAI Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Orchestrating state-of-the-art LLM reasoning with neural audio synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-3 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
              01
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Choose Destination</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pick a world wonder or enter any custom landmark, town, or sacred shrine worldwide.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-3 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center font-black">
              02
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Creates Story</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Google Gemini generates natural, spoken tour narration in English, Hindi, Telugu, or Tamil without robotic markdown.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-3 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
              03
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Murf Creates Voice</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Murf AI transforms the narrative into lifelike human audio using ultra-low latency Falcon streaming models.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-3 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black">
              04
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Listen & Explore</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Play directly in browser with animated waveform, download MP3, copy transcript, and save to your MongoDB history.
            </p>
          </div>
        </div>
      </section>

      {/* 4. MULTILINGUAL SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
            Regional Fluency
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Listen in 4 Global Languages
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Native voice talent mapped to verified Murf neural models for authentic regional expression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedLanguages.map((lang) => (
            <div
              key={lang.name}
              className="p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-3 shadow-sm hover:border-purple-400/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {lang.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold">
                  {lang.locale}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 line-clamp-2">
                "{lang.sample}"
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Voices: {lang.voice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY TRAVELAI: VALUE PROPOSITIONS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
            Key Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Why Choose TravelAI?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered as a modern SaaS audio experience, not a basic prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-3 shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. USER STATISTICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-purple-500/5 via-red-500/5 to-amber-500/5 dark:from-purple-950/20 dark:via-red-950/20 dark:to-amber-950/20 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
              25+
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
              Curated Landmarks
            </span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-black text-red-500 dark:text-red-400">
              4
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
              Languages Supported
            </span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-black text-amber-500 dark:text-amber-400">
              100%
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
              Real Murf TTS Audio
            </span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-black text-emerald-500 dark:text-emerald-400">
              0.00s
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
              Audio Storage Latency
            </span>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 border border-purple-500/30 bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md uppercase tracking-wider inline-block">
              Start Exploring Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready for your next journey?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Create an account or start right away without registration.
              Explore ancient wonders, sacred temples, and modern marvels narrated in human voice.
            </p>
          </div>

          <Link
            to="/explore"
            className="px-8 py-4 rounded-2xl font-bold text-sm text-purple-900 bg-white hover:bg-slate-50 shadow-2xl hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            Create Your AI Travel Guide
          </Link>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 pt-12 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-red-500 flex items-center justify-center text-white font-bold text-xs">
              T
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">TravelAI</span>
            <span>— Explore the World. Listen to Its Story.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/explore" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Explore</Link>
            <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Workflow</a>
            <Link to="/history" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">History</Link>
            <Link to="/profile" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Profile</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© 2026 TravelAI Platform. Powered by Google Gemini & Murf AI.</p>
          <p className="font-mono text-purple-600 dark:text-purple-400">Backend Port 5002 • MongoDB Atlas Connected</p>
        </div>
      </footer>
    </div>
  );
}
