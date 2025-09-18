"use client";

import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [tempValue, setTempValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // New state for role filter

  // --- Fetch users ---
  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      const payload = {
        draw: 1,
        start: 0,
        length: -1,
        columns: [],
        order: [],
        search: { value: "" },
      };

      const res = await api.post("/users/userslist", payload);
      const usersArray = res.data.data?.data || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      console.error("❌ Fetch users error:", err.response?.data || err.message);
      setUsers([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Add User ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/users/adduser", formData);
      alert("User added successfully!");
      setIsModalOpen(false);
      await fetchUsers();
      setFormData({
        userName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        status: "active"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Adding user failed";
      setError(message);
      console.error("❌ Error:", message);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete User ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/delete/${id}`);
      alert("User deleted!");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert("Failed to delete user");
    }
  };

  // --- Inline Edit Functions ---
  const handleFieldClick = (id, field, value) => {
    setEditingField({ id, field });
    setTempValue(value);
  };

  const handleInlineChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleInlineSave = async (id) => {
    try {
      const updatedUser = users.find(user => user._id === id);
      const updatedField = { [editingField.field]: tempValue };
      
      const payload = { id, ...updatedUser, ...updatedField };
      await api.put("/users/updateuser", payload);

      setEditingField({ id: null, field: null });
      setTempValue("");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      alert("Failed to update user");
    }
  };

  const handleInlineCancel = () => {
    setEditingField({ id: null, field: null });
    setTempValue("");
  };

  // --- Search and Filter ---
  const filteredUsers = (() => {
    let result = users;

    // Apply role filter
    if (roleFilter !== "ALL") {
      result = result.filter(user => user.role === roleFilter);
    }

    // Apply search filter
    if (!search) return result;

    const lowerSearch = search.toLowerCase();

    const startsWith = result.filter((user) =>
      user.userName?.toLowerCase().startsWith(lowerSearch)
    );

    const contains = result.filter(
      (user) =>
        user.userName?.toLowerCase().includes(lowerSearch) &&
        !user.userName?.toLowerCase().startsWith(lowerSearch)
    );

    return [...startsWith, ...contains];
  })();

  // Render editable field or static text
  const renderEditableField = (user, field, label) => {
    const isEditing = editingField.id === user._id && editingField.field === field;
    
    if (isEditing) {
      if (field === "role" || field === "status") {
        return (
          <select
            value={tempValue}
            onChange={handleInlineChange}
            className="w-full px-2 py-1 border rounded"
          >
            {field === "role" ? (
              <>
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="STUDENT">Student</option>
              </>
            ) : (
              <>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </>
            )}
          </select>
        );
      }
      
      return (
        <input
          type={field === "email" ? "email" : "text"}
          value={tempValue}
          onChange={handleInlineChange}
          className="w-full px-2 py-1 border rounded"
          autoFocus
        />
      );
    }
    
    return (
      <div 
        className="min-h-[2rem] py-1 cursor-pointer hover:bg-gray-100 rounded"
        onClick={() => handleFieldClick(user._id, field, user[field] || "")}
      >
        {user[field] || label}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New User</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="userName" className="block mb-1 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-1 font-medium">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block mb-1 font-medium">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block mb-1 font-medium">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {error && (
                <p className="text-red-500 text-sm md:col-span-2">{error}</p>
              )}

              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List with Inline Edit + Delete */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold">Users List</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span> Add User
          </button>
        </div>

        {/* 🔍 Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {renderEditableField(user, "userName", "Click to add username")}
                      </td>
                      <td className="p-3">
                        {renderEditableField(user, "email", "Click to add email")}
                      </td>
                      <td className="p-3">
                        {renderEditableField(user, "phone", "Click to add phone")}
                      </td>
                      <td className="p-3">
                        {renderEditableField(user, "role", "Click to set role")}
                      </td>
                      <td className="p-3">
                        {renderEditableField(user, "status", "active")}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {editingField.id === user._id ? (
                            <>
                              <button
                                onClick={() => handleInlineSave(user._id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleInlineCancel}
                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
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