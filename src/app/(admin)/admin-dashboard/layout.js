"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar"; 
import Topbar from "./components/topbar";   

export default function AdminDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard";

    // Expand sidebar on desktop by default
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ✅ Added margin so content doesn't hide behind sidebar */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
