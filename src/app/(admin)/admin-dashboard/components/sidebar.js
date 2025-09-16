"use client";

import React, { useState, useEffect } from "react";
import { FiMenu, FiUser, FiUsers, FiBook, FiHome, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const [courseOpen, setCourseOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false); // ✅ added for Users dropdown

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
            <FiHome />
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Home</span>
          </li>

          {/* ✅ Users Dropdown */}
          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center justify-between"
            onClick={() => setUserOpen(!userOpen)}
          >
            <div className="flex items-center gap-3">
              <FiUsers />
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>Users</span>
            </div>
            {sidebarOpen && (
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  userOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </li>

          {/* Dropdown items for Users */}
          {userOpen && sidebarOpen && (
            <ul className="ml-10">
              <li
                className="p-2 hover:bg-blue-600 cursor-pointer rounded-md"
                onClick={() => router.push("/admin-dashboard/users/total-users")}
              >
                All Users
              </li>
              <li
                className="p-2 hover:bg-blue-600 cursor-pointer rounded-md"
                onClick={() => router.push("/admin-dashboard/users/instructors-students")}
              >
                Instructors & Students
              </li>
            </ul>
          )}

          {/* Courses Dropdown */}
          <li
            className="p-4 hover:bg-blue-800 cursor-pointer flex items-center justify-between"
            onClick={() => setCourseOpen(!courseOpen)}
          >
            <div className="flex items-center gap-3">
              <FiBook />
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>Courses</span>
            </div>
            {sidebarOpen && (
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  courseOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </li>

          {/* Dropdown items for Courses */}
          {courseOpen && sidebarOpen && (
            <ul className="ml-10">
              <li
                className="p-2 hover:bg-blue-600 cursor-pointer rounded-md"
                onClick={() => router.push("/admin-dashboard/courses/all-courses")}
              >
                All Courses
              </li>
              <li
                className="p-2 hover:bg-blue-600 cursor-pointer rounded-md"
                onClick={() => router.push("/admin-dashboard/courses/add-courses")}
              >
                Add Course
              </li>
            </ul>
          )}
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
