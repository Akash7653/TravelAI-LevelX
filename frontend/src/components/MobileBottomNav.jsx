import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Headphones, Clock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Explore", path: "/explore", icon: Compass },
    { label: "Guides", path: "/explore", hash: "#generator", icon: Headphones },
    { label: "History", path: isAuthenticated ? "/history" : "/login", icon: Clock },
    { label: "Profile", path: isAuthenticated ? "/profile" : "/login", icon: User },
  ];

  const isItemActive = (item) => {
    if (item.hash) {
      return location.pathname === "/explore" && location.hash === item.hash;
    }
    if (item.path === "/") {
      return location.pathname === "/" && !location.hash;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-3 mb-2 rounded-2xl backdrop-blur-2xl border transition-colors duration-300 shadow-2xl bg-white/90 border-slate-200/80 shadow-purple-900/10 dark:bg-[#0B0C14]/90 dark:border-white/10 dark:shadow-black/60">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const active = isItemActive(item);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.hash ? `${item.path}${item.hash}` : item.path}
                className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[58px] rounded-xl transition-all duration-200"
              >
                {active && (
                  <motion.div
                    layoutId="mobileNavPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-purple-500/15 dark:bg-purple-500/25 border border-purple-500/30"
                  />
                )}
                
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      active
                        ? "text-purple-600 dark:text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  {active && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </div>

                <span
                  className={`text-[10px] mt-0.5 font-semibold transition-colors duration-200 ${
                    active
                      ? "text-purple-700 dark:text-purple-300 font-bold"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
