"use client";

import React, { useState, useEffect } from "react";
import api from "../../../../utils/axios";
import Image from "next/image";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [editData, setEditData] = useState({});
  const [instructors, setInstructors] = useState([]); // ✅ added

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/course/allcourses");
      setCourses(res.data.data || res.data || []);
    } catch (error) {
      console.error(
        "❌ Error fetching courses:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch instructors
  const fetchInstructors = async () => {
    try {
      const res = await api.get("/users/getinstructor");
      setInstructors(res.data?.data || []);
    } catch (error) {
      console.error("❌ Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  // Expand handler
  const handleExpand = (course) => {
    if (expanded === course._id) {
      setExpanded(null);
      return;
    }
    setExpanded(course._id);

    setEditData((prev) => ({
      ...prev,
      [course._id]: {
        title: course.title || "",
        description: course.description || "",
        transcription: course.transcription || "",
        price: course.price || 0,
        level: course.level || "",
        instructor:
          typeof course.instructor === "object" && course.instructor !== null
            ? course.instructor._id
            : course.instructor || "", // ✅ support both id or object
        status: course.status || "",
        duration: course.duration || "",
        startDate: course.startDate?.split("T")[0] || "",
        endDate: course.endDate?.split("T")[0] || "",
        notes: Array.isArray(course.notes)
          ? course.notes.join(", ")
          : course.notes || "",
        videoUrls: Array.isArray(course.videoUrls)
          ? course.videoUrls.join(", ")
          : course.videoUrls || "",
        videoDescription: Array.isArray(course.videoDescription)
          ? course.videoDescription
          : [],
        image: course.image || null,
        preview: null,
      },
    }));
  };

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
      const data = editData[id];

      const payload = {
        ...data,
        notes: data.notes ? data.notes.split(",").map((n) => n.trim()) : [],
        videoUrls: data.videoUrls
          ? data.videoUrls.split(",").map((u) => u.trim())
          : [],
        videoDescription: data.videoDescription || [],
      };

      delete payload.preview;

      await api.put(`/course/update/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("✅ Course updated successfully!");

      await fetchCourses();
      const updated = courses.find((c) => c._id === id);
      if (updated) handleExpand(updated);
    } catch (error) {
      console.error("❌ Error updating course:", error.response?.data || error);
      alert("Error updating course.");
    }
  };

  // ✅ helper to show instructor name
  const getInstructorName = (instructorIdOrObj) => {
    if (!instructorIdOrObj) return "-";
    if (typeof instructorIdOrObj === "object") {
      return instructorIdOrObj.userName || instructorIdOrObj.name || "-";
    }
    const found = instructors.find((inst) => inst._id === instructorIdOrObj);
    return found ? found.userName || found.name : instructorIdOrObj;
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

            return (
              <div
                key={course._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Card Header */}
                <div
                  onClick={() => handleExpand(course)}
                  className="cursor-pointer"
                >
                  {editData[course._id]?.preview ? (
                    <Image
                      src={editData[course._id].preview}
                      alt={course.title}
                      width={600}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                  ) : course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={600}
                      height={160}
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
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.transcription}
                      </p>
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="font-semibold">Instructor:</span>{" "}
                          {getInstructorName(course.instructor)}
                        </p>
                        <p>
                          <span className="font-semibold">Level:</span>{" "}
                          {course.level || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Price:</span> $
                          {course.price}
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
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background Blur */}
                    <div
                      className="absolute inset-0 backdrop-blur-sm bg-white/30"
                      onClick={() => setExpanded(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 z-50 overflow-y-auto max-h-[90vh]">
                      {/* Close Button */}
                      <button
                        className="absolute top-2 right-2 mt-[-15px] text-red-600 hover:text-red-800 text-3xl font-bold"
                        onClick={() => setExpanded(null)}
                      >
                        &times;
                      </button>

                      {/* Your Existing Editable Fields (unchanged) */}
                      <div
                        className="space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.title || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                title: e.target.value,
                              },
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
                              [course._id]: {
                                ...prev[course._id],
                                description: e.target.value,
                              },
                            }))
                          }
                          placeholder="Description"
                        />
                        <textarea
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.transcription || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                transcription: e.target.value,
                              },
                            }))
                          }
                          placeholder="Transcription"
                        />

                        <input
                          type="number"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.price || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                price: Number(e.target.value),
                              },
                            }))
                          }
                          placeholder="Price"
                        />
                        <select
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.level || "Beginner"}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                level: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>

                        <select
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.instructor || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                instructor: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="">Select Instructor</option>
                          {instructors.map((inst) => (
                            <option key={inst._id} value={inst._id}>
                              {inst.userName || inst.name}
                            </option>
                          ))}
                        </select>

                        <select
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.status || "active"}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                status: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                          <option value="pending">pending</option>
                        </select>

                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.duration || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                duration: e.target.value,
                              },
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
                              [course._id]: {
                                ...prev[course._id],
                                startDate: e.target.value,
                              },
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
                              [course._id]: {
                                ...prev[course._id],
                                endDate: e.target.value,
                              },
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
                              [course._id]: {
                                ...prev[course._id],
                                notes: e.target.value,
                              },
                            }))
                          }
                          placeholder="Notes (comma separated)"
                        />
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[course._id]?.videoUrls || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [course._id]: {
                                ...prev[course._id],
                                videoUrls: e.target.value,
                              },
                            }))
                          }
                          placeholder="Video URLs (comma separated)"
                        />

                        {/* ✅ Editable Video Description Section */}
                        <div className="border rounded p-2">
                          <label className="block font-semibold mb-2">
                            Video Description
                          </label>
                          {Array.isArray(
                            editData[course._id]?.videoDescription
                          ) &&
                            editData[course._id].videoDescription.map(
                              (section, i) => (
                                <div
                                  key={i}
                                  className="mb-3 p-2 border rounded"
                                >
                                  {/* Section Name + Remove */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <input
                                      type="text"
                                      placeholder="Section Name"
                                      className="flex-1 border px-2 py-1 rounded"
                                      value={section.sectionName}
                                      onChange={(e) =>
                                        setEditData((prev) => {
                                          const updated = [
                                            ...prev[course._id]
                                              .videoDescription,
                                          ];
                                          updated[i].sectionName =
                                            e.target.value;
                                          return {
                                            ...prev,
                                            [course._id]: {
                                              ...prev[course._id],
                                              videoDescription: updated,
                                            },
                                          };
                                        })
                                      }
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditData((prev) => {
                                          const updated = prev[
                                            course._id
                                          ].videoDescription.filter(
                                            (_, idx) => idx !== i
                                          );
                                          return {
                                            ...prev,
                                            [course._id]: {
                                              ...prev[course._id],
                                              videoDescription: updated,
                                            },
                                          };
                                        })
                                      }
                                      className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                      −
                                    </button>
                                  </div>

                                  {/* Section Content */}
                                  <input
                                    type="text"
                                    placeholder="Content (comma separated)"
                                    className="w-full border px-2 py-1 rounded"
                                    value={section.content.join(", ")}
                                    onChange={(e) =>
                                      setEditData((prev) => {
                                        const updated = [
                                          ...prev[course._id].videoDescription,
                                        ];
                                        updated[i].content = e.target.value
                                          .split(",")
                                          .map((c) => c.trim());
                                        return {
                                          ...prev,
                                          [course._id]: {
                                            ...prev[course._id],
                                            videoDescription: updated,
                                          },
                                        };
                                      })
                                    }
                                  />
                                </div>
                              )
                            )}

                          {/* Add button */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                setEditData((prev) => {
                                  const updated = [
                                    ...(prev[course._id].videoDescription ||
                                      []),
                                    { sectionName: "", content: [] },
                                  ];
                                  return {
                                    ...prev,
                                    [course._id]: {
                                      ...prev[course._id],
                                      videoDescription: updated,
                                    },
                                  };
                                })
                              }
                              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          className="w-full border px-2 py-1 rounded"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const previewUrl = URL.createObjectURL(file);
                              setEditData((prev) => ({
                                ...prev,
                                [course._id]: {
                                  ...prev[course._id],
                                  image: file,
                                  preview: previewUrl,
                                },
                              }));
                            }
                          }}
                        />
                        {editData[course._id]?.preview && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              Selected image (not saved yet):
                            </p>
                            <Image
                              src={editData[course._id].preview}
                              alt="Preview"
                              width={150}
                              height={80}
                              className="rounded border"
                            />
                          </div>
                        )}
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
