"use client";

import React, { useEffect, useState } from "react";
import api from "../../../../utils/axios";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch instructors and students
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [instructorsRes, studentsRes] = await Promise.all([
        api.get("/users/getinstructor"),
        api.get("/users/getstudent"),
      ]);

      const instructors = instructorsRes.data?.data || [];
      const students = studentsRes.data?.data || [];

      setUsers([...instructors, ...students]);
    } catch (error) {
      console.error("❌ Error fetching instructors/students:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Filter users
  const filteredUsers = (() => {
    if (!search) return users;

    const lowerSearch = search.toLowerCase();

    const startsWith = users.filter((user) =>
      (user.userName || user.name)?.toLowerCase().startsWith(lowerSearch)
    );

    const contains = users.filter(
      (user) =>
        (user.userName || user.name)?.toLowerCase().includes(lowerSearch) &&
        !(user.userName || user.name)?.toLowerCase().startsWith(lowerSearch)
    );

    return [...startsWith, ...contains];
  })();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Users List</h3>

      {/* 🔍 Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ Scrollable Table */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading users...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow">
              <tr className="border-b border-gray-200">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3">{user.userName || user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500"
                  >
                    No instructors or students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
