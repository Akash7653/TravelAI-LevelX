import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Header from "./components/Header";
import DesktopSideNav from "./components/DesktopSideNav";
import MobileBottomNav from "./components/MobileBottomNav";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import GuideDetailPage from "./pages/GuideDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { InitialAppLoader } from "./components/Skeletons";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Show desktop side nav on inside pages when logged in
  const isLandingPage = location.pathname === "/";
  const showDesktopSideNav = isAuthenticated && !isLandingPage;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 text-slate-900 dark:text-slate-100">
      <ScrollToTop />

      {/* Desktop Side Nav for Authenticated Users on Inside Pages */}
      {showDesktopSideNav && <DesktopSideNav />}

      {/* Wrapper adjusting for desktop side nav width when active */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showDesktopSideNav ? "md:pl-64" : ""}`}>
        {/* Global Navigation Header */}
        <Header />

        {/* Main Content View with Safe Area Padding for Mobile Bottom Nav */}
        <main className="flex-1 pb-safe">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guide/:id"
              element={
                <ProtectedRoute>
                  <GuideDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {!appReady && <InitialAppLoader />}
          <Router>
            <MainLayout />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
