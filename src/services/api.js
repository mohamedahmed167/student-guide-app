// src/services/api.js
// Centralised Axios instance. Every API call in the app goes through here,
// so we only need to change the base URL in one place.

import axios from "axios";

const api = axios.create({
  baseURL: "https://ahmedamara.pythonanywhere.com/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attach auth token if it exists (ready for when authentication is added).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Unwrap the data layer so callers receive `response.data` directly.
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

// ─── Endpoint helpers ─────────────────────────────────────────────────────────
export const studentService = {
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.patch(`/students/${id}/`, data),
};

export const departmentService = {
  getAll: () => api.get("/departments"),
};

export const subjectService = {
  getAll: () => api.get("/subjects"),
};

export const scheduleService = {
  getAll: () => api.get("/schedules"),
};

export const examService = {
  getAll: () => api.get("/exams"),
};

export const todoService = {
  getAll: () => api.get("/todos"),
};

export default api;
