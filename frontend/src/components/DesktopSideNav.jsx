import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Plane,
  Compass,
  Headphones,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export default function DesktopSideNav({ collapsed = false, onToggleCollapse }) {
  const { user } = useAuth();
  const location = useLocation();

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
    <aside
      className={`hidden md:flex flex-col h-screen fixed top-0 left-0 z-40 border-r transition-all duration-300 ease-in-out bg-white/95 dark:bg-[#0A0B12]/95 border-slate-200/90 dark:border-white/10 backdrop-blur-xl ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className={`border-b border-slate-200/80 dark:border-white/10 flex items-center transition-all duration-300 ${
        collapsed ? "p-4 justify-center" : "p-5 justify-between"
      }`}>
        <Link
          to="/explore"
          className="flex items-center gap-3 group"
          title="TravelAI Studio"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-red-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-red-500 to-yellow-500 dark:from-purple-400 dark:via-red-400 dark:to-yellow-300 bg-clip-text text-transparent">
                TravelAI
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Studio Workspace
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* User Quick Info */}
      <div className={`mx-3 my-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#12131D] flex items-center transition-all duration-300 ${
        collapsed ? "p-2 justify-center" : "p-3.5 gap-3"
      }`}>
        <div className="relative flex-shrink-0">
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Traveler"}
            alt={user?.name}
            className="w-9 h-9 rounded-xl object-cover border border-purple-500/30 p-0.5 bg-white dark:bg-slate-900"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#12131D] animate-pulse" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {user?.name || "Explorer"}
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              Active Session
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            Navigation
          </span>
        )}
        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.hash ? `${item.path}${item.hash}` : item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-xl text-xs font-bold transition-all duration-200 ${
                collapsed
                  ? "justify-center p-3"
                  : "gap-3 px-3.5 py-2.5"
              } ${
                active
                  ? "bg-gradient-to-r from-purple-600 to-red-500 text-white shadow-md shadow-purple-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-purple-500"}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidenav Collapser Control at Bottom */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-center">
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all cursor-pointer ${
            collapsed ? "w-10 h-10 p-0" : "w-full px-3"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
