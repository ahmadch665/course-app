"use client"; // Must be at the top for client components

import React, { useEffect } from "react";

export default function AdminDashboardLayout({ children }) {
  useEffect(() => {
    document.title = "Admin Dashboard"; // Set page title manually
  }, []);

  return <div className="min-h-screen bg-gray-100">{children}</div>;
}
