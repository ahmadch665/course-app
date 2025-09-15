'use client';

import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phone: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(""); // 🔍 search term

  // --- Fetch users from backend API ---
  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      const payload = {
        draw: 1,
        start: 0,
        length: -1,
        columns: [],
        order: [],
        search: { value: "" } // 👈 always empty now
      };

      const res = await api.post('/users/userslist', payload);

      const usersArray = res.data.data?.data || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      console.error("❌ Fetch users error:", err.response?.data || err.message);
      setUsers([]);
    } finally {
      setTableLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/users/adduser', formData);
     alert('User added successfully!');
await fetchUsers(); // 👈 refresh list from backend
setFormData({ userName: '', email: '', password: '', phone: '', role: '' });

    } catch (err) {
      const message = err.response?.data?.message || 'Adding user failed';
      setError(message);
      console.error('❌ Error:', message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter users on frontend only (startsWith first, then contains)
const filteredUsers = (() => {
  if (!search) return users;

  const lowerSearch = search.toLowerCase();

  const startsWith = users.filter((user) =>
    user.userName?.toLowerCase().startsWith(lowerSearch)
  );

  const contains = users.filter((user) =>
    user.userName?.toLowerCase().includes(lowerSearch) &&
    !user.userName?.toLowerCase().startsWith(lowerSearch)
  );

  return [...startsWith, ...contains];
})();


  return (
    <div className="p-6">
      {/* Add User Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userName" className="block mb-1 font-medium">Username</label>
            <input type="text" id="userName" value={formData.userName} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">Phone</label>
            <input type="text" id="phone" value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="role" className="block mb-1 font-medium">Role</label>
            <select id="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}

          <div className="md:col-span-2">
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
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
          {tableLoading ? (
            <p className="text-center py-4 text-gray-500">Loading users...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow">
                <tr className="border-b border-gray-200">
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">{user.userName}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3">{user.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
