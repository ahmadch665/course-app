"use client";

import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import Image from "next/image";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [editData, setEditData] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    description: "",
    transcription: "",
    courseContent: "",
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

  // Helper function to format notes for display
  const formatNotesForDisplay = (notes) => {
    if (Array.isArray(notes)) {
      return notes.join(", ");
    }
    return notes || "";
  };

  // Helper function to format video URLs for display
  const formatVideoUrlsForDisplay = (videoUrls) => {
    if (Array.isArray(videoUrls)) {
      return videoUrls.join(", ");
    }
    return videoUrls || "";
  };

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
        courseContent: course.courseContent || "",
        price: course.price || 0,
        level: course.level || "",
        instructor:
          typeof course.instructor === "object" && course.instructor !== null
            ? course.instructor._id
            : course.instructor || "",
        status: course.status || "",
        duration: course.duration || "",
        startDate: course.startDate?.split("T")[0] || "",
        endDate: course.endDate?.split("T")[0] || "",
        notes: formatNotesForDisplay(course.notes),
        videoUrls: formatVideoUrlsForDisplay(course.videoUrls),
       videoDescription: Array.isArray(course.videoDescription)
  ? course.videoDescription.map(sec => ({
      sectionName: sec.sectionName || "",
      content: Array.isArray(sec.content)
        ? sec.content.join(", ")
        : sec.content || ""
    }))
  : [],

        image: course.image || null,
        preview: null,
      },
    }));
  };

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

  const handleUpdate = async (id) => {
    try {
      const data = editData[id];

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("transcription", data.transcription);
      formData.append("courseContent", data.courseContent);
      formData.append("price", data.price);
      formData.append("level", data.level);
      formData.append("instructor", data.instructor);
      formData.append("status", data.status);
      formData.append("duration", data.duration);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      
      // Handle notes - only convert to array if it contains commas
      formData.append("notes", data.notes || "");

      // Handle video URLs - only convert to array if it contains commas
     formData.append("videoUrls", data.videoUrls || "");

formData.append(
  "videoDescription",
  JSON.stringify(
    (data.videoDescription || []).map((sec) => ({
      sectionName: sec.sectionName || "",
      content: Array.isArray(sec.content)
        ? sec.content.join(", ")  // <-- ✅ join arrays into a string
        : (sec.content || "")
    }))
  )
);








      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      console.log("Payload videoDescription:", formData.get("videoDescription"));


      await api.put(`/course/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  const getInstructorName = (instructorIdOrObj) => {
    if (!instructorIdOrObj) return "-";
    if (typeof instructorIdOrObj === "object") {
      return instructorIdOrObj.userName || instructorIdOrObj.name || "-";
    }
    const found = instructors.find((inst) => inst._id === instructorIdOrObj);
    return found ? found.userName || found.name : instructorIdOrObj;
  };

  // Add Course Functions
  const handleAddCourseChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setNewCourseData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setNewCourseData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddVideoDescChange = (index, field, value) => {
  setNewCourseData((prev) => {
    const updated = [...prev.videoDescription];
    if (field === "content") {
      // ✅ keep as plain string while typing
      updated[index].content = value;
    } else {
      updated[index][field] = value;
    }
    return { ...prev, videoDescription: updated };
  });
};


  const addVideoSection = () => {
    setNewCourseData((prev) => ({
      ...prev,
      videoDescription: [
        ...prev.videoDescription,
{ sectionName: "", content: "" }
      ],
    }));
  };

  const removeVideoSection = (index) => {
    setNewCourseData((prev) => {
      const updated = prev.videoDescription.filter((_, i) => i !== index);
      return { ...prev, videoDescription: updated };
    });
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("title", newCourseData.title.trim());
      payload.append("description", newCourseData.description.trim());
      payload.append("transcription", newCourseData.transcription.trim());
      payload.append("courseContent", newCourseData.courseContent.trim());
      payload.append("duration", newCourseData.duration.trim());
      payload.append("price", newCourseData.price);
      payload.append("level", newCourseData.level);
      payload.append("instructor", newCourseData.instructor);
      if (newCourseData.startDate)
        payload.append("startDate", newCourseData.startDate);
      if (newCourseData.endDate)
        payload.append("endDate", newCourseData.endDate);
      payload.append("status", newCourseData.status.toLowerCase());

      // Handle notes - only convert to array if it contains commas
     payload.append("notes", newCourseData.notes || "");


      // Handle video URLs - only convert to array if it contains commas
    payload.append("videoUrls", newCourseData.videoUrls || "");

  payload.append(
  "videoDescription",
  JSON.stringify(
    (newCourseData.videoDescription || []).map((sec) => ({
      sectionName: sec.sectionName || "",
      content: sec.content || ""   // ✅ always plain string
    }))
  )
);



      if (newCourseData.image) payload.append("image", newCourseData.image);

      await api.post("/course/addcourse", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Course added successfully!");
      setIsAddModalOpen(false);
      setNewCourseData({
        title: "",
        description: "",
        transcription: "",
        courseContent: "",
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
      fetchCourses();
    } catch (error) {
      console.error("❌ Error adding course:", error.response?.data || error);
      alert("Error adding course.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
            📚 All Courses
          </h1>
          <p className="text-gray-500 mt-2">
            Manage, edit, and explore your course library
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
        >
          + Add Course
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading courses...</p>
      ) : courses.length > 0 ? (
        <>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => {
              return (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
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
                        className="w-full h-44 object-cover"
                      />
                    ) : course.image ? (
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={600}
                        height={160}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-gray-800 truncate">
                        {course.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {course.description}
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-gray-700">
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
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Course Modal */}
          {expanded &&
            (() => {
              const selectedCourse = courses.find((c) => c._id === expanded);
              if (!selectedCourse) return null;

              return (
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

                    {/* Editable Fields */}
                    <div
                      className="space-y-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Title */}
                      <div>
                        <label className="block font-semibold mb-1">
                          Title:
                        </label>
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.title || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                title: e.target.value,
                              },
                            }))
                          }
                          placeholder="Title"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block font-semibold mb-1">
                          Description:
                        </label>
                        <textarea
                          className="w-full border px-2 py-1 rounded"
                          value={
                            editData[selectedCourse._id]?.description || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                description: e.target.value,
                              },
                            }))
                          }
                          placeholder="Description"
                        />
                      </div>

                      {/* Transcription */}
                      <div>
                        <label className="block font-semibold mb-1">
                          Transcription:
                        </label>
                        <textarea
                          className="w-full border px-2 py-1 rounded"
                          value={
                            editData[selectedCourse._id]?.transcription || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                transcription: e.target.value,
                              },
                            }))
                          }
                          placeholder="Transcription"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">
                          Course Content:
                        </label>
                        <textarea
                          className="w-full border px-2 py-1 rounded"
                          value={
                            editData[selectedCourse._id]?.courseContent || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                courseContent: e.target.value,
                              },
                            }))
                          }
                          placeholder="Transcription"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block font-semibold mb-1">
                          Price:
                        </label>
                        <input
                          type="number"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.price || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                price: Number(e.target.value),
                              },
                            }))
                          }
                          placeholder="Price"
                        />
                      </div>

                      {/* Level */}
                      <div>
                        <label className="block font-semibold mb-1">
                          Level:
                        </label>
                        <select
                          className="w-full border px-2 py-1 rounded"
                          value={
                            editData[selectedCourse._id]?.level || "Beginner"
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                level: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      {/* Instructor */}
                      <div>
                        <label className="block font-semibold mb-1">
                          Instructor:
                        </label>
                        <select
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.instructor || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
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
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">
                          Status:
                        </label>
                        <select
                          className="w-full border px-2 py-1 rounded"
                          value={
                            editData[selectedCourse._id]?.status || "active"
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                status: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                          <option value="pending">pending</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">
                          Duration:
                        </label>
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.duration || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                duration: e.target.value,
                              },
                            }))
                          }
                          placeholder="Duration"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">
                          Start Date:
                        </label>
                        <input
                          type="date"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.startDate || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                startDate: e.target.value,
                              },
                            }))
                          }
                          placeholder="Start Date"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">
                          End Date:
                        </label>
                        <input
                          type="date"
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.endDate || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                endDate: e.target.value,
                              },
                            }))
                          }
                          placeholder="End Date"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Notes:</label>
                        <textarea
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.notes || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                notes: e.target.value,
                              },
                            }))
                          }
                          placeholder="Notes (comma separated for multiple values)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter multiple notes separated by commas
                        </p>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Video URLs:</label>
                        <textarea
                          className="w-full border px-2 py-1 rounded"
                          value={editData[selectedCourse._id]?.videoUrls || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                videoUrls: e.target.value,
                              },
                            }))
                          }
                          placeholder="Video URLs (comma separated for multiple values)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter multiple URLs separated by commas
                        </p>
                      </div>

                      {/* ✅ Editable Video Description Section */}
                      <div className="border rounded p-2">
                        <label className="block font-semibold mb-2">
                          Video Description
                        </label>
                        {Array.isArray(
                          editData[selectedCourse._id]?.videoDescription
                        ) &&
                          editData[selectedCourse._id].videoDescription.map(
                            (section, i) => (
                              <div key={i} className="mb-3 p-2 border rounded">
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
                                          ...prev[selectedCourse._id]
                                            .videoDescription,
                                        ];
                                        updated[i].sectionName = e.target.value;
                                        return {
                                          ...prev,
                                          [selectedCourse._id]: {
                                            ...prev[selectedCourse._id],
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
                                          selectedCourse._id
                                        ].videoDescription.filter(
                                          (_, idx) => idx !== i
                                        );
                                        return {
                                          ...prev,
                                          [selectedCourse._id]: {
                                            ...prev[selectedCourse._id],
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
  value={section.content}
  onChange={(e) =>
    setEditData((prev) => {
      const updated = [...prev[selectedCourse._id].videoDescription];
      updated[i].content = e.target.value; // ✅ keep string
      return {
        ...prev,
        [selectedCourse._id]: {
          ...prev[selectedCourse._id],
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
                                  ...(prev[selectedCourse._id]
                                    .videoDescription || []),
{ sectionName: "", content: "" }
                                ];
                                return {
                                  ...prev,
                                  [selectedCourse._id]: {
                                    ...prev[selectedCourse._id],
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
                              [selectedCourse._id]: {
                                ...prev[selectedCourse._id],
                                image: file,
                                preview: previewUrl,
                              },
                            }));
                          }
                        }}
                      />

                      {editData[selectedCourse._id]?.preview && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Selected image (not saved yet):
                          </p>
                          <Image
                            src={editData[selectedCourse._id].preview}
                            alt="Preview"
                            width={150}
                            height={80}
                            className="rounded border"
                          />
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleUpdate(selectedCourse._id)}
                          className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDelete(selectedCourse._id)}
                          className="flex-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-all text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        <p>
                          Created:{" "}
                          {selectedCourse.createdAt
                            ? new Date(
                                selectedCourse.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                        <p>
                          Updated:{" "}
                          {selectedCourse.updatedAt
                            ? new Date(
                                selectedCourse.updatedAt
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
        </>
      ) : (
        <p>No courses found.</p>
      )}

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/30"
            onClick={() => setIsAddModalOpen(false)}
          ></div>

          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 z-50 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 mt-[-15px] text-red-600 hover:text-red-800 text-3xl font-bold"
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">Add New Course</h2>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Title:</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newCourseData.title}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description:</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newCourseData.description}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Transcription:
                </label>
                <textarea
                  name="transcription"
                  placeholder="Transcription"
                  value={newCourseData.transcription}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Course Content:
                </label>
                <textarea
                  name="courseContent"
                  placeholder="Course Content"
                  value={newCourseData.courseContent}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Price:</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newCourseData.price}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Level:</label>
                <select
                  name="level"
                  value={newCourseData.level}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Instructor:</label>
                <select
                  name="instructor"
                  value={newCourseData.instructor}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.userName || inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Status:</label>
                <select
                  name="status"
                  value={newCourseData.status}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="pending">pending</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Duration:</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g. 12 weeks)"
                  value={newCourseData.duration}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={newCourseData.startDate}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={newCourseData.endDate}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes:</label>
                <textarea
                  name="notes"
                  placeholder="Notes (comma separated for multiple values)"
                  value={newCourseData.notes}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter multiple notes separated by commas
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Video URLs:</label>
                <input
                  type="text"
                  name="videoUrls"
                  placeholder="Video URLs (comma-separated for multiple values)"
                  value={newCourseData.videoUrls}
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter multiple URLs separated by commas
                </p>
              </div>

              {/* Video Description Section */}
              <div className="border rounded p-2">
                <label className="block font-semibold mb-2">
                  Video Description
                </label>
                {newCourseData.videoDescription.map((section, i) => (
                  <div key={i} className="mb-3 p-2 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Section Name"
                        value={section.sectionName}
                        onChange={(e) =>
                          handleAddVideoDescChange(
                            i,
                            "sectionName",
                            e.target.value
                          )
                        }
                        className="flex-1 border px-2 py-1 rounded"
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
  value={section.content}   // ✅ plain string now
  onChange={(e) =>
    handleAddVideoDescChange(i, "content", e.target.value)
  }
  className="w-full border px-2 py-1 rounded"
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

              <div>
                <label className="block font-semibold mb-1">
                  Course Image:
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleAddCourseChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-all"
                >
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}