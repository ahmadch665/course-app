"use client";

import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center mb-6 p-4 md:p-6 bg-white shadow rounded-md">
      {/* Dashboard Title */}
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <FiLogOut /> Logout
      </button>
    </header>
  );
};

export default Topbar;
