"use client";

import React, { useState } from "react";
import api from "../../../../utils/axios";

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    level: "",
    instructor: "",
    startDate: "",
    endDate: "",
    status: "active",
    notes: "",
  });

  const [editingCourse, setEditingCourse] = useState(null);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update course
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        await api.put(`/course/update/${editingCourse._id}`, formData);
        alert("✅ Course updated successfully!");
      } else {
        await api.post("/course/addcourse", formData);
        alert("✅ Course added successfully!");
      }

      setFormData({
        title: "",
        description: "",
        duration: "",
        price: "",
        level: "",
        instructor: "",
        startDate: "",
        endDate: "",
        status: "active",
        notes: "",
      });
      setEditingCourse(null);
    } catch (error) {
      console.error("❌ Error saving course:", error);
      alert("Error saving course.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">➕ Add / Manage Course</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 12 weeks)"
          value={formData.duration}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="level"
          placeholder="Level (Beginner, Intermediate, Advanced)"
          value={formData.level}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="instructor"
          placeholder="Instructor"
          value={formData.instructor}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
      </form>
    </div>
  );
}
