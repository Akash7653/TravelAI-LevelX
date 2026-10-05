import React from "react";
import { Link } from "react-router-dom";
import { Headphones, Sparkles, Compass, ArrowRight, Play, MapPin, Star, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import ThreeGlobeScene from "./ThreeGlobeScene";
import AudioWaveform from "./AudioWaveform";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative pt-4 sm:pt-10 pb-12 sm:pb-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Controlled RGB Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/15 via-red-500/10 to-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Grid: Same Row on All Screens (Mobile, Tablet, Desktop) */}
      <div className="grid grid-cols-12 gap-2 sm:gap-6 lg:gap-8 items-center">
        {/* Left Column: Headline & Pitch */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="col-span-7 sm:col-span-6 lg:col-span-6 text-left z-10 space-y-3 sm:space-y-4"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 animate-pulse" />
            <span className="truncate">AI Multimodal Audio Guide</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </motion.div>

          {/* Staggered Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]"
          >
            Explore the World. <br />
            <span className="bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500 dark:from-purple-400 dark:via-red-400 dark:to-yellow-300 bg-clip-text text-transparent">
              Listen to Its Story.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal"
          >
            Turn any destination into an immersive AI audio travel journey.
            Researched with <span className="font-semibold text-purple-600 dark:text-purple-400">Gemini</span> and narrated in human emotion by <span className="font-semibold text-red-500 dark:text-red-400">Murf AI</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 hover:opacity-95 shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm md:text-base group"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform duration-300" />
              <span>Start Exploring</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 transition-all text-xs sm:text-sm hover:scale-105"
            >
              <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>How It Works</span>
            </a>
          </motion.div>

          {/* Feature Highlights Pills */}
          <motion.div variants={itemVariants} className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-5 pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>4 Languages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>25+ Landmarks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Murf Falcon-2</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Layered 3D Scene in the SAME ROW on ALL screens */}
        <div className="col-span-5 sm:col-span-6 lg:col-span-6 relative w-full h-[240px] sm:h-[380px] lg:h-[520px] flex items-center justify-center">
          {/* Central 3D Globe with Pins and Orbitals */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <ThreeGlobeScene className="w-full h-full" />
          </div>

          {/* Floating Destination Card (Desktop / Tablet) */}
          <div className="hidden md:flex absolute top-4 left-2 lg:top-8 lg:left-4 z-20 pointer-events-none animate-float-slow">
            <div className="glass-card p-2.5 lg:p-3 rounded-2xl flex items-center gap-2.5 border shadow-xl max-w-[180px] lg:max-w-[210px]">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=160&q=80"
                alt="Taj Mahal"
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-purple-500/30"
              />
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                  Taj Mahal
                </span>
                <span className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                  <MapPin className="w-2.5 h-2.5 text-red-500" />
                  Agra, India
                </span>
              </div>
            </div>
          </div>

          {/* Floating Audio Waveform Badge (Tablet / Desktop) */}
          <div className="hidden sm:flex absolute bottom-3 right-2 lg:bottom-6 lg:right-4 z-20 pointer-events-none animate-float-reverse">
            <div className="glass-card p-2.5 rounded-2xl flex items-center gap-2 border shadow-xl">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-red-500 flex items-center justify-center text-white shadow-md">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <div className="pr-1">
                <span className="block text-[10px] font-bold text-slate-900 dark:text-white">
                  Murf Studio
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  Falcon-2
                </span>
              </div>
              <AudioWaveform isPlaying={true} barCount={8} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
