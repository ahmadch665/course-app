"use client";

import React, { useState } from "react";
import api from "../../../../utils/axios";

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    level: "Beginner",
    instructor: "",
    startDate: "",
    endDate: "",
    status: "active", // ✅ default lowercase
    notes: "",
    image: null, // file object
    videoUrls: "",
    videoDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0], // store file
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("duration", formData.duration.trim());
      payload.append("price", formData.price);
      payload.append("level", formData.level);
      payload.append("instructor", formData.instructor.trim());
      if (formData.startDate) payload.append("startDate", formData.startDate);
      if (formData.endDate) payload.append("endDate", formData.endDate);
      payload.append("status", formData.status.toLowerCase()); // ✅ always lowercase
      if (formData.notes) payload.append("notes", formData.notes.trim());
      if (formData.image) payload.append("image", formData.image);
      if (formData.videoUrls) payload.append("videoUrls", formData.videoUrls.trim());
      if (formData.videoDescription) payload.append("videoDescription", formData.videoDescription.trim());

      console.log("📤 Sending FormData...");

      const response = await api.post("/course/addcourse", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Course saved:", response.data);

      setMessage("Course added successfully!");
      setFormData({
        title: "",
        description: "",
        duration: "",
        price: "",
        level: "Beginner",
        instructor: "",
        startDate: "",
        endDate: "",
        status: "active",
        notes: "",
        image: null,
        videoUrls: "",
        videoDescription: "",
      });
    } catch (error) {
      console.error("❌ Error saving course:", error.response?.data || error);
      setMessage("Failed to save course. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add New Course</h1>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 12 weeks)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input
          type="text"
          name="instructor"
          placeholder="Instructor"
          value={formData.instructor}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* ✅ lowercase options */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="pending">pending</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* ✅ New Fields */}
        <input
          type="text"
          name="videoUrls"
          placeholder="Video URLs (comma-separated)"
          value={formData.videoUrls}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="videoDescription"
          placeholder="Video Description"
          value={formData.videoDescription}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Course"}
        </button>
      </form>
    </div>
  );
}
