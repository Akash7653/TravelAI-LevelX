import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import ThemeToggle from "./ThemeToggle";
import {
  Plane,
  Compass,
  Headphones,
  Clock,
  User,
  LogOut,
  Home,
  Sparkles,
  Layers,
  Database,
  Volume2
} from "lucide-react";

export default function DesktopSideNav() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    navigate("/");
  };

  const navItems = [
    {
      label: "Explore Landmarks",
      path: "/explore",
      icon: Compass,
      exact: true,
    },
    {
      label: "AI Guide Studio",
      path: "/explore",
      hash: "#generator",
      icon: Headphones,
    },
    {
      label: "Travel History",
      path: "/history",
      icon: Clock,
    },
    {
      label: "Profile & Stats",
      path: "/profile",
      icon: User,
    },
  ];

  const isItemActive = (item) => {
    if (item.hash) {
      return location.pathname === "/explore" && location.hash === item.hash;
    }
    if (item.exact) {
      return location.pathname === item.path && !location.hash;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 z-40 border-r transition-colors duration-300 bg-white/95 dark:bg-[#0A0B12]/95 border-slate-200/90 dark:border-white/10 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Link to="/explore" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-red-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500 dark:from-purple-400 dark:via-red-400 dark:to-yellow-300 bg-clip-text text-transparent">
              TravelAI
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Studio Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* User Quick Info */}
      <div className="p-4 mx-3 my-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#12131D] flex items-center gap-3">
        <img
          src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Traveler"}
          alt={user?.name}
          className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 p-0.5 bg-white dark:bg-slate-900"
        />
        <div className="overflow-hidden flex-1">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {user?.name || "Explorer"}
          </h4>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
          Navigation
        </span>
        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.hash ? `${item.path}${item.hash}` : item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-purple-600 to-red-500 text-white shadow-md shadow-purple-500/20 translate-x-1"
                  : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400 group-hover:text-purple-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


      {/* Bottom Controls: Theme Toggle & Logout */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
        <ThemeToggle />

        <button
          type="button"
          onClick={handleLogout}
          title="Sign out of account"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 hover:border-red-400/50 hover:bg-red-500/5 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
