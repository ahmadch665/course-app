"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { PlayCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false); // 🔹 added

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `https://course-app-tvgx.onrender.com/api/course/${id}`
        );
        setCourse(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>Course not found.</p>
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => router.push("/")}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-6 md:px-12 py-12">
      {/* Course Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden mb-16"
      >
        {/* Left Content */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-between bg-white overflow-hidden">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-700 text-base md:text-lg mb-6 whitespace-pre-line leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center text-gray-700">
            {course.duration && (
              <div className="bg-gray-50 rounded-xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg block">{course.duration}</span>
                <p className="text-sm text-gray-500 mt-1">Duration</p>
              </div>
            )}
            {course.level && (
              <div className="bg-gray-50 rounded-xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg block">{course.level}</span>
                <p className="text-sm text-gray-500 mt-1">Level</p>
              </div>
            )}
            {course.price && (
              <div className="bg-gray-50 rounded-xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg block">${course.price}</span>
                <p className="text-sm text-gray-500 mt-1">Price</p>
              </div>
            )}
            {course.instructor && (
              <div className="bg-gray-50 rounded-xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg block">
                  {course.instructor.userName || "Unknown"}
                </span>
                <p className="text-sm text-gray-500 mt-1">Instructor</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-6">
            <button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
              onClick={() => router.push(`/courses/${id}/content`)}
            >
              <PlayCircle size={20} /> Get started
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <Image
            src={course.image || "/l.webp"}
            alt={course.title || "Course image"}
            width={520}
            height={200}
            className="object-cover bg-white w-110 h-80 rounded-3xl"
          />
        </div>
      </motion.div>

      {/* What you'll learn Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
          What you&apos;ll learn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {course.notes && course.notes.length > 0 ? (
            course.notes.slice(0, 3).map((note, idx) => (
              <div
                key={idx}
                className="relative bg-white shadow-md rounded-2xl p-6 border border-gray-200 overflow-hidden flex flex-col"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {note.split(".")[0]}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">{note}</p>
                </div>
                {/* <button
                  onClick={() => setShowContent((prev) => !prev)} // 🔹 toggle
                  className="flex items-center gap-2 text-blue-700 font-semibold hover:underline mt-auto cursor-pointer"
                >
                  Course content{" "}
                  {showContent ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button> */}
                <span className="absolute bottom-4 right-6 text-7xl font-extrabold text-gray-200/70 select-none">
                  {idx + 1}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes available.</p>
          )}
        </div>

        {/* Skills Section */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-16 mb-8">
          Learn the skills that matter most
        </h2>

        <div className="flex flex-wrap gap-4 cursor-pointer">
          {course.notes &&
            course.notes.length > 3 &&
            course.notes.slice(3).map((note, idx) => (
              <div
                key={`note-skill-${idx}`}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                  {"</>"}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {note.split(".")[0]}
                  </h4>
                </div>
              </div>
            ))}
        </div>

        {/* 🔹 Course Content Section - appears after Skills */}
        <div className="mt-12 flex items-center justify-between">
  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
    Course Content
  </h2>
  <button
    onClick={() => setShowContent((prev) => !prev)}
    className="flex items-center gap-2 text-blue-700 font-semibold hover:underline cursor-pointer"
  >
    {showContent ? "Hide" : "Show"}
    {showContent ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>
</div>
       <AnimatePresence>
  {showContent && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12 bg-white rounded-2xl shadow-md p-6 border border-gray-200"
    >
      {/* <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Course Content
      </h3> */}

      {course.courseContent ? (
        <p className="text-gray-700 whitespace-pre-line">{course.courseContent}</p>
      ) : (
        <p className="text-gray-500">No course content available.</p>
      )}

      {/* Optional: show transcription if available
      {course.transcription && (
        <div className="mt-4 text-gray-700 text-sm">
          <strong>Transcription:</strong> {course.transcription}
        </div>
      )} */}
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </div>
  );
}
