"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar"; // relative import
import Topbar from "./components/topbar";   // relative import

export default function AdminDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.title = "Admin Dashboard";
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
