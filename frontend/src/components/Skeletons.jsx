import React from "react";
import { Plane, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Shimmer Destination Card Skeleton
 */
export function DestinationCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] shadow-sm">
      <div className="h-44 w-full skeleton-shimmer" />
      <div className="p-4 space-y-2.5">
        <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full rounded-md skeleton-shimmer" />
          <div className="h-3 w-4/5 rounded-md skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Destination Skeletons
 */
export function DestinationSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DestinationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Shimmer History Item Skeleton
 */
export function HistorySkeletonItem() {
  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 rounded-2xl skeleton-shimmer shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 rounded-lg skeleton-shimmer" />
          <div className="h-3 w-28 rounded-md skeleton-shimmer" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
        <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}

export function HistorySkeletonList({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <HistorySkeletonItem key={i} />
      ))}
    </div>
  );
}

/**
 * Shimmer Profile Skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl skeleton-shimmer shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-64 rounded-md skeleton-shimmer" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-2 text-center">
            <div className="h-7 w-12 mx-auto rounded-lg skeleton-shimmer" />
            <div className="h-3 w-20 mx-auto rounded-md skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Global Initial App Loader
 */
export function InitialAppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="relative flex flex-col items-center text-center p-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-red-500 to-amber-400 flex items-center justify-center shadow-xl shadow-purple-500/25 ring-2 ring-white/20 animate-bounce">
          <Plane className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-black mt-6 tracking-tight bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500 dark:from-purple-400 dark:via-red-400 dark:to-yellow-300 bg-clip-text text-transparent">
          TravelAI
        </h2>

        <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin" />
          <span>Loading your journey...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Global Blocking Loading Overlay
 */
export function GlobalLoadingOverlay({ message = "Creating your guide..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="p-8 rounded-3xl border border-white/20 bg-white/95 dark:bg-[#0E0F17]/95 shadow-2xl text-center max-w-sm mx-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 animate-spin">
          <Plane className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
          ✨ TravelAI
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {message}
        </p>
      </div>
    </div>
  );
}
