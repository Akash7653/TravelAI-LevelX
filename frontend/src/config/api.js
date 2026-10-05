/**
 * Central API configuration for TravelAI.
 * Uses VITE_API_BASE_URL if defined, defaulting to http://127.0.0.1:5002.
 */
const defaultBaseUrl = import.meta.env.PROD
  ? "https://travelai-backend-sjkg.onrender.com"
  : "http://127.0.0.1:5002";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  VOICES: `${API_BASE_URL}/api/voices`,
  GENERATE: `${API_BASE_URL}/api/generate-audio-guide`,
  HISTORY: `${API_BASE_URL}/api/history`,
  STATS: `${API_BASE_URL}/api/stats`,
};
