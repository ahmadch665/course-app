"use client";

import React, { useState, useEffect } from "react";
import api from "../../../../utils/axios";
import Image from "next/image";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // track expanded card
  const [editData, setEditData] = useState({}); // track editable fields

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/course/allcourses");
      setCourses(res.data.data || res.data || []);
    } catch (error) {
      console.error("❌ Error fetching courses:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/course/delete/${id}`);
      alert("✅ Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("❌ Error deleting course:", error.response?.data || error);
      alert("Error deleting course.");
    }
  };

  // Update course
  const handleUpdate = async (id) => {
    try {
      await api.put(`/course/update/${id}`, editData[id]);
      alert("✅ Course updated successfully!");
      fetchCourses();
    } catch (error) {
      console.error("❌ Error updating course:", error.response?.data || error);
      alert("Error updating course.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 All Courses</h1>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map((course) => {
            const isExpanded = expanded === course._id;

            // Initialize editData for this course if not already
            if (isExpanded && !editData[course._id]) {
              setEditData((prev) => ({
                ...prev,
                [course._id]: {
                  title: course.title,
                  description: course.description,
                  price: course.price,
                  level: course.level,
                  instructor: course.instructor,
                  status: course.status,
                  duration: course.duration,
                  startDate: course.startDate?.split("T")[0] || "",
                  endDate: course.endDate?.split("T")[0] || "",
                  notes: course.notes || "",
                },
              }));
            }

            return (
              <div
                key={course._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Card header (clickable only for expand/collapse) */}
                <div
                 onClick={() => setExpanded(isExpanded ? null : course._id)}

                  className="cursor-pointer"
                >
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  {!isExpanded && (
                    <div className="p-4">
                      <h2 className="text-lg font-bold">{course.title}</h2>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="font-semibold">Instructor:</span>{" "}
                          {course.instructor || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Level:</span> {course.level || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Price:</span> ${course.price}
                        </p>
                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              course.status === "active"
                                ? "bg-green-100 text-green-700"
                                : course.status === "upcoming"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {course.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Editable Fields */}
                {isExpanded && (
                  <div className="p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.title || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], title: e.target.value },
                        }))
                      }
                      placeholder="Title"
                    />
                    <textarea
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.description || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], description: e.target.value },
                        }))
                      }
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.price || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], price: Number(e.target.value) },
                        }))
                      }
                      placeholder="Price"
                    />
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.level || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], level: e.target.value },
                        }))
                      }
                      placeholder="Level"
                    />
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.instructor || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], instructor: e.target.value },
                        }))
                      }
                      placeholder="Instructor"
                    />
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.status || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], status: e.target.value },
                        }))
                      }
                      placeholder="Status"
                    />
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.duration || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], duration: e.target.value },
                        }))
                      }
                      placeholder="Duration"
                    />
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.startDate || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], startDate: e.target.value },
                        }))
                      }
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.endDate || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], endDate: e.target.value },
                        }))
                      }
                      placeholder="End Date"
                    />
                    <textarea
                      className="w-full border px-2 py-1 rounded"
                      value={editData[course._id]?.notes || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [course._id]: { ...prev[course._id], notes: e.target.value },
                        }))
                      }
                      placeholder="Notes"
                    />

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleUpdate(course._id)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="flex-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Dates */}
                    <div className="mt-3 text-xs text-gray-500">
                      <p>
                        Created:{" "}
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                      <p>
                        Updated:{" "}
                        {course.updatedAt
                          ? new Date(course.updatedAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
}
