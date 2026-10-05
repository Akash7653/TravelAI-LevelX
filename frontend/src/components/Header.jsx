import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ThemeToggle from "./ThemeToggle";
import {
  Plane,
  Headphones,
  Sparkles,
  Globe2,
  Clock,
  User,
  LogOut,
  LogIn
} from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isInsidePage = !isLandingPage;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    navigate("/");
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
    } else {
      if (id === "top" || id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-white/80 border-slate-200/80 dark:bg-[#050505]/85 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo - Hidden on Desktop inside pages where DesktopSideNav is visible */}
          <Link
            to={isAuthenticated ? "/explore" : "/"}
            className={`flex items-center gap-3 group cursor-pointer ${
              isInsidePage && isAuthenticated ? "md:hidden" : ""
            }`}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-red-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/25 ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500 dark:from-purple-400 dark:via-red-400 dark:to-yellow-300 bg-clip-text text-transparent">
                  TravelAI
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Explore the World. Listen to Its Story.
              </p>
            </div>
          </Link>

          {/* Desktop Inside Page Context (Replaces redundant logo on desktop inside pages) */}
          {isInsidePage && isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {location.pathname === "/explore"
                  ? "Explore Landmarks & Studio"
                  : location.pathname === "/history"
                  ? "Saved Travel History"
                  : location.pathname === "/profile"
                  ? "User Profile & Settings"
                  : "TravelAI Studio"}
              </span>
            </div>
          )}

          {/* Desktop Navigation Links (Visible on Landing Page or when Logged Out) */}
          {(isLandingPage || !isAuthenticated) && (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <button
                type="button"
                onClick={() => scrollToSection("top")}
                className="transition-colors flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer font-medium"
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("explore")}
                className="transition-colors flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer font-medium"
              >
                <Globe2 className="w-4 h-4" />
                Explore
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="transition-colors flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer font-medium"
              >
                <Headphones className="w-4 h-4" />
                How It Works
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="transition-colors flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer font-medium"
              >
                About
              </button>
            </nav>
          )}

          {/* Right Controls: Theme Toggle, Profile, and Mobile Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Profile Link */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 p-1 sm:p-1.5 pr-2.5 sm:pr-3 rounded-2xl border transition-all cursor-pointer ${
                    isActive("/profile")
                      ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-white"
                      : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-purple-300"
                  }`}
                >
                  <img
                    src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Traveler"}
                    alt={user?.name || "Avatar"}
                    className="w-7 h-7 rounded-xl object-cover bg-purple-500/20"
                  />
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[100px] truncate">
                    {user?.name?.split(" ")[0] || "Explorer"}
                  </span>
                </Link>

                {/* Mobile Logout Button (Prominently displayed in top nav on inside pages after login) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of account"
                  className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all cursor-pointer text-xs font-bold shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="inline text-[11px]">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-red-500 hover:opacity-95 shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
