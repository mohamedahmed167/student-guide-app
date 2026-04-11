// src/components/layout/AppLayout.jsx
// Shell that wraps every authenticated page: Sidebar on the left, Navbar on top,
// and the page content in the scrollable main area.

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__body">
        <Navbar />
        <main className="app-layout__main">
          {/* React Router renders the matched child route here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
