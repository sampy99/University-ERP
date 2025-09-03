// src/api/API.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://your-backend-service.railway.app";
// "http://localhost:8080"

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Load JWT from localStorage and attach to axios
export function loadAuth() {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

// Save JWT
export function setAuth(token) {
  if (!token) return;
  const t = token.trim();
  localStorage.setItem("authToken", t);
  api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
}

// Clear JWT
export function clearAuth() {
  localStorage.removeItem("authToken");
  delete api.defaults.headers.common["Authorization"];
}

// Ensure token is loaded when app starts
loadAuth();

// === Example API calls ===

// Login API
export async function login(username, password) {
  const res = await api.post("/auth/login", { username, password });
  // assuming backend returns { token, role, fullName }
  setAuth(res.data.token);
  return res.data;
}

// Example secure request
export async function getProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}
