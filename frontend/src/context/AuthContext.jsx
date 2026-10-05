import React, { createContext, useContext, useState, useEffect } from "react";
import { ENDPOINTS } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("travelai_token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(ENDPOINTS.AUTH_ME, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.user) {
          setUser(data.data.user);
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.warn("Auth check error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || "Invalid email or password.");
    }
    const authToken = data.data.token;
    const authUser = data.data.user;
    localStorage.setItem("travelai_token", authToken);
    setToken(authToken);
    setUser(authUser);
    return authUser;
  };

  const register = async (name, email, password) => {
    const res = await fetch(ENDPOINTS.AUTH_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || "Registration failed.");
    }
    const authToken = data.data.token;
    const authUser = data.data.user;
    localStorage.setItem("travelai_token", authToken);
    setToken(authToken);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem("travelai_token");
    setToken(null);
    setUser(null);
    try {
      fetch(ENDPOINTS.AUTH_LOGOUT, { method: "POST" });
    } catch (_) {}
  };

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        authHeaders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
