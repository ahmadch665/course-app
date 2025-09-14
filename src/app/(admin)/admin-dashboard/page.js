"use client";

import React, { useState } from "react";
import { FiMenu, FiUser, FiLogOut, FiBook, FiUsers } from "react-icons/fi";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove stored token
    router.push("/login");            // Redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-tr from-blue-900 to-blue-700 text-white transition-width duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`${sidebarOpen ? "block" : "hidden"} font-bold text-lg`}>
            Admin
          </h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-4">
          <ul>
            <li className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3">
              <FiUsers /> <span className={`${sidebarOpen ? "block" : "hidden"}`}>Users</span>
            </li>
            <li className="p-4 hover:bg-blue-800 cursor-pointer flex items-center gap-3">
              <FiBook /> <span className={`${sidebarOpen ? "block" : "hidden"}`}>Courses</span>
            </li>
            {/* Add more menu items */}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800 flex items-center gap-3">
          <FiUser />
          <span className={`${sidebarOpen ? "block" : "hidden"}`}>Admin Name</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FiLogOut /> Logout
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 font-medium">Total Courses</h3>
            <p className="text-2xl font-bold mt-2">42</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 font-medium">Total Users</h3>
            <p className="text-2xl font-bold mt-2">128</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 font-medium">Active Courses</h3>
            <p className="text-2xl font-bold mt-2">36</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 font-medium">New Users</h3>
            <p className="text-2xl font-bold mt-2">8</p>
          </div>
        </div>

        {/* Tables / List Views */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Users List</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">John Doe</td>
                  <td className="p-3">john@example.com</td>
                  <td className="p-3">Student</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
                {/* Map your users dynamically here */}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
