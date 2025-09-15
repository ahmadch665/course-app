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
  const [tableLoading, setTableLoading] = useState(true); // Loading state for users table
  const [error, setError] = useState('');

  // --- Fetch users from backend API ---
  useEffect(() => {
    const fetchUsers = async () => {
      setTableLoading(true);
      try {
        const payload = {
          draw: 1,
          start: 0,
          length: 10,
          columns: [],
          order: [],
          search: { value: "" }
        };

        const res = await api.post('/users/userslist', payload);

        console.log("✅ Full API Response Object:", res);
        console.log("✅ res.data:", res.data);
        console.log("🔹 res.data.data:", res.data.data); // <-- Check this

        // Correctly set users from API response
        const usersArray = res.data.data?.data || []; // ✅ Only this line changed
        setUsers(Array.isArray(usersArray) ? usersArray : []);

      } catch (err) {
        console.error("❌ Fetch users error:", err.response?.data || err.message);
        setUsers([]);
      } finally {
        setTableLoading(false);
      }
    };

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

      // Update users list safely
      setUsers(prev => Array.isArray(prev) ? [...prev, res.data] : [res.data]);

      setFormData({ userName: '', email: '', password: '', phone: '', role: '' });
    } catch (err) {
      const message = err.response?.data?.message || 'Adding user failed';
      setError(message);
      console.error('❌ Error:', message);
    } finally {
      setLoading(false);
    }
  };

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
              <option value="USER">User</option>
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
        <div className="overflow-x-auto">
          {tableLoading ? (
            <p className="text-center py-4 text-gray-500">Loading users...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{user.userName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
