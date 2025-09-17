"use client";

import React, { useState, useEffect } from "react";
import api from "../../../../utils/axios";

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    transcription: "",
    duration: "",
    price: "",
    level: "Beginner",
    instructor: "", // will store instructor _id
    startDate: "",
    endDate: "",
    status: "active",
    notes: "",
    image: null,
    videoUrls: "",
    videoDescription: [], // ✅ array of objects
  });

  const [instructors, setInstructors] = useState([]); // ✅ store instructors
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ fetch instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.get("/users/getinstructor");
        setInstructors(res.data?.data || []);
      } catch (error) {
        console.error("❌ Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVideoDescChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.videoDescription];
      if (field === "content") {
        updated[index].content = value.split(",").map((c) => c.trim());
      } else {
        updated[index][field] = value;
      }
      return { ...prev, videoDescription: updated };
    });
  };

  const addVideoSection = () => {
    setFormData((prev) => ({
      ...prev,
      videoDescription: [...prev.videoDescription, { sectionName: "", content: [] }],
    }));
  };

  const removeVideoSection = (index) => {
    setFormData((prev) => {
      const updated = prev.videoDescription.filter((_, i) => i !== index);
      return { ...prev, videoDescription: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("transcription", formData.transcription.trim());
      payload.append("duration", formData.duration.trim());
      payload.append("price", formData.price);
      payload.append("level", formData.level);
      payload.append("instructor", formData.instructor); // ✅ sending instructor _id
      if (formData.startDate) payload.append("startDate", formData.startDate);
      if (formData.endDate) payload.append("endDate", formData.endDate);
      payload.append("status", formData.status.toLowerCase());

      if (formData.notes) {
        formData.notes.split(",").forEach((note) => {
          payload.append("notes[]", note.trim());
        });
      }

      if (formData.videoUrls) {
        formData.videoUrls.split(",").forEach((url) => {
          payload.append("videoUrls[]", url.trim());
        });
      }

      formData.videoDescription.forEach((section, i) => {
        payload.append(`videoDescription[${i}][sectionName]`, section.sectionName);
        section.content.forEach((c, j) => {
          payload.append(`videoDescription[${i}][content][${j}]`, c);
        });
      });

      if (formData.image) payload.append("image", formData.image);

      console.log("📤 Sending FormData...");

      const response = await api.post("/course/addcourse", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Course saved:", response.data);

      setMessage("Course added successfully!");
      setFormData({
        title: "",
        description: "",
        transcription: "",
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
        videoDescription: [],
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
        {/* ✅ existing fields unchanged */}
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" required />
                <textarea name="transcription" placeholder="Transcription" value={formData.transcription} onChange={handleChange} className="w-full border p-2 rounded" required />



        <input type="text" name="duration" placeholder="Duration (e.g. 12 weeks)" value={formData.duration} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required />
        <select name="level" value={formData.level} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* ✅ Instructor Dropdown (replaced input) */}
        <select
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Instructor</option>
          {instructors.map((inst) => (
            <option key={inst._id} value={inst._id}>
              {inst.userName || inst.name}
            </option>
          ))}
        </select>

        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="pending">pending</option>
        </select>
        <textarea name="notes" placeholder="Notes (comma separated)" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="videoUrls" placeholder="Video URLs (comma-separated)" value={formData.videoUrls} onChange={handleChange} className="w-full border p-2 rounded" />

        {/* ✅ Dynamic videoDescription section unchanged */}
        <div>
          <label className="block font-semibold mb-2">Video Description</label>
          {formData.videoDescription.map((section, i) => (
            <div key={i} className="mb-3 p-3 border rounded">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Section Name"
                  value={section.sectionName}
                  onChange={(e) => handleVideoDescChange(i, "sectionName", e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeVideoSection(i)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  −
                </button>
              </div>

              <input
                type="text"
                placeholder="Content (comma separated)"
                value={section.content.join(", ")}
                onChange={(e) => handleVideoDescChange(i, "content", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addVideoSection}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              +
            </button>
          </div>
        </div>

        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" required />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          {loading ? "Saving..." : "Save Course"}
        </button>
      </form>
    </div>
  );
}
