import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative p-2.5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group
        bg-white/80 border-slate-200 text-slate-700 hover:text-purple-600 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10
        dark:bg-[#12131D]/80 dark:border-white/10 dark:text-slate-300 dark:hover:text-amber-400 dark:hover:border-amber-400/30 dark:hover:shadow-amber-500/10
        ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center text-amber-400"
          >
            <Moon className="w-4 h-4 fill-amber-400/20" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center text-purple-600"
          >
            <Sun className="w-4 h-4 fill-purple-500/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
