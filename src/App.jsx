import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";
import AppLayout from "./components/layout/AppLayout";
import GpaCalculator from "./pages/GpaCalculator/GpaCalculator";
import StudentProfile from "./pages/StudentProfile/StudentProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body { background: #f9fafb; margin: 0; }
      .dark body { background: #0f0d2a; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout isDark={isDark} setIsDark={setIsDark} />}>
            <Route
              path="/"
              element={<Navigate to="/gpa-calculator" replace />}
            />
            <Route path="/gpa-calculator" element={<GpaCalculator />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route
              path="*"
              element={<Navigate to="/gpa-calculator" replace />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
