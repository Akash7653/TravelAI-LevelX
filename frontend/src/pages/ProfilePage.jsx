import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../config/api";
import { ProfileSkeleton } from "../components/Skeletons";
import {
  User,
  Mail,
  Calendar,
  Headphones,
  Compass,
  Heart,
  Globe2,
  Clock,
  Sparkles
} from "lucide-react";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(ENDPOINTS.STATS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(data.data.stats);
        }
      } catch (err) {
        console.warn("Could not load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      loadStats();
    }
  }, [token]);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      })
    : "2026";

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Profile Card Header */}
      <div className="rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden backdrop-blur-xl border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0E0F17]/90">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-tr from-purple-500/15 via-red-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Traveler"}
              alt={user?.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-purple-500/40 shadow-xl bg-slate-100 dark:bg-slate-950 p-1"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-red-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                {user?.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Member since {memberSince}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
              Active Traveler • AI Audio Exploration Account
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS STAT CARDS */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Your Travel Statistics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-2 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">
              {stats?.total_guides || 0}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Guides Generated
            </span>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-2 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-red-500 block">
              {stats?.minutes_listened || 0} min
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Minutes Listened
            </span>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-2 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-amber-500 block">
              {stats?.favorites || 0}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Favorite Places
            </span>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0F17] space-y-2 shadow-sm hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block truncate" title={stats?.favorite_destination}>
              {stats?.favorite_destination || "None"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Top Destination
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
