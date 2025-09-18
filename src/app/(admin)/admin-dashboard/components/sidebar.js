"use client";

import React, { useState, useEffect } from "react";
import { FiMenu, FiUser, FiUsers, FiBook, FiHome, FiChevronDown, FiFile } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const [courseOpen, setCourseOpen] = useState(false);

  // ✅ Open sidebar by default on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(true);
    }
  }, [setSidebarOpen]);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } fixed top-0 left-0 h-screen bg-gradient-to-tr from-blue-900 to-blue-700 text-white transition-all duration-300 flex flex-col z-50`}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={`${sidebarOpen ? "block" : "hidden"} font-bold text-lg`}>
          Admin
        </h1>
        {/* ✅ Always show toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <nav className="flex-1 mt-4">
        <ul>
          {/* Home */}
          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
            onClick={() => router.push("/admin-dashboard")}
          >
           <lord-icon
  src="https://cdn.lordicon.com/hjbsbdhw.json"
  trigger="loop"
  style={{ width: "24px", height: "24px" }}
></lord-icon>

            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Home</span>
          </li>

         
          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
            onClick={() => router.push("/admin-dashboard/users")}
          >
           <lord-icon
    src="https://cdn.lordicon.com/dxjqoygy.json"
    trigger="loop"
    delay="2000"
     style={{ width: "24px", height: "24px" }}>
</lord-icon>

            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Users</span>
          </li>

      
           <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
            onClick={() => router.push("/admin-dashboard/courses")}
          >
          <lord-icon
  src="https://cdn.lordicon.com/dxoycpzg.json"
  trigger="loop"
  style={{ width: "24px", height: "24px" }}
></lord-icon>

            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Courses</span>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800 flex items-center gap-3">
        <FiUser />
        <span className={`${sidebarOpen ? "block" : "hidden"}`}>Admin Name</span>
      </div>
    </aside>
  );
};

export default Sidebar;
