"use client";

import React from "react";
import { FiMenu, FiUser, FiUsers, FiBook, FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-tr from-blue-900 to-blue-700 text-white transition-width duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={`${sidebarOpen ? "block" : "hidden"} font-bold text-lg`}>
          Admin
        </h1>
        {/* Toggle button -> hidden on mobile (smaller than md) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:block"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <nav className="flex-1 mt-4">
        <ul>
          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
            onClick={() => router.push("/admin-dashboard")}
          >
            <FiHome />
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Home</span>
          </li>

          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
            onClick={() => router.push("/admin-dashboard/users")}
          >
            <FiUsers />
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Users</span>
          </li>

          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
            onClick={() => router.push("/admin/courses")}
          >
            <FiBook />
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Courses</span>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-800 flex items-center gap-3">
        <FiUser />
        <span className={`${sidebarOpen ? "block" : "hidden"}`}>Admin Name</span>
      </div>
    </aside>
  );
};

export default Sidebar;
