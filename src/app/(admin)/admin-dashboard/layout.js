"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar"; 
import Topbar from "./components/topbar";   

export default function AdminDashboardLayout({ children }) {
  // Default collapsed (safe for mobile SSR)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard";

    // ✅ Only expand on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6 overflow-auto">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
