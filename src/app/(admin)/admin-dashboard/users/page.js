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
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

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
      showToast("Failed to fetch users", "error");
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
      showToast("User added successfully!");
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
      showToast(message, "error");
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
      showToast("User deleted successfully!");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      showToast("Failed to delete user", "error");
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
      showToast("User updated successfully!");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      showToast("Failed to update user", "error");
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          autoFocus
        />
      );
    }
    
    return (
      <div 
        className="min-h-[2.5rem] py-2 px-1 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200 group flex items-center"
        onClick={() => handleFieldClick(user._id, field, user[field] || "")}
      >
        <span className="text-gray-800 group-hover:text-blue-700 transition-colors duration-200 font-bold ">
          {user[field] || label}
        </span>
        <svg className="ml-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      suspended: { color: "bg-red-100 text-red-800", label: "Suspended" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }) => {
    const roleConfig = {
      ADMIN: { color: "bg-purple-100 text-purple-800", label: "Admin" },
      INSTRUCTOR: { color: "bg-blue-100 text-blue-800", label: "Instructor" },
      STUDENT: { color: "bg-green-100 text-green-800", label: "Student" }
    };
    
    const config = roleConfig[role] || { color: "bg-gray-100 text-gray-800", label: role };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-60 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 ${
          toast.type === "error" 
            ? "bg-red-50 border-l-4 border-red-500 text-red-700" 
            : "bg-green-50 border-l-4 border-green-500 text-green-700"
        }`}>
          <div className="flex items-center">
            <svg className={`w-6 h-6 mr-3 ${toast.type === "error" ? "text-red-500" : "text-green-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toast.type === "error" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-slideUp">
            <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="userName" className="block mb-2 font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding User...
                    </span>
                  ) : (
                    "Add User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage your users efficiently with advanced controls</p>
        </div>

        {/* Users List Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Users List</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="w-full sm:w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {tableLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="ml-4">
                              {renderEditableField(user, "userName", "Click to add username")}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {renderEditableField(user, "email", "Click to add email")}
                            {renderEditableField(user, "phone", "Click to add phone")}
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer">
                          {editingField.id === user._id && editingField.field === "role" ? (
                            renderEditableField(user, "role", "Click to set role")
                          ) : (
                            <div onClick={() => handleFieldClick(user._id, "role", user.role || "")}>
                              <RoleBadge role={user.role} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 cursor-pointer">
                          {editingField.id === user._id && editingField.field === "status" ? (
                            renderEditableField(user, "status", "active")
                          ) : (
                            <div onClick={() => handleFieldClick(user._id, "status", user.status || "active")}>
                              <StatusBadge status={user.status} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 ">
                          <div className="flex gap-2">
                            {editingField.id === user._id ? (
                              <>
                                <button
                                  onClick={() => handleInlineSave(user._id)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Save
                                </button>
                                <button
                                  onClick={handleInlineCancel}
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;